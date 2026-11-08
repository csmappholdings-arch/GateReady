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

        {/* Middle: Consolidated Site Directory Links (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 pb-2 text-xs">
          {/* Column 1: Tools */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Tools
            </h3>
            <ul className="space-y-1.5 font-medium text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs">
              <li>
                <a href="/airlines" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Airline Baggage Guides
                </a>
              </li>
              <li>
                <a href="/baggage-fee-calculator" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Baggage Fee Calculator
                </a>
              </li>
              <li>
                <a href="/tare-weight" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Tare Weight Guide
                </a>
              </li>
              <li>
                <a href="/entry-requirements" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Entry Requirements
                </a>
              </li>
              <li>
                <a href="/requirements" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Requirements Hub
                </a>
              </li>
              {onOpenAirlineGuides && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAirlineGuides}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer text-purple-600 dark:text-purple-400 font-bold"
                  >
                    Quick Intel Modal
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Product
            </h3>
            <ul className="space-y-1.5 font-medium text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs">
              <li>
                <a href="/pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Pricing & Plans
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/changelog" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Support & Legal
            </h3>
            <ul className="space-y-1.5 font-medium text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs">
              <li>
                <a href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold text-purple-700 dark:text-purple-300">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookies" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Cookies & Storage
                </a>
              </li>
              <li>
                <a href="/refunds" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  14-Day Refunds
                </a>
              </li>
              <li>
                <a href="/security" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Security Safeguards
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright line: © CSM App Holdings */}
        <div className="pt-2 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-900">
          <span>© CSM App Holdings · GateReady (gateready.ca) · All rights reserved.</span>
          <span>Sole official support contact: <a href="mailto:csmappholdings@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">csmappholdings@gmail.com</a></span>
        </div>
      </div>
    </footer>
  );
};
