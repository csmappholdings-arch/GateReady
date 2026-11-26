import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Scale,
  CheckSquare,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Plane,
  Luggage,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Lock,
  Sparkles,
  Phone,
  Clock,
  RefreshCw,
  Crown
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export type ShowcaseTabId = 'dashboard' | 'baggage' | 'packing' | 'qr-tags' | 'readiness';

interface ProductShowcaseProps {
  onStartTrip: () => void;
  onExploreBaggage?: () => void;
  onExplorePacking?: () => void;
  onOpenPricing?: () => void;
  isStandaloneDemoPage?: boolean;
}

interface ShowcaseFeatureSpec {
  id: ShowcaseTabId;
  tabLabel: string;
  badge: string;
  headline: string;
  summary: string;
  highlights: string[];
  ctaLabel: string;
  screenshotSrc: string;
  screenshotAlt: string;
  secondaryScreenshotSrc?: string;
  secondaryScreenshotAlt?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SHOWCASE_FEATURES: ShowcaseFeatureSpec[] = [
  {
    id: 'dashboard',
    tabLabel: 'Dashboard',
    badge: '1. Travel Command Center',
    headline: 'Your Entire Trip. One Clear Dashboard.',
    summary:
      'Keep upcoming departures, luggage allowances, packing progress, and travel readiness checks organized in one uncluttered view before leaving home.',
    highlights: [
      'Active trip cards with departure countdowns across Air, Rail, Bus, Cruise, and Road trips',
      'At-a-glance weight status across every personal, carry-on, and checked bag',
      'Direct shortcuts into your trip workspace, Luggage Library, and Travel Wallet'
    ],
    ctaLabel: 'Start Planning Your Trip',
    screenshotSrc: '/screenshots/demo-dashboard.png',
    screenshotAlt:
      'GateReady Travel Dashboard showing upcoming trip summary cards, departure countdown, bag weight compliance gauges, and readiness score',
    icon: LayoutDashboard
  },
  {
    id: 'baggage',
    tabLabel: 'Baggage',
    badge: '2. Weight Meters & Empty Bag Tare',
    headline: 'Know Your Bag Weight Before You Fly.',
    summary:
      'Model gross packed weight accurately by deducting empty suitcase tare (1.5–3.0 lbs personal, 5.5–7.0 lbs carry-on, 8.5–10.5 lbs checked) against published rules for 42 airlines.',
    highlights: [
      'Color-coded Safe, Caution (≥75%), and Overweight headroom bars calibrated to airline caps',
      'Automatic empty suitcase tare deduction so the shell weight is never overlooked',
      'Suggest-first Rebalance Bags recommendations (Silver+) with 1-click confirmation and full undo'
    ],
    ctaLabel: 'Explore Baggage Tools',
    screenshotSrc: '/screenshots/demo-weight-meters.png',
    screenshotAlt:
      'GateReady Packing Weight Meters showing carry-on and checked suitcase weight percentages against published airline limits',
    secondaryScreenshotSrc: '/screenshots/demo-tare-weight.png',
    secondaryScreenshotAlt:
      'GateReady Empty Suitcase Tare Weight Selector showing hard-shell and fabric presets with remaining packing headroom',
    primaryLabel: 'Weight Meters',
    secondaryLabel: 'Empty Bag Tare',
    icon: Scale
  },
  {
    id: 'packing',
    tabLabel: 'Packing',
    badge: '3. Smart Packing & TSA / CATSA Liquids Check',
    headline: 'Pack With Confidence. Forget Less.',
    summary:
      'Organize items by suitcase and traveler with rule-based carry-on compliance checks that flag oversized liquids (> 3.4 fl oz / 100 mL) and cabin-only electronics before airport screening.',
    highlights: [
      'Per-bag categorized packing lists with packed vs remaining item counts',
      'Rule-based TSA 3-1-1 (1-quart bag) & Canadian CATSA (1-liter resealable bag, 100 mL / 100 g) audit — no camera scan required',
      'Essential safety prompts keeping keys, medications, and lithium power banks out of checked bags'
    ],
    ctaLabel: 'Explore Smart Packing',
    screenshotSrc: '/screenshots/demo-packing-checklist.png',
    screenshotAlt:
      'GateReady Smart Packing Checklist showing categorized items, completion checkboxes, and rule-based TSA 3-1-1 and CATSA liquid checks',
    icon: CheckSquare
  },
  {
    id: 'qr-tags',
    tabLabel: 'QR Tags',
    badge: '4. Privacy-Safe Emergency Recovery',
    headline: 'Give Lost Luggage a Better Chance of Getting Home.',
    summary:
      'Generate printable emergency QR bag tags displaying direct phone/WhatsApp or email contact while omitting your home street address to protect your vacant residence.',
    highlights: [
      'Zero home street address exposed on your suitcase exterior',
      'Scannable vCard contact payload for airline baggage desks or helpful finders',
      'Watermarked preview available on Free; full high-res unwatermarked tags on Silver, Gold & Platinum'
    ],
    ctaLabel: 'Discover QR Luggage Tags',
    screenshotSrc: '/screenshots/demo-qr-tag.png',
    screenshotAlt:
      'GateReady Emergency QR Luggage Recovery Tag preview with scannable contact QR code and privacy-safe non-personal fields',
    icon: QrCode
  },
  {
    id: 'readiness',
    tabLabel: 'Departure Readiness',
    badge: '5. Departure Readiness & Airport Maps',
    headline: "Leave Home Knowing You're Prepared.",
    summary:
      'Verify passport validity guidelines, 42-airline published fee tables, Travel Wallet PNR records, and terminal concourse layouts in a single pre-departure review.',
    highlights: [
      '0–100 Departure Readiness score tracking bags, documents, liquids, and essential items',
      'Reference terminal concourse maps (Silver+) and Travel Wallet loyalty & PNR storage',
      'Baggage fees and allowances are estimates from published airline tables — always confirm at check-in'
    ],
    ctaLabel: 'Explore Travel Readiness',
    screenshotSrc: '/screenshots/demo-departure-readiness.png',
    screenshotAlt:
      'GateReady Departure Readiness summary screen showing overall trip preparation score, checklist items, and airline rules',
    secondaryScreenshotSrc: '/screenshots/demo-terminal-maps.png',
    secondaryScreenshotAlt:
      'GateReady Interactive Airport Terminal and Station Reference Advisor view',
    primaryLabel: 'Readiness Review',
    secondaryLabel: 'Terminal Reference',
    icon: ShieldCheck
  }
];

/**
 * Interactive Preview Fallback rendered cleanly only if static PNG assets
 * under /screenshots/demo-*.png have not yet been captured/mounted.
 */
const ShowcaseArchitecturalFallback: React.FC<{
  tabId: ShowcaseTabId;
  subView: 'primary' | 'secondary';
  expectedPath: string;
}> = ({ tabId, subView, expectedPath }) => {
  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col justify-between gap-4 select-none">
      {/* Mock App Window Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          </div>
          <span className="text-[11px] font-bold text-slate-300 truncate ml-1">
            gateready.ca — Interactive Sample Preview
          </span>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 border border-purple-700/60 px-2 py-0.5 rounded-md shrink-0">
          Sample Data
        </span>
      </div>

      {/* Realistic UI Preview Body matching actual GateReady modules */}
      {tabId === 'dashboard' && (
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-purple-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-black text-amber-300">
                Sample Trip · Air Canada AC849
              </div>
              <div className="text-base sm:text-lg font-black text-white mt-0.5">
                Summer in Lisbon (YYZ → LIS)
              </div>
              <div className="text-xs text-purple-200 flex items-center gap-2 mt-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>14 days until departure · 2 Travelers</span>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-white/15 text-right shrink-0">
              <div className="text-[10px] text-purple-200 uppercase font-bold">Readiness</div>
              <div className="text-xl font-black text-emerald-400 tabular-nums">85 / 100</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Luggage className="w-4 h-4 text-purple-400" />
                  Checked Hardcase
                </span>
                <span className="text-[11px] font-bold text-emerald-400 tabular-nums">42.8 / 50.0 lbs</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[85.6%]" />
              </div>
              <div className="text-[11px] text-slate-400">7.2 lbs headroom · Includes 10.5 lb bag tare</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Packing Progress
                </span>
                <span className="text-[11px] font-bold text-purple-300 tabular-nums">26 / 30 items</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[87%]" />
              </div>
              <div className="text-[11px] text-slate-400">TSA 3-1-1 passed · Travel Wallet PNR saved</div>
            </div>
          </div>
        </div>
      )}

      {tabId === 'baggage' && subView === 'primary' && (
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-white">Checked Spinner · Air Canada Economy</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-[11px] tabular-nums">
                44.5 / 50.0 lbs (89%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full w-[89%]" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
              <span>10.5 lb Empty Tare</span>
              <span>34.0 lb Packed Items</span>
              <span className="text-emerald-400 font-bold">5.5 lbs buffer left</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <RefreshCw className="w-4 h-4 text-purple-300 shrink-0" />
              <div>
                <div className="font-bold text-white">Rebalance Suggestion (Suggest-First)</div>
                <div className="text-[11px] text-purple-200">
                  Move Hiking Boots (3.5 lbs) to Bag 2 — nothing moves without confirmation
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px] shrink-0">
              Apply / Undo
            </span>
          </div>
        </div>
      )}

      {tabId === 'baggage' && subView === 'secondary' && (
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Empty Suitcase Tare Calibration Presets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-400">Personal Item</div>
              <div className="text-lg font-black text-white tabular-nums">1.5–3.0 lbs</div>
              <div className="text-[11px] text-slate-400">Under-seat backpack / tote</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold uppercase text-purple-300">Carry-On Roller</div>
              <div className="text-lg font-black text-white tabular-nums">5.5–7.0 lbs</div>
              <div className="text-[11px] text-slate-400">Fabric 5.5 lb · Hard-shell 7.0 lb</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/60 space-y-1">
              <div className="text-[10px] font-bold uppercase text-amber-300">Checked Suitcase</div>
              <div className="text-lg font-black text-amber-300 tabular-nums">8.5–10.5 lbs</div>
              <div className="text-[11px] text-slate-300">21% of a 50 lb allowance</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
            Tare weight is automatically added to packed item totals so GateReady matches airport check-in scales.
          </div>
        </div>
      )}

      {tabId === 'packing' && (
        <div className="space-y-2.5 flex-1 flex flex-col justify-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Travel Shampoo (3.0 fl oz / 89 ml)</div>
                <div className="text-[11px] text-slate-400">Carry-On Roller · Liquids Category</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
              TSA 3-1-1 Pass
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="font-bold text-rose-100">Full-Size Sunscreen (6.7 fl oz / 200 ml)</div>
                <div className="text-[11px] text-rose-300">Exceeds 3.4 oz cabin limit — rule check</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/25 text-rose-200 font-bold text-[10px] shrink-0">
              Move to Checked
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="font-bold text-white">20,000 mAh Lithium Power Bank</div>
                <div className="text-[11px] text-slate-400">Airline safety: Must remain in cabin luggage</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 font-bold text-[10px]">
              Cabin Protected
            </span>
          </div>
        </div>
      )}

      {tabId === 'qr-tags' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center flex-1">
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 border-2 border-purple-400 shadow-md relative overflow-hidden">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-purple-400 bg-purple-50 flex flex-col items-center justify-center gap-1">
              <QrCode className="w-12 h-12 text-purple-900" />
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-700">
                Sample vCard
              </span>
            </div>
            <div className="text-[10px] font-bold text-slate-600 mt-2 text-center">
              Free: Watermarked Preview · Silver+: Full Print
            </div>
          </div>

          <div className="sm:col-span-7 space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] font-black uppercase text-amber-300">Example Tag Payload</div>
              <div className="font-bold text-white">Owner: Traveler Example</div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct Contact: +1 (555) 019-2834 (Placeholder)</span>
              </div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-purple-400" />
                <span>Bag: Matte Black Spinner · Flight AC849</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-[11px] text-emerald-200 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Home street address intentionally omitted for traveler privacy.</span>
            </div>
          </div>
        </div>
      )}

