import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trip } from '../types/travel';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Mail, 
  Gift, 
  Users, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

interface SharePackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onOpenReferral?: () => void;
}

export const SharePackingListModal: React.FC<SharePackingListModalProps> = ({
  isOpen,
  onClose,
  trip,
  onOpenReferral
}) => {
  const { referralCode } = useSubscription();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  // Build collaborative share URL including trip name, destination and referral code
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://gateready.ca';
  const shareParams = new URLSearchParams({
    trip: trip.name || 'Trip',
    dest: trip.destinationCity || '',
    ref: referralCode
  });
  const shareUrl = `${baseUrl}?share=${encodeURIComponent(trip.id)}&${shareParams.toString()}`;

  const totalItems = trip.bags.reduce((acc, b) => acc + b.items.length, 0);
  const packedItems = trip.bags.reduce((acc, b) => acc + b.items.filter(i => i.isPacked).length, 0);

  const shareSummaryText = `🧳 GateReady.ca Packing List for ${trip.name}${trip.destinationCity ? ` to ${trip.destinationCity}` : ''}
Bags: ${trip.bags.length} ${trip.bags.length === 1 ? 'bag' : 'bags'} | Progress: ${packedItems}/${totalItems} ${totalItems === 1 ? 'item' : 'items'} packed
Collaborate & verify luggage weight limits before the gate: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(shareSummaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareSummaryText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Packing List: ${trip.name} (${trip.destinationCity || 'GateReady'})`);
    const body = encodeURIComponent(`Hi!\n\nHere is our collaborative travel packing list for ${trip.name}:\n\n${shareSummaryText}\n\nCheck what's packed and make sure we stay under the carrier weight limits!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden flex flex-col relative z-[100000] cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/30 border border-purple-300/40 text-purple-200 flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 text-purple-200" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/40 text-purple-200 px-2.5 py-0.5 rounded-full">
              Collaborative Packing
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Share Packing List
          </h3>
          <p className="text-xs text-purple-200/90 mt-1 leading-relaxed">
            Invite family members or travel companions to view bags, verify luggage weights, and check off items.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Trip Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-between">
            <div>
              <p className="font-black text-sm text-slate-900 dark:text-white">
                {trip.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {trip.destinationCity ? `Destination: ${trip.destinationCity} · ` : ''}{trip.bags.length} ${trip.bags.length === 1 ? 'bag' : 'bags'} · {packedItems}/{totalItems} {totalItems === 1 ? 'item' : 'items'} packed
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              Live Link
            </span>
          </div>

          {/* Share Link Input with One-Click Copy */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Share Buttons (WhatsApp & Email) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="h-10 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Send via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleShareEmail}
              className="h-10 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Send via Email</span>
            </button>
          </div>

          {/* Copy Full Text Summary */}
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied Packing Summary to Clipboard!' : 'Copy Formatted Text Summary'}</span>
          </button>

          {/* Referral Incentive Callout */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-300/60 dark:border-amber-700/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Gift className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Refer a Friend · Both Get 1 Month Free</span>
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                Give your traveling companion a free month of Silver. When they subscribe, you automatically receive a free month credit!
              </p>
              {onOpenReferral && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReferral();
                  }}
                  className="mt-2 text-purple-700 dark:text-purple-300 font-bold text-[11px] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View your referral program dashboard & stats</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
