import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bag, 
  BagType, 
  BagMaterial, 
  WeightUnit, 
  BAG_MATERIAL_PRESETS, 
  getBagEmptyWeightLbs,
  getUserPresetWeightLbs,
  setUserPresetWeightLbs
} from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { 
  Briefcase, 
  Luggage, 
  Package, 
  X, 
  Check, 
  User, 
  Scale, 
  Edit3,
  Shield,
  Layers,
  Info
} from 'lucide-react';

interface EditBagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bag: Bag | null;
  tripId: string;
  familyMembers: string[];
  weightUnit: WeightUnit;
}

export const EditBagDialog: React.FC<EditBagDialogProps> = ({
  isOpen,
  onClose,
  bag,
  tripId,
  familyMembers,
  weightUnit
}) => {
  const { updateBag } = usePacking();

  const [label, setLabel] = useState('');
  const [type, setType] = useState<BagType>('CARRY_ON');
  const [material, setMaterial] = useState<BagMaterial>('HARD_SHELL');
  const [emptyBagWeight, setEmptyBagWeight] = useState<string>('7.0');
  const [saveAsDefaultPreset, setSaveAsDefaultPreset] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [maxWeight, setMaxWeight] = useState<string>('50');

  useEffect(() => {
    if (bag) {
      setLabel(bag.label);
      setType(bag.type);
      const bagMat: BagMaterial = bag.material || (bag.type === 'PERSONAL' ? 'FABRIC' : 'HARD_SHELL');
      setMaterial(bagMat);
      
      const emptyLbs = getBagEmptyWeightLbs(bag);
      const displayEmpty = weightUnit === 'KG'
        ? (emptyLbs * 0.45359237).toFixed(1)
        : emptyLbs.toFixed(1);
      setEmptyBagWeight(displayEmpty);

      setAssignedTo(bag.assignedTo || '');
      setMaxWeight(
        bag.maxWeightLimitLbs 
          ? (weightUnit === 'KG' ? String(Math.round(bag.maxWeightLimitLbs * 0.45359237)) : String(bag.maxWeightLimitLbs))
          : (bag.type === 'CHECKED' ? (weightUnit === 'KG' ? '23' : '50') : (weightUnit === 'KG' ? '10' : '22'))
      );
    }
  }, [bag, weightUnit]);

  if (!isOpen || !bag) return null;
  if (typeof document === 'undefined') return null;

  // When changing material, auto-update the preset empty bag weight
  const handleSelectMaterial = (newMat: BagMaterial) => {
    setMaterial(newMat);
    const newLbs = getUserPresetWeightLbs(type, newMat);
    const displayVal = weightUnit === 'KG'
      ? (newLbs * 0.45359237).toFixed(1)
      : newLbs.toFixed(1);
    setEmptyBagWeight(displayVal);
  };

  // When changing bag type, adjust material preset default and update max weight limit
  const handleSelectType = (newType: BagType) => {
    setType(newType);
    const newLbs = getUserPresetWeightLbs(newType, material);
    const displayVal = weightUnit === 'KG'
      ? (newLbs * 0.45359237).toFixed(1)
      : newLbs.toFixed(1);
    setEmptyBagWeight(displayVal);

    // Automatically update the max weight limit to the standard cap for the new bag type
    const defaultWeight = newType === 'CHECKED' 
      ? (weightUnit === 'KG' ? '23' : '50') 
      : newType === 'CARRY_ON'
        ? (weightUnit === 'KG' ? '10' : '22')
        : (weightUnit === 'KG' ? '7' : '15');
    setMaxWeight(defaultWeight);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const parsedWeight = parseFloat(maxWeight);
    const weightLbs = !isNaN(parsedWeight) && parsedWeight > 0
      ? (weightUnit === 'KG' ? parsedWeight / 0.45359237 : parsedWeight)
      : undefined;

    const parsedEmpty = parseFloat(emptyBagWeight);
    const emptyLbs = !isNaN(parsedEmpty) && parsedEmpty >= 0
      ? (weightUnit === 'KG' ? parsedEmpty / 0.45359237 : parsedEmpty)
      : getUserPresetWeightLbs(type, material);

    if (saveAsDefaultPreset) {
      setUserPresetWeightLbs(type, material, emptyLbs);
    }

    updateBag(tripId, bag.id, {
      label: trimmedLabel,
      type,
      material,
      emptyBagWeightLbs: Number(emptyLbs.toFixed(2)),
      assignedTo: assignedTo ? assignedTo : undefined,
      maxWeightLimitLbs: weightLbs
    });

    onClose();
  };

  const getBagTypeIcon = (t: BagType) => {
    switch (t) {
      case 'PERSONAL':
        return <Briefcase className="w-5 h-5 text-amber-500" />;
      case 'CARRY_ON':
        return <Luggage className="w-5 h-5 text-purple-600" />;
      case 'CHECKED':
        return <Package className="w-5 h-5 text-indigo-500" />;
    }
  };

  const currentPreset = BAG_MATERIAL_PRESETS[type][material];
  const presetDisplay = weightUnit === 'KG' 
    ? `${(currentPreset.defaultLbs * 0.45359237).toFixed(1)} kg` 
    : `${currentPreset.defaultLbs.toFixed(1)} lbs`;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-purple-900/60 animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Baggage Specs & Shell
              </h2>
              <p className="text-xs text-slate-400">
                Configure luggage material, empty tare weight & limits
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Bag Name / Label */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Baggage Name / Label *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Dad's Main Suitcase, Maya's Backpack"
              className="w-full h-11 px-3.5 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 shadow-2xs"
            />
          </div>

          {/* Bag Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Luggage Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['PERSONAL', 'CARRY_ON', 'CHECKED'] as const).map((t) => {
                const isSelected = type === t;
                const labelText = t === 'PERSONAL' ? 'Personal Item' : t === 'CARRY_ON' ? 'Carry-On' : 'Checked Bag';
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleSelectType(t)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs ring-1 ring-purple-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {getBagTypeIcon(t)}
                    <span className="text-[11px] text-center leading-tight">{labelText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bag Shell / Material Selection: Hard Shell vs Fabric */}
          <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Luggage Shell Construction</span>
              </label>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                Preset Tare Weight
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Hard Shell Button */}
              <button
                type="button"
                onClick={() => handleSelectMaterial('HARD_SHELL')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  material === 'HARD_SHELL'
                    ? 'bg-white dark:bg-slate-800 border-purple-600 text-purple-950 dark:text-white shadow-xs ring-2 ring-purple-500/20'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>Hard Shell</span>
                  </span>
                  {material === 'HARD_SHELL' && (
                    <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Polycarbonate / ABS / Aluminum
                </p>
                <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Preset Weight:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {weightUnit === 'KG'
                      ? `${(BAG_MATERIAL_PRESETS[type].HARD_SHELL.defaultLbs * 0.45359237).toFixed(1)} kg`
                      : `${BAG_MATERIAL_PRESETS[type].HARD_SHELL.defaultLbs.toFixed(1)} lbs`}
                  </span>
                </div>
              </button>

              {/* Fabric Bag Button */}
              <button
                type="button"
                onClick={() => handleSelectMaterial('FABRIC')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  material === 'FABRIC'
                    ? 'bg-white dark:bg-slate-800 border-purple-600 text-purple-950 dark:text-white shadow-xs ring-2 ring-purple-500/20'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Fabric Bag</span>
                  </span>
                  {material === 'FABRIC' && (
                    <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Ballistic Nylon / Softside / Canvas
                </p>
                <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Preset Weight:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {weightUnit === 'KG'
                      ? `${(BAG_MATERIAL_PRESETS[type].FABRIC.defaultLbs * 0.45359237).toFixed(1)} kg`
                      : `${BAG_MATERIAL_PRESETS[type].FABRIC.defaultLbs.toFixed(1)} lbs`}
                  </span>
                </div>
              </button>
            </div>

            {/* Empty Bag Tare Weight Customizer */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-purple-600" />
                  <span>Empty Bag Weight Tare ({weightUnit})</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleSelectMaterial(material)}
                  className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
                >
                  Reset to preset ({presetDisplay})
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="40"
                  value={emptyBagWeight}
                  onChange={(e) => setEmptyBagWeight(e.target.value)}
                  className="w-full h-9 pl-3 pr-12 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  {weightUnit}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 leading-tight">
                <Info className="w-3 h-3 text-purple-500 shrink-0" />
                <span>Incorporated into total luggage weight to protect against overweight fees.</span>
              </p>

              <label className="flex items-center gap-2 mt-2 text-[11px] text-purple-900 dark:text-purple-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsDefaultPreset}
                  onChange={(e) => setSaveAsDefaultPreset(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Save this weight as my default preset for {type === 'PERSONAL' ? 'Personal' : type === 'CARRY_ON' ? 'Carry-on' : 'Checked'} ({material === 'HARD_SHELL' ? 'Hard Shell' : 'Fabric'})</span>
              </label>
            </div>
          </div>

          {/* Assigned Traveler */}
          {familyMembers.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>Assigned Traveler</span>
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="">Shared / Family Bag</option>
                {familyMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Weight Limit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-600" />
              <span>Airline / Carrier Weight Limit ({weightUnit})</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="1"
                max="200"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                className="w-full h-10 pl-3.5 pr-12 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {weightUnit}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
