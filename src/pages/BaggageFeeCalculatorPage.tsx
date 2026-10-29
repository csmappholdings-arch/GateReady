import React, { useState, useMemo, useEffect } from 'react';
import { AIRLINE_BAGGAGE_FEES, calculateTripBaggageFees, BagFeeCalculationResult } from '../data/baggageFeeData';
import { AIRLINE_GUIDES, getAirlineGuideById } from '../data/airlineGuidesData';
import { 
  Calculator, 
  Plane, 
  Scale, 
  Luggage, 
  Briefcase, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';

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
    return 'Air Canada';
  });

  const [selectedCabin, setSelectedCabin] = useState<'Economy' | 'Premium Economy' | 'Business / First'>('Economy');
  const [checkedCount, setCheckedCount] = useState<number>(1);
  const [carryOnCount, setCarryOnCount] = useState<number>(1);
  const [checkedWeight1, setCheckedWeight1] = useState<number>(45);
  const [checkedWeight2, setCheckedWeight2] = useState<number>(48);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Baggage Fee Calculator – Check Airline Luggage Fees | GateReady';
      window.scrollTo(0, 0);
    }
  }, []);

  // Sorted list of airlines for select dropdown
  const sortedAirlines = useMemo(() => {
    return [...AIRLINE_BAGGAGE_FEES].sort((a, b) => a.airlineName.localeCompare(b.airlineName));
  }, []);

  const activeRecord = useMemo(() => {
    return AIRLINE_BAGGAGE_FEES.find((a) => a.airlineName === selectedAirlineName) || AIRLINE_BAGGAGE_FEES[0];
  }, [selectedAirlineName]);

  const activeGuide = useMemo(() => {
    return AIRLINE_GUIDES.find((g) => g.name === activeRecord.airlineName);
  }, [activeRecord]);

  // Construct synthetic bag list for the fee calculation engine
  const simulatedBags = useMemo(() => {
    const bags: Array<{
      id: string;
      label: string;
      type: 'PERSONAL' | 'CARRY_ON' | 'CHECKED';
      currentWeightLbs: number;
      maxWeightLimitLbs?: number;
    }> = [];

    // Personal item: always free
    bags.push({
      id: 'sim-personal',
      label: 'Personal Item',
      type: 'PERSONAL',
      currentWeightLbs: 6
    });

    for (let i = 0; i < carryOnCount; i++) {
      bags.push({
        id: `sim-carryon-${i + 1}`,
        label: carryOnCount === 1 ? 'Carry-On Roller' : `Carry-On #${i + 1}`,
        type: 'CARRY_ON',
        currentWeightLbs: 18
      });
    }

    for (let i = 0; i < checkedCount; i++) {
      const weight = i === 0 ? checkedWeight1 : i === 1 ? checkedWeight2 : 46;
      bags.push({
        id: `sim-checked-${i + 1}`,
        label: i === 0 ? '1st Checked Suitcase' : i === 1 ? '2nd Checked Suitcase' : `${i + 1}th Checked Suitcase`,
        type: 'CHECKED',
        currentWeightLbs: weight,
        maxWeightLimitLbs: selectedCabin === 'Business / First' ? 70 : 50
      });
    }

    return bags;
  }, [checkedCount, carryOnCount, checkedWeight1, checkedWeight2, selectedCabin]);

  const calculationResult: BagFeeCalculationResult | null = useMemo(() => {
    return calculateTripBaggageFees(activeRecord.airlineName, simulatedBags, selectedCabin);
  }, [activeRecord, simulatedBags, selectedCabin]);

  const handleStartTripWithBags = () => {
    if (onOpenTripBuilder) {
      onOpenTripBuilder(activeRecord.airlineName, checkedCount, carryOnCount);
    } else {
      window.location.href = `/?action=new_trip&mode=PLANE&carrier=${encodeURIComponent(activeRecord.airlineName)}&checked=${checkedCount}&carryon=${carryOnCount}`;
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
              All 42 Airline Guides
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
            <Calculator className="w-3.5 h-3.5 text-purple-600" />
            <span>Interactive Tool · Instant Baggage Fee Calculations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Airline Baggage Fee Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Estimate checked luggage costs, carry-on charges, and overweight surcharges across 42 global airlines before heading to the airport.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>Updated & Verified: October 2026</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Published Carrier Fare Tables</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Calculator Controls */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>1. Select Carrier & Luggage Manifest</span>
              </h2>
              <span className="text-xs text-purple-600 font-bold">42 Airlines Available</span>
            </div>

            {/* Carrier Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Airline / Carrier
              </label>
              <select
                value={selectedAirlineName}
                onChange={(e) => setSelectedAirlineName(e.target.value)}
                className="w-full h-11 px-3.5 text-xs font-bold rounded-2xl border border-purple-200 bg-purple-50/40 text-slate-900 focus:outline-hidden focus:border-purple-600"
              >
                {sortedAirlines.map((airline) => (
                  <option key={airline.airlineId} value={airline.airlineName}>
                    {airline.airlineName} ({airline.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Cabin Class Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Ticket / Cabin Class
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Economy', 'Premium Economy', 'Business / First'] as const).map((cabin) => (
                  <button
                    key={cabin}
                    type="button"
                    onClick={() => setSelectedCabin(cabin)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedCabin === cabin
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {cabin}
                  </button>
                ))}
              </div>
            </div>

            {/* Bag Counter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Checked Bags */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-purple-600" />
                    <span>Checked Bags</span>
                  </span>
                  <span className="text-xs font-black text-purple-700">{checkedCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckedCount(Math.max(0, checkedCount - 1))}
                    disabled={checkedCount === 0}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-700 flex-1 text-center">
                    {checkedCount} {checkedCount === 1 ? 'Suitcase' : 'Suitcases'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCheckedCount(Math.min(5, checkedCount + 1))}
                    className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Carry-On Bags */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Luggage className="w-4 h-4 text-purple-600" />
                    <span>Carry-On Bags</span>
                  </span>
                  <span className="text-xs font-black text-purple-700">{carryOnCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCarryOnCount(Math.max(0, carryOnCount - 1))}
                    disabled={carryOnCount === 0}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-700 flex-1 text-center">
                    {carryOnCount} {carryOnCount === 1 ? 'Roller' : 'Rollers'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCarryOnCount(Math.min(3, carryOnCount + 1))}
                    className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Overweight Surcharge Simulator Sliders */}
            {checkedCount > 0 && (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Simulate Packed Scale Weight</span>
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">
                    Standard Cap: {selectedCabin === 'Business / First' ? '70 lbs' : '50 lbs (23 kg)'}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">1st Checked Bag Weight:</span>
                    <span className={`font-black ${checkedWeight1 > (selectedCabin === 'Business / First' ? 70 : 50) ? 'text-rose-600' : 'text-slate-900'}`}>
                      {checkedWeight1} lbs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="65"
                    step="1"
                    value={checkedWeight1}
                    onChange={(e) => setCheckedWeight1(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {checkedCount > 1 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">2nd Checked Bag Weight:</span>
                      <span className={`font-black ${checkedWeight2 > (selectedCabin === 'Business / First' ? 70 : 50) ? 'text-rose-600' : 'text-slate-900'}`}>
                        {checkedWeight2} lbs
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="65"
                      step="1"
                      value={checkedWeight2}
                      onChange={(e) => setCheckedWeight2(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Calculation Breakdown */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-7 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">
                  Estimated Baggage Total
                </h2>
                <span className="text-[11px] font-bold text-slate-500">
                  {activeRecord.currency}
                </span>
              </div>

              {/* Big Fee Display */}
              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                  {activeRecord.airlineName} Total
                </span>
                <div className="text-4xl font-black text-purple-950 tracking-tight">
                  {calculationResult?.totalEstimatedFeeFormatted || '$0'}
                </div>
                {activeRecord.usdEquivalentNote && activeRecord.currency !== 'USD' && (
                  <span className="text-[11px] text-purple-800 font-semibold block">
                    ({activeRecord.usdEquivalentNote})
                  </span>
                )}
              </div>

              {/* Itemized Breakdown List */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                  Fee Breakdown
                </span>

                {calculationResult?.breakdown.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.bagLabel}</div>
                      {item.isOverweight && (
                        <div className="text-[10px] text-rose-600 font-bold">
                          Overweight (+{activeRecord.currencySymbol}{item.overweightFee})
                        </div>
                      )}
                    </div>
                    <div className="font-black text-purple-900 text-sm">
                      {item.subtotalFormatted}
                    </div>
                  </div>
                ))}
              </div>

              {/* Policy Note */}
              <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
                {activeRecord.feeNotes}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={handleStartTripWithBags}
                className="w-full h-11 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20 cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pack for {activeRecord.airlineName} in GateReady</span>
              </button>

              {activeGuide && (
                <a
                  href={activeGuide.canonicalPath}
                  className="w-full h-10 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-purple-200"
                >
                  <span>View Full {activeRecord.airlineName} Baggage Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Informative FAQs for SEO */}
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

        {/* Cross-Link Hub */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <a href="/airlines" className="text-purple-700 hover:text-purple-900 underline flex items-center gap-1.5">
            <span>← Directory of all 42 Airline Allowance Guides</span>
          </a>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="/tare-weight" className="hover:text-purple-700">What is Tare Weight?</a>
            <span>·</span>
            <a href="/entry-requirements" className="hover:text-purple-700">Entry Requirements Hub</a>
          </div>
        </div>
      </main>

      {/* Footer */}
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
