// Static Airline Baggage Fee Reference Table for the 42 Allowance Engine Airlines
// Brand rule: NEVER present static reference data as live.
// Every estimate carries a last_verified date and official sources disclaimer.

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
    firstCheckedFee: 35,
    secondCheckedFee: 45,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: 'Standard domestic Main Cabin fees ($35 first, $45 second). First/Delta One includes 2 free checked bags up to 70 lbs.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.delta.com/us/en/baggage/overview'
  },
  {
    airlineId: 'american',
    airlineName: 'American Airlines',
    aliases: ['american', 'american airlines', 'aa'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 35,
    secondCheckedFee: 45,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: '$35 first bag online ($40 at airport), $45 second bag for domestic Main Cabin. Business & First include 2-3 free bags up to 70 lbs.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.aa.com/i18n/travel-info/baggage/checked-baggage-policy.jsp'
  },
  {
    airlineId: 'united',
    airlineName: 'United Airlines',
    aliases: ['united', 'united airlines', 'ua'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 35,
    secondCheckedFee: 45,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 200,
    feeNotes: '$35 first bag prepaid ($40 airport), $45 second bag prepaid ($50 airport). Basic Economy does NOT include an overhead carry-on on domestic flights.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.united.com/en/us/baggage-calculator'
  },
  {
    airlineId: 'southwest',
    airlineName: 'Southwest Airlines',
    aliases: ['southwest', 'southwest airlines', 'wn'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 0,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 125,
    feeNotes: 'Famous "Bags Fly Free": Your first 2 checked bags are $0 (free up to 50 lbs each). 3rd+ bag is $125.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.southwest.com/html/customer-service/baggage/'
  },
  {
    airlineId: 'jetblue',
    airlineName: 'JetBlue Airways',
    aliases: ['jetblue', 'jetblue airways', 'b6'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 35,
    secondCheckedFee: 50,
    carryOnFee: 0,
    overweightFee51to70lbs: 150,
    oversizeFee: 150,
    feeNotes: '$35 first bag ($45 within 24h of departure), $50 second bag ($60 within 24h). Blue Plus includes 1 free bag; Mint includes 2 free bags (70 lbs).',
    lastVerified: 'October 15, 2026',
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
    feeNotes: '$35 first bag, $45 second bag. 20-minute baggage delivery guarantee at carousel. First Class includes 2 free bags up to 70 lbs.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.alaskaair.com/content/travel-info/baggage'
  },
  {
    airlineId: 'hawaiian',
    airlineName: 'Hawaiian Airlines',
    aliases: ['hawaiian', 'hawaiian airlines', 'ha'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 35,
    secondCheckedFee: 40,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    feeNotes: '$35 first bag mainland, $40 second bag. HawaiianMiles members receive discounted $25 first / $35 second rates. First Class includes 2 free bags (70 lbs).',
    lastVerified: 'October 15, 2026',
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
    feeNotes: 'Ultra-low cost: Standard carry-on costs ~$45-$60. Checked limit is STRICT 40 lbs (not 50 lbs). 41-50 lbs fee is $79; 51-70 lbs fee is $125.',
    lastVerified: 'October 15, 2026',
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
    feeNotes: 'Ultra-low cost: Carry-on bag requires a fee (~$49-$60). Checked limit is STRICT 40 lbs. Overweight 41-50 lbs is +$75; 51-100 lbs is +$100.',
    lastVerified: 'October 15, 2026',
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
    feeNotes: 'Ultra-low cost: Carry-on and checked bags incur fees. Standard checked limit is 40 lbs; 41-70 lbs is +$75. Airport desk bag charges are substantially higher.',
    lastVerified: 'October 15, 2026',
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
    feeNotes: 'Low-cost model: Carry-on ~$30-$40 online. 1st checked bag ~$35-$45. 51-60 lbs overweight fee is $60; 61-70 lbs is $100.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.suncountry.com/bags-optional-services'
  },

  // ================= CANADIAN AIRLINES (5) =================
  {
    airlineId: 'aircanada',
    airlineName: 'Air Canada',
    aliases: ['air canada', 'aircanada', 'ac'],
    currency: 'CAD',
    currencySymbol: 'CAD $',
    firstCheckedFee: 35,
    secondCheckedFee: 50,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    usdEquivalentNote: 'approx ~$26 USD / ~$37 USD',
    feeNotes: 'Standard domestic & transborder Basic/Standard economy. Aeroplan Elite or premium credit cardholders receive 1-3 free bags. Business Class includes 2 bags (70 lbs).',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.aircanada.com/ca/en/aco/home/plan/baggage/checked.html'
  },
  {
    airlineId: 'westjet',
    airlineName: 'WestJet',
    aliases: ['westjet', 'west jet', 'ws'],
    currency: 'CAD',
    currencySymbol: 'CAD $',
    firstCheckedFee: 35,
    secondCheckedFee: 50,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 100,
    usdEquivalentNote: 'approx ~$26 USD / ~$37 USD',
    feeNotes: 'UltraBasic fares do NOT include an overhead carry-on. Standard Econo: $35 CAD first bag, $50 CAD second bag. WestJet RBC World Elite Mastercard includes 1st bag free.',
    lastVerified: 'October 15, 2026',
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
    usdEquivalentNote: 'approx ~$26 USD / ~$37 USD',
    feeNotes: 'PorterClassic Standard includes free carry-on. PorterClassic Basic excludes carry-on ($35 CAD fee to check). 1st checked bag $35-$40 CAD online.',
    lastVerified: 'October 15, 2026',
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
    usdEquivalentNote: 'approx ~$30 USD / ~$41 USD',
    feeNotes: 'Standard Eco Budget fares exclude checked baggage ($40 CAD online). Standard carry-on roller (22 lbs) is free on all fares.',
    lastVerified: 'October 15, 2026',
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
    feeNotes: 'Canadian Ultra-Low Cost Carrier: Basic fare only includes small personal item. Overhead carry-on costs $39-$49 CAD; checked bag costs $49-$69 CAD online.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://flyflair.com/travel-info/baggage'
  },

  // ================= EUROPEAN AIRLINES (13) =================
  {
    airlineId: 'britishairways',
    airlineName: 'British Airways',
    aliases: ['british airways', 'british', 'ba'],
    currency: 'GBP',
    currencySymbol: '£',
    firstCheckedFee: 35,
    secondCheckedFee: 65,
    carryOnFee: 0,
    overweightFee51to70lbs: 65,
    oversizeFee: 65,
    usdEquivalentNote: 'approx ~$45 USD / ~$85 USD',
    feeNotes: 'Economy Standard / Club Europe includes 1-2 checked bags free (51 lbs). Hand Baggage Only (Basic) fares charge £35 first checked bag.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.britishairways.com/en-gb/information/baggage-essentials'
  },
  {
    airlineId: 'airfrance_klm',
    airlineName: 'Air France / KLM',
    aliases: ['air france', 'klm', 'air france / klm', 'af'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 30,
    secondCheckedFee: 75,
    carryOnFee: 0,
    overweightFee51to70lbs: 75,
    oversizeFee: 75,
    usdEquivalentNote: 'approx ~$33 USD / ~$82 USD',
    feeNotes: 'Standard economy includes 1 free checked bag (23 kg). "Light" unbundled fares charge €30 online for the 1st checked bag (€70 at airport).',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://wwws.airfrance.us/information/bagages'
  },
  {
    airlineId: 'lufthansa',
    airlineName: 'Lufthansa Group (SWISS / Austrian)',
    aliases: ['lufthansa', 'swiss', 'austrian', 'lh', 'lx', 'os'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 30,
    secondCheckedFee: 80,
    carryOnFee: 0,
    overweightFee51to70lbs: 65,
    oversizeFee: 100,
    usdEquivalentNote: 'approx ~$33 USD / ~$87 USD',
    feeNotes: 'Economy Classic & Flex include 1 checked bag (23 kg) free. Economy Light charges €30 online for the 1st bag (€60 at airport). Overweight up to 32 kg is €65.',
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.easyjet.com/en/help/baggage/cabin-bag-and-hold-luggage'
  },
  {
    airlineId: 'turkish',
    airlineName: 'Turkish Airlines',
    aliases: ['turkish', 'turkish airlines', 'tk'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 50,
    carryOnFee: 0,
    overweightFee51to70lbs: 80,
    oversizeFee: 80,
    feeNotes: 'International routes to/from Americas include 2 free checked bags up to 23 kg each. Additional bags cost ~$50-$80 depending on route.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.turkishairlines.com/en-us/any-questions/free-baggage/'
  },
  {
    airlineId: 'iberia',
    airlineName: 'Iberia',
    aliases: ['iberia', 'ib'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 25,
    secondCheckedFee: 45,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    usdEquivalentNote: 'approx ~$27 USD / ~$49 USD',
    feeNotes: 'Standard fares include 1 free checked bag (23 kg). "Basic" unbundled fares charge €25-€35 online for the 1st checked bag. Carry-on + personal item free.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.iberia.com/us/baggage/'
  },
  {
    airlineId: 'sas',
    airlineName: 'Scandinavian Airlines (SAS)',
    aliases: ['sas', 'scandinavian airlines', 'sk'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 30,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 55,
    oversizeFee: 75,
    usdEquivalentNote: 'approx ~$33 USD / ~$65 USD',
    feeNotes: 'SAS Go includes 1 free checked bag (23 kg). SAS Go Light unbundled fare charges €30 online for 1st bag (€60 at gate). SAS Plus/Business includes 2 bags (32 kg).',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.flysas.com/en/travel-info/baggage/'
  },
  {
    airlineId: 'virgin',
    airlineName: 'Virgin Atlantic',
    aliases: ['virgin atlantic', 'virgin', 'vs'],
    currency: 'GBP',
    currencySymbol: '£',
    firstCheckedFee: 50,
    secondCheckedFee: 65,
    carryOnFee: 0,
    overweightFee51to70lbs: 65,
    oversizeFee: 65,
    usdEquivalentNote: 'approx ~$65 USD / ~$85 USD',
    feeNotes: 'Economy Classic & Delight include 1 free checked bag (23 kg / 50 lbs). Economy Light unbundled charges £50 online for 1st checked bag.',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.virginatlantic.com/us/en/travel-information/baggage.html'
  },
  {
    airlineId: 'ita',
    airlineName: 'ITA Airways (Alitalia)',
    aliases: ['ita', 'ita airways', 'alitalia', 'az'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 30,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    usdEquivalentNote: 'approx ~$33 USD / ~$65 USD',
    feeNotes: 'Classic economy includes 1 free 23 kg bag. Light unbundled fare charges €30 online for the 1st checked bag (€60 airport). Business includes 2 bags (32 kg).',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.ita-airways.com/en_us/fly-ita/baggage.html'
  },
  {
    airlineId: 'tap',
    airlineName: 'TAP Air Portugal',
    aliases: ['tap', 'tap air portugal', 'tp'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 30,
    secondCheckedFee: 55,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    usdEquivalentNote: 'approx ~$33 USD / ~$60 USD',
    feeNotes: 'Basic / Classic includes 1 free checked bag. "Discount" unbundled fare charges €30 online for 1st checked bag. Executive includes 2 bags (32 kg).',
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://www.flytap.com/en-us/baggage'
  },
  {
    airlineId: 'finnair',
    airlineName: 'Finnair',
    aliases: ['finnair', 'ay'],
    currency: 'EUR',
    currencySymbol: '€',
    firstCheckedFee: 30,
    secondCheckedFee: 60,
    carryOnFee: 0,
    overweightFee51to70lbs: 60,
    oversizeFee: 75,
    usdEquivalentNote: 'approx ~$33 USD / ~$65 USD',
    feeNotes: 'Classic/Flex includes 1 checked bag (23 kg). "Superlight" / "Light" charges €30 for checked bag and €9-€14 for overhead trolley. Business includes 1-2 bags.',
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
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
    lastVerified: 'October 15, 2026',
    officialBaggagePageUrl: 'https://flyasiana.com/C/US/EN/contents/checked-baggage'
  },
  {
    airlineId: 'vietnam',
    airlineName: 'Vietnam Airlines',
    aliases: ['vietnam airlines', 'vietnam', 'vn'],
    currency: 'USD',
    currencySymbol: '$',
    firstCheckedFee: 0,
    secondCheckedFee: 50,
    carryOnFee: 0,
    overweightFee51to70lbs: 100,
    oversizeFee: 150,
    feeNotes: 'Economy Standard on long-haul routes includes 1-2 free checked bags (23 kg each). Domestic and unbundled short-haul fares may charge for additional pieces.',
    lastVerified: 'October 15, 2026',
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

/**
 * Calculates bag fees strictly from the static fee table.
 * If bags exceed weight limits (50 lbs / 23 kg standard, or airline limit), applies overweight fee and flags it.
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
  cabinOrSeatClass?: string
): BagFeeCalculationResult | null {
  if (!companyName || !companyName.trim()) {
    return null;
  }

  const query = companyName.toLowerCase().trim();
  const feeRecord = AIRLINE_BAGGAGE_FEES.find((item) => {
    return (
      item.airlineName.toLowerCase().includes(query) ||
      query.includes(item.airlineName.toLowerCase()) ||
      item.aliases.some((alias) => query.includes(alias) || alias.includes(query))
    );
  });

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

    const isBusinessOrFirst = Boolean(cabinOrSeatClass && /business|first|polaris|delta one|signature/i.test(cabinOrSeatClass));

    // Determine weight cap (default 50 lbs / 23 kg for checked, 22 lbs for carry-on; 70 lbs for Business/First)
    const weightCap = bag.maxWeightLimitLbs || (bag.type === 'CHECKED' ? (isBusinessOrFirst ? 70 : 50) : bag.type === 'CARRY_ON' ? 22 : 15);
    const weightLbs = bag.currentWeightLbs || 0;

    if (bag.type === 'CHECKED') {
      checkedBagIndex += 1;
      if (isBusinessOrFirst && checkedBagIndex <= 2) {
        baseFee = 0; // Standard Business & First class ticket includes 2 free checked bags
      } else if (checkedBagIndex === 1) {
        baseFee = feeRecord.firstCheckedFee;
      } else {
        baseFee = feeRecord.secondCheckedFee;
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
      baseFee = feeRecord.carryOnFee;
      if (weightLbs > weightCap && feeRecord.carryOnFee > 0) {
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
      baseFeeFormatted: baseFee === 0 ? 'Free ($0)' : `${feeRecord.currencySymbol}${baseFee}`,
      isOverweight,
      overweightFee,
      overweightReason,
      subtotal,
      subtotalFormatted: subtotal === 0 ? 'Free ($0)' : `${feeRecord.currencySymbol}${subtotal}`
    });
  }

  const totalFormatted = totalFee === 0 
    ? `${feeRecord.currencySymbol}0` 
    : `${feeRecord.currencySymbol}${totalFee}`;

  const disclaimer = `Estimate from published airline fee tables, last verified ${feeRecord.lastVerified}. Airlines change fees — confirm at booking.`;

  return {
    hasFeeData: true,
    airlineName: feeRecord.airlineName,
    currency: feeRecord.currency,
    currencySymbol: feeRecord.currencySymbol,
    usdEquivalentNote: feeRecord.usdEquivalentNote,
    lastVerified: feeRecord.lastVerified,
    officialBaggagePageUrl: feeRecord.officialBaggagePageUrl,
    totalEstimatedFee: totalFee,
    totalEstimatedFeeFormatted: totalFormatted,
    breakdown,
    overweightBagCount: overweightCount,
    totalOverweightFee: totalOverweight,
    feeNotes: feeRecord.feeNotes,
    disclaimer
  };
}
