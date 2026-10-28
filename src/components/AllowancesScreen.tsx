import React, { useState } from 'react';
import { Trip, BaggageLimitInfo } from '../types/travel';
import { airlineLimits, trainLimits, busLimits, cruiseLimits, carCapacities, tsa311Rules } from '../data/allowances';
import { 
  Plane, 
  Train, 
  Bus,
  Ship,
  Car, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  BatteryCharging,
  Droplets,
  AlertTriangle,
  Sparkles,
  Baby,
  Pill,
  Luggage,
  ShieldCheck
} from 'lucide-react';

import { BaggageFeeEstimatorCard } from './BaggageFeeEstimatorCard';

interface AllowancesScreenProps {
  trip: Trip;
}

export const AllowancesScreen: React.FC<AllowancesScreenProps> = ({ trip }) => {
  const isFlight = (trip.travelType === 'PLANE' || !trip.travelType) && !['CAR', 'TRAIN', 'CRUISE', 'BUS'].includes(trip.travelType || '');
  const isTrain = trip.travelType === 'TRAIN';
  const isCar = trip.travelType === 'CAR';
  const isCruise = trip.travelType === 'CRUISE';
  const isBus = trip.travelType === 'BUS';

  const [carrierSearch, setCarrierSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'USA' | 'Canada' | 'Europe' | 'Asia'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'plane' | 'train' | 'bus' | 'cruise' | 'car'>(() => {
    if (trip.travelType === 'TRAIN') return 'train';
    if (trip.travelType === 'BUS') return 'bus';
    if (trip.travelType === 'CRUISE') return 'cruise';
    if (trip.travelType === 'CAR') return 'car';
    return 'plane';
  });

  // Find user's matched carrier
  const matchedAirline = isFlight && trip.companyName
    ? airlineLimits.find((a) => a.company.toLowerCase().includes(trip.companyName.toLowerCase()))
    : null;

  const matchedTrain = isTrain && trip.companyName
    ? trainLimits.find((t) => t.company.toLowerCase().includes(trip.companyName.toLowerCase()))
    : null;

  const matchedBus = isBus && trip.companyName
    ? busLimits.find((b) => b.company.toLowerCase().includes(trip.companyName.toLowerCase()))
    : null;

  const matchedCruise = isCruise && trip.companyName
    ? cruiseLimits.find((c) => c.company.toLowerCase().includes(trip.companyName.toLowerCase()))
    : null;

  const matchedCar = isCar
    ? carCapacities.find((c) =>
        trip.seatClassOrCarSize.toLowerCase().includes(c.sizeCategory.toLowerCase().split(' ')[0]) ||
        c.exampleVehicles.toLowerCase().includes(trip.companyName.toLowerCase())
      ) || carCapacities[1]
    : null;

  // Filter guides
  const filteredAirlines = airlineLimits.filter((a) => {
    const matchesSearch =
      a.company.toLowerCase().includes(carrierSearch.toLowerCase()) ||
      (a.notes && a.notes.toLowerCase().includes(carrierSearch.toLowerCase()));
    const matchesRegion = selectedRegion === 'ALL' || a.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const filteredTrains = trainLimits.filter((t) =>
    t.company.toLowerCase().includes(carrierSearch.toLowerCase()) ||
    (t.notes && t.notes.toLowerCase().includes(carrierSearch.toLowerCase()))
  );

  const filteredBuses = busLimits.filter((b) =>
    b.company.toLowerCase().includes(carrierSearch.toLowerCase()) ||
    (b.notes && b.notes.toLowerCase().includes(carrierSearch.toLowerCase()))
  );

  const filteredCruises = cruiseLimits.filter((c) =>
    c.company.toLowerCase().includes(carrierSearch.toLowerCase()) ||
    (c.notes && c.notes.toLowerCase().includes(carrierSearch.toLowerCase()))
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 pb-24">
      {/* ============================================================== */}
      {/* TOP DEDICATED SECTION: MODE-AWARE ALLOWANCES HERO */}
      {/* ============================================================== */}
      {isFlight && (
        <section className="rounded-3xl bg-gradient-to-br from-purple-900 via-purple-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-purple-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <Droplets className="w-56 h-56 text-purple-300" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Droplets className="w-4 h-4 text-purple-400 stroke-[2.5]" />
              <span>Carry-On Aviation Security Requirement</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Carry-On Liquid Allowance: The TSA 3-1-1 Rule
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
              All commercial airline flights enforce strict limitations on liquids, gels, aerosols, creams, and pastes brought through the security checkpoint in carry-on baggage.
            </p>

            {/* 3-1-1 Formula Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-amber-300">
                  3.4 oz
                </span>
                <p className="text-xs font-bold text-white mt-1">100ml Container Limit</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Every liquid container must hold 3.4 ounces (100ml) or less. Larger bottles that are half-full are strictly prohibited.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-purple-300">
                  1 Quart
                </span>
                <p className="text-xs font-bold text-white mt-1">Clear Zip-Top Bag</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  All 3.4 oz containers must comfortably fit inside a single, transparent, quart-sized resealable plastic bag.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-fuchsia-300">
                  1 Bag
                </span>
                <p className="text-xs font-bold text-white mt-1">Per Traveler</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Only one liquids bag is permitted per passenger. Keep it at the top of your carry-on for quick inspection at the x-ray conveyor.
                </p>
              </div>
            </div>

            {/* Exemptions & Family Liquids */}
            <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-2.5">
                <Baby className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Exemption: Infant & Toddler Care</p>
                  <p className="text-[11px] text-purple-200 mt-0.5">
                    Breast milk, infant formula, juice, and baby food are exempt from the 3.4 oz limit in reasonable quantities for children traveling. Declare them to the TSA officer.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-2.5">
                <Pill className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Exemption: Essential Medications</p>
                  <p className="text-[11px] text-purple-200 mt-0.5">
                    Liquid prescription and over-the-counter medications (cough syrup, saline solution, eye drops) may exceed 3.4 oz when declared at security screening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isTrain && (
        <section className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-purple-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <Train className="w-56 h-56 text-purple-300" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Train className="w-4 h-4 text-purple-400 stroke-[2.5]" />
              <span>Rail Baggage Policies & Allowances</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Rail Baggage: Generous Allowances & Zero Liquid Bans
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
              Unlike airlines, passenger trains have NO liquid volume restrictions. You can bring full-sized toiletries, beverages, perfumes, and groceries directly on board.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                  No Limit
                </span>
                <p className="text-xs font-bold text-white mt-1">Zero Liquid Checkpoint Bans</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  No 3.4 oz (100ml) containers or clear quart bags required. Bring full bottles of shampoo, drinks, and snacks without airport sizers.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-purple-300">
                  2 + 2 Free
                </span>
                <p className="text-xs font-bold text-white mt-1">Carry-On & Personal Allowance</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Amtrak & VIA Rail permit 2 free carry-on bags (up to 50 lbs each) plus 2 free personal items per passenger at zero charge.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-amber-300">
                  50 LBS
                </span>
                <p className="text-xs font-bold text-white mt-1">Luggage Tower Storage</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Large rolling suitcases (up to 28") ride safely in open overhead racks or vestibule luggage towers without gate-check penalties.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {isBus && (
        <section className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-purple-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <Bus className="w-56 h-56 text-purple-300" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Bus className="w-4 h-4 text-purple-400 stroke-[2.5]" />
              <span>Motorcoach Baggage Policy</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Bus Luggage: Under-Coach Cargo Hold & Parcel Shelves
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
              Intercity buses (FlixBus, Greyhound, Megabus) include 1 checked bag under the coach and 1 small personal item onboard with zero airport security liquid limits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                  No 3-1-1
                </span>
                <p className="text-xs font-bold text-white mt-1">No Liquid Screening</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Bring full-sized drinks, coffee, toiletries, and meals freely into the bus cabin.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-purple-300">
                  1 Under-Coach
                </span>
                <p className="text-xs font-bold text-white mt-1">Hold Luggage (50 lbs)</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Heavy 50-lb suitcases are stowed beneath the passenger deck by the driver upon boarding.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-amber-300">
                  Overhead
                </span>
                <p className="text-xs font-bold text-white mt-1">Compact Parcel Racks</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Shelves above seats are narrow—ideal for coats, purses, and lightweight daypacks under 20 lbs.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {isCruise && (
        <section className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-purple-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <Ship className="w-56 h-56 text-purple-300" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Ship className="w-4 h-4 text-purple-400 stroke-[2.5]" />
              <span>Cruise Embarkation Baggage & Safety Guidelines</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Cruise Baggage: Curbside Porters & Stateroom Delivery
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
              Hand off tagged suitcases to port terminal porters upon arrival. Toiletries have zero liquid restrictions, but electrical fire hazards are strictly banned.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                  Full Size
                </span>
                <p className="text-xs font-bold text-white mt-1">No Liquid Restrictions</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Full-sized sunscreens, shampoos, and beauty products are 100% permitted in both checked bags and carry-ons.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-purple-300">
                  Door Delivery
                </span>
                <p className="text-xs font-bold text-white mt-1">Stateroom Porters</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Bags are screened at the terminal and delivered directly outside your stateroom door by afternoon or early evening.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-rose-300">
                  Banned
                </span>
                <p className="text-xs font-bold text-white mt-1">Surge Strips & Irons</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Surge protectors, clothes irons, candles, and heating pads are confiscated by security due to marine electrical fire rules.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {isCar && (
        <section className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-purple-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <Car className="w-56 h-56 text-purple-300" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Car className="w-4 h-4 text-purple-400 stroke-[2.5]" />
              <span>Road Trip Vehicle Packing Architecture</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Vehicle Cargo: Zero Baggage Fees & Full Trunk Flexibility
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
              No airline scale surcharges, no liquids limits, and no gate checks. Pack for convenience with proper center-of-gravity weight distribution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                  $0 Fees
                </span>
                <p className="text-xs font-bold text-white mt-1">No Weight Penalties</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Pack without worrying about 50-lb airline overweight fees, sizer box tests, or bag count restrictions.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-purple-300">
                  Low & Forward
                </span>
                <p className="text-xs font-bold text-white mt-1">Trunk Weight Balance</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Place heavy hard-shell bags flat against the rear seatback to prevent cargo shift during braking and preserve tire balance.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                <span className="text-2xl sm:text-3xl font-black text-amber-300">
                  Reach-Ready
                </span>
                <p className="text-xs font-bold text-white mt-1">Console & Emergency Kit</p>
                <p className="text-[11px] text-purple-200 mt-1 leading-snug">
                  Keep vehicle registration, emergency roadside flare/jumper cables, sunglasses, and snacks accessible without unpacking.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active Trip Details Header Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950/60 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              {isFlight ? (
                <Plane className="w-4 h-4" />
              ) : isTrain ? (
                <Train className="w-4 h-4" />
              ) : isBus ? (
                <Bus className="w-4 h-4" />
              ) : isCruise ? (
                <Ship className="w-4 h-4" />
              ) : (
                <Car className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Trip Allowance Target: {trip.name}
              </h2>
              <p className="text-xs text-slate-500">
                Mode: {trip.travelType} {trip.companyName ? `· ${trip.companyName}` : ''}
              </p>
            </div>
          </div>
          {trip.seatClassOrCarSize && (
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg">
              {trip.seatClassOrCarSize}
            </span>
          )}
        </div>
        
        {/* Baggage Fee Estimator for configured bags & carrier (Flight only) */}
        {isFlight && (
          <div className="mt-4">
            <BaggageFeeEstimatorCard trip={trip} />
          </div>
        )}

        {/* Matched Carrier Direct Highlight */}
        {matchedAirline && (
          <div className="mt-4 pt-1">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matched Airline: {matchedAirline.company} Official Limits</span>
            </div>
            <AllowanceCard info={matchedAirline} isHighlighted />
          </div>
        )}

        {matchedTrain && (
          <div className="mt-4 pt-1">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matched Train Carrier: {matchedTrain.company} Official Limits</span>
            </div>
            <AllowanceCard info={matchedTrain} isHighlighted />
          </div>
        )}

        {matchedBus && (
          <div className="mt-4 pt-1">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matched Bus Operator: {matchedBus.company} Official Limits</span>
            </div>
            <AllowanceCard info={matchedBus} isHighlighted />
          </div>
        )}

        {matchedCruise && (
          <div className="mt-4 pt-1">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matched Cruise Line: {matchedCruise.company} Official Guidelines</span>
            </div>
            <AllowanceCard info={matchedCruise} isHighlighted />
          </div>
        )}

        {isCar && matchedCar && (
          <div className="mt-4 pt-1">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-white">
              <Car className="w-4 h-4 text-amber-500" />
              <span>Car Trunk Capacity Guide: {matchedCar.sizeCategory}</span>
            </div>
            <CarCapacityCard capacity={matchedCar} />
          </div>
        )}
      </div>

      {/* Lithium Power Bank Safety Notice (Aviation safety rule only) */}
      {isFlight && (
        <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 p-4.5">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
            <BatteryCharging className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>FAA Mandatory Safety Rule: Lithium Power Banks</span>
          </div>
          <p className="text-xs text-amber-950 dark:text-amber-200 font-bold mb-1">
            Never put portable power banks or spare batteries in checked luggage!
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Due to thermal runaway fire hazards, all loose lithium-ion battery packs, external phone chargers, and rechargeable items must travel in your Carry-on or Personal bag where cabin crew can access them.
          </p>
        </div>
      )}

      {/* Carrier Directory & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Carrier Baggage Limit Reference Guide
            </h3>
            <p className="text-xs text-slate-500">
              Verified allowances for personal items, carry-on bags, and checked luggage
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-purple-50 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto border border-purple-100 dark:border-purple-900/40 flex-wrap">
            <button
              onClick={() => setSelectedCategory('plane')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'plane'
                  ? 'bg-white dark:bg-slate-900 text-purple-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-purple-900 dark:hover:text-white'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Airlines</span>
            </button>
            <button
              onClick={() => setSelectedCategory('train')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'train'
                  ? 'bg-white dark:bg-slate-900 text-purple-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-purple-900 dark:hover:text-white'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>Trains</span>
            </button>
            <button
              onClick={() => setSelectedCategory('bus')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'bus'
                  ? 'bg-white dark:bg-slate-900 text-purple-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-purple-900 dark:hover:text-white'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Buses</span>
            </button>
            <button
              onClick={() => setSelectedCategory('cruise')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'cruise'
                  ? 'bg-white dark:bg-slate-900 text-purple-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-purple-900 dark:hover:text-white'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Cruises</span>
            </button>
            <button
              onClick={() => setSelectedCategory('car')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'car'
                  ? 'bg-white dark:bg-slate-900 text-purple-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-purple-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Vehicles</span>
            </button>
          </div>
        </div>

        {/* Search Input & Region Filter for Airlines */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={carrierSearch}
              onChange={(e) => setCarrierSearch(e.target.value)}
              placeholder={
                selectedCategory === 'plane'
                  ? "Search airlines (Delta, Air Canada, British Airways, Singapore Airlines, etc.)..."
                  : selectedCategory === 'train'
                  ? "Search train carriers (Amtrak, Eurostar, VIA Rail, etc.)..."
                  : selectedCategory === 'bus'
                  ? "Search bus operators (Greyhound, FlixBus, Megabus, etc.)..."
                  : selectedCategory === 'cruise'
                  ? "Search cruise lines (Royal Caribbean, Carnival, etc.)..."
                  : "Search vehicles..."
              }
              className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Region Tabs (Only when Airlines is selected) */}
          {selectedCategory === 'plane' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Region:
              </span>
              {[
                { id: 'ALL', label: 'All Airlines', count: airlineLimits.length },
                { id: 'USA', label: 'USA', count: airlineLimits.filter((a) => a.region === 'USA').length },
                { id: 'Canada', label: 'Canada', count: airlineLimits.filter((a) => a.region === 'Canada').length },
                { id: 'Europe', label: 'Europe', count: airlineLimits.filter((a) => a.region === 'Europe').length },
                { id: 'Asia', label: 'Asia & Pacific', count: airlineLimits.filter((a) => a.region === 'Asia').length }
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer border ${
                    selectedRegion === reg.id
                      ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-950/60 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{reg.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      selectedRegion === reg.id
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    }`}
                  >
                    {reg.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Allowance Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
          {selectedCategory === 'plane' && (
            <>
              {filteredAirlines.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No airlines found matching "{carrierSearch}"
                </div>
              ) : (
                filteredAirlines.map((airline) => (
                  <AllowanceCard key={airline.id} info={airline} />
                ))
              )}
            </>
          )}

          {selectedCategory === 'train' && (
            <>
              {filteredTrains.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No train operators found matching "{carrierSearch}"
                </div>
              ) : (
                filteredTrains.map((train) => (
                  <AllowanceCard key={train.id} info={train} />
                ))
              )}
            </>
          )}

          {selectedCategory === 'bus' && (
            <>
              {filteredBuses.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No bus operators found matching "{carrierSearch}"
                </div>
              ) : (
                filteredBuses.map((bus) => (
                  <AllowanceCard key={bus.id} info={bus} />
                ))
              )}
            </>
          )}

          {selectedCategory === 'cruise' && (
            <>
              {filteredCruises.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No cruise lines found matching "{carrierSearch}"
                </div>
              ) : (
                filteredCruises.map((cruise) => (
                  <AllowanceCard key={cruise.id} info={cruise} />
                ))
              )}
            </>
          )}

          {selectedCategory === 'car' && (
            <div className="space-y-3 xl:col-span-2">
              {carCapacities.map((car, idx) => (
                <CarCapacityCard key={idx} capacity={car} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer Box */}
      <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 p-4 text-purple-950 dark:text-purple-200 text-xs">
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Carrier Policy & Dimension Notice</p>
            <p className="text-[11px] text-purple-800/80 dark:text-purple-300 mt-0.5 leading-relaxed">
              Always verify your specific fare class directly on your official ticket or carrier website prior to travel. Transportation providers periodically update luggage size dimensions, excess baggage fees, and checkpoint guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AllowanceCardProps {
  info: BaggageLimitInfo;
  isHighlighted?: boolean;
}

const AllowanceCard: React.FC<AllowanceCardProps> = ({ info, isHighlighted = false }) => {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all ${
        isHighlighted
          ? 'bg-purple-50/40 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-950/60'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            {info.company}
          </span>
          {info.region && (
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
              {info.region}
            </span>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
            {info.type}
          </span>
        </div>
        {info.carryOnWeightLimit && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Carry-on: {info.carryOnWeightLimit}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl bg-purple-50/50 dark:bg-slate-800/60 p-3 border border-purple-100/60 dark:border-slate-800">
          <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">
            Personal Item
          </p>
          <p className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
            {info.personalLimit}
          </p>
        </div>

        <div className="rounded-xl bg-purple-50/50 dark:bg-slate-800/60 p-3 border border-purple-100/60 dark:border-slate-800">
          <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">
            Carry-On Luggage
          </p>
          <p className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
            {info.carryOnLimit}
          </p>
        </div>

        <div className="rounded-xl bg-purple-50/50 dark:bg-slate-800/60 p-3 border border-purple-100/60 dark:border-slate-800">
          <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">
            Checked Luggage
          </p>
          <p className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
            {info.checkedLimit}
          </p>
        </div>
      </div>

      {info.notes && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
          <span>{info.notes}</span>
        </div>
      )}
    </div>
  );
};

interface CarCapacityCardProps {
  capacity: {
    sizeCategory: string;
    exampleVehicles: string;
    capacityLuggage: string;
    trunkVolumeCuFt: string;
    suitcaseCount: number;
    recommendations: string[];
  };
}

const CarCapacityCard: React.FC<CarCapacityCardProps> = ({ capacity }) => {
  return (
    <div className="rounded-2xl border border-purple-100 dark:border-purple-950/60 bg-white dark:bg-slate-900 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
          {capacity.sizeCategory}
        </h4>
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          Approx. {capacity.suitcaseCount} Standard Suitcases
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Examples: {capacity.exampleVehicles} · Trunk Volume: {capacity.trunkVolumeCuFt}
      </p>

      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/40 text-xs mb-3 font-medium text-amber-900 dark:text-amber-200">
        Estimated cargo load: {capacity.capacityLuggage}
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Road-trip packing recommendations:
        </p>
        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          {capacity.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-purple-400">·</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
