import { Trip, InAppNotification } from '../types/travel';

const NOTIFICATIONS_STORAGE_KEY = 'gateready_in_app_notifications_v1';
const NOTIFICATION_PREFS_KEY = 'gateready_notification_prefs_v1';

export interface NotificationPreferences {
  enabled: boolean;
  fourteenDaysNotice: boolean;
  sevenDaysNotice: boolean;
  threeDaysNotice: boolean;
  twentyFourHoursNotice: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  enabled: true,
  fourteenDaysNotice: true,
  sevenDaysNotice: true,
  threeDaysNotice: true,
  twentyFourHoursNotice: true,
  soundEnabled: true
};

export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_PREFS;
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_NOTIFICATION_PREFS;
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

export function getStoredNotifications(): InAppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveStoredNotifications(notifications: InAppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch {}
}

/**
 * Computes automated departure milestone notifications for all active trips.
 * Generates notifications for:
 * - 14 days before departure
 * - 7 days before departure
 * - 3 days before departure
 * - 24 hours before departure
 */
export function generateTripNotifications(trips: Trip[]): InAppNotification[] {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return [];

  const existing = getStoredNotifications();
  const existingMap = new Map(existing.map((n) => [`${n.tripId}_${n.trigger}`, n]));
  const now = new Date();
  const result: InAppNotification[] = [...existing];

  trips.forEach((trip) => {
    if (trip.isArchived || !trip.departureDate) return;

    // Parse departure date
    const [year, month, day] = trip.departureDate.split('-').map(Number);
    if (!year || !month || !day) return;

    let depHour = 9;
    let depMin = 0;
    if (trip.departureTime && trip.departureTime.includes(':')) {
      const parts = trip.departureTime.split(':').map(Number);
      depHour = parts[0] || 9;
      depMin = parts[1] || 0;
    }

    const depDate = new Date(year, month - 1, day, depHour, depMin, 0);
    const diffMs = depDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    // Ignore past departed trips
    if (diffMs <= 0) return;

    // Helper to add notification if not already added
    const addNotice = (
      trigger: InAppNotification['trigger'],
      title: string,
      message: string,
      actionLabel: string,
      targetTab: InAppNotification['targetTab']
    ) => {
      const key = `${trip.id}_${trigger}`;
      if (!existingMap.has(key)) {
        const item: InAppNotification = {
          id: `notif_${key}`,
          tripId: trip.id,
          tripName: trip.name,
          trigger,
          title,
          message,
          scheduledDate: new Date().toISOString(),
          isRead: false,
          actionLabel,
          targetTab,
          createdAt: new Date().toISOString()
        };
        result.unshift(item);
        existingMap.set(key, item);
      }
    };

    // 14 Days Check (triggers when between 7 and 14 days)
    if (prefs.fourteenDaysNotice && diffDays <= 14 && diffDays > 7) {
      addNotice(
        '14_DAYS',
        'Your Trip Is Coming Up!',
        `Your trip to ${trip.destinationCity || trip.name} is approaching. Now is a great time to review your airline baggage allowance and begin preparing your packing list.`,
        'Review My Trip',
        'Overview'
      );
    }

    // 7 Days Check (triggers when between 3 and 7 days)
    if (prefs.sevenDaysNotice && diffDays <= 7 && diffDays > 3) {
      addNotice(
        '7_DAYS',
        'One Week Until Your Trip!',
        `Your departure is one week away. Check your luggage weights, dimensions, and airline baggage restrictions.`,
        'Check My Luggage',
        'Luggage'
      );
    }

    // 3 Days Check (triggers when between 24h and 3 days)
    if (prefs.threeDaysNotice && diffDays <= 3 && diffHours > 24) {
      addNotice(
        '3_DAYS',
        'Time to Finalize Your Packing!',
        `Your trip is getting close. Complete your packing checklist and make sure your luggage is within your airline's limits.`,
        'Complete My Packing',
        'Checklist'
      );
    }

    // 24 Hours Check (triggers when under 24 hours)
    if (prefs.twentyFourHoursNotice && diffHours <= 24 && diffHours > 0) {
      addNotice(
        '24_HOURS',
        'Your Final Travel Readiness Check',
        `Your trip is tomorrow! Review your packing checklist, luggage restrictions, and travel documents before heading to the airport.`,
        'Review My Travel Readiness',
        'Documents'
      );
    }
  });

  saveStoredNotifications(result);
  return result;
}

export function markNotificationAsRead(id: string): void {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  saveStoredNotifications(updated);
}

export function markAllNotificationsAsRead(): void {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, isRead: true }));
  saveStoredNotifications(updated);
}

export function dismissNotification(id: string): void {
  const current = getStoredNotifications();
  const filtered = current.filter((n) => n.id !== id);
  saveStoredNotifications(filtered);
}
