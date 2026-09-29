export interface AircraftInfo {
  id: string;
  name: string;
  manufacturer: 'Boeing' | 'Airbus' | 'Embraer' | 'Bombardier' | 'ATR' | 'Other';
  category: 'Narrowbody (Single Aisle)' | 'Widebody (Twin Aisle)' | 'Regional Jet' | 'Turboprop';
  aliases: string[];
  overheadBins: {
    fitRollaboard: 'YES_WHEELS_FIRST' | 'YES_SIDEWAYS' | 'NO_GATE_CHECK_VALET';
    fitDescription: string;
    gateCheckRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_GATE_CHECK';
    riskSummary: string;
    valetTagGuidance: string;
  };
  inSeatPower: {
    firstBusiness: string;
    premiumEconomy?: string;
    economy: string;
    usbPorts: string;
    socketCompatibility: string;
    maxWattage: string;
  };
  underSeatClearance: {
    dimensions: string;
    windowSeatNote: string;
    middleSeatNote: string;
    aisleSeatNote: string;
  };
  frequentFlyerTips: string[];
}

export const AIRCRAFT_DATABASE: AircraftInfo[] = [
  {
    id: 'b737',
    name: 'Boeing 737-800 / 900 / MAX (737 Series)',
    manufacturer: 'Boeing',
    category: 'Narrowbody (Single Aisle)',
    aliases: ['737', '737-800', '737-900', '738', '739', '737 MAX', '737-MAX 8', '737-MAX 9', 'B738', 'B739', 'B38M', 'B39M'],
    overheadBins: {
      fitRollaboard: 'YES_WHEELS_FIRST',
      fitDescription: 'On MAX and Sky Interior retrofits, bins fit up to 6 rollaboards on their side (wheels-first). Older standard 737 interiors require bags placed sideways, filling up quickly.',
      gateCheckRisk: 'MODERATE',
      riskSummary: 'Moderate risk on full flights. Passengers in boarding groups 4 through 6 frequently face gate checks if flying on older classic interiors.',
      valetTagGuidance: 'Bags gate-checked on mainline 737 flights are typically checked through to final destination baggage claim carousel (white tag), NOT returned at jet bridge.'
    },
    inSeatPower: {
      firstBusiness: 'Dedicated Universal 110V AC outlet (75W) + high-speed USB-A/C per seat.',
      premiumEconomy: 'Dedicated Universal 110V AC outlet + USB-A/C per seat.',
      economy: 'Shared Universal 110V AC sockets (typically 2 outlets per 3-seat cluster, located below seat cushion) + USB-A in IFE screen or seatback.',
      usbPorts: 'USB-A on most carriers; USB-C fast charging standard on 737 MAX 8/9 retrofits.',
      socketCompatibility: 'Universal airline socket: accepts US (2 & 3-prong), European Europlug (Type C), and UK (Type G) without external adapters.',
      maxWattage: '75W max per port. Charges laptops, tablets, and phones; will trip breaker if plugged into high-draw items (curling irons, hair dryers).'
    },
    underSeatClearance: {
      dimensions: 'Approx. 18" W x 14" D x 9" H (fits standard backpacks and totes).',
      windowSeatNote: 'May have a slight curved wall intrusion and an IFE entertainment equipment box taking up ~25% of legroom on older carriers.',
      middleSeatNote: 'Widest under-seat space with zero obstruction between seat legs.',
      aisleSeatNote: 'Aisle seat support pillar slightly restricts width; keep bulky backpacks centered.'
    },
    frequentFlyerTips: [
      'Board with Group 1-3 if carrying a hard-shell 22" spinner on non-MAX aircraft to secure overhead space.',
      'A green indicator LED near the 110V socket turns red if laptop power draw exceeds 75W; charge in sleep mode if tripping.',
      'Lithium power banks must remain in carry-on bag or under your seat. Never place power banks in checked luggage.'
    ]
  },
  {
    id: 'a320',
    name: 'Airbus A320 / A321 / A321neo',
    manufacturer: 'Airbus',
    category: 'Narrowbody (Single Aisle)',
    aliases: ['A320', 'A321', 'A321neo', 'A320neo', '320', '321', '32N', '32Q', 'A319'],
    overheadBins: {
      fitRollaboard: 'YES_WHEELS_FIRST',
      fitDescription: 'New Airspace XL bins fit 8 rollaboards per bin on their sides. Classic A320 bins fit bags flat or wheels-first with wheels pointing out.',
      gateCheckRisk: 'LOW',
      riskSummary: 'Low risk on A321neo with Airspace XL bins; Moderate on older classic A320s with full passenger loads.',
      valetTagGuidance: 'Checked through to baggage claim if gate checked at boarding podium.'
    },
    inSeatPower: {
      firstBusiness: 'Dedicated Universal 110V AC outlet (75W-100W) + dedicated 60W USB-C + USB-A.',
      premiumEconomy: 'Dedicated Universal 110V AC outlet + USB-A/C.',
      economy: 'Shared Universal 110V AC (2 plugs per 3 seats) located between cushions + USB-A / USB-C at seatback.',
      usbPorts: 'Dual USB-A and USB-C available on newer A320neo / A321neo models.',
      socketCompatibility: 'Universal multi-socket accepts standard US, UK, and European plug pins natively.',
      maxWattage: '75W-100W. Supports MacBooks and PC laptops under ordinary load.'
    },
    underSeatClearance: {
      dimensions: 'Approx. 18.5" W x 14.5" D x 9.5" H (Airbus cabin is 7 inches wider than Boeing 737).',
      windowSeatNote: 'Unobstructed flat floor, excellent foot room.',
      middleSeatNote: 'Widest under-seat clearance in narrowbody class.',
      aisleSeatNote: 'Small seat-track rail on outer edge, but accommodates standard personal bags easily.'
    },
    frequentFlyerTips: [
      'The A320 family fuselage is slightly wider than the 737, making window and aisle seat under-seat stowage more comfortable.',
      'Look for the under-seat AC socket glowing green before plugging in your laptop block.'
    ]
  },
  {
    id: 'e175',
    name: 'Embraer 170 / 175 (E-Jets / Regional Connection)',
    manufacturer: 'Embraer',
    category: 'Regional Jet',
    aliases: ['E175', 'E170', 'E75', 'E70', 'ERJ-175', 'ERJ-170', 'Embraer 175', 'Embraer 170'],
    overheadBins: {
      fitRollaboard: 'NO_GATE_CHECK_VALET',
      fitDescription: 'Starboard side (right side / CD seats) bins fit smaller duffels and slim rollaboards. Port side (left side / AB seats) bins are shallow and fit only backpacks or jackets. Full-size 22" rollaboards DO NOT fit wheels-first.',
      gateCheckRisk: 'CRITICAL_GATE_CHECK',
      riskSummary: 'EXTREMELY HIGH / ALMOST CERTAIN GATE CHECK for standard 22" rollaboard suitcases. Most airlines mandate valet tagging.',
      valetTagGuidance: 'VALET CHECK (Pink Tag / Green Tag / Yellow Tag): You surrender your bag on the jetbridge right before stepping onto the aircraft, and retrieve it on the jetbridge immediately upon deplaning at your destination.'
    },
    inSeatPower: {
      firstBusiness: 'Dedicated Universal 110V AC outlet + USB-A port at every seat.',
      economy: 'Shared 110V AC (1 outlet per 2-seat row) or USB-A ports on newer airline retrofits; older regional carriers may have no in-seat power.',
      usbPorts: 'USB-A on modern regional retrofits.',
      socketCompatibility: 'Accepts US and EU plugs directly.',
      maxWattage: '60W max.'
    },
    underSeatClearance: {
      dimensions: 'Approx. 17" W x 13" D x 9" H. 2x2 seating means no middle seat!',
      windowSeatNote: 'Curved fuselage reduces outer foot space slightly; angled stowage required for thick backpacks.',
      middleSeatNote: 'No middle seats exist on this aircraft.',
      aisleSeatNote: 'Very clean under-seat storage with easy personal item retrieval during flight.'
    },
    frequentFlyerTips: [
      'CRITICAL: If gate-checking with a valet tag on the jetbridge, REMOVE your laptop, medication, portable power banks, and passport into your personal item before handing the suitcase to the ramp handler.',
      'Valet checked bags are placed in the cargo hold but returned at the aircraft door upon landing, so you do NOT wait at the baggage claim carousel.'
    ]
  },
  {
    id: 'crj',
    name: 'Bombardier CRJ-700 / CRJ-900',
    manufacturer: 'Bombardier',
    category: 'Regional Jet',
    aliases: ['CRJ', 'CRJ-700', 'CRJ-900', 'CR7', 'CR9', 'CRJ7', 'CRJ9', 'Canadair Regional Jet'],
    overheadBins: {
      fitRollaboard: 'NO_GATE_CHECK_VALET',
      fitDescription: 'Bins are very compact with curved ceilings. Only soft backpacks, gym duffels, and laptop bags fit inside overhead bins.',
      gateCheckRisk: 'CRITICAL_GATE_CHECK',
      riskSummary: '100% MANDATORY GATE VALET CHECK for all standard wheeled carry-on suitcases.',
      valetTagGuidance: 'Gate valet claim: Agent tags bag with pink or yellow claim slip. Drop off at aircraft boarding door, pick up on jetbridge upon arrival.'
    },
    inSeatPower: {
      firstBusiness: 'Universal 110V AC outlet at First Class seats.',
      economy: 'Limited: Many regional partner CRJs have NO electrical outlets or USB ports in Economy.',
      usbPorts: 'Available on select upgraded carrier configurations only.',
      socketCompatibility: 'US 2-pin and 3-pin standard.',
      maxWattage: '60W max where equipped.'
    },
    underSeatClearance: {
      dimensions: 'Approx. 16" W x 12" D x 8.5" H. Compact floor area.',
      windowSeatNote: 'Floor curvature and seat rail noticeably reduce outer foot room.',
      middleSeatNote: 'No middle seats exist (2x2 configuration).',
      aisleSeatNote: 'Best option for personal items.'
    },
    frequentFlyerTips: [
      'Pack a fully charged external power bank in your personal item, as regional CRJ economy flights rarely offer in-seat charging.',
      'Do not pack fragile items in carry-on bags being valet-checked; ramp handlers stack them quickly in regional cargo holds.'
    ]
  },
  {
    id: 'b787',
    name: 'Boeing 787 Dreamliner',
    manufacturer: 'Boeing',
    category: 'Widebody (Twin Aisle)',
    aliases: ['787', '787-8', '787-9', '787-10', '788', '789', '781', 'Dreamliner', 'B787', 'B788', 'B789'],
    overheadBins: {
      fitRollaboard: 'YES_WHEELS_FIRST',
      fitDescription: 'Massive vaulted pivot bins fit multiple 22" to 24" rollaboards on their side with room to spare.',
      gateCheckRisk: 'LOW',
      riskSummary: 'Extremely low risk. Overhead capacity is built to fit one rollaboard per passenger on typical configurations.',
      valetTagGuidance: 'Standard checked baggage only in rare overflow events.'
    },
    inSeatPower: {
      firstBusiness: 'Dual Universal 110V AC (100W) + 60W USB-C + USB-A + optional Qi wireless charging pad in console.',
      premiumEconomy: 'Dedicated Universal 110V AC outlet (75W) + dedicated USB-A/C per seat.',
      economy: 'Dedicated or 2-per-3 Universal 110V AC (75W) + powered USB port in seatback entertainment monitor.',
      usbPorts: 'High-output USB at every single seat.',
      socketCompatibility: 'Accepts US, UK, EU, Australian, and Japanese plugs directly.',
      maxWattage: '75W to 100W. Excellent for full laptop charging during long international journeys.'
    },
    underSeatClearance: {
      dimensions: 'Approx. 19" W x 15" D x 10" H.',
      windowSeatNote: 'Smooth sidewalls without curvature interference.',
      middleSeatNote: 'Spacious flat floor.',
      aisleSeatNote: 'Wide footwell.'
    },
    frequentFlyerTips: [
      'Universal sockets accept US, UK, and European 2-prong & 3-prong plugs, so you do NOT need an adapter in-flight.',
      'Higher cabin humidity (15-20%) and lower cabin altitude (6,000 ft) reduce dehydration; pack eye drops and empty water bottle to fill after security.'
    ]
  },
  {
    id: 'a350',
    name: 'Airbus A350-900 / A350-1000',
    manufacturer: 'Airbus',
    category: 'Widebody (Twin Aisle)',
    aliases: ['A350', 'A350-900', 'A350-1000', '359', '351', 'A359', 'A35K'],
    overheadBins: {
      fitRollaboard: 'YES_WHEELS_FIRST',
      fitDescription: 'Extra-deep pivot bins comfortably hold up to five 22" suitcases per bin module on their edges.',
      gateCheckRisk: 'LOW',
      riskSummary: 'Very low risk of gate checking.',
      valetTagGuidance: 'Checked through to final destination carousel if tagged.'
    },
    inSeatPower: {
      firstBusiness: 'Dual 110V Universal AC + 60W USB-C fast charging + USB-A.',
      premiumEconomy: 'Dedicated Universal 110V AC + USB-C/A.',
      economy: 'Individual Universal 110V AC (or 2 per 3 seats) + powered USB in seatback.',
      usbPorts: 'USB-C and USB-A standard on almost all airline fleets.',
      socketCompatibility: 'Universal international socket (US/UK/EU/AU compatible).',
      maxWattage: '75W-100W.'
    },
    underSeatClearance: {
      dimensions: 'Approx. 19.5" W x 15" D x 10" H. Clean flat floor with hidden cabling.',
      windowSeatNote: 'Vertical sidewalls provide great lateral foot room.',
      middleSeatNote: 'Completely clear floor space.',
      aisleSeatNote: 'Unobstructed.'
    },
    frequentFlyerTips: [
      'Great for tech workers: USB-C power delivery ports can charge iPads and ultrabooks directly without needing your heavy AC brick.',
      'Universal in-flight outlets work with any laptop charger pin.'
    ]
  },
  {
    id: 'b777',
    name: 'Boeing 777-200ER / 777-300ER',
    manufacturer: 'Boeing',
    category: 'Widebody (Twin Aisle)',
    aliases: ['777', '777-300ER', '777-200', '77W', '772', '773', 'B77W', 'B772', 'B773'],
    overheadBins: {
      fitRollaboard: 'YES_WHEELS_FIRST',
      fitDescription: 'Deep curved pivot bins fit standard roller suitcases wheels-first.',
      gateCheckRisk: 'LOW',
      riskSummary: 'Low risk of gate check.',
      valetTagGuidance: 'Standard carousel claim.'
    },
    inSeatPower: {
      firstBusiness: 'Universal 110V AC (100W) + USB-A/C.',
      premiumEconomy: 'Universal 110V AC + USB-A.',
      economy: 'Universal 110V AC (shared or dedicated) + USB-A.',
      usbPorts: 'USB-A standard; USB-C on recently refurbished cabins.',
      socketCompatibility: 'Universal international sockets accept US, UK, and European plugs without adapters.',
      maxWattage: '75W.'
    },
    underSeatClearance: {
      dimensions: 'Approx. 18" W x 14" D x 9.5" H.',
      windowSeatNote: 'Standard legroom; older cabins may have small electronics box under seat.',
      middleSeatNote: 'Open footwell.',
      aisleSeatNote: 'Standard clearance.'
    },
    frequentFlyerTips: [
      'In economy, the AC power socket is usually down between your knees or under your seat cushion; look for the tiny status light.'
    ]
  },
  {
    id: 'a220',
    name: 'Airbus A220-100 / A220-300 (formerly Bombardier CSeries)',
    manufacturer: 'Airbus',
    category: 'Narrowbody (Single Aisle)',
    aliases: ['A220', 'A220-100', 'A220-300', '221', '223', 'BCS1', 'BCS3', 'CSeries'],
    overheadBins: {
      fitRollaboard: 'YES_WHEELS_FIRST',
      fitDescription: 'Largest overhead bins of any single-aisle aircraft; fits standard rollaboards on their side even on regional routes.',
      gateCheckRisk: 'LOW',
      riskSummary: 'Very low risk. Outstanding luggage capacity for a 2x3 cabin.',
      valetTagGuidance: 'Checked to final destination if ever gate-tagged.'
    },
    inSeatPower: {
      firstBusiness: 'Universal 110V AC + USB-A/C at every seat.',
      economy: 'Universal 110V AC at every seat + USB-A/C ports.',
      usbPorts: 'USB-A and USB-C available.',
      socketCompatibility: 'Universal multi-socket.',
      maxWattage: '75W.'
    },
    underSeatClearance: {
      dimensions: 'Approx. 19" W x 14" D x 9.5" H. 2x3 seating with extra-wide middle seats.',
      windowSeatNote: 'Generous sidewall room with huge panoramic windows.',
      middleSeatNote: 'Extra-wide 19-inch seat with the most foot room.',
      aisleSeatNote: 'Unobstructed.'
    },
    frequentFlyerTips: [
      'Fan favorite for road warriors: large overhead bins and full in-seat power across both 2-seat and 3-seat sides.'
    ]
  }
];

