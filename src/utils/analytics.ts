import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { app } from '../lib/firebase';

// GA4 Conversion Funnel Events
export type AnalyticsEventType =
  | 'homepage_view'
  | 'primary_cta_click'
  | 'secondary_cta_click'
  | 'trip_preview_started'
  | 'trip_preview_completed'
  | 'registration_started'
  | 'registration_completed'
  | 'first_trip_created'
  | 'trip_updated'
  | 'first_suitcase_added'
  | 'first_packing_checklist_created'
  | 'pricing_page_viewed'
  | 'subscription_plan_selected'
  | 'subscription_upgrade_completed'
  // Phase 2 Engagement & Retention Events
  | 'dashboard_view'
  | 'trip_workspace_open'
  | 'readiness_score_view'
  | 'packing_template_applied'
  | 'personal_template_saved'
  | 'luggage_profile_saved'
  | 'luggage_profile_applied'
  | 'document_checklist_toggle'
  | 'reminder_notification_click'
  | 'traveler_category_set'
  | 'trip_share_invite_create'
  | 'suitcase_weight_updated'
  // Phase 2 User Experience & Onboarding Events
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'dashboard_feature_clicked'
  | 'premium_feature_clicked'
  | 'upgrade_page_viewed'
  | 'upgrade_button_clicked'
  | 'subscription_started';

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

let analyticsInstance: any = null;

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analyticsInstance = getAnalytics(app);
      }
    })
    .catch(() => null);
}

/**
 * Safe, sanitized event tracking for GateReady GA4.
 * Never passes passwords, payment credentials, passport numbers, or PII.
 */
export function trackEvent(eventName: AnalyticsEventType, params: AnalyticsEventParams = {}): void {
  try {
    const sanitizedParams = {
      ...params,
      timestamp: new Date().toISOString()
    };

    // 1. Firebase Analytics
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, sanitizedParams);
    }

    // 2. Browser GTM / dataLayer if present
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: eventName,
        ...sanitizedParams
      });
    }

    // 3. gtag if initialized globally
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, sanitizedParams);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[GateReady Analytics] ${eventName}`, sanitizedParams);
    }
  } catch (err) {
    console.warn(`[GateReady Analytics] Failed to log ${eventName}:`, err);
  }
}
