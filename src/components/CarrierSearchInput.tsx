import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AIRLINES_DATABASE, Airline, TRAIN_OPERATORS, CRUISE_LINES, BUS_OPERATORS, CAR_VEHICLES } from '../data/airlinesData';
import { Plane, Train, Ship, Bus, Car, Search, X, Check } from 'lucide-react';
import { TravelType } from '../types/travel';

export interface CarrierItem {
  name: string;
  code?: string;
  country?: string;
  flag?: string;
  isRegional?: boolean;
}

interface CarrierSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  travelType?: TravelType;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const CarrierSearchInput: React.FC<CarrierSearchInputProps> = ({
  value,
  onChange,
  travelType = 'PLANE',
  placeholder,
  className = '',
  autoFocus = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic icon
  const getIcon = () => {
    switch (travelType) {
      case 'TRAIN':
        return <Train className="w-4 h-4" />;
      case 'CRUISE':
        return <Ship className="w-4 h-4" />;
      case 'BUS':
        return <Bus className="w-4 h-4" />;
      case 'CAR':
        return <Car className="w-4 h-4" />;
      default:
        return <Plane className="w-4 h-4" />;
    }
  };

  // Dynamic default placeholder
  const dynamicPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    switch (travelType) {
      case 'TRAIN':
        return 'Search train operator (e.g. Amtrak, VIA Rail, Eurostar, Brightline)...';
      case 'CRUISE':
        return 'Search cruise line (e.g. Royal Caribbean, Carnival, Disney, NCL)...';
      case 'BUS':
        return 'Search bus company (e.g. Greyhound, FlixBus, Megabus, GO Bus)...';
      case 'CAR':
        return 'Search or enter vehicle (e.g. Toyota RAV4, Rental SUV, Sedan)...';
      default:
        return 'Search airline (e.g. Porter, Delta, Air Canada, WestJet)...';
    }
  }, [placeholder, travelType]);

  // List of suggestions filtered as user types
  const suggestions: CarrierItem[] = useMemo(() => {
    const q = (value || '').trim().toLowerCase();

    if (travelType === 'PLANE') {
      if (!q) {
        return AIRLINES_DATABASE.slice(0, 10).map((a) => ({
          name: a.name,
          code: a.code,
          country: a.country,
          flag: a.flag,
          isRegional: a.isRegional
        }));
      }
      return AIRLINES_DATABASE.filter((a) => {
        const nameMatch = a.name.toLowerCase().includes(q);
        const codeMatch = a.code.toLowerCase() === q || a.code.toLowerCase().startsWith(q);
        const countryMatch = a.country.toLowerCase().includes(q);
        return nameMatch || codeMatch || countryMatch;
      })
        .slice(0, 15)
        .map((a) => ({
          name: a.name,
          code: a.code,
          country: a.country,
          flag: a.flag,
          isRegional: a.isRegional
        }));
    }

    let sourceList: string[] = [];
    if (travelType === 'TRAIN') sourceList = TRAIN_OPERATORS;
    else if (travelType === 'CRUISE') sourceList = CRUISE_LINES;
    else if (travelType === 'BUS') sourceList = BUS_OPERATORS;
    else sourceList = CAR_VEHICLES;

    if (!q) return sourceList.slice(0, 10).map((name) => ({ name }));
    return sourceList
      .filter((item) => item.toLowerCase().includes(q))
      .slice(0, 15)
      .map((name) => ({ name }));
  }, [value, travelType]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, suggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % Math.max(1, suggestions.length));
    } else if (e.key === 'Enter') {
      if (suggestions.length > 0 && selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        selectItem(suggestions[selectedIndex].name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectItem = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  const dropdownHeaderLabel = useMemo(() => {
    switch (travelType) {
      case 'TRAIN': return 'Train & Rail Operators';
      case 'CRUISE': return 'Cruise Lines & Ferries';
      case 'BUS': return 'Coach & Bus Lines';
      case 'CAR': return 'Vehicle & Rental Suggestions';
      default: return 'Airlines & Carriers (Auto-complete)';
    }
  }, [travelType]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-purple-600 dark:text-purple-400">
          {getIcon()}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={dynamicPlaceholder}
          autoFocus={autoFocus}
          className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-purple-200/80 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-xs"
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Clear carrier search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-xl overflow-hidden py-1 animate-in fade-in duration-100">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/60 border-b border-purple-100 dark:border-purple-900/40 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>{dropdownHeaderLabel}</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">{suggestions.length} choices</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching suggestions found. You can keep typing "{value}" as a custom name.
            </div>
          ) : (
            suggestions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isCurrent = value.toLowerCase() === item.name.toLowerCase();

              return (
                <button
                  key={`${item.name}-${idx}`}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectItem(item.name);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-950 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.flag ? (
                      <span className="text-base select-none shrink-0" role="img" aria-label="flag">
                        {item.flag}
                      </span>
                    ) : (
                      <div className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                        {getIcon()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.isRegional && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold">
                            Regional
                          </span>
                        )}
                      </p>
                      {item.country && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {item.country}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.code && (
                      <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-purple-100 dark:bg-purple-900/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                        {item.code}
                      </span>
                    )}
                    {isCurrent && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
