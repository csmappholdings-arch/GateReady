import React from 'react';
import { PageLayout } from './PageLayout';
import { 
  Scale, 
  Droplets, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  QrCode, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  Mail,
  Building2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <PageLayout pathname="/about">
      {/* Intro */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Who GateReady Is For
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300">
          GateReady (<strong>gateready.ca</strong>) is a dedicated trip packing app built for travelers who want to eliminate overweight baggage fees, avoid TSA security confiscations, and prevent surprises at the boarding gate.
        </p>
        <p>
          Whether you are flying on a budget carrier with strict 15-lb carry-on restrictions, embarking on an international family vacation with multiple checked suitcases, or taking a weekend trip with only a personal backpack, GateReady gives you structured luggage confidence before you leave home.
        </p>
      </section>

      {/* What it Does */}
      <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          What GateReady Does (In Plain Language)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Per-Bag Weight Meters & Tare Deduction</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Accounts for empty luggage shell weight (e.g. 7.0 lbs carry-on, 10.5 lbs checked hardcase) plus individual packed items to predict actual airport scale readings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>TSA 3-1-1 Liquids Compliance Rule</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Evaluates toiletry bottle volumes in carry-on bags against the 3.4 oz (100ml) security limit, advising you to relocate larger bottles to checked luggage.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>42-Airline Baggage Allowance Reference</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pre-calibrated carry-on sizer dimensions (inches & cm) and checked weight caps for 42+ major global carriers, including Air Canada, WestJet, Delta, United, and British Airways.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Departure Readiness Tracking</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Item-by-item packing checklists, gate-check safety reminders (power banks, IDs, medications), and departure countdown schedules.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <Printer className="w-4 h-4 text-purple-600" />
              <span>Printable & Shareable Lists</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Generate clean, physical PDF manifests or share packing summaries with family travelers in a single click.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <QrCode className="w-4 h-4 text-amber-500" />
              <span>Emergency QR Bag Recovery Tags (Silver+)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Printable luggage tags containing encoded emergency contact information to help baggage handlers return lost bags without exposing your home address.
            </p>
          </div>
        </div>
      </section>

      {/* What it Does NOT Do (Strict Honesty Section) */}
      <section className="p-6 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black text-base sm:text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>What GateReady Does NOT Do (Honesty Policy)</span>
        </div>
        <p className="text-xs text-amber-950 dark:text-amber-200/90 leading-relaxed">
          We believe software should never make false promises. GateReady is a self-service planning tool. To be completely transparent:
        </p>
        <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200/90 list-disc list-inside">
          <li><strong>No gate-change or boarding alerts:</strong> GateReady does not monitor air traffic control or live airport PA systems.</li>
          <li><strong>No live flight or gate data:</strong> We do not stream live telemetry or tail numbers.</li>
          <li><strong>No GPS bag tracking:</strong> GateReady is not an Apple AirTag or physical hardware beacon.</li>
          <li><strong>No camera scanning:</strong> We do not scan bags through your camera; luggage weights and items are selected by the user.</li>
          <li><strong>No physical scale hardware:</strong> The app predicts and models weights based on tare estimates and item catalog benchmarks.</li>
          <li><strong>Fees are estimates:</strong> All baggage fee calculations are calculated from published airline fee tables. Because airlines frequently change rates and seat-tier terms, you should always verify with your airline prior to departure.</li>
        </ul>
      </section>

      {/* Creator & Company Info */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Who Makes GateReady
        </h2>
        <p>
          GateReady is developed and operated by <strong>CSM App Holdings</strong>.
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-xs">CSM App Holdings</div>
              <div className="text-[11px] text-slate-500">Sole Support Contact: csmappholdings@gmail.com</div>
            </div>
          </div>
          <a
            href="/contact"
            className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Team</span>
          </a>
        </div>
      </section>
    </PageLayout>
  );
};
