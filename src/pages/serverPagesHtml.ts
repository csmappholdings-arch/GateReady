import { STATIC_PAGES, StaticPageMeta } from './pageMetadata';
import { AIRLINE_GUIDES, getAirlineGuideBySlug } from '../data/airlineGuidesData';
import { 
  getAirlinePageHtml, 
  getAirlineIndexPageHtml, 
  getBaggageFeeCalculatorHtml, 
  getTareWeightHtml, 
  getEntryRequirementsHtml,
  getHomepageHtml,
  getRequirementsHubHtml
} from './serverGuidesHtml';
import { PLAN_DEFINITIONS, TRIAL_TERMS_EXACT, FEE_MATH_STATEMENT, FEE_MATH_YEARLY_FRAME } from '../data/planEntitlements';

export function getPageHtmlContent(pathname: string): { meta: StaticPageMeta; bodyHtml: string } | null {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  // 0. Check if path is Homepage (/)
  if (normalizedPath === '/') {
    const meta: StaticPageMeta = {
      path: '/',
      title: 'GateReady.ca – Pack Smart. Fly Prepared. Avoid Surprise Baggage Fees.',
      description: 'Understand your baggage allowances, estimate luggage weight and check potential airline fees before you leave home.',
      keywords: 'airline baggage allowance, carry-on baggage restrictions, airline baggage fees, luggage weight calculator, carry-on size checker, travel packing checklist, checked baggage allowance, avoid overweight baggage fees',
      heading: 'Pack Smart. Fly Prepared. Avoid Surprise Baggage Fees.',
      subheading: 'Understand your baggage allowances, estimate luggage weight and check potential airline fees before you leave home.',
      schemaType: 'WebApplication'
    };

    const innerContentHtml = getHomepageHtml();
    const bodyHtml = renderPageShell(meta, innerContentHtml);
    return { meta, bodyHtml };
  }

  // 1. Check if path is an airline guide (e.g. /airlines/westjet-baggage)
  if (normalizedPath.startsWith('/airlines/')) {
    const slug = normalizedPath.replace(/^\/airlines\//, '');
    const guide = getAirlineGuideBySlug(slug);
    if (guide) {
      const meta: StaticPageMeta = {
        path: guide.canonicalPath,
        title: guide.title,
        description: guide.metaDescription,
        keywords: guide.keywords,
        heading: guide.h1,
        subheading: `Verified carry-on dimensions, weight limits, and baggage fees for ${guide.name} travelers.`,
        schemaType: 'WebPage'
      };

      const innerContentHtml = getAirlinePageHtml(guide);
      const bodyHtml = renderPageShell(meta, innerContentHtml);
      return { meta, bodyHtml };
    }
  }

  // 2. Check if path is the Airline Directory Index (/airlines)
  if (normalizedPath === '/airlines') {
    const meta: StaticPageMeta = {
      path: '/airlines',
      title: 'Airline Baggage Allowance Guides (42 Airlines) – GateReady',
      description: 'Verified carry-on dimensions, weight limits, and checked luggage fee tables for all 42 major airlines across Canada, the US, Europe, and Asia.',
      keywords: 'airline baggage allowance, carry on dimensions by airline, checked baggage fees by airline, airline baggage limits 2026, luggage scale',
      heading: 'Airline Baggage Allowance & Fee Directory',
      subheading: 'Verified carry-on sizers, weight caps, and baggage fees for 42 global airlines.',
      schemaType: 'CollectionPage'
    };

    const innerContentHtml = getAirlineIndexPageHtml();
    const bodyHtml = renderPageShell(meta, innerContentHtml);
    return { meta, bodyHtml };
  }

  // 3. Intent Page: Baggage Fee Calculator (/baggage-fee-calculator)
  if (normalizedPath === '/baggage-fee-calculator') {
    const meta: StaticPageMeta = {
      path: '/baggage-fee-calculator',
      title: 'Baggage Fee Calculator — GateReady',
      description: "Estimate checked bag fees, carry-on charges, and fare-family luggage inclusions across 42 airlines with GateReady's standalone fee calculator.",
      keywords: 'baggage fee calculator, airline luggage fees, calculate baggage fees by airline, overweight baggage cost, carry on fee calculator, fare families luggage',
      heading: 'Airline Baggage Fee Calculator',
      subheading: 'Instant baggage fee calculations across 42 airlines before heading to the airport.',
      schemaType: 'WebApplication'
    };

    const innerContentHtml = getBaggageFeeCalculatorHtml();
    const bodyHtml = renderPageShell(meta, innerContentHtml);
    return { meta, bodyHtml };
  }

  // 4. Intent Page: Tare Weight Explainer (/tare-weight)
  if (normalizedPath === '/tare-weight') {
    const meta: StaticPageMeta = {
      path: '/tare-weight',
      title: 'What is Tare Weight? Empty Suitcase Weight Guide – GateReady',
      description: 'Learn what luggage tare weight is, why empty suitcases consume up to 25% of baggage allowances, and how GateReady stops overweight fees.',
      keywords: 'what is tare weight, luggage tare weight, empty suitcase weight, baggage weight scale, overweight luggage fee prevention',
      heading: 'What is Tare Weight in Luggage & Travel?',
      subheading: 'Why your empty suitcase consumes up to 25% of your airline baggage allowance.',
      schemaType: 'Article'
    };

    const innerContentHtml = getTareWeightHtml();
    const bodyHtml = renderPageShell(meta, innerContentHtml);
    return { meta, bodyHtml };
  }

  // 5. Intent Page: Entry Requirements Hub (/entry-requirements)
  if (normalizedPath === '/entry-requirements') {
    const meta: StaticPageMeta = {
      path: '/entry-requirements',
      title: 'Entry Requirements — GateReady',
      description: 'Check passport validity rules, 6-month validity requirements, visa waivers, and official government advisories for Canadian and US passport holders.',
      keywords: 'entry requirements quick-check, passport validity rules, 6 month passport rule, ESTA eTA requirements, international travel advisories, visa requirements',
      heading: 'Entry Requirements Quick-Check – Passport & Visa Rules',
      subheading: 'Official government intelligence and cross-border checklist rules before departure.',
      schemaType: 'WebPage'
    };

    const innerContentHtml = getEntryRequirementsHtml();
    const bodyHtml = renderPageShell(meta, innerContentHtml);
    return { meta, bodyHtml };
  }

  // 6. Intent Page: Requirements Hub (/requirements)
  if (normalizedPath === '/requirements') {
    const meta: StaticPageMeta = {
      path: '/requirements',
      title: 'Travel Requirements Hub — GateReady',
      description: 'Look up published airline checked luggage fees and passport validity rules right now before creating a trip.',
      keywords: 'travel requirements hub, baggage fee calculator, entry requirements quick-check, passport validity rules, 42 airlines baggage',
      heading: 'Baggage Fees by Airline, Luggage Allowances & Entry Requirements',
      subheading: 'Look up published airline checked luggage fees and passport validity rules right now before creating a trip.',
      schemaType: 'CollectionPage'
    };

    const innerContentHtml = getRequirementsHubHtml();
    const bodyHtml = renderPageShell(meta, innerContentHtml);
    return { meta, bodyHtml };
  }

  // 7. Check if path is one of the 12 existing static pages
  const meta = STATIC_PAGES[normalizedPath];
  if (!meta) return null;

  let innerContentHtml = '';

  if (normalizedPath === '/about') {
    innerContentHtml = `
      <section class="space-y-4">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Who GateReady Is For</h2>
        <p class="text-base text-slate-700 leading-relaxed">
          GateReady (<strong>gateready.ca</strong>) is a dedicated trip packing app built for travelers who want to eliminate overweight baggage fees, avoid TSA security confiscations, and prevent surprises at the boarding gate.
        </p>
        <p class="text-slate-700 leading-relaxed">
          Whether you are flying on a budget carrier with strict 15-lb carry-on restrictions, embarking on an international family vacation with multiple checked suitcases, or taking a weekend trip with only a personal backpack, GateReady gives you structured luggage confidence before you leave home.
        </p>
      </section>

      <section class="space-y-4 pt-6 border-t border-slate-200">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">What GateReady Does (In Plain Language)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">Per-Bag Weight Meters & Tare Deduction</h3>
            <p class="text-xs text-slate-600 mt-1">Accounts for empty luggage shell weight (e.g. 7.0 lbs carry-on, 10.5 lbs checked hardcase) plus individual packed items to model actual airport scale readings.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">TSA 3-1-1 Liquids Compliance Rule</h3>
            <p class="text-xs text-slate-600 mt-1">Evaluates toiletry bottle volumes in carry-on bags against the 3.4 oz (100ml) security limit, advising you to relocate larger bottles to checked luggage.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">42-Airline Baggage Allowance Reference</h3>
            <p class="text-xs text-slate-600 mt-1">Pre-calibrated carry-on sizer dimensions (inches & cm) and checked weight caps for 42+ major global carriers, including Air Canada, WestJet, Delta, United, and British Airways.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">Departure Readiness Tracking</h3>
            <p class="text-xs text-slate-600 mt-1">Item-by-item packing checklists, gate-check safety reminders (power banks, IDs, medications), and departure countdown schedules.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">Rebalance Bags Luggage Optimizer (Silver+)</h3>
            <p class="text-xs text-slate-600 mt-1">Suggests safe item relocations across your bags when a suitcase is overweight. Strictly suggest-first with 1-click apply and complete undo. Enforces airline safety guardrails (never moving keys, medications, or lithium power banks into checked luggage) and gives an honest notice if no safe move exists.</p>
          </div>
        </div>
      </section>

      <section class="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-3 mt-6">
        <h2 class="font-black text-lg text-amber-900">What GateReady Does NOT Do (Honesty Policy)</h2>
        <p class="text-xs text-amber-900 leading-relaxed">We believe software should never make false promises. GateReady is a self-service planning tool:</p>
        <ul class="space-y-1.5 text-xs text-amber-950 list-disc list-inside">
          <li><strong>No gate-change or boarding alerts:</strong> GateReady does not monitor air traffic control or live airport PA systems.</li>
          <li><strong>No live flight or gate data:</strong> We do not stream live telemetry or tail numbers.</li>
          <li><strong>No GPS bag tracking:</strong> GateReady is not an Apple AirTag or physical hardware beacon.</li>
          <li><strong>No camera scanning:</strong> We do not scan bags through your camera; luggage weights and items are selected by the user.</li>
          <li><strong>No physical scale hardware:</strong> The app models and estimates luggage weight based on tare benchmarks and item catalog baselines.</li>
          <li><strong>Fees are estimates:</strong> All baggage fee calculations are calculated from published airline fee tables. Because airlines frequently change rates and seat-tier terms, you should always verify with your airline prior to departure.</li>
        </ul>
      </section>

      <section class="space-y-3 pt-6 border-t border-slate-200">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Who Makes GateReady</h2>
        <p class="text-slate-700">GateReady is developed and operated by <strong>CSM App Holdings</strong>.</p>
        <p class="text-xs text-slate-600">Sole Support Contact: <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a></p>
      </section>
    `;
  } else if (pathname === '/privacy') {
    innerContentHtml = `
      <div class="text-xs text-slate-500 font-medium">Last updated: November 1, 2026</div>
      <section class="space-y-3 mt-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">GateReady Privacy Policy</h2>
        <p class="text-slate-700 leading-relaxed">
          At GateReady (gateready.ca), operated by <strong>CSM App Holdings</strong>, we believe in privacy by design. We build tools to help you travel stress-free, without selling or exploiting your personal data.
        </p>
      </section>
      <section class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900">1. Data We Collect and Where It Lives</h3>
        <p class="text-xs text-slate-600"><strong>Guest Lists in Your Browser Only:</strong> If you use GateReady without creating an account, all your trip names, dates, luggage selections, tare weights, and packing checklists are stored strictly in your browser's local storage (localStorage). They never touch our servers.</p>
        <p class="text-xs text-slate-600"><strong>Account Data via Firebase:</strong> When you voluntarily register for a free account, your account email and saved trip manifests are synchronized via Firebase so you can access them across your devices.</p>
        <p class="text-xs text-slate-600"><strong>Payments via Lemon Squeezy:</strong> All subscription billing is processed by our Merchant of Record, Lemon Squeezy. GateReady never receives, handles, or stores your credit card number.</p>
      </section>
      <section class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900">2. Cookies and Storage</h3>
        <p class="text-xs text-slate-600">We use essential local storage to remember your packed items, bag tare weights, and unit preferences (lbs/kg, °F/°C). If advertising or sponsored partner links are added in the future, this privacy policy will be promptly updated to disclose advertising cookies.</p>
      </section>
      <section class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900">3. User Rights & Data Deletion</h3>
        <p class="text-xs text-slate-600">You may delete any trip list directly inside the app at any time. You can permanently delete your account and erase all associated cloud data directly within the app at any time via Settings &rarr; Preferences &rarr; &ldquo;Delete Account &amp; Erase Cloud Data&rdquo;, which permanently deletes your user profile, cloud trips, and checklists in Cloud Firestore, and permanently deletes your authentication record. Alternatively, you can email our support team at <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a> from your registered email address as a fallback.</p>
      </section>
      <section class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900">4. Children's Privacy & Contact</h3>
        <p class="text-xs text-slate-600">GateReady is not directed at children under the age of 13. For any privacy questions, contact <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a>.</p>
      </section>
    `;
  } else if (pathname === '/terms') {
    innerContentHtml = `
      <div class="text-xs text-slate-500 font-medium">Last updated: October 24, 2026</div>
      <section class="space-y-3 mt-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Terms of Service</h2>
        <p class="text-slate-700 leading-relaxed">
          These Terms of Service govern your use of GateReady (gateready.ca), operated by <strong>CSM App Holdings</strong>. By using the app, you agree to these terms.
        </p>
      </section>
      <section class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900">1. Trip Planning & Allowance Estimates</h3>
        <p class="text-xs text-slate-600 leading-relaxed">GateReady is provided strictly as a planning assistant. Baggage fee estimates, weight limits, and luggage dimensions are calculated from published airline tables. Airlines change policies and pricing frequently; travelers are solely responsible for confirming rules with their carrier prior to travel. GateReady is not liable for airline fees, denied boarding, or confiscated items.</p>
      </section>
      <section class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900">2. Plans, Billing & 7-Day Free Platinum Trial</h3>
        <p class="text-xs text-slate-600">GateReady offers: Free (${PLAN_DEFINITIONS.FREE.formattedMonthly}; ${PLAN_DEFINITIONS.FREE.features.join(', ').toLowerCase()}); Silver (${PLAN_DEFINITIONS.SILVER.formattedMonthly}/mo or ${PLAN_DEFINITIONS.SILVER.formattedYearly}/yr; ${PLAN_DEFINITIONS.SILVER.features.join(', ').toLowerCase()}); Gold (${PLAN_DEFINITIONS.GOLD.formattedMonthly}/mo or ${PLAN_DEFINITIONS.GOLD.formattedYearly}/yr); Platinum (${PLAN_DEFINITIONS.PLATINUM.formattedMonthly}/mo or ${PLAN_DEFINITIONS.PLATINUM.formattedYearly}/yr). ${TRIAL_TERMS_EXACT} All paid subscriptions are billed via Lemon Squeezy with a 14-day money-back guarantee.</p>
      </section>
      <section class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900">3. Contact</h3>
        <p class="text-xs text-slate-600">Contact CSM App Holdings at <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a>.</p>
      </section>
    `;
  } else if (pathname === '/contact') {
    innerContentHtml = `
      <section class="space-y-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Contact GateReady Support</h2>
        <p class="text-slate-700 leading-relaxed">We are here to help with your trip lists, airline baggage calculations, and account support.</p>
      </section>
      <section class="p-6 rounded-3xl bg-purple-50 border border-purple-200 space-y-3 mt-4">
        <div class="text-xs font-bold text-purple-700 uppercase">Sole Official Support Email</div>
        <a href="mailto:csmappholdings@gmail.com" class="text-base font-bold text-purple-700 underline block">csmappholdings@gmail.com</a>
        <div class="text-xs text-slate-600">Expected response: We aim to reply to all inquiries within a few business days. (We do not offer 24/7 support).</div>
      </section>
      <section class="space-y-2 pt-6 border-t border-slate-200 text-xs text-slate-600">
        <h3 class="font-bold text-slate-900 text-sm">Operating Company:</h3>
        <div>CSM App Holdings · gateready.ca</div>
      </section>
    `;
  } else if (pathname === '/faq') {
    innerContentHtml = `
      <section class="space-y-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        <div class="space-y-4 pt-3">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">How do the free account and 7-day Platinum trial work?</h3>
            <p class="text-xs text-slate-600 mt-1">${TRIAL_TERMS_EXACT} You get immediate access to unlimited trips, bags, tare weight calibration, and terminal maps.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">What happens at day 7?</h3>
            <p class="text-xs text-slate-600 mt-1">${TRIAL_TERMS_EXACT} All your packing lists stay saved in your account. You will never be billed automatically without explicit checkout.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">Are baggage fees exact or estimates?</h3>
            <p class="text-xs text-slate-600 mt-1">Estimates derived from published airline baggage tables for 42+ carriers. Because airlines vary rates by fare class, route, and prepayment, always confirm with your airline at booking.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">What happens to a guest list if you do not sign up?</h3>
            <p class="text-xs text-slate-600 mt-1">It lives only in that specific browser's localStorage. If you clear your browser data or switch devices, it is lost unless you create a free account to sync.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">How does the TSA 3-1-1 checker work?</h3>
            <p class="text-xs text-slate-600 mt-1">It is an item list rule check against the TSA 3.4 oz (100ml) limit, not a hardware scanner. It alerts you when toiletries in carry-on bags should be moved to checked luggage.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">How do referrals work?</h3>
            <p class="text-xs text-slate-600 mt-1">Your friend gets 1 free month of Platinum on signup ($4.99 value); you get 1 free month of Platinum credited to your account automatically upon their signup. No card or purchase required.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">How do I cancel and how does the 14-day guarantee work?</h3>
            <p class="text-xs text-slate-600 mt-1">Cancel anytime via your account settings. If within 14 days of subscribing to a paid plan, email csmappholdings@gmail.com for a 100% refund processed via Lemon Squeezy.</p>
          </div>
        </div>
      </section>
    `;
  } else if (pathname === '/pricing') {
    innerContentHtml = `
      <section class="space-y-6">
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Transparent Plans for Every Type of Traveler</h2>
          <p class="text-slate-700 leading-relaxed">Start 100% free with no credit card required. ${TRIAL_TERMS_EXACT}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 class="font-bold text-slate-900">Free (${PLAN_DEFINITIONS.FREE.formattedMonthly})</h3>
            <p class="text-[11px] font-semibold text-slate-500">${PLAN_DEFINITIONS.FREE.tagline}</p>
            <p class="text-xs text-slate-600 mt-1">${PLAN_DEFINITIONS.FREE.features.join(', ')}.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <h3 class="font-bold text-purple-900">Silver (${PLAN_DEFINITIONS.SILVER.formattedMonthly}/mo · ${PLAN_DEFINITIONS.SILVER.formattedYearly}/yr)</h3>
            <p class="text-[11px] font-semibold text-purple-700">${PLAN_DEFINITIONS.SILVER.tagline}</p>
            <p class="text-xs text-slate-600 mt-1">${PLAN_DEFINITIONS.SILVER.features.join(', ')}.</p>
            <p class="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl p-2 mt-2">${FEE_MATH_STATEMENT}</p>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 space-y-2">
            <div class="text-[10px] font-black uppercase tracking-wider text-amber-700">MOST POPULAR</div>
            <h3 class="font-bold text-slate-900 mt-0.5">Gold (${PLAN_DEFINITIONS.GOLD.formattedMonthly}/mo · ${PLAN_DEFINITIONS.GOLD.formattedYearly}/yr)</h3>
            <p class="text-[11px] font-semibold text-amber-800">${PLAN_DEFINITIONS.GOLD.tagline}</p>
            <p class="text-xs text-slate-600 mt-1">${PLAN_DEFINITIONS.GOLD.features.join(', ')}.</p>
          </div>
          <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
            <h3 class="font-bold text-indigo-900">Platinum (${PLAN_DEFINITIONS.PLATINUM.formattedMonthly}/mo · ${PLAN_DEFINITIONS.PLATINUM.formattedYearly}/yr)</h3>
            <p class="text-[11px] font-semibold text-indigo-700">${PLAN_DEFINITIONS.PLATINUM.tagline}</p>
            <p class="text-xs text-slate-600 mt-1">${PLAN_DEFINITIONS.PLATINUM.features.join(', ')}.</p>
          </div>
        </div>
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div class="font-black uppercase tracking-wider text-[11px] text-emerald-700">Only travel once a year? Annual baggage insurance math</div>
          <div class="font-bold text-sm text-slate-900">${FEE_MATH_STATEMENT}</div>
          <div>${FEE_MATH_YEARLY_FRAME}</div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-100 text-xs text-slate-600 space-y-1">
          <div><strong>7-Day Free Platinum Trial:</strong> ${TRIAL_TERMS_EXACT} All trips stay safely preserved.</div>
          <div><strong>14-Day Guarantee:</strong> 100% money-back guarantee on paid plans via Lemon Squeezy. Contact csmappholdings@gmail.com.</div>
        </div>
      </section>
    `;
  } else if (pathname === '/how-it-works') {
    innerContentHtml = `
      <section class="space-y-4">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">How GateReady Works in 5 Steps</h2>
        <div class="space-y-3 pt-2">
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">1. Create Your Trip &amp; Set Travel Dates</h3>
            <p class="text-xs text-slate-600 mt-1">Enter your destination, departure countdown, and travel dates to activate your personalized travel preparation workspace.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">2. Select Travel Mode &amp; Operating Airline</h3>
            <p class="text-xs text-slate-600 mt-1">Choose from 42+ verified airlines and fare families to load published carry-on sizer dimensions and checked luggage weight limits.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">3. Add Luggage &amp; Calibrate Suitcase Tare Weight</h3>
            <p class="text-xs text-slate-600 mt-1">Deduct empty bag shell weight (typically 6 to 9 lbs) to ensure packed belongings remain strictly within airline allowances.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">4. Live Packing Weight Meters &amp; TSA 3-1-1 Liquids Audit</h3>
            <p class="text-xs text-slate-600 mt-1">Monitor Live Packing Weight Meters as you pack and automatically audit carry-on bottles against the TSA 3.4 oz (100ml) security limit.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">5. Review Departure Readiness, Rebalance &amp; Print Manifests</h3>
            <p class="text-xs text-slate-600 mt-1">Check your 0–100% Departure Readiness Score, rebalance overweight bags with 1 click, and generate emergency QR luggage tags.</p>
          </div>
        </div>
      </section>
    `;
  } else if (pathname === '/cookies') {
    innerContentHtml = `
      <div class="text-xs text-slate-500 font-medium">Last updated: October 24, 2026</div>
      <section class="space-y-3 mt-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Cookie & Storage Policy</h2>
        <p class="text-slate-700 leading-relaxed">GateReady (gateready.ca) operated by CSM App Holdings uses browser localStorage for trips (gateready_trips_data_v2) and user preferences (lbs/kg, °C/°F). Authentication sessions are handled via Firebase tokens, and subscription payments are handled via Lemon Squeezy secure cookies. No third-party behavioral ad tracking is currently active; this policy will be updated if ad networks are added.</p>
        <p class="text-xs text-slate-600">Questions? Contact <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a>.</p>
      </section>
    `;
  } else if (pathname === '/refunds') {
    innerContentHtml = `
      <div class="text-xs text-slate-500 font-medium">Last updated: October 24, 2026</div>
      <section class="space-y-3 mt-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Refund Policy & 14-Day Guarantee</h2>
        <p class="text-slate-700 leading-relaxed">All paid GateReady plans (Silver, Gold, Platinum) carry a full 14-day money-back guarantee. If unsatisfied, email <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a> with your email or Lemon Squeezy order number for a 100% refund processed in 3 to 5 business days.</p>
        <p class="text-xs text-slate-600">Cancel renewals anytime via account settings. ${TRIAL_TERMS_EXACT} It will never bill automatically.</p>
      </section>
    `;
  } else if (pathname === '/changelog') {
    innerContentHtml = `
      <section class="space-y-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">GateReady Product Changelog</h2>
        <div class="space-y-4 pt-2">
          <div class="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300">
            <div class="font-bold text-purple-900 text-sm">November 2, 2026 — Rebalance Bags Luggage Optimizer, Server-Side Account Deletion, Fare-Family Single Source of Truth & Settings Reachability</div>
            <ul class="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
              <li><strong>Rebalance Bags Luggage Optimizer (Silver+):</strong> When any suitcase exceeds weight limits, Rebalance evaluates your packed items to suggest safe transfers to lighter bags. Strictly suggest-first with 1-click apply and complete undo. Rigidly enforces airline safety rules (never moving keys, medications, or lithium power banks into checked luggage) and displays an honest notice when no safe move exists.</li>
              <li><strong>Permanent Server-Side Account Deletion & Local Purge:</strong> Deleting an account enforces complete server-side deletion of Cloud Firestore user profile, all synced trip records, and the Firebase Auth user record before reporting completion. Local device trip state is completely wiped at deletion time, preventing any resurrected trips or subsequent logins with the same credentials.</li>
              <li><strong>Fare-Family Single Source of Truth:</strong> Eliminated cloud-sync race conditions when changing fare families. Trip updates write through with server confirmation and re-read the fresh saved fare whenever switching trips or opening the New Trip dialog.</li>
              <li><strong>Settings Modal Layout & Delete Account Button Visibility:</strong> Optimized vertical scrolling and sticky header in Settings & Preferences (max-h-[85vh]), ensuring "Delete Account & Erase Cloud Data" is visible and clickable by mouse/touch on all screen heights.</li>
              <li><strong>Weight Math Unification:</strong> Unified simulation and applied luggage weight math into a single formula, eliminating 0.1 lb prediction discrepancies.</li>
              <li><strong>USD Guide Note Splitting:</strong> Separated 1st-bag and 2nd-bag USD conversion notes onto individual rows for Air Canada and WestJet guides.</li>
              <li><strong>Unified Support Channel & Streamlined Navigation:</strong> Consolidated all customer communications into our single official Contact Support channel (csmappholdings@gmail.com) and organized site-wide navigation into compact, mobile-responsive footer columns.</li>
            </ul>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900 text-sm">November 1, 2026 — Complete Plan Zero-Flash, Privacy Policy §5 In-App Deletion Synchronization & Multi-Modal Refinements</div>
            <ul class="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
              <li><strong>Complete Plan Pill & Tier Badge Zero-Flash:</strong> Synchronized trial expiration timestamps and subscription tier states from local cache on initial render, ensuring the header immediately displays the user's trial countdown and tier without flashing "Free Plan", "Upgrade PLANS", blank pills, or pulse skeletons on reload or new tabs.</li>
              <li><strong>Cruise Stateroom Storage Copy Cleanup:</strong> Updated cruise carry-on dimensional guidance to use verified cruise-appropriate wording ("Terminal security clearance sizer · must fit through terminal screening sizer and stow in stateroom"), eliminating bus/coach terminology on cruise itineraries.</li>
              <li><strong>Privacy Policy §5 In-App Deletion Synchronization:</strong> Updated Privacy Policy §5 (User Rights & Data Deletion) to document the in-app "Delete Account & Erase Cloud Data" control as the primary instant deletion mechanism, with email support as the fallback route.</li>
              <li><strong>Airline Currency Formatting & USD Equivalence Clarity:</strong> Removed duplicate currency codes across airline guides and search index cards (clean "CAD $35"). Explicitly labelled all USD approximation figures across Canadian and European carrier guides with "(1st bag) / (2nd bag)".</li>
              <li><strong>Dismissible Email Verification Banner & Trip Header Placeholders:</strong> Made email verification banners dismissible with persistence and avoided nagging active trial accounts. Removed raw "Not set" labels on optional trip banner fields in favor of clean, neutral prompts.</li>
            </ul>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900 text-sm">October 31, 2026 — Head-Tag Verification, Search Architecture & Multi-Modal Mode Integrity Audit</div>
            <div class="text-xs text-slate-700 mt-2 space-y-2">
              <p>Verified live head tags (canonical URLs, unique meta descriptions, absolute og:image and twitter:image URLs) across 6 sampled routes:</p>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-[11px] border border-purple-200 rounded-lg">
                  <thead class="bg-purple-100 font-bold text-purple-950">
                    <tr>
                      <th class="p-1.5 border-b border-purple-200">Route</th>
                      <th class="p-1.5 border-b border-purple-200">Canonical Tag</th>
                      <th class="p-1.5 border-b border-purple-200">Meta Description</th>
                      <th class="p-1.5 border-b border-purple-200">Social Images</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-purple-100 text-[10px]">
                    <tr>
                      <td class="p-1.5 font-mono font-bold">/</td>
                      <td class="p-1.5 font-mono">https://gateready.ca/</td>
                      <td class="p-1.5">Calculate baggage fees, tare luggage weight, check TSA 3-1-1 rules, and reference baggage policies for 42+ airlines with GateReady.</td>
                      <td class="p-1.5 font-mono text-emerald-700">https://gateready.ca/thumbnail.jpg</td>
                    </tr>
                    <tr>
                      <td class="p-1.5 font-mono font-bold">/airlines/westjet-baggage</td>
                      <td class="p-1.5 font-mono">https://gateready.ca/airlines/westjet-baggage</td>
                      <td class="p-1.5">Verified WestJet baggage rules: carry-on dimensions (21 x 15 x 9 in), no maximum carry-on weight limit (must lift unassisted), checked fees ($35 CAD 1st, $50 CAD 2nd).</td>
                      <td class="p-1.5 font-mono text-emerald-700">https://gateready.ca/thumbnail.jpg</td>
                    </tr>
                    <tr>
                      <td class="p-1.5 font-mono font-bold">/airlines/porter-airlines-baggage</td>
                      <td class="p-1.5 font-mono">https://gateready.ca/airlines/porter-airlines-baggage</td>
                      <td class="p-1.5">Porter Airlines baggage rules: carry-on size (21.5 x 15.5 x 9 in, max 20 lbs / 9 kg), personal item allowances, PorterClassic Basic vs Standard carry-on, and checked fees.</td>
                      <td class="p-1.5 font-mono text-emerald-700">https://gateready.ca/thumbnail.jpg</td>
                    </tr>
                    <tr>
                      <td class="p-1.5 font-mono font-bold">/airlines/delta-baggage</td>
                      <td class="p-1.5 font-mono">https://gateready.ca/airlines/delta-air-lines-baggage (301 target)</td>
                      <td class="p-1.5">Delta Air Lines baggage limits: carry-on dimensions (22 x 14 x 9 in), no maximum carry-on weight on domestic routes, $35 first checked bag fee, and Delta One allowances.</td>
                      <td class="p-1.5 font-mono text-emerald-700">https://gateready.ca/thumbnail.jpg</td>
                    </tr>
                    <tr>
                      <td class="p-1.5 font-mono font-bold">/baggage-fee-calculator</td>
                      <td class="p-1.5 font-mono">https://gateready.ca/baggage-fee-calculator</td>
                      <td class="p-1.5">Calculate checked bag fees, carry-on charges, and overweight surcharges across 42 global airlines with our standalone baggage fee calculator.</td>
                      <td class="p-1.5 font-mono text-emerald-700">https://gateready.ca/thumbnail.jpg</td>
                    </tr>
                    <tr>
                      <td class="p-1.5 font-mono font-bold">/entry-requirements</td>
                      <td class="p-1.5 font-mono">https://gateready.ca/entry-requirements</td>
                      <td class="p-1.5">Essential passport validity rules, 6-month rule, electronic travel authorizations (ESTA, eTA), and direct links to official government entry portals.</td>
                      <td class="p-1.5 font-mono text-emerald-700">https://gateready.ca/thumbnail.jpg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul class="space-y-1 list-disc list-inside mt-2">
                <li>Mode-aware entry notices: Road Trip, Train, and Bus itineraries display transport-accurate border rules without "by air" claims.</li>
                <li>Bus storage wording: updated bus bag subtitles to "Under-seat / cargo hold" and "No bus limit" without "overhead" phrasing.</li>
                <li>Silver feature list parity: synchronized the 8-item feature list identically across the plans dialog and /pricing page.</li>
                <li>Post-reload authenticated state: eliminated guest header/banner flash on reload for signed-in accounts.</li>
              </ul>
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <div class="font-bold text-purple-900 text-sm">October 28, 2026 — Multi-Modal Travel Integrity & Stability Release</div>
            <ul class="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
              <li>Trip editor save stability: resolved hook order in baggage fee calculators so switching modes (Train, Bus, Cruise, Road Trip) or carriers (e.g. Air Canada) saves and persists with zero ErrorBoundary crashes.</li>
              <li>Strict mode value isolation: airline values and aircraft types are never carried over into rail/bus/cruise/car itineraries, and empty seat/cabin classes show "Not set" rather than defaulting to "Standard Main Cabin".</li>
              <li>Mode-aware allowance headers: allowance titles reflect the travel mode ("Rail Carry-On Allowance:", "Bus Luggage Allowance:", "Cruise Baggage Allowance:", "Vehicle Cargo Allowance:").</li>
              <li>Residual flight terminology clearance: removed flight wording on non-flight itineraries (countdown prompts use "track departure", transit hub descriptions omit airport-only notes, and TSA 3-1-1 liquids rule is flight-only).</li>
              <li>No-limit carrier bag spec editor: for carriers with no strict carry-on weight limit (e.g. Air Canada), the bag editor no longer pre-fills 22 lbs and displays an "Ignored / No Limit" indicator.</li>
              <li>Save-gate trigger scope confirmation: verified anonymous user save-gate trigger as strictly once-per-session (sessionStorage).</li>
            </ul>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900 text-sm">October 26, 2026</div>
            <ul class="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
              <li>Overweight warning typography: verified "Surcharges may apply" across all alert and banner strings.</li>
              <li>Canonical plan limits alignment: synchronized /pricing with in-app dialog (Gold MOST POPULAR, Silver unlimited bags, Gold unlimited active trips).</li>
              <li>Displayed weight percentage synchronization: headroom percentage is computed directly from displayed rounded weight (21.9 / 22 lbs shows 99.5%, 22.5 / 22 lbs shows 102.3%).</li>
              <li>Carrier limits in readiness: Air Canada carry-on bags (no weight limit) are never flagged as overweight.</li>
              <li>Mobile header optimization: eliminated crowding and pill overlap on narrow phone screens (~390px).</li>
              <li>Public policy cleanup: removed unconfigured owner placeholder text and removed landing testimonials.</li>
              <li>TSA 3-1-1 "Checker" terminology audit: standardized rule-based liquids audit naming across all app views.</li>
              <li>Unset departure time handling: trips without an entered time display date only or "time not set" without defaulting to 09:00.</li>
              <li>Hidden ad placeholders: ad placement slots render zero visible markup until an ad network ID is configured.</li>
              <li>FAQ multi-open accordion & CTA hierarchy: multiple FAQ items can expand simultaneously; primary hero CTA is prominent over secondary tools.</li>
              <li>Bing scan & SEO alignment: shortened title to 44 characters, added server-rendered H1 tag, and optimized search metadata.</li>
            </ul>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900 text-sm">October 24, 2026</div>
            <ul class="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
              <li>Plan-limit notice trip scoping: limit notices clear immediately when trips are deleted.</li>
              <li>Air Canada limit synchronization: list card unified with detail view ("No airline weight limit · Air Canada").</li>
              <li>Climate no-date state: clear placeholder guidance before travel dates are picked.</li>
              <li>Full trust & compliance center: 12 dedicated pages for About, Privacy, Terms, Contact, FAQ, Pricing, How It Works, Cookies, Refunds, Changelog, Security, and Reviews standby.</li>
            </ul>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900 text-sm">Earlier October 2026</div>
            <ul class="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
              <li>Strict Free plan enforcement (1 traveler, 2 bags max, max 1 checked).</li>
              <li>Referral program transparency ($4.99 value labeled).</li>
              <li>Per-airline fee calculation matrix for 42+ carriers.</li>
              <li>Standardized luggage tare weight presets.</li>
              <li>Overweight warning percentages and carrier carry-on limits.</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  } else if (pathname === '/security') {
    innerContentHtml = `
      <div class="text-xs text-slate-500 font-medium">Last updated: October 24, 2026</div>
      <section class="space-y-3 mt-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Security & Safeguards</h2>
        <p class="text-slate-700 leading-relaxed">GateReady is designed with client-side isolation, data minimalism, and encrypted authentication.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
          <div class="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
            <strong>Guest Storage Isolation:</strong> Guest packing lists remain in browser localStorage and never touch cloud databases.
          </div>
          <div class="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
            <strong>Firebase Authentication:</strong> Encrypted HTTPS/TLS sessions and email verification for user accounts.
          </div>
          <div class="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
            <strong>Lemon Squeezy Payments:</strong> PCI-DSS compliant checkout; GateReady never stores credit card details.
          </div>
          <div class="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
            <strong>No Data Selling:</strong> We do not sell or rent traveler data to brokers or marketers.
          </div>
        </div>
        <div class="pt-2 text-xs text-slate-600">Report vulnerabilities to <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a>.</div>
      </section>
    `;
  } else if (normalizedPath === '/reviews') {
    // STANDBY ONLY - EXACT COPY - ZERO FAKE REVIEWS
    innerContentHtml = `
      <section class="text-center py-8 space-y-4 max-w-xl mx-auto">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Traveler Reviews</h2>
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-slate-700 text-sm leading-relaxed">
          Reviews from real travelers will appear here once GateReady has enough verified users. Want to be one of the first? Create a free trip and tell us what you think at <a href="mailto:csmappholdings@gmail.com" class="font-bold text-purple-600 underline">csmappholdings@gmail.com</a>.
        </div>
      </section>
    `;
  }

  const bodyHtml = renderPageShell(meta, innerContentHtml);
  return { meta, bodyHtml };
}

export function renderPageShell(meta: StaticPageMeta, innerContentHtml: string): string {
  const footerLinksHtml = `
    <footer class="w-full bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
      <div class="max-w-[1550px] mx-auto space-y-8">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <span class="font-black text-lg tracking-tight text-white">Gate<span class="text-purple-400">Ready</span></span>
            <span class="text-slate-600">|</span>
            <span class="text-slate-400">Smart Trip Packing & Baggage Limits</span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs pb-4">
          <!-- Column 1: Tools -->
          <div class="space-y-2.5">
            <h3 class="font-bold text-[11px] uppercase tracking-wider text-purple-400">Tools</h3>
            <ul class="space-y-2 text-slate-400">
              <li><a href="/airlines" class="hover:text-purple-300 transition-colors">Airline Baggage Guides</a></li>
              <li><a href="/baggage-fee-calculator" class="hover:text-purple-300 transition-colors">Baggage Fee Calculator</a></li>
              <li><a href="/tare-weight" class="hover:text-purple-300 transition-colors">Tare Weight Guide</a></li>
              <li><a href="/entry-requirements" class="hover:text-purple-300 transition-colors">Entry Requirements</a></li>
            </ul>
          </div>
          <!-- Column 2: Product -->
          <div class="space-y-2.5">
            <h3 class="font-bold text-[11px] uppercase tracking-wider text-purple-400">Product</h3>
            <ul class="space-y-2 text-slate-400">
              <li><a href="/pricing" class="hover:text-purple-300 transition-colors">Pricing & Plans</a></li>
              <li><a href="/how-it-works" class="hover:text-purple-300 transition-colors">How It Works</a></li>
              <li><a href="/about" class="hover:text-purple-300 transition-colors">About</a></li>
              <li><a href="/faq" class="hover:text-purple-300 transition-colors">FAQ</a></li>
              <li><a href="/changelog" class="hover:text-purple-300 transition-colors">Changelog</a></li>
            </ul>
          </div>
          <!-- Column 3: Support & Legal -->
          <div class="space-y-2.5">
            <h3 class="font-bold text-[11px] uppercase tracking-wider text-purple-400">Support & Legal</h3>
            <ul class="space-y-2 text-slate-400">
              <li><a href="/contact" class="hover:text-purple-300 transition-colors text-purple-300 font-medium">Contact Support</a></li>
              <li><a href="/privacy" class="hover:text-purple-300 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" class="hover:text-purple-300 transition-colors">Terms of Service</a></li>
              <li><a href="/cookies" class="hover:text-purple-300 transition-colors">Cookies & Storage</a></li>
              <li><a href="/refunds" class="hover:text-purple-300 transition-colors">14-Day Refunds</a></li>
              <li><a href="/security" class="hover:text-purple-300 transition-colors">Security Safeguards</a></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 pt-4 border-t border-slate-800/80">
          <div>© CSM App Holdings · GateReady (gateready.ca) · All rights reserved.</div>
          <div>Sole official contact: <a href="mailto:csmappholdings@gmail.com" class="text-slate-400 hover:text-purple-300 underline">csmappholdings@gmail.com</a></div>
        </div>
      </div>
    </footer>
  `;

  return `
    <header class="w-full bg-white border-b border-purple-100 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5">
      <div class="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <a href="/" class="text-xs font-bold text-slate-600 hover:text-purple-600">← Back to App</a>
          <span class="text-slate-300">|</span>
          <a href="/" class="font-black text-base tracking-tight text-slate-900">Gate<span class="text-purple-600">Ready</span></a>
        </div>
        <div class="flex items-center gap-2">
          <a href="/airlines" class="hidden md:inline-block text-xs font-bold text-slate-600 hover:text-purple-600 px-3 py-1.5 rounded-xl">42 Airline Guides</a>
          <a href="/baggage-fee-calculator" class="hidden sm:inline-block text-xs font-bold text-slate-600 hover:text-purple-600 px-3 py-1.5 rounded-xl">Fee Calculator</a>
          <a href="/pricing" class="hidden sm:inline-block text-xs font-bold text-slate-600 hover:text-purple-600 px-3 py-1.5 rounded-xl">Plans from $1.99</a>
          <a href="/" class="h-9 px-4 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center justify-center">Create Your Trip (Free)</a>
        </div>
      </div>
    </header>
    <section class="w-full bg-purple-50/50 border-b border-purple-100/60 py-10 px-4 sm:px-6 lg:px-8 text-center">
      <div class="max-w-4xl mx-auto space-y-2">
        <div class="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-black uppercase tracking-wider">GateReady Travel Guide & Policy Reference</div>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">${meta.heading}</h1>
        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">${meta.subheading}</p>
      </div>
    </section>
    <main class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article class="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-10 text-slate-700 text-sm leading-relaxed space-y-6">
        ${innerContentHtml}
      </article>
    </main>
    ${footerLinksHtml}
  `;
}
