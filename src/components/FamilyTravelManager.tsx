import React, { useState } from 'react';
import { Trip, TravelerCategory } from '../types/travel';
import { 
  Users, 
  UserPlus, 
  Baby, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Luggage, 
  Share2, 
  Copy, 
  Check, 
  Crown, 
  X,
  Mail,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { trackEvent } from '../utils/analytics';

interface FamilyTravelManagerProps {
  trip: Trip;
  onAddFamilyMember: (tripId: string, name: string) => void;
  onRemoveFamilyMember: (tripId: string, name: string) => void;
  onUpdateTripDetails: (tripId: string, updates: Partial<Trip>) => Promise<Trip> | void;
  onOpenPricing?: () => void;
  onFilterByTraveler?: (travelerName: string) => void;
}

export const FamilyTravelManager: React.FC<FamilyTravelManagerProps> = ({
  trip,
  onAddFamilyMember,
  onRemoveFamilyMember,
  onUpdateTripDetails,
  onOpenPricing,
  onFilterByTraveler
}) => {
  const { tier, isPro, canAddTraveler, openPaywall } = useSubscription();
  const [newTravelerName, setNewTravelerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TravelerCategory>('ADULT');
  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'VIEWER' | 'EDITOR'>('EDITOR');
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitedNotice, setInvitedNotice] = useState(false);

  const travelers = trip.familyMembers && trip.familyMembers.length > 0
    ? trip.familyMembers
    : ['Primary Traveler (You)'];

  const allItems = trip.bags.flatMap((b) => b.items);

  // Compute individual packing stats for each traveler
  const travelerStats = travelers.map((name) => {
    // Determine category from name or default
    let cat: TravelerCategory = 'ADULT';
    if (name.toLowerCase().includes('child') || name.toLowerCase().includes('kid')) cat = 'CHILD';
    if (name.toLowerCase().includes('infant') || name.toLowerCase().includes('baby') || name.toLowerCase().includes('toddler')) cat = 'INFANT';

    // Find items packed for this traveler
    const items = allItems.filter((i) => i.packedFor === name);
    const packedCount = items.filter((i) => i.isPacked).length;
    const totalCount = items.length;
    const percent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

    // Find bags assigned to this traveler
    const assignedBags = trip.bags.filter((b) => b.assignedTo === name);

    return {
      name,
      category: cat,
      itemsCount: totalCount,
      packedCount,
      percent,
      assignedBags
    };
  });

  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTravelerName.trim()) return;

    // Check plan limits
    const check = canAddTraveler(travelers.length);
    if (!check.allowed) {
      if (openPaywall) {
        openPaywall(check.reason || 'Upgrade to Gold (2 travelers) or Platinum (unlimited) to pack for family members.');
      }
      return;
    }

    const tag = selectedCategory === 'CHILD' ? ' (Child)' : selectedCategory === 'INFANT' ? ' (Infant)' : '';
    const formattedName = `${newTravelerName.trim()}${tag}`;
    onAddFamilyMember(trip.id, formattedName);
    setNewTravelerName('');
    trackEvent('traveler_category_set', { category: selectedCategory });
  };

  const handleCreateShareInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    if (tier === 'FREE') {
      if (openPaywall) {
        openPaywall('Family & companion trip collaboration is unlocked with Gold ($3.99/mo) and Platinum.');
      }
      return;
    }

    const existingShares = trip.sharedWith || [];
    const updated = [
      ...existingShares,
      {
        email: inviteEmail.trim(),
        role: inviteRole,
        invitedAt: new Date().toISOString()
      }
    ];

    onUpdateTripDetails(trip.id, { sharedWith: updated });
    setInviteEmail('');
    setInvitedNotice(true);
    setTimeout(() => setInvitedNotice(false), 4000);
    trackEvent('trip_share_invite_create', { role: inviteRole });
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/?tripId=${trip.id}&share=family`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-400/40 text-purple-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-purple-300">
              Family &amp; Group Travel Workspace
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Traveller Preparation &amp; Shared Packing
          </h2>
          <p className="text-xs text-purple-100/90 leading-relaxed">
            Manage individual wardrobes for adults, children, and infants. Track who is ready to depart.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="h-10 px-4 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-black text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-purple-600" />
            <span>Invite Family Member</span>
          </button>
        </div>
      </div>

      {/* Add New Traveler Form */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleAddTraveler} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Add Traveler to Trip
            </span>
            {tier === 'FREE' && travelers.length >= 1 && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> Gold unlocks 2 travelers · Platinum unlocks unlimited
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              required
              value={newTravelerName}
              onChange={(e) => setNewTravelerName(e.target.value)}
              placeholder="e.g. Sarah, Liam, Grandma Rose"
              className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />

            {/* Category Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedCategory('ADULT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'ADULT'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Adult</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('CHILD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'CHILD'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Child</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('INFANT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'INFANT'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Infant</span>
              </button>
            </div>

            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Traveler</span>
            </button>
          </div>
        </form>
      </div>

      {/* Traveler Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {travelerStats.map((stat) => (
          <div
            key={stat.name}
            className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                    stat.category === 'INFANT' 
                      ? 'bg-pink-500' 
                      : stat.category === 'CHILD' 
                        ? 'bg-amber-500' 
                        : 'bg-purple-600'
                  }`}>
                    {stat.category === 'INFANT' ? <Baby className="w-5 h-5" /> : stat.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {stat.name}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {stat.category}
                    </span>
                  </div>
                </div>

                {travelers.length > 1 && stat.name !== 'Primary Traveler (You)' && (
                  <button
                    type="button"
                    onClick={() => onRemoveFamilyMember(trip.id, stat.name)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title={`Remove ${stat.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Packing Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Packing Readiness
                  </span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {stat.percent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      stat.percent === 100 ? 'bg-emerald-500' : 'bg-purple-600'
                    }`}
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {stat.itemsCount === 0 
                    ? 'No packing items assigned yet' 
                    : `${stat.packedCount} of ${stat.itemsCount} items packed`}
                </p>
              </div>

              {/* Assigned Luggage */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Assigned Bags:
                </span>
                {stat.assignedBags.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">No bags specifically assigned</p>
                ) : (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {stat.assignedBags.map((b) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Luggage className="w-3 h-3" />
                        <span>{b.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Filter Button */}
            {onFilterByTraveler && (
              <button
                type="button"
                onClick={() => onFilterByTraveler(stat.name)}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View {stat.name}'s Checklist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Share / Invite Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-600" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Collaborate on Trip
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Invite a travel companion or family member to check off items and coordinate suitcases.
            </p>

            <form onSubmit={handleCreateShareInvite} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Companion Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="companion@example.com"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Access Level
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'VIEWER' | 'EDITOR')}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="EDITOR">Editor (Can check off items &amp; add luggage)</option>
                  <option value="VIEWER">Viewer (Read-only itinerary &amp; checklist)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Collaboration Invite</span>
              </button>
            </form>

            {invitedNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Collaboration invite recorded successfully!</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Or share instant read link:</span>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
