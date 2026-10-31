import React, { useState, useMemo } from 'react';
import { Trip, Bag, BagType, BagMaterial, getBagEmptyWeightLbs, getUserPresetWeightLbs } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { DefaultSuggestions } from '../data/suggestions';
import { scanItemForLiquids } from '../utils/liquidScanner';
import { 
  Luggage, 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Scale, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  QrCode, 
  FolderCheck, 
  Crown, 
  Lock,
  User, 
  Droplets, 
  CheckCircle2,
  ShieldCheck,
  Search,
  RotateCcw,
  Minus,
  FileDown,
  Shield,
  Layers,
  Printer,
  Share2,
  Info
} from 'lucide-react';
import { airlineLimits } from '../data/allowances';
import { EditBagDialog } from './EditBagDialog';
import { LuggageQrTagModal } from './LuggageQrTagModal';
import { PackingPresetsModal } from './PackingPresetsModal';
import { TarePresetsModal } from './TarePresetsModal';
import { AddItemDialog } from './AddItemDialog';
import { DestinationWeatherAdvisor } from './DestinationWeatherAdvisor';
import { EntryRequirementsCard } from './EntryRequirementsCard';
import { BaggageFeeEstimatorCard } from './BaggageFeeEstimatorCard';
import { PrintPackingListModal } from './PrintPackingListModal';
import { SharePackingListModal } from './SharePackingListModal';
import { getCarrierCarryOnPolicy } from '../utils/bagWeightAnalysis';

interface BaggageScreenProps {
  trip: Trip;
  onOpenAddBag: () => void;
  onOpenReferral?: () => void;
}

