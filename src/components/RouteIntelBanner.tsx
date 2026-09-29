import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { 
  Zap, 
  Coins, 
  Plane, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  PhoneCall, 
  MapPin, 
  Edit3, 
  Check, 
  Info,
  CreditCard,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AirportCitySearchInput } from './AirportCitySearchInput';

interface RouteIntelBannerProps {
  trip: Trip;
}

interface CountryElectricalIntel {
  country: string;
  plugTypes: string[];
  voltage: string;
  frequency: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  cardAcceptance: string;
  tippingEtiquette: string;
  emergencyNumber: string;
  timezoneOffsetVsUS: string;
}

const REGION_INTEL: Record<string, CountryElectricalIntel> = {
  uk: {
    country: 'United Kingdom',
    plugTypes: ['Type G (3 rectangular pins)'],
    voltage: '230V',
    frequency: '50Hz',
    currencyCode: 'GBP',
    currencyName: 'British Pound',
    currencySymbol: '£',
    cardAcceptance: 'Nearly 100% cashless. Contactless tap-to-pay (Apple/Google Pay) is standard everywhere, including London Underground and black cabs.',
    tippingEtiquette: '10%–12.5% discretionary service charge is often added to restaurant bills. Tipping bartenders is uncommon.',
    emergencyNumber: '999 or 112',
    timezoneOffsetVsUS: '+5 hours ahead of US Eastern'
  },
  japan: {
    country: 'Japan',
    plugTypes: ['Type A (2 flat prongs)'],
    voltage: '100V',
    frequency: '50/60Hz',
    currencyCode: 'JPY',
    currencyName: 'Japanese Yen',
    currencySymbol: '¥',
    cardAcceptance: 'Cards widely accepted at hotels and major shops, but cash (¥10,000–¥20,000) is essential for ramen ticket kiosks, temple shrines, and rural buses. Use 7-Eleven ATMs for low fees.',
    tippingEtiquette: 'Strictly NO tipping. Good service is standard and attempting to tip can cause awkwardness or confusion.',
    emergencyNumber: '110 (Police) / 119 (Fire & Ambulance)',
    timezoneOffsetVsUS: '+13 hours ahead of US Eastern (crosses International Date Line)'
  },
  europe: {
    country: 'European Union (France, Germany, Italy, Spain)',
    plugTypes: ['Type C (Europlug 2 round pins)', 'Type F (Schuko)'],
    voltage: '230V',
    frequency: '50Hz',
    currencyCode: 'EUR',
    currencyName: 'Euro',
    currencySymbol: '€',
    cardAcceptance: 'Cards and contactless widely accepted in cities. Small cash (€20–€50) recommended for public restrooms (which often charge €0.50–€1.00) and small bakeries.',
    tippingEtiquette: 'Service is included (service compris). Rounding up or leaving 5%–10% for good service is standard, not obligatory.',
    emergencyNumber: '112 (Universal EU Emergency Number)',
    timezoneOffsetVsUS: '+6 hours ahead of US Eastern'
  },
  us: {
    country: 'United States',
    plugTypes: ['Type A (2 flat pins)', 'Type B (3 pins with ground)'],
    voltage: '120V',
    frequency: '60Hz',
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    currencySymbol: '$',
    cardAcceptance: 'Near universal card acceptance. Credit cards with tap-to-pay or chip are expected.',
    tippingEtiquette: '18%–22% customary on dining, $1–$2 per drink at bars, $2–$5 per bag for skycaps/bellhops.',
    emergencyNumber: '911',
    timezoneOffsetVsUS: 'Domestic US (ET, CT, MT, PT)'
  },
  canada: {
    country: 'Canada',
    plugTypes: ['Type A (2 flat pins)', 'Type B (3 pins with ground)'],
    voltage: '120V',
    frequency: '60Hz',
    currencyCode: 'CAD',
    currencyName: 'Canadian Dollar',
    currencySymbol: '$',
    cardAcceptance: 'Virtually cashless; tap-to-pay accepted everywhere from transit to coffee shops.',
    tippingEtiquette: '15%–20% standard on dining and taxi rides.',
    emergencyNumber: '911',
    timezoneOffsetVsUS: 'Similar time zones to US'
  },
  mexico: {
    country: 'Mexico',
    plugTypes: ['Type A (2 flat pins)', 'Type B (3 pins with ground)'],
    voltage: '127V',
    frequency: '60Hz',
    currencyCode: 'MXN',
    currencyName: 'Mexican Peso',
    currencySymbol: '$',
    cardAcceptance: 'Cards accepted at resorts and sit-down restaurants. Carry 500–1,000 pesos in cash for street food, tolls, and tips. Decline ATM dynamic currency conversion.',
    tippingEtiquette: '10%–15% (propina) is customary for table service and tour guides.',
    emergencyNumber: '911',
    timezoneOffsetVsUS: 'CST / MST depending on state'
  },
  australia: {
    country: 'Australia & New Zealand',
    plugTypes: ['Type I (2 or 3 flat angled pins)'],
    voltage: '230V',
    frequency: '50Hz',
    currencyCode: 'AUD',
    currencyName: 'Australian Dollar',
    currencySymbol: '$',
    cardAcceptance: 'Completely cashless society. Tap-to-pay everywhere; card surcharges of 1%–1.5% are common and legally disclosed.',
    tippingEtiquette: 'Tipping is not customary or expected because hospitality staff are paid full living wages. Rounding up is appreciated.',
    emergencyNumber: '000 (Australia) or 111 (New Zealand)',
    timezoneOffsetVsUS: '+14 to +16 hours ahead of US Eastern'
  }
};

