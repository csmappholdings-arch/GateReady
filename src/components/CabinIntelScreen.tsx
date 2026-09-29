import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { useSubscription } from '../context/SubscriptionContext';
import { usePacking } from '../context/PackingContext';
import { AIRCRAFT_DATABASE, findAircraftInfo, AircraftInfo } from '../data/aircraftData';
import { 
  Plane, 
  Zap, 
  Luggage, 
  AlertTriangle, 
  CheckCircle2, 
  Crown, 
  Sparkles, 
  Info, 
  BatteryCharging, 
  Maximize2, 
  ShieldAlert, 
  HelpCircle,
  Search,
  Check
} from 'lucide-react';

interface CabinIntelScreenProps {
  trip: Trip;
}

export const CabinIntelScreen: React.FC<CabinIntelScreenProps> = ({ trip }) => {
  const { isPro, openPaywall } = useSubscription();
  const { updateTripDetails } = usePacking();

  // Selected aircraft state
  const initialAircraft = trip.aircraftType 
    ? findAircraftInfo(trip.aircraftType) || AIRCRAFT_DATABASE[0]
    : AIRCRAFT_DATABASE[0];

  const [selectedAircraft, setSelectedAircraft] = useState<AircraftInfo>(initialAircraft);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedConfirmation, setSavedConfirmation] = useState(false);

  const handleSelectAircraft = (aircraft: AircraftInfo) => {
    setSelectedAircraft(aircraft);
    updateTripDetails(trip.id, { aircraftType: aircraft.name });
    setSavedConfirmation(true);
    setTimeout(() => setSavedConfirmation(false), 2000);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = findAircraftInfo(searchQuery);
    if (found) {
      handleSelectAircraft(found);
    }
  };

  const getRiskBadge = (risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_GATE_CHECK') => {
    switch (risk) {
      case 'LOW':
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Low Gate-Check Risk</span>
          </span>
        );
      case 'MODERATE':
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Moderate (Boarding Group 4-6 Risk)</span>
          </span>
        );
      case 'HIGH':
      case 'CRITICAL_GATE_CHECK':
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Critical: Valet Gate Check Mandate</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-5">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100 dark:border-purple-950/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Aircraft & Cabin Power Intel
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
              <Crown className="w-2.5 h-2.5 fill-white inline mr-1" /> Pro
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Overhead bin sizing, gate-check alerts, in-seat plug specs, and under-seat clearances for your aircraft.
          </p>
        </div>

        {/* Saved feedback */}
        {savedConfirmation && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Saved to {trip.name}!</span>
          </span>
        )}
      </div>

      {/* Pro Lockout Blocker (If Free User) */}
      {!isPro ? (
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-purple-500/40 text-center max-w-2xl mx-auto my-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <Crown className="w-8 h-8 fill-amber-300" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-400/25 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Gate Ready Pro Feature
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Aircraft Cabin & In-Seat Power Intel
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-2 max-w-lg mx-auto leading-relaxed">
            Upgrade to Gate Ready Pro to unlock in-seat AC plug specs (110V power), USB-A & USB-C fast charging availability, overhead bin clearance sizing, and valet gate-check alerts across 20+ commercial aircraft.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openPaywall("Upgrade to Gate Ready Pro to access the Aircraft Cabin & Power Intel Database.")}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-purple-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-400/30 transition-all cursor-pointer active:scale-95"
            >
              <Crown className="w-4 h-4 fill-purple-950" />
              <span>Unlock Cabin & Plugs Intel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-purple-800/60 text-left">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Zap className="w-5 h-5 text-amber-400 mb-1" />
              <p className="text-xs font-bold text-white">In-Seat Outlets</p>
              <p className="text-[11px] text-purple-300">110V AC plug locations for laptops & devices</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Luggage className="w-5 h-5 text-indigo-400 mb-1" />
              <p className="text-xs font-bold text-white">Overhead Bin Fit</p>
              <p className="text-[11px] text-purple-300">Space-Bins vs Regional jet roller restrictions</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <AlertTriangle className="w-5 h-5 text-rose-400 mb-1" />
              <p className="text-xs font-bold text-white">Gate-Check Risk</p>
              <p className="text-[11px] text-purple-300">Boarding group probability of forced gate-checking</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Aircraft Selector Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Select or Search Aircraft Model
        </label>
        
        {/* Search Input */}
        <form onSubmit={handleCustomSearch} className="relative">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by model or code (e.g. 737 MAX, A321neo, E175, CRJ-900, 787)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-20 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold cursor-pointer"
          >
            Find
          </button>
        </form>

        {/* Popular Aircraft Quick Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {AIRCRAFT_DATABASE.map((ac) => {
            const isSelected = selectedAircraft.id === ac.id;
            return (
              <button
                key={ac.id}
                onClick={() => handleSelectAircraft(ac)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm ring-2 ring-purple-600/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>{ac.name.split(' ')[0]} {ac.name.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Aircraft Overview Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/60 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 rounded-md">
                {selectedAircraft.category}
              </span>
              <span className="text-xs text-slate-400">
                Manufacturer: {selectedAircraft.manufacturer}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {selectedAircraft.name}
            </h2>
          </div>

          <div className="shrink-0">
            {getRiskBadge(selectedAircraft.overheadBins.gateCheckRisk)}
          </div>
        </div>

        {/* Section 1: Overhead Bins & Gate-Check Risk */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-white dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-slate-900 border border-purple-200 dark:border-purple-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Luggage className="w-4 h-4 text-purple-600" />
              <span>Overhead Bin Compatibility & 22" Carry-On Fit</span>
            </h3>
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${
              selectedAircraft.overheadBins.fitRollaboard === 'NO_GATE_CHECK_VALET'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
            }`}>
              {selectedAircraft.overheadBins.fitRollaboard === 'YES_WHEELS_FIRST' ? 'Fits Wheels First' : selectedAircraft.overheadBins.fitRollaboard === 'YES_SIDEWAYS' ? 'Fits Sideways' : 'Valet Gate Check Only'}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {selectedAircraft.overheadBins.fitDescription}
          </p>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-purple-100 dark:border-purple-900/60 text-xs space-y-1">
            <p className="font-bold text-purple-950 dark:text-purple-200">
              Gate-Check & Valet Guidance:
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {selectedAircraft.overheadBins.valetTagGuidance}
            </p>
          </div>
        </div>

        {/* Section 2: In-Seat Power, Sockets & Adapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Power Plugs & Sockets */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>In-Seat Electrical Sockets & Plugs</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="pb-2 border-b border-slate-200 dark:border-slate-700/60">
                <span className="font-bold text-purple-700 dark:text-purple-400 block text-[11px]">
                  First / Business Class:
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedAircraft.inSeatPower.firstBusiness}
                </span>
              </div>

              <div className="pb-2 border-b border-slate-200 dark:border-slate-700/60">
                <span className="font-bold text-purple-700 dark:text-purple-400 block text-[11px]">
                  Economy / Main Cabin:
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedAircraft.inSeatPower.economy}
                </span>
              </div>

              <div>
                <span className="font-bold text-purple-700 dark:text-purple-400 block text-[11px]">
                  USB Charging Ports:
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedAircraft.inSeatPower.usbPorts}
                </span>
              </div>
            </div>
          </div>

          {/* Adapter & Wattage Rules */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
              <span>Adapter & Wattage Guide</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900">
                <strong className="text-purple-950 dark:text-purple-200 block mb-0.5">
                  Universal Plug Socket Compatibility:
                </strong>
                <p className="text-[11px] leading-relaxed text-purple-900 dark:text-purple-300">
                  {selectedAircraft.inSeatPower.socketCompatibility}
                </p>
              </div>

              <div>
                <strong className="block text-[11px] text-slate-900 dark:text-white">
                  Max Power Output Limit:
                </strong>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedAircraft.inSeatPower.maxWattage}
                </p>
              </div>

              <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400 text-[11px] font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  TSA & FAA Mandatory: All external lithium power banks must be kept in the passenger cabin. Do not place power banks in checked suitcases.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Under-Seat Footwell Clearances */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-blue-500" />
            <span>Under-Seat Storage (Personal Item Sizer & Legroom)</span>
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Usable under-seat dimensions: <strong className="text-slate-800 dark:text-slate-200">{selectedAircraft.underSeatClearance.dimensions}</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                Window Seat
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedAircraft.underSeatClearance.windowSeatNote}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                Middle Seat
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedAircraft.underSeatClearance.middleSeatNote}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                Aisle Seat
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedAircraft.underSeatClearance.aisleSeatNote}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Frequent Flyer Tips */}
        {selectedAircraft.frequentFlyerTips.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Frequent Flyer Pro Tips for this Aircraft</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200 list-disc list-inside">
              {selectedAircraft.frequentFlyerTips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};
