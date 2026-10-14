export interface DestinationSafetyIntel {
  destination: string;
  country: string;
  policeNumber: string;
  ambulanceNumber: string;
  fireNumber?: string;
  assistanceNumber: string;
  assistanceLabel: string;
  assistanceNotes: string;
}

/**
 * Audited, verified emergency contact directory for global travel hubs.
 * Removed any placeholder numbers (+1-800-TRIP).
 */
export const VERIFIED_SAFETY_DATA: Record<string, DestinationSafetyIntel> = {
  uk: {
    destination: 'United Kingdom',
    country: 'UK',
    policeNumber: '999 or 112',
    ambulanceNumber: '999 or 112',
    fireNumber: '999',
    assistanceNumber: '101 (Police) / 111 (NHS)',
    assistanceLabel: 'Non-Emergency Help',
    assistanceNotes: 'Dial 999 for emergencies (112 also works). Dial 101 for non-emergency police inquiries or 111 for urgent NHS medical advice.'
  },
  japan: {
    destination: 'Japan',
    country: 'Japan',
    policeNumber: '110',
    ambulanceNumber: '119',
    fireNumber: '119',
    assistanceNumber: '050-3816-2788',
    assistanceLabel: 'Japan Visitor Hotline',
    assistanceNotes: 'Dial 110 for police, 119 for ambulance/fire. The JNTO Japan Visitor Hotline (050-3816-2788) provides 24/7 tourist assistance in English.'
  },
  europe: {
    destination: 'European Union',
    country: 'EU',
    policeNumber: '112',
    ambulanceNumber: '112',
    fireNumber: '112',
    assistanceNumber: '112 (Universal EU)',
    assistanceLabel: 'EU Emergency Service',
    assistanceNotes: '112 is the pan-European emergency number, free of charge from any phone across all 27 EU member states.'
  },
  france: {
    destination: 'France',
    country: 'France',
    policeNumber: '17 or 112',
    ambulanceNumber: '15 (SAMU) or 112',
    fireNumber: '18',
    assistanceNumber: '112 (Multi-lingual EU)',
    assistanceLabel: 'Multi-lingual EU Emergency',
    assistanceNotes: 'Dial 17 for Police, 15 for SAMU Medical, or 112 from any mobile. Operators speak English and French.'
  },
  italy: {
    destination: 'Italy',
    country: 'Italy',
    policeNumber: '112 or 113',
    ambulanceNumber: '118 or 112',
    fireNumber: '115',
    assistanceNumber: '112 (Universal)',
    assistanceLabel: 'Universal Emergency & Police',
    assistanceNotes: 'Dial 112 for all emergencies in Italy (or 113 for Polizia di Stato, 118 for medical emergencies).'
  },
  spain: {
    destination: 'Spain',
    country: 'Spain',
    policeNumber: '112 (or 091)',
    ambulanceNumber: '112 (or 061)',
    fireNumber: '080',
    assistanceNumber: '902 102 112 (Tourist Police)',
    assistanceLabel: 'Foreign Tourist Police (SATE)',
    assistanceNotes: 'Dial 112 for general emergencies. Spain also offers a dedicated Foreign Tourist Attention Service (SATE) at 902 102 112.'
  },
  germany: {
    destination: 'Germany',
    country: 'Germany',
    policeNumber: '110',
    ambulanceNumber: '112',
    fireNumber: '112',
    assistanceNumber: '116 117 (On-Call Doctors)',
    assistanceLabel: 'Medical On-Call & Police',
    assistanceNotes: 'Dial 110 for Police, 112 for Fire/Ambulance. 116 117 connects to non-emergency on-call medical doctors.'
  },
  us: {
    destination: 'United States',
    country: 'USA',
    policeNumber: '911',
    ambulanceNumber: '911',
    fireNumber: '911',
    assistanceNumber: '311',
    assistanceLabel: 'Non-Emergency Services',
    assistanceNotes: 'Dial 911 for all immediate life-safety emergencies. Dial 311 in major cities for non-emergency municipal information.'
  },
  canada: {
    destination: 'Canada',
    country: 'Canada',
    policeNumber: '911',
    ambulanceNumber: '911',
    fireNumber: '911',
    assistanceNumber: '311 (or 811 Health)',
    assistanceLabel: 'Non-Emergency / HealthLink',
    assistanceNotes: 'Dial 911 for all immediate police, medical, or fire emergencies. Dial 811 for free provincial registered nurse health consultations.'
  },
  mexico: {
    destination: 'Mexico',
    country: 'Mexico',
    policeNumber: '911',
    ambulanceNumber: '911',
    fireNumber: '911',
    assistanceNumber: '078 (Ángeles Verdes)',
    assistanceLabel: 'Tourist Road Assistance',
    assistanceNotes: 'Dial 911 for all emergencies. Dial 078 for Ángeles Verdes (Green Angels) providing free bilingual tourist roadside assistance and travel advice.'
  },
  australia: {
    destination: 'Australia',
    country: 'Australia',
    policeNumber: '000 (Triple Zero)',
    ambulanceNumber: '000 (Triple Zero)',
    fireNumber: '000',
    assistanceNumber: '131 444',
    assistanceLabel: 'Police Assistance Line',
    assistanceNotes: 'Dial 000 for life-threatening emergencies. Dial 131 444 for non-urgent police assistance.'
  },
  newzealand: {
    destination: 'New Zealand',
    country: 'New Zealand',
    policeNumber: '111',
    ambulanceNumber: '111',
    fireNumber: '111',
    assistanceNumber: '105',
    assistanceLabel: 'Non-Emergency Police',
    assistanceNotes: 'Dial 111 for police, ambulance, or fire emergencies. Dial 105 for non-emergency police reporting.'
  }
};

