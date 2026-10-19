import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { PackingProvider, usePacking } from './context/PackingContext';
import { Header } from './components/Header';
import { SaveGateModal } from './components/SaveGateModal';
import { MobileSyncBanner } from './components/MobileSyncBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { BaggageScreen } from './components/BaggageScreen';
import { TripPrepChecklistScreen } from './components/TripPrepChecklistScreen';
import { AllowancesScreen } from './components/AllowancesScreen';
import { GateReadyChecklistScreen } from './components/GateReadyChecklistScreen';
import { CabinIntelScreen } from './components/CabinIntelScreen';
import { TravelWalletModal } from './components/TravelWalletModal';
import { TravelWalletProvider } from './context/TravelWalletContext';
import { AddTripDialog } from './components/AddTripDialog';
import { AddItemDialog } from './components/AddItemDialog';
import { AddBagDialog } from './components/AddBagDialog';
import { TripBanner } from './components/TripBanner';
import { WalkthroughVideoModal } from './components/WalkthroughVideoModal';
import { AccountSyncModal } from './components/AccountSyncModal';
import { TransitNetworkHub } from './components/TransitNetworkHub';
import { LandingHero } from './components/LandingHero';
import { AppFooter } from './components/AppFooter';
import { TrialNudgeBanner } from './components/TrialNudgeBanner';
import { TrialExpiredModal } from './components/TrialExpiredModal';
import { ReferralModal } from './components/ReferralModal';
import { AirlineGuidesModal } from './components/AirlineGuidesModal';
import { TravelType } from './types/travel';
import { 
  CheckCircle2, 
  Info, 
  PlaneTakeoff, 
  Plus, 
  Luggage,
  Users,
  Zap,
  Sparkles,
  CloudSun,
  Crown,
  Play,
  Mail,
  Gift,
  X
} from 'lucide-react';

