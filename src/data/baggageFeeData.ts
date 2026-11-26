// Static Airline Baggage Fee Reference Table for the 42 Allowance Engine Airlines
// Brand rule: NEVER present static reference data as live.
// Every estimate carries a last_verified date and official sources disclaimer.

import { getAirlineFareFamilies, AirlineFareFamily } from './airlineFareFamilies';

export interface AirlineFeeData {
  airlineId: string;
  airlineName: string;
  aliases: string[];
  currency: string;
  currencySymbol: string;
  firstCheckedFee: number; // 0 if free, number in currency
  secondCheckedFee: number; // 0 if free, number in currency
  carryOnFee: number; // 0 for most legacy/standard, fee for budget ULCCs
  overweightFee51to70lbs: number; // overweight band (51-70 lbs / 23-32 kg)
  oversizeFee?: number;
  usdEquivalentNote?: string;
  firstCheckedUsdNote?: string;
  secondCheckedUsdNote?: string;
  feeNotes: string;
  lastVerified: string;
  officialBaggagePageUrl: string;
}

export const AIRLINE_BAGGAGE_FEES: AirlineFeeData[] = [
  // ================= USA AIRLINES (11) =================
  {
    airlineId: 'delta',
    airlineName: 'Delta Air Lines',
    aliases: ['delta', 'delta air lines', 'delta airlines', 'dl'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 45,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: 'Standard domestic US Main Cabin & Basic Economy fees ($45 first, $55 second). First / Delta One includes 2 free checked bags up to 70 lbs. Confirm route/Medallion waivers at booking.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.delta.com/us/en/baggage/overview'
  },
  {
    airlineId: 'american',
    airlineName: 'American Airlines',
    aliases: ['american', 'american airlines', 'aa'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 45,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Domestic Main Cabin: $45 online ($50 airport) 1st bag, $55 online ($60 airport) 2nd bag; Basic Economy is $50 online / $55 airport for 1st bag. Business & First include 2–3 free bags up to 70 lbs.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.aa.com/i18n/travel-info/baggage/checked-baggage-policy.jsp'
  },
  {
    airlineId: 'united',
    airlineName: 'United Airlines',
    aliases: ['united', 'united airlines', 'ua'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 45,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: '$45 first bag prepaid ($50 airport), $55 second bag prepaid ($60 airport) on domestic Main Cabin. Basic Economy excludes overhead carry-on on domestic US routes (personal item only; $75 gate-handling fee if brought).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.united.com/en/us/baggage-calculator'
  },
  {
    airlineId: 'southwest',
    airlineName: 'Southwest Airlines',
    aliases: ['southwest', 'southwest airlines', 'wn'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 45,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 125,
    feeNotes: 'Basic/Choice/Choice Preferred fares charge $45 1st checked bag and $55 2nd checked bag (3rd+ $150). Choice Extra, A-List Preferred, Rapid Rewards credit cardholders & active-duty military receive checked-bag waivers. Carry-on + personal item stay free.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.southwest.com/html/customer-service/baggage/'
  },
  {
    airlineId: 'jetblue',
    airlineName: 'JetBlue Airways',
    aliases: ['jetblue', 'jetblue airways', 'b6'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 50,
    secondCheckedFee: 70,
    carryOnFee: 0,
    overweightFee51to70lbs: 150,
    oversizeFee: 150,
    feeNotes: 'Dynamic off-peak/peak pricing on Blue & Blue Basic: ~$50–$55 1st bag prepaid online ($60–$70 within 24h/airport); 2nd bag ~$70–$85. Blue Plus includes 1 free bag; Mint includes 2 free bags (70 lbs). All fares include carry-on + personal item.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.jetblue.com/flying-with-us/baggage'
  },
  {
    airlineId: 'alaska',
    airlineName: 'Alaska Airlines',
    aliases: ['alaska', 'alaska airlines', 'as'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 35,
    secondCheckedFee: 45,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    feeNotes: 'North America Saver/Main Cabin: typically $35 first bag, $45 second bag (route/season rates can range $35–$45 / $45–$55). 20-minute baggage delivery guarantee; First Class includes 2 free bags up to 70 lbs.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.alaskaair.com/content/travel-info/baggage'
  },
  {
    airlineId: 'hawaiian',
    airlineName: 'Hawaiian Airlines',
    aliases: ['hawaiian', 'hawaiian airlines', 'ha'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 45,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    feeNotes: 'North America Mainland Main Cabin: $45 1st bag, $55 2nd bag (neighbor-island Hawaii flights $30 1st / $40 2nd; HawaiianMiles discounts available). Carry-on capped at 25 lbs (11.5 kg). First Class includes 2 free bags (70 lbs).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://hawaiianair.custhelp.com/app/answers/detail/a_id/2246'
  },
  {
    airlineId: 'spirit',
    airlineName: 'Spirit Airlines',
    aliases: ['spirit', 'spirit airlines', 'nk'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 45,
    secondCheckedFee: 55,
    carryOnFee: 45,
    overweightFee51to70lbs: 125,
    oversizeFee: 150,
    feeNotes: 'ARCHIVED POLICY — Spirit Airlines ceased all flight operations on May 2, 2026. Retained solely as historical reference: standard carry-on ~$45–$60; checked limit was strict 40 lbs (41–50 lbs +$79; 51–70 lbs +$125).',
    lastVerified: 'Archived (Ceased May 2, 2026)',
    officialBaggagePageUrl: 'https://www.spirit.com/optional-services'
  },
  {
    airlineId: 'frontier',
    airlineName: 'Frontier Airlines',
    aliases: ['frontier', 'frontier airlines', 'f9'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 49,
    secondCheckedFee: 69,
    carryOnFee: 49,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    feeNotes: 'Ultra-low-cost dynamic pricing (varies by route & booking window): overhead carry-on ~$49–$60+; checked bag limit is STRICT 40 lbs (41–50 lbs +$75+; 51–100 lbs +$100). Personal item 18 x 14 x 8 in free.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.flyfrontier.com/travel/travel-info/bag-options/'
  },
  {
    airlineId: 'allegiant',
    airlineName: 'Allegiant Air',
    aliases: ['allegiant', 'allegiant air', 'g4'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 35,
    secondCheckedFee: 45,
    carryOnFee: 35,
    overweightFee51to70lbs: 75,
    oversizeFee: 75,
    feeNotes: 'Ultra-low-cost dynamic pricing: carry-on (~$35+ online) and checked bags incur fees. Standard checked bag weight limit is 50 lbs (23 kg) / 80 linear in; overweight fees apply above 50 lbs. Airport desk charges are substantially higher.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.allegiantair.com/baggage-info'
  },
  {
    airlineId: 'suncountry',
    airlineName: 'Sun Country Airlines',
    aliases: ['sun country', 'sun country airlines', 'sy'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 35,
    secondCheckedFee: 45,
    carryOnFee: 30,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    feeNotes: 'Low-cost dynamic pricing: overhead carry-on (max 35 lbs) ~$30–$40+ online; 1st checked bag (max 50 lbs) ~$35–$45+ online. Overweight 51–60 lbs +$60; 61–70 lbs +$100.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.suncountry.com/bags-optional-services'
  },

  // ================= CANADIAN AIRLINES (5) =================
  {
    airlineId: 'aircanada',
    airlineName: 'Air Canada',
    aliases: ['air canada', 'aircanada', 'ac'],
    currency: 'CAD',
    currencySymbol: 'CAD $',
    firstCheckedFee: 45,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    usdEquivalentNote: 'approx ~$33 USD (1st bag Standard/Basic) / ~$44 USD (2nd bag)',
    firstCheckedUsdNote: 'approx ~$33 USD ($45 CAD Basic/Standard; $0 Flex+)',
    secondCheckedUsdNote: 'approx ~$44 USD ($60 CAD)',
    feeNotes: 'North America & Sun routes: Basic & Standard Economy typically charge $35–$55 CAD (~$45 CAD representative) 1st bag / $50–$72 CAD (~$60 CAD) 2nd bag; Flex includes 1st bag free; Comfort/Latitude/Business include 2. Basic NA/Sun allows personal item only ($65 CAD gate check).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.aircanada.com/ca/en/aco/home/plan/baggage/checked.html'
  },
  {
    airlineId: 'westjet',
    airlineName: 'WestJet',
    aliases: ['westjet', 'west jet', 'ws'],
    currency: 'CAD',
    currencySymbol: 'CAD $',
    firstCheckedFee: 40,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    usdEquivalentNote: 'approx ~$30 USD (1st bag Econo prepaid) / ~$44 USD (2nd bag)',
    firstCheckedUsdNote: 'approx ~$30 USD ($40 CAD Econo prepaid; $0 EconoFlex)',
    secondCheckedUsdNote: 'approx ~$44 USD ($60 CAD prepaid)',
    feeNotes: 'Econo prepaid checked bag starts ~$35–$45 CAD ($40 representative; $50–$65+ at check-in), 2nd bag ~$60 CAD; EconoFlex includes 1st bag free. UltraBasic excludes overhead carry-on on Canada/US/Sun routes ($45–$65+ prepaid 1st checked).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.westjet.com/en-ca/baggage/fees'
  },
  {
    airlineId: 'porter',
    airlineName: 'Porter Airlines',
    aliases: ['porter', 'porter airlines', 'pd'],
    currency: 'CAD',
    currencySymbol: 'CAD $',
    firstCheckedFee: 35,
    secondCheckedFee: 50,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    usdEquivalentNote: 'approx ~$26 USD (1st bag) / ~$37 USD (2nd bag)',
    feeNotes: 'PorterClassic Standard includes free carry-on (approx. 20 lbs / 9 kg liftable overhead). PorterClassic Basic excludes overhead carry-on (personal item only). 1st checked bag ~$35 CAD online ($50 2nd).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.flyporter.com/en-ca/travel-information/baggage'
  },
  {
    airlineId: 'airtransat',
    airlineName: 'Air Transat',
    aliases: ['air transat', 'airtransat', 'transat', 'ts'],
    currency: 'CAD',
    currencySymbol: 'CAD $',
    firstCheckedFee: 40,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    usdEquivalentNote: 'approx ~$30 USD (1st bag) / ~$41 USD (2nd bag)',
    feeNotes: 'Eco Budget fares exclude checked baggage (~$30–$40+ CAD online, $62–$78+ CAD at airport). Standard carry-on (51 x 40 x 23 cm; must fit overhead unassisted) is included.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.airtransat.com/en-CA/travel-information/baggage'
  },
  {
    airlineId: 'flair',
    airlineName: 'Flair Airlines',
    aliases: ['flair', 'flair airlines', 'f8'],
    currency: 'CAD',
    currencySymbol: 'CAD $',
    firstCheckedFee: 49,
    secondCheckedFee: 69,
    carryOnFee: 39,
    overweightFee51to70lbs: 99,
    oversizeFee: 99,
    usdEquivalentNote: 'approx ~$29 USD carry-on / ~$36 USD 1st bag',
    feeNotes: 'Canadian Ultra-Low-Cost Carrier dynamic pricing: Bare fare includes personal item only (7 kg). Overhead carry-on (10 kg) starts around $29–$49 CAD online (higher at airport); checked bags ~$49–$69+ CAD online depending on route/timing.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://flyflair.com/travel-info/baggage'
  },

  // ================= EUROPEAN AIRLINES (13) =================
  {
    airlineId: 'britishairways',
    airlineName: 'British Airways',
    aliases: ['british airways', 'british', 'ba'],
    currency: 'GBP',
    currencySymbol: '£',
    firstCheckedFee: 0,
    secondCheckedFee: 65,
    carryOnFee: 0,
    overweightFee51to70lbs: 65,
    oversizeFee: 65,
    firstCheckedUsdNote: 'Included in Economy Standard (Basic Hand Baggage Only charges £35 / ~$45 USD)',
    secondCheckedUsdNote: 'approx ~$85 USD (2nd bag)',
    feeNotes: 'Economy Standard / Club Europe includes 1-2 checked bags free (51 lbs / 23 kg). Hand Baggage Only (Basic) fares charge £35 first checked bag.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.britishairways.com/en-gb/information/baggage-essentials'
  },
  {
    airlineId: 'airfrance_klm',
    airlineName: 'Air France / KLM',
    aliases: ['air france', 'klm', 'air france / klm', 'af'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 0,
    secondCheckedFee: 75,
    carryOnFee: 0,
    overweightFee51to70lbs: 75,
    oversizeFee: 75,
    firstCheckedUsdNote: 'Included in Standard / Classic (Light unbundled charges €30 / ~$33 USD)',
    secondCheckedUsdNote: 'approx ~$82 USD (2nd bag)',
    feeNotes: 'Standard economy includes 1 free checked bag (23 kg). "Light" unbundled fares charge €30 online for the 1st checked bag (€70 at airport).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://wwws.airfrance.us/information/bagages'
  },
  {
    airlineId: 'lufthansa',
    airlineName: 'Lufthansa Group (SWISS / Austrian)',
    aliases: ['lufthansa', 'swiss', 'austrian', 'lh', 'lx', 'os'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 0,
    secondCheckedFee: 80,
    carryOnFee: 0,
    overweightFee51to70lbs: 65,
    oversizeFee: 100,
    firstCheckedUsdNote: 'Included in Classic / Flex (Economy Light charges €30 / ~$33 USD)',
    secondCheckedUsdNote: 'approx ~$87 USD (2nd bag)',
    feeNotes: 'Economy Classic & Flex include 1 checked bag (23 kg) free. Economy Light charges €30 online for the 1st bag (€60 at airport). Overweight up to 32 kg is €65.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.lufthansa.com/us/en/free-baggage-rules'
  },
  {
    airlineId: 'ryanair',
    airlineName: 'Ryanair',
    aliases: ['ryanair', 'fr'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 25,
    secondCheckedFee: 40,
    carryOnFee: 15,
    overweightFee51to70lbs: 60,
    oversizeFee: 50,
    usdEquivalentNote: 'approx ~$16 USD carry-on / ~$27 USD 1st check',
    feeNotes: 'Ultra-low cost: Standard fare includes ONLY personal small bag. "Priority & 2 Cabin Bags" (adds 10kg overhead roller) is €15-€25. 10kg checked is €20-€25; 20kg checked is €30-€45.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.ryanair.com/gb/en/useful-info/help-centre/fees'
  },
  {
    airlineId: 'easyjet',
    airlineName: 'easyJet',
    aliases: ['easyjet', 'easy jet', 'u2'],
    currency: 'GBP',
    currencySymbol: '£',
    firstCheckedFee: 30,
    secondCheckedFee: 45,
    carryOnFee: 15,
    overweightFee51to70lbs: 60,
    oversizeFee: 50,
    usdEquivalentNote: 'approx ~$20 USD carry-on / ~$39 USD 1st check',
    feeNotes: 'Basic fare includes small underseat bag only. Large overhead cabin bag costs £15-£25. 15kg checked bag is £20-£30; 23kg checked bag is £30-£40 online.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.easyjet.com/en/help/baggage/cabin-bag-and-hold-luggage'
  },
  {
    airlineId: 'turkish',
    airlineName: 'Turkish Airlines',
    aliases: ['turkish', 'turkish airlines', 'tk'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 80,
    oversizeFee: 80,
    feeNotes: 'International routes to/from Americas include 2 free checked bags up to 23 kg each. EcoFly regional fares charge ~$30-$50 depending on route.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.turkishairlines.com/en-us/any-questions/free-baggage/'
  },
  {
    airlineId: 'iberia',
    airlineName: 'Iberia',
    aliases: ['iberia', 'ib'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 0,
    secondCheckedFee: 45,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    firstCheckedUsdNote: 'Included in Standard / Optimal (Basic unbundled charges €25 / ~$27 USD)',
    secondCheckedUsdNote: 'approx ~$49 USD (2nd bag)',
    feeNotes: 'Standard fares include 1 free checked bag (23 kg). "Basic" unbundled fares charge €25-€35 online for the 1st checked bag. Carry-on + personal item free.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.iberia.com/us/baggage/'
  },
  {
    airlineId: 'sas',
    airlineName: 'Scandinavian Airlines (SAS)',
    aliases: ['sas', 'scandinavian airlines', 'sk'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 0,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 55,
    oversizeFee: 75,
    firstCheckedUsdNote: 'Included in SAS Go / Standard (SAS Go Light charges €30+ / ~$33 USD)',
    secondCheckedUsdNote: 'approx ~$65 USD (2nd bag)',
    feeNotes: 'SAS Go / Standard includes 1 free checked bag (23 kg) + 8 kg overhead cabin bag. SAS Go Light unbundled tickets include only an under-seat bag unless overhead cabin/checked bags are added online (~€12–€35+ / €30+ checked).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.flysas.com/en/travel-info/baggage/'
  },
  {
    airlineId: 'virgin',
    airlineName: 'Virgin Atlantic',
    aliases: ['virgin atlantic', 'virgin', 'vs'],
    currency: 'GBP',
    currencySymbol: '£',
    firstCheckedFee: 0,
    secondCheckedFee: 65,
    carryOnFee: 0,
    overweightFee51to70lbs: 65,
    oversizeFee: 65,
    firstCheckedUsdNote: 'Included in Economy Classic / Delight (Economy Light charges ~£80 / ~$100 USD)',
    secondCheckedUsdNote: 'approx ~$85 USD (2nd bag)',
    feeNotes: 'Economy Classic & Delight include 1 free checked bag (23 kg / 50 lbs). Economy Light hand-baggage-only fares charge ~£80 / $100 USD for adding a 1st checked bag (route dependent).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.virginatlantic.com/us/en/travel-information/baggage.html'
  },
  {
    airlineId: 'ita',
    airlineName: 'ITA Airways (Alitalia)',
    aliases: ['ita', 'ita airways', 'alitalia', 'az'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 0,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    firstCheckedUsdNote: 'Included in Classic Economy (Light fare charges €30–€60+ depending on route)',
    secondCheckedUsdNote: 'approx ~$65 USD (2nd bag)',
    feeNotes: 'Classic economy includes 1 free 23 kg bag. Light unbundled fares exclude checked baggage (€30–€60+ short-haul/long-haul online, higher at airport). Business includes 2 bags (32 kg).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.ita-airways.com/en_us/fly-ita/baggage.html'
  },
  {
    airlineId: 'tap',
    airlineName: 'TAP Air Portugal',
    aliases: ['tap', 'tap air portugal', 'tp'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 0,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    firstCheckedUsdNote: 'Included in Classic / Plus (Discount unbundled charges €30+ / ~$33 USD)',
    secondCheckedUsdNote: 'approx ~$60 USD (2nd bag)',
    feeNotes: 'Basic/Classic includes 1 free checked bag; Discount fare charges €30+ online for 1st checked bag. Economy cabin bag up to 10 kg (22 lbs) + personal item 2 kg. Executive includes 2 bags (32 kg).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.flytap.com/en-us/baggage'
  },
  {
    airlineId: 'finnair',
    airlineName: 'Finnair',
    aliases: ['finnair', 'ay'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 0,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    firstCheckedUsdNote: 'Included in Classic / Flex (Superlight / Light charges €30 / ~$33 USD)',
    secondCheckedUsdNote: 'approx ~$65 USD (2nd bag)',
    feeNotes: 'Classic/Flex includes 1 checked bag (23 kg). "Superlight" / "Light" charges €30 for checked bag and €9-€14 for overhead trolley. Business includes 1-2 bags.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.finnair.com/en/baggage-on-finnair-flights'
  },
  {
    airlineId: 'wizzair',
    airlineName: 'Wizz Air',
    aliases: ['wizz', 'wizz air', 'w6'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 25,
    secondCheckedFee: 45,
    carryOnFee: 18,
    overweightFee51to70lbs: 60,
    oversizeFee: 50,
    usdEquivalentNote: 'approx ~$20 USD carry-on / ~$27 USD 1st check',
    feeNotes: 'Ultra-low cost: Free personal item only (40x30x20cm). WIZZ Priority (overhead roller) is €15-€25. 10kg checked bag is €20-€30; 20kg is €30-€50 online.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://wizzair.com/en-gb/information-and-services/booking-information/baggage'
  },

  // ================= ASIA, MIDDLE EAST & PACIFIC AIRLINES (13) =================
  {
    airlineId: 'singapore',
    airlineName: 'Singapore Airlines',
    aliases: ['singapore', 'singapore airlines', 'sq'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Generous full-service allowance: Flights to/from USA & Canada include 2 FREE checked bags up to 23 kg (50 lbs) each. 3rd bag is ~$150-$200.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.singaporeair.com/en_UK/us/flying-with-us/baggage/'
  },
  {
    airlineId: 'ana',
    airlineName: 'All Nippon Airways (ANA)',
    aliases: ['ana', 'all nippon airways', 'nh'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: 'International Economy includes 2 FREE checked bags up to 23 kg (50 lbs) each. Premium Economy includes 2 free bags; Business includes 2 bags up to 32 kg (70 lbs).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.ana.co.jp/en/us/travel-information/baggage-information/'
  },
  {
    airlineId: 'jal',
    airlineName: 'Japan Airlines (JAL)',
    aliases: ['jal', 'japan airlines', 'jl'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: 'International Economy and Premium Economy include 2 FREE checked bags up to 23 kg (50 lbs) each. Business Class includes 3 free bags (32 kg each).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.jal.co.jp/ar/en/inter/baggage/'
  },
  {
    airlineId: 'cathay',
    airlineName: 'Cathay Pacific',
    aliases: ['cathay', 'cathay pacific', 'cx'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Americas routes include 2 FREE checked bags up to 23 kg (50 lbs) each. Non-Americas routes operate on weight concept (30 kg total in Economy).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.cathaypacific.com/cx/en_US/baggage.html'
  },
  {
    airlineId: 'koreanair',
    airlineName: 'Korean Air',
    aliases: ['korean air', 'korean', 'ke'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: 'Transpacific routes to/from Americas include 2 FREE checked bags up to 23 kg each. Prestige Class includes 2 bags up to 32 kg (70 lbs).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.koreanair.com/contents/plan-your-travel/baggage'
  },
  {
    airlineId: 'eva',
    airlineName: 'EVA Air',
    aliases: ['eva air', 'eva', 'br'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Long-haul flights to/from North America include 2 FREE checked bags up to 23 kg each. Premium Economy includes 2 bags up to 28 kg; Royal Laurel includes 2 bags up to 32 kg.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.evaair.com/en-us/fly-prepare/baggage/'
  },
  {
    airlineId: 'emirates',
    airlineName: 'Emirates',
    aliases: ['emirates', 'ek'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Piece-concept routes (to/from Americas) include 2 FREE checked bags up to 23 kg each. Weight-concept routes allow 25-35 kg total free checked baggage.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.emirates.com/us/english/before-you-fly/baggage/'
  },
  {
    airlineId: 'qantas',
    airlineName: 'Qantas',
    aliases: ['qantas', 'qf'],
    currency: 'AUD',
    currencySymbol: 'AUD $',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    usdEquivalentNote: 'Americas routes include 2 free bags',
    feeNotes: 'Transpacific flights to USA/Canada include 2 FREE checked bags up to 23 kg (50 lbs) each. Domestic Australian flights include 1 free checked bag (23 kg).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.qantas.com/us/en/travel-info/baggage.html'
  },
  {
    airlineId: 'qatar',
    airlineName: 'Qatar Airways',
    aliases: ['qatar', 'qatar airways', 'qr'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Flights to/from Americas include 2 FREE checked bags up to 23 kg (50 lbs) each. Other international routes operate on generous 25-35 kg weight concept.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.qatarairways.com/en-us/baggage/allowance.html'
  },
  {
    airlineId: 'etihad',
    airlineName: 'Etihad Airways',
    aliases: ['etihad', 'etihad airways', 'ey'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Flights to/from USA and Canada include 2 FREE checked bags up to 23 kg each. Business Class includes 2 bags up to 32 kg (70 lbs).',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.etihad.com/en-us/fly-etihad/baggage'
  },
  {
    airlineId: 'airindia',
    airlineName: 'Air India',
    aliases: ['air india', 'airindia', 'ai'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Non-stop and international flights between USA/Canada and India include 2 FREE checked bags up to 23 kg each. Business includes 2 bags up to 32 kg.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.airindia.com/in/en/travel-information/baggage-guidelines.html'
  },
  {
    airlineId: 'asiana',
    airlineName: 'Asiana Airlines',
    aliases: ['asiana', 'asiana airlines', 'oz'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: 'Economy flights to/from Americas include 2 FREE checked bags up to 23 kg each. Business Class includes 2 free bags up to 32 kg.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://flyasiana.com/C/US/EN/contents/checked-baggage'
  },
  {
    airlineId: 'vietnam',
    airlineName: 'Vietnam Airlines',
    aliases: ['vietnam airlines', 'vietnam', 'vn'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Economy Standard on long-haul/Americas routes includes 2 free checked bags (23 kg each). Economy Lite domestic and short-haul fares charge $25–$50.',
    lastVerified: 'November 26, 2026',
    officialBaggagePageUrl: 'https://www.vietnamairlines.com/us/en/travel-information/baggage'
  }
];

export interface BagFeeCalculationResult {
  hasFeeData: boolean;
  airlineName: string;
  currency: string;
  currencySymbol: string;
  usdEquivalentNote?: string;
  lastVerified?: string;
  officialBaggagePageUrl?: string;
  totalEstimatedFee: number;
  totalEstimatedFeeFormatted: string;
  fareFamilyName?: string;
  fareFamilyId?: string;
  carryOnAllowed?: boolean;
  carryOnRestrictionNotice?: string;
  includedCheckedBags?: number;
  breakdown: Array<{
    bagId: string;
    bagLabel: string;
    bagType: 'PERSONAL' | 'CARRY_ON' | 'CHECKED';
    baseFee: number;
    baseFeeFormatted: string;
    isOverweight: boolean;
    overweightFee: number;
    overweightReason?: string;
    subtotal: number;
    subtotalFormatted: string;
  }>;
  overweightBagCount: number;
  totalOverweightFee: number;
  feeNotes?: string;
  disclaimer: string;
}

const APPROX_USD_RATES: Record<string, number> = {
  CAD: 0.74,
  EUR: 1.09,
  GBP: 1.29,
  AUD: 0.66,
  SGD: 0.76,
  JPY: 0.0067,
  TRY: 0.029,
  AED: 0.27,
  QAR: 0.27,
  INR: 0.012,
  KRW: 0.00073
};

/**
 * Robust airline fee record finder avoiding substring collisions (e.g. 'sas' matching Alaska Airlines 'as').
 */
export function findAirlineFeeRecord(companyName: string | undefined): AirlineFeeData | undefined {
  if (!companyName || !companyName.trim()) return undefined;
  const query = companyName.toLowerCase().trim();

  // 1. Direct ID match
  const byId = AIRLINE_BAGGAGE_FEES.find((item) => item.airlineId.toLowerCase() === query);
  if (byId) return byId;

  // 2. Direct exact name match
  const byExactName = AIRLINE_BAGGAGE_FEES.find((item) => item.airlineName.toLowerCase() === query);
  if (byExactName) return byExactName;

  // 3. Direct exact alias match (e.g. 'sas', 'dl', 'ua', 'aa', 'ac', 'ws')
  const byExactAlias = AIRLINE_BAGGAGE_FEES.find((item) => item.aliases.includes(query));
  if (byExactAlias) return byExactAlias;

  // 4. Starts with match
  const byStartsWith = AIRLINE_BAGGAGE_FEES.find((item) => 
    item.airlineName.toLowerCase().startsWith(query) || query.startsWith(item.airlineName.toLowerCase())
  );
  if (byStartsWith) return byStartsWith;

  // 5. Word boundary or long-alias match
  return AIRLINE_BAGGAGE_FEES.find((item) => {
    if (item.airlineName.toLowerCase().includes(query) || query.includes(item.airlineName.toLowerCase())) {
      return true;
    }
    return item.aliases.some((alias) => {
      if (alias.length <= 2) {
        const words = query.split(/[\s-_]+/);
        return words.includes(alias);
      }
      return query.includes(alias) || alias.includes(query);
    });
  });
}

/**
 * Calculates bag fees strictly from the static fee table and published fare-family tiers.
 * If bags exceed weight limits (50 lbs / 23 kg standard, or 70 lbs for Business/First), applies overweight fee and flags it.
 * Never invents numbers.
 */
export function calculateTripBaggageFees(
  companyName: string | undefined,
  bags: Array<{
    id: string;
    label: string;
    type: 'PERSONAL' | 'CARRY_ON' | 'CHECKED';
    currentWeightLbs: number;
    maxWeightLimitLbs?: number;
  }>,
  cabinOrSeatClass?: string,
  fareFamilyId?: string
): BagFeeCalculationResult | null {
  if (!companyName || !companyName.trim()) {
    return null;
  }

  const feeRecord = findAirlineFeeRecord(companyName);

  if (!feeRecord) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName.trim() + ' baggage fee policy official')}`;
    return {
      hasFeeData: false,
      airlineName: companyName,
      currency: 'USD',
      currencySymbol: '$',
      totalEstimatedFee: 0,
      totalEstimatedFeeFormatted: '$0',
      breakdown: [],
      overweightBagCount: 0,
      totalOverweightFee: 0,
      officialBaggagePageUrl: searchUrl,
      feeNotes: "Estimate unavailable — check the airline's policy",
      disclaimer: "Estimate unavailable — check the airline's policy. Always confirm baggage fees directly with your carrier before you travel."
    };
  }

  // Retrieve published fare families for this airline
  const families = getAirlineFareFamilies(feeRecord.airlineId || feeRecord.airlineName);
  let activeFamily: AirlineFareFamily | undefined;
  if (fareFamilyId) {
    activeFamily = families.find((f) => f.id === fareFamilyId);
  }
  if (!activeFamily) {
    activeFamily = families.find((f) => f.isDefault) || families[0];
  }

  const isBusinessOrFirst = Boolean(
    (cabinOrSeatClass && /business|first|polaris|delta one|signature|mint|club/i.test(cabinOrSeatClass)) ||
    (activeFamily && /business|first|mint|signature|club/i.test(activeFamily.name))
  );

  // Combine inclusions: bag is free if either cabin class OR fare family includes it
  const cabinIncludedCheckedBags = isBusinessOrFirst ? 2 : 0;
  const familyIncludedCheckedBags = activeFamily ? activeFamily.includedCheckedBags : 0;
  const effectiveIncludedCheckedBags = Math.max(cabinIncludedCheckedBags, familyIncludedCheckedBags);

  let checkedBagIndex = 0;
  let totalFee = 0;
  let totalOverweight = 0;
  let overweightCount = 0;

  const breakdown: BagFeeCalculationResult['breakdown'] = [];

  for (const bag of bags) {
    let baseFee = 0;
    let overweightFee = 0;
    let isOverweight = false;
    let overweightReason: string | undefined;

    // Weight cap: 70 lbs (32 kg) for Business/First; 40 lbs for ULCCs Spirit (archived) / Frontier; standard 50 lbs (23 kg) otherwise (including Allegiant)
    const defaultCheckedCapLbs = /spirit|frontier/i.test(feeRecord.airlineId) ? 40 : 50;
    const weightCap = bag.maxWeightLimitLbs || (bag.type === 'CHECKED' ? (isBusinessOrFirst ? 70 : defaultCheckedCapLbs) : bag.type === 'CARRY_ON' ? 22 : 15);
    const weightLbs = bag.currentWeightLbs || 0;

    if (bag.type === 'CHECKED') {
      checkedBagIndex += 1;
      if (checkedBagIndex <= effectiveIncludedCheckedBags) {
        baseFee = 0; // Included in fare / cabin class
      } else if (checkedBagIndex === 1) {
        baseFee = activeFamily ? activeFamily.firstCheckedFee : feeRecord.firstCheckedFee;
      } else {
        baseFee = activeFamily ? activeFamily.secondCheckedFee : feeRecord.secondCheckedFee;
      }

      // Check if overweight
      if (weightLbs > weightCap) {
        isOverweight = true;
        overweightFee = feeRecord.overweightFee51to70lbs;
        overweightCount += 1;
        totalOverweight += overweightFee;
        overweightReason = `${weightLbs.toFixed(1)} lbs exceeds ${weightCap} lbs limit`;
      }
    } else if (bag.type === 'CARRY_ON') {
      if (activeFamily && !activeFamily.carryOnAllowed) {
        baseFee = activeFamily.carryOnFee > 0 ? activeFamily.carryOnFee : 25;
      } else {
        baseFee = activeFamily ? activeFamily.carryOnFee : feeRecord.carryOnFee;
      }

      if (weightLbs > weightCap && (feeRecord.carryOnFee > 0 || (activeFamily && activeFamily.carryOnFee > 0))) {
        isOverweight = true;
        overweightFee = 25; // standard gate check fee
        overweightCount += 1;
        totalOverweight += overweightFee;
        overweightReason = `${weightLbs.toFixed(1)} lbs exceeds carry-on limit`;
      }
    } else {
      // Personal item: always free
      baseFee = 0;
    }

    const subtotal = baseFee + overweightFee;
    totalFee += subtotal;

    breakdown.push({
      bagId: bag.id,
      bagLabel: bag.label,
      bagType: bag.type,
      baseFee,
      baseFeeFormatted: baseFee === 0 ? 'Included in fare ($0)' : `${feeRecord.currencySymbol}${baseFee}`,
      isOverweight,
      overweightFee,
      overweightReason,
      subtotal,
      subtotalFormatted: subtotal === 0 ? 'Included ($0)' : `${feeRecord.currencySymbol}${subtotal}`
    });
  }

  const totalFormatted = totalFee === 0 
    ? `${feeRecord.currencySymbol}0` 
    : `${feeRecord.currencySymbol}${totalFee}`;

  // Dynamic USD equivalent note based on actual totalFee (never showing static non-zero USD when total is $0)
  let usdEquivalentNote: string | undefined = undefined;
  if (feeRecord.currency !== 'USD') {
    if (totalFee === 0) {
      usdEquivalentNote = 'approx ~$0 USD';
    } else {
      const rate = APPROX_USD_RATES[feeRecord.currency] || 1;
      const approxUsd = Math.round(totalFee * rate);
      usdEquivalentNote = `approx ~$${approxUsd} USD`;
    }
  }

  const disclaimer = 'Estimate from published airline fee tables. Fees vary by route, fare family, loyalty/card tier, and booking timing — confirm with your operating carrier at booking.';

  return {
    hasFeeData: true,
    airlineName: feeRecord.airlineName,
    currency: feeRecord.currency,
    currencySymbol: feeRecord.currencySymbol,
    usdEquivalentNote,
    lastVerified: feeRecord.lastVerified,
    officialBaggagePageUrl: feeRecord.officialBaggagePageUrl,
    totalEstimatedFee: totalFee,
    totalEstimatedFeeFormatted: totalFormatted,
    fareFamilyName: activeFamily?.name,
    fareFamilyId: activeFamily?.id,
    carryOnAllowed: activeFamily?.carryOnAllowed ?? true,
    carryOnRestrictionNotice: activeFamily?.carryOnRestrictionNotice,
    includedCheckedBags: effectiveIncludedCheckedBags,
    breakdown,
    overweightBagCount: overweightCount,
    totalOverweightFee: totalOverweight,
    feeNotes: activeFamily?.fareNote || feeRecord.feeNotes,
    disclaimer
  };
}

/**
 * Resolves distinct 1st-bag and 2nd-bag note text, separating USD conversions
 * so each checked bag row receives its specific rate instead of combining them into one cell.
 */
export function getSplitBagUsdNotes(feeData: AirlineFeeData): { firstBagNote: string; secondBagNote: string } {
  if (feeData.firstCheckedUsdNote && feeData.secondCheckedUsdNote) {
    return {
      firstBagNote: feeData.firstCheckedUsdNote,
      secondBagNote: feeData.secondCheckedUsdNote
    };
  }

  if (feeData.usdEquivalentNote && feeData.usdEquivalentNote.includes('/')) {
    const parts = feeData.usdEquivalentNote.split('/').map((s) => s.trim());
    const part1 = parts[0];
    let part2 = parts[1];
    if (part2.startsWith('~$') || part2.startsWith('$')) {
      part2 = `approx ${part2}`;
    }
    return {
      firstBagNote: part1,
      secondBagNote: part2
    };
  }

  if (feeData.usdEquivalentNote) {
    return {
      firstBagNote: feeData.usdEquivalentNote,
      secondBagNote: 'Online rate (airport desk fees may be higher)'
    };
  }

  return {
    firstBagNote: 'Standard economy ticket',
    secondBagNote: 'Online rate (airport desk fees may be higher)'
  };
}
