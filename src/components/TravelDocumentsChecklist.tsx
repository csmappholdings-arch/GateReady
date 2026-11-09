import React from 'react';
import { Trip, TravelDocumentChecklist } from '../types/travel';
import { 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ExternalLink, 
  Info,
  Calendar,
  Lock,
  Compass
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface TravelDocumentsChecklistProps {
  trip: Trip;
  onUpdateTripDetails: (
    tripId: string,
    details: Partial<Trip>
  ) => Promise<Trip> | void;
}

interface DocItemConfig {
  key: keyof TravelDocumentChecklist;
  title: string;
  subtitle: string;
  tag: string;
  recommendation: string;
  officialLink?: string;
  linkText?: string;
}

const DOCUMENT_ITEMS: DocItemConfig[] = [
  {
    key: 'passportChecked',
    title: 'Passport Validity & Condition Checked',
    subtitle: 'Verify your passport has at least 6 months validity remaining beyond your return date.',
    tag: 'Critical',
    recommendation: 'Many international destinations deny boarding if your passport expires within 6 months. Check for clean pages and no water damage.',
    officialLink: '/entry-requirements/',
    linkText: 'Check 6-Month Passport Rules'
  },
  {
    key: 'visaReviewed',
    title: 'Visa & Entry Requirements Reviewed',
    subtitle: 'Confirm whether your destination mandates an e-Visa, tourist card, or visa upon arrival.',
    tag: 'Required',
    recommendation: 'Review country-specific visa rules for Canadian and US passport holders prior to departure day.',
    officialLink: '/entry-requirements/',
    linkText: 'Quick-Check Entry Portals'
  },
  {
    key: 'boardingPassAvailable',
    title: 'Boarding Pass & Check-In Available',
    subtitle: 'Online check-in opens 24 hours before flight departure. Save mobile pass to Apple/Google Wallet.',
    tag: 'Flight Day',
    recommendation: 'Download offline screenshot or add to phone wallet in case airport terminal Wi-Fi is weak.'
  },
  {
    key: 'travelAuthorizationsReviewed',
    title: 'Electronic Travel Authorizations (ESTA / eTA / ETIAS)',
    subtitle: 'Ensure applicable pre-travel clearance authorizations are approved and active.',
    tag: 'Electronic Auth',
    recommendation: 'For US transit/entry: ESTA. For Canada: eTA. For Europe: ETIAS (when in effect). Always submit at least 72 hours prior.'
  },
  {
    key: 'travelInsuranceReviewed',
    title: 'Travel Health & Trip Cancellation Insurance',
    subtitle: 'Review coverage numbers, 24/7 emergency medical assistance hotlines, and policy certificate.',
    tag: 'Health & Protection',
    recommendation: 'Verify hospital coverage limits and keep emergency contact numbers saved on your phone.'
  },
  {
    key: 'hotelConfirmationAvailable',
    title: 'Hotel & Lodging Confirmations',
    subtitle: 'Save hotel address, reservation confirmation numbers, check-in time, and local contact phone.',
    tag: 'Lodging',
    recommendation: 'Immigration border officers frequently request the exact street address and hotel name where you will reside.'
  },
  {
    key: 'flightConfirmationAvailable',
    title: 'Flight / Transit Return Confirmation',
    subtitle: 'Store 6-character PNR booking code and e-ticket numbers accessible offline.',
    tag: 'Return Proof',
    recommendation: 'Airlines and border authorities require documented proof of onward or return travel before permitting entry.'
  },
  {
    key: 'emergencyContactNoted',
    title: 'Emergency Contacts & Embassy Location',
    subtitle: 'Note closest consulate/embassy location and local emergency dispatch numbers (911/112/999).',
    tag: 'Emergency',
    recommendation: 'Know the local 3-digit emergency number for your destination before landing.'
  }
];

export const TravelDocumentsChecklistScreen: React.FC<TravelDocumentsChecklistProps> = ({
  trip,
  onUpdateTripDetails
}) => {
  const currentDocs: TravelDocumentChecklist = trip.travelDocuments || {};

  const handleToggle = (key: keyof TravelDocumentChecklist) => {
    const updatedDocs: TravelDocumentChecklist = {
      ...currentDocs,
      [key]: !currentDocs[key]
    };
    onUpdateTripDetails(trip.id, { travelDocuments: updatedDocs });
    trackEvent('document_checklist_toggle', {
      trip_id: trip.id,
      doc_key: key,
      is_completed: !currentDocs[key]
    });
  };

  const completedCount = DOCUMENT_ITEMS.filter((item) => !!currentDocs[item.key]).length;
  const progressPercent = Math.round((completedCount / DOCUMENT_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner & Security Guarantee */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                Pre-Departure Travel Document Readiness
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Travel Document Preparation Checklist
            </h2>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              Verify critical passport validity, visa clearances, and booking confirmations before departing.
            </p>
          </div>

          {/* Progress Widget */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">
                Documents Ready
              </p>
              <p className="text-2xl font-black text-white">
                {completedCount} <span className="text-xs font-normal text-indigo-200">/ {DOCUMENT_ITEMS.length}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-400/30 border-t-emerald-400 flex items-center justify-center font-black text-xs text-white">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Security / Zero-PII Guarantee Box */}
        <div className="mt-4 pt-3.5 border-t border-white/15 flex items-start gap-2.5 text-xs text-indigo-200/90">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px]">
            <strong>Security &amp; Privacy Guarantee:</strong> GateReady never asks for, collects, or stores your passport numbers, credit card details, or national IDs. This tool is strictly a readiness checklist. Travelers remain individually responsible for verifying official government entry rules.
          </p>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {DOCUMENT_ITEMS.map((item) => {
          const isDone = !!currentDocs[item.key];
          return (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between space-y-3 ${
                isDone
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-700 hover:border-purple-600'
                  }`}
                  aria-label={isDone ? 'Mark document incomplete' : 'Mark document complete'}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-transparent" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.2 rounded-md ${
                      isDone 
                        ? 'bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200' 
                        : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="italic truncate pr-2">{item.recommendation}</span>
                {item.officialLink && (
                  <a
                    href={item.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-purple-600 dark:text-purple-400 hover:underline font-bold inline-flex items-center gap-1 shrink-0 ml-auto"
                  >
                    <span>{item.linkText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
