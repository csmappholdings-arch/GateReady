import { Bag, Trip, getBagEmptyWeightLbs } from '../types/travel';
import { DefaultSuggestions } from '../data/suggestions';
import { airlineLimits } from '../data/allowances';

export interface BagWeightStatus {
  bag: Bag;
  emptyLbs: number;
  itemsLbs: number;
  totalWeightLbs: number;
  displayedWeightLbs: number;
  limitLbs: number | null;
  hasNoWeightLimit: boolean;
  pct: number;
  isOverweight: boolean;
  isNearLimit: boolean;
  overweightAmountLbs: number;
  displayTotalWeight: string;
  displayLimit: string;
  formattedPct: string;
}

export interface TripWeightSummary {
  bagStatuses: BagWeightStatus[];
  hasOverweightBag: boolean;
  hasNearLimitBag: boolean;
  overweightBags: BagWeightStatus[];
  nearLimitBags: BagWeightStatus[];
  totalTripWeightLbs: number;
  displayTotalTripWeight: string;
}

/**
 * Resolves the carrier's carry-on weight policy for a given airline or travel mode.
 */
export function getCarrierCarryOnPolicy(companyName?: string, travelType?: string) {
  if (travelType && travelType !== 'PLANE') {
    if (travelType === 'CAR') {
      return {
        hasNoWeightLimit: true,
        limitLbs: null,
        label: 'No vehicle limit',
        dimensions: 'Vehicle cargo space',
        note: null,
        isDefault: false
      };
    }
    if (travelType === 'TRAIN') {
      return {
        hasNoWeightLimit: true,
        limitLbs: null,
        label: 'No rail limit (Rail Coach)',
        dimensions: 'Standard overhead rack',
        note: 'Rail coach carry-on (up to 50 lbs)',
        isDefault: false
      };
    }
    if (travelType === 'CRUISE') {
      return {
        hasNoWeightLimit: true,
        limitLbs: null,
        label: 'No cruise limit (Cruise Stateroom)',
        dimensions: 'Terminal security clearance sizer',
        note: null,
        isDefault: false
      };
    }
    if (travelType === 'BUS') {
      return {
        hasNoWeightLimit: true,
        limitLbs: null,
        label: 'No bus limit (Bus Overhead)',
        dimensions: 'Overhead luggage shelf',
        note: null,
        isDefault: false
      };
    }
  }

  if (!companyName || !companyName.trim()) {
    return {
      hasNoWeightLimit: false,
      limitLbs: 22,
      label: '22 lbs limit (standard)',
      dimensions: '22 x 14 x 9 in',
      note: null,
      isDefault: true
    };
  }

  const cleanCompany = companyName.toLowerCase().trim();
  const match = airlineLimits.find(
    (a) =>
      a.company.toLowerCase() === cleanCompany ||
      cleanCompany.includes(a.company.toLowerCase()) ||
      a.company.toLowerCase().includes(cleanCompany)
  );

  if (!match) {
    return {
      hasNoWeightLimit: false,
      limitLbs: 22,
      label: '22 lbs limit (standard)',
      dimensions: '22 x 14 x 9 in',
      note: null,
      isDefault: true
    };
  }

  const weightNote = (match.carryOnWeightLimit || '').toLowerCase();
  const hasNoLimit =
    weightNote.includes('no weight limit') ||
    weightNote.includes('no maximum weight limit') ||
    weightNote.includes('no strict weight limit') ||
    weightNote.includes('no official weight limit') ||
    /no\s+(?:maximum\s+|strict\s+|official\s+)?weight\s+limit/i.test(weightNote);

  if (hasNoLimit) {
    return {
      hasNoWeightLimit: true,
      limitLbs: null,
      label: `No airline limit (${match.company})`,
      dimensions: match.carryOnLimit || '21.5 x 15.5 x 9 in',
      note: match.carryOnWeightLimit,
      isDefault: false
    };
  }

  const matchNumber = (match.carryOnWeightLimit || '').match(/(\d+(\.\d+)?)\s*lbs?/i);
  const lbs = matchNumber ? parseFloat(matchNumber[1]) : 22;

  return {
    hasNoWeightLimit: false,
    limitLbs: lbs,
    label: `${lbs} lbs limit (${match.company})`,
    dimensions: match.carryOnLimit || '22 x 14 x 9 in',
    note: match.carryOnWeightLimit,
    isDefault: false
  };
}

/**
 * Single Source of Truth for computing a bag's weight vs carrier limit.
 * Fix 3: Headroom percentage is computed directly FROM displayed (rounded) weight.
 * Fix 4: Carrier carry-on policies with "no weight limit" (e.g. Air Canada) are respected.
 * Fix 1: Mode-aware (Car, Train, Cruise, Bus do not enforce flight 22-lb limits).
 */
