// Static Airline Fare Family Definitions for the 42 Allowance Engine Airlines
// Brand rule: Static reference from published airline tables. Never claim live pricing or live availability.
// Default family is each carrier's standard / main cabin fare (not unbundled basic).

export interface AirlineFareFamily {
  id: string; // e.g. 'standard', 'basic', 'flex', 'business'
  name: string; // User-facing label: e.g. "Main Cabin / Standard Economy", "UltraBasic / Basic Economy", "SAS Go Light", "SAS Go"
  isDefault?: boolean; // Default standard fare family
  includedCheckedBags: number; // 0, 1, 2
  firstCheckedFee: number; // fee if not included in fare
  secondCheckedFee: number; // fee for 2nd checked bag
  carryOnAllowed: boolean; // false if overhead carry-on restricted
  carryOnFee: number; // fee if ULCC charges for carry-on
  carryOnRestrictionNotice?: string; // e.g. "No overhead carry-on allowed (under-seat personal item only)"
  fareNote: string; // Explanatory note matching this specific family
  variesByFare?: boolean;
}

export const AIRLINE_FARE_FAMILIES_DATA: Record<string, AirlineFareFamily[]> = {
  // ================= CANADA (5) =================
  aircanada: [
    {
      id: 'standard',
      name: 'Standard / Flex Economy',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Standard Economy: 1st checked bag $35 CAD, 2nd $50 CAD. Free overhead carry-on included (no weight limit).'
    },
    {
      id: 'basic',
      name: 'Basic Economy',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Basic Economy: non-refundable, 1st checked bag $35 CAD, 2nd $50 CAD. Free carry-on roller included.'
    },
    {
      id: 'latitude',
      name: 'Comfort / Latitude',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Comfort and Latitude fares include 2 free checked bags (up to 50 lbs each) + free carry-on.'
    },
    {
      id: 'business',
      name: 'Business Class / Signature',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 free checked bags up to 70 lbs (32 kg) each + priority baggage.'
    }
  ],

  westjet: [
    {
      id: 'standard',
      name: 'Econo / EconoFlex',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Standard Econo: $35 CAD 1st bag, $50 CAD 2nd bag. Free overhead carry-on included (no maximum weight limit).'
    },
    {
      id: 'ultrabasic',
      name: 'UltraBasic',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: false,
      carryOnFee: 0,
      carryOnRestrictionNotice: 'No overhead carry-on allowed on Canada/US flights (under-seat personal item only).',
      fareNote: 'UltraBasic fares do NOT include an overhead carry-on on Canada/US flights. Under-seat personal item only. 1st checked bag $35 CAD, 2nd $50 CAD.'
    },
    {
      id: 'premium',
      name: 'Premium / Business',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Premium and Business fares include 2 free checked bags (up to 50 lbs / 70 lbs) + free carry-on.'
    }
  ],

  porter: [
    {
      id: 'standard',
      name: 'PorterClassic Standard',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'PorterClassic Standard includes free overhead carry-on. 1st checked bag $35 CAD online, 2nd $50 CAD.'
    },
    {
      id: 'basic',
      name: 'PorterClassic Basic',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: false,
      carryOnFee: 0,
      carryOnRestrictionNotice: 'Overhead carry-on bag is not included (personal under-seat item only). $35 CAD fee to check at gate.',
      fareNote: 'PorterClassic Basic excludes overhead carry-on (personal item only). 1st checked bag $35 CAD online.'
    },
    {
      id: 'reserve',
      name: 'PorterReserve',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'PorterReserve all-inclusive fare includes 2 checked bags ($0) + free carry-on.'
    }
  ],

  airtransat: [
    {
      id: 'standard',
      name: 'Standard / Eco Budget',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 40,
      secondCheckedFee: 55,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Eco Standard: $40 CAD 1st checked bag, $55 CAD 2nd checked bag. Free carry-on roller included.'
    },
    {
      id: 'club',
      name: 'Club Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Club Class includes 2 free checked bags (up to 70 lbs / 32 kg) + priority boarding.'
    }
  ],

  flair: [
    {
      id: 'basic',
      name: 'Bare Fare (Unbundled)',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 59,
      secondCheckedFee: 79,
      carryOnAllowed: false,
      carryOnFee: 39,
      carryOnRestrictionNotice: 'ULCC unbundled: Carry-on roller costs $39 CAD. Only a small personal item (15 x 13 x 6 in) is free.',
      fareNote: 'Flair Bare Fare: Unbundled ultra-low-cost. Carry-on bag is $39 CAD online; 1st checked bag $59 CAD, 2nd $79 CAD.'
    },
    {
      id: 'bundle',
      name: 'Bundle / Big Forward Seat',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 79,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Flair Bundle packages include 1 carry-on roller + 1 checked bag ($0).'
    }
  ],

  // ================= USA (11) =================
  delta: [
    {
      id: 'standard',
      name: 'Main Cabin',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Main Cabin: $35 USD 1st checked bag, $45 USD 2nd checked bag. Free carry-on included.'
    },
    {
      id: 'basic',
      name: 'Basic Economy',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Delta Basic Economy includes a free overhead carry-on roller + personal item. Checked bags: $35 USD 1st, $45 USD 2nd.'
    },
    {
      id: 'first',
      name: 'First Class / Delta One',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'First Class & Delta One include 2 free checked bags up to 70 lbs (32 kg) each.'
    }
  ],

  american: [
    {
      id: 'standard',
      name: 'Main Cabin',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Main Cabin: $35 USD 1st bag online ($40 at airport), $45 USD 2nd bag. Free carry-on included.'
    },
    {
      id: 'basic',
      name: 'Basic Economy',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'American Airlines Basic Economy includes 1 free carry-on bag plus personal item. Checked bags $35 USD 1st, $45 USD 2nd.'
    },
    {
      id: 'business_first',
      name: 'Business / First Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business and First Class include 2-3 free checked bags up to 70 lbs (32 kg) each.'
    }
  ],

  united: [
    {
      id: 'standard',
      name: 'Economy / Main Cabin',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy / Main Cabin: $35 USD 1st bag ($40 at airport), $45 USD 2nd bag. Free overhead carry-on included.'
    },
    {
      id: 'basic',
      name: 'Basic Economy',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: false,
      carryOnFee: 0,
      carryOnRestrictionNotice: 'Overhead carry-on roller NOT permitted on domestic flights (personal under-seat item only).',
      fareNote: 'United Basic Economy: NO overhead carry-on permitted on domestic US flights (under-seat item only, unless Premier/cardholder). $35 USD 1st checked bag.'
    },
    {
      id: 'polaris',
      name: 'United Polaris / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'United Polaris and First Class include 2 free checked bags up to 70 lbs (32 kg) each.'
    }
  ],

  southwest: [
    {
      id: 'standard',
      name: 'Wanna Get Away / Any Fare',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Bags Fly Free: 2 checked bags included ($0) up to 50 lbs each on all fares. Free carry-on + personal item.'
    }
  ],

  jetblue: [
    {
      id: 'standard',
      name: 'Blue / Standard',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Blue: $35 USD 1st checked bag ($40 airport), $50 USD 2nd bag. Free carry-on roller included.'
    },
    {
      id: 'basic',
      name: 'Blue Basic',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Blue Basic: Free carry-on roller bag now included on all routes. 1st checked bag $35 USD.'
    },
    {
      id: 'mint',
      name: 'Blue Plus / Mint',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Blue Plus includes 1 checked bag ($0); Mint includes 2 free checked bags up to 70 lbs.'
    }
  ],

  alaska: [
    {
      id: 'standard',
      name: 'Main Cabin',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Main: $35 USD 1st checked bag, $45 USD 2nd bag. Free carry-on included.'
    },
    {
      id: 'saver',
      name: 'Saver (Basic)',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Saver fare includes free carry-on + personal item. 1st checked bag $35 USD, 2nd $45 USD.'
    },
    {
      id: 'first',
      name: 'First Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'First Class includes 2 free checked bags up to 70 lbs (32 kg) each.'
    }
  ],

  hawaiian: [
    {
      id: 'standard',
      name: 'Main Cabin',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 40,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Main Cabin: $35 USD 1st checked bag ($30 inter-island), $40 USD 2nd bag. Free carry-on included.'
    },
    {
      id: 'first',
      name: 'First / Business',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'First and Business Class include 2 free checked bags up to 70 lbs (32 kg) each.'
    }
  ],

  spirit: [
    {
      id: 'basic',
      name: 'Standard (Unbundled)',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 40,
      secondCheckedFee: 50,
      carryOnAllowed: false,
      carryOnFee: 45,
      carryOnRestrictionNotice: 'ULCC unbundled: Carry-on roller requires a fee (~$45 USD). Only a personal item (18 x 14 x 8 in) is free.',
      fareNote: 'Spirit Standard: Unbundled model. Personal item is free; carry-on bag is ~$45 USD, 1st checked bag is ~$40 USD online.'
    },
    {
      id: 'gobig',
      name: 'Go Big / Go Comfy',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Go Big and Go Comfy bundles include 1 carry-on roller and 1 checked bag ($0).'
    }
  ],

  frontier: [
    {
      id: 'basic',
      name: 'Basic (Unbundled)',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 55,
      secondCheckedFee: 70,
      carryOnAllowed: false,
      carryOnFee: 55,
      carryOnRestrictionNotice: 'ULCC unbundled: Carry-on roller costs ~$55 USD. Only personal item (14 x 18 x 8 in) is free.',
      fareNote: 'Frontier Basic: Unbundled pricing. Carry-on roller ~$55 USD online; 1st checked bag ~$55 USD, 2nd $70 USD.'
    },
    {
      id: 'bundle',
      name: 'Economy / Business Bundle',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 70,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Frontier bundle packages include 1 carry-on roller + 1 checked bag ($0).'
    }
  ],

  allegiant: [
    {
      id: 'basic',
      name: 'Basic (Unbundled)',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: false,
      carryOnFee: 35,
      carryOnRestrictionNotice: 'ULCC unbundled: Carry-on roller costs ~$35 USD. Only 1 personal item is free.',
      fareNote: 'Allegiant Basic: Unbundled fees. Carry-on bag is ~$35 USD; 1st checked bag ~$35 USD online.'
    },
    {
      id: 'bundle',
      name: 'Bonus / Total Bundle',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Bonus and Total bundles include carry-on and 1 checked bag ($0).'
    }
  ],

  suncountry: [
    {
      id: 'basic',
      name: 'Standard (Unbundled)',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: false,
      carryOnFee: 30,
      carryOnRestrictionNotice: 'ULCC unbundled: Carry-on roller costs ~$30 USD online. Only 1 personal under-seat item is free.',
      fareNote: 'Sun Country Standard: Under-seat bag is free. Carry-on roller is ~$30 USD; 1st checked bag is ~$35 USD online.'
    },
    {
      id: 'bundle',
      name: 'Bundle / Best Fare',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Best Fare bundles include 1 carry-on roller and 1 checked bag ($0).'
    }
  ],

  // ================= EUROPE (13) =================
  britishairways: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 65,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Standard includes 1 free checked bag (23 kg / 50 lbs) + free carry-on + personal item.'
    },
    {
      id: 'basic',
      name: 'Economy Basic',
      includedCheckedBags: 0,
      firstCheckedFee: 45,
      secondCheckedFee: 65,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Basic: unbundled hand-baggage-only fare. 1st checked bag is ~£35–£50 ($45 USD). Free carry-on included.'
    },
    {
      id: 'premium',
      name: 'World Traveller Plus / Club',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'World Traveller Plus and Club Europe/World include 2 free checked bags (23 kg / 32 kg each).'
    }
  ],

  airfrance_klm: [
    {
      id: 'standard',
      name: 'Standard / Classic',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 75,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Standard Economy includes 1 free checked bag (23 kg) + free carry-on. Additional bag €75.'
    },
    {
      id: 'light',
      name: 'Light (Hand Baggage Only)',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 75,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Light: 1st checked bag €30–€35 online (€70 airport). Free carry-on (12 kg) included.'
    },
    {
      id: 'business',
      name: 'Premium / Business',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Premium Economy and Business Class include 2 free checked bags (23 kg / 32 kg each).'
    }
  ],

  lufthansa: [
    {
      id: 'standard',
      name: 'Classic / Flex',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 80,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Classic & Flex include 1 free checked bag (23 kg) + free carry-on (8 kg).'
    },
    {
      id: 'light',
      name: 'Economy Light',
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 80,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Light unbundled fare charges €30–€35 for the 1st checked bag (€65 at gate). Free carry-on included.'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 checked bags (32 kg each); First Class includes 3 checked bags ($0).'
    }
  ],

  ryanair: [
    {
      id: 'regular',
      name: 'Regular / Priority & 2 Cabin Bags',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 25,
      secondCheckedFee: 40,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Priority & 2 Cabin Bags includes 1 small personal bag + 1 10 kg overhead wheelie bag. 1st checked bag (20 kg) is €25.'
    },
    {
      id: 'basic',
      name: 'Basic Fare',
      includedCheckedBags: 0,
      firstCheckedFee: 25,
      secondCheckedFee: 40,
      carryOnAllowed: false,
      carryOnFee: 18,
      carryOnRestrictionNotice: 'Small personal bag ONLY (40 x 20 x 25 cm). Overhead wheelie bag requires Priority fee (€12–€25).',
      fareNote: 'Ryanair Basic: 1 small personal item under seat only. Overhead carry-on wheelie bag costs €12–€25; 20 kg checked bag €25.'
    },
    {
      id: 'plus',
      name: 'Plus Fare',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 40,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Plus fare includes 1 small bag, 1 10 kg check-in bag ($0), and 1 20 kg checked bag ($0).'
    }
  ],

  easyjet: [
    {
      id: 'standard',
      name: 'Standard Fare',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 45,
      carryOnAllowed: false,
      carryOnFee: 20,
      carryOnRestrictionNotice: 'Small under-seat bag only (45 x 36 x 20 cm). Large overhead cabin bag requires a fee (€15–€30).',
      fareNote: 'easyJet Standard: 1 small under-seat bag free. Large overhead cabin bag costs €15–€30; 1st checked bag (23 kg) €35 online.'
    },
    {
      id: 'plus',
      name: 'easyJet Plus / Flexi',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'easyJet Plus & Flexi include 1 large overhead cabin bag + 1 23 kg checked bag ($0).'
    }
  ],

  turkish: [
    {
      id: 'standard',
      name: 'EcoFly / Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'International Americas routes include 2 free checked bags (up to 23 kg each) + 8 kg carry-on.'
    },
    {
      id: 'business',
      name: 'Business Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 free checked bags (up to 32 kg each) + 2 carry-ons.'
    }
  ],

  iberia: [
    {
      id: 'standard',
      name: 'Standard / Optimal',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Standard fares include 1 free checked bag (23 kg) + free carry-on. Additional bag €45.'
    },
    {
      id: 'basic',
      name: 'Basic Fare',
      includedCheckedBags: 0,
      firstCheckedFee: 25,
      secondCheckedFee: 45,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Iberia Basic unbundled fare: 1st checked bag €25 online (€40 airport). Free carry-on included.'
    },
    {
      id: 'business',
      name: 'Business Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 free checked bags (up to 32 kg each).'
    }
  ],

  sas: [
    {
      id: 'standard',
      name: 'SAS Go',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 60,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'SAS Go includes 1 free checked bag (23 kg) + free carry-on (8 kg). Additional bag €60.'
    },
    {
      id: 'light',
      name: 'SAS Go Light',
      includedCheckedBags: 0,
      firstCheckedFee: 30,
      secondCheckedFee: 60,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'SAS Go Light: unbundled hand-baggage fare. 1st checked bag €30 online (€60 at gate). Free carry-on included.'
    },
    {
      id: 'plus',
      name: 'SAS Plus / Business',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'SAS Plus and Business include 2 free checked bags (up to 32 kg each).'
    }
  ],

  virgin: [
    {
      id: 'standard',
      name: 'Economy Classic / Delight',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 65,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Classic & Delight include 1 free checked bag (23 kg / 50 lbs) + free carry-on.'
    },
    {
      id: 'light',
      name: 'Economy Light',
      includedCheckedBags: 0,
      firstCheckedFee: 50,
      secondCheckedFee: 65,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Light: unbundled fare. 1st checked bag is £50 online. Free carry-on (10 kg) included.'
    },
    {
      id: 'upper',
      name: 'Premium / Upper Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Premium includes 2 checked bags (23 kg); Upper Class includes 2 bags up to 32 kg ($0).'
    }
  ],

  ita: [
    {
      id: 'standard',
      name: 'Classic Economy',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 60,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Classic Economy includes 1 free checked bag (23 kg) + 8 kg carry-on.'
    },
    {
      id: 'light',
      name: 'Light Fare',
      includedCheckedBags: 0,
      firstCheckedFee: 30,
      secondCheckedFee: 60,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Light unbundled fare charges €30 online for the 1st checked bag (€60 airport). Free carry-on included.'
    },
    {
      id: 'business',
      name: 'Superior / Business',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Superior & Business Class include 2 free checked bags (up to 32 kg each).'
    }
  ],

  tap: [
    {
      id: 'standard',
      name: 'Classic / Plus',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 55,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Classic & Plus fares include 1 free checked bag (23 kg) + free carry-on.'
    },
    {
      id: 'discount',
      name: 'Discount (Hand Baggage Only)',
      includedCheckedBags: 0,
      firstCheckedFee: 30,
      secondCheckedFee: 55,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Discount fare: 1st checked bag €30 online (€60 at airport). Free carry-on included.'
    },
    {
      id: 'business',
      name: 'Executive / Business',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Executive & Business include 2 free checked bags (up to 32 kg each).'
    }
  ],

  finnair: [
    {
      id: 'classic',
      name: 'Classic / Flex',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 60,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Classic and Flex fares include 1 free checked bag (23 kg) + free carry-on (8 kg).'
    },
    {
      id: 'superlight',
      name: 'Superlight',
      includedCheckedBags: 0,
      firstCheckedFee: 30,
      secondCheckedFee: 60,
      carryOnAllowed: false,
      carryOnFee: 15,
      carryOnRestrictionNotice: 'Under-seat personal bag only (40 x 30 x 15 cm). Overhead roller requires Classic fare or extra fee.',
      fareNote: 'Superlight hand-baggage fare: 1 underseat bag included. 1st checked bag €30 online (€60 airport).'
    },
    {
      id: 'light',
      name: 'Light',
      includedCheckedBags: 0,
      firstCheckedFee: 30,
      secondCheckedFee: 60,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Light unbundled fare: 1st checked bag €30 online. Overhead carry-on roller included.'
    },
    {
      id: 'business',
      name: 'Business Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 free checked bags (up to 32 kg each).'
    }
  ],

  wizzair: [
    {
      id: 'priority',
      name: 'WIZZ Priority / Plus',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 25,
      secondCheckedFee: 40,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'WIZZ Priority includes 1 free carry-on trolley (55 x 40 x 23 cm) + personal item. 1st checked bag €25.'
    },
    {
      id: 'basic',
      name: 'Basic Fare',
      includedCheckedBags: 0,
      firstCheckedFee: 25,
      secondCheckedFee: 40,
      carryOnAllowed: false,
      carryOnFee: 20,
      carryOnRestrictionNotice: 'Small personal bag ONLY (40 x 30 x 20 cm). Overhead trolley bag requires Priority fee (€15–€35).',
      fareNote: 'Wizz Basic: 1 free small personal bag under seat. Trolley carry-on costs €15–€35; checked bag €25–€45.'
    },
    {
      id: 'plus',
      name: 'WIZZ Smart / All-In',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 40,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Smart bundles include 1 trolley carry-on + 1 20 kg checked bag ($0).'
    }
  ],

  // ================= ASIA / PACIFIC (13) =================
  singapore: [
    {
      id: 'standard',
      name: 'Economy Standard / Flexi',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy fares include 2 free checked bags (up to 25–30 kg total) ($0) + free carry-on. No unbundled basic fare.'
    },
    {
      id: 'business',
      name: 'Business / First Suites',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 40 kg checked luggage ($0); First/Suites includes 50 kg ($0).'
    }
  ],

  ana: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'ANA Economy includes 2 free checked bags (23 kg / 50 lbs each) + 10 kg carry-on ($0).'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business includes 2 bags (32 kg each); First Class includes 3 bags (32 kg each) ($0).'
    }
  ],

  jal: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'JAL Economy includes 2 free checked bags (23 kg / 50 lbs each) + 10 kg carry-on ($0).'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 3,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business and First Class include 3 free checked bags (32 kg / 70 lbs each) ($0).'
    }
  ],

  cathay: [
    {
      id: 'standard',
      name: 'Economy Essential / Flex',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Essential & Flex include 2 free checked bags (23 kg each) + 7 kg carry-on.'
    },
    {
      id: 'light',
      name: 'Economy Light',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 65,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Light includes 1 free checked bag (23 kg). 2nd bag costs ~$65 USD.'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 bags (32 kg each); First Class includes 3 bags (32 kg each) ($0).'
    }
  ],

  koreanair: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Americas routes include 2 free checked bags (23 kg / 50 lbs each) + 10 kg carry-on.'
    },
    {
      id: 'prestige',
      name: 'Prestige / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Prestige Business includes 2 bags (32 kg each); First Class includes 3 bags (32 kg each) ($0).'
    }
  ],

  eva: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Transpacific routes include 2 free checked bags (23 kg / 50 lbs each) + 7 kg carry-on.'
    },
    {
      id: 'royal',
      name: 'Royal Laurel / Premium',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Royal Laurel & Premium Laurel include 2 checked bags (32 kg each) ($0).'
    }
  ],

  emirates: [
    {
      id: 'standard',
      name: 'Economy Flex / Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Americas routes include 2 free checked bags (23 kg each) ($0) + 7 kg carry-on.'
    },
    {
      id: 'special',
      name: 'Economy Special',
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 75,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Economy Special includes 1 free checked bag (20–23 kg). Additional bag costs ~$75 USD.'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business and First Class include 2 free checked bags (32 kg each) ($0) + 2 carry-ons.'
    }
  ],

  qantas: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 1,
      firstCheckedFee: 0,
      secondCheckedFee: 70,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'International Americas routes include 1-2 free checked bags (23 kg each) ($0).'
    },
    {
      id: 'business',
      name: 'Premium Economy / Business',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Premium Economy and Business include 2-3 free checked bags (up to 32 kg each) ($0).'
    }
  ],

  qatar: [
    {
      id: 'standard',
      name: 'Economy Classic / Convenience',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Americas routes include 2 free checked bags (23 kg each) ($0) + 7 kg carry-on.'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business and First Class include 2 free checked bags (32 kg each) ($0) + 2 carry-on bags.'
    }
  ],

  etihad: [
    {
      id: 'standard',
      name: 'Economy Value / Choice',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'US and Canada routes include 2 free checked bags (23 kg each) ($0) + 7 kg carry-on.'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 bags (32 kg each); First Class includes 2 bags (32 kg each) ($0).'
    }
  ],

  airindia: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Americas routes include 2 free checked bags (23 kg each) ($0) + 7 kg carry-on.'
    },
    {
      id: 'business',
      name: 'Business / First',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Executive & First Class include 2 free checked bags (32 kg each) ($0).'
    }
  ],

  asiana: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Americas routes include 2 free checked bags (23 kg each) ($0) + 10 kg carry-on.'
    },
    {
      id: 'business',
      name: 'Business Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 free checked bags (32 kg each) ($0).'
    }
  ],

  vietnam: [
    {
      id: 'standard',
      name: 'Economy Standard',
      isDefault: true,
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Long-haul routes include 2 free checked bags (23 kg each) ($0) + 12 kg carry-on.'
    },
    {
      id: 'business',
      name: 'Business Class',
      includedCheckedBags: 2,
      firstCheckedFee: 0,
      secondCheckedFee: 0,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Business Class includes 2 free checked bags (32 kg each) ($0) + 2 carry-on items (18 kg total).'
    }
  ]
};

