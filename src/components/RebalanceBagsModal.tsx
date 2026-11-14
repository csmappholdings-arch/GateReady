import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Trip, WeightUnit, BagType } from '../types/travel';
import {
  computeRebalanceSuggestions,
  SuggestedMove,
  BagWeightSnapshot
} from '../utils/rebalanceAlgorithm';
import { usePacking } from '../context/PackingContext';
import {
  Scale,
  X,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Check,
  Luggage,
  Briefcase
} from 'lucide-react';

interface RebalanceBagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

interface AppliedMoveRecord {
  moveId: string;
  itemId: string;
  itemName: string;
  sourceBagId: string;
  destBagId: string;
}

export const RebalanceBagsModal: React.FC<RebalanceBagsModalProps> = ({
  isOpen,
  onClose,
  trip
}) => {
  const { weightUnit, moveItemBetweenBags } = usePacking();
  const [appliedMoves, setAppliedMoves] = useState<AppliedMoveRecord[]>([]);

  // Compute live rebalance analysis based on the current trip state
  const analysis = useMemo(() => {
    return computeRebalanceSuggestions(trip);
  }, [trip]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const formatWeight = (lbs: number | null | undefined): string => {
    if (lbs === null || lbs === undefined) return 'No limit';
    if (weightUnit === 'KG') {
      return `${(lbs * 0.45359237).toFixed(1)} kg`;
    }
    return `${lbs.toFixed(1)} lbs`;
  };

  const getBagIcon = (type: BagType) => {
    switch (type) {
      case 'PERSONAL':
        return <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'CARRY_ON':
        return <Luggage className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'CHECKED':
        return <Luggage className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Luggage className="w-4 h-4 text-purple-600" />;
    }
  };

  // Handle applying a single suggested move
  const handleApplyMove = (move: SuggestedMove) => {
    moveItemBetweenBags(trip.id, move.sourceBagId, move.destBagId, move.itemId);
    setAppliedMoves((prev) => [
      ...prev,
      {
        moveId: move.id,
        itemId: move.itemId,
        itemName: move.itemName,
        sourceBagId: move.sourceBagId,
        destBagId: move.destBagId
      }
    ]);
  };

  // Handle undoing a specific applied move
  const handleUndoMove = (applied: AppliedMoveRecord) => {
    // Revert by moving from destBag back to sourceBag
    moveItemBetweenBags(trip.id, applied.destBagId, applied.sourceBagId, applied.itemId);
    setAppliedMoves((prev) => prev.filter((m) => m.moveId !== applied.moveId));
  };

  // Handle applying all remaining suggestions
  const handleApplyAll = () => {
    analysis.suggestedMoves.forEach((move) => {
      moveItemBetweenBags(trip.id, move.sourceBagId, move.destBagId, move.itemId);
      setAppliedMoves((prev) => [
        ...prev,
        {
          moveId: move.id,
          itemId: move.itemId,
          itemName: move.itemName,
          sourceBagId: move.sourceBagId,
          destBagId: move.destBagId
        }
      ]);
    });
  };

  // Handle undoing all moves applied in this modal session
  const handleUndoAll = () => {
    // Revert in reverse order
    [...appliedMoves].reverse().forEach((record) => {
      moveItemBetweenBags(trip.id, record.destBagId, record.sourceBagId, record.itemId);
    });
    setAppliedMoves([]);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rebalance-bags-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-2xl overflow-hidden text-left my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <Scale className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Luggage Optimizer
                </span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Silver+ Feature
                </span>
              </div>
              <h2 id="rebalance-bags-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Rebalance Bags
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Introductory notice */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Review proposed item shifts below to bring heavy bags under limits. <strong>Items are never moved without your confirmation.</strong>
          </p>

          {/* Bag Weights Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Current Bag Weights &amp; Allowances
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {trip.companyName || (trip.travelType === 'PLANE' ? 'Airline' : 'Carrier')} {trip.travelType === 'PLANE' ? 'Limits' : 'Allowance'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {analysis.snapshots.map((snap: BagWeightSnapshot) => {
                const isOver = snap.isOverweight;
                const isNear = snap.isNearLimit;
                return (
                  <div
                    key={snap.bagId}
                    className={`p-3 rounded-2xl border text-xs flex flex-col justify-between transition-colors ${
                      isOver
                        ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                        : isNear
                          ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {getBagIcon(snap.type)}
                        <span className="font-extrabold text-slate-900 dark:text-white truncate">
                          {snap.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                          snap.hasNoLimit
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : isOver
                              ? 'bg-rose-600 text-white'
                              : isNear
                                ? 'bg-amber-500 text-white'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {snap.hasNoLimit ? 'No Weight Limit' : isOver ? 'Over Limit' : isNear ? '85%+ Limit' : 'Within Limit'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="font-black text-slate-800 dark:text-slate-200">
                        {formatWeight(snap.totalLbs)}
                        {!snap.hasNoLimit && snap.limitLbs && (
                          <span className="font-normal text-slate-500 dark:text-slate-400 ml-1">
                            / {formatWeight(snap.limitLbs)} max
                          </span>
                        )}
                        {snap.hasNoLimit && (
                          <span className="font-normal text-emerald-600 dark:text-emerald-400 ml-1">
                            (No airline weight limit)
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Tare: {formatWeight(snap.emptyLbs)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unweighted Items Disclaimer */}
          {analysis.unweightedItemsCount > 0 && (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                Items without a weight can&apos;t be suggested ({analysis.unweightedItemsCount} {analysis.unweightedItemsCount === 1 ? 'item has' : 'items have'} no recorded weight). Add weights to your items in the checklist to include them.
              </p>
            </div>
          )}

          {/* Suggestions List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Suggested Moves
              </span>

              {analysis.suggestedMoves.length > 1 && (
                <button
                  type="button"
                  onClick={handleApplyAll}
                  className="text-xs font-black text-purple-700 dark:text-purple-300 hover:text-purple-800 underline decoration-purple-300 underline-offset-2 cursor-pointer"
                >
                  Apply All ({analysis.suggestedMoves.length})
                </button>
              )}
            </div>

            {/* Case A: Single bag only */}
            {analysis.singleBagOnly && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-bold">Add a second bag to enable rebalancing</p>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90">
                  Rebalance Bags distributes weight between 2 or more bags. Add another carry-on, personal item, or suitcase to shift items.
                </p>
              </div>
            )}

            {/* Case B: All bags safely balanced and no suggestions */}
            {!analysis.singleBagOnly && analysis.allBagsBalanced && analysis.suggestedMoves.length === 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 dark:text-emerald-200 space-y-0.5">
                  <p className="font-black">All bags are safely balanced within limits!</p>
                  <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90">
                    No bag exceeds carrier caps or warning thresholds. You&apos;re ready to fly fee-free.
                  </p>
                </div>
              </div>
            )}

            {/* Case C: No safe move could be found */}
            {!analysis.singleBagOnly && !analysis.allBagsBalanced && analysis.suggestedMoves.length === 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-950 dark:text-rose-200 space-y-1">
                  <p className="font-black">No safe move found — remove an item or repack by hand.</p>
                  <p className="text-[11px] text-rose-800/90 dark:text-rose-300/90 leading-relaxed">
                    {analysis.noSafeMoveReason ||
                      'Items in the over-limit bag are either protected essentials (like passports, medications, or electronics that cannot be checked) or would push destination bags over their limits.'}
                  </p>
                </div>
              </div>
            )}

            {/* Case D: List of suggested moves */}
            {analysis.suggestedMoves.map((move: SuggestedMove) => (
              <div
                key={move.id}
                className="p-3.5 sm:p-4 rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-slate-800/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {move.itemName}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {formatWeight(move.itemWeightLbs)}
                      {move.quantity > 1 && (
                        <span className="ml-1 text-[10px] font-normal text-purple-600/80 dark:text-purple-300/80">
                          ({formatWeight(move.unitWeightLbs)} each)
                        </span>
                      )}
                    </span>
                    {move.isEssential && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Carry-On Safe
                      </span>
                    )}
                  </div>

                  {/* Transition display */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 flex-wrap">
                    <span className="font-semibold text-rose-700 dark:text-rose-300">
                      {move.sourceBagLabel}: {formatWeight(move.sourceBeforeLbs)} → {formatWeight(move.sourceAfterLbs)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {move.destBagLabel}: {formatWeight(move.destBeforeLbs)} → {formatWeight(move.destAfterLbs)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleApplyMove(move)}
                    className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Apply Move</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Applied Moves & Undo History Section */}
          {appliedMoves.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Applied in This Session ({appliedMoves.length})
                </span>
                <button
                  type="button"
                  onClick={handleUndoAll}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo All</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {appliedMoves.map((rec) => (
                  <div
                    key={rec.moveId}
                    className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-purple-100 dark:border-purple-900/40"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Moved &ldquo;{rec.itemName}&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUndoMove(rec)}
                      className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Checklist items and packed states are fully preserved.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
