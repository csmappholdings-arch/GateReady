import { TRIAL_TERMS_EXACT } from './planEntitlements';

export interface PlainFaqItem {
  question: string;
  answer: string;
}

/**
 * Canonical visible FAQs shared verbatim by /faq (React + SSR) and FAQPage JSON-LD.
 */
export const MAIN_FAQS: PlainFaqItem[] = [
  {
    question: 'How do the free account and 7-day Platinum trial work?',
    answer: `GateReady is completely free to start. ${TRIAL_TERMS_EXACT} While the 7-day trial is active, all tiers and features are unlocked: unlimited trips, unlimited bags, suitcase tare deduction, smart bag rebalancing, terminal maps, and emergency QR luggage tags. Free starter access (1 active trip, 2 bags, 42 airline allowance lookup, and personal cloud sync) remains yours forever.`
  },
  {
    question: 'What happens at day 7 when the trial ends?',
    answer: `${TRIAL_TERMS_EXACT} Your lists remain saved in your account. You are never automatically charged or billed. If you wish to continue using Silver, Gold, or Platinum features, you can upgrade voluntarily via Lemon Squeezy; otherwise, your packing lists and Free tier access continue indefinitely.`
  },
  {
    question: 'Are baggage fees exact or estimates?',
    answer: `Baggage fees shown in GateReady are estimates calculated from published airline fee tables for 42 carriers. Airlines frequently adjust luggage fees based on ticket class (Basic Economy vs Main Cabin vs Premium), route type (domestic vs transoceanic), frequent flyer status, and whether fees are prepaid online or paid at the airport ticket counter. Always confirm your specific allowance and fees on your airline's official booking confirmation or website before heading to the airport.`
  },
  {
    question: 'What happens to my packing list if I use GateReady without signing up?',
    answer: `If you use GateReady as a guest without creating an account, your packing lists and weight settings are saved strictly in your current browser's localStorage. They never touch our cloud servers. However, this means if you clear your browser cache, switch devices, or switch from private browsing mode, guest data cannot be recovered. Creating a free account syncs your lists safely to Firebase so you can open them on any device.`
  },
  {
    question: 'How does the TSA 3-1-1 & CATSA liquids checker work?',
    answer: `The GateReady liquids checker is a catalog and item-level rule reference tool, not a camera scanner or physical sensor. When you add toiletries or non-solid foods to a carry-on bag, GateReady compares printed container sizes against the 3.4 fl oz / 100 mL standard (US TSA 3-1-1 inside 1 clear quart-sized zip-top bag; Canadian CATSA 100 mL / 100 g inside 1 clear, closed, resealable 1-liter plastic bag). It provides planning guidance only and does not guarantee security screening clearance.`
  },
  {
    question: 'How does the referral program work?',
    answer: `GateReady has a straightforward, transparent referral program: Share your unique referral link with fellow travelers. When your friend signs up for a free account, they immediately receive 1 free month of the Platinum Plan (a $4.99 value). You also receive 1 free month of Platinum credited automatically to your account. Neither you nor your friend needs to enter a payment card or buy a plan to receive the referral credit.`
  },
  {
    question: 'How do I cancel a subscription, and how does the 14-day guarantee work?',
    answer: `All paid plans (Silver, Gold, Platinum) come with a 14-day money-back guarantee. If you decide GateReady isn't right for you within 14 days of subscribing, simply email us at csmappholdings@gmail.com with your email or Lemon Squeezy order number, and we will issue a full refund. You can also cancel future renewals anytime from your account settings or directly via the manage subscription link in your Lemon Squeezy receipt.`
  },
  {
    question: 'Why does empty suitcase "tare weight" matter?',
    answer: `An empty carry-on suitcase defaults to 5.5 to 7.0 lbs (2.5 to 3.2 kg) in GateReady's fabric and hard-shell presets, while a checked suitcase defaults to 8.5 to 10.5 lbs (3.9 to 4.8 kg) empty and personal items run 1.5 to 3.0 lbs (0.7 to 1.4 kg). On carriers with strict weight limits (such as European and Asian airlines with 15.4 lb / 7 kg carry-on limits), the empty bag alone eats up 40% to 50% of your total weight allowance before you pack a single shirt. GateReady factors in empty tare weight so your bag matches what airport ticket counter scales actually weigh.`
  },
  {
    question: 'Which airlines are included in the allowance database?',
    answer: `GateReady includes 42 major carriers including Air Canada, WestJet, Porter, Delta, United, American Airlines, Southwest, British Airways, Air France, Lufthansa, KLM, Emirates, Ryanair, easyJet, Japan Airlines, ANA, Singapore Airlines, and many others.`
  }
];

export interface TsaLiquidRuleRow {
  item: string;
  size: string;
  carryOnAllowed: 'Yes' | 'No (Checked Only)' | 'Exempt with Declaration';
  notes: string;
}

