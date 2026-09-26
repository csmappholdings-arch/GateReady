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
    bagConfig: Array<{ type: BagType; label: string; assignedTo?: string }>,
    familyMembers?: string[]
  ) => Trip;
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

const STORAGE_KEY = 'gateready_trips_data_v1';
const UNIT_KEY = 'gateready_weight_unit';
const THEME_KEY = 'gateready_dark_mode';

export const PackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return initialTrips;
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

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== null) return saved === 'true';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Keep dark class on html document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
          setTrips(cloudTrips);
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
    bagConfig: Array<{ type: BagType; label: string; assignedTo?: string }>,
    familyMembers?: string[]
  ): Trip => {
    const newTripId = 'trip-' + Date.now();
    const resolvedFamily = familyMembers && familyMembers.length > 0 
      ? familyMembers 
      : ['Traveler 1'];

    const newBags: Bag[] = bagConfig.map((cfg, idx) => ({
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
      name: name.trim(),
      travelType: type,
      companyName: company.trim(),
      seatClassOrCarSize: seatOrSize.trim(),
      departureDate: new Date().toISOString().split('T')[0],
      departureTime: '09:00',
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

  const deleteTrip = (tripId: string) => {
    setTrips((prev) => {
      const remaining = prev.filter((t) => t.id !== tripId);
      if (remaining.length > 0) {
        if (currentTripId === tripId) {
          setCurrentTripId(remaining[0].id);
        }
      } else {
        setCurrentTripId('');
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
        deleteTrip,
        addItemToBag,
        toggleItemPacked,
        removeItem,
        updateItemQuantity,
        updateItemPacker,
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
