import React from 'react';
import { PageLayout } from './PageLayout';
import { ShieldCheck, Scale, CreditCard, RefreshCw, AlertCircle, Mail, Ban, Clock } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <PageLayout pathname="/terms">
      {/* Date */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Clock className="w-4 h-4 text-purple-600" />
        <span>Last updated: October 24, 2026</span>
      </div>

      {/* Introduction */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          1. Agreement to Terms
        </h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of <strong>GateReady</strong> (accessible at <strong>gateready.ca</strong>), provided by <strong>CSM App Holdings</strong> ("we", "us", or "our"). By accessing or using GateReady, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the service.
        </p>
      </section>

      {/* Purpose & Limitations */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-600" />
          <span>2. Trip Planning & Baggage Fee Estimates</span>
        </h2>
        <p>
          GateReady is provided strictly as a personal packing and planning assistant. Baggage fees, size dimensions, and weight limitations displayed within the app are <strong>estimates calculated from published airline fee tables</strong>.
        </p>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Important Airline Verification Notice</span>
          </div>
          <p>
            Airlines reserve the right to alter luggage allowances, fee tiers, currency conversions, and oversize/overweight penalty thresholds at any time. You are solely responsible for verifying baggage rules directly with your airline prior to travel. GateReady is not responsible for baggage fees, denied boarding, or confiscated items.
          </p>
        </div>
      </section>

      {/* Plans & Billing */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <span>3. Plans, Subscriptions & Free Trial</span>
        </h2>
        <p>
          GateReady offers both a free tier and optional paid recurring subscriptions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white">Free Plan ($0)</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">1 traveler, 2 bags total (max 1 checked), 1 active trip. No credit card required.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
            <div className="font-bold text-purple-900 dark:text-purple-200">Silver Plan ($1.99/mo or $19.99/yr)</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">1 traveler, 2 active trips, unlimited bags, tare deduction, QR emergency bag tag, terminal maps.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
            <div className="font-bold text-purple-900 dark:text-purple-200">Gold Plan ($3.99/mo or $29.99/yr) — Most Popular</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">2 travelers, unlimited active trips, unlimited bags & scales, multi-device sync, PDF export & print manifests.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
            <div className="font-bold text-purple-900 dark:text-purple-200">Platinum Plan ($4.99/mo or $39.99/yr)</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Unlimited travelers, unlimited devices, unlimited active trips, unlimited bags & scales, priority fee updates.</div>
          </div>
        </div>

        <div className="space-y-2 pt-2 text-xs">
          <p>
            <strong>7-Day Free Platinum Trial:</strong> Free account creation automatically activates a 7-day full Platinum trial. No credit card is required. At the end of 7 days, your account seamlessly drops back to the Free plan. You will never be billed automatically.
          </p>
          <p>
            <strong>Merchant of Record & Payments:</strong> All payment transactions and subscriptions are securely processed by <strong>Lemon Squeezy</strong> as our Merchant of Record.
          </p>
          <p>
            <strong>14-Day Money-Back Guarantee:</strong> Paid plans include a full 14-day money-back guarantee. If you are unsatisfied for any reason within 14 days of initial purchase, contact csmappholdings@gmail.com for a full refund.
          </p>
          <p>
            <strong>Cancellation:</strong> You may cancel recurring billing at any time via your account settings or Lemon Squeezy receipt link. Upon cancellation, your paid plan benefits remain active until the end of your current billing period.
          </p>
        </div>
      </section>

      {/* Referrals */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-600" />
          <span>4. Referral Program Terms</span>
        </h2>
        <p>
          When you invite a friend using your unique referral link:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Your friend receives 1 free month of the Platinum Plan (a $4.99 value) upon account creation.</li>
          <li>You receive 1 free month of the Platinum Plan credited to your account automatically upon their signup.</li>
          <li>Referral credits require no purchase or card entry by either party.</li>
          <li>We reserve the right to void referral credits earned through fraudulent accounts, bots, or self-referrals.</li>
        </ul>
      </section>

      {/* Acceptable Use */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Ban className="w-5 h-5 text-red-500" />
          <span>5. Acceptable Use</span>
        </h2>
        <p>
          You agree not to misuse GateReady. Prohibited actions include:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Scraping, crawling, or extracting luggage database data or fee matrices through automated means.</li>
          <li>Attempting to bypass account limits, trial periods, or authentication security.</li>
          <li>Reverse engineering or copying application source code or proprietary design assets.</li>
          <li>Using the service for unlawful or fraudulent activities.</li>
        </ul>
      </section>

      {/* Limitation of Liability */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <span>6. Disclaimer & Limitation of Liability</span>
        </h2>
        <p className="text-xs">
          GateReady is provided on an "as is" and "as available" basis without warranties of any kind. CSM App Holdings disclaims all warranties, express or implied. In no event shall CSM App Holdings be liable for direct, indirect, incidental, punitive, or consequential damages resulting from baggage fees, baggage loss, missed flights, security confiscations, or travel disruptions.
        </p>
      </section>

      {/* Changes & Contact */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          7. Changes to Terms & Contact
        </h2>
        <p>
          We may revise these Terms periodically. Continued use of GateReady following notice of changes constitutes acceptance of the new terms.
        </p>
        <p className="text-xs">
          Questions regarding these Terms? Contact us at:
        </p>
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
          <Mail className="w-4 h-4 text-purple-600" />
          <a href="mailto:csmappholdings@gmail.com" className="hover:underline">csmappholdings@gmail.com</a>
        </div>
      </section>
    </PageLayout>
  );
};
