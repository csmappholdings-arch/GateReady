import React from 'react';
import { 
  Plane, 
  Train, 
  Ship, 
  Car, 
  Bus, 
  Plus, 
  Play, 
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Scale,
  Globe,
  Compass,
  CheckCircle,
  Clock
} from 'lucide-react';
import { TravelType } from '../types/travel';

interface TransitNetworkHubProps {
  onOpenAddTrip: (type?: TravelType, destinationCity?: string) => void;
  onOpenTour: () => void;
  onLoadDemo: () => void;
}

export const TransitNetworkHub: React.FC<TransitNetworkHubProps> = ({
  onOpenAddTrip,
  onOpenTour,
  onLoadDemo
}) => {
  return (
    <div className="relative w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center justify-start min-h-[calc(100vh-140px)] overflow-x-hidden">
      {/* 1. Ambient Background Map Grid & Soft Radial Glow Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 dark:opacity-35" aria-hidden="true">
        <div 
          className="absolute inset-0 bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:28px_28px]" 
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Expanded Container conforming to the window size */}
      <div className="relative z-10 w-full max-w-[1550px] mx-auto space-y-6">
        
        {/* Hub Header: Spreading out with aviation spice from left to right */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 border border-purple-800/50 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-600/30 shrink-0">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400">
                  Global Gate Dispatch
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Corridor Hub
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Central Travel & Baggage Nexus
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
            {/* 1-Click Demo Trip */}
            <button
              type="button"
              onClick={onLoadDemo}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer border border-amber-300/40 active:scale-95"
              title="Instantly populate a Paris & London sample trip"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Load Sample Demo Trip</span>
            </button>

            {/* Watch Interactive Tour */}
            <button
              type="button"
              onClick={onOpenTour}
              className="h-10 px-3.5 rounded-xl border border-purple-400/40 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch 60s Tour</span>
            </button>
          </div>
        </div>

        {/* 3-Column Command Deck Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: Trip Launcher Card (4 cols) - Subordinate to the main Hero CTA */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900/95 via-purple-950/90 to-slate-950/95 border border-purple-800/60 shadow-md backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider text-purple-200 shadow-xs mb-3">
                <Sparkles className="w-3 h-3 text-purple-300" />
                <span>Smart Overweight Protection</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                Create Your Next Trip
              </h3>
              <p className="text-xs text-purple-200/90 mt-2 mb-6 leading-relaxed">
                Configure your baggage tare limits, liquids checklist, and packing distribution across airline, rail, or cruise networks with real-time audit tools.
              </p>

              {/* Secondary Entry Button - cleanly subordinate to the primary hero CTA */}
              <div className="w-full mb-4">
                <button
                  type="button"
                  onClick={() => onOpenAddTrip()}
                  className="w-full h-11 px-5 rounded-2xl bg-purple-700/80 hover:bg-purple-600 active:scale-98 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-purple-400/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Trip Planner</span>
                </button>
              </div>
            </div>

            {/* Quick Benefits & Stats */}
            <div className="pt-4 border-t border-purple-800/40 space-y-2 text-[11px] text-purple-200/80 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Automatic suitcase tare deduction (5–12 lbs saved)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>TSA 3-1-1 toiletry checker & volume converter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>42+ airline sizer limits & checked luggage rules</span>
              </div>
            </div>
          </div>

          {/* Column 2: 5 Transit Network Modes with Specifications (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-purple-200/90 dark:border-purple-900/80 shadow-lg backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-950/60 mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                    Mode Selector
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    Select by Transit Corridor
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  Custom rules per vehicle
                </span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Commercial Flight */}
                <button
                  type="button"
                  onClick={() => onOpenAddTrip('PLANE')}
                  className="w-full p-3 rounded-2xl bg-purple-50/70 dark:bg-slate-800/80 hover:bg-purple-100/80 dark:hover:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">Commercial Aviation</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-200/70 dark:bg-purple-950 text-purple-800 dark:text-purple-300">42 Airlines</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">100ml TSA liquids, 22lb carry-on, empty suitcase tare</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. High-Speed Rail */}
                <button
                  type="button"
                  onClick={() => onOpenAddTrip('TRAIN')}
                  className="w-full p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Train className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">Passenger Rail (Amtrak / VIA)</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">Generous</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">2x 50lb carry-ons free, overhead luggage rack alerts</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 3. Cruise Line */}
                <button
                  type="button"
                  onClick={() => onOpenAddTrip('CRUISE')}
                  className="w-full p-3 rounded-2xl bg-cyan-50/70 dark:bg-slate-800/80 hover:bg-cyan-100/80 dark:hover:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800/60 text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">Ocean & River Cruise</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-200/70 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">Stateroom Tags</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">No strict bag limits, embarkation day bag check</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 4. Road & Overland */}
                <button
                  type="button"
                  onClick={() => onOpenAddTrip('CAR')}
                  className="w-full p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 hover:bg-amber-100/80 dark:hover:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">Road Trip & Overlanding</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200/70 dark:bg-amber-950 text-amber-800 dark:text-amber-300">Trunk Volume</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Vehicle trunk capacity & multi-passenger distribution</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 5. Intercity Bus */}
                <button
                  type="button"
                  onClick={() => onOpenAddTrip('BUS')}
                  className="w-full p-3 rounded-2xl bg-fuchsia-50/70 dark:bg-slate-800/80 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-950/60 border border-fuchsia-200/60 dark:border-fuchsia-800/60 text-left transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">Coach & Express Bus</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-fuchsia-200/70 dark:bg-fuchsia-950 text-fuchsia-800 dark:text-fuchsia-300">Undercarriage</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">1x 50lb under-coach bin + 1 small overhead carry-on</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-fuchsia-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Corridor Destination Launchers & Instant Demo (3 cols) */}
          <div className="lg:col-span-3 p-6 sm:p-7 rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 border border-purple-800/60 shadow-xl backdrop-blur-xl flex flex-col justify-between text-white space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                Popular Corridors
              </span>
              <h4 className="text-base font-black text-white mt-0.5 mb-3">
                1-Click Quick Destinations
              </h4>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAddTrip('PLANE', 'London, UK')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">Toronto ➔ London (LHR)</span>
                    <span className="text-[10px] text-purple-300">Air Canada · 23kg check limit</span>
                  </div>
                  <Plane className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAddTrip('PLANE', 'Paris, France')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">New York ➔ Paris (CDG)</span>
                    <span className="text-[10px] text-purple-300">Air France · 12kg cabin sizer</span>
                  </div>
                  <Plane className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAddTrip('PLANE', 'Tokyo, Japan')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">Vancouver ➔ Tokyo (HND)</span>
                    <span className="text-[10px] text-purple-300">ANA / JAL · 2x 23kg bags free</span>
                  </div>
                  <Plane className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAddTrip('CAR', 'Banff, Canada')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">Calgary ➔ Banff Rockies</span>
                    <span className="text-[10px] text-purple-300">Road Trip · Mountain Gear</span>
                  </div>
                  <Car className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Instant Demo Feature Highlight Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-600/20 border border-amber-400/40 text-xs">
              <div className="flex items-center gap-1.5 font-black text-amber-300 mb-1">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                <span>Want to see it live?</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                Load a pre-configured sample trip with bags, items, and countdown timers in 1 click.
              </p>
              <button
                type="button"
                onClick={onLoadDemo}
                className="w-full py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Launch Instant Demo
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
