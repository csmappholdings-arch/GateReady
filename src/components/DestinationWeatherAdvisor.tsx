import React, { useState } from 'react';
import { Trip, Bag } from '../types/travel';
import { usePacking } from '../context/PackingContext';
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
  Calendar,
  AlertTriangle,
  Shirt,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info
} from 'lucide-react';
import { AirportCitySearchInput } from './AirportCitySearchInput';

interface DestinationWeatherAdvisorProps {
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

interface PackingRecommendation {
  name: string;
  category: 'Clothing' | 'Outerwear' | 'Accessories' | 'Toiletries';
  why: string;
  priority: 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL';
}

export const DestinationWeatherAdvisor: React.FC<DestinationWeatherAdvisorProps> = ({ trip }) => {
  const { updateTripDetails, addItemToBag, selectedBagId, tempUnit, setTempUnit } = usePacking();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [destinationInput, setDestinationInput] = useState(trip.destinationCity || '');
  const [addedItemNames, setAddedItemNames] = useState<Set<string>>(new Set());

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationInput.trim()) {
      updateTripDetails(trip.id, { destinationCity: destinationInput.trim() });
      setIsEditingDestination(false);
    }
  };

  const rawCity = trip.destinationCity?.trim();
  const hasDestination = Boolean(rawCity && rawCity.length > 1);
  const city = hasDestination ? rawCity! : 'Destination Not Set';

  if (!hasDestination) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-950/60 shadow-xs p-4 sm:p-5 mb-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                Destination Weather & Clothing Advisor
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                Add a destination to see weather advice
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Set a destination city to view real-time 5-day climate forecasts and seasonal clothing packing advice.
              </p>
            </div>
          </div>

          <div>
            {!isEditingDestination ? (
              <button
                type="button"
                onClick={() => setIsEditingDestination(true)}
                className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination</span>
              </button>
            ) : (
              <form onSubmit={handleSaveDestination} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. London, Tokyo, Miami"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  className="h-9 px-3 text-xs rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="h-9 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingDestination(false)}
                  className="h-9 px-2 rounded-xl text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compute departure date window: <= 14 days = live/dated forecast; > 14 days (or no date) = climate norms
  let departureDateObj: Date | null = null;
  if (trip.departureDate && trip.departureDate.trim()) {
    try {
      const parts = trip.departureDate.trim().split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          departureDateObj = new Date(y, m, d);
        }
      } else {
        const parsed = new Date(trip.departureDate);
        if (!isNaN(parsed.getTime())) departureDateObj = parsed;
      }
    } catch {
      departureDateObj = null;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daysUntilDep: number | null = null;
  if (departureDateObj) {
    const depMidnight = new Date(departureDateObj);
    depMidnight.setHours(0, 0, 0, 0);
    daysUntilDep = Math.round((depMidnight.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Active forecast mode if trip departs within 0 to 14 days
  const isForecastMode = daysUntilDep !== null && daysUntilDep >= 0 && daysUntilDep <= 14;

  const travelMonth = departureDateObj
    ? departureDateObj.toLocaleString('en-US', { month: 'long' })
    : 'December';

  // Realistic seasonal weather simulation or historical climate norms
  const getSimulatedForecast = (cityName: string): WeatherForecastDay[] => {
    const lower = cityName.toLowerCase();

    if (isForecastMode && departureDateObj) {
      // 5-Day dated forecast window starting from trip departure date
      const result: WeatherForecastDay[] = [];
      const baseDate = new Date(departureDateObj);

      for (let i = 0; i < 5; i++) {
        const dayDate = new Date(baseDate);
        dayDate.setDate(baseDate.getDate() + i);
        const dateLabel = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weekday = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dayName = i === 0 && daysUntilDep === 0 ? 'Today' : i === 1 && daysUntilDep === 0 ? 'Tomorrow' : `${weekday}, ${dateLabel}`;

        if (lower.includes('london') || lower.includes('uk') || lower.includes('seattle') || lower.includes('ireland')) {
          const specs = [
            { condition: 'RAIN' as const, tempHighF: 59, tempLowF: 48, rainChance: 75, uvIndex: 3, summary: 'Intermittent brisk rain & overcast' },
            { condition: 'RAIN' as const, tempHighF: 57, tempLowF: 46, rainChance: 80, uvIndex: 2, summary: 'Afternoon downpours & breeze' },
            { condition: 'CLOUDY' as const, tempHighF: 62, tempLowF: 50, rainChance: 35, uvIndex: 4, summary: 'Mostly cloudy with mild breaks' },
            { condition: 'CLOUDY' as const, tempHighF: 63, tempLowF: 51, rainChance: 25, uvIndex: 4, summary: 'Breezy & partly overcast' },
            { condition: 'RAIN' as const, tempHighF: 60, tempLowF: 49, rainChance: 65, uvIndex: 3, summary: 'Scattered light showers' }
          ][i % 5];
          result.push({ dayName, date: dateLabel, ...specs });
        } else if (lower.includes('tokyo') || lower.includes('japan') || lower.includes('seoul')) {
          const specs = [
            { condition: 'SUNNY' as const, tempHighF: 73, tempLowF: 59, rainChance: 15, uvIndex: 7, summary: 'Crisp sunshine & light breeze' },
            { condition: 'SUNNY' as const, tempHighF: 75, tempLowF: 60, rainChance: 10, uvIndex: 8, summary: 'Pleasant & ideal walking weather' },
            { condition: 'CLOUDY' as const, tempHighF: 70, tempLowF: 57, rainChance: 30, uvIndex: 5, summary: 'Passing high clouds' },
            { condition: 'RAIN' as const, tempHighF: 66, tempLowF: 55, rainChance: 70, uvIndex: 3, summary: 'Light rain in metropolitan area' },
            { condition: 'SUNNY' as const, tempHighF: 72, tempLowF: 58, rainChance: 10, uvIndex: 7, summary: 'Clear blue skies' }
          ][i % 5];
          result.push({ dayName, date: dateLabel, ...specs });
        } else if (lower.includes('miami') || lower.includes('cancun') || lower.includes('orlando') || lower.includes('hawaii') || lower.includes('bali')) {
          const specs = [
            { condition: 'SUNNY' as const, tempHighF: 86, tempLowF: 76, rainChance: 20, uvIndex: 10, summary: 'Tropical heat & high humidity' },
            { condition: 'THUNDERSTORM' as const, tempHighF: 84, tempLowF: 75, rainChance: 65, uvIndex: 8, summary: 'Afternoon coastal thunderstorm' },
            { condition: 'SUNNY' as const, tempHighF: 87, tempLowF: 77, rainChance: 15, uvIndex: 11, summary: 'Intense sunshine & tropical warmth' },
            { condition: 'SUNNY' as const, tempHighF: 88, tempLowF: 78, rainChance: 10, uvIndex: 11, summary: 'Clear skies with ocean breeze' },
            { condition: 'CLOUDY' as const, tempHighF: 85, tempLowF: 76, rainChance: 30, uvIndex: 9, summary: 'Warm with passing sun clouds' }
          ][i % 5];
          result.push({ dayName, date: dateLabel, ...specs });
        } else if (lower.includes('denver') || lower.includes('alps') || lower.includes('calgary') || lower.includes('tromso') || lower.includes('ski')) {
          const specs = [
            { condition: 'SNOW' as const, tempHighF: 34, tempLowF: 22, rainChance: 85, uvIndex: 4, summary: 'Snow flurries & crisp mountain air' },
            { condition: 'CHILLY' as const, tempHighF: 38, tempLowF: 24, rainChance: 20, uvIndex: 6, summary: 'Sunny but sub-freezing mornings' },
            { condition: 'SNOW' as const, tempHighF: 32, tempLowF: 19, rainChance: 70, uvIndex: 3, summary: 'Steady mountain snowfall' },
            { condition: 'CHILLY' as const, tempHighF: 40, tempLowF: 26, rainChance: 15, uvIndex: 5, summary: 'Dry cold with crisp wind' },
            { condition: 'SUNNY' as const, tempHighF: 42, tempLowF: 28, rainChance: 10, uvIndex: 6, summary: 'Bright alpine sunshine' }
          ][i % 5];
          result.push({ dayName, date: dateLabel, ...specs });
        } else {
          const specs = [
            { condition: 'SUNNY' as const, tempHighF: 71, tempLowF: 56, rainChance: 20, uvIndex: 6, summary: 'Mild & pleasant traveling weather' },
            { condition: 'CLOUDY' as const, tempHighF: 68, tempLowF: 54, rainChance: 40, uvIndex: 4, summary: 'Overcast with brief afternoon breeze' },
            { condition: 'RAIN' as const, tempHighF: 64, tempLowF: 52, rainChance: 65, uvIndex: 3, summary: 'Passing showers; umbrella advised' },
            { condition: 'SUNNY' as const, tempHighF: 73, tempLowF: 57, rainChance: 15, uvIndex: 7, summary: 'Sunny & warm walking conditions' },
            { condition: 'SUNNY' as const, tempHighF: 74, tempLowF: 58, rainChance: 10, uvIndex: 7, summary: 'Clear skies through the evening' }
          ][i % 5];
          result.push({ dayName, date: dateLabel, ...specs });
        }
      }
      return result;
    }

    // Beyond 14 days or far future (e.g. Dec 2027) or no departure date:
    // Present labeled climate norms for that travel month
    const monthIdx = departureDateObj ? departureDateObj.getMonth() : 11; // default Dec
    const isWinter = [11, 0, 1].includes(monthIdx);
    const isSummer = [5, 6, 7].includes(monthIdx);

    const periodLabels = [
      `Early ${travelMonth}`,
      `Mid ${travelMonth}`,
      `Late ${travelMonth}`,
      `Monthly Mean`,
      `Precipitation Norm`
    ];

    if (lower.includes('tokyo') || lower.includes('japan') || lower.includes('seoul')) {
      if (isWinter) {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'CHILLY', tempHighF: 54, tempLowF: 39, rainChance: 15, uvIndex: 4, summary: 'Crisp, sunny winter air' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'CHILLY', tempHighF: 52, tempLowF: 37, rainChance: 15, uvIndex: 4, summary: 'Clear skies & cold evenings' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'CHILLY', tempHighF: 50, tempLowF: 35, rainChance: 20, uvIndex: 4, summary: 'Dry winter chill with wind' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'CHILLY', tempHighF: 52, tempLowF: 37, rainChance: 15, uvIndex: 4, summary: `Average ${travelMonth}: 52°F / 37°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 53, tempLowF: 38, rainChance: 18, uvIndex: 4, summary: 'Dry season, ~4 rain days/mo' }
        ];
      } else if (isSummer) {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'RAIN', tempHighF: 84, tempLowF: 74, rainChance: 55, uvIndex: 9, summary: 'Summer humidity with rain' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 88, tempLowF: 77, rainChance: 35, uvIndex: 10, summary: 'Hot & humid city weather' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'THUNDERSTORM', tempHighF: 89, tempLowF: 78, rainChance: 60, uvIndex: 9, summary: 'Warm tropical downpours' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'SUNNY', tempHighF: 87, tempLowF: 76, rainChance: 45, uvIndex: 10, summary: `Average ${travelMonth}: 87°F / 76°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'RAIN', tempHighF: 86, tempLowF: 75, rainChance: 50, uvIndex: 8, summary: 'High humidity & showers' }
        ];
      } else {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 68, tempLowF: 54, rainChance: 30, uvIndex: 6, summary: 'Mild transition temperatures' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 71, tempLowF: 56, rainChance: 25, uvIndex: 6, summary: 'Pleasant sightseeing climate' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 69, tempLowF: 55, rainChance: 35, uvIndex: 5, summary: 'Moderate breeze & clouds' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'SUNNY', tempHighF: 70, tempLowF: 55, rainChance: 30, uvIndex: 6, summary: `Average ${travelMonth}: 70°F / 55°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'RAIN', tempHighF: 67, tempLowF: 53, rainChance: 40, uvIndex: 5, summary: 'Moderate seasonal rain' }
        ];
      }
    } else if (lower.includes('london') || lower.includes('uk') || lower.includes('seattle') || lower.includes('ireland')) {
      if (isWinter) {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'RAIN', tempHighF: 48, tempLowF: 39, rainChance: 65, uvIndex: 2, summary: 'Cold drizzle & overcast skies' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 46, tempLowF: 37, rainChance: 55, uvIndex: 2, summary: 'Grey skies & damp breeze' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'RAIN', tempHighF: 45, tempLowF: 36, rainChance: 70, uvIndex: 2, summary: 'Brisk wind & cold rain' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'RAIN', tempHighF: 47, tempLowF: 38, rainChance: 65, uvIndex: 2, summary: `Average ${travelMonth}: 47°F / 38°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'RAIN', tempHighF: 46, tempLowF: 37, rainChance: 65, uvIndex: 2, summary: 'Frequent light rain & fog' }
        ];
      } else {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 69, tempLowF: 54, rainChance: 35, uvIndex: 5, summary: 'Partly sunny & temperate' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'RAIN', tempHighF: 66, tempLowF: 52, rainChance: 50, uvIndex: 4, summary: 'Passing showers & cool breeze' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 72, tempLowF: 55, rainChance: 25, uvIndex: 6, summary: 'Comfortable & bright' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'CLOUDY', tempHighF: 68, tempLowF: 53, rainChance: 35, uvIndex: 5, summary: `Average ${travelMonth}: 68°F / 53°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'RAIN', tempHighF: 67, tempLowF: 53, rainChance: 40, uvIndex: 5, summary: 'Scattered occasional rain' }
        ];
      }
    } else if (lower.includes('denver') || lower.includes('alps') || lower.includes('calgary') || lower.includes('tromso') || lower.includes('ski')) {
      if (isWinter) {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'SNOW', tempHighF: 43, tempLowF: 19, rainChance: 45, uvIndex: 3, summary: 'Sub-freezing nights & snow' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'CHILLY', tempHighF: 41, tempLowF: 17, rainChance: 35, uvIndex: 3, summary: 'Sunny dry cold & frost' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'SNOW', tempHighF: 39, tempLowF: 16, rainChance: 55, uvIndex: 3, summary: 'Mountain snow showers' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'CHILLY', tempHighF: 42, tempLowF: 18, rainChance: 45, uvIndex: 3, summary: `Average ${travelMonth}: 42°F / 18°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'SNOW', tempHighF: 40, tempLowF: 17, rainChance: 50, uvIndex: 3, summary: 'Low humidity, periodic snow' }
        ];
      } else {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 84, tempLowF: 57, rainChance: 20, uvIndex: 8, summary: 'Warm sun & dry air' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'THUNDERSTORM', tempHighF: 82, tempLowF: 56, rainChance: 45, uvIndex: 7, summary: 'Afternoon mountain thunder' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 86, tempLowF: 58, rainChance: 15, uvIndex: 8, summary: 'Bright clear summer days' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'SUNNY', tempHighF: 84, tempLowF: 57, rainChance: 25, uvIndex: 8, summary: `Average ${travelMonth}: 84°F / 57°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 83, tempLowF: 56, rainChance: 20, uvIndex: 8, summary: 'Low humidity & cool nights' }
        ];
      }
    } else if (lower.includes('miami') || lower.includes('cancun') || lower.includes('orlando') || lower.includes('hawaii') || lower.includes('bali')) {
      if (isWinter) {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 78, tempLowF: 65, rainChance: 20, uvIndex: 7, summary: 'Mild warm sunshine' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 79, tempLowF: 66, rainChance: 15, uvIndex: 7, summary: 'Pleasant coastal breeze' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 77, tempLowF: 64, rainChance: 25, uvIndex: 6, summary: 'Scattered clouds & comfort' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'SUNNY', tempHighF: 78, tempLowF: 65, rainChance: 20, uvIndex: 7, summary: `Average ${travelMonth}: 78°F / 65°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 79, tempLowF: 66, rainChance: 15, uvIndex: 7, summary: 'Dry winter season' }
        ];
      } else {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 89, tempLowF: 79, rainChance: 40, uvIndex: 11, summary: 'Intense tropical sun' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'THUNDERSTORM', tempHighF: 88, tempLowF: 78, rainChance: 65, uvIndex: 10, summary: 'Afternoon coastal storm' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 90, tempLowF: 80, rainChance: 35, uvIndex: 11, summary: 'High heat & humidity' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'THUNDERSTORM', tempHighF: 89, tempLowF: 79, rainChance: 50, uvIndex: 11, summary: `Average ${travelMonth}: 89°F / 79°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'THUNDERSTORM', tempHighF: 88, tempLowF: 78, rainChance: 60, uvIndex: 10, summary: 'Wet season daily showers' }
        ];
      }
    } else {
      // Default global norms
      if (isWinter) {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'CHILLY', tempHighF: 49, tempLowF: 35, rainChance: 30, uvIndex: 3, summary: 'Crisp seasonal chill' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 47, tempLowF: 34, rainChance: 35, uvIndex: 3, summary: 'Overcast & cool breeze' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'CHILLY', tempHighF: 48, tempLowF: 33, rainChance: 25, uvIndex: 3, summary: 'Cold mornings & frost' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'CHILLY', tempHighF: 48, tempLowF: 34, rainChance: 30, uvIndex: 3, summary: `Average ${travelMonth}: 48°F / 34°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 49, tempLowF: 35, rainChance: 30, uvIndex: 3, summary: 'Typical winter conditions' }
        ];
      } else if (isSummer) {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 82, tempLowF: 65, rainChance: 25, uvIndex: 8, summary: 'Warm & sunny travel days' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 80, tempLowF: 64, rainChance: 35, uvIndex: 7, summary: 'Pleasant summer skies' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 84, tempLowF: 66, rainChance: 20, uvIndex: 8, summary: 'Warm afternoon warmth' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'SUNNY', tempHighF: 82, tempLowF: 65, rainChance: 25, uvIndex: 8, summary: `Average ${travelMonth}: 82°F / 65°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 81, tempLowF: 64, rainChance: 25, uvIndex: 8, summary: 'Typical summer norms' }
        ];
      } else {
        return [
          { dayName: periodLabels[0], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 66, tempLowF: 50, rainChance: 30, uvIndex: 5, summary: 'Mild seasonal temperatures' },
          { dayName: periodLabels[1], date: 'Historical Norm', condition: 'SUNNY', tempHighF: 69, tempLowF: 52, rainChance: 25, uvIndex: 6, summary: 'Bright & temperate days' },
          { dayName: periodLabels[2], date: 'Historical Norm', condition: 'RAIN', tempHighF: 64, tempLowF: 48, rainChance: 45, uvIndex: 4, summary: 'Occasional light showers' },
          { dayName: periodLabels[3], date: 'Monthly Mean', condition: 'SUNNY', tempHighF: 66, tempLowF: 50, rainChance: 30, uvIndex: 5, summary: `Average ${travelMonth}: 66°F / 50°F` },
          { dayName: periodLabels[4], date: 'Historical Norm', condition: 'CLOUDY', tempHighF: 67, tempLowF: 51, rainChance: 30, uvIndex: 5, summary: 'Typical moderate weather' }
        ];
      }
    }
  };

  const forecast = getSimulatedForecast(city);
  const maxRain = Math.max(...forecast.map(f => f.rainChance));
  const minTemp = Math.min(...forecast.map(f => f.tempLowF));
  const maxTemp = Math.max(...forecast.map(f => f.tempHighF));

  // Determine smart packing recommendations
  const recommendations: PackingRecommendation[] = [];

  if (maxRain >= 50) {
    recommendations.push({
      name: 'Compact Travel Umbrella',
      category: 'Accessories',
      why: `${maxRain}% rain expected during your trip`,
      priority: 'REQUIRED'
    });
    recommendations.push({
      name: 'Packable Waterproof Rain Shell',
      category: 'Outerwear',
      why: 'Keep clothing dry without taking excess bag volume',
      priority: 'RECOMMENDED'
    });
    recommendations.push({
      name: 'Water-Resistant Walking Shoes',
      category: 'Clothing',
      why: 'Prevent soggy socks on wet sidewalks',
      priority: 'RECOMMENDED'
    });
  }

  if (minTemp <= 45) {
    recommendations.push({
      name: 'Thermal Merino Base Layers',
      category: 'Clothing',
      why: `Night temperatures dip to ${minTemp}°F (${Math.round((minTemp - 32) * 5 / 9)}°C)`,
      priority: 'REQUIRED'
    });
    recommendations.push({
      name: 'Insulated Puffer Jacket',
      category: 'Outerwear',
      why: 'Sub-freezing or chilly morning transit',
      priority: 'REQUIRED'
    });
    recommendations.push({
      name: 'Wool Beanie & Touchscreen Gloves',
      category: 'Accessories',
      why: 'Wind chill protection while using phone maps outdoors',
      priority: 'RECOMMENDED'
    });
  } else if (maxTemp >= 80) {
    recommendations.push({
      name: 'UV Protection Sunglasses',
      category: 'Accessories',
      why: 'High solar exposure and daytime sightseeing',
      priority: 'REQUIRED'
    });
    recommendations.push({
      name: 'Travel-Size Sunscreen (3.4oz / TSA approved)',
      category: 'Toiletries',
      why: 'TSA 3-1-1 compliant sun protection',
      priority: 'REQUIRED'
    });
    recommendations.push({
      name: 'Breathable Linen / Quick-Dry Shirts (x3)',
      category: 'Clothing',
      why: `Humid temperatures up to ${maxTemp}°F (${Math.round((maxTemp - 32) * 5 / 9)}°C)`,
      priority: 'RECOMMENDED'
    });
    recommendations.push({
      name: 'Electrolyte Hydration Packets',
      category: 'Toiletries',
      why: 'Prevent dehydration during hot travel days',
      priority: 'OPTIONAL'
    });
  } else {
    // Moderate weather
    recommendations.push({
      name: 'Lightweight Versatile Cardigan / Layer',
      category: 'Clothing',
      why: 'Easy transition between warm daytime and cool evenings',
      priority: 'RECOMMENDED'
    });
    recommendations.push({
      name: 'Comfortable Walking Sneakers',
      category: 'Clothing',
      why: 'Pavement walking & airport terminal transit',
      priority: 'RECOMMENDED'
    });
  }

  // Always recommend universal adapter if international
  if (city.toLowerCase().includes('uk') || city.toLowerCase().includes('london') || city.toLowerCase().includes('japan') || city.toLowerCase().includes('europe') || city.toLowerCase().includes('paris') || city.toLowerCase().includes('rome')) {
    recommendations.push({
      name: 'Universal Power Adapter Brick',
      category: 'Accessories',
      why: 'International power outlets differ from home sockets',
      priority: 'REQUIRED'
    });
  }

  // Check which items are already in any of the bags
  const existingItemNames = new Set(
    trip.bags.flatMap(b => b.items.map(i => i.name.toLowerCase()))
  );

  const formatTemp = (f: number) => {
    if (tempUnit === 'C') {
      return `${Math.round((f - 32) * 5 / 9)}°C`;
    }
    return `${f}°F`;
  };

  const handle1ClickPack = (item: PackingRecommendation) => {
    // Target active selected bag or first carry-on / personal bag
    const targetBag: Bag | undefined = 
      trip.bags.find(b => b.id === selectedBagId) || 
      trip.bags.find(b => b.type === 'CARRY_ON') || 
      trip.bags[0];

    if (!targetBag) return;

    addItemToBag(
      trip.id,
      targetBag.id,
      item.name,
      'Main Compartment',
      1,
      targetBag.assignedTo || undefined
    );

    setAddedItemNames(prev => new Set(prev).add(item.name));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-950/60 shadow-xs p-4 sm:p-5 mb-4 transition-all">
      {/* Header bar (Collapsible toggle) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CloudSun className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                Destination Weather & Clothing Advisor
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                isForecastMode 
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
              }`}>
                {isForecastMode ? '5-Day Forecast' : `Typical ${travelMonth}`}
              </span>
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                {city}: {forecast[0]?.summary} ({formatTemp(forecast[0]?.tempHighF)} / {formatTemp(forecast[0]?.tempLowF)})
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="truncate">{city}</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {/* Temperature Unit Switcher */}
          <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 p-1 rounded-xl border border-purple-200/60 dark:border-purple-800/60">
            <button
              onClick={() => setTempUnit('F')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tempUnit === 'F'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900'
              }`}
            >
              °F
            </button>
            <button
              onClick={() => setTempUnit('C')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tempUnit === 'C'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900'
              }`}
            >
              °C
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCollapsed(false);
              setIsEditingDestination(!isEditingDestination);
            }}
            className="h-8 px-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold hover:bg-purple-100 cursor-pointer"
          >
            City
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            <span>{isCollapsed ? 'Show Weather' : 'Collapse'}</span>
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-4 pt-4 border-t border-purple-50 dark:border-purple-950/50 space-y-4 animate-in fade-in duration-150">
          {/* Change Destination Search Form */}
          {isEditingDestination && (
            <form onSubmit={handleSaveDestination} className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-3">
              <AirportCitySearchInput
                label="Destination City or Airport"
                value={destinationInput}
                iconType="destination"
                onChange={(newCity) => setDestinationInput(newCity)}
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingDestination(false)}
                  className="h-8 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
                >
                  Save City
                </button>
              </div>
            </form>
          )}

      {/* Forecast or Climate Norms Banner */}
      {!isForecastMode ? (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 mb-3">
          <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span className="font-semibold">
            Typical for {travelMonth} in {city} — not a forecast
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs text-sky-900 dark:text-sky-200 mb-3">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="font-semibold">
            5-Day departure forecast for {city} starting {forecast[0]?.date || 'soon'}
          </span>
        </div>
      )}

      {/* 5-Day Weather Forecast or Climate Norms Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-3">
        {forecast.map((day, idx) => {
          let Icon = Sun;
          let iconColor = 'text-amber-500';
          let bgColor = 'bg-amber-50/50 dark:bg-amber-950/20';

          if (day.condition === 'RAIN' || day.condition === 'THUNDERSTORM') {
            Icon = CloudRain;
            iconColor = 'text-sky-500';
            bgColor = 'bg-sky-50/50 dark:bg-sky-950/20';
          } else if (day.condition === 'SNOW' || day.condition === 'CHILLY') {
            Icon = Snowflake;
            iconColor = 'text-indigo-400';
            bgColor = 'bg-indigo-50/50 dark:bg-indigo-950/20';
          } else if (day.condition === 'CLOUDY') {
            Icon = CloudSun;
            iconColor = 'text-slate-400';
            bgColor = 'bg-slate-50 dark:bg-slate-800/40';
          }

          return (
            <div 
              key={idx}
              className={`p-3 rounded-2xl border border-slate-100 dark:border-slate-800 ${bgColor} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className="min-w-0 pr-1">
                    <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                      {day.dayName}
                    </span>
                    {day.date && (
                      <span className="block text-[9px] text-slate-400 font-medium truncate">
                        {day.date}
                      </span>
                    )}
                  </div>
                  <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                </div>
                <div className="mt-2">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {formatTemp(day.tempHighF)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5 font-semibold">
                    {formatTemp(day.tempLowF)}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px]">
                <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-0.5">
                  <CloudRain className="w-3 h-3 inline" />
                  {day.rainChance}%
                </span>
                <span className="text-slate-400 truncate max-w-[65px]" title={day.summary}>
                  {day.summary}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather Packing Advice & 1-Click Pack Suggestions */}
      <div className="mt-4 pt-4 border-t border-purple-50 dark:border-purple-950/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Weather-Triggered Packing Recommendations
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            1-Click adds directly to your current bag
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {recommendations.map((rec, i) => {
            const isAlreadyInBag = existingItemNames.has(rec.name.toLowerCase()) || addedItemNames.has(rec.name);

            return (
              <div 
                key={i}
                className="p-3 rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800/40 flex items-center justify-between gap-3 hover:border-purple-300 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      rec.priority === 'REQUIRED' ? 'bg-rose-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {rec.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {rec.why}
                  </p>
                </div>

                <button
                  onClick={() => handle1ClickPack(rec)}
                  disabled={isAlreadyInBag}
                  className={`h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                    isAlreadyInBag
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-default'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs active:scale-95'
                  }`}
                  title={isAlreadyInBag ? 'Already in your baggage checklist' : 'Add this item to your active bag'}
                >
                  {isAlreadyInBag ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Packed</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )}
</div>
  );
};
