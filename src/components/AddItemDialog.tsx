import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePacking } from '../context/PackingContext';
import { Bag, Trip } from '../types/travel';
import { DefaultSuggestions } from '../data/suggestions';
import { X, Plus, Sparkles, Scale, MapPin, User, Users } from 'lucide-react';

interface AddItemDialogProps {
  isOpen: boolean;
  bag: Bag;
  trip: Trip;
  onClose: () => void;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  bag,
  trip,
  onClose
}) => {
  const { addItemToBag, weightUnit, activePackerFilter } = usePacking();

  const familyMembers = useMemo(() => {
    return trip.familyMembers && trip.familyMembers.length > 0
      ? trip.familyMembers
      : (bag.assignedTo ? [bag.assignedTo] : ['Traveler 1']);
  }, [trip.familyMembers, bag.assignedTo]);

  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('Main Compartment');
  const [quantity, setQuantity] = useState(1);
  const [packedFor, setPackedFor] = useState<string>(() => {
    if (activePackerFilter !== 'ALL' && familyMembers.includes(activePackerFilter)) {
      return activePackerFilter;
    }
    return bag.assignedTo || familyMembers[0] || 'Traveler 1';
  });

  // Suggestions for this bag type that are not already present
  const suggestions = useMemo(() => {
    return DefaultSuggestions.getSuggestionsFor(bag.type).filter(
      (sug) => !bag.items.some((item) => item.name.toLowerCase() === sug.toLowerCase())
    );
  }, [bag]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    addItemToBag(trip.id, bag.id, itemName, location, quantity, packedFor);
    onClose();
  };

  const estimatedSingleWeight = DefaultSuggestions.getEstimatedWeightLbs(itemName || 'Item');
  const estimatedTotalWeight = estimatedSingleWeight * quantity;
  const formattedWeight = DefaultSuggestions.formatWeight(estimatedTotalWeight, weightUnit);

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/60 overflow-hidden flex flex-col relative z-[100000] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-50 dark:border-purple-950/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pack into {bag.label}
            </h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              {bag.type === 'PERSONAL'
                ? 'Personal Item (Under Seat)'
                : bag.type === 'CARRY_ON'
                ? 'Carry-On (Overhead Bin)'
                : 'Checked Baggage'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Who is this item for? (Packer Attribution) */}
          <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
            <label className="block text-xs font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Pack For (Child or Adult):</span>
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {familyMembers.map((member) => (
                <button
                  key={member}
                  type="button"
                  onClick={() => setPackedFor(member)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    packedFor === member
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Passport, Baby Wipes, Swimsuit, Coloring Book"
              className="w-full h-11 px-3.5 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Suggested for {bag.label}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {suggestions.slice(0, 6).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setItemName(sug);
                      if (sug.includes('Passport') || sug.includes('Documents')) {
                        setLocation('Hidden Passport Pocket');
                      } else if (sug.includes('Laptop')) {
                        setLocation('Padded Laptop Sleeve');
                      } else if (sug.includes('Liquids') || sug.includes('Toiletry')) {
                        setLocation('Front Zipper Pocket');
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-purple-900 dark:text-purple-200 border border-purple-200/80 dark:border-purple-800 shrink-0 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location & Quantity Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
                Pocket / Section
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Front Pocket, Main Cavity"
                className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
                Quantity
              </label>
              <div className="flex items-center h-10 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 px-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-slate-700 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-slate-700 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quick Location Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Main Compartment', 'Front Zipper', 'Laptop Sleeve', 'Side Mesh'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  location === loc
                    ? 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300 font-semibold'
                    : 'border-purple-100 dark:border-slate-700 text-slate-500 hover:bg-purple-50 dark:hover:bg-slate-800'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Estimated Weight Preview */}
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Estimated Added Weight:</span>
            </div>
            <span className="font-bold text-purple-950 dark:text-white tabular-nums">
              ~{formattedWeight}
            </span>
          </div>

          {/* Action Buttons */}
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