export function computeBagWeightStatus(
  bag: Bag,
  weightUnit: 'LBS' | 'KG' = 'LBS',
  companyName?: string,
  travelType: string = 'PLANE'
): BagWeightStatus {
  const emptyLbs = getBagEmptyWeightLbs(bag);
  const itemsLbs = (bag.items || []).reduce((sum, item) => {
    const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
    return sum + w * (item.quantity || 1);
  }, 0);

  const totalWeightLbs = emptyLbs + itemsLbs;
  const displayedWeightLbs = Number(totalWeightLbs.toFixed(1));

  const isCar = travelType === 'CAR';
  const isTrain = travelType === 'TRAIN';
  const isCruise = travelType === 'CRUISE';
  const isBus = travelType === 'BUS';
  const isFlight = !isCar && !isTrain && !isCruise && !isBus;

  const isCarryOn = bag.type === 'CARRY_ON';
  const carryOnPolicy = isCarryOn ? getCarrierCarryOnPolicy(companyName, travelType) : null;
  const hasNoWeightLimit = isCar || (isCarryOn && Boolean(carryOnPolicy?.hasNoWeightLimit)) || (!isFlight && bag.type !== 'CHECKED');

  let limitLbs: number | null = null;
  if (hasNoWeightLimit || isCar) {
    limitLbs = null;
  } else if (isCarryOn) {
    limitLbs = carryOnPolicy?.limitLbs ?? (isFlight ? (bag.maxWeightLimitLbs || 22) : (bag.maxWeightLimitLbs || 50));
  } else if (bag.type === 'CHECKED') {
    limitLbs = bag.maxWeightLimitLbs || 50;
  } else {
    // Personal item default
    limitLbs = isFlight ? (bag.maxWeightLimitLbs || 15) : (bag.maxWeightLimitLbs || 50);
  }

  let pct = 0;
  let formattedPct = '0%';
  let isOverweight = false;
  let isNearLimit = false;
  let overweightAmountLbs = 0;
  let displayLimit = '';

  if (hasNoWeightLimit || limitLbs === null) {
    pct = 0;
    formattedPct = isCar ? 'No vehicle limit' : 'No limit';
    isOverweight = false;
    isNearLimit = false;
    overweightAmountLbs = 0;
    displayLimit = isCar ? 'No vehicle limit' : isTrain ? 'No rail limit' : isCruise ? 'No cruise limit' : 'No airline limit';
  } else {
    // Fix 3: Compute percentage FROM the displayed (rounded) weight (e.g. 21.9 / 22 = 99.5%, 22.5 / 22 = 102.3%)
    const rawPct = limitLbs > 0 ? (displayedWeightLbs / limitLbs) * 100 : 0;
    pct = Number(rawPct.toFixed(1));
    formattedPct = `${rawPct.toFixed(1)}%`;
    isOverweight = displayedWeightLbs > limitLbs;
    isNearLimit = !isOverweight && displayedWeightLbs >= limitLbs * 0.85;
    overweightAmountLbs = isOverweight ? Math.max(0, displayedWeightLbs - limitLbs) : 0;

    displayLimit = weightUnit === 'KG'
      ? `${DefaultSuggestions.convertLbsToKg(limitLbs).toFixed(0)} kg`
      : `${limitLbs} lbs`;
  }

  const displayTotalWeight = weightUnit === 'KG'
    ? `${DefaultSuggestions.convertLbsToKg(displayedWeightLbs).toFixed(1)} kg`
    : `${displayedWeightLbs.toFixed(1)} lbs`;

  return {
    bag,
    emptyLbs,
    itemsLbs,
    totalWeightLbs,
    displayedWeightLbs,
    limitLbs,
    hasNoWeightLimit,
    pct,
    isOverweight,
    isNearLimit,
    overweightAmountLbs,
    displayTotalWeight,
    displayLimit,
    formattedPct
  };
}

/**
 * Single Source of Truth for computing the entire trip's bag weights and overweight status.
 * Evaluates carrier carry-on limits properly (e.g. Air Canada will not flag carry-ons as overweight).
 */
export function computeTripWeightStatus(
  trip: Trip,
  weightUnit: 'LBS' | 'KG' = 'LBS'
): TripWeightSummary {
  const bags = trip.bags || [];
  const bagStatuses = bags.map((b) => computeBagWeightStatus(b, weightUnit, trip.companyName, trip.travelType));

  const overweightBags = bagStatuses.filter((b) => b.isOverweight);
  const nearLimitBags = bagStatuses.filter((b) => b.isNearLimit);
  const hasOverweightBag = overweightBags.length > 0;
  const hasNearLimitBag = nearLimitBags.length > 0;

  const totalTripWeightLbs = bagStatuses.reduce((acc, b) => acc + b.displayedWeightLbs, 0);
  const displayTotalTripWeight = weightUnit === 'KG'
    ? `${DefaultSuggestions.convertLbsToKg(totalTripWeightLbs).toFixed(1)} kg`
    : `${totalTripWeightLbs.toFixed(1)} lbs`;

  return {
    bagStatuses,
    hasOverweightBag,
    hasNearLimitBag,
    overweightBags,
    nearLimitBags,
    totalTripWeightLbs,
    displayTotalTripWeight
  };
}
