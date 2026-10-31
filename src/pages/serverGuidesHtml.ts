import { AIRLINE_GUIDES, AirlineGuideItem } from '../data/airlineGuidesData';

export function getAirlinePageHtml(guide: AirlineGuideItem): string {
  const isNoLimit = (guide.limits.carryOnWeightLimit || '').toLowerCase().includes('no');

  return `
    <div class="space-y-8">
      <!-- Quick Action Badges -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
        <div class="flex items-center gap-2">
          <span class="text-2xl">${guide.flag}</span>
          <div>
            <div class="font-black text-slate-900 text-sm">${guide.name} Baggage Verification</div>
            <div class="text-[11px] text-purple-700 font-semibold">${guide.countryLabel} · Verified ${guide.fees.lastVerified}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a href="/baggage-fee-calculator?airline=${encodeURIComponent(guide.name)}" class="h-8 px-3 rounded-xl bg-white border border-purple-200 text-purple-900 text-xs font-bold inline-flex items-center gap-1 hover:bg-purple-100">
            Calculate ${guide.name} Fees →
          </a>
          <a href="/?action=new_trip&mode=PLANE&carrier=${encodeURIComponent(guide.name)}" class="h-8 px-3 rounded-xl bg-purple-600 text-white text-xs font-bold inline-flex items-center gap-1 hover:bg-purple-700">
            Pack for ${guide.name}
          </a>
        </div>
      </div>

      <!-- Section 1: Carry-On Allowance -->
      <section class="space-y-3">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">1. Carry-On & Personal Item Allowance</h2>
        <p class="text-xs text-slate-600">Items permitted into the aircraft cabin free or on standard fares:</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-slate-700">Personal Item</span>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Included Free</span>
            </div>
            <div class="text-sm font-bold text-slate-900">${guide.limits.personalLimit}</div>
            <p class="text-xs text-slate-600">Must fit completely under the passenger seat in front of you.</p>
          </div>

          <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-purple-900">Standard Carry-On Roller</span>
              ${guide.fees.carryOnFee === 0 
                ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Included on Standard Fares</span>'
                : `<span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Fee Applies (${guide.fees.currencySymbol}${guide.fees.carryOnFee})</span>`}
            </div>
            <div class="text-sm font-bold text-slate-900">${guide.limits.carryOnLimit}</div>
            <div class="text-xs font-semibold text-purple-900">
              Weight Allowance: <strong>${guide.limits.carryOnWeightLimit}</strong>
            </div>
            <p class="text-xs text-slate-600">Must fit inside airport gate sizer bins and into overhead lockers unassisted.</p>
          </div>
        </div>

        ${guide.limits.notes ? `
          <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <strong>Important Policy Note:</strong> ${guide.limits.notes}
          </div>
        ` : ''}
      </section>

      <!-- Section 2: Checked Baggage Allowance & Fee Table -->
      <section class="space-y-3 pt-4 border-t border-slate-100">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">2. Checked Baggage Limits & Published Fees</h2>
        <p class="text-xs text-slate-600">Standard checked suitcases checked at the airport terminal counter:</p>

        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">Luggage Tier</th>
                <th class="py-3 px-4">Standard Weight Limit</th>
                <th class="py-3 px-4">Published Fee</th>
                <th class="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">1st Checked Suitcase</td>
                <td class="py-3 px-4">${(guide.limits.checkedWeightLimit || '50 lbs (23 kg)').split(';')[0]}</td>
                <td class="py-3 px-4 font-black text-purple-700">
                  ${guide.fees.firstCheckedFee === 0 
                    ? 'FREE ($0)' 
                    : `${guide.fees.currencySymbol}${guide.fees.firstCheckedFee} ${guide.fees.currency}`}
                </td>
                <td class="py-3 px-4 text-slate-500 text-[11px]">${guide.fees.usdEquivalentNote || 'Standard economy ticket'}</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">2nd Checked Suitcase</td>
                <td class="py-3 px-4">${(guide.limits.checkedWeightLimit || '50 lbs (23 kg)').split(';')[0]}</td>
                <td class="py-3 px-4 font-black text-purple-700">
                  ${guide.fees.secondCheckedFee === 0 
                    ? 'FREE ($0)' 
                    : `${guide.fees.currencySymbol}${guide.fees.secondCheckedFee} ${guide.fees.currency}`}
                </td>
                <td class="py-3 px-4 text-slate-500 text-[11px]">Online prepaid rate</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Overweight Surcharge (51–70 lbs)</td>
                <td class="py-3 px-4">51 to 70 lbs (24–32 kg)</td>
                <td class="py-3 px-4 font-black text-rose-600">
                  +${guide.fees.currencySymbol}${guide.fees.overweightFee51to70lbs} ${guide.fees.currency}
                </td>
                <td class="py-3 px-4 text-slate-500 text-[11px]">Charged per overweight piece at the airport counter</td>
              </tr>
              ${guide.fees.oversizeFee ? `
                <tr>
                  <td class="py-3 px-4 font-bold text-slate-900">Oversize Bag (&gt;62 linear in)</td>
                  <td class="py-3 px-4">&gt;62 linear in (158 cm)</td>
                  <td class="py-3 px-4 font-black text-rose-600">
                    +${guide.fees.currencySymbol}${guide.fees.oversizeFee} ${guide.fees.currency}
                  </td>
                  <td class="py-3 px-4 text-slate-500 text-[11px]">Exceeding standard 62 linear inches (L+W+H)</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong class="block text-slate-900 font-bold mb-1">Standard Maximum Dimensions:</strong>
            <p class="text-slate-600">${guide.limits.checkedLimit}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong class="block text-slate-900 font-bold mb-1">Weight Allowance Bands:</strong>
            <p class="text-slate-600">${guide.limits.checkedWeightLimit}</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1">
          <strong class="block font-bold text-indigo-900">Fee Rules & Details:</strong>
          <p class="leading-relaxed">${guide.fees.feeNotes}</p>
        </div>
      </section>

      <!-- Section 3: Data Integrity Disclaimer -->
      <section class="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-2">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <strong class="text-slate-900 font-bold">GateReady Verification Standard</strong>
          <span class="text-slate-500">Last verified: ${guide.fees.lastVerified}</span>
        </div>
        <p class="leading-relaxed">
          Estimate from published airline fee tables, last verified ${guide.fees.lastVerified}. Airlines change fees and conditions frequently — always confirm at booking or on the carrier's official website.
        </p>
        <div class="pt-1">
          <a href="${guide.fees.officialBaggagePageUrl}" target="_blank" rel="noopener noreferrer" class="text-purple-700 hover:text-purple-900 font-bold underline">
            Visit Official ${guide.name} Baggage Page ↗
          </a>
        </div>
      </section>

      <!-- Section 4: Interactive Tools -->
      <section class="p-6 rounded-3xl bg-purple-600 text-white space-y-3">
        <h3 class="text-lg font-black tracking-tight">Pack with Confidence for Your ${guide.name} Flight</h3>
        <p class="text-xs text-purple-100 leading-relaxed max-w-xl">
          GateReady pre-calibrates ${guide.name}'s exact carry-on dimensions, deducts suitcase tare weight, and verifies liquid compliance.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <a href="/?action=new_trip&mode=PLANE&carrier=${encodeURIComponent(guide.name)}" class="h-9 px-4 rounded-xl bg-white text-purple-950 font-black text-xs inline-flex items-center justify-center hover:bg-purple-50">
            Create Trip with ${guide.name}
          </a>
          <a href="/baggage-fee-calculator?airline=${encodeURIComponent(guide.name)}" class="h-9 px-4 rounded-xl bg-purple-800 text-white font-bold text-xs inline-flex items-center justify-center hover:bg-purple-900">
            Calculate Baggage Fees
          </a>
          <a href="/airlines" class="h-9 px-4 rounded-xl bg-purple-700/60 text-white font-semibold text-xs inline-flex items-center justify-center hover:bg-purple-700">
            Browse All 42 Airlines
          </a>
        </div>
      </section>
    </div>
  `;
}

export function getAirlineIndexPageHtml(): string {
  const regionOrder: Array<'Canada' | 'USA' | 'Europe' | 'Asia'> = ['Canada', 'USA', 'Europe', 'Asia'];
  const regionTitles: Record<string, string> = {
    Canada: 'Canadian Airlines (5 Carriers)',
    USA: 'United States Airlines (11 Carriers)',
    Europe: 'European Airlines (13 Carriers)',
    Asia: 'Asia, Middle East & Pacific Airlines (13 Carriers)'
  };

  const sectionsHtml = regionOrder.map((region) => {
    const airlines = AIRLINE_GUIDES.filter((a) => a.region === region);
    const rows = airlines.map((a) => `
      <tr class="hover:bg-purple-50/40 transition-colors">
        <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
          <span class="text-lg">${a.flag}</span>
          <a href="${a.canonicalPath}" class="hover:text-purple-600 underline">${a.name}</a>
        </td>
        <td class="py-3 px-4 text-slate-600">${a.limits.carryOnLimit.split('(')[0].trim()}</td>
        <td class="py-3 px-4 font-bold ${(a.limits.carryOnWeightLimit || '').toLowerCase().includes('no') ? 'text-emerald-700' : 'text-purple-900'}">
          ${a.limits.carryOnWeightLimit 
            ? (a.limits.carryOnWeightLimit.includes('(') ? a.limits.carryOnWeightLimit.split('(')[0].trim() : a.limits.carryOnWeightLimit.split(';')[0].trim())
            : 'Rule applies'}
        </td>
        <td class="py-3 px-4 font-black text-purple-700">
          ${a.fees.firstCheckedFee === 0 ? 'FREE ($0)' : `${a.fees.currencySymbol}${a.fees.firstCheckedFee}`}
        </td>
        <td class="py-3 px-4 text-right">
          <a href="${a.canonicalPath}" class="text-xs font-bold text-purple-600 hover:text-purple-800">
            View Guide →
          </a>
        </td>
      </tr>
    `).join('');

    return `
      <section class="space-y-3 pt-4">
        <h2 class="text-lg font-black text-slate-900 tracking-tight">${regionTitles[region]}</h2>
        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">Airline</th>
                <th class="py-3 px-4">Carry-On Size</th>
                <th class="py-3 px-4">Carry-On Weight Cap</th>
                <th class="py-3 px-4">1st Checked Bag</th>
                <th class="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${rows}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }).join('');

  return `
    <div class="space-y-6">
      <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 leading-relaxed">
        GateReady provides pre-calibrated baggage limits and fee schedules for <strong>42 global airlines</strong>. Select any carrier below to review official carry-on dimensions, checked luggage allowances, overweight penalties, and packing tips.
      </div>

      ${sectionsHtml}

      <div class="pt-6 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-bold">
        <a href="/baggage-fee-calculator" class="text-purple-600 hover:underline">→ Interactive Baggage Fee Calculator</a>
        <a href="/tare-weight" class="text-purple-600 hover:underline">→ What is Luggage Tare Weight?</a>
        <a href="/entry-requirements" class="text-purple-600 hover:underline">→ International Travel Entry Rules</a>
      </div>
    </div>
  `;
}

