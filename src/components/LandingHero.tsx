import React, { useState } from 'react';
import { 
  Scale, 
  Droplets, 
  Clock, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Luggage, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Plane,
  ChevronDown,
  Cloud,
  FileText,
  Users,
  Wallet,
  Calculator,
  QrCode,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  Star,
  RefreshCw
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface LandingHeroProps {
  onOpenAddTrip: () => void;
  onLoadDemo: () => void;
  onOpenPricing: () => void;
  onOpenAirlineGuides?: () => void;
  onOpenAccountSync?: () => void;
  onExploreTools?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenAddTrip,
  onLoadDemo,
  onOpenPricing,
  onOpenAirlineGuides,
  onOpenAccountSync,
  onExploreTools
}) => {
  const [activeDemoTab, setActiveDemoTab] = useState<'scale' | 'tsa' | 'airlines' | 'checklist' | 'wallet' | 'pdf'>('scale');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handlePrimaryClick = () => {
    trackEvent('primary_cta_click', { location: 'hero_primary' });
    onOpenAddTrip();
  };

  const handleSecondaryClick = () => {
    trackEvent('secondary_cta_click', { location: 'hero_secondary' });
    if (onExploreTools) {
      onExploreTools();
    } else {
      const el = document.getElementById('interactive-trip-preview');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/baggage-fee-calculator';
      }
    }
  };

  const faqs = [
    {
      q: 'Is GateReady really free to use?',
      a: 'Yes! GateReady offers a 100% free starter plan forever. You can create 1 active trip, track up to 2 bags, look up baggage limits across 42+ airlines, run TSA 3-1-1 liquids audits, and sync your data securely across all your personal devices with no credit card required.'
    },
    {
      q: 'What is included in the 7-day Platinum trial?',
      a: 'When you create a free account, you instantly unlock 7 full days of GateReady Platinum. This allows you to test unlimited bags, suitcase tare weight deduction, multi-traveler family coordination, PDF export manifests, and emergency QR luggage tags. When the 7 days end, your account automatically safely reverts to the Free plan with zero surprise charges.'
    },
    {
      q: 'Does cloud sync work on the Free plan?',
      a: 'Yes! Cloud sync is completely un-gated and works across every tier (Free, Silver, Gold, Platinum). When you sign in on your phone, tablet, or laptop, your trips, suitcases, and packing checklists update seamlessly in real time.'
    },
    {
      q: 'How does empty suitcase tare deduction save money?',
      a: 'Most travelers weigh their packed bags on a bathroom scale and forget that empty hard-shell suitcases alone weigh 6 to 9 lbs (2.7 to 4.1 kg). On a strict 50 lb (23 kg) airline limit, that is nearly 20% of your allowance! GateReady automatically subtracts your bag’s empty tare weight so you never face a $100+ airport overweight baggage fee.'
    },
    {
      q: 'How current is your airline baggage information?',
      a: 'Our airline rule database covers 42+ major global and North American carriers (including Air Canada, WestJet, Porter, Delta, United, American, British Airways, and Lufthansa) with verified fare family allowances continuously audited against official airline tariffs.'
    },
    {
      q: 'Can I cancel or upgrade my subscription anytime?',
      a: 'Yes, you can upgrade, downgrade, or cancel anytime with one click directly in your settings. Paid subscriptions are processed securely by Lemon Squeezy and backed by an unconditional 14-day money-back guarantee.'
    }
  ];

  return (
    <div className="relative w-full flex flex-col items-center">
      
      {/* ================= SECTION 1: HERO SECTION ================= */}
      <section className="relative w-full pt-8 pb-12 sm:pt-14 sm:pb-18 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden bg-gradient-to-b from-purple-950/20 via-transparent to-transparent">
        <div className="w-full max-w-[1550px] mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Top Corridor & 42-Airline Intelligence Radar */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-[11px] font-mono tracking-widest uppercase text-purple-700/90 dark:text-purple-300/90 bg-purple-100/70 dark:bg-purple-950/50 border border-purple-200/90 dark:border-purple-800/60 px-5 py-2 rounded-full w-full max-w-5xl mx-auto shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-purple-900 dark:text-purple-200">GLOBAL AIRLINE RADAR:</span>
            <span>AIR CANADA</span>
            <span className="text-purple-300 dark:text-purple-600">·</span>
            <span>WESTJET</span>
            <span className="text-purple-300 dark:text-purple-600">·</span>
            <span>DELTA</span>
            <span className="text-purple-300 dark:text-purple-600">·</span>
            <span>UNITED</span>
            <span className="text-purple-300 dark:text-purple-600">·</span>
            <span>BRITISH AIRWAYS</span>
            <span className="text-purple-300 dark:text-purple-600">·</span>
            <span className="font-bold text-purple-700 dark:text-purple-300">42+ CARRIERS AUDITED</span>
          </div>

          {/* Main Headline & Supporting Subhead */}
          <div className="space-y-4 w-full max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
              Travel Smarter. Pack Better.
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                Avoid Airport Surprises.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Plan your trip, check airline baggage limits, organize your luggage and know what to expect before you leave home.
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-purple-600 dark:text-purple-400 uppercase">
              One simple travel companion. From packing to departure.
            </p>
          </div>

          {/* Primary and Secondary Call to Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
              
              {/* Primary CTA */}
              <button
                type="button"
                onClick={handlePrimaryClick}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 active:scale-98 text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-purple-600/30 transition-all cursor-pointer border border-purple-400/40"
              >
                <span>GET READY FOR YOUR NEXT TRIP</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={handleSecondaryClick}
                className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Calculator className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                <span>EXPLORE TRAVEL TOOLS</span>
              </button>
            </div>

            {/* Clear value assurance & trial notice */}
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Create your first trip free. No credit card required.</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                type="button"
                onClick={onLoadDemo}
                className="text-purple-700 dark:text-purple-300 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5 transition-colors"
              >
                <span>or view sample trip →</span>
              </button>
              {onOpenAccountSync && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('registration_started', { origin: 'hero_link' });
                      onOpenAccountSync();
                    }}
                    className="text-slate-600 dark:text-slate-300 hover:text-purple-600 font-semibold cursor-pointer underline decoration-dotted"
                  >
                    Free signup includes 7-day Platinum trial
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Value Assurance Badges */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>42+ Verified Airline Tables</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-purple-500" />
              <span>Empty Suitcase Tare Deduction</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>TSA 3-1-1 Liquids Compliance</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Free Starter Forever</span>
            </span>
          </div>

        </div>
      </section>

      {/* ================= SECTION 2: WHY GATEREADY? (THE REAL TRAVEL PROBLEM) ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>The Real Airport Stress</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Do So Many Travelers Get Surprised at the Airport?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Airlines generated over $33 billion in ancillary baggage fees last year. Rules change between carriers, fare classes hide restrictions, and bathroom scales mislead travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-lg">
              💸
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Overweight Bag Penalties ($100+)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Exceeding the 50 lb (23 kg) limit by even 1.5 lbs can trigger a punitive $100 to $150 overweight fee at the check-in desk. Most people forget to account for empty suitcase weight.
            </p>
            <div className="pt-2 text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span>GateReady Solution: Auto suitcase tare deduction</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-lg">
              📐
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Hidden Sizer & Fare Restrictions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              United Basic Economy bans overhead roller bags entirely. WestJet charges if your bag is over 22 lbs. Ryanair and easyJet enforce strict sizer boxes with steep gate-check penalties.
            </p>
            <div className="pt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>GateReady Solution: 42+ verified fare family guides</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-lg">
              🧳
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Frantic Floor Repacking at Check-In
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nothing is more stressful than opening your personal luggage on the airport terminal floor in front of a long queue to transfer shoes and clothes into another bag.
            </p>
            <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>GateReady Solution: Smart companion bag rebalancing</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: HOW GATEREADY WORKS IN 3 STEPS ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Effortless Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How GateReady Works in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From packing in your bedroom to boarding at the gate, we guide your travel prep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-md space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-600/30">
              1
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Choose Airline & Fare Class
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Select your flight from 42+ verified airlines. GateReady immediately pulls published carry-on dimensions, weight caps, and baggage fees tailored to your ticket tier.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-md space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-600/30">
              2
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Pack & Deduct Suitcase Tare
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add your bags and items. GateReady subtracts empty suitcase tare (6–9 lbs), validates TSA 3-1-1 liquids, and warns you before you ever get close to airline weight limits.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-md space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-600/30">
              3
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Arrive at the Gate Confidently
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Walk up to check-in knowing your baggage is within limits, your liquids pass security, and your documents are ready. Zero airport surprises and zero gate-check fees.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: INTERACTIVE FEATURE SHOWCASE ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-8 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Interactive Travel Platform</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            See How GateReady Makes Travel Easier
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Click through our core tools below to see how GateReady equips you with everything required for a seamless travel experience.
          </p>
        </div>

        {/* Feature Demo Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'scale', label: 'Smart Luggage Scale & Tare', icon: Scale },
            { id: 'tsa', label: 'TSA 3-1-1 Liquids Detector', icon: Droplets },
            { id: 'airlines', label: '42+ Airline Allowances', icon: Plane },
            { id: 'checklist', label: 'Intelligent Checklist', icon: CheckCircle2 },
            { id: 'wallet', label: 'Travel Documents Wallet', icon: Wallet },
            { id: 'pdf', label: 'PDF Manifests & QR Tags', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDemoTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDemoTab(tab.id as any)}
                className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Demo Content Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-xl">
          {activeDemoTab === 'scale' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deduct 6–9 lbs of empty suitcase weight</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Know Your Exact Weight Before Leaving Home
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Most travelers forget that standard hard-shell suitcases weigh 6 to 9 lbs before adding a single piece of clothing. GateReady automatically subtracts suitcase tare weight so your bag stays strictly within airline limits.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Real-time gauge bar showing total vs capacity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Presets for hard-shell, soft fabric, and ultralight luggage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Instant rebalance suggestions across companion bags</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-slate-500">Checked Spinner · 50 lbs Limit</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    42.8 lbs / 50 lbs
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-[85%]" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-400 text-[11px]">Suitcase Tare:</div>
                    <div className="font-bold text-slate-900 dark:text-white">7.5 lbs (Deducted)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-400 text-[11px]">Packed Items:</div>
                    <div className="font-bold text-slate-900 dark:text-white">35.3 lbs (Safe)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'tsa' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 text-xs font-bold">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>TSA 3-1-1 & CATSA Security Guard</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Stop Losing Toiletries at Security Checkpoints
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Airport security checkpoints confiscate bottles larger than 3.4 oz (100ml) in carry-on bags. GateReady automatically audits every liquid item and tells you exactly what must move into checked baggage before you head to the airport.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Automatic volume checking against 3.4 oz / 100ml limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Visual 1-quart bag compliance tracker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Instant warning badges for aerosol and oversized bottles</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 flex items-center justify-between">
                  <span className="font-semibold text-emerald-950 dark:text-emerald-200 text-xs">Toothpaste & Sunscreen (3.0 oz)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">✓ TSA Pass</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 flex items-center justify-between">
                  <span className="font-semibold text-rose-950 dark:text-rose-200 text-xs">Body Lotion Bottle (6.7 oz)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300">⚠ Move to Checked Bag</span>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'airlines' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 text-xs font-bold">
                  <Plane className="w-3.5 h-3.5 text-indigo-600" />
                  <span>42+ Airlines Verified Tables</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Overhead Sizer Dimensions & Fare Families
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every airline enforces different sizer box dimensions and ticket rules. Basic Economy on United bans overhead rollers entirely, while Southwest includes 2 free checked bags. GateReady tracks the exact rules so you never get forced gate-check fees.
                </p>
                <div className="pt-2">
                  <a
                    href="/airlines"
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 underline"
                  >
                    <span>Browse all 42 airline policy guides →</span>
                  </a>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-xs">Air Canada</span>
                  <span className="text-xs text-slate-500">Carry-On: 21.5 x 15.5 x 9 in · No weight limit</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-xs">WestJet</span>
                  <span className="text-xs text-slate-500">Carry-On: 21 x 15 x 9 in · Max 22 lbs</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-xs">Delta Air Lines</span>
                  <span className="text-xs text-slate-500">Carry-On: 22 x 14 x 9 in · No weight limit</span>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'checklist' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Personalized Packing Checklist</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Never Forget Essential Travel Items
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tailored by destination, season, travel duration, and airline restrictions. Mark items as packed, assign belongings to specific suitcases, and view real-time packing progress.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                {['Passport & boarding pass', 'Universal travel adapter (Type G)', 'Noise-canceling headphones', 'Prescription medication (in carry-on)'].map((item, idx) => (
                  <div key={item} className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                    <CheckCircle2 className={`w-4 h-4 ${idx < 3 ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span className={idx < 3 ? 'line-through text-slate-400' : 'font-semibold text-slate-800 dark:text-slate-200'}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDemoTab === 'wallet' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold">
                  <Wallet className="w-3.5 h-3.5 text-amber-600" />
                  <span>Travel Wallet & Document Hub</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Keep Frequent Flyer Numbers & Bookings in One Place
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Securely store airline reservation codes (PNRs), loyalty numbers, passport expiry alerts, and hotel reservations offline so you can access them mid-flight without roaming fees.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Air Canada Aeroplan</div>
                    <div className="font-mono font-bold text-xs">AC-849-204-119</div>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-md">Saved</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Booking Reference (PNR)</div>
                    <div className="font-mono font-bold text-xs">7K2W9Q · YYZ to LHR</div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md">Confirmed</span>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'pdf' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-xs font-bold">
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Printable Manifests & Luggage QR Tags</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Luggage Loss Protection & Customs Documentation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generate clean PDF manifests for insurance claims and border declarations. Print an emergency luggage recovery card with a private QR tag so airlines or finders can contact you if luggage goes missing.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  GateReady Emergency Bag Recovery Tag
                </div>
                <div className="text-[11px] text-slate-500">
                  Scannable by airline staff or bag handlers worldwide without exposing your home address.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= SECTION 5: AIRLINE BAGGAGE & FEE CALCULATOR SPOTLIGHT ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-purple-600" />
              <span>Free Baggage Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Compare 42+ Airlines & Calculate Total Baggage Fees
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Don’t wait until the check-in desk to find out what 2 checked bags will cost on your specific route. Our Baggage Fee Calculator accounts for domestic vs international routes, elite status, and fare classes.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/baggage-fee-calculator"
                className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Open Baggage Fee Calculator</span>
              </a>
              <a
                href="/airlines"
                className="h-11 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Plane className="w-4 h-4 text-purple-600" />
                <span>Browse All 42 Airline Guides</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-slate-900 dark:text-white">Air Canada</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified</span>
              </div>
              <div className="text-[11px] text-slate-500">Carry-on: Free (21.5 x 15.5 x 9 in)</div>
              <div className="text-[11px] font-semibold text-purple-600">Checked: $35 1st bag · $50 2nd bag</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-slate-900 dark:text-white">WestJet</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified</span>
              </div>
              <div className="text-[11px] text-slate-500">Carry-on: Free (Max 22 lbs)</div>
              <div className="text-[11px] font-semibold text-purple-600">Checked: $35–$42 1st bag (UltraBasic rules apply)</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-slate-900 dark:text-white">United Airlines</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified</span>
              </div>
              <div className="text-[11px] text-slate-500">Basic Economy: No overhead roller</div>
              <div className="text-[11px] font-semibold text-purple-600">Gate-check fee: $25 service fee + $35 bag fee</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-slate-900 dark:text-white">Delta Air Lines</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">Verified</span>
              </div>
              <div className="text-[11px] text-slate-500">Carry-on: Free (22 x 14 x 9 in, no weight limit)</div>
              <div className="text-[11px] font-semibold text-purple-600">Checked: $35 1st bag · $45 2nd bag</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: SMART PACKING & LUGGAGE TARE WEIGHT ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white border border-purple-400/30 shadow-2xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/80 border border-purple-400/40 text-[11px] font-black uppercase tracking-wider text-purple-200">
              <Scale className="w-3.5 h-3.5 text-purple-300" />
              <span>Smart Tare Technology</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Empty Suitcases Aren’t Weightless: Deduct 6–9 lbs Automatically
            </h2>
            <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
              When an airline says your bag limit is 50 lbs (23 kg), that includes the weight of your suitcase itself. A typical polycarbonate hard-shell spinner weighs 7.5 to 9.2 lbs before packing. GateReady factors in your suitcase's empty tare weight so you never get caught over the limit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="text-amber-300 font-black text-2xl">8.5 lbs</div>
              <div className="text-xs font-bold text-white">Large Hard-Shell Spinner</div>
              <p className="text-[11px] text-purple-200">Consumes 17% of your airline 50 lb checked allowance.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="text-emerald-300 font-black text-2xl">6.2 lbs</div>
              <div className="text-xs font-bold text-white">Carry-On Roller</div>
              <p className="text-[11px] text-purple-200">Consumes 28% of a 22 lb carry-on limit on airlines with weight caps.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="text-fuchsia-300 font-black text-2xl">0 Surprise Fees</div>
              <div className="text-xs font-bold text-white">With GateReady Tare Tracking</div>
              <p className="text-[11px] text-purple-200">Automatic tare deduction gives you the exact net capacity left for clothes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: FAMILY & MULTI-TRAVELLER BENEFITS ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Multi-Traveler Coordination</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Traveling with Family or Companions? Balance Weight Across Bags.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Family trips often result in one parent’s bag weighing 54 lbs (overweight) while a child’s suitcase weighs only 28 lbs. GateReady lets you manage all bags in one master view and suggests intelligent rebalancing before leaving for the airport.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Assign suitcases and personal items to specific family members</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Instant rebalance notifications: transfer 4 lbs to Bag 2 to eliminate penalties</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Real-time companion cloud sync on Gold and Platinum tiers</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Smart Family Bag Balancing
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-900 dark:text-rose-200">Bag 1 (Dad's Spinner)</div>
                <div className="text-[11px] text-rose-700 dark:text-rose-300">54.2 lbs · 4.2 lbs over 50 lb limit</div>
              </div>
              <span className="text-[10px] font-black bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-2 py-1 rounded-md">
                ⚠ Overweight
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Bag 2 (Kids' Spinner)</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300">32.0 lbs · 18.0 lbs available capacity</div>
              </div>
              <span className="text-[10px] font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-md">
                ✓ 18 lbs Free
              </span>
            </div>

            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span><strong>GateReady Recommendation:</strong> Move heavy winter boots (4.5 lbs) from Bag 1 to Bag 2 to save $100 in excess fees!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: SUBSCRIPTION COMPARISON PREVIEW ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>Honest & Transparent</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Simple Plans for Every Type of Traveler
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Start 100% free with no credit card required. Upgrade whenever you need more travelers or active trips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-xs font-black uppercase text-slate-500">Free Starter</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">$0</div>
            <div className="text-xs text-slate-500">Forever · No Card Needed</div>
            <ul className="text-xs space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <li>✓ 1 traveler & 1 active trip</li>
              <li>✓ Up to 2 bags max</li>
              <li>✓ 42+ airline allowance tables</li>
              <li>✓ Personal cloud sync included</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-md space-y-3">
            <div className="text-xs font-black uppercase text-purple-600">Silver</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">$1.99 <span className="text-xs text-slate-500">/mo</span></div>
            <div className="text-xs text-slate-500">or $19.99 /year</div>
            <ul className="text-xs space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <li>✓ 1 traveler & 2 active trips</li>
              <li>✓ <strong>Unlimited bags</strong></li>
              <li>✓ Suitcase tare weight deduction</li>
              <li>✓ Travel wallet & PDF manifests</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500 shadow-xl space-y-3 relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase">
              Popular
            </span>
            <div className="text-xs font-black uppercase text-amber-600">Gold</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">$3.99 <span className="text-xs text-slate-500">/mo</span></div>
            <div className="text-xs text-slate-500">or $29.99 /year</div>
            <ul className="text-xs space-y-1.5 pt-2 border-t border-amber-200 dark:border-amber-900/60 text-slate-700 dark:text-slate-300">
              <li>✓ <strong>2 travelers</strong> (couples)</li>
              <li>✓ <strong>Unlimited active trips</strong></li>
              <li>✓ Unlimited bags & tare scales</li>
              <li>✓ Companion real-time sync</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 shadow-md space-y-3">
            <div className="text-xs font-black uppercase text-indigo-600">Platinum</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">$4.99 <span className="text-xs text-slate-500">/mo</span></div>
            <div className="text-xs text-slate-500">or $39.99 /year</div>
            <ul className="text-xs space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <li>✓ <strong>Unlimited travelers & family</strong></li>
              <li>✓ Unlimited active trips & bags</li>
              <li>✓ Family sharing across devices</li>
              <li>✓ VIP fast support & priority updates</li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onOpenPricing}
            className="text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 underline cursor-pointer"
          >
            <span>View full plan comparison table and 14-day guarantee details →</span>
          </button>
        </div>
      </section>

      {/* ================= SECTION 9: REALISTIC CUSTOMER TESTIMONIALS ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Traveler Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Trusted by Smart Flyers Across Canada & the US
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Real feedback from travelers who avoid airport chaos with GateReady.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "Saved me $100 in overweight luggage fees on our vacation to London. We balanced our bags between my suitcase and my son’s the night before. GateReady showed us we were 3 lbs over before we left the house."
            </p>
            <div className="pt-2 text-xs font-bold text-slate-900 dark:text-white">
              David K. <span className="text-slate-400 font-normal">· Calgary, AB (Family Traveler)</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "The empty suitcase tare weight deduction is brilliant. My hard-shell spinner weighed 8.4 lbs before I put anything inside! Bathroom scales just don't give you that breakdown."
            </p>
            <div className="pt-2 text-xs font-bold text-slate-900 dark:text-white">
              Sarah M. <span className="text-slate-400 font-normal">· Toronto, ON (Frequent Business Flyer)</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "Finally an app that flags United Basic Economy's roller bag ban. I would have been hit with a $60 gate-check fee if GateReady hadn't alerted me to pack a personal backpack instead."
            </p>
            <div className="pt-2 text-xs font-bold text-slate-900 dark:text-white">
              Marcus T. <span className="text-slate-400 font-normal">· Chicago, IL (Weekend Getaway)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about GateReady, our free tools, and plan tiers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={faq.q}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4.5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SECTION 11: PROMINENT FINAL SIGNUP SECTION ================= */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Ready for a Stress-Free Flight?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who pack with confidence and avoid unexpected baggage fees at the airport.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 active:scale-98 text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-purple-600/30 transition-all cursor-pointer border border-purple-400/40"
          >
            <span>GET READY FOR YOUR NEXT TRIP</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>

          {onOpenAccountSync && (
            <button
              type="button"
              onClick={() => {
                trackEvent('registration_started', { origin: 'footer_cta' });
                onOpenAccountSync();
              }}
              className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-purple-300 dark:border-purple-600 text-purple-900 dark:text-purple-100 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Cloud className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Create Free Account</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 pt-2 flex items-center justify-center gap-4 flex-wrap">
          <span>Free starter plan forever</span>
          <span>·</span>
          <span>Includes 7-day Platinum trial</span>
          <span>·</span>
          <span>No credit card required</span>
        </div>
      </section>

    </div>
  );
};
