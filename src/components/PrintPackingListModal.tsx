import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Trip, Bag, PackingItem, getUserPresetWeightLbs } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { DefaultSuggestions } from '../data/suggestions';
import { 
  Printer, 
  X, 
  Check, 
  Copy, 
  Luggage, 
  Briefcase, 
  Users, 
  Calendar, 
  MapPin, 
  Plane, 
  Train, 
  Ship, 
  Car, 
  Bus, 
  CheckCircle2, 
  Circle, 
  Filter, 
  Scale,
  Sparkles,
  Droplets,
  Crown,
  Lock,
  ArrowRight,
  Mail,
  Send,
  Loader2
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { AccountSyncModal } from './AccountSyncModal';
import { recordCapturedEmail } from '../lib/firebase';
import { airlineLimits } from '../data/allowances';

interface PrintPackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export const PrintPackingListModal: React.FC<PrintPackingListModalProps> = ({
  isOpen,
  onClose,
  trip
}) => {
  const { weightUnit } = usePacking();
  const { isPro, openPaywall } = useSubscription();
  const { user } = useAuth();

  const [filterStatus, setFilterStatus] = useState<'all' | 'packed' | 'unpacked'>('all');
  const [selectedTraveler, setSelectedTraveler] = useState<string>('all');
  const [selectedBagId, setSelectedBagId] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Feature 2: Email me my list state
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(() => user?.email || '');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Sync email input if user signs in
  React.useEffect(() => {
    if (user?.email && !emailInput) {
      setEmailInput(user.email);
    }
  }, [user?.email]);

  const familyMembers = trip.familyMembers && trip.familyMembers.length > 0 
    ? trip.familyMembers 
    : ['Traveler 1'];

  // Calculate totals
  const totalItemsCount = trip.bags.reduce((acc, b) => acc + b.items.length, 0);
  const packedItemsCount = trip.bags.reduce((acc, b) => acc + b.items.filter(i => i.isPacked).length, 0);
  const packingPct = totalItemsCount > 0 ? Math.round((packedItemsCount / totalItemsCount) * 100) : 0;

  // Total weight
  const totalWeightLbs = trip.bags.reduce((sum, bag) => {
    const empty = bag.emptyBagWeightLbs ?? getUserPresetWeightLbs(bag.type, bag.material || 'HARD_SHELL');
    const items = bag.items.reduce((s, item) => {
      const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
      return s + w * item.quantity;
    }, 0);
    return sum + empty + items;
  }, 0);

  const displayTotalWeight = weightUnit === 'KG'
    ? `${DefaultSuggestions.convertLbsToKg(totalWeightLbs).toFixed(1)} kg`
    : `${totalWeightLbs.toFixed(1)} lbs`;

  // Filtered bags & items
  const filteredBags = useMemo(() => {
    return trip.bags
      .filter((bag) => selectedBagId === 'all' || bag.id === selectedBagId)
      .map((bag) => {
        const filteredItems = bag.items.filter((item) => {
          // Status filter
          if (filterStatus === 'packed' && !item.isPacked) return false;
          if (filterStatus === 'unpacked' && item.isPacked) return false;

          // Traveler filter
          if (selectedTraveler !== 'all') {
            const itemTraveler = item.packedFor || bag.assignedTo;
            if (itemTraveler !== selectedTraveler) return false;
          }

          return true;
        });

        return {
          ...bag,
          filteredItems
        };
      });
  }, [trip.bags, filterStatus, selectedTraveler, selectedBagId]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handlePrint = () => {
    window.print();
  };

  const generateManifestText = (): string => {
    let summary = `═══════════════════════════════════════════\n`;
    summary += `📋 GATEREADY.CA PACKING MANIFEST & BAGGAGE RECORD\n`;
    summary += `═══════════════════════════════════════════\n`;
    summary += `Trip: ${trip.name}\n`;
    const validOrig = trip.originCity && trip.originCity.trim().length > 1 ? trip.originCity.trim() : null;
    const validDest = trip.destinationCity && trip.destinationCity.trim().length > 1 ? trip.destinationCity.trim() : null;
    if (validOrig && validDest) {
      summary += `Route: ${validOrig} ➔ ${validDest}\n`;
    } else if (validDest) {
      summary += `Destination: ${validDest}\n`;
    }
    if (trip.companyName) {
      summary += `Carrier: ${trip.companyName} (${trip.seatClassOrCarSize || 'Standard'})\n`;
    }
    if (trip.departureDate) {
      summary += `Departure: ${trip.departureDate} ${trip.departureTime || ''}\n`;
    }
    summary += `Travelers: ${familyMembers.join(', ')}\n`;
    summary += `Total Luggage: ${trip.bags.length} bags • ${displayTotalWeight} • ${packedItemsCount}/${totalItemsCount} items packed (${packingPct}%)\n\n`;

    filteredBags.forEach((bag) => {
      summary += `🎒 BAG: ${bag.label} (${bag.type})\n`;
      if (bag.assignedTo) summary += `   Assigned to: ${bag.assignedTo}\n`;
      summary += `   Items (${bag.filteredItems.length}):\n`;
      
      if (bag.filteredItems.length === 0) {
        summary += `   (No matching items)\n`;
      } else {
        bag.filteredItems.forEach((item) => {
          const mark = item.isPacked ? '[✓]' : '[ ]';
          const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
          const loc = item.location ? ` - In: ${item.location}` : '';
          const forWhom = item.packedFor && item.packedFor !== bag.assignedTo ? ` [For: ${item.packedFor}]` : '';
          summary += `   ${mark} ${item.name}${qty}${forWhom}${loc}\n`;
        });
      }
      summary += `\n`;
    });

    summary += `\nGateReady.ca • Calibrated luggage tare weights, TSA limits & transit manifests\n`;
    return summary;
  };

  const generateManifestHtml = (): string => {
    const validOrig = trip.originCity && trip.originCity.trim().length > 1 ? trip.originCity.trim() : null;
    const validDest = trip.destinationCity && trip.destinationCity.trim().length > 1 ? trip.destinationCity.trim() : null;
    const routeText = validOrig && validDest ? `${validOrig} &rarr; ${validDest}` : validDest || 'Trip';

    let bagsHtml = '';
    filteredBags.forEach((b) => {
      let itemsListHtml = '';
      if (b.filteredItems.length === 0) {
        itemsListHtml = '<li style="color:#64748b;font-style:italic;">No matching items</li>';
      } else {
        b.filteredItems.forEach((it) => {
          const checkIcon = it.isPacked ? '<span style="color:#10b981;font-weight:bold;">&#10003;</span>' : '<span style="color:#94a3b8;">&#9633;</span>';
          const qtyText = it.quantity > 1 ? ` <strong>(&times;${it.quantity})</strong>` : '';
          const forText = it.packedFor && it.packedFor !== b.assignedTo ? ` <span style="color:#6366f1;font-size:11px;">[For: ${it.packedFor}]</span>` : '';
          const locText = it.location ? ` <span style="color:#64748b;font-size:11px;">(${it.location})</span>` : '';
          itemsListHtml += `<li style="padding:4px 0;border-bottom:1px solid #f1f5f9;list-style:none;">${checkIcon} ${it.name}${qtyText}${forText}${locText}</li>`;
        });
      }

      bagsHtml += `
        <div style="margin-bottom:16px;background:#f8fafc;padding:12px 16px;border-radius:12px;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 6px 0;color:#1e1b4b;font-size:15px;font-weight:bold;">🎒 ${b.label} <span style="font-size:12px;color:#64748b;font-weight:normal;">(${b.type})</span></h3>
          ${b.assignedTo ? `<p style="margin:0 0 8px 0;font-size:12px;color:#475569;"><strong>Assigned:</strong> ${b.assignedTo}</p>` : ''}
          <ul style="margin:0;padding:0;">${itemsListHtml}</ul>
        </div>
      `;
    });

    return `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;line-height:1.5;">
        <div style="background:linear-gradient(135deg,#581c87,#312e81);color:#ffffff;padding:24px;border-radius:16px 16px 0 0;text-align:center;">
          <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:999px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">GateReady.ca Packing List</span>
          <h1 style="margin:12px 0 4px 0;font-size:24px;color:#ffffff;font-weight:900;">${trip.name}</h1>
          <p style="margin:0;font-size:14px;color:#e9d5ff;">${routeText} ${trip.departureDate ? `&bull; ${trip.departureDate}` : ''}</p>
        </div>

        <div style="padding:20px;background:#ffffff;border:1px solid #e2e8f0;border-top:none;">
          <div style="display:flex;gap:12px;background:#f1f5f9;padding:12px;border-radius:10px;margin-bottom:20px;font-size:12px;">
            <div><strong>Luggage:</strong> ${trip.bags.length} bags</div>
            <div><strong>Total Weight:</strong> ${displayTotalWeight}</div>
            <div><strong>Progress:</strong> ${packedItemsCount}/${totalItemsCount} packed (${packingPct}%)</div>
          </div>

          <h2 style="font-size:16px;color:#1e1b4b;margin:0 0 12px 0;font-weight:800;">Luggage & Item Manifest</h2>
          ${bagsHtml}
        </div>

        <div style="padding:16px;background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;text-align:center;font-size:11px;color:#64748b;">
          <p style="margin:0 0 6px 0;">Generated with <strong>GateReady.ca</strong> &bull; Calibrated luggage tare weights, TSA limits & transit manifests.</p>
          <p style="margin:0;">Access your full packing list on any device at <a href="https://gateready.ca" style="color:#7c3aed;text-decoration:none;font-weight:bold;">gateready.ca</a></p>
        </div>
      </div>
    `;
  };

  const handleCopy = () => {
    const summary = generateManifestText();
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSendError(null);

    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setSendError('Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    try {
      const formattedText = generateManifestText();
      const formattedHtml = generateManifestHtml();

      const response = await fetch('/api/send-packing-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: cleanEmail,
          tripName: trip.name,
          formattedText,
          formattedHtml
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to dispatch email.');
      }

      // Record captured email in Firestore for future product updates
      await recordCapturedEmail({
        email: cleanEmail,
        tripName: trip.name,
        totalItems: totalItemsCount,
        source: 'print_manifest'
      });

      setSendSuccess(true);
    } catch (err: any) {
      console.error('Email send failed:', err);
      setSendError(err.message || 'Could not send packing list email. Please check your address.');
    } finally {
      setIsSending(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-900/60 overflow-hidden flex flex-col max-h-[94vh] relative z-[100000] print-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-purple-200">
              <Printer className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg leading-tight text-white">
                  Print Packing List & Manifest
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded-full">
                  GateReady.ca
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Full itemized breakdown showing what bag every item is packed in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
            <button
              type="button"
              onClick={handleCopy}
              className="h-9 px-3.5 rounded-xl border border-white/20 hover:bg-white/10 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy text summary to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            {/* Feature 2: Email me my list button */}
            <button
              type="button"
              onClick={() => {
                setIsEmailOpen((prev) => !prev);
                setSendError(null);
              }}
              className={`h-9 px-3.5 rounded-xl border border-white/20 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isEmailOpen ? 'bg-white/25 text-white shadow-xs' : 'hover:bg-white/10'
              }`}
              title="Email me my list"
            >
              <Mail className="w-3.5 h-3.5 text-purple-200" />
              <span>Email me my list</span>
            </button>

            {!isPro ? (
              <button
                type="button"
                onClick={() => openPaywall("Unlock unwatermarked printable PDF packing manifests with Silver ($1.99/mo).")}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/40"
                title="Unlock with Silver to print unwatermarked PDF"
              >
                <Crown className="w-4 h-4 fill-white" />
                <span>Unlock with Silver ($1.99/mo)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrint}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[2.5]" />
                <span>Print / Save PDF</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature 2: Email me my list interactive drawer (Hidden when printed) */}
        {isEmailOpen && (
          <div className="no-print bg-purple-950/90 dark:bg-slate-950 border-b border-purple-800/80 p-4 sm:px-6 text-white animate-in slide-in-from-top-2 duration-150">
            {!sendSuccess ? (
              <form onSubmit={handleSendEmail} className="max-w-xl space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-purple-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email to receive your packing list"
                      disabled={isSending}
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-200/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/15"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="h-10 px-5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/40 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send My List</span>
                      </>
                    )}
                  </button>
                </div>

                {sendError && (
                  <p className="text-xs text-rose-300 font-semibold">
                    {sendError}
                  </p>
                )}

                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  🔒 You'll only receive your packing list and occasional product updates. Unsubscribe anytime with 1 click.
                </p>

                {/* Fix 2: Bridge to account creation beneath form */}
                {!user && (
                  <div className="pt-2 mt-2 border-t border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white/10 p-3 rounded-xl">
                    <span className="text-xs text-purple-100 font-medium">
                      Want your lists on all your devices too? Create a free account — we'll use this email.
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAccountModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 active:scale-95 text-purple-950 font-black text-xs transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                    >
                      Create Free Account
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="max-w-xl space-y-2 py-1">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Your list is on its way to {emailInput}!</span>
                </div>

                {/* Fix 2: Bridge to account creation on submit */}
                {!user && (
                  <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <span className="font-medium">
                      Want your lists on all your devices too? Create a free account — we'll use this email.
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAccountModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-black text-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                    >
                      Create Free Account
                    </button>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSendSuccess(false);
                      setSendError(null);
                    }}
                    className="text-[11px] text-purple-300 hover:text-white underline cursor-pointer"
                  >
                    Send to another email
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interactive Filter Toolbar (Hidden when printed) */}
        <div className="no-print p-3 sm:px-6 bg-slate-50 dark:bg-slate-800/60 border-b border-purple-100 dark:border-purple-950/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>

            {/* Status Filter */}
            <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Items ({totalItemsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('packed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'packed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Packed Only ({packedItemsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('unpacked')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'unpacked'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Unpacked ({totalItemsCount - packedItemsCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Bag Selector Filter */}
            <select
              value={selectedBagId}
              onChange={(e) => setSelectedBagId(e.target.value)}
              className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Bags ({trip.bags.length})</option>
              {trip.bags.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label} ({b.items.length} items)
                </option>
              ))}
            </select>

            {/* Traveler Selector Filter */}
            {familyMembers.length > 1 && (
              <select
                value={selectedTraveler}
                onChange={(e) => setSelectedTraveler(e.target.value)}
                className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
              >
                <option value="all">All Travelers ({familyMembers.length})</option>
                {familyMembers.map((m) => (
                  <option key={m} value={m}>
                    For: {m}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Free Tier Watermarked Preview Banner */}
        {!isPro && (
          <div className="no-print mx-5 sm:mx-6 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border-2 border-purple-400 dark:border-purple-600 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Printable PDF Packing Manifest (Free Watermarked Preview)</span>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold px-1.5 py-0.2 rounded">SILVER FEATURE</span>
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Upgrade to Silver ($1.99/mo) to unlock clean, unwatermarked PDF manifests and unwatermarked luggage tags.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openPaywall("Unlock unwatermarked printable PDF packing manifests with Silver ($1.99/mo).")}
              className="w-full sm:w-auto h-9 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Unlock with Silver ($1.99/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Printable Document Content (Scrollable on screen, expands in print) */}
        <div className="relative p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950">
          {/* Watermark Diagonal Overlay on Free Preview */}
          {!isPro && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-20 select-none">
              <div className="transform -rotate-25 text-center p-6 sm:p-10 rounded-3xl border-4 border-dashed border-purple-500/40 bg-purple-500/5 backdrop-blur-[1px]">
                <p className="text-2xl sm:text-4xl md:text-5xl font-black text-purple-600/25 dark:text-purple-400/25 tracking-widest uppercase">
                  GATEREADY.CA PREVIEW
                </p>
                <p className="text-sm sm:text-xl font-black text-purple-700/35 dark:text-purple-300/35 uppercase tracking-wider mt-2">
                  UNLOCK WITH SILVER · $1.99/MO
                </p>
              </div>
            </div>
          )}
          {/* Printable Manifest Header */}
          <div className="border-b-2 border-purple-600 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-lg sm:text-xl text-purple-700 dark:text-purple-400 tracking-tight">
                    GateReady.ca
                  </span>
                  <span className="text-xs text-slate-400 font-medium">| Official Travel Manifest & Packing List</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {trip.name || 'Trip Packing List'}
                </h1>
                
                {/* Route & Details */}
                <div className="flex items-center gap-3 flex-wrap mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {Boolean(trip.originCity?.trim() && trip.originCity.trim().length > 1 && trip.destinationCity?.trim() && trip.destinationCity.trim().length > 1) ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{trip.originCity!.trim()} ➔ {trip.destinationCity!.trim()}</span>
                    </span>
                  ) : Boolean(trip.destinationCity?.trim() && trip.destinationCity.trim().length > 1) ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>To {trip.destinationCity!.trim()}</span>
                    </span>
                  ) : null}
                  {trip.companyName && (
                    <span className="flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{trip.companyName} • {trip.seatClassOrCarSize || 'Standard'}</span>
                    </span>
                  )}
                  {trip.departureDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Departure: {trip.departureDate} {trip.departureTime ? `at ${trip.departureTime}` : ''}</span>
                    </span>
                  )}
                </div>

                {familyMembers.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-bold">Travelers:</span>
                    <span>{familyMembers.join(' • ')}</span>
                  </div>
                )}
              </div>

              {/* Summary Scorecard Badge */}
              <div className="text-right shrink-0">
                <div className="inline-block p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-right">
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Packing Readiness
                  </div>
                  <div className="text-2xl font-black text-purple-700 dark:text-purple-300 tabular-nums">
                    {packedItemsCount} / {totalItemsCount}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {packingPct}% Packed • {displayTotalWeight} Total
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bag-by-Bag Itemized Packing Manifest (Primary Fix: Every bag and all items clearly listed) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Luggage className="w-5 h-5 text-purple-600" />
                <span>Luggage & Itemized Bag Manifest</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {filteredBags.length} {filteredBags.length === 1 ? 'Bag' : 'Bags'} Listed
              </span>
            </div>

            {filteredBags.map((bag, bagIdx) => {
              const emptyLbs = bag.emptyBagWeightLbs ?? getUserPresetWeightLbs(bag.type, bag.material || 'HARD_SHELL');
              const bagItemsLbs = bag.items.reduce((sum, item) => {
                const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
                return sum + w * item.quantity;
              }, 0);
              const totalBagLbs = emptyLbs + bagItemsLbs;
              const limitLbs = bag.maxWeightLimitLbs || (bag.type === 'CHECKED' ? 50 : bag.type === 'CARRY_ON' ? 22 : 15);
              const bagPackedCount = bag.items.filter(i => i.isPacked).length;

              const displayBagWeight = weightUnit === 'KG'
                ? `${DefaultSuggestions.convertLbsToKg(totalBagLbs).toFixed(1)} kg`
                : `${totalBagLbs.toFixed(1)} lbs`;

              const displayLimit = weightUnit === 'KG'
                ? `${DefaultSuggestions.convertLbsToKg(limitLbs).toFixed(0)} kg`
                : `${limitLbs} lbs`;

              const carrierLimit = airlineLimits.find(a => a.company.toLowerCase() === (trip.companyName || '').toLowerCase());
              const bagHasNoWeightLimit = bag.type === 'CARRY_ON' && Boolean(carrierLimit && /no weight limit/i.test(carrierLimit.carryOnWeightLimit || ''));

              return (
                <div 
                  key={bag.id}
                  className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden print-card-break-avoid bg-slate-50/50 dark:bg-slate-900/50"
                >
                  {/* Bag Header Banner */}
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {bagIdx + 1}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        {bag.label}
                      </h3>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {bag.type.replace('_', ' ')}
                      </span>
                      {bag.assignedTo && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Assigned to: <strong>{bag.assignedTo}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 self-end sm:self-center">
                      <span className="flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-purple-600" />
                        {bagHasNoWeightLimit ? (
                          <span>{displayBagWeight} (No airline limit · {trip.companyName || 'Carrier'})</span>
                        ) : (
                          <span>{displayBagWeight} / {displayLimit} cap</span>
                        )}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-purple-700 dark:text-purple-300 font-extrabold">
                        {bagPackedCount}/{bag.items.length} Packed
                      </span>
                    </div>
                  </div>

                  {/* Items Table for this Bag */}
                  <div className="p-3 sm:p-4 bg-white dark:bg-slate-900">
                    {bag.filteredItems.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-400 italic">
                        {bag.items.length === 0 
                          ? 'No items packed into this bag yet.' 
                          : 'No items match the current filter in this bag.'}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-black">
                              <th className="py-2 px-2 w-10 text-center">Status</th>
                              <th className="py-2 px-2 font-bold">Item Description</th>
                              <th className="py-2 px-2 w-14 text-center font-bold">Qty</th>
                              <th className="py-2 px-2 font-bold">Pocket / Location in Bag</th>
                              <th className="py-2 px-2 font-bold">For Traveler</th>
                              <th className="py-2 px-2 w-20 text-right font-bold">Est. Weight</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {bag.filteredItems.map((item, itemIdx) => {
                              const itemWeightLbs = (item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name)) * item.quantity;
                              const displayItemWeight = weightUnit === 'KG'
                                ? `${DefaultSuggestions.convertLbsToKg(itemWeightLbs).toFixed(2)} kg`
                                : `${itemWeightLbs.toFixed(1)} lbs`;

                              return (
                                <tr 
                                  key={item.id || itemIdx}
                                  className={item.isPacked ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''}
                                >
                                  {/* Checkbox Status Column */}
                                  <td className="py-2.5 px-2 text-center align-middle">
                                    <div className="inline-flex items-center justify-center">
                                      {item.isPacked ? (
                                        <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                      ) : (
                                        <div className="w-4 h-4 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                                      )}
                                    </div>
                                  </td>

                                  {/* Item Name & Details */}
                                  <td className="py-2.5 px-2 align-middle">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`font-bold ${item.isPacked ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {item.name}
                                      </span>
                                      {(item.category === 'Toiletries' || /shampoo|lotion|liquid|toothpaste|perfume|sunscreen|gel|spray/i.test(item.name)) && (
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                          <Droplets className="w-2.5 h-2.5" />
                                          <span>TSA 3-1-1</span>
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Quantity */}
                                  <td className="py-2.5 px-2 text-center align-middle font-bold text-slate-700 dark:text-slate-300">
                                    x{item.quantity}
                                  </td>

                                  {/* Pocket / Location inside Bag */}
                                  <td className="py-2.5 px-2 align-middle text-slate-600 dark:text-slate-400">
                                    {item.location ? (
                                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                                        {item.location}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 italic text-[11px]">Main Compartment</span>
                                    )}
                                  </td>

                                  {/* Traveler Assignment */}
                                  <td className="py-2.5 px-2 align-middle text-slate-700 dark:text-slate-300 font-medium">
                                    {item.packedFor || bag.assignedTo || 'Me'}
                                  </td>

                                  {/* Item Weight */}
                                  <td className="py-2.5 px-2 text-right align-middle font-mono font-bold text-slate-600 dark:text-slate-400">
                                    {displayItemWeight}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gate Departure Verification Checkpoints */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 print-card-break-avoid">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Gate-Ready Departure Security Checklist</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Passports, IDs & Visas verified (&gt;6 mos validity)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Carry-on liquids compliant with TSA 3-1-1 rule (≤3.4 oz)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Lithium battery power banks in carry-on / personal item</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Boarding passes saved offline to Apple/Google Wallet</span>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>GateReady.ca • Calibrated luggage tare weights, TSA limits & transit manifests</span>
            <span>Generated on {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {showAccountModal && (
        <AccountSyncModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          origin="save_gate"
          initialEmail={emailInput}
        />
      )}
    </div>,
    document.body
  );
};
