import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X, Sparkles, CheckCircle2, Cloud, Smartphone } from 'lucide-react';
import { Trip } from '../types/travel';

interface SaveGateModalProps {
  isOpen: boolean;
  trip?: Trip | null;
  onSave: () => void;
  onDismiss: () => void;
}

export const SaveGateModal: React.FC<SaveGateModalProps> = ({
  isOpen,
  trip,
  onSave,
  onDismiss
}) => {
  // Close modal on Escape key press (treated as Maybe Later)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const totalBags = trip?.bags.length || 0;
  const packedItems = trip?.bags.reduce(
    (acc, b) => acc + b.items.filter((i) => i.isPacked).length,
    0
  ) || 0;
  const totalItems = trip?.bags.reduce((acc, b) => acc + b.items.length, 0) || 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[99998] overflow-y-auto p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center min-h-screen cursor-pointer"
      style={{ margin: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onDismiss();
        }
      }}
    >
      <div
        className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-800 shadow-2xl overflow-hidden flex flex-col relative z-[99999] cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Protection Shield */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 text-white relative text-center">
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Maybe Later"
            title="Maybe later (Esc)"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-md mb-3">
            <ShieldCheck className="w-6 h-6 text-purple-200" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-purple-100 px-3 py-0.5 rounded-full inline-block mb-1">
            Free Permanent Backup
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Don't lose this packing list
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Trip Summary Card */}
          {trip && (
            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block truncate">
                  Active Travel List
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  {trip.name || 'My Upcoming Trip'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {totalBags} {totalBags === 1 ? 'bag' : 'bags'} · {packedItems} of {totalItems} items packed
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Benefit-led body text */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Right now your list lives in this browser only — clear your data or switch phones and it's gone. Create a free account and it's yours forever, on every device.
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Sync across all phones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Auto-saved to cloud</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={onSave}
              className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 active:scale-98 transition-all cursor-pointer"
            >
              <span>Create free account</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            <button
              type="button"
              onClick={onDismiss}
              className="w-full h-9 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
