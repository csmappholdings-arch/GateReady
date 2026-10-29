import React from 'react';
import { PageLayout } from './PageLayout';
import { Sparkles, CheckCircle2, ShieldAlert, Scale, Droplets, Tag, FileText } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  return (
    <PageLayout pathname="/changelog">
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          GateReady Product Updates & Changelog
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          We continuously refine GateReady to deliver accurate baggage limits, reliable tare calculations, and seamless packing workflows.
        </p>
      </section>

      {/* Release Oct 28, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
            October 28, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Multi-Modal Travel Integrity & Stability Release</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Trip Editor Multi-Modal Save Stability</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Resolved hook execution ordering in baggage fee calculation cards so editing a flight trip to Train, Bus, Cruise, or Car, or selecting no-limit carriers (e.g. Air Canada) saves cleanly, updates mode immediately, and preserves all bags and items without ErrorBoundary interruptions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Strict Mode Value Isolation</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When changing travel modes, airline names and aircraft models are never carried over into rail, bus, cruise, or car operator fields, and empty seat/cabin classes display "Not set" rather than defaulting to "Standard Main Cabin".
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Mode-Aware Allowance Headers</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Allowance section headers match the active mode exactly: "Rail Carry-On Allowance:" (Train), "Bus Luggage Allowance:" (Bus), "Cruise Baggage Allowance:" (Cruise), "Vehicle Cargo Allowance:" (Car), and "Airline Carry-On Allowance:" (Flight).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Residual Flight Terminology Clearance</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cleared residual flight wording on non-flight itineraries: countdown prompts use "track departure", transit hub descriptions omit airport-only references (e.g. Toronto Island YTZ), and TSA 3-1-1 liquids rule notices and item badges only appear on flight legs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No-Limit Carrier Bag Spec Editor</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              For carriers with no strict carry-on weight limit (e.g. Air Canada or vehicle cargo), the bag editor no longer pre-fills a misleading 22-lb limit and displays an "Ignored / No Limit" indicator.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Save-Gate Trigger Scope Confirmation</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Confirmed and verified the anonymous user save-gate trigger as strictly once-per-session (sessionStorage), ensuring guests are politely invited to save their packing list without repeated interruptions.
            </p>
          </div>
        </div>
      </section>

      {/* Release Oct 26, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
            October 26, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Accuracy & Interface Alignment Release</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Overweight Surcharges Warning Typography</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verified and corrected the spelling of "Surcharges" across all luggage overweight warning alerts, threshold banners, and checklist notices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Canonical Plan Limits & Pricing Alignment</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Aligned the /pricing page and documentation with the canonical in-app pricing dialog: Gold is designated as MOST POPULAR, Silver includes unlimited bags, and Gold includes unlimited active trips.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Displayed Weight Headroom Percentage Synchronization</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Weight headroom percentages across meters, banners, and readiness are now computed directly from the displayed rounded weight (e.g. 21.9 / 22 lbs shows 99.5%, and 22.5 / 22 lbs shows 102.3%).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Readiness Carrier-Specific Limit Enforcement</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Unified departure readiness with carrier policy logic: where the carrier states no weight limit (such as Air Canada carry-on), no weight-based overweight flags appear in readiness, meters, banners, or details.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Mobile Header Responsiveness (~390px Viewport)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Re-architected the header layout for mobile screens so logo, trial status, user profile, and settings buttons never crowd, clip, or overlap on narrow devices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>TSA 3-1-1 "Checker" Terminology Audit</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Standardized terminology throughout the entire application and documentation: the rule-based liquids audit is consistently referred to as the TSA 3-1-1 Liquids Checker.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Accurate Departure Time & Countdown Display</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When a traveler creates a trip with no departure time, GateReady displays date only or "time not set" rather than defaulting to an unentered 09:00 flight time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Hidden Ad Placeholders & Monetization Architecture</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ad placement slots render nothing visible until a live ad network ID is configured in settings. Paid plans (Silver, Gold, Platinum) remain 100% ad-free, with a master toggle to disable ads site-wide instantly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Multi-Open FAQ Accordion & Landing CTA Hierarchy</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The FAQ accordion now allows multiple items to remain open simultaneously. On the guest landing page, the "Create Your Trip (Free)" hero CTA is visually primary, with all secondary entry points styled with appropriate utility weight.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Bing Site Scan, Title Length & Semantic H1 Alignment</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Shortened the homepage title tag to 44 characters to prevent search display truncation and added a server-rendered H1 tag carrying the hero message, ensuring every route has exactly one H1 and displayable title length.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Realistic Marketing Copy Alignment</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Softened absolute guarantee phrasing to match the published airline estimates disclaimer, focusing on helping travelers avoid unexpected airport fees.
            </p>
          </div>
        </div>
      </section>

      {/* Release Oct 24, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
            October 24, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Compliance & Foundation Release</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Plan-Limit Notice Trip Scoping</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Free plan bag limit alerts are now strictly scoped to the trip that triggered them. Deleting a trip immediately dismisses all associated limit notices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Air Canada Carry-On Limit Synchronization</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Bag list cards now correctly show "No airline weight limit · Air Canada" matching the bag detail view.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Climate Forecast No-Date Guidance State</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Replaced unselected default month weather assumptions with informative placeholder guidance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Comprehensive Trust & Legal Center (12 Dedicated Pages)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Added fully indexable pages for About, Privacy, Terms, Contact, FAQ, Pricing, How It Works, Cookies, Refunds, Changelog, Security, and Reviews standby.
            </p>
          </div>
        </div>
      </section>

      {/* Release Earlier October 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
            Earlier October 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Core Limits & Allowance Update</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Free Plan Hard Bag Limits & Tare Deduction</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enforced Free tier constraints (1 traveler, 2 bags max, max 1 checked) during bag creation and luggage list generation. Introduced empty suitcase shell tare weight calibration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>Referral Program Transparency & 7-Day Platinum Trial</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Prominently labeled the "$4.99 value" of the friend referral program and added a clear 7-day Platinum trial indicator on the user account screen with exact trial expiration details.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
