/**
 * Single Source of Truth for Travel Countdown Calculations.
 * 
 * Compares departure calendar date directly against today's date at local midnight (00:00:00)
 * to eliminate hour-boundary off-by-one errors across the dashboard, workspace,
 * and reminder notifications.
 */

export interface DepartureCountdownResult {
  daysRemaining: number;
  isToday: boolean;
  isTomorrow: boolean;
  isPast: boolean;
  formattedCountdown: string;
}

export function getDaysUntilDeparture(departureDate?: string, departureTime?: string): number {
  if (!departureDate) return 0;
  const [year, month, day] = departureDate.split('-').map(Number);
  if (!year || !month || !day) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(year, month - 1, day);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function computeDepartureCountdown(
  departureDate?: string,
  departureTime?: string
): DepartureCountdownResult {
  if (!departureDate) {
    return {
      daysRemaining: 999,
      isToday: false,
      isTomorrow: false,
      isPast: false,
      formattedCountdown: 'No departure set'
    };
  }

  const days = getDaysUntilDeparture(departureDate, departureTime);

  if (days < 0) {
    return {
      daysRemaining: days,
      isToday: false,
      isTomorrow: false,
      isPast: true,
      formattedCountdown: `Departed ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`
    };
  }

  if (days === 0) {
    return {
      daysRemaining: 0,
      isToday: true,
      isTomorrow: false,
      isPast: false,
      formattedCountdown: 'DEPARTING TODAY'
    };
  }

  if (days === 1) {
    return {
      daysRemaining: 1,
      isToday: false,
      isTomorrow: true,
      isPast: false,
      formattedCountdown: '1 DAY UNTIL DEPARTURE'
    };
  }

  return {
    daysRemaining: days,
    isToday: false,
    isTomorrow: false,
    isPast: false,
    formattedCountdown: `${days} DAYS UNTIL DEPARTURE`
  };
}
