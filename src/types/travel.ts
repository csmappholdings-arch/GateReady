export type TravelType = 'PLANE' | 'TRAIN' | 'CAR' | 'CRUISE' | 'BUS';

export type BagType = 'PERSONAL' | 'CARRY_ON' | 'CHECKED';

export type BagMaterial = 'HARD_SHELL' | 'FABRIC';

export type WeightUnit = 'LBS' | 'KG';

export interface BagMaterialPreset {
  defaultLbs: number;
  label: string;
  shortLabel: string;
  description: string;
}

export const BAG_MATERIAL_PRESETS: Record<BagType, Record<BagMaterial, BagMaterialPreset>> = {
  PERSONAL: {
    FABRIC: { 
      defaultLbs: 1.5, 
      label: 'Fabric / Softside', 
      shortLabel: 'Fabric',
      description: 'Canvas, ballistic nylon or polyester daypack / tote' 
    },
    HARD_SHELL: { 
      defaultLbs: 3.0, 
      label: 'Hard Shell Case', 
      shortLabel: 'Hard Shell',
      description: 'Molded polycarbonate or structured briefcase / mini-case' 
    },
  },
  CARRY_ON: {
    FABRIC: { 
      defaultLbs: 5.5, 
      label: 'Fabric / Softside Roller', 
      shortLabel: 'Fabric',
      description: 'Soft ballistic nylon / polyester with exterior zip pockets' 
    },
    HARD_SHELL: { 
      defaultLbs: 7.0, 
      label: 'Hard Shell Spinner', 
      shortLabel: 'Hard Shell',
      description: 'Impact-resistant polycarbonate / ABS hardshell spinner' 
    },
  },
  CHECKED: {
    FABRIC: { 
      defaultLbs: 8.5, 
      label: 'Fabric / Softside Trunk', 
      shortLabel: 'Fabric',
      description: 'Expandable high-denier nylon large checked suitcase' 
    },
    HARD_SHELL: { 
      defaultLbs: 10.5, 
      label: 'Hard Shell Suitcase', 
      shortLabel: 'Hard Shell',
      description: 'Reinforced polycarbonate or aluminum checked trunk' 
    },
  },
};

const STORAGE_KEY_TARE_PRESETS = 'gateready_bag_tare_presets';

export function getUserPresetWeightLbs(type: BagType, material: BagMaterial): number {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TARE_PRESETS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[type]?.[material] && typeof parsed[type][material] === 'number') {
          return parsed[type][material];
        }
      }
    } catch {
      // fallback to default
    }
  }
  return BAG_MATERIAL_PRESETS[type]?.[material]?.defaultLbs ?? (material === 'HARD_SHELL' ? 7.0 : 5.5);
}

export function setUserPresetWeightLbs(type: BagType, material: BagMaterial, weightLbs: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TARE_PRESETS);
    const existing = raw ? JSON.parse(raw) : {};
    if (!existing[type]) existing[type] = {};
    existing[type][material] = Number(weightLbs.toFixed(2));
    localStorage.setItem(STORAGE_KEY_TARE_PRESETS, JSON.stringify(existing));
    window.dispatchEvent(new Event('gateready_tare_presets_changed'));
  } catch {
    // ignore error
  }
}

export function resetUserPresetWeights(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_TARE_PRESETS);
    window.dispatchEvent(new Event('gateready_tare_presets_changed'));
  } catch {
    // ignore
  }
}

export function getBagEmptyWeightLbs(bag: { type: BagType; material?: BagMaterial; emptyBagWeightLbs?: number }): number {
  if (typeof bag.emptyBagWeightLbs === 'number' && bag.emptyBagWeightLbs >= 0) {
    return bag.emptyBagWeightLbs;
  }
  const mat: BagMaterial = bag.material || (bag.type === 'PERSONAL' ? 'FABRIC' : 'HARD_SHELL');
  return getUserPresetWeightLbs(bag.type, mat);
}

