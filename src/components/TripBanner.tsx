import React, { useState, useRef, useEffect } from 'react';
import { Trip, TravelType } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { 
  Plane, 
  Train, 
  Car, 
  Ship, 
  Bus, 
  Luggage, 
  ChevronDown, 
  Plus, 
  MapPin, 
  Building2, 
  Armchair, 
  Calendar, 
  Clock, 
  Users, 
  Edit3, 
  Check, 
  X,
  CheckCircle2,
  Trash2,
  Zap,
  Crown,
  Lock
} from 'lucide-react';
import { UniversalLocationSearchInput } from './UniversalLocationSearchInput';
import { CarrierSearchInput } from './CarrierSearchInput';
import { TripCountdownBanner } from './TripCountdownBanner';

interface TripBannerProps {
  currentTrip: Trip | null;
  onOpenAddTrip: () => void;
}

export const TripBanner: React.FC<TripBannerProps> = ({
  currentTrip,
  onOpenAddTrip
}) => {
  const { trips, selectTrip, updateTripDetails, deleteTrip } = usePacking();
  const { isPro, openPaywall } = useSubscription();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editCarrier, setEditCarrier] = useState('');
  const [editSeatClass, setEditSeatClass] = useState('');
  const [editTravelType, setEditTravelType] = useState<TravelType>('PLANE');
  const [editOriginCity, setEditOriginCity] = useState('');
  const [editDestinationCity, setEditDestinationCity] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editReturnDate, setEditReturnDate] = useState('');
  const [editReturnTime, setEditReturnTime] = useState('');
  const [editAircraft, setEditAircraft] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTravelIcon = (type?: TravelType) => {
    switch (type) {
      case 'PLANE':
        return <Plane className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'TRAIN':
        return <Train className="w-5 h-5 text-emerald-500" />;
      case 'CAR':
        return <Car className="w-5 h-5 text-amber-500" />;
      case 'CRUISE':
        return <Ship className="w-5 h-5 text-indigo-500" />;
      case 'BUS':
        return <Bus className="w-5 h-5 text-fuchsia-500" />;
      default:
        return <Luggage className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const handleStartEdit = () => {
    if (!currentTrip) return;
    setEditName(currentTrip.name || '');
    setEditCarrier(currentTrip.companyName || '');
    setEditSeatClass(currentTrip.seatClassOrCarSize || '');
    setEditTravelType(currentTrip.travelType || 'PLANE');
    setEditOriginCity(currentTrip.originCity || '');
    setEditDestinationCity(currentTrip.destinationCity || '');
    setEditDate(currentTrip.departureDate || '');
    setEditTime(currentTrip.departureTime || '');
    setEditReturnDate(currentTrip.returnTripDate || '');
    setEditReturnTime(currentTrip.returnTripTime || '');
    setEditAircraft(currentTrip.aircraftType || '');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrip) return;
    updateTripDetails(currentTrip.id, {
      name: editName,
      companyName: editCarrier,
      seatClassOrCarSize: editSeatClass,
      travelType: editTravelType,
      originCity: editOriginCity,
      destinationCity: editDestinationCity,
      departureDate: editDate,
      departureTime: editTime,
      returnTripDate: editReturnDate,
      returnTripTime: editReturnTime,
      aircraftType: editAircraft
    });
    setIsEditing(false);
  };

  // If no trip is selected / trips list is blank, return null so main clean empty state takes focus
  if (!currentTrip) {
    return null;
  }

  // Active Trip Banner with full location, carrier, and level of seat details!
  return (
    <div className="w-full bg-gradient-to-r from-purple-50/90 via-white to-purple-50/60 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border-b border-purple-100 dark:border-purple-950/80 shadow-2xs transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* Prominent Trip Countdown Clock Banner Above Trip Info */}
        <TripCountdownBanner
          trip={currentTrip}
          onOpenEditSchedule={() => setIsEditing(true)}
        />

        {/* Top bar of banner: Trip dropdown selector & edit action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100/70 dark:border-purple-900/40">
          {/* Trip Selector Dropdown Trigger Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="group flex items-center gap-2 text-left p-1.5 -ml-1.5 rounded-xl hover:bg-purple-100/60 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center border border-purple-200 dark:border-purple-800 shrink-0">
                {getTravelIcon(currentTrip.travelType)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Current Trip
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-purple-500 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate max-w-[240px] sm:max-w-md">
                  {currentTrip.name || 'Untitled Trip'}
                </h1>
              </div>
            </button>

            {/* Trip Dropdown Menu showing full location, carrier, and level of seat */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-purple-100 dark:border-purple-900/60 p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Switch Active Trip ({trips.length})
                  </span>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAddTrip();
                    }}
                    className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Trip</span>
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto py-1 space-y-1">
                  {trips.map((t) => {
                    const isSelected = t.id === currentTrip.id;
                    const totalItems = t.bags.reduce((acc, b) => acc + b.items.length, 0);
                    const packedItems = t.bags.reduce((acc, b) => acc + b.items.filter((i) => i.isPacked).length, 0);

                    return (
                      <div
                        key={t.id}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-2.5 transition-colors border ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700'
                            : 'border-transparent hover:bg-purple-50/50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <button
                          onClick={() => {
                            selectTrip(t);
                            setDropdownOpen(false);
                          }}
                          className="flex items-start gap-3 min-w-0 flex-1 text-left cursor-pointer"
                        >
                          <div className="mt-0.5">{getTravelIcon(t.travelType)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {t.name}
                              </p>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 shrink-0">
                                  <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 space-y-0.5">
                              <p className="truncate">
                                <strong>Carrier:</strong> {t.companyName || 'Not specified'}
                              </p>
                              <p className="truncate">
                                <strong>Seat:</strong> {t.seatClassOrCarSize || 'Not specified'}
                              </p>
                              <p className="text-[10px] text-purple-600 dark:text-purple-400">
                                {t.bags.length} bags · {packedItems}/{totalItems} items packed
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToDelete(t);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors shrink-0 cursor-pointer"
                          title={`Delete "${t.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions in Banner: Edit Trip Details, Delete Trip & New Trip */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  handleStartEdit();
                }
              }}
              className="h-8.5 px-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{isEditing ? 'Close Editor' : 'Edit Trip & Flight Info'}</span>
            </button>

            <button
              onClick={() => setTripToDelete(currentTrip)}
              className="h-8.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Delete this trip and its bags"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Delete Trip</span>
            </button>

            <button
              onClick={onOpenAddTrip}
              className="h-8.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-purple-600/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Trip</span>
            </button>
          </div>
        </div>

        {/* Inline Editor Drawer if user clicked Edit */}
        {isEditing && (
          <form
            onSubmit={handleSaveEdit}
            className="my-3 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-purple-200 dark:border-purple-800 shadow-md animate-in fade-in duration-150 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-purple-900/40">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-200 block">
                  Edit & Re-enter Trip Details
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Update any flight, route, or baggage info you skipped during setup
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                aria-label="Close editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                  Trip Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Tokyo, Japan or Orlando Trip"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-purple-50/30 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <UniversalLocationSearchInput
                label={
                  currentTrip.travelType === 'TRAIN' ? 'Departing Train Station' :
                  currentTrip.travelType === 'CRUISE' ? 'Departure Port' :
                  currentTrip.travelType === 'BUS' ? 'Bus Departure Terminal' :
                  currentTrip.travelType === 'CAR' ? 'Starting Location / City' :
                  'Flying From (Origin Airport)'
                }
                iconType="origin"
                travelType={currentTrip.travelType}
                value={editOriginCity}
                onChange={(formatted) => setEditOriginCity(formatted)}
              />

              <UniversalLocationSearchInput
                label={
                  currentTrip.travelType === 'TRAIN' ? 'Arrival Train Station' :
                  currentTrip.travelType === 'CRUISE' ? 'Destination Port' :
                  currentTrip.travelType === 'BUS' ? 'Bus Arrival Terminal' :
                  currentTrip.travelType === 'CAR' ? 'Destination / Stop' :
                  'Destination Airport (Arrival)'
                }
                iconType="destination"
                travelType={currentTrip.travelType}
                value={editDestinationCity}
                onChange={(formatted) => setEditDestinationCity(formatted)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                  {currentTrip.travelType === 'CAR' ? 'Vehicle Model' :
                   currentTrip.travelType === 'TRAIN' ? 'Rail Operator' :
                   currentTrip.travelType === 'CRUISE' ? 'Cruise Line / Ship' :
                   currentTrip.travelType === 'BUS' ? 'Bus Operator' :
                   'Airline / Carrier'}
                </label>
                <CarrierSearchInput
                  value={editCarrier}
                  onChange={(val) => setEditCarrier(val)}
                  travelType={currentTrip.travelType}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                  {currentTrip.travelType === 'CAR' ? 'Vehicle Size / Trunk' :
                   currentTrip.travelType === 'TRAIN' ? 'Train Coach Class' :
                   currentTrip.travelType === 'CRUISE' ? 'Stateroom / Cabin' :
                   currentTrip.travelType === 'BUS' ? 'Bus Seat Type' :
                   'Seat / Cabin Class'}
                </label>
                <input
                  type="text"
                  value={editSeatClass}
                  onChange={(e) => setEditSeatClass(e.target.value)}
                  placeholder="e.g. Main Cabin, Balcony Stateroom, Coach"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-purple-50/30 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Flight Schedule: Departure & Return Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Departure Date</span>
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Departure Time</span>
                </label>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Return Date</span>
                  </label>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                    {!isPro && <Lock className="w-2 h-2" />} Pro
                  </span>
                </div>
                {!isPro ? (
                  <div
                    onClick={() => openPaywall("Round-Trip & Return Date tracking is a Gate Ready Pro feature. Upgrade to Pro to track your return journey.")}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors"
                    title="Click to unlock return schedule with Pro"
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Locked (Pro Feature)</span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-2xs">
                      Upgrade
                    </span>
                  </div>
                ) : (
                  <input
                    type="date"
                    value={editReturnDate}
                    onChange={(e) => setEditReturnDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Return Time</span>
                </label>
                <input
                  type="time"
                  disabled={!isPro}
                  value={isPro ? editReturnTime : ''}
                  onChange={(e) => setEditReturnTime(e.target.value)}
                  className={`w-full h-10 px-3 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-50 dark:border-purple-900/40">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="h-8.5 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* The 3 Main Information Pillars: Location, Carrier, Level of Seat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          {/* 1. Trip Location Card */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-purple-100 dark:border-purple-900/60 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
              {getTravelIcon(currentTrip.travelType)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                {currentTrip.travelType === 'TRAIN' ? 'Station & Route' :
                 currentTrip.travelType === 'CRUISE' ? 'Ports & Cruise' :
                 currentTrip.travelType === 'BUS' ? 'Terminal & Bus' :
                 currentTrip.travelType === 'CAR' ? 'Driving Route' :
                 'Airports & Route'}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                {currentTrip.name || 'Not specified'}
              </p>
              {(currentTrip.originCity || currentTrip.destinationCity) && (
                <p className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold truncate">
                  {currentTrip.originCity || 'Origin'} → {currentTrip.destinationCity || currentTrip.name}
                </p>
              )}
            </div>
          </div>

          {/* 2. Carrier / Airline Card */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-purple-100 dark:border-purple-900/60 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                {currentTrip.travelType === 'CAR' ? 'Vehicle / Rental' :
                 currentTrip.travelType === 'TRAIN' ? 'Rail Operator' :
                 currentTrip.travelType === 'CRUISE' ? 'Cruise Line / Ship' :
                 currentTrip.travelType === 'BUS' ? 'Bus Operator' :
                 'Airline / Carrier'}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                {currentTrip.companyName || 'Not specified'}
              </p>
            </div>
          </div>

          {/* 3. Level of Seat / Cabin Class Card */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-purple-100 dark:border-purple-900/60 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
              <Armchair className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-400">
                {currentTrip.travelType === 'CAR' ? 'Vehicle Size / Cargo' :
                 currentTrip.travelType === 'CRUISE' ? 'Stateroom / Cabin' :
                 currentTrip.travelType === 'TRAIN' ? 'Class of Service' :
                 currentTrip.travelType === 'BUS' ? 'Seat Type' :
                 'Level of Seat / Class'}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                {currentTrip.seatClassOrCarSize || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Info Line: Departure Date, Return Date, Travelers, Bags Count */}
        <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 dark:text-slate-400 mt-2.5 pt-2 border-t border-purple-50 dark:border-purple-950/60 font-medium">
          {currentTrip.departureDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Departing: <strong>{currentTrip.departureDate}</strong> {currentTrip.departureTime ? `at ${currentTrip.departureTime}` : ''}</span>
            </span>
          )}

          {currentTrip.returnTripDate && (
            <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Return: <strong>{currentTrip.returnTripDate}</strong> {currentTrip.returnTripTime ? `at ${currentTrip.returnTripTime}` : ''}</span>
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Luggage className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span><strong>{currentTrip.bags.length}</strong> {currentTrip.bags.length === 1 ? 'Luggage Bag' : 'Luggage Bags'}</span>
          </span>

          {currentTrip.familyMembers && currentTrip.familyMembers.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span><strong>{currentTrip.familyMembers.length}</strong> {currentTrip.familyMembers.length === 1 ? 'Traveler' : 'Travelers'} ({currentTrip.familyMembers.join(', ')})</span>
            </span>
          )}

          {currentTrip.aircraftType && (
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Aircraft: <strong>{currentTrip.aircraftType}</strong></span>
            </span>
          )}
        </div>
      </div>

      {/* User-Friendly Delete Trip Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Trip?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {tripToDelete.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 bg-rose-50/60 dark:bg-rose-950/20 p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/40">
              Are you sure you want to delete this trip? All <strong>{tripToDelete.bags.length} bags</strong>, packed items, and departure schedule settings for this trip will be permanently removed. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTripToDelete(null)}
                className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Keep Trip
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTrip(tripToDelete.id);
                  setTripToDelete(null);
                  setDropdownOpen(false);
                }}
                className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/30 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Yes, Delete Trip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
