import { BagType } from '../types/travel';

export type LiquidStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'LIQUID_UNSPECIFIED' | 'CHECKED_PERMITTED' | 'NOT_LIQUID';

export interface ScannedLiquidResult {
  isLiquid: boolean;
  status: LiquidStatus;
  detectedKeyword?: string;
  capacityOz?: number;
  capacityMl?: number;
  badgeLabel?: string;
  alertMessage?: string;
}

const LIQUID_KEYWORDS = [
  'shampoo',
  'conditioner',
  'lotion',
  'body wash',
  'face wash',
  'cleanser',
  'sunscreen',
  'sunblock',
  'toothpaste',
  'perfume',
  'cologne',
  'fragrance',
  'mouthwash',
  'serum',
  'toner',
  'moisturizer',
  'gel',
  'hair gel',
  'shaving cream',
  'shaving gel',
  'aerosol',
  'hairspray',
  'deodorant spray',
  'hand sanitizer',
  'sanitizer',
  'contact solution',
  'saline solution',
  'eye drops',
  'liquid soap',
  'liquid',
  'liquids',
  'toiletries',
  'toiletry',
  'dopp kit',
  'water bottle',
  'foundation makeup',
  'mascara',
  'lip gloss'
];

/**
 * Scan an item name for liquid/toiletry keywords and capacity flags (TSA 3-1-1 rule: ≤3.4 oz / 100 ml for carry-on).
 * Single source of truth used by Rebalance Bags and all item badge views.
 */
export function scanItemForLiquids(itemName: string, bagType: BagType = 'CARRY_ON'): ScannedLiquidResult {
  if (!itemName) {
    return { isLiquid: false, status: 'NOT_LIQUID' };
  }

  const lower = itemName.toLowerCase();
  const matchedKeyword = LIQUID_KEYWORDS.find((kw) => lower.includes(kw));

  // Parse bottle size (oz / fl oz / ml) regardless of keyword match so custom items like "Aftershave 150ml" or "5 oz" are detected
  let capacityOz: number | undefined;
  let capacityMl: number | undefined;

  // Pattern 1: e.g. "6oz", "6 oz", "3.4 oz", "8 fl oz"
  const ozMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:fl\s*oz|oz|ounces?)/);
  if (ozMatch) {
    capacityOz = parseFloat(ozMatch[1]);
  }

  // Pattern 2: e.g. "100ml", "150 ml", "200 milliliter(s)"
  const mlMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:ml|milliliters?|millilitres?)/);
  if (mlMatch) {
    capacityMl = parseFloat(mlMatch[1]);
    if (capacityOz === undefined) {
      capacityOz = +(capacityMl / 29.5735).toFixed(1);
    }
  }

  const isExplicitFullSize = /\b(full[- ]?size|jumbo|family[- ]?size|value[- ]?size|oversized)\b/i.test(lower);
  const isExplicitTravelSize = /\b(3-1-1|3\.1\.1|travel[- ]?size|tsa[- ]?approved|mini)\b/i.test(lower);
  const hasExplicitNumericSize = capacityOz !== undefined || capacityMl !== undefined;

  if (!matchedKeyword && !hasExplicitNumericSize && !isExplicitFullSize && !isExplicitTravelSize) {
    return { isLiquid: false, status: 'NOT_LIQUID' };
  }

  // Liquid / full-size toiletries are permitted in checked luggage (within typical airline max)
  if (bagType === 'CHECKED') {
    return {
      isLiquid: true,
      status: 'CHECKED_PERMITTED',
      detectedKeyword: matchedKeyword,
      capacityOz,
      capacityMl,
      badgeLabel: 'Checked Luggage Liquid (Permitted)',
      alertMessage: undefined
    };
  }

  // TSA 3-1-1 limits: 3.4 oz (100 ml) — explicit over-limit volume OR full-size descriptor without <=100ml override
  const isOverNumericLimit = (capacityOz !== undefined && capacityOz > 3.4) || (capacityMl !== undefined && capacityMl > 100);
  const isOverLimit = isOverNumericLimit || (isExplicitFullSize && !hasExplicitNumericSize && !isExplicitTravelSize);

  if (isOverLimit) {
    const sizeStr = capacityOz ? `${capacityOz} oz` : capacityMl ? `${capacityMl} ml` : 'Full-size (>100 ml)';
    return {
      isLiquid: true,
      status: 'NON_COMPLIANT',
      detectedKeyword: matchedKeyword,
      capacityOz,
      capacityMl,
      badgeLabel: 'Exceeds 100 ml — checked bags only',
      alertMessage: `${sizeStr} exceeds the TSA 3-1-1 100 ml (3.4 oz) cabin liquids rule! Keep in a Checked Bag or switch to travel-size containers.`
    };
  }

  if (hasExplicitNumericSize || isExplicitTravelSize) {
    const sizeStr = capacityOz ? `${capacityOz} oz` : capacityMl ? `${capacityMl} ml` : '≤100 ml';
    return {
      isLiquid: true,
      status: 'COMPLIANT',
      detectedKeyword: matchedKeyword,
      capacityOz,
      capacityMl,
      badgeLabel: `TSA Pass (${sizeStr})`,
      alertMessage: undefined
    };
  }

  // Liquid detected, but container size not explicitly noted
  return {
    isLiquid: true,
    status: 'LIQUID_UNSPECIFIED',
    detectedKeyword: matchedKeyword,
    badgeLabel: 'TSA 3-1-1 (must be ≤100 ml / 3.4 oz)',
    alertMessage: undefined
  };
}