function PackingAppContent() {
  const { currentTrip, trips, selectedBagId, setSelectedBagId, addTrip, loadDemoTrip } = usePacking();
  const { isPro, canAddTrip, openPaywall, hasPendingReferralCode, clearPendingReferralCode } = useSubscription();
  const { user, resendVerificationEmail } = useAuth();
  const [resentEmailNotice, setResentEmailNotice] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<'Bags' | 'Checklist' | 'CabinIntel' | 'Allowances' | 'GateReady'>('Bags');
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [selectedTravelTypeForAdd, setSelectedTravelTypeForAdd] = useState<TravelType | undefined>(undefined);
  const [selectedDestinationForAdd, setSelectedDestinationForAdd] = useState<string | undefined>(undefined);
  const [addTripKey, setAddTripKey] = useState(0);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddBagModal, setShowAddBagModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountModalOrigin, setAccountModalOrigin] = useState<'save_gate' | 'header' | 'referral' | 'workspace_banner'>('header');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showAirlineGuidesModal, setShowAirlineGuidesModal] = useState(false);
  const [targetBagId, setTargetBagId] = useState<string>('');

  // Feature 1: Save Gate state
  const [showSaveGateModal, setShowSaveGateModal] = useState(false);

  // Track separate browser visits in localStorage
  useEffect(() => {
    const SESSION_VISIT_KEY = 'gateready_session_visit_counted';
    const VISIT_COUNT_KEY = 'gateready_visit_count';
    try {
      if (!sessionStorage.getItem(SESSION_VISIT_KEY)) {
        sessionStorage.setItem(SESSION_VISIT_KEY, 'true');
        const currentVisits = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
        localStorage.setItem(VISIT_COUNT_KEY, String(currentVisits + 1));
      }
    } catch {}
  }, []);

  // Feature 3: Catch anonymous referral parameter from landing URL (?ref=... or ?referral=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref') || params.get('referral');
      if (refCode && refCode.trim()) {
        localStorage.setItem('gateready_referred_by_code', refCode.trim().toUpperCase());
      }
    } catch {}
  }, []);

  // Feature 1: Trigger Save Gate when anonymous user finishes building a trip (trip created with at least 1 bag with at least 1 packed item)
  useEffect(() => {
    // Never show to users who already have an account
    if (user) {
      setShowSaveGateModal(false);
      return;
    }

    // Must have a trip with at least one bag containing at least one packed item
    const hasTripWithPackedItem = Boolean(
      currentTrip &&
      currentTrip.bags &&
      currentTrip.bags.length > 0 &&
      currentTrip.bags.some((b) => b.items && b.items.some((i) => i.isPacked))
    );

    if (!hasTripWithPackedItem) return;

    // Do not show again in that browser session if already dismissed
    const SESSION_DISMISSED_KEY = 'gateready_save_gate_session_dismissed';
    try {
      if (sessionStorage.getItem(SESSION_DISMISSED_KEY) === 'true') {
        return;
      }
    } catch {}

    const DISMISSED_COUNT_KEY = 'gateready_save_gate_dismissed_count';
    const VISIT_COUNT_KEY = 'gateready_visit_count';
    const VISIT_3_SHOWN_KEY = 'gateready_save_gate_visit_3_shown';

    let dismissedCount = 0;
    let visitCount = 1;
    let visit3Shown = false;

    try {
      dismissedCount = parseInt(localStorage.getItem(DISMISSED_COUNT_KEY) || '0', 10);
      visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '1', 10);
      visit3Shown = localStorage.getItem(VISIT_3_SHOWN_KEY) === 'true';
    } catch {}

    // First time an anonymous visitor finishes building a trip: show one-time dialog
    if (dismissedCount === 0) {
      setShowSaveGateModal(true);
      return;
    }

    // Also show it on their 3rd separate visit if they dismissed it and still have no account
    if (dismissedCount === 1 && visitCount >= 3 && !visit3Shown) {
      setShowSaveGateModal(true);
      return;
    }

    // After that, stop asking and rely on the header button
  }, [user, currentTrip]);

  const handleDismissSaveGate = () => {
    setShowSaveGateModal(false);
    try {
      sessionStorage.setItem('gateready_save_gate_session_dismissed', 'true');
      const DISMISSED_COUNT_KEY = 'gateready_save_gate_dismissed_count';
      const current = parseInt(localStorage.getItem(DISMISSED_COUNT_KEY) || '0', 10);
      localStorage.setItem(DISMISSED_COUNT_KEY, String(current + 1));
      const visitCount = parseInt(localStorage.getItem('gateready_visit_count') || '1', 10);
      if (visitCount >= 3) {
        localStorage.setItem('gateready_save_gate_visit_3_shown', 'true');
      }
    } catch {}
  };

  const handleSaveFromSaveGate = () => {
    setShowSaveGateModal(false);
    try {
      sessionStorage.setItem('gateready_save_gate_session_dismissed', 'true');
    } catch {}
    setAccountModalOrigin('save_gate');
    setShowAccountModal(true);
  };

  const handleOpenAddTrip = (travelType?: TravelType, destinationCity?: string) => {
    const safeTravelType = typeof travelType === 'string' ? travelType : undefined;
    const safeDest = typeof destinationCity === 'string' ? destinationCity : undefined;
    const tripCheck = canAddTrip(trips.length);
    if (!tripCheck.allowed) {
      openPaywall(tripCheck.reason);
      return;
    }
    setSelectedTravelTypeForAdd(safeTravelType);
    setSelectedDestinationForAdd(safeDest);
    setAddTripKey((prev) => prev + 1);
    setShowAddTripModal(true);
  };

  const handleOpenAddItem = (bagId: string) => {
    setTargetBagId(bagId);
    setShowAddItemModal(true);
  };

  const currentBag = currentTrip?.bags.find((b) => b.id === (targetBagId || selectedBagId)) || currentTrip?.bags[0];

  const totalBags = currentTrip?.bags.length ?? 0;
  const totalItems = currentTrip?.bags.reduce((acc, b) => acc + b.items.length, 0) ?? 0;
  const packedItems = currentTrip?.bags.reduce((acc, b) => acc + b.items.filter((i) => i.isPacked).length, 0) ?? 0;
  const isAllPacked = totalItems > 0 && packedItems === totalItems;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* 7-Day Platinum Trial Expiry Warning Banner (Days 6-7) */}
      <TrialNudgeBanner />

      {/* Top App Bar with Purple Branding */}
      <Header
        onOpenAddTrip={handleOpenAddTrip}
        onOpenAddBag={() => setShowAddBagModal(true)}
        onOpenTour={() => setShowTourModal(true)}
        onOpenAccountSync={() => {
          setAccountModalOrigin('header');
          setShowAccountModal(true);
        }}
        onOpenReferral={() => setShowReferralModal(true)}
      />

      {/* Pending Referral Link Announcement for Anonymous Visitors */}
      {hasPendingReferralCode && (
        <div className="bg-gradient-to-r from-fuchsia-700 via-purple-700 to-indigo-800 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs flex-wrap relative z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Gift className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-amber-200">
                🎁 Referral Bonus Detected!
              </p>
              <p className="text-purple-100 text-[11px] leading-tight">
                Create an account & sign in to apply your <strong>1 Free Month of Platinum</strong> ($9.99 value). Mandatory to activate.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAccountModalOrigin('referral');
                setShowAccountModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Claim 1-Mo Platinum
            </button>
            <button
              type="button"
              onClick={clearPendingReferralCode}
              className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Dismiss referral offer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Item 10: Non-blocking email verification prompt */}
      {user && !user.emailVerified && user.providerData.some((p) => p.providerId === 'password') && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Please verify your email address (<strong>{user.email}</strong>). We sent a verification link to your inbox.
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await resendVerificationEmail();
                setResentEmailNotice(true);
                setTimeout(() => setResentEmailNotice(false), 5000);
              } catch {}
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors cursor-pointer shrink-0"
          >
            {resentEmailNotice ? 'Verification link sent!' : 'Resend link'}
          </button>
        </div>
      )}

      {/* Sync with Google prompt banner when signed out */}
      <MobileSyncBanner onOpenAccountModal={() => {
        setAccountModalOrigin('header');
        setShowAccountModal(true);
      }} />

      {/* Prominent Navigation Tabs (Desktop & Tablet) - Moved to TOP of section */}
      {currentTrip && (
        <div className="hidden sm:block sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-2.5 pb-2 border-b border-purple-100/80 dark:border-purple-950/60 shadow-xs">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
            <nav
              aria-label="Main application tabs"
              className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/80 shadow-md flex items-center justify-between gap-1 sm:gap-2.5"
            >
              {/* Tab 1: Bags & Items */}
              <button
                type="button"
                onClick={() => setCurrentScreen('Bags')}
                className={`flex-1 min-w-0 h-10 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-[13px] font-black transition-all cursor-pointer whitespace-nowrap ${
                  currentScreen === 'Bags'
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                }`}
              >
                <Luggage className="w-4 h-4 shrink-0" />
                <span className="truncate">Luggage & Packing Manifest</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                    currentScreen === 'Bags'
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  {totalBags} {totalBags === 1 ? 'Bag' : 'Bags'}
                </span>
              </button>

              {/* Tab 2: Trip Intel & Checklists (Pro) */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) {
                    openPaywall("Upgrade to Silver, Gold, or Platinum to unlock full Trip Intel & Terminal Maps.");
                  }
                  setCurrentScreen('Checklist');
                }}
                className={`flex-1 min-w-0 h-10 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-[13px] font-black transition-all cursor-pointer whitespace-nowrap ${
                  currentScreen === 'Checklist'
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                }`}
              >
                <CloudSun className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="truncate">Airport & Trip Intel</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs shrink-0">
                  <Crown className="w-2.5 h-2.5 fill-purple-950" /> Silver+
                </span>
              </button>

              {/* Tab 3: Cabin & Plugs (Silver+) */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) {
                    openPaywall("Upgrade to Silver, Gold, or Platinum to unlock Aircraft Cabin & In-Seat Plugs Intel.");
                  }
                  setCurrentScreen('CabinIntel');
                }}
                className={`flex-1 min-w-0 h-10 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-[13px] font-black transition-all cursor-pointer whitespace-nowrap ${
                  currentScreen === 'CabinIntel'
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Aircraft Cabin & In-Seat Power</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs shrink-0">
                  <Crown className="w-2.5 h-2.5 fill-purple-950" /> Silver+
                </span>
              </button>

              {/* Tab 4: Allowances */}
              <button
                type="button"
                onClick={() => setCurrentScreen('Allowances')}
                className={`flex-1 min-w-0 h-10 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-[13px] font-black transition-all cursor-pointer whitespace-nowrap ${
                  currentScreen === 'Allowances'
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                }`}
              >
                <Info className="w-4 h-4 shrink-0" />
                <span className="truncate">42+ Airline Allowances</span>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                    currentScreen === 'Allowances'
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  Rules
                </span>
              </button>

              {/* Tab 5: Gate Ready */}
              <button
                type="button"
                onClick={() => setCurrentScreen('GateReady')}
                className={`flex-1 min-w-0 h-10 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-[13px] font-black transition-all cursor-pointer whitespace-nowrap ${
                  currentScreen === 'GateReady'
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                }`}
              >
                <PlaneTakeoff className="w-4 h-4 shrink-0" />
                <span className="truncate">Gate Clearance Checklist</span>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                    isAllPacked
                      ? 'bg-emerald-500 text-white'
                      : currentScreen === 'GateReady'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isAllPacked ? 'Ready' : 'Check'}
                </span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Prominent Condensed Trip Information Banner with Location, Carrier, Seat Level & Dropdown */}
      <TripBanner
        currentTrip={currentTrip}
        onOpenAddTrip={handleOpenAddTrip}
        onOpenAccountSync={() => {
          setAccountModalOrigin('workspace_banner');
          setShowAccountModal(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-20 sm:pb-12 relative overflow-x-hidden">
        {/* Overall Ambient Blueprint Grid for main page */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 dark:opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        {currentTrip == null ? (
          <div className="flex flex-col">
            {/* Conversion Marketing Hero (Above the trip creator) */}
            <LandingHero
              onOpenAddTrip={() => handleOpenAddTrip()}
              onLoadDemo={loadDemoTrip}
              onOpenPricing={() => openPaywall()}
              onOpenAirlineGuides={() => setShowAirlineGuidesModal(true)}
              onOpenAccountSync={() => {
                setAccountModalOrigin('header');
                setShowAccountModal(true);
              }}
            />

            {/* Immediately usable trip creator directly below */}
            <TransitNetworkHub
              onOpenAddTrip={handleOpenAddTrip}
              onOpenTour={() => setShowTourModal(true)}
              onLoadDemo={loadDemoTrip}
            />
          </div>
        ) : (
          <>
            {/* Screen Router */}
            {currentScreen === 'Bags' && (
              <BaggageScreen
                trip={currentTrip}
                onOpenAddBag={() => setShowAddBagModal(true)}
                onOpenReferral={() => setShowReferralModal(true)}
              />
            )}

            {currentScreen === 'Checklist' && (
              <TripPrepChecklistScreen
                trip={currentTrip}
              />
            )}

            {currentScreen === 'CabinIntel' && (
              <CabinIntelScreen trip={currentTrip} />
            )}

            {currentScreen === 'Allowances' && (
              <AllowancesScreen trip={currentTrip} />
            )}

            {currentScreen === 'GateReady' && (
              <GateReadyChecklistScreen trip={currentTrip} />
            )}
          </>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (5 Prominent Tabs) - only when a trip exists */}
      {currentTrip != null && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-purple-200/80 dark:border-purple-900/80 pb-safe shadow-xl">
          <div className="grid grid-cols-5 items-center h-16 px-1">
            {/* Mobile Tab 1: Bags & Items */}
            <button
              onClick={() => setCurrentScreen('Bags')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer relative ${
                currentScreen === 'Bags'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'Bags' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <Luggage className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Bags</span>
              {totalBags > 0 && (
                <span className="absolute top-1 right-2 text-[9px] font-extrabold px-1 rounded-full bg-purple-600 text-white">
                  {totalBags}
                </span>
              )}
            </button>

            {/* Mobile Tab 2: Trip Intel & Checklists */}
            <button
              onClick={() => {
                if (!isPro) {
                  openPaywall("Upgrade to Silver, Gold, or Platinum to unlock full Trip Intel & Terminal Maps.");
                }
                setCurrentScreen('Checklist');
              }}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer relative ${
                currentScreen === 'Checklist'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'Checklist' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <CloudSun className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Intel</span>
              <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500 absolute top-1 right-2" />
            </button>

            {/* Mobile Tab 3: Plugs & Bins */}
            <button
              onClick={() => {
                if (!isPro) {
                  openPaywall("Upgrade to Silver, Gold, or Platinum to unlock Aircraft Cabin & In-Seat Plugs Intel.");
                }
                setCurrentScreen('CabinIntel');
              }}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer relative ${
                currentScreen === 'CabinIntel'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'CabinIntel' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Plugs</span>
              <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500 absolute top-1 right-2" />
            </button>

            {/* Mobile Tab 4: Allowances */}
            <button
              onClick={() => setCurrentScreen('Allowances')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer ${
                currentScreen === 'Allowances'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'Allowances' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <Info className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Limits</span>
            </button>

            {/* Mobile Tab 5: Gate Ready */}
            <button
              onClick={() => setCurrentScreen('GateReady')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer ${
                currentScreen === 'GateReady'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'GateReady' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <PlaneTakeoff className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Gate Ready</span>
            </button>
          </div>
        </nav>
      )}

      {/* Modals */}
      <AddTripDialog
        key={addTripKey}
        isOpen={showAddTripModal}
        onClose={() => setShowAddTripModal(false)}
        initialTravelType={selectedTravelTypeForAdd}
        initialDestinationCity={selectedDestinationForAdd}
      />

      {showAddItemModal && currentTrip && currentBag && (
        <AddItemDialog
          isOpen={showAddItemModal}
          bag={currentBag}
          trip={currentTrip}
          onClose={() => setShowAddItemModal(false)}
        />
      )}

      {showAddBagModal && currentTrip && (
        <AddBagDialog
          isOpen={showAddBagModal}
          trip={currentTrip}
          onClose={() => setShowAddBagModal(false)}
        />
      )}

      {/* Interactive Video Tour & Walkthrough Guide Modal */}
      <WalkthroughVideoModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        onOpenTripDialog={handleOpenAddTrip}
      />

      {/* Universal Cross-Device Account Sync Modal */}
      <AccountSyncModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        origin={accountModalOrigin}
      />

      {/* Feature 1: First-run & 3rd Visit Save Gate Modal */}
      <SaveGateModal
        isOpen={showSaveGateModal}
        trip={currentTrip}
        onSave={handleSaveFromSaveGate}
        onDismiss={handleDismissSaveGate}
      />

      {/* 7-Day Platinum Trial Graceful Downgrade Modal */}
      <TrialExpiredModal />

      {/* Collaborative Referral Program Modal */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        onOpenAccountSync={() => {
          setAccountModalOrigin('referral');
          setShowAccountModal(true);
        }}
      />

      {/* 42+ Airline Allowance Intel Directory Modal */}
      <AirlineGuidesModal
        isOpen={showAirlineGuidesModal}
        onClose={() => setShowAirlineGuidesModal(false)}
        onSelectAirline={(name) => handleOpenAddTrip('PLANE', name)}
      />

      {/* Conversion Marketing & Navigation Footer */}
      <AppFooter
        onOpenPricing={() => openPaywall()}
        onOpenReferral={() => setShowReferralModal(true)}
        onOpenAirlineGuides={() => setShowAirlineGuidesModal(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <TravelWalletProvider>
          <PackingProvider>
            <PackingAppContent />
            <SubscriptionModal />
            <TravelWalletModal />
          </PackingProvider>
        </TravelWalletProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
