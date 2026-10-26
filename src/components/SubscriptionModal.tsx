import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSubscription, BillingCycle, PaidTier } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { openLemonCheckout, buildLemonCheckoutUrl } from '../lib/lemonSqueezy';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  CreditCard,
  Zap,
  Key,
  Users,
  Luggage,
  Cloud,
  CheckCircle2,
  Gift
} from 'lucide-react';

export const SubscriptionModal: React.FC = () => {
  const { 
    isPaywallOpen, 
    closePaywall, 
    upgradeToTier, 
    paywallReason, 
    tier, 
    applyLicenseKey 
  } = useSubscription();
  const { user } = useAuth();
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('yearly');
  const [processingTier, setProcessingTier] = useState<PaidTier | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [showLicenseEntry, setShowLicenseEntry] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [licenseSuccessMsg, setLicenseSuccessMsg] = useState('');

  // Re-initialize Lemon.js when paywall opens
  useEffect(() => {
    if (isPaywallOpen && typeof window !== 'undefined' && window.createLemonSqueezy) {
      window.createLemonSqueezy();
    }
  }, [isPaywallOpen]);

  if (!isPaywallOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleChooseTier = (chosenTier: PaidTier) => {
    setProcessingTier(chosenTier);

    openLemonCheckout({
      tier: chosenTier,
      cycle: selectedCycle,
      user: user,
      onSuccess: async (purchasedTier, cycle) => {
        await upgradeToTier(purchasedTier, cycle);
        setProcessingTier(null);
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          closePaywall();
        }, 1500);
      },
      onClose: () => {
        setProcessingTier(null);
      }
    });

    setTimeout(() => {
      setProcessingTier(null);
    }, 4000);
  };

  const silverCheckoutUrl = buildLemonCheckoutUrl('SILVER', selectedCycle, user);
  const goldCheckoutUrl = buildLemonCheckoutUrl('GOLD', selectedCycle, user);
  const platinumCheckoutUrl = buildLemonCheckoutUrl('PLATINUM', selectedCycle, user);

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 min-h-screen">
      <div 
        className="w-full max-w-5xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-150 relative z-[100000]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 p-5 sm:p-6 text-white text-center shrink-0">
          <button
            onClick={closePaywall}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-2.5">
            <Crown className="w-6 h-6 fill-amber-300" />
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-400/25 text-amber-200 border border-amber-300/30 px-3 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3" /> GateReady Plans & Upgrades
          </span>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Pack Smarter with GateReady
          </h3>
          <p className="text-xs text-purple-100/90 mt-1 max-w-md mx-auto">
            Choose the perfect plan for your travel style. Every paid plan includes our 14-day money-back guarantee.
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="mt-4 inline-flex items-center p-1 rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setSelectedCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCycle === 'monthly'
                  ? 'bg-white text-purple-950 shadow-sm'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setSelectedCycle('yearly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCycle === 'yearly'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 shadow-sm font-black'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[9px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Save up to 37%
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Content: 4-Column Comparison Table */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Paywall Context Reason (if triggered by a limit) */}
          {paywallReason && (
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-purple-950 dark:text-purple-200">
                  Feature Upgrade Required
                </p>
                <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 mt-0.5 leading-snug">
                  {paywallReason}
                </p>
              </div>
            </div>
          )}

          {/* Fix 7: 7-Day Platinum Trial Explanation */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border border-purple-200 dark:border-purple-800/80 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 w-full">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      7-Day Full Platinum Trial
                    </h4>
                    <span className="text-[10px] font-bold bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Free Account Bonus
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-100 dark:border-purple-900/40">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">What it includes:</span>
                      Full access to all Platinum features — unlimited bags, multiple travelers, offline terminal maps, privacy QR luggage tags, and PDF exports.
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-100 dark:border-purple-900/40">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">How it activates:</span>
                      Activates automatically when you create a free GateReady account. No credit card or payment method required upfront.
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-100 dark:border-purple-900/40">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">What happens at day 7:</span>
                      When the 7 days end, your account automatically returns to the Free plan. No surprise charges, and your lists stay saved.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Grid: Free / Silver / Gold / Platinum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
            {/* COLUMN 1: FREE */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-4 flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Free
                  </span>
                  {tier === 'FREE' && (
                    <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">$0</span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Free forever starter plan
                  </p>
                  <div className="mt-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Good for 1 occasional solo flight
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300"><strong>1</strong> traveler</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300"><strong>1</strong> active trip</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300"><strong>2</strong> bags total (1/type)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Smart Luggage Scales</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">TSA 3-1-1 liquids checker</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Climate forecast</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Basic personal cloud sync</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  disabled
                  className="w-full h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center cursor-default"
                >
                  {tier === 'FREE' ? 'Active Plan' : 'Free Included'}
                </button>
              </div>
            </div>

            {/* COLUMN 2: SILVER */}
            <div className={`rounded-2xl border p-4 flex flex-col justify-between transition-all relative ${
              tier === 'SILVER'
                ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Silver
                  </span>
                  {selectedCycle === 'yearly' && (
                    <span className="text-[9px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full">
                      2 months free
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedCycle === 'yearly' ? '$19.99' : '$1.99'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {selectedCycle === 'yearly' ? '/ year' : '/ month'}
                    </span>
                  </div>
                  {selectedCycle === 'yearly' ? (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      $1.67/mo · 2 months free
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Billed monthly · Cancel anytime
                    </p>
                  )}
                  <div className="mt-1 px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-900/60 text-[10px] text-purple-900 dark:text-purple-200 font-bold leading-tight">
                    ~$0.38/trip · Less than 1/35th of one overweight bag fee
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">1 traveler</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">2 active trips</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">Unlimited bags</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">All core packing tools:</span>
                  </div>
                  <ul className="pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc">
                    <li>Smart Luggage Scales</li>
                    <li>TSA 3-1-1 liquids checker</li>
                    <li>1-click presets & bag kits</li>
                    <li>Printable PDF packing lists</li>
                    <li>Departure countdown & alerts</li>
                    <li>Emergency QR bag tags</li>
                    <li>Worldwide terminal maps</li>
                    <li>Aircraft cabin intel</li>
                    <li>Travel wallet & loyalty #s</li>
                    <li>Cash vs card guides</li>
                    <li>42+ airline allowance engine</li>
                    <li>Round-trip tracking</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <a
                  href={silverCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.LemonSqueezy?.Url?.Open) {
                      e.preventDefault();
                      handleChooseTier('SILVER');
                    }
                  }}
                  className="lemonsqueezy-button w-full h-10 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-purple-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer text-center no-underline"
                >
                  {processingTier === 'SILVER' ? (
                    <span className="animate-pulse">Opening Checkout...</span>
                  ) : (
                    <span>Choose Silver</span>
                  )}
                </a>
              </div>
            </div>

            {/* COLUMN 3: GOLD (MOST POPULAR - VISUAL DEFAULT CHOICE) */}
            <div className={`rounded-2xl border-2 p-4 flex flex-col justify-between transition-all relative shadow-2xl ring-4 ring-amber-400/50 border-amber-500 scale-[1.02] z-10 ${
              tier === 'GOLD'
                ? 'bg-amber-50/50 dark:bg-amber-950/30'
                : 'bg-gradient-to-b from-amber-500/10 via-white to-amber-500/10 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900'
            }`}>
              {/* Highlight Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-white" />
                  MOST POPULAR
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 mt-1">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Gold
                  </span>
                  {selectedCycle === 'yearly' && (
                    <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Save 37%
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-2">
                  Best value for couples &amp; families
                </p>

                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedCycle === 'yearly' ? '$29.99' : '$3.99'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {selectedCycle === 'yearly' ? '/ year' : '/ month'}
                    </span>
                  </div>
                  {selectedCycle === 'yearly' ? (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      $2.50/mo · save 37%
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Billed monthly · Cancel anytime
                    </p>
                  )}
                  <div className="mt-1.5 px-2.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-[10px] text-amber-950 dark:text-amber-200 font-extrabold leading-tight">
                    ~$0.25 per family trip · Less than the cost of one overweight-bag fee per year
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-amber-600 dark:text-amber-400 text-[11px] uppercase tracking-wider">
                    Everything in Silver, plus:
                  </p>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-900 dark:text-white font-bold">2 travelers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-900 dark:text-white font-bold">Unlimited active trips</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-900 dark:text-white font-bold">Multi-device &amp; family member sync (2 travelers)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Unlimited bags & scales</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">All core packing tools & intel</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <a
                  href={goldCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.LemonSqueezy?.Url?.Open) {
                      e.preventDefault();
                      handleChooseTier('GOLD');
                    }
                  }}
                  className="lemonsqueezy-button w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-all cursor-pointer text-center no-underline active:scale-95"
                >
                  {processingTier === 'GOLD' ? (
                    <span className="animate-pulse">Opening Checkout...</span>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5 fill-white" />
                      <span>Choose Gold</span>
                    </>
                  )}
                </a>
              </div>
            </div>

            {/* COLUMN 4: PLATINUM */}
            <div className={`rounded-2xl border p-4 flex flex-col justify-between transition-all relative ${
              tier === 'PLATINUM'
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    Platinum
                  </span>
                  <div className="flex items-center gap-1">
                    {selectedCycle === 'yearly' && (
                      <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                        Save 33%
                      </span>
                    )}
                    <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 px-1.5 py-0.2 rounded-full">
                      7-day trial
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedCycle === 'yearly' ? '$39.99' : '$4.99'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {selectedCycle === 'yearly' ? '/ year' : '/ month'}
                    </span>
                  </div>
                  {selectedCycle === 'yearly' ? (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      $3.33/mo · save 33%
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Billed monthly · Cancel anytime
                    </p>
                  )}
                  <div className="mt-1 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-900/60 text-[10px] text-indigo-900 dark:text-indigo-200 font-bold leading-tight">
                    ~$0.33/trip · Total group &amp; family travel peace of mind
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] uppercase tracking-wider">
                    Everything in Gold, plus:
                  </p>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-slate-900 dark:text-white font-bold">Unlimited travelers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-slate-900 dark:text-white font-bold">Unlimited devices / family sharing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Unlimited active trips</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Unlimited bags & scales</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Unlimited group &amp; family cloud sync</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <a
                  href={platinumCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.LemonSqueezy?.Url?.Open) {
                      e.preventDefault();
                      handleChooseTier('PLATINUM');
                    }
                  }}
                  className="lemonsqueezy-button w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer text-center no-underline"
                >
                  {processingTier === 'PLATINUM' ? (
                    <span className="animate-pulse">Opening Checkout...</span>
                  ) : (
                    <span>Choose Platinum</span>
                  )}
                </a>
              </div>
            </div>
          </div>

          {/* Payment Success state */}
          {paymentSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-center flex items-center justify-center gap-2 animate-in zoom-in-90 duration-200">
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Subscription Activated! Welcome to GateReady</span>
            </div>
          )}

          {/* Trust and 14-day Guarantee badges */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                14-day money-back guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-500" />
                Cancel anytime
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Instant activation
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Processed securely via <strong>Lemon Squeezy</strong>
            </p>
          </div>

          {/* Referral Program / Free Month link in pricing dialog */}
          <div className="pt-2 text-center flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                closePaywall();
                window.dispatchEvent(new CustomEvent('gateready:open-referral'));
              }}
              className="text-[11px] font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-fuchsia-500" />
              <span>Invite Friends · Get 1 Month Free</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            {!showLicenseEntry ? (
              <button
                type="button"
                onClick={() => setShowLicenseEntry(true)}
                className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
              >
                <Key className="w-3 h-3" />
                <span>Have a license key?</span>
              </button>
            ) : null}
          </div>

          {showLicenseEntry && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLicenseError('');
                setLicenseSuccessMsg('');
                const res = applyLicenseKey(licenseInput);
                if (res.success) {
                  setLicenseSuccessMsg(res.message);
                  setLicenseInput('');
                  setTimeout(() => {
                    closePaywall();
                  }, 2000);
                } else {
                  setLicenseError(res.message);
                }
              }}
              className="max-w-xs mx-auto space-y-2 mt-2"
            >
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  placeholder="Enter License Key"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Redeem
                </button>
              </div>
              {licenseError && (
                <p className="text-[11px] text-rose-500 font-semibold">{licenseError}</p>
              )}
              {licenseSuccessMsg && (
                <p className="text-[11px] text-emerald-500 font-semibold">{licenseSuccessMsg}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
