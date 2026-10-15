import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { usePacking } from '../context/PackingContext';
import { Crown, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const TrialNudgeBanner: React.FC = () => {
  const { isTrialActive, isTrialExpiringSoon, trialTimeLeftText, openPaywall } = useSubscription();
  const { currentTrip } = usePacking();
  const [dismissed, setDismissed] = useState(false);

  if (!isTrialActive || !isTrialExpiringSoon || dismissed) {
    return null;
  }

  const travelerCount = currentTrip?.familyMembers?.length || 1;
  const recommendedTier = travelerCount > 1 ? 'GOLD' : 'SILVER';
  const tierCost = recommendedTier === 'GOLD' ? '$3.99/mo' : '$1.99/mo';

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white px-4 py-2.5 shadow-md relative z-30 transition-all">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center shrink-0 text-amber-200">
            <Crown className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-white flex items-center gap-1.5 flex-wrap">
              <span>⏳ 7-Day Platinum Trial Ends Soon:</span>
              <span className="bg-black/30 px-2 py-0.2 rounded-md font-mono text-[11px] text-amber-200">
                {trialTimeLeftText}
              </span>
            </p>
            <p className="text-[11px] text-white/90 leading-tight">
              {recommendedTier === 'GOLD'
                ? `You have multiple travelers saved. Keep multi-traveler sync & unlimited trips with Gold (${tierCost}).`
                : `Solo traveler? Lock in Silver for just ${tierCost} to keep unlimited bags & baggage scale tools.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => openPaywall(`Your Platinum trial ends soon. Lock in ${recommendedTier === 'GOLD' ? 'Gold ($3.99/mo)' : 'Silver ($1.99/mo)'} to keep full access.`)}
            className="h-8 px-3.5 rounded-xl bg-white hover:bg-amber-50 text-purple-950 font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span>Lock In {recommendedTier === 'GOLD' ? 'Gold' : 'Silver'} ({tierCost})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-lg text-white/80 hover:text-white hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
