import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db, getOrCreateAccountReferralCode } from '../lib/firebase';
import { Bag, BagType } from '../types/travel';
import { checkLemonRedirectSuccess } from '../lib/lemonSqueezy';

export type SubscriptionTier = 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type PaidTier = 'SILVER' | 'GOLD' | 'PLATINUM';
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
  upgradeToTier: (tier: PaidTier, cycle: BillingCycle) => Promise<void>;
  upgradeToPro: (cycle: BillingCycle) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  applyLicenseKey: (key: string) => { success: boolean; message: string };
  removeLicenseKey: () => void;
  canAddTraveler: (currentCount: number) => { allowed: boolean; reason?: string };
  canAddTrip: (currentCount: number) => { allowed: boolean; reason?: string };
  canAddBag: (existingBags: Bag[], newBagType: BagType) => { allowed: boolean; reason?: string };
  canUseCloudSync: () => boolean;
  // 7-day Platinum trial explicit & expiring
  isTrialActive: boolean;
  isTrialExpired: boolean;
  trialDaysRemaining: number;
  trialHoursRemaining: number;
  trialTimeLeftText: string;
  isTrialExpiringSoon: boolean;
  hasDismissedTrialExpiredNotice: boolean;
  dismissTrialExpiredNotice: () => void;
  // Collaborative referral program
  referralCode: string;
  referralsCount: number;
  referralCreditsMonths: number;
  claimReferralBonus: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const SUBSCRIPTION_STORAGE_KEY = 'gateready_subscription_tier_v1';
const BILLING_STORAGE_KEY = 'gateready_subscription_cycle_v1';
const LICENSE_STORAGE_KEY = 'gateready_manual_license_key_v1';
const EXPIRY_STORAGE_KEY = 'gateready_subscription_expires_at_v1';
const TRIAL_STARTED_KEY = 'gateready_trial_started_at_v1';
const TRIAL_EXPIRES_KEY = 'gateready_trial_expires_at_v1';
const TRIAL_DISMISSED_KEY = 'gateready_trial_expired_dismissed_v1';
const REFERRAL_CODE_KEY = 'gateready_referral_code_v1';
const REFERRALS_COUNT_KEY = 'gateready_referrals_count_v1';
const REFERRAL_CREDITS_KEY = 'gateready_referral_credits_months_v1';

