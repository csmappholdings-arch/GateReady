import { AirportCity } from './airportsData';

export interface TransitHub {
  id: string;
  name: string;
  city: string;
  code?: string;
  country: string;
  flag: string;
  type: 'TRAIN' | 'BUS' | 'PORT';
  region?: string;
}

export const TRANSIT_HUBS_DATABASE: TransitHub[] = [
  // ===================== TRAIN STATIONS =====================
  // Canada
  { id: 'tr-union-to', name: 'Union Station (Toronto)', city: 'Toronto', code: 'UNS', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Ontario' },
  { id: 'tr-central-mtl', name: 'Gare Centrale (Montreal Central Station)', city: 'Montreal', code: 'MTR', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Quebec' },
  { id: 'tr-ottawa', name: 'Ottawa Train Station', city: 'Ottawa', code: 'XDS', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Ontario' },
  { id: 'tr-vancouver-pc', name: 'Pacific Central Station (Vancouver)', city: 'Vancouver', code: 'VAC', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'British Columbia' },
  { id: 'tr-quebec-palais', name: 'Gare du Palais (Quebec City)', city: 'Quebec City', code: 'XFY', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Quebec' },
  { id: 'tr-halifax', name: 'Halifax VIA Rail Station', city: 'Halifax', code: 'XDG', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Nova Scotia' },
  { id: 'tr-winnipeg', name: 'Winnipeg Union Station', city: 'Winnipeg', code: 'XEF', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Manitoba' },
  { id: 'tr-edmonton', name: 'Edmonton VIA Rail Station', city: 'Edmonton', code: 'YEA', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Alberta' },
  { id: 'tr-jasper', name: 'Jasper Railway Station', city: 'Jasper', code: 'JSP', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Alberta' },
  { id: 'tr-banff', name: 'Banff Train Station (Rocky Mountaineer)', city: 'Banff', code: 'BNF', country: 'Canada', flag: '🇨🇦', type: 'TRAIN', region: 'Alberta' },

  // USA
  { id: 'tr-penn-nyc', name: 'Penn Station (New York / Moynihan Train Hall)', city: 'New York', code: 'NYP', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'New York' },
  { id: 'tr-grand-central', name: 'Grand Central Terminal (New York)', city: 'New York', code: 'GCT', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'New York' },
  { id: 'tr-union-dc', name: 'Washington Union Station', city: 'Washington DC', code: 'WAS', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'District of Columbia' },
  { id: 'tr-south-boston', name: 'South Station (Boston)', city: 'Boston', code: 'BOS', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Massachusetts' },
  { id: 'tr-back-bay-boston', name: 'Back Bay Station (Boston)', city: 'Boston', code: 'BBY', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Massachusetts' },
  { id: 'tr-30th-philly', name: 'William H. Gray III 30th St Station', city: 'Philadelphia', code: 'PHL', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Pennsylvania' },
  { id: 'tr-union-chicago', name: 'Chicago Union Station', city: 'Chicago', code: 'CHI', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Illinois' },
  { id: 'tr-union-la', name: 'Los Angeles Union Station', city: 'Los Angeles', code: 'LAX', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'California' },
  { id: 'tr-king-st-seattle', name: 'King Street Station (Seattle)', city: 'Seattle', code: 'SEA', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Washington' },
  { id: 'tr-union-portland', name: 'Portland Union Station', city: 'Portland', code: 'PDX', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Oregon' },
  { id: 'tr-brightline-miami', name: 'MiamiCentral (Brightline / Metrorail)', city: 'Miami', code: 'MIA', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Florida' },
  { id: 'tr-brightline-orlando', name: 'Orlando Station (Brightline at MCO Airport)', city: 'Orlando', code: 'ORL', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Florida' },
  { id: 'tr-brightline-ftlaud', name: 'Fort Lauderdale Brightline Station', city: 'Fort Lauderdale', code: 'FTL', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Florida' },
  { id: 'tr-union-denver', name: 'Denver Union Station', city: 'Denver', code: 'DEN', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Colorado' },
  { id: 'tr-penn-baltimore', name: 'Baltimore Penn Station', city: 'Baltimore', code: 'BAL', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'Maryland' },
  { id: 'tr-sfe-albuquerque', name: 'Albuquerque Alvarado Transportation Center', city: 'Albuquerque', code: 'ABQ', country: 'United States', flag: '🇺🇸', type: 'TRAIN', region: 'New Mexico' },

  // UK & Europe
  { id: 'tr-st-pancras', name: 'St Pancras International (Eurostar Hub)', city: 'London', code: 'STP', country: 'United Kingdom', flag: '🇬🇧', type: 'TRAIN', region: 'England' },
  { id: 'tr-kings-cross', name: "London King's Cross", city: 'London', code: 'KGX', country: 'United Kingdom', flag: '🇬🇧', type: 'TRAIN', region: 'England' },
  { id: 'tr-paddington', name: 'London Paddington (Heathrow Express / West)', city: 'London', code: 'PAD', country: 'United Kingdom', flag: '🇬🇧', type: 'TRAIN', region: 'England' },
  { id: 'tr-edinburgh-waverley', name: 'Edinburgh Waverley', city: 'Edinburgh', code: 'EDB', country: 'United Kingdom', flag: '🇬🇧', type: 'TRAIN', region: 'Scotland' },
  { id: 'tr-gare-du-nord', name: 'Gare du Nord (Paris Eurostar / TGV)', city: 'Paris', code: 'PND', country: 'France', flag: '🇫🇷', type: 'TRAIN', region: 'Île-de-France' },
  { id: 'tr-gare-de-lyon', name: 'Gare de Lyon (Paris TGV Sud-Est)', city: 'Paris', code: 'PLY', country: 'France', flag: '🇫🇷', type: 'TRAIN', region: 'Île-de-France' },
  { id: 'tr-amsterdam-centraal', name: 'Amsterdam Centraal Station', city: 'Amsterdam', code: 'AMS', country: 'Netherlands', flag: '🇳🇱', type: 'TRAIN', region: 'North Holland' },
  { id: 'tr-bruxelles-midi', name: 'Bruxelles-Midi / Brussel-Zuid (Eurostar Hub)', city: 'Brussels', code: 'ZYR', country: 'Belgium', flag: '🇧🇪', type: 'TRAIN', region: 'Brussels' },
  { id: 'tr-frankfurt-hbf', name: 'Frankfurt (Main) Hauptbahnhof', city: 'Frankfurt', code: 'FFM', country: 'Germany', flag: '🇩🇪', type: 'TRAIN', region: 'Hesse' },
  { id: 'tr-munich-hbf', name: 'München Hauptbahnhof (Munich Central)', city: 'Munich', code: 'MUC', country: 'Germany', flag: '🇩🇪', type: 'TRAIN', region: 'Bavaria' },
  { id: 'tr-berlin-hbf', name: 'Berlin Hauptbahnhof', city: 'Berlin', code: 'BER', country: 'Germany', flag: '🇩🇪', type: 'TRAIN', region: 'Berlin' },
  { id: 'tr-zurich-hb', name: 'Zürich Hauptbahnhof (Central Station)', city: 'Zurich', code: 'ZRH', country: 'Switzerland', flag: '🇨🇭', type: 'TRAIN', region: 'Zurich' },
  { id: 'tr-geneve-cornavin', name: 'Genève Cornavin Station', city: 'Geneva', code: 'GVA', country: 'Switzerland', flag: '🇨🇭', type: 'TRAIN', region: 'Geneva' },
  { id: 'tr-roma-termini', name: 'Roma Termini (Rome Central)', city: 'Rome', code: 'ROM', country: 'Italy', flag: '🇮🇹', type: 'TRAIN', region: 'Lazio' },
  { id: 'tr-milano-centrale', name: 'Milano Centrale Station', city: 'Milan', code: 'MIL', country: 'Italy', flag: '🇮🇹', type: 'TRAIN', region: 'Lombardy' },
  { id: 'tr-madrid-atocha', name: 'Madrid Puerta de Atocha (AVE High-Speed)', city: 'Madrid', code: 'XOC', country: 'Spain', flag: '🇪🇸', type: 'TRAIN', region: 'Madrid' },
  { id: 'tr-barcelona-sants', name: 'Barcelona Sants Station', city: 'Barcelona', code: 'YJB', country: 'Spain', flag: '🇪🇸', type: 'TRAIN', region: 'Catalonia' },
  { id: 'tr-vienna-hbf', name: 'Wien Hauptbahnhof (Vienna Central)', city: 'Vienna', code: 'VIE', country: 'Austria', flag: '🇦🇹', type: 'TRAIN', region: 'Vienna' },
  { id: 'tr-tokyo-station', name: 'Tokyo Station (Shinkansen Bullet Train Hub)', city: 'Tokyo', code: 'TYO', country: 'Japan', flag: '🇯🇵', type: 'TRAIN', region: 'Kanto' },
  { id: 'tr-kyoto-station', name: 'Kyoto Station (Shinkansen)', city: 'Kyoto', code: 'KYO', country: 'Japan', flag: '🇯🇵', type: 'TRAIN', region: 'Kansai' },
  { id: 'tr-shin-osaka', name: 'Shin-Osaka Station (Shinkansen / Sanyo)', city: 'Osaka', code: 'OSA', country: 'Japan', flag: '🇯🇵', type: 'TRAIN', region: 'Kansai' },

  // ===================== CRUISE & FERRY PORTS =====================
  // North America & Caribbean Cruise Hubs
  { id: 'pt-miami', name: 'PortMiami (Cruise Capital of the World)', city: 'Miami', code: 'POM', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Florida' },
  { id: 'pt-everglades', name: 'Port Everglades (Fort Lauderdale)', city: 'Fort Lauderdale', code: 'PEV', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Florida' },
  { id: 'pt-canaveral', name: 'Port Canaveral (Orlando / Space Coast)', city: 'Cape Canaveral / Orlando', code: 'PCV', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Florida' },
  { id: 'pt-tampa', name: 'Port Tampa Bay', city: 'Tampa', code: 'TPA', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Florida' },
  { id: 'pt-galveston', name: 'Port of Galveston', city: 'Galveston / Houston', code: 'GLS', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Texas' },
  { id: 'pt-new-orleans', name: 'Port of New Orleans', city: 'New Orleans', code: 'MSY', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Louisiana' },
  { id: 'pt-seattle', name: 'Port of Seattle (Alaska Cruise Terminal / Pier 66 & 91)', city: 'Seattle', code: 'SEA', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Washington' },
  { id: 'pt-vancouver', name: 'Canada Place Cruise Ship Terminal', city: 'Vancouver', code: 'YVR', country: 'Canada', flag: '🇨🇦', type: 'PORT', region: 'British Columbia' },
  { id: 'pt-victoria-ogden', name: 'Ogden Point Cruise Terminal', city: 'Victoria', code: 'YYJ', country: 'Canada', flag: '🇨🇦', type: 'PORT', region: 'British Columbia' },
  { id: 'pt-san-pedro-la', name: 'Port of Los Angeles (World Cruise Center / San Pedro)', city: 'Los Angeles', code: 'LAX', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'California' },
  { id: 'pt-long-beach', name: 'Long Beach Cruise Terminal (Carnival Dome)', city: 'Long Beach', code: 'LGB', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'California' },
  { id: 'pt-san-diego', name: 'Port of San Diego (B Street Cruise Terminal)', city: 'San Diego', code: 'SAN', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'California' },
  { id: 'pt-manhattan-nyc', name: 'Manhattan Cruise Terminal (Pier 88/90)', city: 'New York', code: 'NYC', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'New York' },
  { id: 'pt-brooklyn-nyc', name: 'Brooklyn Cruise Terminal (Red Hook)', city: 'New York', code: 'BKN', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'New York' },
  { id: 'pt-cape-liberty', name: 'Cape Liberty Cruise Port (Bayonne / NYC)', city: 'Bayonne / New York', code: 'EWR', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'New Jersey' },
  { id: 'pt-boston-black-falcon', name: 'Flynn Cruiseport Boston (Black Falcon)', city: 'Boston', code: 'BOS', country: 'United States', flag: '🇺🇸', type: 'PORT', region: 'Massachusetts' },
  { id: 'pt-quebec-port', name: 'Port of Québec (Ross Gaudreault Terminal)', city: 'Quebec City', code: 'YQB', country: 'Canada', flag: '🇨🇦', type: 'PORT', region: 'Quebec' },
  { id: 'pt-montreal-port', name: 'Grand Quay of the Port of Montreal', city: 'Montreal', code: 'YUL', country: 'Canada', flag: '🇨🇦', type: 'PORT', region: 'Quebec' },
  { id: 'pt-halifax-port', name: 'Port of Halifax (Piers 20 & 22)', city: 'Halifax', code: 'YHZ', country: 'Canada', flag: '🇨🇦', type: 'PORT', region: 'Nova Scotia' },
  { id: 'pt-san-juan', name: 'San Juan Cruise Port (Old San Juan & Pan American)', city: 'San Juan', code: 'SJU', country: 'Puerto Rico', flag: '🇵🇷', type: 'PORT', region: 'Caribbean' },
  { id: 'pt-nassau', name: 'Nassau Cruise Port (Prince George Wharf)', city: 'Nassau', code: 'NAS', country: 'Bahamas', flag: '🇧🇸', type: 'PORT', region: 'Caribbean' },
  { id: 'pt-cozumel', name: 'Port of Cozumel (Punta Langosta / International Pier)', city: 'Cozumel', code: 'CZM', country: 'Mexico', flag: '🇲🇽', type: 'PORT', region: 'Caribbean' },
  { id: 'pt-philipsburg-stmaarten', name: 'Port of Sint Maarten (Captain Hodge Wharf)', city: 'Philipsburg', code: 'SXM', country: 'Sint Maarten', flag: '🇸🇽', type: 'PORT', region: 'Caribbean' },
  { id: 'pt-charlotte-amalie', name: 'St. Thomas Cruise Port (Crown Bay / Havensight)', city: 'St. Thomas', code: 'STT', country: 'U.S. Virgin Islands', flag: '🇻🇮', type: 'PORT', region: 'Caribbean' },

  // Mediterranean & European Cruise Hubs
  { id: 'pt-barcelona', name: 'Port of Barcelona (Moll d’Adossat Cruise Terminals)', city: 'Barcelona', code: 'BCN', country: 'Spain', flag: '🇪🇸', type: 'PORT', region: 'Europe' },
  { id: 'pt-civitavecchia-rome', name: 'Port of Civitavecchia (Rome Cruise Gateway)', city: 'Rome / Civitavecchia', code: 'CVV', country: 'Italy', flag: '🇮🇹', type: 'PORT', region: 'Europe' },
  { id: 'pt-venice-fusina', name: 'Port of Venice / Marghera Cruise Terminal', city: 'Venice', code: 'VCE', country: 'Italy', flag: '🇮🇹', type: 'PORT', region: 'Europe' },
  { id: 'pt-southampton', name: 'Port of Southampton (UK Cruise Hub)', city: 'Southampton / London', code: 'SOU', country: 'United Kingdom', flag: '🇬🇧', type: 'PORT', region: 'Europe' },
  { id: 'pt-marseille', name: 'Grand Port Maritime de Marseille', city: 'Marseille', code: 'MRS', country: 'France', flag: '🇫🇷', type: 'PORT', region: 'Europe' },
  { id: 'pt-piraeus-athens', name: 'Port of Piraeus (Athens Cruise Port)', city: 'Athens', code: 'PIR', country: 'Greece', flag: '🇬🇷', type: 'PORT', region: 'Europe' },

  // ===================== BUS TERMINALS =====================
  // Canada
  { id: 'bs-toronto-union-bus', name: 'Union Station Bus Terminal (GO & Megabus Hub)', city: 'Toronto', code: 'TO-BUS', country: 'Canada', flag: '🇨🇦', type: 'BUS', region: 'Ontario' },
  { id: 'bs-montreal-gare-routiere', name: 'Gare d’autocars de Montréal (Montreal Coach Terminal)', city: 'Montreal', code: 'MTL-BUS', country: 'Canada', flag: '🇨🇦', type: 'BUS', region: 'Quebec' },
  { id: 'bs-ottawa-central', name: 'Ottawa Central Coach Station', city: 'Ottawa', code: 'OTT-BUS', country: 'Canada', flag: '🇨🇦', type: 'BUS', region: 'Ontario' },
  { id: 'bs-vancouver-pacific-bus', name: 'Pacific Central Bus Terminal', city: 'Vancouver', code: 'VAN-BUS', country: 'Canada', flag: '🇨🇦', type: 'BUS', region: 'British Columbia' },

  // USA
  { id: 'bs-panynj-nyc', name: 'Port Authority Bus Terminal (PABT NYC - Midtown Manhattan)', city: 'New York', code: 'NYC-PABT', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'New York' },
  { id: 'bs-gw-bridge-nyc', name: 'George Washington Bridge Bus Station (Uptown NYC)', city: 'New York', code: 'GWB-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'New York' },
  { id: 'bs-south-station-boston-bus', name: 'South Station Bus Terminal', city: 'Boston', code: 'BOS-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'Massachusetts' },
  { id: 'bs-union-station-dc-bus', name: 'Washington Union Station Bus Deck', city: 'Washington DC', code: 'DC-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'District of Columbia' },
  { id: 'bs-philadelphia-greyhound', name: 'Philadelphia Bus Station (Market St)', city: 'Philadelphia', code: 'PHL-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'Pennsylvania' },
  { id: 'bs-chicago-greyhound', name: 'Chicago Greyhound Bus Station (Harrison St)', city: 'Chicago', code: 'CHI-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'Illinois' },
  { id: 'bs-los-angeles-dtla', name: 'Los Angeles Downtown Transit Bus Station (7th St)', city: 'Los Angeles', code: 'LA-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'California' },
  { id: 'bs-miami-airport-transit', name: 'Miami Intermodal Bus Station (MIA Station)', city: 'Miami', code: 'MIA-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'Florida' },
  { id: 'bs-orlando-bus', name: 'Orlando Bus Station (John Young Pkwy)', city: 'Orlando', code: 'ORL-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'Florida' },
  { id: 'bs-atlanta-greyhound', name: 'Atlanta Downtown Bus Terminal (Forsyth St)', city: 'Atlanta', code: 'ATL-BUS', country: 'United States', flag: '🇺🇸', type: 'BUS', region: 'Georgia' },

  // UK & Europe
  { id: 'bs-victoria-coach-london', name: 'Victoria Coach Station (London Hub)', city: 'London', code: 'VCS', country: 'United Kingdom', flag: '🇬🇧', type: 'BUS', region: 'England' },
  { id: 'bs-paris-bercy-seine', name: 'Paris Bercy Seine Bus Station (FlixBus / BlaBlaCar Hub)', city: 'Paris', code: 'PAR-BUS', country: 'France', flag: '🇫🇷', type: 'BUS', region: 'Île-de-France' },
  { id: 'bs-amsterdam-sloterdijk', name: 'Amsterdam Sloterdijk Bus Station (FlixBus Hub)', city: 'Amsterdam', code: 'AMS-SLOT', country: 'Netherlands', flag: '🇳🇱', type: 'BUS', region: 'North Holland' },
  { id: 'bs-berlin-zob', name: 'Zentraler Omnibusbahnhof Berlin (Berlin ZOB)', city: 'Berlin', code: 'BER-ZOB', country: 'Germany', flag: '🇩🇪', type: 'BUS', region: 'Berlin' },
  { id: 'bs-munich-zob', name: 'München ZOB (Central Bus Station Munich)', city: 'Munich', code: 'MUC-ZOB', country: 'Germany', flag: '🇩🇪', type: 'BUS', region: 'Bavaria' },
  { id: 'bs-barcelona-nord', name: 'Estació del Nord (Barcelona North Bus Station)', city: 'Barcelona', code: 'BCN-NORD', country: 'Spain', flag: '🇪🇸', type: 'BUS', region: 'Catalonia' }
];

export function searchTransitHubs(type: 'TRAIN' | 'BUS' | 'PORT', query: string, maxResults = 8): TransitHub[] {
  const hubs = TRANSIT_HUBS_DATABASE.filter((h) => h.type === type);
  if (!query || query.trim().length === 0) {
    return hubs.slice(0, maxResults);
  }

  const clean = query.trim().toLowerCase();
  return hubs
    .filter((h) => {
      const nameMatch = h.name.toLowerCase().includes(clean);
      const cityMatch = h.city.toLowerCase().includes(clean);
      const countryMatch = h.country.toLowerCase().includes(clean);
      const codeMatch = h.code ? h.code.toLowerCase().includes(clean) : false;
      const regionMatch = h.region ? h.region.toLowerCase().includes(clean) : false;
      return nameMatch || cityMatch || countryMatch || codeMatch || regionMatch;
    })
    .slice(0, maxResults);
}
