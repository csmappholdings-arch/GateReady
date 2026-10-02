import React, { useState, useMemo } from 'react';
import { Trip } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Wind, 
  Thermometer, 
  Umbrella, 
  Check, 
  Plus, 
  Sparkles, 
  MapPin, 
  CreditCard,
  Banknote,
  DollarSign,
  AlertTriangle,
  Info,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Lock,
  ArrowRight,
  PlaneTakeoff,
  Smartphone,
  Wallet,
  PhoneCall,
  HeartPulse,
  Clock,
  Coffee,
  Moon,
  Compass,
  ShieldAlert,
  Copy,
  Shirt,
  PackageCheck,
  Receipt,
  Scale
} from 'lucide-react';
import { AirportCitySearchInput } from './AirportCitySearchInput';
import { TerminalHubMapsAdvisor } from './TerminalHubMapsAdvisor';

interface TripPrepChecklistScreenProps {
  trip: Trip;
  initialSubTab?: 'PREP' | 'MAPS';
}

interface WeatherForecastDay {
  dayName: string;
  date: string;
  condition: 'SUNNY' | 'RAIN' | 'CLOUDY' | 'CHILLY' | 'SNOW' | 'THUNDERSTORM';
  tempHighF: number;
  tempLowF: number;
  rainChance: number;
  uvIndex: number;
  summary: string;
}

interface CashAdviceProfile {
  digitalScore: number; // 0 to 100
  ratingText: string;
  primaryAdvice: string;
  cardAcceptance: string;
  contactlessSupport: string;
  tippingCustom: string;
  atmTips: string;
  cashMandatoryFor: string[];
  recommendedDailyCashUSD: number;
}

interface JetLagAdvice {
  timeDiffHours: number;
  direction: 'EAST' | 'WEST';
  caffeineCutoff: string;
  sunlightWindow: string;
  napRule: string;
  sleepShiftStrategy: string;
}

