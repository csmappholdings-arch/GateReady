import React, { useState } from 'react';
import { PageLayout } from './PageLayout';
import { ChevronDown, Mail } from 'lucide-react';
import { MAIN_FAQS } from '../data/faqData';

function renderAnswerText(answer: string): React.ReactNode {
  const email = 'csmappholdings@gmail.com';
  if (!answer.includes(email)) {
    return <p>{answer}</p>;
  }
  const parts = answer.split(email);
  return (
    <p>
      {parts[0]}
      <a href={`mailto:${email}`} className="font-bold underline text-purple-600 dark:text-purple-400">
        {email}
      </a>
      {parts.slice(1).join(email)}
    </p>
  );
}

export const FaqPage: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set([0]));

  const toggle = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
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
        {MAIN_FAQS.map((faq, idx) => {
          const isOpen = openIndices.has(idx);
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
                  {renderAnswerText(faq.answer)}
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
