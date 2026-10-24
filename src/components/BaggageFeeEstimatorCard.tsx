import React, { useState, useMemo } from 'react';
import { Trip, Bag, getBagEmptyWeightLbs } from '../types/travel';
import { calculateTripBaggageFees, BagFeeCalculationResult } from '../data/baggageFeeData';
import { DefaultSuggestions } from '../data/suggestions';
import { 
  Receipt, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Info,
  Luggage,
  Sparkles
} from 'lucide-react';

interface BaggageFeeEstimatorCardProps {
  trip: Trip;
  onOpenTripSettings?: () => void;
  className?: string;
}

export const BaggageFeeEstimatorCard: React.FC<BaggageFeeEstimatorCardProps> = ({
  trip,
  onOpenTripSettings,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate weights for each bag
  const bagsWithWeights = useMemo(() => {
    return (trip.bags || []).map((bag) => {
      const emptyLbs = getBagEmptyWeightLbs(bag);
      const itemsLbs = bag.items.reduce(
        (sum, item) => sum + (item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name)) * (item.quantity || 1),
        0
      );
      const currentWeightLbs = emptyLbs + itemsLbs;
      return {
        id: bag.id,
        label: bag.label,
        type: bag.type,
        currentWeightLbs,
        maxWeightLimitLbs: bag.maxWeightLimitLbs
      };
    });
  }, [trip.bags]);

  const airlineName = trip.companyName?.trim();
  const hasAirline = Boolean(airlineName && airlineName.length > 1);

  // Fee calculation from static published fee table
  const feeResult: BagFeeCalculationResult | null = useMemo(() => {
    if (!hasAirline) return null;
    return calculateTripBaggageFees(airlineName, bagsWithWeights, trip.seatClassOrCarSize);
  }, [airlineName, hasAirline, bagsWithWeights, trip.seatClassOrCarSize]);

  // If no airline has been selected yet
  if (!hasAirline) {
    return (
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 p-4 sm:p-5 shadow-xs transition-all ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                Bag Fee Estimate
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Select your airline to estimate baggage fees
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Calculate estimated 1st & 2nd checked bag costs, overweight fees, and avoid unexpected airport counter charges.
              </p>
            </div>
          </div>

          {onOpenTripSettings && (
            <button
              type="button"
              onClick={onOpenTripSettings}
              className="h-8.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <span>Set Airline</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // If airline exists but has no fee table entry or calculation unavailable
  if (feeResult && !feeResult.hasFeeData) {
    return (
      <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Bag Fee Estimate · {airlineName}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Estimate unavailable — check the airline's policy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We never invent fee numbers. Official published baggage fees for {airlineName} could not be estimated for this route.
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                {feeResult.disclaimer}
              </p>
            </div>
          </div>

          {feeResult.officialBaggagePageUrl && (
            <a
              href={feeResult.officialBaggagePageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8.5 px-3 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>Official Policy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!feeResult) return null;

  const checkedBags = feeResult.breakdown.filter((b) => b.bagType === 'CHECKED');
  const carryOnBags = feeResult.breakdown.filter((b) => b.bagType === 'CARRY_ON');

  // Dynamic USD approximation calculated directly from the active total fee
  const approxUsd = useMemo(() => {
    if (feeResult.currency === 'USD') return null;
    if (feeResult.totalEstimatedFee === 0) return '≈ US$0';
    if (feeResult.currency === 'CAD') {
      return `≈ US$${Math.round(feeResult.totalEstimatedFee * 0.73)}`;
    }
    if (feeResult.currency === 'EUR') {
      return `≈ US$${Math.round(feeResult.totalEstimatedFee * 1.08)}`;
    }
    if (feeResult.currency === 'GBP') {
      return `≈ US$${Math.round(feeResult.totalEstimatedFee * 1.30)}`;
    }
    return null;
  }, [feeResult.currency, feeResult.totalEstimatedFee]);

  // Bags that actually carry a fee (base fee or overweight penalty)
  const feeBearingBags = useMemo(() => {
    return feeResult.breakdown.filter((b) => b.subtotal > 0 || (b.bagType === 'CHECKED' && b.baseFee > 0));
  }, [feeResult.breakdown]);

  const feeSummaryBagCountText = useMemo(() => {
    const count = feeBearingBags.length;
    if (count === 0) return 'no fee-bearing bags';
    const allChecked = feeBearingBags.every((b) => b.bagType === 'CHECKED');
    if (count === 1) {
      return allChecked ? '1 checked bag' : '1 bag';
    }
    return allChecked ? `${count} checked bags` : `${count} fee-bearing bags`;
  }, [feeBearingBags]);

  return (
    <div className={`rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/60 shadow-sm overflow-hidden transition-all ${className}`}>
      {/* Top Header Row with Total in Large Type */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/40 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900 border-b border-purple-100 dark:border-purple-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20 mt-0.5">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  Bag Fee Estimate
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {feeResult.airlineName}
                </span>
                {approxUsd && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    ({approxUsd})
                  </span>
                )}
              </div>

              {/* Total in Large Type */}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                  {feeResult.totalEstimatedFeeFormatted}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  estimated total · {feeSummaryBagCountText}
                </span>
              </div>

              {/* Overweight flag if any */}
              {feeResult.overweightBagCount > 0 && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {feeResult.overweightBagCount} {feeResult.overweightBagCount === 1 ? 'bag' : 'bags'} overweight → +{feeResult.currencySymbol}{feeResult.totalOverweightFee}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {feeResult.officialBaggagePageUrl && (
              <a
                href={feeResult.officialBaggagePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8.5 px-3 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="View official published airline fee page"
              >
                <span>Official Policy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8.5 px-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/80 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Breakdown' : 'Per-Bag Breakdown'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {feeResult.feeNotes && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            {feeResult.feeNotes}
          </p>
        )}
      </div>

      {/* Expandable Per-Bag Breakdown */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-b border-purple-100 dark:border-purple-900/40 space-y-3 animate-in fade-in duration-150">
          <div className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Per-Bag Cost Breakdown ({trip.bags.length} configured):
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {feeResult.breakdown.map((item, idx) => (
              <div 
                key={item.bagId || idx}
                className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    item.bagType === 'CHECKED' 
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    <Luggage className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {item.bagLabel}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.bagType === 'CHECKED' ? 'Checked Luggage' : item.bagType === 'CARRY_ON' ? 'Carry-On Overhead' : 'Personal Item'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {item.subtotalFormatted}
                    </span>
                    {item.isOverweight && (
                      <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                        +{feeResult.currencySymbol}{item.overweightFee} overweight fee ({item.overweightReason})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick summary inline */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
            <span>
              Checked bags: {checkedBags.length} · Carry-ons: {carryOnBags.length} · Overweight penalty: {feeResult.currencySymbol}{feeResult.totalOverweightFee}
            </span>
            <span className="font-bold text-purple-700 dark:text-purple-300">
              Total estimated fee: {feeResult.totalEstimatedFeeFormatted}
            </span>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer Footer (Brand Rule: Never Present as Live) */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="leading-snug">
          {feeResult.disclaimer}
        </span>
      </div>
    </div>
  );
};
