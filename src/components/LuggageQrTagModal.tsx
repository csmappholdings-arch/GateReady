import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { Trip, Bag, LuggageTagInfo } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { 
  X, 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Luggage, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Plane, 
  Sparkles,
  AlertCircle,
  Crown,
  Lock,
  ArrowRight
} from 'lucide-react';

interface LuggageQrTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  bag?: Bag;
}

const POPULAR_COLORS = [
  { name: 'Matte Black', hex: '#1e293b' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Silver / Aluminum', hex: '#94a3b8' },
  { name: 'Champagne / Rose Gold', hex: '#fbcfe8' },
  { name: 'Crimson Red', hex: '#b91c1c' },
  { name: 'Emerald / Olive Green', hex: '#065f46' },
  { name: 'Bright Yellow', hex: '#eab308' },
  { name: 'Cobalt Blue', hex: '#2563eb' }
];

const POPULAR_BRANDS = [
  'Away',
  'Rimowa',
  'Samsonite',
  'Travelpro',
  'Tumi',
  'Monos',
  'Delsey',
  'Briggs & Riley',
  'Patagonia',
  'Osprey',
  'Generic / Unbranded'
];

export const LuggageQrTagModal: React.FC<LuggageQrTagModalProps> = ({
  isOpen,
  onClose,
  trip,
  bag
}) => {
  const { updateLuggageTag } = usePacking();
  const { isPro, openPaywall } = useSubscription();

  const activeBagId = bag?.id || trip.bags[0]?.id || 'bag-primary';
  const existingTag: LuggageTagInfo | undefined = trip.luggageTags?.[activeBagId];

  const [travelerName, setTravelerName] = useState(
    existingTag?.travelerName || trip.familyMembers?.[0] || 'Traveler'
  );
  const [phoneNumber, setPhoneNumber] = useState(existingTag?.phoneNumber || '+1 ');
  const [email, setEmail] = useState(existingTag?.email || '');
  const [flightNumber, setFlightNumber] = useState(existingTag?.flightNumber || trip.companyName || '');
  const [bagColor, setBagColor] = useState(existingTag?.bagColor || 'Matte Black');
  const [bagBrand, setBagBrand] = useState(existingTag?.bagBrand || 'Away');
  const [bagStyle, setBagStyle] = useState(
    existingTag?.bagStyle || 'Hardshell 4-Wheel Spinner'
  );
  const [distinctiveNotes, setDistinctiveNotes] = useState(
    existingTag?.distinctiveNotes || 'Fluorescent ribbon on top handle + TSA Lock'
  );
  const [rewardOffered, setRewardOffered] = useState(
    existingTag?.rewardOffered !== undefined ? existingTag.rewardOffered : true
  );

  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate safe contact payload for QR Code (Never puts home street address to protect traveler's empty home)
  const qrPayload = `BEGIN:VCARD
VERSION:3.0
FN:${travelerName}
TEL:${phoneNumber}
EMAIL:${email}
NOTE:LUGGAGE OWNER CONTACT: Traveling on ${trip.companyName || 'Flight'}. If bag is found, please call/WhatsApp immediately. ${rewardOffered ? 'Generous reward offered for safe return.' : ''}
END:VCARD`;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrPayload, {
        width: 220,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      }, (err) => {
        if (err) console.error('Failed to render QR Code:', err);
      });
    }
  }, [isOpen, qrPayload]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  // Gated strictly to Gate Ready Pro
  if (!isPro) {
    return createPortal(
      <div 
        className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer min-h-screen"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div 
          className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden cursor-default animate-in zoom-in-95 duration-150 relative z-[100000]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
                <Crown className="w-4 h-4 fill-amber-300 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-black flex items-center gap-1.5">
                  <span>Smart QR Luggage Tag</span>
                  <span className="bg-amber-400 text-purple-950 text-[9px] font-black px-1.5 py-0.2 rounded">PRO ONLY</span>
                </h3>
                <p className="text-[10px] text-purple-200">Exclusive recovery & privacy features</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Why Emergency QR Luggage Tags?</p>
                <p>Traditional paper tags display your home address to everyone in transit—signaling an empty home. Gate Ready Pro generates privacy-safe QR tags that reveal direct phone and WhatsApp contact info for fast airline recovery.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Printable physical luggage tags with scannable vCard QR code</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Airline baggage claim sheet with bag style & color identifiers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>One-tap high-resolution PNG download for your luggage sleeve</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openPaywall("Emergency QR Luggage Tag generator is a Gate Ready Pro feature. Upgrade to create and print privacy-safe recovery tags.");
                }}
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-purple-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Upgrade to Pro to Unlock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const handleSave = () => {
    updateLuggageTag(trip.id, activeBagId, {
      travelerName,
      phoneNumber,
      email,
      flightNumber,
      bagColor,
      bagBrand,
      bagStyle,
      distinctiveNotes,
      rewardOffered
    });
  };

  const handleCopy = () => {
    const text = `LUGGAGE OWNER EMERGENCY INFO:
Name: ${travelerName}
Phone/WhatsApp: ${phoneNumber}
Email: ${email}
Flight / PNR: ${flightNumber}
Bag: ${bagColor} ${bagBrand} (${bagStyle})
Markers: ${distinctiveNotes}
${rewardOffered ? '★ REWARD OFFERED FOR SAFE RETURN' : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    handleSave();
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `luggage-tag-qr-${bag?.label || 'bag'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    handleSave();
    window.print();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-2xl my-auto bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative z-[100000] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <QrCode className="w-4 h-4 text-purple-200" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-200">
              Luggage Recovery & Privacy Tag
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Emergency QR Luggage Tag
          </h2>
          <p className="text-xs text-purple-200/90 mt-1">
            Generate a scannable contact card for <strong>{bag?.label || 'Your Bag'}</strong>. Protects your home address while ensuring baggage claim agents can contact you immediately.
          </p>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column: QR Code & Printable Card */}
            <div className="flex flex-col items-center p-5 rounded-2xl bg-purple-50/60 dark:bg-slate-800/60 border border-purple-100 dark:border-purple-900/60 text-center shadow-xs">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block mb-3">
                <canvas ref={canvasRef} className="rounded-lg max-w-[190px] h-auto" />
              </div>

              <div className="w-full text-left space-y-1 mt-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                  <span>{travelerName || 'Traveler Name'}</span>
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                    {bag?.label || 'Primary Bag'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  {phoneNumber || '+1 Contact Phone'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                  {email || 'Emergency Email'}
                </p>
                {rewardOffered && (
                  <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>Reward Offered If Returned Safely</span>
                  </p>
                )}
              </div>

              <div className="w-full flex items-center gap-2 mt-4 pt-3 border-t border-purple-200/60 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 h-9 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Download high-resolution QR PNG for your phone or printing"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-9 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-50 cursor-pointer"
                  title="Copy contact text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="h-9 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-50 cursor-pointer"
                  title="Print luggage tag sheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
              </div>

              {/* Privacy Warning */}
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300 text-left flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Protected:</strong> Your home street address is never embedded, preventing strangers from targeting your empty home while you travel.
                </span>
              </div>
            </div>

            {/* Right Column: Contact Details & Visual Bag Identifiers */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300">
                Contact & Flight Details
              </h4>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Traveler Name
                </label>
                <input
                  type="text"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  placeholder="e.g. Alex Miller"
                  className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 555-0192"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Flight / PNR
                  </label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="DL 402 / Q7Z9"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Emergency Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.travels@example.com"
                  className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-2">
                  Baggage Claim Recovery Identifiers
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Helps airline ground staff locate your bag quickly in airport storage rooms.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Bag Color
                    </label>
                    <select
                      value={bagColor}
                      onChange={(e) => setBagColor(e.target.value)}
                      className="w-full h-9 px-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {POPULAR_COLORS.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Brand
                    </label>
                    <select
                      value={bagBrand}
                      onChange={(e) => setBagBrand(e.target.value)}
                      className="w-full h-9 px-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {POPULAR_BRANDS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Distinctive Markers (Ribbon / Stickers / Lock)
                  </label>
                  <input
                    type="text"
                    value={distinctiveNotes}
                    onChange={(e) => setDistinctiveNotes(e.target.value)}
                    placeholder="e.g. Neon yellow tag, red ribbon on top handle"
                    className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rewardOffered}
                    onChange={(e) => setRewardOffered(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Prominently display "Reward Offered" on tag
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Tip: Laminate or use a transparent plastic tag loop on all checked bags.
          </p>
          <button
            onClick={() => {
              handleSave();
              onClose();
            }}
            className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
          >
            Save Tag
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
