import React from 'react';
import { createPortal } from 'react-dom';
import { BagType, BagMaterial, getUserPresetWeightLbs } from '../types/travel';
import { Zap, Luggage, X, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface FreeLimitCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    carrier: string;
    seatClass: string;
    checkedCount: number;
    carryOnCount: number;
  } | null;
  onContinueFree: (
    allowedBags: Array<{
      type: BagType;
      label: string;
      assignedTo?: string;
      material?: BagMaterial;
      emptyBagWeightLbs?: number;
    }>,
    leftOutNote: string
  ) => void;
  onSeePlans: () => void;
}

export const FreeLimitCheckerModal: React.FC<FreeLimitCheckerModalProps> = ({
  isOpen,
  onClose,
  config,
  onContinueFree,
  onSeePlans
}) => {
  if (!isOpen || !config) return null;
  if (typeof document === 'undefined') return null;

  const totalRequested = config.checkedCount + config.carryOnCount;

  // Compute what gets included and what gets left out
  const allowedBags: Array<{
    type: BagType;
    label: string;
    assignedTo?: string;
    material?: BagMaterial;
    emptyBagWeightLbs?: number;
  }> = [];

  const excludedBags: string[] = [];

  // When trimmed to the Free allowance with checked bags, Free allowance is exactly 1 checked + 1 carry-on (2 bags total)
  if (config.checkedCount >= 1) {
    allowedBags.push({
      type: 'CHECKED',
      label: 'Checked Bag 1',
      material: 'HARD_SHELL',
      emptyBagWeightLbs: getUserPresetWeightLbs('CHECKED', 'HARD_SHELL')
    });
    allowedBags.push({
      type: 'CARRY_ON',
      label: 'Carry-On Roller',
      material: 'HARD_SHELL',
      emptyBagWeightLbs: getUserPresetWeightLbs('CARRY_ON', 'HARD_SHELL')
    });
  } else {
    // 0 checked bags: up to 2 carry-on / personal
    if (config.carryOnCount >= 1) {
      allowedBags.push({
        type: 'CARRY_ON',
        label: 'Carry-On Roller',
        material: 'HARD_SHELL',
        emptyBagWeightLbs: getUserPresetWeightLbs('CARRY_ON', 'HARD_SHELL')
      });
    }
    if (config.carryOnCount >= 2) {
      allowedBags.push({
        type: 'CARRY_ON',
        label: 'Carry-On #2',
        material: 'HARD_SHELL',
        emptyBagWeightLbs: getUserPresetWeightLbs('CARRY_ON', 'HARD_SHELL')
      });
    } else {
      allowedBags.push({
        type: 'PERSONAL',
        label: 'Personal Backpack',
        material: 'FABRIC',
        emptyBagWeightLbs: getUserPresetWeightLbs('PERSONAL', 'FABRIC')
      });
    }
  }

  // Any extra checked bags beyond 1 are excluded
  for (let i = 2; i <= config.checkedCount; i++) {
    excludedBags.push(`Checked Bag ${i}`);
  }
  for (let i = 2; i <= config.carryOnCount; i++) {
    if (config.checkedCount >= 1 || i > 2) {
      excludedBags.push(`Carry-On ${i}`);
    }
  }

  const excludedText = excludedBags.length > 0
    ? excludedBags.join(' and ')
    : 'extra bags';

  const leftOutNote = `${excludedText} was left out to stay within Free plan limits (1 checked bag max, 2 bags total: 1 checked + 1 carry-on).`;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-purple-200 dark:border-purple-800/80 animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Zap Badge & Close Button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <Zap className="w-6 h-6 fill-purple-600 dark:fill-purple-300 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Plan Limit Enforcement
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
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

        {/* Stated Limit Copy */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 mb-4">
          <p className="text-xs sm:text-sm font-semibold text-purple-950 dark:text-purple-200 leading-relaxed">
            Free Plan allows only 1 Checked Bag per trip (up to 2 bags total). Upgrade to Silver, Gold, or Platinum to pack unlimited bags.
          </p>
        </div>

        {/* Clear Explanation of What Will and Won't Be Included */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2 mb-6 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Configured: {totalRequested} bags ({config.checkedCount} checked, {config.carryOnCount} carry-on) on {config.carrier}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-300/90">
            If you continue with the <strong>Free Plan</strong>, <strong className="text-rose-600 dark:text-rose-400">{excludedText}</strong> will not be included.
          </p>
          <div className="pt-1.5 border-t border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between text-[11px] font-bold">
            <span className="text-emerald-700 dark:text-emerald-300">
              ✓ Free Trip Includes: {allowedBags.map((b) => b.label).join(' + ')} (2 bags total)
            </span>
          </div>
        </div>

        {/* Two Clear Options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => onContinueFree(allowedBags, leftOutNote)}
            className="h-11 px-5 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Continue with 2 bags free
          </button>

          <button
            type="button"
            onClick={onSeePlans}
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
