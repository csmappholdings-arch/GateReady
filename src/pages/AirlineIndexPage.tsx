import React, { useState, useMemo, useEffect } from 'react';
import { AIRLINE_GUIDES, AirlineGuideItem } from '../data/airlineGuidesData';
import { 
  Plane, 
  Search, 
  Scale, 
  Luggage, 
  ArrowRight, 
  Calculator, 
  ShieldCheck, 
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AirlineIndexPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'Canada' | 'USA' | 'Europe' | 'Asia'>('ALL');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Airline Baggage Allowance Guides (42 Airlines) – GateReady';
      window.scrollTo(0, 0);
    }
  }, []);

  const filteredAirlines = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return AIRLINE_GUIDES.filter((item) => {
      const matchesSearch = 
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.countryLabel.toLowerCase().includes(q) ||
        item.slug.includes(q);
      const matchesRegion = selectedRegion === 'ALL' || item.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

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

      {/* Directory Hero */}
      <section className="w-full bg-gradient-to-b from-purple-50 via-white to-slate-50 border-b border-purple-100 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5 text-purple-600" />
            <span>Official Allowance Database · 42 Global Carriers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Airline Baggage Allowance & Fee Guides
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Verified carry-on dimensions, weight limits, and checked baggage fee tables across North America, Europe, Asia, and the Middle East.
          </p>

          {/* Search and Filter Controls */}
          <div className="pt-4 max-w-xl mx-auto space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by airline (e.g. Air Canada, WestJet, Delta, Ryanair)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-xs font-semibold rounded-2xl border border-purple-200 bg-white text-slate-900 shadow-xs focus:outline-hidden focus:border-purple-600"
              />
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
              {(['ALL', 'Canada', 'USA', 'Europe', 'Asia'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedRegion === r
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-purple-700'
                  }`}
                >
                  {r === 'ALL' ? 'All 42 Airlines' : r === 'Asia' ? 'Asia & Middle East' : r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <main className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">
            Showing {filteredAirlines.length} of 42 Airlines
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Published Tables</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAirlines.map((item) => (
            <article 
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.flag}</span>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-purple-700">
                        {item.countryLabel}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                    {item.region}
                  </span>
                </div>

                {/* Carry-on and Checked Summary */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 flex items-center gap-1 shrink-0">
                      <Luggage className="w-3.5 h-3.5 text-purple-600" />
                      <span>Carry-On:</span>
                    </span>
                    <span className="font-bold text-slate-800 text-right truncate">
                      {item.limits.carryOnLimit.split('(')[0].trim()}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 flex items-center gap-1 shrink-0">
                      <Scale className="w-3.5 h-3.5 text-purple-600" />
                      <span>Carry-On Cap:</span>
                    </span>
                    <span className={`font-bold text-right text-[11px] ${
                      (item.limits.carryOnWeightLimit || '').toLowerCase().includes('no') 
                        ? 'text-emerald-700' 
                        : 'text-purple-900'
                    }`}>
                      {item.limits.carryOnWeightLimit
                        ? (item.limits.carryOnWeightLimit.includes('(')
                            ? item.limits.carryOnWeightLimit.split('(')[0].trim()
                            : item.limits.carryOnWeightLimit.split(';')[0].trim())
                        : 'Rule applies'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 shrink-0">1st Checked Bag:</span>
                    <span className="font-black text-purple-700">
                      {item.fees.firstCheckedFee === 0 
                        ? 'FREE ($0)' 
                        : `${item.fees.currencySymbol}${item.fees.firstCheckedFee} ${item.fees.currency}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">
                  Verified: {item.fees.lastVerified}
                </span>
                <a
                  href={item.canonicalPath}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 group"
                >
                  <span>View Guide</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Informative Hub Footer */}
        <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 text-xs text-slate-600 space-y-4">
          <h2 className="text-base font-black text-slate-900">
            About the GateReady 42-Airline Allowance Engine
          </h2>
          <p className="leading-relaxed">
            Airlines enforce different sizer dimensions and weight allowances at every departure gate. GateReady actively tracks published limits across North America, Europe, Asia, and Oceania. All figures are verified directly from published airline fee schedules.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold">
            <a href="/baggage-fee-calculator" className="text-purple-600 hover:underline">
              → Interactive Baggage Fee Calculator
            </a>
            <a href="/tare-weight" className="text-purple-600 hover:underline">
              → Suitcase Tare Weight Explainer
            </a>
            <a href="/entry-requirements" className="text-purple-600 hover:underline">
              → International Travel Entry Rules
            </a>
          </div>
        </section>
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
