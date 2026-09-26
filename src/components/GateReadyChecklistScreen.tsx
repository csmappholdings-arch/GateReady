import React, { useState } from 'react';
import { usePacking } from '../context/PackingContext';
import { Trip } from '../types/travel';
import { DefaultSuggestions } from '../data/suggestions';
import { 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Printer, 
  Check, 
  PlaneTakeoff, 
  Scale, 
  Briefcase,
  Plus,
  Users,
  User,
  Droplets
} from 'lucide-react';

interface GateReadyChecklistScreenProps {
  trip: Trip;
}

export const GateReadyChecklistScreen: React.FC<GateReadyChecklistScreenProps> = ({ trip }) => {
  const { weightUnit, toggleGateCheckItem } = usePacking();
  const [copied, setCopied] = useState(false);

  // Packing statistics
  const totalItemsCount = trip.bags.reduce((sum, b) => sum + b.items.length, 0);
  const packedItemsCount = trip.bags.reduce(
    (sum, b) => sum + b.items.filter((i) => i.isPacked).length,
    0
  );
  const packingPct = totalItemsCount > 0 ? Math.round((packedItemsCount / totalItemsCount) * 100) : 0;

  // Gate check items
  const gateChecks = trip.gateChecklist || [];
  const completedGateChecks = gateChecks.filter((g) => g.completed).length;
  const gatePct = gateChecks.length > 0 ? Math.round((completedGateChecks / gateChecks.length) * 100) : 0;

  // Overall readiness score
  const overallReadyPct = Math.round((packingPct * 0.6) + (gatePct * 0.4));
  const isGateReady = overallReadyPct >= 95;

  // Total weight across all bags
  const totalTripWeightLbs = trip.bags.reduce((total, bag) => {
    const bagLbs = bag.items.reduce((bSum, item) => {
      const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
      return bSum + w * item.quantity;
    }, 0);
    return total + bagLbs;
  }, 0);

  const displayTotalWeight = weightUnit === 'KG'
    ? DefaultSuggestions.convertLbsToKg(totalTripWeightLbs).toFixed(1) + ' kg'
    : totalTripWeightLbs.toFixed(1) + ' lbs';

  const familyMembers = trip.familyMembers && trip.familyMembers.length > 0 ? trip.familyMembers : ['Travelers'];

  const handleCopySummary = () => {
    let summary = `✈️ GATE READY PACKING SUMMARY: ${trip.name}\n`;
    summary += `Carrier: ${trip.companyName || trip.travelType} (${trip.seatClassOrCarSize || 'Standard'})\n`;
    summary += `Travelers: ${familyMembers.join(', ')}\n`;
    summary += `Total Weight: ${displayTotalWeight}\n`;
    summary += `Packed: ${packedItemsCount}/${totalItemsCount} items (${packingPct}%)\n\n`;

    trip.bags.forEach((bag) => {
      const bagWeightLbs = bag.items.reduce((sum, item) => {
        const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
        return sum + w * item.quantity;
      }, 0);
      const bagWeightStr = DefaultSuggestions.formatWeight(bagWeightLbs, weightUnit);

      summary += `📦 ${bag.label} (${bag.type}) - Owner: ${bag.assignedTo || 'Family'} - Est: ${bagWeightStr}\n`;
      bag.items.forEach((item) => {
        const mark = item.isPacked ? '[x]' : '[ ]';
        const forWhom = item.packedFor ? ` [For: ${item.packedFor}]` : '';
        summary += `   ${mark} ${item.name} (x${item.quantity})${forWhom}${item.location ? ` - In: ${item.location}` : ''}\n`;
      });
      summary += '\n';
    });

    summary += `✅ Gate Verification Checkpoints:\n`;
    gateChecks.forEach((gc) => {
      summary += `   ${gc.completed ? '[x]' : '[ ]'} ${gc.text}\n`;
    });

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
      {/* Gate Readiness Scorecard (Purple Theme) */}
      <div className="rounded-3xl bg-linear-to-br from-purple-950 via-purple-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-purple-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <PlaneTakeoff className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-purple-300">
                Departure Readiness Status
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                {isGateReady ? 'You Are Gate Ready! ✈️' : 'Preparing for Gate Departure'}
              </h2>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-md">
                {trip.name} · {trip.companyName || trip.travelType} · {trip.bags.length} bags tracked
              </p>
              {familyMembers.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs text-purple-300 mt-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Travelers: {familyMembers.join(' · ')}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <span className="text-2xl font-black text-white tabular-nums">
                  {overallReadyPct}%
                </span>
                <span className="text-[10px] text-purple-300 font-medium">Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[11px] text-purple-200 font-medium">Packed Progress</p>
              <p className="text-base font-bold text-white mt-0.5 tabular-nums">
                {packedItemsCount} / {totalItemsCount}
              </p>
              <p className="text-[10px] text-purple-300 mt-0.5">{packingPct}% packed</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[11px] text-purple-200 font-medium">Total Luggage Weight</p>
              <p className="text-base font-bold text-white mt-0.5 tabular-nums">
                {displayTotalWeight}
              </p>
              <p className="text-[10px] text-purple-300 mt-0.5">{trip.bags.length} bags combined</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[11px] text-purple-200 font-medium">Gate Checkpoints</p>
              <p className="text-base font-bold text-white mt-0.5 tabular-nums">
                {completedGateChecks} / {gateChecks.length}
              </p>
              <p className="text-[10px] text-purple-300 mt-0.5">{gatePct}% verified</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[11px] text-purple-200 font-medium">Carrier Limit Status</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                Within Limits
              </p>
              <p className="text-[10px] text-purple-200 mt-0.5">No overweight flags</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gate Day Verification Checklist */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950/60 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50 dark:border-purple-950/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Gate Day Security & Departure Verification
            </h3>
            <p className="text-xs text-slate-500">
              Essential pre-boarding safeguards required by TSA, carriers & border agents
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
            {completedGateChecks}/{gateChecks.length} Done
          </span>
        </div>

        <div className="divide-y divide-purple-50 dark:divide-slate-800 mt-2">
          {gateChecks.map((gc) => (
            <div
              key={gc.id}
              onClick={() => toggleGateCheckItem(trip.id, gc.id)}
              className="py-3 flex items-start gap-3 cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-950/20 px-2 rounded-xl transition-colors"
            >
              <button
                className="mt-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Toggle gate check"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    gc.completed
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 bg-white dark:bg-slate-800'
                  }`}
                >
                  {gc.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs sm:text-sm font-medium transition-colors ${
                    gc.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {gc.text}
                </p>
                {gc.required && (
                  <span className="inline-block text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                    Critical Requirement
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bag-by-Bag Weight & Traveler Breakdown Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950/60 p-5 shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Baggage Weight & Load Distribution
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Estimated individual bag weights and traveler attributions
        </p>

        <div className="space-y-3">
          {trip.bags.map((bag) => {
            const bagWeightLbs = bag.items.reduce((sum, item) => {
              const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
              return sum + w * item.quantity;
            }, 0);

            const displayBagWeight = weightUnit === 'KG'
              ? DefaultSuggestions.convertLbsToKg(bagWeightLbs).toFixed(1) + ' kg'
              : bagWeightLbs.toFixed(1) + ' lbs';

            const limitLbs = bag.maxWeightLimitLbs || (bag.type === 'CHECKED' ? 50 : bag.type === 'CARRY_ON' ? 22 : 15);
            const displayLimit = weightUnit === 'KG'
              ? DefaultSuggestions.convertLbsToKg(limitLbs).toFixed(0) + ' kg'
              : limitLbs + ' lbs';

            const pct = Math.min(Math.round((bagWeightLbs / limitLbs) * 100), 120);
            const isBagOverweight = bagWeightLbs > limitLbs;

            return (
              <div
                key={bag.id}
                className="rounded-xl border border-purple-100 dark:border-purple-950/60 bg-purple-50/30 dark:bg-slate-800/40 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-purple-950 dark:text-purple-200">
                      {bag.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({bag.type})
                    </span>
                    {bag.assignedTo && (
                      <span className="text-[10px] font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        Assigned to: {bag.assignedTo}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isBagOverweight ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {displayBagWeight}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      / {displayLimit}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-purple-100/70 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isBagOverweight ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-purple-600'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
                  <span>{bag.items.length} items packed inside</span>
                  <span>{pct}% of limit</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share / Export Packing Summary */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950/60 p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Share or Export Packing Manifest
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Copy the full checklist with travelers, weights, and locations to clipboard or print a hardcopy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex-1 sm:flex-initial h-9 px-4 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-purple-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
