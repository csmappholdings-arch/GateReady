import { Bag, Trip, getBagEmptyWeightLbs } from '../types/travel';
import { DefaultSuggestions } from '../data/suggestions';

export interface BagWeightStatus {
  bag: Bag;
  emptyLbs: number;
  itemsLbs: number;
  totalWeightLbs: number;
  limitLbs: number;
  pct: number;
  isOverweight: boolean;
  isNearLimit: boolean;
  overweightAmountLbs: number;
  displayTotalWeight: string;
  displayLimit: string;
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
 * Single Source of Truth for computing a bag's weight vs carrier limit.
 */
export function computeBagWeightStatus(bag: Bag, weightUnit: 'LBS' | 'KG' = 'LBS'): BagWeightStatus {
  const emptyLbs = getBagEmptyWeightLbs(bag);
  const itemsLbs = (bag.items || []).reduce((sum, item) => {
    const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
    return sum + w * (item.quantity || 1);
  }, 0);

  const totalWeightLbs = emptyLbs + itemsLbs;
  const standardCapLbs = bag.type === 'CHECKED' ? 50 : bag.type === 'CARRY_ON' ? 22 : 15;
  const limitLbs = (!bag.maxWeightLimitLbs || (bag.type !== 'CHECKED' && bag.maxWeightLimitLbs >= 40))
    ? standardCapLbs
    : bag.maxWeightLimitLbs;
  const pct = Math.round((totalWeightLbs / limitLbs) * 100);
  const isOverweight = totalWeightLbs > limitLbs;
  const isNearLimit = !isOverweight && totalWeightLbs >= limitLbs * 0.85;
  const overweightAmountLbs = isOverweight ? Math.max(0, totalWeightLbs - limitLbs) : 0;

  const displayTotalWeight = weightUnit === 'KG'
    ? `${DefaultSuggestions.convertLbsToKg(totalWeightLbs).toFixed(1)} kg`
    : `${totalWeightLbs.toFixed(1)} lbs`;

  const displayLimit = weightUnit === 'KG'
    ? `${DefaultSuggestions.convertLbsToKg(limitLbs).toFixed(0)} kg`
    : `${limitLbs} lbs`;

  return {
    bag,
    emptyLbs,
    itemsLbs,
    totalWeightLbs,
    limitLbs,
    pct,
    isOverweight,
    isNearLimit,
    overweightAmountLbs,
    displayTotalWeight,
    displayLimit
  };
}

/**
 * Single Source of Truth for computing the entire trip's bag weights and overweight status.
 */
export function computeTripWeightStatus(trip: Trip, weightUnit: 'LBS' | 'KG' = 'LBS'): TripWeightSummary {
  const bags = trip.bags || [];
  const bagStatuses = bags.map((b) => computeBagWeightStatus(b, weightUnit));

  const overweightBags = bagStatuses.filter((b) => b.isOverweight);
  const nearLimitBags = bagStatuses.filter((b) => b.isNearLimit);
  const hasOverweightBag = overweightBags.length > 0;
  const hasNearLimitBag = nearLimitBags.length > 0;

  const totalTripWeightLbs = bagStatuses.reduce((acc, b) => acc + b.totalWeightLbs, 0);
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
