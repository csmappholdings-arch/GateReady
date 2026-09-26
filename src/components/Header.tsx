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
  Zap
} from 'lucide-react';

interface HeaderProps {
  onOpenAddTrip: () => void;
  onOpenAddBag: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddTrip }) => {
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
  const { isPro, tier, openPaywall, cancelSubscription, billingCycle, subscriptionExpiresAt } = useSubscription();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tripsMenuOpen, setTripsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const tripsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
      if (tripsRef.current && !tripsRef.current.contains(e.target as Node)) {
        setTripsMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
              {currentTrip && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full">
                  <span>{packedPct}% packed</span>
                </span>
              )}
            </div>
            {currentTrip && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[130px] sm:max-w-[200px] font-medium">
                {currentTrip.name}
              </p>
            )}
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

          {/* Trip Selector Dropdown */}
          <div className="relative" ref={tripsRef}>
            <button
              onClick={() => {
                setTripsMenuOpen(!tripsMenuOpen);
                setSettingsOpen(false);
                setUserMenuOpen(false);
              }}
              className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition-colors max-w-[120px] sm:max-w-[200px] cursor-pointer"
              aria-label="Select Trip"
            >
              {getTravelIcon(currentTrip?.travelType)}
              <span className="truncate text-left font-medium">
                {currentTrip ? currentTrip.name : 'Select Trip'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-500 shrink-0 ml-auto" />
            </button>

            {tripsMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-purple-900/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 border-b border-purple-50 dark:border-purple-950/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Your Trips ({trips.length})
                  </span>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-md">
                    {weightUnit}
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto py-1">
                  {trips.map((trip) => {
                    const isSelected = trip.id === currentTrip?.id;
                    const tripItems = trip.bags.reduce((acc, b) => acc + b.items.length, 0);
                    const tripPacked = trip.bags.reduce(
                      (acc, b) => acc + b.items.filter((i) => i.isPacked).length,
                      0
                    );
                    return (
                      <button
                        key={trip.id}
                        onClick={() => {
                          selectTrip(trip);
                          setTripsMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200'
                            : 'hover:bg-purple-50/50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">{getTravelIcon(trip.travelType)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {trip.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            <span>{trip.companyName || trip.travelType}</span>
                            <span>·</span>
                            <span>{trip.bags.length} bags</span>
                            <span>·</span>
                            <span>
                              {tripPacked}/{tripItems} packed
                            </span>
                          </div>
                          {trip.familyMembers && trip.familyMembers.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 mt-1">
                              <Users className="w-3 h-3" />
                              <span>{trip.familyMembers.length} travelers ({trip.familyMembers.join(', ')})</span>
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-2.5 border-t border-purple-50 dark:border-purple-950/60">
                  <button
                    onClick={() => {
                      setTripsMenuOpen(false);
                      onOpenAddTrip();
                    }}
                    className="w-full h-9.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-purple-600/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Trip</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Google Account & Cloud Sync Dropdown */}
          <div className="relative" ref={userRef}>
            {user ? (
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setSettingsOpen(false);
                  setTripsMenuOpen(false);
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
                onClick={() => signIn()}
                disabled={authLoading}
                className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
                title="Sign in with Google to sync trips across devices"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
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
                      Google Account Active
                    </span>
                  </div>
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

          {/* Settings Menu Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setTripsMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-purple-900/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Preferences & Actions
                  </p>
                  <p className="text-[11px] text-slate-400">Settings for Gate Ready</p>
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
    </header>
  );
};
