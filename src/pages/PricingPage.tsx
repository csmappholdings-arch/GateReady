import React, { useState } from 'react';
import { PageLayout } from './PageLayout';
import { Check, Sparkles, Shield, ArrowRight, HelpCircle, Mail, Zap } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <PageLayout pathname="/pricing">
      {/* Intro */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Transparent Plans for Every Type of Traveler
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Start 100% free with no credit card required. Free signup automatically unlocks a <strong>7-day full Platinum trial</strong>.
        </p>

        {/* Monthly / Yearly Switch */}
        <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-black">
              Save ~16%
            </span>
          </button>
        </div>
      </section>

      {/* 4 Pricing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* FREE */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Free</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-500">forever</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Basic luggage check for solo travelers taking a single trip.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 traveler profile</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2 bags max (1 checked + 1 carry-on)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 active trip list</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>42-airline baggage allowance lookup</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>TSA 3-1-1 liquids checking</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs text-center block transition-colors"
          >
            Start Free
          </a>
        </div>

        {/* SILVER */}
        <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Silver</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {billingCycle === 'monthly' ? '$1.99' : '$19.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/month' : '/year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              For frequent weekend travelers who need tare deduction.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Everything in Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Up to 4 bags total</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Suitcase tare weight deduction</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Emergency QR luggage recovery tag</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Terminal maps & cabin intel</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            className="w-full py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 font-bold text-xs text-center block transition-colors"
          >
            Upgrade to Silver
          </a>
        </div>

        {/* GOLD */}
        <div className="rounded-3xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Gold</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {billingCycle === 'monthly' ? '$3.99' : '$29.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/month' : '/year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              For families and multi-leg international journeys.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Everything in Silver</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Up to 8 bags total</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>3 active trips saved</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Printable PDF manifests</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Destination climate forecasts & norms</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            className="w-full py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 font-bold text-xs text-center block transition-colors"
          >
            Upgrade to Gold
          </a>
        </div>

        {/* PLATINUM */}
        <div className="rounded-3xl border-2 border-purple-600 dark:border-purple-500 bg-gradient-to-b from-purple-50/80 via-white to-purple-50/40 dark:from-purple-950/40 dark:via-slate-900 dark:to-purple-950/20 p-5 flex flex-col justify-between space-y-4 relative shadow-md shadow-purple-600/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            Most Popular
          </div>
          <div className="space-y-2 pt-1">
            <div className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-wider">Platinum</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {billingCycle === 'monthly' ? '$4.99' : '$39.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/month' : '/year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Unlimited power for global explorers and travel groups.
            </p>
            <div className="pt-3 border-t border-purple-200 dark:border-purple-900/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Unlimited Bags</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Unlimited Active Trips</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Unlimited Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Priority baggage fee update requests</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Everything in Gold & Silver</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center block shadow-md shadow-purple-600/30 transition-all"
          >
            Get Platinum
          </a>
        </div>
      </section>

      {/* Trial & Guarantee Banner */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-white text-xs">7-Day Free Platinum Trial</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When you create a free account, you immediately get 7 days of full Platinum access with no credit card required. Drops to Free automatically on day 7.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-white text-xs">14-Day Money-Back Guarantee</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Try any paid plan with zero risk. If you are not completely satisfied within 14 days, email us for a full refund via Lemon Squeezy.
            </p>
          </div>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="text-center pt-4 space-y-2">
        <p className="text-xs text-slate-500">
          Have questions about plan limits or corporate licensing?
        </p>
        <a 
          href="mailto:csmappholdings@gmail.com" 
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email csmappholdings@gmail.com</span>
        </a>
      </section>
    </PageLayout>
  );
};
