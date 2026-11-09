import { LuggageProfile, BagType, BagMaterial } from '../types/travel';

const LUGGAGE_LIBRARY_STORAGE_KEY = 'gateready_luggage_library_v1';

export const DEFAULT_LUGGAGE_LIBRARY: LuggageProfile[] = [
  {
    id: 'prof_away_carry_on',
    name: 'Away The Carry-On Spinner',
    type: 'CARRY_ON',
    material: 'HARD_SHELL',
    emptyBagWeightLbs: 7.1,
    lengthInches: 21.7,
    widthInches: 13.7,
    heightInches: 9.0,
    brand: 'Away',
    color: 'Navy Blue',
    notes: 'Fits major airline domestic & international overhead bins',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prof_samsonite_28',
    name: 'Samsonite Winfield 28" Checked Trunk',
    type: 'CHECKED',
    material: 'HARD_SHELL',
    emptyBagWeightLbs: 11.2,
    lengthInches: 30.5,
    widthInches: 20.5,
    heightInches: 13.25,
    brand: 'Samsonite',
    color: 'Charcoal Grey',
    notes: 'Large checked spinner with TSA combination lock',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prof_patagonia_black_hole',
    name: 'Patagonia Black Hole 25L Daypack',
    type: 'PERSONAL',
    material: 'FABRIC',
    emptyBagWeightLbs: 1.4,
    lengthInches: 18.0,
    widthInches: 11.5,
    heightInches: 6.0,
    brand: 'Patagonia',
    color: 'Black',
    notes: 'Personal item backpack for under-seat stowage',
    createdAt: new Date().toISOString()
  }
];

export function getLuggageLibrary(): LuggageProfile[] {
  if (typeof window === 'undefined') return DEFAULT_LUGGAGE_LIBRARY;
  try {
    const raw = localStorage.getItem(LUGGAGE_LIBRARY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_LUGGAGE_LIBRARY;
}

export function saveLuggageProfile(profile: Omit<LuggageProfile, 'id' | 'createdAt'> & { id?: string }): LuggageProfile {
  const current = getLuggageLibrary();
  const id = profile.id || `lug_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newProfile: LuggageProfile = {
    ...profile,
    id,
    createdAt: new Date().toISOString()
  };

  const existingIndex = current.findIndex((p) => p.id === id);
  let updated: LuggageProfile[];
  if (existingIndex >= 0) {
    updated = current.map((p) => (p.id === id ? newProfile : p));
  } else {
    updated = [newProfile, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LUGGAGE_LIBRARY_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
  return newProfile;
}

export function deleteLuggageProfile(id: string): void {
  const current = getLuggageLibrary();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LUGGAGE_LIBRARY_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}
