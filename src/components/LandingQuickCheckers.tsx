import React from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  ArrowRight, 
  Plane,
  Scale,
  ExternalLink
} from 'lucide-react';
import { AdPlacement } from './AdPlacement';

interface LandingQuickCheckersProps {
  onBuildPackingList?: (config: {
    carrier: string;
    seatClass: string;
    checkedCount: number;
    carryOnCount: number;
  }) => void;
  onPlanTrip?: (destinationCity: string) => void;
}

const LandingQuickCheckersComponent: React.FC<LandingQuickCheckersProps> = () => {
  return (
    <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8" id="travel-requirements-hub">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider">
          <Plane className="w-3.5 h-3.5" />
          <span>Standalone Travel Checkers · No Account Needed</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Baggage Fees by Airline, Luggage Allowances & Entry Requirements
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Look up published airline checked luggage fees and passport validity rules right now before creating a trip.
        </p>
      </div>

      {/* Clean 2-Card Hub: One click to each standalone tool */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto">
        
        {/* Card 1: Baggage Fee Calculator */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-lg hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-700 transition-all p-6 sm:p-8 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25 group-hover:scale-105 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                42 Airlines Audited
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Baggage Fee Calculator
              </h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                Verified November 4, 2026 · Real Carrier Fare Tables
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Calculate checked and carry-on luggage fees across 42 airlines, compare fare-family inclusions, and estimate total costs.
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-purple-100 dark:border-purple-900/40">
            <a
              href="/baggage-fee-calculator"
              className="w-full h-11 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20 transition-all cursor-pointer"
            >
              <span>Open Baggage Fee Calculator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Card 2: Entry Requirements Quick-Check */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-lg hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-700 transition-all p-6 sm:p-8 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                CA & US Passports
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Entry Requirements Quick-Check
              </h3>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                Verified October 15, 2026 · Official Government Portals
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Check passport validity rules, visa requirements, and official government advisories for Canadian and US passport holders.
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-purple-100 dark:border-purple-900/40">
            <a
              href="/entry-requirements"
              className="w-full h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-slate-700/30"
            >
              <span>Check Entry Requirements</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>

      {/* Non-intrusive ad placement below the hub */}
      <AdPlacement slotId="ad-slot-landing-fee-checker" format="inline" className="mt-8" />
    </section>
  );
};

export const LandingQuickCheckers = React.memo(LandingQuickCheckersComponent);
