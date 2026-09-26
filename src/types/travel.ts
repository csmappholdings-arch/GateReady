export type TravelType = 'PLANE' | 'TRAIN' | 'CAR' | 'CRUISE' | 'BUS';

export type BagType = 'PERSONAL' | 'CARRY_ON' | 'CHECKED';

export type WeightUnit = 'LBS' | 'KG';

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
}

export interface DepartureReminder {
  id: string;
  title: string;
  category: 'PRE_TRIP' | 'DAY_OF';
  dueOffsetHours?: number; // e.g. 72 (3 days before), 24 (1 day before), 4 (4 hours before departure)
  completed: boolean;
  isCustom?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  travelType: TravelType;
  companyName: string;
  seatClassOrCarSize: string;
  departureDate?: string;
  departureTime?: string; // HH:mm format, e.g. "08:45"
  departureCountdownEnabled?: boolean;
  departureReminders?: DepartureReminder[];
  familyMembers?: string[]; // e.g. ["Mom (Parent)", "Dad (Parent)", "Emma (Child)", "Lucas (Toddler)"]
  bags: Bag[];
  gateChecklist?: {
    id: string;
    text: string;
    completed: boolean;
    required: boolean;
  }[];
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
