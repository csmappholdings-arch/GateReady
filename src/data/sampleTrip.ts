import { Bag, Trip } from '../types/travel';
import { getDefaultDepartureReminders } from './defaultReminders';

/**
 * Canonical Air Canada (Toronto YYZ -> London LHR) sample trip.
 * Used for:
 * - B1 Interactive homepage product demo ("See it in action")
 * - B2 Homepage showcase panels (Smart Luggage Scales, TSA 3-1-1 Checker, Departure Readiness)
 * - C3 One-tap "Start with a sample trip" in onboarding / empty dashboard
 */
export function createAirCanadaSampleTrip(customTripId?: string): Trip {
  const departure = new Date();
  departure.setDate(departure.getDate() + 10);
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 18);

  const idPrefix = customTripId || 'trip-demo-aircanada';

  const bags: Bag[] = [
    {
      id: `${idPrefix}-carryon`,
      type: 'CARRY_ON',
      label: 'Carry-On Roller',
      assignedTo: 'Traveler 1',
      material: 'HARD_SHELL',
      emptyBagWeightLbs: 7.0,
      items: [
        {
          id: `${idPrefix}-item-passport`,
          name: 'Passport & Boarding Pass',
          location: 'Front Zipper Pocket',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 0.1,
          category: 'Documents',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-powerbank`,
          name: '10,000mAh Power Bank (Carry-On Only)',
          location: 'Tech Pouch',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 0.7,
          category: 'Electronics',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-shampoo`,
          name: 'Travel Shampoo (3.0 fl oz)',
          location: '3-1-1 Quart Bag',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 0.3,
          category: 'Toiletries',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-sunscreen`,
          name: 'Sunscreen Lotion (6.7 fl oz)',
          location: 'Top Tray (Audit Alert)',
          quantity: 1,
          isPacked: false,
          customWeightLbs: 0.6,
          category: 'Toiletries',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-adapter`,
          name: 'Universal UK/EU Plug Adapter',
          location: 'Tech Pouch',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 0.3,
          category: 'Electronics',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-sweater`,
          name: 'Merino Knit Sweater',
          location: 'Main Compartment',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 1.0,
          category: 'Clothing',
          packedFor: 'Traveler 1'
        }
      ]
    },
    {
      id: `${idPrefix}-checked`,
      type: 'CHECKED',
      label: 'Checked Suitcase',
      assignedTo: 'Traveler 1',
      material: 'HARD_SHELL',
      emptyBagWeightLbs: 10.5,
      maxWeightLimitLbs: 50,
      items: [
        {
          id: `${idPrefix}-item-cubes`,
          name: 'Packing Cubes: Shirts & Polos',
          location: 'Right Shell',
          quantity: 6,
          isPacked: true,
          customWeightLbs: 2.2,
          category: 'Clothing',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-coat`,
          name: 'Lined Wool Travel Coat',
          location: 'Garment Section',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 4.5,
          category: 'Clothing',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-toiletries`,
          name: 'Checked Wash Kit & Bath Bottles (200 ml)',
          location: 'Side Pocket',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 3.4,
          category: 'Toiletries',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-guidebook`,
          name: 'Hardcover UK Travel Guide & Journal',
          location: 'Mesh Divider',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 2.8,
          category: 'Accessories',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-sneakers`,
          name: 'Trail & Walking Sneakers',
          location: 'Shoe Bag',
          quantity: 1,
          isPacked: false,
          customWeightLbs: 3.6,
          category: 'Shoes',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-loafers`,
          name: 'Casual Dinner Loafers',
          location: 'Shoe Bag',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 2.9,
          category: 'Shoes',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-trousers`,
          name: 'Heavy Denim & Chinos',
          location: 'Left Shell',
          quantity: 3,
          isPacked: true,
          customWeightLbs: 2.1,
          category: 'Clothing',
          packedFor: 'Traveler 1'
        },
        {
          id: `${idPrefix}-item-gifts`,
          name: 'Wrapped Gift Tin & Chocolates',
          location: 'Center Pad',
          quantity: 1,
          isPacked: true,
          customWeightLbs: 4.6,
          category: 'Accessories',
          packedFor: 'Traveler 1'
        }
      ]
    }
  ];

  return {
    id: idPrefix,
    name: 'Sample trip: London Heathrow',
    travelType: 'PLANE',
    companyName: 'Air Canada',
    flightNumber: 'AC856',
    fareFamily: 'Economy Standard',
    seatClassOrCarSize: 'Economy Standard',
    originCity: 'Toronto (YYZ)',
    destinationCity: 'London (LHR)',
    destinationCountry: 'United Kingdom',
    aircraftType: 'Boeing 777-300ER',
    departureDate: departure.toISOString().split('T')[0],
    departureTime: '20:45',
    returnTripDate: returnDate.toISOString().split('T')[0],
    returnTripTime: '12:10',
    departureCountdownEnabled: true,
    departureReminders: getDefaultDepartureReminders(),
    familyMembers: ['Traveler 1'],
    bags,
    isDemo: true,
    passportExpiryDate: '2029-08-15',
    gateChecklist: [
      {
        id: `${idPrefix}-gc-1`,
        text: 'Valid Passport (6+ months validity) & UK ETA checked',
        completed: true,
        required: true
      },
      {
        id: `${idPrefix}-gc-2`,
        text: '10,000mAh power bank packed in cabin carry-on',
        completed: true,
        required: true
      },
      {
        id: `${idPrefix}-gc-3`,
        text: 'Carry-on liquids <= 100 ml (3.4 oz) in 1-liter bag',
        completed: false,
        required: true
      },
      {
        id: `${idPrefix}-gc-4`,
        text: 'Checked bag balanced under 50 lb Air Canada cap',
        completed: false,
        required: true
      }
    ]
  };
}
