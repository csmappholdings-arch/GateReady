import React, { useState } from 'react';
import { useTravelWallet } from '../context/TravelWalletContext';
import { useAuth } from '../context/AuthContext';
import { LoyaltyAccount, LoyaltyCategory } from '../types/travel';
import { 
  CreditCard, 
  Plane, 
  Building, 
  Car, 
  ShieldCheck, 
  Ticket, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  Sparkles, 
  Cloud, 
  User
} from 'lucide-react';

export const TravelWalletModal: React.FC = () => {
  const { 
    isWalletModalOpen, 
    closeWalletModal, 
    accounts, 
    addAccount, 
    deleteAccount,
    updateAccount,
    syncStatus 
  } = useTravelWallet();
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'ALL' | LoyaltyCategory>('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<LoyaltyCategory>('AIRLINE');
  const [formProgram, setFormProgram] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formTierNotes, setFormTierNotes] = useState('');
  const [formTraveler, setFormTraveler] = useState('');

  if (!isWalletModalOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProgram.trim() || !formNumber.trim()) return;

    addAccount({
      category: formCategory,
      programOrProvider: formProgram.trim(),
      accountNumberOrCode: formNumber.trim(),
      tierOrNotes: formTierNotes.trim() ? formTierNotes.trim() : undefined,
      travelerName: formTraveler.trim() ? formTraveler.trim() : undefined
    });

    // Reset Form
    setFormProgram('');
    setFormNumber('');
    setFormTierNotes('');
    setFormTraveler('');
    setIsAdding(false);
  };

  const getCategoryIcon = (category: LoyaltyCategory) => {
    switch (category) {
      case 'AIRLINE':
        return <Plane className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'HOTEL':
        return <Building className="w-4 h-4 text-amber-500" />;
      case 'CAR_RENTAL':
        return <Car className="w-4 h-4 text-emerald-500" />;
      case 'TSA_KTN':
      case 'PASSPORT':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case 'CONFIRMATION':
        return <Ticket className="w-4 h-4 text-fuchsia-500" />;
    }
  };

  const getCategoryLabel = (category: LoyaltyCategory) => {
    switch (category) {
      case 'AIRLINE': return 'Airline Loyalty';
      case 'HOTEL': return 'Hotel Rewards';
      case 'CAR_RENTAL': return 'Car Rental';
      case 'TSA_KTN': return 'TSA PreCheck / KTN';
      case 'PASSPORT': return 'Passport ID';
      case 'CONFIRMATION': return 'Booking Reference (PNR)';
    }
  };

  const filteredAccounts = activeFilter === 'ALL'
    ? accounts
    : accounts.filter(a => a.category === activeFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-purple-900/60 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Travel Wallet & Loyalty Numbers
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                  {user ? <Cloud className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                  <span>{user ? 'Google Cloud Synced' : 'Browser Storage'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Keep Frequent Flyer IDs, TSA PreCheck, Hotel accounts & PNR codes ready for 1-tap check-in.
              </p>
            </div>
          </div>

          <button
            onClick={closeWalletModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar & Quick Add */}
        <div className="flex items-center justify-between gap-2 pt-3 pb-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Items' },
              { id: 'AIRLINE', label: 'Airlines' },
              { id: 'HOTEL', label: 'Hotels' },
              { id: 'CAR_RENTAL', label: 'Car Rental' },
              { id: 'TSA_KTN', label: 'TSA & Passports' },
              { id: 'CONFIRMATION', label: 'Confirmation PNRs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="h-8.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isAdding ? 'Cancel' : 'Add Number'}</span>
          </button>
        </div>

        {/* Add Entry Drawer */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="my-2 p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3 shrink-0 animate-in fade-in duration-150"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as LoyaltyCategory)}
                  className="w-full h-9 px-2.5 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="AIRLINE">Airline Frequent Flyer</option>
                  <option value="HOTEL">Hotel Rewards Program</option>
                  <option value="CAR_RENTAL">Rental Car Loyalty Club</option>
                  <option value="TSA_KTN">TSA PreCheck / KTN / Global Entry</option>
                  <option value="PASSPORT">Passport Number</option>
                  <option value="CONFIRMATION">Booking Reference / PNR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Program or Provider *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delta SkyMiles, Marriott Bonvoy, United"
                  value={formProgram}
                  onChange={(e) => setFormProgram(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account #, Member ID, or Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2849182390 or HQ7X8L"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-mono font-bold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tier, Status, or Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Platinum Medallion, Exp: 2028"
                  value={formTierNotes}
                  onChange={(e) => setFormTierNotes(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <input
                type="text"
                placeholder="Traveler Name (e.g. Self, Mom, Alex)"
                value={formTraveler}
                onChange={(e) => setFormTraveler(e.target.value)}
                className="w-48 h-8 px-2.5 text-xs font-medium rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save to Wallet
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Accounts List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2.5 pr-1">
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-purple-200 dark:border-purple-800 bg-purple-50/20 dark:bg-slate-800/40">
              <CreditCard className="w-10 h-10 text-purple-300 dark:text-purple-700 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {activeFilter === 'ALL' ? 'No travel numbers saved yet' : `No ${activeFilter.toLowerCase()} records`}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Add your frequent flyer numbers, TSA PreCheck KTN, and flight confirmation PNRs to easily copy them when checking in online or at airport kiosks.
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                + Add First Loyalty Number
              </button>
            </div>
          ) : (
            filteredAccounts.map(account => {
              const isCopied = copiedId === account.id;

              return (
                <div
                  key={account.id}
                  className="p-3.5 rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-slate-800/80 shadow-2xs hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(account.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {account.programOrProvider}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {getCategoryLabel(account.category)}
                        </span>
                        {account.travelerName && (
                          <span className="text-[10px] font-medium text-slate-500 flex items-center gap-0.5">
                            <User className="w-3 h-3" /> {account.travelerName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs sm:text-sm font-mono font-bold text-purple-950 dark:text-purple-200 tracking-wider bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-100 dark:border-purple-900/40">
                          {account.accountNumberOrCode}
                        </code>
                        {account.tierOrNotes && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                            · {account.tierOrNotes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy & Delete */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(account.id, account.accountNumberOrCode)}
                      className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isCopied
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                      }`}
                      title="Copy to clipboard"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => deleteAccount(account.id)}
                      className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>{accounts.length} {accounts.length === 1 ? 'account saved' : 'accounts saved'}</span>
          <span>Tip: Tap "Copy" during airline check-in to paste right into boarding passes</span>
        </div>
      </div>
    </div>
  );
};
