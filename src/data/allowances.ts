import { BaggageLimitInfo } from '../types/travel';

export const airlineLimits: BaggageLimitInfo[] = [
  // ================= USA AIRLINES =================
  {
    id: 'delta',
    company: 'Delta Air Lines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '1 item (purse, laptop bag) to fit under seat in front (approx 18 x 14 x 8 in)',
    carryOnLimit: '22 x 14 x 9 in (56 x 35 x 23 cm) / 45 linear in',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'No weight limit for most domestic/international routes',
    checkedWeightLimit: '50 lbs (23 kg) standard; 70 lbs for First / Delta One',
    notes: 'No maximum weight limit for carry-on luggage on most routes, except Singapore (15 lbs), Beijing/Shanghai (22 lbs).'
  },
  {
    id: 'american',
    company: 'American Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '18 x 14 x 8 in (45 x 35 x 20 cm) - must fit under the seat in front',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm) including handles and wheels',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'No weight limit (must fit in overhead bin unassisted)',
    checkedWeightLimit: '50 lbs (23 kg) main cabin; 70 lbs for Business/First',
    notes: 'Basic Economy includes 1 free carry-on bag plus 1 personal item to all destinations.'
  },
  {
    id: 'united',
    company: 'United Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '17 x 10 x 9 in (43 x 25 x 22 cm) - fits under the seat in front',
    carryOnLimit: '22 x 14 x 9 in (56 x 35 x 22 cm) including wheels and handles',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'No official weight limit',
    checkedWeightLimit: '50 lbs (23 kg) standard; 70 lbs for United Polaris/Business',
    notes: 'IMPORTANT: Basic Economy tickets inside US ONLY allow a personal item. Carry-on bags are NOT allowed unless Premier member or cardholder.'
  },
  {
    id: 'southwest',
    company: 'Southwest Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '16.25 x 13.5 x 8 in (41 x 34 x 20 cm)',
    carryOnLimit: '24 x 16 x 10 in (61 x 41 x 25 cm) - Generous size allowance!',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: 'No strict weight limit',
    checkedWeightLimit: '2 FREE checked bags up to 50 lbs each!',
    notes: 'Famous for "Bags Fly Free": Your first 2 checked bags are completely free within 50 lbs / 62 in.'
  },
  {
    id: 'jetblue',
    company: 'JetBlue Airways',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '17 x 13 x 8 in (43.2 x 33 x 20.32 cm)',
    carryOnLimit: '22 x 14 x 9 in (55.88 x 35.56 x 22.86 cm)',
    checkedLimit: '62 linear in (157.48 cm), 50 lbs (22.68 kg)',
    carryOnWeightLimit: 'No weight limit',
    checkedWeightLimit: '50 lbs (22.68 kg)',
    notes: 'All fares including Blue Basic now include a carry-on bag in addition to a personal item.'
  },
  {
    id: 'alaska',
    company: 'Alaska Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '1 item (briefcase, purse, or laptop) to fit under the seat',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm) including wheels and handles',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: 'No weight limit (must be liftable into overhead bin)',
    checkedWeightLimit: '50 lbs (23 kg)',
    notes: '20-Minute Baggage Service Guarantee: Bags at carousel within 20 mins of gate arrival.'
  },
  {
    id: 'hawaiian',
    company: 'Hawaiian Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '1 item (briefcase, small backpack) to fit under seat',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm), max 25 lbs (11.5 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: '25 lbs (11.5 kg)',
    checkedWeightLimit: '50 lbs (23 kg) Coach; 70 lbs First Class',
    notes: 'Carry-on weight limit strictly enforced on island-hopper inter-island propeller and jet flights.'
  },
  {
    id: 'spirit',
    company: 'Spirit Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '18 x 14 x 8 in (45 x 35 x 20 cm) - INCLUDED FREE',
    carryOnLimit: '22 x 18 x 10 in (56 x 46 x 25 cm) - EXTRA FEE REQUIRED',
    checkedLimit: '62 linear in (158 cm), STRICT 40 lbs (18.1 kg) max!',
    carryOnWeightLimit: 'Must fit safely in overhead bin',
    checkedWeightLimit: '40 lbs (18.1 kg) - Overweight charges apply from 41 lbs!',
    notes: 'Warning: Checked bag weight limit is 40 lbs, not 50 lbs! Carry-on incurs a charge. Sizers enforced.'
  },
  {
    id: 'frontier',
    company: 'Frontier Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '18 x 14 x 8 in (45.7 x 35.6 x 20.3 cm) - INCLUDED FREE',
    carryOnLimit: '24 x 16 x 10 in (61 x 40.6 x 25.4 cm) - max 35 lbs (15.9 kg)',
    checkedLimit: '62 linear in (158 cm), max 40 lbs (18.1 kg)',
    carryOnWeightLimit: 'Strict 35 lbs (15.9 kg) limit',
    checkedWeightLimit: '40 lbs (18.1 kg) - strict overweight scale at check-in',
    notes: 'Frontier strictly weighs bags at the gate. Keep your carry-on under 35 lbs.'
  },
  {
    id: 'allegiant',
    company: 'Allegiant Air',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '16 x 15 x 7 in (40.6 x 38.1 x 17.8 cm) - INCLUDED FREE under seat',
    carryOnLimit: '22 x 16 x 10 in (55.9 x 40.6 x 25.4 cm) - max 25 lbs (11.3 kg), PAID FEE',
    checkedLimit: '80 linear in (203 cm), max 40 lbs (18 kg)',
    carryOnWeightLimit: 'Strict 25 lbs (11.3 kg) weight cap',
    checkedWeightLimit: '40 lbs (18 kg) - Extra fees if over 40 lbs',
    notes: 'Ultra low-cost carrier. Sizers enforced at boarding gate. Checked bag limit is 40 lbs.'
  },
  {
    id: 'suncountry',
    company: 'Sun Country Airlines',
    type: 'PLANE',
    region: 'USA',
    personalLimit: '17 x 13 x 9 in (43 x 33 x 23 cm) - INCLUDED FREE',
    carryOnLimit: '24 x 16 x 11 in (61 x 40.6 x 27.9 cm), max 35 lbs (15.9 kg) - FEE APPLIES',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: '35 lbs (15.9 kg) limit',
    checkedWeightLimit: '50 lbs (23 kg)',
    notes: 'Minneapolis-based airline. Overhead carry-on requires paid seat tier or baggage fee.'
  },

  // ================= CANADA AIRLINES =================
  {
    id: 'aircanada',
    company: 'Air Canada',
    type: 'PLANE',
    region: 'Canada',
    personalLimit: '17 x 13 x 6 in (43 x 33 x 16 cm) - to fit under seat',
    carryOnLimit: '21.5 x 15.5 x 9 in (55 x 40 x 23 cm) including wheels and handles',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'No weight limit (must be light enough to store in overhead without assistance)',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Signature / Business',
    notes: 'One standard carry-on plus one personal item allowed free on all flights worldwide.'
  },
  {
    id: 'westjet',
    company: 'WestJet',
    type: 'PLANE',
    region: 'Canada',
    personalLimit: '16 x 13 x 6 in (41 x 33 x 15 cm) - fits under front seat',
    carryOnLimit: '21 x 15 x 9 in (53 x 38 x 23 cm) including wheels/handles',
    checkedLimit: '62 linear in (157 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'No maximum weight limit',
    checkedWeightLimit: '50 lbs (23 kg) Standard; 70 lbs for Business/Premium',
    notes: 'UltraBasic fares do NOT include a carry-on bag for flights within Canada/US unless traveling on a transatlantic route.'
  },
  {
    id: 'porter',
    company: 'Porter Airlines',
    type: 'PLANE',
    region: 'Canada',
    personalLimit: '17 x 13 x 6 in (43 x 33 x 16 cm) - Included in all fares',
    carryOnLimit: '21.5 x 15.5 x 9 in (55 x 40 x 23 cm), max 20 lbs (9 kg)',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: '20 lbs (9 kg) on PorterReserve & Standard',
    checkedWeightLimit: '50 lbs (23 kg)',
    notes: 'PorterClassic Basic fare only permits a personal item. Standard carry-on requires PorterClassic Standard or PorterReserve.'
  },
  {
    id: 'airtransat',
    company: 'Air Transat',
    type: 'PLANE',
    region: 'Canada',
    personalLimit: '17 x 12 x 5 in (43 x 30.5 x 12.7 cm) - free under seat',
    carryOnLimit: '21 x 16 x 9 in (53 x 40 x 23 cm), max 22 lbs (10 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: '22 lbs (10 kg) strictly weighed',
    checkedWeightLimit: '50 lbs (23 kg) Club Class allows 2x 70 lbs (32 kg)',
    notes: 'Very popular leisure airline connecting Canada to Europe, Florida, and the Caribbean.'
  },
  {
    id: 'flair',
    company: 'Flair Airlines',
    type: 'PLANE',
    region: 'Canada',
    personalLimit: '17 x 13 x 6 in (43 x 33 x 15 cm), max 15.5 lbs (7 kg) - FREE',
    carryOnLimit: '21.5 x 15.5 x 9 in (55 x 40 x 23 cm), max 22 lbs (10 kg) - FEE APPLIES',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'Strict 22 lbs (10 kg) limit',
    checkedWeightLimit: '50 lbs (23 kg)',
    notes: 'Ultra low-cost carrier in Canada. Airport bag sizing bins strictly enforced at gate.'
  },

  // ================= EUROPE AIRLINES =================
  {
    id: 'britishairways',
    company: 'British Airways',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '16 x 12 x 6 in (40 x 30 x 15 cm) up to 51 lbs (23 kg)',
    carryOnLimit: '22 x 18 x 10 in (56 x 45 x 25 cm) up to 51 lbs (23 kg)',
    checkedLimit: '35.5 x 29.5 x 16 in (90 x 75 x 43 cm), 51 lbs (23 kg)',
    carryOnWeightLimit: '51 lbs (23 kg) per bag - extremely generous!',
    checkedWeightLimit: '51 lbs (23 kg) Economy; 70 lbs (32 kg) Club World/First',
    notes: 'One of the most generous weight allowances in Europe: 23 kg (51 lbs) for both carry-on and personal item.'
  },
  {
    id: 'airfrance',
    company: 'Air France / KLM',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 5.8 in (40 x 30 x 15 cm)',
    carryOnLimit: '21.6 x 13.7 x 9.8 in (55 x 35 x 25 cm)',
    checkedLimit: '62.2 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'Combined carry-on + personal item weight: 26.4 lbs (12 kg)',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70.5 lbs (32 kg) Business',
    notes: 'Pay close attention: The 12 kg (26.4 lbs) weight limit is for BOTH the carry-on and personal item combined.'
  },
  {
    id: 'lufthansa',
    company: 'Lufthansa Group (SWISS / Austrian)',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 3.9 in (40 x 30 x 10 cm)',
    carryOnLimit: '21.6 x 15.7 x 9 in (55 x 40 x 23 cm), max 17.6 lbs (8 kg)',
    checkedLimit: '62 linear in (158 cm), max 50 lbs (23 kg)',
    carryOnWeightLimit: 'Strict 17.6 lbs (8 kg) maximum',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70.5 lbs (32 kg) Business',
    notes: 'Carry-on bags are frequently weighed at Frankfurt, Munich, and Zurich gates. Ensure under 8 kg.'
  },
  {
    id: 'ryanair',
    company: 'Ryanair',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 9.8 x 7.8 in (40 x 25 x 20 cm) - Must fit sizer box',
    carryOnLimit: '21.6 x 15.7 x 7.8 in (55 x 40 x 20 cm), 22 lbs (10 kg) - Priority only',
    checkedLimit: '10 kg or 20 kg booking tier, max 31.8 x 47 x 47 in',
    carryOnWeightLimit: '22 lbs (10 kg) with Priority Boarding booking',
    checkedWeightLimit: 'Choice of 10 kg (22 lbs) or 20 kg (44 lbs)',
    notes: 'Standard tickets ONLY include small personal bag under seat. Rigid sizer bins enforced at gate.'
  },
  {
    id: 'easyjet',
    company: 'easyJet',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '17.7 x 14.1 x 7.8 in (45 x 36 x 20 cm), max 33 lbs (15 kg) - FREE',
    carryOnLimit: '22 x 17.7 x 9.8 in (56 x 45 x 25 cm), max 33 lbs (15 kg) - Upfront/Extra Legroom only',
    checkedLimit: 'Total 108 linear in (275 cm), standard 50 lbs (23 kg)',
    carryOnWeightLimit: '33 lbs (15 kg) - must be liftable by yourself',
    checkedWeightLimit: 'Standard 23 kg (50 lbs); option to book 15 kg or 32 kg',
    notes: 'All passengers get 1 under-seat bag free. Overhead locker bag requires Plus or Speedy Boarding.'
  },
  {
    id: 'turkish',
    company: 'Turkish Airlines',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 5.9 in (40 x 30 x 15 cm), max 8.8 lbs (4 kg)',
    carryOnLimit: '21.6 x 15.7 x 9 in (55 x 40 x 23 cm), max 17.6 lbs (8 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg) Economy; 70 lbs Business',
    carryOnWeightLimit: '17.6 lbs (8 kg) in Economy; 2x 8 kg in Business',
    checkedWeightLimit: '23 kg (50 lbs) Economy (Piece concept: 2x 23kg on Americas routes)',
    notes: 'Connects to more countries than any other airline. Weight strictly verified at Istanbul hub.'
  },
  {
    id: 'iberia',
    company: 'Iberia',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 5.9 in (40 x 30 x 15 cm) - fits under front seat',
    carryOnLimit: '22 x 15.7 x 9.8 in (56 x 40 x 25 cm), max 22 lbs (10 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: '22 lbs (10 kg) Tourist; 30 lbs (14 kg) Business',
    checkedWeightLimit: '50 lbs (23 kg) standard',
    notes: 'Spain flag carrier. Generous carry-on dimensions on long-haul routes to Latin America.'
  },
  {
    id: 'sas',
    company: 'Scandinavian Airlines (SAS)',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 5.9 in (40 x 30 x 15 cm) - under seat',
    carryOnLimit: '21.6 x 15.7 x 9 in (55 x 40 x 23 cm), max 17.6 lbs (8 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: '17.6 lbs (8 kg) maximum',
    checkedWeightLimit: '50 lbs (23 kg) SAS Go; 70 lbs (32 kg) SAS Business',
    notes: 'SAS Go Light fares only include personal under-seat bag; standard carry-on requires SAS Go Smart.'
  },
  {
    id: 'virginatlantic',
    company: 'Virgin Atlantic',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '1 item (handbag or small backpack) to fit under seat',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm), max 22 lbs (10 kg)',
    checkedLimit: '35.5 x 29.5 x 17 in (90 x 75 x 43 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: '22 lbs (10 kg) Economy & Premium; 2x 26 lbs (12 kg) Upper Class',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Upper Class',
    notes: 'Economy Light fares only permit hand baggage. 10 kg carry-on strictly checked at London Heathrow.'
  },
  {
    id: 'itaairways',
    company: 'ITA Airways (Alitalia)',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '14.1 x 11.8 x 3.9 in (36 x 30 x 10 cm) - handbag or briefcase',
    carryOnLimit: '21.6 x 13.7 x 9.8 in (55 x 35 x 25 cm), max 17.6 lbs (8 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: '17.6 lbs (8 kg) maximum',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70.5 lbs (32 kg) Business',
    notes: 'Italy national carrier. Carry-on strictly limited to 8 kg and must fit overhead sizer.'
  },
  {
    id: 'tap',
    company: 'TAP Air Portugal',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 4.7 in (40 x 30 x 12 cm) up to 4.4 lbs (2 kg)',
    carryOnLimit: '21.6 x 15.7 x 7.8 in (55 x 40 x 20 cm), max 17.6 lbs (8 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: '17.6 lbs (8 kg) Economy; 2x 8 kg in Executive Class',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Executive',
    notes: 'Major transatlantic gateway to Europe and Brazil via Lisbon hub.'
  },
  {
    id: 'finnair',
    company: 'Finnair',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 5.9 in (40 x 30 x 15 cm) under seat',
    carryOnLimit: '21.6 x 15.7 x 9 in (55 x 40 x 23 cm)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: 'Combined carry-on + personal item: 17.6 lbs (8 kg) in Superlight/Classic',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Business',
    notes: 'Connecting Europe and Asia via Helsinki. Superlight tickets only include small under-seat bag.'
  },
  {
    id: 'wizzair',
    company: 'Wizz Air',
    type: 'PLANE',
    region: 'Europe',
    personalLimit: '15.7 x 11.8 x 7.8 in (40 x 30 x 20 cm), max 22 lbs (10 kg) - FREE',
    carryOnLimit: '21.6 x 15.7 x 9 in (55 x 40 x 23 cm), max 22 lbs (10 kg) - WIZZ Priority required',
    checkedLimit: 'Choice of 10kg, 20kg, 26kg, or 32kg tiers (max 58 x 46 x 67 in)',
    carryOnWeightLimit: '22 lbs (10 kg) with WIZZ Priority',
    checkedWeightLimit: 'Tiers from 10 kg up to 32 kg',
    notes: 'Central/Eastern Europe low-cost leader. Sizers strictly checked at gate; bag tags required.'
  },

  // ================= ASIA & PACIFIC AIRLINES =================
  {
    id: 'singapore',
    company: 'Singapore Airlines',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '15.7 x 11.8 x 3.9 in (40 x 30 x 10 cm) - handbag or camera bag',
    carryOnLimit: 'Length + width + height must not exceed 45.2 in (115 cm), max 15.4 lbs (7 kg)',
    checkedLimit: '62 linear in (158 cm), 55 lbs (25 kg) or 66 lbs (30 kg) by fare class',
    carryOnWeightLimit: 'Strict 15.4 lbs (7 kg) per piece (1 for Economy, 2 for Business/First)',
    checkedWeightLimit: '25-30 kg (55-66 lbs) Economy; 40 kg (88 lbs) Business',
    notes: 'Voted World Best Airline repeatedly. Hand baggage is weighed at check-in counter; strictly 7 kg limit.'
  },
  {
    id: 'ana',
    company: 'All Nippon Airways (ANA)',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 personal item (purse, camera, laptop) to stow under seat',
    carryOnLimit: '22 x 16 x 10 in (55 x 40 x 25 cm), total 45 linear in, max 22 lbs (10 kg)',
    checkedLimit: '62 linear in (158 cm), 2 pieces up to 50 lbs (23 kg) each in Economy!',
    carryOnWeightLimit: '22 lbs (10 kg) combined weight of carry-on and personal item',
    checkedWeightLimit: '2 FREE checked bags (23 kg / 50 lbs each) on International Economy!',
    notes: 'Outstanding international checked allowance: 2 bags free up to 50 lbs each for all Economy passengers.'
  },
  {
    id: 'japanairlines',
    company: 'Japan Airlines (JAL)',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 personal shopping bag, laptop, or briefcase',
    carryOnLimit: '22 x 16 x 10 in (55 x 40 x 25 cm), max 22 lbs (10 kg)',
    checkedLimit: '2 pieces up to 50 lbs (23 kg) each free on international flights',
    carryOnWeightLimit: '22 lbs (10 kg) combined carry-on weight',
    checkedWeightLimit: '2 FREE bags up to 50 lbs (23 kg) each in Economy; 3x 70 lbs in Business',
    notes: 'Like ANA, JAL offers 2 free 50 lb checked bags on transpacific and international routes.'
  },
  {
    id: 'cathaypacific',
    company: 'Cathay Pacific',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '15.7 x 11.8 x 6 in (40 x 30 x 15 cm) to fit under seat',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm), max 15.4 lbs (7 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg) Economy (2-piece concept)',
    carryOnWeightLimit: '15.4 lbs (7 kg) Economy; 22 lbs (10 kg) Premium Economy; 27.5 lbs Business',
    checkedWeightLimit: '23 kg (50 lbs) Economy; 32 kg (70 lbs) Business',
    notes: 'Hong Kong flag carrier. Carry-on luggage is weighed at the boarding gate at HKG airport.'
  },
  {
    id: 'koreanair',
    company: 'Korean Air',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 small personal item (laptop bag, handbag)',
    carryOnLimit: '21.6 x 15.7 x 7.8 in (55 x 40 x 20 cm), max 22 lbs (10 kg) total',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg) on international routes',
    carryOnWeightLimit: '22 lbs (10 kg) Economy (total with personal item); 40 lbs (18 kg) Prestige',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 2x 70 lbs (32 kg) Prestige Class',
    notes: 'Total sum of 3 dimensions for carry-on luggage cannot exceed 45 in (115 cm).'
  },
  {
    id: 'evaair',
    company: 'EVA Air',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '16 x 12 x 4 in (40 x 30 x 10 cm), max 11 lbs (5 kg)',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm), max 15.4 lbs (7 kg)',
    checkedLimit: '62 linear in (158 cm), 2 pieces up to 50 lbs (23 kg) each in Economy',
    carryOnWeightLimit: '15.4 lbs (7 kg) in Economy; 2 pieces of 7 kg each in Royal Laurel',
    checkedWeightLimit: '2x 23 kg (50 lbs) on transpacific routes to North America',
    notes: 'Taiwan carrier renowned for safety. Rigid test sizers at Taipei Taoyuan departure gates.'
  },
  {
    id: 'emirates',
    company: 'Emirates',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: 'Handbag or small briefcase up to 18 x 14 x 8 in',
    carryOnLimit: '22 x 15 x 8 in (55 x 38 x 20 cm), max 15.4 lbs (7 kg)',
    checkedLimit: 'Piece concept: 2 bags up to 50 lbs (23 kg) each in Economy',
    carryOnWeightLimit: '15.4 lbs (7 kg) Economy; 2 bags of 7 kg in Business',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Business/First',
    notes: 'Strict 7 kg (15.4 lb) carry-on limit weighed at departure counter for Economy class.'
  },
  {
    id: 'qantas',
    company: 'Qantas',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 small item (purse, laptop case) to fit under seat',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm), max 15.4 lbs (7 kg) per piece',
    checkedLimit: '62 linear in (158 cm), 66 lbs (30 kg) total or 2x 50 lbs (23 kg)',
    carryOnWeightLimit: 'Strict 15.4 lbs (7 kg) limit on Australian domestic and international flights',
    checkedWeightLimit: '30 kg (66 lbs) Economy; 40 kg (88 lbs) Business',
    notes: 'Australian domestic gates strictly weigh carry-on baggage. Ensure under 7 kg!'
  },
  {
    id: 'qatarairways',
    company: 'Qatar Airways',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 personal item (handbag, small briefcase) to fit under seat',
    carryOnLimit: '20 x 15 x 10 in (50 x 37 x 25 cm), max 15.4 lbs (7 kg)',
    checkedLimit: 'Piece concept: 2 bags up to 50 lbs (23 kg) each to/from Americas; 30 kg weight concept elsewhere',
    carryOnWeightLimit: '15.4 lbs (7 kg) Economy; 2 bags up to 33 lbs (15 kg) Business/First',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Business',
    notes: 'Award-winning Hamad International hub. Carry-on strictly limited to 7 kg in Economy.'
  },
  {
    id: 'etihad',
    company: 'Etihad Airways',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 personal item (briefcase, handbag) up to 11 lbs (5 kg)',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm), max 15.4 lbs (7 kg)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg) Economy (2-bag allowance on USA routes)',
    carryOnWeightLimit: '15.4 lbs (7 kg) Economy; 26.5 lbs (12 kg) Business',
    checkedWeightLimit: '23 kg (50 lbs) Economy; 32 kg (70 lbs) Business',
    notes: 'Abu Dhabi hub features US Customs and Border Protection preclearance facility.'
  },
  {
    id: 'airindia',
    company: 'Air India',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 personal item (laptop bag, handbag, blanket) max 6.6 lbs (3 kg)',
    carryOnLimit: '21.6 x 15.7 x 7.8 in (55 x 40 x 20 cm), max 15.4 lbs (7 kg)',
    checkedLimit: '62 linear in (158 cm), 2 pieces up to 50 lbs (23 kg) each on USA routes',
    carryOnWeightLimit: '15.4 lbs (7 kg) Economy; 26.4 lbs (12 kg) Executive',
    checkedWeightLimit: '2x 23 kg (50 lbs) Economy on long-haul routes',
    notes: 'Star Alliance member. Hand baggage weight is strictly verified at check-in counter.'
  },
  {
    id: 'asiana',
    company: 'Asiana Airlines',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '1 small personal item to store under front seat',
    carryOnLimit: 'Total 3 dimensions 45 in (115 cm), max 22 lbs (10 kg)',
    checkedLimit: '62 linear in (158 cm), 2 bags up to 50 lbs (23 kg) each on Americas routes',
    carryOnWeightLimit: '22 lbs (10 kg) Economy; 2 bags of 10 kg in Business',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Business',
    notes: 'Generous 10 kg (22 lb) carry-on limit compared to the standard 7 kg Asian airline average.'
  },
  {
    id: 'vietnamairlines',
    company: 'Vietnam Airlines',
    type: 'PLANE',
    region: 'Asia',
    personalLimit: '15.7 x 11.8 x 5.9 in (40 x 30 x 15 cm) up to 6.6 lbs (3 kg)',
    carryOnLimit: '22 x 14 x 9 in (56 x 36 x 23 cm)',
    checkedLimit: '62 linear in (158 cm), 50 lbs (23 kg)',
    carryOnWeightLimit: 'Combined carry-on + accessory: 26.4 lbs (12 kg) Economy; 40 lbs (18 kg) Business',
    checkedWeightLimit: '50 lbs (23 kg) Economy; 70 lbs (32 kg) Business',
    notes: 'SkyTeam member. 12 kg combined hand luggage limit is strictly enforced at Hanoi and Ho Chi Minh gates.'
  }
];

