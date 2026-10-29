import React, { useEffect } from 'react';
import { 
  Globe2, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Plane, 
  ArrowRight, 
  Scale, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const EntryRequirementsPage: React.FC = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'International Travel Entry Requirements Hub – GateReady';
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
              href="/airlines" 
              className="text-xs font-bold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              Airline Guides
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
            <Globe2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Official Government Intelligence · Cross-Border Verification</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            International Travel Entry Requirements Hub
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Essential passport validity rules, electronic travel visas, TSA 3-1-1 security checkpoints, and authoritative links to official government immigration portals.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Official Government Gateways Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>Official Government Travel Advisories & Portals</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Direct Sources</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Never rely on third-party visa agencies or commercial intermediaries for entry clearance. Always check your destination's official national government portal:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <a
              href="https://travel.gc.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🇨🇦 Government of Canada</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">travel.gc.ca</div>
                <p className="text-slate-600 mt-1">Official travel advisories, eTA eligibility, Canadian passport validity, and border wait times.</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 shrink-0 ml-2" />
            </a>

            <a
              href="https://travel.state.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🇺🇸 U.S. Department of State</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">travel.state.gov</div>
                <p className="text-slate-600 mt-1">Country-specific entry requirements, ESTA requirements, passport renewals, and smart traveler enrollment (STEP).</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 shrink-0 ml-2" />
            </a>

            <a
              href="https://www.gov.uk/foreign-travel-advice"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🇬🇧 UK Foreign, Commonwealth & Dev Office</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">gov.uk/foreign-travel-advice</div>
                <p className="text-slate-600 mt-1">226 destination entry advisories, UK ETA rules, and passport stamp requirements.</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 shrink-0 ml-2" />
            </a>

            <a
              href="https://europa.eu/youreurope/citizens/travel/entry-exit/index_en.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🇪🇺 European Union Your Europe</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">europa.eu/youreurope</div>
                <p className="text-slate-600 mt-1">Schengen border regulations, 90/180-day short-stay calculator, and ETIAS requirements.</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 shrink-0 ml-2" />
            </a>
          </div>
        </section>

        {/* 1. Passport Validity: The 6-Month Rule */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                The 6-Month Passport Validity Rule
              </h2>
              <p className="text-xs text-slate-500">
                A valid passport that expires soon may result in automatic boarding denial.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Many countries (including China, Thailand, Singapore, Indonesia, Vietnam, and several European nations) enforce the <strong>six-month validity rule</strong>. This mandates that your passport must remain valid for at least <strong>six months beyond your planned date of departure</strong> from the destination country.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <strong className="block font-bold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Airline Gate Check Responsibility:</span>
            </strong>
            <p className="leading-relaxed">
              International airlines are fined thousands of dollars by foreign governments for transporting passengers with inadequate passport validity. If your passport expires within 6 months, airline check-in agents will deny boarding before you even reach the security checkpoint.
            </p>
          </div>
        </section>

        {/* 2. Electronic Travel Authorizations: ESTA, eTA & ETIAS */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Electronic Travel Authorizations (Visa Waivers)
              </h2>
              <p className="text-xs text-slate-500">
                Must be secured online days before boarding international flights.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">🇺🇸 U.S. ESTA:</strong>
              <p className="text-slate-600 leading-relaxed">
                Required for Visa Waiver Program citizens entering or transiting through the United States by air or sea. Must be approved at least 72 hours before flight departure.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">🇨🇦 Canada eTA:</strong>
              <p className="text-slate-600 leading-relaxed">
                Required for visa-exempt foreign nationals flying to or transiting through a Canadian airport. Electronically linked to your passport for up to 5 years.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">🇪🇺 Europe ETIAS:</strong>
              <p className="text-slate-600 leading-relaxed">
                Upcoming European travel authorization for visa-exempt visitors traveling to 30 European countries in the Schengen Area.
              </p>
            </div>
          </div>
        </section>

        {/* 3. TSA 3-1-1 Liquids Rule & Safety Checkpoint Check */}
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                TSA 3-1-1 Liquids Security Rule
              </h2>
              <p className="text-xs text-slate-500">
                Mandatory rules for carry-on toiletries at airport security scanners.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <div className="text-2xl font-black text-purple-700 mb-1">3.4 oz</div>
              <strong className="block text-slate-900 font-bold">Max Container Volume:</strong>
              <p className="text-slate-600 mt-1">Containers must hold 3.4 oz (100 ml) or less. Larger bottles that are half-full are still confiscated.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <div className="text-2xl font-black text-purple-700 mb-1">1 Quart</div>
              <strong className="block text-slate-900 font-bold">Clear Zip-Top Bag:</strong>
              <p className="text-slate-600 mt-1">All liquid bottles must fit easily into one transparent, quart-sized plastic bag.</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <div className="text-2xl font-black text-purple-700 mb-1">1 Bag</div>
              <strong className="block text-slate-900 font-bold">Per Passenger:</strong>
              <p className="text-slate-600 mt-1">Only one quart-sized liquids bag is permitted per traveler in cabin carry-on baggage.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
            <strong className="font-bold flex items-center gap-1.5 text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Critical Aviation Safety Rule — Lithium Batteries:</span>
            </strong>
            <p className="leading-relaxed">
              Loose lithium-ion batteries, vape pens, and portable power banks <strong>must never be packed inside checked baggage</strong>. Fire suppression systems in the cargo hold cannot extinguish thermal runaway fires; they must always travel with you inside the cabin.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-600/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-black">Plan Your Next Trip with Full Allowance Confidence</h2>
            <p className="text-xs text-purple-100">
              Calculate airline baggage fees, audit carry-on dimensions, and organize packing lists.
            </p>
          </div>
          <a
            href="/"
            className="h-11 px-6 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-black text-xs inline-flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <span>Start Free Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* Cross-Link Directory Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <a href="/airlines" className="text-purple-700 hover:text-purple-900 underline flex items-center gap-1.5">
            <span>← Directory of all 42 Airline Allowance Guides</span>
          </a>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="/baggage-fee-calculator" className="hover:text-purple-700">Fee Calculator</a>
            <span>·</span>
            <a href="/tare-weight" className="hover:text-purple-700">Tare Weight Guide</a>
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
