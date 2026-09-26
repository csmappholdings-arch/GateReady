import React, { useState } from 'react';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { TravelType, BagType } from '../types/travel';
import { X, Plus, Trash2, Luggage, Plane, Train, Car, Ship, Bus, Users, User, AlertCircle, Sparkles, Crown } from 'lucide-react';

interface AddTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTripDialog: React.FC<AddTripDialogProps> = ({ isOpen, onClose }) => {
  const { addTrip } = usePacking();
  const { isPro, canAddTraveler, canAddBag, openPaywall } = useSubscription();

  const [name, setName] = useState('');
  const [travelType, setTravelType] = useState<TravelType>('PLANE');
  const [companyName, setCompanyName] = useState('Delta Air Lines');
  const [seatOrSize, setSeatOrSize] = useState('Main Cabin Economy');
  
  // No preset 'Self' or default family members — user sets up the first traveler explicitly
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [travelerError, setTravelerError] = useState('');

  // Initial bags (configured once first traveler is created)
  const [bags, setBags] = useState<Array<{ type: BagType; label: string; assignedTo?: string }>>([]);

  if (!isOpen) return null;

  const handleAddFamilyMember = (nameToAdd?: string) => {
    const raw = nameToAdd !== undefined ? nameToAdd : newMemberInput;
    const trimmed = raw.trim();
    if (!trimmed) {
      setTravelerError('Please enter a name for the traveler.');
      return;
    }

    // Enforce Free Plan 1-Traveler limit!
    const travelerCheck = canAddTraveler(familyMembers.length);
    if (!travelerCheck.allowed) {
      openPaywall(travelerCheck.reason);
      return;
    }

    if (familyMembers.includes(trimmed)) {
      setTravelerError('A traveler with this name has already been added.');
      return;
    }

    const updated = [...familyMembers, trimmed];
    setFamilyMembers(updated);
    setNewMemberInput('');
    setTravelerError('');

    // If this was the first traveler added and there were no bags yet, set up initial bags for them
    if (bags.length === 0) {
      setBags([
        { type: 'PERSONAL', label: `${trimmed}'s Backpack`, assignedTo: trimmed },
        { type: 'CARRY_ON', label: `${trimmed}'s Carry-on`, assignedTo: trimmed }
      ]);
    }
  };

