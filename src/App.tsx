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
import { InteractiveTripPreview, TripPreviewConfig } from './components/InteractiveTripPreview';
import { TravelDashboard } from './components/TravelDashboard';
import { TripWorkspace, WorkspaceTab } from './components/TripWorkspace';
import { NotificationsModal } from './components/NotificationsModal';
import { LuggageLibraryModal } from './components/LuggageLibraryModal';
import { OnboardingModal, isOnboardingCompleted, setOnboardingCompleted, saveUserPreferences } from './components/OnboardingModal';
import { InAppNotification, LuggageProfile } from './types/travel';
import { generateTripNotifications } from './utils/notifications';
import { trackEvent } from './utils/analytics';
import { AppFooter } from './components/AppFooter';
import { TrialNudgeBanner } from './components/TrialNudgeBanner';
import { TrialExpiredModal } from './components/TrialExpiredModal';
import { ReferralModal } from './components/ReferralModal';
import { AirlineGuidesModal } from './components/AirlineGuidesModal';
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
import { RequirementsPage } from './pages/RequirementsPage';
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
  const { 
    currentTrip, 
    trips, 
    selectedBagId, 
    setSelectedBagId, 
    addTrip, 
    loadDemoTrip, 
    refreshActiveTrip,
    selectTrip,
    deleteTrip,
    updateTripDetails
  } = usePacking();
  const { isPro, isTrialActive, canAddTrip, openPaywall, hasPendingReferralCode, clearPendingReferralCode } = useSubscription();
  const { user, resendVerificationEmail } = useAuth();
  const [resentEmailNotice, setResentEmailNotice] = useState(false);
  const [dismissedEmailVerify, setDismissedEmailVerify] = useState(() => {
    try {
      return localStorage.getItem('gateready_email_verify_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissEmailVerify = () => {
    setDismissedEmailVerify(true);
    try {
      localStorage.setItem('gateready_email_verify_dismissed', 'true');
    } catch {}
  };

  const [currentScreen, setCurrentScreen] = useState<'Bags' | 'Checklist' | 'CabinIntel' | 'Allowances' | 'GateReady'>('Bags');
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [selectedTravelTypeForAdd, setSelectedTravelTypeForAdd] = useState<TravelType | undefined>(undefined);
  const [selectedDestinationForAdd, setSelectedDestinationForAdd] = useState<string | undefined>(undefined);
  const [addTripPreFill, setAddTripPreFill] = useState<{
    carrier?: string;
    seatClass?: string;
    originCity?: string;
    departureDate?: string;
    travelers?: string[];
    bags?: Array<{
      type: BagType;
      label: string;
      assignedTo?: string;
      material?: BagMaterial;
      emptyBagWeightLbs?: number;
    }>;
  } | null>(null);
  const [editingTripId, setEditingTripId] = useState<string | undefined>(undefined);
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

  // Phase 2: Personalized Travel Dashboard & Workspace State
  const [appView, setAppView] = useState<'dashboard' | 'workspace' | 'home'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/\/+$/, '') || '/';
      if (p === '/dashboard') return 'dashboard';
    }
    return trips.length > 0 ? 'dashboard' : 'home';
  });
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<WorkspaceTab>('Overview');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showLuggageLibraryModal, setShowLuggageLibraryModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => generateTripNotifications(trips));

  // Auto-launch guided onboarding for first-time visitors on home/dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/\/+$/, '') || '/';
      // Suppress if user already has trips created (returning user)
      if (trips.length > 0) {
        if (!isOnboardingCompleted()) {
          setOnboardingCompleted(true);
        }
        return;
      }
      if ((p === '/' || p === '/dashboard') && !isOnboardingCompleted()) {
        const timer = setTimeout(() => {
          setShowOnboardingModal(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    }
  }, [trips.length]);

  useEffect(() => {
    setNotifications(generateTripNotifications(trips));
  }, [trips]);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const handleLoadDemo = () => {
    const demo = loadDemoTrip();
    if (demo) {
      selectTrip(demo);
      setAppView('workspace');
    }
  };

  useEffect(() => {
    if (appView === 'workspace' && !currentTrip) {
      if (trips.length > 0) {
        selectTrip(trips[0]);
      } else {
        setAppView('dashboard');
      }
    }
  }, [appView, currentTrip, trips, selectTrip]);

  // Track separate browser visits in localStorage & GA4
  useEffect(() => {
    trackEvent('homepage_view');
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

  const handleOpenAddTrip = (
    travelType?: TravelType, 
    destinationCity?: string,
    prefillCarrier?: string,
    prefillOriginCity?: string
  ) => {
    refreshActiveTrip();
    const safeTravelType = typeof travelType === 'string' ? travelType : undefined;
    const safeDest = typeof destinationCity === 'string' ? destinationCity : undefined;
    const tripCheck = canAddTrip(trips.length);
    if (!tripCheck.allowed) {
      openPaywall(tripCheck.reason);
      return;
    }
    setSelectedTravelTypeForAdd(safeTravelType);
    setSelectedDestinationForAdd(safeDest);
    setEditingTripId(undefined);
    if (prefillCarrier || prefillOriginCity) {
      setAddTripPreFill({
        carrier: prefillCarrier,
        originCity: prefillOriginCity
      });
    } else {
      setAddTripPreFill(null);
    }
    setAddTripKey((prev) => prev + 1);
    setShowAddTripModal(true);
  };

  const handleLaunchTripFromPreview = (config: TripPreviewConfig, openAccountFirst = false) => {
    refreshActiveTrip();
    const tripCheck = canAddTrip(trips.length);
    if (!tripCheck.allowed) {
      openPaywall(tripCheck.reason);
      return;
    }

    const defaultUser = user?.displayName ? user.displayName.split(' ')[0] : 'Me';
    
    // Construct prefilled bags from the preview
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
        type: 'CARRY_ON',
        label: 'Carry-On Roller',
        assignedTo: defaultUser,
        material: 'HARD_SHELL',
        emptyBagWeightLbs: getUserPresetWeightLbs('CARRY_ON', 'HARD_SHELL')
      });
    }

    const travelers = [defaultUser];
    for (let t = 2; t <= Math.min(config.travelersCount, 4); t++) {
      travelers.push(`Traveler ${t}`);
    }

    setSelectedTravelTypeForAdd('PLANE');
    setSelectedDestinationForAdd(config.destinationCity);
    setAddTripPreFill({
      originCity: config.originCity,
      carrier: config.airline,
      departureDate: config.departureDate,
      travelers,
      bags: prefilledBags
    });
    setAddTripKey((prev) => prev + 1);

    if (openAccountFirst && !user) {
      setAccountModalOrigin('save_gate');
      setShowAccountModal(true);
    } else {
      setShowAddTripModal(true);
    }
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
        onOpenDashboard={() => {
          setAppView('dashboard');
          if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
            try {
              window.history.pushState({}, '', '/dashboard');
            } catch {}
          }
        }}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
        currentView={appView}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
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
      {user && !user.emailVerified && !isTrialActive && !dismissedEmailVerify && user.providerData.some((p) => p.providerId === 'password') && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">
              Please verify your email address (<strong>{user.email}</strong>). We sent a verification link to your inbox.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
            <button
              type="button"
              onClick={handleDismissEmailVerify}
              className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 transition-colors cursor-pointer"
              title="Dismiss verification reminder"
              aria-label="Dismiss verification banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sync with Google prompt banner when signed out */}
      <MobileSyncBanner onOpenAccountModal={() => {
        setAccountModalOrigin('header');
        setShowAccountModal(true);
      }} />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-20 sm:pb-12 relative overflow-x-hidden">
        {/* Overall Ambient Blueprint Grid for main page */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 dark:opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        {appView === 'workspace' && currentTrip ? (
          <TripWorkspace
            trip={currentTrip}
            initialTab={workspaceInitialTab}
            onBackToDashboard={() => setAppView('dashboard')}
            onOpenAddBag={() => setShowAddBagModal(true)}
            onOpenAddItem={(bagId) => {
              setTargetBagId(bagId);
              setShowAddItemModal(true);
            }}
            onOpenTripEdit={() => {
              setEditingTripId(currentTrip.id);
              setAddTripPreFill({
                originCity: currentTrip.originCity,
                carrier: currentTrip.companyName,
                seatClass: currentTrip.seatClassOrCarSize,
                departureDate: currentTrip.departureDate,
                travelers: currentTrip.familyMembers,
                bags: currentTrip.bags.map((b) => ({
                  type: b.type,
                  label: b.label,
                  assignedTo: b.assignedTo,
                  material: b.material,
                  emptyBagWeightLbs: b.emptyBagWeightLbs
                }))
              });
              setSelectedTravelTypeForAdd(currentTrip.travelType);
              setSelectedDestinationForAdd(currentTrip.destinationCity);
              setAddTripKey((prev) => prev + 1);
              setShowAddTripModal(true);
            }}
            onOpenReferral={() => setShowReferralModal(true)}
          />
        ) : appView === 'dashboard' || trips.length > 0 ? (
          <TravelDashboard
            trips={trips}
            onOpenTripWorkspace={(trip, initialTab) => {
              selectTrip(trip);
              if (initialTab) {
                setWorkspaceInitialTab(initialTab as WorkspaceTab);
              } else {
                setWorkspaceInitialTab('Overview');
              }
              setAppView('workspace');
            }}
            onOpenNewTripModal={() => handleOpenAddTrip()}
            onDeleteTrip={deleteTrip}
            onOpenLuggageLibrary={() => setShowLuggageLibraryModal(true)}
            onOpenNotifications={() => setShowNotificationsModal(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
            onLoadDemoTrip={handleLoadDemo}
          />
        ) : (
          <div className="flex flex-col">
            {/* Conversion Marketing Hero (Above the trip creator) */}
            <LandingHero
              onOpenAddTrip={() => handleOpenAddTrip()}
              onLoadDemo={handleLoadDemo}
              onOpenPricing={() => openPaywall()}
              onOpenAirlineGuides={() => setShowAirlineGuidesModal(true)}
              onOpenAccountSync={() => {
                setAccountModalOrigin('header');
                setShowAccountModal(true);
              }}
              onExploreTools={() => {
                const el = document.getElementById('interactive-trip-preview');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Interactive Trip Preview Tool (Prominent on homepage) */}
            <InteractiveTripPreview
              onSaveAndCreateAccount={(cfg) => handleLaunchTripFromPreview(cfg, true)}
              onOpenTripCreator={(cfg) => handleLaunchTripFromPreview(cfg, false)}
            />

            {/* Immediately usable trip creator directly below */}
            <TransitNetworkHub
              onOpenAddTrip={handleOpenAddTrip}
              onOpenTour={() => setShowTourModal(true)}
              onLoadDemo={handleLoadDemo}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <AddTripDialog
        key={addTripKey}
        isOpen={showAddTripModal}
        onClose={() => {
          setShowAddTripModal(false);
          setEditingTripId(undefined);
        }}
        editingTripId={editingTripId}
        initialTripTitle={editingTripId && currentTrip ? currentTrip.name : undefined}
        initialTravelType={selectedTravelTypeForAdd}
        initialDestinationCity={selectedDestinationForAdd}
        initialOriginCity={addTripPreFill?.originCity}
        initialCarrier={addTripPreFill?.carrier}
        initialSeatClass={addTripPreFill?.seatClass}
        initialDepartureDate={addTripPreFill?.departureDate}
        initialDepartureTime={editingTripId && currentTrip ? currentTrip.departureTime : undefined}
        initialReturnTripDate={editingTripId && currentTrip ? currentTrip.returnTripDate : undefined}
        initialReturnTripTime={editingTripId && currentTrip ? currentTrip.returnTripTime : undefined}
        initialAircraftType={editingTripId && currentTrip ? currentTrip.aircraftType : undefined}
        initialPassportExpiryDate={editingTripId && currentTrip ? currentTrip.passportExpiryDate : undefined}
        initialTravelers={addTripPreFill?.travelers}
        isOnboarding={trips.length === 0}
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
        onRegistrationSuccess={() => {
          setAppView('dashboard');
          if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
            try {
              window.history.pushState({}, '', '/dashboard');
            } catch {}
          }
          setShowOnboardingModal(true);
        }}
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

      {/* Phase 2: Departure Reminders & In-App Notification Center */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onRefreshNotifications={() => setNotifications(generateTripNotifications(trips))}
        onSelectNotificationAction={(notif) => {
          setShowNotificationsModal(false);
          if (notif.tripId) {
            const targetTrip = trips.find((t) => t.id === notif.tripId);
            if (targetTrip) {
              selectTrip(targetTrip);
              if (notif.targetTab) {
                setWorkspaceInitialTab(notif.targetTab);
              } else {
                setWorkspaceInitialTab('Overview');
              }
              setAppView('workspace');
            }
          }
        }}
      />

      {/* Phase 2: Personal Luggage Library Modal */}
      <LuggageLibraryModal
        isOpen={showLuggageLibraryModal}
        onClose={() => setShowLuggageLibraryModal(false)}
        currentTrip={currentTrip || undefined}
      />

      {/* Phase 2: Customer Guided Onboarding Modal (5-Step) */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onStartTripCreation={(prefill) => {
          setShowOnboardingModal(false);
          handleOpenAddTrip(prefill?.travelType, undefined, prefill?.carrier, prefill?.originCity);
        }}
        onExploreTools={() => {
          setShowOnboardingModal(false);
          setAppView('dashboard');
          if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
            try {
              window.history.pushState({}, '', '/dashboard');
            } catch {}
          }
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
  if (pathname === '/fee-calculator' || pathname === '/fee-calculator/') {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/baggage-fee-calculator');
    }
    return <BaggageFeeCalculatorPage />;
  }
  if (pathname === '/tare-weight') return <TareWeightPage />;
  if (pathname === '/entry-requirements') return <EntryRequirementsPage />;
  if (pathname === '/requirements') return <RequirementsPage />;
  if (pathname === '/feedback' || pathname === '/feedback/') {
    if (typeof window !== 'undefined') {
      window.location.replace('/contact');
    }
    return <ContactPage />;
  }

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
