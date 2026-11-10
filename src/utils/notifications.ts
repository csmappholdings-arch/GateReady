import { Trip, InAppNotification } from '../types/travel';
import { getDaysUntilDeparture } from './countdown';

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

  const activeTripIds = new Set(trips.filter((t) => !t.isArchived).map((t) => t.id));
  const existing = getStoredNotifications().filter((n) => activeTripIds.has(n.tripId));
  const existingMap = new Map(existing.map((n) => [`${n.tripId}_${n.trigger}`, n]));
  const result: InAppNotification[] = [...existing];

  trips.forEach((trip) => {
    if (trip.isArchived || !trip.departureDate) return;

    const daysRemaining = getDaysUntilDeparture(trip.departureDate, trip.departureTime);

    // Ignore past departed trips
    if (daysRemaining < 0) return;

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

    // 14 Days Check (triggers when strictly 8 to 14 days out)
    if (prefs.fourteenDaysNotice && daysRemaining <= 14 && daysRemaining >= 8) {
      addNotice(
        '14_DAYS',
        `${daysRemaining} Days Until Departure: ${trip.destinationCity || trip.name}`,
        `Your departure is ${daysRemaining} days away. Now is a great time to review your airline baggage allowance and begin preparing your packing list.`,
        'Review My Trip',
        'Overview'
      );
    }

    // 7 Days Check (triggers when strictly 4 to 7 days out)
    if (prefs.sevenDaysNotice && daysRemaining <= 7 && daysRemaining >= 4) {
      addNotice(
        '7_DAYS',
        `${daysRemaining} Days Until Departure: One Week to Travel!`,
        `Your departure is ${daysRemaining} days away. Check your luggage weights, dimensions, and airline baggage restrictions.`,
        'Check My Luggage',
        'Luggage'
      );
    }

    // 3 Days Check (triggers when strictly 2 to 3 days out)
    if (prefs.threeDaysNotice && daysRemaining <= 3 && daysRemaining >= 2) {
      addNotice(
        '3_DAYS',
        `${daysRemaining} Days Until Departure: Finalize Packing!`,
        `Your trip is only ${daysRemaining} days away. Complete your packing checklist and make sure your luggage is within your airline's limits.`,
        'Complete My Packing',
        'Checklist'
      );
    }

    // 24 Hours / 1 Day Check (triggers when 0 or 1 day out)
    if (prefs.twentyFourHoursNotice && daysRemaining <= 1 && daysRemaining >= 0) {
      addNotice(
        '24_HOURS',
        daysRemaining === 0 ? 'Today is Departure Day!' : '1 Day Until Departure: Final Check',
        daysRemaining === 0
          ? `Safe travels to ${trip.destinationCity || trip.name}! Have your boarding pass, photo ID, and carry-on liquids ready.`
          : `Your trip is tomorrow! Review your packing checklist, luggage restrictions, and travel documents before heading to the airport.`,
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
