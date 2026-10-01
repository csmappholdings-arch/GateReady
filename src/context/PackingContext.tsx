import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Trip, Bag, BagType, TravelType, WeightUnit, DepartureReminder } from '../types/travel';
import { initialTrips } from '../data/seedTrips';
import { getDefaultDepartureReminders } from '../data/defaultReminders';
import { useAuth } from './AuthContext';
import { 
  subscribeToUserTrips, 
  saveTripToCloud, 
  deleteTripFromCloud, 
  syncLocalTripsToCloud 
} from '../lib/firebase';

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'guest';

interface PackingContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  selectedBagId: string | null;
  weightUnit: WeightUnit;
  isDarkMode: boolean;
  activePackerFilter: string; // 'ALL' or family member name
  cloudSyncStatus: CloudSyncStatus;
  lastSyncedAt: Date | null;
  manualSync: () => Promise<void>;
  setActivePackerFilter: (packer: string) => void;
  selectTrip: (trip: Trip) => void;
  setSelectedBagId: (bagId: string) => void;
  toggleWeightUnit: () => void;
  setDarkMode: (isDark: boolean) => void;
  addTrip: (
    name: string,
    type: TravelType,
    company: string,
    seatOrSize: string,
    bagConfig?: Array<{ type: BagType; label: string; assignedTo?: string }>,
    familyMembers?: string[],
    extraDetails?: {
      originCity?: string;
      destinationCity?: string;
      destinationCountry?: string;
      departureDate?: string;
      departureTime?: string;
      returnTripDate?: string;
      returnTripTime?: string;
      aircraftType?: string;
    }
  ) => Trip;
  loadDemoTrip: () => Trip;
  deleteTrip: (tripId: string) => void;
  addItemToBag: (
    tripId: string,
    bagId: string,
    name: string,
    location: string,
    quantity: number,
    packedFor?: string
  ) => void;
  toggleItemPacked: (tripId: string, bagId: string, itemId: string) => void;
  removeItem: (tripId: string, bagId: string, itemId: string) => void;
  updateItemQuantity: (tripId: string, bagId: string, itemId: string, quantity: number) => void;
  updateItemPacker: (tripId: string, bagId: string, itemId: string, packedFor: string) => void;
  updateTripDetails: (
    tripId: string,
    details: Partial<Pick<Trip, 'name' | 'companyName' | 'seatClassOrCarSize' | 'travelType' | 'departureDate' | 'departureTime' | 'aircraftType' | 'isReturnRepackMode' | 'returnTripDate' | 'returnTripTime' | 'souvenirBufferEnabled' | 'originCity' | 'destinationCity' | 'destinationCountry' | 'luggageTags'>>
  ) => void;
  updateLuggageTag: (
    tripId: string,
    bagId: string,
    tagInfo: Partial<import('../types/travel').LuggageTagInfo>
  ) => void;
  renameBag: (tripId: string, bagId: string, newLabel: string) => void;
  updateBag: (
    tripId: string,
    bagId: string,
    updates: Partial<Pick<Bag, 'label' | 'type' | 'assignedTo' | 'maxWeightLimitLbs'>>
  ) => void;
  addBagToTrip: (tripId: string, type: BagType, label: string, assignedTo?: string) => void;
  removeBagFromTrip: (tripId: string, bagId: string) => void;
  addFamilyMember: (tripId: string, memberName: string) => void;
  removeFamilyMember: (tripId: string, memberName: string) => void;
  renameFamilyMember: (tripId: string, oldName: string, newName: string) => void;
  toggleGateCheckItem: (tripId: string, itemId: string) => void;
  resetAllPacked: (tripId: string) => void;
  markAllPacked: (tripId: string) => void;
  updateDepartureSchedule: (
    tripId: string,
    departureDate: string,
    departureTime: string,
    countdownEnabled: boolean
  ) => void;
  toggleDepartureReminder: (tripId: string, reminderId: string) => void;
  addCustomReminder: (
    tripId: string,
    title: string,
    category: 'PRE_TRIP' | 'DAY_OF',
    dueOffsetHours?: number
  ) => void;
  removeDepartureReminder: (tripId: string, reminderId: string) => void;
}

const PackingContext = createContext<PackingContextType | undefined>(undefined);

const STORAGE_KEY = 'gateready_trips_data_v2';
const UNIT_KEY = 'gateready_weight_unit';
const THEME_KEY = 'gateready_dark_mode';

