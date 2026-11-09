import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Settings, 
  AlertCircle,
  Luggage,
  Sparkles
} from 'lucide-react';
import { InAppNotification } from '../types/travel';
import { 
  getNotificationPreferences, 
  saveNotificationPreferences, 
  NotificationPreferences, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  dismissNotification 
} from '../utils/notifications';
import { trackEvent } from '../utils/analytics';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotification[];
  onSelectNotificationAction: (notification: InAppNotification) => void;
  onRefreshNotifications: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotificationAction,
  onRefreshNotifications
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');
  const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const updated = {
      ...prefs,
      [key]: !prefs[key]
    };
    setPrefs(updated);
    saveNotificationPreferences(updated);
    onRefreshNotifications();
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    onRefreshNotifications();
  };

  const handleAction = (n: InAppNotification) => {
    markNotificationAsRead(n.id);
    onRefreshNotifications();
    onClose();
    onSelectNotificationAction(n);
    trackEvent('reminder_notification_click', {
      trip_id: n.tripId,
      trigger: n.trigger
    });
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dismissNotification(id);
    onRefreshNotifications();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 min-h-screen cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden flex flex-col relative z-[100000] cursor-default animate-in zoom-in-95 duration-150 max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                Travel Reminders &amp; Alerts
              </h3>
              <p className="text-[11px] text-purple-200/90">
                {unreadCount > 0 ? `${unreadCount} unread upcoming flight notifications` : 'All caught up on departure alerts'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-4 pt-3 pb-2 bg-purple-50/50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40'
              }`}
            >
              <span>Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-purple-950 text-[10px] font-black">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>
          </div>

          {activeTab === 'alerts' && notifications.length > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {activeTab === 'alerts' ? (
            notifications.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    No active departure alerts
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    When you create an upcoming trip with departure dates, automated 14-day, 7-day, 3-day, and 24-hour reminders will appear here.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleAction(n)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative space-y-2 ${
                    !n.isRead
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 shadow-xs ring-1 ring-purple-400/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 shrink-0">
                        {n.trigger.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                        {n.tripName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDismiss(n.id, e)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      Tap to open trip workspace
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                      <span>{n.actionLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )
          ) : (
            /* Settings tab */
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Enable Departure Notifications
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Receive timely preparation reminders leading up to your flight
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePref('enabled')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    prefs.enabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      prefs.enabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <p className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Notification Schedule
                </p>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      14 Days Before Departure
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Review airline baggage allowance &amp; start packing list
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.fourteenDaysNotice}
                    onChange={() => handleTogglePref('fourteenDaysNotice')}
                    disabled={!prefs.enabled}
                    className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      7 Days Before Departure
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Check suitcase weights, dimensions &amp; baggage rules
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.sevenDaysNotice}
                    onChange={() => handleTogglePref('sevenDaysNotice')}
                    disabled={!prefs.enabled}
                    className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      3 Days Before Departure
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Finalize packing checklist &amp; check suitcase scales
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.threeDaysNotice}
                    onChange={() => handleTogglePref('threeDaysNotice')}
                    disabled={!prefs.enabled}
                    className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      24 Hours Before Departure
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Final travel readiness check (liquids, passports, flight pass)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.twentyFourHoursNotice}
                    onChange={() => handleTogglePref('twentyFourHoursNotice')}
                    disabled={!prefs.enabled}
                    className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Reminders auto-calculate based on departure times.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
