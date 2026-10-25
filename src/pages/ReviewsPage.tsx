import React from 'react';
import { PageLayout } from './PageLayout';
import { MessageSquare, Mail, ArrowRight, Plane } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  return (
    <PageLayout pathname="/reviews">
      <section className="text-center py-8 space-y-6 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-sm">
          <MessageSquare className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Verified Traveler Reviews
        </h2>

        {/* Required Standby Copy */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          Reviews from real travelers will appear here once GateReady has enough verified users. Want to be one of the first? Create a free trip and tell us what you think at{' '}
          <a href="mailto:csmappholdings@gmail.com" className="font-bold text-purple-600 dark:text-purple-400 underline hover:text-purple-700">
            csmappholdings@gmail.com
          </a>.
        </div>

        <div className="pt-2">
          <a
            href="/"
            className="h-11 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-purple-600/30 transition-all"
          >
            <Plane className="w-4 h-4" />
            <span>Create a Free Trip</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </PageLayout>
  );
};
