import React from 'react';
import { PageLayout } from './PageLayout';
import { 
  Plane, 
  Scale, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <PageLayout pathname="/how-it-works">
      {/* Intro */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          How GateReady Works in 5 Simple Steps
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          GateReady bridges the gap between packing at home and the airport ticket counter. Here is how our step-by-step workflow eliminates overweight luggage fees and security delays.
        </p>
      </section>

      {/* 5 Steps */}
      <div className="space-y-6 pt-2">
        {/* Step 1 */}
        <div className="flex gap-4 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
            1
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Select Your Destination & Operating Airline
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Choose from 42+ pre-configured global carriers (including Air Canada, WestJet, Delta, United, and British Airways). GateReady automatically loads your carrier's exact carry-on dimensions (inches & cm) and checked baggage weight limits (e.g. 50 lbs / 23 kg).
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
            2
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Calibrate Your Luggage Tare Weight
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Most travelers forget that empty suitcases weigh 7 to 11 lbs! GateReady provides standard tare weight benchmarks for soft-side and hard-shell suitcases, or allows you to customize your exact empty shell weight for pinpoint accuracy.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
            3
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Add Items & Run the TSA 3-1-1 Liquids Audit
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Build your packing list using pre-weighted travel essentials or custom items. When adding liquids, lotions, or aerosols to a carry-on, GateReady checks bottle volumes against the TSA 3.4 oz (100ml) security limit and alerts you to repack oversized liquids into checked bags.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
            4
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Monitor Real-Time Weight Meters & Surcharge Estimates
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Watch your progress bar as you pack. Clear visual indicators show when you are within safe limits, nearing capacity (warning state), or exceeding the airline cap. If a bag goes overweight, GateReady estimates the potential airline surcharge so you can redistribute items before leaving home.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4 p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
            5
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Track Departure Readiness, Print Manifests & Go
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete your departure checklist (passports, charging cables, prescriptions, power bank carry-on rule). Print a physical packing list or generate an emergency QR luggage tag, and head to the airport with complete peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* Honest Boundary */}
      <section className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-purple-600" />
          <span>Self-Service Planning Tool Notice</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          GateReady is a modeling and packing checklist tool. Luggage weights are calculated from tare baselines and item benchmarks. Always verify weight on a calibrated home scale if packing dense or unusual goods, and check with your carrier for seat-tier specific allowances.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center pt-4">
        <a
          href="/"
          className="h-11 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
        >
          <span>Create Your Free Packing List Now</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </PageLayout>
  );
};
