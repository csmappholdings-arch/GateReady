import React, { useEffect } from 'react';
import { AIRLINE_GUIDES, AirlineGuideItem, getAirlineGuideBySlug } from '../data/airlineGuidesData';
import { 
  Plane, 
  ArrowLeft, 
  Scale, 
  Luggage, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Calculator, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AirlineGuidePageProps {
  guide?: AirlineGuideItem;
  slug?: string;
  onOpenTripBuilder?: (airlineName: string) => void;
}

export const AirlineGuidePage: React.FC<AirlineGuidePageProps> = ({ 
  guide: propGuide, 
  slug: propSlug,
  onOpenTripBuilder 
}) => {
  const currentSlug = propSlug || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\/airlines\//, '').replace(/\/$/, '') : '');
  const guide = propGuide || getAirlineGuideBySlug(currentSlug) || AIRLINE_GUIDES[0];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = guide.title;
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [guide]);

  const handleStartTrip = () => {
    if (onOpenTripBuilder) {
      onOpenTripBuilder(guide.name);
    } else {
      window.location.href = `/?action=new_trip&mode=PLANE&carrier=${encodeURIComponent(guide.name)}`;
    }
  };

  const handleOpenCalculator = () => {
    window.location.href = `/baggage-fee-calculator?airline=${encodeURIComponent(guide.name)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header Navigation */}
      <header className="w-full bg-white border-b border-purple-100 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a 
              href="/airlines" 
              className="text-xs font-bold text-slate-600 hover:text-purple-600 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All 42 Airlines</span>
            </a>
            <span className="text-slate-300">|</span>
            <a href="/" className="font-black text-base tracking-tight text-slate-900">
              Gate<span className="text-purple-600">Ready</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="/baggage-fee-calculator" 
              className="hidden md:inline-flex text-xs font-bold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              Fee Calculator
            </a>
            <button
              onClick={handleStartTrip}
              className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-purple-600/20 cursor-pointer transition-all active:scale-95"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Pack for {guide.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Airline Identity */}
      <section className="w-full bg-gradient-to-b from-purple-50 via-white to-slate-50 border-b border-purple-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider">
            <span className="text-base">{guide.flag}</span>
            <span>{guide.countryLabel} · Official Airline Baggage Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {guide.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Carry-on sizer dimensions, weight limits, checked luggage fees, and baggage rules for {guide.name} travelers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>Verified: {guide.fees.lastVerified}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Published Carrier Rules</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5" />
              </div>
              <h2 className="text-base font-black text-slate-900">Calculate {guide.name} Baggage Fees</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Estimate 1st bag, 2nd bag, and overweight surcharge costs before arriving at the airport terminal.
              </p>
            </div>
            <button
              onClick={handleOpenCalculator}
              className="mt-4 w-full h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
            >
              <span>Launch Fee Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-600/20 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h2 className="text-base font-black">Pack with {guide.name} Limits</h2>
              <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                Build your trip packing list with {guide.name} carry-on dimensions and tare weight deduction loaded automatically.
              </p>
            </div>
            <button
              onClick={handleStartTrip}
              className="mt-4 w-full h-10 rounded-xl bg-white hover:bg-purple-50 text-purple-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Build Trip in GateReady</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. Carry-On & Personal Item Allowance Card */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {guide.name} Carry-On & Personal Item Rules
              </h2>
              <p className="text-xs text-slate-500">
                Cabin luggage that travels on board with you into the aircraft.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Item */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Personal Item</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Included Free
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {guide.limits.personalLimit}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Must fit completely underneath the passenger seat in front of you (purse, small backpack, or laptop bag).
              </p>
            </div>

            {/* Carry-On Roller Bag */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <Luggage className="w-4 h-4 text-purple-600" />
                  <span>Standard Carry-On</span>
                </span>
                {guide.fees.carryOnFee === 0 ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Free / Included
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Fee Applies ({guide.fees.currencySymbol}{guide.fees.carryOnFee})
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900">
                {guide.limits.carryOnLimit}
              </div>
              <div className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Weight limit: <strong>{guide.limits.carryOnWeightLimit}</strong></span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Must fit inside the airport gate sizer box and into the overhead bin compartment.
              </p>
            </div>
          </div>

          {guide.limits.notes && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Important Cabin Luggage Note:</span>
              </div>
              <p className="leading-relaxed">{guide.limits.notes}</p>
            </div>
          )}
        </section>

        {/* 2. Checked Baggage Allowances & Fees Card */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {guide.name} Checked Baggage Limits & Fees
              </h2>
              <p className="text-xs text-slate-500">
                Standard checked bags surrendered at the airport check-in counter.
              </p>
            </div>
          </div>

          {/* Published Fees Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Baggage Tier</th>
                  <th className="py-3 px-4">Standard Weight Limit</th>
                  <th className="py-3 px-4">Published Fee</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">1st Checked Bag</td>
                  <td className="py-3 px-4">{(guide.limits.checkedWeightLimit || '50 lbs (23 kg)').split(';')[0]}</td>
                  <td className="py-3 px-4 font-black text-purple-700">
                    {guide.fees.firstCheckedFee === 0 
                      ? 'FREE ($0)' 
                      : `${guide.fees.currencySymbol}${guide.fees.firstCheckedFee} ${guide.fees.currency}`}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {guide.fees.usdEquivalentNote || 'Standard economy ticket'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">2nd Checked Bag</td>
                  <td className="py-3 px-4">{(guide.limits.checkedWeightLimit || '50 lbs (23 kg)').split(';')[0]}</td>
                  <td className="py-3 px-4 font-black text-purple-700">
                    {guide.fees.secondCheckedFee === 0 
                      ? 'FREE ($0)' 
                      : `${guide.fees.currencySymbol}${guide.fees.secondCheckedFee} ${guide.fees.currency}`}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">Online rate (airport desk fees may be higher)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Overweight Surcharge (51–70 lbs)</td>
                  <td className="py-3 px-4">51 to 70 lbs (24–32 kg)</td>
                  <td className="py-3 px-4 font-black text-rose-600">
                    +{guide.fees.currencySymbol}{guide.fees.overweightFee51to70lbs} {guide.fees.currency}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">Charged per overweight piece at the airport counter</td>
                </tr>
                {guide.fees.oversizeFee && (
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Oversize Bag (&gt;62 linear in)</td>
                    <td className="py-3 px-4">&gt;62 linear in (158 cm)</td>
                    <td className="py-3 px-4 font-black text-rose-600">
                      +{guide.fees.currencySymbol}{guide.fees.oversizeFee} {guide.fees.currency}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">Length + width + height exceeding standard limit</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Checked Dimensions Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">Standard Maximum Dimensions:</strong>
              <p className="text-slate-600">{guide.limits.checkedLimit}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">Cabin Class Weight Bands:</strong>
              <p className="text-slate-600">{guide.limits.checkedWeightLimit}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1">
            <strong className="block font-bold text-indigo-900">Published Policy Summary:</strong>
            <p className="leading-relaxed">{guide.fees.feeNotes}</p>
          </div>
        </section>

        {/* 3. Honest Disclaimer & Official Verification Source */}
        <section className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>GateReady Data Integrity & Verification Standard</span>
            </span>
            <span className="text-slate-500">Last verified: {guide.fees.lastVerified}</span>
          </div>
          <p className="leading-relaxed">
            All allowances, size sizer limits, and baggage fees shown above are compiled directly from published tables provided by {guide.name}. Airlines frequently adjust fee structures, seasonal baggage embargoes, and cabin tier allowances. You should always verify your specific itinerary baggage rules on the carrier's website before arriving at the airport.
          </p>
          <div className="pt-2">
            <a
              href={guide.fees.officialBaggagePageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
            >
              <span>Visit Official {guide.name} Baggage Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* 4. Frequently Asked Questions about this airline */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-black text-slate-900">
              Frequently Asked Questions: {guide.name} Baggage
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="font-bold text-slate-900 mb-1">
                What are the maximum carry-on dimensions for {guide.name}?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {guide.name}'s maximum carry-on dimensions are {guide.limits.carryOnLimit}. Luggage wheels, handles, and external pockets are included in these measurements and must fit inside airport sizers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="font-bold text-slate-900 mb-1">
                Is there a weight limit on {guide.name} carry-on luggage?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {guide.limits.carryOnWeightLimit}. In all cases, you must be able to lift your carry-on bag into the aircraft overhead locker safely without crew assistance.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="font-bold text-slate-900 mb-1">
                How much does a checked bag cost on {guide.name}?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                For standard Economy passengers, the first checked bag is {guide.fees.firstCheckedFee === 0 ? 'free ($0)' : `${guide.fees.currencySymbol}${guide.fees.firstCheckedFee} ${guide.fees.currency}`}, and the second checked bag is {guide.fees.secondCheckedFee === 0 ? 'free ($0)' : `${guide.fees.currencySymbol}${guide.fees.secondCheckedFee} ${guide.fees.currency}`}. Premium cabin passengers often receive additional complimentary luggage.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="font-bold text-slate-900 mb-1">
                How does GateReady help with {guide.name} packing?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                GateReady pre-calibrates {guide.name}'s carry-on sizer dimensions, checks TSA 3-1-1 liquids compliance, accounts for empty luggage tare weight, and calculates overweight fee risk before you leave home.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Bottom Navigation / Directory link */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <a 
            href="/airlines" 
            className="text-purple-700 hover:text-purple-900 underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse All 42 Airline Baggage Guides</span>
          </a>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="/baggage-fee-calculator" className="hover:text-purple-700">Fee Calculator</a>
            <span>·</span>
            <a href="/tare-weight" className="hover:text-purple-700">Tare Weight Guide</a>
            <span>·</span>
            <a href="/entry-requirements" className="hover:text-purple-700">Entry Hub</a>
          </div>
        </div>
      </main>

      {/* Global Brand Footer */}
      <footer className="w-full bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-[1550px] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-black text-lg tracking-tight text-white">Gate<span className="text-purple-400">Ready</span></span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Smart Trip Packing & Baggage Limits</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
              <a href="/airlines" className="hover:text-purple-300">Airline Guides</a>
              <a href="/baggage-fee-calculator" className="hover:text-purple-300">Fee Calculator</a>
              <a href="/tare-weight" className="hover:text-purple-300">Tare Weight</a>
              <a href="/entry-requirements" className="hover:text-purple-300">Entry Rules</a>
              <a href="/pricing" className="hover:text-purple-300">Pricing</a>
              <a href="/faq" className="hover:text-purple-300">FAQ</a>
              <a href="/about" className="hover:text-purple-300">About</a>
              <a href="/contact" className="hover:text-purple-300">Contact Support</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>© CSM App Holdings · GateReady (gateready.ca) · All rights reserved.</div>
            <div>Sole official contact: <a href="mailto:csmappholdings@gmail.com" className="text-slate-400 hover:text-purple-300 underline">csmappholdings@gmail.com</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