export const TripPrepChecklistScreen: React.FC<TripPrepChecklistScreenProps> = ({ trip, initialSubTab }) => {
  const { updateTripDetails, addItemToBag, selectedBagId, tempUnit, setTempUnit } = usePacking();
  const { isPro, openPaywall } = useSubscription();

  const [intelSubTab, setIntelSubTab] = useState<'PREP' | 'MAPS'>(initialSubTab || 'PREP');
  const [destinationInput, setDestinationInput] = useState(trip.destinationCity || trip.name || 'London, UK');
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [tripDays, setTripDays] = useState(5);

  // Capsule Wardrobe Matrix State
  const [capsuleTops, setCapsuleTops] = useState(5);
  const [capsuleBottoms, setCapsuleBottoms] = useState(4);
  const [capsuleLayers, setCapsuleLayers] = useState(3);
  const [capsuleShoes, setCapsuleShoes] = useState(2);
  const [capsuleAdded, setCapsuleAdded] = useState(false);

  // Customs Exemption Declared Value State
  const [purchasesDeclaredUSD, setPurchasesDeclaredUSD] = useState(240);

  // Local state for pre-departure readiness milestones
  const [prepChecks, setPrepChecks] = useState<Record<string, boolean>>({
    passport: true,
    checkin: false,
    wallet_pass: false,
    bank_notify: true,
    emergency_cash: false,
    offline_maps: true,
    chargers_packed: false,
    home_security: false
  });

  const city = trip.destinationCity || trip.name || 'London, UK';

  // 1. Weather Forecast Intel (Free for all users)
  const forecast: WeatherForecastDay[] = useMemo(() => {
    const lower = city.toLowerCase();

    if (lower.includes('london') || lower.includes('uk') || lower.includes('seattle') || lower.includes('ireland')) {
      return [
        { dayName: 'Today', date: 'Day 1', condition: 'RAIN', tempHighF: 59, tempLowF: 48, rainChance: 75, uvIndex: 3, summary: 'Intermittent brisk rain & overcast' },
        { dayName: 'Tomorrow', date: 'Day 2', condition: 'RAIN', tempHighF: 57, tempLowF: 46, rainChance: 80, uvIndex: 2, summary: 'Afternoon downpours & breeze' },
        { dayName: 'Day 3', date: 'Day 3', condition: 'CLOUDY', tempHighF: 62, tempLowF: 50, rainChance: 35, uvIndex: 4, summary: 'Mostly cloudy with mild breaks' },
        { dayName: 'Day 4', date: 'Day 4', condition: 'CLOUDY', tempHighF: 63, tempLowF: 51, rainChance: 25, uvIndex: 4, summary: 'Breezy & partly overcast' },
        { dayName: 'Day 5', date: 'Day 5', condition: 'RAIN', tempHighF: 60, tempLowF: 49, rainChance: 65, uvIndex: 3, summary: 'Scattered light showers' }
      ];
    } else if (lower.includes('tokyo') || lower.includes('japan') || lower.includes('seoul')) {
      return [
        { dayName: 'Today', date: 'Day 1', condition: 'SUNNY', tempHighF: 73, tempLowF: 59, rainChance: 15, uvIndex: 7, summary: 'Crisp sunshine & light breeze' },
        { dayName: 'Tomorrow', date: 'Day 2', condition: 'SUNNY', tempHighF: 75, tempLowF: 60, rainChance: 10, uvIndex: 8, summary: 'Pleasant & ideal walking weather' },
        { dayName: 'Day 3', date: 'Day 3', condition: 'CLOUDY', tempHighF: 70, tempLowF: 57, rainChance: 30, uvIndex: 5, summary: 'Passing high clouds' },
        { dayName: 'Day 4', date: 'Day 4', condition: 'RAIN', tempHighF: 66, tempLowF: 55, rainChance: 70, uvIndex: 3, summary: 'Light rain in metropolitan area' },
        { dayName: 'Day 5', date: 'Day 5', condition: 'SUNNY', tempHighF: 72, tempLowF: 58, rainChance: 10, uvIndex: 7, summary: 'Clear blue skies' }
      ];
    } else if (lower.includes('miami') || lower.includes('cancun') || lower.includes('hawaii') || lower.includes('bali')) {
      return [
        { dayName: 'Today', date: 'Day 1', condition: 'SUNNY', tempHighF: 86, tempLowF: 76, rainChance: 20, uvIndex: 10, summary: 'Tropical heat & high humidity' },
        { dayName: 'Tomorrow', date: 'Day 2', condition: 'THUNDERSTORM', tempHighF: 84, tempLowF: 75, rainChance: 65, uvIndex: 8, summary: 'Afternoon coastal thunderstorm' },
        { dayName: 'Day 3', date: 'Day 3', condition: 'SUNNY', tempHighF: 87, tempLowF: 77, rainChance: 15, uvIndex: 11, summary: 'Intense sunshine & tropical warmth' },
        { dayName: 'Day 4', date: 'Day 4', condition: 'SUNNY', tempHighF: 88, tempLowF: 78, rainChance: 10, uvIndex: 11, summary: 'Clear skies with ocean breeze' },
        { dayName: 'Day 5', date: 'Day 5', condition: 'CLOUDY', tempHighF: 85, tempLowF: 76, rainChance: 30, uvIndex: 9, summary: 'Warm with passing sun clouds' }
      ];
    } else if (lower.includes('denver') || lower.includes('alps') || lower.includes('calgary') || lower.includes('tromso') || lower.includes('ski')) {
      return [
        { dayName: 'Today', date: 'Day 1', condition: 'SNOW', tempHighF: 34, tempLowF: 22, rainChance: 85, uvIndex: 4, summary: 'Snow flurries & crisp mountain air' },
        { dayName: 'Tomorrow', date: 'Day 2', condition: 'CHILLY', tempHighF: 38, tempLowF: 24, rainChance: 20, uvIndex: 6, summary: 'Sunny but sub-freezing mornings' },
        { dayName: 'Day 3', date: 'Day 3', condition: 'SNOW', tempHighF: 32, tempLowF: 19, rainChance: 70, uvIndex: 3, summary: 'Steady mountain snowfall' },
        { dayName: 'Day 4', date: 'Day 4', condition: 'CHILLY', tempHighF: 40, tempLowF: 26, rainChance: 15, uvIndex: 5, summary: 'Dry cold with crisp wind' },
        { dayName: 'Day 5', date: 'Day 5', condition: 'SUNNY', tempHighF: 42, tempLowF: 28, rainChance: 10, uvIndex: 6, summary: 'Bright alpine sunshine' }
      ];
    }

    return [
      { dayName: 'Today', date: 'Day 1', condition: 'SUNNY', tempHighF: 71, tempLowF: 56, rainChance: 20, uvIndex: 6, summary: 'Mild & pleasant traveling weather' },
      { dayName: 'Tomorrow', date: 'Day 2', condition: 'CLOUDY', tempHighF: 68, tempLowF: 54, rainChance: 40, uvIndex: 4, summary: 'Overcast with brief afternoon breeze' },
      { dayName: 'Day 3', date: 'Day 3', condition: 'RAIN', tempHighF: 64, tempLowF: 52, rainChance: 65, uvIndex: 3, summary: 'Passing showers; umbrella advised' },
      { dayName: 'Day 4', date: 'Day 4', condition: 'SUNNY', tempHighF: 73, tempLowF: 57, rainChance: 15, uvIndex: 7, summary: 'Sunny & warm walking conditions' },
      { dayName: 'Day 5', date: 'Day 5', condition: 'SUNNY', tempHighF: 74, tempLowF: 58, rainChance: 10, uvIndex: 7, summary: 'Clear skies through the evening' }
    ];
  }, [city]);

  // Temperature unit conversion helper
  const formatTemp = (f: number) => {
    if (tempUnit === 'C') {
      return `${Math.round((f - 32) * 5 / 9)}°C`;
    }
    return `${f}°F`;
  };

  // 2. Travel Cash & Digital Payment Profile
  const cashProfile: CashAdviceProfile = useMemo(() => {
    const lower = city.toLowerCase();

    if (lower.includes('london') || lower.includes('uk')) {
      return {
        digitalScore: 95,
        ratingText: 'Virtually Cashless Society',
        primaryAdvice: 'Almost all London buses, Tube stations, cafes, and markets strictly prefer contactless Apple/Google Pay or contactless cards. Many venues no longer accept cash.',
        cardAcceptance: '99% Acceptance (Visa, Mastercard, Amex)',
        contactlessSupport: 'Universal (Apple Pay / Google Pay / Contactless Cards)',
        tippingCustom: 'Discretionary 12.5% service charge is usually pre-added to restaurant bills. Extra cash tip is optional.',
        atmTips: 'Use bank-branch ATMs (Barclays, HSBC, NatWest) to avoid independent ATM surcharge fees.',
        cashMandatoryFor: ['Rare small market stalls', 'Emergency coin lockers'],
        recommendedDailyCashUSD: 15
      };
    } else if (lower.includes('tokyo') || lower.includes('japan')) {
      return {
        digitalScore: 68,
        ratingText: 'Cash & IC Card Dominant',
        primaryAdvice: 'While convenience stores and major stores take credit cards, small ramen shops, temple entrance tickets, and train ticket vending machines strictly require physical Yen or Suica/Pasmo IC cards.',
        cardAcceptance: 'High in hotels/department stores; Low in small eateries & rural transit',
        contactlessSupport: 'Suica/Pasmo (Apple Wallet) is supreme; contactless Visa/Mastercard growing',
        tippingCustom: 'Strictly zero tipping. Leaving extra money can be seen as confusing or insulting.',
        atmTips: '7-Eleven (Seven Bank) and Post Office ATMs reliably accept foreign debit cards with lowest exchange fees.',
        cashMandatoryFor: ['Ramen ticket machines', 'Coin lockers at stations', 'Shrines & temple entry', 'Small izakayas'],
        recommendedDailyCashUSD: 45
      };
    } else if (lower.includes('paris') || lower.includes('france') || lower.includes('europe') || lower.includes('rome')) {
      return {
        digitalScore: 88,
        ratingText: 'Card & Contactless Friendly with Modest Cash Reserve',
        primaryAdvice: 'Cards are accepted everywhere for purchases over €1. Keep €20-€30 in small coins and notes for public WC facilities, bakeries (boulangeries), and street espresso counters.',
        cardAcceptance: '95% (Visa, Mastercard; Amex less widely accepted)',
        contactlessSupport: 'Very high across restaurants, metros, and shops',
        tippingCustom: 'Service is included by law (service compris). Rounding up by €1-€2 for good service is appreciated.',
        atmTips: 'Always decline the ATM conversion rate ("dynamic currency conversion") and let your home bank convert.',
        cashMandatoryFor: ['Pay toilets (WC 50c - €1)', 'Small flea markets', 'Bakeries under €3', 'Tour guide gratuity'],
        recommendedDailyCashUSD: 25
      };
    }

    return {
      digitalScore: 82,
      ratingText: 'Digital Friendly Destination',
      primaryAdvice: 'Major cards and smartphone wallet payments are widely supported. Carry a modest cash buffer for tips, public restrooms, and small independent vendors.',
      cardAcceptance: '90%+ in metro areas',
      contactlessSupport: 'Widely available across modern terminals',
      tippingCustom: '15-20% standard in North America; check local regional customs abroad.',
      atmTips: 'Use official bank ATMs inside bank lobbies for security and fair exchange rates.',
      cashMandatoryFor: ['Street vendors', 'Valet & bellhop tips', 'Transit coin lockers', 'Flea markets'],
      recommendedDailyCashUSD: 25
    };
  }, [city]);

  // 3. Jet Lag Intel
  const jetLagIntel: JetLagAdvice = useMemo(() => {
    const lower = city.toLowerCase();

    if (lower.includes('tokyo') || lower.includes('japan')) {
      return {
        timeDiffHours: 13,
        direction: 'EAST',
        caffeineCutoff: '12:00 PM local time',
        sunlightWindow: 'Early morning 07:00 - 09:30 AM (accelerates phase shift)',
        napRule: 'Strict 20-minute power nap before 02:00 PM only',
        sleepShiftStrategy: 'Eastward travel causes harder jet lag. Seek bright natural light upon landing.'
      };
    } else if (lower.includes('london') || lower.includes('uk') || lower.includes('paris') || lower.includes('europe')) {
      return {
        timeDiffHours: 5,
        direction: 'EAST',
        caffeineCutoff: '01:00 PM local time',
        sunlightWindow: 'Late morning 09:00 - 11:30 AM',
        napRule: 'Do NOT sleep on arrival day until 09:30 PM local bedtime',
        sleepShiftStrategy: 'Power through day one with hydration and a brisk outdoor walk in sunlight.'
      };
    }

    return {
      timeDiffHours: 3,
      direction: 'WEST',
      caffeineCutoff: '02:00 PM local time',
      sunlightWindow: 'Late afternoon 03:00 - 06:00 PM (delays circadian sleep trigger)',
      napRule: 'Short 20-min recharge if sluggish in afternoon',
      sleepShiftStrategy: 'Stay awake until normal local evening to anchor your body clock.'
    };
  }, [city]);

  // 4. International Customs Exemption Intel
  const customsIntel = useMemo(() => {
    const lower = city.toLowerCase();
    if (lower.includes('tokyo') || lower.includes('japan')) {
      return {
        limitUSD: 1400,
        currencySymbol: '¥',
        localLimit: '¥200,000',
        alcoholAllowance: '3 bottles (760ml each)',
        tobaccoAllowance: '200 cigarettes',
        advice: 'Keep itemized store receipts with Japan Tax-Free QR code stickers attached to passport.'
      };
    } else if (lower.includes('london') || lower.includes('uk')) {
      return {
        limitUSD: 500,
        currencySymbol: '£',
        localLimit: '£390 for air travelers',
        alcoholAllowance: '1 liter spirits (>22% ABV) or 2 liters fortified wine',
        tobaccoAllowance: '200 cigarettes',
        advice: 'UK border border force enforces strictly £390 total value. Items over threshold are taxed on full value.'
      };
    } else if (lower.includes('paris') || lower.includes('france') || lower.includes('europe')) {
      return {
        limitUSD: 470,
        currencySymbol: '€',
        localLimit: '€430 for commercial air/sea travelers',
        alcoholAllowance: '1 liter high-proof alcohol or 4 liters still wine',
        tobaccoAllowance: '200 cigarettes',
        advice: 'Ensure tax-free forms are validated at airport PABLO electronic kiosk before baggage drop.'
      };
    }
    return {
      limitUSD: 800,
      currencySymbol: '$',
      localLimit: '$800 USD (U.S. returning resident exemption)',
      alcoholAllowance: '1 liter duty-free',
      tobaccoAllowance: '200 cigarettes',
      advice: 'Keep itemized purchase receipts ready for CBP / CBSA customs declaration.'
    };
  }, [city]);

  // Capsule Outfits Combination Formula
  const possibleOutfitsCount = capsuleTops * capsuleBottoms * (capsuleLayers > 0 ? 2 : 1);

  const handleAddItemToCurrentBag = (itemName: string) => {
    const targetBagId = selectedBagId || trip.bags[0]?.id;
    if (!targetBagId) return;

    addItemToBag(trip.id, targetBagId, itemName, 'Main Compartment', 1);
    setAddedItems((prev) => new Set(prev).add(itemName));
  };

  const handlePackCapsuleWardrobe = () => {
    const targetBagId = selectedBagId || trip.bags[0]?.id;
    if (!targetBagId) return;

    const capsuleItems = [
      { name: `${capsuleTops}x Mix-and-Match Tops (Polos, Tees, Shirts)`, qty: capsuleTops, category: 'Clothing' },
      { name: `${capsuleBottoms}x Neutral Bottoms (Pants, Chinos, Skirts)`, qty: capsuleBottoms, category: 'Clothing' },
      { name: `${capsuleLayers}x Versatile Layering Pieces (Sweater, Jacket)`, qty: capsuleLayers, category: 'Clothing' },
      { name: `${capsuleShoes}x Pairs Travel Footwear (Walkers + Dress)`, qty: capsuleShoes, category: 'Clothing' },
      { name: `${tripDays}x Pairs Underwear & Merino Socks`, qty: tripDays, category: 'Clothing' }
    ];

    capsuleItems.forEach((item) => {
      addItemToBag(trip.id, targetBagId, item.name, 'Main Compartment', item.qty);
    });

    setCapsuleAdded(true);
    setTimeout(() => setCapsuleAdded(false), 3500);
  };

  const toggleCheck = (key: string) => {
    setPrepChecks((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalRecommendedCash = Math.round(
    cashProfile.recommendedDailyCashUSD * tripDays * Math.max(1, trip.familyMembers?.length || 1)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-purple-100 dark:border-purple-950/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <CloudSun className="w-4 h-4 text-amber-500" />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trip Intel & Travel Checklists
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
              Live Forecast & Intel
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Destination climate forecasts, temperature switching, capsule wardrobe calculator, and pre-departure checklists.
          </p>
        </div>

        {/* Temperature Unit Toggle (Directly Accessible & Functional) */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-500">Unit:</span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setTempUnit('F')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                tempUnit === 'F' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Fahrenheit (°F)"
            >
              °F
            </button>
            <button
              type="button"
              onClick={() => setTempUnit('C')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                tempUnit === 'C' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Celsius (°C)"
            >
              °C
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        <button
          type="button"
          onClick={() => setIntelSubTab('PREP')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
            intelSubTab === 'PREP'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
          }`}
        >
          <CloudSun className="w-4 h-4 text-amber-400" />
          <span>Climate & Packing Prep</span>
        </button>

        <button
          type="button"
          onClick={() => setIntelSubTab('MAPS')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
            intelSubTab === 'MAPS'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Terminal & Station Maps (Flights, Rail, Cruise)</span>
          <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
            <Crown className="w-2.5 h-2.5 fill-purple-950" /> Pro
          </span>
        </button>
      </div>

      {/* Sub-Tab Content: Maps vs Climate/Checklists */}
      {intelSubTab === 'MAPS' ? (
        <TerminalHubMapsAdvisor trip={trip} />
      ) : (
        <>
      {/* ============================================================== */}
      {/* 1. DESTINATION WEATHER & CLIMATE FORECAST (FREE FOR ALL USERS) */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50 dark:border-purple-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/80 dark:border-amber-800/80">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Destination Climate & 5-Day Forecast</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Free Live Intel
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weather conditions & packing recommendations for <strong className="text-purple-700 dark:text-purple-300">{city}</strong>
              </p>
            </div>
          </div>

          {/* Temperature Unit Switcher & City Changer */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            {/* Weather Card °F / °C Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => setTempUnit('F')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  tempUnit === 'F'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                }`}
                title="Switch to Fahrenheit (°F)"
              >
                °F
              </button>
              <button
                type="button"
                onClick={() => setTempUnit('C')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  tempUnit === 'C'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                }`}
                title="Switch to Celsius (°C)"
              >
                °C
              </button>
            </div>

            {isEditingDestination ? (
              <div className="flex items-center gap-2">
                <div className="w-52">
                  <AirportCitySearchInput
                    label="Destination City"
                    value={destinationInput}
                    onChange={(newCity) => setDestinationInput(newCity)}
                    placeholder="Enter city (e.g. Paris, Tokyo, Miami)..."
                  />
                </div>
                <button
                  onClick={() => {
                    updateTripDetails(trip.id, { destinationCity: destinationInput.trim() });
                    setIsEditingDestination(false);
                  }}
                  className="h-9 px-3 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer shrink-0 mt-5"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingDestination(false)}
                  className="h-9 px-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 cursor-pointer shrink-0 mt-5"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingDestination(true)}
                className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Change Destination City</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Day Forecast Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">{day.dayName}</span>
                <span className="text-[10px] text-slate-400 font-medium">{day.date}</span>
              </div>

              <div className="my-2.5 flex items-center justify-between">
                {day.condition === 'RAIN' && <CloudRain className="w-6 h-6 text-sky-500" />}
                {day.condition === 'THUNDERSTORM' && <CloudRain className="w-6 h-6 text-purple-500" />}
                {day.condition === 'SUNNY' && <Sun className="w-6 h-6 text-amber-500" />}
                {day.condition === 'CLOUDY' && <CloudSun className="w-6 h-6 text-slate-500" />}
                {day.condition === 'SNOW' && <Snowflake className="w-6 h-6 text-blue-400" />}

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {formatTemp(day.tempHighF)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Low {formatTemp(day.tempLowF)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] space-y-0.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Rain:</span>
                  <strong className={day.rainChance > 50 ? 'text-rose-500 font-bold' : ''}>
                    {day.rainChance}%
                  </strong>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate mt-0.5 font-medium">
                  {day.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Climate Packing Additions */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
          <h3 className="text-xs font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Recommended Items Based on {city} Weather:</span>
          </h3>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {[
              { name: 'Compact Travel Umbrella', icon: Umbrella },
              { name: 'Packable Rain Poncho / Jacket', icon: Wind },
              { name: 'High-SPF Sunscreen (TSA 3-1-1)', icon: Sun },
              { name: 'UV Protection Sunglasses', icon: Sun },
              { name: 'Breathable Walking Shoes', icon: Check }
            ].map((item, i) => {
              const isAdded = addedItems.has(item.name);
              return (
                <button
                  key={i}
                  onClick={() => handleAddItemToCurrentBag(item.name)}
                  disabled={isAdded}
                  className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-50'
                  }`}
                >
                  {isAdded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{item.name}</span>
                  {isAdded && <span className="text-[10px] ml-1">(Added)</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CAPSULE WARDROBE / OUTFIT MATRIX CALCULATOR (NEW)           */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-fuchsia-200/80 dark:border-fuchsia-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-fuchsia-50 dark:border-fuchsia-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0 border border-fuchsia-200/80 dark:border-fuchsia-800/80">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Capsule Wardrobe & Outfit Matrix</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-700 dark:text-fuchsia-300">
                  {possibleOutfitsCount} Outfits Generated
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maximize clothing combinations using the 5-4-3-2-1 travel matrix for {tripDays} days in <strong className="text-fuchsia-600 dark:text-fuchsia-300">{city}</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePackCapsuleWardrobe}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-fuchsia-600/20 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>{capsuleAdded ? 'Added to Bag!' : 'Pack Capsule into Bag'}</span>
          </button>
        </div>

        {/* Interactive Matrix Steppers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Tops & Shirts:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 p-0.5">
                <button onClick={() => setCapsuleTops(p => Math.max(1, p - 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">-</button>
                <span className="px-1.5 font-black text-slate-900 dark:text-white text-xs">{capsuleTops}</span>
                <button onClick={() => setCapsuleTops(p => Math.min(10, p + 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">+</button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Pants/shorts multiplier base</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Bottoms / Pants:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 p-0.5">
                <button onClick={() => setCapsuleBottoms(p => Math.max(1, p - 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">-</button>
                <span className="px-1.5 font-black text-slate-900 dark:text-white text-xs">{capsuleBottoms}</span>
                <button onClick={() => setCapsuleBottoms(p => Math.min(8, p + 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">+</button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Chinos, jeans, skirts</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Layer Pieces:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 p-0.5">
                <button onClick={() => setCapsuleLayers(p => Math.max(0, p - 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">-</button>
                <span className="px-1.5 font-black text-slate-900 dark:text-white text-xs">{capsuleLayers}</span>
                <button onClick={() => setCapsuleLayers(p => Math.min(5, p + 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">+</button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Sweater, cardigan, jacket</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Pairs of Shoes:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 p-0.5">
                <button onClick={() => setCapsuleShoes(p => Math.max(1, p - 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">-</button>
                <span className="px-1.5 font-black text-slate-900 dark:text-white text-xs">{capsuleShoes}</span>
                <button onClick={() => setCapsuleShoes(p => Math.min(4, p + 1))} className="w-5 h-5 flex items-center justify-center font-bold text-xs">+</button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Walkers + dinner shoes</p>
          </div>
        </div>

        {/* Matrix Result Banner */}
        <div className="p-4 rounded-2xl bg-fuchsia-50/70 dark:bg-fuchsia-950/30 border border-fuchsia-200 dark:border-fuchsia-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-800 dark:text-fuchsia-300 block">
              Capsule Mathematical Matrix
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              {capsuleTops} Tops × {capsuleBottoms} Bottoms {capsuleLayers > 0 ? `× 2 Layers` : ''} = <strong className="text-fuchsia-700 dark:text-fuchsia-300 text-sm font-black">{possibleOutfitsCount} unique outfits</strong> from just {capsuleTops + capsuleBottoms + capsuleLayers + capsuleShoes} packed items!
            </p>
          </div>
          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 shadow-2xs shrink-0">
            Covers {tripDays} Days with 0 Repetitions
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. TRAVEL CASH & DIGITAL PAYMENT ADVISOR                       */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50 dark:border-purple-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/80 dark:border-emerald-800/80">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Travel Cash vs. Digital Payment Advisor</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {cashProfile.digitalScore}% Digital Readiness
                </span>
                {!isPro && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                    <Crown className="w-2.5 h-2.5 fill-purple-950" /> Pro
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Payment customs, contactless acceptance, and cash recommendations for <strong className="text-emerald-700 dark:text-emerald-300">{city}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Verdict Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3.5">
          <CreditCard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wide">
              {cashProfile.ratingText}
            </h3>
            <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 mt-1 leading-relaxed">
              {cashProfile.primaryAdvice}
            </p>
          </div>
        </div>

        {/* Interactive Cash Calculator (Full for Pro, Sample for Free) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Recommended Cash to Bring for {trip.name}</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calculated for {tripDays} days · {trip.familyMembers?.length || 1} traveler(s)
              </p>
            </div>

            {/* Days input stepper */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-bold text-slate-500">Trip Length:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 p-1">
                <button
                  onClick={() => setTripDays((prev) => Math.max(1, prev - 1))}
                  className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-bold px-2">{tripDays} days</span>
                <button
                  onClick={() => setTripDays((prev) => Math.min(30, prev + 1))}
                  className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Total Estimated Cash Banner */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Recommended Total Physical Cash
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ${totalRecommendedCash} USD <span className="text-xs font-normal text-slate-400">approx. equivalent</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                ~${cashProfile.recommendedDailyCashUSD} / day
              </span>
              <span className="text-[10px] text-slate-400">per traveler</span>
            </div>
          </div>
        </div>

        {/* Pro Unlock Card for full detailed breakdown if not Pro */}
        {!isPro ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-black text-white">Unlock Tipping Customs & ATM FX Traps Radar</p>
                <p className="text-[11px] text-purple-200">See exact mandatory cash locations and contactless quirks with Gate Ready Pro.</p>
              </div>
            </div>
            <button
              onClick={() => openPaywall("Unlock Destination Payment Intelligence & ATM FX Traps with Gate Ready Pro.")}
              className="h-8 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-purple-950 font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-xs"
            >
              Upgrade
            </button>
          </div>
        ) : (
          /* Key Insights Grid for Pro Users */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Contactless & Phone Pay (Apple/Google)</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cashProfile.contactlessSupport}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                <span>Tipping Customs & Etiquette</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cashProfile.tippingCustom}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" />
                <span>ATM & FX Conversion Strategy</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {cashProfile.atmTips}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Where Cash is Strictly Mandatory:</span>
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5 list-disc list-inside">
                {cashProfile.cashMandatoryFor.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. DUTY-FREE & INTERNATIONAL CUSTOMS EXEMPTION RADAR (PRO)     */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-50 dark:border-indigo-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/80 dark:border-indigo-800/80">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>International Customs & Duty-Free Exemption Radar</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Exemption Cap: {customsIntel.localLimit}
                </span>
                {!isPro && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                    <Crown className="w-2.5 h-2.5 fill-purple-950" /> Pro
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track personal souvenir values, alcohol limits, and tax thresholds for <strong className="text-indigo-600 dark:text-indigo-300">{city}</strong>.
              </p>
            </div>
          </div>
        </div>

        {!isPro ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Exemption Cap for {city}: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{customsIntel.localLimit}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Alcohol: {customsIntel.alcoholAllowance} · Tobacco: {customsIntel.tobaccoAllowance}
              </p>
            </div>
            <button
              onClick={() => openPaywall("Unlock Customs Exemption Radar with Gate Ready Pro.")}
              className="h-8 px-3 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-purple-700 cursor-pointer shrink-0"
            >
              Unlock Tracker
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Purchase Value Slider */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Estimated Souvenirs & Goods Purchased:</span>
                <span className="text-sm font-black text-indigo-700 dark:text-indigo-300">
                  ${purchasesDeclaredUSD} USD
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={customsIntel.limitUSD * 1.5}
                step="20"
                value={purchasesDeclaredUSD}
                onChange={(e) => setPurchasesDeclaredUSD(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>$0</span>
                <span>Exemption Cap: ${customsIntel.limitUSD}</span>
                <span>${Math.round(customsIntel.limitUSD * 1.5)}</span>
              </div>
              <p className="text-[11px] text-indigo-900/90 dark:text-indigo-200/90 mt-2 font-medium">
                {purchasesDeclaredUSD <= customsIntel.limitUSD
                  ? `✅ Safe! You are $${customsIntel.limitUSD - purchasesDeclaredUSD} under the duty-free customs exemption limit.`
                  : `⚠️ Over limit by $${purchasesDeclaredUSD - customsIntel.limitUSD}! Declare items at border control to avoid 15-30% duty penalties.`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">Duty-Free Alcohol Allowance:</span>
                <span className="text-slate-600 dark:text-slate-300 text-[11px]">{customsIntel.alcoholAllowance}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">Customs Border Advice:</span>
                <span className="text-slate-600 dark:text-slate-300 text-[11px]">{customsIntel.advice}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 5. SMART JET LAG & CIRCADIAN ADJUSTMENT ADVISOR (PRO)           */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50 dark:border-indigo-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/80 dark:border-indigo-800/80">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Jet Lag & Circadian Rhythm Advisor</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Circadian Sync
                </span>
                {!isPro && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                    <Crown className="w-2.5 h-2.5 fill-purple-950" /> Pro
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shift your sleep schedule and beat time zone fatigue before touching down in <strong className="text-indigo-600 dark:text-indigo-300">{city}</strong>.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 px-2.5 py-1 rounded-xl">
              {jetLagIntel.direction === 'EAST' ? `+${jetLagIntel.timeDiffHours}h Ahead` : `-${jetLagIntel.timeDiffHours}h Behind`}
            </span>
          </div>
        </div>

        {!isPro ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-black text-white">Circadian Sleep & Caffeine Windows</p>
                <p className="text-[11px] text-purple-200">Avoid fatigue on arrival in {city} with our scientific sleep shift protocol.</p>
              </div>
            </div>
            <button
              onClick={() => openPaywall("Unlock Jet Lag & Circadian Rhythm Advisor with Gate Ready Pro.")}
              className="h-8 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-purple-950 font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-xs"
            >
              Upgrade
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                <Coffee className="w-4 h-4" />
                <span>Caffeine Cutoff Window</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {jetLagIntel.caffeineCutoff}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Caffeine has a 6-hour half-life. Cutting it early allows adenosine receptors to trigger natural sleep.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <Sun className="w-4 h-4" />
                <span>Daylight Exposure Target</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {jetLagIntel.sunlightWindow}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Natural sunlight is the strongest environmental zeitgeber to synchronize your retinal suprachiasmatic nucleus.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>Power Nap & Sleep Rule</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {jetLagIntel.napRule}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Naps longer than 25 minutes enter deep slow-wave sleep, causing sleep inertia and ruining nighttime rest.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 6. PRE-DEPARTURE TRIP READINESS CHECKLIST (FREE FOR ALL USERS)  */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50 dark:border-purple-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200/80 dark:border-purple-800/80">
              <PlaneTakeoff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Pre-Departure Readiness Checklist
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Flight, document, and home security milestones before leaving for the airport.
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded-xl">
            {Object.values(prepChecks).filter(Boolean).length} of {Object.keys(prepChecks).length} Done
          </span>
        </div>

        <div className="space-y-2.5">
          {[
            { key: 'passport', title: 'Passport Validity > 6 Months', subtitle: 'Ensure passport has at least 6 months validity from departure date.' },
            { key: 'checkin', title: 'Airline Online Check-In (24h Before)', subtitle: 'Confirm seats, check in online, and avoid gate agent queues.' },
            { key: 'wallet_pass', title: 'Save Boarding Pass to Apple/Google Wallet', subtitle: 'Guarantees access even with spotty airport Wi-Fi.' },
            { key: 'bank_notify', title: 'Credit Card International Travel Notice', subtitle: 'Notify bank or confirm card has zero foreign transaction fee.' },
            { key: 'emergency_cash', title: `Withdraw Recommended Cash ($${totalRecommendedCash})`, subtitle: `Keep emergency local currency in your personal item.` },
            { key: 'offline_maps', title: 'Download Offline Maps for Destination', subtitle: 'Download offline Google Maps for navigation without cellular data.' },
            { key: 'chargers_packed', title: 'Phone & Laptop Chargers in Personal Item', subtitle: 'Keep chargers accessible in case checked bags are delayed.' },
            { key: 'home_security', title: 'Home Security & Thermostat Setup', subtitle: 'Lock all deadbolts, lower AC/heat, and pause mail if needed.' }
          ].map((item) => {
            const isChecked = prepChecks[item.key] || false;
            return (
              <button
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isChecked
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. DESTINATION EMERGENCY & FIRST-RESPONDER FAST CARD (ALL USERS) */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-rose-200/90 dark:border-rose-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-50 dark:border-rose-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Destination Emergency & Consular Safety Guide</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Offline Safety
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Critical numbers and translations for <strong className="text-rose-600 dark:text-rose-300">{city}</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> Police Emergency
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-xs">
                Dial 911 / 112
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Free call from any mobile phone, even without active roaming SIM.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" /> Ambulance & Medical
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-xs">
                Dial 911 / 112
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Paramedic emergency response and emergency medical dispatch.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Tourist Helpline
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                Dial +1-800-TRIP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Multi-lingual operator assistance for lost property & directions.
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