export function calculateBagTotalWeightLbs(
  bag: Bag, 
  getEstimatedItemWeight: (name: string) => number
): {
  emptyWeightLbs: number;
  contentsWeightLbs: number;
  totalWeightLbs: number;
} {
  const emptyWeightLbs = getBagEmptyWeightLbs(bag);
  const contentsWeightLbs = bag.items.reduce(
    (sum, item) => sum + (item.customWeightLbs ?? getEstimatedItemWeight(item.name)) * (item.quantity || 1),
    0
  );
  return {
    emptyWeightLbs: Number(emptyWeightLbs.toFixed(2)),
    contentsWeightLbs: Number(contentsWeightLbs.toFixed(2)),
    totalWeightLbs: Number((emptyWeightLbs + contentsWeightLbs).toFixed(2))
  };
}

export type LoyaltyCategory = 
  | 'AIRLINE' 
  | 'HOTEL' 
  | 'CAR_RENTAL' 
  | 'TSA_KTN' 
  | 'PASSPORT' 
  | 'CONFIRMATION';

export interface LoyaltyAccount {
  id: string;
  category: LoyaltyCategory;
  programOrProvider: string; // e.g. "Delta SkyMiles", "Marriott Bonvoy", "TSA PreCheck / KTN"
  accountNumberOrCode: string; // e.g. "2849182390", "HQ7X8L"
  tierOrNotes?: string; // e.g. "Platinum Medallion", "Expires 2028"
  travelerName?: string; // e.g. "Alex"
  updatedAt?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  isPacked: boolean;
  category?: string;
  customWeightLbs?: number;
  packedFor?: string; // e.g. "Mom", "Dad", "Emma (Child)", "Liam (Toddler)"
}

export interface Bag {
  id: string;
  type: BagType;
  label: string;
  items: PackingItem[];
  maxWeightLimitLbs?: number;
  assignedTo?: string; // default packer / person this bag belongs to
  material?: BagMaterial; // 'HARD_SHELL' | 'FABRIC'
  emptyBagWeightLbs?: number; // tare weight of empty luggage in lbs
}

export interface DepartureReminder {
  id: string;
  title: string;
  category: 'PRE_TRIP' | 'DAY_OF';
  dueOffsetHours?: number; // e.g. 72 (3 days before), 24 (1 day before), 4 (4 hours before departure)
  completed: boolean;
  isCustom?: boolean;
}

export interface LuggageTagInfo {
  bagId: string;
  travelerName: string;
  phoneNumber: string;
  email: string;
  flightNumber?: string;
  bagColor?: string;
  bagBrand?: string;
  bagStyle?: string;
  distinctiveNotes?: string;
  rewardOffered?: boolean;
  updatedAt?: string;
}

export interface GateCheckItem {
  id: string;
  text: string;
  completed: boolean;
  required: boolean;
}

export interface ModeProfile {
  companyName?: string;
  seatClassOrCarSize?: string;
  aircraftType?: string;
}

export interface Trip {
  id: string;
  name: string;
  travelType: TravelType;
  companyName: string;
  seatClassOrCarSize: string;
  originCity?: string;
  destinationCity?: string;
  destinationCountry?: string;
  departureDate?: string;
  departureTime?: string; // HH:mm format, e.g. "08:45"
  departureCountdownEnabled?: boolean;
  departureReminders?: DepartureReminder[];
  familyMembers?: string[]; // e.g. ["Mom (Parent)", "Dad (Parent)", "Emma (Child)", "Lucas (Toddler)"]
  bags: Bag[];
  flightNumber?: string; // e.g. "DL 482", "AC 854"
  aircraftType?: string; // e.g. "Boeing 737-800", "Airbus A321neo", "Embraer 175"
  isReturnRepackMode?: boolean; // whether traveler has switched to return flight repacking
  returnTripDate?: string;
  returnTripTime?: string;
  souvenirBufferEnabled?: boolean; // alert when bag weight exceeds threshold to leave room for souvenirs
  souvenirBufferLbs?: number; // reserved weight buffer in lbs (default 5.0 lbs)
  luggageTags?: Record<string, LuggageTagInfo>;
  gateChecklist?: GateCheckItem[];
  modeProfiles?: Partial<Record<TravelType, ModeProfile>>;
}

export interface BaggageLimitInfo {
  id: string;
  company: string;
  type: TravelType;
  region?: 'USA' | 'Canada' | 'Europe' | 'Asia' | 'Global';
  personalLimit: string;
  carryOnLimit: string;
  checkedLimit: string;
  carryOnWeightLimit?: string;
  checkedWeightLimit?: string;
  notes?: string;
  link?: string;
}
