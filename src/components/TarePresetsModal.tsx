import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BagType, 
  BagMaterial, 
  WeightUnit, 
  BAG_MATERIAL_PRESETS,
  getUserPresetWeightLbs, 
  setUserPresetWeightLbs, 
  resetUserPresetWeights,
  Trip
} from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { 
  Scale, 
  X, 
  Check, 
  RotateCcw, 
  Shield, 
  Layers, 
  Briefcase, 
  Luggage, 
  Package, 
  Sparkles,
  Info
} from 'lucide-react';

interface TarePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weightUnit: WeightUnit;
  trip?: Trip | null;
}

export const TarePresetsModal: React.FC<TarePresetsModalProps> = ({
  isOpen,
  onClose,
  weightUnit,
  trip
}) => {
  const { updateBag } = usePacking();

  const [presets, setPresets] = useState<Record<BagType, Record<BagMaterial, number>>>({
    PERSONAL: {
      FABRIC: 1.5,
      HARD_SHELL: 3.0
    },
    CARRY_ON: {
      FABRIC: 5.5,
      HARD_SHELL: 7.0
    },
    CHECKED: {
      FABRIC: 8.5,
      HARD_SHELL: 10.5
    }
  });

  const [applyToExisting, setApplyToExisting] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load current values
  const loadValues = () => {
    const types: BagType[] = ['PERSONAL', 'CARRY_ON', 'CHECKED'];
    const mats: BagMaterial[] = ['FABRIC', 'HARD_SHELL'];
    const next: any = { PERSONAL: {}, CARRY_ON: {}, CHECKED: {} };

    types.forEach((t) => {
      mats.forEach((m) => {
        next[t][m] = getUserPresetWeightLbs(t, m);
      });
    });

    setPresets(next);
  };

  useEffect(() => {
    if (isOpen) {
      loadValues();
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleWeightChange = (type: BagType, mat: BagMaterial, valueStr: string) => {
    const parsed = parseFloat(valueStr);
    if (isNaN(parsed) || parsed < 0) return;
    
    // convert from active display unit to lbs for storage
    const lbsVal = weightUnit === 'KG' ? parsed / 0.45359237 : parsed;
    setPresets((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [mat]: Number(lbsVal.toFixed(2))
      }
    }));
  };

  const handleResetDefaults = () => {
    resetUserPresetWeights();
    loadValues();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const types: BagType[] = ['PERSONAL', 'CARRY_ON', 'CHECKED'];
    const mats: BagMaterial[] = ['FABRIC', 'HARD_SHELL'];

    types.forEach((t) => {
      mats.forEach((m) => {
        const val = presets[t][m];
        setUserPresetWeightLbs(t, m, val);
      });
    });

    // Optionally sync all current trip bags to use the new preset tare weights
    if (applyToExisting && trip && trip.bags) {
      trip.bags.forEach((bag) => {
        const mat = bag.material || (bag.type === 'PERSONAL' ? 'FABRIC' : 'HARD_SHELL');
        const targetEmptyLbs = presets[bag.type]?.[mat] ?? 7.0;
        updateBag(trip.id, bag.id, {
          material: mat,
          emptyBagWeightLbs: targetEmptyLbs
        });
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 500);
  };

  const formatDisplay = (lbs: number) => {
    if (weightUnit === 'KG') {
      return (lbs * 0.45359237).toFixed(1);
    }
    return lbs.toFixed(1);
  };

  const getBagTypeIcon = (t: BagType) => {
    switch (t) {
      case 'PERSONAL':
        return <Briefcase className="w-4 h-4 text-amber-500" />;
      case 'CARRY_ON':
        return <Luggage className="w-4 h-4 text-purple-600" />;
      case 'CHECKED':
        return <Package className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getBagTypeTitle = (t: BagType) => {
    switch (t) {
      case 'PERSONAL':
        return 'Personal Item (Backpack / Tote / Underseat)';
      case 'CARRY_ON':
        return 'Carry-On (Overhead Roller / Duffle)';
      case 'CHECKED':
        return 'Checked Suitcase (Large Trunk)';
    }
  };

  const bagTypes: BagType[] = ['CARRY_ON', 'CHECKED', 'PERSONAL'];

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-purple-900/60 animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Preset Luggage Tare Weights
              </h2>
              <p className="text-xs text-slate-400">
                Configure empty bag weights for Hard Shell & Fabric luggage
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

        {/* Explain Notice */}
        <div className="my-3 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Real-World Luggage Weight Fact:</p>
            <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
              Suitcases themselves weigh 5 to 11 lbs empty. Gate Ready incorporates your empty bag weight into the live airline scales so you never get surprised by airport check-in scales.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {bagTypes.map((t) => (
            <div 
              key={t}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
            >
              <div className="flex items-center gap-2">
                {getBagTypeIcon(t)}
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {getBagTypeTitle(t)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Hard Shell Setting */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1 text-purple-700 dark:text-purple-300">
                      <Shield className="w-3 h-3 text-purple-600" />
                      <span>Hard Shell</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      std: {formatDisplay(BAG_MATERIAL_PRESETS[t].HARD_SHELL.defaultLbs)} {weightUnit.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={formatDisplay(presets[t].HARD_SHELL)}
                      onChange={(e) => handleWeightChange(t, 'HARD_SHELL', e.target.value)}
                      className="w-full h-8 px-2 text-xs font-black rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                    />
                    <span className="text-xs font-bold text-slate-400 uppercase">{weightUnit}</span>
                  </div>
                </div>

                {/* Fabric Setting */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300">
                      <Layers className="w-3 h-3 text-indigo-500" />
                      <span>Fabric / Softside</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      std: {formatDisplay(BAG_MATERIAL_PRESETS[t].FABRIC.defaultLbs)} {weightUnit.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={formatDisplay(presets[t].FABRIC)}
                      onChange={(e) => handleWeightChange(t, 'FABRIC', e.target.value)}
                      className="w-full h-8 px-2 text-xs font-black rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                    />
                    <span className="text-xs font-bold text-slate-400 uppercase">{weightUnit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Sync Existing Bags Checkbox */}
          {trip && trip.bags.length > 0 && (
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={applyToExisting}
                onChange={(e) => setApplyToExisting(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span>Apply updated tare weights to all {trip.bags.length} bags in current trip</span>
            </label>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{saveSuccess ? 'Saved!' : 'Save Presets'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
