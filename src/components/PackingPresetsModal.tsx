import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trip, Bag } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { FREQUENT_TRAVELER_TEMPLATES, PackingTemplate } from '../data/packingTemplates';
import { 
  Sparkles, 
  Briefcase, 
  Check, 
  Plus, 
  X, 
  Luggage, 
  FolderCheck, 
  ArrowRight,
  BookmarkPlus
} from 'lucide-react';

interface PackingPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  targetBag: Bag;
}

export const PackingPresetsModal: React.FC<PackingPresetsModalProps> = ({
  isOpen,
  onClose,
  trip,
  targetBag
}) => {
  const { addItemToBag } = usePacking();

  const [selectedTemplate, setSelectedTemplate] = useState<PackingTemplate>(FREQUENT_TRAVELER_TEMPLATES[0]);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Custom User Templates stored in localStorage
  const [customTemplates, setCustomTemplates] = useState<PackingTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('gateready_custom_templates_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [showSaveCustom, setShowSaveCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleApplyTemplate = (template: PackingTemplate) => {
    template.items.forEach((item) => {
      addItemToBag(
        trip.id,
        targetBag.id,
        item.name,
        item.location,
        item.quantity,
        targetBag.assignedTo || undefined
      );
    });

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSaveCurrentBagAsTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || targetBag.items.length === 0) return;

    const newTemplate: PackingTemplate = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      description: `Saved from "${targetBag.label}" with ${targetBag.items.length} items.`,
      recommendedBagType: targetBag.type,
      idealTripLengthDays: 3,
      badge: 'Custom',
      items: targetBag.items.map((i) => ({
        name: i.name,
        category: i.category || 'General',
        quantity: i.quantity,
        location: i.location || 'Main Compartment',
        estimatedWeightLbs: i.customWeightLbs || 0.5
      }))
    };

    const next = [newTemplate, ...customTemplates];
    setCustomTemplates(next);
    try {
      localStorage.setItem('gateready_custom_templates_v1', JSON.stringify(next));
    } catch {
      // Ignore
    }
    setSelectedTemplate(newTemplate);
    setShowSaveCustom(false);
    setCustomName('');
  };

  const allTemplates = [...customTemplates, ...FREQUENT_TRAVELER_TEMPLATES];

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-2xl my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-purple-900/60 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <FolderCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Frequent Traveler Packing Presets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Load a pre-configured template into <strong>{targetBag.label}</strong> so all you have to do is check items off as you pack.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 shrink-0 border-b border-slate-100 dark:border-slate-800">
          {allTemplates.map((template) => {
            const isSelected = selectedTemplate.id === template.id;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50'
                }`}
              >
                <span>{template.name.split(' (')[0]}</span>
                <span className={`ml-1.5 text-[9px] px-1.5 py-0.2 rounded-md uppercase font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                }`}>
                  {template.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Template Details Card */}
        <div className="my-3 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/60 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedTemplate.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedTemplate.description}
              </p>
            </div>

            <button
              onClick={() => handleApplyTemplate(selectedTemplate)}
              disabled={appliedSuccess}
              className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer ${
                appliedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20 active:scale-95'
              }`}
            >
              {appliedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Loaded to {targetBag.label}!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Load {selectedTemplate.items.length} Items</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Items Preview List */}
        <div className="flex-1 overflow-y-auto py-1 space-y-1.5 pr-1">
          <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider px-1">
            Items Included in this Template ({selectedTemplate.items.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedTemplate.items.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.category} · {item.location}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 shrink-0 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                  x{item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Custom Template Option */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {!showSaveCustom ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Want to save {targetBag.label}'s {targetBag.items.length} current items as a template?
              </span>
              <button
                type="button"
                onClick={() => setShowSaveCustom(true)}
                disabled={targetBag.items.length === 0}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save Bag as My Preset</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveCurrentBagAsTemplate} className="flex items-center gap-2">
              <input
                type="text"
                required
                autoFocus
                placeholder="Custom Preset Name (e.g. My Gym & Business Kit)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="flex-1 h-9 px-3 text-xs font-medium rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowSaveCustom(false)}
                className="h-9 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