export const trainLimits: BaggageLimitInfo[] = [
  {
    id: 'amtrak',
    company: 'Amtrak',
    type: 'TRAIN',
    region: 'USA',
    personalLimit: '25 lbs (11 kg) max, 14 x 11 x 7 in - 2 items allowed free',
    carryOnLimit: '2 bags up to 50 lbs (23 kg) each, 28 x 22 x 14 in',
    checkedLimit: '2 free checked bags (up to 50 lbs each) on equipped routes',
    carryOnWeightLimit: '50 lbs (23 kg) each bag (2 bags allowed)',
    checkedWeightLimit: '50 lbs (23 kg) per bag up to 4 bags (first 2 free)',
    notes: 'Total free allowance: 2 personal items + 2 carry-on bags per passenger. Excess bags $20 each.'
  },
  {
    id: 'eurostar',
    company: 'Eurostar',
    type: 'TRAIN',
    region: 'Europe',
    personalLimit: '1 small piece (handbag, laptop bag, briefcase)',
    carryOnLimit: 'Standard: 2 pieces of luggage (up to 33.5 in / 85 cm on longest side)',
    checkedLimit: 'No checked luggage service (all bags travel with you)',
    carryOnWeightLimit: 'No weight limit (as long as you can lift and carry safely)',
    checkedWeightLimit: 'N/A',
    notes: 'No liquid volume restrictions on Eurostar! You may bring full-sized drinks and toiletries.'
  },
  {
    id: 'viarail',
    company: 'VIA Rail Canada',
    type: 'TRAIN',
    region: 'Canada',
    personalLimit: '1 personal item max 25 lbs (11.5 kg), 17 x 13 x 6 in',
    carryOnLimit: '1 large bag (50 lbs / 23 kg) or 2 medium bags (40 lbs each)',
    checkedLimit: 'Checked baggage service on select long-haul trains (max 50 lbs)',
    carryOnWeightLimit: '50 lbs (23 kg) single bag or 2x 40 lbs',
    checkedWeightLimit: '50 lbs (23 kg)',
    notes: 'Baggage allowances differ slightly between Corridor (Quebec City - Windsor) and regional sleeper trains.'
  },
  {
    id: 'brightline',
    company: 'Brightline (Florida)',
    type: 'TRAIN',
    region: 'USA',
    personalLimit: '1 personal item (fits under seat) free on all tickets',
    carryOnLimit: '24 x 12 x 12 in, max 48 lbs (included in PREMIUM, $10 SMART)',
    checkedLimit: '50 lbs max, 28 x 22 x 14 in ($25 fee or included in PREMIUM)',
    carryOnWeightLimit: '48 lbs (21.7 kg)',
    checkedWeightLimit: '50 lbs (22.6 kg)',
    notes: 'Level boarding makes luggage transport easy. Luggage check drop-off available at all station lobbies.'
  },
  {
    id: 'shinkansen',
    company: 'Japan Rail Shinkansen',
    type: 'TRAIN',
    region: 'Asia',
    personalLimit: 'Handbags, shopping bags, small daypacks fit on overhead rack or lap',
    carryOnLimit: 'Up to 2 pieces of baggage, max 30 kg each, total dimensions ≤ 160 cm',
    checkedLimit: 'Oversized baggage area reservation mandatory for 160-250 cm bags',
    carryOnWeightLimit: '30 kg (66 lbs) per piece, max 2 pieces',
    checkedWeightLimit: 'N/A - carry on board',
    notes: 'Luggage with total dimensions between 160 cm and 250 cm requires a seat reservation with an oversized baggage area (Tokaido/Sanyo/Kyushu Shinkansen).'
  }
];