      {tabId === 'readiness' && subView === 'primary' && (
        <div className="space-y-3 flex-1 flex flex-col justify-center text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Bag Compliance</div>
              <div className="font-black text-emerald-400">All Bags Under Carrier Caps</div>
              <div className="text-[11px] text-slate-400">Estimates from 42 published airline tables</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Travel Documents &amp; Wallet</div>
              <div className="font-black text-white">Passport 6-Mo Valid · PNR Saved</div>
              <div className="text-[11px] text-slate-400">Entry reference &amp; loyalty IDs organized</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Printable Packing Manifest &amp; Gate Checklist</span>
            <span className="px-2.5 py-1 rounded-md bg-purple-600 text-white font-bold text-[10px]">
              Ready for Departure
            </span>
          </div>
        </div>
      )}

      {tabId === 'readiness' && subView === 'secondary' && (
        <div className="space-y-3 flex-1 flex flex-col justify-center text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                Reference Concourse Guide — Major Hubs
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/25 text-purple-200">
                Silver+ (Silver, Gold &amp; Platinum)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Static terminal concourse layouts and transfer walking times for major hubs. GateReady does not stream live flight statuses or gate-change alerts.
            </p>
          </div>
        </div>
      )}

      {/* Honest Screenshot Slot Caption */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-400">
        <span>Interactive feature preview</span>
        <span className="font-mono text-slate-500 truncate">Asset path: {expectedPath}</span>
      </div>
    </div>
  );
};

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onStartTrip,
  onExploreBaggage,
  onExplorePacking,
  onOpenPricing,
  isStandaloneDemoPage = false
}) => {
  const [activeTab, setActiveTab] = useState<ShowcaseTabId>('dashboard');
  const [subView, setSubView] = useState<'primary' | 'secondary'>('primary');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeFeature = SHOWCASE_FEATURES.find((f) => f.id === activeTab) || SHOWCASE_FEATURES[0];

  const handleSelectTab = (id: ShowcaseTabId) => {
    setActiveTab(id);
    setSubView('primary');
    trackEvent('product_showcase_tab_selected', { tab: id });
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % SHOWCASE_FEATURES.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + SHOWCASE_FEATURES.length) % SHOWCASE_FEATURES.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = SHOWCASE_FEATURES.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      const target = SHOWCASE_FEATURES[nextIndex];
      handleSelectTab(target.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const handleFeatureCta = () => {
    trackEvent('product_showcase_cta_click', { tab: activeFeature.id, label: activeFeature.ctaLabel });
    switch (activeFeature.id) {
      case 'dashboard':
        onStartTrip();
        break;
      case 'baggage':
        if (onExploreBaggage) {
          onExploreBaggage();
        } else {
          const el = document.getElementById('interactive-trip-preview');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.location.href = '/baggage-fee-calculator';
        }
        break;
      case 'packing':
        if (onExplorePacking) {
          onExplorePacking();
        } else {
          onStartTrip();
        }
        break;
      case 'qr-tags':
        if (onOpenPricing) {
          onOpenPricing();
        } else {
          window.location.href = '/pricing';
        }
        break;
      case 'readiness':
        if (isStandaloneDemoPage) {
          window.location.href = '/how-it-works';
        } else {
          onStartTrip();
        }
        break;
    }
  };

  const currentImageSrc =
    subView === 'secondary' && activeFeature.secondaryScreenshotSrc
      ? activeFeature.secondaryScreenshotSrc
      : activeFeature.screenshotSrc;
  const currentImageAlt =
    subView === 'secondary' && activeFeature.secondaryScreenshotAlt
      ? activeFeature.secondaryScreenshotAlt
      : activeFeature.screenshotAlt;

  const isImageMissing = !!failedImages[currentImageSrc];
  const isImageLoaded = !!loadedImages[currentImageSrc];

  const handleImageError = (src: string) => {
    setFailedImages((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  const handleImageLoad = (src: string) => {
    setLoadedImages((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  const ActiveIcon = activeFeature.icon;

  return (
    <section
      id="product-demo-showcase"
      aria-labelledby="product-demo-heading"
      className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14"
    >
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-xl overflow-hidden">
        {/* Section Header */}
        <div className="px-5 sm:px-8 pt-7 sm:pt-9 pb-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-purple-50/70 via-white to-white dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Interactive Product Walkthrough · Open Access</span>
              </div>
              <h2
                id="product-demo-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
              >
                See GateReady Inside Before You Sign Up
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Explore the actual travel dashboard, tare-deducted bag weight meters, TSA 3-1-1 checklist audit, emergency QR bag tags, and departure readiness screen — no account or subscription required.
              </p>
            </div>

            {!isStandaloneDemoPage && (
              <a
                href="/demo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white underline decoration-dotted shrink-0"
              >
                <span>Open full-screen demo page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Interactive 5-Tab Bar (Keyboard accessible + horizontally scrollable on mobile) */}
          <div
            role="tablist"
            aria-label="GateReady product demonstration views"
            className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
          >
            {SHOWCASE_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isSelected = activeTab === feature.id;
              return (
                <button
                  key={feature.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  id={`showcase-tab-${feature.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`showcase-panel-${feature.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelectTab(feature.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap shrink-0 transition-all motion-reduce:transition-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 border border-purple-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{feature.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Demonstration Panel */}
        <div
          id={`showcase-panel-${activeFeature.id}`}
          role="tabpanel"
          aria-labelledby={`showcase-tab-${activeFeature.id}`}
          className="p-5 sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left / Copy & Action Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 text-xs font-bold">
                <ActiveIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{activeFeature.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {activeFeature.headline}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeFeature.summary}
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {activeFeature.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {activeFeature.id === 'qr-tags' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Plan access:</strong> Free accounts can preview watermarked QR tags. Silver ($1.99/mo), Gold ($3.99/mo), and Platinum ($4.99/mo) unlock unwatermarked high-resolution printable tags — also included in the 7-day free Platinum trial.
                  </span>
                </div>
              )}

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleFeatureCta}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-purple-600/25 transition-all motion-reduce:transition-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <span>{activeFeature.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right / Visual Screenshot Frame Column */}
            <div className="lg:col-span-7 space-y-3">
              {/* Sub-view switcher when feature has two verified app screens (e.g. Weight Meters + Tare, Readiness + Terminal Maps) */}
              {activeFeature.secondaryScreenshotSrc && (
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSubView('primary')}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      subView === 'primary'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {activeFeature.primaryLabel || 'Primary View'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubView('secondary')}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      subView === 'secondary'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {activeFeature.secondaryLabel || 'Detail View'}
                  </button>
                </div>
              )}

              <figure className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-950 shadow-lg overflow-hidden">
                <div className="aspect-[16/10] w-full relative overflow-hidden">
                  {!isImageMissing ? (
                    <>
                      {!isImageLoaded && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center text-xs font-semibold text-slate-400"
                        >
                          Loading {activeFeature.tabLabel} preview…
                        </div>
                      )}
                      <img
                        src={currentImageSrc}
                        alt={currentImageAlt}
                        loading={activeTab === 'dashboard' && subView === 'primary' ? 'eager' : 'lazy'}
                        onLoad={() => handleImageLoad(currentImageSrc)}
                        onError={() => handleImageError(currentImageSrc)}
                        className={`w-full h-full object-contain bg-slate-950 transition-opacity duration-200 ${
                          isImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </>
                  ) : (
                    <ShowcaseArchitecturalFallback
                      tabId={activeFeature.id}
                      subView={subView}
                      expectedPath={currentImageSrc}
                    />
                  )}
                </div>
                <figcaption className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between gap-2 flex-wrap">
                  <span>{currentImageAlt}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {activeFeature.tabLabel}
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Thumbnail / Screen Selector Strip covering all 7 product screens */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Explore All 7 Product Screens
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {[
                { label: 'Dashboard', tab: 'dashboard' as ShowcaseTabId, sub: 'primary' as const, path: '/screenshots/demo-dashboard.png' },
                { label: 'Weight Meters', tab: 'baggage' as ShowcaseTabId, sub: 'primary' as const, path: '/screenshots/demo-weight-meters.png' },
                { label: 'Tare Weight', tab: 'baggage' as ShowcaseTabId, sub: 'secondary' as const, path: '/screenshots/demo-tare-weight.png' },
                { label: 'Packing List', tab: 'packing' as ShowcaseTabId, sub: 'primary' as const, path: '/screenshots/demo-packing-checklist.png' },
                { label: 'QR Bag Tag', tab: 'qr-tags' as ShowcaseTabId, sub: 'primary' as const, path: '/screenshots/demo-qr-tag.png' },
                { label: 'Readiness', tab: 'readiness' as ShowcaseTabId, sub: 'primary' as const, path: '/screenshots/demo-departure-readiness.png' },
                { label: 'Terminal Maps', tab: 'readiness' as ShowcaseTabId, sub: 'secondary' as const, path: '/screenshots/demo-terminal-maps.png' }
              ].map((screen) => {
                const isSelected = activeTab === screen.tab && subView === screen.sub;
                return (
                  <button
                    key={screen.path}
                    type="button"
                    onClick={() => {
                      setActiveTab(screen.tab);
                      setSubView(screen.sub);
                    }}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-left transition-all motion-reduce:transition-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-100 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{screen.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                      {screen.path.replace('/screenshots/', '')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Showcase Conversion Bar */}
        <div className="px-5 sm:px-8 py-5 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-0.5">
            <div className="text-sm font-black text-slate-900 dark:text-white">
              Ready to try GateReady on your upcoming trip?
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Start 100% free with 1 active trip &amp; 2 bags. No credit card or subscription required.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                trackEvent('showcase_global_cta_start_trip');
                onStartTrip();
              }}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-purple-600/25 cursor-pointer transition-all motion-reduce:transition-none"
            >
              <Plane className="w-4 h-4" />
              <span>Start Your Free Trip</span>
            </button>

            {onOpenPricing ? (
              <button
                type="button"
                onClick={() => {
                  trackEvent('showcase_global_cta_pricing');
                  onOpenPricing();
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>View Plans &amp; Pricing</span>
              </button>
            ) : (
              <a
                href="/pricing"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
              >
                <span>View Plans &amp; Pricing</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
