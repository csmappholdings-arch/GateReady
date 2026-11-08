import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Luggage, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  Briefcase,
  Layers,
  Scale
} from 'lucide-react';
import { AIRLINES_DATABASE, Airline } from '../data/airlinesData';
import { airlineLimits } from '../data/allowances';
import { 
  AIRLINE_BAGGAGE_FEES, 
  calculateTripBaggageFees,
  BagFeeCalculationResult 
} from '../data/baggageFeeData';
import { getAirlineFareFamilies } from '../data/airlineFareFamilies';
import { AirportCitySearchInput } from './AirportCitySearchInput';
import { AirportCity } from '../data/airportsData';
import { BagType } from '../types/travel';
import { trackEvent } from '../utils/analytics';

export interface TripPreviewConfig {
  originCity: string;
  destinationCity: string;
  airline: string;
  departureDate: string;
  travelersCount: number;
  checkedCount: number;
  carryOnCount: number;
}

interface InteractiveTripPreviewProps {
  onSaveAndCreateAccount: (preview: TripPreviewConfig) => void;
  onOpenTripCreator: (preview: TripPreviewConfig) => void;
}

export const InteractiveTripPreview: React.FC<InteractiveTripPreviewProps> = ({
  onSaveAndCreateAccount,
  onOpenTripCreator
}) => {
  // Input fields
  const [originCity, setOriginCity] = useState('Toronto (YYZ)');
  const [destinationCity, setDestinationCity] = useState('London (LHR)');
  const [selectedAirline, setSelectedAirline] = useState('Air Canada');
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [checkedCount, setCheckedCount] = useState<number>(1);
  const [carryOnCount, setCarryOnCount] = useState<number>(1);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // Match airline data
  const airlineRecord = useMemo(() => {
    const match = AIRLINE_BAGGAGE_FEES.find(
      (a) => a.airlineName.toLowerCase() === selectedAirline.toLowerCase() ||
             a.aliases.some((alias) => alias.toLowerCase() === selectedAirline.toLowerCase())
    );
    return match || AIRLINE_BAGGAGE_FEES[0];
  }, [selectedAirline]);

  const airlineLimit = useMemo(() => {
    const match = airlineLimits.find(
      (l) => l.company.toLowerCase() === selectedAirline.toLowerCase() ||
             selectedAirline.toLowerCase().includes(l.company.toLowerCase()) ||
             l.company.toLowerCase().includes(selectedAirline.toLowerCase())
    );
    return match || airlineLimits[0];
  }, [selectedAirline]);

  const fareFamilies = useMemo(() => {
    return getAirlineFareFamilies(airlineRecord.airlineId || airlineRecord.airlineName);
  }, [airlineRecord]);

  // Compute fees
  const feeResult: BagFeeCalculationResult = useMemo(() => {
    const simulatedBags: Array<{
      id: string;
      label: string;
      type: BagType;
      currentWeightLbs: number;
      maxWeightLimitLbs?: number;
    }> = [];

    for (let i = 0; i < checkedCount; i++) {
      simulatedBags.push({
        id: `prev-chk-${i + 1}`,
        label: checkedCount === 1 ? 'Checked Bag' : `Checked Bag ${i + 1}`,
        type: 'CHECKED',
        currentWeightLbs: 44,
        maxWeightLimitLbs: 50
      });
    }

    for (let i = 0; i < carryOnCount; i++) {
      simulatedBags.push({
        id: `prev-co-${i + 1}`,
        label: carryOnCount === 1 ? 'Carry-On Roller' : `Carry-On ${i + 1}`,
        type: 'CARRY_ON',
        currentWeightLbs: 18,
        maxWeightLimitLbs: 22
      });
    }

    const defaultFam = fareFamilies.find((f) => f.isDefault) || fareFamilies[0];
    const computed = calculateTripBaggageFees(
      airlineRecord.airlineName,
      simulatedBags,
      defaultFam ? defaultFam.id : undefined
    );

    const totalFee = (checkedCount * airlineRecord.firstCheckedFee) + (carryOnCount * airlineRecord.carryOnFee);
    return computed || {
      hasFeeData: true,
      airlineName: airlineRecord.airlineName,
      currency: airlineRecord.currency,
      currencySymbol: airlineRecord.currencySymbol,
      totalEstimatedFee: totalFee,
      totalEstimatedFeeFormatted: `${airlineRecord.currencySymbol}${totalFee.toFixed(2)} ${airlineRecord.currency}`,
      breakdown: [],
      overweightBagCount: 0,
      totalOverweightFee: 0,
      feeNotes: airlineRecord.feeNotes,
      lastVerified: airlineRecord.lastVerified,
      officialBaggagePageUrl: airlineRecord.officialBaggagePageUrl,
      disclaimer: 'Estimate from published airline fee tables.'
    };
  }, [airlineRecord, fareFamilies, checkedCount, carryOnCount]);

  const previewConfig: TripPreviewConfig = {
    originCity,
    destinationCity,
    airline: selectedAirline,
    departureDate,
    travelersCount,
    checkedCount,
    carryOnCount
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
    trackEvent('trip_preview_completed', {
      airline: selectedAirline,
      origin: originCity,
      destination: destinationCity,
      travelers: travelersCount,
      checked_bags: checkedCount,
      carryon_bags: carryOnCount
    });
  };

  return (
    <section 
      id="interactive-trip-preview"
      className="relative w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-900 text-white rounded-3xl my-6 shadow-2xl border border-purple-500/30 overflow-hidden"
    >
      {/* Decorative Aviation Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/60 border border-purple-400/40 text-[11px] font-black uppercase tracking-wider text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Interactive Trip Preview · Test Before You Sign Up</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            See Your Airline's Exact Baggage Rules & Estimated Fees
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Enter your flight details below to get instant carry-on dimensions, checked luggage allowances, and estimated fees from published 2026 airline tables.
          </p>
        </div>

        {/* Input Form Card */}
        <form 
          onSubmit={handleCalculate}
          className="p-5 sm:p-7 rounded-3xl bg-slate-800/90 border border-purple-400/30 shadow-xl backdrop-blur-md space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Departure */}
            <div>
              <AirportCitySearchInput
                label="Departure City / Airport"
                placeholder="e.g. Toronto (YYZ)"
                value={originCity}
                onChange={(city) => {
                  setOriginCity(city);
                  trackEvent('trip_preview_started', { field: 'origin' });
                }}
                iconType="origin"
                inputClassName="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>

            {/* 2. Destination */}
            <div>
              <AirportCitySearchInput
                label="Destination City / Airport"
                placeholder="e.g. London (LHR)"
                value={destinationCity}
                onChange={(city) => {
                  setDestinationCity(city);
                  trackEvent('trip_preview_started', { field: 'destination' });
                }}
                iconType="destination"
                inputClassName="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
              />
            </div>

            {/* 3. Airline Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-purple-400" />
                <span>Airline (42 Audited)</span>
              </label>
              <select
                value={selectedAirline}
                onChange={(e) => {
                  setSelectedAirline(e.target.value);
                  trackEvent('trip_preview_started', { field: 'airline', value: e.target.value });
                }}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {AIRLINES_DATABASE.map((a) => (
                  <option key={a.code + a.name} value={a.name} className="bg-slate-900 text-white">
                    {a.flag} {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Departure Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Departure Date</span>
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Row 2: Travelers & Bag Quantities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-700/80">
            {/* Travelers */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Number of Travellers</span>
                </span>
                <span className="text-[11px] text-purple-300 font-mono font-bold">{travelersCount}</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTravelersCount(num)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      travelersCount === num
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {num === 4 ? '4+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Checked Bags */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-purple-400" />
                  <span>Checked Suitcases</span>
                </span>
                <span className="text-[11px] text-purple-300 font-mono font-bold">{checkedCount}</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCheckedCount(num)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      checkedCount === num
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {num === 3 ? '3+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Carry-On Rollers */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                  <span>Overhead Carry-On Rollers</span>
                </span>
                <span className="text-[11px] text-purple-300 font-mono font-bold">{carryOnCount}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCarryOnCount(num)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      carryOnCount === num
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <span className="text-xs text-slate-400">
              ⚡ Live allowance lookup using published 2026 airline tariff data
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>Refresh Allowance & Fee Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Dynamic Preview Results Card */}
        {hasCalculated && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Summary Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-slate-800 to-indigo-900/60 border border-purple-400/40 flex items-center justify-between flex-wrap gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-white">{selectedAirline}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs font-semibold text-purple-300">
                      {originCity || 'Departure'} → {destinationCity || 'Destination'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <span>{departureDate || 'Upcoming'}</span>
                    <span>·</span>
                    <span>{travelersCount} {travelersCount === 1 ? 'Traveler' : 'Travelers'}</span>
                    <span>·</span>
                    <span>{checkedCount} Checked, {carryOnCount} Carry-On</span>
                  </div>
                </div>
              </div>

              {/* Fee total callout */}
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                  Estimated Baggage Fees
                </div>
                <div className="text-2xl font-black text-white">
                  {feeResult.currencySymbol}{feeResult.totalEstimatedFee.toFixed(2)} {feeResult.currency}
                </div>
                <div className="text-[11px] text-slate-400">
                  {feeResult.totalEstimatedFee === 0 ? '✓ Free allowances cover selection' : 'Based on standard published fees'}
                </div>
              </div>
            </div>

            {/* 3 Allowance Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Carry-On Allowance */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-400 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" /> Carry-On Limits
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                    Sizer Rule
                  </span>
                </div>
                <div className="text-base font-black text-white">
                  {airlineLimit.carryOnLimit}
                </div>
                <p className="text-xs text-slate-400">
                  <strong>Weight Limit:</strong> {airlineLimit.carryOnWeightLimit}
                </p>
                <p className="text-[11px] text-slate-400">
                  <strong>Personal Item:</strong> {airlineLimit.personalLimit}
                </p>
              </div>

              {/* Checked Bag Allowance */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-400 flex items-center gap-1.5">
                    <Luggage className="w-4 h-4" /> Checked Luggage
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                    Weight Cap
                  </span>
                </div>
                <div className="text-base font-black text-white">
                  {airlineLimit.checkedWeightLimit}
                </div>
                <p className="text-xs text-slate-400">
                  <strong>Max Linear Size:</strong> {airlineLimit.checkedLimit}
                </p>
                <p className="text-[11px] text-slate-400">
                  Overweight charge begins immediately at 51 lbs (23.1 kg).
                </p>
              </div>

              {/* Potential Warnings & Notices */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Gate Readiness Intel
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                    Security Guard
                  </span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">·</span>
                    <span>Liquids over 3.4 oz (100ml) must pack in checked luggage.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">·</span>
                    <span>Suitcase tare weight averages 6–9 lbs of your 50 lbs limit.</span>
                  </li>
                  {airlineLimit.notes && (
                    <li className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                      <span className="text-purple-400 font-bold">·</span>
                      <span>{airlineLimit.notes}</span>
                    </li>
                  )}
                </ul>
              </div>

            </div>

            {/* Verification & Source Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified {airlineRecord.lastVerified} · Published airline fee tables</span>
              </span>
              {airlineRecord.officialBaggagePageUrl && (
                <a
                  href={airlineRecord.officialBaggagePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 underline decoration-dotted"
                >
                  <span>Official {selectedAirline} baggage policy</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* High-Converting Registration Opportunity Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-900 border-2 border-purple-400 shadow-2xl text-center space-y-4">
              <div className="space-y-2 max-w-2xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Save Your Trip and Get Travel Ready
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                  Create your free GateReady account to save your airline information, manage your luggage, build your packing checklist, and prepare for departure.
                </p>
              </div>

              {/* 2 Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('primary_cta_click', { source: 'trip_preview_register' });
                    onSaveAndCreateAccount(previewConfig);
                  }}
                  className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-white hover:bg-slate-100 text-purple-900 font-black text-xs sm:text-sm tracking-wide shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>CREATE MY FREE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4 text-purple-900" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackEvent('primary_cta_click', { source: 'trip_preview_continue_creator' });
                    onOpenTripCreator(previewConfig);
                  }}
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-purple-700/60 hover:bg-purple-700 border border-purple-300/40 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue in Trip Creator (No Account Needed)</span>
                </button>
              </div>

              <div className="text-[11px] text-purple-200/90 pt-1 flex items-center justify-center gap-3 flex-wrap">
                <span>✓ 100% Free Forever Plan</span>
                <span>·</span>
                <span>✓ Includes 7-day Platinum trial automatically</span>
                <span>·</span>
                <span>✓ No credit card required</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
