import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Trip, BagType, WeightUnit, Bag } from '../types/travel';
import { DefaultSuggestions } from '../data/suggestions';
import { DepartureCountdownCard } from './DepartureCountdownCard';
import { exportTripToPDF } from '../utils/pdfExport';
import { EditBagDialog } from './EditBagDialog';
import { 
  Plus, 
  Trash2, 
  Check, 
  MapPin, 
  Briefcase, 
  Luggage, 
  Backpack, 
  Sparkles, 
  Search, 
  AlertTriangle,
  Scale,
  Users,
  User,
  Droplets,
  ChevronRight,
  ChevronDown,
  UserCheck,
  Edit2,
  Edit3,
  UserPlus,
  ArrowRight,
  Crown,
  FileDown,
  X,
  FolderCheck,
  RotateCcw,
  QrCode,
  Lock
} from 'lucide-react';
import { PackingPresetsModal } from './PackingPresetsModal';
import { RouteIntelBanner } from './RouteIntelBanner';
import { DestinationWeatherAdvisor } from './DestinationWeatherAdvisor';
import { LuggageQrTagModal } from './LuggageQrTagModal';

interface PackingChecklistScreenProps {
  trip: Trip;
  onOpenAddItem: (bagId: string) => void;
  onOpenAddBag: () => void;
  onNavigateToAllowances?: () => void;
  onNavigateToBags?: () => void;
}

