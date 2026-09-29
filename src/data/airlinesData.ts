export interface Airline {
  name: string;
  code: string; // 2-letter IATA code
  country: string;
  flag: string;
  isRegional?: boolean;
}

export const AIRLINES_DATABASE: Airline[] = [
  // Canada & North America
  { name: 'Air Canada', code: 'AC', country: 'Canada', flag: '🇨🇦' },
  { name: 'Porter Airlines', code: 'PD', country: 'Canada (Toronto Island Hub)', flag: '🇨🇦', isRegional: true },
  { name: 'WestJet', code: 'WS', country: 'Canada', flag: '🇨🇦' },
  { name: 'Air Transat', code: 'TS', country: 'Canada', flag: '🇨🇦' },
  { name: 'Flair Airlines', code: 'F8', country: 'Canada', flag: '🇨🇦' },
  { name: 'Sunwing Airlines', code: 'WG', country: 'Canada', flag: '🇨🇦' },
  { name: 'Canadian North', code: '5T', country: 'Canada', flag: '🇨🇦', isRegional: true },
  { name: 'Air North', code: '4N', country: 'Canada (Yukon)', flag: '🇨🇦', isRegional: true },
  { name: 'Pacific Coastal Airlines', code: '8P', country: 'Canada (BC)', flag: '🇨🇦', isRegional: true },
  { name: 'PAL Airlines', code: 'PB', country: 'Canada (Atlantic)', flag: '🇨🇦', isRegional: true },

  // USA Major & Regional
  { name: 'Delta Air Lines', code: 'DL', country: 'United States', flag: '🇺🇸' },
  { name: 'United Airlines', code: 'UA', country: 'United States', flag: '🇺🇸' },
  { name: 'American Airlines', code: 'AA', country: 'United States', flag: '🇺🇸' },
  { name: 'Southwest Airlines', code: 'WN', country: 'United States', flag: '🇺🇸' },
  { name: 'Alaska Airlines', code: 'AS', country: 'United States', flag: '🇺🇸' },
  { name: 'JetBlue Airways', code: 'B6', country: 'United States', flag: '🇺🇸' },
  { name: 'Spirit Airlines', code: 'NK', country: 'United States', flag: '🇺🇸' },
  { name: 'Frontier Airlines', code: 'F9', country: 'United States', flag: '🇺🇸' },
  { name: 'Hawaiian Airlines', code: 'HA', country: 'United States', flag: '🇺🇸' },
  { name: 'Allegiant Air', code: 'G4', country: 'United States', flag: '🇺🇸' },
  { name: 'Sun Country Airlines', code: 'SY', country: 'United States', flag: '🇺🇸' },
  { name: 'Breeze Airways', code: 'MX', country: 'United States', flag: '🇺🇸' },
  { name: 'Avelo Airlines', code: 'XP', country: 'United States', flag: '🇺🇸' },
  { name: 'Silver Airways', code: '3M', country: 'United States (Florida/Caribbean)', flag: '🇺🇸', isRegional: true },
  { name: 'SkyWest Airlines', code: 'OO', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'Republic Airways', code: 'YX', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'Envoy Air', code: 'MQ', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'PSA Airlines', code: 'OH', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'Piedmont Airlines', code: 'PT', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'Mesa Airlines', code: 'YV', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'Horizon Air', code: 'QX', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'Endeavor Air', code: '9E', country: 'United States', flag: '🇺🇸', isRegional: true },
  { name: 'Cape Air', code: '9K', country: 'United States', flag: '🇺🇸', isRegional: true },

  // Mexico, Central & South America
  { name: 'Aeromexico', code: 'AM', country: 'Mexico', flag: '🇲🇽' },
  { name: 'Volaris', code: 'Y4', country: 'Mexico', flag: '🇲🇽' },
  { name: 'VivaAerobus', code: 'VB', country: 'Mexico', flag: '🇲🇽' },
  { name: 'Copa Airlines', code: 'CM', country: 'Panama', flag: '🇵🇦' },
  { name: 'Avianca', code: 'AV', country: 'Colombia', flag: '🇨🇴' },
  { name: 'LATAM Airlines', code: 'LA', country: 'Chile / Brazil', flag: '🇨🇱' },
  { name: 'Gol Transportes Aéreos', code: 'G3', country: 'Brazil', flag: '🇧🇷' },
  { name: 'Azul Brazilian Airlines', code: 'AD', country: 'Brazil', flag: '🇧🇷' },
  { name: 'Aerolineas Argentinas', code: 'AR', country: 'Argentina', flag: '🇦🇷' },
  { name: 'Caribbean Airlines', code: 'BW', country: 'Trinidad and Tobago', flag: '🇹🇹' },

  // United Kingdom & Europe
  { name: 'British Airways', code: 'BA', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Virgin Atlantic', code: 'VS', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'easyJet', code: 'U2', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Ryanair', code: 'FR', country: 'Ireland', flag: '🇮🇪' },
  { name: 'Aer Lingus', code: 'EI', country: 'Ireland', flag: '🇮🇪' },
  { name: 'Lufthansa', code: 'LH', country: 'Germany', flag: '🇩🇪' },
  { name: 'Air France', code: 'AF', country: 'France', flag: '🇫🇷' },
  { name: 'KLM Royal Dutch Airlines', code: 'KL', country: 'Netherlands', flag: '🇳🇱' },
  { name: 'Swiss International Air Lines', code: 'LX', country: 'Switzerland', flag: '🇨🇭' },
  { name: 'Austrian Airlines', code: 'OS', country: 'Austria', flag: '🇦🇹' },
  { name: 'Iberia', code: 'IB', country: 'Spain', flag: '🇪🇸' },
  { name: 'Vueling Airlines', code: 'VY', country: 'Spain', flag: '🇪🇸' },
  { name: 'Air Europa', code: 'UX', country: 'Spain', flag: '🇪🇸' },
  { name: 'TAP Air Portugal', code: 'TP', country: 'Portugal', flag: '🇵🇹' },
  { name: 'ITA Airways', code: 'AZ', country: 'Italy', flag: '🇮🇹' },
  { name: 'SAS Scandinavian Airlines', code: 'SK', country: 'Sweden / Denmark / Norway', flag: '🇸🇪' },
  { name: 'Norwegian Air Shuttle', code: 'DY', country: 'Norway', flag: '🇳🇴' },
  { name: 'Finnair', code: 'AY', country: 'Finland', flag: '🇫🇮' },
  { name: 'Icelandair', code: 'FI', country: 'Iceland', flag: '🇮🇸' },
  { name: 'PLAY', code: 'OG', country: 'Iceland', flag: '🇮🇸' },
  { name: 'Brussels Airlines', code: 'SN', country: 'Belgium', flag: '🇧🇪' },
  { name: 'LOT Polish Airlines', code: 'LO', country: 'Poland', flag: '🇵🇱' },
  { name: 'Wizz Air', code: 'W6', country: 'Hungary', flag: '🇭🇺' },
  { name: 'Transavia', code: 'HV', country: 'Netherlands / France', flag: '🇳🇱' },
  { name: 'Eurowings', code: 'EW', country: 'Germany', flag: '🇩🇪' },
  { name: 'Condor', code: 'DE', country: 'Germany', flag: '🇩🇪' },
  { name: 'Air Baltic', code: 'BT', country: 'Latvia', flag: '🇱🇻' },
  { name: 'Aegean Airlines', code: 'A3', country: 'Greece', flag: '🇬🇷' },

  // Middle East & Africa
  { name: 'Emirates', code: 'EK', country: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Qatar Airways', code: 'QR', country: 'Qatar', flag: '🇶🇦' },
  { name: 'Etihad Airways', code: 'EY', country: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Turkish Airlines', code: 'TK', country: 'Turkey', flag: '🇹🇷' },
  { name: 'flydubai', code: 'FZ', country: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Saudia', code: 'SV', country: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Gulf Air', code: 'GF', country: 'Bahrain', flag: '🇧🇭' },
  { name: 'Oman Air', code: 'WY', country: 'Oman', flag: '🇴🇲' },
  { name: 'Royal Jordanian', code: 'RJ', country: 'Jordan', flag: '🇯🇴' },
  { name: 'El Al Israel Airlines', code: 'LY', country: 'Israel', flag: '🇮🇱' },
  { name: 'EgyptAir', code: 'MS', country: 'Egypt', flag: '🇪🇬' },
  { name: 'Ethiopian Airlines', code: 'ET', country: 'Ethiopia', flag: '🇪🇹' },
  { name: 'Royal Air Maroc', code: 'AT', country: 'Morocco', flag: '🇲🇦' },
  { name: 'Kenya Airways', code: 'KQ', country: 'Kenya', flag: '🇰🇪' },
  { name: 'South African Airways', code: 'SA', country: 'South Africa', flag: '🇿🇦' },

  // Asia & Pacific
  { name: 'Singapore Airlines', code: 'SQ', country: 'Singapore', flag: '🇸🇬' },
  { name: 'ANA All Nippon Airways', code: 'NH', country: 'Japan', flag: '🇯🇵' },
  { name: 'Japan Airlines', code: 'JL', country: 'Japan', flag: '🇯🇵' },
  { name: 'Cathay Pacific', code: 'CX', country: 'Hong Kong', flag: '🇭🇰' },
  { name: 'Korean Air', code: 'KE', country: 'South Korea', flag: '🇰🇷' },
  { name: 'Asiana Airlines', code: 'OZ', country: 'South Korea', flag: '🇰🇷' },
  { name: 'EVA Air', code: 'BR', country: 'Taiwan', flag: '🇹🇼' },
  { name: 'China Airlines', code: 'CI', country: 'Taiwan', flag: '🇹🇼' },
  { name: 'Qantas', code: 'QF', country: 'Australia', flag: '🇦🇺' },
  { name: 'Virgin Australia', code: 'VA', country: 'Australia', flag: '🇦🇺' },
  { name: 'Jetstar', code: 'JQ', country: 'Australia', flag: '🇦🇺' },
  { name: 'Air New Zealand', code: 'NZ', country: 'New Zealand', flag: '🇳🇿' },
  { name: 'Fiji Airways', code: 'FJ', country: 'Fiji', flag: '🇫🇯' },
  { name: 'Thai Airways', code: 'TG', country: 'Thailand', flag: '🇹🇭' },
  { name: 'Vietnam Airlines', code: 'VN', country: 'Vietnam', flag: '🇻🇳' },
  { name: 'Philippine Airlines', code: 'PR', country: 'Philippines', flag: '🇵🇭' },
  { name: 'Malaysia Airlines', code: 'MH', country: 'Malaysia', flag: '🇲🇾' },
  { name: 'AirAsia', code: 'AK', country: 'Malaysia', flag: '🇲🇾' },
  { name: 'Garuda Indonesia', code: 'GA', country: 'Indonesia', flag: '🇮🇩' },
  { name: 'Air India', code: 'AI', country: 'India', flag: '🇮🇳' },
  { name: 'IndiGo', code: '6E', country: 'India', flag: '🇮🇳' },
  { name: 'Scoot', code: 'TR', country: 'Singapore', flag: '🇸🇬' }
];

export const TRAIN_OPERATORS = [
  'Amtrak (USA)',
  'VIA Rail (Canada)',
  'Eurostar (UK / France / Belgium / Netherlands)',
  'Brightline (Florida)',
  'Deutsche Bahn (ICE - Germany)',
  'SNCF (TGV - France)',
  'Renfe (AVE - Spain)',
  'Trenitalia (Frecciarossa - Italy)',
  'SBB (Swiss Federal Railways)',
  'Shinkansen (Bullet Train - Japan)',
  'ÖBB (Nightjet / Railjet - Austria)',
  'Rocky Mountaineer (Canada)',
  'GO Transit (Ontario, Canada)'
];

export const CRUISE_LINES = [
  'Royal Caribbean International',
  'Carnival Cruise Line',
  'Norwegian Cruise Line (NCL)',
  'Disney Cruise Line',
  'Celebrity Cruises',
  'Princess Cruises',
  'Holland America Line',
  'MSC Cruises',
  'Virgin Voyages',
  'Viking Ocean & River Cruises',
  'Cunard Line',
  'Silversea Cruises',
  'BC Ferries (Canada)',
  'Washington State Ferries (USA)'
];

export const BUS_OPERATORS = [
  'Greyhound Lines',
  'FlixBus (North America & Europe)',
  'Megabus',
  'Peter Pan Bus Lines',
  'Ontario Northland (Canada)',
  'GO Transit Bus (Canada)',
  'Red Arrow / Rider Express (Western Canada)',
  'BlaBlaCar Bus (Europe)',
  'National Express (UK)',
  'Trailways'
];

export const CAR_VEHICLES = [
  'Personal Car / SUV',
  'Rental Car (Hertz, Enterprise, Avis)',
  'Toyota RAV4 / Highlander (SUV)',
  'Subaru Outback / Forester',
  'Tesla Model Y / Model 3',
  'Chevy Suburban / Tahoe (Large SUV)',
  'Honda CR-V / Pilot',
  'Ford Explorer / F-150',
  'Jeep Grand Cherokee / Wrangler',
  'Compact Sedan (Civic / Corolla)',
  'Minivan (Chrysler Pacifica / Sienna)',
  'RV / Campervan',
  'Convertible / Sports Car'
];
