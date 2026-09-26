import { BagType } from '../types/travel';

// Weight estimation database in pounds (lbs)
export const itemWeightsLbs: Record<string, number> = {
  // Electronics
  'Laptop & Charger': 4.6,
  'Laptop': 3.5,
  'Laptop Charger': 0.9,
  'Tablet / E-reader': 1.1,
  'Phone & Charger': 0.6,
  'Phone Charger': 0.2,
  'Noise-Canceling Headphones': 0.6,
  'AirPods / Earbuds': 0.15,
  'Portable Power Bank': 0.7,
  'Camera & Lens': 2.8,
  'Smartwatch & Charger': 0.25,
  'Universal Travel Adapter': 0.4,

  // Documents & Essentials
  'Passport / ID': 0.1,
  'Wallet & Cards': 0.3,
  'Travel Documents & Folder': 0.2,
  'House / Car Keys': 0.2,
  'Pen & Notebook': 0.3,

  // Comfort & Health
  'Prescription Medications': 0.4,
  'First Aid Kit': 0.8,
  'Travel Pillow & Eye Mask': 0.7,
  'Empty Water Bottle': 0.5,
  'Snacks / Mint Tin': 0.5,
  'Lip Balm & Hand Sanitizer': 0.2,
  '3-1-1 TSA Liquids Bag': 1.2,
  'Sunglasses & Hard Case': 0.3,

  // Clothing & Footwear
  'Casual T-Shirts': 0.4,
  'Dress Shirt / Blouse': 0.5,
  'Jeans / Trousers': 1.4,
  'Sweater / Fleece': 1.1,
  'Light Jacket / Windbreaker': 1.2,
  'Heavy Winter Coat': 3.8,
  'Underwear & Socks': 0.3,
  'Pajamas / Sleepwear': 0.7,
  'Sneakers / Walking Shoes': 2.0,
  'Dress Shoes / Boots': 3.2,
  'Sandals / Flip Flops': 0.7,
  'Swimsuit & Sunscreen': 0.8,
  'Raincoat / Poncho': 0.9,
  'Suit / Blazer': 2.2,
  'Gym Workout Clothes': 0.8,

  // Toiletries & Grooming
  'Full Toiletry Dopp Kit': 2.2,
  'Electric Toothbrush': 0.4,
  'Hair Styling Tool / Dryer': 1.6,
  'Full-Size Toiletries': 3.0,
  'Makeup Bag': 1.4,
  'Shaving Kit': 0.6,
  'Beach Towel': 1.2,

  // Misc & Accessories
  'Umbrella': 0.8,
  'Gifts / Souvenirs': 2.5,
  'Travel Steamer / Iron': 1.4,
  'Laundry Bag (folding)': 0.3,
  'Belts & Accessories': 0.6,
  'Jewelry Pouch': 0.5,
  'Daypack / Tote (packable)': 0.5
};

// Keyword based fallback weights
const keywordWeights: { pattern: RegExp; weight: number }[] = [
  { pattern: /boot|heavy coat|winter coat|suit/i, weight: 3.5 },
  { pattern: /shoe|sneaker|dryer|steamer|iron|gift/i, weight: 2.0 },
  { pattern: /jean|pant|trouser|sweater|jacket|hoodie|makeup|kit/i, weight: 1.4 },
  { pattern: /t-shirt|shirt|blouse|pajama|towel|umbrella/i, weight: 0.8 },
  { pattern: /charger|adapter|phone|book|medication|pillow|bottle/i, weight: 0.6 },
  { pattern: /under|sock|glasses|passport|wallet|card|pen|lip/i, weight: 0.25 }
];

export const DefaultSuggestions = {
  getEstimatedWeightLbs(itemName: string): number {
    const trimmed = itemName.trim();
    if (itemWeightsLbs[trimmed]) {
      return itemWeightsLbs[trimmed];
    }
    // Check case insensitive lookup
    const lower = trimmed.toLowerCase();
    for (const [key, val] of Object.entries(itemWeightsLbs)) {
      if (key.toLowerCase() === lower) {
        return val;
      }
    }
    // Check keyword heuristic
    for (const kw of keywordWeights) {
      if (kw.pattern.test(trimmed)) {
        return kw.weight;
      }
    }
    // General default weight per piece
    return 0.8;
  },

  convertLbsToKg(lbs: number): number {
    return lbs * 0.45359237;
  },

  convertKgToLbs(kg: number): number {
    return kg / 0.45359237;
  },

  formatWeight(lbsValue: number, unit: 'LBS' | 'KG'): string {
    if (unit === 'KG') {
      const kg = this.convertLbsToKg(lbsValue);
      return `${kg.toFixed(1)} kg`;
    }
    return `${lbsValue.toFixed(1)} lbs`;
  },

  getSuggestionsFor(bagType: BagType): string[] {
    switch (bagType) {
      case 'PERSONAL':
        return [
          'Passport / ID',
          'Phone & Charger',
          'Laptop & Charger',
          'Noise-Canceling Headphones',
          'Portable Power Bank',
          '3-1-1 TSA Liquids Bag',
          'Prescription Medications',
          'Wallet & Cards',
          'Travel Pillow & Eye Mask',
          'Empty Water Bottle',
          'Sunglasses & Hard Case',
          'Pen & Notebook',
          'Lip Balm & Hand Sanitizer',
          'Snacks / Mint Tin'
        ];
      case 'CARRY_ON':
        return [
          'Casual T-Shirts',
          'Jeans / Trousers',
          'Underwear & Socks',
          'Sneakers / Walking Shoes',
          'Light Jacket / Windbreaker',
          'Full Toiletry Dopp Kit',
          'Pajamas / Sleepwear',
          'Electric Toothbrush',
          'Belts & Accessories',
          'Swimsuit & Sunscreen',
          'Dress Shirt / Blouse',
          'Daypack / Tote (packable)',
          'Umbrella',
          'Laundry Bag (folding)'
        ];
      case 'CHECKED':
        return [
          'Heavy Winter Coat',
          'Dress Shoes / Boots',
          'Full-Size Toiletries',
          'Hair Styling Tool / Dryer',
          'Suit / Blazer',
          'Extra Outfits & Sweaters',
          'Travel Steamer / Iron',
          'Beach Towel',
          'Gifts / Souvenirs',
          'Shaving Kit',
          'Gym Workout Clothes',
          'Hiking Boots'
        ];
      default:
        return [
          'Passport / ID',
          'Phone & Charger',
          'Outfits',
          'Toiletries'
        ];
    }
  },

  suggestedLocations: [
    'Main Compartment',
    'Front Zipper Pocket',
    'Padded Laptop Sleeve',
    'Side Mesh Pocket',
    'Internal Mesh Organizer',
    'Toiletry Pouch',
    'Bottom Shoe Compartment',
    'Top Quick-Access Lid',
    'Hidden Passport Pocket'
  ]
};
