import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Bag, BagType } from '../types/travel';
import { checkLemonRedirectSuccess } from '../lib/lemonSqueezy';

export type SubscriptionTier = 'FREE' | 'PRO';
export type BillingCycle = 'monthly' | 'yearly';

// Standard 10 hardcoded licenses providing exactly 1 month of access per use
export const HARDCODED_TEST_LICENSES = [
  'GR-Test-2026-1',
  'GR-Test-2026-2',
  'GR-Test-2026-3',
  'GR-Test-2026-4',
  'GR-Test-2026-5',
  'GR-Test-2026-6',
  'GR-Test-2026-7',
  'GR-Test-2026-8',
  'GR-Test-2026-9',
  'GR-Test-2026-10'
];

// Permanent Master License Keys that never expire (for owner use)
export const MASTER_LICENSE_KEYS = [
  'GR-MASTER-LIFETIME-ACCESS',
  'GR-MASTER-CSMAPPHOLDINGS-VIP',
  'GR-MASTER-2026-LIFETIME'
];

export function isMasterLicense(key: string): boolean {
  const norm = key.trim().toUpperCase().replace(/-/g, '');
  return MASTER_LICENSE_KEYS.some((k) => k.toUpperCase().replace(/-/g, '') === norm);
}

export function findMatchingLicense(key: string): { key: string; isMaster: boolean } | null {
  const norm = key.trim().toUpperCase().replace(/-/g, '');
  for (const master of MASTER_LICENSE_KEYS) {
    if (master.toUpperCase().replace(/-/g, '') === norm) {
      return { key: master, isMaster: true };
    }
  }
  for (const standard of HARDCODED_TEST_LICENSES) {
    if (standard.toUpperCase().replace(/-/g, '') === norm) {
      return { key: standard, isMaster: false };
    }
  }
  return null;
}

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isPro: boolean;
  billingCycle: BillingCycle;
  subscriptionExpiresAt: string | null;
  manualLicenseKey: string | null;
  isMasterKey: boolean;
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
const EXPIRY_STORAGE_KEY = 'gateready_subscription_expires_at_v1';

