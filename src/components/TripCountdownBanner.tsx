import React, { useState, useEffect } from 'react';
import { Trip } from '../types/travel';
import { useSubscription } from '../context/SubscriptionContext';
import { computeCountdown } from '../utils/countdownUtils';
import { 
  Clock, 
  Crown, 
  Sparkles, 
  Calendar, 
  PlaneTakeoff,
  PlaneLanding,
  CheckCircle2,
  Navigation,
  Train,
  Car,
  Ship,
  Bus
} from 'lucide-react';

interface TripCountdownBannerProps {
  trip: Trip;
  onOpenEditSchedule: () => void;
}

export const TripCountdownBanner: React.FC<TripCountdownBannerProps> = ({
  trip,
  onOpenEditSchedule
}) => {
  const { isPro } = useSubscription();

  // Active leg: 'departure' (Outbound) or 'return' (Return Leg)
  const [activeLeg, setActiveLeg] = useState<'departure' | 'return'>('departure');
  const [nowTick, setNowTick] = useState<number>(Date.now());

  const isCar = trip.travelType === 'CAR' || (Boolean(trip.seatClassOrCarSize) && /car|suv|sedan|truck|van|overland/i.test(trip.seatClassOrCarSize || ''));
  const isTrain = trip.travelType === 'TRAIN' || (Boolean(trip.seatClassOrCarSize) && /train|rail|coach/i.test(trip.seatClassOrCarSize || ''));
  const isCruise = trip.travelType === 'CRUISE' || (Boolean(trip.seatClassOrCarSize) && /cruise|stateroom|ship|cabin|porthole/i.test(trip.seatClassOrCarSize || ''));
  const isBus = trip.travelType === 'BUS' || (Boolean(trip.seatClassOrCarSize) && /bus/i.test(trip.seatClassOrCarSize || ''));
  const isFlight = (trip.travelType === 'PLANE' || !trip.travelType) && !isCar && !isTrain && !isCruise && !isBus;

  // Auto-switch to Return countdown for Pro users if departure date/time has already passed
  useEffect(() => {
    if (!isPro || !trip.departureDate) return;
    const depRes = computeCountdown(trip.departureDate, trip.departureTime || '09:00');
    if (trip.returnTripDate && depRes.isPast) {
      setActiveLeg('return');
    }
  }, [trip.departureDate, trip.departureTime, trip.returnTripDate, isPro]);

  // Live ticking interval every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const targetDateStr = activeLeg === 'departure' ? trip.departureDate : trip.returnTripDate;
  const targetTimeStr = activeLeg === 'departure' ? trip.departureTime || '09:00' : trip.returnTripTime || '17:00';
  const hasTargetDate = Boolean(targetDateStr && targetDateStr.trim());

  // Compute countdown on every render via single source of truth
  const countdown = computeCountdown(targetDateStr, targetTimeStr);

  const padZero = (n: number) => n.toString().padStart(2, '0');

  const formatTargetDate = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return 'Not set';
    try {
      const cleanDate = dateStr.trim();
      const cleanTime = (timeStr || '09:00').trim();
      let d: Date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
        const [y, m, day] = cleanDate.split('-').map(Number);
        const [h, min] = cleanTime.split(':').map((v) => parseInt(v, 10) || 0);
        d = new Date(y, m - 1, day, h || 0, min || 0, 0, 0);
      } else {
        d = new Date(`${cleanDate}T${cleanTime}:00`);
      }
      if (isNaN(d.getTime())) return dateStr;
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

  const getLegIcon = (isReturn: boolean) => {
    if (isFlight) {
      return isReturn ? <PlaneLanding className="w-3 h-3 text-indigo-300" /> : <PlaneTakeoff className="w-3 h-3 text-amber-300" />;
    }
    if (trip.travelType === 'TRAIN') return <Train className="w-3 h-3 text-emerald-300" />;
    if (trip.travelType === 'CRUISE') return <Ship className="w-3 h-3 text-cyan-300" />;
    if (trip.travelType === 'BUS') return <Bus className="w-3 h-3 text-fuchsia-300" />;
    if (trip.travelType === 'CAR') return <Car className="w-3 h-3 text-amber-300" />;
    return <Navigation className="w-3 h-3 text-purple-300" />;
  };

  const outboundLabel = isFlight ? 'Outbound Flight' : 'Outbound Leg';
  const returnLabel = isFlight ? 'Return Flight' : 'Return Leg';
  const bannerTitle = isFlight ? 'Flight Countdown Clock' : 'Departure Countdown';

  // Safeguard route display: avoid raw "T" or empty placeholders
  const validOrigin = trip.originCity && trip.originCity.trim().length > 1 ? trip.originCity.trim() : null;
  const validDest = trip.destinationCity && trip.destinationCity.trim().length > 1 ? trip.destinationCity.trim() : null;

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white border border-purple-500/30 shadow-md overflow-hidden mb-2.5">
      {/* Top Header Bar inside Countdown Banner */}
      <div className="px-3 sm:px-4 py-2 bg-black/30 border-b border-purple-800/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
            <Clock className="w-3 h-3 animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-200">
            {bannerTitle}
          </span>
          {isPro ? (
            <span className="inline-flex items-center gap-0.5 bg-purple-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-300/30">
              <Crown className="w-2.5 h-2.5 fill-amber-300" /> Silver+ Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
              Live Ticking
            </span>
          )}
          {validOrigin && validDest && (
            <span className="text-[11px] text-purple-300/80 hidden sm:inline">
              · {validOrigin} ➔ {validDest}
            </span>
          )}
          {!validOrigin && validDest && (
            <span className="text-[11px] text-purple-300/80 hidden sm:inline">
              · To {validDest}
            </span>
          )}
        </div>

        {/* Dual-Leg Switcher: Outbound vs Return */}
        <div className="flex items-center gap-1 bg-white/10 dark:bg-black/40 p-0.5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setActiveLeg('departure')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeLeg === 'departure'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            {getLegIcon(false)}
            <span>{outboundLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLeg('return')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeLeg === 'return'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            {getLegIcon(true)}
            <span>{returnLabel}</span>
          </button>
        </div>
      </div>

      {/* Main Countdown Display Area */}
      <div className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Digital Clock Blocks or Empty State */}
        {!hasTargetDate || !countdown.isValid ? (
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-300/30 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {activeLeg === 'departure' 
                  ? 'No departure date scheduled' 
                  : (isFlight ? 'No return flight date scheduled' : 'No return leg date scheduled')}
              </p>
              <p className="text-[11px] text-purple-200/80 mt-0.5">
                Set your {activeLeg === 'departure' ? 'departure' : 'return'} schedule to start the live countdown clock.
              </p>
            </div>
          </div>
        ) : countdown.isPast ? (
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-300/40 text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.2 rounded-full border border-emerald-500/40">
                  {activeLeg === 'departure' ? `${outboundLabel} Completed` : `${returnLabel} Completed`}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {activeLeg === 'departure' 
                  ? (isFlight ? 'Your outbound flight has departed!' : 'Your outbound leg has departed!')
                  : 'Welcome home from your trip!'}
              </p>
              <p className="text-[11px] text-purple-200/70 mt-0.5">
                Scheduled: {formatTargetDate(targetDateStr, targetTimeStr)}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-amber-300" />
                <span>
                  {activeLeg === 'departure' 
                    ? (isFlight ? 'Countdown to Takeoff' : 'Countdown to Departure')
                    : (isFlight ? 'Countdown to Return Flight' : 'Countdown to Return Leg')}:
                </span>
              </span>
              <span className="text-[10px] text-purple-300 bg-purple-900/50 px-2 py-0.2 rounded-md border border-purple-700/50">
                {formatTargetDate(targetDateStr, targetTimeStr)}
              </span>
            </div>

            {/* 4 Digital Timer Blocks: Days, Hours, Minutes, Seconds accurately mapped */}
            <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-10 sm:w-12 h-9 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-purple-400/30 flex items-center justify-center shadow-md shadow-purple-950/40">
                  <span className="text-base sm:text-lg font-black text-white tracking-tight font-mono">
                    {padZero(countdown.days)}
                  </span>
                </div>
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-purple-300 mt-0.5">
                  Days
                </span>
              </div>

              <span className="text-sm font-black text-purple-400 mb-2">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-10 sm:w-12 h-9 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-purple-400/30 flex items-center justify-center shadow-md shadow-purple-950/40">
                  <span className="text-base sm:text-lg font-black text-white tracking-tight font-mono">
                    {padZero(countdown.hours)}
                  </span>
                </div>
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-purple-300 mt-0.5">
                  Hours
                </span>
              </div>

              <span className="text-sm font-black text-purple-400 mb-2">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-10 sm:w-12 h-9 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-purple-400/30 flex items-center justify-center shadow-md shadow-purple-950/40">
                  <span className="text-base sm:text-lg font-black text-white tracking-tight font-mono">
                    {padZero(countdown.minutes)}
                  </span>
                </div>
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-purple-300 mt-0.5">
                  Mins
                </span>
              </div>

              <span className="text-sm font-black text-purple-400 mb-2">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-10 sm:w-12 h-9 sm:h-10 rounded-xl bg-amber-400/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center shadow-md shadow-amber-950/40">
                  <span className="text-base sm:text-lg font-black text-amber-300 tracking-tight font-mono">
                    {padZero(countdown.seconds)}
                  </span>
                </div>
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-300 mt-0.5">
                  Secs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right: Quick Action to Edit Schedule */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={onOpenEditSchedule}
            className="h-9 px-3.5 rounded-xl border border-purple-400/40 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <span>{hasTargetDate ? 'Edit Schedule' : 'Set Departure Date'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
