import React, { useState, useMemo, useEffect } from 'react';
import { Trip } from '../types/travel';
import { 
  getEntryRequirements, 
  PassportNationality, 
  ResolvedEntryRequirement 
} from '../data/entryRequirementsData';
import { 
  ShieldCheck, 
  Globe2, 
  ExternalLink, 
  Info, 
  FileCheck, 
  Calendar, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface EntryRequirementsCardProps {
  trip: Trip;
  onOpenEditDestination?: () => void;
  className?: string;
}

export const EntryRequirementsCard: React.FC<EntryRequirementsCardProps> = ({
  trip,
  onOpenEditDestination,
  className = ''
}) => {
  // Canadian-first default per brand guidelines, persisted in localStorage across edits & re-renders
  const [nationality, setNationalityState] = useState<PassportNationality>(() => {
    try {
      const saved = localStorage.getItem('gateready_selected_passport_nationality');
      if (saved === 'US' || saved === 'CA') return saved;
    } catch {}
    return 'CA';
  });

  const setNationality = (newNat: PassportNationality) => {
    setNationalityState(newNat);
    try {
      localStorage.setItem('gateready_selected_passport_nationality', newNat);
      window.dispatchEvent(new CustomEvent('gateready_passport_changed', { detail: newNat }));
    } catch {}
  };

  useEffect(() => {
    const handlePassportSync = (e: Event) => {
      const ce = e as CustomEvent<PassportNationality>;
      if (ce.detail && (ce.detail === 'CA' || ce.detail === 'US')) {
        setNationalityState(ce.detail);
      } else {
        try {
          const saved = localStorage.getItem('gateready_selected_passport_nationality');
          if (saved === 'US' || saved === 'CA') {
            setNationalityState(saved as PassportNationality);
          }
        } catch {}
      }
    };

    window.addEventListener('gateready_passport_changed', handlePassportSync);
    window.addEventListener('storage', handlePassportSync);
    return () => {
      window.removeEventListener('gateready_passport_changed', handlePassportSync);
      window.removeEventListener('storage', handlePassportSync);
    };
  }, []);

  const destinationCity = trip.destinationCity?.trim() || '';
  const destinationCountry = trip.destinationCountry?.trim() || '';
  const destinationText = destinationCountry || destinationCity;
  const hasDestination = Boolean(destinationText && destinationText.length > 1);

  // Resolve entry requirement data from static database
  const entryData: ResolvedEntryRequirement = useMemo(() => {
    return getEntryRequirements(destinationText, nationality);
  }, [destinationText, nationality]);

  // Guaranteed matching official source label and URL for the selected passport
  const officialSourceLabel = nationality === 'CA' ? 'travel.gc.ca Advisory' : 'travel.state.gov Advisory';
  const officialSourceUrl = useMemo(() => {
    if (nationality === 'CA') {
      if (entryData.officialSourceUrl && entryData.officialSourceUrl.includes('travel.gc.ca')) {
        return entryData.officialSourceUrl;
      }
      return `https://travel.gc.ca/destinations/${encodeURIComponent(destinationText.toLowerCase().trim().replace(/\s+/g, '-'))}`;
    } else {
      if (entryData.officialSourceUrl && entryData.officialSourceUrl.includes('travel.state.gov')) {
        return entryData.officialSourceUrl;
      }
      return 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages.html';
    }
  }, [nationality, entryData.officialSourceUrl, destinationText]);

  // If no destination is set yet
  if (!hasDestination) {
    return (
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950/60 p-4 sm:p-5 shadow-xs transition-all ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                Entry Requirements
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Set a destination to see passport validity & visa rules
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Verified travel advisories for Canadian and US passport holders, including 6-month passport validity checks and eTA/visa regulations.
              </p>
            </div>
          </div>

          {onOpenEditDestination && (
            <button
              type="button"
              onClick={onOpenEditDestination}
              className="h-8.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <span>Add Destination</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Get status color styling for the visa badge
  const getVisaBadgeStyle = () => {
    switch (entryData.visaStatusType) {
      case 'VISA_FREE':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'ETA_ESTA_REQUIRED':
        return 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'VISA_ON_ARRIVAL':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'VISA_ADVANCE_REQUIRED':
        return 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-sm overflow-hidden transition-all ${className}`}>
      {/* Header with Title and Nationality Switcher */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900 border-b border-purple-100 dark:border-purple-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  Entry Requirements
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Entry data last verified {entryData.lastVerified}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {`Traveling to ${entryData.matchedDestinationName}`}
              </h3>
            </div>
          </div>

          {/* Nationality Selector: Canada / United States (Default Canada) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">
              Passport:
            </span>
            <button
              type="button"
              onClick={() => setNationality('CA')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                nationality === 'CA'
                  ? 'bg-purple-600 text-white font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇨🇦 Canada</span>
            </button>
            <button
              type="button"
              onClick={() => setNationality('US')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                nationality === 'US'
                  ? 'bg-purple-600 text-white font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇺🇸 United States</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clean Mobile-Friendly Rows: PASSPORT / VISA / MAX STAY / SOURCE */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {/* Row 1: PASSPORT VALIDITY */}
        <div className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-2.5 sm:w-1/3">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
              Passport Validity
            </span>
          </div>
          <div className="sm:w-2/3 sm:text-right">
            <span className="font-bold text-slate-900 dark:text-white">
              {entryData.passportValidityRule}
            </span>
          </div>
        </div>

        {/* Row 2: VISA STATUS */}
        <div className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-2.5 sm:w-1/3">
            <FileCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
              Visa Requirement
            </span>
          </div>
          <div className="sm:w-2/3 sm:text-right">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${getVisaBadgeStyle()}`}>
              {entryData.visaBadgeText}
            </span>
          </div>
        </div>

        {/* Row 3: MAX STAY */}
        <div className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-2.5 sm:w-1/3">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
              Maximum Stay
            </span>
          </div>
          <div className="sm:w-2/3 sm:text-right">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {entryData.maxStay}
            </span>
          </div>
        </div>

        {/* Row 4: OFFICIAL SOURCE LINK */}
        <div className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
          <div className="flex items-center gap-2.5 sm:w-1/3">
            <Globe2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
              Official Source
            </span>
          </div>
          <div className="sm:w-2/3 sm:text-right">
            <a
              href={officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold hover:underline"
            >
              <span>{officialSourceLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Advisory Notes if present */}
      {entryData.notes && (
        <div className="p-3.5 sm:px-5 bg-purple-50/50 dark:bg-purple-950/20 border-t border-purple-100 dark:border-purple-900/40 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong className="text-purple-900 dark:text-purple-200">Traveler Notice: </strong>
          {entryData.notes}
        </div>
      )}

      {/* Mandatory Global Disclaimer (Always Visible) */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="leading-snug">
          {entryData.disclaimer}
        </span>
      </div>
    </div>
  );
};
