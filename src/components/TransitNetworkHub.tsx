import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Ship, 
  Car, 
  Bus, 
  Plus, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Luggage,
  ArrowRight,
  ShieldCheck,
  Compass,
  Radio
} from 'lucide-react';
import { TravelType } from '../types/travel';

interface TransitNetworkHubProps {
  onOpenAddTrip: (type?: TravelType) => void;
  onOpenTour: () => void;
  onLoadDemo: () => void;
}

interface TransitModeNode {
  type: TravelType;
  title: string;
  tagline: string;
  badge: string;
  color: string;
  borderGlow: string;
  accentBg: string;
  lineColor: string;
  pulseColor: string;
  icon: React.ComponentType<{ className?: string }>;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}

const TRANSIT_MODES: TransitModeNode[] = [
  {
    type: 'PLANE',
    title: 'Flight Network',
    tagline: 'TSA 3-1-1 & Carry-On Scales',
    badge: 'Airspace Ready',
    color: 'text-fuchsia-400 dark:text-fuchsia-300',
    borderGlow: 'border-fuchsia-400/60 shadow-[0_0_15px_rgba(232,121,249,0.35)]',
    accentBg: 'from-fuchsia-950/80 to-purple-950/90',
    lineColor: '#e879f9',
    pulseColor: '#f472b6',
    icon: Plane,
    position: 'top-left'
  },
  {
    type: 'TRAIN',
    title: 'High-Speed Rail',
    tagline: 'Amtrak, VIA & Eurostar Bins',
    badge: 'Tracks Ready',
    color: 'text-emerald-400 dark:text-emerald-300',
    borderGlow: 'border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.35)]',
    accentBg: 'from-emerald-950/80 to-slate-950/90',
    lineColor: '#34d399',
    pulseColor: '#10b981',
    icon: Train,
    position: 'top-right'
  },
  {
    type: 'CRUISE',
    title: 'Ocean Cruise',
    tagline: 'Port Cabin & Luggage Allowances',
    badge: 'Harbor Ready',
    color: 'text-cyan-400 dark:text-cyan-300',
    borderGlow: 'border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.35)]',
    accentBg: 'from-cyan-950/80 to-slate-950/90',
    lineColor: '#22d3ee',
    pulseColor: '#06b6d4',
    icon: Ship,
    position: 'bottom-left'
  },
  {
    type: 'CAR',
    title: 'Road Trip',
    tagline: 'SUV & Trunk Cargo Capacities',
    badge: 'Roads Ready',
    color: 'text-amber-400 dark:text-amber-300',
    borderGlow: 'border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.35)]',
    accentBg: 'from-amber-950/80 to-slate-950/90',
    lineColor: '#fbbf24',
    pulseColor: '#f59e0b',
    icon: Car,
    position: 'bottom-right'
  },
  {
    type: 'BUS',
    title: 'Express Coach',
    tagline: 'Underfloor & Overhead Limits',
    badge: 'Routes Ready',
    color: 'text-indigo-400 dark:text-indigo-300',
    borderGlow: 'border-indigo-400/60 shadow-[0_0_15px_rgba(129,140,248,0.35)]',
    accentBg: 'from-indigo-950/80 to-slate-950/90',
    lineColor: '#818cf8',
    pulseColor: '#6366f1',
    icon: Bus,
    position: 'bottom-center'
  }
];

