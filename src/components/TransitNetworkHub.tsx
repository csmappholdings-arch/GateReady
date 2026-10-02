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
  Luggage,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { TravelType } from '../types/travel';

interface TransitNetworkHubProps {
  onOpenAddTrip: (type?: TravelType) => void;
  onOpenTour: () => void;
  onLoadDemo: () => void;
}

export const TransitNetworkHub: React.FC<TransitNetworkHubProps> = ({
  onOpenAddTrip,
  onOpenTour,
  onLoadDemo
}) => {
  const [hoveredMode, setHoveredMode] = useState<TravelType | null>(null);

  const TRANSIT_MODES = [
    {
      type: 'PLANE' as TravelType,
      title: 'Flights & Airlines',
      tagline: 'TSA 3-1-1 Liquids, Carry-On & Checked Luggage',
      icon: Plane,
      color: 'text-fuchsia-400',
      borderGlow: 'border-fuchsia-400/60 shadow-[0_0_15px_rgba(232,121,249,0.25)]',
      accentBg: 'bg-fuchsia-950/80 border-fuchsia-400/40 text-fuchsia-300',
      details: 'Commercial airlines, gate security & overhead dimensions'
    },
    {
      type: 'TRAIN' as TravelType,
      title: 'High-Speed Rail',
      tagline: 'Coach Luggage Racks & Platform Bins',
      icon: Train,
      color: 'text-emerald-400',
      borderGlow: 'border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.25)]',
      accentBg: 'bg-emerald-950/80 border-emerald-400/40 text-emerald-300',
      details: 'Intercity rail, Shinkansen, Eurostar, Amtrak & VIA Rail'
    },
    {
      type: 'CRUISE' as TravelType,
      title: 'Ocean Cruise',
      tagline: 'Staterooms, Embarkation Bags & Port Rules',
      icon: Ship,
      color: 'text-cyan-400',
      borderGlow: 'border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.25)]',
      accentBg: 'bg-cyan-950/80 border-cyan-400/40 text-cyan-300',
      details: 'Cruise ships, port luggage tags & cabin electrical limits'
    },
    {
      type: 'BUS' as TravelType,
      title: 'Express Bus',
      tagline: 'Underfloor Cargo & Overhead Racks',
      icon: Bus,
      color: 'text-indigo-400',
      borderGlow: 'border-indigo-400/60 shadow-[0_0_15px_rgba(129,140,248,0.25)]',
      accentBg: 'bg-indigo-950/80 border-indigo-400/40 text-indigo-300',
      details: 'Regional coach routes & intercity shuttle carriers'
    },
    {
      type: 'CAR' as TravelType,
      title: 'Road Trip',
      tagline: 'Trunk Cargo, Rooftop Boxes & Car Sizing',
      icon: Car,
      color: 'text-amber-400',
      borderGlow: 'border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.25)]',
      accentBg: 'bg-amber-950/80 border-amber-400/40 text-amber-300',
      details: 'Automobile trunk space, compacts, sedans & SUVs'
    }
  ];

  return (
    <div className="relative w-full py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[660px] overflow-hidden select-none">
      {/* 1. Ambient Background Map Grid & Radial Blueprint Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 dark:opacity-35" aria-hidden="true">
        <div 
          className="absolute inset-0 bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:28px_28px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Stylized Transit Vector Trunk Lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" 
        viewBox="0 0 1024 720" 
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="transit-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Path 1: Flights (Top-Left -> Center Button) */}
        <path
          d="M 230 170 C 350 190, 420 290, 512 350"
          fill="none"
          stroke="#e879f9"
          strokeWidth={hoveredMode === 'PLANE' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'PLANE' ? '0.95' : '0.45'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#e879f9" filter="url(#transit-glow)">
          <animateMotion path="M 230 170 C 350 190, 420 290, 512 350" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* Path 2: High-Speed Rail (Top-Right -> Center Button) */}
        <path
          d="M 794 170 C 674 190, 604 290, 512 350"
          fill="none"
          stroke="#34d399"
          strokeWidth={hoveredMode === 'TRAIN' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'TRAIN' ? '0.95' : '0.45'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2.2s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#34d399" filter="url(#transit-glow)">
          <animateMotion path="M 794 170 C 674 190, 604 290, 512 350" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Path 3: Ocean Cruise (Bottom-Left -> Center Button) */}
        <path
          d="M 230 520 C 360 490, 420 400, 480 370"
          fill="none"
          stroke="#22d3ee"
          strokeWidth={hoveredMode === 'CRUISE' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'CRUISE' ? '0.95' : '0.45'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2.6s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#22d3ee" filter="url(#transit-glow)">
          <animateMotion path="M 230 520 C 360 490, 420 400, 480 370" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Path 4: Road Trip Car (Bottom-Right -> Center Button) */}
        <path
          d="M 794 520 C 664 490, 604 400, 544 370"
          fill="none"
          stroke="#fbbf24"
          strokeWidth={hoveredMode === 'CAR' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'CAR' ? '0.95' : '0.45'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="2.1s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#fbbf24" filter="url(#transit-glow)">
          <animateMotion path="M 794 520 C 664 490, 604 400, 544 370" dur="3.4s" repeatCount="indefinite" />
        </circle>

        {/* Path 5: Express Bus (Bottom-Center -> Center Button) */}
        <path
          d="M 512 590 C 512 500, 512 430, 512 390"
          fill="none"
          stroke="#818cf8"
          strokeWidth={hoveredMode === 'BUS' ? '3.5' : '2'}
          strokeDasharray="6 6"
          strokeOpacity={hoveredMode === 'BUS' ? '0.95' : '0.45'}
          filter="url(#transit-glow)"
          className="transition-all duration-300"
        >
          <animate attributeName="stroke-dashoffset" from="48" to="0" dur="1.8s" repeatCount="indefinite" />
        </path>
        <circle r="4.5" fill="#818cf8" filter="url(#transit-glow)">
          <animateMotion path="M 512 590 C 512 500, 512 430, 512 390" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* 3. Clean, Minimal Status Indicator */}
      <div className="relative z-10 mb-6 flex items-center justify-center">
        <div className="px-4 py-1.5 rounded-full bg-slate-900/80 dark:bg-slate-950/80 border border-purple-500/30 backdrop-blur-md flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-300 tracking-wide">
            Global Transit Network · All 5 Travel Modes Synced
          </span>
        </div>
      </div>

      {/* 4. Desktop Layout Grid */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Top Nodes Row: Flights (Left) & Rail (Right) */}
        <div className="hidden lg:flex items-start justify-between mb-8 px-4">
          {/* Card 1: Flights */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('PLANE')}
            onMouseEnter={() => setHoveredMode('PLANE')}
            onMouseLeave={() => setHoveredMode(null)}
            className="group text-left p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-purple-950/90 to-slate-950/95 border-2 border-fuchsia-400/60 shadow-[0_0_15px_rgba(232,121,249,0.3)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer w-[280px] backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-950/80 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-300 group-hover:text-white transition-colors shrink-0">
                <Plane className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white group-hover:text-fuchsia-300 transition-colors">
                    Flights & Airlines
                  </span>
                  <span className="text-[9px] font-bold text-fuchsia-300 bg-fuchsia-950/80 border border-fuchsia-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  TSA 3-1-1 & Carry-On Rules
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-purple-800/40 flex items-center justify-between text-[10px] font-medium text-purple-300/90">
              <span>Carry-on & checked bag limits</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: High-Speed Rail */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('TRAIN')}
            onMouseEnter={() => setHoveredMode('TRAIN')}
            onMouseLeave={() => setHoveredMode(null)}
            className="group text-left p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-emerald-950/90 to-slate-950/95 border-2 border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer w-[280px] backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors shrink-0">
                <Train className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                    High-Speed Rail
                  </span>
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Coach Racks & Platform Bins
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] font-medium text-emerald-300/90">
              <span>Amtrak, Eurostar, VIA & Shinkansen</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Central Core: Launchpad Card with "Create Your Trip" Center Hub */}
        <div className="relative max-w-lg mx-auto text-center px-4 my-2">
          {/* Central Monogram Ring */}
          <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 blur-lg opacity-50 animate-pulse" />
            
            <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.45)] flex flex-col items-center justify-center text-white">
              <Luggage className="w-8 h-8 text-fuchsia-300 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
              <span className="text-[8px] font-black uppercase tracking-wider text-purple-200 mt-0.5">
                GateReady
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
            Ready to pack?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 mb-5 max-w-md mx-auto leading-relaxed">
            All 5 travel networks are synced. Track airline baggage weights, carry-on liquid limits, rail racks, and cabin rules for any destination worldwide.
          </p>

          {/* Central Epicenter: "Create Your Trip" CTA Target */}
          <div className="relative inline-block w-full sm:w-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500 rounded-2xl blur-md opacity-75 animate-pulse" />

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => onOpenAddTrip()}
                className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-fuchsia-600/30 transition-all cursor-pointer border-2 border-fuchsia-300/40"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>Create Your Trip</span>
              </button>

              <button
                type="button"
                onClick={onOpenTour}
                className="w-full sm:w-auto h-12 px-5 rounded-2xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-slate-800 active:scale-95 text-purple-950 dark:text-purple-200 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
                <span>Watch Tour</span>
              </button>
            </div>
          </div>

          {/* 1-Click Sample Demo Trip Exploration */}
          <div className="mt-3.5 mb-2">
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

        {/* Bottom Nodes Row: Cruise Ship (Left), Express Bus (Center) & Road Trip (Right) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-8 px-4">
          {/* Card 3: Ocean Cruise */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('CRUISE')}
            onMouseEnter={() => setHoveredMode('CRUISE')}
            onMouseLeave={() => setHoveredMode(null)}
            className="group text-left p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-cyan-950/90 to-slate-950/95 border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer w-full backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:text-white transition-colors shrink-0">
                <Ship className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                    Ocean Cruise
                  </span>
                  <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Port Cabin & Luggage Rules
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-cyan-800/40 flex items-center justify-between text-[10px] font-medium text-cyan-300/90">
              <span>Staterooms, luggage tags & port security</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Express Bus */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('BUS')}
            onMouseEnter={() => setHoveredMode('BUS')}
            onMouseLeave={() => setHoveredMode(null)}
            className="group text-left p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-indigo-950/90 to-slate-950/95 border-2 border-indigo-400/60 shadow-[0_0_15px_rgba(129,140,248,0.3)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer w-full backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-400/50 flex items-center justify-center text-indigo-300 group-hover:text-white transition-colors shrink-0">
                <Bus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
                    Express Bus
                  </span>
                  <span className="text-[9px] font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Underfloor Cargo & Overhead Bins
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-indigo-800/40 flex items-center justify-between text-[10px] font-medium text-indigo-300/90">
              <span>Intercity coach & express routes</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 5: Road Trip */}
          <button
            type="button"
            onClick={() => onOpenAddTrip('CAR')}
            onMouseEnter={() => setHoveredMode('CAR')}
            onMouseLeave={() => setHoveredMode(null)}
            className="group text-left p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-amber-950/90 to-slate-950/95 border-2 border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer w-full backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:text-white transition-colors shrink-0">
                <Car className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                    Road Trip
                  </span>
                  <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-700/50 px-1.5 py-0.2 rounded-md">
                    Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Trunk Cargo & Rooftop Boxes
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-amber-800/40 flex items-center justify-between text-[10px] font-medium text-amber-300/90">
              <span>Compacts, sedans, SUVs & gear</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* 5. Mobile & Tablet: Clean Cards */}
        <div className="lg:hidden mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRANSIT_MODES.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => onOpenAddTrip(m.type)}
                  className={`p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950 border-2 ${m.borderGlow} text-left flex flex-col justify-between shadow-lg active:scale-98 transition-all cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl ${m.accentBg} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white">
                          {m.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {m.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-600/50 px-1.5 py-0.5 rounded-md shrink-0">
                      Ready
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>{m.details}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
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
