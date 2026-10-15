import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, 
  FileText, 
  Mail, 
  Gift, 
  Crown, 
  X, 
  Sparkles,
  Plane,
  Heart,
  ExternalLink
} from 'lucide-react';

interface AppFooterProps {
  onOpenPricing: () => void;
  onOpenReferral: () => void;
  onOpenAirlineGuides?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onOpenPricing,
  onOpenReferral,
  onOpenAirlineGuides
}) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  return (
    <footer className="w-full mt-auto border-t border-purple-100 dark:border-purple-950/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 xl:px-10 text-xs text-slate-500 dark:text-slate-400">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Mission */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm text-slate-900 dark:text-white">
              Gate<span className="text-purple-600 dark:text-purple-400">Ready</span>.ca
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded">
              2026
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Smart baggage weight estimation, TSA 3-1-1 compliance, and 42+ airline allowance guides.
          </p>
        </div>

        {/* Quick Footer Navigation Links */}
        <div className="flex items-center gap-4 flex-wrap justify-center font-semibold">
          <button
            type="button"
            onClick={onOpenPricing}
            className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Pricing ($1.99/mo)</span>
          </button>

          <button
            type="button"
            onClick={onOpenReferral}
            className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Gift className="w-3 h-3 text-fuchsia-500" />
            <span>Refer a Friend (Get 1 Mo Free)</span>
          </button>

          {onOpenAirlineGuides && (
            <button
              type="button"
              onClick={onOpenAirlineGuides}
              className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
            >
              Airline Guides
            </button>
          )}

          <button
            type="button"
            onClick={() => setModalType('contact')}
            className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
          >
            Contact
          </button>

          <button
            type="button"
            onClick={() => setModalType('privacy')}
            className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
          >
            Privacy
          </button>

          <button
            type="button"
            onClick={() => setModalType('terms')}
            className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
          >
            Terms
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 GateReady.ca · All rights reserved. Not affiliated with TSA, IATA, or airlines.</span>
        <span>Made for stress-free travel & no excess baggage fees.</span>
      </div>

      {/* Info Modals for Privacy, Terms, and Contact */}
      {modalType && createPortal(
        <div 
          className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer min-h-screen"
          onClick={() => setModalType(null)}
        >
          <div 
            className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 p-6 space-y-4 text-left cursor-default animate-in zoom-in-95 duration-150 relative z-[100000]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/60">
              <div className="flex items-center gap-2">
                {modalType === 'privacy' && <ShieldCheck className="w-5 h-5 text-purple-600" />}
                {modalType === 'terms' && <FileText className="w-5 h-5 text-purple-600" />}
                {modalType === 'contact' && <Mail className="w-5 h-5 text-purple-600" />}
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {modalType === 'privacy' && 'Privacy Policy'}
                  {modalType === 'terms' && 'Terms of Service'}
                  {modalType === 'contact' && 'Contact Support & Feedback'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-1">
              {modalType === 'privacy' && (
                <>
                  <p><strong>Your Privacy is Priority #1:</strong> GateReady.ca does not sell, rent, or monetize your personal travel manifests or baggage lists.</p>
                  <p><strong>Emergency QR Tags:</strong> When you generate a QR tag for your luggage, it contains direct traveler contact information (e.g. phone/WhatsApp) and purposefully omits your home street address to protect your vacant residence while traveling.</p>
                  <p><strong>Local & Cloud Storage:</strong> Trips and packing lists are stored securely in your browser&apos;s local storage and synced via Google Firebase Firestore when signed in.</p>
                  <p><strong>Payments:</strong> All subscriptions are processed securely by Lemon Squeezy (our merchant of record) with 256-bit SSL encryption. We never see or store your full credit card number.</p>
                </>
              )}

              {modalType === 'terms' && (
                <>
                  <p><strong>Service Overview:</strong> GateReady provides baggage weight estimations, packing checklists, and airline allowance guidance. Airline dimensions and baggage policies may vary by ticket class, codeshare carrier, or airport agent discretion.</p>
                  <p><strong>Subscriptions & Guarantee:</strong> Paid plans (Silver $1.99/mo, Gold $3.99/mo, Platinum $4.99/mo) can be cancelled at any time through the customer billing portal. All paid plans include a 14-day money-back guarantee.</p>
                  <p><strong>Limitation of Liability:</strong> Travelers are responsible for adhering to all carrier baggage limits and TSA security directives. Estimations are provided as guidance to help prevent excess fees.</p>
                </>
              )}

              {modalType === 'contact' && (
                <>
                  <p>Have a question, missing an airline, or need help with your GateReady account?</p>
                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">Email Support:</p>
                    <p className="text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
                      support@gateready.ca
                    </p>
                    <p className="text-[11px] text-slate-500">We respond within 24 hours (Monday to Sunday).</p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    If you encountered an overweight bag surcharge or found an airline rule change, let us know and we will update our 2026 database immediately.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-purple-100 dark:border-purple-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </footer>
  );
};
