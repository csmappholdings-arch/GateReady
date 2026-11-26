import React, { useMemo, useState } from 'react';
import { PageLayout } from './PageLayout';
import { AIRLINE_GUIDES, formatAirlineFee } from '../data/airlineGuidesData';
import { CARRY_ON_FAQS } from '../data/faqData';
import { Luggage, Scale, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { SmartLuggageScalesPanel } from '../components/RealUiShowcases';

const COMPARISON_IDS = [
  'aircanada',
  'westjet',
  'porter',
  'airtransat',
  'flair',
  'delta',
  'american',
  'united',
  'southwest',
  'jetblue',
  'alaska',
  'frontier',
  'britishairways',
  'lufthansa',
  'ryanair',
  'singapore'
];

export const CarryOnCheckerPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('aircanada');
  const [bagMaterial, setBagMaterial] = useState<'FABRIC' | 'HARDSHELL'>('HARDSHELL');
  const [packedItemsWeightLbs, setPackedItemsWeightLbs] = useState<string>('13.0');

  const featuredGuides = useMemo(() => {
    const map = new Map(AIRLINE_GUIDES.map((g) => [g.id, g]));
    return COMPARISON_IDS.map((id) => map.get(id)).filter((g): g is NonNullable<typeof g> => Boolean(g));
  }, []);

  const activeGuide = useMemo(() => {
    return AIRLINE_GUIDES.find((g) => g.id === selectedId) || AIRLINE_GUIDES[0];
  }, [selectedId]);

  const tareLbs = bagMaterial === 'FABRIC' ? 5.5 : 7.0;
  const parsedPackedLbs = parseFloat(packedItemsWeightLbs);
  const grossLbs = Number.isFinite(parsedPackedLbs) ? Math.round((tareLbs + parsedPackedLbs) * 10) / 10 : tareLbs;

  const capMatch = activeGuide.limits.carryOnWeightLimit?.match(/(\d+(?:\.\d+)?)\s*lbs/i);
  const weightCapLbs = capMatch ? parseFloat(capMatch[1]) : null;
  const isNoLimit = (activeGuide.limits.carryOnWeightLimit || '').toLowerCase().includes('no ');

  return (
    <PageLayout pathname="/carry-on-checker">
      {/* Direct Answer Block immediately below Hero H1 */}
      <section className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300">
          <Luggage className="w-4 h-4 text-purple-600" />
          <span>Direct Answer — Carry-On Gate Sizers, Weight Caps &amp; Tare</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          Airline carry-on size limits always include <strong>wheels, handles, and exterior pockets</strong> and must drop smoothly inside the departure gate metal sizer box. Major US and Canadian carriers (Air Canada, WestJet, Delta, United, American) set <strong>no fixed carry-on weight cap</strong> as long as you can lift the bag unassisted, whereas carriers such as Porter (20 lbs), Air Transat (22 lbs), Lufthansa (17.6 lbs), and Qantas/Singapore (15.4 lbs / 7 kg) enforce strict weight caps where an empty <strong>5.5 to 7.0 lb roller</strong> already uses 25%–45% of your weight limit.
        </p>
      </section>

      {/* Interactive Carry-On Rule & Tare Headroom Checker */}
      <section className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Check Carry-On Size, Weight Cap &amp; Tare Math by Airline
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Select any carrier from our 42-airline published database and model gross bag weight using GateReady&apos;s 5.5 lb fabric or 7.0 lb hard-shell tare presets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label htmlFor="carry-on-airline-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Airline (42 Verified)
            </label>
            <select
              id="carry-on-airline-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
            >
              {AIRLINE_GUIDES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Carry-On Bag Shell (Tare)
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setBagMaterial('FABRIC')}
                className={`h-8 rounded-lg text-xs font-bold cursor-pointer ${
                  bagMaterial === 'FABRIC' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Fabric (5.5 lb)
              </button>
              <button
                type="button"
                onClick={() => setBagMaterial('HARDSHELL')}
                className={`h-8 rounded-lg text-xs font-bold cursor-pointer ${
                  bagMaterial === 'HARDSHELL' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Hard (7.0 lb)
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="carry-on-packed-lbs" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Packed Belongings (lbs)
            </label>
            <input
              id="carry-on-packed-lbs"
              type="number"
              min="0"
              step="0.5"
              value={packedItemsWeightLbs}
              onChange={(e) => setPackedItemsWeightLbs(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Carry-On Sizer Max (with wheels)</span>
            <span className="font-black text-slate-900 dark:text-white block">{activeGuide.limits.carryOnLimit}</span>
            <span className="text-[11px] text-slate-500 block">Personal item: {activeGuide.limits.personalLimit.split(' - ')[0]}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{activeGuide.name} Cabin Weight Policy</span>
            <span className="font-black text-purple-700 dark:text-purple-400 block">
              {activeGuide.limits.carryOnWeightLimit || 'Must lift unassisted'}
            </span>
            <span className="text-[11px] text-slate-500 block">Verified {activeGuide.fees.lastVerified}</span>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              !isNoLimit && weightCapLbs !== null && grossLbs > weightCapLbs
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <span className="text-[10px] font-bold uppercase opacity-75 block">Estimated Scale Weight ({tareLbs.toFixed(1)} lb tare)</span>
            <span className="font-black text-sm flex items-center gap-1.5">
              {!isNoLimit && weightCapLbs !== null && grossLbs > weightCapLbs ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{grossLbs.toFixed(1)} lbs gross</span>
            </span>
            <span className="text-[11px] block opacity-85">
              {isNoLimit || weightCapLbs === null
                ? 'No fixed carry-on weight cap — must lift safely.'
                : grossLbs > weightCapLbs
                  ? `${(grossLbs - weightCapLbs).toFixed(1)} lbs over ${weightCapLbs} lb cap`
                  : `${(weightCapLbs - grossLbs).toFixed(1)} lbs headroom remaining`}
            </span>
          </div>
        </div>

        {activeGuide.limits.notes && (
          <p className="text-[11px] text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
            <strong>Fare &amp; Sizer Note:</strong> {activeGuide.limits.notes}{' '}
            <a href={activeGuide.canonicalPath} className="underline font-bold">
              Full {activeGuide.name} guide →
            </a>
          </p>
        )}
      </section>

      {/* B3: Real App Smart Luggage Scales Preview (22 lb cap) */}
      <section className="space-y-2.5">
        <SmartLuggageScalesPanel
          carryOnCapLbs={weightCapLbs ?? 22}
          airlineName={weightCapLbs ? activeGuide.name : 'Air Transat'}
          linkHref="/?action=new_trip&mode=PLANE"
          linkLabel="Model your own carry-on weight free"
        />
      </section>

      {/* Carrier Comparison Table */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Carry-On Size &amp; Weight Limit Comparison (Major US, Canadian &amp; Global Airlines)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Published carry-on dimensions, cabin weight caps, and personal-item limits verified November 26, 2026.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Airline</th>
                <th className="py-3 px-4">Carry-On Max Size</th>
                <th className="py-3 px-4">Weight Cap</th>
                <th className="py-3 px-4">Personal Item</th>
                <th className="py-3 px-4">Carry-On Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {featuredGuides.map((g) => (
                <tr key={g.id}>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    <a href={g.canonicalPath} className="underline hover:text-purple-600">
                      {g.name}
                    </a>
                  </td>
                  <td className="py-3 px-4">{g.limits.carryOnLimit.split('(')[0].trim()}</td>
                  <td className="py-3 px-4 font-semibold">
                    {g.limits.carryOnWeightLimit ? g.limits.carryOnWeightLimit.split(';')[0].trim() : 'No limit'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{g.limits.personalLimit.split('(')[0].trim()}</td>
                  <td className="py-3 px-4 font-bold">
                    {g.fees.carryOnFee === 0
                      ? 'Free ($0)*'
                      : formatAirlineFee(g.fees.carryOnFee, g.fees.currencySymbol, g.fees.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500">
          *Air Canada Basic (NA/Sun), WestJet UltraBasic (Canada/US), United Basic Economy (most domestic), and SAS Go Light allow an under-seat personal item only and exclude overhead carry-on bins. Static published estimates verified November 26, 2026; fees and dimensions vary by route, fare family, and operating carrier—always confirm with your airline before departure.
        </p>
      </section>

      {/* Verbatim FAQs */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Carry-On Sizer &amp; Weight Limit FAQs
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          {CARRY_ON_FAQS.map((faq) => (
            <div key={faq.question} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross links & CTA */}
      <section className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 text-xs font-bold text-purple-600 dark:text-purple-400">
          <a href="/airlines/" className="hover:underline">All 42 Airline Guides →</a>
          <a href="/tare-weight" className="hover:underline">Tare Weight Guide →</a>
          <a href="/tsa-liquids-checker" className="hover:underline">TSA 3-1-1 Liquids Checker →</a>
          <a href="/baggage-fee-calculator/" className="hover:underline">Baggage Fee Calculator →</a>
        </div>
        <a
          href="/?action=new_trip&mode=PLANE"
          className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <span>Model My Carry-On Free</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </section>
    </PageLayout>
  );
};
