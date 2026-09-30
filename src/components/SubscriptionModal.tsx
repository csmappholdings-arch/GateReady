import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSubscription, BillingCycle } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { openLemonCheckout, buildLemonCheckoutUrl } from '../lib/lemonSqueezy';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  Users, 
  Luggage, 
  ShieldCheck, 
  CreditCard,
  Zap,
  ArrowRight,
  Key,
  ExternalLink
} from 'lucide-react';

export const SubscriptionModal: React.FC = () => {
  const { isPaywallOpen, closePaywall, upgradeToPro, paywallReason, isPro, tier, applyLicenseKey } = useSubscription();
  const { user } = useAuth();
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [showLicenseEntry, setShowLicenseEntry] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseError, setLicenseError] = useState('');

  // Re-initialize Lemon.js when paywall opens
  useEffect(() => {
    if (isPaywallOpen && typeof window !== 'undefined' && window.createLemonSqueezy) {
      window.createLemonSqueezy();
    }
  }, [isPaywallOpen]);

  if (!isPaywallOpen) return null;

  const currentCheckoutUrl = buildLemonCheckoutUrl(selectedCycle, user);

  const handleSubscribe = () => {
    setIsProcessing(true);

    openLemonCheckout({
      cycle: selectedCycle,
      user: user,
      onSuccess: async () => {
        await upgradeToPro(selectedCycle);
        setIsProcessing(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          closePaywall();
        }, 1500);
      },
      onClose: () => {
        setIsProcessing(false);
      }
    });

    // Provide a timeout fallback reset if popup or redirect took over
    setTimeout(() => {
      setIsProcessing(false);
    }, 4000);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 min-h-screen">
      <div 
        className="w-full max-w-lg my-auto rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 relative z-[100000]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Banner with Purple/Gold Gradient */}
        <div className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 p-6 text-white text-center shrink-0">
          <button
            onClick={closePaywall}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
            <Crown className="w-6 h-6 fill-amber-300" />
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-400/25 text-amber-200 border border-amber-300/30 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3" /> Gate Ready Pro
          </span>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Pack for the Entire Family
          </h3>
          <p className="text-xs text-purple-100/90 mt-1 max-w-sm mx-auto">
            Unlock unlimited travelers, multiple checked bags, carry-ons, and seamless cloud sync across all your devices.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Paywall Context Reason */}
          {paywallReason && (
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-purple-950 dark:text-purple-200">
                  Subscription Limit Reached
                </p>
                <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 mt-0.5 leading-snug">
                  {paywallReason}
                </p>
              </div>
            </div>
          )}

          {/* Billing Cycle Selector Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Your Plan
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              {/* Monthly Option */}
              <button
                type="button"
                onClick={() => setSelectedCycle('monthly')}
                className={`relative p-3 rounded-xl text-left transition-all cursor-pointer ${
                  selectedCycle === 'monthly'
                    ? 'bg-white dark:bg-slate-900 shadow-md border-2 border-purple-600 dark:border-purple-500'
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/40 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Monthly
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedCycle === 'monthly'
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedCycle === 'monthly' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white">$4.99</span>
                  <span className="text-[11px] text-slate-400 font-medium"> / month</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Cancel anytime</p>
              </button>

              {/* Annual Option (Best Value) */}
              <button
                type="button"
                onClick={() => setSelectedCycle('yearly')}
                className={`relative p-3 rounded-xl text-left transition-all cursor-pointer ${
                  selectedCycle === 'yearly'
                    ? 'bg-white dark:bg-slate-900 shadow-md border-2 border-purple-600 dark:border-purple-500'
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/40 border-2 border-transparent'
                }`}
              >
                <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
                  Save 33%
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Annual Pass
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedCycle === 'yearly'
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedCycle === 'yearly' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white">$39.99</span>
                  <span className="text-[11px] text-slate-400 font-medium"> / year</span>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Only $3.33 / month
                </p>
              </button>
            </div>
          </div>

          {/* Feature Matrix Comparison */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              What's Included in Pro:
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Round-Trip & Return Tracking:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Track return flights, return dates/times, 2-way baggage allowances, and departure day countdowns.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Unlimited Travelers:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Free is limited to 1 user. Pro unlocks parents, kids, toddlers, and companions.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Unlimited Bags & Multiples:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Free is limited to 2 bags total. Pro unlocks unlimited checked bags, carry-ons, and personal items.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Aircraft Cabin & Plugs Intel:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    In-seat AC power outlet specs, USB-A/C ports, and overhead bin clearance risks for 20+ commercial aircraft.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Travel Intel & Checklists:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Destination weather climate advisories, cash vs card & digital payment estimator, and pre-departure checklists.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Download Printable PDF Lists:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Export high-res PDF checklists formatted with baggage headers, item checkboxes, and weight limits.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Departure Countdown Clock & Day-of Alerts:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Live ticking countdown to travel with critical alerts for foreign cash pickup, passports, and home security.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Emergency Luggage QR Tags & Recovery Cards:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Generate privacy-safe luggage tags (protecting home addresses) and airline baggage claim sheets.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Pre-Built Packing Presets & Custom Bag Kits:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Instant 1-click packing bundles (Business Tech, Beach Resort, Ski Trip, Toddler) and custom reusable bag templates.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Multi-Device Cloud Sync:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    Real-time cloud database backup for all family packing lists on phones & computers.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Global Airline Allowance Engine:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    42+ carriers (USA, Canada, Europe, Asia) with strict weight cap calculators.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment CTA */}
          <div className="space-y-3 pt-1">
            {paymentSuccess ? (
              <div className="h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 animate-in zoom-in-90 duration-200">
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Subscription Activated! Welcome to Pro</span>
              </div>
            ) : (
              <div className="space-y-2">
                <a
                  href={currentCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (typeof window !== 'undefined' && window.LemonSqueezy?.Url?.Open) {
                      e.preventDefault();
                      handleSubscribe();
                    }
                  }}
                  className="lemonsqueezy-button w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer text-center no-underline"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Opening Lemon Squeezy Checkout...</span>
                    </div>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>
                        Subscribe for {selectedCycle === 'yearly' ? '$39.99 / Year' : '$4.99 / Month'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </a>

                <div className="text-center">
                  <a
                    href={currentCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <span>Click here to open checkout in a new window</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Trust and Guarantee badges */}
            <div className="space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Cancel Anytime
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-purple-500" />
                  Cards, Apple Pay, Google Pay & PayPal
                </span>
                <span>•</span>
                <span>14-day Guarantee</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Processed securely via <strong>Lemon Squeezy</strong>
              </p>
            </div>

            {/* Manual or Testing License Code redemption */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              {!showLicenseEntry ? (
                <button
                  type="button"
                  onClick={() => setShowLicenseEntry(true)}
                  className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>Have a backup or testing license key?</span>
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const res = applyLicenseKey(licenseInput);
                    if (res.success) {
                      setPaymentSuccess(true);
                      setTimeout(() => {
                        setPaymentSuccess(false);
                        closePaywall();
                      }, 1200);
                    } else {
                      setLicenseError(res.message);
                    }
                  }}
                  className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-purple-600" />
                      <span>Enter Pro License Key</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLicenseEntry(false);
                        setLicenseError('');
                      }}
                      className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={licenseInput}
                      onChange={(e) => {
                        setLicenseInput(e.target.value);
                        setLicenseError('');
                      }}
                      placeholder="e.g. GR-Test-2026-1"
                      className="flex-1 h-9 px-3 text-xs uppercase font-bold tracking-wider rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                    >
                      Activate
                    </button>
                  </div>

                  {licenseError && (
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                      {licenseError}
                    </p>
                  )}

                  <p className="text-[10px] text-slate-400">
                    Testing keys: <span className="font-bold text-purple-700 dark:text-purple-300">GR-Test-2026-1</span> to <span className="font-bold text-purple-700 dark:text-purple-300">GR-Test-2026-5</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
