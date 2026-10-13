import { BillingCycle, PaidTier } from '../context/SubscriptionContext';
import { User } from 'firebase/auth';

// Store subdomain from user's Lemon Squeezy account: csmappholdings
export const DEFAULT_STORE_SLUG = 'csmappholdings';
export const LEMON_STORE_KEY = 'gateready_lemon_store_slug';

// Lemon Squeezy 6 Variant Buy URLs:
// SILVER — $1.99/mo or $19.99/yr
// GOLD — $3.99/mo or $29.99/yr (MOST POPULAR)
// PLATINUM — $4.99/mo or $39.99/yr
export const TIER_CHECKOUT_SLUGS: Record<PaidTier, { monthly: string; yearly: string }> = {
  SILVER: {
    monthly: 'ced3b062-e600-470d-a4aa-7c59dfdbd798',
    yearly: 'ced3b062-e600-470d-a4aa-7c59dfdbd798'
  },
  GOLD: {
    monthly: '319af1da-b267-4650-a2cc-8b551227d6b6',
    yearly: '319af1da-b267-4650-a2cc-8b551227d6b6'
  },
  PLATINUM: {
    monthly: '89bfc2fa-082e-4a8f-b05b-0836cd1908d0',
    yearly: '89bfc2fa-082e-4a8f-b05b-0836cd1908d0'
  }
};

// Map slug back to tier
export function mapSlugToTier(slugOrUrl: string): PaidTier {
  if (slugOrUrl.includes('ced3b062-e600-470d-a4aa-7c59dfdbd798')) return 'SILVER';
  if (slugOrUrl.includes('319af1da-b267-4650-a2cc-8b551227d6b6')) return 'GOLD';
  if (slugOrUrl.includes('89bfc2fa-082e-4a8f-b05b-0836cd1908d0')) return 'PLATINUM';
  return 'GOLD';
}

// Backward-compatibility legacy slugs
export const LEMON_MONTHLY_SLUG = TIER_CHECKOUT_SLUGS.PLATINUM.monthly;
export const LEMON_YEARLY_SLUG = TIER_CHECKOUT_SLUGS.PLATINUM.yearly;

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Setup: (config: {
        eventHandler?: (event: { event: string; data?: any }) => void;
      }) => void;
      Url?: {
        Open: (url: string) => void;
        Close: () => void;
      };
      Refresh?: () => void;
    };
  }
}

export function getLemonStoreSlug(): string {
  if (typeof window === 'undefined') return DEFAULT_STORE_SLUG;
  return localStorage.getItem(LEMON_STORE_KEY) || DEFAULT_STORE_SLUG;
}

export function setLemonStoreSlug(slug: string): void {
  if (typeof window === 'undefined') return;
  const clean = slug.trim().replace(/^https?:\/\//, '').replace(/\.lemonsqueezy\.com.*$/, '').replace(/[^a-zA-Z0-9_-]/g, '');
  localStorage.setItem(LEMON_STORE_KEY, clean || DEFAULT_STORE_SLUG);
}

/**
 * Builds the Lemon Squeezy overlay checkout URL for a specific tier and cycle.
 * Supports overloaded arguments for backwards compatibility.
 */
export function buildLemonCheckoutUrl(
  tierOrCycle: PaidTier | BillingCycle,
  cycleOrUser?: BillingCycle | User | null,
  userParam?: User | null
): string {
  let tier: PaidTier = 'GOLD';
  let cycle: BillingCycle = 'yearly';
  let user: User | null = null;

  if (tierOrCycle === 'SILVER' || tierOrCycle === 'GOLD' || tierOrCycle === 'PLATINUM') {
    tier = tierOrCycle;
    cycle = (cycleOrUser as BillingCycle) || 'yearly';
    user = userParam || null;
  } else {
    // Legacy call: buildLemonCheckoutUrl(cycle, user)
    cycle = tierOrCycle as BillingCycle;
    user = (cycleOrUser as User) || null;
    tier = 'GOLD';
  }

  const slug = TIER_CHECKOUT_SLUGS[tier]?.[cycle] || TIER_CHECKOUT_SLUGS.GOLD[cycle];
  const storeSlug = getLemonStoreSlug() || DEFAULT_STORE_SLUG;
  const baseUrl = `https://${storeSlug}.lemonsqueezy.com/checkout/buy/${slug}`;

  try {
    const urlObj = new URL(baseUrl);
    urlObj.searchParams.set('embed', '1');
    urlObj.searchParams.set('media', '0');
    urlObj.searchParams.set('logo', '1');

    if (typeof window !== 'undefined') {
      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set('lemon_status', 'success');
      returnUrl.searchParams.set('tier', tier);
      returnUrl.searchParams.set('cycle', cycle);
      urlObj.searchParams.set('checkout[custom][return_url]', returnUrl.toString());
      urlObj.searchParams.set('checkout[custom][tier]', tier);
      urlObj.searchParams.set('checkout[custom][cycle]', cycle);
    }

    if (user) {
      if (user.uid) {
        urlObj.searchParams.set('checkout[custom][user_id]', user.uid);
      }
      if (user.email) {
        urlObj.searchParams.set('checkout[email]', user.email);
      }
      if (user.displayName) {
        urlObj.searchParams.set('checkout[name]', user.displayName);
      }
    }

    return urlObj.toString();
  } catch {
    return baseUrl;
  }
}

export function openLemonCheckout({
  tier = 'GOLD',
  cycle,
  user,
  onSuccess,
  onClose
}: {
  tier?: PaidTier;
  cycle: BillingCycle;
  user: User | null;
  onSuccess: (tier: PaidTier, cycle: BillingCycle) => void;
  onClose?: () => void;
}): void {
  const checkoutUrl = buildLemonCheckoutUrl(tier, cycle, user);

  // Initialize Lemon.js overlay if available
  if (typeof window !== 'undefined' && window.LemonSqueezy) {
    try {
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event.event === 'Checkout.Success') {
            const purchasedTier = event.data?.custom?.tier || tier;
            const purchasedCycle = event.data?.custom?.cycle || cycle;
            onSuccess(purchasedTier, purchasedCycle);
          } else if (event.event === 'Checkout.Closed') {
            if (onClose) onClose();
          }
        }
      });

      if (window.LemonSqueezy.Url?.Open) {
        window.LemonSqueezy.Url.Open(checkoutUrl);
        return;
      }
    } catch (err) {
      console.warn('Lemon overlay trigger failed, falling back to window.open:', err);
    }
  }

  // Fallback: Trigger anchor navigation
  try {
    const link = document.createElement('a');
    link.href = checkoutUrl;
    link.className = 'lemonsqueezy-button';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    window.location.href = checkoutUrl;
  }
}

export function checkLemonRedirectSuccess(): { isSuccess: boolean; tier: PaidTier; cycle: BillingCycle } | null {
  if (typeof window === 'undefined') return null;

  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get('lemon_status');
  const tierParam = searchParams.get('tier') as PaidTier | null;
  const cycleParam = searchParams.get('cycle') as BillingCycle | null;

  if (status === 'success') {
    // Clean up query parameters without reloading
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    const validTier: PaidTier = (tierParam === 'SILVER' || tierParam === 'GOLD' || tierParam === 'PLATINUM')
      ? tierParam
      : 'GOLD';

    return {
      isSuccess: true,
      tier: validTier,
      cycle: cycleParam === 'yearly' ? 'yearly' : 'monthly'
    };
  }

  return null;
}