export function getAirlineFareFamilies(airlineKeyOrName: string): AirlineFareFamily[] {
  if (!airlineKeyOrName || !airlineKeyOrName.trim()) {
    return [
      {
        id: 'standard',
        name: 'Standard / Published Policy',
        isDefault: true,
        includedCheckedBags: 0,
        firstCheckedFee: 35,
        secondCheckedFee: 50,
        carryOnAllowed: true,
        carryOnFee: 0,
        fareNote: 'Estimate from published airline fee tables. Airlines change fees — confirm at booking.'
      }
    ];
  }

  const clean = airlineKeyOrName.toLowerCase().trim();

  // 1. Direct ID match
  if (AIRLINE_FARE_FAMILIES_DATA[clean]) {
    return AIRLINE_FARE_FAMILIES_DATA[clean];
  }

  // 2. Lookup by airline key mapping
  const keyMap: Record<string, string> = {
    'air canada': 'aircanada',
    'ac': 'aircanada',
    'westjet': 'westjet',
    'west jet': 'westjet',
    'ws': 'westjet',
    'porter': 'porter',
    'porter airlines': 'porter',
    'pd': 'porter',
    'air transat': 'airtransat',
    'transat': 'airtransat',
    'ts': 'airtransat',
    'flair': 'flair',
    'flair airlines': 'flair',
    'f8': 'flair',
    'delta': 'delta',
    'delta air lines': 'delta',
    'delta airlines': 'delta',
    'dl': 'delta',
    'american': 'american',
    'american airlines': 'american',
    'aa': 'american',
    'united': 'united',
    'united airlines': 'united',
    'ua': 'united',
    'southwest': 'southwest',
    'southwest airlines': 'southwest',
    'wn': 'southwest',
    'jetblue': 'jetblue',
    'jetblue airways': 'jetblue',
    'b6': 'jetblue',
    'alaska': 'alaska',
    'alaska airlines': 'alaska',
    'as': 'alaska',
    'hawaiian': 'hawaiian',
    'hawaiian airlines': 'hawaiian',
    'ha': 'hawaiian',
    'spirit': 'spirit',
    'spirit airlines': 'spirit',
    'nk': 'spirit',
    'frontier': 'frontier',
    'frontier airlines': 'frontier',
    'f9': 'frontier',
    'allegiant': 'allegiant',
    'allegiant air': 'allegiant',
    'g4': 'allegiant',
    'sun country': 'suncountry',
    'sun country airlines': 'suncountry',
    'sy': 'suncountry',
    'british airways': 'britishairways',
    'ba': 'britishairways',
    'air france': 'airfrance_klm',
    'klm': 'airfrance_klm',
    'air france-klm': 'airfrance_klm',
    'af': 'airfrance_klm',
    'lufthansa': 'lufthansa',
    'lh': 'lufthansa',
    'ryanair': 'ryanair',
    'fr': 'ryanair',
    'easyjet': 'easyjet',
    'u2': 'easyjet',
    'turkish': 'turkish',
    'turkish airlines': 'turkish',
    'tk': 'turkish',
    'iberia': 'iberia',
    'ib': 'iberia',
    'sas': 'sas',
    'scandinavian airlines': 'sas',
    'scandinavian airlines (sas)': 'sas',
    'sk': 'sas',
    'virgin': 'virgin',
    'virgin atlantic': 'virgin',
    'vs': 'virgin',
    'ita': 'ita',
    'ita airways': 'ita',
    'az': 'ita',
    'tap': 'tap',
    'tap air portugal': 'tap',
    'tp': 'tap',
    'finnair': 'finnair',
    'ay': 'finnair',
    'wizz': 'wizzair',
    'wizz air': 'wizzair',
    'w6': 'wizzair',
    'singapore': 'singapore',
    'singapore airlines': 'singapore',
    'sq': 'singapore',
    'ana': 'ana',
    'all nippon airways': 'ana',
    'nh': 'ana',
    'jal': 'jal',
    'japan airlines': 'jal',
    'jl': 'jal',
    'cathay': 'cathay',
    'cathay pacific': 'cathay',
    'cx': 'cathay',
    'korean air': 'koreanair',
    'ke': 'koreanair',
    'eva': 'eva',
    'eva air': 'eva',
    'br': 'eva',
    'emirates': 'emirates',
    'ek': 'emirates',
    'qantas': 'qantas',
    'qf': 'qantas',
    'qatar': 'qatar',
    'qatar airways': 'qatar',
    'qr': 'qatar',
    'etihad': 'etihad',
    'etihad airways': 'etihad',
    'ey': 'etihad',
    'air india': 'airindia',
    'ai': 'airindia',
    'asiana': 'asiana',
    'asiana airlines': 'asiana',
    'oz': 'asiana',
    'vietnam': 'vietnam',
    'vietnam airlines': 'vietnam',
    'vn': 'vietnam'
  };

  const matchedId = keyMap[clean];
  if (matchedId && AIRLINE_FARE_FAMILIES_DATA[matchedId]) {
    return AIRLINE_FARE_FAMILIES_DATA[matchedId];
  }

  // Substring match
  for (const [key, id] of Object.entries(keyMap)) {
    if (key.length > 2 && (clean.includes(key) || key.includes(clean))) {
      if (AIRLINE_FARE_FAMILIES_DATA[id]) {
        return AIRLINE_FARE_FAMILIES_DATA[id];
      }
    }
  }

  // Fallback for custom / unlisted carriers
  return [
    {
      id: 'standard',
      name: 'Standard / Published Policy',
      isDefault: true,
      includedCheckedBags: 0,
      firstCheckedFee: 35,
      secondCheckedFee: 50,
      carryOnAllowed: true,
      carryOnFee: 0,
      fareNote: 'Estimate from published airline fee tables. Airlines change fees — confirm at booking.'
    }
  ];
}
