import React, { useState, useMemo, useEffect } from 'react';
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
  Sparkles,
  Calendar,
  FileCheck,
  Info
} from 'lucide-react';
import { 
  ENTRY_REQUIREMENTS_DATABASE, 
  getEntryRequirements, 
  PassportNationality, 
  ResolvedEntryRequirement 
} from '../data/entryRequirementsData';

export const EntryRequirementsPage: React.FC = () => {
  const [nationality, setNationality] = useState<PassportNationality>('CA');
  const [destinationCountry, setDestinationCountry] = useState<string>('Japan');

  // Static entry requirement lookup
  const entryData: ResolvedEntryRequirement = useMemo(() => {
    return getEntryRequirements(destinationCountry, nationality);
  }, [destinationCountry, nationality]);

  // Guaranteed matching official source label and URL for the selected passport
  const officialSourceLabel = nationality === 'CA' ? 'travel.gc.ca Advisory' : 'travel.state.gov Advisory';
  const officialSourceUrl = useMemo(() => {
    if (nationality === 'CA') {
      if (entryData.officialSourceUrl && entryData.officialSourceUrl.includes('travel.gc.ca')) {
        return entryData.officialSourceUrl;
      }
      return `https://travel.gc.ca/destinations/${encodeURIComponent(destinationCountry.toLowerCase().trim().replace(/\s+/g, '-'))}`;
    } else {
      if (entryData.officialSourceUrl && entryData.officialSourceUrl.includes('travel.state.gov')) {
        return entryData.officialSourceUrl;
      }
      return 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages.html';
    }
  }, [nationality, entryData.officialSourceUrl, destinationCountry]);

  const getVisaBadgeStyle = () => {
    switch (entryData.visaStatusType) {
      case 'VISA_FREE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ETA_ESTA_REQUIRED':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'VISA_ON_ARRIVAL':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'VISA_ADVANCE_REQUIRED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Entry Requirements — GateReady';
      window.scrollTo(0, 0);
    }
  }, []);

  const handlePlanTrip = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `/?action=new_trip&mode=PLANE&destination=${encodeURIComponent(destinationCountry)}`;
    }
  };

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
            Entry Requirements Quick-Check – Passport & Visa Rules
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Check passport validity rules, 6-month validity requirements, visa waivers, and official government advisories for Canadian and US passport holders.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>Verified: October 15, 2026</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Government Advisories (travel.gc.ca & travel.state.gov)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* ================================================================ */}
        {/* INTERACTIVE ENTRY REQUIREMENTS QUICK-CHECK CARD                   */}
        {/* ================================================================ */}
        <div className="rounded-3xl bg-white border border-purple-200/90 shadow-lg overflow-hidden flex flex-col justify-between" id="quick-check-tool">
          <div>
            {/* Card Top Title Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 border-b border-purple-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                        Entry Requirements Quick-Check
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] font-bold text-slate-500">
                        Last verified October 15, 2026
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                      {`Passport & Visa Rules for ${entryData.matchedDestinationName}`}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs Panel: Passport Toggle & Destination Country */}
            <div className="p-4 sm:p-5 space-y-4 border-b border-purple-100/70 bg-purple-50/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                {/* Passport Nationality Switcher with High-Contrast Active States */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1.5">
                    Passport Nationality
                  </label>
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setNationality('CA')}
                      className={`flex-1 h-8 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        nationality === 'CA'
                          ? 'bg-purple-600 text-white font-black shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🇨🇦 Canada</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNationality('US')}
                      className={`flex-1 h-8 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        nationality === 'US'
                          ? 'bg-purple-600 text-white font-black shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🇺🇸 United States</span>
                    </button>
                  </div>
                </div>

                {/* Destination Country Dropdown */}
                <div>
                  <label
                    htmlFor="entry-destination-country-select"
                    className="block text-[11px] font-bold uppercase tracking-wider text-purple-950 mb-1.5 cursor-pointer select-none"
                  >
                    Destination Country
                  </label>
                  <select
                    id="entry-destination-country-select"
                    name="destinationCountry"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 bg-white text-slate-900 font-medium focus:outline-hidden focus:border-purple-500 cursor-pointer shadow-2xs relative z-10 pointer-events-auto"
                  >
                    {ENTRY_REQUIREMENTS_DATABASE.map((item) => (
                      <option key={item.countryCode} value={item.destinationCountry}>
                        {item.destinationCountry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Rows */}
            <div className="divide-y divide-slate-100 text-xs">
              {/* Row 1: Passport Validity */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500">
                    Passport Validity
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <span className="font-bold text-slate-900">
                    {entryData.passportValidityRule}
                  </span>
                </div>
              </div>

              {/* Row 2: Visa Requirement */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <FileCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500">
                    Visa Requirement
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${getVisaBadgeStyle()}`}>
                    {entryData.visaBadgeText}
                  </span>
                </div>
              </div>

              {/* Row 3: Max Stay */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500">
                    Maximum Stay
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <span className="font-bold text-slate-800">
                    {entryData.maxStay}
                  </span>
                </div>
              </div>

              {/* Row 4: Official Source Link */}
              <div className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-2.5 sm:w-1/3">
                  <Globe2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[10px] text-slate-500">
                    Official Source
                  </span>
                </div>
                <div className="sm:w-2/3 sm:text-right">
                  <a
                    href={officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-purple-700 font-bold hover:underline"
                  >
                    <span>{officialSourceLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Traveler Notice if available */}
            {entryData.notes && (
              <div className="p-3.5 sm:px-5 bg-purple-50/50 border-t border-purple-100 text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-purple-900">Traveler Notice: </strong>
                {entryData.notes}
              </div>
            )}

            {/* Disclaimer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="leading-snug">{entryData.disclaimer}</span>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-purple-100">
            <button
              type="button"
              onClick={handlePlanTrip}
              className="w-full h-11 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Plan this trip to {entryData.matchedDestinationName} in GateReady →</span>
            </button>
          </div>
        </div>

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
        <section className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-8 space-y-4" id="six-month-rule">
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