export const TransitNetworkHub: React.FC<TransitNetworkHubProps> = ({
  onOpenAddTrip,
  onOpenTour,
  onLoadDemo
}) => {
  const [hoveredMode, setHoveredMode] = useState<TravelType | null>(null);

  return (
    <div className="relative w-full min-h-[78vh] flex flex-col items-center justify-center py-10 px-4 sm:px-6 overflow-hidden">
      {/* 1. Cybernetic Blueprint Transit Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-30 bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:28px_28px]" 
        aria-hidden="true" 
      />

      {/* Atmospheric ambient neon glow auras */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />

      {/* 2. SVG Flowing Transit Tracks (Connecting all 5 modes to the central CTA button) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
        viewBox="0 0 1024 720"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle line glow filter */}
          <filter id="transit-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Animated gradients for traveling pulses */}
          <linearGradient id="plane-pulse" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="1" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="train-pulse" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="cruise-pulse" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="car-pulse" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="bus-pulse" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Central Convergence Hub Rings */}
        <circle cx="512" cy="360" r="64" fill="none" stroke="#e879f9" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" filter="url(#transit-glow)">
          <animateTransform attributeName="transform" type="rotate" from="0 512 360" to="360 512 360" dur="20s" repeatCount="indefinite" />
        </circle>
        <circle cx="512" cy="360" r="82" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.35">
          <animateTransform attributeName="transform" type="rotate" from="360 512 360" to="0 512 360" dur="28s" repeatCount="indefinite" />
        </circle>

        {/* --- Path 1: Airplane (Top-Left -> Center Button) --- */}
        <path
          d="M 230 140 C 360 160, 420 280, 480 340"
          fill="none"
          stroke="#e879f9"
          strokeWidth={hoveredMode === 'PLANE' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'PLANE' ? '0.95' : '0.55'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#e879f9" filter="url(#transit-glow)">
          <animateMotion path="M 230 140 C 360 160, 420 280, 480 340" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* --- Path 2: High-Speed Train (Top-Right -> Center Button) --- */}
        <path
          d="M 794 140 C 664 160, 604 280, 544 340"
          fill="none"
          stroke="#34d399"
          strokeWidth={hoveredMode === 'TRAIN' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'TRAIN' ? '0.95' : '0.55'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#34d399" filter="url(#transit-glow)">
          <animateMotion path="M 794 140 C 664 160, 604 280, 544 340" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* --- Path 3: Ocean Cruise (Bottom-Left -> Center Button) --- */}
        <path
          d="M 230 550 C 360 520, 420 420, 480 380"
          fill="none"
          stroke="#22d3ee"
          strokeWidth={hoveredMode === 'CRUISE' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'CRUISE' ? '0.95' : '0.55'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2.2s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#22d3ee" filter="url(#transit-glow)">
          <animateMotion path="M 230 550 C 360 520, 420 420, 480 380" dur="3.8s" repeatCount="indefinite" />
        </circle>

        {/* --- Path 4: Road Trip Car (Bottom-Right -> Center Button) --- */}
        <path
          d="M 794 550 C 664 520, 604 420, 544 380"
          fill="none"
          stroke="#fbbf24"
          strokeWidth={hoveredMode === 'CAR' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'CAR' ? '0.95' : '0.55'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2.1s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#fbbf24" filter="url(#transit-glow)">
          <animateMotion path="M 794 550 C 664 520, 604 420, 544 380" dur="3.4s" repeatCount="indefinite" />
        </circle>

        {/* --- Path 5: Express Bus (Bottom-Center -> Center Button) --- */}
        <path
          d="M 512 620 C 512 520, 512 440, 512 400"
          fill="none"
          stroke="#818cf8"
          strokeWidth={hoveredMode === 'BUS' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'BUS' ? '0.95' : '0.55'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="1.8s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#818cf8" filter="url(#transit-glow)">
          <animateMotion path="M 512 620 C 512 520, 512 440, 512 400" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* 3. Top Banner: Trips Ready Status Rail */}
      <div className="relative z-10 mb-6 sm:mb-8 flex items-center justify-center">
        <div className="px-4 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-950/90 border border-purple-500/40 shadow-lg shadow-purple-950/40 backdrop-blur-md flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <span>All Transit Modes Connected</span>
            <span className="text-purple-400">·</span>
            <span className="text-emerald-400 font-extrabold">Trips Ready</span>
          </span>
        </div>
      </div>

      {/* 4. Desktop Layout Grid: Outer Transit Nodes Framing the Central Launchpad */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Top Nodes Row (Airplane & Train on desktop) */}
        <div className="hidden lg:flex items-center justify-between mb-8 px-4">
          {/* Airplane Node (Top-Left) */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('PLANE')}
            onMouseEnter={() => setHoveredMode('PLANE')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`group text-left p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-purple-950/80 to-slate-950/95 border-2 ${TRANSIT_MODES[0].borderGlow} transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer max-w-[260px] shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-fuchsia-950/80 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-300 group-hover:text-white transition-colors shrink-0 shadow-[0_0_12px_rgba(232,121,249,0.3)]">
                <Plane className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white group-hover:text-fuchsia-300 transition-colors">
                    Flights
                  </span>
                  <span className="text-[9px] font-bold text-fuchsia-300 bg-fuchsia-950/80 border border-fuchsia-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  TSA 3-1-1 & Luggage Caps
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-purple-800/40 flex items-center justify-between text-[10px] font-semibold text-fuchsia-300/90 group-hover:text-fuchsia-200">
              <span>Start Flight Plan</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* High-Speed Train Node (Top-Right) */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('TRAIN')}
            onMouseEnter={() => setHoveredMode('TRAIN')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`group text-left p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-emerald-950/80 to-slate-950/95 border-2 ${TRANSIT_MODES[1].borderGlow} transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer max-w-[260px] shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors shrink-0 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                <Train className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                    High-Speed Rail
                  </span>
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Amtrak, VIA & Eurostar Bins
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] font-semibold text-emerald-300/90 group-hover:text-emerald-200">
              <span>Start Train Trip</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Central Core: Launchpad Card with "Create Your Trip" Center Hub */}
        <div className="relative max-w-lg mx-auto text-center px-4">
          {/* Target Junction Ring */}
          <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
            {/* Outer rotating pulse aura */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 blur-lg opacity-60 animate-pulse" />
            
            {/* Inner Metallic Monogram Hub */}
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.5),inset_0_0_12px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center text-white">
              {/* Suitcase Monogram Icon */}
              <Luggage className="w-9 h-9 text-fuchsia-300 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-200 mt-0.5">
                GateReady
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
            Ready to pack?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 mb-6 max-w-md mx-auto leading-relaxed">
            All 5 travel networks are synced. Track airline baggage weights, carry-on liquid limits, rail racks, and cabin rules before departure.
          </p>

          {/* Central Epicenter: "Create Your Trip" CTA Target */}
          <div className="relative inline-block w-full sm:w-auto">
            {/* Pulsing Target Glow under the button */}
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500 rounded-2xl blur-md opacity-75 animate-pulse" />

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => onOpenAddTrip()}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-fuchsia-600/30 transition-all cursor-pointer border-2 border-fuchsia-300/40"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>Create Your Trip</span>
              </button>

              <button
                type="button"
                onClick={onOpenTour}
                className="w-full sm:w-auto h-13 px-6 rounded-2xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-slate-800 active:scale-95 text-purple-950 dark:text-purple-200 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <span>Watch Tour</span>
              </button>
            </div>
          </div>

          {/* 1-Click Sample Demo Trip Exploration */}
          <div className="mt-5">
            <button
              type="button"
              onClick={onLoadDemo}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Explore with a sample demo trip (1-click)</span>
            </button>
          </div>
        </div>

        {/* Bottom Nodes Row (Cruise Ship, Express Bus & Road Trip on desktop) */}
        <div className="hidden lg:flex items-center justify-between mt-8 px-4">
          {/* Cruise Ship Node (Bottom-Left) */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('CRUISE')}
            onMouseEnter={() => setHoveredMode('CRUISE')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`group text-left p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-cyan-950/80 to-slate-950/95 border-2 ${TRANSIT_MODES[2].borderGlow} transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer max-w-[260px] shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:text-white transition-colors shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                <Ship className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                    Ocean Cruise
                  </span>
                  <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Port Cabin & Stateroom Rules
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-cyan-800/40 flex items-center justify-between text-[10px] font-semibold text-cyan-300/90 group-hover:text-cyan-200">
              <span>Start Cruise Trip</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Express Coach Bus Node (Bottom-Center) */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('BUS')}
            onMouseEnter={() => setHoveredMode('BUS')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`group text-left p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-indigo-950/80 to-slate-950/95 border-2 ${TRANSIT_MODES[4].borderGlow} transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer max-w-[240px] shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-400/50 flex items-center justify-center text-indigo-300 group-hover:text-white transition-colors shrink-0 shadow-[0_0_12px_rgba(129,140,248,0.3)]">
                <Bus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">
                    Express Bus
                  </span>
                  <span className="text-[9px] font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Overhead & Underfloor Caps
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-indigo-800/40 flex items-center justify-between text-[10px] font-semibold text-indigo-300/90 group-hover:text-indigo-200">
              <span>Start Bus Trip</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Road Trip Car Node (Bottom-Right) */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('CAR')}
            onMouseEnter={() => setHoveredMode('CAR')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`group text-left p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-amber-950/80 to-slate-950/95 border-2 ${TRANSIT_MODES[3].borderGlow} transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer max-w-[260px] shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:text-white transition-colors shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                <Car className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                    Road Trip
                  </span>
                  <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Trunk & Cargo Dimensions
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-amber-800/40 flex items-center justify-between text-[10px] font-semibold text-amber-300/90 group-hover:text-amber-200">
              <span>Start Road Trip</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* 5. Mobile & Tablet: Horizontal Scrollable / Compact Grid of all 5 Transit Modes */}
        <div className="lg:hidden mt-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-center text-slate-400 dark:text-slate-500 mb-3">
            Quick Launch by Travel Mode
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {TRANSIT_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.type}
                  type="button"
                  onClick={() => onOpenAddTrip(mode.type)}
                  className={`p-3 rounded-2xl bg-slate-900/90 dark:bg-slate-950 border ${mode.borderGlow} text-left flex items-center gap-2.5 active:scale-95 transition-all cursor-pointer`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {mode.title}
                    </p>
                    <span className="text-[9px] font-semibold text-emerald-400 flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Trips Ready
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
