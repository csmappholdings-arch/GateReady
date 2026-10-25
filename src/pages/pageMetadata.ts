/**
 * Page Metadata and Pre-Rendered Content Definitions
 * 
 * Strict compliance with GateReady facts:
 * - Brand: GateReady (gateready.ca)
 * - Owner: CSM App Holdings
 * - Support Contact: csmappholdings@gmail.com (ONLY contact method)
 * - Plans: Free $0, Silver $1.99/mo or $19.99/yr, Gold $3.99/mo or $29.99/yr, Platinum $4.99/mo or $39.99/yr
 * - 14-day money-back guarantee, checkout via Lemon Squeezy
 * - Free signup = 7-day full Platinum trial, no card, returns to Free at day 7
 * - Guest trips in localStorage, Firebase for accounts, no data sale
 * - Referrals: 1 free month of Platinum for friend & referrer
 * - No invented addresses/phones -> [TO BE PROVIDED BY OWNER]
 */

export interface StaticPageMeta {
  path: string;
  title: string;
  description: string;
  heading: string;
  subheading: string;
}

export const STATIC_PAGES: Record<string, StaticPageMeta> = {
  '/about': {
    path: '/about',
    title: 'About GateReady – Smart Trip Packing & Luggage Limit App',
    description: 'Learn about GateReady, the packing app by CSM App Holdings built to help travelers avoid unexpected airline baggage fees and audit suitcase tare weight.',
    heading: 'About GateReady',
    subheading: 'Built for travelers who want to eliminate baggage fees and airport surprises.'
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy – GateReady',
    description: 'GateReady privacy policy. We store guest lists in your browser, sync accounts via Firebase, and never sell personal information.',
    heading: 'Privacy Policy',
    subheading: 'How your data is stored, synced, and protected.'
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Service – GateReady',
    description: 'GateReady terms of service. Review our trip planning tool guidelines, plan billing terms via Lemon Squeezy, and 14-day money-back guarantee.',
    heading: 'Terms of Service',
    subheading: 'Clear, straightforward terms for using GateReady.'
  },
  '/contact': {
    path: '/contact',
    title: 'Contact Support – GateReady',
    description: 'Get in touch with the GateReady support team at CSM App Holdings. Email support for account, baggage fee estimate, or technical questions.',
    heading: 'Contact Support',
    subheading: 'We are here to help with your packing questions and account support.'
  },
  '/faq': {
    path: '/faq',
    title: 'Frequently Asked Questions – GateReady',
    description: 'Answers to common questions about GateReady packing checklists, 7-day Platinum trial, baggage fee calculations, and TSA 3-1-1 rules.',
    heading: 'Frequently Asked Questions',
    subheading: 'Direct answers to the questions travelers ask most.'
  },
  '/pricing': {
    path: '/pricing',
    title: 'Pricing & Plans – GateReady',
    description: 'Explore GateReady plans from Free ($0) to Silver ($1.99/mo), Gold ($3.99/mo), and Platinum ($4.99/mo). Includes 14-day money-back guarantee.',
    heading: 'Simple, Transparent Pricing',
    subheading: 'Free for basic travel, with affordable upgrades for unlimited bags, family packing, and terminal intel.'
  },
  '/how-it-works': {
    path: '/how-it-works',
    title: 'How It Works – GateReady Packing App Tour',
    description: 'A step-by-step tour of GateReady: tare weight calculation, TSA 3-1-1 liquids compliance, 42-airline baggage allowance lookup, and departure countdown.',
    heading: 'How GateReady Works',
    subheading: 'Your step-by-step packing companion from list creation to the boarding gate.'
  },
  '/cookies': {
    path: '/cookies',
    title: 'Cookie & Local Storage Policy – GateReady',
    description: 'Information about how GateReady uses browser local storage and essential session cookies for trip lists and account authentication.',
    heading: 'Cookie & Storage Policy',
    subheading: 'Transparent information on browser storage and session cookies.'
  },
  '/refunds': {
    path: '/refunds',
    title: 'Refund Policy & 14-Day Guarantee – GateReady',
    description: 'GateReady 14-day money-back guarantee on all paid plans. Learn how refunds are processed via Lemon Squeezy by CSM App Holdings.',
    heading: 'Refund Policy',
    subheading: '14-day money-back guarantee on all paid GateReady plans.'
  },
  '/changelog': {
    path: '/changelog',
    title: 'Changelog & Updates – GateReady',
    description: 'What is new in GateReady. Track recent releases, bug fixes, baggage fee database updates, and compliance enhancements.',
    heading: 'What’s New in GateReady',
    subheading: 'A continuous log of product updates, feature refinements, and airline database revisions.'
  },
  '/security': {
    path: '/security',
    title: 'Security Practices – GateReady',
    description: 'Learn how GateReady protects user information with Firebase Authentication, encrypted token sessions, and zero storage of credit card data.',
    heading: 'Security & Data Protection',
    subheading: 'Factual information on our security practices and account safeguards.'
  },
  '/reviews': {
    path: '/reviews',
    title: 'Traveler Reviews – GateReady',
    description: 'Verified traveler feedback and community reviews for GateReady.',
    heading: 'Traveler Reviews',
    subheading: 'Real feedback from travelers around the globe.'
  }
};
