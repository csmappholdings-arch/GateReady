import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Plane, 
  Scale, 
  CheckCircle2, 
  Luggage, 
  Wallet, 
  Calculator, 
  Users, 
  ShieldCheck, 
  Check, 
  Compass,
  MapPin,
  Heart
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';
import { usePacking } from '../context/PackingContext';
import { TravelType } from '../types/travel';

export interface UserPreferences {
  preferredAirline?: string;
  travelType?: TravelType;
  typicalTravelers?: number;
  weightUnit?: 'LBS' | 'KG';
  homeAirport?: string;
}

const PREFERENCES_STORAGE_KEY = 'gateready_user_preferences';
const ONBOARDING_COMPLETED_KEY = 'gateready_onboarding_completed';

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getUserPreferences();
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({ ...existing, ...prefs }));
  } catch {}
}

export function isOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
}

export function setOnboardingCompleted(completed: boolean = true): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? 'true' : 'false');
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTripCreation: (prefill?: { carrier?: string; originCity?: string; travelType?: TravelType }) => void;
  onExploreTools: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartTripCreation,
  onExploreTools
}) => {
  const { user } = useAuth();
  const { weightUnit, toggleWeightUnit } = usePacking();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 2 preferences state
  const [preferredAirline, setPreferredAirline] = useState('');
  const [selectedTravelType, setSelectedTravelType] = useState<TravelType>('PLANE');
  const [typicalTravelers, setTypicalTravelers] = useState<number>(1);
  const [prefWeightUnit, setPrefWeightUnit] = useState<'LBS' | 'KG'>(weightUnit === 'KG' ? 'KG' : 'LBS');
  const [homeAirport, setHomeAirport] = useState('');

  useEffect(() => {
    if (isOpen) {
      trackEvent('onboarding_started');
      const saved = getUserPreferences();
      if (saved.preferredAirline) setPreferredAirline(saved.preferredAirline);
      if (saved.travelType) setSelectedTravelType(saved.travelType);
      if (saved.typicalTravelers) setTypicalTravelers(saved.typicalTravelers);
      if (saved.weightUnit) setPrefWeightUnit(saved.weightUnit);
      if (saved.homeAirport) setHomeAirport(saved.homeAirport);
    }
  }, [isOpen, weightUnit]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSkip = () => {
    trackEvent('onboarding_skipped', { step: currentStep });
    setOnboardingCompleted(true);
    onClose();
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // Save Step 2 preferences
      const prefs: UserPreferences = {
        preferredAirline: preferredAirline.trim() || undefined,
        travelType: selectedTravelType,
        typicalTravelers,
        weightUnit: prefWeightUnit,
        homeAirport: homeAirport.trim() || undefined
      };
      saveUserPreferences(prefs);
      if (prefWeightUnit !== weightUnit) {
        toggleWeightUnit();
      }
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    trackEvent('onboarding_completed');
    setOnboardingCompleted(true);
    onClose();
    onExploreTools();
  };

  const handleStartTripFromStep3 = () => {
    trackEvent('onboarding_completed', { action: 'start_trip' });
    setOnboardingCompleted(true);
    onClose();
    onStartTripCreation({
      carrier: preferredAirline.trim() || undefined,
      originCity: homeAirport.trim() || undefined,
      travelType: selectedTravelType
    });
  };

  const popularAirlines = ['Air Canada', 'WestJet', 'United Airlines', 'Delta Air Lines', 'Porter Airlines', 'British Airways'];
  const popularAirports = ['Toronto (YYZ)', 'Vancouver (YVR)', 'Calgary (YYC)', 'Montreal (YUL)', 'New York (JFK)', 'Chicago (ORD)'];

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-900/60 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome Onboarding"
      >
        {/* Top Header & Progress */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight leading-none">
                Welcome to GateReady
              </h2>
              <span className="text-[10px] text-purple-200 font-medium">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-purple-200 hover:text-white font-semibold px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close onboarding"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-purple-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Modal Body: Steps 1 to 5 */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: WELCOME */}
          {currentStep === 1 && (
            <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center shadow-inner">
                <Luggage className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Pack Smart. Fly Prepared.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  GateReady helps you organize your luggage, deduct empty suitcase tare weight, audit TSA 3-1-1 liquids, and check published baggage allowances across 42+ airlines before you leave home.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-2.5 max-w-md mx-auto">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Deduct 6–9 lbs of empty hard-shell suitcase weight</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Compare 42+ carrier fare families & overhead sizers</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Personal cloud sync included on every tier</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TRAVEL PREFERENCES */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Your Travel Preferences (Optional)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Help us personalize your baggage limits, units, and airline guides. All fields are optional.
                </p>
              </div>

              {/* Preferred Airline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Preferred Airline
                </label>
                <input
                  type="text"
                  value={preferredAirline}
                  onChange={(e) => setPreferredAirline(e.target.value)}
                  placeholder="e.g. Air Canada, WestJet, Delta..."
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-purple-600"
                />
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400">Quick select:</span>
                  {popularAirlines.map((al) => (
                    <button
                      key={al}
                      type="button"
                      onClick={() => setPreferredAirline(al)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                        preferredAirline === al
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {al}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typical Travel Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Primary Travel Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'PLANE', label: 'Flight', icon: Plane },
                    { id: 'CAR', label: 'Road Trip', icon: Compass },
                    { id: 'CRUISE', label: 'Cruise', icon: Heart },
                    { id: 'TRAIN', label: 'Rail', icon: MapPin }
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedTravelType === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedTravelType(mode.id as TravelType)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-700 dark:text-purple-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Unit & Home Airport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Measurement Units
                  </label>
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setPrefWeightUnit('LBS')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        prefWeightUnit === 'LBS'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Pounds (lbs / oz)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefWeightUnit('KG')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        prefWeightUnit === 'KG'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Kilograms (kg / g)
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Home Airport / City
                  </label>
                  <input
                    type="text"
                    value={homeAirport}
                    onChange={(e) => setHomeAirport(e.target.value)}
                    placeholder="e.g. Toronto (YYZ)"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-purple-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FIRST TRAVEL SETUP */}
          {currentStep === 3 && (
            <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  How Would You Like to Start?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You can jump right into setting up an upcoming trip, or test out our free airline baggage calculators first.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left max-w-lg mx-auto">
                <div 
                  onClick={handleStartTripFromStep3}
                  className="p-4 rounded-2xl border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100/60 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      Create My First Trip
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                      Enter dates, destination, and airline to configure your suitcases and packing list.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 inline-flex items-center gap-1 pt-1">
                    <span>Start trip creator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div 
                  onClick={() => {
                    handleComplete();
                    onExploreTools();
                  }}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      Explore Free Tools
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                      Calculate checked baggage fees or browse 42+ airline sizer dimensions first.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 inline-flex items-center gap-1 pt-1">
                    <span>Explore tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REAL FEATURE INTRODUCTION */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Core Tools Included in GateReady
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Everything you need to fly with zero airport surprises:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Calculator className="w-4 h-4 text-purple-600" />
                    <span>Baggage Fee Calculator</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Real airline tables calculating checked fees across ticket fare families.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Plane className="w-4 h-4 text-purple-600" />
                    <span>42+ Airline Guides</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Overhead bin sizers, weight caps, and baggage tariffs verified continuously.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Scale className="w-4 h-4 text-purple-600" />
                    <span>Suitcase Tare Scales</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Automatically subtracts empty bag weight (6–9 lbs) from your allowance.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Wallet className="w-4 h-4 text-purple-600" />
                    <span>Travel Wallet & PNRs</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Save reservation codes, frequent flyer accounts, and passport expiry alerts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETION */}
          {currentStep === 5 && (
            <div className="space-y-5 text-center py-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  You&apos;re All Set to Fly Prepared!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your travel preferences have been saved. You can always restart this tour or update your preferences from your profile settings anytime.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 max-w-sm mx-auto">
                <span>Free account includes <strong>7-Day Platinum Trial</strong> with unlimited bags!</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>{currentStep === 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="h-10 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
