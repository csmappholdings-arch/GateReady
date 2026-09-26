import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Bag, BagType } from '../types/travel';

export type SubscriptionTier = 'FREE' | 'PRO';
export type BillingCycle = 'monthly' | 'yearly';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isPro: boolean;
  billingCycle: BillingCycle;
  subscriptionExpiresAt: string | null;
  isPaywallOpen: boolean;
  paywallReason: string | null;
  openPaywall: (reason?: string) => void;
  closePaywall: () => void;
  upgradeToPro: (cycle: BillingCycle) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  canAddTraveler: (currentCount: number) => { allowed: boolean; reason?: string };
  canAddBag: (existingBags: Bag[], newBagType: BagType) => { allowed: boolean; reason?: string };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const SUBSCRIPTION_STORAGE_KEY = 'gateready_subscription_tier_v1';
const BILLING_STORAGE_KEY = 'gateready_subscription_cycle_v1';

export const MAX_FREE_TRAVELERS = 1;
export const MAX_FREE_BAGS_TOTAL = 3;

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [tier, setTier] = useState<SubscriptionTier>(() => {
    try {
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

  // Rule 2: Free plan limits first user to only 1 of each bag type (Personal, Carry-On, Checked) and max 3 bags total.
  // Adding more than 3 bags or a duplicate bag type requires PRO subscription.
  const canAddBag = (existingBags: Bag[], newBagType: BagType) => {
    if (tier === 'PRO') {
      return { allowed: true };
    }

    if (existingBags.length >= MAX_FREE_BAGS_TOTAL) {
      return {
        allowed: false,
        reason: `Free Plan is limited to a maximum of 3 bags total. Upgrade to Gate Ready Pro to pack 4 or more bags.`
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
        reason: `Free Plan only allows 1 ${bagLabel} per trip. Adding multiple bags of the same type requires a Pro subscription.`
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
        isPaywallOpen,
        paywallReason,
        openPaywall,
        closePaywall,
        upgradeToPro,
        cancelSubscription,
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
