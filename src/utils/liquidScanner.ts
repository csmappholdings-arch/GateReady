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
  'liquid',
  'water bottle',
  'foundation makeup',
  'mascara',
  'lip gloss',
  'liquid soap'
];

/**
 * Scan an item name for liquid keywords and capacity flags (TSA 3-1-1 rule: ≤3.4 oz / 100 ml for carry-on).
 */
export function scanItemForLiquids(itemName: string, bagType: BagType = 'CARRY_ON'): ScannedLiquidResult {
  if (!itemName) {
    return { isLiquid: false, status: 'NOT_LIQUID' };
  }

  const lower = itemName.toLowerCase();
  const matchedKeyword = LIQUID_KEYWORDS.find((kw) => lower.includes(kw));

  if (!matchedKeyword) {
    return { isLiquid: false, status: 'NOT_LIQUID' };
  }

  // Liquid is permitted in checked luggage without volume restriction (within typical airline max)
  if (bagType === 'CHECKED') {
    return {
      isLiquid: true,
      status: 'CHECKED_PERMITTED',
      detectedKeyword: matchedKeyword,
      badgeLabel: 'Checked Luggage Liquid (Permitted)',
      alertMessage: undefined
    };
  }

  // Parse bottle size (oz / fl oz / ml)
  let capacityOz: number | undefined;
  let capacityMl: number | undefined;

  // Pattern 1: e.g. "6oz", "6 oz", "3.4 oz", "8 fl oz"
  const ozMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:fl\s*oz|oz|ounce|ounces)/);
  if (ozMatch) {
    capacityOz = parseFloat(ozMatch[1]);
  }

  // Pattern 2: e.g. "100ml", "150 ml", "200ml"
  const mlMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:ml|milliliter|millilitres)/);
  if (mlMatch) {
    capacityMl = parseFloat(mlMatch[1]);
    if (capacityOz === undefined) {
      capacityOz = +(capacityMl / 29.5735).toFixed(1);
    }
  }

  // TSA 3-1-1 limits: 3.4 oz (100ml)
  const isOverLimit = (capacityOz !== undefined && capacityOz > 3.4) || (capacityMl !== undefined && capacityMl > 100);

  if (isOverLimit) {
    const sizeStr = capacityOz ? `${capacityOz} oz` : `${capacityMl} ml`;
    return {
      isLiquid: true,
      status: 'NON_COMPLIANT',
      detectedKeyword: matchedKeyword,
      capacityOz,
      capacityMl,
      badgeLabel: `⚠️ TSA 3-1-1 Alert (${sizeStr} > 3.4 oz)`,
      alertMessage: `${sizeStr} exceeds TSA 3.4 oz (100ml) security limit! Move to Checked Bag or transfer to a travel-size container to avoid security confiscation.`
    };
  }

  if (capacityOz !== undefined || capacityMl !== undefined) {
    const sizeStr = capacityOz ? `${capacityOz} oz` : `${capacityMl} ml`;
    return {
      isLiquid: true,
      status: 'COMPLIANT',
      detectedKeyword: matchedKeyword,
      capacityOz,
      capacityMl,
      badgeLabel: `✓ TSA 3-1-1 Pass (${sizeStr})`,
      alertMessage: undefined
    };
  }

  // Liquid detected, but container size not explicitly noted
  return {
    isLiquid: true,
    status: 'LIQUID_UNSPECIFIED',
    detectedKeyword: matchedKeyword,
    badgeLabel: '💧 TSA 3-1-1 Liquid (must be ≤3.4 oz / 100ml)',
    alertMessage: undefined
  };
}
