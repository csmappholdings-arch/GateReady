import { Trip } from '../types/travel';
import { getDefaultDepartureReminders } from './defaultReminders';

export const initialTrips: Trip[] = [
  {
    id: 'trip-nyc-delta',
    name: 'NYC Vacation & Conference',
    travelType: 'PLANE',
    companyName: 'Delta Air Lines',
    seatClassOrCarSize: 'Main Cabin Economy',
    departureDate: '2026-10-12',
    departureTime: '09:15',
    departureCountdownEnabled: true,
    departureReminders: getDefaultDepartureReminders(),
    familyMembers: ['Sarah (Mom)', 'Alex (Child)', 'Maya (Toddler)'],
    bags: [
      {
        id: 'bag-personal-1',
        type: 'PERSONAL',
        label: "Sarah's Backpack",
        assignedTo: 'Sarah (Mom)',
        maxWeightLimitLbs: 15,
        items: [
          { id: 'item-1', name: 'Passport / ID', quantity: 1, location: 'Hidden Passport Pocket', isPacked: true, packedFor: 'Sarah (Mom)' },
          { id: 'item-2', name: 'Laptop & Charger', quantity: 1, location: 'Padded Laptop Sleeve', isPacked: true, packedFor: 'Sarah (Mom)' },
          { id: 'item-3', name: 'Noise-Canceling Headphones', quantity: 1, location: 'Top Quick-Access Lid', isPacked: true, packedFor: 'Sarah (Mom)' },
          { id: 'item-4', name: 'Portable Power Bank', quantity: 1, location: 'Front Zipper Pocket', isPacked: true, packedFor: 'Sarah (Mom)' },
          { id: 'item-5', name: '3-1-1 TSA Liquids Bag', quantity: 1, location: 'Front Zipper Pocket', isPacked: false, packedFor: 'Sarah (Mom)' },
          { id: 'item-6', name: 'Kids Color Books & Crayons', quantity: 2, location: 'Main Compartment', isPacked: true, packedFor: 'Alex (Child)' },
          { id: 'item-7', name: 'Toddler Snacks & Sippy Cup', quantity: 1, location: 'Side Mesh Pocket', isPacked: false, packedFor: 'Maya (Toddler)' }
        ]
      },
      {
        id: 'bag-carryon-1',
        type: 'CARRY_ON',
        label: "Alex's Carry-On Roller",
        assignedTo: 'Alex (Child)',
        maxWeightLimitLbs: 22,
        items: [
          { id: 'item-8', name: 'Casual T-Shirts', quantity: 4, location: 'Main Compartment', isPacked: true, packedFor: 'Alex (Child)' },
          { id: 'item-9', name: 'Jeans & Shorts', quantity: 3, location: 'Main Compartment', isPacked: true, packedFor: 'Alex (Child)' },
          { id: 'item-10', name: 'Sneakers / Walking Shoes', quantity: 1, location: 'Bottom Shoe Compartment', isPacked: false, packedFor: 'Alex (Child)' },
          { id: 'item-11', name: 'Childrens Chewable Tylenol & First Aid', quantity: 1, location: 'Toiletry Pouch', isPacked: false, packedFor: 'Alex (Child)' },
          { id: 'item-12', name: 'Nintendo Switch & Game', quantity: 1, location: 'Front Zipper Pocket', isPacked: true, packedFor: 'Alex (Child)' }
        ]
      },
      {
        id: 'bag-checked-1',
        type: 'CHECKED',
        label: "Maya's Suitcase",
        assignedTo: 'Maya (Toddler)',
        maxWeightLimitLbs: 50,
        items: [
          { id: 'item-13', name: 'Toddler Outfits & Onesies', quantity: 6, location: 'Internal Mesh Organizer', isPacked: true, packedFor: 'Maya (Toddler)' },
          { id: 'item-14', name: 'Diaper Pack & Baby Wipes', quantity: 1, location: 'Main Compartment', isPacked: false, packedFor: 'Maya (Toddler)' },
          { id: 'item-15', name: 'Baby Blankets & Plushie', quantity: 2, location: 'Main Compartment', isPacked: true, packedFor: 'Maya (Toddler)' },
          { id: 'item-16', name: 'Toddler Shoes & Sandals', quantity: 2, location: 'Shoe Bag', isPacked: false, packedFor: 'Maya (Toddler)' }
        ]
      }
    ],
    gateChecklist: [
      { id: 'gc-1', text: 'Real ID or Valid Passports verified for all travelers', completed: true, required: true },
      { id: 'gc-2', text: 'Mobile boarding passes saved offline to wallet', completed: true, required: true },
      { id: 'gc-3', text: 'Lithium power banks packed in Carry-On (NEVER checked)', completed: true, required: true },
      { id: 'gc-4', text: 'Liquids compliant with 3-1-1 rule (under 3.4oz / 100ml)', completed: false, required: true },
      { id: 'gc-5', text: 'Baby/Children liquid formula or medicines declared at TSA screening', completed: false, required: false }
    ]
  },
  {
    id: 'trip-amtrak-coastal',
    name: 'Pacific Coastline Rail',
    travelType: 'TRAIN',
    companyName: 'Amtrak',
    seatClassOrCarSize: 'Roomette Sleeper',
    departureDate: '2026-11-05',
    familyMembers: ['Jordan', 'Taylor'],
    bags: [
      {
        id: 'bag-amtrak-1',
        type: 'PERSONAL',
        label: "Jordan's Overnight Tote",
        assignedTo: 'Jordan',
        maxWeightLimitLbs: 25,
        items: [
          { id: 'item-t1', name: 'Laptop & Charger', quantity: 1, location: 'Main Compartment', isPacked: true, packedFor: 'Jordan' },
          { id: 'item-t2', name: 'Noise-Canceling Headphones', quantity: 1, location: 'Front Pocket', isPacked: false, packedFor: 'Jordan' },
          { id: 'item-t3', name: 'Travel Pillow & Eye Mask', quantity: 1, location: 'Main Compartment', isPacked: false, packedFor: 'Jordan' }
        ]
      },
      {
        id: 'bag-amtrak-2',
        type: 'CARRY_ON',
        label: "Taylor's Duffel Bag",
        assignedTo: 'Taylor',
        maxWeightLimitLbs: 50,
        items: [
          { id: 'item-t4', name: 'Casual T-Shirts', quantity: 3, location: 'Main Compartment', isPacked: true, packedFor: 'Taylor' },
          { id: 'item-t5', name: 'Jeans / Trousers', quantity: 2, location: 'Main Compartment', isPacked: false, packedFor: 'Taylor' }
        ]
      }
    ],
    gateChecklist: [
      { id: 'gc-t1', text: 'Amtrak eTicketing bar code on phone or printed', completed: false, required: true },
      { id: 'gc-t2', text: 'Photo ID matches booking name', completed: false, required: true }
    ]
  },
  {
    id: 'trip-tahoe-roadtrip',
    name: 'Lake Tahoe Getaway',
    travelType: 'CAR',
    companyName: 'Toyota RAV4',
    seatClassOrCarSize: 'Mid-Size SUV',
    departureDate: '2026-12-20',
    familyMembers: ['Marcus'],
    bags: [
      {
        id: 'bag-car-1',
        type: 'CARRY_ON',
        label: "Marcus's Cabin Duffel",
        assignedTo: 'Marcus',
        maxWeightLimitLbs: 35,
        items: [
          { id: 'item-c1', name: 'Heavy Winter Coat', quantity: 1, location: 'Trunk Top', isPacked: true, packedFor: 'Marcus' },
          { id: 'item-c2', name: 'Hiking Boots', quantity: 1, location: 'Trunk Floor', isPacked: false, packedFor: 'Marcus' }
        ]
      }
    ],
    gateChecklist: [
      { id: 'gc-c1', text: 'Emergency roadside kit & tire pressure checked', completed: false, required: true },
      { id: 'gc-c2', text: 'Rear-view mirror visibility unblocked by luggage stacks', completed: false, required: true }
    ]
  }
];
