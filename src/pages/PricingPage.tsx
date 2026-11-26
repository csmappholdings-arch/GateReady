import React, { useState, useEffect } from 'react';
import { PageLayout } from './PageLayout';
import { Check, Sparkles, Shield, Mail, Zap, Crown, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useAuthOptional } from '../context/AuthContext';
import { buildLemonCheckoutUrl, openLemonCheckout } from '../lib/lemonSqueezy';
import {
  PLAN_DEFINITIONS,
  TRIAL_CTA_LABEL,
  TRIAL_DROP_NOTE,
  TRIAL_TERMS_EXACT,
  FEE_MATH_STATEMENT,
  FEE_MATH_YEARLY_FRAME
} from '../data/planEntitlements';
import {
  SmartLuggageScalesPanel,
  DepartureReadinessShowcasePanel
} from '../components/RealUiShowcases';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    trackEvent('pricing_page_viewed');
    trackEvent('upgrade_page_viewed', { source: 'pricing_page' });
  }, []);

  const auth = useAuthOptional();
  const user = auth?.user ?? null;

  const handleSelectPlan = (plan: string) => {
    trackEvent('subscription_plan_selected', { plan, billing_cycle: billingCycle });
    trackEvent('upgrade_button_clicked', { tier: plan, billing_cycle: billingCycle, source: 'pricing_page' });
  };

  const handlePaidCheckout = (
    tier: 'SILVER' | 'GOLD' | 'PLATINUM',
    cycleOverride?: 'monthly' | 'yearly'
  ) => {
    const effectiveCycle = cycleOverride ?? billingCycle;
    trackEvent('subscription_plan_selected', { plan: tier, billing_cycle: effectiveCycle });
    trackEvent('upgrade_button_clicked', { tier, billing_cycle: effectiveCycle, source: 'pricing_page' });
    trackEvent('subscription_started', { tier, billing_cycle: effectiveCycle, gateway: 'lemonsqueezy' });
    openLemonCheckout({
      tier,
      cycle: effectiveCycle,
      user,
      onSuccess: () => {
        window.location.href = '/?lemon_status=success';
      }
    });
  };

  const alternateCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly';

  return (
    <PageLayout pathname="/pricing">
      {/* Intro */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Simple, Honest Pricing · No Hidden Fees</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Transparent Plans for Every Type of Traveler
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {TRIAL_TERMS_EXACT}
        </p>

        {/* Primary Trial CTA & Day-7 Reassurance */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <a
            href="/?action=new_trip"
            onClick={() => handleSelectPlan('TRIAL_SIGNUP')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{TRIAL_CTA_LABEL}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {TRIAL_DROP_NOTE}
          </p>
        </div>

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
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black">
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
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Starter</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">$0</span>
              <span className="text-xs text-slate-500">/ forever</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Ideal for occasional travelers organizing basic trip preparation. {TRIAL_DROP_NOTE}
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              {PLAN_DEFINITIONS.FREE.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <a
              href="/"
              onClick={() => handleSelectPlan('FREE')}
              className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs text-center block transition-colors cursor-pointer"
            >
              {TRIAL_CTA_LABEL}
            </a>
            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
              {TRIAL_DROP_NOTE}
            </p>
          </div>
        </div>

        {/* SILVER */}
        <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">Silver</span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">Individual Travelers</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                {billingCycle === 'monthly' ? '$1.99' : '$19.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/ month' : '/ year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              For solo flyers and business travelers who want unlimited bags, tare subtraction, and saved documents.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              {PLAN_DEFINITIONS.SILVER.features.map((feat, idx) => (
                <div
                  key={feat}
                  className={`flex items-center gap-2 ${idx === 2 ? 'font-bold text-purple-950 dark:text-purple-200' : ''}`}
                >
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <a
              href={buildLemonCheckoutUrl('SILVER', billingCycle, user)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handlePaidCheckout('SILVER', billingCycle);
              }}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center block transition-colors cursor-pointer"
            >
              {billingCycle === 'monthly' ? 'Choose Silver Monthly ($1.99/mo)' : 'Choose Silver Annual ($19.99/yr)'}
            </a>
            <a
              href={buildLemonCheckoutUrl('SILVER', alternateCycle, user)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handlePaidCheckout('SILVER', alternateCycle);
              }}
              className="w-full py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-purple-800 dark:text-purple-200 font-semibold text-[11px] text-center block transition-colors cursor-pointer"
            >
              {alternateCycle === 'yearly' ? 'Or buy Annual ($19.99/yr)' : 'Or buy Monthly ($1.99/mo)'}
            </a>
            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
              14-day money-back guarantee via Lemon Squeezy.
            </p>
          </div>
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
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">Couples &amp; Small Families</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                {billingCycle === 'monthly' ? '$3.99' : '$29.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/ month' : '/ year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              For couples and small families who want unlimited trips, multi-device companion sync, and complete baggage management.
            </p>
            <div className="pt-3 border-t border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
              {PLAN_DEFINITIONS.GOLD.features.map((feat, idx) => (
                <div
                  key={feat}
                  className={`flex items-center gap-2 ${idx < 3 ? 'font-bold text-slate-900 dark:text-white' : ''}`}
                >
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <a
              href={buildLemonCheckoutUrl('GOLD', billingCycle, user)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handlePaidCheckout('GOLD', billingCycle);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs text-center block shadow-md shadow-amber-500/25 transition-all cursor-pointer"
            >
              {billingCycle === 'monthly' ? 'Choose Gold Monthly ($3.99/mo)' : 'Choose Gold Annual ($29.99/yr)'}
            </a>
            <a
              href={buildLemonCheckoutUrl('GOLD', alternateCycle, user)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handlePaidCheckout('GOLD', alternateCycle);
              }}
              className="w-full py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-800 dark:text-amber-200 font-semibold text-[11px] text-center block transition-colors cursor-pointer"
            >
              {alternateCycle === 'yearly' ? 'Or buy Annual ($29.99/yr)' : 'Or buy Monthly ($3.99/mo)'}
            </a>
            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
              14-day money-back guarantee via Lemon Squeezy.
            </p>
          </div>
        </div>

        {/* PLATINUM */}
        <div className="rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Platinum</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">All-Inclusive</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                {billingCycle === 'monthly' ? '$4.99' : '$39.99'}
              </span>
              <span className="text-xs text-slate-500">
                {billingCycle === 'monthly' ? '/ month' : '/ year'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              For frequent flyers and large families who want priority baggage updates and unlimited family sharing.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              {PLAN_DEFINITIONS.PLATINUM.features.map((feat, idx) => (
                <div
                  key={feat}
                  className={`flex items-center gap-2 ${idx < 3 ? 'font-bold text-slate-900 dark:text-white' : ''}`}
                >
                  {idx < 3 ? (
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <a
              href={buildLemonCheckoutUrl('PLATINUM', billingCycle, user)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handlePaidCheckout('PLATINUM', billingCycle);
              }}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center block shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {billingCycle === 'monthly' ? 'Choose Platinum Monthly ($4.99/mo)' : 'Choose Platinum Annual ($39.99/yr)'}
            </a>
            <a
              href={buildLemonCheckoutUrl('PLATINUM', alternateCycle, user)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handlePaidCheckout('PLATINUM', alternateCycle);
              }}
              className="w-full py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 font-semibold text-[11px] text-center block transition-colors cursor-pointer"
            >
              {alternateCycle === 'yearly' ? 'Or buy Annual ($39.99/yr)' : 'Or buy Monthly ($4.99/mo)'}
            </a>
            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
              14-day money-back guarantee via Lemon Squeezy.
            </p>
          </div>
        </div>
      </section>

      {/* Annual Insurance Fee Math Callout */}
      <section className="rounded-3xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/80 dark:bg-emerald-950/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Only travel once a year? Think of Silver as annual baggage insurance
          </div>
          <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {FEE_MATH_STATEMENT}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {FEE_MATH_YEARLY_FRAME}
          </p>
        </div>
        <div className="flex flex-col items-stretch sm:items-end gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handlePaidCheckout('SILVER', 'yearly')}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs whitespace-nowrap shadow-sm transition-colors cursor-pointer"
          >
            Get Silver ($19.99/yr)
          </button>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center sm:text-right">
            14-day money-back guarantee via Lemon Squeezy.
          </span>
        </div>
      </section>

      {/* B3: Real UI Previews of Paid Features */}
      <section className="pt-8 space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Inside the GateReady Workspace
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            What You Use Before Every Trip
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmartLuggageScalesPanel linkHref="/carry-on-checker" linkLabel="Explore Carry-On Size Checker" />
          <DepartureReadinessShowcasePanel linkHref="/?action=new_trip" linkLabel="Start your free trip" />
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="pt-8 space-y-6">
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
                <th className="p-4 font-bold text-purple-700 dark:text-purple-300">Silver ($1.99/mo · $19.99/yr)</th>
                <th className="p-4 font-bold text-amber-700 dark:text-amber-300">Gold ($3.99/mo · $29.99/yr)</th>
                <th className="p-4 font-bold text-indigo-700 dark:text-indigo-300">Platinum ($4.99/mo · $39.99/yr)</th>
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
                <td className="p-4">2 bags (max 1 checked)</td>
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
                <td className="p-4 font-semibold">Smart Bag Rebalance Optimizer</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">TSA 3-1-1 &amp; CATSA Liquids Compliance</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">42 Airline Baggage Rules &amp; Fees</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Terminal Maps &amp; Hub Cabin Intelligence</td>
                <td className="p-4 text-slate-500">Locked / Preview</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Full Hub Intel</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Full Hub Intel</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Full Hub Intel</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Travel Wallet (Loyalty Numbers &amp; PNR Codes)</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Printable PDF Packing Manifests</td>
                <td className="p-4 text-slate-500">Preview / Watermarked</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Clean Unwatermarked</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Clean Unwatermarked</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Clean Unwatermarked</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Emergency QR Luggage Recovery Tags</td>
                <td className="p-4 text-slate-500">Preview / Watermarked</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Full Printable Tags</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Full Printable Tags</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Full Printable Tags</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Personal Cloud Sync (All Your Devices)</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Companion &amp; Family Member Sync</td>
                <td className="p-4">1 traveler (self)</td>
                <td className="p-4">1 traveler (self)</td>
                <td className="p-4 text-emerald-600 font-bold">✓ 2 Travelers (Couples)</td>
                <td className="p-4 text-emerald-600 font-bold">✓ Unlimited Family</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* C5: Honest Factual Objection Handling (Directly Below Comparison Table) */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Trial, Refund &amp; Cancellation Facts
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Plain answers before you start or upgrade — no hidden renewals, no card required for trials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white">
              What happens on day 7 of the free trial?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>{TRIAL_DROP_NOTE}</strong> No credit card is collected when you create a free account. All trips, bags, and packing lists you created remain saved and readable on the Free tier.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white">
              How do 14-day refunds work?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Every paid Silver, Gold, or Platinum checkout is covered by a <strong>14-day money-back guarantee via Lemon Squeezy</strong>. Email{' '}
              <a href="mailto:csmappholdings@gmail.com" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                csmappholdings@gmail.com
              </a>{' '}
              with your account email or Lemon Squeezy order number within 14 days for a 100% refund processed in 3–5 business days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white">
              How does cancellation work?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Cancel anytime in one click from your Account menu inside GateReady or via the management link on your Lemon Squeezy receipt. Renewals stop immediately, and your saved lists stay intact.
            </p>
          </div>
        </div>
      </section>

      {/* Trial & Guarantee Banners */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-900 dark:text-amber-200 text-xs">7-Day Full Platinum Trial</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {TRIAL_TERMS_EXACT} All your trips and packing lists stay safely preserved.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">14-Day Money-Back Guarantee</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every paid checkout is covered by our 14-day money-back guarantee via Lemon Squeezy. Email csmappholdings@gmail.com for a full refund.
            </p>
          </div>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="text-center pt-4 pb-6 space-y-2">
        <p className="text-xs text-slate-500">
          Have questions about plan limits or billing?
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