export const TSA_LIQUIDS_TABLE: TsaLiquidRuleRow[] = [
  {
    item: 'Travel Shampoo / Conditioner Bottle',
    size: '3.0 fl oz (89 mL)',
    carryOnAllowed: 'Yes',
    notes: 'At or below 3.4 fl oz (100 mL); pack in 1 clear quart-sized zip-top bag (US TSA) or 1 clear, closed, resealable 1 L bag (Canada CATSA).'
  },
  {
    item: 'Full-Size Sunscreen Lotion',
    size: '6.7 fl oz (200 mL)',
    carryOnAllowed: 'No (Checked Only)',
    notes: 'Container exceeds 3.4 fl oz (100 mL), even if partially empty. Pack in checked luggage.'
  },
  {
    item: 'Yogurt, Peanut Butter or Maple Syrup',
    size: '150 g / 150 mL',
    carryOnAllowed: 'No (Checked Only)',
    notes: 'Under both CATSA (100 mL / 100 g non-solid food cap) and TSA rules, spreadable or liquid foods over 100 mL / 3.4 fl oz must be checked.'
  },
  {
    item: 'Contact Lens Solution / Eyedrops',
    size: '4.0 fl oz (118 mL) Medical',
    carryOnAllowed: 'Exempt with Declaration',
    notes: 'Medically necessary liquids over 3.4 fl oz (100 mL) are exempt in reasonable quantities when declared separately at security.'
  },
  {
    item: 'Aerosol Deodorant / Dry Shampoo',
    size: '5.0 oz (148 mL)',
    carryOnAllowed: 'No (Checked Only)',
    notes: 'Aerosols over 3.4 fl oz / 100 mL must go in checked baggage under TSA, CATSA, and airline toiletry limits.'
  },
  {
    item: 'Hand Sanitizer Travel Bottle',
    size: '2.0 fl oz (59 mL)',
    carryOnAllowed: 'Yes',
    notes: 'Permitted inside your clear 1-quart zip-top bag (US TSA) or 1-liter resealable plastic bag (Canada CATSA).'
  },
  {
    item: 'Prescription Liquid Medication',
    size: 'Any prescribed size',
    carryOnAllowed: 'Exempt with Declaration',
    notes: 'Keep in carry-on with pharmacy label; separate from your liquids bag and declare to the TSA or CATSA screening officer.'
  },
  {
    item: 'Baby Formula / Breast Milk',
    size: 'Over 3.4 fl oz (100 mL)',
    carryOnAllowed: 'Exempt with Declaration',
    notes: 'Exempt in reasonable trip quantities under both TSA and CATSA rules; present separately for checkpoint screening.'
  },
  {
    item: 'Lip Balm / Solid Stick Deodorant',
    size: 'Solid',
    carryOnAllowed: 'Yes',
    notes: 'Non-gel solids are excluded from the 3-1-1 / 1 L liquids bag rule; spreadable gels, creams, and pastes are counted.'
  }
];

export const TSA_LIQUIDS_FAQS: PlainFaqItem[] = [
  {
    question: 'What does the US TSA 3-1-1 rule mean?',
    answer: 'For flights departing the United States, TSA 3-1-1 allows containers of 3.4 fl oz (100 mL) or less per item, packed inside 1 clear quart-sized zip-top plastic bag, with 1 bag permitted per passenger. Official rules: tsa.gov/travel/security-screening/liquids-aerosols-gels-rule.'
  },
  {
    question: 'What is the Canadian CATSA equivalent to TSA 3-1-1?',
    answer: 'For flights departing Canada, CATSA allows liquids, aerosols, gels, and non-solid foods (such as yogurt, spreads, or syrup) in containers of 100 mL or 100 g or less, fitting comfortably inside 1 clear, closed, resealable plastic bag with a maximum capacity of 1 liter (1 L) per passenger. Official rules: catsa-acsta.gc.ca/en/what-can-bring/liquids-non-solid-food-personal-items.'
  },
  {
    question: 'Does container size or remaining liquid amount count?',
    answer: 'Screeners enforce the printed volume on the container itself. A half-empty 6.7 fl oz (200 mL) bottle can be rejected at security because the container capacity exceeds 3.4 fl oz (100 mL).'
  },
  {
    question: 'Does GateReady guarantee checkpoint clearance?',
    answer: 'No. GateReady is a list-based rule reference tool (not a camera scanner) that helps flag bottles over 3.4 fl oz (100 mL) before departure. Final security clearance decisions rest solely with TSA, CATSA, or local screening officers.'
  },
  {
    question: 'Which liquids are exempt from the 3.4 fl oz (100 mL) limit?',
    answer: 'Prescription liquid medications, essential medical liquids such as saline contact solution, and baby formula, breast milk, or toddler purées are exempt from the 3.4 fl oz (100 mL) limit in reasonable quantities under both TSA and CATSA when declared separately at the checkpoint.'
  }
];

