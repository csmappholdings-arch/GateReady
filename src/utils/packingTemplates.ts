export interface PackingTemplateItem {
  name: string;
  category: string;
  defaultQty: number;
  weightLbs?: number;
}

export interface PackingTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  tag: string;
  iconName: string;
  isCustom?: boolean;
  items: PackingTemplateItem[];
}

export const PRESET_PACKING_TEMPLATES: PackingTemplate[] = [
  {
    id: 'tpl_weekend_getaway',
    title: 'Weekend Getaway (3 Days)',
    description: 'Ultra-light personal item and carry-on packing for a fast 48-72h trip.',
    category: 'Short Trip',
    tag: '3 Days · Carry-On',
    iconName: 'Compass',
    items: [
      { name: 'Casual T-Shirts', category: 'Clothing', defaultQty: 3, weightLbs: 0.4 },
      { name: 'Pants / Jeans', category: 'Clothing', defaultQty: 1, weightLbs: 1.2 },
      { name: 'Underwear & Socks', category: 'Clothing', defaultQty: 3, weightLbs: 0.15 },
      { name: 'Light Sweater / Cardigan', category: 'Clothing', defaultQty: 1, weightLbs: 0.9 },
      { name: 'Pajamas / Sleepwear', category: 'Clothing', defaultQty: 1, weightLbs: 0.5 },
      { name: 'Toothbrush & Travel Toothpaste', category: 'Toiletries', defaultQty: 1, weightLbs: 0.2 },
      { name: 'Travel Deodorant', category: 'Toiletries', defaultQty: 1, weightLbs: 0.25 },
      { name: 'Phone Charger & Cable', category: 'Electronics', defaultQty: 1, weightLbs: 0.3 },
      { name: 'Portable Battery Bank (Under 100Wh)', category: 'Electronics', defaultQty: 1, weightLbs: 0.5 },
      { name: 'Driver License / ID & Boarding Pass', category: 'Documents', defaultQty: 1, weightLbs: 0.05 }
    ]
  },
  {
    id: 'tpl_business_trip',
    title: 'Business Trip (Corporate)',
    description: 'Wrinkle-resistant professional wardrobe, laptop gear, and hotel essentials.',
    category: 'Work',
    tag: '4 Days · Smart Carry-On',
    iconName: 'Briefcase',
    items: [
      { name: 'Dress Shirts / Blouses', category: 'Clothing', defaultQty: 3, weightLbs: 0.6 },
      { name: 'Dress Slacks / Skirt', category: 'Clothing', defaultQty: 2, weightLbs: 1.1 },
      { name: 'Blazer / Suit Jacket', category: 'Clothing', defaultQty: 1, weightLbs: 1.8 },
      { name: 'Dress Shoes (Polished)', category: 'Footwear', defaultQty: 1, weightLbs: 2.2 },
      { name: 'Underwear & Dress Socks', category: 'Clothing', defaultQty: 4, weightLbs: 0.2 },
      { name: 'Laptop & Heavy Duty Charger', category: 'Electronics', defaultQty: 1, weightLbs: 3.5 },
      { name: 'Presentation Clicker & HDMI Adapter', category: 'Electronics', defaultQty: 1, weightLbs: 0.25 },
      { name: 'TSA 3-1-1 Toiletry Kit', category: 'Toiletries', defaultQty: 1, weightLbs: 1.1 },
      { name: 'Noise-Cancelling Headphones', category: 'Electronics', defaultQty: 1, weightLbs: 0.7 },
      { name: 'Business Cards & Pen', category: 'Documents', defaultQty: 1, weightLbs: 0.1 }
    ]
  },
  {
    id: 'tpl_seven_day_vacation',
    title: '7-Day Vacation (1 Week)',
    description: 'Balanced week-long wardrobe with room for one pair of backup shoes and mix-and-match layers.',
    category: 'Vacation',
    tag: '7 Days · 1 Checked Bag',
    iconName: 'Calendar',
    items: [
      { name: 'Daily Tops & Shirts', category: 'Clothing', defaultQty: 7, weightLbs: 0.45 },
      { name: 'Casual Pants / Shorts', category: 'Clothing', defaultQty: 4, weightLbs: 1.0 },
      { name: 'Underwear Sets', category: 'Clothing', defaultQty: 8, weightLbs: 0.15 },
      { name: 'Light Jackets / Hoodies', category: 'Clothing', defaultQty: 2, weightLbs: 1.2 },
      { name: 'Walking Sneakers', category: 'Footwear', defaultQty: 1, weightLbs: 1.8 },
      { name: 'Evening / Dinner Outfit', category: 'Clothing', defaultQty: 2, weightLbs: 1.0 },
      { name: 'Shampoo & Conditioner Bottles (<100ml)', category: 'Toiletries', defaultQty: 2, weightLbs: 0.4 },
      { name: 'Sunscreen & Lip Balm', category: 'Toiletries', defaultQty: 1, weightLbs: 0.35 },
      { name: 'First Aid & Prescription Medications', category: 'Medication', defaultQty: 1, weightLbs: 0.5 },
      { name: 'E-Reader / Tablet & Charger', category: 'Electronics', defaultQty: 1, weightLbs: 1.1 }
    ]
  },
  {
    id: 'tpl_international_holiday',
    title: 'International Holiday (10-14 Days)',
    description: 'Long-haul travel checklist with international plug converters, currency, passports, and flight comfort.',
    category: 'International',
    tag: '14 Days · Worldwide',
    iconName: 'Globe',
    items: [
      { name: 'Valid Passport (6+ Months Validity)', category: 'Documents', defaultQty: 1, weightLbs: 0.1 },
      { name: 'Universal Travel Plug Adapter (UK/EU/AU)', category: 'Electronics', defaultQty: 2, weightLbs: 0.45 },
      { name: 'In-Flight Neck Pillow & Eye Mask', category: 'Travel essentials', defaultQty: 1, weightLbs: 0.6 },
      { name: 'Compression Flight Socks', category: 'Clothing', defaultQty: 2, weightLbs: 0.2 },
      { name: 'Prescription Meds with Pharmacy Labels', category: 'Medication', defaultQty: 1, weightLbs: 0.5 },
      { name: 'Physical Backup Credit Cards & FX Cash', category: 'Documents', defaultQty: 1, weightLbs: 0.1 },
      { name: 'Multi-Climate Layering Jackets', category: 'Clothing', defaultQty: 2, weightLbs: 1.5 },
      { name: 'Comfortable Long-Distance Walking Shoes', category: 'Footwear', defaultQty: 1, weightLbs: 2.0 },
      { name: 'Daypack for City Sightseeing', category: 'Accessories', defaultQty: 1, weightLbs: 0.8 },
      { name: 'Luggage AirTags / Tracking Devices', category: 'Travel essentials', defaultQty: 2, weightLbs: 0.1 }
    ]
  },
  {
    id: 'tpl_family_vacation',
    title: 'Family Vacation (Kids & Parents)',
    description: 'Family packing list with games, snacks, child essentials, baby wipes, and shared medical kit.',
    category: 'Family',
    tag: 'Multi-Traveler · Family',
    iconName: 'Users',
    items: [
      { name: "Children's Clothing Sets (Extra Tops)", category: 'Baby and children\'s items', defaultQty: 8, weightLbs: 0.3 },
      { name: 'Baby / Toddler Wet Wipes (TSA Compliant)', category: 'Baby and children\'s items', defaultQty: 2, weightLbs: 0.8 },
      { name: 'Kids Tablet + Kid-Safe Headphones', category: 'Baby and children\'s items', defaultQty: 2, weightLbs: 1.4 },
      { name: 'Travel Games, Coloring Books & Crayons', category: 'Baby and children\'s items', defaultQty: 1, weightLbs: 0.9 },
      { name: 'Family First Aid (Bandages, Children Tylenol)', category: 'Medication', defaultQty: 1, weightLbs: 0.7 },
      { name: 'Airport Snack Pouches & Reusable Straws', category: 'Travel essentials', defaultQty: 4, weightLbs: 0.5 },
      { name: 'Parents Wardrobe & Activewear', category: 'Clothing', defaultQty: 10, weightLbs: 4.5 },
      { name: 'Backup Outfits in Carry-On (for Accidental Spills)', category: 'Clothing', defaultQty: 2, weightLbs: 1.0 },
      { name: 'Ziploc Bags for Damp Clothes', category: 'Miscellaneous', defaultQty: 5, weightLbs: 0.1 },
      { name: 'Nightlight / Sound Machine', category: 'Baby and children\'s items', defaultQty: 1, weightLbs: 0.4 }
    ]
  },
  {
    id: 'tpl_beach_holiday',
    title: 'Beach & Warm Resort Holiday',
    description: 'Swimwear, reef-safe sunscreens, sun hats, sandals, and waterproof dry pouches.',
    category: 'Warm Weather',
    tag: 'Sun & Sea · Resort',
    iconName: 'Sun',
    items: [
      { name: 'Swimsuits / Board Shorts', category: 'Clothing', defaultQty: 3, weightLbs: 0.4 },
      { name: 'Beach Cover-Up / Linen Shirt', category: 'Clothing', defaultQty: 2, weightLbs: 0.6 },
      { name: 'Reef-Safe High SPF Sunscreen', category: 'Toiletries', defaultQty: 2, weightLbs: 0.7 },
      { name: 'Polarized Sunglasses & Case', category: 'Accessories', defaultQty: 1, weightLbs: 0.2 },
      { name: 'Wide-Brim Sun Hat', category: 'Accessories', defaultQty: 1, weightLbs: 0.4 },
      { name: 'Waterproof Phone Dry Bag', category: 'Accessories', defaultQty: 1, weightLbs: 0.2 },
      { name: 'Flip Flops & Water Shoes', category: 'Footwear', defaultQty: 2, weightLbs: 1.2 },
      { name: 'After-Sun Aloe Vera Gel', category: 'Toiletries', defaultQty: 1, weightLbs: 0.4 },
      { name: 'Light Beach Tote Bag', category: 'Accessories', defaultQty: 1, weightLbs: 0.6 }
    ]
  },
  {
    id: 'tpl_camping_trip',
    title: 'Camping & Outdoor Adventure',
    description: 'Rugged outdoor gear, headlamps, hiking socks, thermal layers, and bug repellent.',
    category: 'Outdoor',
    tag: 'Hiking · Adventure',
    iconName: 'Tent',
    items: [
      { name: 'Moisture-Wicking Base Layers', category: 'Clothing', defaultQty: 3, weightLbs: 0.6 },
      { name: 'Merino Wool Hiking Socks', category: 'Clothing', defaultQty: 4, weightLbs: 0.3 },
      { name: 'Waterproof Rain Shell / Poncho', category: 'Clothing', defaultQty: 1, weightLbs: 1.1 },
      { name: 'Hiking Boots / Trail Runners', category: 'Footwear', defaultQty: 1, weightLbs: 2.8 },
      { name: 'LED Headlamp + Extra Batteries', category: 'Electronics', defaultQty: 1, weightLbs: 0.35 },
      { name: 'DEET Insect Repellent (Wipes or Non-Aerosol)', category: 'Toiletries', defaultQty: 1, weightLbs: 0.4 },
      { name: 'Quick-Dry Microfiber Camp Towel', category: 'Travel essentials', defaultQty: 1, weightLbs: 0.4 },
      { name: 'Insulated Water Flask (Empty through TSA)', category: 'Travel essentials', defaultQty: 1, weightLbs: 0.9 },
      { name: 'Pocket Multi-Tool (Must be Checked Baggage)', category: 'Miscellaneous', defaultQty: 1, weightLbs: 0.5 }
    ]
  }
];

const CUSTOM_TEMPLATES_KEY = 'gateready_custom_packing_templates_v1';

export function getCustomTemplates(): PackingTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveCustomTemplate(title: string, description: string, items: PackingTemplateItem[]): PackingTemplate {
  const current = getCustomTemplates();
  const newTemplate: PackingTemplate = {
    id: `custom_tpl_${Date.now()}`,
    title,
    description: description || 'User-saved custom packing list template',
    category: 'My Templates',
    tag: `${items.length} Items`,
    iconName: 'Sparkles',
    isCustom: true,
    items
  };
  const updated = [newTemplate, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
    } catch {}
  }
  return newTemplate;
}

export function deleteCustomTemplate(id: string): void {
  const current = getCustomTemplates();
  const updated = current.filter((t) => t.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
    } catch {}
  }
}
