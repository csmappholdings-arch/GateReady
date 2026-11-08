import React, { useState, useEffect } from 'react';
import { PageLayout } from './PageLayout';
import { Check, Sparkles, Shield, ArrowRight, HelpCircle, Mail, Zap, Crown, X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    trackEvent('pricing_page_viewed');
  }, []);

  const handleSelectPlan = (plan: string) => {
    trackEvent('subscription_plan_selected', { plan, billing_cycle: billingCycle });
  };

  return (
    <PageLayout pathname="/pricing">
      {/* Intro */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Simple, Honest Pricing · No Hidden Fees</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Transparent Plans for Every Type of Traveler
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Start 100% free with no credit card required. Free account signup automatically unlocks a <strong>7-day full Platinum trial</strong> with unlimited bags and tare weight deduction.
        </p>

        {/* Monthly / Yearly Switch */}
        <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-black">
              Save up to 37%
            </span>
          </button>
        </div>
      </section>

      {/* 4 Pricing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 items-stretch">
        
        {/* FREE */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Free</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Starter</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-500">/ forever</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              For people who want to explore GateReady and organize basic travel preparation.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>1</strong> traveler</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>1</strong> active trip</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>2</strong> bags max (1 checked + 1 carry-on)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Smart Luggage Scales</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>TSA 3-1-1 liquids checker</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>42-airline baggage allowance lookup</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            onClick={() => handleSelectPlan('FREE')}
            className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs text-center block transition-colors"
          >
            Start Free
          </a>
        </div>

        {/* SILVER */}
        <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Silver</span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">Individual</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {billingCycle === 'monthly' ? '$1.99' : '$19.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/ month' : '/ year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              For individual travellers who want more luggage management and saved travel functionality.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span><strong>1</strong> traveler</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span><strong>2</strong> active trips</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-purple-950 dark:text-purple-200">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Unlimited bags</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Suitcase tare weight deduction</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Travel wallet & documents</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Rebalance suggestions across bags</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Printable PDF packing lists</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            onClick={() => handleSelectPlan('SILVER')}
            className="w-full py-3 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 font-bold text-xs text-center block transition-colors"
          >
            Choose Silver
          </a>
        </div>

        {/* GOLD (MOST POPULAR) */}
        <div className="rounded-3xl border-2 border-amber-500 dark:border-amber-500 bg-gradient-to-b from-amber-500/10 via-white to-amber-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20 p-6 flex flex-col justify-between space-y-4 relative shadow-xl ring-4 ring-amber-400/30 scale-[1.02] z-10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
            <Crown className="w-3 h-3 fill-white" />
            <span>MOST POPULAR</span>
          </div>
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Gold</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">Couples & Small Families</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {billingCycle === 'monthly' ? '$3.99' : '$29.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/ month' : '/ year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              For couples and small families who want a more complete travel planning experience.
            </p>
            <div className="pt-3 border-t border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong>2</strong> travelers</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong>Unlimited</strong> active trips</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Unlimited bags & luggage scales</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Companion sync (2 travelers)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Emergency QR luggage recovery tags</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Everything in Silver included</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            onClick={() => handleSelectPlan('GOLD')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs text-center block shadow-md shadow-amber-500/25 transition-all"
          >
            Choose Gold
          </a>
        </div>

        {/* PLATINUM */}
        <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Platinum</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">All-Inclusive</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {billingCycle === 'monthly' ? '$4.99' : '$39.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/ month' : '/ year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              For frequent travellers and families who want the complete GateReady experience.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>Unlimited</strong> travelers & kids</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>Unlimited</strong> active trips</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Unlimited bags & luggage scales</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Family sharing across unlimited devices</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Priority baggage fee update requests</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>VIP fast support response</span>
              </div>
            </div>
          </div>
          <a
            href="/"
            onClick={() => handleSelectPlan('PLATINUM')}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center block shadow-md shadow-indigo-600/25 transition-all"
          >
            Choose Platinum
          </a>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="pt-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Detailed Plan Feature Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Compare all features and limits available across each GateReady tier.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <th className="p-4 font-bold text-slate-900 dark:text-white">Feature</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Free</th>
                <th className="p-4 font-bold text-purple-700 dark:text-purple-300">Silver ($1.99/mo)</th>
                <th className="p-4 font-bold text-amber-700 dark:text-amber-300">Gold ($3.99/mo)</th>
                <th className="p-4 font-bold text-indigo-700 dark:text-indigo-300">Platinum ($4.99/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-4 font-semibold">Travelers per trip</td>
                <td className="p-4">1 traveler</td>
                <td className="p-4">1 traveler</td>
                <td className="p-4 font-bold text-amber-600">2 travelers</td>
                <td className="p-4 font-bold text-indigo-600">Unlimited travelers</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Active saved trips</td>
                <td className="p-4">1 active trip</td>
                <td className="p-4">2 active trips</td>
                <td className="p-4 font-bold text-amber-600">Unlimited</td>
                <td className="p-4 font-bold text-indigo-600">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Bags allowed</td>
                <td className="p-4">2 bags (1 checked + 1 carry-on)</td>
                <td className="p-4 font-bold text-purple-600">Unlimited bags</td>
                <td className="p-4 font-bold text-amber-600">Unlimited bags</td>
                <td className="p-4 font-bold text-indigo-600">Unlimited bags</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Suitcase Tare Weight Deduction</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">TSA 3-1-1 Liquids Compliance</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">42+ Airline Baggage Rules & Fees</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Travel Wallet & PNR Storage</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Printable PDF Packing Manifests</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Emergency QR Luggage Recovery Tag</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Family Multi-Device Cloud Sync</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-emerald-600 font-bold">✓ 2 Travelers</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Unlimited Family</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Trial & Guarantee Banners */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-900 dark:text-amber-200 text-xs">7-Day Full Platinum Trial</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every free account registration automatically includes 7 full days of Platinum access with no credit card required. Drops back to the Free plan automatically on day 7, with your trips and packing lists safely preserved.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">14-Day Money-Back Guarantee</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Try any paid plan with zero risk. If you are not completely satisfied within 14 days, email us at csmappholdings@gmail.com for a full refund processed via Lemon Squeezy.
            </p>
          </div>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="text-center pt-4 pb-6 space-y-2">
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
