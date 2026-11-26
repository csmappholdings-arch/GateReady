import React from 'react';
import { PageLayout } from './PageLayout';
import {
  ShieldCheck,
  Scale,
  CreditCard,
  RefreshCw,
  AlertCircle,
  Mail,
  Ban,
  Clock,
  HardDrive,
  QrCode
} from 'lucide-react';
import { PLAN_DEFINITIONS, TRIAL_TERMS_EXACT, TRIAL_DROP_NOTE } from '../data/planEntitlements';

export const TermsPage: React.FC = () => {
  return (
    <PageLayout pathname="/terms">
      {/* Date */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>Last updated: November 26, 2026</span>
        </div>
        <span className="font-semibold text-purple-600 dark:text-purple-400">CSM App Holdings</span>
      </div>

      {/* 1. Agreement to Terms */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          1. Agreement to Terms
        </h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of <strong>GateReady</strong> (accessible at <strong>gateready.ca</strong>), provided by <strong>CSM App Holdings</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using GateReady, you agree to be bound by these Terms. If you disagree with any part of these Terms, you must discontinue use of the service.
        </p>
      </section>

      {/* 2. Planning Estimates vs Official Carrier Authority */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-600" />
          <span>2. Planning Estimates &amp; Official Carrier Authority</span>
        </h2>
        <p>
          GateReady is provided strictly as a self-service personal packing, weight modeling, and travel-readiness planning tool. Baggage fees, carry-on sizer dimensions, weight thresholds, tare weight deductions, passport buffer notices, and carry-on liquids rule checks displayed within GateReady are <strong>planning estimates derived from published airline fee tables and public airport security guidance</strong>.
        </p>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Carrier Tariff &amp; Security Authority Notice</span>
          </div>
          <p className="leading-relaxed">
            Airlines and transport operators frequently modify luggage allowances, dynamic fare-family fees, route and seasonal pricing, codeshare operating-carrier rules, currency conversions, and overweight or oversize surcharges without notice. Likewise, airport security officers (including TSA in the United States, CATSA in Canada, and international screening authorities) exercise sole authority over screening clearance. GateReady does not guarantee carrier fee totals, airport check-in acceptance, or security screening clearance. You remain solely responsible for verifying current rules directly with your operating carrier and official screening authorities prior to departure.
          </p>
        </div>
      </section>

      {/* 3. Plans, Subscriptions, Free Trial, Refunds & Cancellation */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <span>3. Plans, Subscriptions, 7-Day Free Trial &amp; Refunds</span>
        </h2>
        <p>
          GateReady offers a free starter tier alongside optional paid recurring subscriptions billed on monthly or annual intervals:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white">Free Starter ({PLAN_DEFINITIONS.FREE.formattedMonthly})</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{PLAN_DEFINITIONS.FREE.features.join(', ')}. No credit card required.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
            <div className="font-bold text-purple-900 dark:text-purple-200">Silver ({PLAN_DEFINITIONS.SILVER.formattedMonthly}/mo or {PLAN_DEFINITIONS.SILVER.formattedYearly}/yr)</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{PLAN_DEFINITIONS.SILVER.features.join(', ')}.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <div className="font-bold text-amber-900 dark:text-amber-200">Gold ({PLAN_DEFINITIONS.GOLD.formattedMonthly}/mo or {PLAN_DEFINITIONS.GOLD.formattedYearly}/yr) — Most Popular</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{PLAN_DEFINITIONS.GOLD.features.join(', ')}.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
            <div className="font-bold text-indigo-900 dark:text-indigo-200">Platinum ({PLAN_DEFINITIONS.PLATINUM.formattedMonthly}/mo or {PLAN_DEFINITIONS.PLATINUM.formattedYearly}/yr)</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{PLAN_DEFINITIONS.PLATINUM.features.join(', ')}.</div>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 text-xs leading-relaxed">
          <p>
            <strong>7-Day Free Platinum Trial &amp; Automatic Revert to Free:</strong> {TRIAL_TERMS_EXACT} Because no payment card is collected to begin a free account or trial, you will never be charged automatically at trial end. {TRIAL_DROP_NOTE} All trips, bags, and packing checklists you created remain stored in your account.
          </p>
          <p>
            <strong>Merchant of Record &amp; Recurring Billing:</strong> All paid subscriptions (Silver, Gold, and Platinum — monthly or annual) are processed by <strong>Lemon Squeezy</strong> as our Merchant of Record. Paid subscriptions renew automatically at the selected billing interval until canceled. GateReady does not receive or store your full payment card numbers.
          </p>
          <p>
            <strong>14-Day Money-Back Guarantee:</strong> Every paid Silver, Gold, or Platinum checkout is covered by a full 14-day money-back guarantee. If you are unsatisfied for any reason within 14 days of purchase, email{' '}
            <a href="mailto:csmappholdings@gmail.com" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              csmappholdings@gmail.com
            </a>{' '}
            with your account email address or Lemon Squeezy order number for a 100% refund processed via Lemon Squeezy (typically within 3 to 5 business days). See our <a href="/refunds" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Refund Policy</a> for details.
          </p>
          <p>
            <strong>Cancellation:</strong> You may cancel recurring renewals at any time from your Account menu inside GateReady or via the subscription management link in your Lemon Squeezy email receipt. Upon cancellation, renewals stop immediately and your paid plan benefits remain active through the end of your current paid billing period.
          </p>
        </div>
      </section>

      {/* 4. Guest Storage & Registered Account Sync */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-purple-600" />
          <span>4. Guest Local Storage vs. Cloud Account Sync</span>
        </h2>
        <div className="space-y-2 text-xs leading-relaxed">
          <p>
            <strong>Guest Sessions (Browser localStorage Only):</strong> When you use GateReady without signing into an account, your trips, luggage selections, weights, and checklists are stored exclusively in your current browser&apos;s <code>localStorage</code> and are not backed up to cloud servers. Clearing browser storage or cookies, using private/incognito windows, or switching devices will permanently erase un-synced guest data. CSM App Holdings is not responsible for loss of guest-only browser data.
          </p>
          <p>
            <strong>Registered Accounts:</strong> Creating a free GateReady account enables personal cloud synchronization via Google Firebase Cloud Firestore across your signed-in devices. You may delete individual trips or permanently erase your account and all cloud records at any time under <strong>Settings &rarr; Preferences &rarr; Delete Account &amp; Erase Cloud Data</strong>, as further described in our <a href="/privacy" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </section>

      {/* 5. Privacy-Safe Emergency QR Recovery Tags */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <QrCode className="w-5 h-5 text-purple-600" />
          <span>5. Emergency QR Recovery Tags &amp; Feature Limitations</span>
        </h2>
        <div className="space-y-2 text-xs leading-relaxed">
          <p>
            GateReady allows eligible users to generate printable Emergency QR luggage tags encoding contact information (such as phone/WhatsApp or email) designed to omit your home street address to help protect your privacy while traveling. Free accounts may preview or face watermarked/tier restrictions, whereas Silver, Gold, and Platinum subscriptions unlock unwatermarked high-resolution printable tags.
          </p>
          <p>
            You are solely responsible for reviewing and verifying the accuracy and suitability of any contact information you choose to print and attach to physical luggage. GateReady and CSM App Holdings do not provide GPS tracking, baggage insurance, or guaranteed recovery of lost luggage.
          </p>
        </div>
      </section>

      {/* 6. Referrals */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-600" />
          <span>6. Referral Program Terms</span>
        </h2>
        <p className="text-xs">
          When you invite a friend using your unique referral link:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Your friend receives 1 free month of the Platinum Plan (a $4.99 value) upon verified account creation.</li>
          <li>You receive 1 free month of the Platinum Plan credited automatically to your account upon their qualifying signup.</li>
          <li>Referral credits require no purchase or payment card entry by either party.</li>
          <li>We reserve the right to void or revoke referral credits earned through duplicate accounts, automated bots, or self-referrals.</li>
        </ul>
      </section>

      {/* 7. Acceptable Use & Intellectual Property */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Ban className="w-5 h-5 text-red-500" />
          <span>7. Acceptable Use &amp; Intellectual Property</span>
        </h2>
        <p className="text-xs">
          All GateReady software, user interface designs, branding, and curated reference compilations remain the property of CSM App Holdings. You agree not to misuse GateReady, including:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Scraping, bulk-crawling, or systematically extracting luggage datasets or fee matrices through automated means beyond standard search indexing.</li>
          <li>Attempting to circumvent account tier limits, trial periods, or authentication safeguards.</li>
          <li>Reverse engineering, copying, or redistributing proprietary application code or visual assets.</li>
          <li>Using the service for unlawful, abusive, or fraudulent purposes.</li>
        </ul>
      </section>

      {/* 8. Disclaimer & Limitation of Liability */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <span>8. Disclaimer &amp; Limitation of Liability</span>
        </h2>
        <p className="text-xs leading-relaxed">
          GateReady is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, or non-infringement. To the maximum extent permitted by applicable law, CSM App Holdings shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages—including airline baggage fees, overweight/oversize surcharges, denied boarding, lost or damaged luggage, confiscated items at security screening, missed connections, or loss of locally stored browser data.
        </p>
      </section>

      {/* 9. Changes & Contact */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          9. Changes to Terms &amp; Contact
        </h2>
        <p className="text-xs leading-relaxed">
          We may update these Terms periodically and will revise the &ldquo;Last updated&rdquo; date above when changes take effect. Continued use of GateReady after updated Terms are posted constitutes acceptance of the revised Terms.
        </p>
        <p className="text-xs">
          Questions regarding these Terms? Contact CSM App Holdings at our sole official support address:
        </p>
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
          <Mail className="w-4 h-4 text-purple-600" />
          <a href="mailto:csmappholdings@gmail.com" className="hover:underline">csmappholdings@gmail.com</a>
        </div>
      </section>
    </PageLayout>
  );
};
