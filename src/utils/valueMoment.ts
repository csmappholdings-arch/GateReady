export type ValueMomentKind = 'ITEM_PACKED' | 'REBALANCE_APPLIED' | 'READINESS_VIEWED';

const VALUE_MOMENT_STORAGE_KEY = 'gateready_value_moment_v1';
export const VALUE_MOMENT_EVENT = 'gateready:value-moment-reached';

export function hasReachedValueMoment(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(sessionStorage.getItem(VALUE_MOMENT_STORAGE_KEY));
  } catch {
    return false;
  }
}

export function markValueMomentReached(kind: ValueMomentKind): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = sessionStorage.getItem(VALUE_MOMENT_STORAGE_KEY);
    if (!existing) {
      sessionStorage.setItem(VALUE_MOMENT_STORAGE_KEY, kind);
      window.dispatchEvent(new CustomEvent(VALUE_MOMENT_EVENT, { detail: { kind } }));
    }
  } catch {}
}

export function resetValueMomentForTesting(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(VALUE_MOMENT_STORAGE_KEY);
  } catch {}
}
