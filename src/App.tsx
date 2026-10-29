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
import { LandingQuickCheckers } from './components/LandingQuickCheckers';
import { FreeLimitCheckerModal } from './components/FreeLimitCheckerModal';
import { AdPlacement } from './components/AdPlacement';
import { TravelType, BagType, BagMaterial, getUserPresetWeightLbs } from './types/travel';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CookiesPage } from './pages/CookiesPage';
import { RefundsPage } from './pages/RefundsPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { SecurityPage } from './pages/SecurityPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AirlineGuidePage } from './pages/AirlineGuidePage';
import { AirlineIndexPage } from './pages/AirlineIndexPage';
import { BaggageFeeCalculatorPage } from './pages/BaggageFeeCalculatorPage';
import { TareWeightPage } from './pages/TareWeightPage';
import { EntryRequirementsPage } from './pages/EntryRequirementsPage';
import { 
  CheckCircle2, 
  Info, 
  PlaneTakeoff, 
  Train,
  Car,
  Ship,
  Bus,
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
  const [addTripPreFill, setAddTripPreFill] = useState<{
    carrier?: string;
    seatClass?: string;
    bags?: Array<{
      type: BagType;
      label: string;
      assignedTo?: string;
      material?: BagMaterial;
      emptyBagWeightLbs?: number;
    }>;
  } | null>(null);
  const [addTripKey, setAddTripKey] = useState(0);
  const [pendingCheckerConfig, setPendingCheckerConfig] = useState<{
    carrier: string;
    seatClass: string;
    checkedCount: number;
    carryOnCount: number;
  } | null>(null);
  const [tripNotice, setTripNotice] = useState<{ tripId: string; message: string } | null>(null);
  const [dismissedNoticeTripIds, setDismissedNoticeTripIds] = useState<Set<string>>(new Set());
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

      // Feature: Allow deep links from Airline Guides or Standalone Calculator to start a trip
      if (params.get('action') === 'new_trip') {
        const mode = (params.get('mode') as TravelType) || 'PLANE';
        const carrier = params.get('carrier') || undefined;
        setSelectedTravelTypeForAdd(mode);
        if (carrier) {
          setAddTripPreFill({ carrier });
        }
        setAddTripKey((prev) => prev + 1);
        setShowAddTripModal(true);
        // Clean query parameters so modal dismissal doesn't re-trigger
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch {}
  }, []);

  // Listen for open referral modal events from Pricing dialog or Header
  useEffect(() => {
    const handleOpenReferralEvent = () => setShowReferralModal(true);
    window.addEventListener('gateready:open-referral', handleOpenReferralEvent);
    return () => window.removeEventListener('gateready:open-referral', handleOpenReferralEvent);
  }, []);

  const totalBags = currentTrip?.bags.length ?? 0;
  const totalItems = currentTrip?.bags.reduce((acc, b) => acc + b.items.length, 0) ?? 0;
  const packedItems = currentTrip?.bags.reduce((acc, b) => acc + b.items.filter((i) => i.isPacked).length, 0) ?? 0;
  const isAllPacked = totalItems > 0 && packedItems === totalItems;

  const currentTravelType: TravelType = currentTrip?.travelType || 'PLANE';
  const isFlight = (currentTravelType === 'PLANE' || !currentTravelType) && !['CAR', 'TRAIN', 'CRUISE', 'BUS'].includes(currentTravelType || '');
  const isCar = currentTravelType === 'CAR';
  const isTrain = currentTravelType === 'TRAIN';
  const isCruise = currentTravelType === 'CRUISE';
  const isBus = currentTravelType === 'BUS';

  const tab1Title = isCar ? 'Luggage & Trunk Manifest' : 'Luggage & Packing Manifest';
  const tab2Title = isTrain ? 'Station & Rail Intel' : isBus ? 'Terminal & Bus Intel' : isCruise ? 'Port & Cruise Intel' : isCar ? 'Route & Road Trip Intel' : 'Airport & Trip Intel';
  const tab3Title = isTrain ? 'Train Coach & In-Seat Power' : isBus ? 'Bus Seating & Amenities' : isCruise ? 'Stateroom & Ship Amenities' : isCar ? 'Vehicle Cargo & 12V Power' : 'Aircraft Cabin & In-Seat Power';
  const tab4Title = isTrain ? 'Rail Baggage Guidelines' : isBus ? 'Bus Luggage Guidelines' : isCruise ? 'Cruise Baggage Policies' : isCar ? 'Road Trip Packing Guide' : '42+ Airline Allowances';
  const tab5Title = isTrain ? 'Train Departure Checklist' : isBus ? 'Bus Departure Checklist' : isCruise ? 'Embarkation Checklist' : isCar ? 'Road Departure Checklist' : 'Gate Clearance Checklist';

  const tab5MobileLabel = isCruise ? 'Embark' : isFlight ? 'Gate Ready' : 'Departure';
  const Tab5IconComponent = isTrain ? Train : isBus ? Bus : isCruise ? Ship : isCar ? Car : PlaneTakeoff;

  // Cleanup legacy localStorage key so it never permanently blocks session save gate
  useEffect(() => {
    try {
      localStorage.removeItem('gateready_organic_save_gate_dismissed');
    } catch {}
  }, []);

  // Fix 1: Plan-limit notice must die with its trip. Deleting a trip clears its notice immediately.
  useEffect(() => {
    if (tripNotice) {
      const tripStillExists = trips.some((t) => t.id === tripNotice.tripId);
      if (!tripStillExists) {
        setTripNotice(null);
      }
    }
  }, [trips, tripNotice]);

  // Fix 1: Trigger Save Gate once per session when anonymous user builds a real list (e.g. 3rd item added)
  useEffect(() => {
    if (user) {
      setShowSaveGateModal(false);
      return;
    }

    if (!currentTrip || currentTrip.id.startsWith('trip-demo-')) {
      return;
    }

    const isSessionDismissed = 
      sessionStorage.getItem('gateready_save_gate_session_shown') === 'true' ||
      sessionStorage.getItem('gateready_save_gate_session_dismissed') === 'true';

    if (isSessionDismissed) {
      return;
    }

    // Trigger during normal list-building when user adds item(s) to a trip (totalItems >= 1)
    if (totalItems >= 1) {
      const timer = setTimeout(() => {
        const stillDismissed = 
          sessionStorage.getItem('gateready_save_gate_session_shown') === 'true' ||
          sessionStorage.getItem('gateready_save_gate_session_dismissed') === 'true';
        if (!stillDismissed && !user) {
          setShowSaveGateModal(true);
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [user, currentTrip?.id, totalItems]);

  const handleDismissSaveGate = () => {
    setShowSaveGateModal(false);
    try {
      sessionStorage.setItem('gateready_save_gate_session_shown', 'true');
      sessionStorage.setItem('gateready_save_gate_session_dismissed', 'true');
    } catch {}
  };

  const handleSaveFromSaveGate = () => {
    setShowSaveGateModal(false);
    try {
      sessionStorage.setItem('gateready_save_gate_session_shown', 'true');
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
    setAddTripPreFill(null);
    setAddTripKey((prev) => prev + 1);
    setShowAddTripModal(true);
  };

  const handleBuildPackingListFromChecker = (config: {
    carrier: string;
    seatClass: string;
    checkedCount: number;
    carryOnCount: number;
  }) => {
    const tripCheck = canAddTrip(trips.length);
    if (!tripCheck.allowed) {
      openPaywall(tripCheck.reason);
      return;
    }

    // Hard free-plan bag limit enforcement: max 1 checked bag, max 2 bags total
    if (!isPro && (config.checkedCount > 1 || (config.checkedCount + config.carryOnCount) > 2)) {
      setPendingCheckerConfig(config);
      return;
    }

    const defaultUser = user?.displayName ? user.displayName.split(' ')[0] : 'Me';
    const prefilledBags: Array<{
      type: BagType;
      label: string;
      assignedTo?: string;
      material?: BagMaterial;
      emptyBagWeightLbs?: number;
    }> = [];

    for (let i = 0; i < config.checkedCount; i++) {
      prefilledBags.push({
        type: 'CHECKED',
        label: config.checkedCount === 1 ? 'Checked Bag' : `Checked Bag ${i + 1}`,
        assignedTo: defaultUser,
        material: 'HARD_SHELL',
        emptyBagWeightLbs: getUserPresetWeightLbs('CHECKED', 'HARD_SHELL')
      });
    }

    for (let i = 0; i < config.carryOnCount; i++) {
      prefilledBags.push({
        type: 'CARRY_ON',
        label: config.carryOnCount === 1 ? 'Carry-On Roller' : `Carry-On ${i + 1}`,
        assignedTo: defaultUser,
        material: 'HARD_SHELL',
        emptyBagWeightLbs: getUserPresetWeightLbs('CARRY_ON', 'HARD_SHELL')
      });
    }

    if (prefilledBags.length === 0) {
      prefilledBags.push({
        type: 'PERSONAL',
        label: 'Personal Backpack',
        assignedTo: defaultUser,
        material: 'FABRIC',
        emptyBagWeightLbs: getUserPresetWeightLbs('PERSONAL', 'FABRIC')
      });
    }

    const tripTitle = `${config.carrier} Journey`;
    addTrip(
      tripTitle,
      'PLANE',
      config.carrier,
      config.seatClass,
      prefilledBags,
      [defaultUser],
      {}
    );
  };

  const handleContinueWithTwoBagsFree = (
    allowedBags: Array<{
      type: BagType;
      label: string;
      assignedTo?: string;
      material?: BagMaterial;
      emptyBagWeightLbs?: number;
    }>,
    leftOutNote: string
  ) => {
    if (!pendingCheckerConfig) return;
    const defaultUser = user?.displayName ? user.displayName.split(' ')[0] : 'Me';
    const finalBags = allowedBags.map((b) => ({ ...b, assignedTo: defaultUser }));
    const tripTitle = `${pendingCheckerConfig.carrier} Journey`;
    const createdTrip = addTrip(
      tripTitle,
      'PLANE',
      pendingCheckerConfig.carrier,
      pendingCheckerConfig.seatClass,
      finalBags,
      [defaultUser],
      {}
    );
    if (createdTrip && createdTrip.id) {
      setTripNotice({ tripId: createdTrip.id, message: leftOutNote });
    }
    setPendingCheckerConfig(null);
  };

  const handlePlanTripFromChecker = (destinationCity: string) => {
    const tripCheck = canAddTrip(trips.length);
    if (!tripCheck.allowed) {
      openPaywall(tripCheck.reason);
      return;
    }
    setSelectedTravelTypeForAdd('PLANE');
    setSelectedDestinationForAdd(destinationCity);
    setAddTripPreFill(null);
    setAddTripKey((prev) => prev + 1);
    setShowAddTripModal(true);
  };

  const handleOpenAddItem = (bagId: string) => {
    setTargetBagId(bagId);
    setShowAddItemModal(true);
  };

  const currentBag = currentTrip?.bags.find((b) => b.id === (targetBagId || selectedBagId)) || currentTrip?.bags[0];

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

      {/* Free Plan Bag Limit Trip Notice (strictly scoped to currentTrip; never on landing or other trips) */}
      {tripNotice && currentTrip && tripNotice.tripId === currentTrip.id && !dismissedNoticeTripIds.has(tripNotice.tripId) && (
        <div className="bg-purple-950 text-white px-4 py-3 shadow-lg flex items-center justify-between gap-3 text-xs border-b border-purple-800 relative z-30 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-amber-400 text-purple-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Info className="w-3.5 h-3.5" />
            </div>
            <p className="font-semibold text-purple-100 leading-snug">
              {tripNotice.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDismissedNoticeTripIds((prev) => new Set(prev).add(tripNotice.tripId));
              setTripNotice(null);
            }}
            className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
                Create an account & sign in to apply your <strong>1 Free Month of Platinum</strong> ($4.99 value). Mandatory to activate.
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
                <span className="truncate">{tab1Title}</span>
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
                <span className="truncate">{tab2Title}</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs shrink-0">
                  <Crown className="w-2.5 h-2.5 fill-purple-950" /> Silver+
                </span>
              </button>

              {/* Tab 3: Cabin & Plugs (Silver+) */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) {
                    openPaywall("Upgrade to Silver, Gold, or Platinum to unlock In-Seat Power & Seating Intel.");
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
                <span className="truncate">{tab3Title}</span>
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
                <span className="truncate">{tab4Title}</span>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                    currentScreen === 'Allowances'
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  {isFlight ? 'Rules' : 'Guide'}
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
                <Tab5IconComponent className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab5Title}</span>
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

            {/* Standalone Quick Checkers: Baggage Fees & Entry Requirements */}
            <LandingQuickCheckers
              onBuildPackingList={handleBuildPackingListFromChecker}
              onPlanTrip={handlePlanTripFromChecker}
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
              <span className="text-[10px] tracking-tight mt-0.5">{isCar ? 'Trunk' : 'Luggage'}</span>
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
                  openPaywall("Upgrade to Silver, Gold, or Platinum to unlock In-Seat Power & Seating Intel.");
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
              <span className="text-[10px] tracking-tight mt-0.5">{isCar ? 'Power' : isCruise ? 'Cabin' : 'Plugs'}</span>
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
              <span className="text-[10px] tracking-tight mt-0.5">{isFlight ? 'Limits' : 'Rules'}</span>
            </button>

            {/* Mobile Tab 5: Departure Ready */}
            <button
              onClick={() => setCurrentScreen('GateReady')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer ${
                currentScreen === 'GateReady'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'GateReady' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <Tab5IconComponent className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab5MobileLabel}</span>
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
        initialCarrier={addTripPreFill?.carrier}
        initialSeatClass={addTripPreFill?.seatClass}
        initialBags={addTripPreFill?.bags}
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

      {/* Free Plan Hard Bag Limit Modal for Landing Fee Checker */}
      <FreeLimitCheckerModal
        isOpen={pendingCheckerConfig !== null}
        onClose={() => setPendingCheckerConfig(null)}
        config={pendingCheckerConfig}
        onContinueFree={handleContinueWithTwoBagsFree}
        onSeePlans={() => {
          setPendingCheckerConfig(null);
          openPaywall('Free Plan allows only 1 Checked Bag per trip (up to 2 bags total). Upgrade to Silver, Gold, or Platinum to pack unlimited bags.');
        }}
      />

      {/* Non-intrusive ad placement slot above footer on guest landing page */}
      {!currentTrip && (
        <AdPlacement slotId="ad-slot-landing-footer" format="footer" className="px-4 mb-4" />
      )}

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
  const [pathname, setPathname] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.replace(/\/+$/, '') || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname.replace(/\/+$/, '') || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (pathname === '/about') return <AboutPage />;
  if (pathname === '/privacy') return <PrivacyPage />;
  if (pathname === '/terms') return <TermsPage />;
  if (pathname === '/contact') return <ContactPage />;
  if (pathname === '/faq') return <FaqPage />;
  if (pathname === '/pricing') return <PricingPage />;
  if (pathname === '/how-it-works') return <HowItWorksPage />;
  if (pathname === '/cookies') return <CookiesPage />;
  if (pathname === '/refunds') return <RefundsPage />;
  if (pathname === '/changelog') return <ChangelogPage />;
  if (pathname === '/security') return <SecurityPage />;
  if (pathname === '/reviews') return <ReviewsPage />;
  if (pathname === '/airlines') return <AirlineIndexPage />;
  if (pathname.startsWith('/airlines/')) return <AirlineGuidePage />;
  if (pathname === '/baggage-fee-calculator') return <BaggageFeeCalculatorPage />;
  if (pathname === '/tare-weight') return <TareWeightPage />;
  if (pathname === '/entry-requirements') return <EntryRequirementsPage />;

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
