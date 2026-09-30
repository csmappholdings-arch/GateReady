import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Luggage, 
  Scale, 
  Sparkles, 
  CloudSun, 
  Zap, 
  CheckCircle2, 
  QrCode, 
  FileDown, 
  Crown, 
  X, 
  Volume2, 
  VolumeX,
  Plane,
  ShieldCheck,
  Smartphone,
  Users
} from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  tagline: string;
  description: string;
  duration: number; // seconds
  icon: any;
  color: string;
  features: string[];
  mockupType: 'TRIP_SETUP' | 'BAGGAGE_WEIGHT' | 'TRIP_INTEL' | 'CABIN_PLUGS' | 'GATE_READY';
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'intro',
    title: 'Welcome to Gate Ready',
    tagline: 'The Ultimate Smart Travel & Packing Assistant',
    description: 'Gate Ready eliminates airport gate anxiety by calculating strict baggage weight limits, TSA 3-1-1 carry-on liquid compliance, and aircraft cabin restrictions before you leave home.',
    duration: 6,
    icon: Plane,
    color: 'from-purple-600 to-indigo-600',
    features: [
      'Multi-modal trip planning (Flights, Trains, Cruises, Road Trips, Coaches)',
      'Multi-traveler tracking for parents, kids, and companions',
      'Automated airport code lookup & carrier auto-complete (42+ airlines)'
    ],
    mockupType: 'TRIP_SETUP'
  },
  {
    id: 'bags',
    title: 'Smart Baggage & Live Scales',
    tagline: 'Never pay surprise airport overweight fees',
    description: 'Pack bag-by-bag with real-time weight meters calibrated to airline caps (50 lbs / 23 kg checked, 22 lbs carry-on). Real-time TSA 3-1-1 liquid alerts ensure no toiletries get confiscated at security.',
    duration: 7,
    icon: Luggage,
    color: 'from-blue-600 to-indigo-600',
    features: [
      'Live total bag weight meter with visual yellow/red overload warning bars',
      'Instant carry-on liquids compliance scanner (≤ 3.4 oz / 100 ml per bottle)',
      'One-tap luggage presets: Business, Beach Resort, Ski Trip, Toddler & Baby kits'
    ],
    mockupType: 'BAGGAGE_WEIGHT'
  },
  {
    id: 'intel',
    title: 'Destination Intel & Climate Advisor',
    tagline: 'Pack precisely for local forecasts & local currencies',
    description: 'Gate Ready analyzes real destination weather forecasts to recommend rain gear, sunscreen, or warm layers, plus calculates your exact local currency cash vs. digital tap-to-pay mix.',
    duration: 6,
    icon: CloudSun,
    color: 'from-amber-500 to-rose-500',
    features: [
      'Live destination climate alerts & tailored seasonal packing warnings',
      'Local currency cash calculator (Japan, Europe, Mexico, UK, Caribbean)',
      'Pre-departure home security, passport & medical checklists'
    ],
    mockupType: 'TRIP_INTEL'
  },
  {
    id: 'cabin',
    title: 'Aircraft Cabin Intel & In-Seat Plugs',
    tagline: 'Know your in-seat AC outlets & overhead bin risks',
    description: 'Flying on a Boeing 787, 737 MAX, or Airbus A321? Check seat-back AC power outlets, USB-C ports, Wi-Fi availability, and overhead bin depth before stepping aboard.',
    duration: 6,
    icon: Zap,
    color: 'from-violet-600 to-purple-600',
    features: [
      'Detailed power specs for 20+ commercial planes & train coach classes',
      'Overhead bin sizing warnings to prevent gate-checking your roller bag',
      'Laptop charger wattages & plug adapter requirements'
    ],
    mockupType: 'CABIN_PLUGS'
  },
  {
    id: 'recovery',
    title: 'Gate Ready Verification & Privacy QR Tags',
    tagline: 'Fly with total confidence & secure bag recovery',
    description: 'Run the final Gate Ready audit for peace of mind. Pro travelers generate privacy-safe QR luggage tags—protecting your home address while giving airlines instant WhatsApp & phone recovery.',
    duration: 6,
    icon: CheckCircle2,
    color: 'from-emerald-600 to-teal-600',
    features: [
      'Final Gate Ready readiness pass score for departure day',
      'Emergency privacy-safe QR Luggage Tags & printable claim sheets (Pro)',
      'One-tap high-resolution formatted PDF packing list exports (Pro)'
    ],
    mockupType: 'GATE_READY'
  }
];

interface WalkthroughVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTripDialog?: () => void;
}

