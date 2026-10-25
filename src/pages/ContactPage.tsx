import React from 'react';
import { PageLayout } from './PageLayout';
import { Mail, Clock, HelpCircle, Building2, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <PageLayout pathname="/contact">
      {/* Intro */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          How to Contact GateReady Support
        </h2>
        <p>
          GateReady is developed and supported directly by the engineering and product team at <strong>CSM App Holdings</strong>. We are committed to making sure your packing lists, luggage calculations, and account features work reliably.
        </p>
      </section>

      {/* Primary Contact Card */}
      <section className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Sole Official Support Channel
            </div>
            <a 
              href="mailto:csmappholdings@gmail.com" 
              className="text-lg sm:text-xl font-black text-slate-900 dark:text-white hover:text-purple-600 transition-colors underline decoration-purple-400/50 underline-offset-4"
            >
              csmappholdings@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Clock className="w-4 h-4 text-purple-600 shrink-0" />
          <span><strong>Expected response time:</strong> We aim to reply to all inquiries within a few business days. (We do not offer 24/7 live chat or phone support).</span>
        </div>
      </section>

      {/* What to include */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          What to Include When Writing to Us
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          To help us resolve your issue or answer your question as quickly as possible, please include:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Account & Device Details</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your account email (if registered), whether you are on mobile or desktop, and your browser (Chrome, Safari, Firefox).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Trip & Airline Involved</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The airline selected (e.g. Air Canada, WestJet, Delta), baggage type, and a short description of any fee or weight discrepancy.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Lemon Squeezy Order Number</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              If requesting billing assistance or a 14-day refund, include the order number from your email receipt.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Screenshots or Error Text</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              A quick screenshot or paste of any error message helps us diagnose and fix issues right away.
            </p>
          </div>
        </div>
      </section>

      {/* Company Record */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-600" />
          <span>Company Information</span>
        </h2>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div><strong>Operating Company:</strong> CSM App Holdings</div>
          <div><strong>Official Website:</strong> gateready.ca</div>
          <div><strong>Support Email:</strong> csmappholdings@gmail.com</div>
          <div><strong>Business Address:</strong> [TO BE PROVIDED BY OWNER]</div>
          <div><strong>Corporate Registration:</strong> [TO BE PROVIDED BY OWNER]</div>
        </div>
      </section>

      {/* Quick Navigation Links */}
      <section className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Related Legal & Product Information</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <a href="/about" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 inline-flex items-center gap-1 font-medium">
            <span>About GateReady</span>
            <ArrowRight className="w-3 h-3" />
          </a>
          <a href="/privacy" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 inline-flex items-center gap-1 font-medium">
            <span>Privacy Policy</span>
            <ArrowRight className="w-3 h-3" />
          </a>
          <a href="/terms" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 inline-flex items-center gap-1 font-medium">
            <span>Terms of Service</span>
            <ArrowRight className="w-3 h-3" />
          </a>
          <a href="/faq" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 inline-flex items-center gap-1 font-medium">
            <span>Frequently Asked Questions</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </section>
    </PageLayout>
  );
};
