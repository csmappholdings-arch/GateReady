export type TravelType = 'PLANE' | 'TRAIN' | 'CAR' | 'CRUISE' | 'BUS';

export type BagType = 'PERSONAL' | 'CARRY_ON' | 'CHECKED';

export type WeightUnit = 'LBS' | 'KG';

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
  aircraftType?: string; // e.g. "Boeing 737-800", "Airbus A321neo", "Embraer 175"
  isReturnRepackMode?: boolean; // whether traveler has switched to return flight repacking
  returnTripDate?: string;
  returnTripTime?: string;
  souvenirBufferEnabled?: boolean; // alert when bag weight exceeds 75% to leave room for souvenirs
  luggageTags?: Record<string, LuggageTagInfo>;
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
