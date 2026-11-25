import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Droplets,
  Luggage,
  Minus,
  Plus,
  RotateCcw,
  Scale,
  ShieldCheck,
  Undo2
} from 'lucide-react';
import { Bag, PackingItem, Trip } from '../types/travel';
import { createAirCanadaSampleTrip } from '../data/sampleTrip';
import { computeBagWeightStatus } from '../utils/bagWeightAnalysis';
import { computeRebalanceSuggestions, SuggestedMove } from '../utils/rebalanceAlgorithm';
import { scanItemForLiquids } from '../utils/liquidScanner';
import { calculateTravelReadinessScore } from '../utils/readinessScore';
import { markValueMomentReached } from '../utils/valueMoment';

interface HomepageInteractiveDemoProps {
  onCreateOwnTrip: () => void;
}

export const HomepageInteractiveDemo: React.FC<HomepageInteractiveDemoProps> = ({ onCreateOwnTrip }) => {
  const [trip, setTrip] = useState<Trip>(() => createAirCanadaSampleTrip('homepage-demo'));
  const [appliedHistory, setAppliedHistory] = useState<
    Array<{
      moveId: string;
      sourceBagId: string;
      destBagId: string;
      originalItemId: string;
      movedItemId: string;
      movedQuantity: number;
      description: string;
    }>
  >([]);

  // Recompute real statuses with active items (quantity > 0 contribute to weight meter)
  const effectiveTrip: Trip = useMemo(
    () => ({
      ...trip,
      bags: trip.bags.map((bag) => ({
        ...bag,
        items: bag.items.filter((it) => (it.quantity ?? 1) > 0)
      }))
    }),
    [trip]
  );

  const bagStatuses = useMemo(
    () =>
      effectiveTrip.bags.map((bag) => ({
        bag,
        status: computeBagWeightStatus(bag, 'LBS', effectiveTrip.companyName, effectiveTrip.travelType)
      })),
    [effectiveTrip]
  );

  const rebalanceAnalysis = useMemo(() => computeRebalanceSuggestions(effectiveTrip), [effectiveTrip]);
  const readiness = useMemo(() => calculateTravelReadinessScore(effectiveTrip), [effectiveTrip]);

  const handleTogglePacked = (bagId: string, itemId: string) => {
    let becamePacked = false;
    setTrip((prev) => ({
      ...prev,
      bags: prev.bags.map((bag) => {
        if (bag.id !== bagId) return bag;
        return {
          ...bag,
          items: bag.items.map((item) => {
            if (item.id !== itemId) return item;
            if (!item.isPacked) becamePacked = true;
            return { ...item, isPacked: !item.isPacked };
          })
        };
      })
    }));
    if (becamePacked) {
      markValueMomentReached('ITEM_PACKED');
    }
  };

  const handleAdjustQuantity = (bagId: string, itemId: string, delta: number) => {
    setTrip((prev) => ({
      ...prev,
      bags: prev.bags.map((bag) => {
        if (bag.id !== bagId) return bag;
        return {
          ...bag,
          items: bag.items.map((item) => {
            if (item.id !== itemId) return item;
            const current = typeof item.quantity === 'number' ? item.quantity : 1;
            const nextQty = Math.max(0, Math.min(10, current + delta));
            return { ...item, quantity: nextQty };
          })
        };
      })
    }));
  };

  const handleApplySuggestion = (move: SuggestedMove) => {
    const movedItemId = `${move.itemId}-moved-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    let actualMoveQty = move.quantity;

    setTrip((prev) => {
      const sourceBag = prev.bags.find((b) => b.id === move.sourceBagId);
      const sourceItem = sourceBag?.items.find((i) => i.id === move.itemId);
      if (!sourceItem) return prev;

      const sourceQty = typeof sourceItem.quantity === 'number' ? sourceItem.quantity : 1;
      const moveQty = Math.max(1, Math.min(sourceQty, move.quantity));
      const remainingQty = sourceQty - moveQty;
      actualMoveQty = moveQty;

      return {
        ...prev,
        bags: prev.bags.map((bag) => {
          if (bag.id === move.sourceBagId) {
            if (remainingQty <= 0) {
              return {
                ...bag,
                items: bag.items.filter((i) => i.id !== move.itemId)
              };
            }
            return {
              ...bag,
              items: bag.items.map((i) =>
                i.id === move.itemId ? { ...i, quantity: remainingQty } : i
              )
            };
          }
          if (bag.id === move.destBagId) {
            const relocated: PackingItem = {
              ...sourceItem,
              id: movedItemId,
              quantity: moveQty
            };
            return {
              ...bag,
              items: [...bag.items, relocated]
            };
          }
          return bag;
        })
      };
    });

    setAppliedHistory((prev) => [
      ...prev,
      {
        moveId: move.id,
        sourceBagId: move.sourceBagId,
        destBagId: move.destBagId,
        originalItemId: move.itemId,
        movedItemId,
        movedQuantity: actualMoveQty,
        description: `Moved ${move.itemName} (${move.itemWeightLbs.toFixed(1)} lbs) → ${move.destBagLabel}`
      }
    ]);
    markValueMomentReached('REBALANCE_APPLIED');
  };

  const handleUndoLast = () => {
    const last = appliedHistory[appliedHistory.length - 1];
    if (!last) return;

    setTrip((prev) => {
      const destBag = prev.bags.find((b) => b.id === last.destBagId);
      const movedItem = destBag?.items.find((i) => i.id === last.movedItemId);
      if (!movedItem) return prev;

      const destQty = typeof movedItem.quantity === 'number' ? movedItem.quantity : 1;
      const qtyToRestore = destQty > 0 ? Math.min(destQty, last.movedQuantity) : 0;
      const remainingDestQty = destQty - qtyToRestore;

      return {
        ...prev,
        bags: prev.bags.map((bag) => {
          if (bag.id === last.destBagId) {
            if (remainingDestQty <= 0) {
              return {
                ...bag,
                items: bag.items.filter((i) => i.id !== last.movedItemId)
              };
            }
            return {
              ...bag,
              items: bag.items.map((i) =>
                i.id === last.movedItemId ? { ...i, quantity: remainingDestQty } : i
              )
            };
          }
          if (bag.id === last.sourceBagId) {
            if (qtyToRestore <= 0) return bag;
            const existingOriginal = bag.items.find((i) => i.id === last.originalItemId);
            if (existingOriginal) {
              const origQty = typeof existingOriginal.quantity === 'number' ? existingOriginal.quantity : 1;
              return {
                ...bag,
                items: bag.items.map((i) =>
                  i.id === last.originalItemId ? { ...i, quantity: origQty + qtyToRestore } : i
                )
              };
            }
            return {
              ...bag,
              items: [...bag.items, { ...movedItem, id: last.originalItemId, quantity: qtyToRestore }]
            };
          }
          return bag;
        })
      };
    });

    setAppliedHistory((prev) => prev.slice(0, -1));
  };

  const handleResetDemo = () => {
    setTrip(createAirCanadaSampleTrip('homepage-demo'));
    setAppliedHistory([]);
  };

  const primarySuggestion = rebalanceAnalysis.suggestedMoves[0];

  return (
    <section
      id="see-it-in-action"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8"
      aria-labelledby="see-it-in-action-heading"
    >
      <div className="rounded-3xl border border-purple-200/80 dark:border-purple-800/60 bg-white dark:bg-slate-900 shadow-lg shadow-purple-950/5 overflow-hidden">
        {/* Top Demo Header Bar */}
        <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-purple-950">
                Sample trip
              </span>
              <h2 id="see-it-in-action-heading" className="text-lg sm:text-xl font-black tracking-tight text-white">
                See it in action: Air Canada · Toronto (YYZ) → London (LHR)
              </h2>
            </div>
            <p className="text-xs text-purple-200/90">
              Toggle packed checkboxes, adjust quantities, or apply the suggest-first rebalance proposal — no account needed.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold tabular-nums flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Readiness: {readiness.totalScore}/100</span>
            </div>
            <button
              type="button"
              onClick={handleResetDemo}
              className="h-8 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset sample trip"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Suggest-First Rebalance Strip */}
        {appliedHistory.length > 0 && primarySuggestion && (
          <div className="px-5 sm:px-7 py-2.5 border-b bg-emerald-50/90 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{appliedHistory[appliedHistory.length - 1]?.description}</span>
            </div>
            <button
              type="button"
              onClick={handleUndoLast}
              className="h-8 px-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs inline-flex items-center gap-1 hover:bg-emerald-100/50 transition-colors cursor-pointer shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          </div>
        )}

        {(primarySuggestion || appliedHistory.length > 0) && (
          <div
            className={`px-5 sm:px-7 py-3.5 border-b text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              primarySuggestion
                ? 'bg-amber-50/90 dark:bg-amber-950/35 border-amber-200 dark:border-amber-800/70'
                : 'bg-emerald-50/90 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70'
            }`}
          >
            {primarySuggestion ? (
              <>
                <div className="flex items-start gap-2.5 min-w-0">
                  <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-black text-slate-900 dark:text-white">
                      Suggest-first Rebalance proposal: Move{' '}
                      <span className="text-purple-700 dark:text-purple-300">{primarySuggestion.itemName}</span> (
                      {primarySuggestion.itemWeightLbs.toFixed(1)} lbs) from {primarySuggestion.sourceBagLabel} to{' '}
                      {primarySuggestion.destBagLabel}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
                      Checked drops from {primarySuggestion.sourceBeforeLbs.toFixed(1)} lbs to{' '}
                      <strong>{primarySuggestion.sourceAfterLbs.toFixed(1)} lbs</strong> (under 50.0 lb limit) · Items never move until you click Apply.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApplySuggestion(primarySuggestion)}
                    className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                  {appliedHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndoLast}
                      className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    All bags within Air Canada weight limits.{' '}
                    {appliedHistory[appliedHistory.length - 1]?.description}
                  </span>
                </div>
                {appliedHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUndoLast}
                    className="h-9 px-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs inline-flex items-center gap-1.5 hover:bg-emerald-100/50 transition-colors cursor-pointer shrink-0"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Undo move</span>
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Interactive Two-Bag Split Workspace */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {bagStatuses.map(({ bag, status }) => {
            const rawBag = trip.bags.find((b) => b.id === bag.id) || bag;
            const packedCount = rawBag.items.filter((i) => i.isPacked).length;
            const totalCount = rawBag.items.length;
            const progressWidth = status.hasNoWeightLimit
              ? Math.min(Math.round((status.displayedWeightLbs / 25) * 100), 100)
              : Math.min(status.pct, 100);

            return (
              <div
                key={bag.id}
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-4 ${
                  status.isOverweight
                    ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/30 dark:bg-rose-950/15'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'
                }`}
              >
                {/* Bag Header + Real computeBagWeightStatus Meter */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                        <Luggage className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{bag.label}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                          {packedCount} of {totalCount} {totalCount === 1 ? 'item' : 'items'} packed in this bag · Tare{' '}
                          {status.emptyLbs.toFixed(1)} lbs
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg shrink-0 ${
                        status.hasNoWeightLimit
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                          : status.isOverweight
                            ? 'bg-rose-600 text-white'
                            : status.isNearLimit
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {status.hasNoWeightLimit
                        ? 'No weight limit'
                        : status.isOverweight
                          ? 'Over 50 lb limit'
                          : status.isNearLimit
                            ? 'Near limit'
                            : 'Within limit'}
                    </span>
                  </div>

                  {/* Weight Meter Bar */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="font-black text-slate-900 dark:text-white text-base tabular-nums">
                        {status.displayedWeightLbs.toFixed(1)} lbs
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {status.hasNoWeightLimit
                          ? `Air Canada cabin bag (${status.emptyLbs.toFixed(1)} lb tare + ${status.itemsLbs.toFixed(1)} lb items)`
                          : `/ ${status.limitLbs?.toFixed(0)} lb max (${status.pct.toFixed(1)}%)`}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          status.isOverweight
                            ? 'bg-rose-500'
                            : status.isNearLimit
                              ? 'bg-amber-500'
                              : 'bg-purple-600'
                        }`}
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Item Rows */}
                  <div className="space-y-1.5">
                    {rawBag.items.map((item) => {
                      const qty = typeof item.quantity === 'number' ? item.quantity : 1;
                      const unitWt = item.customWeightLbs ?? 0.5;
                      const lineWt = (qty * unitWt).toFixed(1);
                      const liquidScan = scanItemForLiquids(item.name, bag.type);
                      const showTsaWarn = liquidScan.status === 'NON_COMPLIANT' && qty > 0;
                      const showTsaPass = liquidScan.status === 'COMPLIANT' && qty > 0;

                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-colors ${
                            qty === 0
                              ? 'bg-slate-100/70 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-700 opacity-65'
                              : showTsaWarn
                                ? 'bg-rose-50 dark:bg-rose-950/35 border-rose-200 dark:border-rose-800/70'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => handleTogglePacked(bag.id, item.id)}
                              aria-label={`Mark ${item.name} as ${item.isPacked ? 'unpacked' : 'packed'}`}
                              className={`mt-0.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                                item.isPacked
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </button>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`font-semibold ${
                                    item.isPacked
                                      ? 'text-slate-900 dark:text-white'
                                      : 'text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  {item.name}
                                </span>
                                {showTsaWarn && liquidScan.badgeLabel && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                                    <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                    <span>{liquidScan.badgeLabel}</span>
                                  </span>
                                )}
                                {showTsaPass && liquidScan.badgeLabel && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                                    <Droplets className="w-2.5 h-2.5 shrink-0" />
                                    <span>{liquidScan.badgeLabel}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity stepper updating real weight calculation */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 tabular-nums w-12 text-right">
                              {lineWt} lb
                            </span>
                            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                              <button
                                type="button"
                                onClick={() => handleAdjustQuantity(bag.id, item.id, -1)}
                                disabled={qty === 0}
                                aria-label={`Decrease ${item.name} quantity`}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-purple-600 disabled:opacity-35 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center text-[11px] font-bold tabular-nums text-slate-900 dark:text-white">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdjustQuantity(bag.id, item.id, 1)}
                                aria-label={`Increase ${item.name} quantity`}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-purple-600 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA inside interactive demo */}
        <div className="px-5 sm:px-7 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Powered by GateReady&apos;s published 42-airline tables, suitcase tare deduction, TSA 3-1-1 rules, and suggest-first bag balancing.
          </p>
          <button
            type="button"
            onClick={onCreateOwnTrip}
            className="w-full sm:w-auto h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Make your own trip free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomepageInteractiveDemo;
