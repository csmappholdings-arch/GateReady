import React, { useState, useEffect, useRef } from 'react';
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
  Compass,
  MapPin,
  Droplets,
  Footprints,
  Train,
  Ship,
  Bus,
  Car,
  ShieldCheck,
  Smartphone,
  Users,
  Check,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

interface WalkthroughStep {
  id: string;
  title: string;
  tagline: string;
  description: string;
  duration: number; // seconds
  icon: any;
  color: string;
  isPro?: boolean;
  features: string[];
  mockupType: 'TRIP_SETUP' | 'BAGGAGE_WEIGHT' | 'TRIP_INTEL' | 'TERMINAL_MAPS' | 'CABIN_PLUGS' | 'QR_RECOVERY' | 'PRO_VS_FREE';
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'intro',
    title: '1. Multi-Modal Global Transit Network',
    tagline: 'Flights, High-Speed Rail, Cruises, Buses & Road Trips',
    description: 'Gate Ready syncs across all 5 world travel networks. Whether flying with carry-on liquid limits, taking European or Japanese rail, embarking on an ocean cruise, boarding an express coach, or hitting the open highway, Gate Ready tailors regulations and allowances to your journey.',
    duration: 6.5,
    icon: Plane,
    color: 'from-purple-600 to-indigo-600',
    features: [
      'All 5 major transit modes synced: Air, Rail, Cruise, Bus, Car',
      'Global airport & station auto-complete across 40+ international airlines',
      'Multi-traveler profiles for families, solo explorers, and group trips'
    ],
    mockupType: 'TRIP_SETUP'
  },
  {
    id: 'bags',
    title: '2. Smart Luggage Scales & TSA 3-1-1 Liquids',
    tagline: 'Eliminate surprise overweight fees & security confiscations',
    description: 'Pack bag-by-bag with real-time digital weight meters calibrated to airline caps (50 lbs / 23 kg checked, 22 lbs carry-on). Color-coded warning bars alert you before you hit overweight fee penalties, while the automated TSA 3-1-1 scanner ensures every toiletry bottle is compliant.',
    duration: 7,
    icon: Luggage,
    color: 'from-blue-600 to-indigo-600',
    features: [
      'Live bag weight meters with headroom alerts before overweight fees trigger',
      'TSA 3-1-1 liquids compliance verification (under 3.4 oz / 100 ml per bottle)',
      '1-tap luggage presets: Business, Beach Resort, Ski Trip, Toddler & Baby kits'
    ],
    mockupType: 'BAGGAGE_WEIGHT'
  },
  {
    id: 'intel',
    title: '3. Destination Climate & Currency Advisor',
    tagline: 'Pack for local weather and cash vs. digital payments',
    description: 'Gate Ready pulls destination weather forecasts to recommend rain layers, warm coats, or sun protection. It also calculates your destination payment profile—specifying whether you will need local cash (e.g., Japan, Germany) or if digital tap-to-pay is accepted everywhere.',
    duration: 6.5,
    icon: CloudSun,
    color: 'from-amber-500 to-rose-500',
    features: [
      'Destination climate forecast with tailored seasonal packing warnings',
      'Local currency breakdown: Cash vs. Contactless card mix for 50+ countries',
      'Pre-departure home security, passport validity & medication checklists'
    ],
    mockupType: 'TRIP_INTEL'
  },
  {
    id: 'terminal_maps',
    title: '4. [PRO] Worldwide Terminal Maps & Phone Radar',
    tagline: 'Post-security cold water stations, restrooms & gate wayfinding',
    description: 'Gate Ready Pro unlocks dynamic terminal schematics for major global airports, high-speed rail stations, and cruise terminals. Use your phone location beacon to calculate real-time walking distance and time to the nearest cold water refill station (saving $6+ per bottle) and restrooms along your gate path.',
    duration: 7.5,
    icon: Compass,
    color: 'from-cyan-600 to-blue-600',
    isPro: true,
    features: [
      'Dynamic departure & arrival terminal hub maps (Airports, Rail & Cruise Ports)',
      'Live Phone Location Radar: Walking distance & ETA to nearest amenities',
      'Spotlight post-security cold water refill stations and ADA-accessible restrooms'
    ],
    mockupType: 'TERMINAL_MAPS'
  },
  {
    id: 'cabin',
    title: '5. [PRO] Aircraft Cabin Intel & In-Seat Power',
    tagline: 'AC power outlets, USB-C watts & overhead bin dimensions',
    description: 'Never get stuck with a dead laptop or a gate-checked roller bag. Gate Ready Pro provides seat-back electrical outlet maps (110V AC vs USB-C PD wattages) and overhead bin clearances for 20+ commercial aircraft (Boeing 787, 737 MAX, Airbus A350, A321neo) and train coach classes.',
    duration: 6.5,
    icon: Zap,
    color: 'from-violet-600 to-purple-600',
    isPro: true,
    features: [
      'In-seat AC power outlet availability & USB-C fast-charging wattage specs',
      'Overhead bin geometry & pivot bin warnings to prevent gate-checking',
      'Rail coach luggage rack space for Amtrak, Eurostar, Shinkansen & VIA Rail'
    ],
    mockupType: 'CABIN_PLUGS'
  },
  {
    id: 'recovery',
    title: '6. [PRO] Privacy QR Luggage Tags & PDF Exports',
    tagline: 'Conceal home address with instant WhatsApp bag recovery',
    description: 'Gate Ready Pro issues smart privacy-safe QR luggage tags. Unlike traditional luggage tags that display your home address to onlookers, these QR tags allow airlines and good Samaritans to contact you directly via WhatsApp or encrypted phone. Export high-resolution formatted PDF lists for one-tap printing.',
    duration: 6.5,
    icon: QrCode,
    color: 'from-emerald-600 to-teal-600',
    isPro: true,
    features: [
      'Privacy-safe QR luggage tags protecting your home address from public view',
      'Direct WhatsApp & phone contact recovery if airline mishandles luggage',
      'High-resolution formatted PDF packing lists and departure audit exports'
    ],
    mockupType: 'QR_RECOVERY'
  },
  {
    id: 'pro_vs_free',
    title: '7. Gate Ready Pro vs Free Comparison',
    tagline: 'Everything you need for seamless, stress-free travel',
    description: 'Start free with essential baggage weight meters and packing checklists. When you want complete peace of mind, upgrade to Gate Ready Pro to unlock unlimited bags, interactive terminal maps with live phone radar, privacy QR tags, and aircraft power intel.',
    duration: 7.5,
    icon: Crown,
    color: 'from-purple-600 to-fuchsia-600',
    isPro: true,
    features: [
      'Free: 2 bags, live weight scales, TSA 3-1-1 checker, destination climate',
      'Pro: Unlimited bags, Terminal Maps with Phone Radar, Privacy QR Tags, Cabin Plugs',
      'Instant activation with 30-day money-back guarantee'
    ],
    mockupType: 'PRO_VS_FREE'
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
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5>(1);
  const { isPro, openPaywall } = useSubscription();

  const step = WALKTHROUGH_STEPS[currentStepIndex];

  // Self-contained Web Audio API chime on slide transition (when unmuted)
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = () => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore audio synthesis errors on strict autoplay policies
    }
  };

  // Auto-play animation timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalMs = 50;
    const totalStepMs = (step.duration / playbackSpeed) * 1000;
    const increment = (intervalMs / totalStepMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          // Transition to next slide
          if (currentStepIndex < WALKTHROUGH_STEPS.length - 1) {
            setCurrentStepIndex((idx) => {
              const nextIdx = idx + 1;
              playChime();
              return nextIdx;
            });
            return 0;
          } else {
            // Reached end, pause
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentStepIndex, step.duration, playbackSpeed, isMuted]);

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
      playChime();
    } else {
      onClose();
      if (onOpenTripDialog) onOpenTripDialog();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setProgress(0);
      playChime();
    }
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    setProgress(0);
    playChime();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setProgress(0);
    setIsPlaying(true);
    playChime();
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
        <div className="px-5 py-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Play className="w-4 h-4 fill-purple-300 ml-0.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black flex items-center gap-2">
                <span>Gate Ready Product Tour & Guide</span>
                <span className="text-[10px] bg-purple-500/30 text-purple-300 border border-purple-400/30 font-bold px-2 py-0.2 rounded-full hidden sm:inline">
                  Interactive Walkthrough
                </span>
                {step.isPro && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 px-2 py-0.2 rounded-full flex items-center gap-1 shadow-sm">
                    <Crown className="w-3 h-3 fill-purple-950" /> Pro Feature
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Step {currentStepIndex + 1} of {WALKTHROUGH_STEPS.length}: {step.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Toggle */}
            <button
              type="button"
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : 1)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>

            {/* Audio Chime Mute/Unmute */}
            <button
              type="button"
              onClick={() => {
                setIsMuted(!isMuted);
                if (isMuted) playChime();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-300" />}
            </button>

            {/* Restart */}
            <button
              type="button"
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
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
                className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden cursor-pointer group relative"
                title={`Go to ${s.title}`}
              >
                <div
                  className={`h-full transition-all ${
                    s.isPro 
                      ? 'bg-gradient-to-r from-amber-400 to-fuchsia-400' 
                      : 'bg-gradient-to-r from-purple-400 to-indigo-400'
                  }`}
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
              {React.createElement(step.icon, { className: 'w-4 h-4 text-purple-300' })}
              <span>{step.tagline}</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight flex items-center gap-2">
                <span>{step.title}</span>
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

            {/* Quick Action if Pro Feature */}
            {step.isPro && !isPro && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pro feature included in all Gate Ready Pro plans</span>
                </div>
                <button
                  type="button"
                  onClick={() => openPaywall('tour_prompt')}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-purple-950 text-[10px] font-black uppercase tracking-wider cursor-pointer shrink-0 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            )}
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
                <span className="text-[10px] font-bold text-purple-400">Live Feature Showcase</span>
              </div>

              {/* 1. Dynamic Mockup: TRIP_SETUP */}
              {step.mockupType === 'TRIP_SETUP' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">5 Syncable Transit Networks</span>
                      <h4 className="text-sm font-black text-white">Paris Vacation · Multi-Modal</h4>
                      <p className="text-[11px] text-purple-200">New York (JFK) → Paris (CDG) • Air France</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold shadow-xs">
                      Flights
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold text-slate-300">
                    <div className="p-2 rounded-xl bg-purple-950/80 border border-fuchsia-400/50 text-fuchsia-300">
                      <Plane className="w-4 h-4 mx-auto mb-1" />
                      <span>Flights</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300">
                      <Train className="w-4 h-4 mx-auto mb-1" />
                      <span>Rail</span>
                    </div>
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300">
                      <Ship className="w-4 h-4 mx-auto mb-1" />
                      <span>Cruise</span>
                    </div>
                    <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-400/50 text-indigo-300">
                      <Bus className="w-4 h-4 mx-auto mb-1" />
                      <span>Bus</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-400/50 text-amber-300">
                      <Car className="w-4 h-4 mx-auto mb-1" />
                      <span>Road Trip</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Travelers</span>
                      <p className="font-bold text-white mt-0.5">Family (Mom, Dad, Child)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Luggage Allowance</span>
                      <p className="font-bold text-emerald-400 mt-0.5">2 Free Bags + Unlimited (Pro)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Dynamic Mockup: BAGGAGE_WEIGHT */}
              {step.mockupType === 'BAGGAGE_WEIGHT' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Luggage className="w-4 h-4 text-purple-400" />
                        <span>Suitcase (Checked Bag 1)</span>
                      </span>
                      <span className="text-xs font-black text-emerald-400">42.5 / 50.0 lbs (85%)</span>
                    </div>

                    {/* Animated Progress Meter */}
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full w-[85%]" />
                    </div>
                    <p className="text-[10px] text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Safe weight — 7.5 lbs headroom before $100 overweight fees
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        3-1-1
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">TSA Liquids Pass Verified</p>
                        <p className="text-[10px] text-slate-400">All carry-on bottles ≤ 3.4 oz in 1 clear quart bag</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Compliant</span>
                  </div>
                </div>
              )}

              {/* 3. Dynamic Mockup: TRIP_INTEL */}
              {step.mockupType === 'TRIP_INTEL' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Paris Forecast Advisory</span>
                      <h4 className="text-sm font-black text-white">16°C / 61°F — Spring Mild Afternoon</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">Scattered light showers. Pack light trench coat & compact travel umbrella.</p>
                    </div>
                    <CloudSun className="w-8 h-8 text-amber-400 shrink-0" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Destination Payment Profile</span>
                      <p className="font-bold text-white">France: 90% Contactless Card / 10% Cash</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md">€ Euro Tap-to-Pay</span>
                  </div>
                </div>
              )}

              {/* 4. Dynamic Mockup: TERMINAL_MAPS (PRO) */}
              {step.mockupType === 'TERMINAL_MAPS' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                        <Compass className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">CDG Terminal 2E Wayfinding</h4>
                        <p className="text-[10px] text-cyan-200">Post-Security Airside Concourse K</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" /> Pro Feature
                    </span>
                  </div>

                  {/* Simulated Terminal Schematic Canvas */}
                  <div className="relative h-28 rounded-xl bg-slate-900 border border-slate-800 p-2 overflow-hidden flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                    
                    {/* SVG vectors connecting phone to amenities */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="45" y1="56" x2="160" y2="35" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="45" y1="56" x2="260" y2="75" stroke="#ec4899" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                    </svg>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 relative z-10">
                      <span>Gate K32 · Concourse Center</span>
                      <span className="text-emerald-400 font-bold">Airside Verified</span>
                    </div>

                    <div className="relative z-10 flex items-center justify-around">
                      {/* Phone Beacon */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center ring-4 ring-blue-500/30 animate-pulse shadow-md">
                          <Smartphone className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-black text-blue-300 mt-1">You Are Here</span>
                      </div>

                      {/* Water Bottle Station */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md">
                          <Droplets className="w-3.5 h-3.5 fill-slate-950" />
                        </div>
                        <span className="text-[9px] font-bold text-cyan-300 mt-1">Water (45m · 35s)</span>
                      </div>

                      {/* Restroom */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md">
                          <span className="text-[10px] font-black">WC</span>
                        </div>
                        <span className="text-[9px] font-bold text-pink-300 mt-1">Restroom (65m)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 relative z-10">
                      <span className="text-cyan-300 font-bold">Filtered Cold Water</span>
                      <span className="text-pink-300 font-bold">ADA Restroom</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Dynamic Mockup: CABIN_PLUGS (PRO) */}
              {step.mockupType === 'CABIN_PLUGS' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-violet-400" />
                        <span>Boeing 787-9 Dreamliner Cabin Specs</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">High Power In-Seat</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                        ⚡ 110V AC In-Seat Power (Every Seat)
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                        🔌 65W High-Speed USB-C PD
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Overhead Bin Clearance: Deep Pivot Bins (Rollers fit on side)</span>
                    <span className="text-emerald-400 font-bold">Zero Gate-Check Risk</span>
                  </div>
                </div>
              )}

              {/* 6. Dynamic Mockup: QR_RECOVERY (PRO) */}
              {step.mockupType === 'QR_RECOVERY' && (
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
                        <p className="text-[10px] text-emerald-400">Home address hidden</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                      <FileDown className="w-5 h-5 text-purple-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-[11px]">Formatted PDF List</p>
                        <p className="text-[10px] text-slate-400">Printable offline sheet</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Dynamic Mockup: PRO_VS_FREE */}
              {step.mockupType === 'PRO_VS_FREE' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {/* Free Card */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Starter</span>
                      <p className="font-black text-white text-sm">$0 Free Forever</p>
                      <ul className="space-y-1 text-[10px] text-slate-300 pt-1">
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Up to 2 Luggage Bags</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Live Weight Scales</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> TSA 3-1-1 Liquid Checker</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0" /> Climate & Weather Forecast</li>
                      </ul>
                    </div>

                    {/* Pro Card */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 border-2 border-amber-400/80 space-y-1.5 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Crown className="w-3 h-3 fill-amber-400" /> Pro Edition
                        </span>
                        <span className="text-[9px] bg-amber-400 text-purple-950 font-bold px-1.5 py-0.2 rounded">Best</span>
                      </div>
                      <p className="font-black text-white text-sm">$4.99 / trip or $19 / yr</p>
                      <ul className="space-y-1 text-[10px] text-purple-200 pt-1">
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 shrink-0" /> Unlimited Bags & Scales</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 shrink-0" /> Terminal Maps & Phone Radar</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 shrink-0" /> Water Refill & Restroom GPS</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 shrink-0" /> Privacy QR Tags & PDF Exports</li>
                        <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400 shrink-0" /> Aircraft Seat Plugs & USB Watts</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openPaywall('tour_footer')}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 hover:from-amber-300 hover:to-fuchsia-400 text-purple-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 fill-purple-950" />
                      <span>Unlock Gate Ready Pro</span>
                    </button>
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
