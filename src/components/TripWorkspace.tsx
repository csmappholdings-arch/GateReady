import React, { useState, useEffect } from 'react';
import { Trip, BagType, BagMaterial, Bag, TravelType, LuggageProfile } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { calculateTravelReadinessScore } from '../utils/readinessScore';
import { 
  ArrowLeft, 
  Luggage, 
  Users, 
  CheckSquare, 
  BookOpen, 
  FileCheck, 
  ClipboardCheck, 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  Plane, 
  Train, 
  Car, 
  Ship, 
  Bus,
  Edit3, 
  Printer, 
  Share2, 
  ChevronRight,
  ShieldCheck,
  Check,
  Flame,
  Plus
} from 'lucide-react';
import { FamilyTravelManager } from './FamilyTravelManager';
import { BaggageScreen } from './BaggageScreen';
import { PackingChecklistScreen } from './PackingChecklistScreen';
import { AllowancesScreen } from './AllowancesScreen';
import { TravelDocumentsChecklistScreen } from './TravelDocumentsChecklist';
import { GateReadyChecklistScreen } from './GateReadyChecklistScreen';
import { LuggageLibraryModal } from './LuggageLibraryModal';
import { generateSmartPackingSuggestions } from '../utils/smartRecommendations';
import { trackEvent } from '../utils/analytics';

export type WorkspaceTab = 
  | 'Overview' 
  | 'Travellers' 
  | 'Luggage' 
  | 'Checklist' 
  | 'AirlineRules' 
  | 'Documents' 
  | 'Summary';

interface TripWorkspaceProps {
  trip: Trip;
  initialTab?: WorkspaceTab;
  onBackToDashboard: () => void;
  onOpenAddBag: () => void;
  onOpenAddItem: (bagId: string) => void;
  onOpenTripEdit?: () => void;
  onOpenReferral?: () => void;
}

