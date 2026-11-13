import React, { useEffect } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  ArrowRight, 
  Plane
} from 'lucide-react';
import { SocialLinks } from '../components/SocialLinks';

export const RequirementsPage: React.FC = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Travel Requirements Hub — GateReady';
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
              href="/baggage-fee-calculator" 
              className="text-xs font-bold text-slate-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-purple-50 transition-colors"
            >
              Fee Calculator
            </a>
            <a 
              href="/entry-requirements" 
              className="text-xs font-bold text-slate-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-purple-50 transition-colors"
            >
              Entry Requirements
            </a>
          </div>
        </div>
      </header>

      {/* Main Hub Content: Short 2-Card Hub */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 flex flex-col justify-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5 text-purple-600" />
            <span>Standalone Travel Checkers · No Account Needed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Baggage Fees by Airline, Luggage Allowances & Entry Requirements
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Look up published airline checked luggage fees and passport validity rules right now before creating a trip.
          </p>
        </div>

        {/* The Two Working Cards — Nothing Else on the Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Card 1: Baggage Fee Calculator */}
          <div className="rounded-3xl bg-white border border-purple-200/90 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all p-6 sm:p-8 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25 group-hover:scale-105 transition-transform">
                  <Receipt className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  42 Airlines Audited
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Baggage Fee Calculator
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Verified November 4, 2026 · Real Carrier Fare Tables
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Calculate checked and carry-on luggage fees across 42 airlines, compare fare-family inclusions, and estimate total costs.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-100">
              <a
                href="/baggage-fee-calculator"
                className="w-full h-11 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20 transition-all cursor-pointer"
              >
                <span>Open Baggage Fee Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2: Entry Requirements Quick-Check */}
          <div className="rounded-3xl bg-white border border-purple-200/90 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all p-6 sm:p-8 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  CA & US Passports
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Entry Requirements Quick-Check
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Verified October 15, 2026 · Official Government Portals
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Check passport validity rules, visa requirements, and official government advisories for Canadian and US passport holders.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-100">
              <a
                href="/entry-requirements"
                className="w-full h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-slate-700/30"
              >
                <span>Check Entry Requirements</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
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
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span>Sole official contact: <a href="mailto:csmappholdings@gmail.com" className="text-slate-400 hover:text-purple-300 underline">csmappholdings@gmail.com</a></span>
              <SocialLinks variant="darkFooter" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
