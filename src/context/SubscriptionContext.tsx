import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Bag, BagType } from '../types/travel';

export type SubscriptionTier = 'FREE' | 'PRO';
export type BillingCycle = 'monthly' | 'yearly';

export const HARDCODED_TEST_LICENSES = [
  'GR-Test-2026-1',
  'GR-Test-2026-2',
  'GR-Test-2026-3',
  'GR-Test-2026-4',
  'GR-Test-2026-5'
];

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isPro: boolean;
  billingCycle: BillingCycle;
  subscriptionExpiresAt: string | null;
  manualLicenseKey: string | null;
  isPaywallOpen: boolean;
  paywallReason: string | null;
  openPaywall: (reason?: string) => void;
  closePaywall: () => void;
  upgradeToPro: (cycle: BillingCycle) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  applyLicenseKey: (key: string) => { success: boolean; message: string };
  removeLicenseKey: () => void;
  canAddTraveler: (currentCount: number) => { allowed: boolean; reason?: string };
  canAddBag: (existingBags: Bag[], newBagType: BagType) => { allowed: boolean; reason?: string };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const SUBSCRIPTION_STORAGE_KEY = 'gateready_subscription_tier_v1';
const BILLING_STORAGE_KEY = 'gateready_subscription_cycle_v1';
const LICENSE_STORAGE_KEY = 'gateready_manual_license_key_v1';