export const WalkthroughVideoModal: React.FC<WalkthroughVideoModalProps> = ({
  isOpen,
  onClose,
  onOpenTripDialog
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100% of current step
  const [isMuted, setIsMuted] = useState(false);

  const step = WALKTHROUGH_STEPS[currentStepIndex];

  // Auto-play animation timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalMs = 50;
    const totalStepMs = step.duration * 1000;
    const increment = (intervalMs / totalStepMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          // Transition to next slide
          if (currentStepIndex < WALKTHROUGH_STEPS.length - 1) {
            setCurrentStepIndex((idx) => idx + 1);
            return 0;
          } else {
            // Reached end, pause or loop
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentStepIndex, step.duration]);

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleNext = () => {
    if (currentStepIndex < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
      if (onOpenTripDialog) onOpenTripDialog();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    setProgress(0);
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-4xl my-auto bg-slate-900 text-white rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden flex flex-col max-h-[95vh] cursor-default relative z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Video Player Bar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Play className="w-4 h-4 fill-purple-300 ml-0.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black flex items-center gap-2">
                <span>Gate Ready Product Tour & Guide</span>
                <span className="text-[10px] bg-purple-500/30 text-purple-300 border border-purple-400/30 font-bold px-2 py-0.2 rounded-full hidden sm:inline">
                  Interactive Video Walkthrough
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Step {currentStepIndex + 1} of {WALKTHROUGH_STEPS.length}: {step.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close walkthrough"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Story Progress Bars (Instagram / YouTube Stories style) */}
        <div className="px-5 pt-3 pb-1 bg-slate-950/60 flex items-center gap-1.5">
          {WALKTHROUGH_STEPS.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden cursor-pointer group"
                title={`Go to ${s.title}`}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 transition-all"
                  style={{
                    width: isCompleted ? '100%' : isCurrent ? `${progress}%` : '0%'
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Main Interactive Screenplay Stage */}
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Narrative & Voiceover Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
              {React.createElement(step.icon, { className: 'w-4 h-4' })}
              <span>{step.tagline}</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {step.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Core Capabilities Checklist */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Key Highlights:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {step.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Visual Simulated App UI Demo / Interactive Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
              {/* Simulated Browser Chrome Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[10px] text-slate-500">gateready.app</span>
                </div>
                <span className="text-[10px] font-bold text-purple-400">Live Interactive Demonstration</span>
              </div>

              {/* Dynamic Mockup View based on Step */}
              {step.mockupType === 'TRIP_SETUP' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Active Journey</span>
                      <h4 className="text-sm font-black text-white">Tokyo Vacation 2026</h4>
                      <p className="text-[11px] text-purple-200">Toronto (YYZ) → Tokyo Haneda (HND) • Air Canada</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold shadow-xs">
                      Flight
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Travelers</span>
                      <p className="font-bold text-white mt-0.5">Family (Mom, Dad, Toddler)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Luggage Allowance</span>
                      <p className="font-bold text-emerald-400 mt-0.5">2 Free Bags + Unlimited (Pro)</p>
                    </div>
                  </div>
                </div>
              )}

              {step.mockupType === 'BAGGAGE_WEIGHT' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Luggage className="w-4 h-4 text-purple-400" />
                        <span>Suitcase (Checked Luggage)</span>
                      </span>
                      <span className="text-xs font-black text-emerald-400">42.5 / 50.0 lbs (85%)</span>
                    </div>

                    {/* Animated Progress Meter */}
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full w-[85%]" />
                    </div>
                    <p className="text-[10px] text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Safe weight — 7.5 lbs headroom before overweight fees
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        3-1-1
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">TSA Liquids Pass Verified</p>
                        <p className="text-[10px] text-slate-400">All carry-on bottles ≤ 3.4 oz in 1-quart bag</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Compliant</span>
                  </div>
                </div>
              )}

              {step.mockupType === 'TRIP_INTEL' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Tokyo Forecast Advisory</span>
                      <h4 className="text-sm font-black text-white">18°C / 64°F — Spring Mild Breeze</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">Light rain expected Thursday. Light jacket & travel umbrella recommended.</p>
                    </div>
                    <CloudSun className="w-8 h-8 text-amber-400 shrink-0" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Payment Intel</span>
                      <p className="font-bold text-white">Japan: 70% Card / 30% Cash Recommended</p>
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded-md">¥ Yen Advised</span>
                  </div>
                </div>
              )}

              {step.mockupType === 'CABIN_PLUGS' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-violet-400" />
                        <span>Boeing 787-9 Dreamliner Cabin Specs</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">High Power</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="p-2 rounded bg-slate-900/80">⚡ 110V AC In-Seat Power (Every Seat)</div>
                      <div className="p-2 rounded bg-slate-900/80">🔌 High-Speed USB-A & USB-C</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Overhead Bin Clearance: Deep Pivot Bins (Standard Rollers Fit on Side)</span>
                    <span className="text-emerald-400 font-bold">No Gate-Check Risk</span>
                  </div>
                </div>
              )}

              {step.mockupType === 'GATE_READY' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
                        100%
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">Gate Ready Pass Issued</h4>
                        <p className="text-[11px] text-emerald-300">Luggage weights verified • Liquids certified • Passport ready</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-[11px]">Emergency QR Bag Tag</p>
                        <p className="text-[10px] text-slate-400">Protects home address</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                      <FileDown className="w-5 h-5 text-purple-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-[11px]">Formatted PDF List</p>
                        <p className="text-[10px] text-slate-400">One-tap print / offline</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Playback Controls Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Slide {currentStepIndex + 1} of {WALKTHROUGH_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="h-9 px-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="h-9 px-4 sm:px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentStepIndex === WALKTHROUGH_STEPS.length - 1 ? 'Start Packing Now' : 'Next Feature'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
