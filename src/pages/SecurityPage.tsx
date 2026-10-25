import React from 'react';
import { PageLayout } from './PageLayout';
import { ShieldCheck, Lock, CreditCard, Database, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <PageLayout pathname="/security">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Clock className="w-4 h-4 text-purple-600" />
        <span>Last updated: October 24, 2026</span>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Security & Data Safeguards at GateReady
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          At GateReady (operated by <strong>CSM App Holdings</strong>), we design our systems around data minimalism, client-side isolation, and industry-standard security foundations.
        </p>
      </section>

      {/* 4 Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Database className="w-5 h-5 text-purple-600" />
            <span>Local Browser Isolation for Guests</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            When you use GateReady without creating an account, your packing lists and luggage calculations remain exclusively on your device in browser localStorage. No database records or logs are created on external servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Lock className="w-5 h-5 text-purple-600" />
            <span>Firebase Authentication Security</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Registered accounts utilize Firebase Authentication with mandatory email verification. All authentication sessions use short-lived, cryptographically signed JSON Web Tokens (JWT) transmitted strictly over encrypted HTTPS/TLS channels.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <span>PCI-DSS Compliant Payments</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All subscription payments are handled by <strong>Lemon Squeezy</strong> as our Merchant of Record. GateReady never receives, logs, or stores credit card numbers, CVVs, or bank details on our servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <span>Zero Data Brokerage</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We do not sell, rent, or monetize personal traveler data, trip itineraries, or packing contents to data brokers, advertising aggregators, or third parties.
          </p>
        </div>
      </section>

      {/* Reporting Vulnerabilities */}
      <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Reporting Security Vulnerabilities
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          If you believe you have discovered a vulnerability, security bug, or data exposure within GateReady, please contact our security team immediately at:
        </p>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400 text-sm">
          <Mail className="w-4 h-4" />
          <a href="mailto:csmappholdings@gmail.com" className="hover:underline">csmappholdings@gmail.com</a>
        </div>
        <p className="text-xs text-slate-500">
          We appreciate responsible disclosure and aim to acknowledge all security reports promptly.
        </p>
      </section>

      {/* Placeholders */}
      <section className="pt-2 text-[11px] text-slate-400 space-y-1">
        <div>Security Lead / DPO: [TO BE PROVIDED BY OWNER]</div>
        <div>Security Compliance Certifications: [TO BE PROVIDED BY OWNER]</div>
      </section>
    </PageLayout>
  );
};
