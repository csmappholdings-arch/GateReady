import React, { useMemo, useState } from 'react';
import { PageLayout } from './PageLayout';
import { PACKING_7_DAY_CAPSULE, PACKING_LIST_7_DAY_FAQS } from '../data/faqData';
import { Scale, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { Capsule7DayScaleShowcase } from '../components/RealUiShowcases';

export const PackingList7DayPage: React.FC = () => {
  const [bagShell, setBagShell] = useState<'FABRIC' | 'HARDSHELL'>('FABRIC');
  const tareLbs = bagShell === 'FABRIC' ? 5.5 : 7.0;

  const itemsTotalLbs = useMemo(() => {
    const raw = PACKING_7_DAY_CAPSULE.reduce((acc, row) => acc + row.quantity * row.unitWeightLbs, 0);
    return Math.round(raw * 10) / 10;
  }, []);

  const wornTravelDayLbs = 3.5;
  const packedContentsLbs = Math.round((itemsTotalLbs - wornTravelDayLbs) * 10) / 10;
  const grossTotalLbs = Math.round((tareLbs + packedContentsLbs) * 10) / 10;

  return (
    <PageLayout pathname="/packing-list-7-day">
      {/* Direct Answer Block immediately below Hero H1 */}
      <section className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300">
          <Scale className="w-4 h-4 text-purple-600" />
          <span>Direct Answer — The 5-4-3-2-1 7-Day Carry-On Formula</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          To pack 7 days cleanly inside one carry-on suitcase, GateReady recommends the <strong>5-4-3-2-1 capsule matrix</strong>: <strong>5 tops, 4 bottoms, 3 layers, 2 pairs of shoes, 1 swimwear/dressy set</strong> (plus 7 pairs of underwear and socks, a compliant 3-1-1 quart liquids bag, and carry-on tech). The full capsule table weighs <strong>{itemsTotalLbs.toFixed(1)} lbs</strong>; wearing your heaviest sneakers, jeans, and outerwear on travel day saves <strong>~{wornTravelDayLbs.toFixed(1)} lbs</strong>, leaving <strong>~{packedContentsLbs.toFixed(1)} lbs</strong> packed inside the bag — <strong>17.2 lbs gross</strong> in a 5.5 lb fabric carry-on or <strong>18.7 lbs gross</strong> in a 7.0 lb hard-shell spinner, safely under 20–22 lb airline carry-on limits.
        </p>
      </section>

      {/* Weight Math Toggle + Breakdown Cards */}
      <section className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              7-Day Carry-On Tare Weight Breakdown
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Toggle your empty carry-on suitcase shell preset to preview airport ticket counter weight.
            </p>
          </div>
          <div className="inline-flex gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setBagShell('FABRIC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                bagShell === 'FABRIC' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Fabric Carry-On (5.5 lb tare)
            </button>
            <button
              type="button"
              onClick={() => setBagShell('HARDSHELL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                bagShell === 'HARDSHELL' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Hard-Shell (7.0 lb tare)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Empty Bag Tare</span>
            <span className="text-xl font-black text-purple-600 tabular-nums">{tareLbs.toFixed(1)} lbs</span>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Packed Inside Bag ({itemsTotalLbs.toFixed(1)} − ~{wornTravelDayLbs.toFixed(1)} worn)</span>
            <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">~{packedContentsLbs.toFixed(1)} lbs</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 block">Estimated Airport Scale Weight</span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">{grossTotalLbs.toFixed(1)} lbs gross</span>
          </div>
        </div>

        <Capsule7DayScaleShowcase bagShell={bagShell} />
      </section>

      {/* Full 5-4-3-2-1 Capsule Table */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          7-Day 5-4-3-2-1 Capsule Packing Table
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Every line includes catalog unit weight and total contribution before travel-day worn items (wearing your heaviest sneakers, jeans, and outerwear onto the plane shaves another ~3.5 lbs off bag weight).
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Unit Est.</th>
                <th className="py-3 px-4">Line Weight</th>
                <th className="py-3 px-4">Packing Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {PACKING_7_DAY_CAPSULE.map((row) => {
                const subtotal = (row.quantity * row.unitWeightLbs).toFixed(1);
                return (
                  <tr key={row.category}>
                    <td className="py-3 px-4 font-bold text-purple-700 dark:text-purple-400 whitespace-nowrap">{row.category}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.item}</td>
                    <td className="py-3 px-4 font-mono">{row.quantity}</td>
                    <td className="py-3 px-4 font-mono">{row.unitWeightLbs.toFixed(2)} lb</td>
                    <td className="py-3 px-4 font-bold">{subtotal} lbs</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">{row.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pro Checklist Callouts */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>TSA 3-1-1 &amp; Carry-On Essentials Rule</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Keep all toiletries at 3.4 fl oz (100 mL) or under inside one clear 1-quart/1-liter bag. Always keep passports, prescription medications, keys, and lithium power banks in your cabin carry-on — never in checked luggage.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Flying Basic or a 15.4 lb (7 kg) Carrier?</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Use a 1.5 lb personal backpack or 5.5 lb soft-shell bag, wear your sneakers and jacket on board, and confirm whether your fare tier includes an overhead bin bag in our <a href="/carry-on-checker" className="underline font-bold text-purple-600">Carry-On Checker</a>.
          </p>
        </div>
      </section>

      {/* Verbatim FAQs */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            7-Day Carry-On Packing FAQs
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          {PACKING_LIST_7_DAY_FAQS.map((faq) => (
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
          <a href="/carry-on-checker" className="hover:underline">Carry-On Checker →</a>
          <a href="/tsa-liquids-checker" className="hover:underline">TSA 3-1-1 Liquids Checker →</a>
          <a href="/tare-weight" className="hover:underline">Tare Weight Guide →</a>
          <a href="/airlines/" className="hover:underline">42 Airline Guides →</a>
        </div>
        <a
          href="/?action=new_trip"
          className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <span>Build My 7-Day Capsule Trip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </section>
    </PageLayout>
  );
};
