import React, { useState, useRef, useEffect } from 'react';
import { usePacking } from '../context/PackingContext';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { TravelType } from '../types/travel';
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
  X
} from 'lucide-react';
import { useTravelWallet } from '../context/TravelWalletContext';
import { AccountSyncModal } from './AccountSyncModal';

interface HeaderProps {
  onOpenAddTrip: () => void;
  onOpenAddBag: () => void;
  onOpenTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddTrip, onOpenTour }) => {
  const {
    trips,
    currentTrip,
    selectTrip,
    weightUnit,
    toggleWeightUnit,
    isDarkMode,
    setDarkMode,
    resetAllPacked,
    markAllPacked,
    deleteTrip,
    cloudSyncStatus,
    lastSyncedAt,
    manualSync
  } = usePacking();

  const { user, signIn, signOut, loading: authLoading, error: authError, clearError } = useAuth();
  const { 
    isPro, 
    tier, 
    openPaywall, 
    cancelSubscription, 
    billingCycle, 
    subscriptionExpiresAt,
    manualLicenseKey,
    applyLicenseKey,
    removeLicenseKey
  } = useSubscription();

  const { accounts: walletAccounts, openWalletModal } = useTravelWallet();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [accountSyncModalOpen, setAccountSyncModalOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  // Manual Pro license input state
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseFeedback, setLicenseFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showLicenseField, setShowLicenseField] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSettingsOpen(false);
        setUserMenuOpen(false);
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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-purple-100 dark:border-purple-950/60 shadow-xs transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: App Logo & Brand Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-purple-600/25 text-white shrink-0">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight leading-none">
                Gate Ready
              </span>
              {isPro ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  <Crown className="w-2.5 h-2.5 fill-white" /> Pro
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Free Plan
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Smart Travel Baggage & Packing
            </p>
          </div>
        </div>

        {/* Center / Right: Action Buttons, Upgrade, Sync & Menus */}
        <div className="flex items-center gap-2">
          {/* Pro Upgrade / Badge Button */}
          {!isPro ? (
            <button
              onClick={() => openPaywall("Upgrade to Gate Ready Pro to unlock unlimited travelers (kids, parents, companions) and unlimited bags.")}
              className="h-9 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
              title="Unlock Unlimited Travelers & Bags"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span className="hidden sm:inline">Upgrade</span>
              <span className="text-[10px] bg-amber-400 text-purple-950 font-black px-1.5 py-0.2 rounded-md">PRO</span>
            </button>
          ) : (
            <button
              onClick={() => openPaywall()}
              className="h-9 px-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1 hover:bg-amber-100 transition-colors cursor-pointer"
              title="Gate Ready Pro Active"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="hidden md:inline text-[11px]">Pro Active</span>
            </button>
          )}

          {/* Google Account & Cloud Sync Dropdown */}
          <div className="relative" ref={userRef}>
            {user ? (
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setSettingsOpen(false);
                }}
                className="h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 flex items-center gap-2 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
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
                  <span className="text-[11px] font-bold leading-none truncate max-w-[85px]">
                    {user.displayName?.split(' ')[0] || 'Synced'}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Cloud Sync
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setAccountSyncModalOpen(true)}
                disabled={authLoading}
                className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
                title="Sign in with Google or Email to sync trips across devices"
              >
                <Cloud className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Sync Account</span>
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
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      Account Active
                    </span>
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
                        PRO ({billingCycle})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        Free Plan
                      </span>
                    )}
                  </div>

                  {isPro ? (
                    <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
                      <p className="font-semibold text-amber-950 dark:text-amber-200 text-[11px]">
                        Unlimited Travelers & Bags Active
                      </p>
                      <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                        {billingCycle === 'yearly' ? '$39.99/year' : '$4.99/month'} · Renews automatically
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
                            if (confirm('Cancel Gate Ready Pro subscription? You will return to the Free Plan (1 traveler, max 3 bags).')) {
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
                        Free Plan allows <strong>1 traveler</strong> and up to <strong>3 bags</strong>.
                      </p>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          openPaywall("Upgrade to Gate Ready Pro to pack for your whole family with unlimited bags and travelers.");
                        }}
                        className="w-full h-8 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:from-purple-700 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        <span>Unlock Pro ($4.99/mo or $39.99/yr)</span>
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
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      {cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Real-Time Connected'}
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

          {/* Walkthrough & Guide Video Tour Button */}
          {onOpenTour && (
            <button
              onClick={() => {
                setSettingsOpen(false);
                setUserMenuOpen(false);
                onOpenTour();
              }}
              className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Watch Short Video Walkthrough & Tour"
              aria-label="Watch Walkthrough Video"
            >
              <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Play className="w-3 h-3 fill-white ml-0.5" />
              </div>
              <span className="hidden lg:inline text-xs font-bold">Tour</span>
            </button>
          )}

          {/* Travel Wallet Quick Trigger Button */}
          <button
            onClick={() => {
              setSettingsOpen(false);
              setUserMenuOpen(false);
              openWalletModal();
            }}
            className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Travel Wallet & Loyalty Numbers"
            aria-label="Travel Wallet & Loyalty Numbers"
          >
            <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="hidden md:inline text-xs font-bold">Wallet</span>
            {walletAccounts.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                {walletAccounts.length}
              </span>
            )}
          </button>

          {/* Settings Menu Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setUserMenuOpen(false);
              }}
              className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-purple-900/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Preferences & Actions
                    </p>
                    <p className="text-[11px] text-slate-400">Settings for Gate Ready</p>
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
                        {isPro ? 'Gate Ready Pro' : 'Free Plan'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isPro ? 'Unlimited travelers & bags' : '1 traveler · Max 3 bags'}
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
                          Pro License Key
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {manualLicenseKey ? `Active: ${manualLicenseKey}` : 'Backup / testing license'}
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
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Key: {manualLicenseKey}</span>
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 px-1.5 py-0.2 rounded-md">
                        Pro Active
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
                          placeholder="e.g. GR-Test-2026-1"
                          className="flex-1 h-8 px-2.5 text-xs uppercase tracking-wider font-bold rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                        />
                        <button
                          type="submit"
                          className="h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                        >
                          Apply
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        Test pattern: <code className="text-purple-600 dark:text-purple-400 font-bold">GR-Test-2026-1</code> to <code className="text-purple-600 dark:text-purple-400 font-bold">GR-Test-2026-5</code>
                      </p>
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

                {/* Batch Actions for Current Trip */}
                {currentTrip && (
                  <>
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

                    <div className="p-1.5">
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete the trip "${currentTrip.name}"?`
                            )
                          ) {
                            deleteTrip(currentTrip.id);
                            setSettingsOpen(false);
                          }
                        }}
                        className="w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Delete Current Trip</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Device Universal Account Sync Modal */}
      <AccountSyncModal
        isOpen={accountSyncModalOpen}
        onClose={() => setAccountSyncModalOpen(false)}
      />
    </header>
  );
};