export const BaggageScreen: React.FC<BaggageScreenProps> = ({
  trip,
  onOpenAddBag,
  onOpenReferral
}) => {
  const { 
    weightUnit, 
    removeBagFromTrip, 
    selectedBagId, 
    setSelectedBagId, 
    addBagToTrip,
    updateBag,
    toggleItemPacked,
    removeItem,
    updateItemQuantity,
    addItemToBag,
    activePackerFilter,
    resetAllPacked
  } = usePacking();
  const { isPro, canAddBag, openPaywall } = useSubscription();

  const [bagToEdit, setBagToEdit] = useState<Bag | null>(null);
  const [showQrModalForBag, setShowQrModalForBag] = useState<Bag | null>(null);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showTarePresetsModal, setShowTarePresetsModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Search and filter state for active bag
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unpacked' | 'packed'>('all');
  const [quickItemInput, setQuickItemInput] = useState('');
  const [quickItemCategory, setQuickItemCategory] = useState('Main Compartment');

  // Currently active bag
  const activeBag = useMemo(() => {
    if (!trip.bags || trip.bags.length === 0) return null;
    const found = trip.bags.find((b) => b.id === selectedBagId);
    return found || trip.bags[0];
  }, [trip.bags, selectedBagId]);

  const isCar = trip.travelType === 'CAR';
  const isFlight = (trip.travelType === 'PLANE' || !trip.travelType) && !['CAR', 'TRAIN', 'CRUISE', 'BUS'].includes(trip.travelType || '');

  // Carrier carry-on allowance intelligence (Air Canada, Trains, Car, etc.)
  const carrierCarryOnPolicy = useMemo(() => {
    return getCarrierCarryOnPolicy(trip.companyName, trip.travelType);
  }, [trip.companyName, trip.travelType]);

  // Overweight fee avoidance radar (incorporates empty luggage tare weight + packed items)
  const bagWeightAnalysis = useMemo(() => {
    return (trip.bags || []).map((b) => {
      const emptyLbs = getBagEmptyWeightLbs(b);
      const itemsLbs = b.items.reduce(
        (sum, item) => sum + (item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name)) * (item.quantity || 1),
        0
      );
      const totalWeightLbs = emptyLbs + itemsLbs;
      const displayedWeightNum = Number(totalWeightLbs.toFixed(1));
      const formattedWeight = displayedWeightNum.toFixed(1);
      const isCarryOn = b.type === 'CARRY_ON';
      const hasNoLimit = isCar || (isCarryOn && carrierCarryOnPolicy.hasNoWeightLimit) || (!isFlight && b.type !== 'CHECKED');

      const capLbs = isCar
        ? 0
        : b.type === 'CHECKED' 
          ? 50 
          : !isFlight
            ? 50
            : isCarryOn 
              ? (carrierCarryOnPolicy.limitLbs ?? 22) 
              : 15;

      const rawPct = (capLbs > 0 && !hasNoLimit) ? (displayedWeightNum / capLbs) * 100 : 0;
      const isOverweight = !hasNoLimit && displayedWeightNum > capLbs;
      const isNearLimit = !hasNoLimit && displayedWeightNum >= capLbs * 0.85 && !isOverweight;

      // Fix 3: Compute percentage FROM displayed weight so 21.9 / 22 = 99.5%, 22.5 / 22 = 102.3%
      let formattedPct = '0%';
      if (hasNoLimit) {
        formattedPct = isCar ? 'No vehicle limit' : 'No limit';
      } else {
        formattedPct = `${rawPct.toFixed(1)}%`;
      }

      return {
        bag: b,
        emptyLbs,
        itemsLbs,
        totalWeightLbs,
        displayedWeightNum,
        capLbs,
        pct: rawPct,
        formattedPct,
        formattedWeight,
        isOverweight,
        isNearLimit,
        hasNoLimit
      };
    });
  }, [trip.bags, carrierCarryOnPolicy, isCar, isFlight]);

  const overweightRiskBag = bagWeightAnalysis.find((b) => b.isOverweight || b.isNearLimit);
  const lightestBag = useMemo(() => {
    if (bagWeightAnalysis.length < 2) return null;
    return [...bagWeightAnalysis].sort((a, b) => a.pct - b.pct)[0];
  }, [bagWeightAnalysis]);

  const [rebalanceToast, setRebalanceToast] = useState<string | null>(null);

  const handleSmartRebalance = () => {
    if (!isPro) {
      openPaywall("Smart Bag Rebalancer is a Silver+ feature. Upgrade to automatically shift items between bags and avoid steep airline overweight penalty fees.");
      return;
    }

    if (!overweightRiskBag || !lightestBag || overweightRiskBag.bag.id === lightestBag.bag.id) {
      setRebalanceToast("Bags are already safely balanced!");
      setTimeout(() => setRebalanceToast(null), 3500);
      return;
    }

    // Find the heaviest item from the overweight risk bag
    const candidateItems = [...overweightRiskBag.bag.items].sort((a, b) => {
      const wA = (a.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(a.name));
      const wB = (b.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(b.name));
      return wB - wA;
    });

    const itemToMove = candidateItems[0];
    if (!itemToMove) {
      setRebalanceToast("No items found to rebalance.");
      setTimeout(() => setRebalanceToast(null), 3000);
      return;
    }

    removeItem(trip.id, overweightRiskBag.bag.id, itemToMove.id);
    addItemToBag(
      trip.id,
      lightestBag.bag.id,
      itemToMove.name,
      itemToMove.location,
      itemToMove.quantity,
      itemToMove.packedFor
    );

    setRebalanceToast(`Rebalanced! Moved "${itemToMove.name}" to ${lightestBag.bag.label} to avoid airline penalty fees.`);
    setTimeout(() => setRebalanceToast(null), 4000);
  };

  const getBagIcon = (type: BagType) => {
    switch (type) {
      case 'PERSONAL':
        return <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'CARRY_ON':
        return <Luggage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'CHECKED':
        return <Luggage className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Luggage className="w-5 h-5 text-purple-600" />;
    }
  };

  const getBagTypeBadge = (type: BagType) => {
    switch (type) {
      case 'PERSONAL':
        return 'Personal Item';
      case 'CARRY_ON':
        return 'Carry-On Roller';
      case 'CHECKED':
        return 'Checked Suitcase';
      default:
        return type;
    }
  };

  const getBagWeightCap = (bag: Bag): number => {
    if (isCar) {
      return 0;
    }
    if (!isFlight) {
      const capLbs = bag.maxWeightLimitLbs || 50;
      return weightUnit === 'KG' ? Math.round(capLbs * 0.45359237) : capLbs;
    }
    if (bag.type === 'CARRY_ON' && carrierCarryOnPolicy.limitLbs) {
      return weightUnit === 'KG'
        ? Math.round(carrierCarryOnPolicy.limitLbs * 0.45359237)
        : carrierCarryOnPolicy.limitLbs;
    }
    const standardCapLbs = bag.type === 'CHECKED' ? 50 : bag.type === 'CARRY_ON' ? 22 : 15;
    let rawLimitLbs = bag.maxWeightLimitLbs;
    if (!rawLimitLbs || (bag.type !== 'CHECKED' && rawLimitLbs >= 40)) {
      rawLimitLbs = standardCapLbs;
    }
    if (weightUnit === 'KG') {
      return Math.round(rawLimitLbs * 0.45359237);
    }
    return rawLimitLbs;
  };

  const getNoLimitNote = () => {
    if (isCar) return 'No vehicle weight limit';
    if (trip.travelType === 'TRAIN') return 'No rail weight limit · Rail coach';
    if (trip.travelType === 'CRUISE') return 'No cruise weight limit · Cruise stateroom';
    if (trip.travelType === 'BUS') return 'No bus weight limit · Bus overhead';
    return `No airline weight limit · ${trip.companyName || 'Air Canada'}`;
  };

  // Safe Add Bag check (strictly limits Free to 2 bags)
  const handleOpenAddBagSafe = () => {
    if (!isPro && trip.bags.length >= 2) {
      openPaywall('Free Plan is limited to a maximum of 2 bags total. Upgrade to Silver ($1.99/mo), Gold, or Platinum to pack unlimited bags.');
      return;
    }
    onOpenAddBag();
  };

  const handleOpenQrTagSafe = (bag: Bag) => {
    if (!isPro) {
      openPaywall("Emergency QR Luggage Tag generator is a Silver+ feature. Upgrade to create and print privacy-safe recovery tags.");
      return;
    }
    setShowQrModalForBag(bag);
  };

  // Safe 1-Click Luggage Bundles
  const applyLuggageBundle = (bundle: 'CARRY_ON_ONLY' | 'CHECKED_PLUS_CARRY' | 'MINIMALIST') => {
    const primary = trip.familyMembers?.[0] || 'Traveler 1';
    if (!isPro) {
      if (bundle === 'CHECKED_PLUS_CARRY') {
        openPaywall('Free Plan allows only 1 Checked Bag per trip (up to 2 bags total). Upgrade to Silver, Gold, or Platinum to pack unlimited bags.');
        return;
      }
      if (trip.bags.length >= 2) {
        openPaywall('Free Plan is limited to a maximum of 2 bags total. Upgrade to Silver ($1.99/mo), Gold, or Platinum to pack unlimited bags.');
        return;
      }
    }

    if (bundle === 'CARRY_ON_ONLY') {
      const checkCarry = canAddBag(trip.bags, 'CARRY_ON');
      if (!checkCarry.allowed) {
        openPaywall(checkCarry.reason);
        return;
      }
      addBagToTrip(trip.id, 'CARRY_ON', 'Carry-On Roller', primary);
      if (trip.bags.length + 1 < 2) {
        const checkPersonal = canAddBag([...trip.bags, { id: 'temp', type: 'CARRY_ON' } as any], 'PERSONAL');
        if (checkPersonal.allowed) {
          addBagToTrip(trip.id, 'PERSONAL', 'Personal Backpack', primary);
        }
      }
    } else if (bundle === 'CHECKED_PLUS_CARRY') {
      if (!isPro) {
        openPaywall('Free Plan allows only 1 Checked Bag per trip (up to 2 bags total). Upgrade to Silver, Gold, or Platinum to pack unlimited bags.');
        return;
      }
      addBagToTrip(trip.id, 'CHECKED', 'Checked Suitcase (50 lbs)', primary);
      addBagToTrip(trip.id, 'CARRY_ON', 'Carry-On Roller', primary);
    } else if (bundle === 'MINIMALIST') {
      const checkPersonal = canAddBag(trip.bags, 'PERSONAL');
      if (!checkPersonal.allowed) {
        openPaywall(checkPersonal.reason);
        return;
      }
      addBagToTrip(trip.id, 'PERSONAL', 'Minimalist Backpack', primary);
    }
  };

  // Active bag calculations (incorporating luggage tare weight + packed items)
  const activeBagTareLbs = useMemo(() => {
    if (!activeBag) return 0;
    return getBagEmptyWeightLbs(activeBag);
  }, [activeBag]);

  const activeBagItemsWeightLbs = useMemo(() => {
    if (!activeBag) return 0;
    return activeBag.items.reduce((sum, item) => {
      const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
      return sum + w * (item.quantity || 1);
    }, 0);
  }, [activeBag]);

  const activeBagWeightLbs = useMemo(() => {
    return activeBagTareLbs + activeBagItemsWeightLbs;
  }, [activeBagTareLbs, activeBagItemsWeightLbs]);

  const activeDisplayWeight = weightUnit === 'KG'
    ? DefaultSuggestions.convertLbsToKg(activeBagWeightLbs)
    : activeBagWeightLbs;
  const activeDisplayTare = weightUnit === 'KG'
    ? DefaultSuggestions.convertLbsToKg(activeBagTareLbs)
    : activeBagTareLbs;
  const activeDisplayItems = weightUnit === 'KG'
    ? DefaultSuggestions.convertLbsToKg(activeBagItemsWeightLbs)
    : activeBagItemsWeightLbs;

  const activeBagHasNoWeightLimit = isCar || (activeBag?.type === 'CARRY_ON' && carrierCarryOnPolicy.hasNoWeightLimit) || (!isFlight && activeBag?.type !== 'CHECKED');
  const activeWeightCap = activeBag ? getBagWeightCap(activeBag) : (weightUnit === 'KG' ? 10 : 22);
  const isOverweight = !activeBagHasNoWeightLimit && activeDisplayWeight > activeWeightCap;
  const isNearLimit = !activeBagHasNoWeightLimit && activeDisplayWeight > activeWeightCap * 0.85 && !isOverweight;
  const rawWeightPct = activeWeightCap > 0 ? (activeDisplayWeight / activeWeightCap) * 100 : 0;
  const weightPct = activeBagHasNoWeightLimit
    ? Math.min((activeDisplayWeight / (weightUnit === 'KG' ? 18 : 40)) * 100, 100)
    : Math.min(rawWeightPct, 150);

  const handleQuickUpdateMaterial = (targetBag: Bag, newMat: BagMaterial) => {
    const targetTare = getUserPresetWeightLbs(targetBag.type, newMat);
    updateBag(trip.id, targetBag.id, {
      material: newMat,
      emptyBagWeightLbs: targetTare
    });
  };

  const getTareDisplay = (type: BagType, mat: BagMaterial) => {
    const lbs = getUserPresetWeightLbs(type, mat);
    if (weightUnit === 'KG') {
      return `${(lbs * 0.45359237).toFixed(1)} kg`;
    }
    return `${lbs.toFixed(1)} lbs`;
  };

  // Filtered items in active bag
  const filteredItems = useMemo(() => {
    if (!activeBag) return [];
    return activeBag.items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.packedFor && item.packedFor.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchSearch) return false;
      if (filterMode === 'packed') return item.isPacked;
      if (filterMode === 'unpacked') return !item.isPacked;
      return true;
    });
  }, [activeBag, searchQuery, filterMode]);

  // Quick suggestions for active bag type
  const quickSuggestions = useMemo(() => {
    if (!activeBag) return [];
    const suggestions = DefaultSuggestions.getSuggestionsFor(activeBag.type);
    return suggestions.filter(
      (sug) => !activeBag.items.some((item) => item.name.toLowerCase() === sug.toLowerCase())
    ).slice(0, 6);
  }, [activeBag]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickItemInput.trim() || !activeBag) return;
    addItemToBag(
      trip.id,
      activeBag.id,
      quickItemInput.trim(),
      quickItemCategory,
      1,
      activeBag.assignedTo || trip.familyMembers?.[0] || 'Traveler 1'
    );
    setQuickItemInput('');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-24 space-y-6">
      {/* ============================================================== */}
      {/* 1. TOP HEADER: BAGS HUB & FREE/PRO BAG ALLOWANCE STATUS       */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 border-b border-purple-100 dark:border-purple-950/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-2xs">
              <Luggage className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  Luggage & Packing Inventory
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {isFlight ? 'TSA 3-1-1 & Tare Verified' : 'Tare & Weight Verified'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Bags, Suitcase Scales & Packing Manifest
              </h1>
            </div>
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 rounded-full shrink-0">
              {trip.bags.length} {trip.bags.length === 1 ? 'Bag Configured' : 'Bags Configured'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {isFlight
              ? 'Real-time weight meters, empty luggage tare deductions, TSA liquid regulation compliance, and airline overhead sizer auditing.'
              : trip.travelType === 'CAR'
                ? 'Real-time weight meters, empty luggage tare deductions, and vehicle trunk & cargo space limits.'
                : trip.travelType === 'TRAIN'
                  ? 'Real-time weight meters, empty luggage tare deductions, and rail coach luggage allowances.'
                  : trip.travelType === 'CRUISE'
                    ? 'Real-time weight meters, empty luggage tare deductions, and cruise stateroom baggage allowances.'
                    : 'Real-time weight meters, empty luggage tare deductions, and coach bus baggage limits.'}
          </p>
        </div>

        {/* Action Buttons: Add Bag & Presets */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowTarePresetsModal(true)}
            className="h-9 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Configure empty luggage tare weights for Hard Shell & Fabric bags"
          >
            <Scale className="w-3.5 h-3.5 text-purple-600" />
            <span>Tare Presets</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPresetsModal(true)}
            className="h-9 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Apply ready-to-go packing presets and templates"
          >
            <FolderCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="h-9 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Print complete itemized packing list and baggage manifest"
          >
            <Printer className="w-3.5 h-3.5 text-purple-600" />
            <span>Print List</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="h-9 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Share packing list link with friends & family"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Share List</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddBagSafe}
            className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Bag</span>
            {!isPro && trip.bags.length >= 2 && (
              <span className="text-[9px] bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md font-black flex items-center gap-0.5 ml-0.5">
                <Crown className="w-2.5 h-2.5 fill-purple-950" /> Max
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Free Plan 2-Bag Limit Notice / Pro Upgrade Banner */}
      {!isPro && (
        <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Luggage className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <span className="font-extrabold text-purple-950 dark:text-purple-200">
                Free Plan: 2 Bags Included ({Math.min(trip.bags.length, 2)}/2 used)
              </span>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                Upgrade to Silver ($1.99/mo), Gold, or Platinum to pack unlimited bags and unlock multiple checked suitcases.
              </p>
            </div>
          </div>

          <button
            onClick={() => openPaywall('Upgrade to Silver, Gold, or Platinum for unlimited luggage and bags.')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-xs hover:from-amber-500 hover:to-amber-600"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Destination Weather & Clothing Advisor (Quick Access on Packing Screen) */}
      <DestinationWeatherAdvisor trip={trip} />

      {/* Feature 2: Entry Requirements (Passport validity + Visa rules, CA/US) */}
      <EntryRequirementsCard trip={trip} />

      {/* Feature 1: Baggage Fee Estimator (Airline Bag Fees & Overweight Calculator) */}
      <BaggageFeeEstimatorCard trip={trip} />

      {/* Airline Overweight Risk Radar & Bag Rebalancer Banner */}
      {overweightRiskBag && (
        <div className={`p-4 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
          overweightRiskBag.isOverweight
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-2xl shrink-0 ${overweightRiskBag.isOverweight ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  {overweightRiskBag.isOverweight 
                    ? (isFlight ? 'High Overweight Risk (Steep Airline Overweight Penalty)' : 'Luggage Limit Warning (Exceeds Allowance)') 
                    : (isFlight ? 'Airline Overweight Warning (85%+ Capacity)' : 'Luggage Weight Warning (85%+ Capacity)')}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white/70 dark:bg-black/40">
                  {overweightRiskBag.bag.label}: {overweightRiskBag.formattedWeight} / {overweightRiskBag.capLbs} lbs ({overweightRiskBag.formattedPct}) · incl. {overweightRiskBag.emptyLbs.toFixed(1)} lbs {overweightRiskBag.bag.material === 'FABRIC' ? 'fabric' : 'hard shell'} bag tare
                </span>
              </div>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {isFlight 
                  ? `Major airlines charge steep fees for bags over limits. Shift dense items into ${lightestBag?.bag.label || 'another bag'} to travel free of fees.`
                  : `Shift dense items into ${lightestBag?.bag.label || 'another bag'} to keep your luggage easy to manage and within limits.`}
              </p>
              {rebalanceToast && (
                <p className="text-xs font-black text-purple-700 dark:text-purple-300 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{rebalanceToast}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={handleSmartRebalance}
              className={`h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                isPro
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-amber-400 hover:bg-amber-500 text-purple-950'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isPro ? 'Auto-Rebalance Bags' : 'Unlock Rebalance (Silver+)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. VISUAL BAG SELECTOR CARDS                                   */}
      {/* ============================================================== */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Bag to Pack & Manage Items:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trip.bags.map((bag) => {
            const isSelected = activeBag?.id === bag.id;
            const bagTotal = bag.items.length;
            const bagPacked = bag.items.filter((i) => i.isPacked).length;
            const emptyLbs = getBagEmptyWeightLbs(bag);
            const itemsWeight = bag.items.reduce(
              (sum, item) => sum + (item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name)) * (item.quantity || 1),
              0
            );
            const totalWeight = emptyLbs + itemsWeight;
            const dispWeight = weightUnit === 'KG' ? DefaultSuggestions.convertLbsToKg(totalWeight) : totalWeight;
            const dispEmpty = weightUnit === 'KG' ? DefaultSuggestions.convertLbsToKg(emptyLbs) : emptyLbs;
            const limit = getBagWeightCap(bag);
            const bagMat: BagMaterial = bag.material || (bag.type === 'PERSONAL' ? 'FABRIC' : 'HARD_SHELL');
            const bagHasNoWeightLimit = isCar || (bag.type === 'CARRY_ON' && carrierCarryOnPolicy.hasNoWeightLimit) || (!isFlight && bag.type !== 'CHECKED');

            return (
              <div
                key={bag.id}
                onClick={() => setSelectedBagId(bag.id)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-600 dark:border-purple-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-purple-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600'
                      }`}>
                        {getBagIcon(bag.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {bag.label}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            {getBagTypeBadge(bag.type)}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5 ${
                            bagMat === 'HARD_SHELL'
                              ? 'bg-purple-100/80 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                              : 'bg-indigo-100/80 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                          }`}>
                            {bagMat === 'HARD_SHELL' ? <Shield className="w-2.5 h-2.5 text-purple-600 shrink-0" /> : <Layers className="w-2.5 h-2.5 text-indigo-500 shrink-0" />}
                            <span>{bagMat === 'HARD_SHELL' ? 'Hard' : 'Fabric'} · {dispEmpty.toFixed(1)}{weightUnit.toLowerCase()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Bag button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBagToEdit(bag);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer"
                      title="Edit bag name, shell or tare weight"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Traveler badge */}
                  {bag.assignedTo && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <User className="w-3 h-3 text-purple-500" />
                      <span>{bag.assignedTo}</span>
                    </div>
                  )}
                </div>

                {/* Weight & Progress */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    {bagHasNoWeightLimit ? (
                      <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block">
                        {dispWeight.toFixed(1)} {weightUnit}{' '}
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          ({getNoLimitNote()})
                        </span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block">
                        {dispWeight.toFixed(1)} / {limit} {weightUnit}
                      </span>
                    )}
                    <span className="text-[9px] text-slate-400 font-medium">
                      incl. {dispEmpty.toFixed(1)} {weightUnit.toLowerCase()} bag
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    bagPacked === bagTotal && bagTotal > 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {bagPacked}/{bagTotal} packed
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {trip.bags.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-purple-200 dark:border-purple-850 p-8 text-center bg-purple-50/40 dark:bg-purple-950/20 my-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-3 shadow-xs">
              <Luggage className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
              No bags added to this trip yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 max-w-sm mx-auto">
              Add a carry-on roller, personal backpack, or checked suitcase to start packing and checking airline weight limits.
            </p>
            <button
              onClick={handleOpenAddBagSafe}
              className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-purple-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Bag</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. ACTIVE BAG ITEM PACKING CHECKLIST                           */}
      {/* ============================================================== */}
      {activeBag && (
        <div className="rounded-3xl border border-purple-200/90 dark:border-purple-900/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-md space-y-5">
          {/* Active Bag Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-50 dark:border-purple-950/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                {getBagIcon(activeBag.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {activeBag.label}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {getBagTypeBadge(activeBag.type)}
                  </span>
                  {activeBag.assignedTo && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Packer: {activeBag.assignedTo}
                    </span>
                  )}

                  {/* 1-Click Shell Switcher */}
                  <div className="flex items-center gap-0.5 bg-purple-50/80 dark:bg-slate-800 p-0.5 rounded-xl border border-purple-200/80 dark:border-purple-900/60">
                    <button
                      type="button"
                      onClick={() => handleQuickUpdateMaterial(activeBag, 'HARD_SHELL')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        (activeBag.material || (activeBag.type === 'PERSONAL' ? 'FABRIC' : 'HARD_SHELL')) === 'HARD_SHELL'
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                      title={`Switch to Hard Shell (preset tare: ${getTareDisplay(activeBag.type, 'HARD_SHELL')})`}
                    >
                      <Shield className="w-2.5 h-2.5" />
                      <span>Hard Shell ({getTareDisplay(activeBag.type, 'HARD_SHELL')})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickUpdateMaterial(activeBag, 'FABRIC')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        (activeBag.material || (activeBag.type === 'PERSONAL' ? 'FABRIC' : 'HARD_SHELL')) === 'FABRIC'
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                      title={`Switch to Fabric Bag (preset tare: ${getTareDisplay(activeBag.type, 'FABRIC')})`}
                    >
                      <Layers className="w-2.5 h-2.5" />
                      <span>Fabric ({getTareDisplay(activeBag.type, 'FABRIC')})</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeBag.items.filter((i) => i.isPacked).length} of {activeBag.items.length} {activeBag.items.length === 1 ? 'item packed' : 'items packed'} into this bag
                </p>
              </div>
            </div>

            {/* Bag Actions: QR Recovery Tag & Delete Bag */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => handleOpenQrTagSafe(activeBag)}
                className="h-8 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title={isPro ? "Generate printable emergency QR luggage tag" : "Emergency QR Luggage Tag (Silver+)"}
              >
                <QrCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>QR Tag</span>
                {!isPro && (
                  <span className="inline-flex items-center gap-0.5 bg-amber-400 text-purple-950 font-black text-[9px] px-1.5 py-0.2 rounded shadow-2xs">
                    <Lock className="w-2.5 h-2.5" /> SILVER+
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setBagToEdit(activeBag)}
                className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>

              {trip.bags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBagFromTrip(trip.id, activeBag.id)}
                  className="w-8 h-8 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer"
                  title="Remove this bag"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Weight Indicator Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-purple-600" />
                <span>Total Luggage Weight (Suitcase Tare + Contents)</span>
              </span>
              <span className="font-black text-slate-900 dark:text-white">
                {activeBagHasNoWeightLimit ? (
                  <>
                    {activeDisplayWeight.toFixed(1)} {weightUnit}{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ({getNoLimitNote()})
                    </span>
                  </>
                ) : (
                  <>
                    {activeDisplayWeight.toFixed(1)} {weightUnit}{' '}
                    <span className="font-normal text-slate-400">
                      / {activeWeightCap} {weightUnit} limit {activeBag?.type === 'CARRY_ON' ? `(${carrierCarryOnPolicy.label})` : ''}
                    </span>
                  </>
                )}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  activeBagHasNoWeightLimit
                    ? 'bg-purple-600 dark:bg-purple-500'
                    : isOverweight
                    ? 'bg-rose-500'
                    : isNearLimit
                    ? 'bg-amber-500'
                    : 'bg-purple-600'
                }`}
                style={{ width: `${Math.min(weightPct, 100)}%` }}
              />
            </div>

            {/* Weight Breakdown: Tare + Items */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-[11px] border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                  <Luggage className="w-3 h-3 text-purple-600" />
                  <span>Suitcase: <strong>{activeDisplayTare.toFixed(1)} {weightUnit}</strong> ({activeBag.material === 'FABRIC' ? 'Fabric' : 'Hard Shell'})</span>
                </span>
                <span className="text-slate-400 font-bold">+</span>
                <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                  <FolderCheck className="w-3 h-3 text-indigo-500" />
                  <span>Contents: <strong>{activeDisplayItems.toFixed(1)} {weightUnit}</strong></span>
                </span>
                <span className="text-slate-400 font-bold">=</span>
                <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md font-extrabold text-purple-900 dark:text-purple-200">
                  <span>{activeDisplayWeight.toFixed(1)} {weightUnit}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setBagToEdit(activeBag)}
                className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-bold cursor-pointer ml-auto flex items-center gap-1"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Adjust Empty Bag Tare</span>
              </button>
            </div>

            {activeBagHasNoWeightLimit && (
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-[11px] text-purple-950 dark:text-purple-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p>
                    <strong className="text-purple-900 dark:text-purple-100 font-bold">
                      {trip.travelType === 'TRAIN'
                        ? 'Rail Carry-On Allowance: '
                        : trip.travelType === 'BUS'
                          ? 'Bus Luggage Allowance: '
                          : trip.travelType === 'CRUISE'
                            ? 'Cruise Baggage Allowance: '
                            : trip.travelType === 'CAR'
                              ? 'Vehicle Cargo Allowance: '
                              : `${trip.companyName || 'Airline'} Carry-On Allowance: `}
                    </strong>
                    {carrierCarryOnPolicy.note || 'No weight limit'}.
                  </p>
                  <p className="text-purple-800/80 dark:text-purple-300/80 text-[10px]">
                    Dimensional guidance: <strong>{carrierCarryOnPolicy.dimensions}</strong> {isFlight ? '(must be light enough to store in overhead without assistance).' : trip.travelType === 'CAR' ? '(vehicle trunk / cargo space).' : '(must be liftable into coach luggage rack unassisted).'}
                  </p>
                </div>
              </div>
            )}

            {!activeBagHasNoWeightLimit && isOverweight && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 pt-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Warning: Exceeds standard {activeWeightCap} {weightUnit} allowance! Surcharges may apply.</span>
              </p>
            )}

            {activeBag.type === 'CARRY_ON' && isFlight && (
              <p className="text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1 pt-0.5 font-medium">
                <Droplets className="w-3.5 h-3.5 text-purple-600" />
                <span>TSA 3-1-1 Rule: Liquids, gels, and aerosols must be 3.4oz (100ml) or less in a clear quart-sized bag.</span>
              </p>
            )}
          </div>

          {/* Quick Add Item Bar */}
          <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              required
              value={quickItemInput}
              onChange={(e) => setQuickItemInput(e.target.value)}
              placeholder={`Add an item to ${activeBag.label} (e.g. Toothbrush, Hoodie, Passport)...`}
              className="flex-1 h-10 px-3.5 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 shadow-2xs"
            />

            <select
              value={quickItemCategory}
              onChange={(e) => setQuickItemCategory(e.target.value)}
              aria-label="Item Compartment"
              className="h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="Main Compartment">Main Compartment</option>
              <option value="Front Zipper Pocket">Front Pocket</option>
              <option value="Toiletry Pouch">Toiletry Pouch</option>
              <option value="Laptop Sleeve">Laptop Sleeve</option>
              <option value="Shoe Compartment">Shoe Compartment</option>
            </select>

            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Item</span>
            </button>
          </form>

          {/* Quick Suggestions Chips */}
          {quickSuggestions.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-slate-400">Suggestions:</span>
              {quickSuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => addItemToBag(trip.id, activeBag.id, sug, 'Main Compartment', 1, activeBag.assignedTo)}
                  className="h-6 px-2 text-[11px] font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items in this bag..."
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-end sm:self-center">
              {(['all', 'unpacked', 'packed'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMode(m)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                    filterMode === m
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Packing Items List */}
          <div className="space-y-2 pt-2">
            {activeBag.items.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border-2 border-dashed border-purple-200 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-3">
                  <Luggage className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeBag.label} is currently empty
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Type an item in the bar above, tap one of the quick suggestions, or load a curated packing preset.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPresetsModal(true)}
                    className="h-8 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <FolderCheck className="w-3.5 h-3.5" />
                    <span>Browse Packing Presets</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(true)}
                    className="h-8 px-3.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-750 text-purple-950 dark:text-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Custom Item Details</span>
                  </button>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No items match your search & filter. Use the input above to add items to {activeBag.label}.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.isPacked
                      ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 dark:border-purple-950/40'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-purple-200'
                  }`}
                >
                  {/* Item Checkbox & Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleItemPacked(trip.id, activeBag.id, item.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        item.isPacked
                          ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                          : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 bg-white dark:bg-slate-900'
                      }`}
                      title={item.isPacked ? 'Mark unpacked' : 'Mark packed'}
                    >
                      {item.isPacked && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`text-xs font-bold truncate ${
                          item.isPacked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                        }`}>
                          {item.name}
                        </p>
                        {isFlight && (() => {
                          const lq = scanItemForLiquids(item.name, activeBag.type);
                          if (!lq.isLiquid) return null;
                          if (lq.status === 'NON_COMPLIANT') {
                            return (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900 flex items-center gap-1 shrink-0" title={lq.alertMessage}>
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>TSA 3-1-1 Alert (&gt;3.4 oz)</span>
                              </span>
                            );
                          }
                          if (lq.status === 'COMPLIANT') {
                            return (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-0.5 shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                <span>TSA Pass ({lq.capacityOz ? `${lq.capacityOz}oz` : `${lq.capacityMl}ml`})</span>
                              </span>
                            );
                          }
                          if (lq.status === 'CHECKED_PERMITTED') {
                            return (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-0.5 shrink-0">
                                <Droplets className="w-2.5 h-2.5" />
                                <span>Checked Liquid</span>
                              </span>
                            );
                          }
                          return (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-0.5 shrink-0">
                              <Droplets className="w-2.5 h-2.5" />
                              <span>TSA 3-1-1 (≤3.4oz)</span>
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span>{item.location}</span>
                        {item.packedFor && <span>· For: {item.packedFor}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(trip.id, activeBag.id, item.id, Math.max(1, item.quantity - 1))}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black px-1.5 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(trip.id, activeBag.id, item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(trip.id, activeBag.id, item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Actions: Reset Checklist */}
          {activeBag.items.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {activeBag.items.filter((i) => i.isPacked).length} of {activeBag.items.length} {activeBag.items.length === 1 ? 'item' : 'items'} checked
              </span>

              <button
                type="button"
                onClick={() => resetAllPacked(trip.id)}
                className="h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Checkboxes</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS: EDIT BAG, QR TAG, PRESETS, ADD ITEM                   */}
      {/* ============================================================== */}
      {bagToEdit && (
        <EditBagDialog
          isOpen={!!bagToEdit}
          onClose={() => setBagToEdit(null)}
          bag={bagToEdit}
          tripId={trip.id}
          familyMembers={trip.familyMembers || []}
          weightUnit={weightUnit}
        />
      )}

      {showQrModalForBag && (
        <LuggageQrTagModal
          isOpen={!!showQrModalForBag}
          onClose={() => setShowQrModalForBag(null)}
          trip={trip}
          bag={showQrModalForBag}
        />
      )}

      {showPresetsModal && trip.bags[0] && (
        <PackingPresetsModal
          isOpen={showPresetsModal}
          onClose={() => setShowPresetsModal(false)}
          trip={trip}
          targetBag={activeBag || trip.bags[0]}
        />
      )}

      {showTarePresetsModal && (
        <TarePresetsModal
          isOpen={showTarePresetsModal}
          onClose={() => setShowTarePresetsModal(false)}
          weightUnit={weightUnit}
          trip={trip}
        />
      )}

      {showAddItemModal && activeBag && (
        <AddItemDialog
          isOpen={showAddItemModal}
          bag={activeBag}
          trip={trip}
          onClose={() => setShowAddItemModal(false)}
        />
      )}

      {/* Itemized Printable Packing List & Manifest Modal */}
      <PrintPackingListModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        trip={trip}
      />

      {/* Share Packing List Modal */}
      <SharePackingListModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        trip={trip}
        onOpenReferral={onOpenReferral}
      />
    </div>
  );
};
