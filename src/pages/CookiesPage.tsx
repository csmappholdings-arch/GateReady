import React from 'react';
import { PageLayout } from './PageLayout';
import { Database, Cookie, ShieldCheck, Trash2, Mail, Clock } from 'lucide-react';

export const CookiesPage: React.FC = () => {
  return (
    <PageLayout pathname="/cookies">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Clock className="w-4 h-4 text-purple-600" />
        <span>Last updated: October 24, 2026</span>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          How GateReady Uses Cookies & Local Storage
        </h2>
        <p>
          At GateReady (operated by <strong>CSM App Holdings</strong>), we prioritize data minimalism. We do not use third-party tracking cookies to profile your browsing across other websites. This page explains what storage mechanisms we use and why.
        </p>
      </section>

      {/* Browser Local Storage */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-600" />
          <span>1. Browser Local Storage (Essential)</span>
        </h2>
        <p>
          GateReady uses your browser's local web storage (localStorage) to allow full offline and guest packing capability without requiring an upfront account:
        </p>
        <div className="space-y-2.5 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-white font-mono">gateready_trips_data_v2</div>
            <p className="text-slate-600 dark:text-slate-400">
              Stores your active trip destinations, airlines, luggage tare weights, and packed item lists directly inside your browser. This data never leaves your device unless you create an account to sync it.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-white font-mono">gateready_preferences</div>
            <p className="text-slate-600 dark:text-slate-400">
              Stores your interface preferences such as pounds (lbs) vs kilograms (kg), Fahrenheit (°F) vs Celsius (°C), and dismissal states of informative notices.
            </p>
          </div>
        </div>
      </section>

      {/* Cookies & Tokens */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Cookie className="w-5 h-5 text-purple-600" />
          <span>2. Authentication & Payment Tokens</span>
        </h2>
        <ul className="list-disc list-inside space-y-2 text-xs">
          <li>
            <strong>Firebase Authentication:</strong> If you sign up or log in, Firebase stores a secure JSON Web Token (JWT) in browser session storage or essential local storage to maintain your authenticated session.
          </li>
          <li>
            <strong>Lemon Squeezy Checkout:</strong> When purchasing a subscription, Lemon Squeezy sets secure, encrypted cookies necessary to handle the payment transaction, verify fraud prevention, and complete order processing.
          </li>
        </ul>
      </section>

      {/* Advertising Notice */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <span>3. Advertising & Analytics Cookies</span>
        </h2>
        <p className="text-xs">
          GateReady does not currently deploy behavioral advertising tracking networks. If display advertising or sponsored travel partner placements are introduced in the future to support the free tier, this policy will be promptly updated to detail any advertising cookies, network partners, and consent options.
        </p>
      </section>

      {/* Managing & Clearing */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          <span>4. How to Clear Local Storage</span>
        </h2>
        <p className="text-xs">
          You can delete all stored trips and preferences at any time by deleting individual trips within the app settings, or by clearing your browser's site data for <code>gateready.ca</code> via your browser settings (e.g. Chrome Settings &gt; Privacy & Security &gt; Site Data).
        </p>
      </section>

      {/* Contact */}
      <section className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
        <p>Questions about our cookies or storage practices? Contact:</p>
        <div className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400">
          <Mail className="w-4 h-4" />
          <a href="mailto:csmappholdings@gmail.com" className="hover:underline">csmappholdings@gmail.com</a>
        </div>
      </section>
    </PageLayout>
  );
};
