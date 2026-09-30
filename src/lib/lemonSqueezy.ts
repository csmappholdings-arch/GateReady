import { BillingCycle } from '../context/SubscriptionContext';
import { User } from 'firebase/auth';

// Lemon Squeezy Variant IDs provided by the user
export const LEMON_MONTHLY_VARIANT_ID = '2185992';
export const LEMON_YEARLY_VARIANT_ID = '2186010';

// Store subdomain from user's Lemon Squeezy account: csmappholdings
export const DEFAULT_STORE_SLUG = 'csmappholdings';
export const LEMON_STORE_KEY = 'gateready_lemon_store_slug';
export const LEMON_MONTHLY_URL_KEY = 'gateready_lemon_monthly_url';
export const LEMON_YEARLY_URL_KEY = 'gateready_lemon_yearly_url';

// Direct checkout URL provided by user
export const DIRECT_CHECKOUT_URL = 'https://csmappholdings.lemonsqueezy.com/checkout/buy/89bfc2fa-082e-4a8f-b05b-0836cd1908d0';

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
  const variantId = cycle === 'yearly' ? LEMON_YEARLY_VARIANT_ID : LEMON_MONTHLY_VARIANT_ID;
  
  // Check if custom URL was saved
  let customUrl = typeof window !== 'undefined' 
    ? (cycle === 'yearly' ? localStorage.getItem(LEMON_YEARLY_URL_KEY) : localStorage.getItem(LEMON_MONTHLY_URL_KEY))
    : '';

  const storeSlug = getLemonStoreSlug() || DEFAULT_STORE_SLUG;
  let baseUrl = '';

  if (customUrl && customUrl.trim()) {
    baseUrl = customUrl.trim();
  } else if (variantId) {
    baseUrl = `https://${storeSlug}.lemonsqueezy.com/checkout/buy/${variantId}`;
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

  // Fallback: Open in new tab reliably
  try {
    const newWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      window.location.href = checkoutUrl;
    }
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
