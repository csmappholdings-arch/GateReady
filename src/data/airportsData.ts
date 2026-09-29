export interface AirportCity {
  code: string; // IATA code, e.g. JFK, LHR, HND
  city: string; // e.g. New York, London, Tokyo
  airportName: string; // e.g. John F. Kennedy International Airport
  country: string; // e.g. United States, United Kingdom, Japan
  countryCode: string; // 2-letter ISO, e.g. US, GB, JP
  flag: string; // Emoji flag, e.g. 🇺🇸, 🇬🇧, 🇯🇵
  plugType?: string;
  voltage?: string;
  currency?: string;
}

export const AIRPORTS_DATABASE: AirportCity[] = [
  // North America - USA
  { code: 'JFK', city: 'New York', airportName: 'John F. Kennedy Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'EWR', city: 'Newark / New York', airportName: 'Newark Liberty Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'LGA', city: 'New York', airportName: 'LaGuardia Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'LAX', city: 'Los Angeles', airportName: 'Los Angeles Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ORD', city: 'Chicago', airportName: "O'Hare Intl", country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MDW', city: 'Chicago', airportName: 'Chicago Midway Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MIA', city: 'Miami', airportName: 'Miami Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'FLL', city: 'Fort Lauderdale', airportName: 'Fort Lauderdale-Hollywood Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MCO', city: 'Orlando', airportName: 'Orlando Intl (Disney / Universal)', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'TPA', city: 'Tampa', airportName: 'Tampa Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SFO', city: 'San Francisco', airportName: 'San Francisco Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'OAK', city: 'Oakland', airportName: 'Oakland Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SJC', city: 'San Jose', airportName: 'San José Mineta Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SEA', city: 'Seattle', airportName: 'Seattle-Tacoma Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BOS', city: 'Boston', airportName: 'Logan Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'DFW', city: 'Dallas / Fort Worth', airportName: 'Dallas/Fort Worth Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'DAL', city: 'Dallas', airportName: 'Dallas Love Field', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'DEN', city: 'Denver', airportName: 'Denver Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ATL', city: 'Atlanta', airportName: 'Hartsfield-Jackson Atlanta Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'IAH', city: 'Houston', airportName: 'George Bush Intercontinental', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'HOU', city: 'Houston', airportName: 'William P. Hobby Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PHX', city: 'Phoenix', airportName: 'Phoenix Sky Harbor Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'LAS', city: 'Las Vegas', airportName: 'Harry Reid Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'HNL', city: 'Honolulu / Oahu', airportName: 'Daniel K. Inouye Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'OGG', city: 'Kahului / Maui', airportName: 'Kahului Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'KOA', city: 'Kona / Big Island', airportName: 'Ellison Onizuka Kona Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SAN', city: 'San Diego', airportName: 'San Diego Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MSP', city: 'Minneapolis / St. Paul', airportName: 'Minneapolis-Saint Paul Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'DTW', city: 'Detroit', airportName: 'Detroit Metro Wayne County', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PHL', city: 'Philadelphia', airportName: 'Philadelphia Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'CLT', city: 'Charlotte', airportName: 'Charlotte Douglas Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'IAD', city: 'Washington D.C.', airportName: 'Washington Dulles Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'DCA', city: 'Washington D.C.', airportName: 'Ronald Reagan Washington Natl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BWI', city: 'Baltimore / Washington', airportName: 'Baltimore/Washington Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SLC', city: 'Salt Lake City', airportName: 'Salt Lake City Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PDX', city: 'Portland', airportName: 'Portland Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BNA', city: 'Nashville', airportName: 'Nashville Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'AUS', city: 'Austin', airportName: 'Austin-Bergstrom Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MSY', city: 'New Orleans', airportName: 'Louis Armstrong New Orleans Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'RDU', city: 'Raleigh / Durham', airportName: 'Raleigh-Durham Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SMF', city: 'Sacramento', airportName: 'Sacramento Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SAT', city: 'San Antonio', airportName: 'San Antonio Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'IND', city: 'Indianapolis', airportName: 'Indianapolis Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'CLE', city: 'Cleveland', airportName: 'Cleveland Hopkins Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PIT', city: 'Pittsburgh', airportName: 'Pittsburgh Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'STL', city: 'St. Louis', airportName: 'St. Louis Lambert Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MCI', city: 'Kansas City', airportName: 'Kansas City Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ANC', city: 'Anchorage', airportName: 'Ted Stevens Anchorage Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SJU', city: 'San Juan', airportName: 'Luis Muñoz Marín Intl', country: 'Puerto Rico (USA)', countryCode: 'PR', flag: '🇵🇷', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },

  // USA - Key Regional & Secondary Hubs
  { code: 'BUR', city: 'Burbank / Los Angeles', airportName: 'Hollywood Burbank Airport (Bob Hope)', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SNA', city: 'Santa Ana / Orange County', airportName: 'John Wayne Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ONT', city: 'Ontario / Greater Los Angeles', airportName: 'Ontario Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'LGB', city: 'Long Beach', airportName: 'Long Beach Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PSP', city: 'Palm Springs', airportName: 'Palm Springs Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'HPN', city: 'White Plains / New York Suburbs', airportName: 'Westchester County Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ISP', city: 'Islip / Long Island', airportName: 'Long Island MacArthur Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SWF', city: 'Newburgh / New York', airportName: 'New York Stewart Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BDL', city: 'Hartford / Springfield', airportName: 'Bradley Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PVD', city: 'Providence', airportName: 'Rhode Island T.F. Green Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MHT', city: 'Manchester', airportName: 'Manchester-Boston Regional Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PWM', city: 'Portland (Maine)', airportName: 'Portland Intl Jetport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BTV', city: 'Burlington', airportName: 'Patrick Leahy Burlington Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BUF', city: 'Buffalo', airportName: 'Buffalo Niagara Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ROC', city: 'Rochester', airportName: 'Frederick Douglass Greater Rochester Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SYR', city: 'Syracuse', airportName: 'Syracuse Hancock Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ALB', city: 'Albany', airportName: 'Albany Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'PBI', city: 'West Palm Beach', airportName: 'Palm Beach Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'RSW', city: 'Fort Myers', airportName: 'Southwest Florida Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SRQ', city: 'Sarasota', airportName: 'Sarasota Bradenton Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'JAX', city: 'Jacksonville', airportName: 'Jacksonville Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'CHS', city: 'Charleston', airportName: 'Charleston Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SAV', city: 'Savannah', airportName: 'Savannah/Hilton Head Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MYR', city: 'Myrtle Beach', airportName: 'Myrtle Beach Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'RIC', city: 'Richmond', airportName: 'Richmond Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ORF', city: 'Norfolk / Virginia Beach', airportName: 'Norfolk Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MKE', city: 'Milwaukee', airportName: 'Milwaukee Mitchell Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MSN', city: 'Madison', airportName: 'Dane County Regional Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'GRR', city: 'Grand Rapids', airportName: 'Gerald R. Ford Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'CMH', city: 'Columbus', airportName: 'John Glenn Columbus Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'CVG', city: 'Cincinnati', airportName: 'Cincinnati/Northern Kentucky Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'SDF', city: 'Louisville', airportName: 'Louisville Muhammad Ali Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'MEM', city: 'Memphis', airportName: 'Memphis Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'TYS', city: 'Knoxville / Great Smoky Mtns', airportName: 'McGhee Tyson Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BHM', city: 'Birmingham', airportName: 'Birmingham-Shuttlesworth Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ABQ', city: 'Albuquerque', airportName: 'Albuquerque Intl Sunport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'TUS', city: 'Tucson', airportName: 'Tucson Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'RNO', city: 'Reno / Lake Tahoe', airportName: 'Reno-Tahoe Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BOI', city: 'Boise', airportName: 'Boise Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'GEG', city: 'Spokane', airportName: 'Spokane Intl Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'BZN', city: 'Bozeman / Big Sky / Yellowstone', airportName: 'Bozeman Yellowstone Intl', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'JAC', city: 'Jackson Hole / Grand Teton', airportName: 'Jackson Hole Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'ASE', city: 'Aspen / Snowmass', airportName: 'Aspen/Pitkin County Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'EGE', city: 'Vail / Beaver Creek', airportName: 'Eagle County Regional Airport', country: 'United States', countryCode: 'US', flag: '🇺🇸', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },

  // Canada - Major & Regional
  { code: 'YYZ', city: 'Toronto', airportName: 'Toronto Pearson Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YTZ', city: 'Toronto', airportName: 'Billy Bishop Toronto City Airport (Toronto Island)', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YHM', city: 'Hamilton / Toronto West', airportName: 'John C. Munro Hamilton Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YKF', city: 'Kitchener / Waterloo', airportName: 'Region of Waterloo Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YXU', city: 'London (Ontario)', airportName: 'London International Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YVR', city: 'Vancouver', airportName: 'Vancouver Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YYJ', city: 'Victoria', airportName: 'Victoria Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YLW', city: 'Kelowna / Okanagan', airportName: 'Kelowna Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YCD', city: 'Nanaimo', airportName: 'Nanaimo Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YUL', city: 'Montreal', airportName: 'Montréal-Trudeau Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YQB', city: 'Quebec City', airportName: 'Québec Jean Lesage Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YYC', city: 'Calgary', airportName: 'Calgary Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YEG', city: 'Edmonton', airportName: 'Edmonton Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YOW', city: 'Ottawa', airportName: 'Ottawa Macdonald-Cartier Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YWG', city: 'Winnipeg', airportName: 'Winnipeg Richardson Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YXE', city: 'Saskatoon', airportName: 'Saskatoon John G. Diefenbaker Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YQR', city: 'Regina', airportName: 'Regina Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YHZ', city: 'Halifax', airportName: 'Halifax Stanfield Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YYT', city: "St. John's", airportName: "St. John's Intl Airport", country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YQM', city: 'Moncton', airportName: 'Greater Moncton Roméo LeBlanc Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YFC', city: 'Fredericton', airportName: 'Fredericton Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YYG', city: 'Charlottetown', airportName: 'Charlottetown Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YQT', city: 'Thunder Bay', airportName: 'Thunder Bay Intl Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YXY', city: 'Whitehorse', airportName: 'Erik Nielsen Whitehorse Intl', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },
  { code: 'YZF', city: 'Yellowknife', airportName: 'Yellowknife Airport', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', plugType: 'Type A & B', voltage: '120V', currency: 'CAD ($)' },

  // United Kingdom & Ireland
  { code: 'LHR', city: 'London', airportName: 'Heathrow Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'LGW', city: 'London', airportName: 'Gatwick Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'STN', city: 'London', airportName: 'Stansted Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'LCY', city: 'London', airportName: 'London City Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'MAN', city: 'Manchester', airportName: 'Manchester Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'EDI', city: 'Edinburgh', airportName: 'Edinburgh Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'GLA', city: 'Glasgow', airportName: 'Glasgow Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'BFS', city: 'Belfast', airportName: 'Belfast Intl Airport', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', plugType: 'Type G', voltage: '230V', currency: 'GBP (£)' },
  { code: 'DUB', city: 'Dublin', airportName: 'Dublin Airport', country: 'Ireland', countryCode: 'IE', flag: '🇮🇪', plugType: 'Type G', voltage: '230V', currency: 'EUR (€)' },
  { code: 'SNN', city: 'Shannon', airportName: 'Shannon Airport', country: 'Ireland', countryCode: 'IE', flag: '🇮🇪', plugType: 'Type G', voltage: '230V', currency: 'EUR (€)' },

  // Western & Southern Europe
  { code: 'CDG', city: 'Paris', airportName: 'Charles de Gaulle Airport', country: 'France', countryCode: 'FR', flag: '🇫🇷', plugType: 'Type C & E', voltage: '230V', currency: 'EUR (€)' },
  { code: 'ORY', city: 'Paris', airportName: 'Orly Airport', country: 'France', countryCode: 'FR', flag: '🇫🇷', plugType: 'Type C & E', voltage: '230V', currency: 'EUR (€)' },
  { code: 'NCE', city: 'Nice / French Riviera', airportName: 'Nice Côte d’Azur', country: 'France', countryCode: 'FR', flag: '🇫🇷', plugType: 'Type C & E', voltage: '230V', currency: 'EUR (€)' },
  { code: 'LYS', city: 'Lyon', airportName: 'Lyon-Saint Exupéry Airport', country: 'France', countryCode: 'FR', flag: '🇫🇷', plugType: 'Type C & E', voltage: '230V', currency: 'EUR (€)' },
  { code: 'AMS', city: 'Amsterdam', airportName: 'Amsterdam Airport Schiphol', country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'BRU', city: 'Brussels', airportName: 'Brussels Airport', country: 'Belgium', countryCode: 'BE', flag: '🇧🇪', plugType: 'Type C & E', voltage: '230V', currency: 'EUR (€)' },
  { code: 'FRA', city: 'Frankfurt', airportName: 'Frankfurt Airport', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'MUC', city: 'Munich', airportName: 'Munich Airport', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'BER', city: 'Berlin', airportName: 'Berlin Brandenburg', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'HAM', city: 'Hamburg', airportName: 'Hamburg Airport', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'FCO', city: 'Rome', airportName: 'Leonardo da Vinci–Fiumicino', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', plugType: 'Type C, F & L', voltage: '230V', currency: 'EUR (€)' },
  { code: 'CIA', city: 'Rome', airportName: 'Ciampino Airport', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', plugType: 'Type C, F & L', voltage: '230V', currency: 'EUR (€)' },
  { code: 'MXP', city: 'Milan', airportName: 'Milan Malpensa Airport', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', plugType: 'Type C, F & L', voltage: '230V', currency: 'EUR (€)' },
  { code: 'LIN', city: 'Milan', airportName: 'Linate Airport', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', plugType: 'Type C, F & L', voltage: '230V', currency: 'EUR (€)' },
  { code: 'VCE', city: 'Venice', airportName: 'Venice Marco Polo', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', plugType: 'Type C, F & L', voltage: '230V', currency: 'EUR (€)' },
  { code: 'FLR', city: 'Florence', airportName: 'Florence Peretola Airport', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', plugType: 'Type C, F & L', voltage: '230V', currency: 'EUR (€)' },
  { code: 'NAP', city: 'Naples / Amalfi', airportName: 'Naples International Airport', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', plugType: 'Type C, F & L', voltage: '230V', currency: 'EUR (€)' },
  { code: 'MAD', city: 'Madrid', airportName: 'Adolfo Suárez Madrid–Barajas', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'BCN', city: 'Barcelona', airportName: 'Josep Tarradellas Barcelona-El Prat', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'PMI', city: 'Palma de Mallorca', airportName: 'Palma de Mallorca Airport', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'IBZ', city: 'Ibiza', airportName: 'Ibiza Airport', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'AGP', city: 'Málaga / Costa del Sol', airportName: 'Málaga-Costa del Sol Airport', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'SVQ', city: 'Seville', airportName: 'Seville Airport', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'LIS', city: 'Lisbon', airportName: 'Humberto Delgado Airport', country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'OPO', city: 'Porto', airportName: 'Francisco Sá Carneiro Airport', country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'FAO', city: 'Faro / Algarve', airportName: 'Faro Airport', country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'ZRH', city: 'Zurich', airportName: 'Zurich Airport', country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', plugType: 'Type J & C', voltage: '230V', currency: 'CHF (Fr)' },
  { code: 'GVA', city: 'Geneva', airportName: 'Geneva Airport', country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', plugType: 'Type J & C', voltage: '230V', currency: 'CHF (Fr)' },
  { code: 'VIE', city: 'Vienna', airportName: 'Vienna Intl Airport', country: 'Austria', countryCode: 'AT', flag: '🇦🇹', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'ATH', city: 'Athens', airportName: 'Athens Intl Airport', country: 'Greece', countryCode: 'GR', flag: '🇬🇷', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'JTR', city: 'Santorini', airportName: 'Santorini National Airport', country: 'Greece', countryCode: 'GR', flag: '🇬🇷', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'JMK', city: 'Mykonos', airportName: 'Mykonos Airport', country: 'Greece', countryCode: 'GR', flag: '🇬🇷', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'HER', city: 'Crete / Heraklion', airportName: 'Heraklion Intl Airport', country: 'Greece', countryCode: 'GR', flag: '🇬🇷', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'CPH', city: 'Copenhagen', airportName: 'Copenhagen Airport', country: 'Denmark', countryCode: 'DK', flag: '🇩🇰', plugType: 'Type C, E, F & K', voltage: '230V', currency: 'DKK (kr)' },
  { code: 'ARN', city: 'Stockholm', airportName: 'Stockholm Arlanda Airport', country: 'Sweden', countryCode: 'SE', flag: '🇸🇪', plugType: 'Type C & F', voltage: '230V', currency: 'SEK (kr)' },
  { code: 'OSL', city: 'Oslo', airportName: 'Oslo Airport Gardermoen', country: 'Norway', countryCode: 'NO', flag: '🇳🇴', plugType: 'Type C & F', voltage: '230V', currency: 'NOK (kr)' },
  { code: 'HEL', city: 'Helsinki', airportName: 'Helsinki-Vantaa Airport', country: 'Finland', countryCode: 'FI', flag: '🇫🇮', plugType: 'Type C & F', voltage: '230V', currency: 'EUR (€)' },
  { code: 'KEF', city: 'Reykjavik', airportName: 'Keflavík Intl Airport', country: 'Iceland', countryCode: 'IS', flag: '🇮🇸', plugType: 'Type C & F', voltage: '230V', currency: 'ISK (kr)' },
  { code: 'PRG', city: 'Prague', airportName: 'Václav Havel Airport Prague', country: 'Czech Republic', countryCode: 'CZ', flag: '🇨🇿', plugType: 'Type C & E', voltage: '230V', currency: 'CZK (Kč)' },
  { code: 'BUD', city: 'Budapest', airportName: 'Budapest Ferenc Liszt Intl', country: 'Hungary', countryCode: 'HU', flag: '🇭🇺', plugType: 'Type C & F', voltage: '230V', currency: 'HUF (Ft)' },
  { code: 'WAW', city: 'Warsaw', airportName: 'Warsaw Chopin Airport', country: 'Poland', countryCode: 'PL', flag: '🇵🇱', plugType: 'Type C & E', voltage: '230V', currency: 'PLN (zł)' },
  { code: 'KRK', city: 'Krakow', airportName: 'Kraków John Paul II Intl', country: 'Poland', countryCode: 'PL', flag: '🇵🇱', plugType: 'Type C & E', voltage: '230V', currency: 'PLN (zł)' },
  { code: 'IST', city: 'Istanbul', airportName: 'Istanbul Airport', country: 'Turkey', countryCode: 'TR', flag: '🇹🇷', plugType: 'Type C & F', voltage: '230V', currency: 'TRY (₺)' },
  { code: 'SAW', city: 'Istanbul', airportName: 'Sabiha Gökçen Intl', country: 'Turkey', countryCode: 'TR', flag: '🇹🇷', plugType: 'Type C & F', voltage: '230V', currency: 'TRY (₺)' },

  // Asia - East & Southeast
  { code: 'HND', city: 'Tokyo', airportName: 'Tokyo Haneda Airport', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', plugType: 'Type A & B', voltage: '100V', currency: 'JPY (¥)' },
  { code: 'NRT', city: 'Tokyo', airportName: 'Narita Intl Airport', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', plugType: 'Type A & B', voltage: '100V', currency: 'JPY (¥)' },
  { code: 'KIX', city: 'Osaka / Kyoto', airportName: 'Kansai Intl Airport', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', plugType: 'Type A & B', voltage: '100V', currency: 'JPY (¥)' },
  { code: 'ITM', city: 'Osaka', airportName: 'Osaka International (Itami)', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', plugType: 'Type A & B', voltage: '100V', currency: 'JPY (¥)' },
  { code: 'CTS', city: 'Sapporo / Hokkaido', airportName: 'New Chitose Airport', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', plugType: 'Type A & B', voltage: '100V', currency: 'JPY (¥)' },
  { code: 'FUK', city: 'Fukuoka', airportName: 'Fukuoka Airport', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', plugType: 'Type A & B', voltage: '100V', currency: 'JPY (¥)' },
  { code: 'ICN', city: 'Seoul', airportName: 'Incheon Intl Airport', country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', plugType: 'Type C & F', voltage: '220V', currency: 'KRW (₩)' },
  { code: 'GMP', city: 'Seoul', airportName: 'Gimpo Intl Airport', country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', plugType: 'Type C & F', voltage: '220V', currency: 'KRW (₩)' },
  { code: 'PUS', city: 'Busan', airportName: 'Gimhae Intl Airport', country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', plugType: 'Type C & F', voltage: '220V', currency: 'KRW (₩)' },
  { code: 'TPE', city: 'Taipei', airportName: 'Taiwan Taoyuan Intl', country: 'Taiwan', countryCode: 'TW', flag: '🇹🇼', plugType: 'Type A & B', voltage: '110V', currency: 'TWD (NT$)' },
  { code: 'HKG', city: 'Hong Kong', airportName: 'Hong Kong Intl Airport', country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰', plugType: 'Type G', voltage: '220V', currency: 'HKD (HK$)' },
  { code: 'SIN', city: 'Singapore', airportName: 'Singapore Changi Airport', country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', plugType: 'Type G', voltage: '230V', currency: 'SGD (S$)' },
  { code: 'BKK', city: 'Bangkok', airportName: 'Suvarnabhumi Airport', country: 'Thailand', countryCode: 'TH', flag: '🇹🇭', plugType: 'Type A, B & C', voltage: '220V', currency: 'THB (฿)' },
  { code: 'DMK', city: 'Bangkok', airportName: 'Don Mueang Intl', country: 'Thailand', countryCode: 'TH', flag: '🇹🇭', plugType: 'Type A, B & C', voltage: '220V', currency: 'THB (฿)' },
  { code: 'HKT', city: 'Phuket', airportName: 'Phuket Intl Airport', country: 'Thailand', countryCode: 'TH', flag: '🇹🇭', plugType: 'Type A, B & C', voltage: '220V', currency: 'THB (฿)' },
  { code: 'CNX', city: 'Chiang Mai', airportName: 'Chiang Mai Intl Airport', country: 'Thailand', countryCode: 'TH', flag: '🇹🇭', plugType: 'Type A, B & C', voltage: '220V', currency: 'THB (฿)' },
  { code: 'DPS', city: 'Bali / Denpasar', airportName: 'Ngurah Rai Intl Airport', country: 'Indonesia', countryCode: 'ID', flag: '🇮🇩', plugType: 'Type C & F', voltage: '230V', currency: 'IDR (Rp)' },
  { code: 'CGK', city: 'Jakarta', airportName: 'Soekarno-Hatta Intl', country: 'Indonesia', countryCode: 'ID', flag: '🇮🇩', plugType: 'Type C & F', voltage: '230V', currency: 'IDR (Rp)' },
  { code: 'KUL', city: 'Kuala Lumpur', airportName: 'Kuala Lumpur Intl (KLIA)', country: 'Malaysia', countryCode: 'MY', flag: '🇲🇾', plugType: 'Type G', voltage: '240V', currency: 'MYR (RM)' },
  { code: 'MNL', city: 'Manila', airportName: 'Ninoy Aquino Intl', country: 'Philippines', countryCode: 'PH', flag: '🇵🇭', plugType: 'Type A, B & C', voltage: '220V', currency: 'PHP (₱)' },
  { code: 'CEB', city: 'Cebu', airportName: 'Mactan-Cebu Intl', country: 'Philippines', countryCode: 'PH', flag: '🇵🇭', plugType: 'Type A, B & C', voltage: '220V', currency: 'PHP (₱)' },
  { code: 'SGN', city: 'Ho Chi Minh City', airportName: 'Tan Son Nhat Intl', country: 'Vietnam', countryCode: 'VN', flag: '🇻🇳', plugType: 'Type A & C', voltage: '220V', currency: 'VND (₫)' },
  { code: 'HAN', city: 'Hanoi', airportName: 'Noi Bai Intl Airport', country: 'Vietnam', countryCode: 'VN', flag: '🇻🇳', plugType: 'Type A & C', voltage: '220V', currency: 'VND (₫)' },
  { code: 'DAD', city: 'Da Nang', airportName: 'Da Nang Intl Airport', country: 'Vietnam', countryCode: 'VN', flag: '🇻🇳', plugType: 'Type A & C', voltage: '220V', currency: 'VND (₫)' },
  { code: 'DEL', city: 'New Delhi', airportName: 'Indira Gandhi Intl', country: 'India', countryCode: 'IN', flag: '🇮🇳', plugType: 'Type C, D & M', voltage: '230V', currency: 'INR (₹)' },
  { code: 'BOM', city: 'Mumbai', airportName: 'Chhatrapati Shivaji Maharaj Intl', country: 'India', countryCode: 'IN', flag: '🇮🇳', plugType: 'Type C, D & M', voltage: '230V', currency: 'INR (₹)' },

  // Middle East
  { code: 'DXB', city: 'Dubai', airportName: 'Dubai Intl Airport', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', plugType: 'Type G', voltage: '230V', currency: 'AED (AED)' },
  { code: 'DOH', city: 'Doha', airportName: 'Hamad Intl Airport', country: 'Qatar', countryCode: 'QA', flag: '🇶🇦', plugType: 'Type G & D', voltage: '240V', currency: 'QAR (QR)' },
  { code: 'AUH', city: 'Abu Dhabi', airportName: 'Zayed Intl Airport', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', plugType: 'Type G', voltage: '230V', currency: 'AED (AED)' },
  { code: 'TLV', city: 'Tel Aviv', airportName: 'Ben Gurion Airport', country: 'Israel', countryCode: 'IL', flag: '🇮🇱', plugType: 'Type C & H', voltage: '230V', currency: 'ILS (₪)' },
  { code: 'RUH', city: 'Riyadh', airportName: 'King Khalid Intl', country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦', plugType: 'Type G', voltage: '230V', currency: 'SAR (SR)' },

  // Oceania
  { code: 'SYD', city: 'Sydney', airportName: 'Sydney Kingsford Smith', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', plugType: 'Type I', voltage: '230V', currency: 'AUD (A$)' },
  { code: 'MEL', city: 'Melbourne', airportName: 'Melbourne Tullamarine', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', plugType: 'Type I', voltage: '230V', currency: 'AUD (A$)' },
  { code: 'BNE', city: 'Brisbane', airportName: 'Brisbane Airport', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', plugType: 'Type I', voltage: '230V', currency: 'AUD (A$)' },
  { code: 'PER', city: 'Perth', airportName: 'Perth Airport', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', plugType: 'Type I', voltage: '230V', currency: 'AUD (A$)' },
  { code: 'AKL', city: 'Auckland', airportName: 'Auckland Airport', country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿', plugType: 'Type I', voltage: '230V', currency: 'NZD (NZ$)' },
  { code: 'CHC', city: 'Christchurch', airportName: 'Christchurch Intl', country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿', plugType: 'Type I', voltage: '230V', currency: 'NZD (NZ$)' },
  { code: 'NAN', city: 'Fiji / Nadi', airportName: 'Nadi Intl Airport', country: 'Fiji', countryCode: 'FJ', flag: '🇫🇯', plugType: 'Type I', voltage: '240V', currency: 'FJD (FJ$)' },

  // Latin America & Caribbean
  { code: 'CUN', city: 'Cancún', airportName: 'Cancún Intl Airport', country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', plugType: 'Type A & B', voltage: '127V', currency: 'MXN ($)' },
  { code: 'MEX', city: 'Mexico City', airportName: 'Benito Juárez Intl', country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', plugType: 'Type A & B', voltage: '127V', currency: 'MXN ($)' },
  { code: 'GDL', city: 'Guadalajara', airportName: 'Miguel Hidalgo y Costilla Intl', country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', plugType: 'Type A & B', voltage: '127V', currency: 'MXN ($)' },
  { code: 'PVR', city: 'Puerto Vallarta', airportName: 'Licenciado Gustavo Díaz Ordaz', country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', plugType: 'Type A & B', voltage: '127V', currency: 'MXN ($)' },
  { code: 'SJD', city: 'Los Cabos / Cabo', airportName: 'Los Cabos Intl Airport', country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', plugType: 'Type A & B', voltage: '127V', currency: 'MXN ($)' },
  { code: 'PUJ', city: 'Punta Cana', airportName: 'Punta Cana Intl Airport', country: 'Dominican Republic', countryCode: 'DO', flag: '🇩🇴', plugType: 'Type A & B', voltage: '110V', currency: 'DOP ($)' },
  { code: 'MBJ', city: 'Montego Bay', airportName: 'Sangster Intl Airport', country: 'Jamaica', countryCode: 'JM', flag: '🇯🇲', plugType: 'Type A & B', voltage: '110V', currency: 'JMD ($)' },
  { code: 'NAS', city: 'Nassau', airportName: 'Lynden Pindling Intl', country: 'Bahamas', countryCode: 'BS', flag: '🇧🇸', plugType: 'Type A & B', voltage: '120V', currency: 'BSD ($)' },
  { code: 'AUA', city: 'Aruba', airportName: 'Queen Beatrix Intl', country: 'Aruba', countryCode: 'AW', flag: '🇦🇼', plugType: 'Type A, B & F', voltage: '127V', currency: 'AWG (Afl)' },
  { code: 'SJO', city: 'San José', airportName: 'Juan Santamaría Intl', country: 'Costa Rica', countryCode: 'CR', flag: '🇨🇷', plugType: 'Type A & B', voltage: '120V', currency: 'CRC (₡)' },
  { code: 'LIR', city: 'Liberia / Guanacaste', airportName: 'Guanacaste Airport', country: 'Costa Rica', countryCode: 'CR', flag: '🇨🇷', plugType: 'Type A & B', voltage: '120V', currency: 'CRC (₡)' },
  { code: 'PTY', city: 'Panama City', airportName: 'Tocumen Intl Airport', country: 'Panama', countryCode: 'PA', flag: '🇵🇦', plugType: 'Type A & B', voltage: '120V', currency: 'USD ($)' },
  { code: 'GRU', city: 'São Paulo', airportName: 'São Paulo/Guarulhos Intl', country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', plugType: 'Type N & C', voltage: '127V/220V', currency: 'BRL (R$)' },
  { code: 'GIG', city: 'Rio de Janeiro', airportName: 'Rio de Janeiro/Galeão Intl', country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', plugType: 'Type N & C', voltage: '127V/220V', currency: 'BRL (R$)' },
  { code: 'EZE', city: 'Buenos Aires', airportName: 'Ministro Pistarini Intl', country: 'Argentina', countryCode: 'AR', flag: '🇦🇷', plugType: 'Type I & C', voltage: '220V', currency: 'ARS ($)' },
  { code: 'SCL', city: 'Santiago', airportName: 'Arturo Merino Benítez Intl', country: 'Chile', countryCode: 'CL', flag: '🇨🇱', plugType: 'Type C & L', voltage: '220V', currency: 'CLP ($)' },
  { code: 'LIM', city: 'Lima', airportName: 'Jorge Chávez Intl Airport', country: 'Peru', countryCode: 'PE', flag: '🇵🇪', plugType: 'Type A & C', voltage: '220V', currency: 'PEN (S/.)' },
  { code: 'BOG', city: 'Bogotá', airportName: 'El Dorado Intl Airport', country: 'Colombia', countryCode: 'CO', flag: '🇨🇴', plugType: 'Type A & B', voltage: '120V', currency: 'COP ($)' },
  { code: 'MDE', city: 'Medellín', airportName: 'José María Córdova Intl', country: 'Colombia', countryCode: 'CO', flag: '🇨🇴', plugType: 'Type A & B', voltage: '120V', currency: 'COP ($)' },

  // Africa
  { code: 'CAI', city: 'Cairo', airportName: 'Cairo Intl Airport', country: 'Egypt', countryCode: 'EG', flag: '🇪🇬', plugType: 'Type C & F', voltage: '220V', currency: 'EGP (E£)' },
  { code: 'CPT', city: 'Cape Town', airportName: 'Cape Town Intl Airport', country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', plugType: 'Type D, M & N', voltage: '230V', currency: 'ZAR (R)' },
  { code: 'JNB', city: 'Johannesburg', airportName: 'O.R. Tambo Intl', country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', plugType: 'Type D, M & N', voltage: '230V', currency: 'ZAR (R)' },
  { code: 'RAK', city: 'Marrakech', airportName: 'Marrakesh Menara Airport', country: 'Morocco', countryCode: 'MA', flag: '🇲🇦', plugType: 'Type C & E', voltage: '220V', currency: 'MAD (DH)' },
  { code: 'NBO', city: 'Nairobi', airportName: 'Jomo Kenyatta Intl', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪', plugType: 'Type G', voltage: '240V', currency: 'KES (KSh)' }
];

export function searchAirportsAndCities(query: string, maxResults = 8): AirportCity[] {
  if (!query || query.trim().length === 0) {
    return AIRPORTS_DATABASE.slice(0, maxResults);
  }

  const rawClean = query.trim().toLowerCase();
  
  // Normalize common synonyms
  let clean = rawClean;
  if (rawClean === 'us' || rawClean === 'usa') clean = 'united states';
  if (rawClean === 'uk') clean = 'united kingdom';
  if (rawClean === 'uae') clean = 'united arab emirates';

  const exactCodeMatches: AirportCity[] = [];
  const prefixCodeMatches: AirportCity[] = [];
  const cityPrefixMatches: AirportCity[] = [];
  const countryMatches: AirportCity[] = [];
  const otherMatches: AirportCity[] = [];

  for (const item of AIRPORTS_DATABASE) {
    const codeLower = item.code.toLowerCase();
    const cityLower = item.city.toLowerCase();
    const countryLower = item.country.toLowerCase();
    const nameLower = item.airportName.toLowerCase();

    if (codeLower === rawClean) {
      exactCodeMatches.push(item);
    } else if (codeLower.startsWith(rawClean)) {
      prefixCodeMatches.push(item);
    } else if (cityLower.startsWith(rawClean) || cityLower.includes(clean)) {
      cityPrefixMatches.push(item);
    } else if (countryLower.startsWith(clean) || countryLower.includes(clean)) {
      countryMatches.push(item);
    } else if (nameLower.includes(rawClean)) {
      otherMatches.push(item);
    }
  }

  const combined = [
    ...exactCodeMatches,
    ...prefixCodeMatches,
    ...cityPrefixMatches,
    ...countryMatches,
    ...otherMatches
  ];

  // Deduplicate results by airport code
  const unique = combined.filter((item, index, self) => 
    index === self.findIndex((t) => t.code === item.code)
  );

  return unique.slice(0, maxResults);
}

export function findAirportByCode(code: string): AirportCity | undefined {
  if (!code) return undefined;
  const upper = code.trim().toUpperCase();
  return AIRPORTS_DATABASE.find((a) => a.code === upper);
}
