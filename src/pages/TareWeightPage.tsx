import React, { useEffect } from 'react';
import { 
  Scale, 
  Luggage, 
  Briefcase, 
  Package, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Calculator, 
  HelpCircle,
  Sparkles,
  Plane
} from 'lucide-react';

export const TareWeightPage: React.FC = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'What is Tare Weight? Empty Suitcase Weight Guide – GateReady';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header Navigation */}
      <header className="w-full bg-white border-b border-purple-100 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors">
              ← Back to App
            </a>
            <span className="text-slate-300">|</span>
            <a href="/" className="font-black text-base tracking-tight text-slate-900">
              Gate<span className="text-purple-600">Ready</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="/baggage-fee-calculator" 
              className="text-xs font-bold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              Fee Calculator
            </a>
            <a 
              href="/" 
              className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-purple-600/20"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Create Free Trip</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-purple-50 via-white to-slate-50 border-b border-purple-100 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-purple-600" />
            <span>Luggage Scale Science · Overweight Prevention</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            What is Tare Weight in Luggage & Travel?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Why your empty suitcase consumes up to 25% of your airline baggage allowance, and how accounting for tare weight stops surprise $100+ overweight surcharges.
          </p>
        </div>
      </section>

      {/* Main Educational Article */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Definition Box */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <span>The Plain-English Definition of Tare Weight</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            In travel and logistics, <strong>tare weight</strong> is the weight of an empty container — specifically, the unladen weight of your suitcase, roller bag, duffel, or backpack before a single piece of clothing or toiletry is packed inside it.
          </p>
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 leading-relaxed">
            <strong>The Golden Formula of Airport Baggage:</strong><br />
            <span className="text-sm font-black text-purple-900">
              Gross Airport Scale Reading = Tare Weight (Empty Bag) + Net Weight (Packed Items)
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When you place your suitcase onto the airline check-in scale, the agent does not weigh your clothes alone: the scale registers the <strong>combined gross total</strong>. If your airline allows 50 lbs (23 kg) and your empty suitcase weighs 10.5 lbs, you actually only have <strong>39.5 lbs</strong> of net packing capacity.
          </p>
        </section>

        {/* The Hidden Penalty Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-black text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Why Tare Weight Causes 80% of Airport Scale Shock</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            Most travelers weigh their packed items on bathroom scales or estimate their clothing weights in their heads, completely forgetting that modern rolling suitcases with telescoping aluminum handles, polyurethane wheels, internal frames, and TSA locks add significant dead weight.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-4 rounded-xl bg-white border border-amber-200">
              <strong className="block text-slate-900 font-bold mb-1">Strict Airline Scales:</strong>
              <p className="text-slate-600">Commercial airport scales are calibrated within 0.1 lb tolerances. If your bag tips the scale at 50.8 lbs, standard check-in software automatically flags an overweight surcharge.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-amber-200">
              <strong className="block text-slate-900 font-bold mb-1">Brutal Overweight Surcharges:</strong>
              <p className="text-slate-600">On major airlines (Delta, American, United, Air Canada, British Airways), exceeding the 50 lb threshold triggers a flat $100 to $150 surcharge — even for less than one single pound of excess weight.</p>
            </div>
          </div>
        </section>

        {/* Suitcase Tare Benchmarks Table */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Average Tare Weights by Luggage Type & Material
          </h2>
          <p className="text-xs text-slate-600">
            GateReady benchmarks empty weights across hundreds of production suitcases:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Luggage Category</th>
                  <th className="py-3 px-4">Shell Material</th>
                  <th className="py-3 px-4">Average Empty Tare</th>
                  <th className="py-3 px-4">% of 50 lb Limit Consumed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Personal Item Backpack (16–18")</td>
                  <td className="py-3 px-4">Canvas / Lightweight Polyester</td>
                  <td className="py-3 px-4 font-black text-purple-700">1.8 lbs (0.8 kg)</td>
                  <td className="py-3 px-4 text-slate-500">N/A (under seat)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Carry-On Roller (21–22")</td>
                  <td className="py-3 px-4">Hard-Shell Polycarbonate / ABS</td>
                  <td className="py-3 px-4 font-black text-purple-700">7.0 lbs (3.2 kg)</td>
                  <td className="py-3 px-4 text-slate-500">32% of 22-lb cabin cap</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Carry-On Spinner (21–22")</td>
                  <td className="py-3 px-4">Soft Ballistic Nylon</td>
                  <td className="py-3 px-4 font-black text-purple-700">6.2 lbs (2.8 kg)</td>
                  <td className="py-3 px-4 text-slate-500">28% of 22-lb cabin cap</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Checked Suitcase Medium (24–26")</td>
                  <td className="py-3 px-4">Hard Polycarbonate / Composite</td>
                  <td className="py-3 px-4 font-black text-purple-700">8.8 lbs (4.0 kg)</td>
                  <td className="py-3 px-4 text-slate-500">17.6% of 50-lb allowance</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Large Checked Suitcase (28–30")</td>
                  <td className="py-3 px-4">Rigid Aluminum or Heavy ABS</td>
                  <td className="py-3 px-4 font-black text-rose-600">11.5–13.0 lbs (5.2–5.9 kg)</td>
                  <td className="py-3 px-4 text-rose-600 font-bold">Up to 26% of allowance!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How GateReady Solves It */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>How GateReady Solves the Tare Weight Problem</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            GateReady was built specifically so travelers never have to do mental math on empty suitcases:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1">
              <strong className="block text-purple-950 font-bold">1. Material Presets:</strong>
              <p className="text-purple-900/80">Select whether your bag is a soft fabric duffel, ballistic nylon, or hard-shell spinner. GateReady applies verified tare weights automatically.</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1">
              <strong className="block text-purple-950 font-bold">2. Custom Shell Tare:</strong>
              <p className="text-purple-900/80">Know your suitcase's exact empty weight? You can customize the tare weight down to 0.1 lbs and save it as your default bag preset.</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1">
              <strong className="block text-purple-950 font-bold">3. Live Headroom Meter:</strong>
              <p className="text-purple-900/80">As you check off packed shoes, jackets, and toiletries, GateReady calculates remaining headroom against your airline's exact threshold.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/"
              className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20"
            >
              <span>Create a Trip with Tare Deduction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/baggage-fee-calculator"
              className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center justify-center gap-2 border border-purple-200"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Check Airline Baggage Fees</span>
            </a>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-black text-slate-900">
              Tare Weight FAQs
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                How do I find out my suitcase's tare weight at home?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Step on your home scale holding the empty suitcase, then step on without it. Subtract your body weight from the combined number to find the empty bag tare weight. Alternatively, hang it from a handheld digital luggage scale.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                Are soft-sided suitcases lighter than hard-shell suitcases?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Generally yes. A soft-sided nylon or polyester carry-on weighs approximately 5.5 to 6.5 lbs, whereas hard polycarbonate or aluminum cases typically weigh 7.0 to 9.5 lbs empty.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                Does GateReady require physical scale hardware?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                No. GateReady is an intelligent packing planning software. It models weights based on tare estimates and item catalog benchmarks to help you pack accurately before leaving for the airport.
              </p>
            </div>
          </div>
        </section>

        {/* Cross links */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <a href="/airlines" className="text-purple-700 hover:text-purple-900 underline flex items-center gap-1.5">
            <span>← Directory of all 42 Airline Allowance Guides</span>
          </a>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="/baggage-fee-calculator" className="hover:text-purple-700">Fee Calculator</a>
            <span>·</span>
            <a href="/entry-requirements" className="hover:text-purple-700">Entry Hub</a>
          </div>
        </div>
      </main>

      {/* Global Footer */}
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
