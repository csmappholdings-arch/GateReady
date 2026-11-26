import { BagType } from '../types/travel';

export type LiquidStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'LIQUID_UNSPECIFIED' | 'CHECKED_PERMITTED' | 'NOT_LIQUID';
export type LiquidRuleRegion = 'US' | 'CA' | 'INTL';

export interface ScannedLiquidResult {
  isLiquid: boolean;
  status: LiquidStatus;
  detectedKeyword?: string;
  capacityOz?: number;
  capacityMl?: number;
  badgeLabel?: string;
  alertMessage?: string;
}

const CANADA_ORIGIN_REGEX =
  /\b(?:canada|toronto|yyz|ytz|vancouver|yvr|montreal|yul|calgary|yyc|edmonton|yeg|ottawa|yow|winnipeg|ywg|halifax|yhz|quebec|yqb|victoria|yyj|kelowna|ylw|saskatoon|yxe|regina|yqr|moncton|yqm|st\.?\s*john'?s|yyt|on|bc|ab|qc|mb|sk|ns|nb|nl|pe)\b/i;

const US_ORIGIN_REGEX =
  /\b(?:united states|usa|u\.s\.|new york|jfk|lga|ewr|los angeles|lax|chicago|ord|mdw|miami|mia|dallas|dfw|atlanta|atl|seattle|sea|san francisco|sfo|boston|bos|denver|den|phoenix|phx|las vegas|las|orlando|mco|houston|iah|hou|washington|iad|dca|bwi|honolulu|hnl|charlotte|clt|detroit|dtw|minneapolis|msp|philadelphia|phl|us)\b/i;

/**
 * Infer departure airport security liquids authority from trip origin city/airport code.
 * Defaults to 'INTL' (shows dual TSA / CATSA guidance) when origin country is unknown.
 */
export function inferDepartureLiquidRegion(originCity?: string | null): LiquidRuleRegion {
  if (!originCity || !originCity.trim()) return 'INTL';
  if (CANADA_ORIGIN_REGEX.test(originCity)) return 'CA';
  if (US_ORIGIN_REGEX.test(originCity)) return 'US';
  return 'INTL';
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
  'lip gloss',
  'yogurt',
  'peanut butter',
  'maple syrup',
  'honey'
];

/**
 * Scan an item name for liquid/toiletry/non-solid food keywords and capacity flags:
 * - US TSA 3-1-1: ≤ 3.4 fl oz (100 mL) inside 1 clear quart-sized zip-top bag per passenger
 * - Canada CATSA: ≤ 100 mL / 100 g inside 1 clear, closed, resealable plastic bag max 1 liter per passenger
 * Single source of truth used by Rebalance Bags, checklists, and item badge views.
 */
export function scanItemForLiquids(
  itemName: string,
  bagType: BagType = 'CARRY_ON',
  region: LiquidRuleRegion = 'INTL'
): ScannedLiquidResult {
  if (!itemName) {
    return { isLiquid: false, status: 'NOT_LIQUID' };
  }

  const lower = itemName.toLowerCase();
  const matchedKeyword = LIQUID_KEYWORDS.find((kw) => lower.includes(kw));

  // Parse bottle size (oz / fl oz / ml / g) regardless of keyword match so custom items like "Aftershave 150ml" or "5 oz" are detected
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

  // Pattern 3: CATSA weight-marked gels/pastes/non-solid food e.g. "150g", "100 g"
  const gramMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:g|grams?)\b/);
  if (!mlMatch && gramMatch && matchedKeyword) {
    capacityMl = parseFloat(gramMatch[1]);
  }

  const isExplicitFullSize = /\b(full[- ]?size|jumbo|family[- ]?size|value[- ]?size|oversized)\b/i.test(lower);
  const isExplicitTravelSize = /\b(3-1-1|3\.1\.1|travel[- ]?size|tsa[- ]?approved|catsa[- ]?approved|mini)\b/i.test(lower);
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

  // Security threshold: 3.4 fl oz / 100 mL (100 g for gels/pastes/non-solid foods in Canada)
  const isOverNumericLimit = (capacityOz !== undefined && capacityOz > 3.4) || (capacityMl !== undefined && capacityMl > 100);
  const isOverLimit = isOverNumericLimit || (isExplicitFullSize && !hasExplicitNumericSize && !isExplicitTravelSize);

  if (isOverLimit) {
    const sizeStr = capacityOz ? `${capacityOz} oz` : capacityMl ? `${capacityMl} mL` : 'Full-size (>100 mL)';
    const ruleName =
      region === 'CA'
        ? "Canada's CATSA 100 mL / 100 g (1 L bag) carry-on liquids & non-solid food rule"
        : region === 'US'
          ? 'the US TSA 3-1-1 3.4 fl oz (100 mL) carry-on liquids rule'
          : 'the 100 mL / 3.4 fl oz (TSA 3-1-1 / CATSA) carry-on liquids limit';
    return {
      isLiquid: true,
      status: 'NON_COMPLIANT',
      detectedKeyword: matchedKeyword,
      capacityOz,
      capacityMl,
      badgeLabel: 'Exceeds 100 mL — checked bags only',
      alertMessage: `${sizeStr} exceeds ${ruleName}. Planning guidance only — move to Checked Baggage, switch to ≤ 100 mL containers, or declare if medically/infant exempt.`
    };
  }

  if (hasExplicitNumericSize || isExplicitTravelSize) {
    const sizeStr = capacityMl && region === 'CA'
      ? `${capacityMl} mL`
      : capacityOz
        ? `${capacityOz} oz`
        : capacityMl
          ? `${capacityMl} mL`
          : '≤100 mL';
    const passLabel =
      region === 'CA'
        ? `CATSA Pass (${sizeStr})`
        : region === 'US'
          ? `TSA Pass (${sizeStr})`
          : `Liquids Pass (${sizeStr})`;
    return {
      isLiquid: true,
      status: 'COMPLIANT',
      detectedKeyword: matchedKeyword,
      capacityOz,
      capacityMl,
      badgeLabel: passLabel,
      alertMessage: undefined
    };
  }

  // Liquid detected, but container size not explicitly noted
  const unspecifiedLabel =
    region === 'CA'
      ? 'CATSA: ≤100 mL / 100 g in 1 L bag'
      : region === 'US'
        ? 'TSA 3-1-1 (≤3.4 oz / 100 mL)'
        : 'TSA 3-1-1 / CATSA (≤100 mL / 3.4 oz)';

  return {
    isLiquid: true,
    status: 'LIQUID_UNSPECIFIED',
    detectedKeyword: matchedKeyword,
    badgeLabel: unspecifiedLabel,
    alertMessage: undefined
  };
}