/**
 * Resolve safety intel by city or country string
 */
export function getDestinationSafetyIntel(cityOrCountry?: string): DestinationSafetyIntel {
  if (!cityOrCountry) {
    return VERIFIED_SAFETY_DATA.us;
  }

  const q = cityOrCountry.toLowerCase();

  if (q.includes('uk') || q.includes('london') || q.includes('england') || q.includes('scotland') || q.includes('edinburgh') || q.includes('britain') || q.includes('manchester') || q.includes('belfast') || q.includes('wales')) {
    return VERIFIED_SAFETY_DATA.uk;
  }
  if (q.includes('japan') || q.includes('tokyo') || q.includes('kyoto') || q.includes('osaka') || q.includes('hokkaido')) {
    return VERIFIED_SAFETY_DATA.japan;
  }
  if (q.includes('france') || q.includes('paris') || q.includes('nice') || q.includes('lyon')) {
    return VERIFIED_SAFETY_DATA.france;
  }
  if (q.includes('italy') || q.includes('rome') || q.includes('milan') || q.includes('florence') || q.includes('venice')) {
    return VERIFIED_SAFETY_DATA.italy;
  }
  if (q.includes('spain') || q.includes('madrid') || q.includes('barcelona') || q.includes('seville') || q.includes('malaga')) {
    return VERIFIED_SAFETY_DATA.spain;
  }
  if (q.includes('germany') || q.includes('berlin') || q.includes('munich') || q.includes('frankfurt') || q.includes('hamburg')) {
    return VERIFIED_SAFETY_DATA.germany;
  }
  if (q.includes('canada') || q.includes('toronto') || q.includes('vancouver') || q.includes('montreal') || q.includes('calgary') || q.includes('ottawa')) {
    return VERIFIED_SAFETY_DATA.canada;
  }
  if (q.includes('mexico') || q.includes('cancun') || q.includes('cdmx') || q.includes('cabo') || q.includes('puerto vallarta')) {
    return VERIFIED_SAFETY_DATA.mexico;
  }
  if (q.includes('australia') || q.includes('sydney') || q.includes('melbourne') || q.includes('brisbane') || q.includes('perth')) {
    return VERIFIED_SAFETY_DATA.australia;
  }
  if (q.includes('new zealand') || q.includes('auckland') || q.includes('wellington') || q.includes('queenstown') || q.includes('christchurch')) {
    return VERIFIED_SAFETY_DATA.newzealand;
  }
  if (q.includes('europe') || q.includes('amsterdam') || q.includes('netherlands') || q.includes('belgium') || q.includes('switzerland') || q.includes('austria') || q.includes('greece') || q.includes('portugal') || q.includes('ireland')) {
    return VERIFIED_SAFETY_DATA.europe;
  }

  // Default to US/Universal standard
  return VERIFIED_SAFETY_DATA.us;
}
