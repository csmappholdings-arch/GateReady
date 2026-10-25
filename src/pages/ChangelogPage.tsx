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

      {/* Release Oct 24, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
            October 24, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Compliance & Polish Release</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Plan-Limit Notice Trip Scoping</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Free plan bag limit alerts are now strictly scoped to the trip that triggered them. Deleting a trip immediately dismisses all associated limit notices, preventing warning persistence on other trips or the guest landing page.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Air Canada Carry-On Limit Synchronization</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Resolved a display contradiction on Air Canada trips. The bag list card now correctly shows "No airline weight limit · Air Canada" matching the bag detail view, rather than displaying an erroneous generic 22-lb cap.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Overweight Surcharges Warning Typography</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Corrected the spelling of "Surcharges" across all baggage weight threshold alerts and proofread all notification banners.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Climate Forecast No-Date Guidance State</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Replaced unselected default month weather assumptions with an informative placeholder explaining that setting a trip departure date activates destination climate norms and near-term forecasts.
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
            October 2026
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

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>TSA 3-1-1 Rule Engine & 42-Airline Allowance Matrix</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Integrated automatic 3.4 oz bottle volume checking across carry-on bags and updated baggage allowance dimensions for 42+ global airlines.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
