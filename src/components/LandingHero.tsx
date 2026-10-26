import React from 'react';
import { 
  Scale, 
  Droplets, 
  Clock, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Luggage, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Plane,
  ChevronDown,
  Cloud
} from 'lucide-react';

interface LandingHeroProps {
  onOpenAddTrip: () => void;
  onLoadDemo: () => void;
  onOpenPricing: () => void;
  onOpenAirlineGuides?: () => void;
  onOpenAccountSync?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenAddTrip,
  onLoadDemo,
  onOpenPricing,
  onOpenAirlineGuides,
  onOpenAccountSync
}) => {
  return (
    <section className="relative w-full pt-6 pb-8 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden bg-gradient-to-b from-purple-950/20 via-transparent to-transparent">
      <div className="w-full max-w-[1550px] mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Top Aviation Corridor & Airport Intelligence Radar Ticker */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-[11px] font-mono tracking-widest uppercase text-purple-700/80 dark:text-purple-300/80 bg-purple-100/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 px-5 py-2 rounded-full w-full max-w-5xl mx-auto shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-bold text-purple-900 dark:text-purple-200">GLOBAL AIRLINE RADAR:</span>
          <span>AIR CANADA</span>
          <span className="text-purple-300 dark:text-purple-600">·</span>
          <span>WESTJET</span>
          <span className="text-purple-300 dark:text-purple-600">·</span>
          <span>DELTA</span>
          <span className="text-purple-300 dark:text-purple-600">·</span>
          <span>UNITED</span>
          <span className="text-purple-300 dark:text-purple-600">·</span>
          <span>BRITISH AIRWAYS</span>
          <span className="text-purple-300 dark:text-purple-600">·</span>
          <span>AIR FRANCE</span>
          <span className="text-purple-300 dark:text-purple-600">·</span>
          <span>LUFTHANSA</span>
          <span className="text-purple-300 dark:text-purple-600">·</span>
          <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">42+ CARRIERS AUDITED</span>
        </div>

        {/* Headline & Supporting Subhead */}
        <div className="space-y-4 w-full max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
            Help avoid unexpected overweight baggage fees.
            <span className="block mt-2.5 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-normal">
              Audit suitcase tare weight, liquids & overhead limits before you arrive at the airport.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed">
            GateReady calculates real empty-luggage tare weight, audits every liquid against TSA 3-1-1 rules, and validates carry-on sizer compliance across 42+ worldwide airlines.
          </p>
        </div>

        {/* Primary Call to Action & Subordinate Sample Demo Link */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* ONE Primary CTA above the fold */}
            <button
              type="button"
              onClick={onOpenAddTrip}
              className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 active:scale-98 text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-purple-600/30 transition-all cursor-pointer border border-purple-400/40"
            >
              <span>Create Your Trip (Free)</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            {/* Clearly secondary, visually quieter demo option with clear explanation */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Want to preview how it works?</span>
              <button
                type="button"
                onClick={onLoadDemo}
                className="text-purple-700 dark:text-purple-300 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5 transition-colors"
              >
                <span>or see a sample trip first →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Hint */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 flex-wrap">
          <span>Plans from <strong className="text-purple-700 dark:text-purple-300 font-bold">$1.99/mo</strong> — free to start</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={onOpenPricing}
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
          >
            Includes 7-day full Platinum trial
          </button>
          {onOpenAirlineGuides && (
            <>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                type="button"
                onClick={onOpenAirlineGuides}
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 font-semibold cursor-pointer underline decoration-dotted"
              >
                Browse 42+ Airline Guides
              </button>
            </>
          )}
        </div>

        {/* 3 Real Product Visual Previews with semantic H2 */}
        <div className="pt-2 text-center">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-700/90 dark:text-purple-300/90">
            Trip Packing Checklist, Overweight Baggage Calculator & Luggage Allowances
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-2 text-left">
          
          {/* Visual 1: Smart Luggage Scale & Tare Meter */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-600" />
                  Luggage Weight Meter
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Within Limits
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">
                Carry-On Spinner (22 lbs limit)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Calculates empty suitcase tare + items so you don&apos;t get hit with gate-check fees.
              </p>
            </div>

            {/* Gauge visualization */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[11px] text-slate-500">Total Luggage:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  <strong>21.4</strong> / 22.0 lbs
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full w-[96%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Suitcase: 7.0 lbs</span>
                <span>Contents: 14.4 lbs</span>
              </div>
            </div>
          </div>

          {/* Visual 2: TSA 3-1-1 Liquids Compliance Checker */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  TSA 3-1-1 Checker
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  Security Guard
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">
                Liquid Toiletries Detection
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically flags bottles over 3.4 oz (100ml) before airport security screening.
              </p>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between">
                <span className="font-semibold text-emerald-900 dark:text-emerald-200 text-[11px] truncate">
                  Travel Shampoo (3.4 oz)
                </span>
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" /> Pass
                </span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between">
                <span className="font-semibold text-rose-900 dark:text-rose-200 text-[11px] truncate">
                  Moisturizing Cream (8.0 oz)
                </span>
                <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-0.5 shrink-0">
                  <AlertTriangle className="w-3 h-3" /> Move to Checked
                </span>
              </div>
            </div>
          </div>

          {/* Visual 3: Live Countdown & Verified Carrier Allowances */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-indigo-500" />
                  42+ Airline Allowances
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  2026 Verified
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">
                Delta / Air Canada / United
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Exact carry-on sizer dimensions, checked weight caps, and departure countdown clock.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure Countdown:</span>
                <span className="font-mono font-black text-purple-950 dark:text-purple-200 text-sm">
                  04d : 18h : 32m
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-purple-600 text-white shadow-2xs">
                Airbus A350
              </span>
            </div>
          </div>

        </div>


        {/* Subtle indicator leading immediately to the interactive app below */}
        <div className="pt-2 flex flex-col items-center justify-center text-xs text-slate-400">
          <span className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
            <span>Or configure your trip below — free forever starter plan</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </span>
        </div>

      </div>
    </section>
  );
};