export function getBaggageFeeCalculatorHtml(): string {
  return `
    <div class="space-y-6">
      <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 leading-relaxed">
        <strong>Standalone Baggage Fee Calculator:</strong> Calculate your luggage costs before heading to the airport. Our fee engine evaluates checked bag rates, carry-on fees, and overweight surcharges across 42 airlines without needing an account.
      </div>

      <section class="space-y-3">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">How Airline Baggage Fees Work</h2>
        <p class="text-xs text-slate-600 leading-relaxed">
          Most commercial airlines charge for checked bags on a tiered scale: 1st checked bag ($35–$40), 2nd checked bag ($45–$55), and 3rd+ bag ($100–$150). Ultra-low-cost carriers also charge for overhead carry-on bags.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong class="block text-slate-900 font-bold">Prepaid Online Savings:</strong>
            <p class="text-slate-600">Prepaying bags during online check-in saves $5 to $15 per bag compared to paying at the airport counter.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong class="block text-slate-900 font-bold">Overweight Risk (50 lbs):</strong>
            <p class="text-slate-600">Standard Economy checked bags are capped at 50 lbs (23 kg). Bags from 51 to 70 lbs incur a flat $100–$150 surcharge.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong class="block text-slate-900 font-bold">Basic Economy Limits:</strong>
            <p class="text-slate-600">United and unbundled carriers exclude overhead carry-ons on Basic Economy tickets, permitting an underseat bag only.</p>
          </div>
        </div>
      </section>

      <section class="space-y-3 pt-4 border-t border-slate-100">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Standard Airline Baggage Fee Reference (42 Airlines)</h2>
        <p class="text-xs text-slate-600">Sample published domestic/transatlantic standard economy rates:</p>

        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">Airline</th>
                <th class="py-3 px-4">Carry-On Fee</th>
                <th class="py-3 px-4">1st Checked Bag</th>
                <th class="py-3 px-4">2nd Checked Bag</th>
                <th class="py-3 px-4">Overweight Surcharge (51-70 lbs)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900"><a href="/airlines/air-canada-baggage" class="underline">Air Canada</a></td>
                <td class="py-3 px-4 text-emerald-700 font-bold">Free ($0)</td>
                <td class="py-3 px-4 font-bold">CAD $35</td>
                <td class="py-3 px-4">CAD $50</td>
                <td class="py-3 px-4 text-rose-600 font-bold">+CAD $100</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900"><a href="/airlines/westjet-baggage" class="underline">WestJet</a></td>
                <td class="py-3 px-4 text-emerald-700 font-bold">Free ($0)*</td>
                <td class="py-3 px-4 font-bold">CAD $35</td>
                <td class="py-3 px-4">CAD $50</td>
                <td class="py-3 px-4 text-rose-600 font-bold">+CAD $100</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900"><a href="/airlines/delta-air-lines-baggage" class="underline">Delta Air Lines</a></td>
                <td class="py-3 px-4 text-emerald-700 font-bold">Free ($0)</td>
                <td class="py-3 px-4 font-bold">$35 USD</td>
                <td class="py-3 px-4">$45 USD</td>
                <td class="py-3 px-4 text-rose-600 font-bold">+$100 USD</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900"><a href="/airlines/american-airlines-baggage" class="underline">American Airlines</a></td>
                <td class="py-3 px-4 text-emerald-700 font-bold">Free ($0)</td>
                <td class="py-3 px-4 font-bold">$35 USD</td>
                <td class="py-3 px-4">$45 USD</td>
                <td class="py-3 px-4 text-rose-600 font-bold">+$100 USD</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900"><a href="/airlines/southwest-airlines-baggage" class="underline">Southwest Airlines</a></td>
                <td class="py-3 px-4 text-emerald-700 font-bold">Free ($0)</td>
                <td class="py-3 px-4 text-emerald-700 font-black">2 BAGS FREE</td>
                <td class="py-3 px-4 text-emerald-700 font-black">FREE ($0)</td>
                <td class="py-3 px-4 text-rose-600 font-bold">+$100 USD</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900"><a href="/airlines/british-airways-baggage" class="underline">British Airways</a></td>
                <td class="py-3 px-4 text-emerald-700 font-bold">Free ($0)</td>
                <td class="py-3 px-4 font-bold">£35 (Basic) / Free</td>
                <td class="py-3 px-4">£65</td>
                <td class="py-3 px-4 text-rose-600 font-bold">+£65</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-[11px] text-slate-500">*UltraBasic fares on WestJet exclude carry-on bags. Rates compiled from published airline schedules.</p>
      </section>

      <section class="p-5 rounded-2xl bg-purple-600 text-white space-y-3">
        <h3 class="text-base font-black">Run Interactive Baggage Calculations in GateReady</h3>
        <p class="text-xs text-purple-100">
          Open our live interactive builder to add suitcases, simulate item weights, deduct suitcase tare weight, and prevent fees before departure.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="/" class="h-9 px-4 rounded-xl bg-white text-purple-950 font-black text-xs inline-flex items-center justify-center hover:bg-purple-50">
            Create Free Trip
          </a>
          <a href="/airlines" class="h-9 px-4 rounded-xl bg-purple-800 text-white font-bold text-xs inline-flex items-center justify-center hover:bg-purple-900">
            Explore All 42 Airline Guides
          </a>
        </div>
      </section>
    </div>
  `;
}

