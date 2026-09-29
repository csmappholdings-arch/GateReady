import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AIRLINES_DATABASE, Airline } from '../data/airlinesData';
import { Plane, Search, X, Check } from 'lucide-react';

interface AirlineSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const AirlineSearchInput: React.FC<AirlineSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search airline (e.g. Porter, Delta, Air Canada)',
  className = '',
  autoFocus = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter airlines as user types
  const filteredAirlines = useMemo(() => {
    const q = (value || '').trim().toLowerCase();
    if (!q) {
      // Popular defaults when search is empty
      return AIRLINES_DATABASE.slice(0, 10);
    }

    return AIRLINES_DATABASE.filter((a) => {
      const nameMatch = a.name.toLowerCase().includes(q);
      const codeMatch = a.code.toLowerCase() === q || a.code.toLowerCase().startsWith(q);
      const countryMatch = a.country.toLowerCase().includes(q);
      return nameMatch || codeMatch || countryMatch;
    }).slice(0, 15);
  }, [value]);

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
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredAirlines.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredAirlines.length) % Math.max(1, filteredAirlines.length));
    } else if (e.key === 'Enter') {
      if (filteredAirlines.length > 0 && selectedIndex >= 0 && selectedIndex < filteredAirlines.length) {
        e.preventDefault();
        selectAirline(filteredAirlines[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectAirline = (airline: Airline) => {
    onChange(airline.name);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-purple-600 dark:text-purple-400">
          <Plane className="w-4 h-4" />
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
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-xs"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Clear airline search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-xl overflow-hidden py-1 animate-in fade-in duration-100">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950/60 border-b border-purple-100 dark:border-purple-900/40 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Select Airline ({filteredAirlines.length} matches)</span>
            <span className="text-purple-600 dark:text-purple-400">IATA Auto-fill</span>
          </div>

          {filteredAirlines.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching airlines found. You can keep typing "{value}" as a custom carrier.
            </div>
          ) : (
            filteredAirlines.map((airline, idx) => {
              const isSelected = idx === selectedIndex;
              const isCurrent = value.toLowerCase() === airline.name.toLowerCase();

              return (
                <button
                  key={`${airline.code}-${airline.name}`}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => selectAirline(airline)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-950 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base select-none shrink-0" role="img" aria-label="flag">
                      {airline.flag}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>{airline.name}</span>
                        {airline.isRegional && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold">
                            Regional
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {airline.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-purple-100 dark:bg-purple-900/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                      {airline.code}
                    </span>
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