export const CARRY_ON_FAQS: PlainFaqItem[] = [
  {
    question: 'Do airline carry-on dimensions include wheels and handles?',
    answer: 'Yes. Published carry-on sizer limits include wheels, top and side carry handles, and any overstuffed exterior pockets. A bag advertised as a 21-inch case can still fail a gate sizer if wheels add 1.5 inches.'
  },
  {
    question: 'Which airlines weigh carry-on bags vs allowing no weight limit?',
    answer: 'Legacy US and Canadian carriers such as Air Canada, WestJet, Delta, United, and American Airlines have no fixed carry-on weight limit as long as you can lift the bag unassisted. Porter Airlines (20 lbs), Air Transat (22 lbs), Lufthansa Group (17.6 lbs), and Asia-Pacific carriers like Singapore Airlines and Qantas (15.4 lbs / 7 kg) enforce strict weight caps.'
  },
  {
    question: 'Which fares exclude a full-size overhead carry-on bag?',
    answer: 'Air Canada Basic (North America and Sun routes), WestJet UltraBasic (Canada and US routes), United Basic Economy (most domestic flights), Frontier Basic, Ryanair non-Priority, easyJet standard, and Finnair Superlight limit you to an under-seat personal item unless you pay for an upgrade or overhead add-on.'
  },
  {
    question: 'How much does empty luggage tare weight take out of a carry-on cap?',
    answer: 'A soft-sided carry-on roller defaults to 5.5 lbs empty and a hard-shell carry-on spinner defaults to 7.0 lbs empty. On a 22 lb (10 kg) carry-on cap, a hard-shell case uses 32% of your limit before any clothes go in.'
  },
  {
    question: 'Does GateReady use a phone camera to measure my suitcase?',
    answer: 'No. GateReady compares your selected bag profile and airline against published carrier sizer dimensions and weight caps from our verified 42-airline reference database.'
  }
];

export interface CapsulePackingItem {
  category: string;
  item: string;
  quantity: number;
  unitWeightLbs: number;
  notes: string;
}

export const PACKING_7_DAY_CAPSULE: CapsulePackingItem[] = [
  { category: 'Tops (5)', item: 'Breathable T-Shirts / Polos / Blouses', quantity: 5, unitWeightLbs: 0.4, notes: 'Quick-dry or neutral colors mix with every bottom' },
  { category: 'Bottoms (4)', item: 'Travel Chinos, Jeans & Shorts / Skirts', quantity: 4, unitWeightLbs: 1.0, notes: 'Wear the heaviest pair (jeans) on the plane' },
  { category: 'Layers (3)', item: 'Packable Jacket, Cardigan & Sweater', quantity: 3, unitWeightLbs: 0.9, notes: 'Wear outerwear onto the aircraft to save bag weight' },
  { category: 'Footwear (2)', item: 'Walking Sneakers + Casual Dinner Shoes', quantity: 2, unitWeightLbs: 1.6, notes: 'Wear heaviest sneakers on travel day; pack lighter pair inside' },
  { category: 'Essentials (1+)', item: 'Undergarments & Socks (7 pairs)', quantity: 7, unitWeightLbs: 0.12, notes: 'Roll or store in a single compression cube' },
  { category: 'TSA Liquids', item: '3-1-1 Quart Bag (Shampoo, Toothpaste, Cleanser ≤ 3.4 oz)', quantity: 1, unitWeightLbs: 1.1, notes: 'Kept accessible at top of bag for screening' },
  { category: 'Tech & Docs', item: 'Passport, Charger, Adapter & Power Bank', quantity: 1, unitWeightLbs: 1.4, notes: 'Lithium power banks must travel in cabin carry-on, never checked' }
];

export const PACKING_LIST_7_DAY_FAQS: PlainFaqItem[] = [
  {
    question: 'What is the 5-4-3-2-1 packing method for a 7-day carry-on trip?',
    answer: 'The 5-4-3-2-1 capsule packs 5 tops, 4 bottoms, 3 layering pieces, 2 pairs of shoes, and 1 swimwear or dressy set (plus 7 pairs of socks and underwear). Multiplying tops by bottoms by layers yields up to 40 distinct outfit combinations from just 14 core clothing items.'
  },
  {
    question: 'How much does a 7-day carry-on capsule weigh with suitcase tare included?',
    answer: 'The 5-4-3-2-1 capsule table totals 15.2 lbs before travel-day worn items. Wearing your heaviest sneakers, jeans, and outerwear on the plane removes ~3.5 lbs, leaving ~11.7 lbs packed inside the bag. Combined with a 5.5 lb fabric carry-on (17.2 lbs gross) or 7.0 lb hard-shell spinner (18.7 lbs gross), it stays well under 20 to 22 lb airline cabin caps.'
  },
  {
    question: 'What if my airline limits carry-ons to 15.4 lbs (7 kg)?',
    answer: 'Use a lightweight 5.5 lb fabric carry-on or 1.5 lb personal backpack, wear your heaviest sneakers, jeans, and jacket at boarding, and move tech chargers and toiletry pouch weight into your personal under-seat item.'
  },
  {
    question: 'Can I customize the 5-4-3-2-1 capsule inside GateReady?',
    answer: 'Yes. Inside any GateReady trip checklist, steppers let you adjust Tops, Bottoms, Layers, and Shoes dynamically and pack the generated capsule straight into your selected carry-on or checked bag with tare weight headroom updates as you pack.'
  }
];
