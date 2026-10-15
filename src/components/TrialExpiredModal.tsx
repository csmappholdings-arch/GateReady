import React from 'react';
import { createPortal } from 'react-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { 
  Lock, 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Luggage, 
  ArrowRight,
  Printer
} from 'lucide-react';

export const TrialExpiredModal: React.FC = () => {
  const { 
    isTrialExpired, 
    hasDismissedTrialExpiredNotice, 
    dismissTrialExpiredNotice, 
    openPaywall,
    tier 
  } = useSubscription();

  if (!isTrialExpired || hasDismissedTrialExpiredNotice || tier !== 'FREE') {
    return null;
  }

  const handleSelectTier = (chosenTier: 'SILVER' | 'GOLD') => {
    dismissTrialExpiredNotice();
    openPaywall(chosenTier === 'SILVER' 
      ? 'Unlock unlimited bags and printable packing manifests with Silver ($1.99/mo).' 
      : 'Unlock multi-traveler sync, unlimited trips, and cloud backup with Gold ($3.99/mo).'
    );
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 min-h-screen cursor-pointer"
      onClick={dismissTrialExpiredNotice}
    >
      <div 
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden flex flex-col relative z-[100000] cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 text-center relative">
          <button
            type="button"
            onClick={dismissTrialExpiredNotice}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-lg mb-2.5">
            <Crown className="w-6 h-6 fill-amber-300" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/40 text-purple-200 px-3 py-0.5 rounded-full inline-block mb-1">
            7-Day Platinum Trial Concluded
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Your Packed Items Are 100% Safe
          </h3>
          <p className="text-xs text-purple-200/90 mt-1 max-w-sm mx-auto leading-relaxed">
            Your 7-day Platinum trial has ended. You have been seamlessly transitioned to the <strong>Free Starter Plan</strong>.
          </p>
        </div>

        {/* Feature Lock Summary */}
        <div className="p-6 space-y-4 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            What changed on the Free Plan:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Multi-Traveler Packing</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Gold / Platinum</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Free plan is set to 1 traveler. Family & group assignment unlocked on Gold.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Unlimited Luggage & Trips</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Silver / Gold</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Free plan includes up to 2 bags and 1 active trip. Unlimited bags unlocked on Silver.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Unwatermarked PDF & QR Tags</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Silver ($1.99/mo)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Printable manifests & luggage tags show a preview watermark on Free.
                </p>
              </div>
            </div>
          </div>

          {/* One-Tap Upgrade Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => handleSelectTier('GOLD')}
              className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/40"
            >
              <Crown className="w-4 h-4 fill-white" />
              <span>Unlock Gold — $3.99/mo (Most Popular)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleSelectTier('SILVER')}
              className="w-full h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Unlock Silver — $1.99/mo (Solo Traveler)</span>
            </button>

            <button
              type="button"
              onClick={dismissTrialExpiredNotice}
              className="w-full h-9 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              Continue on Free Starter Plan
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
