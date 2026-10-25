import { STATIC_PAGES, StaticPageMeta } from './pageMetadata';

export function getPageHtmlContent(pathname: string): { meta: StaticPageMeta; bodyHtml: string } | null {
  const meta = STATIC_PAGES[pathname];
  if (!meta) return null;

  const footerLinksHtml = `
    <footer class="w-full bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
      <div class="max-w-[1550px] mx-auto space-y-8">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <span class="font-black text-lg tracking-tight text-white">Gate<span class="text-purple-400">Ready</span></span>
            <span class="text-slate-600">|</span>
            <span class="text-slate-400">Smart Trip Packing & Baggage Limits</span>
          </div>
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
            <a href="/about" class="hover:text-purple-300">About</a>
            <a href="/how-it-works" class="hover:text-purple-300">How It Works</a>
            <a href="/pricing" class="hover:text-purple-300">Pricing & Plans</a>
            <a href="/faq" class="hover:text-purple-300">FAQ</a>
            <a href="/contact" class="hover:text-purple-300">Contact Support</a>
            <a href="/privacy" class="hover:text-purple-300">Privacy Policy</a>
            <a href="/terms" class="hover:text-purple-300">Terms of Service</a>
            <a href="/cookies" class="hover:text-purple-300">Cookies & Storage</a>
            <a href="/refunds" class="hover:text-purple-300">14-Day Refunds</a>
            <a href="/security" class="hover:text-purple-300">Security Safeguards</a>
            <a href="/changelog" class="hover:text-purple-300">Changelog</a>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© CSM App Holdings · GateReady (gateready.ca) · All rights reserved.</div>
          <div>Sole official contact: <a href="mailto:csmappholdings@gmail.com" class="text-slate-400 hover:text-purple-300 underline">csmappholdings@gmail.com</a></div>
        </div>
      </div>
    </footer>
  `;

  let innerContentHtml = '';

  if (pathname === '/about') {
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
            <p class="text-xs text-slate-600 mt-1">Accounts for empty luggage shell weight (e.g. 7.0 lbs carry-on, 10.5 lbs checked hardcase) plus individual packed items to predict actual airport scale readings.</p>
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
          <li><strong>No physical scale hardware:</strong> The app predicts and models weights based on tare estimates and item catalog benchmarks.</li>
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
      <div class="text-xs text-slate-500 font-medium">Last updated: October 24, 2026</div>
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
        <p class="text-xs text-slate-600">You may delete any trip list directly inside the app at any time. To permanently delete your account and associated synced data, email our support team at <a href="mailto:csmappholdings@gmail.com" class="text-purple-600 underline">csmappholdings@gmail.com</a>.</p>
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
        <p class="text-xs text-slate-600">GateReady offers: Free ($0; 1 traveler, 2 bags max, max 1 checked, 1 active trip); Silver ($1.99/mo or $19.99/yr); Gold ($3.99/mo or $29.99/yr); Platinum ($4.99/mo or $39.99/yr). Free account signup auto-activates a 7-day full Platinum trial with no credit card required, which drops back to Free on day 7. All paid subscriptions are billed via Lemon Squeezy with a 14-day money-back guarantee.</p>
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
        <div class="text-xl font-black text-slate-900"><a href="mailto:csmappholdings@gmail.com" class="underline text-purple-700">csmappholdings@gmail.com</a></div>
        <div class="text-xs text-slate-600">Expected response: We aim to reply to all inquiries within a few business days. (We do not offer 24/7 support).</div>
      </section>
      <section class="space-y-2 pt-6 border-t border-slate-200 text-xs text-slate-600">
        <h3 class="font-bold text-slate-900 text-sm">Operating Company:</h3>
        <div>CSM App Holdings · gateready.ca</div>
        <div>Business Address: [TO BE PROVIDED BY OWNER]</div>
        <div>Registration Number: [TO BE PROVIDED BY OWNER]</div>
      </section>
    `;
  } else if (pathname === '/faq') {
    innerContentHtml = `
      <section class="space-y-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        <div class="space-y-4 pt-3">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">How do the free account and 7-day Platinum trial work?</h3>
            <p class="text-xs text-slate-600 mt-1">Creating a free account automatically activates a 7-day full Platinum trial. No credit card is required. You get immediate access to unlimited trips, bags, tare weight calibration, and terminal maps.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">What happens at day 7?</h3>
            <p class="text-xs text-slate-600 mt-1">Your account drops back to the Free plan ($0 forever). All your packing lists stay saved in your account. You will never be billed automatically without explicit checkout.</p>
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
      <section class="space-y-4">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">GateReady Pricing & Plans</h2>
        <p class="text-slate-700 leading-relaxed">Free for solo travelers, with affordable upgrades for families, frequent flyers, and multi-bag itineraries.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900">Free ($0)</h3>
            <p class="text-xs text-slate-600 mt-1">1 traveler, 2 bags max (max 1 checked), 1 active trip list, 42-airline allowance reference.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-purple-900">Silver ($1.99/mo · $19.99/yr)</h3>
            <p class="text-xs text-slate-600 mt-1">Up to 4 bags, empty suitcase tare weight deduction, emergency QR recovery tag, terminal maps.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-purple-900">Gold ($3.99/mo · $29.99/yr)</h3>
            <p class="text-xs text-slate-600 mt-1">Up to 8 bags, 3 active trips, printable PDF manifests, destination climate forecasts.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border-2 border-purple-600">
            <h3 class="font-bold text-purple-900">Platinum ($4.99/mo · $39.99/yr)</h3>
            <p class="text-xs text-slate-600 mt-1">Unlimited bags, unlimited active trips, unlimited travelers, priority fee update requests.</p>
          </div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-100 text-xs text-slate-600 space-y-1">
          <div><strong>7-Day Free Platinum Trial:</strong> Free signup includes 7 days full Platinum, no credit card required. Drops to Free on day 7.</div>
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
            <h3 class="font-bold text-slate-900">1. Select Destination & Operating Airline</h3>
            <p class="text-xs text-slate-600 mt-1">Choose from 42+ airlines to load pre-calibrated carry-on sizer dimensions and checked luggage weight limits.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">2. Calibrate Luggage Tare Weight</h3>
            <p class="text-xs text-slate-600 mt-1">Deduct empty bag shell weight (typically 7 to 11 lbs) to ensure packed items match airport ticket counter scales.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">3. Pack Items & Check TSA 3-1-1 Liquids</h3>
            <p class="text-xs text-slate-600 mt-1">Check liquid bottles against the 3.4 oz (100ml) limit to keep carry-ons compliant with security checkpoints.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">4. Real-Time Baggage Limit Meters</h3>
            <p class="text-xs text-slate-600 mt-1">Predict overweight surcharges before leaving home and redistribute weight across your luggage.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <h3 class="font-bold text-slate-900">5. Departure Readiness Checklist & Manifests</h3>
            <p class="text-xs text-slate-600 mt-1">Check off power bank safety rules, medications, passports, and print clean manifests.</p>
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
        <p class="text-xs text-slate-600">Cancel renewals anytime via account settings. The 7-day Platinum trial on free signup never bills automatically.</p>
      </section>
    `;
  } else if (pathname === '/changelog') {
    innerContentHtml = `
      <section class="space-y-3">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">GateReady Product Changelog</h2>
        <div class="space-y-4 pt-2">
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <div class="font-bold text-purple-900 text-sm">October 24, 2026</div>
            <ul class="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
              <li>Plan-limit notice trip scoping: limit notices clear immediately when trips are deleted.</li>
              <li>Air Canada limit synchronization: list card unified with detail view ("No airline weight limit · Air Canada").</li>
              <li>Typo fix: corrected "Surcharges" spelling in luggage warning alerts.</li>
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
  } else if (pathname === '/reviews') {
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

  const bodyHtml = `
    <header class="w-full bg-white border-b border-purple-100 shadow-2xs px-4 sm:px-6 lg:px-8 py-3.5">
      <div class="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <a href="/" class="text-xs font-bold text-slate-600 hover:text-purple-600">← Back to App</a>
          <span class="text-slate-300">|</span>
          <a href="/" class="font-black text-base tracking-tight text-slate-900">Gate<span class="text-purple-600">Ready</span></a>
        </div>
        <div class="flex items-center gap-2">
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

  return { meta, bodyHtml };
}