  const handleRemoveFamilyMember = (memberToRemove: string) => {
    const updated = familyMembers.filter((m) => m !== memberToRemove);
    setFamilyMembers(updated);
    // Update any bags assigned to removed member
    if (updated.length > 0) {
      setBags(
        bags.map((b) => (b.assignedTo === memberToRemove ? { ...b, assignedTo: updated[0] } : b))
      );
    } else {
      setBags([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (familyMembers.length === 0) {
      setTravelerError('Please set up at least one traveler before creating the trip.');
      return;
    }
    if (bags.length === 0) {
      alert('Please add at least one bag for this trip.');
      return;
    }
    addTrip(name, travelType, companyName, seatOrSize, bags, familyMembers);
    onClose();
  };

  const handleAddBag = (type: BagType = 'CHECKED') => {
    // Check Free Plan bag limits: max 3 bags total & max 1 of each bag type
    const bagCheck = canAddBag(bags as any, type);
    if (!bagCheck.allowed) {
      openPaywall(bagCheck.reason);
      return;
    }

    const defaultLabel =
      type === 'PERSONAL'
        ? 'Personal Backpack'
        : type === 'CARRY_ON'
        ? 'Roller Carry-on'
        : 'Checked Suitcase';
    setBags([
      ...bags,
      { type, label: defaultLabel, assignedTo: familyMembers[0] || 'Traveler' }
    ]);
  };

  const handleRemoveBag = (index: number) => {
    setBags(bags.filter((_, i) => i !== index));
  };

  const handleUpdateBagType = (index: number, newType: BagType) => {
    // If switching type, check if another bag already has this type on Free plan
    const otherBags = bags.filter((_, i) => i !== index);
    const bagCheck = canAddBag(otherBags as any, newType);
    if (!bagCheck.allowed) {
      openPaywall(bagCheck.reason);
      return;
    }

    setBags(
      bags.map((b, i) => (i === index ? { ...b, type: newType } : b))
    );
  };

  const handleUpdateBagLabel = (index: number, newLabel: string) => {
    setBags(
      bags.map((b, i) => (i === index ? { ...b, label: newLabel } : b))
    );
  };

  const handleUpdateBagAssignee = (index: number, newAssignee: string) => {
    setBags(
      bags.map((b, i) => (i === index ? { ...b, assignedTo: newAssignee } : b))
    );
  };

  const internationalAirlines = [
    // USA
    'Delta Air Lines', 'American Airlines', 'United Airlines', 'Southwest', 'JetBlue', 'Alaska Airlines',
    // Canada
    'Air Canada', 'WestJet', 'Porter Airlines',
    // Europe
    'British Airways', 'Air France', 'Lufthansa', 'Ryanair', 'easyJet', 'Turkish Airlines', 'Virgin Atlantic',
    // Asia
    'Singapore Airlines', 'ANA', 'Japan Airlines', 'Cathay Pacific', 'Korean Air', 'EVA Air', 'Emirates', 'Qatar Airways'
  ];

  const carrierSuggestions =
    travelType === 'PLANE'
      ? internationalAirlines
      : travelType === 'TRAIN'
      ? ['Amtrak', 'Eurostar', 'VIA Rail Canada', 'Deutsche Bahn', 'Brightline', 'Shinkansen']
      : ['Toyota RAV4', 'Subaru Outback', 'Chevy Suburban', 'Tesla Model Y', 'Honda CR-V'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/60 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-50 dark:border-purple-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Setup New Trip
              </h3>
              <p className="text-xs text-slate-500">Configure travelers, journey & luggage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Trip Name */}
          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
              Trip Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vacation to Europe, Tokyo Family Trip, Disney Getaway"
              className="w-full h-11 px-3.5 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Traveler Setup (No preset Self - user sets up first traveler) */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950 dark:text-purple-200">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Travelers / Family Members *</span>
              </div>
              <div className="flex items-center gap-1.5">
                {!isPro ? (
                  <button
                    type="button"
                    onClick={() => openPaywall("The Free Plan is limited to 1 traveler. Upgrade to Gate Ready Pro to pack for your whole family.")}
                    className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>Free: 1 Traveler Max</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-purple-600 text-purple-600" />
                    <span>Pro: Unlimited</span>
                  </span>
                )}
                <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                  {familyMembers.length}
                </span>
              </div>
            </div>

            {familyMembers.length === 0 ? (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 text-xs">
                <p className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Set up the first traveler:</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  No preset "Self" — enter your name or the person you are packing for (e.g. parent, toddler, or child).
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {familyMembers.map((member, idx) => (
                  <span
                    key={member}
                    className="text-xs font-semibold bg-white dark:bg-slate-800 text-purple-950 dark:text-purple-200 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 shadow-2xs"
                  >
                    <User className="w-3 h-3 text-purple-500" />
                    <span>{member}</span>
                    {idx === 0 && (
                      <span className="text-[9px] font-bold text-purple-500 uppercase">Primary</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveFamilyMember(member)}
                      className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add person input */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMemberInput}
                  onChange={(e) => {
                    setNewMemberInput(e.target.value);
                    if (travelerError) setTravelerError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFamilyMember();
                    }
                  }}
                  placeholder={
                    familyMembers.length === 0
                      ? "Enter first traveler name (e.g. Sarah, Dad, Alex)..."
                      : "Add another traveler (e.g. Emma (Toddler), Liam (Child))..."
                  }
                  className="flex-1 h-9 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddFamilyMember()}
                  className="h-9 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{familyMembers.length === 0 ? 'Add First' : 'Add'}</span>
                </button>
              </div>

              {travelerError && (
                <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{travelerError}</span>
                </p>
              )}
            </div>

            {/* Quick Suggestions for family members */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
              <span className="text-[10px] text-slate-400 shrink-0">Quick helpers:</span>
              {['Mom', 'Dad', 'Child', 'Toddler', 'Baby', 'Partner'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleAddFamilyMember(label)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/60 shrink-0 transition-colors cursor-pointer"
                >
                  + {label}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1.5">
              Travel Mode
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { type: 'PLANE' as TravelType, label: 'Flight', icon: Plane },
                { type: 'TRAIN' as TravelType, label: 'Train', icon: Train },
                { type: 'CAR' as TravelType, label: 'Car', icon: Car },
                { type: 'CRUISE' as TravelType, label: 'Cruise', icon: Ship },
                { type: 'BUS' as TravelType, label: 'Bus', icon: Bus }
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setTravelType(type);
                    if (type === 'PLANE') {
                      setCompanyName('Delta Air Lines');
                      setSeatOrSize('Economy');
                    } else if (type === 'TRAIN') {
                      setCompanyName('Amtrak');
                      setSeatOrSize('Coach');
                    } else if (type === 'CAR') {
                      setCompanyName('Subaru Outback');
                      setSeatOrSize('Mid-Size SUV');
                    }
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    travelType === type
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50/30 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Carrier Company & Major Airlines (USA, Canada, Europe, Asia) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                {travelType === 'CAR' ? 'Vehicle Make / Model' : 'Carrier / Airline'}
              </label>
              {travelType === 'PLANE' && (
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                  USA, Canada, Europe & Asia
                </span>
              )}
            </div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={travelType === 'CAR' ? 'e.g. Toyota RAV4' : 'e.g. Delta, Air Canada, British Airways, Singapore Airlines'}
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
            />
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 no-scrollbar">
              <span className="text-[10px] text-slate-400 shrink-0">Popular:</span>
              {carrierSuggestions.slice(0, 10).map((carrier) => (
                <button
                  key={carrier}
                  type="button"
                  onClick={() => setCompanyName(carrier)}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-purple-800 dark:text-purple-300 shrink-0 transition-colors cursor-pointer border border-purple-100 dark:border-purple-900/40"
                >
                  {carrier}
                </button>
              ))}
            </div>
          </div>

          {/* Seat Class or Car Size */}
          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
              {travelType === 'CAR' ? 'Vehicle Trunk Size' : 'Seat Class / Fare'}
            </label>
            <input
              type="text"
              value={seatOrSize}
              onChange={(e) => setSeatOrSize(e.target.value)}
              placeholder={travelType === 'CAR' ? 'e.g. Mid-Size SUV, Sedan, Minivan' : 'e.g. Main Cabin, Basic Economy, Business'}
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Luggage Setup */}
          <div className="pt-2 border-t border-purple-50 dark:border-purple-950/60">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider block">
                  Luggage Setup ({bags.length} Bags)
                </label>
                {!isPro && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    Free limit: 1 of each bag (max 3 total)
                  </span>
                )}
              </div>
              {familyMembers.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleAddBag('CHECKED')}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bag</span>
                </button>
              )}
            </div>

            {familyMembers.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                Add your first traveler above to configure bags.
              </p>
            ) : (
              <div className="space-y-2">
                {bags.map((bag, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <select
                        value={bag.type}
                        onChange={(e) => handleUpdateBagType(idx, e.target.value as BagType)}
                        className="h-9 px-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 text-purple-900 dark:text-purple-200 focus:outline-hidden"
                      >
                        <option value="PERSONAL">Personal</option>
                        <option value="CARRY_ON">Carry-on</option>
                        <option value="CHECKED">Checked</option>
                      </select>

                      <input
                        type="text"
                        value={bag.label}
                        onChange={(e) => handleUpdateBagLabel(idx, e.target.value)}
                        placeholder="Bag Label"
                        className="flex-1 h-9 px-2.5 text-xs rounded-lg border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={bag.assignedTo || familyMembers[0]}
                        onChange={(e) => handleUpdateBagAssignee(idx, e.target.value)}
                        className="h-9 px-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 text-purple-800 dark:text-purple-300 focus:outline-hidden flex-1 sm:flex-initial"
                        title="Whose bag is this?"
                      >
                        {familyMembers.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>

                      {bags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBag(idx)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                          aria-label="Remove bag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-purple-50 dark:border-purple-950/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={familyMembers.length === 0}
              className={`h-10 px-5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                familyMembers.length === 0
                  ? 'bg-purple-300 dark:bg-purple-900/50 text-purple-100 cursor-not-allowed shadow-none'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
              }`}
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
