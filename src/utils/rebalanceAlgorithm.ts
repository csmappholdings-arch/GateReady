import { Trip, Bag, PackingItem, BagType, getBagEmptyWeightLbs } from '../types/travel';
import { DefaultSuggestions } from '../data/suggestions';
import { computeBagWeightStatus } from './bagWeightAnalysis';

export interface BagWeightSnapshot {
  bagId: string;
  label: string;
  type: BagType;
  emptyLbs: number;
  itemsLbs: number;
  totalLbs: number;
  limitLbs: number | null;
  hasNoLimit: boolean;
  isOverweight: boolean;
  isNearLimit: boolean;
  headroomPct: number;
}

export interface SuggestedMove {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitWeightLbs: number;
  itemWeightLbs: number;
  sourceBagId: string;
  sourceBagLabel: string;
  sourceBagType: BagType;
  sourceBeforeLbs: number;
  sourceAfterLbs: number;
  sourceLimitLbs: number | null;
  destBagId: string;
  destBagLabel: string;
  destBagType: BagType;
  destBeforeLbs: number;
  destAfterLbs: number;
  destLimitLbs: number | null;
  isEssential: boolean;
}

export interface RebalanceComputationResult {
  snapshots: BagWeightSnapshot[];
  suggestedMoves: SuggestedMove[];
  allBagsBalanced: boolean;
  singleBagOnly: boolean;
  unweightedItemsCount: number;
  noSafeMoveReason: string | null;
}

/**
 * Verified Essential Item Detection:
 * NEVER suggest moving an essential item into a checked bag:
 * passport/ID, documents, medication, valuables, electronics, keys, lithium batteries.
 * Essentials may ONLY be suggested between cabin/carry-on bags (e.g. Carry-On <-> Personal Item).
 */
