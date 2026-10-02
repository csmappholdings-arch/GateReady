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
  ChevronUp
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
  const [destinationInput, setDestinationInput] = useState(trip.destinationCity || trip.name || 'London, UK');
  const [addedItemNames, setAddedItemNames] = useState<Set<string>>(new Set());

  // Determine active city
  const city = trip.destinationCity || 'London, UK';

  // Realistic seasonal weather simulation based on city heuristics
  const getSimulatedForecast = (cityName: string): WeatherForecastDay[] => {
    const lower = cityName.toLowerCase();
    const today = new Date();
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];

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
    } else if (lower.includes('miami') || lower.includes('cancun') || lower.includes('orlando') || lower.includes('hawaii') || lower.includes('bali')) {
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

    // Default versatile destination forecast
    return [
      { dayName: 'Today', date: 'Day 1', condition: 'SUNNY', tempHighF: 71, tempLowF: 56, rainChance: 20, uvIndex: 6, summary: 'Mild & pleasant traveling weather' },
      { dayName: 'Tomorrow', date: 'Day 2', condition: 'CLOUDY', tempHighF: 68, tempLowF: 54, rainChance: 40, uvIndex: 4, summary: 'Overcast with brief afternoon breeze' },
      { dayName: 'Day 3', date: 'Day 3', condition: 'RAIN', tempHighF: 64, tempLowF: 52, rainChance: 65, uvIndex: 3, summary: 'Passing showers; umbrella advised' },
      { dayName: 'Day 4', date: 'Day 4', condition: 'SUNNY', tempHighF: 73, tempLowF: 57, rainChance: 15, uvIndex: 7, summary: 'Sunny & warm walking conditions' },
      { dayName: 'Day 5', date: 'Day 5', condition: 'SUNNY', tempHighF: 74, tempLowF: 58, rainChance: 10, uvIndex: 7, summary: 'Clear skies through the evening' }
    ];
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

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationInput.trim()) {
      updateTripDetails(trip.id, { destinationCity: destinationInput.trim() });
      setIsEditingDestination(false);
    }
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
              <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded-full">
                5-Day Intel
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

      {/* 5-Day Weather Forecast Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-4">
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
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {day.dayName}
                  </span>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
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
