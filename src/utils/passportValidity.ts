/**
 * Utility for checking Passport Expiry against the 6-Month Passport Validity Rule.
 * Many international destinations (EU / Schengen area, UK, Japan, Mexico, Caribbean, etc.)
 * require a traveler's passport to remain valid for at least 3 to 6 months beyond the planned departure or return date.
 */

export interface PassportValidityResult {
  hasWarning: boolean;
  isExpired: boolean;
  message: string | null;
  daysRemaining?: number;
}

export function checkPassportValidity(
  passportExpiryDate?: string | null,
  returnTripDate?: string | null,
  departureDate?: string | null
): PassportValidityResult {
  if (!passportExpiryDate || !passportExpiryDate.trim()) {
    return { hasWarning: false, isExpired: false, message: null };
  }

  // Target comparison date: return date if available, otherwise departure date, otherwise today
  const targetDateStr = returnTripDate?.trim() || departureDate?.trim();
  
  const expiry = new Date(passportExpiryDate.trim() + 'T00:00:00');
  if (isNaN(expiry.getTime())) {
    return { hasWarning: false, isExpired: false, message: null };
  }

  const comparisonDate = targetDateStr 
    ? new Date(targetDateStr + 'T00:00:00')
    : new Date();

  if (isNaN(comparisonDate.getTime())) {
    return { hasWarning: false, isExpired: false, message: null };
  }

  // Calculate difference in milliseconds and days
  const diffMs = expiry.getTime() - comparisonDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const formattedExpiry = expiry.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTarget = comparisonDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const targetLabel = returnTripDate ? 'return date' : (departureDate ? 'departure date' : 'travel date');

  // Case 1: Already expired or expires before the target travel date
  if (diffDays <= 0) {
    return {
      hasWarning: true,
      isExpired: true,
      daysRemaining: diffDays,
      message: `Passport Expired: Your passport expires on ${formattedExpiry}, before your ${targetLabel} (${formattedTarget}). You must renew your passport before traveling.`
    };
  }

  // Case 2: Expires within 6 months (approx 183 days) of the target travel date
  // Standard 6-month validity threshold: 183 days
  if (diffDays < 183) {
    const monthsRemaining = Math.max(1, Math.round(diffDays / 30.5));
    return {
      hasWarning: true,
      isExpired: false,
      daysRemaining: diffDays,
      message: `6-Month Passport Validity Rule: Your passport expires on ${formattedExpiry} (approx ${diffDays} days / ~${monthsRemaining} month${monthsRemaining === 1 ? '' : 's'} after your ${targetLabel} of ${formattedTarget}). Many international destinations (EU / Schengen, UK, Caribbean, Asia) require at least 6 months of validity beyond your stay.`
    };
  }

  // Case 3: Valid and has 6+ months remaining
  return {
    hasWarning: false,
    isExpired: false,
    daysRemaining: diffDays,
    message: null
  };
}
