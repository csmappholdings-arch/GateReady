import React, { useState, useRef, useEffect } from 'react';
import { Plane, MapPin, Search, Check, Globe } from 'lucide-react';
import { AirportCity, searchAirportsAndCities, findAirportByCode } from '../data/airportsData';

interface AirportCitySearchInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  countryValue?: string;
  onChange: (city: string, country?: string, airport?: AirportCity) => void;
  required?: boolean;
  autoFocus?: boolean;
  iconType?: 'origin' | 'destination';
  className?: string;
  inputClassName?: string;
  hideLabel?: boolean;
}

export const AirportCitySearchInput: React.FC<AirportCitySearchInputProps> = ({
  id,
  label,
  placeholder = 'Search by city, country or code (e.g. JFK, Tokyo, Paris)...',
  value,
  countryValue,
  onChange,
  required = false,
  autoFocus = false,
  iconType = 'destination',
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

  // Compute live search suggestions
  const suggestions = React.useMemo(() => {
    if (!isOpen) return [];
    if (query.trim().length === 0) {
      // Default top suggestions when focused
      return searchAirportsAndCities('', 7);
    }
    return searchAirportsAndCities(query, 8);
  }, [query, isOpen]);

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

    // If user types exactly a 3-letter uppercase airport code, auto-detect country
    const directCode = newVal.trim().toUpperCase();
    if (directCode.length === 3) {
      const matched = findAirportByCode(directCode);
      if (matched) {
        onChange(`${matched.city} (${matched.code})`, matched.country, matched);
        return;
      }
    }

    onChange(newVal, countryValue);
  };

  const handleSelect = (airport: AirportCity) => {
    const formattedCity = `${airport.city} (${airport.code})`;
    setQuery(formattedCity);
    setIsOpen(false);
    onChange(formattedCity, airport.country, airport);
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
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Determine detected country flag or badge
  const detectedCountry = countryValue || (() => {
    const match = query.match(/\(([A-Z]{3})\)/);
    if (match) {
      const found = findAirportByCode(match[1]);
      return found?.country;
    }
    return undefined;
  })();

  const detectedAirport = (() => {
    const match = query.match(/\(([A-Z]{3})\)/);
    if (match) {
      return findAirportByCode(match[1]);
    }
    return undefined;
  })();

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {!hideLabel && (
        <div className="flex items-center justify-between mb-1">
          <label 
            htmlFor={id}
            className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
          >
            {iconType === 'origin' ? (
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{label}</span>
            {required && <span className="text-purple-600">*</span>}
          </label>

          {detectedCountry && (
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>{detectedAirport?.flag || '🌐'}</span>
              <span>{detectedCountry}</span>
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
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
              <span>Matching Cities, Countries & Airport Codes</span>
            </span>
            <span className="text-slate-400 font-normal">Use arrows or click</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/60">
            {suggestions.map((item, idx) => {
              const isSelected = selectedIndex === idx || 
                query.toLowerCase().includes(item.code.toLowerCase()) || 
                query.toLowerCase().includes(item.city.toLowerCase());

              return (
                <button
                  key={`${item.code}-${item.city}`}
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
                    <span className="w-10 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 font-black text-xs flex items-center justify-center shrink-0 border border-purple-200/80 dark:border-purple-900">
                      {item.code}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-700 dark:group-hover:text-purple-300">
                        {item.city}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {item.airportName}
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
