import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bag, BagType, WeightUnit } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { 
  Briefcase, 
  Luggage, 
  Package, 
  X, 
  Check, 
  User, 
  Scale, 
  Edit3 
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
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [maxWeight, setMaxWeight] = useState<string>('50');

  useEffect(() => {
    if (bag) {
      setLabel(bag.label);
      setType(bag.type);
      setAssignedTo(bag.assignedTo || '');
      setMaxWeight(
        bag.maxWeightLimitLbs 
          ? (weightUnit === 'KG' ? String(Math.round(bag.maxWeightLimitLbs * 0.453592)) : String(bag.maxWeightLimitLbs))
          : (bag.type === 'CHECKED' ? (weightUnit === 'KG' ? '23' : '50') : (weightUnit === 'KG' ? '10' : '22'))
      );
    }
  }, [bag, weightUnit]);

  if (!isOpen || !bag) return null;
  if (typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const parsedWeight = parseFloat(maxWeight);
    const weightLbs = !isNaN(parsedWeight) && parsedWeight > 0
      ? (weightUnit === 'KG' ? parsedWeight / 0.453592 : parsedWeight)
      : undefined;

    updateBag(tripId, bag.id, {
      label: trimmedLabel,
      type,
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

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-purple-900/60 animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default"
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
                Edit Baggage Name & Details
              </h2>
              <p className="text-xs text-slate-400">
                Rename or reconfigure this bag without losing packed items
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
                    onClick={() => setType(t)}
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
              <span>Weight Limit Allowance ({weightUnit})</span>
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
