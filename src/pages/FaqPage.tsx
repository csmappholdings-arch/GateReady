import React, { useState } from 'react';
import { PageLayout } from './PageLayout';
import { ChevronDown, HelpCircle, Sparkles, Scale, Droplets, ShieldCheck, Mail } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    question: 'How do the free account and 7-day Platinum trial work?',
    answer: (
      <div className="space-y-2">
        <p>
          GateReady is completely free to start. When you create a free account with your email, your account is <strong>automatically upgraded to a 7-day full Platinum trial</strong>.
        </p>
        <p>
          No credit card is required at any point during signup. You get immediate access to unlimited trips, unlimited bags, tare weight calibration, terminal maps, and emergency QR luggage tags.
        </p>
      </div>
    )
  },
  {
    question: 'What happens at day 7 when the trial ends?',
    answer: (
      <div className="space-y-2">
        <p>
          At the end of day 7, your account seamlessly drops back to the <strong>Free plan</strong> ($0 forever).
        </p>
        <p>
          <strong>Your lists remain saved in your account.</strong> You are never automatically charged or billed. If you wish to continue using Platinum or Silver features, you can upgrade voluntarily via Lemon Squeezy; otherwise, your basic packing lists and Free tier access continue indefinitely.
        </p>
      </div>
    )
  },
  {
    question: 'Are baggage fees exact or estimates?',
    answer: (
      <div className="space-y-2">
        <p>
          Baggage fees shown in GateReady are <strong>estimates calculated from published airline fee tables</strong> for 42+ carriers.
        </p>
        <p>
          Airlines frequently adjust luggage fees based on ticket class (Basic Economy vs Main Cabin vs Premium), route type (domestic vs transoceanic), frequent flyer status, and whether fees are prepaid online or paid at the airport ticket counter. Always confirm your specific allowance and fees on your airline's official booking confirmation or website before heading to the airport.
        </p>
      </div>
    )
  },
  {
    question: 'What happens to my packing list if I use GateReady without signing up?',
    answer: (
      <div className="space-y-2">
        <p>
          If you use GateReady as a guest without creating an account, your packing lists and weight settings are saved strictly in your current browser's <strong>localStorage</strong>.
        </p>
        <p>
          They never touch our cloud servers. However, this means if you clear your browser cache, switch devices, or switch from private browsing mode, guest data cannot be recovered. Creating a free account syncs your lists safely to Firebase so you can open them on any device.
        </p>
      </div>
    )
  },
  {
    question: 'How does the TSA 3-1-1 liquids checker work?',
    answer: (
      <div className="space-y-2">
        <p>
          The TSA 3-1-1 checker is a <strong>catalog and item-level rule verification tool</strong>, not a camera scanner or physical sensor.
        </p>
        <p>
          When you add toiletries or liquid items to a carry-on bag, GateReady compares the volume against the TSA 3.4 fl oz (100 ml) standard. If a bottle exceeds 3.4 oz, the app flags it and recommends packing it into your checked luggage or transferring it to a travel-sized bottle.
        </p>
      </div>
    )
  },
  {
    question: 'How does the referral program work?',
    answer: (
      <div className="space-y-2">
        <p>
          GateReady has a straightforward, transparent referral program:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Share your unique referral link with fellow travelers.</li>
          <li>When your friend signs up for a free account, they immediately receive <strong>1 free month of the Platinum Plan</strong> (a $4.99 value).</li>
          <li>You also receive <strong>1 free month of Platinum</strong> credited automatically to your account.</li>
        </ul>
        <p>
          Neither you nor your friend needs to enter a payment card or buy a plan to receive the referral credit.
        </p>
      </div>
    )
  },
  {
    question: 'How do I cancel a subscription, and how does the 14-day guarantee work?',
    answer: (
      <div className="space-y-2">
        <p>
          All paid plans (Silver, Gold, Platinum) come with a <strong>14-day money-back guarantee</strong>.
        </p>
        <p>
          If you decide GateReady isn't right for you within 14 days of subscribing, simply email us at <a href="mailto:csmappholdings@gmail.com" className="font-bold underline text-purple-600">csmappholdings@gmail.com</a> with your email or Lemon Squeezy order number, and we will issue a full refund.
        </p>
        <p>
          You can also cancel future renewals anytime from your account settings or directly via the manage subscription link in your Lemon Squeezy receipt.
        </p>
      </div>
    )
  },
  {
    question: 'Why does empty suitcase "tare weight" matter?',
    answer: (
      <div className="space-y-2">
        <p>
          An empty carry-on suitcase typically weighs 6 to 9 lbs (2.7 to 4.1 kg), while an empty hard-shell checked suitcase often weighs 9 to 13 lbs (4.1 to 5.9 kg).
        </p>
        <p>
          On carriers with strict weight limits (such as European and Asian airlines with 15.4 lb / 7 kg carry-on limits), the empty bag alone eats up <strong>40% to 50%</strong> of your total weight allowance before you pack a single shirt. GateReady factors in empty tare weight so your bag matches what airport ticket counter scales actually weigh.
        </p>
      </div>
    )
  },
  {
    question: 'Which airlines are included in the allowance database?',
    answer: (
      <div className="space-y-2">
        <p>
          GateReady includes 42+ major carriers including Air Canada, WestJet, Porter, Delta, United, American Airlines, Southwest, British Airways, Air France, Lufthansa, KLM, Emirates, Ryanair, easyJet, Japan Airlines, ANA, Singapore Airlines, and many others.
        </p>
      </div>
    )
  }
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <PageLayout pathname="/faq">
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Clear Answers to Traveler Questions
        </h2>
        <p>
          Browse our frequently asked questions regarding GateReady's features, baggage limit calculations, free trials, and account security.
        </p>
      </section>

      {/* Accordion FAQ list */}
      <section className="space-y-3 pt-2">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen 
                  ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60 shadow-xs' 
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-purple-200'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-purple-600 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-purple-100/60 dark:border-purple-900/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Still have questions */}
      <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-bold text-slate-900 dark:text-white text-base">Have a question not listed here?</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Our support team at CSM App Holdings is ready to help.</div>
        </div>
        <a
          href="/contact"
          className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Support</span>
        </a>
      </section>
    </PageLayout>
  );
};
