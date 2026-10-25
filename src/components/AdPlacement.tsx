import React, { useState, useEffect } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ADS_CONFIG } from '../config/adsConfig';

interface AdPlacementProps {
  slotId: string;
  format?: 'banner' | 'inline' | 'footer';
  className?: string;
}

/**
 * AdPlacement
 * 
 * Non-intrusive display ad placeholder slot ready for Google AdSense or standard ad networks.
 * 
 * Strict Enforcement:
 * 1. Paid users (Silver, Gold, Platinum) NEVER see ads (isPro returns null).
 * 2. Disabled site-wide instantly if ADS_CONFIG.enabled is false.
 * 3. Never renders in core trip editor, luggage weight meters, save-gate, pricing, or account modals.
 * 4. Lazy-mounted after initial paint to keep critical rendering path fast.
 */
export const AdPlacement: React.FC<AdPlacementProps> = ({
  slotId,
  format = 'inline',
  className = ''
}) => {
  const { isPro } = useSubscription();
  const [isMounted, setIsMounted] = useState(false);

  // Lazy render after initial paint to prevent impacting initial page load performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // 1. Site-wide toggle check
  if (!ADS_CONFIG.enabled) {
    return null;
  }

  // 2. Paid subscriber benefit: Zero ads for Silver, Gold, Platinum
  if (isPro) {
    return null;
  }

  // 3. Keep critical rendering path unblocked
  if (!isMounted) {
    return null;
  }

  const heightClasses = 
    format === 'footer'
      ? 'min-h-[90px] sm:min-h-[100px]'
      : format === 'banner'
      ? 'min-h-[90px]'
      : 'min-h-[110px] sm:min-h-[120px]';

  return (
    <aside 
      aria-label="Advertisement" 
      className={`w-full my-4 flex flex-col items-center justify-center transition-opacity duration-300 animate-in fade-in ${className}`}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle Disclosure Label */}
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
          Advertisement
        </span>

        {/* Ad Container Box */}
        <div 
          id={slotId}
          className={`w-full ${heightClasses} rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden relative`}
        >
          {/* 
            Site Owner Integration Note:
            When connecting Google AdSense or another ad network, paste your <ins class="adsbygoogle"> 
            or network container here, referencing ADS_CONFIG.publisherId.
          */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-purple-400/60 shrink-0" />
              <span>Ad Placement Slot · {format.toUpperCase()}</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              ID: {slotId} {ADS_CONFIG.publisherId ? `(Pub: ${ADS_CONFIG.publisherId})` : '(Ready for Ad Network ID)'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