export const TripWorkspace: React.FC<TripWorkspaceProps> = ({
  trip,
  initialTab = 'Overview',
  onBackToDashboard,
  onOpenAddBag,
  onOpenAddItem,
  onOpenTripEdit,
  onOpenReferral
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);
  const [showLuggageLibraryModal, setShowLuggageLibraryModal] = useState(false);
  const [travelerFilter, setTravelerFilter] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const { 
    updateTripDetails, 
    addBagToTrip, 
    addFamilyMember, 
    removeFamilyMember, 
    addItemToBag 
  } = usePacking();

  const { tier, openPaywall } = useSubscription();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    trackEvent('trip_workspace_open', {
      trip_id: trip.id,
      tab: activeTab
    });
  }, [activeTab, trip.id]);

  const score = calculateTravelReadinessScore(trip);
  const smartSuggestions = generateSmartPackingSuggestions(trip);

  const allItems = trip.bags.flatMap((b) => b.items);
  const totalItems = allItems.length;
  const packedItems = allItems.filter((i) => i.isPacked).length;
  const packingPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
  const travelersCount = trip.familyMembers?.length || 1;

  // Countdown calculations
  const now = new Date();
  let daysRemaining: number | null = null;
  if (trip.departureDate) {
    const [year, month, day] = trip.departureDate.split('-').map(Number);
    if (year && month && day) {
      const depDate = new Date(year, month - 1, day);
      const diffMs = depDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }
  }

  const handleAddBagFromLibrary = (profile: LuggageProfile) => {
    addBagToTrip(
      trip.id,
      profile.type,
      profile.name,
      profile.assignedTraveler,
      profile.material,
      profile.emptyBagWeightLbs
    );
    setSaveToast(`Added ${profile.name} to trip luggage!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleApplySuggestion = (suggestion: { name: string; category: string; defaultQty: number }) => {
    if (trip.bags.length === 0) {
      onOpenAddBag();
      return;
    }
    const targetBag = trip.bags[0];
    addItemToBag(
      trip.id,
      targetBag.id,
      suggestion.name,
      suggestion.category,
      suggestion.defaultQty
    );
    setSaveToast(`Added "${suggestion.name}" to ${targetBag.label}!`);
    setTimeout(() => setSaveToast(null), 3000);
    trackEvent('packing_template_applied', { item_name: suggestion.name });
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

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 space-y-6 animate-in fade-in duration-200">
      {/* Toast Save Notification */}
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-[99999] p-3 px-4 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Breadcrumb & Return to Dashboard */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Travel Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenTripEdit && (
            <button
              type="button"
              onClick={onOpenTripEdit}
              className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Trip Details</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowLuggageLibraryModal(true)}
            className="h-8 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>Luggage Library</span>
          </button>
        </div>
      </div>

      {/* Trip Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-800/40">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-7 h-7 rounded-xl bg-purple-500/30 text-purple-200 flex items-center justify-center">
              {getModeIcon(trip.travelType)}
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-purple-300">
              {trip.companyName} {trip.flightNumber ? `· ${trip.flightNumber}` : ''} {trip.fareFamily ? `· ${trip.fareFamily}` : ''}
            </span>
            {trip.seatClassOrCarSize && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-purple-200">
                {trip.seatClassOrCarSize}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            {trip.originCity || 'Departure'} → {trip.destinationCity || trip.name}
          </h1>

          <div className="flex items-center gap-3 text-xs text-purple-200 flex-wrap pt-0.5">
            {trip.departureDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-300" />
                Departure: <strong>{trip.departureDate}</strong> {trip.departureTime ? `at ${trip.departureTime}` : ''}
              </span>
            )}
            {trip.returnTripDate && (
              <span>· Return: <strong>{trip.returnTripDate}</strong></span>
            )}
            <span>· <strong>{travelersCount}</strong> {travelersCount === 1 ? 'Traveler' : 'Travelers'}</span>
            <span>· <strong>{trip.bags.length}</strong> {trip.bags.length === 1 ? 'Bag' : 'Bags'}</span>
          </div>
        </div>

        {/* Readiness Badge & Countdown Indicator */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="p-3.5 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200">
                Readiness Score
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-md ${score.statusColor}`}>
                {score.statusLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-2xl font-black text-white">{score.totalScore}</span>
              <span className="text-xs text-purple-200">/ 100</span>
            </div>
          </div>

          {daysRemaining !== null && (
            <div className="p-3.5 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-0.5 min-w-[90px]">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Departure
              </p>
              <p className="text-xl font-black text-white">
                {daysRemaining <= 0 ? 'TODAY' : `${daysRemaining}d`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clean 7-Tab Navigation Bar (Section 2) */}
      <div className="sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md py-2 border-b border-purple-100 dark:border-purple-950 shadow-xs">
        <nav
          aria-label="Trip workspace navigation tabs"
          className="p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar"
        >
          <button
            type="button"
            onClick={() => setActiveTab('Overview')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'Overview'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Travellers')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'Travellers'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Travellers</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              {travelersCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Luggage')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'Luggage'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60'
            }`}
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>Luggage</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              {trip.bags.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Checklist')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'Checklist'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Packing Checklist</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              {packingPercent}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AirlineRules')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'AirlineRules'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Airline Rules</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Documents')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'Documents'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Travel Documents</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Summary')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'Summary'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Trip Summary</span>
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Section 5: Travel Readiness Score Breakdown Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Departure Readiness Audit
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Travel Readiness Score: {score.totalScore} / 100
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time audit across packing progress, suitcase weights, document checklists, and flight schedules.
                </p>
              </div>

              {score.recommendedNextActions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(score.recommendedNextActions[0].targetTab)}
                  className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Improve My Travel Readiness</span>
                </button>
              )}
            </div>

            {/* 5 Scoring Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              {/* Category 1: Packing */}
              <div 
                onClick={() => setActiveTab('Checklist')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">1. Packing</span>
                  <span className="font-black text-purple-700 dark:text-purple-300">{score.categories.packing.score}/30</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${score.categories.packing.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 truncate">{score.categories.packing.detail}</p>
              </div>

              {/* Category 2: Baggage */}
              <div 
                onClick={() => setActiveTab('Luggage')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">2. Baggage</span>
                  <span className="font-black text-purple-700 dark:text-purple-300">{score.categories.baggage.score}/30</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${score.categories.baggage.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 truncate">{score.categories.baggage.detail}</p>
              </div>

              {/* Category 3: Travellers */}
              <div 
                onClick={() => setActiveTab('Travellers')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">3. Travellers</span>
                  <span className="font-black text-purple-700 dark:text-purple-300">{score.categories.travellers.score}/15</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${score.categories.travellers.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 truncate">{score.categories.travellers.detail}</p>
              </div>

              {/* Category 4: Documents */}
              <div 
                onClick={() => setActiveTab('Documents')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">4. Documents</span>
                  <span className="font-black text-purple-700 dark:text-purple-300">{score.categories.documents.score}/15</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${score.categories.documents.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 truncate">{score.categories.documents.detail}</p>
              </div>

              {/* Category 5: Final Review */}
              <div 
                onClick={() => setActiveTab('Summary')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">5. Flight Review</span>
                  <span className="font-black text-purple-700 dark:text-purple-300">{score.categories.finalReview.score}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${score.categories.finalReview.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 truncate">{score.categories.finalReview.detail}</p>
              </div>
            </div>
          </div>

          {/* Section 1.E: Recommended Next Actions */}
          {score.recommendedNextActions.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-sm space-y-4">
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Next Preparation Steps</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {score.recommendedNextActions.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => setActiveTab(rec.targetTab)}
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
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Destination Recommendations Preview (Section 3) */}
          {smartSuggestions.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Smart Packing Recommendations</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Recommended items tailored to {trip.destinationCity || 'your destination'}. Tap &ldquo;+ Add&rdquo; to approve into your luggage.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {smartSuggestions.map((group) => (
                  <div key={group.category} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {group.category}
                      </h4>
                      <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                        {group.reason}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {group.suggestions.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40">
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            {item.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleApplySuggestion(item)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Travellers */}
      {activeTab === 'Travellers' && (
        <FamilyTravelManager
          trip={trip}
          onAddFamilyMember={addFamilyMember}
          onRemoveFamilyMember={removeFamilyMember}
          onUpdateTripDetails={updateTripDetails}
          onOpenPricing={openPaywall}
          onFilterByTraveler={(name) => {
            setTravelerFilter(name);
            setActiveTab('Checklist');
          }}
        />
      )}

      {/* Tab 3: Luggage */}
      {activeTab === 'Luggage' && (
        <BaggageScreen
          trip={trip}
          onOpenAddBag={onOpenAddBag}
          onOpenReferral={onOpenReferral}
        />
      )}

      {/* Tab 4: Packing Checklist */}
      {activeTab === 'Checklist' && (
        <PackingChecklistScreen
          trip={trip}
          onOpenAddItem={onOpenAddItem}
          onOpenAddBag={onOpenAddBag}
          onNavigateToAllowances={() => setActiveTab('AirlineRules')}
          onNavigateToBags={() => setActiveTab('Luggage')}
        />
      )}

      {/* Tab 5: Airline Rules */}
      {activeTab === 'AirlineRules' && (
        <AllowancesScreen trip={trip} />
      )}

      {/* Tab 6: Travel Documents */}
      {activeTab === 'Documents' && (
        <TravelDocumentsChecklistScreen
          trip={trip}
          onUpdateTripDetails={updateTripDetails}
        />
      )}

      {/* Tab 7: Trip Summary */}
      {activeTab === 'Summary' && (
        <GateReadyChecklistScreen trip={trip} />
      )}

      {/* Luggage Library Modal */}
      {showLuggageLibraryModal && (
        <LuggageLibraryModal
          isOpen={showLuggageLibraryModal}
          onClose={() => setShowLuggageLibraryModal(false)}
          currentTrip={trip}
          onAddBagToCurrentTrip={handleAddBagFromLibrary}
        />
      )}
    </div>
  );
};
