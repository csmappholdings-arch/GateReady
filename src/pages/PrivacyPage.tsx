import React from 'react';
import { PageLayout } from './PageLayout';
import { ShieldCheck, Lock, Database, UserCheck, AlertCircle, Mail } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <PageLayout pathname="/privacy">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>Last updated: October 25, 2026</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">CSM App Holdings</span>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            1. Overview & Data Philosophy
          </h2>
          <p>
            GateReady (<strong>gateready.ca</strong>), operated by CSM App Holdings, is built with a privacy-first approach. We believe travelers should be able to plan trips without handing over unnecessary personal details.
          </p>
          <p className="font-semibold text-emerald-700 dark:text-emerald-400">
            GateReady does not sell, rent, or monetize your personal data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            2. What Data We Collect & Where It Lives
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" />
                <span>Guest Visitors (Without an Account)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                When you use GateReady without creating an account, all of your trip data, baggage manifests, item weights, and departure schedules are stored exclusively in your own web browser using HTML5 <strong>localStorage</strong>. Guest trips are <strong>not</strong> backed up to the cloud or transmitted to any server. If you clear your browser cookies or storage, guest lists are permanently erased from your device.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>Registered Account Holders</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                When you create a free GateReady account to sync across devices, we collect your email address and display name. Your saved trips and packing lists are securely synced via Google Firebase Cloud Firestore. We enforce email verification on password accounts to protect account integrity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Paid Subscriptions & Payment Information</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                All payment processing, plan subscriptions, and invoices are handled directly by our Merchant of Record, <strong>Lemon Squeezy</strong>. GateReady and CSM App Holdings never receive, process, or store your credit card numbers or banking credentials.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            3. Local Storage & Session State
          </h2>
          <p>
            GateReady relies on local browser storage rather than tracking cookies to remember your travel preferences across visits:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Trip Manifests (gateready_trips_data_v2):</strong> Saves your active and archived packing lists locally on your device.</li>
            <li><strong>Measurement Unit (gateready_weight_unit):</strong> Remembers whether you prefer pounds (lbs) or kilograms (kg).</li>
            <li><strong>Temperature Unit (gateready_temp_unit_v1):</strong> Remembers Fahrenheit (°F) or Celsius (°C).</li>
            <li><strong>Dark Mode (gateready_dark_mode):</strong> Stores your visual theme preference.</li>
            <li><strong>Referral Attribution (gateready_referred_by_code):</strong> Stores an incoming referral code so friends receive their free Platinum month upon signup.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            4. Third-Party Service Providers
          </h2>
          <p>We work with trusted third-party cloud infrastructure providers:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Google Firebase:</strong> User authentication, secure token storage, and cloud list synchronization.</li>
            <li><strong>Lemon Squeezy:</strong> Merchant of Record, subscription billing, and tax compliance.</li>
          </ul>
          <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 text-xs">
            <span className="font-bold text-purple-900 dark:text-purple-200">Notice on Future Advertising: </span>
            <span className="text-purple-800 dark:text-purple-300">
              If display advertising is introduced in the future, this policy will be updated prior to deployment to disclose third-party advertising cookies, network tracking, and opt-out options.
            </span>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            5. User Rights & Data Deletion
          </h2>
          <p>You have complete control over your data:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Deleting Trips:</strong> You can delete any trip at any time directly in the app by selecting the trip settings menu and choosing &ldquo;Delete Trip&rdquo;. This removes the trip locally and from cloud storage.</li>
            <li><strong>Account Deletion:</strong> To completely erase your account and all associated data, email us at <a href="mailto:csmappholdings@gmail.com" className="text-purple-600 dark:text-purple-400 font-bold underline">csmappholdings@gmail.com</a> with your registered email address. We will permanently delete your account record within 5 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            6. Children&apos;s Privacy
          </h2>
          <p className="text-xs">
            GateReady is a general audience travel utility and is not directed at or intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            7. Contact for Privacy Questions
          </h2>
          <p className="text-xs">
            For questions about this Privacy Policy, your rights, or data handling, contact our designated privacy contact at:
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
            <div>Owner: CSM App Holdings</div>
            <div>Support & Privacy Contact: <a href="mailto:csmappholdings@gmail.com" className="text-purple-600 dark:text-purple-400 underline font-bold">csmappholdings@gmail.com</a></div>
            <div className="text-slate-400 text-[11px] font-sans">Business Address: [TO BE PROVIDED BY OWNER]</div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};