export function getTareWeightHtml(): string {
  return `
    <div class="space-y-6">
      <section class="space-y-3">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">The Definition of Tare Weight in Luggage</h2>
        <p class="text-sm text-slate-700 leading-relaxed">
          In travel and packing, <strong>tare weight</strong> is the empty weight of your suitcase, backpack, or duffel before anything is packed inside it.
        </p>
        <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 font-bold">
          Airport Scale Reading = Empty Suitcase Tare Weight + Weight of Packed Clothes & Items
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          Because airport check-in scales weigh the entire bag as a unit, a 10.5 lb empty hard-shell suitcase immediately consumes 21% of your airline's 50 lb (23 kg) allowance.
        </p>
      </section>

      <section class="space-y-3 pt-4 border-t border-slate-100">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Tare Weight Benchmarks by Luggage Material</h2>
        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">Bag Type</th>
                <th class="py-3 px-4">Material</th>
                <th class="py-3 px-4">Average Tare Weight</th>
                <th class="py-3 px-4">Impact on 50 lb Limit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Personal Item Backpack (16–18")</td>
                <td class="py-3 px-4">Lightweight Fabric</td>
                <td class="py-3 px-4 font-bold text-purple-700">1.8 lbs (0.8 kg)</td>
                <td class="py-3 px-4 text-slate-500">Under seat storage</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Carry-On Roller (21–22")</td>
                <td class="py-3 px-4">Polycarbonate Hard-Shell</td>
                <td class="py-3 px-4 font-bold text-purple-700">7.0 lbs (3.2 kg)</td>
                <td class="py-3 px-4 text-slate-500">Consumes 32% of 22-lb limit</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Carry-On Roller (21–22")</td>
                <td class="py-3 px-4">Ballistic Soft Nylon</td>
                <td class="py-3 px-4 font-bold text-purple-700">6.2 lbs (2.8 kg)</td>
                <td class="py-3 px-4 text-slate-500">Consumes 28% of 22-lb limit</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Medium Checked Bag (24–26")</td>
                <td class="py-3 px-4">Hard Polycarbonate</td>
                <td class="py-3 px-4 font-bold text-purple-700">8.8 lbs (4.0 kg)</td>
                <td class="py-3 px-4 text-slate-500">17.6% of 50-lb allowance</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-bold text-slate-900">Large Checked Suitcase (28–30")</td>
                <td class="py-3 px-4">Heavy Hard Shell / Aluminum</td>
                <td class="py-3 px-4 font-bold text-rose-600">11.5–13.0 lbs (5.2–5.9 kg)</td>
                <td class="py-3 px-4 text-rose-600 font-bold">Up to 26% of allowance!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="space-y-3 pt-4 border-t border-slate-100">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">How GateReady Accounts for Suitcase Tare</h2>
        <p class="text-xs text-slate-600 leading-relaxed">
          GateReady lets travelers configure bag shell materials and tare weights down to 0.1 lbs. As you pack shirts, toiletries, and shoes, our algorithm calculates remaining scale headroom so you never arrive at the airport with a 50.8 lb suitcase.
        </p>
        <div class="pt-2">
          <a href="/" class="h-9 px-4 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center gap-1.5 hover:bg-purple-700">
            Try GateReady Tare Weight Calculator Free
          </a>
        </div>
      </section>
    </div>
  `;
}

