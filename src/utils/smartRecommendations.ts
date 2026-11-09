import { Trip } from '../types/travel';
import { PackingTemplateItem } from './packingTemplates';

/**
 * Generates smart packing recommendations based on destination, trip duration,
 * travel mode, traveler count, and season/climate.
 * These are returned for user review & selection — never auto-added without consent.
 */
export function generateSmartPackingSuggestions(trip: Trip): {
  category: string;
  reason: string;
  suggestions: PackingTemplateItem[];
}[] {
  const result: { category: string; reason: string; suggestions: PackingTemplateItem[] }[] = [];
  const dest = (trip.destinationCity || trip.name || '').toLowerCase();
  const origin = (trip.originCity || '').toLowerCase();
  const isFlight = trip.travelType === 'PLANE';
  const isCruise = trip.travelType === 'CRUISE';
  const isCar = trip.travelType === 'CAR';
  const travelers = trip.familyMembers || [];
  const hasKids = travelers.some((t) => t.toLowerCase().includes('child') || t.toLowerCase().includes('kid') || t.toLowerCase().includes('toddler') || t.toLowerCase().includes('baby'));

  // 1. Destination / International Travel Intel
  const isLikelyInternational = 
    dest.includes('london') || dest.includes('paris') || dest.includes('tokyo') || 
    dest.includes('rome') || dest.includes('europe') || dest.includes('mexico') || 
    dest.includes('cancun') || dest.includes('costa rica') || dest.includes('japan') ||
    dest.includes('uk') || dest.includes('england') || dest.includes('spain') ||
    (origin && dest && !origin.includes('canada') && dest.includes('canada')) ||
    (origin.includes('canada') && !dest.includes('canada') && !dest.includes('toronto') && !dest.includes('vancouver') && !dest.includes('montreal'));

  if (isLikelyInternational || isFlight) {
    result.push({
      category: 'International & Flight Essentials',
      reason: `Tailored for flights to ${trip.destinationCity || 'your destination'}`,
      suggestions: [
        { name: 'Universal Plug Adapter (Dual USB-C)', category: 'Electronics', defaultQty: 1, weightLbs: 0.4 },
        { name: 'AirTag / Luggage Tracker Beacon', category: 'Travel essentials', defaultQty: 2, weightLbs: 0.1 },
        { name: 'Passport & Visa Documentation Pouch', category: 'Documents', defaultQty: 1, weightLbs: 0.1 },
        { name: 'Noise-Cancelling Earbuds / Headphones', category: 'Electronics', defaultQty: 1, weightLbs: 0.5 },
        { name: 'In-Flight Hydration Mist & Lip Balm', category: 'Toiletries', defaultQty: 1, weightLbs: 0.25 }
      ]
    });
  }

  // 2. Beach / Tropical Warm Destination Intel
  const isBeachOrWarm = 
    dest.includes('miami') || dest.includes('cancun') || dest.includes('hawaii') || 
    dest.includes('caribbean') || dest.includes('orlando') || dest.includes('bali') || 
    dest.includes('punta cana') || dest.includes('jamaica') || dest.includes('bahamas') ||
    isCruise;

  if (isBeachOrWarm) {
    result.push({
      category: 'Sun, Sea & Resort Pack',
      reason: 'Detected warm climate or cruise itinerary',
      suggestions: [
        { name: 'Reef-Friendly Water-Resistant Sunscreen', category: 'Toiletries', defaultQty: 2, weightLbs: 0.7 },
        { name: 'Polarized UV Sunglasses', category: 'Accessories', defaultQty: 1, weightLbs: 0.2 },
        { name: 'Quick-Dry Microfiber Beach Towel', category: 'Travel essentials', defaultQty: 1, weightLbs: 0.6 },
        { name: 'Waterproof Submersible Phone Pouch', category: 'Accessories', defaultQty: 1, weightLbs: 0.2 },
        { name: 'Comfortable Water Shoes / Flip Flops', category: 'Footwear', defaultQty: 1, weightLbs: 0.8 }
      ]
    });
  }

  // 3. Family / Children Traveling
  if (hasKids) {
    result.push({
      category: 'Child & Family Comfort Kit',
      reason: `${travelers.length} travelers with children on journey`,
      suggestions: [
        { name: 'Spill-Proof Snack Cups & Airport Snacks', category: 'Baby and children\'s items', defaultQty: 3, weightLbs: 0.6 },
        { name: 'Children Tablet with Downloaded Offline Movies', category: 'Baby and children\'s items', defaultQty: 1, weightLbs: 1.1 },
        { name: 'Kid-Safe Volume Limiting Headphones', category: 'Baby and children\'s items', defaultQty: 1, weightLbs: 0.4 },
        { name: 'Disinfectant Wipes & Travel Hand Sanitizer', category: 'Toiletries', defaultQty: 2, weightLbs: 0.5 },
        { name: 'Backup Outfit in Carry-On (Both Child & Parent)', category: 'Clothing', defaultQty: 2, weightLbs: 1.2 }
      ]
    });
  }

  // 4. TSA 3-1-1 Checkpoint Essentials
  if (isFlight) {
    result.push({
      category: 'TSA 3-1-1 Liquids & Security Pack',
      reason: 'Compliant with carry-on security rules',
      suggestions: [
        { name: 'Clear 1-Quart Zip-Top Bag (Under 3.4 oz each)', category: 'Toiletries', defaultQty: 1, weightLbs: 0.1 },
        { name: 'Solid Bar Shampoo & Conditioner (Exempt from Liquids)', category: 'Toiletries', defaultQty: 1, weightLbs: 0.35 },
        { name: 'Slip-On Airport Security Friendly Shoes', category: 'Footwear', defaultQty: 1, weightLbs: 1.4 },
        { name: 'Empty Reusable Water Bottle (Refill Post-Security)', category: 'Travel essentials', defaultQty: 1, weightLbs: 0.5 }
      ]
    });
  }

  // 5. Road Trip & Driving Essentials
  if (isCar) {
    result.push({
      category: 'Vehicle & Road Trip Kit',
      reason: 'Optimized for highway driving and vehicle travel',
      suggestions: [
        { name: '12V USB-C Fast Car Charger Adapter', category: 'Electronics', defaultQty: 1, weightLbs: 0.3 },
        { name: 'Thermal Car Travel Mug / Tumbler', category: 'Travel essentials', defaultQty: 1, weightLbs: 0.7 },
        { name: 'Compact Vehicle First Aid & Motion Sickness Tabs', category: 'Medication', defaultQty: 1, weightLbs: 0.6 },
        { name: 'Car Trash Bags & Wet Clean Wipes', category: 'Miscellaneous', defaultQty: 1, weightLbs: 0.4 }
      ]
    });
  }

  return result;
}
