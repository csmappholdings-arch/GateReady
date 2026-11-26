import React, { useMemo, useState } from 'react';
import { PageLayout } from './PageLayout';
import { TSA_LIQUIDS_TABLE, TSA_LIQUIDS_FAQS } from '../data/faqData';
import {
  Droplets,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { TsaCheckerShowcasePanel } from '../components/RealUiShowcases';

type SecurityAuthority = 'BOTH' | 'US' | 'CA';

export const TsaLiquidsCheckerPage: React.FC = () => {
  const [authority, setAuthority] = useState<SecurityAuthority>('BOTH');
  const [containerValue, setContainerValue] = useState<string>('3.0');
  const [unit, setUnit] = useState<'OZ' | 'ML'>('OZ');
  const [bagType, setBagType] = useState<'CARRY_ON' | 'CHECKED'>('CARRY_ON');
  const [isMedicalOrInfant, setIsMedicalOrInfant] = useState<boolean>(false);

  const handleAuthorityChange = (next: SecurityAuthority) => {
    setAuthority(next);
    if (next === 'CA' && unit === 'OZ') {
      const parsed = parseFloat(containerValue);
      setUnit('ML');
      if (Number.isFinite(parsed) && parsed > 0) {
        setContainerValue(String(Math.round(parsed * 29.5735)));
      } else {
        setContainerValue('90');
      }
    } else if (next === 'US' && unit === 'ML') {
      const parsed = parseFloat(containerValue);
      setUnit('OZ');
      if (Number.isFinite(parsed) && parsed > 0) {
        setContainerValue((parsed / 29.5735).toFixed(1));
      } else {
        setContainerValue('3.0');
      }
    }
  };

  const ruleVerdict = useMemo(() => {
    const rawVal = parseFloat(containerValue);
    if (!Number.isFinite(rawVal) || rawVal <= 0) {
      return {
        status: 'ENTER_VOLUME',
        label: `Enter a valid printed container volume (${unit === 'OZ' ? 'fl oz' : 'mL / g'}) to evaluate.`,
        detail: 'Security screeners evaluate the capacity printed on the container label, not how much product remains inside.'
      };
    }

    const ozVal = unit === 'OZ' ? rawVal : rawVal / 29.5735;
    const mlVal = unit === 'ML' ? rawVal : Math.round(rawVal * 29.5735);
    const formattedPair = `${ozVal.toFixed(1)} fl oz (${Math.round(mlVal)} mL)`;

    if (bagType === 'CHECKED') {
      return {
        status: 'PASS_CHECKED',
        label: 'Permitted in Checked Baggage',
        detail: `${formattedPair} avoids the carry-on 100 mL / 3.4 fl oz container limit when packed in checked luggage. Carrier toiletry aerosol caps and hazardous-material exclusions still apply.`
      };
    }

    if (isMedicalOrInfant) {
      return {
        status: 'EXEMPT',
        label: 'Exempt in Carry-On (Declare at Screening Checkpoint)',
        detail:
          authority === 'CA'
            ? 'Under CATSA rules, prescription liquid medications, essential non-prescription medical liquids, and baby formula/milk or toddler food over 100 mL / 100 g are permitted when presented separately for screening.'
            : authority === 'US'
              ? 'Under TSA rules, medically necessary liquids, contact lens solution, prescription syrups, and baby formula/breast milk over 3.4 fl oz are exempt when declared to the TSA officer.'
              : 'Medically necessary liquids, contact lens solution, prescription syrups, and baby formula/breast milk over 3.4 fl oz (100 mL) are exempt under both TSA and CATSA rules when declared separately to the screening officer.'
      };
    }

    const passes = unit === 'OZ' ? ozVal <= 3.4 : mlVal <= 100;

    if (passes) {
      if (authority === 'CA') {
        return {
          status: 'PASS_311',
          label: 'Meets Canadian CATSA 100 mL / 100 g Rule',
          detail: `${Math.round(mlVal)} mL (100 mL / 100 g max) fits CATSA carry-on limits for liquids, aerosols, gels, and non-solid foods (such as yogurt, spreads, or syrup). Pack inside 1 clear, closed, resealable plastic bag with a maximum 1 liter (1 L) capacity. Planning check only — checkpoint officers make the final decision.`
        };
      }
      if (authority === 'US') {
        return {
          status: 'PASS_311',
          label: 'Meets US TSA 3-1-1 Rule (≤ 3.4 fl oz)',
          detail: `${formattedPair} is at or below the 3.4 fl oz (100 mL) container cap. Pack inside 1 clear, quart-sized zip-top plastic bag (1 bag per passenger). Planning check only — TSA officers make the final checkpoint decision.`
        };
      }
      return {
        status: 'PASS_311',
        label: 'Meets US TSA 3-1-1 & Canadian CATSA 100 mL Limits',
        detail: `${formattedPair} satisfies both the US TSA limit (≤ 3.4 fl oz / 100 mL inside 1 clear quart-sized zip-top bag) and the Canadian CATSA limit (≤ 100 mL or 100 g inside 1 clear, closed, resealable 1-liter plastic bag), 1 bag per passenger.`
      };
    }

    return {
      status: 'OVER_311',
      label:
        authority === 'CA'
          ? 'Over 100 mL / 100 g CATSA Limit — Move to Checked Bag or Decant'
          : 'Over 3.4 fl oz (100 mL) Limit — Move to Checked Bag or Decant',
      detail: `${formattedPair} exceeds the ${authority === 'CA' ? 'CATSA 100 mL / 100 g' : 'TSA 3-1-1 3.4 fl oz (100 mL)'} carry-on limit. Non-exempt containers over the limit should move to checked baggage or a travel-sized ≤ 100 mL container.`
    };
  }, [containerValue, unit, bagType, isMedicalOrInfant, authority]);

  return (
    <PageLayout pathname="/tsa-liquids-checker">
      {/* Direct Answer Block immediately below Hero H1 */}
      <section className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300">
          <Droplets className="w-4 h-4 text-purple-600" />
          <span>Direct Answer — US TSA 3-1-1 vs. Canadian CATSA Liquids Rules</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          Carry-on liquid limits depend on your departure country&apos;s security authority. GateReady performs a rule- and list-based catalog audit against the <strong>3.4 fl oz (100 mL)</strong> standard before departure — it is not a camera or barcode scanner and provides planning guidance only (final clearance rests with airport screening officers).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${authority === 'US' ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900' : 'border-purple-200 dark:border-slate-700'} space-y-1.5`}>
            <div className="font-black text-slate-900 dark:text-white">🇺🇸 United States — TSA 3-1-1 Rule</div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li><strong>Container limit:</strong> ≤ 3.4 fl oz (100 mL) per liquid, gel, aerosol, cream, or paste</li>
              <li><strong>Bag requirement:</strong> 1 clear, quart-sized zip-top plastic bag per passenger</li>
              <li>
                <strong>Official TSA guidance:</strong>{' '}
                <a
                  href="https://www.tsa.gov/travel/security-screening/liquids-aerosols-gels-rule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 dark:text-purple-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>tsa.gov Liquids, Aerosols &amp; Gels Rule</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${authority === 'CA' ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900' : 'border-purple-200 dark:border-slate-700'} space-y-1.5`}>
            <div className="font-black text-slate-900 dark:text-white">🇨🇦 Canada — CATSA 100 mL / 1 L Rule</div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li><strong>Container limit:</strong> ≤ 100 mL (or 100 g) for liquids, aerosols, gels, and non-solid food (e.g., yogurt, spreads, maple syrup)</li>
              <li><strong>Bag requirement:</strong> 1 clear, closed, resealable plastic bag up to 1 liter (1 L) capacity per passenger</li>
              <li>
                <strong>Official CATSA guidance:</strong>{' '}
                <a
                  href="https://www.catsa-acsta.gc.ca/en/what-can-bring/liquids-non-solid-food-personal-items"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 dark:text-purple-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>catsa-acsta.gc.ca Liquids &amp; Non-Solid Food</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Rule-Based Interactive Liquids Volume Checker */}
      <section className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Quick Rule-Based Liquid Volume Check
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Select your departure country authority and enter the volume printed on your bottle label. Planning estimate only — never a guarantee of screening clearance.
            </p>
          </div>

          {/* Departure Country Authority Selector */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => handleAuthorityChange('BOTH')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                authority === 'BOTH' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-purple-700'
              }`}
            >
              Both (TSA &amp; CATSA)
            </button>
            <button
              type="button"
              onClick={() => handleAuthorityChange('US')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                authority === 'US' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-purple-700'
              }`}
            >
              🇺🇸 US (TSA)
            </button>
            <button
              type="button"
              onClick={() => handleAuthorityChange('CA')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                authority === 'CA' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-purple-700'
              }`}
            >
              🇨🇦 Canada (CATSA)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="tsa-oz-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Printed Bottle Size ({unit === 'OZ' ? 'fl oz' : 'mL / g'})
              </label>
              <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setUnit('OZ')}
                  className={`px-2 py-0.5 cursor-pointer ${unit === 'OZ' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                >
                  fl oz
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('ML')}
                  className={`px-2 py-0.5 cursor-pointer ${unit === 'ML' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}
                >
                  mL / g
                </button>
              </div>
            </div>
            <input
              id="tsa-oz-input"
              type="number"
              min="0.1"
              step={unit === 'OZ' ? '0.1' : '5'}
              value={containerValue}
              onChange={(e) => setContainerValue(e.target.value)}
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

      {/* B3: Real App Rule Audit Preview */}
      <section className="space-y-2.5">
        <TsaCheckerShowcasePanel linkHref="/?action=new_trip&mode=PLANE" linkLabel="Audit your own carry-on list free" />
      </section>

      {/* Common Liquids & Aerosols Comparison Table */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Common Carry-On Liquid, Gel, Aerosol &amp; Non-Solid Food Rules Table
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Side-by-side container size audit across TSA (United States) and CATSA (Canada) airport security guidance.
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
          <span>Medical &amp; Infant Liquid Exemptions (TSA &amp; CATSA)</span>
        </div>
        <p className="text-amber-950 dark:text-amber-100 leading-relaxed">
          Prescription liquid medications, insulin/ice packs, saline contact solution, and baby formula, breast milk, or toddler purées over 3.4 fl oz (100 mL) are permitted in carry-on luggage in reasonable trip quantities under both US TSA and Canadian CATSA rules. Separate them from your 1-quart (TSA) or 1-liter (CATSA) bag and declare them to the screening officer at the belt.
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
