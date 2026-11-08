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
  ExternalLink
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

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden bg-gradient-to-b from-purple-950/15 via-transparent to-transparent">
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
              Pack Smart. Fly Prepared.
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">
                Avoid Surprise Baggage Fees.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Know exactly what you can bring, how much your luggage will weigh, and what your airline will charge before you leave home.
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
                <span>CREATE MY FREE TRIP</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={handleSecondaryClick}
                className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Calculator className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                <span>Explore Baggage Tools</span>
              </button>
            </div>

            {/* Subordinate 1-click sample demo & account link */}
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
              <span>Want to preview how it works?</span>
              <button
                type="button"
                onClick={onLoadDemo}
                className="text-purple-700 dark:text-purple-300 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5 transition-colors"
              >
                <span>or see a sample trip first →</span>
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
                    Create Free Account (Includes 7-day Platinum trial)
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
              <span>No Credit Card Required</span>
            </span>
          </div>

        </div>
      </section>

      {/* ================= SECTION 6: PRODUCT DEMONSTRATIONS ================= */}
      {/* "Everything You Need to Get Travel Ready" */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Interactive Travel Platform</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Get Travel Ready
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            From empty suitcase tare deduction to TSA 3-1-1 rules and printable manifests, GateReady equips you with the exact tools to fly with zero airport surprises.
          </p>
        </div>

        {/* Interactive Feature Demo Tabs */}
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

      {/* ================= SECTION: HOW GATEREADY WORKS (3 STEPS) ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 space-y-8 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How GateReady Works in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From packing at home to boarding at the gate, we make airport preparation effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-600/30">
              1
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Select Your Airline & Route
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Choose from 42+ verified airlines. GateReady immediately pulls published carry-on dimensions, checked allowances, and fee policies for your specific ticket class.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-600/30">
              2
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Pack & Deduct Suitcase Tare
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add your suitcases and packing items. GateReady subtracts empty bag tare weight, flags oversized liquids, and alerts you before you exceed carrier limits.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-600/30">
              3
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Breeze Through the Gate
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Arrive at check-in knowing your baggage weights, sizer fit, and fees are completely verified. Zero surprises, zero gate-check fees.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION: 7-DAY PLATINUM TRIAL & PLANS ================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 space-y-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border border-purple-400/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/80 border border-purple-400/40 text-[11px] font-black uppercase tracking-wider text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Free Account Bonus</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign Up Free & Unlock a 7-Day Platinum Trial
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
              Every free account registration automatically includes 7 full days of GateReady Platinum. Pack unlimited bags, deduct tare weight, invite family members, and print custom luggage tags.
            </p>
            <div className="flex items-center gap-4 text-xs text-purple-200/90 pt-1 flex-wrap">
              <span>✓ No credit card required</span>
              <span>·</span>
              <span>✓ Automatically reverts to Free plan</span>
              <span>·</span>
              <span>✓ All trips remain saved safely</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenAccountSync && (
              <button
                type="button"
                onClick={() => {
                  trackEvent('registration_started', { origin: 'trial_banner' });
                  onOpenAccountSync();
                }}
                className="h-12 px-7 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-purple-950 font-black text-xs sm:text-sm tracking-wide shadow-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <span>CREATE MY FREE ACCOUNT</span>
                <ArrowRight className="w-4 h-4 text-purple-900" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenPricing}
              className="h-12 px-6 rounded-2xl bg-purple-800/60 hover:bg-purple-800 border border-purple-400/40 text-white font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer"
            >
              <span>View All Plans</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= PROMINENT FINAL SIGNUP SECTION ================= */}
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
            <span>CREATE MY FREE TRIP</span>
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