export const MAX_FREE_TRAVELERS = 1;
export const MAX_FREE_BAGS_TOTAL = 2;

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [manualLicenseKey, setManualLicenseKey] = useState<string | null>(() => {
    try {
      const savedKey = localStorage.getItem(LICENSE_STORAGE_KEY);
      if (!savedKey) return null;

      const match = findMatchingLicense(savedKey);
      if (!match) {
        localStorage.removeItem(LICENSE_STORAGE_KEY);
        return null;
      }

      if (match.isMaster) {
        return match.key;
      }

      // Check expiry for 1-month standard license
      const savedExpiry = localStorage.getItem(EXPIRY_STORAGE_KEY);
      if (savedExpiry) {
        const expiryTime = new Date(savedExpiry).getTime();
        if (Number.isFinite(expiryTime) && expiryTime <= Date.now()) {
          // Expired
          localStorage.removeItem(LICENSE_STORAGE_KEY);
          localStorage.removeItem(EXPIRY_STORAGE_KEY);
          localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'FREE');
          return null;
        }
      }
      return match.key;
    } catch {
      return null;
    }
  });

  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(() => {
    try {
      const savedKey = localStorage.getItem(LICENSE_STORAGE_KEY);
      if (savedKey) {
        const match = findMatchingLicense(savedKey);
        if (match?.isMaster) return null; // Master key never expires
      }
      return localStorage.getItem(EXPIRY_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const isMasterKey = manualLicenseKey ? isMasterLicense(manualLicenseKey) : false;

  const [tier, setTier] = useState<SubscriptionTier>(() => {
    try {
      const savedKey = localStorage.getItem(LICENSE_STORAGE_KEY);
      if (savedKey) {
        const match = findMatchingLicense(savedKey);
        if (match?.isMaster) return 'PRO';

        const savedExpiry = localStorage.getItem(EXPIRY_STORAGE_KEY);
        if (savedExpiry) {
          const expiryTime = new Date(savedExpiry).getTime();
          if (Number.isFinite(expiryTime) && expiryTime <= Date.now()) {
            return 'FREE';
          }
        }
        return 'PRO';
      }

      const saved = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (saved === 'PRO') {
        const savedExpiry = localStorage.getItem(EXPIRY_STORAGE_KEY);
        if (savedExpiry) {
          const expiryTime = new Date(savedExpiry).getTime();
          if (Number.isFinite(expiryTime) && expiryTime <= Date.now()) {
            return 'FREE';
          }
        }
        return 'PRO';
      }
      if (saved === 'FREE') return 'FREE';
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
    return 'monthly';
  });

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
            const isMaster = Boolean(
              data.isMasterKey || 
              (data.manualLicenseKey && isMasterLicense(data.manualLicenseKey))
            );
            const expiresAt = data.subscriptionExpiresAt;

            // Check if standard key expired
            if (expiresAt && !isMaster && new Date(expiresAt).getTime() <= Date.now()) {
              if (isMounted) {
                setTier('FREE');
                setManualLicenseKey(null);
                setSubscriptionExpiresAt(null);
                try {
                  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'FREE');
                  localStorage.removeItem(LICENSE_STORAGE_KEY);
                  localStorage.removeItem(EXPIRY_STORAGE_KEY);
                } catch {
                  // Ignore
                }
              }
            } else if (isMounted) {
              setTier('PRO');
              setBillingCycle(data.subscriptionBillingCycle || 'monthly');
              setSubscriptionExpiresAt(isMaster ? null : (expiresAt || null));
              if (data.manualLicenseKey) {
                setManualLicenseKey(data.manualLicenseKey);
                try {
                  localStorage.setItem(LICENSE_STORAGE_KEY, data.manualLicenseKey);
                } catch {
                  // Ignore
                }
              }
              if (expiresAt && !isMaster) {
                try {
                  localStorage.setItem(EXPIRY_STORAGE_KEY, expiresAt);
                } catch {
                  // Ignore
                }
              }
              try {
                localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PRO');
              } catch {
                // Ignore
              }
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

  // Periodic expiration enforcement for standard 1-month licenses
  useEffect(() => {
    if (!subscriptionExpiresAt || isMasterKey) return;

    const checkExpiration = () => {
      const expiryTime = new Date(subscriptionExpiresAt).getTime();
      if (Number.isFinite(expiryTime) && expiryTime <= Date.now()) {
        setTier('FREE');
        setManualLicenseKey(null);
        setSubscriptionExpiresAt(null);
        try {
          localStorage.removeItem(LICENSE_STORAGE_KEY);
          localStorage.removeItem(EXPIRY_STORAGE_KEY);
          localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'FREE');
        } catch {
          // Ignore
        }
      }
    };

    checkExpiration();
    const timer = setInterval(checkExpiration, 60000);
    return () => clearInterval(timer);
  }, [subscriptionExpiresAt, isMasterKey]);

  // Check for Lemon Squeezy checkout success upon page redirect
  useEffect(() => {
    const redirectInfo = checkLemonRedirectSuccess();
    if (redirectInfo?.isSuccess) {
      upgradeToPro(redirectInfo.cycle);
    }
  }, []);

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
    const nextPeriod = new Date();
    if (cycle === 'yearly') {
      nextPeriod.setFullYear(nextPeriod.getFullYear() + 1);
    } else {
      nextPeriod.setMonth(nextPeriod.getMonth() + 1);
    }
    const expiryStr = nextPeriod.toISOString();

    setTier('PRO');
    setBillingCycle(cycle);
    setSubscriptionExpiresAt(expiryStr);
    closePaywall();

    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PRO');
      localStorage.setItem(EXPIRY_STORAGE_KEY, expiryStr);
    } catch {
      // Ignore
    }

    // Persist to Firestore if signed in
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          subscriptionTier: 'PRO',
          subscriptionBillingCycle: cycle,
          isSubscribed: true,
          isMasterKey: false,
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
    setManualLicenseKey(null);

    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'FREE');
      localStorage.removeItem(LICENSE_STORAGE_KEY);
      localStorage.removeItem(EXPIRY_STORAGE_KEY);
    } catch {
      // Ignore
    }

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          subscriptionTier: 'FREE',
          isSubscribed: false,
          isMasterKey: false,
          manualLicenseKey: null,
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

    const match = findMatchingLicense(trimmed);

    if (!match) {
      return {
        success: false,
        message: 'Invalid license key. Please check your code and try again.'
      };
    }

    const validKey = match.key;

    // MASTER LICENSE KEY: NEVER EXPIRES
    if (match.isMaster) {
      setManualLicenseKey(validKey);
      setTier('PRO');
      setSubscriptionExpiresAt(null);

      try {
        localStorage.setItem(LICENSE_STORAGE_KEY, validKey);
        localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PRO');
        localStorage.removeItem(EXPIRY_STORAGE_KEY);
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
            isMasterKey: true,
            subscriptionExpiresAt: null,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ).catch((err) => {
          console.warn('Failed to save master license to cloud:', err);
        });
      }

      return {
        success: true,
        message: 'Master license verified! Permanent Gate Ready Pro unlocked with lifetime, non-expiring access.'
      };
    }

    // STANDARD LICENSE KEY: EXACTLY 1 MONTH OF ACCESS PER USE
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const expiryStr = expiryDate.toISOString();

    setManualLicenseKey(validKey);
    setTier('PRO');
    setBillingCycle('monthly');
    setSubscriptionExpiresAt(expiryStr);

    try {
      localStorage.setItem(LICENSE_STORAGE_KEY, validKey);
      localStorage.setItem(EXPIRY_STORAGE_KEY, expiryStr);
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PRO');
      localStorage.setItem(BILLING_STORAGE_KEY, 'monthly');
    } catch {
      // Ignore
    }

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(
        userRef,
        {
          subscriptionTier: 'PRO',
          subscriptionBillingCycle: 'monthly',
          manualLicenseKey: validKey,
          isSubscribed: true,
          isMasterKey: false,
          subscriptionExpiresAt: expiryStr,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      ).catch((err) => {
        console.warn('Failed to save manual license to cloud:', err);
      });
    }

    const formattedExpiry = expiryDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      success: true,
      message: `Pro license verified! 1 month of Gate Ready Pro activated (valid until ${formattedExpiry}).`
    };
  };

  const removeLicenseKey = () => {
    setManualLicenseKey(null);
    setTier('FREE');
    setSubscriptionExpiresAt(null);

    try {
      localStorage.removeItem(LICENSE_STORAGE_KEY);
      localStorage.removeItem(EXPIRY_STORAGE_KEY);
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
          isMasterKey: false,
          subscriptionExpiresAt: null,
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
        isMasterKey,
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
