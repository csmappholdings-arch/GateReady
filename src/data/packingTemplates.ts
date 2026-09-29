import { BagType } from '../types/travel';

export interface TemplateItem {
  name: string;
  category: string;
  quantity: number;
  location: string;
  estimatedWeightLbs: number;
}

export interface PackingTemplate {
  id: string;
  name: string;
  description: string;
  recommendedBagType: BagType;
  idealTripLengthDays: number;
  badge: string;
  items: TemplateItem[];
}

export const FREQUENT_TRAVELER_TEMPLATES: PackingTemplate[] = [
  {
    id: '3-day-business',
    name: '3-Day Business Trip (Road Warrior)',
    description: 'Crisp professional essentials, work tech, dopp kit, and business casual rotation.',
    recommendedBagType: 'CARRY_ON',
    idealTripLengthDays: 3,
    badge: 'Business',
    items: [
      { name: 'Business Dress Shirts / Blouses', category: 'Clothing', quantity: 3, location: 'Main Compartment', estimatedWeightLbs: 1.5 },
      { name: 'Tailored Slacks / Dress Trousers', category: 'Clothing', quantity: 2, location: 'Main Compartment', estimatedWeightLbs: 2.0 },
      { name: 'Suit Jacket / Blazer', category: 'Clothing', quantity: 1, location: 'Suit Garment Sleeve', estimatedWeightLbs: 2.2 },
      { name: 'Dress Shoes & Belt', category: 'Footwear', quantity: 1, location: 'Shoe Pouch', estimatedWeightLbs: 2.5 },
      { name: 'Underwear & Dress Socks (3-day pack)', category: 'Clothing', quantity: 3, location: 'Packing Cube', estimatedWeightLbs: 0.8 },
      { name: 'Casual Evening T-Shirt & Chinos', category: 'Clothing', quantity: 1, location: 'Main Compartment', estimatedWeightLbs: 1.2 },
      { name: 'TSA 3-1-1 Toiletry Kit & Shaver', category: 'Toiletries', quantity: 1, location: 'Quick-Access Top Pocket', estimatedWeightLbs: 1.2 },
      { name: 'Work Laptop & 65W GaN Charger', category: 'Electronics', quantity: 1, location: 'Padded Laptop Sleeve', estimatedWeightLbs: 3.5 },
      { name: 'High-Capacity Power Bank (Carry-On only)', category: 'Electronics', quantity: 1, location: 'Front Zipper', estimatedWeightLbs: 0.9 },
      { name: 'Work Badge, Business Cards & Notepad', category: 'Work', quantity: 1, location: 'Organizer Pocket', estimatedWeightLbs: 0.5 }
    ]
  },
  {
    id: 'weekend-getaway',
    name: 'Weekend Getaway (48-Hour Pack)',
    description: 'Lightweight weekend essentials designed to fit easily in a carry-on or personal item.',
    recommendedBagType: 'CARRY_ON',
    idealTripLengthDays: 2,
    badge: 'Quick Trip',
    items: [
      { name: 'Casual T-Shirts / Tops', category: 'Clothing', quantity: 3, location: 'Main Compartment', estimatedWeightLbs: 1.2 },
      { name: 'Jeans or Versatile Chinos', category: 'Clothing', quantity: 1, location: 'Main Compartment', estimatedWeightLbs: 1.3 },
      { name: 'Comfortable Walking Sneakers', category: 'Footwear', quantity: 1, location: 'Bottom Compartment', estimatedWeightLbs: 1.8 },
      { name: 'Lightweight Layer / Zip Hoodie', category: 'Clothing', quantity: 1, location: 'Top of Bag', estimatedWeightLbs: 1.1 },
      { name: 'Underwear & Ankle Socks (3 sets)', category: 'Clothing', quantity: 3, location: 'Small Packing Cube', estimatedWeightLbs: 0.7 },
      { name: 'Toothbrush, Travel Paste & Deodorant', category: 'Toiletries', quantity: 1, location: 'Zip Pocket', estimatedWeightLbs: 0.6 },
      { name: 'Phone Fast-Charger & Long Cable', category: 'Electronics', quantity: 1, location: 'Side Mesh Pocket', estimatedWeightLbs: 0.4 },
      { name: 'Sunglasses & Portable Umbrella', category: 'Accessories', quantity: 1, location: 'Front Pocket', estimatedWeightLbs: 0.8 }
    ]
  },
  {
    id: 'tech-nomad',
    name: 'Tech Nomad & Power Gear',
    description: 'Complete digital setup with adapters, backup cables, and protective accessories.',
    recommendedBagType: 'PERSONAL',
    idealTripLengthDays: 7,
    badge: 'Tech & Gear',
    items: [
      { name: 'Universal International Power Adapter', category: 'Electronics', quantity: 1, location: 'Tech Pouch', estimatedWeightLbs: 0.6 },
      { name: 'Noise-Cancelling Travel Headphones', category: 'Electronics', quantity: 1, location: 'Main Tech Compartment', estimatedWeightLbs: 0.8 },
      { name: 'Multi-Port USB-C Charging Hub (100W)', category: 'Electronics', quantity: 1, location: 'Tech Pouch', estimatedWeightLbs: 0.7 },
      { name: 'Backup Braided USB-C & Lightning Cables', category: 'Electronics', quantity: 3, location: 'Cable Organizer', estimatedWeightLbs: 0.4 },
      { name: 'Ultra-Slim Wireless Mouse & Mousepad', category: 'Electronics', quantity: 1, location: 'Side Slip', estimatedWeightLbs: 0.3 },
      { name: 'E-Reader / Tablet & Folio Stand', category: 'Electronics', quantity: 1, location: 'Tablet Pocket', estimatedWeightLbs: 1.2 },
      { name: 'Travel Power Bank 20,000mAh (TSA compliant)', category: 'Electronics', quantity: 1, location: 'Quick Access', estimatedWeightLbs: 1.1 },
      { name: 'Screen Cleaning Cloth & Cable Ties', category: 'Accessories', quantity: 1, location: 'Zipper Mesh', estimatedWeightLbs: 0.1 }
    ]
  },
  {
    id: '1-week-vacation',
    name: '1-Week Leisure / Family Vacation',
    description: 'Comprehensive wardrobe, hygiene kit, medications, and return laundry divider.',
    recommendedBagType: 'CHECKED',
    idealTripLengthDays: 7,
    badge: 'Vacation',
    items: [
      { name: 'Everyday Shirts / Tops (7-pack)', category: 'Clothing', quantity: 7, location: 'Large Cube', estimatedWeightLbs: 3.2 },
      { name: 'Pants, Jeans & Casual Bottoms (3-pack)', category: 'Clothing', quantity: 3, location: 'Bottom of Suitcase', estimatedWeightLbs: 3.8 },
      { name: 'Evening / Dinner Outfits (2-pack)', category: 'Clothing', quantity: 2, location: 'Middle Section', estimatedWeightLbs: 2.2 },
      { name: 'Underwear & Socks (8 pairs)', category: 'Clothing', quantity: 8, location: 'Undergarment Cube', estimatedWeightLbs: 1.8 },
      { name: 'Pajamas / Sleepwear (2 sets)', category: 'Clothing', quantity: 2, location: 'Side Pocket', estimatedWeightLbs: 1.0 },
      { name: 'Casual Shoes & Dressier Shoes', category: 'Footwear', quantity: 2, location: 'Shoe Bags', estimatedWeightLbs: 3.6 },
      { name: 'Full Toiletry Bag & Skincare Kit', category: 'Toiletries', quantity: 1, location: 'Checked Bag Waterproof Pocket', estimatedWeightLbs: 2.5 },
      { name: 'First Aid Kit, Pain Relief & Bandages', category: 'Medical', quantity: 1, location: 'Interior Mesh', estimatedWeightLbs: 0.8 },
      { name: 'Compact Steamer / Wrinkle Release', category: 'Appliances', quantity: 1, location: 'Corner of Suitcase', estimatedWeightLbs: 1.4 },
      { name: 'Drawstring Laundry Bag for Dirty Clothes', category: 'Organization', quantity: 1, location: 'Zipper Divider', estimatedWeightLbs: 0.2 }
    ]
  }
];