export const MAX_FREE_TRAVELERS = 1;
export const MAX_FREE_BAGS_TOTAL = 2;

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [manualLicenseKey, setManualLicenseKey] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LICENSE_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [tier, setTier] = useState<SubscriptionTier>(() => {
    try {
      const savedLicense = localStorage.getItem(LICENSE_STORAGE_KEY);
      if (savedLicense) return 'PRO';
      const saved = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (saved === 'PRO' || saved === 'FREE') return saved;
    } catch {
      // Ignore
    }
    return 'FREE';
  });

  const [billingCycle, setBillingCycle] = useState<BillingCycle>(() => {
    try {
      const saved = localStorage.getItem(BILLING_STORAGE_KEY);
      if (saved === 'yearly' || saved === 'monthly') return saved;
    } catch {
      // Ignore
    }
    return 'yearly';
  });

  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  // Sync subscription from Firestore when user signs in
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const fetchUserSubscription = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.subscriptionTier === 'PRO') {
            if (isMounted) {
              setTier('PRO');
              setBillingCycle(data.subscriptionBillingCycle || 'yearly');
              setSubscriptionExpiresAt(data.subscriptionExpiresAt || null);
              localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PRO');
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching subscription state from cloud:', err);
      }
    };

    fetchUserSubscription();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, tier);
      localStorage.setItem(BILLING_STORAGE_KEY, billingCycle);
    } catch {
      // Ignore
    }
  }, [tier, billingCycle]);

  const openPaywall = (reason?: string) => {
    setPaywallReason(reason || null);
    setIsPaywallOpen(true);
  };

  const closePaywall = () => {
    setIsPaywallOpen(false);
    setPaywallReason(null);
  };

  const upgradeToPro = async (cycle: BillingCycle) => {
    const nextYear = new Date();
    if (cycle === 'yearly') {
      nextYear.setFullYear(nextYear.getFullYear() + 1);
    } else {
      nextYear.setMonth(nextYear.getMonth() + 1);
    }
    const expiryStr = nextYear.toISOString();

    setTier('PRO');
    setBillingCycle(cycle);
    setSubscriptionExpiresAt(expiryStr);
    closePaywall();

    // Persist to Firestore if signed in
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          subscriptionTier: 'PRO',
          subscriptionBillingCycle: cycle,
          isSubscribed: true,
          subscriptionExpiresAt: expiryStr,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to sync subscription to Firestore:', err);
      }
    }
  };

  const cancelSubscription = async () => {
    setTier('FREE');
    setSubscriptionExpiresAt(null);

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          subscriptionTier: 'FREE',
          isSubscribed: false,
          subscriptionExpiresAt: null,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to update canceled subscription in cloud:', err);
      }
    }
  };

  const applyLicenseKey = (rawKey: string): { success: boolean; message: string } => {
    const trimmed = rawKey.trim();
    if (!trimmed) {
      return { success: false, message: 'Please enter a license key.' };
    }

    // Normalization: test against the 5 test license keys (e.g. GR-Test-2026-1 through GR-Test-2026-5)
    const upper = trimmed.toUpperCase();
    const validKey = HARDCODED_TEST_LICENSES.find(
      (k) =>
        k.toUpperCase() === upper ||
        k.replace(/-/g, '').toUpperCase() === upper.replace(/-/g, '')
    );

    if (!validKey) {
      return {
        success: false,
        message: 'Invalid license key. Testing licenses follow: GR-Test-2026-1 to GR-Test-2026-5.'
      };
    }

    setManualLicenseKey(validKey);
    setTier('PRO');
    try {
      localStorage.setItem(LICENSE_STORAGE_KEY, validKey);
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PRO');
    } catch {
      // Ignore
    }

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(
        userRef,
        {
          subscriptionTier: 'PRO',
          manualLicenseKey: validKey,
          isSubscribed: true,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      ).catch((err) => {
        console.warn('Failed to save manual license to cloud:', err);
      });
    }

    return {
      success: true,
      message: `Pro license verified! Gate Ready Pro unlocked with key ${validKey}.`
    };
  };

  const removeLicenseKey = () => {
    setManualLicenseKey(null);
    setTier('FREE');
    try {
      localStorage.removeItem(LICENSE_STORAGE_KEY);
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'FREE');
    } catch {
      // Ignore
    }

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(
        userRef,
        {
          subscriptionTier: 'FREE',
          manualLicenseKey: null,
          isSubscribed: false,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      ).catch((err) => {
        console.warn('Failed to clear license key in cloud:', err);
      });
    }
  };

  // Rule 1: Free plan allows only 1 free traveler. More travelers require PRO.
  const canAddTraveler = (currentCount: number) => {
    if (tier === 'PRO') {
      return { allowed: true };
    }
    if (currentCount >= MAX_FREE_TRAVELERS) {
      return {
        allowed: false,
        reason: `The Free Plan allows only 1 traveler. Upgrade to Gate Ready Pro to pack for multiple family members, kids, or group travelers.`
      };
    }
    return { allowed: true };
  };

  // Rule 2: Free plan limits user to max 2 bags total and 1 of each bag type.
  // Adding more than 2 bags or a duplicate bag type requires PRO subscription.
  const canAddBag = (existingBags: Bag[], newBagType: BagType) => {
    if (tier === 'PRO') {
      return { allowed: true };
    }

    if (existingBags.length >= MAX_FREE_BAGS_TOTAL) {
      return {
        allowed: false,
        reason: `Free Plan is limited to a maximum of 2 bags total. Upgrade to Gate Ready Pro to pack 3 or more bags.`
      };
    }

    const hasSameType = existingBags.some((b) => b.type === newBagType);
    if (hasSameType) {
      const bagLabel = newBagType === 'PERSONAL' 
        ? 'Personal Item' 
        : newBagType === 'CARRY_ON' 
          ? 'Carry-On' 
          : 'Checked Bag';
      return {
        allowed: false,
        reason: `Free Plan allows only 1 ${bagLabel} per trip (up to 2 bags total). Adding multiple bags requires a Pro subscription.`
      };
    }

    return { allowed: true };
  };

  const isPro = tier === 'PRO';

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isPro,
        billingCycle,
        subscriptionExpiresAt,
        manualLicenseKey,
        isPaywallOpen,
        paywallReason,
        openPaywall,
        closePaywall,
        upgradeToPro,
        cancelSubscription,
        applyLicenseKey,
        removeLicenseKey,
        canAddTraveler,
        canAddBag
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
