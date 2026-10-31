import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trip, TravelType, ModeProfile } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
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
import { DatePickerInput } from './DatePickerInput';
import { getDefaultChecklistForMode } from '../data/allowances';
import { getAirlineFareFamilies } from '../data/airlineFareFamilies';

interface TripBannerProps {
  currentTrip: Trip | null;
  onOpenAddTrip: () => void;
  onOpenAccountSync?: () => void;
}

export const TripBanner: React.FC<TripBannerProps> = ({
  currentTrip,
  onOpenAddTrip,
  onOpenAccountSync
}) => {
  const { trips, selectTrip, updateTripDetails, deleteTrip } = usePacking();
  const { isPro, openPaywall } = useSubscription();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [browserNoticeDismissed, setBrowserNoticeDismissed] = useState(() => {
    try {
      return localStorage.getItem('gateready_browser_only_notice_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  // Edit fields - initialized with currentTrip values
  const [editName, setEditName] = useState(currentTrip?.name || '');
  const [editCarrier, setEditCarrier] = useState(currentTrip?.companyName || '');
  const [editSeatClass, setEditSeatClass] = useState(currentTrip?.seatClassOrCarSize || 'Main Cabin');
  const [editFareFamily, setEditFareFamily] = useState(currentTrip?.fareFamily || '');
  const [editTravelType, setEditTravelType] = useState<TravelType>(currentTrip?.travelType || 'PLANE');
  const [editOriginCity, setEditOriginCity] = useState(currentTrip?.originCity || '');
  const [editDestinationCity, setEditDestinationCity] = useState(currentTrip?.destinationCity || '');
  const [editDate, setEditDate] = useState(currentTrip?.departureDate || '');
  const [editTime, setEditTime] = useState(currentTrip?.departureTime || '');
  const [editReturnDate, setEditReturnDate] = useState(currentTrip?.returnTripDate || '');
  const [editReturnTime, setEditReturnTime] = useState(currentTrip?.returnTripTime || '');
  const [editAircraft, setEditAircraft] = useState(currentTrip?.aircraftType || '');
  const [editModeProfiles, setEditModeProfiles] = useState<Partial<Record<TravelType, ModeProfile>>>(() => {
    if (!currentTrip) return {};
    return {
      ...(currentTrip.modeProfiles || {}),
      [currentTrip.travelType || 'PLANE']: {
        companyName: currentTrip.companyName || '',
        seatClassOrCarSize: currentTrip.seatClassOrCarSize || '',
        aircraftType: currentTrip.aircraftType || '',
        fareFamily: currentTrip.fareFamily || ''
      }
    };
  });

  const editAirlineFareFamilies = React.useMemo(() => {
    if (editTravelType !== 'PLANE' || !editCarrier) return [];
    return getAirlineFareFamilies(editCarrier);
  }, [editTravelType, editCarrier]);

  useEffect(() => {
    if (editTravelType === 'PLANE' && editAirlineFareFamilies.length > 0) {
      if (!editFareFamily || !editAirlineFareFamilies.some((f) => f.id === editFareFamily)) {
        const defaultFam = editAirlineFareFamilies.find((f) => f.isDefault) || editAirlineFareFamilies[0];
        setEditFareFamily(defaultFam ? defaultFam.id : '');
      }
    }
  }, [editAirlineFareFamilies, editTravelType, editFareFamily]);

  const currentFareFamilyObj = React.useMemo(() => {
    if (!currentTrip || currentTrip.travelType !== 'PLANE' || !currentTrip.companyName || !currentTrip.fareFamily) return null;
    const families = getAirlineFareFamilies(currentTrip.companyName);
    return families.find((f) => f.id === currentTrip.fareFamily) || null;
  }, [currentTrip?.travelType, currentTrip?.companyName, currentTrip?.fareFamily]);

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
    const initialProfiles: Partial<Record<TravelType, ModeProfile>> = {
      ...(currentTrip.modeProfiles || {}),
      [currentTrip.travelType || 'PLANE']: {
        companyName: currentTrip.companyName || '',
        seatClassOrCarSize: currentTrip.seatClassOrCarSize || '',
        aircraftType: currentTrip.aircraftType || '',
        fareFamily: currentTrip.fareFamily || '',
        originCity: currentTrip.originCity || '',
        destinationCity: currentTrip.destinationCity || '',
        departureDate: currentTrip.departureDate || '',
        departureTime: currentTrip.departureTime || ''
      }
    };
    setEditModeProfiles(initialProfiles);
    setEditName(currentTrip.name || '');
    setEditCarrier(currentTrip.companyName || '');
    setEditSeatClass(currentTrip.seatClassOrCarSize || (currentTrip.travelType === 'CAR' ? 'Mid-Size SUV / Car' : currentTrip.travelType === 'CRUISE' ? 'Balcony Stateroom' : currentTrip.travelType === 'TRAIN' ? 'Standard Coach' : 'Main Cabin'));
    setEditFareFamily(currentTrip.fareFamily || '');
    setEditTravelType(currentTrip.travelType || 'PLANE');
    setEditOriginCity(currentTrip.originCity || '');
    setEditDestinationCity(currentTrip.destinationCity || '');
    setEditDate(currentTrip.departureDate || '');
    setEditTime(currentTrip.departureTime || '');
    setEditReturnDate(currentTrip.returnTripDate || '');
    setEditReturnTime(currentTrip.returnTripTime || '');
    setEditAircraft(currentTrip.aircraftType || '');
    setEditError(null);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrip) return;

    const trimmedName = editName.trim() || currentTrip.name?.trim();
    if (!trimmedName) {
      setEditError('Trip name is required.');
      return;
    }

    const modeChanged = editTravelType !== currentTrip.travelType;
    const resolvedCarrier = editCarrier.trim();
    const resolvedSeatClass = editSeatClass.trim();
    const resolvedOriginCity = editOriginCity.trim();
    const resolvedDestinationCity = editDestinationCity.trim();
    const resolvedAircraft = editTravelType === 'PLANE' ? editAircraft.trim() : '';
    const resolvedDepartureDate = editDate.trim();
    const resolvedDepartureTime = editTime.trim();

    const finalModeProfiles: Partial<Record<TravelType, ModeProfile>> = {
      ...editModeProfiles,
      [editTravelType]: {
        companyName: resolvedCarrier,
        seatClassOrCarSize: resolvedSeatClass,
        aircraftType: resolvedAircraft,
        fareFamily: editTravelType === 'PLANE' ? editFareFamily : '',
        originCity: resolvedOriginCity,
        destinationCity: resolvedDestinationCity,
        departureDate: resolvedDepartureDate,
        departureTime: resolvedDepartureTime
      }
    };

    let updatedGateChecklist = currentTrip.gateChecklist;
    let updatedBags = currentTrip.bags;
    if (modeChanged) {
      updatedGateChecklist = getDefaultChecklistForMode(editTravelType);
      updatedBags = currentTrip.bags.map((b) => ({
        ...b,
        maxWeightLimitLbs: editTravelType === 'CAR' ? undefined : (editTravelType !== 'PLANE' && b.type === 'CARRY_ON') ? 50 : (editTravelType === 'PLANE' && b.type === 'CARRY_ON' ? (b.maxWeightLimitLbs && b.maxWeightLimitLbs <= 30 ? b.maxWeightLimitLbs : 22) : b.maxWeightLimitLbs)
      }));
    }

    updateTripDetails(currentTrip.id, {
      name: trimmedName,
      companyName: resolvedCarrier,
      seatClassOrCarSize: resolvedSeatClass,
      fareFamily: editTravelType === 'PLANE' ? editFareFamily : '',
      travelType: editTravelType,
      originCity: resolvedOriginCity,
      destinationCity: resolvedDestinationCity,
      departureDate: resolvedDepartureDate,
      departureTime: resolvedDepartureTime,
      returnTripDate: editReturnDate.trim() || currentTrip.returnTripDate || '',
      returnTripTime: editReturnTime.trim() || currentTrip.returnTripTime || '',
      aircraftType: resolvedAircraft,
      modeProfiles: finalModeProfiles,
      ...(modeChanged ? { gateChecklist: updatedGateChecklist, bags: updatedBags } : {})
    });
    setEditError(null);
    setIsEditing(false);
  };

  // If no trip is selected / trips list is blank, return null so main clean empty state takes focus
  if (!currentTrip) {
    return null;
  }

  const isFlight = (currentTrip.travelType === 'PLANE' || !currentTrip.travelType) && !['CAR', 'TRAIN', 'CRUISE', 'BUS'].includes(currentTrip.travelType || '');
  const isCar = !isFlight && (currentTrip.travelType === 'CAR' || (Boolean(currentTrip.seatClassOrCarSize) && /car|suv|sedan|truck|van|overland/i.test(currentTrip.seatClassOrCarSize || '')));
  const isTrain = !isFlight && (currentTrip.travelType === 'TRAIN' || (Boolean(currentTrip.seatClassOrCarSize) && /train|rail/i.test(currentTrip.seatClassOrCarSize || '')));
  const isCruise = !isFlight && (currentTrip.travelType === 'CRUISE' || (Boolean(currentTrip.seatClassOrCarSize) && /cruise|stateroom|ship|porthole/i.test(currentTrip.seatClassOrCarSize || '')));
  const isBus = !isFlight && (currentTrip.travelType === 'BUS' || (Boolean(currentTrip.seatClassOrCarSize) && /bus/i.test(currentTrip.seatClassOrCarSize || '')));

  // Active Trip Banner with full location, carrier, and level of seat details!
  return (
    <div className="w-full bg-gradient-to-r from-purple-50/90 via-white to-purple-50/60 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border-b border-purple-100 dark:border-purple-950/80 shadow-2xs transition-colors">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3">
        {/* Item 5: Small, honest, dismissible disclosure in workspace for anonymous users */}
        {!user && !browserNoticeDismissed && (
          <div className="mb-2 py-1.5 px-3 rounded-xl bg-purple-100/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60 flex items-center justify-between gap-2 text-xs text-purple-950 dark:text-purple-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span className="truncate">
                Saved in this browser only —{' '}
                <button
                  type="button"
                  onClick={onOpenAccountSync}
                  className="font-bold underline text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white cursor-pointer"
                >
                  create a free account
                </button>{' '}
                to keep it forever.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setBrowserNoticeDismissed(true);
                try {
                  localStorage.setItem('gateready_browser_only_notice_dismissed', 'true');
                } catch {}
              }}
              className="text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 p-0.5 rounded cursor-pointer shrink-0"
              title="Dismiss notice"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Prominent Trip Countdown Clock Banner Above Trip Info */}
        <TripCountdownBanner
          trip={currentTrip}
          onOpenEditSchedule={handleStartEdit}
        />

        {/* Top bar of banner: Trip dropdown selector & edit action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-purple-100/70 dark:border-purple-900/40">
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
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
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
                                {t.bags.length} {t.bags.length === 1 ? 'bag' : 'bags'} · {packedItems}/{totalItems} {totalItems === 1 ? 'item' : 'items'} packed
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
              <span>{isEditing ? 'Close Editor' : isFlight ? 'Edit Trip & Flight Info' : 'Edit Trip Info'}</span>
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
              onClick={() => onOpenAddTrip()}
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
                  {editTravelType === 'PLANE'
                    ? 'Update any flight, route, or baggage info you skipped during setup'
                    : editTravelType === 'TRAIN'
                      ? 'Update any train, rail route, or baggage info you skipped during setup'
                      : editTravelType === 'CRUISE'
                        ? 'Update any cruise, port, or baggage info you skipped during setup'
                        : editTravelType === 'BUS'
                          ? 'Update any bus, route, or baggage info you skipped during setup'
                          : 'Update any vehicle, road route, or baggage info you skipped during setup'}
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

            {/* Travel Mode Switcher */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1.5">
                Travel Mode
              </label>
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-purple-50/70 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
                {[
                  { type: 'PLANE' as TravelType, label: 'Flight', icon: Plane },
                  { type: 'TRAIN' as TravelType, label: 'Train', icon: Train },
                  { type: 'CAR' as TravelType, label: 'Road Trip', icon: Car },
                  { type: 'CRUISE' as TravelType, label: 'Cruise', icon: Ship },
                  { type: 'BUS' as TravelType, label: 'Bus', icon: Bus },
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      if (type !== editTravelType) {
                        const updatedProfiles: Partial<Record<TravelType, ModeProfile>> = {
                          ...editModeProfiles,
                          [editTravelType]: {
                            companyName: editCarrier.trim(),
                            seatClassOrCarSize: editSeatClass.trim(),
                            aircraftType: editAircraft.trim(),
                            fareFamily: editTravelType === 'PLANE' ? editFareFamily.trim() : '',
                            originCity: editOriginCity.trim(),
                            destinationCity: editDestinationCity.trim(),
                            departureDate: editDate.trim(),
                            departureTime: editTime.trim()
                          }
                        };
                        setEditModeProfiles(updatedProfiles);
                        setEditTravelType(type);
                        const targetProfile = updatedProfiles[type];
                        if (targetProfile) {
                          setEditCarrier(targetProfile.companyName || '');
                          setEditSeatClass(targetProfile.seatClassOrCarSize || (type === 'PLANE' ? 'Main Cabin' : type === 'CAR' ? 'Mid-Size SUV / Car' : type === 'CRUISE' ? 'Balcony Stateroom' : type === 'TRAIN' ? 'Standard Coach' : 'Standard Coach'));
                          setEditAircraft(type === 'PLANE' ? (targetProfile.aircraftType || '') : '');
                          setEditFareFamily(type === 'PLANE' ? (targetProfile.fareFamily || '') : '');
                          setEditOriginCity(targetProfile.originCity || '');
                          setEditDestinationCity(targetProfile.destinationCity || '');
                          if (targetProfile.departureDate) setEditDate(targetProfile.departureDate);
                          if (targetProfile.departureTime) setEditTime(targetProfile.departureTime);
                        } else {
                          setEditCarrier('');
                          setEditSeatClass(type === 'PLANE' ? 'Main Cabin' : type === 'CAR' ? 'Mid-Size SUV / Car' : type === 'CRUISE' ? 'Balcony Stateroom' : 'Standard Coach');
                          setEditAircraft('');
                          setEditFareFamily('');
                          setEditOriginCity('');
                          setEditDestinationCity('');
                        }
                      }
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                      editTravelType === type
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] truncate">{label}</span>
                  </button>
                ))}
              </div>
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
                  editTravelType === 'TRAIN' ? 'Departing Train Station' :
                  editTravelType === 'CRUISE' ? 'Departure Port' :
                  editTravelType === 'BUS' ? 'Bus Departure Terminal' :
                  editTravelType === 'CAR' ? 'Starting Location / City' :
                  'Flying From (Origin Airport)'
                }
                iconType="origin"
                travelType={editTravelType}
                value={editOriginCity}
                onChange={(formatted) => setEditOriginCity(formatted)}
              />

              <UniversalLocationSearchInput
                label={
                  editTravelType === 'TRAIN' ? 'Arrival Train Station' :
                  editTravelType === 'CRUISE' ? 'Destination Port' :
                  editTravelType === 'BUS' ? 'Bus Arrival Terminal' :
                  editTravelType === 'CAR' ? 'Destination / Stop' :
                  'Destination Airport (Arrival)'
                }
                iconType="destination"
                travelType={editTravelType}
                value={editDestinationCity}
                onChange={(formatted) => setEditDestinationCity(formatted)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                  {editTravelType === 'CAR' ? 'Vehicle Model' :
                   editTravelType === 'TRAIN' ? 'Rail Operator' :
                   editTravelType === 'CRUISE' ? 'Cruise Line / Ship' :
                   editTravelType === 'BUS' ? 'Bus Operator' :
                   'Airline / Carrier'}
                </label>
                <CarrierSearchInput
                  value={editCarrier}
                  onChange={(val) => setEditCarrier(val)}
                  travelType={editTravelType}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1">
                  {editTravelType === 'CAR' ? 'Vehicle Size / Trunk' :
                   editTravelType === 'TRAIN' ? 'Train Coach Class' :
                   editTravelType === 'CRUISE' ? 'Stateroom / Cabin' :
                   editTravelType === 'BUS' ? 'Bus Seat Type' :
                   'Seat / Cabin Class'}
                </label>
                {editTravelType === 'PLANE' ? (
                  <select
                    value={editSeatClass}
                    onChange={(e) => setEditSeatClass(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Main Cabin">Main Cabin / Standard Economy</option>
                    <option value="Basic Economy">Basic Economy (Restricted Bin)</option>
                    <option value="Comfort+ / Extra Legroom">Comfort+ / Premium Economy</option>
                    <option value="Business / First Class">First / Business Class</option>
                  </select>
                ) : editTravelType === 'CAR' ? (
                  <select
                    value={editSeatClass}
                    onChange={(e) => setEditSeatClass(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Mid-Size SUV / Car">Mid-Size SUV / Crossover</option>
                    <option value="Large SUV / Suburban">Large 3-Row SUV / Minivan</option>
                    <option value="Compact Sedan">Compact Sedan</option>
                    <option value="Truck / Pickup">Pickup Truck</option>
                    <option value="RV / Campervan">RV / Campervan</option>
                  </select>
                ) : editTravelType === 'CRUISE' ? (
                  <select
                    value={editSeatClass}
                    onChange={(e) => setEditSeatClass(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Balcony Stateroom">Balcony Ocean View Stateroom</option>
                    <option value="Interior Cabin">Interior Stateroom</option>
                    <option value="Ocean View Porthole">Ocean View Window / Porthole</option>
                    <option value="Suite / Concierge">Suite / Concierge Level</option>
                  </select>
                ) : editTravelType === 'TRAIN' ? (
                  <select
                    value={editSeatClass}
                    onChange={(e) => setEditSeatClass(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Standard Coach">Standard Coach / Economy</option>
                    <option value="Business Class">Business Class / Quiet Car</option>
                    <option value="First Class">First Class</option>
                    <option value="Sleeper Roomette">Sleeper Cabin / Roomette</option>
                  </select>
                ) : editTravelType === 'BUS' ? (
                  <select
                    value={editSeatClass}
                    onChange={(e) => setEditSeatClass(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Standard Reserved Seat">Standard Reserved Seat</option>
                    <option value="Front Row / Extra Legroom">Front Row / Extra Legroom</option>
                    <option value="Panoramic View (Upper Deck)">Upper Deck Panoramic</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editSeatClass}
                    onChange={(e) => setEditSeatClass(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-purple-50/30 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                )}
              </div>

              {/* Published Fare Family for flight mode */}
              {editTravelType === 'PLANE' && editAirlineFareFamilies.length > 0 && (
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                      Published Fare Family / Ticket Tier
                    </label>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                      Sets checked bag allowances & carry-on rules
                    </span>
                  </div>
                  <select
                    value={editFareFamily}
                    onChange={(e) => setEditFareFamily(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {editAirlineFareFamilies.map((fam) => (
                      <option key={fam.id} value={fam.id}>
                        {fam.name} {fam.isDefault ? '(Standard)' : ''} — {fam.includedCheckedBags > 0 ? `${fam.includedCheckedBags} checked included` : '0 checked included'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Flight Schedule: Departure & Return Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Departure Date</span>
                </label>
                <DatePickerInput
                  value={editDate}
                  onChange={(val) => setEditDate(val)}
                  className="h-10 px-3 text-xs"
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
                    {!isPro && <Lock className="w-2 h-2" />} Silver+
                  </span>
                </div>
                {!isPro ? (
                  <div
                    onClick={() => openPaywall("Round-Trip & Return Date tracking is a Silver+ feature. Upgrade to track your return journey.")}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors"
                    title="Click to unlock return schedule with Silver+"
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Locked (Silver+ Feature)</span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-2xs">
                      Upgrade
                    </span>
                  </div>
                ) : (
                  <DatePickerInput
                    value={editReturnDate}
                    onChange={(val) => setEditReturnDate(val)}
                    className="h-10 px-3 text-xs"
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

            {editError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 font-bold">
                {editError}
              </div>
            )}

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

        {/* Condensed Information Deck: Location, Carrier, Level of Seat (No Truncate Clipping) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          {/* 1. Trip Location Card */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-purple-900/60 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
              {getTravelIcon(currentTrip.travelType)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                {isTrain ? 'Station & Route' :
                 isCruise ? 'Ports & Cruise' :
                 isBus ? 'Terminal & Bus' :
                 isCar ? 'Driving Route' :
                 'Airports & Route'}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5">
                {currentTrip.name || 'Trip Route'}
              </p>
              <p className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold leading-tight mt-0.5">
                {Boolean(currentTrip.originCity?.trim() && currentTrip.originCity.trim().length > 1 && currentTrip.destinationCity?.trim() && currentTrip.destinationCity.trim().length > 1)
                  ? `${currentTrip.originCity!.trim()} ➔ ${currentTrip.destinationCity!.trim()}`
                  : Boolean(currentTrip.destinationCity?.trim() && currentTrip.destinationCity.trim().length > 1)
                    ? `To ${currentTrip.destinationCity!.trim()}`
                    : 'Direct Travel Itinerary'}
              </p>
            </div>
          </div>

          {/* 2. Carrier / Airline Card */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-purple-900/60 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                {isCar ? 'Vehicle / Rental' :
                 isTrain ? 'Rail Operator' :
                 isCruise ? 'Cruise Line / Ship' :
                 isBus ? 'Bus Operator' :
                 'Airline'}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5">
                {currentTrip.companyName || (isCar ? 'Personal / Rental Vehicle' : 'Not set')}
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-300 font-semibold leading-tight mt-0.5">
                {currentTrip.flightNumber
                  ? `Flight / Route #${currentTrip.flightNumber}`
                  : isFlight
                    ? 'Standard Carrier Allowances'
                    : isTrain
                      ? 'Standard Rail Allowances'
                      : isCruise
                        ? 'Standard Cruise Policies'
                        : isBus
                          ? 'Standard Bus Allowances'
                          : 'Highway & Road Navigation'}
              </p>
            </div>
          </div>

          {/* 3. Level of Seat / Cabin Class Card */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-purple-100 dark:border-purple-900/60 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
              <Armchair className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-400">
                {isCar ? 'Vehicle Size / Cargo' :
                 isCruise ? 'Stateroom / Cabin' :
                 isTrain ? 'Class of Service' :
                 isBus ? 'Seat Type' :
                 'Cabin'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {currentTrip.seatClassOrCarSize || 'Not set'}
                </p>
                {isFlight && currentFareFamilyObj && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    {currentFareFamilyObj.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-fuchsia-600 dark:text-fuchsia-300 font-semibold leading-tight mt-0.5">
                {currentTrip.aircraftType
                  ? `Aircraft: ${currentTrip.aircraftType}`
                  : isFlight
                    ? 'Overhead Bin & In-Seat Specs'
                    : isTrain
                      ? 'Train Coach & Seat Specs'
                      : isCruise
                        ? 'Stateroom & Baggage Specs'
                        : isCar
                          ? 'Vehicle Cargo & Trunk Specs'
                          : 'Bus Luggage & Seat Specs'}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Info Line: Departure Date, Return Date, Travelers, Bags Count */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 flex-wrap text-xs text-slate-600 dark:text-slate-300 mt-2.5 pt-2.5 border-t border-purple-100/80 dark:border-purple-950/60 font-medium">
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
      {tripToDelete && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 min-h-screen cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setTripToDelete(null);
          }}
        >
          <div 
            className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in zoom-in-95 duration-150 relative z-[100000] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
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
        </div>,
        document.body
      )}
    </div>
  );
};
