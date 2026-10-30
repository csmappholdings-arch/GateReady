import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  ExternalLink, 
  Info, 
  ArrowRight, 
  Luggage, 
  Plane, 
  Globe2, 
  Calendar, 
  Clock, 
  FileCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  AIRLINE_BAGGAGE_FEES, 
  calculateTripBaggageFees, 
  BagFeeCalculationResult 
} from '../data/baggageFeeData';
import { getAirlineFareFamilies } from '../data/airlineFareFamilies';
import { AdPlacement } from './AdPlacement';
import { 
  ENTRY_REQUIREMENTS_DATABASE, 
  getEntryRequirements, 
  PassportNationality, 
  ResolvedEntryRequirement 
} from '../data/entryRequirementsData';
import { BagType } from '../types/travel';

interface LandingQuickCheckersProps {
  onBuildPackingList: (config: {
    carrier: string;
    seatClass: string;
    checkedCount: number;
    carryOnCount: number;
  }) => void;
  onPlanTrip: (destinationCity: string) => void;
}

const LandingQuickCheckersComponent: React.FC<LandingQuickCheckersProps> = ({
  onBuildPackingList,
  onPlanTrip
}) => {
  // --------------------------------------------------------------------------
  // PART 1: STANDALONE BAGGAGE FEE CHECKER STATE & LOGIC
  // --------------------------------------------------------------------------
  const [selectedAirline, setSelectedAirline] = useState<string>('WestJet');
  const [selectedCabin, setSelectedCabin] = useState<string>('Main Cabin / Economy');
  const [checkedCount, setCheckedCount] = useState<number>(2); // Default 2 to reproduce WestJet $35 + $50 = CAD $85 immediately
  const [carryOnCount, setCarryOnCount] = useState<number>(1);

  const airlineFareFamilies = useMemo(() => {
    return getAirlineFareFamilies(selectedAirline);
  }, [selectedAirline]);

  const [selectedFareFamilyId, setSelectedFareFamilyId] = useState<string>('');

  React.useEffect(() => {
    const defaultFam = airlineFareFamilies.find((f) => f.isDefault) || airlineFareFamilies[0];
    setSelectedFareFamilyId(defaultFam ? defaultFam.id : '');
  }, [airlineFareFamilies]);

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
        currentWeightLbs: 45, // Standard safe packed weight
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
    return calculateTripBaggageFees(selectedAirline, simulatedBags, selectedCabin, selectedFareFamilyId);
  }, [selectedAirline, simulatedBags, selectedCabin, selectedFareFamilyId]);

  // Dynamic USD approximation based on active total fee
  const approxUsd = useMemo(() => {
    if (!feeResult) return null;
    return feeResult.usdEquivalentNote || null;
  }, [feeResult]);

  // Fee-bearing bag count (strictly bags that incur fees)
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

  // --------------------------------------------------------------------------
  // PART 2: STANDALONE ENTRY REQUIREMENTS QUICK-CHECK STATE & LOGIC
  // --------------------------------------------------------------------------
  const [nationality, setNationality] = useState<PassportNationality>('CA');
  const [destinationCountry, setDestinationCountry] = useState<string>('Japan');

  // Static entry requirement lookup
  const entryData: ResolvedEntryRequirement = useMemo(() => {
    return getEntryRequirements(destinationCountry, nationality);
  }, [destinationCountry, nationality]);

  // Guaranteed matching official source label and URL for the selected passport
  const officialSourceLabel = nationality === 'CA' ? 'travel.gc.ca Advisory' : 'travel.state.gov Advisory';
  const officialSourceUrl = useMemo(() => {
    if (nationality === 'CA') {
      if (entryData.officialSourceUrl && entryData.officialSourceUrl.includes('travel.gc.ca')) {
        return entryData.officialSourceUrl;
      }
      return `https://travel.gc.ca/destinations/${encodeURIComponent(destinationCountry.toLowerCase().trim().replace(/\s+/g, '-'))}`;
    } else {
      if (entryData.officialSourceUrl && entryData.officialSourceUrl.includes('travel.state.gov')) {
        return entryData.officialSourceUrl;
      }
      return 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages.html';
    }
  }, [nationality, entryData.officialSourceUrl, destinationCountry]);

  const getVisaBadgeStyle = () => {
    switch (entryData.visaStatusType) {
      case 'VISA_FREE':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'ETA_ESTA_REQUIRED':
        return 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'VISA_ON_ARRIVAL':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'VISA_ADVANCE_REQUIRED':
        return 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 space-y-1.5">
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

      {/* 2-Column Responsive Checker Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* ================================================================ */}
        {/* PART 1: STANDALONE BAGGAGE FEE CHECKER CARD                      */}
        {/* ================================================================ */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            {/* Card Top Title Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 border-b border-purple-100 dark:border-purple-900/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                        Baggage Fee Checker
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        42 Airlines Audited
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                      Estimate Airline Bag Fees
                    </h3>
                  </div>
                </div>

                {feeResult?.officialBaggagePageUrl && (
                  <a
                    href={feeResult.officialBaggagePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-2.5 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="View official published airline fee page"
                  >
                    <span>Official Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Inputs Panel */}
            <div className="p-4 sm:p-5 space-y-4 border-b border-purple-100/70 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Airline Dropdown */}
                <div>
                  <label
                    htmlFor="landing-airline-select"
                    className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 dark:text-purple-300 mb-1 cursor-pointer select-none"
                  >
                    Select Airline (42 Available)
                  </label>
                  <select
                    id="landing-airline-select"
                    name="airline"
                    value={selectedAirline}
                    onChange={(e) => setSelectedAirline(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-purple-500 cursor-pointer shadow-2xs relative z-10 pointer-events-auto"
                  >
                    {AIRLINE_BAGGAGE_FEES.map((airline) => (
                      <option key={airline.airlineId} value={airline.airlineName}>
                        {airline.airlineName} ({airline.currency})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cabin / Fare Class */}
                <div>
                  <label
                    htmlFor="landing-fare-family-select"
                    className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 dark:text-purple-300 mb-1 cursor-pointer select-none"
                  >
                    Fare Family / Ticket Tier
                  </label>
                  <select
                    id="landing-fare-family-select"
                    name="fareFamily"
                    value={selectedFareFamilyId}
                    onChange={(e) => setSelectedFareFamilyId(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-purple-500 cursor-pointer shadow-2xs relative z-10 pointer-events-auto"
                  >
                    {airlineFareFamilies.map((fam) => (
                      <option key={fam.id} value={fam.id}>
                        {fam.name} {fam.isDefault ? '(Standard)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Carry-on restriction banner if active fare family prohibits overhead bags */}
              {feeResult?.carryOnRestrictionNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{feeResult.carryOnRestrictionNotice}</span>
                </div>
              )}

              {/* Bag Count Selectors: Checked Bags (0-3) and Carry-Ons (0-2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Checked Bags Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 dark:text-purple-300 mb-1.5 flex items-center justify-between">
                    <span>Checked Bags (to hold)</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">{checkedCount} selected</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-purple-200/80 dark:border-purple-800">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCheckedCount(num)}
                        className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          checkedCount === num
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {num === 0 ? 'None' : `${num} ${num === 1 ? 'Bag' : 'Bags'}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Carry-On Bags Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 dark:text-purple-300 mb-1.5 flex items-center justify-between">
                    <span>Overhead Carry-On Rollers</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">{carryOnCount} selected</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-purple-200/80 dark:border-purple-800">
                    {[0, 1, 2].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCarryOnCount(num)}
                        className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          carryOnCount === num
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
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
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                      {feeResult.totalEstimatedFeeFormatted}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      estimated total · {feeSummaryBagCountText}
                    </span>
                  </div>
                  {approxUsd && (
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      ({approxUsd})
                    </span>
                  )}
                </div>

                {/* Per-Bag Breakdown */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Per-Bag Cost Breakdown:
                  </div>
                  {feeResult.breakdown.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                      No bags selected. Choose 1 or more checked or carry-on bags above.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
                      {feeResult.breakdown.map((item, idx) => (
                        <div
                          key={item.bagId || idx}
                          className="p-2.5 sm:px-3.5 flex items-center justify-between text-xs hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Luggage className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {item.bagLabel}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:inline">
                              ({item.bagType === 'CHECKED' ? 'Checked Luggage' : 'Carry-On Overhead'})
                            </span>
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                            {item.subtotalFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Airline Fee Notes / UltraBasic Alert */}
                {feeResult.feeNotes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-purple-50/50 dark:bg-purple-950/20 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <strong className="text-purple-900 dark:text-purple-300">Policy Notes: </strong>
                    {feeResult.feeNotes}
                  </p>
                )}

                {/* Estimate Disclaimer with Last-Verified Date */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="leading-snug">{feeResult.disclaimer}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer with secondary utility CTA */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-t border-purple-100 dark:border-purple-900/40">
            <button
              type="button"
              onClick={() => {
                onBuildPackingList({
                  carrier: selectedAirline,
                  seatClass: selectedCabin,
                  checkedCount,
                  carryOnCount
                });
              }}
              className="w-full h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer border border-slate-700/30"
            >
              <span>Build my full packing list →</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PART 2: STANDALONE ENTRY REQUIREMENTS QUICK-CHECK CARD           */}
        {/* ================================================================ */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            {/* Card Top Title Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 border-b border-purple-100 dark:border-purple-900/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                        Entry Requirements Quick-Check
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        Last verified {entryData.lastVerified}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                      {`Passport & Visa Rules for ${entryData.matchedDestinationName}`}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs Panel: Passport Toggle & Destination Country */}
            <div className="p-4 sm:p-5 space-y-4 border-b border-purple-100/70 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                {/* Passport Nationality Switcher with High-Contrast Active States */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 dark:text-purple-300 mb-1.5">
                    Passport Nationality
                  </label>
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setNationality('CA')}
                      className={`flex-1 h-8 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        nationality === 'CA'
                          ? 'bg-purple-600 text-white font-black shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>🇨🇦 Canada</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNationality('US')}
                      className={`flex-1 h-8 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        nationality === 'US'
                          ? 'bg-purple-600 text-white font-black shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>🇺🇸 United States</span>
                    </button>
                  </div>
                </div>

                {/* Destination Country Dropdown */}
                <div>
                  <label
                    htmlFor="landing-destination-country-select"
                    className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 dark:text-purple-300 mb-1.5 cursor-pointer select-none"
                  >
                    Destination Country
                  </label>
                  <select
                    id="landing-destination-country-select"
                    name="destinationCountry"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-purple-500 cursor-pointer shadow-2xs relative z-10 pointer-events-auto"
                  >
                    {ENTRY_REQUIREMENTS_DATABASE.map((item) => (
                      <option key={item.countryCode} value={item.destinationCountry}>
                        {item.destinationCountry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* Row 1: Passport Validity */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
                    Passport Validity
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {entryData.passportValidityRule}
                  </span>
                </div>
              </div>

              {/* Row 2: Visa Requirement */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <FileCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
                    Visa Requirement
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${getVisaBadgeStyle()}`}>
                    {entryData.visaBadgeText}
                  </span>
                </div>
              </div>

              {/* Row 3: Max Stay */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
                    Maximum Stay
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {entryData.maxStay}
                  </span>
                </div>
              </div>

              {/* Row 4: Official Source Link (STRICTLY Follows Selected Passport) */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <Globe2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
                    Official Source
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <a
                    href={officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold hover:underline"
                  >
                    <span>{officialSourceLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Traveler Notice if available */}
            {entryData.notes && (
              <div className="p-3.5 sm:px-5 bg-purple-50/50 dark:bg-purple-950/20 border-t border-purple-100 dark:border-purple-900/40 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-purple-900 dark:text-purple-200">Traveler Notice: </strong>
                {entryData.notes}
              </div>
            )}

            {/* Disclaimer */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="leading-snug">{entryData.disclaimer}</span>
            </div>
          </div>

          {/* Bottom Action Footer with secondary utility CTA */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-t border-purple-100 dark:border-purple-900/40">
            <button
              type="button"
              onClick={() => onPlanTrip(destinationCountry)}
              className="w-full h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer border border-slate-700/30"
            >
              <span>Plan this trip →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Non-intrusive ad slot below standalone fee checker result */}
      <AdPlacement slotId="ad-slot-landing-fee-checker" format="inline" className="mt-8" />
    </section>
  );
};

export const LandingQuickCheckers = React.memo(LandingQuickCheckersComponent);
