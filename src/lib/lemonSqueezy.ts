import { BillingCycle } from '../context/SubscriptionContext';
import { User } from 'firebase/auth';

// Lemon Squeezy Checkout Slugs for csmappholdings store:
// Monthly sub ($4.99): 89bfc2fa-082e-4a8f-b05b-0836cd1908d0
// Yearly sub ($39.99):  883b4d49-1b9e-4a84-a53a-8c3eeb2738b0
export const LEMON_MONTHLY_SLUG = '89bfc2fa-082e-4a8f-b05b-0836cd1908d0';
export const LEMON_YEARLY_SLUG = '883b4d49-1b9e-4a84-a53a-8c3eeb2738b0';

// Numeric variant IDs (for internal/webhook references)
export const LEMON_MONTHLY_VARIANT_ID = '2185992';
export const LEMON_YEARLY_VARIANT_ID = '2186010';

// Store subdomain from user's Lemon Squeezy account: csmappholdings
export const DEFAULT_STORE_SLUG = 'csmappholdings';
export const LEMON_STORE_KEY = 'gateready_lemon_store_slug';
export const LEMON_MONTHLY_URL_KEY = 'gateready_lemon_monthly_url';
export const LEMON_YEARLY_URL_KEY = 'gateready_lemon_yearly_url';

// Direct checkout URL provided by user
export const DIRECT_CHECKOUT_URL = `https://${DEFAULT_STORE_SLUG}.lemonsqueezy.com/checkout/buy/${LEMON_MONTHLY_SLUG}`;

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

export function buildLemonCheckoutUrl(cycle: BillingCycle, user: User | null): string {
  const checkoutSlug = cycle === 'yearly' ? LEMON_YEARLY_SLUG : LEMON_MONTHLY_SLUG;
  
  // Check if custom URL was saved
  let customUrl = typeof window !== 'undefined' 
    ? (cycle === 'yearly' ? localStorage.getItem(LEMON_YEARLY_URL_KEY) : localStorage.getItem(LEMON_MONTHLY_URL_KEY))
    : '';

  // Clean out stale/broken test URLs that contained the raw integer IDs
  if (customUrl && (customUrl.includes('2186010') || customUrl.includes('2185992'))) {
    customUrl = '';
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(cycle === 'yearly' ? LEMON_YEARLY_URL_KEY : LEMON_MONTHLY_URL_KEY);
      }
    } catch {
      // Ignore
    }
  }

  const storeSlug = getLemonStoreSlug() || DEFAULT_STORE_SLUG;
  let baseUrl = '';

  if (customUrl && customUrl.trim()) {
    baseUrl = customUrl.trim();
  } else if (checkoutSlug) {
    baseUrl = `https://${storeSlug}.lemonsqueezy.com/checkout/buy/${checkoutSlug}`;
  } else {
    baseUrl = DIRECT_CHECKOUT_URL;
  }

  // Parse existing URL to append custom parameters
  try {
    const urlObj = new URL(baseUrl);
    urlObj.searchParams.set('embed', '1');
    urlObj.searchParams.set('media', '0');
    urlObj.searchParams.set('logo', '1');

    if (typeof window !== 'undefined') {
      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set('lemon_status', 'success');
      returnUrl.searchParams.set('cycle', cycle);
      urlObj.searchParams.set('checkout[custom][return_url]', returnUrl.toString());
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
  cycle,
  user,
  onSuccess,
  onClose
}: {
  cycle: BillingCycle;
  user: User | null;
  onSuccess: () => void;
  onClose?: () => void;
}): void {
  const checkoutUrl = buildLemonCheckoutUrl(cycle, user);

  // Initialize Lemon.js overlay if available
  if (typeof window !== 'undefined' && window.LemonSqueezy) {
    try {
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event.event === 'Checkout.Success') {
            onSuccess();
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
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    window.location.href = checkoutUrl;
  }
}

export function checkLemonRedirectSuccess(): { isSuccess: boolean; cycle: BillingCycle } | null {
  if (typeof window === 'undefined') return null;
  
  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get('lemon_status');
  const cycleParam = searchParams.get('cycle');

  if (status === 'success') {
    // Clean up query parameters without reloading
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    return {
      isSuccess: true,
      cycle: cycleParam === 'monthly' ? 'monthly' : 'yearly'
    };
  }

  return null;
}
