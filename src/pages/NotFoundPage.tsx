import React, { useEffect } from 'react';
import { ArrowLeft, Compass, Plane, Search } from 'lucide-react';
import { AppFooter } from '../components/AppFooter';
import { PublicHeader } from '../components/PublicHeader';
import { applySeoHead } from './PageLayout';

export const NotFoundPage: React.FC = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/not-found';

  useEffect(() => {
    try {
      if (localStorage.getItem('gateready_dark_mode') === 'true') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}

    applySeoHead({
      path: pathname,
      title: 'Page Not Found (404) – GateReady',
      description: 'The requested GateReady page or airline guide could not be found.',
      keywords: 'GateReady, page not found, 404',
      heading: 'Page not found',
      subheading: 'We could not find the page you requested.',
      schemaType: 'WebPage',
      robots: 'noindex, nofollow'
    });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <PublicHeader activePath={pathname} />

      {/* Main 404 Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex items-center justify-center">
        <div className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 sm:p-12 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 tabular-nums">
              Error 404
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Page not found
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              The address <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{pathname}</span> does not match an active GateReady page or airline baggage guide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/"
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to GateReady Home</span>
            </a>

            <a
              href="/airlines/"
              className="w-full sm:w-auto h-11 px-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all"
            >
              <Plane className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Browse 42 Airline Guides</span>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <a href="/baggage-fee-calculator/" className="hover:underline inline-flex items-center gap-1">
              <Search className="w-3.5 h-3.5" />
              <span>Baggage Fee Calculator</span>
            </a>
            <a href="/tsa-liquids-checker" className="hover:underline">TSA &amp; CATSA Liquids Checker</a>
            <a href="/carry-on-checker" className="hover:underline">Carry-On Checker</a>
            <a href="/pricing" className="hover:underline">Plans &amp; Pricing</a>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};
