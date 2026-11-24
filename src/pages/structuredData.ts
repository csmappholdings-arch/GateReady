import { StaticPageMeta } from './pageMetadata';
import { OFFICIAL_SAME_AS } from '../data/socialLinks';
import {
  MAIN_FAQS,
  TSA_LIQUIDS_FAQS,
  CARRY_ON_FAQS,
  PACKING_LIST_7_DAY_FAQS,
  PlainFaqItem
} from '../data/faqData';

export const FAQ_BY_PATH: Record<string, PlainFaqItem[]> = {
  '/faq': MAIN_FAQS,
  '/tsa-liquids-checker': TSA_LIQUIDS_FAQS,
  '/carry-on-checker': CARRY_ON_FAQS,
  '/packing-list-7-day': PACKING_LIST_7_DAY_FAQS
};

/**
 * Normalizes a route path to the canonical URL matching sitemap.xml.
 * Preserves trailing slash on `/`, `/airlines/`, and `/baggage-fee-calculator/`.
 */
export function getCanonicalPath(rawPath: string): string {
  const normalized = rawPath.replace(/\/+$/, '') || '/';
  if (normalized === '/airlines' || normalized === '/airline-guides') return '/airlines/';
  if (normalized === '/baggage-fee-calculator' || normalized === '/fee-calculator') {
    return '/baggage-fee-calculator/';
  }
  return normalized;
}

export function getCanonicalUrl(rawPath: string): string {
  const canonicalPath = getCanonicalPath(rawPath);
  return `https://gateready.ca${canonicalPath}`;
}

/**
 * Builds the single unified Schema.org JSON-LD @graph emitted per page:
 * - Organization + WebSite sitewide
 * - SoftwareApplication (with 4 pricing tiers) on / and /pricing
 * - FAQPage on /faq, /tsa-liquids-checker, /carry-on-checker, /packing-list-7-day
 * - BreadcrumbList on airline guides and intent/detail pages
 */
export function buildStructuredDataGraph(meta: StaticPageMeta): Record<string, unknown> {
  const normalized = meta.path.replace(/\/+$/, '') || '/';
  const pageUrl = getCanonicalUrl(meta.path);

  const organizationNode = {
    '@type': 'Organization',
    '@id': 'https://gateready.ca/#organization',
    name: 'GateReady',
    legalName: 'CSM App Holdings',
    url: 'https://gateready.ca',
    logo: 'https://gateready.ca/thumbnail.jpg',
    email: 'csmappholdings@gmail.com',
    sameAs: OFFICIAL_SAME_AS,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'csmappholdings@gmail.com',
      contactType: 'customer support'
    }
  };

  const websiteNode = {
    '@type': 'WebSite',
    '@id': 'https://gateready.ca/#website',
    name: 'GateReady',
    url: 'https://gateready.ca',
    publisher: {
      '@id': 'https://gateready.ca/#organization'
    }
  };

  const graph: Array<Record<string, unknown>> = [organizationNode, websiteNode];

  if (normalized === '/' || normalized === '/pricing') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': 'https://gateready.ca/#software',
      name: 'GateReady',
      applicationCategory: 'TravelApplication',
      operatingSystem: 'Web',
      url: 'https://gateready.ca/',
      description: meta.description,
      publisher: {
        '@id': 'https://gateready.ca/#organization'
      },
      sameAs: OFFICIAL_SAME_AS,
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Starter',
          price: '0',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          name: 'Silver Monthly',
          price: '1.99',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '1.99',
            priceCurrency: 'USD',
            billingDuration: 'P1M'
          }
        },
        {
          '@type': 'Offer',
          name: 'Gold Monthly',
          price: '3.99',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '3.99',
            priceCurrency: 'USD',
            billingDuration: 'P1M'
          }
        },
        {
          '@type': 'Offer',
          name: 'Platinum Monthly',
          price: '4.99',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '4.99',
            priceCurrency: 'USD',
            billingDuration: 'P1M'
          }
        }
      ]
    });
  }

  const faqs = FAQ_BY_PATH[normalized];
  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      url: pageUrl,
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  const isAirlineGuide = normalized.startsWith('/airlines/');
  const intentBreadcrumbPaths = new Set([
    '/airlines',
    '/baggage-fee-calculator',
    '/tsa-liquids-checker',
    '/carry-on-checker',
    '/packing-list-7-day',
    '/tare-weight',
    '/entry-requirements',
    '/requirements'
  ]);

  if (isAirlineGuide) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://gateready.ca/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Airlines',
          item: 'https://gateready.ca/airlines/'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: meta.heading,
          item: pageUrl
        }
      ]
    });
  } else if (intentBreadcrumbPaths.has(normalized)) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://gateready.ca/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: meta.heading,
          item: pageUrl
        }
      ]
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}
