import React from 'react';
import { PageLayout } from './PageLayout';
import { ShieldCheck, RefreshCw, Mail, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RefundsPage: React.FC = () => {
  return (
    <PageLayout pathname="/refunds">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Clock className="w-4 h-4 text-purple-600" />
        <span>Last updated: October 24, 2026</span>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          14-Day Money-Back Guarantee
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          We want you to feel completely confident planning your trips with GateReady. That is why every paid subscription (Silver, Gold, and Platinum) is covered by our full <strong>14-day money-back guarantee</strong>.
        </p>
      </section>

      {/* How Guarantee Works */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>How Our Refund Policy Works</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>14-Day Window</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              If you purchase a monthly or annual plan and decide within 14 days that GateReady is not right for you, we will issue a 100% refund without hassle.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Processed by Lemon Squeezy</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Refunds are processed back to your original payment card via our secure Merchant of Record, Lemon Squeezy, typically arriving in 3 to 5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* How to Request */}
      <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          How to Request a Refund
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          To request a refund under the 14-day guarantee, simply send an email to:
        </p>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400 text-sm">
          <Mail className="w-4 h-4" />
          <a href="mailto:csmappholdings@gmail.com" className="hover:underline">csmappholdings@gmail.com</a>
        </div>
        <p className="text-xs text-slate-500">
          Please include your <strong>account email address</strong> or the <strong>order number</strong> found in your Lemon Squeezy purchase receipt.
        </p>
      </section>

      {/* Subscription Cancellation */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-600" />
          <span>Subscription Cancellation</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          You may cancel your recurring subscription at any time. When you cancel, you will not be billed for subsequent billing cycles. Your paid tier features remain active through the final day of your already-paid billing period.
        </p>
      </section>

      {/* 7-Day Trial Note */}
      <section className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>7-Day Free Platinum Trial Reminder</span>
        </div>
        <p>
          The 7-day Platinum trial automatically granted upon free account creation does not require a credit card. It will never charge you or convert into a paid subscription automatically.
        </p>
      </section>
    </PageLayout>
  );
};
