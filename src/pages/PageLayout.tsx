import React, { useEffect } from 'react';
import { Plane } from 'lucide-react';
import { AppFooter } from '../components/AppFooter';
import { PublicHeader } from '../components/PublicHeader';
import { STATIC_PAGES, StaticPageMeta } from './pageMetadata';
import { buildStructuredDataGraph, getCanonicalUrl } from './structuredData';

export function applySeoHead(
  meta: Pick<StaticPageMeta, 'path' | 'title' | 'description' | 'keywords' | 'heading' | 'subheading' | 'schemaType'> & {
    robots?: string;
  }
) {
  if (typeof document === 'undefined') return;
  const canonicalUrl = getCanonicalUrl(meta.path);

  document.title = meta.title;

  const setMetaTag = (attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaTag('name', 'robots', meta.robots || 'index, follow');
  setMetaTag('name', 'description', meta.description);
  setMetaTag('name', 'keywords', meta.keywords || 'GateReady, baggage fees, travel packing');
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  let jsonLdScript = document.getElementById('gateready-jsonld') as HTMLScriptElement | null;
  if (!jsonLdScript) {
    jsonLdScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (jsonLdScript) {
      jsonLdScript.id = 'gateready-jsonld';
    } else {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'gateready-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
  }
  jsonLdScript.textContent = JSON.stringify(
    buildStructuredDataGraph({
      path: meta.path,
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      heading: meta.heading,
      subheading: meta.subheading,
      schemaType: meta.schemaType
    })
  );
}

interface PageLayoutProps {
  pathname: string;
  children: React.ReactNode;
  fullWidthContent?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ pathname, children, fullWidthContent = false }) => {
  const meta = STATIC_PAGES[pathname] || {
    path: pathname,
    title: 'GateReady – Smart Trip Packing & Luggage Limit App',
    description: 'Smart trip packing checklist, calibrated luggage weight scale, and airline baggage allowance guide.',
    keywords: 'GateReady, baggage fees, travel packing',
    heading: 'GateReady Information',
    subheading: 'Travel smart with verified baggage limits and tare-deducted packing.'
  };

  useEffect(() => {
    applySeoHead({
      ...meta,
      path: meta.path || pathname
    });
    window.scrollTo(0, 0);
  }, [meta, pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <PublicHeader activePath={pathname} />

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
      <main className={`flex-1 w-full mx-auto ${fullWidthContent ? 'max-w-[1600px] py-4 sm:py-6' : 'max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12'}`}>
        {fullWidthContent ? (
          children
        ) : (
          <article className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {children}
          </article>
        )}
      </main>

      {/* Global Footer */}
      <AppFooter />
    </div>
  );
};
