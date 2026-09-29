import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Plane, Train, Ship, Bus, MapPin, Search, Check, Globe } from 'lucide-react';
import { AirportCity, searchAirportsAndCities, findAirportByCode } from '../data/airportsData';
import { TransitHub, searchTransitHubs } from '../data/transitStationsData';
import { TravelType } from '../types/travel';

export interface LocationSearchResult {
  title: string;
  subtitle: string;
  country: string;
  flag: string;
  code?: string;
  formattedValue: string;
}

interface UniversalLocationSearchInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  countryValue?: string;
  onChange: (value: string, country?: string) => void;
  required?: boolean;
  autoFocus?: boolean;
  iconType?: 'origin' | 'destination';
  travelType?: TravelType;
  className?: string;
  inputClassName?: string;
  hideLabel?: boolean;
}

export const UniversalLocationSearchInput: React.FC<UniversalLocationSearchInputProps> = ({
  id,
  label,
  placeholder,
  value,
  countryValue,
  onChange,
  required = false,
  autoFocus = false,
  iconType = 'destination',
  travelType = 'PLANE',
  className = '',
  inputClassName = '',
  hideLabel = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query if value prop changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Compute live search suggestions based on travelType
  const suggestions: LocationSearchResult[] = useMemo(() => {
    if (!isOpen) return [];

    if (travelType === 'PLANE') {
      const results = query.trim().length === 0 
        ? searchAirportsAndCities('', 7)
        : searchAirportsAndCities(query, 8);

      return results.map((a) => ({
        title: a.city,
        subtitle: a.airportName,
        country: a.country,
        flag: a.flag,
        code: a.code,
        formattedValue: `${a.city} (${a.code})`
      }));
    }

    if (travelType === 'TRAIN') {
      const results = searchTransitHubs('TRAIN', query, 8);
      return results.map((t) => ({
        title: t.name,
        subtitle: `${t.city}, ${t.region ? t.region + ', ' : ''}${t.country}`,
        country: t.country,
        flag: t.flag,
        code: t.code,
        formattedValue: `${t.name} (${t.city})`
      }));
    }

    if (travelType === 'CRUISE') {
      const results = searchTransitHubs('PORT', query, 8);
      return results.map((p) => ({
        title: p.name,
        subtitle: `${p.city}, ${p.country}`,
        country: p.country,
        flag: p.flag,
        code: p.code,
        formattedValue: `${p.name} (${p.city})`
      }));
    }

    if (travelType === 'BUS') {
      const results = searchTransitHubs('BUS', query, 8);
      return results.map((b) => ({
        title: b.name,
        subtitle: `${b.city}, ${b.country}`,
        country: b.country,
        flag: b.flag,
        code: b.code,
        formattedValue: `${b.name} (${b.city})`
      }));
    }

    // CAR / ROAD TRIP: Search airports/cities database for major destinations & cities
    const results = query.trim().length === 0
      ? searchAirportsAndCities('', 7)
      : searchAirportsAndCities(query, 8);

    return results.map((a) => ({
      title: a.city,
      subtitle: `${a.city}, ${a.country}`,
      country: a.country,
      flag: a.flag,
      formattedValue: `${a.city}, ${a.country}`
    }));
  }, [query, isOpen, travelType]);

  // Dynamic placeholder based on travel mode
  const dynamicPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    switch (travelType) {
      case 'TRAIN':
        return iconType === 'origin'
          ? 'e.g. Union Station Toronto, Penn Station NYC, King\'s Cross'
          : 'e.g. Gare du Nord Paris, Montreal Central, Tokyo Station';
      case 'CRUISE':
        return iconType === 'origin'
          ? 'e.g. PortMiami, Port Everglades, Port of Barcelona'
          : 'e.g. Nassau, Cozumel, St. Maarten, Civitavecchia';
      case 'BUS':
        return iconType === 'origin'
          ? 'e.g. Port Authority NYC, Union Station Bus Toronto'
          : 'e.g. Victoria Coach London, South Station Boston';
      case 'CAR':
        return iconType === 'origin'
          ? 'e.g. Chicago, Toronto, Los Angeles'
          : 'e.g. Grand Canyon, Banff, Miami Beach';
      default:
        return iconType === 'origin'
          ? 'Type city, country or code (e.g. JFK, Toronto YTZ, London)...'
          : 'Type city, country or code (e.g. LHR, Tokyo, Paris)...';
    }
  }, [placeholder, travelType, iconType]);

  // Dynamic mode icon
  const getTravelModeIcon = () => {
    switch (travelType) {
      case 'TRAIN':
        return <Train className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'CRUISE':
        return <Ship className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />;
      case 'BUS':
        return <Bus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'CAR':
        return <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Plane className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    setIsOpen(true);
    setSelectedIndex(-1);

    // If user types exactly a 3-letter uppercase airport code while in PLANE mode
    if (travelType === 'PLANE') {
      const directCode = newVal.trim().toUpperCase();
      if (directCode.length === 3) {
        const matched = findAirportByCode(directCode);
        if (matched) {
          onChange(`${matched.city} (${matched.code})`, matched.country);
          return;
        }
      }
    }

    onChange(newVal, countryValue);
  };

  const handleSelect = (item: LocationSearchResult) => {
    setQuery(item.formattedValue);
    setIsOpen(false);
    onChange(item.formattedValue, item.country);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const dropdownHeaderLabel = useMemo(() => {
    switch (travelType) {
      case 'TRAIN': return 'Matching Train Stations & High-Speed Hubs';
      case 'CRUISE': return 'Matching Cruise Ports & Ocean Terminals';
      case 'BUS': return 'Matching Coach & Bus Terminals';
      case 'CAR': return 'Matching Cities & Travel Destinations';
      default: return 'Matching Airports, Regional Hubs & Cities';
    }
  }, [travelType]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {!hideLabel && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5"
        >
          {getTravelModeIcon()}
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={dynamicPlaceholder}
          required={required}
          autoFocus={autoFocus}
          className={`w-full h-10 pl-3.5 pr-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors ${inputClassName}`}
          autoComplete="off"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Floating Dropdown Suggestions Menu */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-100">
          <div className="px-3 py-1.5 bg-purple-50/80 dark:bg-purple-950/50 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-purple-600" />
              <span>{dropdownHeaderLabel}</span>
            </span>
            <span className="text-slate-400 font-normal">Use arrows or click</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/60">
            {suggestions.map((item, idx) => {
              const isSelected = selectedIndex === idx || 
                (item.code && query.toLowerCase().includes(item.code.toLowerCase())) || 
                query.toLowerCase().includes(item.title.toLowerCase());

              return (
                <button
                  key={`${item.code || ''}-${item.title}-${idx}`}
                  type="button"
                  onMouseDown={(e) => {
                    // Prevent input blur before click registers
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer group ${
                    selectedIndex === idx
                      ? 'bg-purple-100/70 dark:bg-purple-950/70'
                      : 'hover:bg-purple-50 dark:hover:bg-purple-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.code ? (
                      <span className="w-11 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 font-black text-xs flex items-center justify-center shrink-0 border border-purple-200/80 dark:border-purple-900">
                        {item.code}
                      </span>
                    ) : (
                      <div className="w-8 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                        {getTravelModeIcon()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-700 dark:group-hover:text-purple-300">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-right">
                    <span className="text-sm">{item.flag}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {item.country}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 ml-1 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