const POPULAR_AIRPORTS = [
  { city: 'New York (JFK)', country: 'us' },
  { city: 'London (LHR)', country: 'uk' },
  { city: 'Tokyo (HND)', country: 'japan' },
  { city: 'Paris (CDG)', country: 'europe' },
  { city: 'Rome (FCO)', country: 'europe' },
  { city: 'Los Angeles (LAX)', country: 'us' },
  { city: 'Cancun (CUN)', country: 'mexico' },
  { city: 'Sydney (SYD)', country: 'australia' },
  { city: 'Toronto (YYZ)', country: 'canada' },
  { city: 'Chicago (ORD)', country: 'us' }
];

export const RouteIntelBanner: React.FC<RouteIntelBannerProps> = ({ trip }) => {
  const { updateTripDetails } = usePacking();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [originInput, setOriginInput] = useState(trip.originCity || 'New York (JFK)');
  const [destInput, setDestInput] = useState(trip.destinationCity || 'London (LHR)');

  // Infer origin and destination country keys
  const getCountryKey = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes('london') || t.includes('uk') || t.includes('heathrow') || t.includes('gatwick') || t.includes('edinburgh')) return 'uk';
    if (t.includes('tokyo') || t.includes('japan') || t.includes('osaka') || t.includes('kyoto') || t.includes('haneda') || t.includes('narita')) return 'japan';
    if (t.includes('paris') || t.includes('rome') || t.includes('france') || t.includes('italy') || t.includes('spain') || t.includes('europe') || t.includes('germany') || t.includes('amsterdam')) return 'europe';
    if (t.includes('mexico') || t.includes('cancun') || t.includes('cabo')) return 'mexico';
    if (t.includes('australia') || t.includes('sydney') || t.includes('melbourne') || t.includes('auckland') || t.includes('zealand')) return 'australia';
    if (t.includes('toronto') || t.includes('canada') || t.includes('vancouver') || t.includes('montreal')) return 'canada';
    return 'us';
  };

  const originKey = getCountryKey(originInput);
  const destKey = getCountryKey(destInput);

  const originIntel = REGION_INTEL[originKey] || REGION_INTEL['us'];
  const destIntel = REGION_INTEL[destKey] || REGION_INTEL['uk'];

  const isCrossBorder = originKey !== destKey;
  const isDifferentVoltage = originIntel.voltage !== destIntel.voltage;

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    updateTripDetails(trip.id, {
      originCity: originInput.trim(),
      destinationCity: destInput.trim()
    });
    setIsEditingRoute(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-4 sm:p-5 mb-4 shadow-sm border border-purple-800/80 transition-all">
      {/* Route Header Bar (Collapsible Toggle) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                Route Intel & Electrical Plugs
              </span>
              {isCrossBorder ? (
                <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full">
                  International • {destIntel.plugTypes[0]?.split(' ')[0]} {destIntel.voltage}
                </span>
              ) : (
                <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full">
                  Domestic Route ({destIntel.currencyCode})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold mt-0.5 truncate">
              <span>{originInput}</span>
              <ArrowRight className="w-4 h-4 text-purple-300 shrink-0" />
              <span className="text-amber-300">{destInput}</span>
              <span className="text-xs font-normal text-purple-300 hidden md:inline">• {destIntel.country}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => {
              setIsCollapsed(false);
              setIsEditingRoute(!isEditingRoute);
            }}
            className="h-8 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <Edit3 className="w-3 h-3 text-purple-300" />
            <span>Route</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 px-3 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-purple-400/30"
          >
            <span>{isCollapsed ? 'Show Details' : 'Collapse'}</span>
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-in fade-in duration-150">

      {/* Interactive Route Editor Popover */}
      {isEditingRoute && (
        <form onSubmit={handleSaveRoute} className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-purple-200 mb-1">
                Flying From (Origin Airport / City)
              </label>
              <input
                type="text"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                placeholder="e.g. New York (JFK) or Chicago"
                className="w-full h-9 px-3 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-200 mb-1">
                Destination (Arrival Airport / City)
              </label>
              <input
                type="text"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                placeholder="e.g. London (LHR) or Tokyo"
                className="w-full h-9 px-3 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          {/* Quick Airport Preset Chips */}
          <div>
            <span className="text-[10px] text-purple-200/80 font-semibold block mb-1.5">
              Popular Destination Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_AIRPORTS.map((apt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDestInput(apt.city)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-white/10 hover:bg-purple-600/60 border border-white/10 transition-colors cursor-pointer"
                >
                  {apt.city}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditingRoute(false)}
              className="h-8 px-3 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
            >
              Update Intel Bar
            </button>
          </div>
        </form>
      )}

      {/* Route Intel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {/* Card 1: Power Adapter Brick & Voltage */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Power Converter Brick
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-white font-mono">
                {destIntel.voltage} / {destIntel.frequency}
              </span>
            </div>

            <p className="text-xs font-bold text-white">
              {isCrossBorder ? (
                <>Pack: <span className="text-amber-300">{destIntel.plugTypes.join(', ')}</span></>
              ) : (
                'Standard Home Plugs Compatible (No Adapter Needed)'
              )}
            </p>

            <p className="text-[11px] text-purple-200/90 mt-1.5 leading-relaxed">
              {isDifferentVoltage ? (
                <span className="text-amber-200">
                  ⚠️ Voltage difference ({originIntel.voltage} vs {destIntel.voltage}). Phones and laptops handle 110V–240V natively, but verify hair dryers, curling irons, or shavers are dual-voltage!
                </span>
              ) : (
                'Dual-voltage electronics (smartphones, laptops, iPads, cameras) work without a voltage transformer.'
              )}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] text-purple-200/70">
            Emergency Dialing: <strong className="text-white">{destIntel.emergencyNumber}</strong>
          </div>
        </div>

        {/* Card 2: Local Currency & Payment Culture */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-400" />
                Local Currency & Pay
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                {destIntel.currencyCode} ({destIntel.currencySymbol})
              </span>
            </div>

            <p className="text-xs font-bold text-white">
              {destIntel.currencyName} ({destIntel.currencyCode})
            </p>

            <p className="text-[11px] text-purple-200/90 mt-1.5 leading-relaxed">
              {destIntel.cardAcceptance}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] text-purple-200/70">
            Pro Tip: Always select "Pay in Local Currency" at checkout to avoid 3–5% card terminal markups.
          </div>
        </div>

        {/* Card 3: Tipping Etiquette & Jet Lag Strategy */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                Tipping & Jet Lag
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300">
                Culture Intel
              </span>
            </div>

            <p className="text-xs font-bold text-white">
              Tipping: {destIntel.tippingEtiquette}
            </p>

            <p className="text-[11px] text-purple-200/90 mt-1.5 leading-relaxed">
              <strong>Time Zone:</strong> {destIntel.timezoneOffsetVsUS}. Stay hydrated, avoid heavy alcohol on the inbound flight, and seek direct morning sunlight to reset your circadian rhythm.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] text-purple-200/70">
            Baggage: Never pack power banks or lithium items in checked bags!
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  );
};
