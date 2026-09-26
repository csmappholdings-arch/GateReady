import React, { useState, useEffect } from 'react';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Trip, DepartureReminder } from '../types/travel';
import { getDefaultDepartureReminders } from '../data/defaultReminders';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Crown, 
  Sparkles, 
  AlertCircle, 
  ShieldAlert, 
  Coins, 
  FileText, 
  Lock, 
  X,
  Edit3,
  Bell
} from 'lucide-react';

interface DepartureCountdownCardProps {
  trip: Trip;
}

export const DepartureCountdownCard: React.FC<DepartureCountdownCardProps> = ({ trip }) => {
  const { isPro, openPaywall } = useSubscription();
  const { 
    updateDepartureSchedule, 
    toggleDepartureReminder, 
    addCustomReminder, 
    removeDepartureReminder 
  } = usePacking();

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [dateInput, setDateInput] = useState(trip.departureDate || new Date().toISOString().split('T')[0]);
  const [timeInput, setTimeInput] = useState(trip.departureTime || '09:00');
  
  // Custom reminder modal state
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderCategory, setNewReminderCategory] = useState<'DAY_OF' | 'PRE_TRIP'>('DAY_OF');

  // Active filter tab
  const [activeTab, setActiveTab] = useState<'ALL' | 'DAY_OF' | 'PRE_TRIP'>('DAY_OF');

  // Real-time ticking clock
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    totalHoursLeft: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, totalHoursLeft: 0 });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!trip.departureDate) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, totalHoursLeft: 0 });
        return;
      }

      const departureString = `${trip.departureDate}T${trip.departureTime || '09:00'}:00`;
      const targetTime = new Date(departureString).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (isNaN(targetTime)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, totalHoursLeft: 0 });
        return;
      }

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, totalHoursLeft: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const totalHoursLeft = Math.floor(difference / (1000 * 60 * 60));

      setTimeLeft({ days, hours, minutes, seconds, isPast: false, totalHoursLeft });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [trip.departureDate, trip.departureTime]);

  const reminders = trip.departureReminders && trip.departureReminders.length > 0
    ? trip.departureReminders
    : getDefaultDepartureReminders();

  const dayOfReminders = reminders.filter((r) => r.category === 'DAY_OF');
  const preTripReminders = reminders.filter((r) => r.category === 'PRE_TRIP');

  const filteredReminders = activeTab === 'ALL'
    ? reminders
    : activeTab === 'DAY_OF'
    ? dayOfReminders
    : preTripReminders;

  const totalDayOfCompleted = dayOfReminders.filter((r) => r.completed).length;
  const totalPreTripCompleted = preTripReminders.filter((r) => r.completed).length;

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) {
      openPaywall("Trip Departure Countdown Clock is exclusive to Gate Ready Pro. Upgrade to set custom departure times and receive day-of travel reminders.");
      return;
    }
    updateDepartureSchedule(trip.id, dateInput, timeInput, true);
    setIsEditingSchedule(false);
  };

  const handleReminderToggle = (reminderId: string) => {
    if (!isPro) {
      openPaywall("Smart Day-Of Travel Reminders are exclusive to Gate Ready Pro. Upgrade to check off cash, passport, and pre-departure alerts.");
      return;
    }
    toggleDepartureReminder(trip.id, reminderId);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    if (!isPro) {
      setShowAddReminderModal(false);
      openPaywall("Custom Day-Of Travel Reminders are exclusive to Gate Ready Pro. Upgrade to create custom alerts.");
      return;
    }
    addCustomReminder(trip.id, newReminderTitle.trim(), newReminderCategory);
    setNewReminderTitle('');
    setShowAddReminderModal(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/60 shadow-sm overflow-hidden mb-6 transition-all">
      {/* Top Banner / Pro Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0 border border-white/15">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>Departure Countdown & Travel Day Alerts</span>
              </h3>
              {isPro ? (
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                  <Crown className="w-2.5 h-2.5 fill-purple-950" /> PRO
                </span>
              ) : (
                <button
                  onClick={() => openPaywall("Gate Ready Pro includes the interactive Departure Countdown Clock, smart day-of alerts for passports and cash, and PDF packing exports.")}
                  className="text-[10px] bg-amber-400/25 border border-amber-300/40 text-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-amber-400/40 transition-colors cursor-pointer"
                >
                  <Crown className="w-2.5 h-2.5 fill-amber-300" /> Pro Feature
                </button>
              )}
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5">
              {trip.departureDate ? (
                <span>Scheduled: <strong>{trip.departureDate}</strong> at <strong>{trip.departureTime || '09:00'}</strong></span>
              ) : (
                <span>Set your departure date & time for live countdown</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (!isPro) {
                openPaywall("Upgrading to Gate Ready Pro unlocks the interactive Departure Countdown Clock and travel day alerts.");
                return;
              }
              setIsEditingSchedule(!isEditingSchedule);
            }}
            className="h-8.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-200" />
            <span>{isEditingSchedule ? 'Close Editor' : 'Edit Departure Time'}</span>
          </button>
        </div>
      </div>

      {/* Editing Form Drawer */}
      {isEditingSchedule && (
        <form onSubmit={handleSaveSchedule} className="p-4 bg-purple-50/70 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/60 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                Departure Date
              </label>
              <input
                type="date"
                required
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-auto flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                Departure Time (Local Flight/Train)
              </label>
              <input
                type="time"
                required
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-auto flex items-end pt-5">
              <button
                type="submit"
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Content Grid: Left Countdown Clock | Right Smart Day-of Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-purple-100 dark:divide-purple-900/60">
        
        {/* Left Column: Live Countdown Clock (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Time Until Travel
              </span>
              {timeLeft.isPast && (
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Travel Day Arrived!
                </span>
              )}
            </div>

            {/* Countdown Digital Gauge */}
            {timeLeft.isPast ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-200">
                  Ready for Gate Clearance!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  Your trip departure time has arrived. Have your boarding pass and photo ID handy!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* Days */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/60 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-purple-950 dark:text-purple-100 tracking-tight">
                    {timeLeft.days}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/60 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-purple-950 dark:text-purple-100 tracking-tight">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/60 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-purple-950 dark:text-purple-100 tracking-tight">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    Mins
                  </span>
                </div>

                {/* Seconds */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/60 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    Secs
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats or Free Overlay */}
          <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-900/40">
            {!isPro ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                    Pro Departure Tracking
                  </span>
                </div>
                <button
                  onClick={() => openPaywall("Upgrade to Gate Ready Pro to activate live departure countdown timers and day-of packing reminders.")}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-all cursor-pointer shrink-0"
                >
                  Unlock
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Departure Aligned</span>
                </span>
                <span>
                  {dayOfReminders.filter((r) => r.completed).length}/{dayOfReminders.length} Day-of Done
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Smart Reminders (Day-of Travel & Pre-Trip) (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Travel Reminders & Critical Day-of Tasks</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Don't forget cash, IDs, or last-minute home check items.
                </p>
              </div>

              {/* Add Custom Reminder button */}
              <button
                onClick={() => setShowAddReminderModal(true)}
                className="h-8 px-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reminder</span>
              </button>
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-1.5 mb-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 w-fit">
              <button
                onClick={() => setActiveTab('DAY_OF')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'DAY_OF'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Day-of Travel ({totalDayOfCompleted}/{dayOfReminders.length})
              </button>

              <button
                onClick={() => setActiveTab('PRE_TRIP')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'PRE_TRIP'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Pre-Trip Milestones ({totalPreTripCompleted}/{preTripReminders.length})
              </button>

              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All ({reminders.length})
              </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredReminders.map((reminder) => {
                const isDayOf = reminder.category === 'DAY_OF';

                return (
                  <div
                    key={reminder.id}
                    onClick={() => handleReminderToggle(reminder.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      reminder.completed
                        ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-900/40 opacity-70'
                        : isDayOf
                        ? 'bg-white dark:bg-slate-800/80 border-purple-200/80 dark:border-purple-900/60 shadow-xs hover:border-purple-400'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="mt-0.5 shrink-0 text-purple-600 dark:text-purple-400">
                        {reminder.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs leading-snug ${
                              reminder.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'font-medium text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {reminder.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                              isDayOf
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                            }`}
                          >
                            {isDayOf ? 'Day of Travel' : 'Pre-Trip'}
                          </span>
                          {reminder.dueOffsetHours && (
                            <span className="text-[10px] text-slate-400">
                              ~{reminder.dueOffsetHours}h before departure
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {reminder.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDepartureReminder(trip.id, reminder.id);
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Custom Reminder */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" />
                <span>Add Travel Reminder</span>
              </h3>
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                  Reminder Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pick up $200 foreign cash at ATM, Pack insulin pen"
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  className="w-full h-11 px-3.5 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewReminderCategory('DAY_OF')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      newReminderCategory === 'DAY_OF'
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>Day of Travel (Cash/Passports)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewReminderCategory('PRE_TRIP')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      newReminderCategory === 'PRE_TRIP'
                        ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Pre-Trip (Laundry/Charging)</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="h-9 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Add to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
