/**
 * GateReady Ad Monetization Configuration
 * 
 * Site-wide configuration for non-intrusive display advertisements (e.g., Google AdSense).
 * Site owners can toggle ads site-wide or plug in publisher IDs when ready.
 */

export interface AdSlotConfig {
  slotId: string;
  format: 'banner' | 'inline' | 'footer';
  description: string;
}

export const ADS_CONFIG = {
  /**
   * Master switch to instantly enable or disable ads site-wide without code changes.
   * Set to `false` to turn off all ad slots across the entire application immediately.
   */
  enabled: true,

  /**
   * Ad network publisher account ID (e.g., 'ca-pub-XXXXXXXXXXXXXXXX').
   * Left blank for development / placeholder mode.
   */
  publisherId: '',

  /**
   * Whether to render visual placement frames when running in placeholder mode without network IDs.
   */
  showPlaceholderFrames: true,

  /**
   * Non-intrusive placement slots definition.
   * strictly excluded: trip editor, luggage weight meters, save-gate, pricing modal, account sync.
   */
  slots: {
    landingBelowFeeChecker: {
      slotId: 'ad-slot-landing-fee-checker',
      format: 'inline' as const,
      description: 'Placed below the standalone airline fee estimator on the guest landing page.'
    },
    landingFooterBanner: {
      slotId: 'ad-slot-landing-footer',
      format: 'footer' as const,
      description: 'Placed above the footer on guest informational views.'
    }
  }
};
