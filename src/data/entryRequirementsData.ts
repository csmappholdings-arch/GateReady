// Static Entry Requirements Table for Canadian and US Passport Holders
// Brand rule: NEVER present static reference data as live or guaranteed.
// Every entry carries a last_verified date, official source links, and clear disclaimers.

export type PassportNationality = 'CA' | 'US';

export type VisaStatusType = 
  | 'VISA_FREE'
  | 'ETA_ESTA_REQUIRED'
  | 'VISA_ON_ARRIVAL'
  | 'VISA_ADVANCE_REQUIRED';

export interface EntryRequirementRecord {
  destinationCountry: string;
  countryCode: string; // ISO 2-letter
  aliases: string[]; // Cities, common names, regions
  ca: {
    visaStatusType: VisaStatusType;
    visaBadgeText: string;
    maxStay: string;
    passportValidityRule: string;
    officialSourceUrl: string;
    notes?: string;
  };
  us: {
    visaStatusType: VisaStatusType;
    visaBadgeText: string;
    maxStay: string;
    passportValidityRule: string;
    officialSourceUrl: string;
    notes?: string;
  };
  lastVerified: string;
}

export const ENTRY_REQUIREMENTS_DATABASE: EntryRequirementRecord[] = [
  // 1. UNITED STATES
  {
    destinationCountry: 'United States',
    countryCode: 'US',
    aliases: ['united states', 'usa', 'u.s.', 'america', 'new york', 'los angeles', 'miami', 'orlando', 'las vegas', 'chicago', 'san francisco', 'hawaii', 'honolulu', 'seattle', 'boston', 'texas', 'florida', 'california'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 180 days',
      maxStay: 'Up to 180 days (6 months)',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/united-states',
      notes: 'Canadian citizens do not need an ESTA for air travel directly entering the US. Ensure your return travel proof is available.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Domestic travel (No visa required)',
      maxStay: 'Unlimited (Home Country)',
      passportValidityRule: 'REAL ID compliant driver license or US Passport required for commercial domestic flights',
      officialSourceUrl: 'https://www.tsa.gov/real-id',
      notes: 'Domestic US travel requires valid government-issued photo ID (REAL ID or US Passport).'
    },
    lastVerified: 'October 15, 2026'
  },

  // 2. CANADA
  {
    destinationCountry: 'Canada',
    countryCode: 'CA',
    aliases: ['canada', 'toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'edmonton', 'quebec', 'banff', 'whistler', 'halifax', 'victoria'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Domestic travel (No visa required)',
      maxStay: 'Unlimited (Home Country)',
      passportValidityRule: 'Valid government photo ID required for domestic boarding',
      officialSourceUrl: 'https://travel.gc.ca',
      notes: 'Domestic Canadian flights require valid government photo ID.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 180 days',
      maxStay: 'Up to 180 days (6 months)',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Canada.html',
      notes: 'US citizens do not require an eTA to enter Canada by air with a valid US passport.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 3. MEXICO
  {
    destinationCountry: 'Mexico',
    countryCode: 'MX',
    aliases: ['mexico', 'cancun', 'mexico city', 'puerto vallarta', 'cabo', 'los cabos', 'tulum', 'cozumel', 'guadalajara', 'playa del carmen', 'riviera maya', 'oaxaca'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 180 days',
      maxStay: 'Up to 180 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/mexico',
      notes: 'Immigration entry form (FMM) issued electronically upon arrival at major international airports.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 180 days',
      maxStay: 'Up to 180 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Mexico.html',
      notes: 'Electronic entry stamp issued upon arrival. Keep digital entry record safely.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 4. UNITED KINGDOM
  {
    destinationCountry: 'United Kingdom',
    countryCode: 'GB',
    aliases: ['united kingdom', 'uk', 'great britain', 'britain', 'england', 'scotland', 'wales', 'northern ireland', 'london', 'manchester', 'edinburgh', 'glasgow', 'birmingham'],
    ca: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 180 days',
      maxStay: 'Up to 180 days (6 months)',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/united-kingdom',
      notes: 'UK Electronic Travel Authorisation (ETA) required before boarding. Apply via official UK ETA app (£10 fee).'
    },
    us: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 180 days',
      maxStay: 'Up to 180 days (6 months)',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/UnitedKingdom.html',
      notes: 'UK Electronic Travel Authorisation (ETA) required prior to travel. Valid for multiple entries over 2 years.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 5. FRANCE (Schengen)
  {
    destinationCountry: 'France',
    countryCode: 'FR',
    aliases: ['france', 'paris', 'nice', 'lyon', 'marseille', 'bordeaux', 'strasbourg', 'french riviera'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond intended departure date from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/france',
      notes: 'Passport must have been issued within the last 10 years. ETIAS authorization required once operational.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond departure date from Schengen Area (6 months recommended)',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/France.html',
      notes: 'Ensure passport has at least 2 blank pages and was issued within past 10 years.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 6. ITALY (Schengen)
  {
    destinationCountry: 'Italy',
    countryCode: 'IT',
    aliases: ['italy', 'rome', 'milan', 'florence', 'venice', 'naples', 'amalfi', 'sicily', 'bologna'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/italy',
      notes: 'Must declare presence if arriving from another Schengen country without border controls.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond date of departure from Schengen Area',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Italy.html',
      notes: 'Schengen 90/180-day rule strictly enforced across all Schengen member states.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 7. SPAIN (Schengen)
  {
    destinationCountry: 'Spain',
    countryCode: 'ES',
    aliases: ['spain', 'madrid', 'barcelona', 'seville', 'valencia', 'mallorca', 'ibiza', 'malaga', 'canary islands'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/spain',
      notes: 'Proof of accommodation and return travel funds may be requested by border officials.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure from Schengen Area',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Spain.html',
      notes: 'Ensure your passport is stamped upon initial entry into the Schengen zone.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 8. GERMANY (Schengen)
  {
    destinationCountry: 'Germany',
    countryCode: 'DE',
    aliases: ['germany', 'berlin', 'munich', 'frankfurt', 'hamburg', 'cologne', 'dusseldorf'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/germany',
      notes: 'Schengen 90/180 day calculator applies.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date from Schengen Area',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Germany.html',
      notes: 'Check passport expiry carefully; must have been issued within past 10 years.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 9. JAPAN
  {
    destinationCountry: 'Japan',
    countryCode: 'JP',
    aliases: ['japan', 'tokyo', 'kyoto', 'osaka', 'sapporo', 'fukuoka', 'okinawa', 'hiroshima', 'nagoya'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/japan',
      notes: 'Complete Visit Japan Web electronic customs & immigration declaration QR code prior to departure.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Japan.html',
      notes: 'Pre-register on Visit Japan Web to expedite airport immigration clearance at NRT/HND/KIX.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 10. SOUTH KOREA
  {
    destinationCountry: 'South Korea',
    countryCode: 'KR',
    aliases: ['south korea', 'korea', 'seoul', 'busan', 'incheon', 'jeju'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/korea-south',
      notes: 'K-ETA requirement currently exempted for Canadian passport holders for tourism until further notice.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/KoreaRepublicofSouthKorea.html',
      notes: 'K-ETA currently temporarily exempted for US passport holders. Confirm status prior to departure.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 11. AUSTRALIA
  {
    destinationCountry: 'Australia',
    countryCode: 'AU',
    aliases: ['australia', 'sydney', 'melbourne', 'brisbane', 'perth', 'cairns', 'gold coast', 'adelaide'],
    ca: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 90 days',
      maxStay: 'Up to 90 days per visit (valid 1 year)',
      passportValidityRule: 'Must be valid for duration of intended stay (6 months recommended)',
      officialSourceUrl: 'https://travel.gc.ca/destinations/australia',
      notes: 'Electronic Travel Authority (subclass 601) is MANDATORY before boarding. Apply via Australian ETA smartphone app.'
    },
    us: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 90 days',
      maxStay: 'Up to 90 days per visit (valid 12 months)',
      passportValidityRule: 'Must be valid for duration of intended stay (6 months recommended)',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Australia.html',
      notes: 'US citizens must obtain an Electronic Travel Authority (ETA) via the Australian ETA App prior to airport check-in.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 12. NEW ZEALAND
  {
    destinationCountry: 'New Zealand',
    countryCode: 'NZ',
    aliases: ['new zealand', 'auckland', 'wellington', 'christchurch', 'queenstown'],
    ca: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/new-zealand',
      notes: 'NZeTA (New Zealand Electronic Travel Authority) and IVL tourism conservation levy must be approved before flight.'
    },
    us: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/NewZealand.html',
      notes: 'Apply for NZeTA through the official government app or website prior to travel.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 13. CHINA
  {
    destinationCountry: 'China',
    countryCode: 'CN',
    aliases: ['china', 'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'xian'],
    ca: {
      visaStatusType: 'VISA_ADVANCE_REQUIRED',
      visaBadgeText: 'Visa required — apply in advance',
      maxStay: 'Varies by visa type (typically 30-60 days)',
      passportValidityRule: 'Must be valid at least 6 months beyond intended stay with 2 blank pages',
      officialSourceUrl: 'https://travel.gc.ca/destinations/china',
      notes: 'Visa required in advance. 144-hour visa-free transit is available for eligible transit flights to a 3rd country.'
    },
    us: {
      visaStatusType: 'VISA_ADVANCE_REQUIRED',
      visaBadgeText: 'Visa required — apply in advance',
      maxStay: 'Varies by visa issued (10-year multi-entry typically allows 60 days per stay)',
      passportValidityRule: 'Must be valid at least 6 months with minimum 2 blank pages',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/China.html',
      notes: 'Apply in advance at Chinese visa application service centers. Check 144-hour transit rules if connecting.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 14. INDIA
  {
    destinationCountry: 'India',
    countryCode: 'IN',
    aliases: ['india', 'delhi', 'new delhi', 'mumbai', 'bengaluru', 'bangalore', 'goa', 'jaipur', 'chennai', 'hyderabad'],
    ca: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — apply online',
      maxStay: '30 days to 90 days (depending on e-Visa category)',
      passportValidityRule: 'Must be valid at least 6 months from arrival date with 2 blank pages',
      officialSourceUrl: 'https://travel.gc.ca/destinations/india',
      notes: 'Indian e-Visa must be applied online at least 4 days in advance and printed before airport check-in.'
    },
    us: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — apply online',
      maxStay: 'Up to 90 days per visit (1-year or 5-year tourist e-Visa allows 180 days/year)',
      passportValidityRule: 'Must be valid at least 6 months from arrival date with 2 blank pages',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/India.html',
      notes: 'Electronic Travel Authorization (e-Visa) must be obtained online prior to departure.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 15. VIETNAM
  {
    destinationCountry: 'Vietnam',
    countryCode: 'VN',
    aliases: ['vietnam', 'hanoi', 'ho chi minh city', 'saigon', 'da nang', 'hoi an', 'phu quoc'],
    ca: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 90 days',
      maxStay: 'Up to 90 days (Single or Multiple Entry eVisa)',
      passportValidityRule: 'Must be valid at least 6 months beyond arrival date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/vietnam',
      notes: 'Electronic Visa (eVisa) is mandatory before departure. Apply through official immigration portal.'
    },
    us: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months beyond arrival date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Vietnam.html',
      notes: 'Apply for official eVisa online prior to travel; print paper copy for check-in and border control.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 16. THAILAND
  {
    destinationCountry: 'Thailand',
    countryCode: 'TH',
    aliases: ['thailand', 'bangkok', 'phuket', 'chiang mai', 'koh samui', 'pattaya', 'krabi'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 60 days',
      maxStay: 'Up to 60 days (extendable by 30 days in-country)',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/thailand',
      notes: 'Thailand expanded visa exemption to 60 days for Canadian tourists. Proof of onward flight may be requested.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 60 days',
      maxStay: 'Up to 60 days',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Thailand.html',
      notes: 'Visa exemption scheme allows 60 days. Airlines may deny boarding without proof of onward travel within 60 days.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 17. INDONESIA (Bali)
  {
    destinationCountry: 'Indonesia',
    countryCode: 'ID',
    aliases: ['indonesia', 'bali', 'jakarta', 'denpasar', 'ubud', 'lombok', 'surabaya'],
    ca: {
      visaStatusType: 'VISA_ON_ARRIVAL',
      visaBadgeText: 'Visa on arrival — 30 days',
      maxStay: '30 days (extendable once for 30 days)',
      passportValidityRule: 'Must be valid at least 6 months from entry date with blank pages',
      officialSourceUrl: 'https://travel.gc.ca/destinations/indonesia',
      notes: 'Electronic Visa on Arrival (e-VOA) available online before departure (500,000 IDR ~$35 USD) or at airport.'
    },
    us: {
      visaStatusType: 'VISA_ON_ARRIVAL',
      visaBadgeText: 'Visa on arrival — 30 days',
      maxStay: '30 days (extendable once)',
      passportValidityRule: 'Must be valid at least 6 months from entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Indonesia.html',
      notes: 'Pay Visa on Arrival fee (500,000 IDR) at airport or apply for e-VOA online prior to flight.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 18. SINGAPORE
  {
    destinationCountry: 'Singapore',
    countryCode: 'SG',
    aliases: ['singapore', 'changi'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months beyond date of arrival',
      officialSourceUrl: 'https://travel.gc.ca/destinations/singapore',
      notes: 'SG Arrival Card electronic declaration (free) must be submitted within 3 days prior to arrival.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months from arrival date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Singapore.html',
      notes: 'Submit SG Arrival Card online prior to landing. Chewing gum and e-cigarettes are strictly illegal.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 19. UNITED ARAB EMIRATES (Dubai / Abu Dhabi)
  {
    destinationCountry: 'United Arab Emirates',
    countryCode: 'AE',
    aliases: ['united arab emirates', 'uae', 'dubai', 'abu dhabi', 'sharjah'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: '30 days on arrival (free entry stamp)',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/united-arab-emirates',
      notes: 'Free 30-day tourist entry stamp issued upon arrival at airport.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: '30 days on arrival (free entry stamp)',
      passportValidityRule: 'Must be valid at least 6 months from entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/UnitedArabEmirates.html',
      notes: 'US citizens receive a free 30-day visit visa on arrival.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 20. DOMINICAN REPUBLIC
  {
    destinationCountry: 'Dominican Republic',
    countryCode: 'DO',
    aliases: ['dominican republic', 'punta cana', 'santo domingo', 'puerto plata', 'la romana'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: 'Up to 30 days (tourist fee included in airline ticket)',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/dominican-republic',
      notes: 'Must fill out free electronic entry/exit ticket (e-Ticket) online prior to airport check-in.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: 'Up to 30 days',
      passportValidityRule: 'Must be valid for duration of stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/DominicanRepublic.html',
      notes: 'Mandatory digital e-Ticket required for both arrival and departure.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 21. COSTA RICA
  {
    destinationCountry: 'Costa Rica',
    countryCode: 'CR',
    aliases: ['costa rica', 'san jose', 'liberia', 'arenal', 'manuel antonio', 'guanacaste'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 180 days',
      maxStay: 'Up to 180 days',
      passportValidityRule: 'Must be valid for at least 1 day beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/costa-rica',
      notes: 'Proof of return or onward ticket is strictly verified by airlines before boarding.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 180 days',
      maxStay: 'Up to 180 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/CostaRica.html',
      notes: 'Return ticket mandatory. Visa-free stay duration granted up to 180 days at discretion of immigration.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 22. JAMAICA
  {
    destinationCountry: 'Jamaica',
    countryCode: 'JM',
    aliases: ['jamaica', 'montego bay', 'kingston', 'negril', 'ocho rios'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/jamaica',
      notes: 'Complete the mandatory online C5 Passenger Declaration Form prior to flight.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Jamaica.html',
      notes: 'Online C5 entry card must be filled out before arrival.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 23. BAHAMAS
  {
    destinationCountry: 'Bahamas',
    countryCode: 'BS',
    aliases: ['bahamas', 'nassau', 'freeport', 'exuma', 'bimini'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 8 months',
      maxStay: 'Up to 8 months for Canadian tourists',
      passportValidityRule: 'Must be valid at least 3 months beyond departure date (6 months recommended)',
      officialSourceUrl: 'https://travel.gc.ca/destinations/bahamas',
      notes: 'Proof of return ticket required.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days (can be extended to 8 months)',
      passportValidityRule: 'Must be valid for duration of stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Bahamas.html',
      notes: 'Return ticket required for entry.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 24. BRAZIL
  {
    destinationCountry: 'Brazil',
    countryCode: 'BR',
    aliases: ['brazil', 'brasil', 'rio de janeiro', 'sao paulo', 'salvador', 'brasilia', 'fortaleza'],
    ca: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — apply online',
      maxStay: 'Up to 90 days per year',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/brazil',
      notes: 'Brazil e-Visa required for Canadian citizens. Apply through official portal before flight.'
    },
    us: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — apply online',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Brazil.html',
      notes: 'Official Brazil e-Visa required for US tourists prior to boarding.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 25. COLOMBIA
  {
    destinationCountry: 'Colombia',
    countryCode: 'CO',
    aliases: ['colombia', 'bogota', 'medellin', 'cartagena', 'cali', 'santa marta'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days (extendable up to 180 days per year)',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/colombia',
      notes: 'Mandatory Check-Mig registration form must be submitted online 24 to 1 hour before flight.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Colombia.html',
      notes: 'Submit Check-Mig form prior to check-in.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 26. PERU
  {
    destinationCountry: 'Peru',
    countryCode: 'PE',
    aliases: ['peru', 'lima', 'cusco', 'machu picchu', 'arequipa'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days (set by immigration officer at entry)',
      passportValidityRule: 'Must be valid at least 6 months from entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/peru',
      notes: 'Immigration official stamps allowed length of stay (usually 30 to 90 days).'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months from entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Peru.html',
      notes: 'Ensure your passport is stamped on arrival; keep receipt safely.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 27. TURKEY (Türkiye)
  {
    destinationCountry: 'Turkey',
    countryCode: 'TR',
    aliases: ['turkey', 'turkiye', 'türkiye', 'istanbul', 'antalya', 'cappadocia', 'ankara', 'izmir', 'bodrum'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/turkiye',
      notes: 'Turkey abolished visas for Canadian tourists. Passport must have at least 150 days validity from arrival.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Turkiye.html',
      notes: 'US passport holders are exempt from tourist visa requirements for stays up to 90 days.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 28. GREECE (Schengen)
  {
    destinationCountry: 'Greece',
    countryCode: 'GR',
    aliases: ['greece', 'athens', 'santorini', 'mykonos', 'crete', 'rhodes', 'corfu'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/greece',
      notes: 'Schengen 90-day tourist limitation applies across all European Schengen countries combined.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date from Schengen Area',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Greece.html',
      notes: 'Schengen calculation applies.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 29. PORTUGAL (Schengen)
  {
    destinationCountry: 'Portugal',
    countryCode: 'PT',
    aliases: ['portugal', 'lisbon', 'porto', 'algarve', 'madeira', 'azores'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/portugal',
      notes: 'Schengen member state rules apply.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure from Schengen Area',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Portugal.html',
      notes: 'Ensure entry stamp is obtained at first Schengen airport.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 30. NETHERLANDS (Schengen)
  {
    destinationCountry: 'Netherlands',
    countryCode: 'NL',
    aliases: ['netherlands', 'holland', 'amsterdam', 'rotterdam', 'the hague', 'utrecht'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/netherlands',
      notes: 'Schengen 90/180-day allowance applies.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond planned departure date from Schengen Area',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Netherlands.html',
      notes: 'Schengen member state.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 31. SWITZERLAND (Schengen)
  {
    destinationCountry: 'Switzerland',
    countryCode: 'CH',
    aliases: ['switzerland', 'zurich', 'geneva', 'basel', 'bern', 'lucerne', 'zermatt', 'interlaken'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond intended departure from Schengen Area',
      officialSourceUrl: 'https://travel.gc.ca/destinations/switzerland',
      notes: 'Switzerland participates in the Schengen border-free zone.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: '90 days within any 180-day period (Schengen Area)',
      passportValidityRule: 'Must be valid at least 3 months beyond intended departure from Schengen Area',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Switzerland.html',
      notes: 'Schengen agreement rules apply.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 32. IRELAND
  {
    destinationCountry: 'Ireland',
    countryCode: 'IE',
    aliases: ['ireland', 'dublin', 'cork', 'galway', 'shannon', 'belfast'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days (not part of Schengen zone)',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.gc.ca/destinations/ireland',
      notes: 'Ireland is NOT in the Schengen Area. Stays in Ireland do NOT count toward Schengen 90-day limit.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days (outside Schengen)',
      passportValidityRule: 'Must be valid for duration of intended stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Ireland.html',
      notes: 'Ireland maintains independent immigration from Schengen zone.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 33. EGYPT
  {
    destinationCountry: 'Egypt',
    countryCode: 'EG',
    aliases: ['egypt', 'cairo', 'giza', 'luxor', 'aswan', 'sharm el sheikh', 'hurghada'],
    ca: {
      visaStatusType: 'VISA_ADVANCE_REQUIRED',
      visaBadgeText: 'Visa required — apply in advance',
      maxStay: '30 days',
      passportValidityRule: 'Must be valid at least 6 months beyond arrival date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/egypt',
      notes: 'Egyptian government requires Canadian passport holders to obtain an entry visa at an embassy/consulate prior to arrival.'
    },
    us: {
      visaStatusType: 'VISA_ON_ARRIVAL',
      visaBadgeText: 'Visa on arrival — 30 days',
      maxStay: '30 days',
      passportValidityRule: 'Must be valid at least 6 months beyond arrival date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Egypt.html',
      notes: 'Visa on arrival available at airports ($25 USD cash) or apply via official Egyptian e-Visa portal.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 34. SOUTH AFRICA
  {
    destinationCountry: 'South Africa',
    countryCode: 'ZA',
    aliases: ['south africa', 'cape town', 'johannesburg', 'durban', 'kruger'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 30 days beyond departure date with 2 consecutive blank visa pages',
      officialSourceUrl: 'https://travel.gc.ca/destinations/south-africa',
      notes: 'Strict passport requirement: Must have at least 2 entirely blank unstamped visa pages facing each other.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 30 days beyond intended departure date with 2 blank pages',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/SouthAfrica.html',
      notes: 'Airlines will strictly deny boarding without 2 consecutive blank visa pages.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 35. MOROCCO
  {
    destinationCountry: 'Morocco',
    countryCode: 'MA',
    aliases: ['morocco', 'marrakech', 'casablanca', 'rabat', 'fez', 'fes', 'tangier'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 3 months beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/morocco',
      notes: 'Ensure your entry stamp (with entry registration number) is clearly placed in your passport upon arrival.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of stay (6 months recommended)',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Morocco.html',
      notes: 'Keep entry stamp intact for departure.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 36. TAIWAN
  {
    destinationCountry: 'Taiwan',
    countryCode: 'TW',
    aliases: ['taiwan', 'taipei', 'kaohsiung', 'taichung'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of intended stay (6 months recommended)',
      officialSourceUrl: 'https://travel.gc.ca/destinations/taiwan',
      notes: 'Return or onward flight ticket required before boarding.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid for duration of stay',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Taiwan.html',
      notes: 'Proof of onward travel required.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 37. PHILIPPINES
  {
    destinationCountry: 'Philippines',
    countryCode: 'PH',
    aliases: ['philippines', 'manila', 'cebu', 'boracay', 'palawan'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: 'Up to 30 days (extendable in-country)',
      passportValidityRule: 'Must be valid at least 6 months beyond arrival date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/philippines',
      notes: 'Mandatory registration on official eTravel portal within 72 hours prior to arrival.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: 'Up to 30 days',
      passportValidityRule: 'Must be valid at least 6 months beyond arrival date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Philippines.html',
      notes: 'Complete eTravel declaration online before flight.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 38. MALAYSIA
  {
    destinationCountry: 'Malaysia',
    countryCode: 'MY',
    aliases: ['malaysia', 'kuala lumpur', 'penang', 'langkawi', 'borneo', 'kota kinabalu'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/malaysia',
      notes: 'Mandatory Malaysia Digital Arrival Card (MDAC) must be registered online within 3 days prior to arrival.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 90 days',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Malaysia.html',
      notes: 'Register MDAC card online prior to landing.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 39. KENYA
  {
    destinationCountry: 'Kenya',
    countryCode: 'KE',
    aliases: ['kenya', 'nairobi', 'mombasa', 'masai mara', 'safari'],
    ca: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — apply online',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months with 2 blank pages',
      officialSourceUrl: 'https://travel.gc.ca/destinations/kenya',
      notes: 'Kenya Electronic Travel Authorisation (eTA) is mandatory for all visitors before boarding. Apply via official portal.'
    },
    us: {
      visaStatusType: 'ETA_ESTA_REQUIRED',
      visaBadgeText: 'eTA required before travel — apply online',
      maxStay: 'Up to 90 days',
      passportValidityRule: 'Must be valid at least 6 months with 2 blank pages',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Kenya.html',
      notes: 'All travelers must obtain Kenya eTA before flight departure.'
    },
    lastVerified: 'October 15, 2026'
  },

  // 40. QATAR
  {
    destinationCountry: 'Qatar',
    countryCode: 'QA',
    aliases: ['qatar', 'doha'],
    ca: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: '30 days on arrival (free entry stamp)',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.gc.ca/destinations/qatar',
      notes: 'Free visa waiver issued on arrival for Canadian citizens.'
    },
    us: {
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Visa-free — up to 30 days',
      maxStay: '30 days on arrival',
      passportValidityRule: 'Must be valid at least 6 months beyond entry date',
      officialSourceUrl: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Qatar.html',
      notes: 'US citizens receive 30-day visa waiver upon arrival.'
    },
    lastVerified: 'October 15, 2026'
  }
];

export interface ResolvedEntryRequirement {
  destinationFound: boolean;
  matchedDestinationName: string;
  passportNationality: PassportNationality;
  passportLabel: string;
  passportValidityRule: string;
  visaStatusType: VisaStatusType;
  visaBadgeText: string;
  maxStay: string;
  officialSourceUrl: string;
  notes?: string;
  lastVerified: string;
  disclaimer: string;
}

/**
 * Resolves static entry requirements for a given destination text and passport.
 * If destination is not recognized in static database, returns a graceful fallback pointing to travel.gc.ca or travel.state.gov.
 */
export function getEntryRequirements(
  destinationText: string | undefined,
  passportNationality: PassportNationality = 'CA'
): ResolvedEntryRequirement {
  const isCa = passportNationality === 'CA';
  const passportLabel = isCa ? 'Canadian Passport' : 'U.S. Passport';
  const defaultFallbackUrl = isCa 
    ? 'https://travel.gc.ca/travelling/advisories' 
    : 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages.html';

  if (!destinationText || !destinationText.trim() || destinationText.trim().length < 2) {
    return {
      destinationFound: false,
      matchedDestinationName: 'Unknown Destination',
      passportNationality,
      passportLabel,
      passportValidityRule: 'Set your destination city or country to check passport validity rules',
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Destination required',
      maxStay: 'Set destination',
      officialSourceUrl: defaultFallbackUrl,
      lastVerified: 'October 15, 2026',
      disclaimer: 'Reference only — entry rules change. Always confirm with official government sources before you travel.'
    };
  }

  const query = destinationText.toLowerCase().trim();

  // Search static database
  const match = ENTRY_REQUIREMENTS_DATABASE.find((item) => {
    return (
      item.destinationCountry.toLowerCase() === query ||
      query.includes(item.destinationCountry.toLowerCase()) ||
      item.destinationCountry.toLowerCase().includes(query) ||
      item.aliases.some((alias) => query.includes(alias) || alias.includes(query))
    );
  });

  if (!match) {
    // Graceful fallback for destinations not in top tables
    return {
      destinationFound: false,
      matchedDestinationName: destinationText.trim(),
      passportNationality,
      passportLabel,
      passportValidityRule: isCa
        ? `We don't have entry data for ${destinationText.trim()} yet — check travel.gc.ca.`
        : `We don't have entry data for ${destinationText.trim()} yet — check travel.state.gov.`,
      visaStatusType: 'VISA_FREE',
      visaBadgeText: 'Check official advisory',
      maxStay: 'Refer to government portal',
      officialSourceUrl: isCa 
        ? `https://travel.gc.ca/destinations/${encodeURIComponent(destinationText.toLowerCase().trim().replace(/\s+/g, '-'))}`
        : defaultFallbackUrl,
      lastVerified: 'October 15, 2026',
      notes: `Official government travel advisories provide the most up-to-date entry regulations, required visa forms, and validity rules.`,
      disclaimer: 'Reference only — entry rules change. Always confirm with official government sources before you travel.'
    };
  }

  const info = isCa ? match.ca : match.us;

  return {
    destinationFound: true,
    matchedDestinationName: match.destinationCountry,
    passportNationality,
    passportLabel,
    passportValidityRule: info.passportValidityRule,
    visaStatusType: info.visaStatusType,
    visaBadgeText: info.visaBadgeText,
    maxStay: info.maxStay,
    officialSourceUrl: info.officialSourceUrl,
    notes: info.notes,
    lastVerified: match.lastVerified,
    disclaimer: 'Reference only — entry rules change. Always confirm with official government sources before you travel.'
  };
}
