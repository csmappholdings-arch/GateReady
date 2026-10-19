import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Gift, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Zap,
  Crown,
  Lock,
  UserCheck
} from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAccountSync?: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, onOpenAccountSync }) => {
  const { user } = useAuth();
  const { 
    referralCode, 
    referralsCount, 
    referralCreditsMonths, 
    isReferralPlatinumActive,
    referralTimeLeftText,
    claimReferralBonus, 
    openPaywall 
  } = useSubscription();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const referralUrl = `https://gateready.ca?ref=${encodeURIComponent(referralCode)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleSimulateReferral = () => {
    claimReferralBonus();
    setSimulatedSuccess(true);
    setTimeout(() => setSimulatedSuccess(false), 3000);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden flex flex-col relative z-[100000] cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-fuchsia-900 via-purple-900 to-indigo-950 text-white p-5 sm:p-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-fuchsia-400/20 border border-fuchsia-300/40 text-fuchsia-300 flex items-center justify-center shadow-lg mb-2.5">
            <Gift className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider bg-fuchsia-500/40 text-fuchsia-200 px-3 py-0.5 rounded-full inline-block mb-1">
            GateReady Referral Program
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Give 1 Month Platinum, Get 1 Month Platinum
          </h3>
          <p className="text-xs text-purple-200/90 mt-1 max-w-sm mx-auto leading-relaxed">
            Give a friend 1 free month of GateReady Platinum. When they create an account and sign in, you both get 1 month of Platinum automatically credited and tracked!
          </p>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {!user ? (
            /* Account Required State (Mandatory Account Creation) */
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-300 shadow-sm">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Mandatory: Create Account to Apply Free Month
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Referral bonuses are tied strictly to authenticated accounts. You must create an account and sign in so the 1 Free Month of Platinum ($9.99 value) can be applied and accurately tracked.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-left space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-200">
                    <strong className="text-slate-900 dark:text-white font-bold">Your friends get 1 month free</strong> of GateReady Platinum ($9.99 value) as soon as they create their account.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-200">
                    <strong className="text-slate-900 dark:text-white font-bold">You earn 1 month free</strong> of Platinum credited to your account for each friend who signs up.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-200">
                    <strong className="text-slate-900 dark:text-white font-bold">Accurate Live Countdown</strong>: Tracks the time remaining until free access runs out, ensuring exactly 1 month of Platinum is granted and then removed.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAccountSync) {
                      onOpenAccountSync();
                    }
                  }}
                  className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 active:scale-98 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Create Free Account / Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Signed In User: Full Persistent Referral Code and Stats Panel */
            <>
              {/* Active Referral Platinum Countdown Banner */}
              {isReferralPlatinumActive && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-950/80 via-purple-950/80 to-indigo-950/80 border border-fuchsia-400/40 text-white flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center shrink-0 border border-fuchsia-400/30">
                      <Crown className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-fuchsia-200 flex items-center gap-1.5">
                        <span>Active 1-Month Free Platinum</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      </p>
                      <p className="text-sm sm:text-base font-black font-mono text-amber-300 tracking-tight">
                        ⏳ {referralTimeLeftText}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-black bg-fuchsia-500/40 text-fuchsia-100 px-2.5 py-1 rounded-full border border-fuchsia-300/40 shrink-0">
                    Live Clock
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    Friends Referred
                  </span>
                  <span className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-0.5 block">
                    {referralsCount}
                  </span>
                  <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-medium">
                    Verified signups
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    Free Months Earned
                  </span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {referralCreditsMonths} mo
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">
                    Platinum credited
                  </span>
                </div>
              </div>

              {/* Referral Code & Link Box */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Your Exclusive Referral Code
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-black text-sm text-purple-700 dark:text-purple-300 flex items-center">
                      {referralCode || 'Generating...'}
                    </span>
                    <button
                      type="button"
                      disabled={!referralCode}
                      onClick={handleCopyCode}
                      className="h-9 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Direct Referral Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralUrl}
                      className="flex-1 h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 select-all truncate"
                    />
                    <button
                      type="button"
                      disabled={!referralCode}
                      onClick={handleCopyLink}
                      className="h-9 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="space-y-2 pt-1 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white">
                  How the automatic referral credit works:
                </p>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Send your link or packing list to friends traveling with you.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>Mandatory Account Creation:</strong> When they create a free account and sign in, their 1 Free Month of Platinum is immediately applied.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>You automatically receive 1 Month of Free Platinum per signup, tracked with an accurate live countdown until the month ends and is removed.</span>
                </div>
              </div>

              {/* Interactive Instant Test Simulator */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Test Referral Tracking (Live Simulator)</span>
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Simulate a friend using your code and subscribing to verify the live credit calculation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateReferral}
                  className="h-8 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <span>Simulate Referral (+1 Mo)</span>
                </button>
              </div>

              {simulatedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-in fade-in duration-200">
                  🎉 Simulated referral verified! +1 friend and +1 month of subscription credit added.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              openPaywall();
            }}
            className="text-purple-700 dark:text-purple-400 hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
          >
            <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>View Subscription Plans</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
