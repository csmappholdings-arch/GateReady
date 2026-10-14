export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  totalHours: number;
  isPast: boolean;
  isToday: boolean;
  isValid: boolean;
}

/**
 * Recomputes days, hours, minutes, seconds accurately from departure datetime on every render.
 * Prevents label misalignment or impossible values.
 */
export function computeCountdown(dateStr?: string, timeStr?: string): CountdownResult {
  if (!dateStr || !dateStr.trim()) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      totalHours: 0,
      isPast: false,
      isToday: false,
      isValid: false
    };
  }

  const cleanDate = dateStr.trim();
  const cleanTime = (timeStr || '09:00').trim();

  let targetDate: Date;

  // Handle standard YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
    const [y, m, d] = cleanDate.split('-').map(Number);
    const [h, min] = cleanTime.split(':').map((v) => parseInt(v, 10) || 0);
    targetDate = new Date(y, m - 1, d, h || 0, min || 0, 0, 0);
  } else {
    targetDate = new Date(`${cleanDate}T${cleanTime}:00`);
    if (isNaN(targetDate.getTime())) {
      targetDate = new Date(`${cleanDate} ${cleanTime}`);
    }
  }

  if (isNaN(targetDate.getTime())) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      totalHours: 0,
      isPast: false,
      isToday: false,
      isValid: false
    };
  }

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: diffMs,
      totalHours: 0,
      isPast: true,
      isToday: targetDate.toDateString() === now.toDateString(),
      isValid: true
    };
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  const totalHours = Math.floor(totalSecs / 3600);

  const isToday = days === 0 && targetDate.toDateString() === now.toDateString();

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diffMs,
    totalHours,
    isPast: false,
    isToday,
    isValid: true
  };
}
