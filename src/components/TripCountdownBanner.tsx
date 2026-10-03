import React, { useState, useEffect } from 'react';
import { Trip } from '../types/travel';
import { useSubscription } from '../context/SubscriptionContext';
import { 
  Clock, 
  Lock, 
  Crown, 
  Sparkles, 
  Calendar, 
  Edit3, 
  ArrowRight,
  PlaneTakeoff,
  PlaneLanding,
  CheckCircle2
} from 'lucide-react';

interface TripCountdownBannerProps {
  trip: Trip;
  onOpenEditSchedule: () => void;
}

interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}

export const TripCountdownBanner: React.FC<TripCountdownBannerProps> = ({
  trip,
  onOpenEditSchedule
}) => {
  const { isPro, openPaywall } = useSubscription();

  // Active mode: 'departure' (Outbound) or 'return' (Return Trip)
  const [activeLeg, setActiveLeg] = useState<'departure' | 'return'>('departure');
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

  // Auto-switch to Return countdown for Pro users if departure date/time has already passed
  useEffect(() => {
    if (!isPro || !trip.departureDate) return;
    const depDateTime = new Date(`${trip.departureDate}T${trip.departureTime || '09:00'}:00`);
    const now = new Date();
    
    if (trip.returnTripDate && depDateTime < now) {
      setActiveLeg('return');
    }
  }, [trip.departureDate, trip.departureTime, trip.returnTripDate, isPro]);

  // Live countdown timer calculation for all users
  useEffect(() => {
    const calculateTime = () => {
      const targetDateStr = activeLeg === 'departure' ? trip.departureDate : trip.returnTripDate;
      const targetTimeStr = activeLeg === 'departure' ? trip.departureTime || '09:00' : trip.returnTripTime || '17:00';

      if (!targetDateStr) {
        setTimeRemaining(null);
        return;
      }

      const target = new Date(`${targetDateStr}T${targetTimeStr}:00`);
      if (isNaN(target.getTime())) {
        setTimeRemaining(null);
        return;
      }

      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      const isPast = diffMs < 0;
      const isToday = !isPast && diffMs < 24 * 60 * 60 * 1000 && target.getDate() === now.getDate();

      const absDiff = Math.abs(diffMs);
      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((absDiff / 1000) % 60);

      setTimeRemaining({
        totalMs: diffMs,
        days,
        hours,
        minutes,
        seconds,
        isPast,
        isToday
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [trip.departureDate, trip.departureTime, trip.returnTripDate, trip.returnTripTime, activeLeg]);

  // Pad numbers with leading zero
  const padZero = (n: number) => n.toString().padStart(2, '0');

  const formatTargetDate = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return 'Not set';
    try {
      const d = new Date(`${dateStr}T${timeStr || '09:00'}:00`);
      return d.toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      }) + (timeStr ? ` at ${timeStr}` : '');
    } catch {
      return dateStr;
    }
  };

  // =========================================================================
  // 2. PRO UNLOCKED: FULL INTERACTIVE COUNTDOWN CLOCK & DUAL-LEG TIMERS
  // =========================================================================
  const hasTargetDate = activeLeg === 'departure' ? !!trip.departureDate : !!trip.returnTripDate;

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white border border-purple-500/30 shadow-xl overflow-hidden mb-3.5">
      {/* Top Header Bar inside Countdown Banner */}
      <div className="px-4 sm:px-6 py-2.5 bg-black/30 border-b border-purple-800/40 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-200">
            Flight Countdown Clock
          </span>
          {isPro ? (
            <span className="inline-flex items-center gap-0.5 bg-purple-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-300/30">
              <Crown className="w-2.5 h-2.5 fill-amber-300" /> Pro Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
              Live Ticking
            </span>
          )}
          {(trip.originCity || trip.destinationCity) && (
            <span className="text-[11px] text-purple-300/80 hidden sm:inline">
              · {trip.originCity || 'Origin'} ➔ {trip.destinationCity || trip.name}
            </span>
          )}
        </div>

        {/* Pro Dual-Leg Switcher: Outbound vs Return */}
        <div className="flex items-center gap-1 bg-white/10 dark:bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveLeg('departure')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLeg === 'departure'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <PlaneTakeoff className="w-3 h-3 text-amber-300" />
            <span>Outbound Flight</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLeg('return')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLeg === 'return'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <PlaneLanding className="w-3 h-3 text-indigo-300" />
            <span>Return Flight</span>
          </button>
        </div>
      </div>

      {/* Main Countdown Display Area */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Digital Clock Blocks or Empty State */}
        {!hasTargetDate ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-300/30 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {activeLeg === 'departure' ? 'No departure date scheduled' : 'No return flight date scheduled'}
              </p>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Set your {activeLeg === 'departure' ? 'departure' : 'return'} date and flight time to start the live countdown clock.
              </p>
            </div>
          </div>
        ) : timeRemaining && timeRemaining.isPast ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  {activeLeg === 'departure' ? 'Outbound Flight Completed / Departed' : 'Return Flight Completed'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {activeLeg === 'departure' 
                  ? 'Your outbound flight has departed!' 
                  : 'Welcome home from your trip!'}
              </p>
              <p className="text-xs text-purple-200/70 mt-0.5">
                Scheduled time was: {formatTargetDate(activeLeg === 'departure' ? trip.departureDate : trip.returnTripDate, activeLeg === 'departure' ? trip.departureTime : trip.returnTripTime)}
              </p>
            </div>
          </div>
        ) : timeRemaining ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                <span>
                  {activeLeg === 'departure' ? 'Countdown to Outbound Takeoff' : 'Countdown to Return Flight'}:
                </span>
              </span>
              <span className="text-[11px] text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-md border border-purple-700/50">
                {formatTargetDate(activeLeg === 'departure' ? trip.departureDate : trip.returnTripDate, activeLeg === 'departure' ? trip.departureTime : trip.returnTripTime)}
              </span>
            </div>

            {/* 4 Digital Timer Blocks: Days, Hours, Minutes, Seconds */}
            <div className="flex items-center gap-2 sm:gap-3 pt-1">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-16 h-11 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-400/30 flex items-center justify-center shadow-lg shadow-purple-950/40">
                  <span className="text-lg sm:text-2xl font-black text-white tracking-tight font-mono">
                    {padZero(timeRemaining.days)}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-300 mt-1">
                  Days
                </span>
              </div>

              <span className="text-base sm:text-lg font-black text-purple-400 mb-3 sm:mb-4">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-16 h-11 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-400/30 flex items-center justify-center shadow-lg shadow-purple-950/40">
                  <span className="text-lg sm:text-2xl font-black text-white tracking-tight font-mono">
                    {padZero(timeRemaining.hours)}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-300 mt-1">
                  Hours
                </span>
              </div>

              <span className="text-base sm:text-lg font-black text-purple-400 mb-3 sm:mb-4">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-16 h-11 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-400/30 flex items-center justify-center shadow-lg shadow-purple-950/40">
                  <span className="text-lg sm:text-2xl font-black text-white tracking-tight font-mono">
                    {padZero(timeRemaining.minutes)}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-300 mt-1">
                  Mins
                </span>
              </div>

              <span className="text-base sm:text-lg font-black text-purple-400 mb-3 sm:mb-4">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-16 h-11 sm:h-14 rounded-2xl bg-amber-400/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-950/40">
                  <span className="text-lg sm:text-2xl font-black text-amber-300 tracking-tight font-mono">
                    {padZero(timeRemaining.seconds)}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-300 mt-1">
                  Secs
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Right: Quick Action to Edit Schedule */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={onOpenEditSchedule}
            className="h-9 px-3.5 rounded-xl border border-purple-400/40 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-300" />
            <span>{hasTargetDate ? 'Edit Date & Time' : 'Set Flight Date'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
