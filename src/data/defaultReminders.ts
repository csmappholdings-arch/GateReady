import { DepartureReminder } from '../types/travel';

export const getDefaultDepartureReminders = (): DepartureReminder[] => [
  {
    id: 'rem-pre-1',
    title: 'Laundry & Wardrobe: wash and fold all travel outfits',
    category: 'PRE_TRIP',
    dueOffsetHours: 72,
    completed: false
  },
  {
    id: 'rem-pre-2',
    title: 'Verify baggage dimensions and strict weight allowances',
    category: 'PRE_TRIP',
    dueOffsetHours: 48,
    completed: false
  },
  {
    id: 'rem-pre-3',
    title: 'Prepare TSA liquids: 3.4oz (100ml) in 1 clear quart bag',
    category: 'PRE_TRIP',
    dueOffsetHours: 48,
    completed: false
  },
  {
    id: 'rem-pre-4',
    title: '24-hour online check-in: confirm seats & download offline boarding passes',
    category: 'PRE_TRIP',
    dueOffsetHours: 24,
    completed: false
  },
  {
    id: 'rem-pre-5',
    title: 'Charge all devices, mobile phones, iPads, laptops & power banks',
    category: 'PRE_TRIP',
    dueOffsetHours: 24,
    completed: false
  },
  {
    id: 'rem-day-1',
    title: 'Passports, Real IDs, Driver Licenses & Visa documents in Personal Item',
    category: 'DAY_OF',
    dueOffsetHours: 6,
    completed: false
  },
  {
    id: 'rem-day-2',
    title: 'Pick up foreign cash / currency exchange or ATM cash withdrawal',
    category: 'DAY_OF',
    dueOffsetHours: 5,
    completed: false
  },
  {
    id: 'rem-day-3',
    title: 'Pack daily prescription medications & inhalers in carry-on',
    category: 'DAY_OF',
    dueOffsetHours: 4,
    completed: false
  },
  {
    id: 'rem-day-4',
    title: 'Empty reusable water bottles before airport security line',
    category: 'DAY_OF',
    dueOffsetHours: 3,
    completed: false
  },
  {
    id: 'rem-day-5',
    title: 'Home security: lock all windows, unplug appliances, set thermostat',
    category: 'DAY_OF',
    dueOffsetHours: 2,
    completed: false
  }
];