export interface CarSpaceCapacity {
  sizeCategory: string;
  exampleVehicles: string;
  capacityLuggage: string;
  trunkVolumeCuFt: string;
  suitcaseCount: number;
  recommendations: string[];
}

export const carCapacities: CarSpaceCapacity[] = [
  {
    sizeCategory: 'Large SUV / Minivan',
    exampleVehicles: 'Chevy Suburban, Ford Expedition, Honda Odyssey, Toyota Sienna',
    capacityLuggage: '6 to 8 standard 24" suitcases + 4-6 backpacks',
    trunkVolumeCuFt: '35 - 42 cu ft (with 3rd row) / 80+ cu ft (folded)',
    suitcaseCount: 8,
    recommendations: [
      'Pack heaviest suitcases flat on the floor first.',
      'Leave soft backpacks for footwells and side crevices.',
      'Ensure the rear window view is not obstructed for driver safety.',
      'Keep emergency kit and first aid kit easily accessible on top.'
    ]
  },
  {
    sizeCategory: 'Mid-Size / Compact SUV',
    exampleVehicles: 'Toyota RAV4, Honda CR-V, Subaru Outback, Mazda CX-5',
    capacityLuggage: '3 to 5 standard 24" suitcases + 3 backpacks',
    trunkVolumeCuFt: '30 - 38 cu ft',
    suitcaseCount: 4,
    recommendations: [
      'Stand standard carry-ons vertically on their sides to maximize floor footprint.',
      'Use a cargo cover to conceal valuables during meal stops.',
      'Distribute weight evenly between left and right axles.'
    ]
  },
  {
    sizeCategory: 'Full-Size / Mid-Size Sedan',
    exampleVehicles: 'Toyota Camry, Honda Accord, Tesla Model 3, Hyundai Sonata',
    capacityLuggage: '2 to 3 standard suitcases + 2 duffels',
    trunkVolumeCuFt: '15 - 17 cu ft',
    suitcaseCount: 3,
    recommendations: [
      'Trunk lid arms require clearance; do not pack bags directly under hinge swings.',
      'Soft-sided duffels mold around wheel wells much better than hard-shell cases.'
    ]
  },
  {
    sizeCategory: 'Compact / Hatchback',
    exampleVehicles: 'Honda Civic, VW Golf, Toyota Corolla, Mini Cooper',
    capacityLuggage: '1 to 2 standard suitcases + 2 small backpacks',
    trunkVolumeCuFt: '11 - 14 cu ft',
    suitcaseCount: 2,
    recommendations: [
      'Fold split rear seat if traveling with 1-2 passengers.',
      'Use compression packing cubes to reduce total luggage volume.'
    ]
  }
];

export const tsa311Rules = {
  title: 'TSA 3-1-1 Liquids Rule (Security Checkpoint)',
  rule34oz: 'Containers must be 3.4 ounces (100 milliliters) or less per item.',
  rule1quart: 'All liquid containers must fit into ONE clear, quart-sized, zip-top plastic bag.',
  rule1bag: 'Only ONE quart-sized bag is allowed per passenger in carry-on luggage.',
  exemptions: [
    'Medications & inhalers (must be declared to TSA officer at checkpoint)',
    'Infant formula, breast milk, and baby food in reasonable quantities for children',
    'Duty-free liquids purchased after the security checkpoint (must be in tamper-evident bag)'
  ],
  lithiumBatteryRule: 'CRITICAL SAFETY RULE: Loose lithium-ion batteries and portable power banks MUST NEVER be placed in checked luggage. They must stay in your carry-on bag with terminals protected.'
};

export const TravelAllowanceData = {
  airlineLimits,
  trainLimits,
  carCapacities,
  tsa311Rules
};
