import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { airlineLimits } from '../data/allowances';
import { 
  X, 
  Plane, 
  Search, 
  Filter, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Luggage,
  Scale
} from 'lucide-react';

interface AirlineGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAirline?: (airlineName: string) => void;
}

export const AirlineGuidesModal: React.FC<AirlineGuidesModalProps> = ({
  isOpen,
  onClose,
  onSelectAirline
}) => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'USA' | 'Canada' | 'Europe' | 'Asia'>('ALL');

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const filteredAirlines = airlineLimits.filter((airline) => {
    const matchesSearch = 
      airline.company.toLowerCase().includes(search.toLowerCase()) ||
      airline.carryOnLimit.toLowerCase().includes(search.toLowerCase()) ||
      airline.personalLimit.toLowerCase().includes(search.toLowerCase()) ||
      (airline.notes && airline.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesRegion = regionFilter === 'ALL' || airline.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-4xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden flex flex-col max-h-[92vh] relative z-[100000] cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-300/40 text-purple-200 flex items-center justify-center shadow-md">
              <Plane className="w-4 h-4 text-purple-200" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/40 text-purple-200 px-2.5 py-0.5 rounded-full">
              2026 Baggage Intelligence
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            42+ Verified Airline Baggage Allowance Guides
          </h3>
          <p className="text-xs text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
            Exact sizer bin measurements, personal item dimensions, and checked weight limits across North American, European, and Asian carriers.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-purple-100 dark:border-purple-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Air Canada, Delta, United..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'USA', 'Canada', 'Europe', 'Asia'] as const).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  regionFilter === region
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {region === 'ALL' ? 'All Airlines (42)' : region}
              </button>
            ))}
          </div>
        </div>

        {/* Airline Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredAirlines.map((airline) => (
              <div 
                key={airline.company}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-purple-600" />
                      <span>{airline.company}</span>
                    </h4>
                    {airline.region && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {airline.region}
                      </span>
                    )}
                  </div>

                  {airline.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {airline.notes}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-750">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Carry-On Bin Limit:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {airline.carryOnLimit}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-755">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Personal Item:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {airline.personalLimit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-2 px-1">
                    <span>Carry-on weight: <strong>{airline.carryOnWeightLimit}</strong></span>
                    <span>Checked bag: <strong>{airline.checkedWeightLimit}</strong></span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 flex items-center justify-end">
                  {onSelectAirline && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAirline(airline.company);
                        onClose();
                      }}
                      className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Pack for this Airline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAirlines.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Plane className="w-8 h-8 mx-auto opacity-50" />
              <p className="font-bold">No airlines found matching &ldquo;{search}&rdquo;</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setRegionFilter('ALL');
                }}
                className="text-purple-600 font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Updated for 2026 sizer regulations · GateReady.ca</span>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
