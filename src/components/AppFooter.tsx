import React from 'react';
import { 
  Gift, 
  Crown
} from 'lucide-react';

interface AppFooterProps {
  onOpenPricing?: () => void;
  onOpenReferral?: () => void;
  onOpenAirlineGuides?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onOpenPricing,
  onOpenReferral,
  onOpenAirlineGuides
}) => {
  return (
    <footer className="w-full mt-auto border-t border-purple-100 dark:border-purple-950/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 xl:px-10 text-xs text-slate-500 dark:text-slate-400">
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        
        {/* Top: Brand info & Mission */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-purple-100/70 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <a href="/" className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <span className="font-black text-sm text-slate-900 dark:text-white">
                Gate<span className="text-purple-600 dark:text-purple-400">Ready</span>.ca
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded">
                2026
              </span>
            </a>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Calibrated luggage tare weight meters, TSA 3-1-1 compliance, and 42+ airline baggage allowance guides.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenReferral && (
              <button
                type="button"
                onClick={onOpenReferral}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs hover:from-purple-600 hover:to-indigo-700 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Gift className="w-3.5 h-3.5 text-amber-200" />
                <span>Refer a Friend (Get 1 Mo Free)</span>
              </button>
            )}

            {onOpenPricing ? (
              <button
                type="button"
                onClick={onOpenPricing}
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Plans from $1.99/mo</span>
              </button>
            ) : (
              <a
                href="/pricing"
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Plans from $1.99/mo</span>
              </a>
            )}
          </div>
        </div>

        {/* Middle: Complete Site Directory Links (All Pages EXCEPT /reviews) */}
        <div className="flex items-center justify-center gap-x-6 gap-y-2.5 flex-wrap font-semibold text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
          <a href="/about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            About
          </a>
          <a href="/how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            How It Works
          </a>
          <a href="/pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Pricing
          </a>
          <a href="/faq" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            FAQ
          </a>
          <a href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Contact
          </a>
          <a href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Terms of Service
          </a>
          <a href="/cookies" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Cookies
          </a>
          <a href="/refunds" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Refunds
          </a>
          <a href="/security" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Security
          </a>
          <a href="/changelog" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Changelog
          </a>
          <a href="/airlines" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Airline Guides (42)
          </a>
          <a href="/baggage-fee-calculator" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Fee Calculator
          </a>
          <a href="/tare-weight" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Tare Weight
          </a>
          <a href="/entry-requirements" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Entry Requirements
          </a>
          {onOpenAirlineGuides && (
            <button
              type="button"
              onClick={onOpenAirlineGuides}
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer text-purple-600 dark:text-purple-400 font-bold"
            >
              Quick Intel Modal
            </button>
          )}
        </div>

        {/* Bottom Copyright line: © CSM App Holdings */}
        <div className="pt-2 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-900">
          <span>© CSM App Holdings · GateReady (gateready.ca) · All rights reserved.</span>
          <span>Not affiliated with TSA, IATA, or airlines. Baggage fees are estimates from published tables.</span>
        </div>
      </div>
    </footer>
  );
};