export const PackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      // Clear out any old legacy preset keys
      localStorage.removeItem('gateready_trips_data_v1');
      localStorage.removeItem('gateready_seed_trips');
      localStorage.removeItem('gateready_seed_initialized');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Strictly filter out any old demo preset trips
          const filtered = parsed.filter(
            (t: Trip) =>
              t.id !== 'trip-nyc-delta' &&
              t.id !== 'trip-1' &&
              t.id !== 'trip-orlando' &&
              !t.name.includes('Delta') &&
              !t.name.includes('New York Fall')
          );
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [currentTripId, setCurrentTripId] = useState<string>(() => {
    return trips[0]?.id || '';
  });

  const [selectedBagId, setSelectedBagId] = useState<string | null>(null);
  const [activePackerFilter, setActivePackerFilter] = useState<string>('ALL');
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>(user ? 'syncing' : 'guest');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => {
    try {
      const saved = localStorage.getItem(UNIT_KEY);
      if (saved === 'KG' || saved === 'LBS') return saved;
    } catch {
      // Ignore
    }
    return 'LBS';
  });

  // Light mode by default unless user explicitly chose dark
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== null) return saved === 'true';
      return false; // Default to Light Mode
    } catch {
      return false;
    }
  });

  // Keep dark class on html document root and body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, String(isDarkMode));
    } catch {
      // Ignore
    }
  }, [isDarkMode]);

  // Persist trips to localStorage as offline fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {
      // Ignore
    }
  }, [trips]);

  // Persist weight unit
  useEffect(() => {
    try {
      localStorage.setItem(UNIT_KEY, weightUnit);
    } catch {
      // Ignore
    }
  }, [weightUnit]);

  // Reference to current trips to avoid dependency loops in subscription
  const tripsRef = useRef(trips);
  useEffect(() => {
    tripsRef.current = trips;
  }, [trips]);

  // Listen to Firestore real-time trips when authenticated
  useEffect(() => {
    if (!user) {
      setCloudSyncStatus('guest');
      return;
    }

    setCloudSyncStatus('syncing');

    const unsubscribe = subscribeToUserTrips(
      user.uid,
      async (cloudTrips) => {
        if (cloudTrips.length === 0) {
          // New account or empty cloud: migrate local trips up to Firestore
          const localToSync = tripsRef.current;
          if (localToSync.length > 0) {
            try {
              await syncLocalTripsToCloud(user.uid, localToSync);
              setCloudSyncStatus('synced');
              setLastSyncedAt(new Date());
            } catch (err) {
              console.warn('Initial cloud migration error:', err);
              setCloudSyncStatus('offline');
            }
          } else {
            setCloudSyncStatus('synced');
            setLastSyncedAt(new Date());
          }
        } else {
          // Cloud has trips. Check if current device has any locally created trips that aren't in the cloud yet
          const localToSync = tripsRef.current;
          const missingInCloud = localToSync.filter(
            (lt) => !cloudTrips.some((ct) => ct.id === lt.id)
          );

          if (missingInCloud.length > 0) {
            try {
              await syncLocalTripsToCloud(user.uid, missingInCloud);
            } catch (err) {
              console.warn('Syncing missing local trips to cloud error:', err);
            }
          }

          setTrips(cloudTrips);
          setCurrentTripId((prev) => {
            if (prev && cloudTrips.some((t) => t.id === prev)) return prev;
            return cloudTrips[0]?.id || '';
          });
          setCloudSyncStatus('synced');
          setLastSyncedAt(new Date());
        }
      },
      (err) => {
        console.warn('Firestore subscription error:', err);
        setCloudSyncStatus('offline');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Cloud helper to persist a trip mutation
  const persistTripToCloud = useCallback((updatedTrip: Trip) => {
    if (!user) return;
    setCloudSyncStatus('syncing');
    saveTripToCloud(user.uid, updatedTrip)
      .then(() => {
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date());
      })
      .catch((err) => {
        console.warn('Error saving trip to cloud:', err);
        setCloudSyncStatus('offline');
      });
  }, [user]);

  // Cloud helper to delete a trip
  const persistTripDeleteToCloud = useCallback((tripId: string) => {
    if (!user) return;
    setCloudSyncStatus('syncing');
    deleteTripFromCloud(user.uid, tripId)
      .then(() => {
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date());
      })
      .catch((err) => {
        console.warn('Error deleting trip from cloud:', err);
        setCloudSyncStatus('offline');
      });
  }, [user]);

  // Manual sync trigger
  const manualSync = async () => {
    if (!user) return;
    setCloudSyncStatus('syncing');
    try {
      await syncLocalTripsToCloud(user.uid, trips);
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('Manual sync failed:', err);
      setCloudSyncStatus('offline');
    }
  };

  const currentTrip = trips.find((t) => t.id === currentTripId) || trips[0] || null;

  // Sync selected bag when current trip changes
  useEffect(() => {
    if (currentTrip && currentTrip.bags.length > 0) {
      if (!selectedBagId || !currentTrip.bags.some((b) => b.id === selectedBagId)) {
        setSelectedBagId(currentTrip.bags[0].id);
      }
    } else {
      setSelectedBagId(null);
    }
  }, [currentTrip, selectedBagId]);

  const selectTrip = (trip: Trip) => {
    setCurrentTripId(trip.id);
    if (trip.bags.length > 0) {
      setSelectedBagId(trip.bags[0].id);
    } else {
      setSelectedBagId(null);
    }
  };

  const toggleWeightUnit = () => {
    setWeightUnit((prev) => (prev === 'LBS' ? 'KG' : 'LBS'));
  };

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const addTrip = (
    name: string,
    type: TravelType,
    company: string,
    seatOrSize: string,
    bagConfig?: Array<{ type: BagType; label: string; assignedTo?: string }>,
    familyMembers?: string[],
    extraDetails?: {
      originCity?: string;
      destinationCity?: string;
      destinationCountry?: string;
      departureDate?: string;
      departureTime?: string;
      returnTripDate?: string;
      returnTripTime?: string;
      aircraftType?: string;
    }
  ): Trip => {
    const newTripId = 'trip-' + Date.now();
    const resolvedFamily = familyMembers && familyMembers.length > 0 
      ? familyMembers 
      : ['Traveler 1'];

    // Provide default carry-on bag if bag setup was skipped
    const resolvedBagConfig = bagConfig && bagConfig.length > 0
      ? bagConfig
      : [
          { type: 'CARRY_ON' as BagType, label: 'Carry-On Roller', assignedTo: resolvedFamily[0] },
          { type: 'PERSONAL' as BagType, label: 'Personal Backpack', assignedTo: resolvedFamily[0] }
        ];

    const newBags: Bag[] = resolvedBagConfig.map((cfg, idx) => ({
      id: `bag-${Date.now()}-${idx}`,
      type: cfg.type,
      label: cfg.label || `${cfg.type} Bag`,
      assignedTo: cfg.assignedTo || resolvedFamily[0] || 'Traveler 1',
      items: [],
      maxWeightLimitLbs: cfg.type === 'CHECKED' ? 50 : cfg.type === 'CARRY_ON' ? 22 : 15
    }));

    const defaultGateChecks = [
      { id: `gc-${Date.now()}-1`, text: 'Valid Government Photo ID or Passport ready for all travelers', completed: false, required: true },
      { id: `gc-${Date.now()}-2`, text: 'Boarding pass / reservation ticket saved offline', completed: false, required: true },
      { id: `gc-${Date.now()}-3`, text: 'Power banks & spare lithium batteries in Carry-On', completed: false, required: true },
      { id: `gc-${Date.now()}-4`, text: 'Luggage liquids under 3.4oz (100ml) in 1 quart bag', completed: false, required: true },
      { id: `gc-${Date.now()}-5`, text: 'Kids / Family formula and medications declared at security', completed: false, required: false }
    ];

    const newTrip: Trip = {
      id: newTripId,
      name: name.trim() || 'My Upcoming Trip',
      travelType: type || 'PLANE',
      companyName: company.trim(),
      seatClassOrCarSize: seatOrSize.trim(),
      originCity: extraDetails?.originCity?.trim() || '',
      destinationCity: extraDetails?.destinationCity?.trim() || '',
      destinationCountry: extraDetails?.destinationCountry?.trim() || '',
      aircraftType: extraDetails?.aircraftType?.trim() || '',
      departureDate: extraDetails?.departureDate || new Date().toISOString().split('T')[0],
      departureTime: extraDetails?.departureTime || '09:00',
      returnTripDate: extraDetails?.returnTripDate || '',
      returnTripTime: extraDetails?.returnTripTime || '',
      departureCountdownEnabled: true,
      departureReminders: getDefaultDepartureReminders(),
      familyMembers: resolvedFamily,
      bags: newBags,
      gateChecklist: defaultGateChecks
    };

    setTrips((prev) => [newTrip, ...prev]);
    setCurrentTripId(newTrip.id);
    setActivePackerFilter('ALL');
    if (newBags.length > 0) {
      setSelectedBagId(newBags[0].id);
    }

    persistTripToCloud(newTrip);
    return newTrip;
  };

  const loadDemoTrip = (): Trip => {
    const departure = new Date();
    departure.setDate(departure.getDate() + 7);
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);

    const demoTripId = 'trip-demo-' + Date.now();
    const demoBags: Bag[] = [
      {
        id: `bag-demo-1`,
        type: 'CARRY_ON',
        label: "Alex's Carry-On Roller",
        assignedTo: 'Alex',
        maxWeightLimitLbs: 22,
        items: [
          { id: 'item-1', name: '3x T-Shirts & Polos', location: 'Main Compartment', quantity: 3, isPacked: true, customWeightLbs: 1.5, category: 'Clothing' },
          { id: 'item-2', name: 'Denim Jeans & Chinos', location: 'Main Compartment', quantity: 2, isPacked: true, customWeightLbs: 2.2, category: 'Clothing' },
          { id: 'item-3', name: 'Travel Blazer / Windbreaker', location: 'Main Compartment', quantity: 1, isPacked: false, customWeightLbs: 1.8, category: 'Clothing' },
          { id: 'item-4', name: 'TSA 3-1-1 Toiletry Pouch (3.0 oz)', location: 'Front Zipper Pocket', quantity: 1, isPacked: true, customWeightLbs: 0.8, category: 'Toiletries' },
          { id: 'item-5', name: 'Running / Walking Shoes', location: 'Shoe Compartment', quantity: 1, isPacked: false, customWeightLbs: 2.0, category: 'Shoes' },
          { id: 'item-6', name: 'Underwear & Socks (5 Pairs)', location: 'Main Compartment', quantity: 5, isPacked: true, customWeightLbs: 1.1, category: 'Clothing' },
          { id: 'item-7', name: 'Universal UK/EU Plug Adapter', location: 'Front Zipper Pocket', quantity: 1, isPacked: true, customWeightLbs: 0.4, category: 'Electronics' }
        ]
      },
      {
        id: `bag-demo-2`,
        type: 'PERSONAL',
        label: "Alex's Tech Backpack",
        assignedTo: 'Alex',
        maxWeightLimitLbs: 15,
        items: [
          { id: 'item-8', name: 'MacBook Air & 65W GaN Charger', location: 'Laptop Sleeve', quantity: 1, isPacked: true, customWeightLbs: 3.2, category: 'Electronics' },
          { id: 'item-9', name: 'Noise-Cancelling Headphones', location: 'Main Compartment', quantity: 1, isPacked: true, customWeightLbs: 0.6, category: 'Electronics' },
          { id: 'item-10', name: 'Passport & Boarding Pass', location: 'Front Zipper Pocket', quantity: 1, isPacked: true, customWeightLbs: 0.2, category: 'Documents' },
          { id: 'item-11', name: 'Sunglasses & Hard Case', location: 'Front Zipper Pocket', quantity: 1, isPacked: true, customWeightLbs: 0.3, category: 'Accessories' },
          { id: 'item-12', name: '10,000mAh Power Bank (Carry-On Only)', location: 'Front Zipper Pocket', quantity: 1, isPacked: false, customWeightLbs: 0.6, category: 'Electronics' }
        ]
      }
    ];

    const demoTrip: Trip = {
      id: demoTripId,
      name: 'Paris & London Vacation',
      travelType: 'PLANE',
      companyName: 'Delta Air Lines',
      seatClassOrCarSize: 'Main Cabin',
      originCity: 'New York (JFK)',
      destinationCity: 'Paris (CDG)',
      destinationCountry: 'France',
      aircraftType: 'Airbus A350-900',
      departureDate: departure.toISOString().split('T')[0],
      departureTime: '18:30',
      returnTripDate: returnDate.toISOString().split('T')[0],
      returnTripTime: '11:15',
      departureCountdownEnabled: true,
      departureReminders: getDefaultDepartureReminders(),
      familyMembers: ['Alex'],
      bags: demoBags,
      gateChecklist: [
        { id: `gc-demo-1`, text: 'Valid Government Photo ID or Passport ready for all travelers', completed: true, required: true },
        { id: `gc-demo-2`, text: 'Boarding pass / reservation ticket saved offline', completed: true, required: true },
        { id: `gc-demo-3`, text: 'Power banks & spare lithium batteries in Carry-On', completed: false, required: true },
        { id: `gc-demo-4`, text: 'Luggage liquids under 3.4oz (100ml) in 1 quart bag', completed: true, required: true },
        { id: `gc-demo-5`, text: 'Kids / Family formula and medications declared at security', completed: false, required: false }
      ]
    };

    setTrips((prev) => [demoTrip, ...prev]);
    setCurrentTripId(demoTrip.id);
    setSelectedBagId(demoBags[0].id);
    setActivePackerFilter('ALL');
    persistTripToCloud(demoTrip);
    return demoTrip;
  };

  const deleteTrip = (tripId: string) => {
    setTrips((prev) => {
      const remaining = prev.filter((t) => t.id !== tripId);
      if (remaining.length > 0) {
        if (currentTripId === tripId) {
          const nextTrip = remaining[0];
          setCurrentTripId(nextTrip.id);
          setSelectedBagId(nextTrip.bags[0]?.id || null);
        }
      } else {
        setCurrentTripId('');
        setSelectedBagId(null);
      }
      return remaining;
    });

    persistTripDeleteToCloud(tripId);
  };

  const addItemToBag = (
    tripId: string,
    bagId: string,
    name: string,
    location: string,
    quantity: number,
    packedFor?: string
  ) => {
    if (!name.trim()) return;

    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((bag) => {
            if (bag.id !== bagId) return bag;
            const targetPacker = packedFor || bag.assignedTo || trip.familyMembers?.[0] || 'Traveler 1';
            const newItem = {
              id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
              name: name.trim(),
              location: location.trim(),
              quantity: Math.max(1, quantity),
              isPacked: false,
              packedFor: targetPacker
            };
            return {
              ...bag,
              items: [...bag.items, newItem]
            };
          })
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const toggleItemPacked = (tripId: string, bagId: string, itemId: string) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((bag) => {
            if (bag.id !== bagId) return bag;
            return {
              ...bag,
              items: bag.items.map((item) =>
                item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
              )
            };
          })
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const removeItem = (tripId: string, bagId: string, itemId: string) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((bag) => {
            if (bag.id !== bagId) return bag;
            return {
              ...bag,
              items: bag.items.filter((item) => item.id !== itemId)
            };
          })
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const updateItemQuantity = (
    tripId: string,
    bagId: string,
    itemId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(tripId, bagId, itemId);
      return;
    }

    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((bag) => {
            if (bag.id !== bagId) return bag;
            return {
              ...bag,
              items: bag.items.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
              )
            };
          })
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const updateItemPacker = (
    tripId: string,
    bagId: string,
    itemId: string,
    packedFor: string
  ) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((bag) => {
            if (bag.id !== bagId) return bag;
            return {
              ...bag,
              items: bag.items.map((item) =>
                item.id === itemId ? { ...item, packedFor } : item
              )
            };
          })
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const addBagToTrip = (tripId: string, type: BagType, label: string, assignedTo?: string) => {
    const trip = trips.find((t) => t.id === tripId);
    const defaultOwner = assignedTo || trip?.familyMembers?.[0] || 'Traveler 1';
    const newBag: Bag = {
      id: 'bag-' + Date.now(),
      type,
      label: label.trim() || `${type} Bag`,
      assignedTo: defaultOwner,
      items: [],
      maxWeightLimitLbs: type === 'CHECKED' ? 50 : type === 'CARRY_ON' ? 22 : 15
    };

    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updated = {
          ...t,
          bags: [...t.bags, newBag]
        };
        updatedTripToSave = updated;
        return updated;
      })
    );
    setSelectedBagId(newBag.id);

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const addFamilyMember = (tripId: string, memberName: string) => {
    const trimmed = memberName.trim();
    if (!trimmed) return;

    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const currentMembers = t.familyMembers || [];
        if (currentMembers.includes(trimmed)) return t;
        const updated = {
          ...t,
          familyMembers: [...currentMembers, trimmed]
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const removeFamilyMember = (tripId: string, memberName: string) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updated = {
          ...t,
          familyMembers: (t.familyMembers || []).filter((m) => m !== memberName)
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (activePackerFilter === memberName) {
      setActivePackerFilter('ALL');
    }

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const renameFamilyMember = (tripId: string, oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;

    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updatedMembers = (t.familyMembers || []).map((m) => (m === oldName ? trimmed : m));
        const updatedBags = t.bags.map((bag) => ({
          ...bag,
          assignedTo: bag.assignedTo === oldName ? trimmed : bag.assignedTo,
          items: bag.items.map((item) => ({
            ...item,
            packedFor: item.packedFor === oldName ? trimmed : item.packedFor
          }))
        }));
        const updated = {
          ...t,
          familyMembers: updatedMembers,
          bags: updatedBags
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (activePackerFilter === oldName) {
      setActivePackerFilter(trimmed);
    }

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const updateTripDetails = (
    tripId: string,
    details: Partial<Pick<Trip, 'name' | 'companyName' | 'seatClassOrCarSize' | 'travelType' | 'departureDate' | 'departureTime' | 'aircraftType' | 'isReturnRepackMode' | 'returnTripDate' | 'returnTripTime' | 'souvenirBufferEnabled' | 'originCity' | 'destinationCity' | 'destinationCountry' | 'luggageTags'>>
  ) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          ...(details.name !== undefined ? { name: details.name.trim() } : {}),
          ...(details.companyName !== undefined ? { companyName: details.companyName.trim() } : {}),
          ...(details.seatClassOrCarSize !== undefined ? { seatClassOrCarSize: details.seatClassOrCarSize.trim() } : {}),
          ...(details.travelType !== undefined ? { travelType: details.travelType } : {}),
          ...(details.originCity !== undefined ? { originCity: details.originCity.trim() } : {}),
          ...(details.destinationCity !== undefined ? { destinationCity: details.destinationCity.trim() } : {}),
          ...(details.destinationCountry !== undefined ? { destinationCountry: details.destinationCountry.trim() } : {}),
          ...(details.departureDate !== undefined ? { departureDate: details.departureDate } : {}),
          ...(details.departureTime !== undefined ? { departureTime: details.departureTime } : {}),
          ...(details.aircraftType !== undefined ? { aircraftType: details.aircraftType.trim() } : {}),
          ...(details.isReturnRepackMode !== undefined ? { isReturnRepackMode: details.isReturnRepackMode } : {}),
          ...(details.returnTripDate !== undefined ? { returnTripDate: details.returnTripDate } : {}),
          ...(details.returnTripTime !== undefined ? { returnTripTime: details.returnTripTime } : {}),
          ...(details.souvenirBufferEnabled !== undefined ? { souvenirBufferEnabled: details.souvenirBufferEnabled } : {}),
          ...(details.luggageTags !== undefined ? { luggageTags: details.luggageTags } : {})
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const updateLuggageTag = (
    tripId: string,
    bagId: string,
    tagInfo: Partial<import('../types/travel').LuggageTagInfo>
  ) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const existingTags = trip.luggageTags || {};
        const currentTag = existingTags[bagId] || {
          bagId,
          travelerName: trip.familyMembers?.[0] || 'Traveler',
          phoneNumber: '',
          email: '',
          flightNumber: trip.companyName || '',
          rewardOffered: true
        };

        const updatedTag: import('../types/travel').LuggageTagInfo = {
          ...currentTag,
          ...tagInfo,
          bagId,
          updatedAt: new Date().toISOString()
        };

        const updatedTrip = {
          ...trip,
          luggageTags: {
            ...existingTags,
            [bagId]: updatedTag
          }
        };

        updatedTripToSave = updatedTrip;
        return updatedTrip;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const renameBag = (tripId: string, bagId: string, newLabel: string) => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((b) =>
            b.id === bagId ? { ...b, label: trimmed } : b
          )
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const updateBag = (
    tripId: string,
    bagId: string,
    updates: Partial<Pick<Bag, 'label' | 'type' | 'assignedTo' | 'maxWeightLimitLbs'>>
  ) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((b) => {
            if (b.id !== bagId) return b;
            return {
              ...b,
              ...(updates.label !== undefined ? { label: updates.label.trim() } : {}),
              ...(updates.type !== undefined ? { type: updates.type } : {}),
              ...(updates.assignedTo !== undefined ? { assignedTo: updates.assignedTo } : {}),
              ...(updates.maxWeightLimitLbs !== undefined ? { maxWeightLimitLbs: updates.maxWeightLimitLbs } : {})
            };
          })
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const removeBagFromTrip = (tripId: string, bagId: string) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.filter((b) => b.id !== bagId)
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const toggleGateCheckItem = (tripId: string, itemId: string) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          gateChecklist: (trip.gateChecklist || []).map((gc) =>
            gc.id === itemId ? { ...gc, completed: !gc.completed } : gc
          )
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const resetAllPacked = (tripId: string) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((b) => ({
            ...b,
            items: b.items.map((i) => ({ ...i, isPacked: false }))
          }))
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const markAllPacked = (tripId: string) => {
    let updatedTripToSave: Trip | null = null;

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const updated = {
          ...trip,
          bags: trip.bags.map((b) => ({
            ...b,
            items: b.items.map((i) => ({ ...i, isPacked: true }))
          }))
        };
        updatedTripToSave = updated;
        return updated;
      })
    );

    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const updateDepartureSchedule = (
    tripId: string,
    departureDate: string,
    departureTime: string,
    countdownEnabled: boolean
  ) => {
    let updatedTripToSave: Trip | null = null;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updated = {
          ...t,
          departureDate,
          departureTime,
          departureCountdownEnabled: countdownEnabled,
          departureReminders: t.departureReminders && t.departureReminders.length > 0
            ? t.departureReminders
            : getDefaultDepartureReminders()
        };
        updatedTripToSave = updated;
        return updated;
      })
    );
    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const toggleDepartureReminder = (tripId: string, reminderId: string) => {
    let updatedTripToSave: Trip | null = null;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const currentReminders = t.departureReminders && t.departureReminders.length > 0
          ? t.departureReminders
          : getDefaultDepartureReminders();
        const updated = {
          ...t,
          departureReminders: currentReminders.map((r) =>
            r.id === reminderId ? { ...r, completed: !r.completed } : r
          )
        };
        updatedTripToSave = updated;
        return updated;
      })
    );
    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const addCustomReminder = (
    tripId: string,
    title: string,
    category: 'PRE_TRIP' | 'DAY_OF',
    dueOffsetHours?: number
  ) => {
    if (!title.trim()) return;
    let updatedTripToSave: Trip | null = null;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const currentReminders = t.departureReminders && t.departureReminders.length > 0
          ? t.departureReminders
          : getDefaultDepartureReminders();
        const newRem: DepartureReminder = {
          id: 'rem-custom-' + Date.now(),
          title: title.trim(),
          category,
          dueOffsetHours: dueOffsetHours || (category === 'DAY_OF' ? 4 : 24),
          completed: false,
          isCustom: true
        };
        const updated = {
          ...t,
          departureReminders: [newRem, ...currentReminders]
        };
        updatedTripToSave = updated;
        return updated;
      })
    );
    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  const removeDepartureReminder = (tripId: string, reminderId: string) => {
    let updatedTripToSave: Trip | null = null;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const currentReminders = t.departureReminders || [];
        const updated = {
          ...t,
          departureReminders: currentReminders.filter((r) => r.id !== reminderId)
        };
        updatedTripToSave = updated;
        return updated;
      })
    );
    if (updatedTripToSave) persistTripToCloud(updatedTripToSave);
  };

  return (
    <PackingContext.Provider
      value={{
        trips,
        currentTrip,
        selectedBagId,
        weightUnit,
        isDarkMode,
        activePackerFilter,
        cloudSyncStatus,
        lastSyncedAt,
        manualSync,
        setActivePackerFilter,
        selectTrip,
        setSelectedBagId,
        toggleWeightUnit,
        setDarkMode,
        addTrip,
        loadDemoTrip,
        deleteTrip,
        addItemToBag,
        toggleItemPacked,
        removeItem,
        updateItemQuantity,
        updateItemPacker,
        updateTripDetails,
        updateLuggageTag,
        renameBag,
        updateBag,
        addBagToTrip,
        removeBagFromTrip,
        addFamilyMember,
        removeFamilyMember,
        renameFamilyMember,
        toggleGateCheckItem,
        resetAllPacked,
        markAllPacked,
        updateDepartureSchedule,
        toggleDepartureReminder,
        addCustomReminder,
        removeDepartureReminder
      }}
    >
      {children}
    </PackingContext.Provider>
  );
};

export const usePacking = (): PackingContextType => {
  const context = useContext(PackingContext);
  if (!context) {
    throw new Error('usePacking must be used within a PackingProvider');
  }
  return context;
};