export function isEssentialItem(item: PackingItem): boolean {
  if (
    item.category === 'DOCUMENTS' || 
    item.category === 'VALUABLES' || 
    item.category === 'MEDICINE' || 
    item.category === 'ESSENTIALS'
  ) {
    return true;
  }

  const name = item.name.toLowerCase().trim();
  const essentialPatterns = [
    /\bpassports?\b/,
    /\b(?:government\s+)?id\b/,
    /\bidentification\b/,
    /\bdriver(?:'?s)?\s*licen[sc]e\b/,
    /\bvisas?\b/,
    /\bboarding\s*pass\b/,
    /\btickets?\b/,
    /\btravel\s*docs?\b/,
    /\bbirth\s*cert\b/,
    /\bgreen\s*card\b/,
    /\bnexus\b/,
    /\bglobal\s*entry\b/,
    /\bmedic(?:ation|ine)s?\b/,
    /\bprescriptions?\b/,
    /\binhalers?\b/,
    /\binsulin\b/,
    /\bepi-?pens?\b/,
    /\bpills?\b/,
    /\blaptops?\b/,
    /\bmacbooks?\b/,
    /\bipads?\b/,
    /\btablets?\b/,
    /\bphones?\b/,
    /\biphones?\b/,
    /\bcameras?\b/,
    /\bwallets?\b/,
    /\bcredit\s*cards?\b/,
    /\bcash\b/,
    /\bcurrency\b/,
    /\bjewel(?:ry|lery)\b/,
    /\brings?\b/,
    /\bdiamonds?\b/,
    /\bgold\b/,
    /\bvaluables?\b/,
    /\bnecklace\b/,
    /\bwatch(?:es)?\b/,
    /\bhouse\s*keys?\b/,
    /\bcar\s*keys?\b/,
    /\bkeys\b/,
    /\bpower\s*banks?\b/,
    /\bportable\s*chargers?\b/,
    /\blithium\b/,
    /\bvapes?\b/,
    /\be-?cigs?\b/,
    /\bairpods?\b/,
    /\bheadphones?\b/
  ];

  return essentialPatterns.some((pattern) => pattern.test(name));
}

/**
 * Get item weight in lbs. Returns null if item has no valid weight.
 */
/**
 * Single unit weight in lbs without quantity multiplier.
 */
export function getItemUnitWeightLbs(item: PackingItem): number | null {
  if (typeof item.customWeightLbs === 'number' && Number.isFinite(item.customWeightLbs) && item.customWeightLbs > 0) {
    return item.customWeightLbs;
  }
  const estimated = DefaultSuggestions.getEstimatedWeightLbs(item.name);
  if (typeof estimated === 'number' && Number.isFinite(estimated) && estimated > 0) {
    return estimated;
  }
  return null;
}

/**
 * Total item entry weight in lbs (unit weight * quantity). Returns null if item has no valid weight.
 */
export function getItemWeightLbs(item: PackingItem): number | null {
  const unit = getItemUnitWeightLbs(item);
  if (unit === null) return null;
  const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
  return Number((unit * qty).toFixed(1));
}

/**
 * Get effective weight cap for a bag on a trip using the single source of truth (computeBagWeightStatus).
 * Ensures carriers with no carry-on weight limit (e.g. Delta Air Lines, Air Canada) never get assigned an artificial limit.
 */
export function getBagWeightCapLbs(bag: Bag, companyName: string | undefined, travelType: Trip['travelType']): { limitLbs: number | null; hasNoLimit: boolean } {
  const status = computeBagWeightStatus(bag, 'LBS', companyName, travelType || 'PLANE');
  return {
    limitLbs: status.limitLbs,
    hasNoLimit: status.hasNoWeightLimit
  };
}

export function calculateBagTotalWeightLbs(bag: Bag): number {
  const emptyLbs = getBagEmptyWeightLbs(bag);
  const itemsLbs = (bag.items || []).reduce((sum, item) => {
    const unit = typeof item.customWeightLbs === 'number' && Number.isFinite(item.customWeightLbs) && item.customWeightLbs > 0
      ? item.customWeightLbs
      : DefaultSuggestions.getEstimatedWeightLbs(item.name);
    const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
    return sum + (unit * qty);
  }, 0);
  return Number((emptyLbs + itemsLbs).toFixed(1));
}

/**
 * Compute snapshot for a bag using the shared computeBagWeightStatus analysis.
 */
export function computeBagSnapshot(bag: Bag, companyName: string | undefined, travelType: Trip['travelType']): BagWeightSnapshot {
  const status = computeBagWeightStatus(bag, 'LBS', companyName, travelType || 'PLANE');

  return {
    bagId: bag.id,
    label: bag.label,
    type: bag.type,
    emptyLbs: status.emptyLbs,
    itemsLbs: status.itemsLbs,
    totalLbs: status.displayedWeightLbs,
    limitLbs: status.limitLbs,
    hasNoLimit: status.hasNoWeightLimit,
    isOverweight: status.isOverweight,
    isNearLimit: status.isNearLimit,
    headroomPct: status.pct
  };
}

/**
 * Core Algorithm: Rebalance Bags
 * Computes suggested item moves to bring overweight (or near-limit) bags under their limits.
 *
 * Rules:
 * 1. Prefer solutions with fewest moves that bring every bag to or under its carrier limit.
 * 2. Never suggest a move that pushes destination bag over its limit.
 * 3. NEVER suggest an essential item into a checked bag (documents, medication, valuables, etc.).
 * 4. Exclude items without weight and notify the user.
 * 5. If no safe move exists, return clear explanation without fabricating moves.
 */
export function computeRebalanceSuggestions(trip: Trip): RebalanceComputationResult {
  const bags = trip.bags || [];

  if (bags.length <= 1) {
    const singleSnapshot = bags.map((b) => computeBagSnapshot(b, trip.companyName, trip.travelType));
    return {
      snapshots: singleSnapshot,
      suggestedMoves: [],
      allBagsBalanced: !singleSnapshot.some((s) => s.isOverweight),
      singleBagOnly: true,
      unweightedItemsCount: 0,
      noSafeMoveReason: 'Trip contains only 1 bag. Add a Personal Item or Checked Bag to rebalance items between luggage.'
    };
  }

  // Calculate current snapshots for all bags
  const snapshots = bags.map((b) => computeBagSnapshot(b, trip.companyName, trip.travelType));
  const overweightBags = snapshots.filter((s) => s.isOverweight);
  const nearLimitBags = snapshots.filter((s) => s.isNearLimit && !s.isOverweight);

  // If no bag is overweight or near limit, bags are already balanced!
  if (overweightBags.length === 0 && nearLimitBags.length === 0) {
    return {
      snapshots,
      suggestedMoves: [],
      allBagsBalanced: true,
      singleBagOnly: false,
      unweightedItemsCount: 0,
      noSafeMoveReason: null
    };
  }

  let unweightedItemsCount = 0;
  const bagsToLighten = overweightBags.length > 0 ? overweightBags : nearLimitBags;
  
  // Track simulated items in each bag so predictions and post-apply weights are 1:1 identical
  const simulatedBagItems = new Map<string, PackingItem[]>(
    bags.map((b) => [b.id, [...(b.items || [])]])
  );
  const suggestedMoves: SuggestedMove[] = [];

  for (const sourceSnapshot of bagsToLighten) {
    const sourceBag = bags.find((b) => b.id === sourceSnapshot.bagId);
    if (!sourceBag) continue;

    const sourceLimit = sourceSnapshot.limitLbs;
    if (sourceLimit === null) continue; // No limit, no need to lighten

    // Check current simulated weight of source bag
    let currentSourceItems = simulatedBagItems.get(sourceBag.id) || [...sourceBag.items];
    let currentSourceWeight = calculateBagTotalWeightLbs({ ...sourceBag, items: currentSourceItems });

    // If source bag is already under limit in simulation, continue
    if (currentSourceWeight <= sourceLimit) continue;

    // Available candidate destination bags (other bags that have capacity)
    const candidateDestBags = snapshots.filter((d) => d.bagId !== sourceSnapshot.bagId);

    // Collect candidate items from source bag with valid weights
    const candidateItems: Array<{ item: PackingItem; weightLbs: number; unitWeightLbs: number; quantity: number; isEssential: boolean }> = [];

    for (const item of currentSourceItems) {
      const w = getItemWeightLbs(item);
      const unit = getItemUnitWeightLbs(item);
      if (w === null || w <= 0 || unit === null) {
        unweightedItemsCount++;
        continue;
      }
      const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
      candidateItems.push({
        item,
        weightLbs: w,
        unitWeightLbs: unit,
        quantity,
        isEssential: isEssentialItem(item)
      });
    }

    // Sort candidate items: largest weight first to find fewest moves
    candidateItems.sort((a, b) => b.weightLbs - a.weightLbs);

    // Find moves
    for (const cand of candidateItems) {
      if (currentSourceWeight <= sourceLimit) break; // Source bag is already balanced!

      // Try each candidate destination bag
      for (const destSnapshot of candidateDestBags) {
        const destBag = bags.find((b) => b.id === destSnapshot.bagId);
        if (!destBag) continue;

        const currentDestItems = simulatedBagItems.get(destBag.id) || [...destBag.items];
        const currentDestWeight = calculateBagTotalWeightLbs({ ...destBag, items: currentDestItems });
        const destLimit = destSnapshot.limitLbs;

        // RULE: NEVER suggest an essential item into a CHECKED bag!
        if (destBag.type === 'CHECKED' && cand.isEssential) {
          continue; // Disqualified!
        }

        // Test prospective destination bag items & weight
        const prospectiveDestItems = [...currentDestItems, cand.item];
        const prospectiveDestWeight = calculateBagTotalWeightLbs({ ...destBag, items: prospectiveDestItems });

        // RULE: Destination bag must not exceed limit after move
        if (destLimit !== null && prospectiveDestWeight > destLimit) {
          continue; // Would overload destination bag!
        }

        // Test prospective source bag items & weight
        const prospectiveSourceItems = currentSourceItems.filter((i) => i.id !== cand.item.id);
        const prospectiveSourceWeight = calculateBagTotalWeightLbs({ ...sourceBag, items: prospectiveSourceItems });

        // This move is valid!
        const sourceAfter = prospectiveSourceWeight;
        const destAfter = prospectiveDestWeight;
        const displayName = cand.quantity > 1 ? `${cand.quantity}x ${cand.item.name}` : cand.item.name;

        suggestedMoves.push({
          id: `move-${sourceBag.id}-${destBag.id}-${cand.item.id}`,
          itemId: cand.item.id,
          itemName: displayName,
          quantity: cand.quantity,
          unitWeightLbs: cand.unitWeightLbs,
          itemWeightLbs: cand.weightLbs,
          sourceBagId: sourceBag.id,
          sourceBagLabel: sourceBag.label,
          sourceBagType: sourceBag.type,
          sourceBeforeLbs: currentSourceWeight,
          sourceAfterLbs: sourceAfter,
          sourceLimitLbs: sourceLimit,
          destBagId: destBag.id,
          destBagLabel: destBag.label,
          destBagType: destBag.type,
          destBeforeLbs: currentDestWeight,
          destAfterLbs: destAfter,
          destLimitLbs: destLimit,
          isEssential: cand.isEssential
        });

        // Update simulation states
        currentSourceItems = prospectiveSourceItems;
        currentSourceWeight = prospectiveSourceWeight;
        simulatedBagItems.set(sourceBag.id, prospectiveSourceItems);
        simulatedBagItems.set(destBag.id, prospectiveDestItems);
        break; // Item moved, go to next item
      }
    }
  }

  // Check if safe moves were found
  let noSafeMoveReason: string | null = null;
  if (suggestedMoves.length === 0) {
    const hasOnlyEssentialsLeft = bagsToLighten.some((s) => {
      const b = bags.find((bag) => bag.id === s.bagId);
      return b && b.items.length > 0 && b.items.every((i) => isEssentialItem(i));
    });

    if (hasOnlyEssentialsLeft) {
      noSafeMoveReason = 'No safe move found — overweight items are essential documents or medications that cannot be placed into checked luggage. Please repack by hand or carry in a personal item.';
    } else {
      noSafeMoveReason = 'No safe move found — remove an item or repack by hand.';
    }
  }

  return {
    snapshots,
    suggestedMoves,
    allBagsBalanced: false,
    singleBagOnly: false,
    unweightedItemsCount,
    noSafeMoveReason
  };
}
