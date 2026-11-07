import React, { useState, useMemo, useEffect } from 'react';
import { 
  AIRLINE_BAGGAGE_FEES, 
  calculateTripBaggageFees, 
  BagFeeCalculationResult 
} from '../data/baggageFeeData';
import { getAirlineFareFamilies } from '../data/airlineFareFamilies';
import { AIRLINE_GUIDES } from '../data/airlineGuidesData';
import { 
  Receipt, 
  Calculator, 
  Plane, 
  Luggage, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  HelpCircle,
  Info
} from 'lucide-react';
import { BagType } from '../types/travel';

interface BaggageFeeCalculatorPageProps {
  onOpenTripBuilder?: (carrier: string, checkedCount: number, carryOnCount: number) => void;
}

export const BaggageFeeCalculatorPage: React.FC<BaggageFeeCalculatorPageProps> = ({ onOpenTripBuilder }) => {
  // Query param support: ?airline=WestJet or ?airline=air-canada
  const [selectedAirlineName, setSelectedAirlineName] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlAirline = params.get('airline');
      if (urlAirline) {
        const found = AIRLINE_BAGGAGE_FEES.find(
          (a) => a.airlineName.toLowerCase() === urlAirline.toLowerCase() ||
                 a.airlineId.toLowerCase() === urlAirline.toLowerCase() ||
                 a.aliases.some((alias) => alias.toLowerCase() === urlAirline.toLowerCase())
        );
        if (found) return found.airlineName;
      }
    }
    return 'WestJet'; // Default WestJet to immediately demonstrate published fare families & fees
  });

  const [selectedCabin, setSelectedCabin] = useState<string>('Main Cabin / Economy');
  const [checkedCount, setCheckedCount] = useState<number>(2); // Default 2 checked bags
  const [carryOnCount, setCarryOnCount] = useState<number>(1);

  const activeRecord = useMemo(() => {
    return AIRLINE_BAGGAGE_FEES.find((a) => a.airlineName === selectedAirlineName) || AIRLINE_BAGGAGE_FEES[0];
  }, [selectedAirlineName]);

  const airlineFareFamilies = useMemo(() => {
    return getAirlineFareFamilies(activeRecord.airlineId || activeRecord.airlineName);
  }, [activeRecord]);

  const [selectedFareFamilyId, setSelectedFareFamilyId] = useState<string>('');

  useEffect(() => {
    const defaultFam = airlineFareFamilies.find((f) => f.isDefault) || airlineFareFamilies[0];
    setSelectedFareFamilyId(defaultFam ? defaultFam.id : '');
  }, [airlineFareFamilies]);

  const activeGuide = useMemo(() => {
    return AIRLINE_GUIDES.find((g) => g.name === activeRecord.airlineName);
  }, [activeRecord]);

  // Build synthetic bag manifest for the fee calculation engine
  const simulatedBags = useMemo(() => {
    const list: Array<{
      id: string;
      label: string;
      type: BagType;
      currentWeightLbs: number;
      maxWeightLimitLbs?: number;
    }> = [];

    // Checked bags
    for (let i = 0; i < checkedCount; i++) {
      list.push({
        id: `fee-chk-${i + 1}`,
        label: checkedCount === 1 ? 'Checked Bag' : i === 0 ? '1st Checked Bag' : i === 1 ? '2nd Checked Bag' : `${i + 1}th Checked Bag`,
        type: 'CHECKED',
        currentWeightLbs: 45,
        maxWeightLimitLbs: 50
      });
    }

    // Carry-on bags
    for (let i = 0; i < carryOnCount; i++) {
      list.push({
        id: `fee-co-${i + 1}`,
        label: carryOnCount === 1 ? 'Carry-On Roller' : `Carry-On #${i + 1}`,
        type: 'CARRY_ON',
        currentWeightLbs: 18,
        maxWeightLimitLbs: 22
      });
    }

    return list;
  }, [checkedCount, carryOnCount]);

  // Run official published airline calculation with fare family
  const feeResult: BagFeeCalculationResult | null = useMemo(() => {
    return calculateTripBaggageFees(activeRecord.airlineName, simulatedBags, selectedCabin, selectedFareFamilyId);
  }, [activeRecord.airlineName, simulatedBags, selectedCabin, selectedFareFamilyId]);

  // Dynamic USD approximation based on active total fee
  const approxUsd = useMemo(() => {
    if (!feeResult) return null;
    return feeResult.usdEquivalentNote || null;
  }, [feeResult]);

  // Fee-bearing bag count
  const feeBearingBags = useMemo(() => {
    if (!feeResult) return [];
    return feeResult.breakdown.filter((b) => b.subtotal > 0 || (b.bagType === 'CHECKED' && b.baseFee > 0));
  }, [feeResult]);

  const feeSummaryBagCountText = useMemo(() => {
    const count = feeBearingBags.length;
    if (count === 0) return 'no fee-bearing bags';
    const allChecked = feeBearingBags.every((b) => b.bagType === 'CHECKED');
    if (count === 1) {
      return allChecked ? '1 checked bag' : '1 bag';
    }
    return allChecked ? `${count} checked bags` : `${count} fee-bearing bags`;
  }, [feeBearingBags]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Baggage Fee Calculator – Check Airline Luggage Fees | GateReady';
      window.scrollTo(0, 0);
    }
  }, []);

  const sortedAirlines = useMemo(() => {
    return [...AIRLINE_BAGGAGE_FEES].sort((a, b) => a.airlineName.localeCompare(b.airlineName));
  }, []);

  const handleStartTripWithBags = () => {
    if (onOpenTripBuilder) {
      onOpenTripBuilder(activeRecord.airlineName, checkedCount, carryOnCount);
    } else {
      window.location.href = `/?action=new_trip&mode=PLANE&carrier=${encodeURIComponent(activeRecord.airlineName)}&checked=${checkedCount}&carryon=${carryOnCount}&fare=${encodeURIComponent(selectedFareFamilyId)}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header Navigation */}
      <header className="w-full bg-white border-b border-purple-100 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors">
              ← Back to App
            </a>
            <span className="text-slate-300">|</span>
            <a href="/" className="font-black text-base tracking-tight text-slate-900">
              Gate<span className="text-purple-600">Ready</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="/airlines" 
              className="text-xs font-bold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              Airline Guides
            </a>
            <a 
              href="/entry-requirements" 
              className="text-xs font-bold text-slate-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-purple-50 transition-colors"
            >
              Entry Requirements
            </a>
            <button
              onClick={handleStartTripWithBags}
              className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-purple-600/20 cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Pack with These Bags</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="w-full bg-gradient-to-b from-purple-50 via-white to-slate-50 border-b border-purple-100 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider">
            <Receipt className="w-3.5 h-3.5 text-purple-600" />
            <span>BAGGAGE FEE CHECKER · 42 Airlines Audited</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Airline Baggage Fee Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Estimate checked bag fees, carry-on charges, and fare-family luggage inclusions across 42 airlines with GateReady's standalone fee calculator.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>Verified: November 4, 2026</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Published Carrier Fare Tables</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Baggage Fee Checker Tool */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* The Complete Standalone Baggage Fee Checker Card */}
        <div className="rounded-3xl bg-white border border-purple-200/90 shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            {/* Card Top Title Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 border-b border-purple-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                        Baggage Fee Checker
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] font-bold text-slate-500">
                        42 Airlines Audited
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                      Estimate Airline Bag Fees
                    </h2>
                  </div>
                </div>

                {feeResult?.officialBaggagePageUrl && (
                  <a
                    href={feeResult.officialBaggagePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="View official published airline fee page"
                  >
                    <span>Official Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Inputs Panel */}
            <div className="p-4 sm:p-5 space-y-4 border-b border-purple-100/70 bg-purple-50/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Airline Dropdown */}
                <div>
                  <label
                    htmlFor="fee-calculator-airline-select"
                    className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1 cursor-pointer select-none"
                  >
                    Select Airline (42 Available)
                  </label>
                  <select
                    id="fee-calculator-airline-select"
                    name="airline"
                    value={selectedAirlineName}
                    onChange={(e) => setSelectedAirlineName(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 bg-white text-slate-900 font-medium focus:outline-hidden focus:border-purple-500 cursor-pointer shadow-2xs relative z-10 pointer-events-auto"
                  >
                    {sortedAirlines.map((airline) => (
                      <option key={airline.airlineId} value={airline.airlineName}>
                        {airline.airlineName} ({airline.currency})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cabin / Fare Class */}
                <div>
                  <label
                    htmlFor="fee-calculator-fare-family-select"
                    className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1 cursor-pointer select-none"
                  >
                    Fare Family / Ticket Tier
                  </label>
                  <select
                    id="fee-calculator-fare-family-select"
                    name="fareFamily"
                    value={selectedFareFamilyId}
                    onChange={(e) => setSelectedFareFamilyId(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 bg-white text-slate-900 font-medium focus:outline-hidden focus:border-purple-500 cursor-pointer shadow-2xs relative z-10 pointer-events-auto"
                  >
                    {airlineFareFamilies.map((fam) => (
                      <option key={fam.id} value={fam.id}>
                        {fam.name} {fam.isDefault ? '(Standard)' : ''} — {fam.includedCheckedBags > 0 ? `${fam.includedCheckedBags} checked included` : '0 checked included'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Carry-on restriction banner if active fare family prohibits overhead bags */}
              {feeResult?.carryOnRestrictionNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{feeResult.carryOnRestrictionNotice}</span>
                </div>
              )}

              {/* Bag Count Selectors: Checked Bags (0-3) and Carry-Ons (0-2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Checked Bags Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1.5 flex items-center justify-between">
                    <span>Checked Bags (to hold)</span>
                    <span className="text-[10px] text-purple-600 font-bold">{checkedCount} selected</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-xl border border-purple-200/80">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCheckedCount(num)}
                        className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          checkedCount === num
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-purple-50'
                        }`}
                      >
                        {num === 0 ? 'None' : `${num} ${num === 1 ? 'Bag' : 'Bags'}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Carry-On Bags Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1.5 flex items-center justify-between">
                    <span>Overhead Carry-On Rollers</span>
                    <span className="text-[10px] text-purple-600 font-bold">{carryOnCount} selected</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-purple-200/80">
                    {[0, 1, 2].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCarryOnCount(num)}
                        className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          carryOnCount === num
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-purple-50'
                        }`}
                      >
                        {num === 0 ? 'None' : `${num} ${num === 1 ? 'Roller' : 'Rollers'}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display Area */}
            {feeResult && (
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* Total in Large Type */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-slate-100">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight tabular-nums">
                      {feeResult.totalEstimatedFeeFormatted}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      estimated total · {feeSummaryBagCountText}
                    </span>
                  </div>
                  {approxUsd && (
                    <span className="text-xs font-bold text-slate-500">
                      ({approxUsd})
                    </span>
                  )}
                </div>

                {/* Per-Bag Breakdown */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Per-Bag Cost Breakdown:
                  </div>
                  {feeResult.breakdown.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                      No bags selected. Choose 1 or more checked or carry-on bags above.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                      {feeResult.breakdown.map((item, idx) => (
                        <div
                          key={item.bagId || idx}
                          className="p-2.5 sm:px-3.5 flex items-center justify-between text-xs hover:bg-slate-100/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Luggage className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span className="font-bold text-slate-800">
                              {item.bagLabel}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:inline">
                              ({item.bagType === 'CHECKED' ? 'Checked Luggage' : 'Carry-On Overhead'})
                            </span>
                          </div>
                          <span className="font-extrabold text-slate-900 tabular-nums">
                            {item.subtotalFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Airline Fee Notes / UltraBasic Alert */}
                {feeResult.feeNotes && (
                  <p className="text-[11px] text-slate-500 leading-relaxed bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                    <strong className="text-purple-900">Policy Notes: </strong>
                    {feeResult.feeNotes}
                  </p>
                )}

                {/* Estimate Disclaimer with Last-Verified Date */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="leading-snug">Estimate from published airline fee tables, last verified November 4, 2026. Airlines change fees — confirm at booking.</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer with secondary utility CTA */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-purple-100 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleStartTripWithBags}
              className="w-full sm:flex-1 h-11 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Build my full packing list with these bags →</span>
            </button>
            {activeGuide && (
              <a
                href={activeGuide.canonicalPath}
                className="w-full sm:w-auto h-11 px-4 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-purple-200"
              >
                <span>View {activeRecord.airlineName} Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Informative FAQs for Baggage Fees */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-black text-slate-900">
              Baggage Fee FAQs & Saving Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900">
                Why do airline baggage fees differ between online and at the airport?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Most airlines (including United, American, Air Canada, and Spirit) discount baggage by $5 to $15 when prepaid online prior to check-in. Paying at the airport counter or gate incurs higher surcharge rates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900">
                How much is the overweight baggage fee on major airlines?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Checked bags weighing 51 to 70 lbs (24–32 kg) incur an overweight surcharge ranging from $100 to $150 USD on legacy carriers. Even a bag weighing 50.5 lbs will trigger the full overweight fee.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900">
                How can I avoid unexpected baggage fees?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Deduct empty suitcase tare weight from your allowance, pack dense toiletries in checked bags, use compression cubes, and verify your airline's carry-on dimensions before departure.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-900">
                Are baggage fee estimates guaranteed?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                No. GateReady calculates estimates strictly from published airline fee tables. Because airlines frequently change rates and ticket restrictions, always verify with your carrier.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Link Directory Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <a href="/airlines" className="text-purple-700 hover:text-purple-900 underline flex items-center gap-1.5">
            <span>← Directory of all 42 Airline Allowance Guides</span>
          </a>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="/tare-weight" className="hover:text-purple-700">What is Tare Weight?</a>
            <span>·</span>
            <a href="/entry-requirements" className="hover:text-purple-700">Entry Requirements Quick-Check</a>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-[1550px] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-black text-lg tracking-tight text-white">Gate<span className="text-purple-400">Ready</span></span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Smart Trip Packing & Baggage Limits</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
              <a href="/airlines" className="hover:text-purple-300">Airline Guides</a>
              <a href="/baggage-fee-calculator" className="hover:text-purple-300">Fee Calculator</a>
              <a href="/tare-weight" className="hover:text-purple-300">Tare Weight</a>
              <a href="/entry-requirements" className="hover:text-purple-300">Entry Rules</a>
              <a href="/pricing" className="hover:text-purple-300">Pricing</a>
              <a href="/faq" className="hover:text-purple-300">FAQ</a>
              <a href="/about" className="hover:text-purple-300">About</a>
              <a href="/contact" className="hover:text-purple-300">Contact Support</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>© CSM App Holdings · GateReady (gateready.ca) · All rights reserved.</div>
            <div>Sole official contact: <a href="mailto:csmappholdings@gmail.com" className="text-slate-400 hover:text-purple-300 underline">csmappholdings@gmail.com</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