export function getEntryRequirementsHtml(): string {
  return `
    <div class="space-y-6">
      <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 leading-relaxed">
        <strong>International Entry Verification Hub:</strong> Review passport validity standards, electronic travel authorizations, TSA checkpoint rules, and authoritative links to official national travel advisory portals.
      </div>

      <section class="space-y-3">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Official Government Travel Portals</h2>
        <p class="text-xs text-slate-600 leading-relaxed">
          Always check official government immigration and border services prior to departure:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong class="block text-slate-900 font-bold">🇨🇦 Canada: travel.gc.ca</strong>
            <p class="text-slate-600">Official Government of Canada travel advisories, entry requirements, eTA eligibility, and passport rules.</p>
            <a href="https://travel.gc.ca" target="_blank" rel="noopener noreferrer" class="text-purple-600 underline font-semibold block pt-1">Visit travel.gc.ca ↗</a>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong class="block text-slate-900 font-bold">🇺🇸 United States: travel.state.gov</strong>
            <p class="text-slate-600">U.S. Department of State country information, ESTA visa waiver verification, and passport validity advisories.</p>
            <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" class="text-purple-600 underline font-semibold block pt-1">Visit travel.state.gov ↗</a>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong class="block text-slate-900 font-bold">🇬🇧 United Kingdom: gov.uk/foreign-travel-advice</strong>
            <p class="text-slate-600">FCDO foreign travel advice for 226 countries, UK entry clearance, and transit requirements.</p>
            <a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noopener noreferrer" class="text-purple-600 underline font-semibold block pt-1">Visit gov.uk ↗</a>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong class="block text-slate-900 font-bold">🇪🇺 European Union: europa.eu/youreurope</strong>
            <p class="text-slate-600">Schengen entry/exit regulations, short-stay 90/180-day limits, and upcoming ETIAS requirements.</p>
            <a href="https://europa.eu/youreurope" target="_blank" rel="noopener noreferrer" class="text-purple-600 underline font-semibold block pt-1">Visit europa.eu ↗</a>
          </div>
        </div>
      </section>

      <section class="space-y-3 pt-4 border-t border-slate-100">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">The 6-Month Passport Validity Rule</h2>
        <p class="text-xs text-slate-600 leading-relaxed">
          Many countries require that your passport be valid for at least 6 months beyond your departure date from that country. Airlines strictly enforce this rule at the check-in gate to avoid fines. If your passport expires within six months, renew it before traveling.
        </p>
      </section>

      <section class="space-y-3 pt-4 border-t border-slate-100">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">TSA 3-1-1 Liquids Security Rule</h2>
        <p class="text-xs text-slate-600 leading-relaxed">
          Containers in carry-on luggage must be 3.4 oz (100 ml) or less, and all bottles must fit into one clear quart-sized zip-top plastic bag (one bag per passenger). Larger containers must be checked.
        </p>
      </section>
    </div>
  `;
}

