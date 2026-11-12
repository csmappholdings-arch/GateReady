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

      {/* Release Nov 11, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white font-mono text-xs font-bold shadow-xs">
            November 11, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Pricing Route Reliability &amp; Auth Context Resolution</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dedicated /pricing Route Reliability Fix</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Resolved a client-side error boundary failure when navigating to or loading /pricing directly. Provided resilient authentication context resolution with safe fallbacks across guest and authenticated sessions, ensuring all four subscription tiers, the full feature comparison table, and Lemon Squeezy checkout load instantly without runtime exceptions.
            </p>
          </div>
        </div>
      </section>

      {/* Release Nov 2, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white font-mono text-xs font-bold shadow-xs">
            November 2, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Rebalance Bags Luggage Optimizer, Server-Side Account Deletion, Fare-Family Single Source of Truth & Settings Reachability</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Rebalance Bags Luggage Optimizer (Silver+)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Launched the Rebalance Bags Luggage Optimizer for Silver+ travelers. When any suitcase exceeds weight limits or approaches capacity, Rebalance evaluates your luggage manifest and suggests safe item transfers to lighter bags. Built strictly suggest-first with 1-click apply and complete undo. Rigidly enforces airline safety guardrails (never moving keys, passports, medications, or lithium power banks into checked bags) and displays an honest notice when no safe move exists.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Permanent Server-Side Account Deletion & Local Data Purge</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enforced strict server-side completion of account deletion: the Cloud Firestore user profile, all synced trip records, and the Firebase Authentication user record are all permanently deleted before sign-out is reported. Local device trip state is completely purged at deletion time, preventing any resurrected trips on future visits or subsequent logins.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Fare-Family Single Source of Truth & Zero-Race Persistence</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Eliminated cloud-sync race conditions when changing fare families (Standard, Comfort/Latitude, Business). Trip banner writes through with server confirmation before the UI treats changes as saved, and re-reads the fresh saved fare whenever switching trips or opening the New Trip dialog.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Settings Modal Layout & Delete Account Button Visibility</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Fixed vertical viewport constraints in Settings & Preferences dropdown (`max-h-[85vh]` with smooth scrolling and sticky title), ensuring "Delete Account & Erase Cloud Data" is immediately visible and clickable by mouse/touch on any screen size.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Luggage Weight Math Unification</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Unified weight calculation math across Rebalance simulation and post-apply luggage state into a single formula (`calculateBagTotalWeightLbs` with consistent 1-decimal rounding), eliminating 0.1 lb prediction discrepancies.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>USD Currency Split Across Airline Guides</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Separated 1st-bag and 2nd-bag USD conversion notes onto their own table rows across Air Canada and WestJet guides in both SPA and server-rendered HTML.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Unified Support Channel & Streamlined Navigation</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Consolidated all customer communications into our single official Contact Support channel (csmappholdings@gmail.com) and organized site-wide navigation into compact, mobile-responsive footer columns.
            </p>
          </div>
        </div>
      </section>

      {/* Release Nov 1, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
            November 1, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Complete Plan Zero-Flash, Privacy Policy §5 In-App Deletion Synchronization & Multi-Modal Refinements</span>
        </div>

        <div className="space-y-3">

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Complete Plan Pill & Tier Badge Zero-Flash (Reload & New Tab)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Eliminated post-reload and new-tab plan pill flashes for authenticated users: trial expiration timestamps and active subscription tier states are held synchronously from cache, ensuring the header immediately renders "Platinum trial" and "PLATINUM Active" (or paid/free tiers) without ever flashing "Free Plan", "Upgrade PLANS", blank pills, or pulse loading skeletons.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cruise Stateroom Storage Copy Cleanup</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Updated cruise carry-on dimensional guidance to use verified cruise-appropriate wording ("Terminal security clearance sizer · must fit through terminal screening sizer and stow in stateroom"), completely eliminating bus/coach terminology on cruise itineraries.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Privacy Policy §5 In-App Deletion Synchronization</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Updated Privacy Policy §5 (User Rights & Data Deletion) to document the in-app "Delete Account & Erase Cloud Data" control as the primary instant deletion mechanism, with email support as the fallback route.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Airline Currency Formatting & USD Equivalence Clarity</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Removed duplicate currency codes across airline guides and search index cards (rendering clean figures like "CAD $35"). Explicitly labelled all USD approximation figures across Canadian and European carrier guides with the exact bag tier they represent ("(1st bag) / (2nd bag)").
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dismissible Email Verification Banner & Trip Header Placeholders</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Made email verification banners dismissible with persistence and prevented nagging active trial accounts. Removed raw "Not set" labels on optional trip banner fields in favor of clean, neutral prompts.
            </p>
          </div>
        </div>
      </section>

      {/* Release Oct 31, 2026 */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
            October 31, 2026
          </span>
          <span className="text-xs text-slate-500 font-medium">Head-Tag Verification, Search Architecture & Multi-Modal Mode Integrity Audit</span>
        </div>

        <div className="space-y-3">
          {/* Head-Tag & Meta Verification Report */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-3">
            <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Head-Tag & Meta Verification Report (6 Sampled Core Routes)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Verified live server responses for canonical tag hrefs, unique meta descriptions, and absolute og:image/twitter:image URLs across 6 sampled routes:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-purple-200 dark:border-purple-900/60 rounded-xl overflow-hidden">
                <thead className="bg-purple-100/70 dark:bg-purple-900/50 text-purple-950 dark:text-purple-200 font-bold">
                  <tr>
                    <th className="p-2 border-b border-purple-200 dark:border-purple-900">Route</th>
                    <th className="p-2 border-b border-purple-200 dark:border-purple-900">Canonical Tag (HREF)</th>
                    <th className="p-2 border-b border-purple-200 dark:border-purple-900">Meta Description</th>
                    <th className="p-2 border-b border-purple-200 dark:border-purple-900">og:image & twitter:image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 dark:divide-purple-950/50 text-[11px] text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-purple-50/40">
                    <td className="p-2 font-mono font-bold text-purple-700 dark:text-purple-300">/ (Homepage)</td>
                    <td className="p-2 font-mono">https://gateready.ca/</td>
                    <td className="p-2">Calculate baggage fees, tare luggage weight, check TSA 3-1-1 rules, and reference baggage policies for 42+ airlines with GateReady.</td>
                    <td className="p-2 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">https://gateready.ca/thumbnail.jpg (Absolute URL)</td>
                  </tr>
                  <tr className="hover:bg-purple-50/40">
                    <td className="p-2 font-mono font-bold text-purple-700 dark:text-purple-300">/airlines/westjet-baggage</td>
                    <td className="p-2 font-mono">https://gateready.ca/airlines/westjet-baggage</td>
                    <td className="p-2">Verified WestJet baggage rules: carry-on dimensions (21 x 15 x 9 in), no maximum carry-on weight limit (must lift unassisted), checked fees ($35 CAD 1st, $50 CAD 2nd).</td>
                    <td className="p-2 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">https://gateready.ca/thumbnail.jpg (Absolute URL)</td>
                  </tr>
                  <tr className="hover:bg-purple-50/40">
                    <td className="p-2 font-mono font-bold text-purple-700 dark:text-purple-300">/airlines/porter-airlines-baggage</td>
                    <td className="p-2 font-mono">https://gateready.ca/airlines/porter-airlines-baggage</td>
                    <td className="p-2">Porter Airlines baggage rules: carry-on size (21.5 x 15.5 x 9 in, max 20 lbs / 9 kg), personal item allowances, PorterClassic Basic vs Standard carry-on, and checked fees.</td>
                    <td className="p-2 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">https://gateready.ca/thumbnail.jpg (Absolute URL)</td>
                  </tr>
                  <tr className="hover:bg-purple-50/40">
                    <td className="p-2 font-mono font-bold text-purple-700 dark:text-purple-300">/airlines/delta-baggage</td>
                    <td className="p-2 font-mono">https://gateready.ca/airlines/delta-air-lines-baggage (301 canonical target)</td>
                    <td className="p-2">Delta Air Lines baggage limits: carry-on dimensions (22 x 14 x 9 in), no maximum carry-on weight on domestic routes, $35 first checked bag fee, and Delta One allowances.</td>
                    <td className="p-2 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">https://gateready.ca/thumbnail.jpg (Absolute URL)</td>
                  </tr>
                  <tr className="hover:bg-purple-50/40">
                    <td className="p-2 font-mono font-bold text-purple-700 dark:text-purple-300">/baggage-fee-calculator</td>
                    <td className="p-2 font-mono">https://gateready.ca/baggage-fee-calculator</td>
                    <td className="p-2">Calculate checked bag fees, carry-on charges, and overweight surcharges across 42 global airlines with our standalone baggage fee calculator.</td>
                    <td className="p-2 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">https://gateready.ca/thumbnail.jpg (Absolute URL)</td>
                  </tr>
                  <tr className="hover:bg-purple-50/40">
                    <td className="p-2 font-mono font-bold text-purple-700 dark:text-purple-300">/entry-requirements</td>
                    <td className="p-2 font-mono">https://gateready.ca/entry-requirements</td>
                    <td className="p-2">Essential passport validity rules, 6-month rule, electronic travel authorizations (ESTA, eTA), and direct links to official government entry portals.</td>
                    <td className="p-2 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">https://gateready.ca/thumbnail.jpg (Absolute URL)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mode-Aware Entry Rules */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Mode-Aware Cross-Border Entry Notices</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Resolved travel mode propagation to entry requirement evaluations: Road Trip, Train, and Bus itineraries never display air-arrival rules (e.g. "by air with a valid US passport"). Land border crossings and rail entries show verified mode-specific or mode-neutral rules without transport-mode claims.
            </p>
          </div>

          {/* Bus Subtitle Wording */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Bus Luggage Storage Terminology</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Updated bus bag subtitles to use verified coach storage wording ("Under-seat / cargo hold" and "No bus limit") completely clearing aircraft "overhead" cabin wording on bus itineraries. Re-verified Road, Train, and Cruise bag subtitles remain completely clean.
            </p>
          </div>

          {/* Silver Feature List Parity */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Silver Feature List Exact Parity</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Synchronized the Silver plan feature list across the plans dialog, /pricing page, and server HTML to match item for item, in the exact same words: 1 traveler, 2 active trips, unlimited bags, suitcase tare weight deduction, emergency QR luggage recovery tag, terminal maps & cabin intel, printable PDF packing lists, and Travel wallet (loyalty numbers, TSA PreCheck, PNRs).
            </p>
          </div>

          {/* Post-Reload Flash Elimination */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Post-Reload Zero-Flash Authenticated State</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Implemented synchronous local authentication state holding so signed-in page reloads and new browser tabs immediately display the user's authenticated header and active plan tier without flashing "Loading...", "Saved in this browser only" banners, or Free Plan 2-bag limit badges.
            </p>
          </div>
        </div>
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
