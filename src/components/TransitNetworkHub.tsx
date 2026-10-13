import React from 'react';
import { 
  Plane, 
  Train, 
  Ship, 
  Car, 
  Bus, 
  Plus, 
  Play, 
  Sparkles
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
  return (
    <div className="relative w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] overflow-x-hidden">
      {/* 1. Ambient Background Map Grid & Soft Radial Glow Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 dark:opacity-35" aria-hidden="true">
        <div 
          className="absolute inset-0 bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:28px_28px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Center Create Your Trip Card - Clean, Focused, Uncluttered & Front-and-Center */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-purple-950/90 to-slate-950/95 border-2 border-fuchsia-400/80 shadow-[0_0_35px_rgba(217,70,239,0.45)] backdrop-blur-xl relative overflow-hidden group text-center">
          {/* Pulsing ambient aura */}
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-fuchsia-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Status pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-fuchsia-400/50 text-[10px] font-black uppercase tracking-wider text-fuchsia-200 shadow-xs mb-3">
            <Sparkles className="w-3 h-3 text-fuchsia-300 animate-pulse" />
            <span>Central Travel Nexus</span>
          </div>

          {/* Header Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Create Your Trip
          </h2>
          <p className="text-xs text-purple-200/90 mt-1.5 mb-5 max-w-xs mx-auto leading-relaxed">
            Smart luggage weight meters, TSA liquid limits, and cabin allowances across all 5 travel networks.
          </p>

          {/* Big Primary CTA Button */}
          <div className="relative w-full mb-3.5">
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500 rounded-2xl blur-xs opacity-90 animate-pulse pointer-events-none" />
            <button
              type="button"
              onClick={() => onOpenAddTrip()}
              className="relative w-full h-13 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-fuchsia-600/40 transition-all cursor-pointer border border-fuchsia-200/50"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Create Your Trip</span>
            </button>
          </div>

          {/* Quick Launch Travel Mode Selector (5 Modes) */}
          <div className="w-full mb-4 pt-3 border-t border-purple-800/40">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300/80 block mb-2">
              Or select your travel mode:
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAddTrip('PLANE')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 hover:bg-fuchsia-950/80 border border-purple-700/50 hover:border-fuchsia-400/80 text-purple-200 hover:text-white transition-all cursor-pointer group/mode active:scale-95"
                title="Start Flights Trip"
              >
                <Plane className="w-4 h-4 text-fuchsia-400 group-hover/mode:scale-110 transition-transform" />
                <span className="text-[9px] font-bold mt-1">Flight</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAddTrip('TRAIN')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 hover:bg-emerald-950/80 border border-purple-700/50 hover:border-emerald-400/80 text-purple-200 hover:text-white transition-all cursor-pointer group/mode active:scale-95"
                title="Start Train Trip"
              >
                <Train className="w-4 h-4 text-emerald-400 group-hover/mode:scale-110 transition-transform" />
                <span className="text-[9px] font-bold mt-1">Train</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAddTrip('CRUISE')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 hover:bg-cyan-950/80 border border-purple-700/50 hover:border-cyan-400/80 text-purple-200 hover:text-white transition-all cursor-pointer group/mode active:scale-95"
                title="Start Cruise Trip"
              >
                <Ship className="w-4 h-4 text-cyan-400 group-hover/mode:scale-110 transition-transform" />
                <span className="text-[9px] font-bold mt-1">Cruise</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAddTrip('CAR')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 hover:bg-amber-950/80 border border-purple-700/50 hover:border-amber-400/80 text-purple-200 hover:text-white transition-all cursor-pointer group/mode active:scale-95"
                title="Start Road Trip"
              >
                <Car className="w-4 h-4 text-amber-400 group-hover/mode:scale-110 transition-transform" />
                <span className="text-[9px] font-bold mt-1">Road</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAddTrip('BUS')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-950/60 hover:bg-indigo-950/80 border border-purple-700/50 hover:border-indigo-400/80 text-purple-200 hover:text-white transition-all cursor-pointer group/mode active:scale-95"
                title="Start Express Bus Trip"
              >
                <Bus className="w-4 h-4 text-indigo-400 group-hover/mode:scale-110 transition-transform" />
                <span className="text-[9px] font-bold mt-1">Bus</span>
              </button>
            </div>
          </div>

          {/* Secondary Buttons: Watch Tour & Sample Demo */}
          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={onOpenTour}
              className="flex-1 h-9 px-3 rounded-xl border border-purple-400/40 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Play className="w-2 h-2 fill-white ml-0.5" />
              </div>
              <span>Watch Tour</span>
            </button>

            <button
              type="button"
              onClick={onLoadDemo}
              className="flex-1 h-9 px-3 rounded-xl border border-purple-400/40 bg-purple-900/60 hover:bg-purple-800/80 active:scale-95 text-purple-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Trip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