export function getHomepageHtml(): string {
  const airlineLinks = AIRLINE_GUIDES.map((g) => `
    <a href="${g.canonicalPath}" class="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-colors flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <span class="text-lg">${g.flag}</span>
        <span class="font-bold text-slate-900">${g.name}</span>
      </div>
      <span class="text-purple-600 font-semibold text-[11px]">View Rules →</span>
    </a>
  `).join('');

  return `
    <div class="space-y-8">
      <!-- Hero Intro -->
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Smart Luggage Packing, Sizer Verification & Baggage Fee Engine</h2>
        <p class="text-base text-slate-700 leading-relaxed">
          GateReady is the dedicated travel packing platform that models empty suitcase tare weights, verifies luggage dimensions against airline gate sizers, audits TSA 3-1-1 liquids compliance, and calculates baggage fees across 42+ global airlines.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <a href="/baggage-fee-calculator" class="h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-colors">
            Calculate Baggage Fees →
          </a>
          <a href="/airlines" class="h-10 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs inline-flex items-center gap-2 transition-colors">
            Browse 42 Airline Guides
          </a>
          <a href="/tare-weight" class="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs inline-flex items-center gap-2 transition-colors">
            Tare Weight Guide
          </a>
          <a href="/entry-requirements" class="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs inline-flex items-center gap-2 transition-colors">
            Entry Requirements
          </a>
        </div>
      </section>

      <!-- Quick Checkers -->
      <section class="space-y-4 pt-6 border-t border-slate-200">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Free Travel Intelligence Tools & Checkers</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <h3 class="font-bold text-purple-950 text-base">Airline Baggage Allowance Guides</h3>
            <p class="text-xs text-slate-600">Verified carry-on dimensions, weight caps, and checked fee tables for 42 major airlines across North America, Europe, Asia, and worldwide.</p>
            <a href="/airlines" class="text-xs font-bold text-purple-700 hover:text-purple-900 inline-block pt-1">Explore all 42 airlines →</a>
          </div>

          <div class="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <h3 class="font-bold text-purple-950 text-base">Standalone Baggage Fee Calculator</h3>
            <p class="text-xs text-slate-600">Model carry-on charges, first and second checked bag fees, fare families, and overweight surcharges before heading to the airport.</p>
            <a href="/baggage-fee-calculator" class="text-xs font-bold text-purple-700 hover:text-purple-900 inline-block pt-1">Open fee calculator →</a>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 class="font-bold text-slate-900 text-base">Luggage Tare Weight Explainer</h3>
            <p class="text-xs text-slate-600">Learn why empty suitcases consume 15% to 25% of your airline weight allowance, and how tare deduction prevents airport counter fees.</p>
            <a href="/tare-weight" class="text-xs font-bold text-purple-700 hover:text-purple-900 inline-block pt-1">Read tare weight guide →</a>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 class="font-bold text-slate-900 text-base">International Entry Requirements Hub</h3>
            <p class="text-xs text-slate-600">Check the 6-month passport validity rule, electronic travel authorizations (ESTA, eTA, ETIAS), and official government advisories.</p>
            <a href="/entry-requirements" class="text-xs font-bold text-purple-700 hover:text-purple-900 inline-block pt-1">View entry requirements →</a>
          </div>
        </div>
      </section>

      <!-- 42 Airline Directory Links -->
      <section class="space-y-4 pt-6 border-t border-slate-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-900 tracking-tight">42 Major Airlines Baggage Policy Directory</h2>
          <a href="/airlines" class="text-xs font-bold text-purple-600 hover:text-purple-800">View Full Directory →</a>
        </div>
        <p class="text-xs text-slate-600">Select any airline below to view exact carry-on dimensions, overhead sizer limits, checked baggage rates, and fare families:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${airlineLinks}
        </div>
      </section>

      <!-- Core Features -->
      <section class="space-y-4 pt-6 border-t border-slate-200">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Key Packing & Baggage Capabilities</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">Per-Bag Weight Meters with Tare Calibration</h3>
            <p class="text-xs text-slate-600 mt-1">Deduct empty bag shell weight (e.g., 7.2 lbs carry-on, 10.4 lbs checked roller) to track true airline scale totals.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">TSA 3-1-1 Liquids Compliance Rule</h3>
            <p class="text-xs text-slate-600 mt-1">Detects containers over 3.4 oz (100ml) packed in carry-on bags and prompts you to move them to checked luggage.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">Multi-Mode Travel Support</h3>
            <p class="text-xs text-slate-600 mt-1">Configure trips for Flight, Train, Bus, Cruise, or Road Trip with tailored vehicle allowances and baggage guidance.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">Travel Wallet & Departure Readiness</h3>
            <p class="text-xs text-slate-600 mt-1">Store loyalty numbers, TSA PreCheck, PNRs, departure countdowns, and printable PDF packing manifests.</p>
          </div>
        </div>
      </section>

      <!-- Pricing Summary -->
      <section class="space-y-4 pt-6 border-t border-slate-200">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Simple, Transparent Pricing</h2>
        <p class="text-xs text-slate-600">Free forever starter tier with affordable upgrades. 14-day money-back guarantee on all paid plans via Lemon Squeezy.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-xs font-bold text-slate-500 uppercase">Starter</div>
            <h3 class="font-black text-lg text-slate-900">Free ($0)</h3>
            <p class="text-xs text-slate-600 mt-1">1 traveler, 1 active trip, 2 bags max (max 1 checked), TSA liquids rule check.</p>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <div class="text-xs font-bold text-purple-700 uppercase">Solo Pro</div>
            <h3 class="font-black text-lg text-purple-900">Silver ($1.99/mo)</h3>
            <p class="text-xs text-slate-600 mt-1">1 traveler, 2 active trips, unlimited bags, suitcase tare deduction, travel wallet (loyalty numbers, TSA PreCheck, PNRs).</p>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500">
            <div class="text-[10px] font-black uppercase text-amber-800">MOST POPULAR</div>
            <h3 class="font-black text-lg text-slate-900">Gold ($3.99/mo)</h3>
            <p class="text-xs text-slate-600 mt-1">2 travelers, unlimited active trips, unlimited bags & scales, multi-device sync, printable PDF manifests ($29.99/yr).</p>
          </div>
          <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div class="text-xs font-bold text-indigo-700 uppercase">Family & Frequent</div>
            <h3 class="font-black text-lg text-indigo-900">Platinum ($4.99/mo)</h3>
            <p class="text-xs text-slate-600 mt-1">Unlimited travelers, unlimited devices, unlimited trips, unlimited bags & scales, priority fee updates ($39.99/yr).</p>
          </div>
        </div>
        <div class="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 text-xs text-purple-950 space-y-1">
          <div><strong>7-Day Free Platinum Trial:</strong> Free signup automatically activates 7 days of full Platinum features. No credit card required. Returns to Free on day 7.</div>
          <div><strong>14-Day Refund Guarantee:</strong> 100% money-back guarantee on all paid plans. Contact <a href="mailto:csmappholdings@gmail.com" class="text-purple-700 underline font-semibold">csmappholdings@gmail.com</a>.</div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="space-y-4 pt-6 border-t border-slate-200">
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        <div class="space-y-3">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">How does the 7-day free trial work?</h3>
            <p class="text-xs text-slate-600 mt-1">Creating a free account immediately grants full Platinum access for 7 days without requiring a payment method. At day 7, your account automatically returns to the Free plan with all saved lists intact.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">Are baggage fees guaranteed?</h3>
            <p class="text-xs text-slate-600 mt-1">Baggage fees are estimates derived from published airline baggage tables. Because carriers adjust fees dynamically by route, fare family, and booking channel, always confirm with your operating airline prior to travel.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">What is tare weight and why does it matter?</h3>
            <p class="text-xs text-slate-600 mt-1">Tare weight is the weight of an empty suitcase. Hardcase checked luggage typically weighs 8 to 11 lbs empty, which consumes up to 22% of a standard 50-lb baggage allowance before a single item is packed.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 text-sm">How does the TSA 3-1-1 checker work?</h3>
            <p class="text-xs text-slate-600 mt-1">The TSA checker is a list-based rule audit comparing packed toiletries in carry-on bags against the 3.4 oz (100ml) limitation. It is not an optical or hardware scanner.</p>
          </div>
        </div>
      </section>

      <!-- Verified Truths Notice -->
      <section class="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
        <strong class="font-bold block text-sm text-amber-900">GateReady Honesty Policy & Disclaimers:</strong>
        <p>GateReady is a trip planning assistant. Baggage fee figures are estimates based on published tables, not carrier guarantees. The TSA checker is rule-based, not an x-ray or hardware scanner. GateReady does not provide real-time flight telemetry, gate change alerts, GPS bag beacons, or hardware scales.</p>
        <p>Operated by <strong>CSM App Holdings</strong> · Sole official support contact: <a href="mailto:csmappholdings@gmail.com" class="font-semibold underline">csmappholdings@gmail.com</a>.</p>
      </section>
    </div>
  `;
}
