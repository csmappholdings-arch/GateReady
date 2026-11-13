import React from 'react';
import { createPortal } from 'react-dom';
import { Scale, X, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import {
  TRIAL_CTA_LABEL,
  TRIAL_SECONDARY_CTA_LABEL,
  TRIAL_TERMS_EXACT,
  FEE_MATH_STATEMENT,
  FEE_MATH_YEARLY_FRAME
} from '../data/planEntitlements';

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

  const handleStartTrial = () => {
    onClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('gateready:open-account-sync', {
          detail: { mode: 'signup', origin: 'save_gate' }
        })
      );
    }
  };

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
                Unlock Rebalance Bags Free for 7 Days
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
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 mb-3.5">
          <p className="text-xs sm:text-sm font-semibold text-purple-950 dark:text-purple-200 leading-relaxed">
            Rebalance Bags calculates optimal item shifts across your luggage to bring heavy bags under airline limits and avoid overweight baggage fees.
          </p>
        </div>

        {/* Fee Math Box */}
        <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/70 mb-3.5 space-y-1">
          <p className="text-xs font-black text-emerald-950 dark:text-emerald-200 leading-snug">
            {FEE_MATH_STATEMENT}
          </p>
          <p className="text-[11px] text-emerald-900/90 dark:text-emerald-300/90 leading-relaxed">
            {FEE_MATH_YEARLY_FRAME}
          </p>
        </div>

        {/* Trial Promise + Rules */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5 mb-5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2 text-purple-900 dark:text-purple-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{TRIAL_TERMS_EXACT}</span>
          </div>
          <ul className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-5">
            <li>Never moves items silently: you review every proposed move with before &amp; after weights.</li>
            <li>Protects essential items: documents, medication, valuables, and electronics are never suggested into checked bags.</li>
            <li>Instant undo for any move or batch of moves.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleStartTrial}
              className="flex-1 h-11 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{TRIAL_CTA_LABEL}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSeePlans();
              }}
              className="h-11 px-5 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
            >
              {TRIAL_SECONDARY_CTA_LABEL}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Continue manually
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
