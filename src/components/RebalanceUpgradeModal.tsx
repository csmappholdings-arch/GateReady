import React from 'react';
import { createPortal } from 'react-dom';
import { Scale, X, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface RebalanceUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeePlans: () => void;
}

export const RebalanceUpgradeModal: React.FC<RebalanceUpgradeModalProps> = ({
  isOpen,
  onClose,
  onSeePlans
}) => {
  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rebalance-upgrade-title"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-2xl p-6 sm:p-7 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <Scale className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Plan Feature · Rebalance Bags
              </span>
              <h3 id="rebalance-upgrade-title" className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Feature Upgrade Required
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Overview */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 mb-4">
          <p className="text-xs sm:text-sm font-semibold text-purple-950 dark:text-purple-200 leading-relaxed">
            Rebalance Bags calculates optimal item shifts across your luggage to bring heavy bags under airline limits and avoid overweight baggage fees.
          </p>
        </div>

        {/* Details & Rules */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5 mb-6 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Available on Silver ($1.99/mo or $19.99/yr), Gold, and Platinum plans</span>
          </div>
          <ul className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-5">
            <li>Never moves items silently: you review every proposed move with before &amp; after weights.</li>
            <li>Protects essential items: documents, medication, valuables, and electronics are never suggested into checked bags.</li>
            <li>Instant undo for any move or batch of moves.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Continue manually
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSeePlans();
            }}
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>See plans</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
