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
      <div className="space-y-8 pt-4">
        {/* Step 1: Creating a Trip */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Create Your Trip &amp; Set Travel Dates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Start by entering your trip name (e.g. "Summer in Lisbon" or "Tokyo Cherry Blossom"), travel dates, and destination. GateReady creates your central travel preparation workspace and activates your departure countdown clock.
              </p>
            </div>
          </div>

          {/* Step 1 UI Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-xl mx-auto space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">Trip Setup</span>
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">Step 1 of 5</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Trip Title:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Summer in Lisbon</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Destination:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Lisbon, Portugal (LIS)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Selecting Travel Mode & Airline */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Select Travel Mode &amp; Operating Airline
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose your travel mode (Flight, Road Trip, Train, Cruise). For flights, select from 42+ verified global airlines and your booked fare family (e.g. Basic Economy vs Standard). GateReady automatically loads published carry-on dimensions and checked baggage weight limits.
              </p>
            </div>
          </div>

          {/* Step 2 UI Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-xl mx-auto space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">Air Canada AC849</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified Tariff</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Boeing 787-9</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Carry-On Sizer Cap:</span>
                <span className="font-semibold text-slate-900 dark:text-white">21.5 x 15.5 x 9 in · Free</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold">Checked Weight Cap:</span>
                <span className="font-semibold text-slate-900 dark:text-white">50.0 lbs (23 kg) limit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Adding Luggage & Calibrating Tare */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Add Luggage &amp; Calibrate Suitcase Tare Weight
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Add personal items (1.5–3.0 lbs), carry-on rollers (5.5–7.0 lbs), or checked suitcases (8.5–10.5 lbs). Select an empty suitcase tare preset (e.g. 10.5 lbs for a hard-shell checked bag) or enter custom dimensions. GateReady deducts the empty shell weight automatically so you know your net capacity for clothes.
              </p>
            </div>
          </div>

          {/* Step 3 UI Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-xl mx-auto space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Hard-Shell Checked Suitcase</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Polycarbonate Hard-Shell</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block">Empty Tare</span>
                <span className="font-bold text-purple-600">10.5 lbs</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block">Dimensions</span>
                <span className="font-bold text-slate-900 dark:text-white">29 x 20.5 x 12.5"</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block">Max Allowance</span>
                <span className="font-bold text-slate-900 dark:text-white">50.0 lbs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Adding Packed Items & Checking Weight */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Live Packing Weight Meters &amp; TSA 3-1-1 Liquids Audit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Add items using our pre-calibrated weight catalog or custom entries. Live Packing Weight Meters track cumulative bag weight against airline limits in real time. When adding toiletries to carry-ons, the TSA 3-1-1 liquids checker flags oversized bottles (&gt;3.4 oz) so you can repack them safely.
              </p>
            </div>
          </div>

          {/* Step 4 UI Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-xl mx-auto space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Checked Bag Live Packing Weight Meter:</span>
              <span className="font-bold text-emerald-600">42.8 / 50.0 lbs (Safe · 7.2 lbs buffer left)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85.6%' }} />
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-900 dark:text-emerald-200">Travel Shampoo (3.0 fl oz)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">✓ TSA 3-1-1 Pass</span>
            </div>
          </div>
        </div>

        {/* Step 5: Reviewing Departure Readiness */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
              5
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Review Packing &amp; Departure Readiness
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Before heading to the airport, review your packing list and Departure Readiness Score. If any bag exceeds limits, our Rebalance Bags optimizer suggests 1-click item shifts to lighter luggage. Save loyalty accounts to your Travel Wallet and print clean manifests or privacy-safe emergency QR luggage recovery tags.
              </p>
            </div>
          </div>

          {/* Step 5 UI Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 max-w-xl mx-auto space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-purple-900 dark:text-purple-200 block">Departure Readiness Score</span>
                <span className="text-[11px] text-slate-500">All bags safe · Travel documents verified</span>
              </div>
              <span className="text-sm font-black text-purple-600 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-purple-200">
                85% Ready
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>✓ Printable packing manifest ready</span>
              <span>✓ Emergency QR bag tag active</span>
            </div>
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