export const PackingChecklistScreen: React.FC<PackingChecklistScreenProps> = ({
  trip,
  onOpenAddItem,
  onOpenAddBag,
  onNavigateToAllowances,
  onNavigateToBags
}) => {
  const {
    selectedBagId,
    setSelectedBagId,
    weightUnit,
    toggleItemPacked,
    removeItem,
    updateItemQuantity,
    updateItemPacker,
    addItemToBag,
    removeBagFromTrip,
    renameBag,
    activePackerFilter,
    setActivePackerFilter,
    addFamilyMember,
    removeFamilyMember,
    renameFamilyMember,
    addBagToTrip,
    updateTripDetails,
    resetAllPacked
  } = usePacking();

  const { isPro, canAddTraveler, canAddBag, openPaywall } = useSubscription();

  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showLuggageQrModal, setShowLuggageQrModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unpacked' | 'packed'>('all');
  const [packerDropdownOpen, setPackerDropdownOpen] = useState(false);
  const [newTravelerInput, setNewTravelerInput] = useState('');
  const [showAddTravelerInline, setShowAddTravelerInline] = useState(false);
  const [editingTravelerName, setEditingTravelerName] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState('');
  const [showOnlyPersonItems, setShowOnlyPersonItems] = useState(true);

  // Bag rename & edit state
  const [isEditingBagName, setIsEditingBagName] = useState(false);
  const [editBagNameInput, setEditBagNameInput] = useState('');
  const [bagToEdit, setBagToEdit] = useState<Bag | null>(null);

  const packerDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (packerDropdownRef.current && !packerDropdownRef.current.contains(e.target as Node)) {
        setPackerDropdownOpen(false);
        setShowAddTravelerInline(false);
        setEditingTravelerName(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Family members list — no preset 'Self'
  const familyMembers = useMemo(() => {
    return trip.familyMembers || [];
  }, [trip.familyMembers]);

  // Calculate packed statistics & percentage for each traveler dynamically
  const travelerStats = useMemo(() => {
    const stats: Record<string, { total: number; packed: number; pct: number }> = {};
    
    // Overall whole trip stats
    let allTotal = 0;
    let allPacked = 0;

    familyMembers.forEach((m) => {
      stats[m] = { total: 0, packed: 0, pct: 0 };
    });

    trip.bags.forEach((bag) => {
      bag.items.forEach((item) => {
        allTotal++;
        if (item.isPacked) allPacked++;

        // Attribute item to specific traveler
        const targetPerson = item.packedFor || bag.assignedTo;
        if (targetPerson) {
          if (!stats[targetPerson]) {
            stats[targetPerson] = { total: 0, packed: 0, pct: 0 };
          }
          stats[targetPerson].total++;
          if (item.isPacked) {
            stats[targetPerson].packed++;
          }
        }
      });
    });

    // Compute percentages
    Object.keys(stats).forEach((k) => {
      const s = stats[k];
      s.pct = s.total > 0 ? Math.round((s.packed / s.total) * 100) : 0;
    });

    const allPct = allTotal > 0 ? Math.round((allPacked / allTotal) * 100) : 0;

    return {
      byPerson: stats,
      all: { total: allTotal, packed: allPacked, pct: allPct }
    };
  }, [trip, familyMembers]);

  // Dynamically filter bags based on selected person!
  // When 'ALL': show all bags.
  // When specific person is selected: show bags owned by this person OR bags with items packed for them.
  const displayedBags = useMemo(() => {
    if (activePackerFilter === 'ALL') {
      return trip.bags;
    }
    return trip.bags.filter((bag) => {
      const isBagOwner = bag.assignedTo === activePackerFilter;
      const hasPersonItems = bag.items.some(
        (i) => (i.packedFor || bag.assignedTo) === activePackerFilter
      );
      return isBagOwner || hasPersonItems;
    });
  }, [trip.bags, activePackerFilter]);

  // Keep selected bag in sync with displayed bags
  useEffect(() => {
    if (displayedBags.length > 0) {
      if (!selectedBagId || !displayedBags.some((b) => b.id === selectedBagId)) {
        setSelectedBagId(displayedBags[0].id);
      }
    } else if (trip.bags.length > 0 && activePackerFilter === 'ALL') {
      setSelectedBagId(trip.bags[0].id);
    }
  }, [displayedBags, selectedBagId, setSelectedBagId, trip.bags, activePackerFilter]);

  const currentBag = trip.bags.find((b) => b.id === selectedBagId) || displayedBags[0] || trip.bags[0] || null;

  // Calculate estimated weight for current bag
  const totalWeightLbs = useMemo(() => {
    if (!currentBag) return 0;
    return currentBag.items.reduce((sum, item) => {
      const itemWeight = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
      return sum + itemWeight * item.quantity;
    }, 0);
  }, [currentBag]);

  const displayWeight = weightUnit === 'KG'
    ? DefaultSuggestions.convertLbsToKg(totalWeightLbs)
    : totalWeightLbs;
  const unitLabel = weightUnit === 'KG' ? 'kg' : 'lbs';

  const typicalLimitLbs = useMemo(() => {
    if (!currentBag) return 22;
    if (currentBag.maxWeightLimitLbs) return currentBag.maxWeightLimitLbs;
    switch (currentBag.type) {
      case 'PERSONAL':
        return 15;
      case 'CARRY_ON':
        return 22;
      case 'CHECKED':
        return 50;
    }
  }, [currentBag]);

  const typicalLimitDisplay = weightUnit === 'KG'
    ? DefaultSuggestions.convertLbsToKg(typicalLimitLbs)
    : typicalLimitLbs;

  const weightPercentage = Math.min(Math.round((totalWeightLbs / typicalLimitLbs) * 100), 150);
  const isOverweight = totalWeightLbs > typicalLimitLbs;
  const isNearLimit = totalWeightLbs > typicalLimitLbs * 0.85 && !isOverweight;

  // Filtered items (search, packed status, and traveler filter)
  const filteredItems = useMemo(() => {
    if (!currentBag) return [];
    return currentBag.items.filter((item) => {
      if (activePackerFilter !== 'ALL' && showOnlyPersonItems) {
        const itemOwner = item.packedFor || currentBag.assignedTo;
        if (itemOwner !== activePackerFilter) {
          return false;
        }
      }
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.packedFor && item.packedFor.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;
      if (filterMode === 'packed') return item.isPacked;
      if (filterMode === 'unpacked') return !item.isPacked;
      return true;
    });
  }, [currentBag, searchQuery, filterMode, activePackerFilter, showOnlyPersonItems]);

  // Quick suggestions for this bag type that aren't already added
  const quickSuggestions = useMemo(() => {
    if (!currentBag) return [];
    const suggestions = DefaultSuggestions.getSuggestionsFor(currentBag.type);
    return suggestions.filter(
      (sug) => !currentBag.items.some((item) => item.name.toLowerCase() === sug.toLowerCase())
    ).slice(0, 8);
  }, [currentBag]);

  const getBagIcon = (type: BagType) => {
    switch (type) {
      case 'PERSONAL':
        return <Backpack className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'CARRY_ON':
        return <Briefcase className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />;
      case 'CHECKED':
        return <Luggage className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getBagTypeBadge = (type: BagType) => {
    switch (type) {
      case 'PERSONAL':
        return 'Personal Item';
      case 'CARRY_ON':
        return 'Carry-On';
      case 'CHECKED':
        return 'Checked Bag';
    }
  };

  const handleAddTravelerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTravelerInput.trim();
    if (!trimmed) return;

    // Enforce 1-traveler Free limit
    const travelerCheck = canAddTraveler(familyMembers.length);
    if (!travelerCheck.allowed) {
      openPaywall(travelerCheck.reason);
      setShowAddTravelerInline(false);
      return;
    }

    addFamilyMember(trip.id, trimmed);
    setActivePackerFilter(trimmed);
    setNewTravelerInput('');
    setShowAddTravelerInline(false);
  };

  const handleSaveRename = (oldName: string) => {
    const trimmed = editNameInput.trim();
    if (trimmed && trimmed !== oldName) {
      renameFamilyMember(trip.id, oldName, trimmed);
    }
    setEditingTravelerName(null);
    setEditNameInput('');
  };

  const handleQuickAddBagForPerson = (personName: string) => {
    const bagCheck = canAddBag(trip.bags, 'CARRY_ON');
    if (!bagCheck.allowed) {
      openPaywall(bagCheck.reason);
      return;
    }
    addBagToTrip(trip.id, 'CARRY_ON', `${personName.split(' ')[0]}'s Carry-on`, personName);
  };

  const handleOpenAddBagSafe = () => {
    if (!isPro && trip.bags.length >= 3) {
      openPaywall("The Free Plan is limited to a maximum of 3 bags total. Upgrade to Gate Ready Pro to pack unlimited bags.");
      return;
    }
    onOpenAddBag();
  };

  const handleExportPDF = () => {
    if (!isPro) {
      openPaywall("PDF Packing List Export is exclusive to Gate Ready Pro. Upgrade to download beautifully organized PDF lists formatted by baggage and travelers.");
      return;
    }
    exportTripToPDF(trip, weightUnit);
  };

  return (
    <div className="flex flex-col pb-24">
      {/* ============================================================== */}
      {/* NO TRAVELER SETUP PROMPT (If trip has no travelers defined)    */}
      {/* ============================================================== */}
      {familyMembers.length === 0 && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-4 sm:p-5 border-b border-purple-500/30">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>First Traveler Setup (No Preset Self)</span>
              </div>
              <p className="text-xs text-purple-100">
                Who are you packing for? Enter yourself or the first family member to unlock personalized luggage tracking.
              </p>
            </div>
            <form onSubmit={handleAddTravelerSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={newTravelerInput}
                onChange={(e) => setNewTravelerInput(e.target.value)}
                placeholder="Traveler name (e.g. Sarah, Dad, Alex)..."
                className="h-9 px-3 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-hidden focus:border-white"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-md"
              >
                Set Traveler
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOP BAR: TRAVELER DROPDOWN WITH % PACKED BESIDE DYNAMIC BAGS   */}
      {/* ============================================================== */}
      <div className="border-b border-purple-100 dark:border-purple-950/60 bg-white dark:bg-slate-900 sticky top-16 z-20 transition-colors shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-2.5">
            {/* Person / Traveler Dropdown */}
            <div className="relative shrink-0" ref={packerDropdownRef}>
              <button
                onClick={() => setPackerDropdownOpen(!packerDropdownOpen)}
                className="h-11 px-3.5 rounded-xl border-2 border-purple-300 dark:border-purple-700/80 bg-purple-50/90 dark:bg-purple-950/70 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-950 dark:text-purple-100 text-xs font-bold flex items-center gap-2.5 transition-all shadow-xs cursor-pointer"
                title="Select traveler to filter bags and view their packing progress"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  {activePackerFilter === 'ALL' ? (
                    <Users className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-purple-600 dark:text-purple-400 uppercase tracking-wider font-extrabold leading-none">
                    Traveler
                  </span>
                  <span className="truncate max-w-[100px] sm:max-w-[140px] leading-tight text-xs font-black">
                    {activePackerFilter === 'ALL' ? 'All Travelers' : activePackerFilter}
                  </span>
                </div>

                {/* % Packed badge beside the person's name */}
                <span className="ml-0.5 text-[11px] font-black px-2 py-0.5 rounded-full bg-purple-600 text-white tabular-nums shadow-xs">
                  {activePackerFilter === 'ALL'
                    ? `${travelerStats.all.pct}%`
                    : `${travelerStats.byPerson[activePackerFilter]?.pct ?? 0}%`}
                </span>
                
                <ChevronDown className="w-3.5 h-3.5 text-purple-500 shrink-0 ml-0.5" />
              </button>

              {/* Traveler Dropdown Menu with % Packed beside each person */}
              {packerDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-purple-900/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-purple-50 dark:border-purple-950/60 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                      Select Traveler
                    </span>
                    {!isPro ? (
                      <button
                        onClick={() => {
                          setPackerDropdownOpen(false);
                          openPaywall("The Free Plan is limited to 1 traveler. Upgrade to Gate Ready Pro to pack for your whole family.");
                        }}
                        className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 hover:bg-amber-200 transition-colors cursor-pointer"
                      >
                        <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>1 Traveler Max (Upgrade)</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5 fill-purple-600 text-purple-600" />
                        <span>Pro: Unlimited</span>
                      </span>
                    )}
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {/* All Travelers Option */}
                    <button
                      onClick={() => {
                        setActivePackerFilter('ALL');
                        setPackerDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                        activePackerFilter === 'ALL'
                          ? 'bg-purple-100/70 dark:bg-purple-950/80 text-purple-950 dark:text-purple-200 font-bold'
                          : 'hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs font-bold">All Travelers</p>
                          <p className="text-[10px] text-slate-400">
                            {travelerStats.all.packed} of {travelerStats.all.total} items packed
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/80 px-2 py-0.5 rounded-full tabular-nums">
                        {travelerStats.all.pct}%
                      </span>
                    </button>

                    <div className="my-1 border-t border-purple-50 dark:border-purple-950/60" />

                    {/* Each Traveler with % packed */}
                    {familyMembers.map((member) => {
                      const stats = travelerStats.byPerson[member] || { total: 0, packed: 0, pct: 0 };
                      const isSelected = activePackerFilter === member;
                      const isEditing = editingTravelerName === member;

                      if (isEditing) {
                        return (
                          <div key={member} className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/50 flex items-center gap-2">
                            <input
                              type="text"
                              autoFocus
                              value={editNameInput}
                              onChange={(e) => setEditNameInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(member);
                                if (e.key === 'Escape') setEditingTravelerName(null);
                              }}
                              className="flex-1 h-8 px-2 text-xs rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                            <button
                              onClick={() => handleSaveRename(member)}
                              className="px-2 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={member}
                          className={`w-full px-3.5 py-2 flex items-center justify-between transition-colors group ${
                            isSelected
                              ? 'bg-purple-100/70 dark:bg-purple-950/80 text-purple-950 dark:text-purple-200 font-bold'
                              : 'hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <button
                            onClick={() => {
                              setActivePackerFilter(member);
                              setPackerDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
                          >
                            <User className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold truncate leading-tight">{member}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-400">
                                  {stats.packed}/{stats.total} items
                                </span>
                                {/* Mini progress bar */}
                                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${stats.pct === 100 ? 'bg-emerald-500' : 'bg-purple-600'}`}
                                    style={{ width: `${stats.pct}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {/* % packed badge right beside the person's name */}
                            <span
                              className={`text-xs font-black px-2 py-0.5 rounded-full tabular-nums ${
                                stats.pct === 100
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                              }`}
                            >
                              {stats.pct}%
                            </span>

                            {/* Edit rename button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTravelerName(member);
                                setEditNameInput(member);
                              }}
                              className="w-6 h-6 rounded-md text-slate-400 hover:text-purple-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Rename traveler"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>

                            {/* Remove button (if >1 traveler) */}
                            {familyMembers.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFamilyMember(trip.id, member);
                                }}
                                className="w-6 h-6 rounded-md text-slate-400 hover:text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Remove traveler"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Traveler Footer */}
                  <div className="p-2 border-t border-purple-50 dark:border-purple-950/60">
                    {showAddTravelerInline ? (
                      <form onSubmit={handleAddTravelerSubmit} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          autoFocus
                          value={newTravelerInput}
                          onChange={(e) => setNewTravelerInput(e.target.value)}
                          placeholder="Name (e.g. Emma, Liam)..."
                          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                        />
                        <button
                          type="submit"
                          className="h-8 px-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddTravelerInline(false)}
                          className="h-8 px-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          if (!isPro && familyMembers.length >= 1) {
                            setPackerDropdownOpen(false);
                            openPaywall("The Free Plan is limited to 1 traveler. Upgrade to Gate Ready Pro to pack for multiple family members, children, or group companions.");
                            return;
                          }
                          setShowAddTravelerInline(true);
                        }}
                        className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          !isPro && familyMembers.length >= 1
                            ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60'
                            : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                        }`}
                      >
                        {!isPro && familyMembers.length >= 1 ? (
                          <>
                            <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Add Traveler (Pro Required)</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Add New Traveler / Child</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Separator */}
            <div className="h-8 w-px bg-purple-200/80 dark:bg-purple-900/60 shrink-0 mx-0.5" />

            {/* Dynamic Bag Tabs List (Changes based on selected traveler) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-0.5">
              {displayedBags.length === 0 ? (
                <div className="flex items-center gap-2 py-1 px-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/60 text-xs text-purple-900 dark:text-purple-200">
                  <span className="font-medium">No bags assigned to {activePackerFilter} yet.</span>
                  <button
                    onClick={() => handleQuickAddBagForPerson(activePackerFilter)}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Bag for {activePackerFilter.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={() => setActivePackerFilter('ALL')}
                    className="text-purple-600 hover:underline font-semibold ml-1 cursor-pointer"
                  >
                    View all bags
                  </button>
                </div>
              ) : (
                displayedBags.map((bag) => {
                  const isSelected = bag.id === currentBag?.id;
                  
                  // If filtering by specific traveler, show that traveler's items count in this bag!
                  const bagItemsForView = activePackerFilter === 'ALL'
                    ? bag.items
                    : bag.items.filter((i) => (i.packedFor || bag.assignedTo) === activePackerFilter);
                  
                  const bagPacked = bagItemsForView.filter((i) => i.isPacked).length;
                  const bagTotal = bagItemsForView.length;

                  return (
                    <div
                      key={bag.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedBagId(bag.id)}
                        className="flex items-center gap-2 text-left cursor-pointer"
                      >
                        <div className={isSelected ? 'text-white' : ''}>{getBagIcon(bag.type)}</div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold leading-tight truncate max-w-[120px]">{bag.label}</p>
                            {bag.assignedTo && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                }`}
                              >
                                {bag.assignedTo.split(' ')[0]}
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] ${isSelected ? 'text-purple-100' : 'text-slate-400 dark:text-slate-500'}`}>
                            {getBagTypeBadge(bag.type)} · {bagPacked}/{bagTotal}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBagToEdit(bag);
                        }}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-purple-200 hover:text-white hover:bg-purple-700'
                            : 'text-slate-400 hover:text-purple-600 hover:bg-purple-100/60 dark:hover:bg-slate-700'
                        }`}
                        title={`Edit name of "${bag.label}"`}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}

              {/* Add Bag Button */}
              <button
                onClick={handleOpenAddBagSafe}
                className="h-10 px-3 rounded-xl border border-dashed border-purple-300 dark:border-purple-700/80 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100/60 dark:hover:bg-purple-900/40 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                title="Add luggage bag to trip"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bag</span>
                {!isPro && trip.bags.length >= 3 && (
                  <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Max
                  </span>
                )}
              </button>

              {/* Manage Bags in Dedicated Tab */}
              {onNavigateToBags && (
                <button
                  type="button"
                  onClick={onNavigateToBags}
                  className="h-10 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950/60 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-2xs"
                  title="Open dedicated Bags manager tab"
                >
                  <Luggage className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>All Bags ({trip.bags.length})</span>
                  <ArrowRight className="w-3 h-3 text-purple-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CARRY-ON LIQUID DISCLAIMER (Always shown for carry-on luggage) */}
      {/* ============================================================== */}
      {currentBag && currentBag.type === 'CARRY_ON' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div className="rounded-2xl border border-purple-300 dark:border-purple-800 bg-linear-to-r from-purple-50 via-fuchsia-50/40 to-white dark:from-purple-950/50 dark:via-purple-900/30 dark:to-slate-900 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-950 dark:text-purple-100 flex items-center gap-1.5">
                  <span>Carry-On Liquid Allowance Notice (TSA 3-1-1 Rule)</span>
                  <span className="text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.2 rounded-full font-extrabold uppercase">
                    Mandatory
                  </span>
                </p>
                <p className="text-[11px] text-purple-900/80 dark:text-purple-200/80 mt-0.5 leading-snug">
                  Liquids, gels, and aerosols must be in containers of <strong className="text-purple-950 dark:text-white">3.4 oz (100ml) or less</strong> and packed in ONE clear quart-sized zip bag per passenger. Baby formula, breast milk, and medications are exempt.
                </p>
              </div>
            </div>

            {onNavigateToAllowances && (
              <button
                onClick={onNavigateToAllowances}
                className="shrink-0 text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-purple-900 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 shadow-2xs transition-colors cursor-pointer"
              >
                <span>View Full Allowance Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Checklist Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 space-y-4 w-full">
        {/* Recommended Route Intel Bar: Power Converter Brick, Local Currency, Tipping */}
        <RouteIntelBanner trip={trip} />

        {/* Destination Weather & Clothing Packing Advisor */}
        <DestinationWeatherAdvisor trip={trip} />

        {/* Interactive Live Departure Countdown & Smart Reminders (Pro exclusive) */}
        <DepartureCountdownCard trip={trip} />

        {/* Return Flight Repack Banner (When in return trip mode) */}
        {trip.isReturnRepackMode && (
          <div className="rounded-2xl bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-50 dark:from-purple-950/70 dark:via-indigo-950/50 dark:to-slate-900 border border-purple-300 dark:border-purple-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    Return Flight & Hotel Checkout Repack Mode
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white px-2 py-0.2 rounded-md">
                    Return Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  All items are assigned to their exact bags & compartments from flight #1. Check off each item as you pack your hotel room so no chargers or passports are left behind.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => resetAllPacked(trip.id)}
                className="h-8 px-3 rounded-xl bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-50 cursor-pointer shadow-2xs"
              >
                Reset Checkboxes
              </button>
              <button
                type="button"
                onClick={() => updateTripDetails(trip.id, { isReturnRepackMode: false })}
                className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-2xs"
              >
                Done Repacking
              </button>
            </div>
          </div>
        )}

        {/* Active Traveler Filter Banner (if filtering by specific person) */}
        {activePackerFilter !== 'ALL' && (
          <div className="rounded-2xl bg-purple-100/70 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/80 px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div className="text-xs text-purple-950 dark:text-purple-100">
                <span className="font-semibold">Showing items for </span>
                <strong className="font-black">{activePackerFilter}</strong>
                <span className="text-slate-500 dark:text-slate-400 ml-1.5">
                  ({travelerStats.byPerson[activePackerFilter]?.packed ?? 0} of {travelerStats.byPerson[activePackerFilter]?.total ?? 0} packed · {travelerStats.byPerson[activePackerFilter]?.pct ?? 0}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOnlyPersonItems(!showOnlyPersonItems)}
                className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
              >
                {showOnlyPersonItems ? 'Show all bag items' : `Show only ${activePackerFilter.split(' ')[0]}'s items`}
              </button>
              <button
                onClick={() => setActivePackerFilter('ALL')}
                className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 cursor-pointer"
              >
                Reset to All
              </button>
            </div>
          </div>
        )}

        {/* Current Bag Overview Card & Weight Gauge */}
        {currentBag && (
          <div className="rounded-2xl border border-purple-100 dark:border-purple-950/60 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-purple-50 dark:border-purple-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                  {getBagIcon(currentBag.type)}
                </div>
                <div>
                  {isEditingBagName ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editBagNameInput.trim()) {
                          renameBag(trip.id, currentBag.id, editBagNameInput.trim());
                          setIsEditingBagName(false);
                        }
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        required
                        autoFocus
                        value={editBagNameInput}
                        onChange={(e) => setEditBagNameInput(e.target.value)}
                        placeholder="Bag label / name"
                        className="h-8 px-2.5 text-xs font-bold rounded-lg border border-purple-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Save bag name"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Save</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingBagName(false)}
                        className="h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setBagToEdit(currentBag)}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer text-left"
                        title="Click to edit or rename this baggage"
                      >
                        {currentBag.label}
                      </button>

                      <button
                        type="button"
                        onClick={() => setBagToEdit(currentBag)}
                        className="h-7 px-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors cursor-pointer shadow-2xs"
                        title="Edit name, type or weight of this bag"
                      >
                        <Edit3 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>Edit / Rename</span>
                      </button>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {getBagTypeBadge(currentBag.type)}
                      </span>
                      {currentBag.assignedTo && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Assigned to: {currentBag.assignedTo}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentBag.items.filter((i) => i.isPacked).length} of {currentBag.items.length} items packed
                  </p>
                </div>
              </div>

              {/* Weight Indicator */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Scale className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {displayWeight.toFixed(1)} {unitLabel}
                    </span>
                    <span className="text-xs text-slate-400">
                      / {typicalLimitDisplay.toFixed(0)} {unitLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Estimated allowance weight</p>
                </div>

                {trip.bags.length > 1 && (
                  <button
                    onClick={() => removeBagFromTrip(trip.id, currentBag.id)}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove this bag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Weight Progress Bar */}
            <div className="mt-3.5">
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverweight
                      ? 'bg-rose-500'
                      : isNearLimit
                      ? 'bg-amber-500'
                      : 'bg-purple-600'
                  }`}
                  style={{ width: `${Math.min(weightPercentage, 100)}%` }}
                />
              </div>

              {isOverweight && (
                <div className="flex items-center gap-1.5 mt-2 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Warning: Bag is estimated to exceed the carrier {typicalLimitDisplay} {unitLabel} weight limit! Surcharges may apply.
                  </span>
                </div>
              )}

              {/* Souvenir Buffer Warning Bar */}
              {weightPercentage >= 75 && !isOverweight && (
                <div className="flex items-center justify-between p-3 mt-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-950 dark:text-amber-200 animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-amber-900 dark:text-amber-300">
                        Souvenir & Return Buffer Alert ({weightPercentage.toFixed(0)}% full):
                      </span>
                      <p className="text-[11px] text-amber-800/90 dark:text-amber-200/90 mt-0.5">
                        You're nearing the {typicalLimitDisplay} {unitLabel} maximum! Frequent flyers recommend leaving 15%–20% weight and volume free so you have room for souvenirs, conference materials, and hotel gifts on the way back.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty Bags State (If trip has no bags configured) */}
        {!currentBag && (
          <div className="rounded-3xl border border-dashed border-purple-200 dark:border-purple-800 bg-white/70 dark:bg-slate-900/60 p-8 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto mb-3">
              <Luggage className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Luggage Added Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto mb-5 leading-relaxed">
              Add a Personal Item (backpack, purse), Carry-On Bag, or Checked Suitcase to track items, check airline limits, and calculate bag weight.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => addBagToTrip(trip.id, 'PERSONAL', 'Backpack / Personal Item')}
                className="h-10 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
              >
                + Add Personal Item
              </button>
              <button
                onClick={() => addBagToTrip(trip.id, 'CARRY_ON', 'Main Carry-On')}
                className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all cursor-pointer"
              >
                + Add Carry-On Bag
              </button>
              <button
                onClick={() => addBagToTrip(trip.id, 'CHECKED', 'Checked Suitcase')}
                className="h-10 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
              >
                + Add Checked Bag
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        {currentBag && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, compartments, or traveler name..."
              className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-purple-50 dark:bg-slate-900 p-1 rounded-xl border border-purple-100 dark:border-purple-900/40">
              {(['all', 'unpacked', 'packed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                    filterMode === mode
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Presets & Templates Button */}
            <button
              onClick={() => {
                if (!isPro) {
                  openPaywall("Upgrade to Gate Ready Pro to load pre-built frequent traveler packing kits and custom bag templates.");
                  return;
                }
                setShowPresetsModal(true);
              }}
              className="h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
              title="Load pre-built frequent traveler packing kits or save this bag as a custom preset (Pro)"
            >
              <FolderCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Presets</span>
              <span className="sm:hidden">Presets</span>
              {!isPro && <Crown className="w-3 h-3 fill-amber-400 text-amber-500" />}
            </button>

            {/* Emergency Luggage QR Tag Generator */}
            <button
              onClick={() => {
                if (!isPro) {
                  openPaywall("Upgrade to Gate Ready Pro to generate privacy-safe emergency luggage QR tags and recovery claim cards.");
                  return;
                }
                setShowLuggageQrModal(true);
              }}
              className="h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              title="Generate privacy-safe emergency luggage QR tag and recovery claim card (Pro)"
            >
              <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">QR Bag Tag</span>
              <span className="sm:hidden">QR Tag</span>
              {!isPro && (
                <span className="inline-flex items-center gap-0.5 bg-amber-400 text-purple-950 font-black text-[9px] px-1.5 py-0.2 rounded shadow-2xs">
                  <Lock className="w-2.5 h-2.5" /> PRO
                </span>
              )}
            </button>

            {/* PDF Export Button (Pro feature) */}
            <button
              onClick={handleExportPDF}
              className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border ${
                isPro
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-purple-600/20 active:scale-95'
                  : 'bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-700 dark:text-slate-200 border-purple-200 dark:border-purple-800'
              }`}
              title="Download packing list as a formatted PDF with baggage headers"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
              {!isPro && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 fill-white" /> Pro
                </span>
              )}
            </button>
          </div>
        </div>
        )}

        {/* Items List */}
        {currentBag && (
          <div className="space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-purple-200 dark:border-purple-900/60 bg-white/50 dark:bg-slate-900/50">
                <Luggage className="w-10 h-10 text-purple-300 dark:text-purple-700 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No items found
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? `No items match "${searchQuery}"`
                    : activePackerFilter !== 'ALL'
                    ? `No items packed for ${activePackerFilter} in this bag yet.`
                    : 'This bag is currently empty. Tap Add Item below or pick from quick suggestions.'}
                </p>
                <button
                  onClick={() => onOpenAddItem(currentBag.id)}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  + Add Item to Bag
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const itemEstimatedWeight = (
                  (item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name)) *
                  item.quantity
                );
                const displayItemWeight = weightUnit === 'KG'
                  ? DefaultSuggestions.convertLbsToKg(itemEstimatedWeight)
                  : itemEstimatedWeight;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all ${
                      item.isPacked
                        ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-900/40 opacity-80'
                        : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-950/60 shadow-2xs hover:border-purple-300'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleItemPacked(trip.id, currentBag.id, item.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors border cursor-pointer ${
                        item.isPacked
                          ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                          : 'border-purple-300 dark:border-slate-700 hover:border-purple-500'
                      }`}
                      aria-label={item.isPacked ? 'Mark item unpacked' : 'Mark item packed'}
                    >
                      {item.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold leading-tight ${
                            item.isPacked
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.name}
                        </span>

                        {item.quantity > 1 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            x{item.quantity}
                          </span>
                        )}

                        {/* Person Tag */}
                        {item.packedFor && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-800 dark:text-fuchsia-300 flex items-center gap-0.5">
                            <User className="w-2.5 h-2.5" />
                            <span>{item.packedFor}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400" />
                          <span>{item.location}</span>
                        </span>
                        <span>·</span>
                        <span>
                          ~{displayItemWeight.toFixed(1)} {unitLabel}
                        </span>
                      </div>
                    </div>

                    {/* Reassign Person Dropdown */}
                    {familyMembers.length > 1 && (
                      <select
                        value={item.packedFor || currentBag.assignedTo || familyMembers[0]}
                        onChange={(e) => updateItemPacker(trip.id, currentBag.id, item.id, e.target.value)}
                        className="text-[10px] font-semibold h-7 px-1.5 rounded-lg border border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-slate-800 text-purple-800 dark:text-purple-300 focus:outline-hidden hidden sm:block cursor-pointer"
                        title="Change traveler this item belongs to"
                      >
                        {familyMembers.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateItemQuantity(trip.id, currentBag.id, item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItemQuantity(trip.id, currentBag.id, item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeItem(trip.id, currentBag.id, item.id)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Quick Item Suggestions */}
        {currentBag && quickSuggestions.length > 0 && (
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Suggested for {getBagTypeBadge(currentBag.type)}:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() =>
                    addItemToBag(
                      trip.id,
                      currentBag.id,
                      suggestion,
                      'Main Compartment',
                      1,
                      activePackerFilter !== 'ALL' ? activePackerFilter : currentBag.assignedTo
                    )
                  }
                  className="px-2.5 py-1 text-xs rounded-xl bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 border border-purple-200/80 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button: Add Item */}
      {currentBag && (
        <div className="fixed bottom-20 right-6 z-20">
          <button
            onClick={() => onOpenAddItem(currentBag.id)}
            className="h-13 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add Item</span>
            {activePackerFilter !== 'ALL' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                for {activePackerFilter.split(' ')[0]}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Edit Baggage Dialog */}
      <EditBagDialog
        isOpen={bagToEdit !== null}
        onClose={() => setBagToEdit(null)}
        bag={bagToEdit}
        tripId={trip.id}
        familyMembers={familyMembers}
        weightUnit={weightUnit}
      />

      {/* Frequent Traveler Presets Modal */}
      {showPresetsModal && currentBag && (
        <PackingPresetsModal
          isOpen={showPresetsModal}
          onClose={() => setShowPresetsModal(false)}
          trip={trip}
          targetBag={currentBag}
        />
      )}

      {/* Emergency Luggage Recovery QR Tag Modal */}
      {showLuggageQrModal && currentBag && (
        <LuggageQrTagModal
          isOpen={showLuggageQrModal}
          onClose={() => setShowLuggageQrModal(false)}
          trip={trip}
          bag={currentBag}
        />
      )}
    </div>
  );
};
