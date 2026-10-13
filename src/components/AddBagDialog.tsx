import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { BagType, BagMaterial, Trip, getUserPresetWeightLbs, BAG_MATERIAL_PRESETS } from '../types/travel';
import { X, Backpack, Briefcase, Luggage, User, Crown, AlertTriangle, Shield, Layers, Scale, Check } from 'lucide-react';

interface AddBagDialogProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
}

export const AddBagDialog: React.FC<AddBagDialogProps> = ({
  isOpen,
  trip,
  onClose
}) => {
  const { addBagToTrip } = usePacking();
  const { isPro, canAddBag, openPaywall } = useSubscription();

  const familyMembers = trip.familyMembers && trip.familyMembers.length > 0 
    ? trip.familyMembers 
    : ['Traveler 1'];

  // Select initial bag type that user does not have yet if on free plan
  const defaultInitialType: BagType = !isPro
    ? (!trip.bags.some(b => b.type === 'CARRY_ON') ? 'CARRY_ON'
       : !trip.bags.some(b => b.type === 'PERSONAL') ? 'PERSONAL'
       : 'CHECKED')
    : 'CARRY_ON';

  const defaultMaterial: BagMaterial = defaultInitialType === 'PERSONAL' ? 'FABRIC' : 'HARD_SHELL';

  const [bagType, setBagType] = useState<BagType>(defaultInitialType);
  const [material, setMaterial] = useState<BagMaterial>(defaultMaterial);
  const [emptyBagWeight, setEmptyBagWeight] = useState<string>(
    String(getUserPresetWeightLbs(defaultInitialType, defaultMaterial))
  );
  const [label, setLabel] = useState(`${familyMembers[0].split(' ')[0]}'s ${defaultInitialType === 'PERSONAL' ? 'Backpack' : defaultInitialType === 'CARRY_ON' ? 'Carry-on' : 'Suitcase'}`);
  const [assignedTo, setAssignedTo] = useState<string>(familyMembers[0] || 'Traveler 1');

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSelectMaterial = (mat: BagMaterial) => {
    setMaterial(mat);
    const preset = getUserPresetWeightLbs(bagType, mat);
    setEmptyBagWeight(String(preset));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    // Check Free Plan limits: max 3 bags total & max 1 of each bag type
    const bagCheck = canAddBag(trip.bags, bagType);
    if (!bagCheck.allowed) {
      onClose();
      openPaywall(bagCheck.reason);
      return;
    }

    const parsedEmpty = parseFloat(emptyBagWeight);
    const finalEmptyLbs = !isNaN(parsedEmpty) && parsedEmpty >= 0
      ? parsedEmpty
      : getUserPresetWeightLbs(bagType, material);

    addBagToTrip(trip.id, bagType, label, assignedTo, material, finalEmptyLbs);
    onClose();
  };

  const handleSelectType = (type: BagType) => {
    // If on Free plan and they already have this type, prompt paywall
    if (!isPro && trip.bags.some(b => b.type === type)) {
      onClose();
      openPaywall(`You already have a ${type === 'PERSONAL' ? 'Personal Item' : type === 'CARRY_ON' ? 'Carry-On' : 'Checked Bag'}. The Free Plan allows 1 of each bag type (up to 2 bags total). Upgrade to Silver, Gold, or Platinum to pack multiple bags of the same type.`);
      return;
    }

    setBagType(type);
    const newPreset = getUserPresetWeightLbs(type, material);
    setEmptyBagWeight(String(newPreset));

    if (type === 'PERSONAL') setLabel(`${assignedTo.split(' ')[0]}'s Backpack`);
    if (type === 'CARRY_ON') setLabel(`${assignedTo.split(' ')[0]}'s Carry-on`);
    if (type === 'CHECKED') setLabel(`${assignedTo.split(' ')[0]}'s Suitcase`);
  };

  const hardPreset = getUserPresetWeightLbs(bagType, 'HARD_SHELL');
  const fabricPreset = getUserPresetWeightLbs(bagType, 'FABRIC');

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/60 overflow-hidden flex flex-col relative z-[100000] cursor-default max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-purple-50 dark:border-purple-950/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Bag to Trip
            </h3>
            {!isPro && (
              <span className="text-[10px] text-slate-400">
                Free Plan: {trip.bags.length}/3 bags total
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Plan limit warning banner if already at max */}
          {!isPro && trip.bags.length >= 3 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-200">Bag Limit Reached</p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                  Free plan is limited to 3 bags total. Adding more bags requires Gate Ready Pro.
                </p>
              </div>
            </div>
          )}

          {/* Assigned Traveler / Child */}
          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>Assigned Traveler</span>
            </label>
            <select
              value={assignedTo}
              onChange={(e) => {
                setAssignedTo(e.target.value);
                setLabel(`${e.target.value.split(' ')[0]}'s ${bagType === 'PERSONAL' ? 'Backpack' : bagType === 'CARRY_ON' ? 'Carry-on' : 'Suitcase'}`);
              }}
              className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-slate-800 text-purple-900 dark:text-purple-200 focus:outline-hidden cursor-pointer"
            >
              {familyMembers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Bag Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                Bag Type
              </label>
              {!isPro && (
                <span className="text-[10px] text-slate-400">1 of each type</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'PERSONAL' as BagType, label: 'Personal', icon: Backpack },
                { type: 'CARRY_ON' as BagType, label: 'Carry-on', icon: Briefcase },
                { type: 'CHECKED' as BagType, label: 'Checked', icon: Luggage }
              ].map(({ type, label: typeLabel, icon: Icon }) => {
                const alreadyExistsOnTrip = !isPro && trip.bags.some((b) => b.type === type);
                const isSelected = bagType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSelectType(type)}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
                        : alreadyExistsOnTrip
                        ? 'border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-slate-500 hover:border-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50/30 dark:hover:bg-slate-800'
                    }`}
                  >
                    {alreadyExistsOnTrip && (
                      <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 rounded-full flex items-center gap-0.5">
                        <Crown className="w-2 h-2 fill-white" /> Pro
                      </span>
                    )}
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-bold">{typeLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hard Shell vs Fabric Bag Construction */}
          <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Luggage Shell Construction</span>
              </label>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                Presets Incorporated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectMaterial('HARD_SHELL')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  material === 'HARD_SHELL'
                    ? 'bg-white dark:bg-slate-800 border-purple-600 text-purple-950 dark:text-white shadow-xs ring-2 ring-purple-500/20'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>Hard Shell</span>
                  </span>
                  {material === 'HARD_SHELL' && (
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Preset Tare:</span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400">
                    {hardPreset} lbs
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMaterial('FABRIC')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  material === 'FABRIC'
                    ? 'bg-white dark:bg-slate-800 border-purple-600 text-purple-950 dark:text-white shadow-xs ring-2 ring-purple-500/20'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Fabric Bag</span>
                  </span>
                  {material === 'FABRIC' && (
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Preset Tare:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {fabricPreset} lbs
                  </span>
                </div>
              </button>
            </div>

            {/* Custom Tare Input */}
            <div className="pt-1 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Scale className="w-3 h-3 text-purple-600" />
                <span>Empty Suitcase Tare Weight:</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={emptyBagWeight}
                  onChange={(e) => setEmptyBagWeight(e.target.value)}
                  className="w-16 h-7 px-2 text-center text-xs font-black rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] font-bold text-slate-400">lbs</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
              Bag Name / Label *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Emma's Backpack, Main Suitcase"
              className="w-full h-11 px-3.5 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="pt-2 border-t border-purple-50 dark:border-purple-950/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
            >
              Add Bag
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
