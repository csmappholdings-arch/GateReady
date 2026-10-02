import { AIRPORTS_DATABASE, AirportCity } from './airportsData';
import { TRANSIT_HUBS_DATABASE, TransitHub } from './transitStationsData';

export type HubMode = 'FLIGHT' | 'RAIL' | 'CRUISE';
export type FacilityFilter = 'ALL' | 'WATER' | 'RESTROOM' | 'POWER' | 'FOOD';

export interface FacilityPOI {
  id: string;
  type: 'WATER' | 'RESTROOM' | 'POWER' | 'FOOD';
  name: string;
  locationNear: string;
  xPercent: number; // 20 to 92
  yPercent: number; // 28 to 72
  details: string;
  isAccessible?: boolean;
  hasBabyChanging?: boolean;
  isColdFiltered?: boolean;
}

export interface TerminalHubData {
  id: string;
  hubMode: HubMode;
  code: string;
  name: string;
  terminalName: string;
  city: string;
  country: string;
  securityWaitAvgMin: number;
  liquidsStrategyTip: string;
  gates: string[];
  facilities: FacilityPOI[];
  isCustomGenerated?: boolean;
}

// ============================================================================
// CURATED MASTER WORLDWIDE HUBS (MAJOR INTERNATIONAL AIRPORTS, RAIL & CRUISE)
// ============================================================================
export const CURATED_TERMINAL_DATA: Record<string, TerminalHubData> = {
  // ----------------------------------------------------
  // FLIGHTS & MAJOR AIRPORTS
  // ----------------------------------------------------
  'JFK-T4': {
    id: 'JFK-T4',
    hubMode: 'FLIGHT',
    code: 'JFK',
    name: 'New York John F. Kennedy International',
    terminalName: 'Terminal 4 (Concourse B Gates B20-B45)',
    city: 'New York, USA',
    country: 'United States',
    securityWaitAvgMin: 18,
    liquidsStrategyTip: 'TSA strictly enforces the 3-1-1 liquids rule (≤3.4oz/100ml per bottle in 1-quart bag). Bring an EMPTY reusable bottle through security. Immediately after the checkpoint exit, free chilled Elkay bottle refill stations are located at Gate B23, B31, and B38.',
    gates: ['B20', 'B22', 'B24', 'B26', 'B28', 'B30', 'B32', 'B34', 'B38', 'B42'],
    facilities: [
      { id: 'jfk-w1', type: 'WATER', name: 'Rapid Chilled Bottle Refill', locationNear: 'Opposite Gate B23', xPercent: 28, yPercent: 38, details: 'Touchless sensor-activated, chilled filtered water with digital bottle counter. Refills standard 24oz bottle in 7 seconds.', isColdFiltered: true },
      { id: 'jfk-w2', type: 'WATER', name: 'Concourse Central Hydration Bar', locationNear: 'Near Gate B31 Food Court', xPercent: 54, yPercent: 42, details: 'Dual drinking fountain plus high-flow stainless bottle refill nozzle.', isColdFiltered: true },
      { id: 'jfk-w3', type: 'WATER', name: 'East Wing Bottle Refill Station', locationNear: 'Between Gates B38 & B40', xPercent: 82, yPercent: 42, details: 'Ultra-cold filtered dispenser adjacent to accessible restrooms.', isColdFiltered: true },
      { id: 'jfk-r1', type: 'RESTROOM', name: 'Concourse Restroom Complex A', locationNear: 'Adjacent to Gate B22', xPercent: 25, yPercent: 62, details: 'Spacious all-gender accessible stalls, touch-free faucets, baby nursing suite.', isAccessible: true, hasBabyChanging: true },
      { id: 'jfk-r2', type: 'RESTROOM', name: 'Mid-Concourse Restrooms B', locationNear: 'Across Gate B30', xPercent: 52, yPercent: 62, details: 'Full ADA accessible facilities with low-sensory baby changing room.', isAccessible: true, hasBabyChanging: true },
      { id: 'jfk-r3', type: 'RESTROOM', name: 'Gate B42 Family Restrooms', locationNear: 'Near Gate B42 Seating', xPercent: 86, yPercent: 62, details: 'Single-occupant accessible family restroom with attendant.', isAccessible: true, hasBabyChanging: true },
      { id: 'jfk-p1', type: 'POWER', name: 'High-Power Charging Island', locationNear: 'Gate B26 Seating', xPercent: 38, yPercent: 30, details: '65W USB-C Power Delivery and universal 110V AC sockets at every seat.' },
      { id: 'jfk-p2', type: 'POWER', name: 'Workstation Tech Bar', locationNear: 'Gate B34 Work Lounge', xPercent: 68, yPercent: 30, details: 'High-top work counter with wireless charging pads and dual AC plugs.' },
      { id: 'jfk-f1', type: 'FOOD', name: 'Post-Security Fresh Market', locationNear: 'Across Gate B28', xPercent: 46, yPercent: 65, details: 'Sealed grab-and-go salads, electrolyte beverages, artisan coffee.' }
    ]
  },
  'LHR-T5': {
    id: 'LHR-T5',
    hubMode: 'FLIGHT',
    code: 'LHR',
    name: 'London Heathrow Airport',
    terminalName: 'Terminal 5 (A Gates Airside Concourse)',
    city: 'London, UK',
    country: 'United Kingdom',
    securityWaitAvgMin: 14,
    liquidsStrategyTip: 'UK Aviation security strictly confiscates liquid containers over 100ml. Once cleared through metal detectors into World Duty Free, complimentary chilled British tap water fountains are located near Gates A8, A15, and A22.',
    gates: ['A5', 'A8', 'A10', 'A12', 'A15', 'A18', 'A20', 'A22'],
    facilities: [
      { id: 'lhr-w1', type: 'WATER', name: 'Free Chilled Refill Fountain', locationNear: 'Beside Gate A8 Entrance', xPercent: 30, yPercent: 38, details: 'Pristine chilled UK tap water dispenser designed for reusable thermos containers.', isColdFiltered: true },
      { id: 'lhr-w2', type: 'WATER', name: 'Central Concourse Water Point', locationNear: 'Opposite Gate A15 Hub', xPercent: 56, yPercent: 42, details: 'High-flow push-button station with high-volume filter.', isColdFiltered: true },
      { id: 'lhr-w3', type: 'WATER', name: 'Gate A22 Refill Station', locationNear: 'Near Gate A22 Restrooms', xPercent: 78, yPercent: 42, details: 'Cold drinking water fountain with bottle filler recess.', isColdFiltered: true },
      { id: 'lhr-r1', type: 'RESTROOM', name: 'Terminal 5 Central Lavatories', locationNear: 'Behind Gate A10', xPercent: 36, yPercent: 62, details: 'Fully wheelchair accessible, infant changing table, family amenities.', isAccessible: true, hasBabyChanging: true },
      { id: 'lhr-r2', type: 'RESTROOM', name: 'Gate A18 Restrooms', locationNear: 'Opposite Gate A18 Waiting Hall', xPercent: 66, yPercent: 62, details: 'Spacious accessible stalls with warm water sinks and baby changing.', isAccessible: true, hasBabyChanging: true },
      { id: 'lhr-p1', type: 'POWER', name: 'Universal UK/EU/US Power Bench', locationNear: 'Gate A12 Lounge Area', xPercent: 44, yPercent: 30, details: 'Universal multi-socket outlets accommodating UK 3-pin, Euro 2-pin, and US plugs.' }
    ]
  },
  'CDG-T2E': {
    id: 'CDG-T2E',
    hubMode: 'FLIGHT',
    code: 'CDG',
    name: 'Paris Charles de Gaulle International',
    terminalName: 'Terminal 2E (Hall K International)',
    city: 'Paris, France',
    country: 'France',
    securityWaitAvgMin: 16,
    liquidsStrategyTip: 'French border police & airport security strictly regulate liquids over 100ml. Once inside Hall K past passport control, free potable water taps (eau potable) are located near Gate K32 and K44.',
    gates: ['K30', 'K32', 'K36', 'K40', 'K44', 'K48'],
    facilities: [
      { id: 'cdg-w1', type: 'WATER', name: 'Fontaine Eau Potable (Chilled Water)', locationNear: 'Opposite Gate K32', xPercent: 35, yPercent: 38, details: 'Fresh Parisian potable drinking water with tall bottle filling neck.', isColdFiltered: true },
      { id: 'cdg-w2', type: 'WATER', name: 'Concourse K East Water Tap', locationNear: 'Near Gate K44', xPercent: 70, yPercent: 42, details: 'Sensor-activated chilled hydration fountain.', isColdFiltered: true },
      { id: 'cdg-r1', type: 'RESTROOM', name: 'Hall K Restroom Complex', locationNear: 'Mid-Hall across Gate K36', xPercent: 50, yPercent: 62, details: 'PMR accessible restrooms with dedicated infant changing facilities.', isAccessible: true, hasBabyChanging: true },
      { id: 'cdg-p1', type: 'POWER', name: 'Espace Travail USB Outlets', locationNear: 'Gate K40 Workspace', xPercent: 62, yPercent: 30, details: 'Euro 230V plugs and dual USB-C charging stations.' }
    ]
  },
  'HND-T3': {
    id: 'HND-T3',
    hubMode: 'FLIGHT',
    code: 'HND',
    name: 'Tokyo Haneda International',
    terminalName: 'Terminal 3 (International Concourse)',
    city: 'Tokyo, Japan',
    country: 'Japan',
    securityWaitAvgMin: 10,
    liquidsStrategyTip: 'Japan Security screening checks liquid bottles with electronic scanners. After security, pristine cold and ambient purified water bars are positioned adjacent to all Japanese washlet restroom hubs.',
    gates: ['105', '108', '111', '114', '118', '122'],
    facilities: [
      { id: 'hnd-w1', type: 'WATER', name: 'Purified Water Bar (Cold & Ambient)', locationNear: 'Beside Gate 108', xPercent: 32, yPercent: 38, details: 'Multi-stage Japanese filtration dispenser with hands-free optical sensor.', isColdFiltered: true },
      { id: 'hnd-w2', type: 'WATER', name: 'Central Hydration Point', locationNear: 'Gate 114 Plaza', xPercent: 62, yPercent: 42, details: 'Ultra-clean chilled drinking water station with paper cone cups.', isColdFiltered: true },
      { id: 'hnd-r1', type: 'RESTROOM', name: 'Multi-Function Washlet Suites', locationNear: 'Adjacent to Gate 111', xPercent: 45, yPercent: 62, details: 'Toto Washlet bidet toilets, heated seats, ostomate sink, baby bed.', isAccessible: true, hasBabyChanging: true },
      { id: 'hnd-p1', type: 'POWER', name: 'High-Speed Charging Counter', locationNear: 'Gate 114 Waiting Hall', xPercent: 58, yPercent: 30, details: 'USB-A and USB-C 45W high-speed charging sockets at every workspace.' }
    ]
  },
  'LAX-TBIT': {
    id: 'LAX-TBIT',
    hubMode: 'FLIGHT',
    code: 'LAX',
    name: 'Los Angeles International Airport',
    terminalName: 'Tom Bradley International Terminal (TBIT)',
    city: 'Los Angeles, USA',
    country: 'United States',
    securityWaitAvgMin: 22,
    liquidsStrategyTip: 'TSA screening lines can be busy. Dump all liquids prior to the security queue. Once in the Great Hall, find rapid bottle fill stations near Gates 130 and 148.',
    gates: ['130', '134', '138', '142', '146', '150'],
    facilities: [
      { id: 'lax-w1', type: 'WATER', name: 'TBIT Hydration Hub North', locationNear: 'Near Gate 130', xPercent: 30, yPercent: 38, details: 'Chilled reverse-osmosis filtered water dispenser.', isColdFiltered: true },
      { id: 'lax-w2', type: 'WATER', name: 'Great Hall Refill Station', locationNear: 'Near Gate 142 Food Pavilion', xPercent: 55, yPercent: 42, details: 'Touch-free high-speed bottle filler with LED counter.', isColdFiltered: true },
      { id: 'lax-r1', type: 'RESTROOM', name: 'Great Hall Restrooms', locationNear: 'Opposite Gate 134', xPercent: 40, yPercent: 62, details: 'ADA compliant, family rest suites, baby nursing pods.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'ORD-T5': {
    id: 'ORD-T5',
    hubMode: 'FLIGHT',
    code: 'ORD',
    name: "Chicago O'Hare International",
    terminalName: 'Terminal 5 (International Concourse M)',
    city: 'Chicago, USA',
    country: 'United States',
    securityWaitAvgMin: 20,
    liquidsStrategyTip: 'All carry-on liquids must be under 3.4oz. Once past security checkpoint, Chicago tap water stations are available at Gates M10, M20, and M32.',
    gates: ['M8', 'M12', 'M16', 'M20', 'M24', 'M28', 'M32'],
    facilities: [
      { id: 'ord-w1', type: 'WATER', name: 'Terminal 5 Rapid Bottle Filler', locationNear: 'Gate M12 Central', xPercent: 34, yPercent: 38, details: 'High-speed touchless chilled water dispenser.', isColdFiltered: true },
      { id: 'ord-w2', type: 'WATER', name: 'Concourse M East Refill Station', locationNear: 'Opposite Gate M24', xPercent: 68, yPercent: 42, details: 'Chilled water dispenser with filter status indicator.', isColdFiltered: true },
      { id: 'ord-r1', type: 'RESTROOM', name: 'Concourse M Restroom Core', locationNear: 'Mid-Concourse at Gate M16', xPercent: 48, yPercent: 62, details: 'Spacious family restroom with baby changing facilities.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'SIN-T3': {
    id: 'SIN-T3',
    hubMode: 'FLIGHT',
    code: 'SIN',
    name: 'Singapore Changi Airport',
    terminalName: 'Terminal 3 (Departure Transit Concourse B)',
    city: 'Singapore',
    country: 'Singapore',
    securityWaitAvgMin: 8,
    liquidsStrategyTip: 'At Changi, baggage security is conducted at the individual boarding gate! Liquids purchased in the central transit mall cannot be brought into the gate lounge unless sealed in STEB bags. Water stations inside the gate holding rooms allow refilling empty bottles immediately before boarding.',
    gates: ['B1', 'B3', 'B5', 'B7', 'B9', 'B10'],
    facilities: [
      { id: 'sin-w1', type: 'WATER', name: 'Hot & Chilled Drinking Water Fountain', locationNear: 'Transit Mall near Gate B3', xPercent: 36, yPercent: 38, details: 'Offers ice-cold water and 85°C hot water for tea/infant formula.', isColdFiltered: true },
      { id: 'sin-w2', type: 'WATER', name: 'Gate Holding Area Refill Tap', locationNear: 'Gate B7 Boarding Lounge', xPercent: 72, yPercent: 42, details: 'Inside secure gate room past gate-level bag X-ray.', isColdFiltered: true },
      { id: 'sin-r1', type: 'RESTROOM', name: 'Butterfly Garden Luxury Restrooms', locationNear: 'Central Transit Mezzanine', xPercent: 54, yPercent: 62, details: 'Full powder room, nursing rooms, touchless bidet fixtures.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'AMS-LOUNGE1': {
    id: 'AMS-LOUNGE1',
    hubMode: 'FLIGHT',
    code: 'AMS',
    name: 'Amsterdam Airport Schiphol',
    terminalName: 'Departures Lounge 1 (Schengen Concourses B/C)',
    city: 'Amsterdam, Netherlands',
    country: 'Netherlands',
    securityWaitAvgMin: 12,
    liquidsStrategyTip: 'Schiphol uses advanced CT scanners allowing liquids to remain in bags, but size rules still apply for destinations outside EU. Once airside, high-purity Dutch drinking tap water fountains are located near all B and C gate entrances.',
    gates: ['B15', 'B20', 'B28', 'C5', 'C10', 'C18'],
    facilities: [
      { id: 'ams-w1', type: 'WATER', name: 'Water Tap by Dopper Refill', locationNear: 'Concourse B Entrance', xPercent: 32, yPercent: 38, details: 'Cold natural Dutch tap water with dedicated bottle filling neck.', isColdFiltered: true },
      { id: 'ams-w2', type: 'WATER', name: 'Lounge 1 Central Water Point', locationNear: 'Opposite Gate C5', xPercent: 64, yPercent: 42, details: 'Touchless filtered water dispenser.', isColdFiltered: true },
      { id: 'ams-r1', type: 'RESTROOM', name: 'Schiphol Lounge Restrooms', locationNear: 'Between Concourse B & C', xPercent: 48, yPercent: 62, details: 'Wheelchair accessible, child changing stations, silent hand dryers.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'SYD-T1': {
    id: 'SYD-T1',
    hubMode: 'FLIGHT',
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    terminalName: 'Terminal 1 (International Concourse Gates 10-34)',
    city: 'Sydney, Australia',
    country: 'Australia',
    securityWaitAvgMin: 15,
    liquidsStrategyTip: 'Australian border force enforces strict 100ml liquid limits for international flights. Free chilled Australian spring tap water stations are located right after passport control and near Gate 24.',
    gates: ['10', '14', '20', '24', '30', '34'],
    facilities: [
      { id: 'syd-w1', type: 'WATER', name: 'Sydney Pure Water Station', locationNear: 'Near Gate 14', xPercent: 35, yPercent: 38, details: 'Chilled filtered water dispenser for international departures.', isColdFiltered: true },
      { id: 'syd-w2', type: 'WATER', name: 'Concourse South Refill Fountain', locationNear: 'Opposite Gate 30', xPercent: 72, yPercent: 42, details: 'Rapid bottle fill fountain.', isColdFiltered: true },
      { id: 'syd-r1', type: 'RESTROOM', name: 'Terminal 1 Departures Amenities', locationNear: 'Mid-Concourse Gate 20', xPercent: 52, yPercent: 62, details: 'Full accessible family amenities and parenting rooms.', isAccessible: true, hasBabyChanging: true }
    ]
  },

  // ----------------------------------------------------
  // HIGH-SPEED RAIL STATIONS
  // ----------------------------------------------------
  'ST-PANCRAS': {
    id: 'ST-PANCRAS',
    hubMode: 'RAIL',
    code: 'STP',
    name: 'London St Pancras International',
    terminalName: 'Eurostar Departure Lounge (Post-Security & Passport)',
    city: 'London / Paris High-Speed Rail',
    country: 'United Kingdom',
    securityWaitAvgMin: 12,
    liquidsStrategyTip: 'Unlike airlines, Eurostar permits liquids and hot drinks through baggage security! However, security screening is mandatory. In the lower departure lounge, a free water refill tap is located by the departure café.',
    gates: ['Platform 5', 'Platform 6', 'Platform 7', 'Platform 8', 'Platform 9', 'Platform 10'],
    facilities: [
      { id: 'stp-w1', type: 'WATER', name: 'Eurostar Departures Refill Tap', locationNear: 'Central Lounge by Pret', xPercent: 45, yPercent: 38, details: 'Free chilled water bottle refill station for passengers waiting for boarding call.', isColdFiltered: true },
      { id: 'stp-w2', type: 'WATER', name: 'Platform Access Refill Station', locationNear: 'Near Platform 7-8 Escalator', xPercent: 70, yPercent: 42, details: 'Direct tap water dispenser with bottle filler.', isColdFiltered: true },
      { id: 'stp-r1', type: 'RESTROOM', name: 'Secure Departures Restrooms', locationNear: 'Lower Concourse West', xPercent: 32, yPercent: 62, details: 'Full accessible facilities, baby changing tables, luggage-friendly wide stalls.', isAccessible: true, hasBabyChanging: true },
      { id: 'stp-p1', type: 'POWER', name: 'Rail Passenger Work Benches', locationNear: 'Platform 5 Waiting Zone', xPercent: 58, yPercent: 30, details: 'UK 3-pin and European 2-pin power sockets for laptops and phones.' }
    ]
  },
  'GARE-DE-LYON': {
    id: 'GARE-DE-LYON',
    hubMode: 'RAIL',
    code: 'GDL',
    name: 'Paris Gare de Lyon',
    terminalName: 'Hall 1 & 2 TGV InOui / Lyria Departure Concourse',
    city: 'Paris, France',
    country: 'France',
    securityWaitAvgMin: 5,
    liquidsStrategyTip: 'Baggage tickets are scanned at platform access barriers 20 minutes prior to departure. Free water fountains and modern 2theloo clean restrooms are located in Hall 1 near the platform entrance.',
    gates: ['Voie A', 'Voie C', 'Voie E', 'Voie G', 'Voie I', 'Voie K'],
    facilities: [
      { id: 'gdl-w1', type: 'WATER', name: 'Fontaine Eau de Paris', locationNear: 'Hall 1 near Voie C', xPercent: 35, yPercent: 38, details: 'Paris municipal filtered tap water with chilled dispenser.', isColdFiltered: true },
      { id: 'gdl-w2', type: 'WATER', name: 'Platform Hall 2 Refill Station', locationNear: 'Hall 2 Ticket Gate', xPercent: 68, yPercent: 42, details: 'Push button bottle filling point.', isColdFiltered: true },
      { id: 'gdl-r1', type: 'RESTROOM', name: '2theloo Station Restroom Complex', locationNear: 'Hall 1 Mezzanine', xPercent: 50, yPercent: 62, details: 'Ultra-clean attended restrooms, disabled access, baby care suite.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'TOKYO-STA': {
    id: 'TOKYO-STA',
    hubMode: 'RAIL',
    code: 'TYO-RAIL',
    name: 'Tokyo Central Station',
    terminalName: 'Tokaido Shinkansen Secure Gate Concourse',
    city: 'Tokyo, Japan',
    country: 'Japan',
    securityWaitAvgMin: 4,
    liquidsStrategyTip: 'Shinkansen ticket gates require valid IC/QR ticket scan. Inside the bullet train concourse, purified water stations and spotless Japanese washlet restrooms are situated next to Track 14-19 escalators.',
    gates: ['Track 14', 'Track 15', 'Track 16', 'Track 17', 'Track 18', 'Track 19'],
    facilities: [
      { id: 'tyo-w1', type: 'WATER', name: 'Shinkansen Purified Water Server', locationNear: 'Track 15-16 Waiting Area', xPercent: 40, yPercent: 38, details: 'Free chilled water dispenser for bullet train travelers.', isColdFiltered: true },
      { id: 'tyo-r1', type: 'RESTROOM', name: 'Shinkansen Concourse Restrooms', locationNear: 'Adjacent to Track 17 Stairwell', xPercent: 55, yPercent: 62, details: 'Advanced Toto Washlets, baby crib, spacious wheelchair access.', isAccessible: true, hasBabyChanging: true },
      { id: 'tyo-f1', type: 'FOOD', name: 'Ekiben Bento Box Market', locationNear: 'Central Waiting Concourse', xPercent: 70, yPercent: 32, details: 'Over 200 regional Japanese bento boxes and green tea for train journeys.' }
    ]
  },
  'MOYNIHAN-NY': {
    id: 'MOYNIHAN-NY',
    hubMode: 'RAIL',
    code: 'NYP',
    name: 'New York Moynihan Train Hall',
    terminalName: 'Amtrak Acela & Empire Service Concourse',
    city: 'New York, USA',
    country: 'United States',
    securityWaitAvgMin: 5,
    liquidsStrategyTip: 'Amtrak passengers have no liquid restriction limits on train cars! Inside the luminous skylit Moynihan Train Hall, high-flow Elkay filtered water bottle filling stations are positioned adjacent to Tracks 7-12 boarding stairwells.',
    gates: ['Track 5-6', 'Track 7-8', 'Track 9-10', 'Track 11-12', 'Track 13-14', 'Track 15-16'],
    facilities: [
      { id: 'nyp-w1', type: 'WATER', name: 'Moynihan Skylight Bottle Filler', locationNear: 'Near Track 9 Escalators', xPercent: 36, yPercent: 38, details: 'Rapid sensor bottle refill counter with ice-cold filtered water.', isColdFiltered: true },
      { id: 'nyp-w2', type: 'WATER', name: 'West Concourse Refill Station', locationNear: 'Track 13 Waiting Lounge', xPercent: 72, yPercent: 42, details: 'Dual drinking fountain and high-flow sports bottle filler.', isColdFiltered: true },
      { id: 'nyp-r1', type: 'RESTROOM', name: 'Main Concourse Luxury Restrooms', locationNear: 'Mid-Hall opposite Amtrak Customer Service', xPercent: 52, yPercent: 62, details: 'All-gender ADA accessible stalls, touchless fixtures, infant nursing room.', isAccessible: true, hasBabyChanging: true },
      { id: 'nyp-p1', type: 'POWER', name: 'Amtrak Ticketed Seating Outlets', locationNear: 'Ticketed Passenger Lounge', xPercent: 60, yPercent: 30, details: 'Dedicated AC plugs and USB charging at every waiting seat.' }
    ]
  },

  // ----------------------------------------------------
  // CRUISE SEA TERMINALS
  // ----------------------------------------------------
  'PORT-MIAMI': {
    id: 'PORT-MIAMI',
    hubMode: 'CRUISE',
    code: 'POM',
    name: 'PortMiami Cruise Terminal',
    terminalName: 'Terminal A (Crown of Miami - Gangway Concourse)',
    city: 'Miami, USA',
    country: 'United States',
    securityWaitAvgMin: 15,
    liquidsStrategyTip: 'Cruise port security strictly scans all luggage through X-Ray scanners for unauthorized alcohol or heating appliances. Free chilled water and lemonade dispensers are provided post-security before boarding the gangway.',
    gates: ['Gangway Forward 2A', 'Gangway Midship 2B', 'Gangway Aft 2C', 'Suite Priority Boarding'],
    facilities: [
      { id: 'mia-cw1', type: 'WATER', name: 'Embarkation Hydration Station', locationNear: 'Pre-Boarding Gangway 2A', xPercent: 32, yPercent: 38, details: 'Chilled iced water dispenser with continuous filtration for cruise guests.', isColdFiltered: true },
      { id: 'mia-cw2', type: 'WATER', name: 'Aft Waiting Lounge Refill', locationNear: 'Gangway 2C Queue', xPercent: 70, yPercent: 42, details: 'Touch-free sensor bottle filler.', isColdFiltered: true },
      { id: 'mia-cr1', type: 'RESTROOM', name: 'Terminal Boarding Restrooms', locationNear: 'Main Concourse East', xPercent: 50, yPercent: 62, details: 'Spacious accessible restrooms for family embarkation with luggage.', isAccessible: true, hasBabyChanging: true },
      { id: 'mia-cp1', type: 'POWER', name: 'Embarkation Mobile Charge Hub', locationNear: 'Seating Section 4', xPercent: 60, yPercent: 30, details: 'Multi-cable USB-C fast charging stations while awaiting boarding call.' }
    ]
  },
  'PORT-EVERGLADES': {
    id: 'PORT-EVERGLADES',
    hubMode: 'CRUISE',
    code: 'PEV',
    name: 'Port Everglades Cruise Terminal',
    terminalName: 'Terminal 2 (Ocean Medallion Embarkation Concourse)',
    city: 'Fort Lauderdale, USA',
    country: 'United States',
    securityWaitAvgMin: 12,
    liquidsStrategyTip: 'After screening baggage, the climate-controlled embarkation hall provides free chilled water stations before you walk the bridge onto the ship.',
    gates: ['Boarding Bridge A (Decks 4-5)', 'Boarding Bridge B (Decks 6-7)', 'VIP Captains Lounge'],
    facilities: [
      { id: 'fll-cw1', type: 'WATER', name: 'Ocean Medallion Refill Oasis', locationNear: 'Bridge A Entrance', xPercent: 38, yPercent: 38, details: 'Chilled water dispenser with reusable bottle spout.', isColdFiltered: true },
      { id: 'fll-cr1', type: 'RESTROOM', name: 'Embarkation Hall Restrooms', locationNear: 'Mid-Terminal Hall', xPercent: 52, yPercent: 62, details: 'Full ADA accessible family stalls with baby diaper changing stations.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'SOUTHAMPTON-OCEAN': {
    id: 'SOUTHAMPTON-OCEAN',
    hubMode: 'CRUISE',
    code: 'SOU',
    name: 'Port of Southampton Ocean Cruise Terminal',
    terminalName: 'Ocean Terminal Berth 46 (Departures Concourse)',
    city: 'Southampton, UK',
    country: 'United Kingdom',
    securityWaitAvgMin: 14,
    liquidsStrategyTip: 'Security checks are thorough. Once past physical luggage screening, free drinking fountains are situated next to the boarding bridge queuing zone.',
    gates: ['Boarding Concourse 1', 'Boarding Concourse 2', 'Priority Deck Access'],
    facilities: [
      { id: 'sou-cw1', type: 'WATER', name: 'Ocean Terminal Refill Tap', locationNear: 'Boarding Gate 1 Queue', xPercent: 35, yPercent: 38, details: 'Fresh chilled tap water dispenser with high-flow spout.', isColdFiltered: true },
      { id: 'sou-cr1', type: 'RESTROOM', name: 'Ocean Terminal Restroom Complex', locationNear: 'Passenger Waiting Hall', xPercent: 55, yPercent: 62, details: 'Accessible wheelchair access, baby changing, assisted facilities.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'BARCELONA-PORT': {
    id: 'BARCELONA-PORT',
    hubMode: 'CRUISE',
    code: 'BCN-PORT',
    name: 'Port of Barcelona Cruise Terminal',
    terminalName: 'Moll Adossat Terminal E (Helix Cruise Center)',
    city: 'Barcelona, Spain',
    country: 'Spain',
    securityWaitAvgMin: 15,
    liquidsStrategyTip: 'Carry-on bags pass through X-Ray detection. Inside the modern Helix cruise hall, filtered drinking fountains and family restrooms are accessible before boarding the ship gangway.',
    gates: ['Gangway Gate 1', 'Gangway Gate 2', 'Suite Concierge Lounge'],
    facilities: [
      { id: 'bcn-cw1', type: 'WATER', name: 'Helix Chilled Water Fountain', locationNear: 'Gate 1 Boarding Queue', xPercent: 36, yPercent: 38, details: 'Chilled filtered water fountain for Mediterranean cruisers.', isColdFiltered: true },
      { id: 'bcn-cr1', type: 'RESTROOM', name: 'Terminal E Restroom Suite', locationNear: 'Main Concourse Center', xPercent: 54, yPercent: 62, details: 'Spacious accessible restrooms with baby changing table.', isAccessible: true, hasBabyChanging: true }
    ]
  },
  'VANCOUVER-PORT': {
    id: 'VANCOUVER-PORT',
    hubMode: 'CRUISE',
    code: 'YVR-PORT',
    name: 'Vancouver Canada Place Cruise Terminal',
    terminalName: 'Canada Place Pier (Alaska Cruise Terminal)',
    city: 'Vancouver, Canada',
    country: 'Canada',
    securityWaitAvgMin: 18,
    liquidsStrategyTip: 'US Customs & Border Protection pre-clearance operates at Canada Place for Alaska cruises. Empty all liquid bottles before US security. Chilled British Columbia mountain tap water dispensers are located in the secure boarding hall.',
    gates: ['North Berth (Gangway 1)', 'West Berth (Gangway 2)', 'East Berth (Gangway 3)'],
    facilities: [
      { id: 'yvr-cw1', type: 'WATER', name: 'BC Mountain Fresh Refill Station', locationNear: 'West Berth Entrance', xPercent: 38, yPercent: 38, details: 'Pure chilled British Columbia tap water dispenser.', isColdFiltered: true },
      { id: 'yvr-cr1', type: 'RESTROOM', name: 'Canada Place Secure Restrooms', locationNear: 'Pre-Boarding Hall Center', xPercent: 55, yPercent: 62, details: 'Full wheelchair accessibility, luggage space, family washrooms.', isAccessible: true, hasBabyChanging: true }
    ]
  }
};

// ============================================================================
// DYNAMIC HUB RESOLVER & GENERATOR FOR WORLDWIDE HUBS
// ============================================================================
export function resolveTerminalHub(
  locationQuery: string,
  mode: HubMode = 'FLIGHT',
  fallbackDefaultId?: string
): TerminalHubData {
  const clean = (locationQuery || '').trim();
  const lower = clean.toLowerCase();

  // 1. Direct key match
  if (CURATED_TERMINAL_DATA[clean]) {
    return CURATED_TERMINAL_DATA[clean];
  }

  // 2. Search curated database by code, city, or name in same mode
  const modeCurated = Object.values(CURATED_TERMINAL_DATA).filter((h) => h.hubMode === mode);
  for (const hub of modeCurated) {
    if (
      hub.code.toLowerCase() === lower ||
      hub.city.toLowerCase().includes(lower) ||
      lower.includes(hub.city.toLowerCase().split(',')[0].toLowerCase()) ||
      lower.includes(hub.code.toLowerCase()) ||
      hub.name.toLowerCase().includes(lower)
    ) {
      return hub;
    }
  }

  // 3. Match against the comprehensive AIRPORTS_DATABASE (for flights)
  if (mode === 'FLIGHT') {
    const airportMatch = AIRPORTS_DATABASE.find(
      (a) =>
        a.code.toLowerCase() === lower ||
        a.city.toLowerCase().includes(lower) ||
        lower.includes(a.city.toLowerCase()) ||
        lower.includes(a.code.toLowerCase())
    );

    if (airportMatch) {
      return generateDynamicAirportHub(airportMatch);
    }
  }

  // 4. Match against the TRANSIT_HUBS_DATABASE (for rail and cruise)
  const transitType = mode === 'RAIL' ? 'TRAIN' : mode === 'CRUISE' ? 'PORT' : 'BUS';
  const transitMatch = TRANSIT_HUBS_DATABASE.find(
    (t) =>
      t.type === transitType &&
      (t.city.toLowerCase().includes(lower) ||
        lower.includes(t.city.toLowerCase()) ||
        (t.code && lower.includes(t.code.toLowerCase())) ||
        t.name.toLowerCase().includes(lower))
  );

  if (transitMatch) {
    return generateDynamicTransitHub(transitMatch, mode);
  }

  // 5. If query contains a recognizable city name, procedurally build an authentic hub
  if (clean.length > 2) {
    return generateProceduralHub(clean, mode);
  }

  // 6. Final fallback
  if (fallbackDefaultId && CURATED_TERMINAL_DATA[fallbackDefaultId]) {
    return CURATED_TERMINAL_DATA[fallbackDefaultId];
  }
  return mode === 'RAIL'
    ? CURATED_TERMINAL_DATA['ST-PANCRAS']
    : mode === 'CRUISE'
    ? CURATED_TERMINAL_DATA['PORT-MIAMI']
    : CURATED_TERMINAL_DATA['JFK-T4'];
}

function generateDynamicAirportHub(airport: AirportCity): TerminalHubData {
  const gates = ['A1', 'A3', 'A5', 'A7', 'B2', 'B4', 'B6', 'B8'];
  return {
    id: `dyn-air-${airport.code}`,
    hubMode: 'FLIGHT',
    code: airport.code,
    name: `${airport.city} ${airport.airportName}`,
    terminalName: `Main International Concourse (Gates A1-B8)`,
    city: `${airport.city}, ${airport.country}`,
    country: airport.country,
    securityWaitAvgMin: 15,
    liquidsStrategyTip: `TSA / ICAO liquids protocol strictly enforces ≤100ml (3.4oz) in carry-ons. Take your empty reusable container through the security checkpoint. Directly post-security in ${airport.code}, multiple chilled purified water bottle refill stations and family restrooms are available.`,
    gates,
    facilities: [
      {
        id: `${airport.code}-w1`,
        type: 'WATER',
        name: `${airport.code} Airside Rapid Refill Station`,
        locationNear: 'Opposite Gate A3',
        xPercent: 32,
        yPercent: 38,
        details: 'Chilled sensor-activated filtered water station with bottle count sensor.',
        isColdFiltered: true
      },
      {
        id: `${airport.code}-w2`,
        type: 'WATER',
        name: 'Central Concourse Hydration Fountain',
        locationNear: 'Near Gate B4 Dining Court',
        xPercent: 68,
        yPercent: 42,
        details: 'Ultra-pure chilled water dispenser for passenger tumblers.',
        isColdFiltered: true
      },
      {
        id: `${airport.code}-r1`,
        type: 'RESTROOM',
        name: 'Central Concourse Restroom Suite',
        locationNear: 'Mid-Concourse across Gate A5',
        xPercent: 48,
        yPercent: 62,
        details: 'Full ADA accessible family restroom, infant changing station, touchless fixtures.',
        isAccessible: true,
        hasBabyChanging: true
      },
      {
        id: `${airport.code}-p1`,
        type: 'POWER',
        name: 'Fast-Charge Power Outlets',
        locationNear: 'Gate A7 Seating Hub',
        xPercent: 60,
        yPercent: 30,
        details: `Standard ${airport.voltage || '120V'} and USB-C 45W charging ports.`
      },
      {
        id: `${airport.code}-f1`,
        type: 'FOOD',
        name: 'Post-Security Market & Café',
        locationNear: 'Near Gate B2',
        xPercent: 42,
        yPercent: 65,
        details: 'Bottled beverages, fresh fruit, artisan sandwiches and snacks.'
      }
    ],
    isCustomGenerated: true
  };
}

function generateDynamicTransitHub(hub: TransitHub, mode: HubMode): TerminalHubData {
  const isRail = mode === 'RAIL';
  const gates = isRail
    ? ['Platform 1', 'Platform 2', 'Platform 3', 'Platform 4', 'Platform 5', 'Platform 6']
    : ['Gangway Bridge 1', 'Gangway Bridge 2', 'Gangway Bridge 3', 'Suite Priority Access'];

  return {
    id: `dyn-trn-${hub.id}`,
    hubMode: mode,
    code: hub.code || hub.city.substring(0, 3).toUpperCase(),
    name: hub.name,
    terminalName: isRail ? 'Departure Concourse & Boarding Platforms' : 'Embarkation Terminal & Gangways',
    city: `${hub.city}, ${hub.country}`,
    country: hub.country,
    securityWaitAvgMin: isRail ? 8 : 14,
    liquidsStrategyTip: isRail
      ? 'Liquid containers and beverages are permitted through station access gates! Free chilled water bottle refill fountains and accessible restrooms are situated along the main platform concourse.'
      : 'Cruise port security screens all luggage for unauthorized electrical appliances or alcohol. Chilled water refill points and modern family restrooms are located in the waiting hall prior to the ship boarding bridge.',
    gates,
    facilities: [
      {
        id: `${hub.id}-w1`,
        type: 'WATER',
        name: `${hub.city} Concourse Water Refill`,
        locationNear: isRail ? 'Near Platform 2 Access' : 'Pre-Boarding Gangway 1',
        xPercent: 35,
        yPercent: 38,
        details: 'Free filtered water dispenser for reusable containers.',
        isColdFiltered: true
      },
      {
        id: `${hub.id}-w2`,
        type: 'WATER',
        name: 'Departure Waiting Hall Water Fountain',
        locationNear: isRail ? 'Platform 4 Escalators' : 'Gangway 2 Queue',
        xPercent: 70,
        yPercent: 42,
        details: 'Chilled drinking water fountain with high-flow bottle spout.',
        isColdFiltered: true
      },
      {
        id: `${hub.id}-r1`,
        type: 'RESTROOM',
        name: 'Main Concourse Restrooms',
        locationNear: 'Passenger Waiting Hall Center',
        xPercent: 52,
        yPercent: 62,
        details: 'Accessible wheelchair access, baby diaper changing, luggage-friendly stalls.',
        isAccessible: true,
        hasBabyChanging: true
      },
      {
        id: `${hub.id}-p1`,
        type: 'POWER',
        name: 'Passenger Work Benches & AC Outlets',
        locationNear: isRail ? 'Platform 3 Waiting Area' : 'Main Seating Lounge',
        xPercent: 58,
        yPercent: 30,
        details: 'Universal power plugs and USB ports.'
      }
    ],
    isCustomGenerated: true
  };
}

function generateProceduralHub(cityOrQuery: string, mode: HubMode): TerminalHubData {
  const titleCity = cityOrQuery
    .split(/[,/]/)[0]
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const code = titleCity.substring(0, 3).toUpperCase();
  const isRail = mode === 'RAIL';
  const isCruise = mode === 'CRUISE';

  const gates = isRail
    ? ['Track 1', 'Track 2', 'Track 3', 'Track 4', 'Track 5', 'Track 6']
    : isCruise
    ? ['Gangway Pier A', 'Gangway Pier B', 'Gangway Pier C', 'VIP Priority Suite']
    : ['Gate 1', 'Gate 3', 'Gate 5', 'Gate 7', 'Gate 9', 'Gate 11'];

  return {
    id: `dyn-proc-${code}`,
    hubMode: mode,
    code,
    name: isRail
      ? `${titleCity} Central Station`
      : isCruise
      ? `${titleCity} Cruise Passenger Terminal`
      : `${titleCity} International Airport`,
    terminalName: isRail
      ? 'Main Rail Concourse (Tracks 1-6)'
      : isCruise
      ? 'Passenger Terminal (Piers A-C)'
      : 'Terminal 1 (Concourse Gates 1-11)',
    city: titleCity,
    country: 'International Destination',
    securityWaitAvgMin: isRail ? 8 : isCruise ? 14 : 16,
    liquidsStrategyTip: isRail
      ? `Boarding at ${titleCity} Central allows liquids on board. Refill points and restrooms are located along the secure platform departure concourse.`
      : isCruise
      ? `Port security at ${titleCity} screens bags at the terminal entrance. Complimentary water dispensers are located along the boarding corridor.`
      : `TSA & international aviation standards enforce the 100ml / 3.4oz limit. Carry empty bottles through security and refill for free at the airside water stations shown.`,
    gates,
    facilities: [
      {
        id: `${code}-w1`,
        type: 'WATER',
        name: `${titleCity} Airside Rapid Bottle Refill`,
        locationNear: isRail ? 'Near Track 2' : isCruise ? 'Gangway Pier A' : 'Opposite Gate 3',
        xPercent: 34,
        yPercent: 38,
        details: 'Touchless chilled filtered water dispenser with bottle sensor counter.',
        isColdFiltered: true
      },
      {
        id: `${code}-w2`,
        type: 'WATER',
        name: 'Concourse Hydration Station',
        locationNear: isRail ? 'Near Track 5' : isCruise ? 'Pier B Boarding' : 'Near Gate 7',
        xPercent: 70,
        yPercent: 42,
        details: 'Free drinking water fountain and sports bottle filling spout.',
        isColdFiltered: true
      },
      {
        id: `${code}-r1`,
        type: 'RESTROOM',
        name: `${titleCity} Terminal Restrooms`,
        locationNear: 'Central Waiting Concourse',
        xPercent: 50,
        yPercent: 62,
        details: 'All-gender ADA accessible restrooms, baby changing table, touchless sinks.',
        isAccessible: true,
        hasBabyChanging: true
      },
      {
        id: `${code}-p1`,
        type: 'POWER',
        name: 'Workstation Power Outlets',
        locationNear: isRail ? 'Track 3 Waiting Bench' : 'Central Waiting Lounge',
        xPercent: 60,
        yPercent: 30,
        details: 'High-speed AC power sockets and USB-C charging.'
      }
    ],
    isCustomGenerated: true
  };
}
