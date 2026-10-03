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
  ShieldCheck,
  Compass
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
    <div className="relative w-full py-8 sm:py-10 px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[660px] overflow-hidden select-none">
      {/* 1. Ambient Background Map Grid & Radial Blueprint Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 dark:opacity-35" aria-hidden="true">
        <div 
          className="absolute inset-0 bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:28px_28px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Clean, Minimal Status Indicator */}
      <div className="relative z-10 mb-5 flex items-center justify-center">
        <div className="px-4 py-1.5 rounded-full bg-slate-900/80 dark:bg-slate-950/80 border border-purple-500/30 backdrop-blur-md flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-300 tracking-wide">
            Global Transit Network · All 5 Travel Modes Synced
          </span>
        </div>
      </div>

      {/* 3. Wide Desktop Layout with Cards on Far Sides & Precise Travel Lines Connecting to Center */}
      <div className="relative z-10 w-full max-w-7xl mx-auto hidden lg:block min-h-[560px]">
        {/* Stylized Transit Vector Trunk Lines connecting Far Sides to Center on Layer z-20 */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-20" 
          viewBox="0 0 1200 600" 
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* userSpaceOnUse ensures filter region NEVER clips 0-height or flat paths */}
            <filter id="transit-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* PATH 1: FLIGHTS (Far Left Top Card -> Center GateReady Icon)    */}
          {/* ============================================================== */}
          {/* Base Track Bed */}
          <path
            d="M 300 85 C 410 95, 480 200, 555 265"
            fill="none"
            stroke="#e879f9"
            strokeWidth="6"
            strokeOpacity="0.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Animated Dashed Line */}
          <path
            d="M 300 85 C 410 95, 480 200, 555 265"
            fill="none"
            stroke="#e879f9"
            strokeWidth={hoveredMode === 'PLANE' ? '4.5' : '3.5'}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="8 6"
            strokeOpacity={hoveredMode === 'PLANE' ? '1' : '0.85'}
            filter="url(#transit-glow)"
            className="transition-all duration-300"
          >
            <animate attributeName="stroke-dashoffset" from="56" to="0" dur="2s" repeatCount="indefinite" />
          </path>
          <g filter="url(#transit-glow)">
            <animateMotion 
              path="M 300 85 C 410 95, 480 200, 555 265" 
              dur="3.4s" 
              repeatCount="indefinite" 
              rotate="auto" 
            />
            {/* Dynamic Scaling: 3X at Departure -> Compact at Center Entry (0.6x) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="scale" 
                values="3; 0.6" 
                keyTimes="0; 1" 
                dur="3.4s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                values="1; 1; 0.85; 0" 
                keyTimes="0; 0.85; 0.95; 1" 
                dur="3.4s" 
                repeatCount="indefinite" 
              />
              {/* Airplane Symbol */}
              <line x1="-16" y1="-3" x2="-26" y2="-3" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <line x1="-16" y1="3" x2="-26" y2="3" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <path 
                d="M 16 0 L 8 -4 L -6 -13 L -9 -12 L -5 -4 L -14 -4 L -17 -8 L -19 -8 L -17 0 L -19 8 L -17 8 L -14 4 L -5 4 L -9 12 L -6 13 L 8 4 Z" 
                fill="#1e1035" 
                stroke="#e879f9" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
              <path d="M 12 0 L 7 -2 L 7 2 Z" fill="#e879f9" />
              <line x1="2" y1="-6" x2="-2" y2="-6" stroke="#e879f9" strokeWidth="1.5" />
              <line x1="2" y1="6" x2="-2" y2="6" stroke="#e879f9" strokeWidth="1.5" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* PATH 2: EXPRESS BUS (Far Left Middle Card -> Center GateReady)  */}
          {/* ============================================================== */}
          {/* Bus Highway Track Bed - ALWAYS VISIBLE, NO MATTER WHAT */}
          <path
            d="M 300 270 C 390 270, 465 295, 545 300"
            fill="none"
            stroke="#818cf8"
            strokeWidth="7"
            strokeOpacity="0.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bus Boundary Rails */}
          <path
            d="M 300 266 C 390 266, 465 291, 545 296"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 300 274 C 390 274, 465 299, 545 304"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bus Animated Dashed Line with High Contrast */}
          <path
            d="M 300 270 C 390 270, 465 295, 545 300"
            fill="none"
            stroke="#818cf8"
            strokeWidth={hoveredMode === 'BUS' ? '5' : '4'}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="8 6"
            strokeOpacity={hoveredMode === 'BUS' ? '1' : '0.95'}
            filter="url(#transit-glow)"
            className="transition-all duration-300"
          >
            <animate attributeName="stroke-dashoffset" from="56" to="0" dur="2s" repeatCount="indefinite" />
          </path>
          <g filter="url(#transit-glow)">
            <animateMotion 
              path="M 300 270 C 390 270, 465 295, 545 300" 
              dur="3.2s" 
              repeatCount="indefinite" 
              rotate="auto" 
            />
            {/* Dynamic Scaling: 3X at Departure -> Compact at Center Entry (0.6x) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="scale" 
                values="3; 0.6" 
                keyTimes="0; 1" 
                dur="3.2s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                values="1; 1; 0.85; 0" 
                keyTimes="0; 0.85; 0.95; 1" 
                dur="3.2s" 
                repeatCount="indefinite" 
              />
              {/* Express Coach Bus Symbol with Headlights */}
              <line x1="-16" y1="-3" x2="-26" y2="-3" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <line x1="-16" y1="3" x2="-26" y2="3" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <rect 
                x="-16" 
                y="-7" 
                width="30" 
                height="14" 
                rx="3" 
                fill="#131438" 
                stroke="#818cf8" 
                strokeWidth="2" 
              />
              <path d="M 8 -5 L 12 -5 C 13 -5, 13.5 -3, 13.5 0 C 13.5 3, 13 5, 12 5 L 8 5 Z" fill="#818cf8" />
              <rect x="1" y="-5" width="5" height="3" rx="0.5" fill="#818cf8" fillOpacity="0.85" />
              <rect x="-6" y="-5" width="5" height="3" rx="0.5" fill="#818cf8" fillOpacity="0.85" />
              <rect x="-13" y="-5" width="5" height="3" rx="0.5" fill="#818cf8" fillOpacity="0.85" />
              <rect x="1" y="2" width="5" height="3" rx="0.5" fill="#818cf8" fillOpacity="0.85" />
              <rect x="-6" y="2" width="5" height="3" rx="0.5" fill="#818cf8" fillOpacity="0.85" />
              <rect x="-13" y="2" width="5" height="3" rx="0.5" fill="#818cf8" fillOpacity="0.85" />
              <circle cx="13" cy="-4" r="1.5" fill="#fef08a" />
              <circle cx="13" cy="4" r="1.5" fill="#fef08a" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* PATH 3: OCEAN CRUISE (Far Left Bottom Card -> Center GateReady) */}
          {/* ============================================================== */}
          {/* Base Track Bed */}
          <path
            d="M 300 475 C 410 465, 480 370, 555 335"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="6"
            strokeOpacity="0.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Animated Dashed Line */}
          <path
            d="M 300 475 C 410 465, 480 370, 555 335"
            fill="none"
            stroke="#22d3ee"
            strokeWidth={hoveredMode === 'CRUISE' ? '4.5' : '3.5'}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="8 6"
            strokeOpacity={hoveredMode === 'CRUISE' ? '1' : '0.85'}
            filter="url(#transit-glow)"
            className="transition-all duration-300"
          >
            <animate attributeName="stroke-dashoffset" from="56" to="0" dur="2.4s" repeatCount="indefinite" />
          </path>
          <g filter="url(#transit-glow)">
            <animateMotion 
              path="M 300 475 C 410 465, 480 370, 555 335" 
              dur="4.0s" 
              repeatCount="indefinite" 
              rotate="auto" 
            />
            {/* Dynamic Scaling: 3X at Departure -> Compact at Center Entry (0.6x) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="scale" 
                values="3; 0.6" 
                keyTimes="0; 1" 
                dur="4.0s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                values="1; 1; 0.85; 0" 
                keyTimes="0; 0.85; 0.95; 1" 
                dur="4.0s" 
                repeatCount="indefinite" 
              />
              {/* Cruise Ship Symbol */}
              <path d="M -16 -4 C -20 -6, -24 -3, -28 -5" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.75" />
              <path d="M -16 4 C -20 6, -24 3, -28 5" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.75" />
              <path 
                d="M 17 0 L 10 7 L -14 7 L -17 4 L -17 -4 L -14 -7 L 10 -7 Z" 
                fill="#082f38" 
                stroke="#22d3ee" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
              <rect x="-10" y="-4" width="16" height="8" rx="2" fill="#0e4a57" stroke="#22d3ee" strokeWidth="1" />
              <rect x="-6" y="-2" width="4" height="4" rx="1" fill="#f43f5e" />
              <polygon points="6,-3 11,0 6,3" fill="#22d3ee" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* PATH 4: HIGH-SPEED RAIL (Far Right Top Card -> Center GateReady)*/}
          {/* ============================================================== */}
          {/* Base Track Bed */}
          <path
            d="M 900 85 C 790 95, 720 200, 645 265"
            fill="none"
            stroke="#34d399"
            strokeWidth="6"
            strokeOpacity="0.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Animated Dashed Line */}
          <path
            d="M 900 85 C 790 95, 720 200, 645 265"
            fill="none"
            stroke="#34d399"
            strokeWidth={hoveredMode === 'TRAIN' ? '4.5' : '3.5'}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="8 6"
            strokeOpacity={hoveredMode === 'TRAIN' ? '1' : '0.85'}
            filter="url(#transit-glow)"
            className="transition-all duration-300"
          >
            <animate attributeName="stroke-dashoffset" from="56" to="0" dur="2.2s" repeatCount="indefinite" />
          </path>
          <g filter="url(#transit-glow)">
            <animateMotion 
              path="M 900 85 C 790 95, 720 200, 645 265" 
              dur="3.6s" 
              repeatCount="indefinite" 
              rotate="auto" 
            />
            {/* Dynamic Scaling: 3X at Departure -> Compact at Center Entry (0.6x) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="scale" 
                values="3; 0.6" 
                keyTimes="0; 1" 
                dur="3.6s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                values="1; 1; 0.85; 0" 
                keyTimes="0; 0.85; 0.95; 1" 
                dur="3.6s" 
                repeatCount="indefinite" 
              />
              {/* Bullet Train Symbol */}
              <line x1="-16" y1="-3" x2="-26" y2="-3" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <line x1="-16" y1="3" x2="-26" y2="3" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <path 
                d="M 16 0 C 16 3, 13 6, 8 6 L -14 6 C -16 6, -17 5, -17 3 L -17 -3 C -17 -5, -16 -6, -14 -6 L 8 -6 C 13 -6, 16 -3, 16 0 Z" 
                fill="#06281e" 
                stroke="#34d399" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
              <path d="M 8 -4 L 13 0 L 8 4 Z" fill="#34d399" />
              <rect x="0" y="-4" width="5" height="3" rx="1" fill="#34d399" />
              <rect x="-7" y="-4" width="5" height="3" rx="1" fill="#34d399" />
              <rect x="0" y="1" width="5" height="3" rx="1" fill="#34d399" />
              <rect x="-7" y="1" width="5" height="3" rx="1" fill="#34d399" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* PATH 5: ROAD TRIP (Far Right Bottom Card -> Center GateReady)   */}
          {/* ============================================================== */}
          {/* Base Track Bed */}
          <path
            d="M 900 475 C 790 465, 720 370, 645 335"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="6"
            strokeOpacity="0.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Animated Dashed Line */}
          <path
            d="M 900 475 C 790 465, 720 370, 645 335"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={hoveredMode === 'CAR' ? '4.5' : '3.5'}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="8 6"
            strokeOpacity={hoveredMode === 'CAR' ? '1' : '0.85'}
            filter="url(#transit-glow)"
            className="transition-all duration-300"
          >
            <animate attributeName="stroke-dashoffset" from="56" to="0" dur="2.1s" repeatCount="indefinite" />
          </path>
          <g filter="url(#transit-glow)">
            <animateMotion 
              path="M 900 475 C 790 465, 720 370, 645 335" 
              dur="3.5s" 
              repeatCount="indefinite" 
              rotate="auto" 
            />
            {/* Dynamic Scaling: 3X at Departure -> Compact at Center Entry (0.6x) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="scale" 
                values="3; 0.6" 
                keyTimes="0; 1" 
                dur="3.5s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                values="1; 1; 0.85; 0" 
                keyTimes="0; 0.85; 0.95; 1" 
                dur="3.5s" 
                repeatCount="indefinite" 
              />
              {/* Road Trip SUV Symbol */}
              <line x1="-15" y1="-3" x2="-24" y2="-3" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <line x1="-15" y1="3" x2="-24" y2="3" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3 3" />
              <rect x="-7" y="-8.5" width="12" height="2" rx="1" fill="#f59e0b" />
              <path 
                d="M 14 0 C 14 2, 12 5, 8 5 L -12 5 C -14 5, -15 3, -15 0 C -15 -3, -14 -5, -12 -5 L 8 -5 C 12 -5, 14 -2, 14 0 Z" 
                fill="#2b1f06" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
              <path d="M 5 -4 L 11 0 L 5 4 Z" fill="#fbbf24" />
              <rect x="-4" y="-3.5" width="7" height="3" rx="1" fill="#fde68a" fillOpacity="0.9" />
              <rect x="-4" y="0.5" width="7" height="3" rx="1" fill="#fde68a" fillOpacity="0.9" />
              <circle cx="13" cy="-2.5" r="1.5" fill="#fef08a" />
              <circle cx="13" cy="2.5" r="1.5" fill="#fef08a" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* PATH 6: CENTRAL ENERGY LINK (Center GateReady -> Action Hub)   */}
          {/* ============================================================== */}
          <path
            d="M 655 300 C 735 295, 810 270, 900 270"
            fill="none"
            stroke="#c084fc"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="4 4"
            strokeOpacity="0.75"
            filter="url(#transit-glow)"
          >
            <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1.8s" repeatCount="indefinite" />
          </path>
        </svg>

        {/* 3-Column Desktop Grid: Left Cards (Far Left) | Center Convergence Hub | Right Cards (Far Right) */}
        <div className="grid grid-cols-12 items-center min-h-[560px] relative z-10">
          {/* LEFT COLUMN: Far Left (col-span-3) -> 1. Flights, 2. Express Bus, 3. Ocean Cruise */}
          <div className="col-span-3 flex flex-col justify-between h-[540px] py-1">
            {/* Card 1: Flights & Airlines (Top-Left) */}
            <button
              type="button"
              onClick={() => onOpenAddTrip('PLANE')}
              onMouseEnter={() => setHoveredMode('PLANE')}
              onMouseLeave={() => setHoveredMode(null)}
              className="group text-left p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-purple-950/90 to-slate-950/95 border-2 border-fuchsia-400/60 shadow-[0_0_15px_rgba(232,121,249,0.3)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer w-full backdrop-blur-md"
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
                <span>Carry-on & checked limits</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card 2: Express Bus (Middle-Left - BETWEEN Flights & Ocean Cruise) */}
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
                    Underfloor Cargo & Bins
                  </p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-indigo-800/40 flex items-center justify-between text-[10px] font-medium text-indigo-300/90">
                <span>Intercity coach & express routes</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card 3: Ocean Cruise (Bottom-Left) */}
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
                <span>Staterooms, tags & port security</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* CENTER COLUMN: Center (col-span-6) -> GateReady Purple Icon Meeting Point */}
          <div className="col-span-6 flex flex-col items-center justify-center text-center px-4 py-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm mb-3">
              Ready to pack?
            </h2>

            {/* Central Monogram Ring Meeting Point */}
            <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-3 flex items-center justify-center group">
              {/* Animated Multi-Layer Glow Aura */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 blur-xl opacity-75 animate-pulse" />
              <div className="absolute -inset-2 rounded-full border border-fuchsia-400/40 animate-spin" style={{ animationDuration: '14s' }} />
              <div className="absolute -inset-5 rounded-full border border-purple-500/25 border-dashed animate-spin" style={{ animationDuration: '24s', animationDirection: 'reverse' }} />

              {/* Central Purple Monogram Card */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.6)] flex flex-col items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
                <Luggage className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-300 drop-shadow-[0_0_12px_rgba(232,121,249,0.9)]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-200 mt-0.5">
                  GateReady
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
              All 5 world travel networks meet here. Smart weights, carry-on liquids & cabin intel.
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-400/40 text-[10px] font-bold text-purple-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
              <span>Central Convergence Hub</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Far Right (col-span-3) -> 1. High-Speed Rail, 2. Create Your Trip & Tour Buttons, 3. Road Trip */}
          <div className="col-span-3 flex flex-col justify-between h-[540px] py-1">
            {/* Card 4: High-Speed Rail (Top-Right) */}
            <button
              type="button"
              onClick={() => onOpenAddTrip('TRAIN')}
              onMouseEnter={() => setHoveredMode('TRAIN')}
              onMouseLeave={() => setHoveredMode(null)}
              className="group text-left p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-emerald-950/90 to-slate-950/95 border-2 border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer w-full backdrop-blur-md"
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

            {/* Action Hub Panel: "Create Your Trip" and "Watch Tour" Buttons (Middle-Right - BETWEEN Rail & Road Trip) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-purple-950/80 to-slate-950/95 border-2 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-md flex flex-col items-center gap-2.5">
              {/* Primary "Create Your Trip" Button */}
              <div className="relative w-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-500 rounded-xl blur-xs opacity-80 animate-pulse" />
                <button
                  type="button"
                  onClick={() => onOpenAddTrip()}
                  className="relative w-full h-11 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/30 transition-all cursor-pointer border border-fuchsia-300/40"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create Your Trip</span>
                </button>
              </div>

              {/* Secondary "Watch Tour" Button */}
              <button
                type="button"
                onClick={onOpenTour}
                className="w-full h-10 px-4 rounded-xl border border-purple-300/40 dark:border-purple-700/50 bg-white/10 dark:bg-slate-900/80 hover:bg-white/20 dark:hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
                <span>Watch Tour</span>
              </button>

              {/* 1-Click Sample Demo Trip Exploration */}
              <button
                type="button"
                onClick={onLoadDemo}
                className="text-[11px] font-bold text-purple-300 hover:text-white hover:underline inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer pt-0.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Explore sample demo trip (1-click)</span>
              </button>
            </div>

            {/* Card 5: Road Trip (Bottom-Right) */}
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
        </div>
      </div>

      {/* 4. Mobile & Tablet: Clean Responsive Layout (< lg) */}
      <div className="lg:hidden w-full max-w-xl relative z-10 flex flex-col items-center">
        {/* Central GateReady Monogram Ring on Mobile */}
        <div className="relative mx-auto w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 blur-lg opacity-60 animate-pulse" />
          <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.5)] flex flex-col items-center justify-center text-white">
            <Luggage className="w-8 h-8 text-fuchsia-300 drop-shadow-[0_0_8px_rgba(232,121,249,0.9)]" />
            <span className="text-[8px] font-black uppercase tracking-wider text-purple-200 mt-0.5">
              GateReady
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center">
          Ready to pack?
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 text-center mt-1 mb-4 max-w-xs leading-relaxed">
          All 5 travel networks synced for weights, liquids, and cabin rules.
        </p>

        {/* Action Buttons on Mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full mb-6">
          <button
            type="button"
            onClick={() => onOpenAddTrip()}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/30 active:scale-95 transition-all cursor-pointer border border-fuchsia-300/40"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Your Trip</span>
          </button>

          <button
            type="button"
            onClick={onOpenTour}
            className="w-full sm:w-auto h-11 px-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-purple-950 dark:text-purple-200 font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Play className="w-2 h-2 fill-white ml-0.5" />
            </div>
            <span>Watch Tour</span>
          </button>
        </div>

        {/* Demo Link */}
        <button
          type="button"
          onClick={onLoadDemo}
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer mb-5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Explore with sample demo trip (1-click)</span>
        </button>

        {/* 5 Cards on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {TRANSIT_MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.type}
                type="button"
                onClick={() => onOpenAddTrip(m.type)}
                className={`p-3.5 rounded-2xl bg-slate-900/95 dark:bg-slate-950 border-2 ${m.borderGlow} text-left flex flex-col justify-between shadow-lg active:scale-98 transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${m.accentBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white">
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
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>{m.details}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
