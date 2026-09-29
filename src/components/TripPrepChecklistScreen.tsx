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
  Wallet
} from 'lucide-react';
import { AirportCitySearchInput } from './AirportCitySearchInput';

interface TripPrepChecklistScreenProps {
  trip: Trip;
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
  recommendedDailyCashUSD: number;
  recommendedCashTotalUSD: number;
  tippingCustom: string;
  atmTips: string;
  cashMandatoryFor: string[];
}

export const TripPrepChecklistScreen: React.FC<TripPrepChecklistScreenProps> = ({ trip }) => {
  const { updateTripDetails, addItemToBag } = usePacking();
  const { isPro, openPaywall } = useSubscription();

  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [destinationInput, setDestinationInput] = useState(trip.destinationCity || trip.name || 'London, UK');
  const [tripDays, setTripDays] = useState<number>(5);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Departure readiness checks state
  const [prepChecks, setPrepChecks] = useState<Record<string, boolean>>({
    passport: true,
    checkin: false,
    wallet_pass: false,
    bank_notify: false,
    emergency_cash: false,
    offline_maps: true,
    home_security: false,
    chargers_packed: false
  });

  const toggleCheck = (key: string) => {
    setPrepChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const city = trip.destinationCity || 'London, UK';

  // Realistic destination weather forecast
  const forecast: WeatherForecastDay[] = useMemo(() => {
    const lower = city.toLowerCase();
    if (lower.includes('london') || lower.includes('uk') || lower.includes('seattle') || lower.includes('ireland')) {
      return [
        { dayName: 'Day 1', date: 'Arrival', condition: 'RAIN', tempHighF: 59, tempLowF: 48, rainChance: 75, uvIndex: 3, summary: 'Intermittent brisk rain & overcast' },
        { dayName: 'Day 2', date: 'Touring', condition: 'RAIN', tempHighF: 57, tempLowF: 46, rainChance: 80, uvIndex: 2, summary: 'Afternoon downpours & breeze' },
        { dayName: 'Day 3', date: 'Mid-trip', condition: 'CLOUDY', tempHighF: 62, tempLowF: 50, rainChance: 35, uvIndex: 4, summary: 'Mostly cloudy with mild breaks' },
        { dayName: 'Day 4', date: 'Excursion', condition: 'CLOUDY', tempHighF: 63, tempLowF: 51, rainChance: 25, uvIndex: 4, summary: 'Breezy & partly overcast' },
        { dayName: 'Day 5', date: 'Return', condition: 'RAIN', tempHighF: 60, tempLowF: 49, rainChance: 65, uvIndex: 3, summary: 'Scattered light showers' }
      ];
    } else if (lower.includes('tokyo') || lower.includes('japan') || lower.includes('kyoto') || lower.includes('osaka')) {
      return [
        { dayName: 'Day 1', date: 'Arrival', condition: 'SUNNY', tempHighF: 73, tempLowF: 59, rainChance: 10, uvIndex: 7, summary: 'Crisp sunshine & light breeze' },
        { dayName: 'Day 2', date: 'Touring', condition: 'SUNNY', tempHighF: 75, tempLowF: 60, rainChance: 15, uvIndex: 8, summary: 'Pleasant & ideal walking weather' },
        { dayName: 'Day 3', date: 'Mid-trip', condition: 'CLOUDY', tempHighF: 70, tempLowF: 57, rainChance: 30, uvIndex: 5, summary: 'Passing high clouds' },
        { dayName: 'Day 4', date: 'Excursion', condition: 'RAIN', tempHighF: 66, tempLowF: 55, rainChance: 70, uvIndex: 3, summary: 'Light metropolitan showers' },
        { dayName: 'Day 5', date: 'Return', condition: 'SUNNY', tempHighF: 72, tempLowF: 58, rainChance: 10, uvIndex: 7, summary: 'Clear blue skies' }
      ];
    } else if (lower.includes('miami') || lower.includes('cancun') || lower.includes('orlando') || lower.includes('hawaii') || lower.includes('caribbean')) {
      return [
        { dayName: 'Day 1', date: 'Arrival', condition: 'SUNNY', tempHighF: 86, tempLowF: 76, rainChance: 20, uvIndex: 10, summary: 'Tropical heat & high humidity' },
        { dayName: 'Day 2', date: 'Beach', condition: 'THUNDERSTORM', tempHighF: 84, tempLowF: 75, rainChance: 65, uvIndex: 8, summary: 'Afternoon coastal thunderstorm' },
        { dayName: 'Day 3', date: 'Mid-trip', condition: 'SUNNY', tempHighF: 87, tempLowF: 77, rainChance: 15, uvIndex: 11, summary: 'Intense sunshine & tropical warmth' },
        { dayName: 'Day 4', date: 'Excursion', condition: 'SUNNY', tempHighF: 88, tempLowF: 78, rainChance: 10, uvIndex: 11, summary: 'Clear skies with ocean breeze' },
        { dayName: 'Day 5', date: 'Return', condition: 'CLOUDY', tempHighF: 85, tempLowF: 76, rainChance: 30, uvIndex: 9, summary: 'Warm with passing sun clouds' }
      ];
    } else if (lower.includes('paris') || lower.includes('france') || lower.includes('rome') || lower.includes('italy') || lower.includes('madrid')) {
      return [
        { dayName: 'Day 1', date: 'Arrival', condition: 'SUNNY', tempHighF: 72, tempLowF: 54, rainChance: 10, uvIndex: 6, summary: 'Sunny & pleasant European afternoon' },
        { dayName: 'Day 2', date: 'Museums', condition: 'SUNNY', tempHighF: 74, tempLowF: 56, rainChance: 15, uvIndex: 6, summary: 'Warm sunshine, ideal for walking' },
        { dayName: 'Day 3', date: 'Mid-trip', condition: 'CLOUDY', tempHighF: 69, tempLowF: 53, rainChance: 25, uvIndex: 5, summary: 'Mild breeze & high clouds' },
        { dayName: 'Day 4', date: 'Dining', condition: 'RAIN', tempHighF: 65, tempLowF: 50, rainChance: 55, uvIndex: 4, summary: 'Scattered afternoon rain showers' },
        { dayName: 'Day 5', date: 'Return', condition: 'SUNNY', tempHighF: 71, tempLowF: 52, rainChance: 10, uvIndex: 6, summary: 'Clear skies & mild temperatures' }
      ];
    }

    // Default worldwide destination forecast
    return [
      { dayName: 'Day 1', date: 'Arrival', condition: 'SUNNY', tempHighF: 73, tempLowF: 57, rainChance: 15, uvIndex: 6, summary: 'Comfortable sunny arrival' },
      { dayName: 'Day 2', date: 'Exploring', condition: 'CLOUDY', tempHighF: 70, tempLowF: 55, rainChance: 35, uvIndex: 5, summary: 'Partly cloudy with pleasant breeze' },
      { dayName: 'Day 3', date: 'Mid-trip', condition: 'RAIN', tempHighF: 66, tempLowF: 52, rainChance: 60, uvIndex: 4, summary: 'Passing showers in afternoon' },
      { dayName: 'Day 4', date: 'Excursion', condition: 'SUNNY', tempHighF: 75, tempLowF: 58, rainChance: 10, uvIndex: 7, summary: 'Bright skies, warm temperatures' },
      { dayName: 'Day 5', date: 'Return', condition: 'SUNNY', tempHighF: 74, tempLowF: 56, rainChance: 10, uvIndex: 6, summary: 'Mild weather for travel' }
    ];
  }, [city]);

  // Destination Cash & Payment Profile
  const cashProfile: CashAdviceProfile = useMemo(() => {
    const lower = city.toLowerCase();

    if (lower.includes('uk') || lower.includes('london') || lower.includes('scotland') || lower.includes('sweden') || lower.includes('norway') || lower.includes('denmark')) {
      return {
        digitalScore: 98,
        ratingText: 'Practically 100% Cashless (Card & Contactless Only)',
        primaryAdvice: 'You almost certainly do NOT need physical cash. London buses and tube do not accept cash at all. Apple Pay, Google Pay, and contactless cards are standard everywhere.',
        cardAcceptance: 'Universal (99%+). Visa and Mastercard accepted everywhere.',
        contactlessSupport: 'Universal. Tap-to-pay via smartphone or contactless card on all transit, cafes, and taxis.',
        recommendedDailyCashUSD: 10,
        recommendedCashTotalUSD: 40,
        tippingCustom: 'Optional / 10-12.5% service charge often automatically added to restaurant bills. Tipping at pubs is unusual.',
        atmTips: 'Use bank-owned ATMs (Barclays, HSBC). Never accept dynamic currency conversion (DCC); always choose GBP.',
        cashMandatoryFor: ['Rare coin-operated public restrooms (20p-50p)', 'Occasional flea market antique stalls']
      };
    } else if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('kyoto') || lower.includes('osaka')) {
      return {
        digitalScore: 60,
        ratingText: 'Cash Still Essential (Hybrid: 60% Card / 40% Cash)',
        primaryAdvice: 'While convenience stores and big department stores take cards, Japan remains heavily cash-reliant for ramen ticket machines, local buses, shrines, and coin lockers.',
        cardAcceptance: 'High at hotels, department stores, and 7-Eleven. Low at small eateries, temple entrance fees, and street stalls.',
        contactlessSupport: 'Moderate. Suica/Pasmo IC cards on your phone work great for transit and vending machines.',
        recommendedDailyCashUSD: 40,
        recommendedCashTotalUSD: 200,
        tippingCustom: 'STRICTLY NO TIPPING. Tipping is considered confusing or insulting in Japanese culture.',
        atmTips: 'Use 7-Eleven (Seven Bank) or Japan Post ATMs with your foreign debit card. They have English menus and low fees.',
        cashMandatoryFor: ['Ramen ticket vending machines', 'Shrine and temple admission tickets', 'Coin lockers at train stations', 'Local non-JR buses & small izakayas', 'Traditional street food stalls']
      };
    } else if (lower.includes('mexico') || lower.includes('cancun') || lower.includes('caribbean') || lower.includes('cabo') || lower.includes('costa rica')) {
      return {
        digitalScore: 55,
        ratingText: 'Cash Strongly Recommended for Daily Activities (50/50 Split)',
        primaryAdvice: 'Resorts and nice restaurants take credit cards, but cash (Mexican Pesos or small USD bills) is required for tips, taxis, beach excursions, small tacos, and local craft markets.',
        cardAcceptance: 'High at resorts, hotels, and supermarkets. Low to medium in towns and taxis.',
        contactlessSupport: 'Moderate in cities and malls, rare in beach shacks.',
        recommendedDailyCashUSD: 45,
        recommendedCashTotalUSD: 220,
        tippingCustom: 'Expected: 10%–15% at restaurants. $1–$2 USD per drink/bag for bartenders, bellhops, and tour guides.',
        atmTips: 'Use ATMs physically inside major banks (Santander, BBVA, Banamex). Decline the ATM currency conversion rate!',
        cashMandatoryFor: ['Taxis and colectivos (shared vans)', 'Beach tips for servers and towel attendants', 'Local taco stands & fruit stalls', 'Artisan market souvenirs', 'Small entrance fees and tolls']
      };
    } else if (lower.includes('france') || lower.includes('paris') || lower.includes('italy') || lower.includes('spain') || lower.includes('germany') || lower.includes('europe')) {
      return {
        digitalScore: 85,
        ratingText: 'High Card Acceptance with Small Cash Reserve',
        primaryAdvice: 'Cards are accepted across 90%+ of merchants. However, carrying €50–€100 in cash is smart for small bakeries (boulangeries), gelato, public WC turnstiles, and rural areas.',
        cardAcceptance: 'High. Visa and Mastercard widely accepted. Amex has lower acceptance in small shops.',
        contactlessSupport: 'Very high. Tap-to-pay via Apple Pay/Google Pay is widely adopted across metro systems and cafes.',
        recommendedDailyCashUSD: 20,
        recommendedCashTotalUSD: 100,
        tippingCustom: 'Discretionary. Leaving 5%–10% or rounding up to the nearest €5 is appreciated for good table service.',
        atmTips: 'Use official bank ATMs (BNP Paribas, Intesa, Santander). Avoid standalone yellow/blue Euronet ATMs with huge fees.',
        cashMandatoryFor: ['Bakery purchases under €5 (some have card minimums)', 'Public toilets (€0.50–€1.00 coin)', 'Coin lockers at historic sites', 'Flea markets & church donation boxes']
      };
    }

    // Default US / General profile
    return {
      digitalScore: 92,
      ratingText: 'Primarily Digital & Card Friendly',
      primaryAdvice: 'Nearly all transactions can be completed with credit card or mobile contactless wallet. Keep $50–$100 cash on hand for valet, hotel luggage tipping, or unexpected emergencies.',
      cardAcceptance: 'Universal across hotels, transit, dining, and retail.',
      contactlessSupport: 'Ubiquitous. Apple Pay and Google Pay accepted at over 90% of registers.',
      recommendedDailyCashUSD: 15,
      recommendedCashTotalUSD: 75,
      tippingCustom: 'Standard 18%–22% at sit-down dining. $2–$5 for hotel luggage handlers and valet.',
      atmTips: 'Use your own national bank ATMs to avoid out-of-network surcharge fees.',
      cashMandatoryFor: ['Hotel bellhop and valet tips', 'Occasional farmers market vendors', 'Food trucks with card outages']
    };
  }, [city]);

  const totalRecommendedCash = Math.round(
    cashProfile.recommendedDailyCashUSD * Math.max(1, tripDays) * Math.max(1, trip.familyMembers?.length || 1)
  );

  const formatTemp = (f: number) => {
    if (tempUnit === 'C') {
      return `${Math.round(((f - 32) * 5) / 9)}°C`;
    }
    return `${f}°F`;
  };

  const handleAddItemToCurrentBag = (itemName: string) => {
    if (!trip.bags || trip.bags.length === 0) return;
    const targetBag = trip.bags[0];
    addItemToBag(trip.id, targetBag.id, itemName, 'Weather Essentials', 1);
    setAddedItems((prev) => new Set([...prev, itemName]));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-purple-100 dark:border-purple-950/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trip Intel & Travel Checklists
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
              <Crown className="w-2.5 h-2.5 fill-white inline mr-1" /> Pro
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Destination climate forecasts, local cash vs. digital payment advisor, currency customs, and pre-departure checklist.
          </p>
        </div>

        {/* Temperature Unit Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTempUnit('F')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                tempUnit === 'F' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              °F
            </button>
            <button
              onClick={() => setTempUnit('C')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                tempUnit === 'C' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              °C
            </button>
          </div>
        </div>
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
            Destination Weather & Travel Cash Advisor
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-2 max-w-lg mx-auto leading-relaxed">
            Upgrade to Gate Ready Pro to unlock customized 5-day weather forecasts with climate-smart packing alerts, local cash vs. digital payment recommendations, contactless support ratings, and smart pre-departure checklists.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openPaywall("Upgrade to Gate Ready Pro to access Destination Climate & Cash Intelligence.")}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-purple-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-400/30 transition-all cursor-pointer active:scale-95"
            >
              <Crown className="w-4 h-4 fill-purple-950" />
              <span>Unlock Travel Intel & Checklists</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-purple-800/60 text-left">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <CloudSun className="w-5 h-5 text-amber-400 mb-1" />
              <p className="text-xs font-bold text-white">5-Day Weather Forecast</p>
              <p className="text-[11px] text-purple-300">Rain & UV index alerts tailored to {city}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Banknote className="w-5 h-5 text-emerald-400 mb-1" />
              <p className="text-xs font-bold text-white">Cash vs. Card Guide</p>
              <p className="text-[11px] text-purple-300">Exact recommended cash buffer & digital readiness</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-purple-400 mb-1" />
              <p className="text-xs font-bold text-white">Pre-Flight Checklists</p>
              <p className="text-[11px] text-purple-300">Check-in, passport, and departure security checks</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* 1. DESTINATION WEATHER & CLIMATE PACKING ADVISOR               */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50 dark:border-purple-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/80 dark:border-amber-800/80">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Destination Climate & Forecast</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Live Advisor
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Weather conditions for <strong className="text-purple-700 dark:text-purple-300">{city}</strong>
                  </p>
                </div>
              </div>

              {/* City Changer */}
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
                  className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-center"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Change Destination City</span>
                </button>
              )}
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
          {/* 2. TRAVEL CASH & DIGITAL PAYMENT ADVISOR                       */}
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

            {/* Interactive Cash Calculator */}
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

            {/* Key Insights Grid */}
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
          </div>

          {/* ============================================================== */}
          {/* 3. PRE-DEPARTURE TRIP READINESS CHECKLIST                       */}
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
        </>
      )}
    </div>
  );
};
