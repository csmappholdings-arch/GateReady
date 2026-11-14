import React, { useState, useMemo } from 'react';
import { 
  Trip, 
  Bag, 
  TravelType 
} from '../types/travel';
import { 
  Plane, 
  Train, 
  Car, 
  Ship, 
  Bus, 
  Calendar, 
  Clock, 
  Luggage, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Archive, 
  FileCheck, 
  Scale, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  ExternalLink,
  Flame,
  ChevronDown,
  Layers,
  Compass,
  Wallet,
  Calculator,
  Crown,
  FileText,
  AlertTriangle,
  RotateCcw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { TRIAL_CTA_LABEL, TRIAL_TERMS_EXACT } from '../data/planEntitlements';
import { usePacking } from '../context/PackingContext';
import { useTravelWallet } from '../context/TravelWalletContext';
import { calculateTravelReadinessScore } from '../utils/readinessScore';
import { computeBagWeightStatus } from '../utils/bagWeightAnalysis';
import { computeDepartureCountdown } from '../utils/countdown';
import { trackEvent } from '../utils/analytics';

interface TravelDashboardProps {
  trips: Trip[];
  onOpenTripWorkspace: (trip: Trip, initialTab?: string) => void;
  onOpenNewTripModal: () => void;
  onDeleteTrip: (tripId: string) => Promise<void>;
  onOpenLuggageLibrary: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onOpenOnboarding?: () => void;
  onLoadDemoTrip?: () => void;
}

export const TravelDashboard: React.FC<TravelDashboardProps> = ({
  trips,
  onOpenTripWorkspace,
  onOpenNewTripModal,
  onDeleteTrip,
  onOpenLuggageLibrary,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenOnboarding,
  onLoadDemoTrip
}) => {
  const { user } = useAuth();
  const { 
    tier, 
    isPro, 
    openPaywall, 
    isTrialActive, 
    trialTimeLeftText,
    isReferralPlatinumActive,
    referralTimeLeftText
  } = useSubscription();
  const { clearDemoData, weightUnit } = usePacking();
  const { openWalletModal, accounts: walletAccounts } = useTravelWallet();

  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [showPastTrips, setShowPastTrips] = useState(false);
  const [clearingDemo, setClearingDemo] = useState(false);

  // Classify trips into upcoming vs past
  const now = new Date();

  const { upcomingTrips, pastTrips, hasDemoTrip } = useMemo(() => {
    const upcoming: { trip: Trip; daysRemaining: number; isToday: boolean; isTomorrow: boolean; formattedCountdown: string }[] = [];
    const past: { trip: Trip; daysPassed: number }[] = [];
    let foundDemo = false;

    trips.forEach((trip) => {
      if (trip.isDemo || trip.id.startsWith('trip-demo-') || trip.name.includes('Paris & London')) {
        foundDemo = true;
      }

      if (trip.isArchived) {
        past.push({ trip, daysPassed: 999 });
        return;
      }

      if (!trip.departureDate) {
        upcoming.push({ 
          trip, 
          daysRemaining: 999, 
          isToday: false, 
          isTomorrow: false,
          formattedCountdown: 'Draft Trip' 
        });
        return;
      }

      const countdown = computeDepartureCountdown(trip.departureDate, trip.departureTime);

      if (countdown.isPast) {
        past.push({ trip, daysPassed: Math.abs(countdown.daysRemaining) });
      } else {
        upcoming.push({ 
          trip, 
          daysRemaining: Math.max(0, countdown.daysRemaining), 
          isToday: countdown.isToday, 
          isTomorrow: countdown.isTomorrow,
          formattedCountdown: countdown.formattedCountdown
        });
      }
    });

    upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);
    past.sort((a, b) => a.daysPassed - b.daysPassed);

    return { upcomingTrips: upcoming, pastTrips: past, hasDemoTrip: foundDemo };
  }, [trips]);

  const primaryTripItem = upcomingTrips[0];
  const primaryTrip = primaryTripItem?.trip;
  const primaryScore = primaryTrip ? calculateTravelReadinessScore(primaryTrip) : null;

  // Single truth for weight compliance across the primary trip
  const primaryTripWeightStatus = useMemo(() => {
    if (!primaryTrip) return null;
    let maxOverweightLbs = 0;
    let overweightBagCount = 0;
    let nearLimitCount = 0;

    primaryTrip.bags.forEach((bag) => {
      const status = computeBagWeightStatus(bag, weightUnit, primaryTrip.companyName, primaryTrip.travelType);
      if (status.isOverweight) {
        overweightBagCount++;
        const over = status.overweightAmountLbs;
        if (over > maxOverweightLbs) maxOverweightLbs = over;
      } else if (status.isNearLimit) {
        nearLimitCount++;
      }
    });

    return {
      isOverweight: overweightBagCount > 0,
      overweightCount: overweightBagCount,
      maxOverweightAmount: Math.round(maxOverweightLbs * 10) / 10,
      isNearLimit: nearLimitCount > 0,
      allCompliant: overweightBagCount === 0 && nearLimitCount === 0
    };
  }, [primaryTrip, weightUnit]);

  // Check if user is a first-time visitor with no trips or only demo data
  const hasOnlyDemoOrNoTrips = trips.length === 0 || (trips.length === 1 && hasDemoTrip);

  const handleClearDemo = () => {
    setClearingDemo(true);
    clearDemoData();
    setTimeout(() => setClearingDemo(false), 300);
  };

  const handleQuickCardClick = (feature: string, pathOrAction: (() => void) | string) => {
    trackEvent('dashboard_feature_clicked', { feature });
    if (typeof pathOrAction === 'function') {
      pathOrAction();
    } else {
      window.location.href = pathOrAction;
    }
  };

  const getModeIcon = (type: TravelType) => {
    switch (type) {
      case 'TRAIN': return <Train className="w-4 h-4" />;
      case 'CAR': return <Car className="w-4 h-4" />;
      case 'CRUISE': return <Ship className="w-4 h-4" />;
      case 'BUS': return <Bus className="w-4 h-4" />;
      default: return <Plane className="w-4 h-4" />;
    }
  };

  // Plan limits vs usage
  const activeTripsCount = upcomingTrips.length;
  const totalBagsCount = trips.reduce((acc, t) => acc + t.bags.length, 0);
  const totalTravelersCount = primaryTrip?.familyMembers?.length || 1;

  const planLimits = {
    FREE: { travelers: 1, activeTrips: 1, bags: 2, label: 'Free Plan', nextUpgrade: 'Silver ($1.99/mo)' },
    SILVER: { travelers: 1, activeTrips: 2, bags: 999, label: 'Silver Plan', nextUpgrade: 'Gold ($3.99/mo)' },
    GOLD: { travelers: 2, activeTrips: 999, bags: 999, label: 'Gold Plan (Most Popular)', nextUpgrade: 'Platinum ($4.99/mo)' },
    PLATINUM: { travelers: 999, activeTrips: 999, bags: 999, label: 'Platinum All-Inclusive', nextUpgrade: null }
  }[tier] || { travelers: 1, activeTrips: 1, bags: 2, label: 'Free Plan', nextUpgrade: 'Silver ($1.99/mo)' };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* ================= 1. WELCOME SECTION ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-800/40">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-purple-200 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Travel Command Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            {!hasOnlyDemoOrNoTrips
              ? `Welcome Back to GateReady${user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!`
              : `Welcome to GateReady${user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!`}
          </h1>

          <p className="text-sm sm:text-base text-purple-100/90 font-medium leading-relaxed">
            Let&apos;s get your next trip ready. Track airline baggage limits, deduct empty suitcase tare weight, and monitor departure readiness.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onOpenNewTripModal}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create My Next Trip</span>
            </button>

            <button
              type="button"
              onClick={onOpenLuggageLibrary}
              className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-colors cursor-pointer border border-white/20"
            >
              <Luggage className="w-4 h-4 text-purple-200" />
              <span>Luggage Library</span>
            </button>

            {onOpenOnboarding && (
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="h-10 px-3.5 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Onboarding Guide</span>
              </button>
            )}

            {hasDemoTrip && (
              <button
                type="button"
                onClick={handleClearDemo}
                disabled={clearingDemo}
                className="h-10 px-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-400/30"
                title="Remove sample demo trip and demo suitcases"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${clearingDemo ? 'animate-spin' : ''}`} />
                <span>Clear Demo Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlight Widget: Next Flight Readiness or Empty State */}
        {primaryTrip && primaryScore ? (
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 w-full md:w-80 space-y-3 relative z-10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black uppercase tracking-wider text-purple-200 text-[10px] flex items-center gap-1">
                <span>Next Departure</span>
                {primaryTrip.isDemo && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-purple-950 font-black text-[9px]">
                    DEMO
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${primaryScore.statusColor}`}>
                {primaryScore.statusLabel}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                {primaryScore.totalScore}
              </span>
              <span className="text-sm font-semibold text-purple-200">/ 100 PTS</span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  primaryScore.totalScore >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${primaryScore.totalScore}%` }}
              />
            </div>

            <div className="text-[11px] text-purple-100 flex items-center justify-between">
              <span className="truncate">{primaryTrip.originCity || 'Origin'} → {primaryTrip.destinationCity || primaryTrip.name}</span>
              <button
                type="button"
                onClick={() => onOpenTripWorkspace(primaryTrip, 'Overview')}
                className="font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
              >
                <span>Manage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 w-full md:w-80 space-y-3 text-center relative z-10">
            <Compass className="w-8 h-8 text-amber-300 mx-auto" />
            <div className="text-xs font-bold text-white">No Upcoming Trips Planned</div>
            <p className="text-[11px] text-purple-200">
              Create your first trip to unlock baggage fee calculations and packing checklists.
            </p>
            <button
              type="button"
              onClick={onOpenNewTripModal}
              className="w-full h-8 rounded-lg bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create My First Trip</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= 2. SUBSCRIPTION & PLAN CARD (THE ONE PLACE USER SEES PLAN) ================= */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Your Subscription Plan</span>
              <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{planLimits.label}</span>
              </span>

              {isTrialActive && (
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>⏳ 7-Day Platinum Trial · {trialTimeLeftText}</span>
                </span>
              )}

              {isReferralPlatinumActive && (
                <span className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-50 dark:bg-fuchsia-950/60 border border-fuchsia-200 dark:border-fuchsia-800 px-2.5 py-0.5 rounded-full">
                  🎁 Referral Platinum · {referralTimeLeftText}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1 flex-wrap">
              <span>
                <strong>Travelers:</strong> {totalTravelersCount} / {planLimits.travelers === 999 ? 'Unlimited' : planLimits.travelers}
              </span>
              <span>·</span>
              <span>
                <strong>Active Trips:</strong> {activeTripsCount} / {planLimits.activeTrips === 999 ? 'Unlimited' : planLimits.activeTrips}
              </span>
              <span>·</span>
              <span>
                <strong>Bags Allowed:</strong> {totalBagsCount} / {planLimits.bags === 999 ? 'Unlimited' : `${planLimits.bags} max`}
              </span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Multi-Device Cloud Sync Included
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {planLimits.nextUpgrade ? (
              <button
                type="button"
                onClick={() => {
                  trackEvent('premium_feature_clicked', { feature: 'plan_card_upgrade', target_tier: planLimits.nextUpgrade });
                  trackEvent('upgrade_button_clicked', { source: 'dashboard_plan_card' });
                  openPaywall(
                    tier === 'FREE'
                      ? `Free plan includes 1 active trip and 2 bags. ${TRIAL_CTA_LABEL} — ${TRIAL_TERMS_EXACT}`
                      : `Upgrade to ${planLimits.nextUpgrade} for more active trips and companion luggage sharing.`
                  );
                }}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>{tier === 'FREE' ? 'Try 7 days free' : `Upgrade: ${planLimits.nextUpgrade}`}</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1.5 rounded-xl border border-indigo-200">
                VIP Platinum Active
              </span>
            )}
            <a
              href="/pricing"
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center transition-colors cursor-pointer"
            >
              View All Plans
            </a>
          </div>
        </div>
      </section>

      {/* ================= 3. QUICK ACCESS FEATURE CARDS (SECTION 3 & 5) ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Quick Travel Tools
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate access to GateReady&apos;s real luggage calculators and travel tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Baggage Fee Calculator */}
          <div 
            onClick={() => handleQuickCardClick('baggage_fee_calculator', '/baggage-fee-calculator')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Baggage Fee Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Calculate carry-on and checked luggage fees across 42+ airlines by fare family (Basic Economy, Standard, Flex).
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
              <span>Open Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: 42+ Airline Baggage Guides */}
          <div 
            onClick={() => handleQuickCardClick('airline_guides', '/airlines')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                42+ Airline Baggage Guides
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Check published carry-on sizer box dimensions, weight caps, and baggage tariffs verified continuously.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
              <span>Browse Airline Guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Smart Luggage Library */}
          <div 
            onClick={() => handleQuickCardClick('luggage_library', onOpenLuggageLibrary)}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Luggage className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Luggage Library & Tare Scales
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Subtract empty suitcase tare weight (5.5–7.0 lbs carry-on, 8.5–10.5 lbs checked) and calibrate your bags before packing.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
              <span>Manage Luggage Profiles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Travel Wallet & PNR Storage */}
          <div 
            onClick={() => handleQuickCardClick('travel_wallet', openWalletModal)}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Travel Wallet & PNRs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Store airline reservation codes, frequent flyer accounts, and passport expiry alerts offline.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
              <span>Open Travel Wallet ({walletAccounts.length} saved)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 5: Carry-on & Entry Checker */}
          <div 
            onClick={() => handleQuickCardClick('entry_requirements', '/entry-requirements')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Carry-On & Entry Quick-Check
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Check 6-month passport validity buffers, electronic travel authorizations, and CATSA/TSA liquids rules.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
              <span>Check Requirements</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 6: Packing & Departure Readiness */}
          <div 
            onClick={() => {
              if (primaryTrip) {
                handleQuickCardClick('packing_workspace', () => onOpenTripWorkspace(primaryTrip, 'Checklist'));
              } else {
                onOpenNewTripModal();
              }
            }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Packing & Departure Checklist
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Customized checklists organized by traveler and suitcase with tare weight subtraction and bag rebalancing.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
              <span>{primaryTrip ? 'Open Active Checklist' : 'Create Trip to Start Checklist'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* ================= 4. UPCOMING TRIPS & TRAVEL READINESS ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Your Upcoming Travel</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {upcomingTrips.length} {upcomingTrips.length === 1 ? 'Trip' : 'Trips'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a trip to enter the dedicated preparation workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewTripModal}
            className="h-8.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Trip</span>
          </button>
        </div>

        {/* Empty State for No Trips (Section 7) */}
        {upcomingTrips.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 bg-white dark:bg-slate-900">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                No Trips Yet — Ready for Your Next Adventure?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create your first trip to start organizing your travel plans, deducting empty suitcase tare, and checking published airline baggage limits.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
              <button
                type="button"
                onClick={onOpenNewTripModal}
                className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create My First Trip</span>
              </button>
              {onLoadDemoTrip && (
                <button
                  type="button"
                  onClick={onLoadDemoTrip}
                  className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  or load sample trip →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingTrips.map(({ trip, daysRemaining, isToday, isTomorrow, formattedCountdown }) => {
              const score = calculateTravelReadinessScore(trip);
              const allItems = trip.bags.flatMap((b) => b.items);
              const totalItems = allItems.length;
              const packedItems = allItems.filter((i) => i.isPacked).length;
              const packingPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
              const travelersCount = trip.familyMembers?.length || 1;
              const bagsCount = trip.bags.length;

              // Check weight status
              let hasOverweight = false;
              let hasApproaching = false;
              trip.bags.forEach((bag) => {
                const status = computeBagWeightStatus(bag, weightUnit, trip.companyName, trip.travelType);
                if (status.isOverweight) hasOverweight = true;
                else if (status.isNearLimit) hasApproaching = true;
              });

              return (
                <div
                  key={trip.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Route & Single Countdown Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                          {getModeIcon(trip.travelType)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base text-slate-900 dark:text-white truncate">
                              {trip.originCity || 'Origin'} → {trip.destinationCity || trip.name}
                            </h3>
                            {trip.isDemo && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-purple-950 font-black text-[9px] shrink-0">
                                DEMO
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-purple-700 dark:text-purple-400">{trip.companyName}</span>
                            {trip.flightNumber && <span>· {trip.flightNumber}</span>}
                            {trip.fareFamily && <span>· {trip.fareFamily}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Travel Countdown Badge (Single Truth) */}
                      <div className="text-right shrink-0">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-2xs ${
                          isToday 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : isTomorrow 
                              ? 'bg-amber-500 text-purple-950 font-black' 
                              : daysRemaining <= 7
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                                : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>
                            {formattedCountdown}
                          </span>
                        </span>
                        {trip.departureDate && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            {trip.departureDate} {trip.departureTime ? `at ${trip.departureTime}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar & Readiness Gauge */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>Packing Progress: {totalItems > 0 ? `${packedItems} of ${totalItems} items (${packingPercent}%)` : 'No items added yet'}</span>
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">
                          Score: {score.totalScore}/100
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            packingPercent === 100 ? 'bg-emerald-500' : 'bg-purple-600'
                          }`}
                          style={{ width: `${packingPercent}%` }}
                        />
                      </div>

                      {/* Reconciled Weight & Travelers Meta */}
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300 flex-wrap">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Users className="w-3 h-3 text-purple-600" />
                          {travelersCount} {travelersCount === 1 ? 'Traveler' : 'Travelers'}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Luggage className="w-3 h-3 text-purple-600" />
                          {bagsCount} {bagsCount === 1 ? 'Suitcase' : 'Suitcases'}
                        </span>
                        <span>·</span>
                        {hasOverweight ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                            <AlertCircle className="w-3 h-3" /> Exceeds Weight Limit
                          </span>
                        ) : hasApproaching ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                            <AlertCircle className="w-3 h-3" /> Approaching Limit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Check className="w-3 h-3" /> All Bags Within Limits
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenTripWorkspace(trip, 'Checklist')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
                      >
                        Checklist
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenTripWorkspace(trip, 'Luggage')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
                      >
                        Luggage ({trip.bags.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenTripWorkspace(trip, 'AirlineRules')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
                      >
                        Allowances
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTripToDelete(trip)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenTripWorkspace(trip, 'Overview')}
                        className="h-8.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= 5. RECOMMENDED NEXT ACTIONS ================= */}
      {primaryTrip && primaryScore && primaryScore.recommendedNextActions.length > 0 && (
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Recommended Next Actions for {primaryTrip.name}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Complete these high-priority steps to raise your Travel Readiness Score to 100%.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              {primaryScore.recommendedNextActions.length} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {primaryScore.recommendedNextActions.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onOpenTripWorkspace(primaryTrip, rec.targetTab)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 bg-slate-50/50 dark:bg-slate-850 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.2 rounded ${
                      rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-600 transition-colors">
                      {rec.targetTab}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>{rec.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 6. PAST & COMPLETED TRIPS ARCHIVE ================= */}
      {pastTrips.length > 0 && (
        <section className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setShowPastTrips(!showPastTrips)}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showPastTrips ? 'rotate-180' : ''}`} />
            <span>Past Departed Trips ({pastTrips.length})</span>
          </button>

          {showPastTrips && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pastTrips.map(({ trip, daysPassed }) => (
                <div
                  key={trip.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs space-y-2 opacity-85 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {trip.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Departed {trip.departureDate || 'past'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {trip.companyName} · {trip.bags.length} bags · {trip.bags.flatMap((b) => b.items).length} items
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onOpenTripWorkspace(trip, 'Overview')}
                      className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                    >
                      View Trip Record
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripToDelete(trip)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900 p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Delete &ldquo;{tripToDelete.name}&rdquo;?
                </h3>
                <p className="text-[11px] text-slate-500">
                  This trip contains {tripToDelete.bags.length} bags and {tripToDelete.bags.flatMap((b) => b.items).length} packed items.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete this trip? All baggage tare settings, packed items, and travel document checks for this trip will be removed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTripToDelete(null)}
                className="h-9 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = tripToDelete.id;
                  setTripToDelete(null);
                  await onDeleteTrip(id);
                }}
                className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
