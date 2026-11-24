import React, { useMemo, useState } from 'react';
import { PageLayout } from './PageLayout';
import { TSA_LIQUIDS_TABLE, TSA_LIQUIDS_FAQS } from '../data/faqData';
import { Droplets, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';

export const TsaLiquidsCheckerPage: React.FC = () => {
  const [containerOz, setContainerOz] = useState<string>('3.0');
  const [bagType, setBagType] = useState<'CARRY_ON' | 'CHECKED'>('CARRY_ON');
  const [isMedicalOrInfant, setIsMedicalOrInfant] = useState<boolean>(false);

  const ruleVerdict = useMemo(() => {
    const parsedOz = parseFloat(containerOz);
    if (!Number.isFinite(parsedOz) || parsedOz <= 0) {
      return {
        status: 'ENTER_VOLUME',
        label: 'Enter a valid printed container volume in fluid ounces (fl oz) to evaluate.',
        detail: 'Screeners inspect the volume printed on the bottle, not how much liquid remains inside.'
      };
    }

    if (bagType === 'CHECKED') {
      return {
        status: 'PASS_CHECKED',
        label: 'Permitted in Checked Baggage',
        detail: `${parsedOz.toFixed(1)} fl oz (${Math.round(parsedOz * 29.5735)} mL) avoids the 3-1-1 carry-on bottle limit when packed inside checked luggage (FAA toiletry aerosol limits still apply per item).`
      };
    }

    if (isMedicalOrInfant) {
      return {
        status: 'EXEMPT',
        label: 'Exempt in Carry-On (Declare at Checkpoint)',
        detail: 'Medically necessary liquids, contact lens solution, prescription syrups, and baby formula/breast milk are exempt from the 3.4 oz (100 mL) cap when declared to the TSA or CATSA officer.'
      };
    }

    if (parsedOz <= 3.4) {
      return {
        status: 'PASS_311',
        label: 'Passes TSA 3-1-1 & CATSA 100 mL Rule',
        detail: `${parsedOz.toFixed(1)} fl oz (${Math.round(parsedOz * 29.5735)} mL) is 3.4 fl oz (100 mL) or less. Pack inside your single clear 1-quart (US TSA) or 1-liter (Canadian CATSA) zip-top bag.`
      };
    }

    return {
      status: 'OVER_311',
      label: 'Over 3.4 fl oz Limit — Move to Checked Bag or Decant',
      detail: `${parsedOz.toFixed(1)} fl oz (${Math.round(parsedOz * 29.5735)} mL) exceeds the 3.4 fl oz (100 mL) security threshold and will be flagged for checked luggage or decanting into a travel bottle.`
    };
  }, [containerOz, bagType, isMedicalOrInfant]);

  return (
    <PageLayout pathname="/tsa-liquids-checker">
      {/* Direct Answer Block immediately below Hero H1 */}
      <section className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300">
          <Droplets className="w-4 h-4 text-purple-600" />
          <span>Direct Answer — TSA 3-1-1 &amp; Canadian CATSA Liquids Rule</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          Under the <strong>TSA 3-1-1 liquids rule</strong>, every liquid, gel, aerosol, cream, or paste packed inside carry-on luggage must be in a container of <strong>3.4 fl oz (100 mL) or less</strong>, fit inside <strong>1 clear quart-sized zip-top bag</strong> (or <strong>1 clear 1-liter resealable plastic bag</strong> on Canadian CATSA flights), with <strong>1 bag permitted per passenger</strong>. GateReady performs a rule- and list-based catalog audit against this 3.4 oz threshold before departure — it is not a camera or barcode scanner.
        </p>
      </section>

      {/* Rule-Based Interactive Liquids Volume Checker */}
      <section className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Quick Rule-Based Liquid Volume Check
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enter your bottle size as printed on the label (fluid ounces) and selected bag type. Rule evaluation only — always follow officer guidance at screening.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label htmlFor="tsa-oz-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Printed Bottle Size (fl oz)
            </label>
            <input
              id="tsa-oz-input"
              type="number"
              min="0.1"
              step="0.1"
              value={containerOz}
              onChange={(e) => setContainerOz(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Selected Bag Type
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setBagType('CARRY_ON')}
                className={`h-8 rounded-lg text-xs font-bold cursor-pointer ${
                  bagType === 'CARRY_ON' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Carry-On
              </button>
              <button
                type="button"
                onClick={() => setBagType('CHECKED')}
                className={`h-8 rounded-lg text-xs font-bold cursor-pointer ${
                  bagType === 'CHECKED' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Checked Bag
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isMedicalOrInfant}
              onChange={(e) => setIsMedicalOrInfant(e.target.checked)}
              className="rounded text-purple-600"
            />
            <span>Medical liquid or baby formula</span>
          </label>
        </div>

        <div
          className={`p-4 rounded-2xl border text-xs space-y-1 ${
            ruleVerdict.status === 'OVER_311'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              : ruleVerdict.status === 'EXEMPT'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
          }`}
        >
          <div className="font-black flex items-center gap-1.5">
            {ruleVerdict.status === 'OVER_311' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{ruleVerdict.label}</span>
          </div>
          <p className="leading-relaxed opacity-90">{ruleVerdict.detail}</p>
        </div>
      </section>

      {/* Common Liquids & Aerosols Comparison Table */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Common Carry-On Liquid, Gel &amp; Aerosol Rules Table
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Side-by-side container size audit across TSA (US) and CATSA (Canada) airport security rules.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Printed Size</th>
                <th className="py-3 px-4">Carry-On Status</th>
                <th className="py-3 px-4">Screening Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {TSA_LIQUIDS_TABLE.map((row) => (
                <tr key={row.item}>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.item}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">{row.size}</td>
                  <td className="py-3 px-4 font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[11px] ${
                        row.carryOnAllowed === 'Yes'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.carryOnAllowed === 'No (Checked Only)'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {row.carryOnAllowed}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Exemptions */}
      <section className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2 text-xs">
        <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Medical &amp; Infant Liquid Exemptions</span>
        </div>
        <p className="text-amber-950 dark:text-amber-100 leading-relaxed">
          Prescription liquid medications, insulin/ice packs, saline contact solution, and baby formula, breast milk, or toddler purées over 3.4 oz (100 mL) are permitted in carry-on luggage in reasonable trip quantities. Separate them from your 1-quart/1-liter bag and declare them to the screening officer at the belt.
        </p>
      </section>

      {/* Verbatim FAQs */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            TSA 3-1-1 &amp; CATSA Liquids FAQs
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          {TSA_LIQUIDS_FAQS.map((faq) => (
            <div key={faq.question} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Guides & CTA */}
      <section className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 text-xs font-bold text-purple-600 dark:text-purple-400">
          <a href="/carry-on-checker" className="hover:underline">Carry-On Size Checker →</a>
          <a href="/packing-list-7-day" className="hover:underline">7-Day Carry-On List →</a>
          <a href="/baggage-fee-calculator/" className="hover:underline">Baggage Fee Calculator →</a>
          <a href="/airlines/" className="hover:underline">42 Airline Guides →</a>
        </div>
        <a
          href="/?action=new_trip&mode=PLANE"
          className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <span>Audit My Packing List Free</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </section>
    </PageLayout>
  );
};
