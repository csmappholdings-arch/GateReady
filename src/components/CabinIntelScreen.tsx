import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { useSubscription } from '../context/SubscriptionContext';
import { usePacking } from '../context/PackingContext';
import { AIRCRAFT_DATABASE, findAircraftInfo, AircraftInfo } from '../data/aircraftData';
import { 
  Plane, 
  Train,
  Bus,
  Ship,
  Car,
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
  Check,
  ShieldCheck,
  Wifi,
  Coffee,
  Layers,
  Compass
} from 'lucide-react';

interface CabinIntelScreenProps {
  trip: Trip;
}

export const CabinIntelScreen: React.FC<CabinIntelScreenProps> = ({ trip }) => {
  const { isPro, openPaywall } = useSubscription();
  const { updateTripDetails } = usePacking();

  const isFlight = (trip.travelType === 'PLANE' || !trip.travelType) && !['CAR', 'TRAIN', 'CRUISE', 'BUS'].includes(trip.travelType || '');
  const isTrain = trip.travelType === 'TRAIN';
  const isCar = trip.travelType === 'CAR';
  const isCruise = trip.travelType === 'CRUISE';
  const isBus = trip.travelType === 'BUS';

  // Selected aircraft state for flight mode
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

  const modeTitle = isTrain 
    ? 'Train Coach & In-Seat Power Intel'
    : isBus
    ? 'Bus Seating & Amenities Intel'
    : isCruise
    ? 'Stateroom & Ship Electrical Intel'
    : isCar
    ? 'Vehicle Cargo & 12V Power Intel'
    : 'Aircraft & Cabin Power Intel';

  const modeSubtitle = isTrain
    ? 'Standard 110V AC plug locations, overhead luggage rack clearances, end-of-car heavy baggage racks, and quiet car amenities for rail journeys.'
    : isBus
    ? 'Under-coach cargo bay limits, onboard USB charging, overhead parcel racks, and intercity coach travel policies.'
    : isCruise
    ? 'Stateroom electrical outlet count, surge protector confiscation warnings, under-bed suitcase clearances, and sea day connectivity.'
    : isCar
    ? 'Trunk packing layout, 12V auxiliary sockets, inverter capacity, USB-C fast charging, and road trip safety gear stowage.'
    : 'Overhead bin sizing, valet gate-check alerts, in-seat plug specs, and under-seat clearances for 20+ commercial aircraft.';

  // If user is not Pro, lock down the screen
  if (!isPro) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-24 space-y-6">
        {/* Screen Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100 dark:border-purple-950/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {modeTitle}
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Crown className="w-2.5 h-2.5 fill-white" /> Silver+ Feature
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {modeSubtitle}
            </p>
          </div>
        </div>

        {/* Lock Screen Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 border-2 border-amber-400/50 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              <span>Silver+ Exclusive</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {modeTitle} is Locked
            </h2>

            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              {isFlight
                ? 'Never get caught off-guard by forced valet gate checks, oversized bags, or dead devices at 35,000 feet. Upgrade to Silver ($1.99/mo), Gold, or Platinum to unlock full aircraft power outlet and bin clearance specifications.'
                : isTrain
                ? 'Unlock detailed rail seating schematics, 120V AC outlet locations, open overhead rack capacities, and end-of-car luggage tower specs for Amtrak, VIA Rail, Eurostar, and regional rail lines.'
                : isBus
                ? 'Unlock coach luggage hold guidelines, dual USB & AC charging availability, and overhead parcel shelf dimensions.'
                : isCruise
                ? 'Unlock stateroom electrical outlet counts, critical surge protector confiscation rules, and under-bed suitcase clearances.'
                : 'Unlock 12V auxiliary power thresholds, vehicle trunk packing geometry, and roadside safety equipment checklists.'}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => openPaywall(`Upgrade to Silver, Gold, or Platinum to unlock full ${modeTitle}.`)}
                className="h-11 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95 transition-all"
              >
                <Crown className="w-4 h-4 fill-purple-950" />
                <span>Upgrade to Silver+ to Unlock {isFlight ? 'Cabin' : isTrain ? 'Rail' : isBus ? 'Coach' : isCruise ? 'Ship' : 'Cargo'} Intel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Train Mode View
  if (isTrain) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-24 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100 dark:border-purple-950/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Train className="w-4 h-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Train Coach & In-Seat Power Intel
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                <Crown className="w-2.5 h-2.5 fill-white inline mr-1" /> Silver+
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Standard 110V AC plug locations, overhead luggage rack clearances, and end-of-car heavy baggage racks.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>In-Seat AC Outlets</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">120V Standard Grounded</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Available at window seats and paired coach seats on Amtrak, VIA Rail, and modern regional trains.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Luggage className="w-4 h-4" />
                <span>Overhead Open Racks</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Fits 28" Suitcases</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Continuous open shelving runs above seats. Unlike airplane bins, they easily accommodate large rolling bags wheels-first.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>End-of-Car Towers</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Heavy Luggage Shelves</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Multi-tier luggage towers near the vestibule doors accommodate bags up to 50 lbs (23 kg) at zero surcharge.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Wifi className="w-4 h-4" />
                <span>Onboard Wi-Fi & Cafe</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Complimentary Basic</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Cellular train Wi-Fi for email/browsing. Café lounge cars feature spacious booth seating with dedicated power sockets.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Rail Travel Pro Tips</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200 list-disc list-inside">
              <li>Always keep high-value items, laptops, and prescribed medicines in your personal item at your seat, not in the car entrance luggage tower.</li>
              <li>Trains have zero TSA liquid limitations—feel free to bring full-sized toiletries, water bottles, and outside snacks onboard.</li>
              <li>If traveling on Amtrak Northeast Regional or Acela, check out the Quiet Car where phone conversations and audio playback are prohibited.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Bus Mode View
  if (isBus) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-24 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100 dark:border-purple-950/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Bus className="w-4 h-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Bus Seating & Amenities Intel
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                <Crown className="w-2.5 h-2.5 fill-white inline mr-1" /> Silver+
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Under-coach cargo hold limits, onboard USB/AC charging, and overhead parcel rack sizing.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Onboard USB & Outlets</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Dual USB & 110V AC</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Modern FlixBus, Greyhound, and Megabus motorcoaches feature power outlets beneath or between seats.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Luggage className="w-4 h-4" />
                <span>Under-Coach Luggage Hold</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">1 Checked Bag (Up to 50 lbs)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Driver loads large luggage into the under-carriage cargo compartments. Baggage tags are provided upon boarding.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Maximize2 className="w-4 h-4" />
                <span>Overhead Parcel Rack</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Small Backpacks & Coats</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Overhead parcel shelves are narrow (approx. 9" depth); rollaboards will not fit and must go under the coach.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Intercity Bus Travel Advice</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200 list-disc list-inside">
              <li>Keep all electronics, charging cords, snacks, and medication in a compact daypack under your seat.</li>
              <li>Arrive 20-30 minutes prior to scheduled departure time to secure preferred seating and baggage loading.</li>
              <li>Zero liquid restrictions: bring bottled water, coffee, and meals onboard without airport-style security.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Cruise Mode View
  if (isCruise) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-24 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100 dark:border-purple-950/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Ship className="w-4 h-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Stateroom & Ship Electrical Intel
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                <Crown className="w-2.5 h-2.5 fill-white inline mr-1" /> Silver+
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Stateroom outlet count, surge protector confiscation warnings, and under-bed suitcase clearances.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Stateroom Electrical Plugs</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">1-2 US (110V) & 1 EU (220V)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Located at the vanity desk. Modern ships (e.g., Royal Caribbean, Celebrity, NCL) also provide bedside USB ports.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Maximize2 className="w-4 h-4" />
                <span>Under-Bed Luggage Clearance</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">12" to 14" Bed Frame Height</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Empty hard-shell suitcases slide flat under the stateroom bed frame to keep the cabin clutter-free during the voyage.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Luggage className="w-4 h-4" />
                <span>Luggage Delivery Protocol</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Porter Drop-off at Terminal</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Checked suitcases are handed to terminal porters with cabin tags and delivered directly outside your stateroom door by evening.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2">
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Critical Maritime Safety Rule: Surge Protectors Confiscated!</span>
            </h4>
            <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed">
              Standard household power strips with surge suppressors are <strong>strictly banned and confiscated by ship security</strong> during terminal screening due to shipboard ungrounded delta electrical systems. Bring <strong>non-surge multi-plug adapters</strong> or USB charging hubs instead.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-2">
            <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Embarkation Day Luggage Essentials</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-purple-950 dark:text-purple-200 list-disc list-inside">
              <li>Always carry your passport, cruise boarding pass, credit cards, and essential medications in your personal day bag.</li>
              <li>Pack swimsuits, sunscreen, and evening dinner clothes in your carry-on because checked bags may arrive hours after ship departure.</li>
              <li>Most cruise lines permit guests to bring 1 unopened 750ml bottle of wine or champagne per adult in carry-on baggage.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Car / Road Trip Mode View
  if (isCar) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-24 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100 dark:border-purple-950/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Vehicle Cargo & 12V Power Intel
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                <Crown className="w-2.5 h-2.5 fill-white inline mr-1" /> Silver+
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Trunk packing layout, 12V auxiliary sockets, inverter capacity, and road trip safety gear stowage.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>12V Sockets & USB-PD</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">120W-180W Auxiliary Ports</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Front console and trunk 12V cigarette sockets handle high-wattage USB-C PD car chargers or 150W pure sine wave laptop inverters.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Luggage className="w-4 h-4" />
                <span>Trunk Center of Gravity</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Low & Forward Loading</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Position the heaviest hard-shell suitcases flat on the trunk floor pressed firmly against the rear seat back to maintain handling stability.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Glovebox & Emergency Kit</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Instant Accessibility</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Keep registration, insurance cards, tire gauge, sunglasses, and the first aid kit accessible without unpacking trunk cargo.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Road Trip Optimization Tips</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200 list-disc list-inside">
              <li>Keep an insulated cooler and snack basket on the rear floorboard for easy passenger access during highway cruising.</li>
              <li>Stow emergency tire inflator, jumper cables, and roadside flares on the trunk perimeter so they remain accessible when luggage is fully packed.</li>
              <li>Zero baggage weight surcharges—maximize trunk space with soft-sided duffel bags that compress to fit vehicle contour spaces.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Flight Mode View (Default with Aircraft Database)
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-24 space-y-5">
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
              <Crown className="w-2.5 h-2.5 fill-white inline mr-1" /> Silver+
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
            className="w-full h-10 pl-9 pr-24 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Find
          </button>
        </form>

        {/* Quick Popular Aircraft Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {AIRCRAFT_DATABASE.map((ac) => {
            const isSelected = selectedAircraft.id === ac.id;
            return (
              <button
                key={ac.id}
                type="button"
                onClick={() => handleSelectAircraft(ac)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-950/60 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                }`}
              >
                <Plane className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-purple-500'}`} />
                <span>{ac.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {ac.manufacturer}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Aircraft Intel Overview */}
      <div className="rounded-3xl border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-purple-50 dark:border-purple-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                {selectedAircraft.manufacturer} · {selectedAircraft.category}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {selectedAircraft.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Common model codes: <strong className="text-slate-700 dark:text-slate-300">{selectedAircraft.aliases.slice(0, 5).join(', ')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {getRiskBadge(selectedAircraft.overheadBins.gateCheckRisk)}
          </div>
        </div>

        {/* Section 1: In-Seat Power & Plugs Telemetry */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>In-Seat Electrical Power Specs</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Economy Outlets */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Economy Class Power
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                {selectedAircraft.inSeatPower.economy}
              </p>
            </div>

            {/* USB Charging */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                USB Charging Ports
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                {selectedAircraft.inSeatPower.usbPorts}
              </p>
            </div>

            {/* Socket Type & Max Wattage */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Socket Compatibility & Wattage
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                {selectedAircraft.inSeatPower.socketCompatibility} ({selectedAircraft.inSeatPower.maxWattage})
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Overhead Bin Geometry & Rollaboard Fit */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Luggage className="w-4 h-4 text-purple-600" />
              <span>Overhead Bin Fit Architecture</span>
            </h3>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {selectedAircraft.overheadBins.fitRollaboard === 'YES_WHEELS_FIRST'
                ? 'Fits 22" Roller Wheels-First'
                : selectedAircraft.overheadBins.fitRollaboard === 'YES_SIDEWAYS'
                ? 'Fits 22" Roller Sideways'
                : 'Valet Gate Check Mandatory'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedAircraft.overheadBins.fitDescription}
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedAircraft.overheadBins.riskSummary}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedAircraft.overheadBins.valetTagGuidance}
              </p>
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
              <span>Frequent Flyer Insider Tips for this Aircraft</span>
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
    </div>
  );
};
