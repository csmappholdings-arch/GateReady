import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Crown, X } from 'lucide-react';

export const TrialNudgeBanner: React.FC = () => {
  const { 
    isTrialActive, 
    isTrialExpiringSoon, 
    trialTimeLeftText, 
    isReferralPlatinumActive,
    isReferralExpiringSoon,
    referralTimeLeftText
  } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  const showReferralNudge = isReferralPlatinumActive && isReferralExpiringSoon;
  const showTrialNudge = isTrialActive && isTrialExpiringSoon;

  if ((!showReferralNudge && !showTrialNudge) || dismissed) {
    return null;
  }

  const countdownText = showReferralNudge ? referralTimeLeftText : trialTimeLeftText;
  const bannerTitle = showReferralNudge ? '⏳ 1-Month Referral Platinum Ends Soon:' : '⏳ 7-Day Platinum Trial Ends Soon:';

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white px-4 py-2.5 shadow-md relative z-30 transition-all">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center shrink-0 text-amber-200">
            <Crown className="w-4 h-4 fill-amber-300 text-amber-300" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-white flex items-center gap-1.5 flex-wrap">
              <span>{bannerTitle}</span>
              <span className="bg-black/30 px-2 py-0.2 rounded-md font-mono text-[11px] text-amber-200">
                {countdownText}
              </span>
            </p>
            <p className="text-[11px] text-white/90 leading-tight">
              {showReferralNudge
                ? '1-Month Referral Platinum active — returns to Free automatically upon expiry. No card, no charge.'
                : 'Returns to Free automatically on day 7. No card, no charge.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
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
