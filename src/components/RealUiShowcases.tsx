import React, { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Luggage,
  Scale,
  ShieldCheck
} from 'lucide-react';
import { Bag } from '../types/travel';
import { computeBagWeightStatus } from '../utils/bagWeightAnalysis';
import { scanItemForLiquids } from '../utils/liquidScanner';
import { calculateTravelReadinessScore } from '../utils/readinessScore';
import { createAirCanadaSampleTrip } from '../data/sampleTrip';
import { PACKING_7_DAY_CAPSULE } from '../data/faqData';

/**
 * Panel 1: Smart Luggage Scales — mid-pack tare + items visualization powered by computeBagWeightStatus.
 */
export const SmartLuggageScalesPanel: React.FC<{
  carryOnCapLbs?: number | null;
  airlineName?: string;
  linkHref?: string;
  linkLabel?: string;
}> = ({
  carryOnCapLbs = 22,
  airlineName = 'Porter / Standard Cabin',
  linkHref = '/carry-on-checker',
  linkLabel = 'Check airline carry-on limits'
}) => {
  const checkedBag: Bag = useMemo(
    () => ({
      id: 'showcase-checked',
      type: 'CHECKED',
      label: 'Checked Spinner',
      material: 'HARD_SHELL',
      emptyBagWeightLbs: 10.5,
      maxWeightLimitLbs: 50,
      items: [
        { id: 'sc-1', name: 'Outerwear & Shirts', location: 'Main', quantity: 5, isPacked: true, customWeightLbs: 2.8 },
        { id: 'sc-2', name: 'Denim Trousers', location: 'Main', quantity: 2, isPacked: true, customWeightLbs: 2.1 },
        { id: 'sc-3', name: 'Sneakers & Boots', location: 'Shoe Pocket', quantity: 1, isPacked: true, customWeightLbs: 3.5 },
        { id: 'sc-4', name: 'Toiletry & Gift Pouch', location: 'Side', quantity: 1, isPacked: true, customWeightLbs: 10.6 }
      ]
    }),
    []
  );

  const carryOnBag: Bag = useMemo(
    () => ({
      id: 'showcase-carryon',
      type: 'CARRY_ON',
      label: 'Fabric Carry-On',
      material: 'FABRIC',
      emptyBagWeightLbs: 5.5,
      maxWeightLimitLbs: carryOnCapLbs ?? 22,
      items: [
        { id: 'sc-c1', name: '5-Day Capsule Shirts & Knitwear', location: 'Main', quantity: 4, isPacked: true, customWeightLbs: 1.5 },
        { id: 'sc-c2', name: '10,000mAh Power Bank & Adapter', location: 'Front', quantity: 1, isPacked: true, customWeightLbs: 1.2 },
        { id: 'sc-c3', name: '3-1-1 Quart Toiletries', location: 'Top', quantity: 1, isPacked: true, customWeightLbs: 1.5 },
        { id: 'sc-c4', name: 'Travel Sneakers', location: 'Base', quantity: 1, isPacked: true, customWeightLbs: 2.5 }
      ]
    }),
    [carryOnCapLbs]
  );

  const checkedStatus = computeBagWeightStatus(checkedBag, 'LBS', airlineName, 'PLANE');
  const carryOnStatus = computeBagWeightStatus(
    carryOnBag,
    'LBS',
    carryOnCapLbs ? undefined : 'Air Canada',
    'PLANE'
  );

  const renderMeter = (label: string, status: ReturnType<typeof computeBagWeightStatus>, subMeta: string) => {
    const pct = status.hasNoWeightLimit ? 48 : Math.min(status.pct, 100);
    const barClass = status.isOverweight
      ? 'bg-rose-500'
      : status.isNearLimit
        ? 'bg-amber-500'
        : 'bg-emerald-500';
    return (
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-900 dark:text-white truncate">{label}</span>
          <span className="font-black text-slate-800 dark:text-slate-100 tabular-nums shrink-0">
            {status.displayedWeightLbs.toFixed(1)} lbs
            {!status.hasNoWeightLimit && status.limitLbs ? (
              <span className="font-medium text-slate-500 dark:text-slate-400"> / {status.limitLbs} lb cap</span>
            ) : (
              <span className="font-medium text-emerald-600 dark:text-emerald-400"> · No carrier weight cap</span>
            )}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barClass}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
          <span>{subMeta}</span>
          <span>
            {status.hasNoWeightLimit
              ? 'Lift unassisted'
              : `${status.pct.toFixed(0)}% of allowance`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 shadow-xs">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              Smart Luggage Scales
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tare deducted
          </span>
        </div>

        <div className="space-y-2.5">
          {renderMeter(
            'Fabric Carry-On (mid-pack)',
            carryOnStatus,
            `5.5 lb shell + ${carryOnStatus.itemsLbs.toFixed(1)} lb items`
          )}
          {renderMeter(
            'Hard-Shell Checked (mid-pack)',
            checkedStatus,
            `10.5 lb shell + ${checkedStatus.itemsLbs.toFixed(1)} lb items`
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Deducts your empty suitcase shell (5.5–10.5 lbs) automatically against airline weight limits.
        </p>
        {linkHref && (
          <a
            href={linkHref}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

/**
 * Panel 2: TSA 3-1-1 Checker — evaluates actual items via scanItemForLiquids().
 */
export const TsaCheckerShowcasePanel: React.FC<{
  linkHref?: string;
  linkLabel?: string;
}> = ({
  linkHref = '/tsa-liquids-checker',
  linkLabel = 'Open TSA / CATSA liquids checker'
}) => {
  const sampleItems = useMemo(
    () => [
      { name: 'Sunscreen Lotion (6.7 fl oz)', bagType: 'CARRY_ON' as const },
      { name: 'Travel Shampoo (3.0 fl oz)', bagType: 'CARRY_ON' as const },
      { name: 'Contact Lens Saline Solution', bagType: 'CARRY_ON' as const }
    ],
    []
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 shadow-xs">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              TSA 3-1-1 &amp; CATSA Liquids Checker
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Rule-based
          </span>
        </div>

        <div className="space-y-2">
          {sampleItems.map((item) => {
            const scan = scanItemForLiquids(item.name, item.bagType, 'INTL');
            const isWarning = scan.status === 'NON_COMPLIANT';
            const isPass = scan.status === 'COMPLIANT';
            return (
              <div
                key={item.name}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                  isWarning
                    ? 'bg-rose-50 dark:bg-rose-950/35 border-rose-200 dark:border-rose-800/70'
                    : isPass
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isWarning ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                    isWarning
                      ? 'bg-rose-600 text-white'
                      : isPass
                        ? 'bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200'
                        : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  {scan.badgeLabel || 'Checked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Flags carry-on liquids &amp; non-solid foods over 3.4 fl oz / 100 mL (1-quart TSA or 1-liter CATSA bag). Medical/infant liquids exempt; guidance only.
        </p>
        {linkHref && (
          <a
            href={linkHref}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

/**
 * Panel 3: Departure Readiness — powered by calculateTravelReadinessScore() on the sample trip.
 */
export const DepartureReadinessShowcasePanel: React.FC<{
  linkHref?: string;
  linkLabel?: string;
  onAction?: () => void;
  actionLabel?: string;
}> = ({
  linkHref = '/how-it-works',
  linkLabel = 'See how departure readiness works',
  onAction,
  actionLabel
}) => {
  const readiness = useMemo(() => {
    const trip = createAirCanadaSampleTrip('showcase-readiness');
    return calculateTravelReadinessScore(trip);
  }, []);

  const categories = [
    readiness.categories.packing,
    readiness.categories.baggage,
    readiness.categories.travellers,
    readiness.categories.documents,
    readiness.categories.finalReview
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 shadow-xs">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              Departure Readiness
            </h3>
          </div>
          <div className="text-right tabular-nums">
            <span className="text-base font-black text-purple-700 dark:text-purple-300">
              {readiness.totalScore}
            </span>
            <span className="text-[11px] font-semibold text-slate-400"> / 100</span>
          </div>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{cat.label}</span>
                <span className="font-bold text-slate-600 dark:text-slate-300 tabular-nums shrink-0">
                  {cat.score}/{cat.max}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    cat.percentage >= 90 ? 'bg-emerald-500' : cat.percentage >= 60 ? 'bg-purple-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Tracks packed bags, airline weight headroom, travel documents, and departure tasks across five checks.
        </p>
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            <span>{actionLabel || linkLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : linkHref ? (
          <a
            href={linkHref}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
};

/**
 * B3 Showcase for /packing-list-7-day:
 * Reconciled 5-4-3-2-1 carry-on meter matching A3 numbers (15.2 table - 3.5 worn = 11.7 lbs inside + 5.5 / 7.0 tare = 17.2 / 18.7 lbs).
 */
export const Capsule7DayScaleShowcase: React.FC<{
  bagShell?: 'FABRIC' | 'HARDSHELL';
}> = ({ bagShell = 'FABRIC' }) => {
  const tareLbs = bagShell === 'FABRIC' ? 5.5 : 7.0;
  const tableTotalLbs = useMemo(() => {
    const raw = PACKING_7_DAY_CAPSULE.reduce((acc, row) => acc + row.quantity * row.unitWeightLbs, 0);
    return Math.round(raw * 10) / 10;
  }, []);
  const wornLbs = 3.5;
  const packedInsideLbs = Math.round((tableTotalLbs - wornLbs) * 10) / 10;

  const simulatedBag: Bag = useMemo(
    () => ({
      id: `capsule-7day-${bagShell}`,
      type: 'CARRY_ON',
      label: bagShell === 'FABRIC' ? 'Fabric Carry-On (5.5 lb tare)' : 'Hard-Shell Spinner (7.0 lb tare)',
      material: bagShell === 'FABRIC' ? 'FABRIC' : 'HARD_SHELL',
      emptyBagWeightLbs: tareLbs,
      maxWeightLimitLbs: 22,
      items: [
        {
          id: 'cap-packed-net',
          name: '5-4-3-2-1 Capsule Inside Bag (15.2 − ~3.5 worn)',
          location: 'Main Compartment',
          quantity: 1,
          isPacked: true,
          customWeightLbs: packedInsideLbs
        }
      ]
    }),
    [bagShell, tareLbs, packedInsideLbs]
  );

  const status = computeBagWeightStatus(simulatedBag, 'LBS', 'Porter Airlines', 'PLANE');

  return (
    <div className="rounded-2xl border border-purple-200 dark:border-purple-800/70 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <Luggage className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              5-4-3-2-1 Capsule Meter ({bagShell === 'FABRIC' ? '5.5 lb Fabric' : '7.0 lb Hard-Shell'})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              {tableTotalLbs.toFixed(1)} lb table − ~{wornLbs.toFixed(1)} lb worn on travel day = ~{packedInsideLbs.toFixed(1)} lb packed + {tareLbs.toFixed(1)} lb tare
            </p>
          </div>
        </div>
        <span className="text-sm font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
          {status.displayedWeightLbs.toFixed(1)} lbs gross / 22.0 lb reference cap
        </span>
      </div>

      <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min((status.displayedWeightLbs / 22) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};
