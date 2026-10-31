import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePacking } from '../context/PackingContext';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { TravelType, Trip } from '../types/travel';
import { 
  Plane, 
  Train, 
  Car, 
  Ship, 
  Bus, 
  Settings, 
  ChevronDown, 
  Plus, 
  Sun, 
  Moon, 
  Scale, 
  CheckCheck, 
  RotateCcw, 
  Trash2,
  Luggage,
  Users,
  Cloud,
  RefreshCw,
  LogOut,
  Smartphone,
  CheckCircle,
  WifiOff,
  Crown,
  Sparkles,
  Play,
  Zap,
  Key,
  CreditCard,
  Thermometer,
  X,
  Gift,
  User as UserIcon
} from 'lucide-react';
import { useTravelWallet } from '../context/TravelWalletContext';
import { AccountSyncModal } from './AccountSyncModal';
import { deleteUserAccountAndData } from '../lib/firebase';

interface HeaderProps {
  onOpenAddTrip: () => void;
  onOpenAddBag: () => void;
  onOpenTour?: () => void;
  onOpenAccountSync?: () => void;
  onOpenReferral?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAddTrip, 
  onOpenTour, 
  onOpenAccountSync,
  onOpenReferral 
}) => {
  const {
    trips,
    currentTrip,
    selectTrip,
    weightUnit,
    toggleWeightUnit,
    tempUnit,
    toggleTempUnit,
    isDarkMode,
    setDarkMode,
    resetAllPacked,
    markAllPacked,
    deleteTrip,
    cloudSyncStatus,
    lastSyncedAt,
    manualSync
  } = usePacking();

  const { user, signIn, signOut, loading: authLoading, error: authError, clearError, resendVerificationEmail } = useAuth();
  const [resentVerification, setResentVerification] = useState(false);
  const { 
    isPro, 
    tier, 
    openPaywall, 
    cancelSubscription, 
    billingCycle, 
    subscriptionExpiresAt,
    manualLicenseKey,
    isMasterKey,
    applyLicenseKey,
    removeLicenseKey,
    isTrialActive,
    trialTimeLeftText,
    isReferralPlatinumActive,
    referralTimeLeftText,
    hasPendingReferralCode
  } = useSubscription();

  const { accounts: walletAccounts, openWalletModal } = useTravelWallet();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tripMenuOpen, setTripMenuOpen] = useState(false);
  const [accountSyncModalOpen, setAccountSyncModalOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [tripToDeleteFromSettings, setTripToDeleteFromSettings] = useState<Trip | null>(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

  // Manual Pro license input state
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseFeedback, setLicenseFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showLicenseField, setShowLicenseField] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const tripMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (tripMenuRef.current && !tripMenuRef.current.contains(e.target as Node)) {
        setTripMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSettingsOpen(false);
        setUserMenuOpen(false);
        setTripMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getTravelIcon = (type?: TravelType) => {
    switch (type) {
      case 'PLANE':
        return <Plane className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'TRAIN':
        return <Train className="w-4 h-4 text-emerald-500" />;
      case 'CAR':
        return <Car className="w-4 h-4 text-amber-500" />;
      case 'CRUISE':
        return <Ship className="w-4 h-4 text-indigo-500" />;
      case 'BUS':
        return <Bus className="w-4 h-4 text-fuchsia-500" />;
      default:
        return <Luggage className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  // Calculate overall packed statistics for current trip
  const totalItems = currentTrip?.bags.reduce((acc, b) => acc + b.items.length, 0) || 0;
  const packedItems = currentTrip?.bags.reduce(
    (acc, b) => acc + b.items.filter((i) => i.isPacked).length,
    0
  ) || 0;
  const packedPct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await manualSync();
    setTimeout(() => setIsManualSyncing(false), 600);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 dark:from-purple-700 dark:via-purple-600 dark:to-indigo-800 text-white backdrop-blur-md border-b border-purple-300/60 dark:border-purple-400/50 shadow-lg shadow-purple-600/20 transition-colors">
      {/* Top luminous accent edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-300 via-white/80 to-purple-200 opacity-90" />

      {/* Background blueprint circuit lines accent from branding */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" 
        />
        <div 
          className="absolute -top-16 left-1/3 w-96 h-28 bg-fuchsia-400/25 blur-3xl" 
        />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-3 sm:gap-6 relative z-10">
        {/* Left: GateReady.ca Stadium Neon Badge matching uploaded branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative group cursor-default select-none">
            {/* Outer neon magenta/violet glow blur aura */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500 rounded-2xl blur-[3px] opacity-75 group-hover:opacity-100 transition duration-300" />

            {/* Stadium Capsule Badge */}
            <div className="relative px-3 sm:px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/95 to-slate-950 border-2 border-fuchsia-400 shadow-[0_0_16px_rgba(217,70,239,0.5),inset_0_0_12px_rgba(168,85,247,0.35)] flex items-center gap-2 sm:gap-2.5">
              {/* Metallic Purple Carry-On Suitcase with GR Monogram */}
              <div className="relative w-6 h-7 sm:w-7 sm:h-8 rounded-md bg-gradient-to-b from-purple-700 via-indigo-950 to-slate-950 border border-purple-300/40 flex flex-col items-center justify-center shadow-inner shadow-purple-400/20 shrink-0">
                {/* Luggage handle */}
                <div className="absolute -top-1.5 w-2.5 sm:w-3 h-1.5 border-t-2 border-x-2 border-purple-200/90 rounded-t-xs" />
                {/* GR Monogram */}
                <span className="text-[9px] sm:text-[10px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-100 via-purple-200 to-indigo-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  GR
                </span>
                {/* Luggage rib grooves */}
                <div className="w-3.5 sm:w-4 h-[1px] bg-purple-400/40 rounded-full mt-0.5" />
              </div>

              {/* GateReady.ca Brand Typography */}
              <div className="flex flex-col">
                <div className="flex items-baseline tracking-tight">
                  <span className="font-black text-base sm:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    Gate<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-200 to-purple-200">Ready</span>
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-fuchsia-400 ml-0.5 drop-shadow-[0_0_8px_rgba(232,121,249,0.9)]">
                    .ca
                  </span>
                </div>
                <span className="hidden sm:inline text-[9px] font-bold text-purple-200/90 tracking-wider uppercase -mt-0.5">
                  Baggage & Packing Intel
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Direct Links to Guides & Calculator (hidden on mobile to protect two-row layout) */}
          <nav className="hidden xl:flex items-center gap-2 ml-2" aria-label="Quick travel links">
            <a
              href="/airlines"
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-purple-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              Airline Guides
            </a>
            <a
              href="/baggage-fee-calculator"
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-purple-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              Fee Calculator
            </a>
          </nav>

          {/* Pro / Referral / Trial / Free Plan Badge (Desktop row) */}
          <div className="hidden sm:flex items-center">
            {isReferralPlatinumActive ? (
              <button
                type="button"
                onClick={() => openPaywall("You have an active 1-Month Free Platinum Referral access! All Platinum features are unlocked.")}
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white px-2.5 sm:px-3 py-1 rounded-full shadow-md border border-fuchsia-300/40 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                title={`Referral 1-Month Free Platinum · ${referralTimeLeftText} · Click to view plans`}
              >
                <Gift className="w-3 h-3 text-amber-300 shrink-0 animate-bounce" />
                <span className="whitespace-nowrap">Referral Platinum · {referralTimeLeftText}</span>
              </button>
            ) : isTrialActive ? (
              <button
                type="button"
                onClick={() => openPaywall("You are on a 7-day Platinum trial with full access. Choose a plan to lock in uninterrupted access.")}
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 text-white px-2.5 sm:px-3 py-1 rounded-full shadow-md border border-amber-300/40 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                title={`Platinum 7-Day Trial Active · ${trialTimeLeftText} · Click to view plans`}
              >
                <Crown className="w-3 h-3 fill-amber-200 text-amber-200 shrink-0 animate-pulse" />
                <span className="whitespace-nowrap">Platinum trial · {trialTimeLeftText}</span>
              </button>
            ) : hasPendingReferralCode ? (
              <button
                type="button"
                onClick={() => {
                  if (onOpenAccountSync) onOpenAccountSync();
                  else setAccountSyncModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 text-white px-2.5 sm:px-3 py-1 rounded-full shadow-md border border-amber-300/50 cursor-pointer hover:brightness-110 active:scale-95 transition-all animate-pulse"
                title="Referral detected · Create a free account & sign in to apply 1 Free Month of Platinum"
              >
                <Gift className="w-3 h-3 text-amber-200 shrink-0" />
                <span className="whitespace-nowrap">Claim 1-Mo Platinum</span>
              </button>
            ) : authLoading ? (
              <span className="w-16 h-5 bg-white/10 rounded-full animate-pulse inline-block" />
            ) : isPro ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-1 rounded-full shadow-xs border border-amber-300/40">
                <Crown className="w-2.5 h-2.5 fill-white" /> {isMasterKey ? 'VIP Master' : tier === 'PLATINUM' ? 'Platinum' : tier === 'GOLD' ? 'Gold' : 'Silver'}
              </span>
            ) : user ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-purple-200/90 bg-purple-950/70 border border-purple-800/60 px-2.5 py-1 rounded-full">
                Free Plan
              </span>
            ) : null}
          </div>
        </div>

        {/* Center / Right: Streamlined Action Buttons, Free Month Pill, Sync Account & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Pro Upgrade / Badge Button */}
          {authLoading ? (
            <div className="h-8.5 sm:h-9 w-20 rounded-xl bg-white/10 border border-white/15 animate-pulse" />
          ) : !isPro ? (
            <button
              type="button"
              onClick={() => openPaywall("Upgrade to Silver ($1.99/mo), Gold, or Platinum to unlock unlimited bags, active trips, and multi-traveler packing.")}
              className="h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-fuchsia-600/25 active:scale-95 transition-all cursor-pointer border border-fuchsia-400/40"
              title="Upgrade GateReady Plan"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span className="hidden sm:inline">Upgrade</span>
              <span className="text-[10px] bg-amber-400 text-purple-950 font-black px-1.5 py-0.2 rounded-md">PLANS</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openPaywall()}
              className="h-8.5 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-amber-950/60 border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-900/60 transition-colors cursor-pointer shadow-xs"
              title={`${tier} Plan Active`}
            >
              <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="hidden md:inline text-[11px] font-bold">{tier} Active</span>
            </button>
          )}

          {/* Item 7: Direct Free Month Referral Pill surfaced next to Sync Account (Desktop) */}
          {onOpenReferral && (
            <button
              type="button"
              onClick={onOpenReferral}
              className="hidden sm:flex h-9 px-3 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-black items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer border border-fuchsia-300/40"
              title="Refer a Friend · Get 1 Month Free"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-[11px]">Free Month</span>
            </button>
          )}

          {/* Google Account & Cloud Sync Dropdown */}
          <div className="relative z-50" ref={userRef}>
            {authLoading ? (
              <div className="h-9 sm:h-10 px-3 rounded-xl border border-white/20 bg-white/10 text-white/70 text-xs flex items-center gap-2 animate-pulse">
                <div className="w-5 h-5 rounded-full bg-white/20" />
                <span className="hidden sm:inline text-[11px] font-semibold">Loading...</span>
              </div>
            ) : user ? (
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setSettingsOpen(false);
                }}
                className="h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/50 text-emerald-200 flex items-center gap-2 hover:bg-emerald-900/60 transition-colors cursor-pointer"
                title="Google Account & Cloud Sync"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google Account'}
                    className="w-6 h-6 rounded-full border border-emerald-400 shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}

                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[11px] font-bold leading-none truncate max-w-[85px] text-white">
                    {user.displayName?.split(' ')[0] || 'Synced'}
                  </span>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Cloud Sync
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-emerald-400 shrink-0 ml-0.5" />
              </button>
            ) : (
              /* Sync Account button: surfaced for guests ONLY when they have saved trips worth syncing */
              <button
                type="button"
                onClick={() => {
                  if (onOpenAccountSync) {
                    onOpenAccountSync();
                  } else {
                    setAccountSyncModalOpen(true);
                  }
                }}
                className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-white/25 bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
                title="Sign in with Google or Email to sync trips across devices"
              >
                <Cloud className="w-4 h-4 text-fuchsia-300 shrink-0" />
                <span className="hidden sm:inline">Sync Account</span>
              </button>
            )}

            {/* User Account Popover */}
            {userMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-purple-900/60 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google Account'}
                      className="w-11 h-11 rounded-full border-2 border-emerald-400 object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.displayName || 'Traveler'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user.email}
                    </p>
                    {user.emailVerified ? (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        Account Active
                      </span>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                          Verify email
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await resendVerificationEmail();
                              setResentVerification(true);
                              setTimeout(() => setResentVerification(false), 5000);
                            } catch {}
                          }}
                          className="text-[10px] text-purple-700 dark:text-purple-300 hover:underline font-bold cursor-pointer"
                        >
                          {resentVerification ? 'Link Sent!' : 'Resend link'}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 self-start"
                    aria-label="Close menu"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Subscription Tier Info Card */}
                <div className="py-2.5 border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Crown className={`w-4 h-4 ${isPro ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                      Subscription Plan
                    </span>
                    {isPro ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full">
                        {tier} ({billingCycle})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        Free Plan
                      </span>
                    )}
                  </div>

                  {isTrialActive ? (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200 text-[11px]">
                        <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Platinum trial · {trialTimeLeftText} left</span>
                      </div>
                      <p className="text-[10px] text-amber-800/90 dark:text-amber-300/90 leading-snug">
                        Returns to Free automatically on day 7. No card, no charge.
                      </p>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          openPaywall("Choose a plan to keep uninterrupted Platinum features after day 7.");
                        }}
                        className="w-full h-7 mt-1 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <Crown className="w-3 h-3 fill-amber-200 text-amber-200" />
                        <span>Upgrade to Keep Platinum</span>
                      </button>
                    </div>
                  ) : isReferralPlatinumActive ? (
                    <div className="p-2.5 rounded-xl bg-fuchsia-50/70 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800/80 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-fuchsia-900 dark:text-fuchsia-200 text-[11px]">
                        <Gift className="w-3.5 h-3.5 text-fuchsia-500" />
                        <span>Referral Platinum · {referralTimeLeftText} left</span>
                      </div>
                      <p className="text-[10px] text-fuchsia-800/90 dark:text-fuchsia-300/90 leading-snug">
                        1 Month Free Platinum unlocked via referral. No card, no charge.
                      </p>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          openPaywall();
                        }}
                        className="w-full h-7 mt-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <span>View Plans</span>
                      </button>
                    </div>
                  ) : isPro ? (
                    <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
                      <p className="font-semibold text-amber-950 dark:text-amber-200 text-[11px]">
                        {tier === 'SILVER'
                          ? 'Silver: 1 Traveler · 2 Active Trips · Unlimited Bags'
                          : tier === 'GOLD'
                            ? 'Gold: 2 Travelers · Unlimited Trips · Cloud Sync'
                            : 'Platinum: Unlimited Travelers & Trips · Family Sharing'}
                      </p>
                      <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                        {tier === 'SILVER'
                          ? (billingCycle === 'yearly' ? '$19.99/year' : '$1.99/month')
                          : tier === 'GOLD'
                            ? (billingCycle === 'yearly' ? '$29.99/year' : '$3.99/month')
                            : (billingCycle === 'yearly' ? '$39.99/year' : '$4.99/month')} · Renews automatically
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <button
                          onClick={() => openPaywall()}
                          className="text-[10px] font-bold text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
                        >
                          Change Plan
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Cancel subscription? You will return to the Free Plan (1 traveler, 1 active trip, up to 2 bags).')) {
                              cancelSubscription();
                            }
                          }}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
                      <p className="text-[11px] text-purple-900 dark:text-purple-200 leading-snug">
                        Free Plan allows <strong>1 traveler</strong>, <strong>1 active trip</strong>, and up to <strong>2 bags</strong>.
                      </p>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          openPaywall("Upgrade to Silver ($1.99/mo), Gold ($3.99/mo), or Platinum ($4.99/mo) to unlock unlimited bags and travelers.");
                        }}
                        className="w-full h-8 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:from-purple-700 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        <span>Upgrade Plan (from $1.99/mo)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Cloud Sync Status info */}
                <div className="py-2.5 border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Cloud className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      Cloud Firestore Sync
                    </span>
                    <span className={`text-[11px] font-bold ${
                      cloudSyncStatus === 'synced' ? 'text-emerald-600 dark:text-emerald-400' :
                      cloudSyncStatus === 'syncing' ? 'text-purple-600 dark:text-purple-400' :
                      'text-rose-600 dark:text-rose-400'
                    }`}>
                      {cloudSyncStatus === 'synced' && 'Real-Time Connected'}
                      {cloudSyncStatus === 'syncing' && 'Syncing...'}
                      {cloudSyncStatus === 'offline' && 'Offline / Check Rules'}
                      {cloudSyncStatus === 'guest' && 'Local Only'}
                    </span>
                  </div>

                  <div className="rounded-xl bg-purple-50/60 dark:bg-purple-950/30 p-2 flex items-start gap-2 border border-purple-100 dark:border-purple-900/40">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      Synced in real-time across your phone and laptop when traveling.
                    </p>
                  </div>

                  {lastSyncedAt && (
                    <p className="text-[10px] text-slate-400 text-right">
                      Last synced: {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                {/* Actions: Sync Now & Sign Out */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={handleManualSync}
                    disabled={isManualSyncing}
                    className="flex-1 h-9 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
                    <span>Sync Now</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="h-9 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Menu Dropdown */}
          <div className="relative z-50" ref={settingsRef}>
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setUserMenuOpen(false);
              }}
              className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl border border-white/25 bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Settings"
              title="Settings & Preferences"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-purple-900/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Preferences & Settings
                    </p>
                    <p className="text-[11px] text-slate-400">Settings for GateReady.ca</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    aria-label="Close settings"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Item 8: Account Row at Top of Settings */}
                <div className="p-3 border-b border-purple-100 dark:border-purple-900/40 bg-purple-50/70 dark:bg-purple-950/30">
                  {!user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            You're browsing as a guest
                          </p>
                          <p className="text-[10px] text-purple-700 dark:text-purple-300">
                            Lists saved locally · Not backed up to cloud
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsOpen(false);
                          if (onOpenAccountSync) {
                            onOpenAccountSync();
                          } else {
                            setAccountSyncModalOpen(true);
                          }
                        }}
                        className="w-full h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Cloud className="w-3.5 h-3.5 text-purple-200" />
                        <span>Sign in / Create free account</span>
                      </button>

                      {hasPendingReferralCode && (
                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-fuchsia-500" />
                            <span>Referral Bonus Pending:</span>
                          </span>
                          <span className="font-black text-purple-700 dark:text-purple-300">
                            1 Mo Platinum
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="w-8 h-8 rounded-full border border-purple-300 shrink-0 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {user.displayName || 'GateReady Traveler'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSettingsOpen(false);
                            signOut();
                          }}
                          className="h-7 px-2.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                        >
                          Sign out
                        </button>
                      </div>

                      {isReferralPlatinumActive && (
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-700 dark:text-purple-300 flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-fuchsia-500" />
                            <span>Referral Platinum:</span>
                          </span>
                          <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                            ⏳ {referralTimeLeftText}
                          </span>
                        </div>
                      )}

                      {isTrialActive && (
                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>7-Day Account Trial:</span>
                          </span>
                          <span className="font-mono font-black text-purple-700 dark:text-purple-300">
                            ⏳ {trialTimeLeftText}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* GateReady.ca Brand Blueprint Thumbnail Banner */}
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative rounded-xl overflow-hidden border border-purple-500/30 shadow-xs bg-slate-950">
                    <img 
                      src="/thumbnail.jpg" 
                      alt="GateReady.ca Transit & Baggage Intel" 
                      className="w-full h-24 object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white tracking-wide flex items-center gap-1.5 drop-shadow-sm">
                        <Sparkles className="w-3 h-3 text-fuchsia-400" />
                        <span>GateReady.ca Transit Intel</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Travel Wallet Row in Settings */}
                {onOpenTour && (
                  <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Video Walkthrough Tour
                        </p>
                        <p className="text-[10px] text-slate-400">
                          How Gate Ready works & feature guide
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        onOpenTour();
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                    >
                      Watch
                    </button>
                  </div>
                )}

                <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Travel Wallet & Loyalty
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {walletAccounts.length === 0 
                          ? 'Frequent flyer, KTN, PNR codes'
                          : `${walletAccounts.length} saved · Cloud / Local sync`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      openWalletModal();
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
                  >
                    Open
                  </button>
                </div>

                {/* Subscription Row in Settings */}
                <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Crown className={`w-4 h-4 ${isPro ? 'fill-amber-400 text-amber-500' : 'text-purple-600 dark:text-purple-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isMasterKey ? 'Master VIP Pass' : tier === 'PLATINUM' ? 'Gate Ready Platinum' : tier === 'GOLD' ? 'Gate Ready Gold' : tier === 'SILVER' ? 'Gate Ready Silver' : 'Free Plan'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {tier === 'PLATINUM' || isMasterKey
                          ? 'Unlimited travelers, bags & trips · VIP Priority'
                          : tier === 'GOLD'
                          ? 'Up to 6 travelers · Unlimited bags & trips · Cloud sync'
                          : tier === 'SILVER'
                          ? 'Up to 2 travelers · Unlimited bags · 2 active trips'
                          : '1 traveler · Up to 2 bags · 1 active trip'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      openPaywall();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isPro
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 hover:bg-amber-200'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isPro ? 'Manage' : 'Upgrade'}
                  </button>
                </div>

                {/* Manual Pro License Key Entry (Backup / Testing) */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Silver+ License Key
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {manualLicenseKey ? `Active: ${manualLicenseKey}` : 'Redeem a Silver+ key'}
                        </p>
                      </div>
                    </div>

                    {manualLicenseKey ? (
                      <button
                        onClick={() => {
                          removeLicenseKey();
                          setLicenseFeedback({ type: 'success', message: 'License key removed.' });
                        }}
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowLicenseField(!showLicenseField);
                          setLicenseFeedback(null);
                        }}
                        className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        {showLicenseField ? 'Cancel' : 'Enter Key'}
                      </button>
                    )}
                  </div>

                  {/* Active license state badge */}
                  {manualLicenseKey && (
                    <div className="mt-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-200">
                      <div className="min-w-0 pr-2">
                        <span className="flex items-center gap-1.5 font-bold truncate">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">Key: {manualLicenseKey}</span>
                        </span>
                        {subscriptionExpiresAt && !isMasterKey && (
                          <span className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 ml-5 block">
                            Expires: {new Date(subscriptionExpiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
                        {isMasterKey ? 'Master VIP' : tier === 'PLATINUM' ? 'Platinum VIP' : tier === 'GOLD' ? 'Gold VIP' : 'Silver 1-Month'}
                      </span>
                    </div>
                  )}

                  {/* License Entry Form */}
                  {!manualLicenseKey && showLicenseField && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const res = applyLicenseKey(licenseInput);
                        if (res.success) {
                          setLicenseFeedback({ type: 'success', message: res.message });
                          setLicenseInput('');
                          setShowLicenseField(false);
                        } else {
                          setLicenseFeedback({ type: 'error', message: res.message });
                        }
                      }}
                      className="mt-2.5 space-y-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          required
                          autoFocus
                          value={licenseInput}
                          onChange={(e) => {
                            setLicenseInput(e.target.value);
                            setLicenseFeedback(null);
                          }}
                          placeholder="Enter license key"
                          className="flex-1 h-8 px-2.5 text-xs uppercase tracking-wider font-bold rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                        />
                        <button
                          type="submit"
                          className="h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    </form>
                  )}

                  {licenseFeedback && (
                    <div
                      className={`mt-2 p-2 rounded-xl text-[10px] leading-tight font-medium ${
                        licenseFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {licenseFeedback.message}
                    </div>
                  )}
                </div>

                {/* Weight Unit Switch */}
                <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Weight Unit
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Currently: {weightUnit === 'LBS' ? 'Pounds (lbs)' : 'Kilograms (kg)'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleWeightUnit}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors cursor-pointer"
                  >
                    {weightUnit === 'LBS' ? 'Switch to KG' : 'Switch to LBS'}
                  </button>
                </div>

                {/* Temperature Unit Switch (°F / °C) */}
                <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Temperature Unit
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Currently: {tempUnit === 'F' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTempUnit}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors cursor-pointer"
                  >
                    {tempUnit === 'F' ? 'Switch to °C' : 'Switch to °F'}
                  </button>
                </div>

                {/* Dark Mode Switch */}
                <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {isDarkMode ? (
                      <Moon className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Appearance
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isDarkMode ? 'Dark theme' : 'Light theme'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!isDarkMode)}
                    className="w-10 h-6 rounded-full bg-slate-200 dark:bg-purple-600 p-0.5 flex items-center transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        isDarkMode ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Refer a Friend / Free Month in Settings */}
                {onOpenReferral && (
                  <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-fuchsia-500" />
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          Refer a Friend
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Get 1 Month Platinum Free
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenReferral();
                        setSettingsOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-300 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900 transition-colors cursor-pointer border border-fuchsia-200 dark:border-fuchsia-800/40"
                    >
                      Invite & Earn
                    </button>
                  </div>
                )}

                {/* Travel Guides & Public Directory Tools */}
                <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Travel Guides & Tools
                  </div>
                  <a
                    href="/airlines"
                    className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Plane className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      42+ Airline Guides
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Browse</span>
                  </a>
                  <a
                    href="/baggage-fee-calculator"
                    className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 text-amber-500" />
                      Baggage Fee Calculator
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Calc</span>
                  </a>
                  <a
                    href="/tare-weight"
                    className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Luggage className="w-3.5 h-3.5 text-indigo-500" />
                      Tare Weight Luggage Guide
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Guide</span>
                  </a>
                  <a
                    href="/entry-requirements"
                    className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Official Entry Requirements
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Gov Info</span>
                  </a>
                </div>

                {/* Batch Actions for Current Trip */}
                {currentTrip && (
                  <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        markAllPacked(currentTrip.id);
                        setSettingsOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Mark All Items Packed</span>
                    </button>
                    <button
                      onClick={() => {
                        resetAllPacked(currentTrip.id);
                        setSettingsOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Uncheck All Items</span>
                    </button>
                  </div>
                )}

                {/* Delete Current Trip: disabled or hidden if no current trip, uses custom modal */}
                {currentTrip && (
                  <div className="p-1.5">
                    <button
                      type="button"
                      disabled={!currentTrip}
                      onClick={() => {
                        if (currentTrip) {
                          setTripToDeleteFromSettings(currentTrip);
                          setSettingsOpen(false);
                        }
                      }}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium flex items-center gap-2 transition-colors ${
                        currentTrip
                          ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer'
                          : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
                      }`}
                      title={currentTrip ? `Delete ${currentTrip.name}` : 'No active trip to delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Delete Current Trip</span>
                    </button>
                  </div>
                )}

                {/* Danger Zone: Delete Account for signed-in users */}
                {user && (
                  <div className="p-1.5 border-t border-rose-100 dark:border-rose-950/40">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteAccountModal(true);
                        setSettingsOpen(false);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 transition-colors cursor-pointer"
                      title="Permanently delete account and erase all cloud data"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Delete Account & Erase Cloud Data</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Header: Dedicated, uncrowded secondary badge & action row (~390px phone width) */}
      {(isTrialActive || isReferralPlatinumActive || hasPendingReferralCode || onOpenReferral) && (
        <div className="sm:hidden w-full bg-purple-950/95 border-t border-purple-800/40 px-3 py-1.5 flex items-center justify-between gap-2 z-10 relative">
          <div className="flex items-center gap-1.5 min-w-0">
            {isReferralPlatinumActive ? (
              <button
                type="button"
                onClick={() => openPaywall("You have an active 1-Month Free Platinum Referral access! All Platinum features are unlocked.")}
                className="inline-flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white px-2.5 py-1 rounded-full shadow-xs border border-fuchsia-300/40 cursor-pointer min-h-[32px]"
              >
                <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">Referral Platinum · {referralTimeLeftText}</span>
              </button>
            ) : isTrialActive ? (
              <button
                type="button"
                onClick={() => openPaywall("You are on a 7-day Platinum trial with full access. Choose a plan to lock in uninterrupted access.")}
                className="inline-flex items-center gap-1.5 text-[11px] font-black bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 text-white px-2.5 py-1 rounded-full shadow-xs border border-amber-300/40 cursor-pointer min-h-[32px]"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-200 text-amber-200 shrink-0" />
                <span className="truncate">Platinum Trial · {trialTimeLeftText}</span>
              </button>
            ) : hasPendingReferralCode ? (
              <button
                type="button"
                onClick={() => {
                  if (onOpenAccountSync) onOpenAccountSync();
                  else setAccountSyncModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-black bg-gradient-to-r from-amber-500 via-fuchsia-600 to-purple-600 text-white px-2.5 py-1 rounded-full shadow-xs border border-amber-300/50 cursor-pointer min-h-[32px]"
              >
                <Gift className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                <span className="truncate">Claim 1-Mo Platinum</span>
              </button>
            ) : isPro ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-1 rounded-full shadow-xs">
                <Crown className="w-2.5 h-2.5 fill-white" /> {isMasterKey ? 'VIP Master' : tier} Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-300/80">
                100% Free · No Card Needed
              </span>
            )}
          </div>

          {onOpenReferral && (
            <button
              type="button"
              onClick={onOpenReferral}
              className="inline-flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 text-white px-2.5 py-1 rounded-full shadow-xs border border-fuchsia-300/40 cursor-pointer shrink-0 min-h-[32px]"
              title="Refer a Friend · Get 1 Month Free"
            >
              <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Free Month</span>
            </button>
          )}
        </div>
      )}

      {/* Cross-Device Universal Account Sync Modal */}
      <AccountSyncModal
        isOpen={accountSyncModalOpen}
        onClose={() => setAccountSyncModalOpen(false)}
      />

      {/* Settings Delete Trip Confirmation Modal */}
      {tripToDeleteFromSettings && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setTripToDeleteFromSettings(null);
          }}
        >
          <div 
            className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Trip?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {tripToDeleteFromSettings.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 bg-rose-50/60 dark:bg-rose-950/20 p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/40">
              Are you sure you want to delete this trip? All <strong>{tripToDeleteFromSettings.bags.length} bags</strong>, packed items, and departure schedule settings for this trip will be permanently removed. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTripToDeleteFromSettings(null)}
                className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Keep Trip
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTrip(tripToDeleteFromSettings.id);
                  setTripToDeleteFromSettings(null);
                  setSettingsOpen(false);
                }}
                className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/30 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Yes, Delete Trip</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeletingAccount) setShowDeleteAccountModal(false);
          }}
        >
          <div 
            className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Permanently Delete Account?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-2 mb-5">
              <p className="font-bold">
                Warning: This action is permanent and cannot be undone.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-rose-800 dark:text-rose-300">
                <li>All trips and luggage checklists in Cloud Firestore will be permanently erased.</li>
                <li>Your user account profile will be permanently deleted.</li>
                <li>You will be immediately signed out on this device.</li>
              </ul>
            </div>

            {deleteAccountError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-100 dark:bg-rose-950 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {deleteAccountError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setShowDeleteAccountModal(false)}
                className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={async () => {
                  if (!user) return;
                  setIsDeletingAccount(true);
                  setDeleteAccountError(null);
                  try {
                    await deleteUserAccountAndData(user.uid);
                    try {
                      localStorage.removeItem('gateready_trips_data_v2');
                      localStorage.removeItem('gateready_deleted_trip_ids_v1');
                    } catch {}
                    await signOut();
                    setShowDeleteAccountModal(false);
                  } catch (err: any) {
                    console.error('Account deletion error:', err);
                    setDeleteAccountError(err?.message || 'Failed to delete account. Please try again or re-authenticate.');
                  } finally {
                    setIsDeletingAccount(false);
                  }
                }}
                className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isDeletingAccount ? 'Deleting Account...' : 'Permanently Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Bottom glowing neon transit rail line from branding */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-500 shadow-[0_1px_10px_rgba(217,70,239,0.7)] relative z-20" />
    </header>
  );
};
