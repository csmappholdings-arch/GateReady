export interface PlanDefinition {
  id: 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  name: string;
  badge: string;
  monthlyPrice: number;
  yearlyPrice: number;
  formattedMonthly: string;
  formattedYearly: string;
  travelersCount: number; // 999 for unlimited
  activeTripsCount: number; // 999 for unlimited
  maxBags: number; // 999 for unlimited
  tagline: string;
  features: string[];
  popular?: boolean;
}

export const PLAN_DEFINITIONS: Record<'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM', PlanDefinition> = {
  FREE: {
    id: 'FREE',
    name: 'Free Starter',
    badge: 'Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    formattedMonthly: '$0',
    formattedYearly: '$0',
    travelersCount: 1,
    activeTripsCount: 1,
    maxBags: 2,
    tagline: 'Ideal for occasional travelers organizing basic trip preparation.',
    features: [
      '1 traveler',
      '1 active trip',
      '2 bags max (1 checked + 1 carry-on)',
      'Smart Luggage Scales',
      'TSA 3-1-1 liquids checker',
      '42-airline baggage allowance lookup',
      'Personal cloud sync (all your devices)'
    ]
  },
  SILVER: {
    id: 'SILVER',
    name: 'Silver',
    badge: 'Individual Travelers',
    monthlyPrice: 1.99,
    yearlyPrice: 19.99,
    formattedMonthly: '$1.99',
    formattedYearly: '$19.99',
    travelersCount: 1,
    activeTripsCount: 2,
    maxBags: 999,
    tagline: 'For solo flyers and business travelers who want unlimited bags, tare subtraction, and luggage tools.',
    features: [
      '1 traveler',
      '2 active trips',
      'Unlimited bags & scales',
      'Suitcase tare weight deduction',
      'Smart bag rebalance optimizer',
      'Emergency QR luggage recovery tags',
      'Terminal maps & hub cabin intelligence',
      'Travel wallet (loyalty numbers & PNR codes)',
      'Printable PDF packing manifests',
      'Personal cloud sync (all your devices)'
    ]
  },
  GOLD: {
    id: 'GOLD',
    name: 'Gold',
    badge: 'Couples & Small Families',
    monthlyPrice: 3.99,
    yearlyPrice: 29.99,
    formattedMonthly: '$3.99',
    formattedYearly: '$29.99',
    travelersCount: 2,
    activeTripsCount: 999,
    maxBags: 999,
    tagline: 'For couples and small families who want unlimited trips and multi-traveler companion sync.',
    popular: true,
    features: [
      '2 travelers (couples & companions)',
      'Unlimited active trips',
      'Unlimited bags & luggage scales',
      'Companion real-time sync (2 travelers)',
      'Everything in Silver included'
    ]
  },
  PLATINUM: {
    id: 'PLATINUM',
    name: 'Platinum All-Inclusive',
    badge: 'All-Inclusive VIP',
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    formattedMonthly: '$4.99',
    formattedYearly: '$39.99',
    travelersCount: 999,
    activeTripsCount: 999,
    maxBags: 999,
    tagline: 'For frequent flyers and large families who want total travel peace of mind.',
    features: [
      'Unlimited travelers & family members',
      'Unlimited active trips',
      'Unlimited bags & luggage scales',
      'Family sharing across unlimited devices',
      'Priority baggage fee update requests',
      'VIP fast support response',
      'Everything in Gold included'
    ]
  }
};