export function findAircraftInfo(query: string): AircraftInfo | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  
  // Exact or alias match
  const found = AIRCRAFT_DATABASE.find(a => 
    a.name.toLowerCase().includes(q) ||
    a.id.toLowerCase() === q ||
    a.aliases.some(alias => alias.toLowerCase() === q || q.includes(alias.toLowerCase()))
  );
  if (found) return found;

  // Fuzzy keyword matching
  if (q.includes('737') || q.includes('max')) return AIRCRAFT_DATABASE.find(a => a.id === 'b737') || null;
  if (q.includes('320') || q.includes('321') || q.includes('a320') || q.includes('a321')) return AIRCRAFT_DATABASE.find(a => a.id === 'a320') || null;
  if (q.includes('175') || q.includes('170') || q.includes('embraer') || q.includes('erj')) return AIRCRAFT_DATABASE.find(a => a.id === 'e175') || null;
  if (q.includes('crj') || q.includes('bombardier') || q.includes('canadair')) return AIRCRAFT_DATABASE.find(a => a.id === 'crj') || null;
  if (q.includes('787') || q.includes('dreamliner')) return AIRCRAFT_DATABASE.find(a => a.id === 'b787') || null;
  if (q.includes('350') || q.includes('a350')) return AIRCRAFT_DATABASE.find(a => a.id === 'a350') || null;
  if (q.includes('777') || q.includes('triple seven')) return AIRCRAFT_DATABASE.find(a => a.id === 'b777') || null;
  if (q.includes('220') || q.includes('a220') || q.includes('cseries')) return AIRCRAFT_DATABASE.find(a => a.id === 'a220') || null;

  return null;
}
