import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Luggage, 
  X, 
  Plus, 
  Check, 
  Trash2, 
  Edit3, 
  Scale, 
  Ruler, 
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { LuggageProfile, BagType, BagMaterial, Trip } from '../types/travel';
import { 
  getLuggageLibrary, 
  saveLuggageProfile, 
  deleteLuggageProfile 
} from '../utils/luggageLibrary';
import { trackEvent } from '../utils/analytics';

interface LuggageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrip?: Trip | null;
  onAddBagToCurrentTrip?: (profile: LuggageProfile) => void;
}

export const LuggageLibraryModal: React.FC<LuggageLibraryModalProps> = ({
  isOpen,
  onClose,
  currentTrip,
  onAddBagToCurrentTrip
}) => {
  const [library, setLibrary] = useState<LuggageProfile[]>(getLuggageLibrary);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [type, setType] = useState<BagType>('CARRY_ON');
  const [material, setMaterial] = useState<BagMaterial>('HARD_SHELL');
  const [emptyBagWeightLbs, setEmptyBagWeightLbs] = useState<number>(7.0);
  const [lengthInches, setLengthInches] = useState<number>(22);
  const [widthInches, setWidthInches] = useState<number>(14);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedTraveler, setAssignedTraveler] = useState('');

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setName('');
    setType('CARRY_ON');
    setMaterial('HARD_SHELL');
    setEmptyBagWeightLbs(7.0);
    setLengthInches(22);
    setWidthInches(14);
    setHeightInches(9);
    setBrand('');
    setColor('');
    setNotes('');
    setAssignedTraveler('');
    setEditingId(null);
    setIsAddingNew(true);
  };

  const handleEdit = (profile: LuggageProfile) => {
    setName(profile.name);
    setType(profile.type);
    setMaterial(profile.material);
    setEmptyBagWeightLbs(profile.emptyBagWeightLbs);
    setLengthInches(profile.lengthInches || 22);
    setWidthInches(profile.widthInches || 14);
    setHeightInches(profile.heightInches || 9);
    setBrand(profile.brand || '');
    setColor(profile.color || '');
    setNotes(profile.notes || '');
    setAssignedTraveler(profile.assignedTraveler || '');
    setEditingId(profile.id);
    setIsAddingNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved = saveLuggageProfile({
      id: editingId || undefined,
      name: name.trim(),
      type,
      material,
      emptyBagWeightLbs: Number(emptyBagWeightLbs) || (material === 'HARD_SHELL' ? 7.0 : 5.5),
      lengthInches: Number(lengthInches) || undefined,
      widthInches: Number(widthInches) || undefined,
      heightInches: Number(heightInches) || undefined,
      brand: brand.trim() || undefined,
      color: color.trim() || undefined,
      notes: notes.trim() || undefined,
      assignedTraveler: assignedTraveler.trim() || undefined
    });

    setLibrary(getLuggageLibrary());
    setIsAddingNew(false);
    setEditingId(null);
    trackEvent('luggage_profile_saved', { bag_type: type });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteLuggageProfile(id);
    setLibrary(getLuggageLibrary());
  };

  const handleAddToTrip = (profile: LuggageProfile) => {
    if (onAddBagToCurrentTrip) {
      onAddBagToCurrentTrip(profile);
      trackEvent('luggage_profile_applied', { bag_type: profile.type });
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 min-h-screen cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800 overflow-hidden flex flex-col relative z-[100000] cursor-default animate-in zoom-in-95 duration-150 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-purple-200">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                Personal Luggage Library
              </h3>
              <p className="text-[11px] text-purple-200/90">
                Save your suitcases once — attach to any trip with 1 click
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isAddingNew ? (
            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Luggage Profile' : 'Save New Luggage Profile'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Suitcase Name / Nickname *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Away Carry-On Spinner, Dad's Blue Delsey"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Bag Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as BagType)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="PERSONAL">Personal Item (Daypack/Tote)</option>
                    <option value="CARRY_ON">Carry-On Spinner / Roller</option>
                    <option value="CHECKED">Checked Suitcase / Trunk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Shell Material
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value as BagMaterial)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="HARD_SHELL">Hard Shell (Polycarbonate/ABS)</option>
                    <option value="FABRIC">Fabric / Softside (Ballistic Nylon)</option>
                  </select>
                </div>
              </div>

              {/* Empty tare weight */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Empty Bag Tare Weight (lbs) *
                  </label>
                  <span className="text-[10px] text-purple-600 font-semibold">
                    Deducts shell weight automatically
                  </span>
                </div>
                <div className="relative">
                  <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="35"
                    required
                    value={emptyBagWeightLbs}
                    onChange={(e) => setEmptyBagWeightLbs(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Dimensions (Inches: Length × Width × Height)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="60"
                    placeholder="L (e.g. 22)"
                    value={lengthInches || ''}
                    onChange={(e) => setLengthInches(parseFloat(e.target.value) || 0)}
                    className="h-9 px-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="60"
                    placeholder="W (e.g. 14)"
                    value={widthInches || ''}
                    onChange={(e) => setWidthInches(parseFloat(e.target.value) || 0)}
                    className="h-9 px-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="60"
                    placeholder="H (e.g. 9)"
                    value={heightInches || ''}
                    onChange={(e) => setHeightInches(parseFloat(e.target.value) || 0)}
                    className="h-9 px-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Away, Samsonite"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Color (Optional)
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Navy, Rose Gold"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save to Luggage Library</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {library.length} Saved Suitcase Profiles
                </span>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Suitcase</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {library.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                        <Luggage className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {profile.name}
                          </p>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {profile.type.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Scale className="w-3 h-3 text-purple-600" />
                            Tare: <strong>{profile.emptyBagWeightLbs} lbs</strong>
                          </span>
                          {profile.lengthInches && profile.widthInches && profile.heightInches && (
                            <span className="flex items-center gap-1">
                              <Ruler className="w-3 h-3 text-purple-600" />
                              {profile.lengthInches}×{profile.widthInches}×{profile.heightInches} in
                            </span>
                          )}
                          {profile.brand && <span>· {profile.brand}</span>}
                          {profile.color && <span>({profile.color})</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {currentTrip && onAddBagToCurrentTrip && (
                        <button
                          type="button"
                          onClick={() => handleAddToTrip(profile)}
                          className="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Add this saved suitcase to current trip"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Use for Trip</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEdit(profile)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(profile.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete from library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Presets automatically calibrate tare weight meters.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
