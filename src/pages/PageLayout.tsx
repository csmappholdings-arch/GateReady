import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Plane, Luggage } from 'lucide-react';
import { AppFooter } from '../components/AppFooter';
import { STATIC_PAGES } from './pageMetadata';

interface PageLayoutProps {
  pathname: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ pathname, children }) => {
  const meta = STATIC_PAGES[pathname] || {
    title: 'GateReady – Smart Trip Packing & Luggage Limit App',
    description: 'Smart trip packing checklist, calibrated luggage weight scale, and airline baggage allowance guide.',
    heading: 'GateReady Information',
    subheading: 'Travel smart with verified baggage limits and tare-deducted packing.'
  };

  useEffect(() => {
    document.title = meta.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', meta.description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', meta.description);
    }
    window.scrollTo(0, 0);
  }, [meta]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-purple-100 dark:border-purple-950/80 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Luggage className="w-4 h-4" />
              </div>
              <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                Gate<span className="text-purple-600 dark:text-purple-400">Ready</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/pricing"
              className="hidden sm:inline-flex text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            >
              Plans from $1.99
            </a>
            <a
              href="/"
              className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-purple-600/25 active:scale-95 transition-all"
            >
              <span>Create Your Trip (Free)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header for Document */}
      <section className="w-full bg-gradient-to-b from-purple-950/15 via-purple-900/5 to-transparent border-b border-purple-100/60 dark:border-purple-950/60 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5" />
            <span>GateReady Travel Guide & Policy Reference</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {meta.heading}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {meta.subheading}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
          {children}
        </article>
      </main>

      {/* Global Footer */}
      <AppFooter />
    </div>
  );
};