export const MAX_FREE_TRAVELERS = 1;
export const MAX_FREE_BAGS_TOTAL = 2;
export const MAX_FREE_ACTIVE_TRIPS = 1;

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // 7-day Platinum trial state
  const [trialExpiresAt] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(TRIAL_EXPIRES_KEY);
      if (saved) return saved;
      // Auto-start 7-day Platinum trial for new visitors
      const now = Date.now();
      const expires = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(TRIAL_STARTED_KEY, new Date(now).toISOString());
      localStorage.setItem(TRIAL_EXPIRES_KEY, expires);
      return expires;
    } catch {
      return null;
    }
  });

  const [hasDismissedTrialExpiredNotice, setHasDismissedTrialExpiredNotice] = useState<boolean>(() => {
    try {
      return localStorage.getItem(TRIAL_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const dismissTrialExpiredNotice = () => {
    setHasDismissedTrialExpiredNotice(true);
    try {
      localStorage.setItem(TRIAL_DISMISSED_KEY, 'true');
    } catch {}
  };

  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
        if (match?.isMaster) return 'PLATINUM';

        const savedExpiry = localStorage.getItem(EXPIRY_STORAGE_KEY);
        if (savedExpiry) {
          const expiryTime = new Date(savedExpiry).getTime();
          if (Number.isFinite(expiryTime) && expiryTime <= Date.now()) {
            return 'FREE';
          }
        }
        return 'PLATINUM';
      }

      const saved = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (saved === 'SILVER' || saved === 'GOLD' || saved === 'PLATINUM') {
        const savedExpiry = localStorage.getItem(EXPIRY_STORAGE_KEY);
        if (savedExpiry) {
          const expiryTime = new Date(savedExpiry).getTime();
          if (Number.isFinite(expiryTime) && expiryTime <= Date.now()) {
            return 'FREE';
          }
        }
        return saved;
      }
      if (saved === 'FREE') return 'FREE';

      // 7-day Platinum trial for new visitors
      const trialExpires = localStorage.getItem(TRIAL_EXPIRES_KEY);
      if (trialExpires) {
        const diff = new Date(trialExpires).getTime() - Date.now();
        if (diff > 0) return 'PLATINUM';
        return 'FREE';
      }
    } catch {
      // Ignore
    }
    return 'PLATINUM';
  });

  const trialDiffMs = trialExpiresAt ? Math.max(0, new Date(trialExpiresAt).getTime() - nowTick) : 0;
  const hasPaidLicense = Boolean(
    manualLicenseKey || 
    subscriptionExpiresAt || 
    tier === 'SILVER' || 
    tier === 'GOLD' || 
    (tier === 'PLATINUM' && isMasterKey)
  );
  const isTrialActive = !hasPaidLicense && tier === 'PLATINUM' && trialDiffMs > 0;
  const isTrialExpired = !hasPaidLicense && trialExpiresAt !== null && trialDiffMs <= 0;
  const trialDaysRemaining = Math.max(1, Math.ceil(trialDiffMs / (24 * 60 * 60 * 1000)));
  const trialHoursRemaining = Math.max(0, Math.floor(trialDiffMs / (60 * 60 * 1000)));
  const trialTimeLeftText = trialDiffMs > 86400000
    ? `${trialDaysRemaining} days left`
    : `${trialHoursRemaining}h ${Math.floor((trialDiffMs % 3600000) / 60000)}m left`;
  const isTrialExpiringSoon = isTrialActive && trialDiffMs <= 2 * 24 * 60 * 60 * 1000;

  // Referral program state (Feature 3: tied strictly to authenticated accounts)
  const [referralCode, setReferralCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(REFERRAL_CODE_KEY);
      return saved || '';
    } catch {
      return '';
    }
  });

  const [referralsCount, setReferralsCount] = useState<number>(0);
  const [referralCreditsMonths, setReferralCreditsMonths] = useState<number>(0);

  // Sync persistent referral code and stats from Firestore when signed in
  useEffect(() => {
    if (!user) {
      setReferralCode('');
      setReferralsCount(0);
      setReferralCreditsMonths(0);
      return;
    }

    let isMounted = true;

    // Ensure user has a persistent code registered
    getOrCreateAccountReferralCode(user.uid).then((res) => {
      if (isMounted && res.code) {
        setReferralCode(res.code);
        setReferralsCount(res.referralsCount);
        setReferralCreditsMonths(res.referralCreditsMonths);
        try {
          localStorage.setItem(REFERRAL_CODE_KEY, res.code);
        } catch {}
      }
    }).catch((e) => console.warn('Could not initialize referral code:', e));

    // Listen to real-time stats updates
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.referralCode) {
          setReferralCode(data.referralCode);
          try { localStorage.setItem(REFERRAL_CODE_KEY, data.referralCode); } catch {}
        }
        if (typeof data.referralsCount === 'number') {
          setReferralsCount(data.referralsCount);
        }
        if (typeof data.referralCreditsMonths === 'number') {
          setReferralCreditsMonths(data.referralCreditsMonths);
        }
      }
    }, (err) => console.warn('Referral snapshot listener warning:', err));

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user]);

  const claimReferralBonus = () => {
    setReferralsCount((prev) => prev + 1);
    setReferralCreditsMonths((prev) => prev + 1);

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      updateDoc(userRef, {
        referralsCount: increment(1),
        referralCreditsMonths: increment(1),
        updatedAt: new Date().toISOString()
      }).catch((e) => console.warn('Failed to update live referral credit:', e));
    }
  };

  // Automatically downgrade to FREE if 7-day trial expires
  useEffect(() => {
    if (isTrialExpired && tier === 'PLATINUM' && !hasPaidLicense) {
      setTier('FREE');
      try {
        localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'FREE');
      } catch {}
    }
  }, [isTrialExpired, tier, hasPaidLicense]);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>(() => {
    try {
      const saved = localStorage.getItem(BILLING_STORAGE_KEY);
      if (saved === 'yearly' || saved === 'monthly') return saved;
    } catch {
      // Ignore
    }
    return 'yearly';
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
          const rawTier = data.subscriptionTier;
          if (rawTier === 'SILVER' || rawTier === 'GOLD' || rawTier === 'PLATINUM' || rawTier === 'PRO') {
            const mappedTier: PaidTier = rawTier === 'SILVER' ? 'SILVER' : rawTier === 'GOLD' ? 'GOLD' : 'PLATINUM';
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
              setTier(mappedTier);
              setBillingCycle(data.subscriptionBillingCycle || 'yearly');
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
                localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, mappedTier);
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
      upgradeToTier(redirectInfo.tier, redirectInfo.cycle);
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

  const upgradeToTier = async (newTier: PaidTier, cycle: BillingCycle) => {
    const nextPeriod = new Date();
    if (cycle === 'yearly') {
      nextPeriod.setFullYear(nextPeriod.getFullYear() + 1);
    } else {
      nextPeriod.setMonth(nextPeriod.getMonth() + 1);
    }
    const expiryStr = nextPeriod.toISOString();

    setTier(newTier);
    setBillingCycle(cycle);
    setSubscriptionExpiresAt(expiryStr);
    closePaywall();

    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, newTier);
      localStorage.setItem(BILLING_STORAGE_KEY, cycle);
      localStorage.setItem(EXPIRY_STORAGE_KEY, expiryStr);
    } catch {
      // Ignore
    }

    // Persist to Firestore if signed in
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          subscriptionTier: newTier,
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

  const upgradeToPro = async (cycle: BillingCycle) => {
    await upgradeToTier('GOLD', cycle);
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
      setTier('PLATINUM');
      setSubscriptionExpiresAt(null);

      try {
        localStorage.setItem(LICENSE_STORAGE_KEY, validKey);
        localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PLATINUM');
        localStorage.removeItem(EXPIRY_STORAGE_KEY);
      } catch {
        // Ignore
      }

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        setDoc(
          userRef,
          {
            subscriptionTier: 'PLATINUM',
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
        message: 'Master license verified! Permanent Gate Ready Platinum unlocked with lifetime, non-expiring access.'
      };
    }

    // STANDARD LICENSE KEY: EXACTLY 1 MONTH OF ACCESS PER USE
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const expiryStr = expiryDate.toISOString();

    setManualLicenseKey(validKey);
    setTier('PLATINUM');
    setBillingCycle('monthly');
    setSubscriptionExpiresAt(expiryStr);

    try {
      localStorage.setItem(LICENSE_STORAGE_KEY, validKey);
      localStorage.setItem(EXPIRY_STORAGE_KEY, expiryStr);
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, 'PLATINUM');
      localStorage.setItem(BILLING_STORAGE_KEY, 'monthly');
    } catch {
      // Ignore
    }

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(
        userRef,
        {
          subscriptionTier: 'PLATINUM',
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
      message: `Pro license verified! 1 month of Gate Ready Platinum activated (valid until ${formattedExpiry}).`
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

  // Rule 1: Travelers limit
  // Free: 1 traveler
  // Silver: 1 traveler
  // Gold: 2 travelers
  // Platinum: Unlimited travelers
  const canAddTraveler = (currentCount: number) => {
    if (tier === 'PLATINUM' || isMasterKey) {
      return { allowed: true };
    }
    if (tier === 'GOLD') {
      if (currentCount >= 2) {
        return {
          allowed: false,
          reason: 'Gold plan includes up to 2 travelers. Upgrade to Platinum for unlimited travelers and family sharing.'
        };
      }
      return { allowed: true };
    }
    if (tier === 'SILVER') {
      if (currentCount >= 1) {
        return {
          allowed: false,
          reason: 'Silver plan includes 1 traveler. Upgrade to Gold (2 travelers) or Platinum (unlimited) to pack for companions.'
        };
      }
      return { allowed: true };
    }
    // Free plan
    if (currentCount >= MAX_FREE_TRAVELERS) {
      return {
        allowed: false,
        reason: 'Free plan allows only 1 traveler. Upgrade to Gold (2 travelers) or Platinum (unlimited) to pack for multiple family members or kids.'
      };
    }
    return { allowed: true };
  };

  // Rule 2: Active trips limit
  // Free: 1 active trip
  // Silver: 2 active trips
  // Gold: Unlimited
  // Platinum: Unlimited
  const canAddTrip = (currentCount: number) => {
    if (tier === 'PLATINUM' || tier === 'GOLD' || isMasterKey) {
      return { allowed: true };
    }
    if (tier === 'SILVER') {
      if (currentCount >= 2) {
        return {
          allowed: false,
          reason: 'Silver plan includes 2 active trips. Upgrade to Gold or Platinum for unlimited active trips.'
        };
      }
      return { allowed: true };
    }
    // Free plan
    if (currentCount >= MAX_FREE_ACTIVE_TRIPS) {
      return {
        allowed: false,
        reason: 'Free plan allows 1 active trip. Upgrade to Silver for 2 active trips, or Gold / Platinum for unlimited active trips.'
      };
    }
    return { allowed: true };
  };

  // Rule 3: Bags limit
  // Free: 2 bags total, 1 of each type
  // Silver, Gold, Platinum: Unlimited bags
  const canAddBag = (existingBags: Bag[], newBagType: BagType) => {
    if (tier === 'SILVER' || tier === 'GOLD' || tier === 'PLATINUM' || isMasterKey) {
      return { allowed: true };
    }

    if (existingBags.length >= MAX_FREE_BAGS_TOTAL) {
      return {
        allowed: false,
        reason: `Free Plan is limited to a maximum of 2 bags total. Upgrade to Silver ($1.99/mo), Gold, or Platinum to pack unlimited bags.`
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
        reason: `Free Plan allows only 1 ${bagLabel} per trip (up to 2 bags total). Upgrade to Silver, Gold, or Platinum to pack unlimited bags.`
      };
    }

    return { allowed: true };
  };

  // Rule 4: Multi-device cloud sync
  // Free, Silver: local only
  // Gold, Platinum: cloud sync
  const canUseCloudSync = () => {
    return tier === 'GOLD' || tier === 'PLATINUM' || isMasterKey;
  };

  const isPro = tier !== 'FREE';

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
        upgradeToTier,
        upgradeToPro,
        cancelSubscription,
        applyLicenseKey,
        removeLicenseKey,
        canAddTraveler,
        canAddTrip,
        canAddBag,
        canUseCloudSync,
        isTrialActive,
        isTrialExpired,
        trialDaysRemaining,
        trialHoursRemaining,
        trialTimeLeftText,
        isTrialExpiringSoon,
        hasDismissedTrialExpiredNotice,
        dismissTrialExpiredNotice,
        referralCode,
        referralsCount,
        referralCreditsMonths,
        claimReferralBonus
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
