import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePacking } from '../context/PackingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { TravelType, BagType } from '../types/travel';
import { 
  X, 
  Plus, 
  Trash2, 
  Luggage, 
  Plane, 
  Train, 
  Car, 
  Ship, 
  Bus, 
  Users, 
  User, 
  AlertCircle, 
  Sparkles, 
  Crown, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  Briefcase, 
  CheckCircle2,
  HelpCircle,
  Zap,
  Maximize2,
  Minimize2,
  Lock
} from 'lucide-react';
import { UniversalLocationSearchInput } from './UniversalLocationSearchInput';
import { CarrierSearchInput } from './CarrierSearchInput';

interface AddTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTripDialog: React.FC<AddTripDialogProps> = ({ isOpen, onClose }) => {
  const { addTrip } = usePacking();
  const { isPro, canAddTraveler, canAddBag, openPaywall } = useSubscription();
  const { user } = useAuth();

  // Dialog expand/fullscreen mode (default: expanded for spacious, easy-to-read view)
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('gateready_trip_dialog_expanded');
      // Default to true (expanded) unless user explicitly saved false
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const toggleExpanded = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('gateready_trip_dialog_expanded', String(next));
      } catch {}
      return next;
    });
  };

  // Active Setup Tab: 'flight' (Flight & Journey) vs 'baggage' (Baggage & Travelers)
  const [activeTab, setActiveTab] = useState<'flight' | 'baggage'>('flight');

  // Tab 1: Journey Details State - completely blank for a new trip setup
  const [name, setName] = useState('');
  const [travelType, setTravelType] = useState<TravelType>('PLANE');
  const [companyName, setCompanyName] = useState('');
  const [seatOrSize, setSeatOrSize] = useState('Main Cabin');
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [returnTripDate, setReturnTripDate] = useState('');
  const [returnTripTime, setReturnTripTime] = useState('');
  const [aircraftType, setAircraftType] = useState('');

  // Tab 2: Traveler & Baggage State
  const defaultTraveler = user?.displayName ? user.displayName.split(' ')[0] : 'Me';
  const [familyMembers, setFamilyMembers] = useState<string[]>([defaultTraveler]);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [travelerError, setTravelerError] = useState('');

  // Default initial bag preset: 1 Carry-on Roller + 1 Personal Backpack (2 bags max for free)
  const [bags, setBags] = useState<Array<{ type: BagType; label: string; assignedTo?: string }>>([
    { type: 'CARRY_ON', label: 'Carry-On Roller', assignedTo: defaultTraveler },
    { type: 'PERSONAL', label: 'Personal Backpack', assignedTo: defaultTraveler }
  ]);

  // Adjust default seat class / vehicle label whenever travelType changes
  useEffect(() => {
    if (travelType === 'CAR') {
      setSeatOrSize('Mid-Size SUV / Car');
    } else if (travelType === 'CRUISE') {
      setSeatOrSize('Balcony Stateroom');
    } else if (travelType === 'TRAIN') {
      setSeatOrSize('Standard Coach');
    } else if (travelType === 'BUS') {
      setSeatOrSize('Standard Reserved Seat');
    } else {
      setSeatOrSize('Main Cabin');
    }
  }, [travelType]);

  // Reset all dialog form inputs to a fresh, completely blank state whenever dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('flight');
      setName('');
      setTravelType('PLANE');
      setCompanyName('');
      setSeatOrSize('Main Cabin');
      setOriginCity('');
      setDestinationCity('');
      setDepartureDate('');
      setDepartureTime('');
      setReturnTripDate('');
      setReturnTripTime('');
      setAircraftType('');
      const defaultUser = user?.displayName ? user.displayName.split(' ')[0] : 'Me';
      setFamilyMembers([defaultUser]);
      setNewMemberInput('');
      setTravelerError('');
      setBags([
        { type: 'CARRY_ON', label: 'Carry-On Roller', assignedTo: defaultUser },
        { type: 'PERSONAL', label: 'Personal Backpack', assignedTo: defaultUser }
      ]);
    }
  }, [isOpen, user]);

  // Keyboard Escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Quick Trip Name Suggestions
  const quickTripNames = [
    'Tokyo Vacation',
    'London & Paris Holiday',
    'Hawaii Beach Getaway',
    'Orlando Disney Trip',
    'New York Weekend',
    'Rocky Mountain Road Trip'
  ];

  // Mode-aware suggestions
  const airlineSuggestions = [
    'Air Canada',
    'Porter Airlines',
    'WestJet',
    'Delta Air Lines',
    'United Airlines',
    'American Airlines',
    'British Airways',
    'Air France',
    'Lufthansa'
  ];

  const trainSuggestions = ['Amtrak', 'VIA Rail', 'Eurostar', 'Brightline', 'Deutsche Bahn', 'Shinkansen'];
  const cruiseSuggestions = ['Royal Caribbean', 'Carnival', 'Norwegian Cruise Line', 'Disney Cruise', 'Princess Cruises'];
  const busSuggestions = ['Greyhound', 'FlixBus', 'Megabus', 'GO Transit Bus', 'National Express'];
  const carSuggestions = ['Toyota RAV4', 'Subaru Outback', 'Chevy Suburban', 'Tesla Model Y', 'Rental SUV'];

  const carrierSuggestions =
    travelType === 'PLANE'
      ? airlineSuggestions
      : travelType === 'TRAIN'
      ? trainSuggestions
      : travelType === 'CRUISE'
      ? cruiseSuggestions
      : travelType === 'BUS'
      ? busSuggestions
      : carSuggestions;

  const handleAddFamilyMember = (nameToAdd?: string) => {
    const raw = nameToAdd !== undefined ? nameToAdd : newMemberInput;
    const trimmed = raw.trim();
    if (!trimmed) {
      setTravelerError('Please enter a name for the traveler.');
      return;
    }

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
  };

  const handleRemoveFamilyMember = (memberToRemove: string) => {
    if (familyMembers.length <= 1) {
      setTravelerError('At least one traveler is required.');
      return;
    }
    const updated = familyMembers.filter((m) => m !== memberToRemove);
    setFamilyMembers(updated);
    setBags(
      bags.map((b) => (b.assignedTo === memberToRemove ? { ...b, assignedTo: updated[0] } : b))
    );
  };

  // 1-Click Luggage Bundles
  const applyLuggageBundle = (bundle: 'CARRY_ON_ONLY' | 'CHECKED_PLUS_CARRY' | 'MINIMALIST') => {
    const primary = familyMembers[0] || 'Traveler';
    if (bundle === 'CARRY_ON_ONLY') {
      setBags([
        { type: 'CARRY_ON', label: 'Carry-On Roller', assignedTo: primary },
        { type: 'PERSONAL', label: 'Personal Backpack', assignedTo: primary }
      ]);
    } else if (bundle === 'CHECKED_PLUS_CARRY') {
      // 3 Bags Bundle: Requires Pro
      if (!isPro) {
        openPaywall('Packing 3 or more bags (Checked + Carry-On + Personal Item) is a Gate Ready Pro feature. The Free plan includes 2 bags maximum.');
        return;
      }
      setBags([
        { type: 'CHECKED', label: 'Checked Suitcase (50 lbs)', assignedTo: primary },
        { type: 'CARRY_ON', label: 'Carry-On Roller', assignedTo: primary },
        { type: 'PERSONAL', label: 'Personal Item / Backpack', assignedTo: primary }
      ]);
    } else if (bundle === 'MINIMALIST') {
      setBags([
        { type: 'PERSONAL', label: 'Underseat Personal Backpack', assignedTo: primary }
      ]);
    }
  };

  const handleAddBag = (type: BagType = 'CHECKED') => {
    const bagCheck = canAddBag(bags as any, type);
    if (!bagCheck.allowed) {
      openPaywall(bagCheck.reason);
      return;
    }

    const defaultLabel =
      type === 'PERSONAL'
        ? 'Personal Backpack'
        : type === 'CARRY_ON'
        ? 'Carry-On Roller'
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
    const otherBags = bags.filter((_, i) => i !== index);
    const bagCheck = canAddBag(otherBags as any, newType);
    if (!bagCheck.allowed) {
      openPaywall(bagCheck.reason);
      return;
    }

    setBags(bags.map((b, i) => (i === index ? { ...b, type: newType } : b)));
  };

  const handleUpdateBagLabel = (index: number, newLabel: string) => {
    setBags(bags.map((b, i) => (i === index ? { ...b, label: newLabel } : b)));
  };

  const handleUpdateBagAssignee = (index: number, newAssignee: string) => {
    setBags(bags.map((b, i) => (i === index ? { ...b, assignedTo: newAssignee } : b)));
  };

  // Final submission
  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const tripTitle = name.trim() || destinationCity.trim() || 'My Upcoming Trip';
    const finalFamily = familyMembers.length > 0 ? familyMembers : [defaultTraveler];
    const finalBags = bags.length > 0 
      ? bags 
      : [{ type: 'CARRY_ON' as BagType, label: 'Carry-On Roller', assignedTo: finalFamily[0] }];

    addTrip(
      tripTitle,
      travelType,
      companyName,
      seatOrSize,
      finalBags,
      finalFamily,
      {
        originCity: originCity.trim(),
        destinationCity: destinationCity.trim() || tripTitle,
        departureDate,
        departureTime,
        returnTripDate,
        returnTripTime,
        aircraftType
      }
    );

    onClose();
  };

  // Dynamic wording depending on selected travel mode
  const getOriginLabel = () => {
    switch (travelType) {
      case 'TRAIN': return 'Departing Station / City';
      case 'CRUISE': return 'Departure Port / Harbor';
      case 'BUS': return 'Bus Departure Terminal';
      case 'CAR': return 'Starting City / Location';
      default: return 'Flying From (Origin Airport)';
    }
  };

  const getDestinationLabel = () => {
    switch (travelType) {
      case 'TRAIN': return 'Arrival Station / Destination';
      case 'CRUISE': return 'Destination Port / Ports of Call';
      case 'BUS': return 'Bus Arrival Terminal / City';
      case 'CAR': return 'Destination / Route Stop';
      default: return 'Destination Airport (Arrival)';
    }
  };

  const getCarrierLabel = () => {
    switch (travelType) {
      case 'TRAIN': return 'Rail Operator (Auto-complete)';
      case 'CRUISE': return 'Cruise Line / Ship Name';
      case 'BUS': return 'Bus Company / Operator';
      case 'CAR': return 'Vehicle Model / Rental Agency';
      default: return 'Airline / Carrier (Auto-complete)';
    }
  };

  const getSeatOrSizeLabel = () => {
    switch (travelType) {
      case 'TRAIN': return 'Class / Coach Type';
      case 'CRUISE': return 'Stateroom / Cabin Type';
      case 'BUS': return 'Seat Selection';
      case 'CAR': return 'Vehicle Size / Cargo Room';
      default: return 'Seat / Cabin Class';
    }
  };

  const getTab1Label = () => {
    switch (travelType) {
      case 'TRAIN': return '1. Train & Journey';
      case 'CRUISE': return '1. Cruise & Ports';
      case 'BUS': return '1. Bus & Route';
      case 'CAR': return '1. Road Trip & Car';
      default: return '1. Flight & Journey';
    }
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/60 overflow-hidden flex flex-col cursor-default transition-all duration-200 relative z-[100000] ${
          isExpanded 
            ? 'max-w-4xl h-[95vh] text-sm' 
            : 'max-w-xl max-h-[92vh] text-xs'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title, Expand/Contract Toggle & Dismiss Button */}
        <div className={`bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white flex items-center justify-between relative transition-all ${
          isExpanded ? 'px-6 py-5' : 'px-5 sm:px-6 py-4'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 ${
              isExpanded ? 'w-11 h-11' : 'w-9 h-9'
            }`}>
              <Luggage className={isExpanded ? 'w-6 h-6 text-purple-200' : 'w-5 h-5 text-purple-200'} />
            </div>
            <div>
              <h3 className={`font-black leading-tight flex items-center gap-2 ${
                isExpanded ? 'text-xl' : 'text-base sm:text-lg'
              }`}>
                <span>Set Trip Details & Luggage</span>
                {isExpanded && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-purple-200">
                    Spacious Mode
                  </span>
                )}
              </h3>
              <p className={`text-purple-200/90 mt-0.5 ${isExpanded ? 'text-xs' : 'text-[11px]'}`}>
                Plan your departure, transit hubs, luggage allowances & travelers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Expand / Minimize Window Toggle */}
            <button
              type="button"
              onClick={toggleExpanded}
              className="h-8 px-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title={isExpanded ? "Collapse to standard size" : "Expand window for larger font & more room"}
              aria-label={isExpanded ? "Collapse view" : "Expand view"}
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Compact</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Expand</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Close dialog"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className={`bg-slate-50 dark:bg-slate-950/60 border-b border-purple-100 dark:border-purple-900/40 ${
          isExpanded ? 'px-6 pt-4 pb-3' : 'px-5 sm:px-6 pt-3 pb-2'
        }`}>
          <div className="grid grid-cols-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-purple-200/80 dark:border-purple-900/60 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('flight')}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isExpanded ? 'text-sm' : 'text-xs'
              } ${
                activeTab === 'flight'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              <Plane className={isExpanded ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
              <span>{getTab1Label()}</span>
              {name.trim() && (
                <Check className={`w-3.5 h-3.5 ${activeTab === 'flight' ? 'text-white' : 'text-emerald-500'}`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('baggage')}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isExpanded ? 'text-sm' : 'text-xs'
              } ${
                activeTab === 'baggage'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              <Briefcase className={isExpanded ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
              <span>2. Baggage & Travelers</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeTab === 'baggage' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
              }`}>
                {bags.length} bags
              </span>
            </button>
          </div>

          {/* Guidance Banner */}
          <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 flex items-center justify-between text-[11px] text-purple-900 dark:text-purple-300">
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">
                Skip any details you don't know yet — edit or re-enter anytime from your banner!
              </span>
            </div>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 hover:underline shrink-0 ml-2 cursor-pointer"
            >
              ⚡ Quick Create
            </button>
          </div>
        </div>

        {/* Form Body: Scrollable Tab Contents */}
        <div className={`overflow-y-auto flex-1 ${
          isExpanded ? 'p-6 sm:p-8 space-y-6' : 'p-5 sm:p-6 space-y-4'
        }`}>
          {/* ======================================================== */}
          {/* TAB 1: JOURNEY / TRANSIT DETAILS                         */}
          {/* ======================================================== */}
          {activeTab === 'flight' && (
            <div className={`animate-in fade-in duration-150 ${isExpanded ? 'space-y-6' : 'space-y-4'}`}>
              {/* Trip Name & Preset Chips */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`block font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider ${
                    isExpanded ? 'text-xs' : 'text-[11px]'
                  }`}>
                    Trip Name / Destination Title *
                  </label>
                  <span className="text-[10px] text-slate-400">Required</span>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!destinationCity) setDestinationCity(e.target.value);
                  }}
                  placeholder="e.g. Tokyo Vacation, London Eurostar Trip, Alaska Cruise 2026"
                  className={`w-full rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 ${
                    isExpanded ? 'h-12 px-4 text-sm' : 'h-11 px-3.5 text-xs'
                  }`}
                  autoFocus
                />

                {/* Quick Trip Name Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar">
                  <span className="text-[10px] text-slate-400 shrink-0">Ideas:</span>
                  {quickTripNames.map((tripIdea) => (
                    <button
                      key={tripIdea}
                      type="button"
                      onClick={() => {
                        setName(tripIdea);
                        if (!destinationCity) setDestinationCity(tripIdea.replace(' Family Trip', '').replace(' Weekend', '').replace(' Getaway', ''));
                      }}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/60 shrink-0 transition-colors cursor-pointer"
                    >
                      + {tripIdea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Mode Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider ${
                    isExpanded ? 'text-xs' : 'text-[11px]'
                  }`}>
                    Mode of Travel
                  </label>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                    Adjusts transit stations, airports, ports & carriers
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { type: 'PLANE' as TravelType, label: 'Flight', icon: Plane, desc: 'Airports & Airlines' },
                    { type: 'TRAIN' as TravelType, label: 'Train', icon: Train, desc: 'Rail & High Speed' },
                    { type: 'CAR' as TravelType, label: 'Car / Road', icon: Car, desc: 'Driving & Routes' },
                    { type: 'CRUISE' as TravelType, label: 'Cruise', icon: Ship, desc: 'Ports & Ships' },
                    { type: 'BUS' as TravelType, label: 'Bus / Coach', icon: Bus, desc: 'Terminals & Lines' }
                  ].map(({ type, label, icon: Icon, desc }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTravelType(type)}
                      className={`rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                        isExpanded ? 'py-3 px-2' : 'py-2 px-1'
                      } ${
                        travelType === type
                          ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm ring-1 ring-purple-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50/30 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={isExpanded ? 'w-5 h-5' : 'w-4 h-4'} />
                      <span className={`font-bold ${isExpanded ? 'text-xs' : 'text-[11px]'}`}>{label}</span>
                      {isExpanded && (
                        <span className="text-[9px] text-slate-400 hidden sm:inline text-center leading-tight">
                          {desc}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Origin & Destination Hubs (Airports, Train Stations, Cruise Ports, Bus Terminals) */}
              <div className={`rounded-2xl bg-purple-50/50 dark:bg-slate-800/50 border border-purple-100 dark:border-purple-900/50 ${
                isExpanded ? 'p-5 space-y-4' : 'p-3.5 space-y-3'
              }`}>
                <div className="flex items-center justify-between text-xs text-purple-900 dark:text-purple-300 font-bold border-b border-purple-100 dark:border-purple-900/40 pb-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>Locations & Transit Hubs ({travelType})</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Includes Toronto Island (YTZ), regional hubs & international terminals
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <UniversalLocationSearchInput
                    label={getOriginLabel()}
                    iconType="origin"
                    travelType={travelType}
                    value={originCity}
                    onChange={(formatted) => setOriginCity(formatted)}
                    inputClassName={isExpanded ? 'h-11 text-sm' : 'h-10 text-xs'}
                  />

                  <UniversalLocationSearchInput
                    label={getDestinationLabel()}
                    iconType="destination"
                    travelType={travelType}
                    value={destinationCity}
                    onChange={(formatted) => {
                      setDestinationCity(formatted);
                      if (!name || name === 'My Trip') {
                        setName(`${formatted.split(' ')[0]} Trip`);
                      }
                    }}
                    inputClassName={isExpanded ? 'h-11 text-sm' : 'h-10 text-xs'}
                  />
                </div>
              </div>

              {/* Carrier / Operator & Seat Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className={`block font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider mb-1 ${
                    isExpanded ? 'text-xs' : 'text-[11px]'
                  }`}>
                    {getCarrierLabel()}
                  </label>
                  <CarrierSearchInput
                    value={companyName}
                    onChange={(val) => setCompanyName(val)}
                    travelType={travelType}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className={`block font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider mb-1 ${
                    isExpanded ? 'text-xs' : 'text-[11px]'
                  }`}>
                    {getSeatOrSizeLabel()}
                  </label>
                  {travelType === 'CAR' ? (
                    <select
                      value={seatOrSize}
                      onChange={(e) => setSeatOrSize(e.target.value)}
                      className={`w-full rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden ${
                        isExpanded ? 'h-10 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                      }`}
                    >
                      <option value="Mid-Size SUV / Car">Mid-Size SUV / Crossover (4-5 passengers)</option>
                      <option value="Large SUV / Suburban">Large 3-Row SUV / Minivan (6-8 passengers)</option>
                      <option value="Compact Sedan">Compact Sedan (1-4 passengers, limited trunk)</option>
                      <option value="Truck / Pickup">Pickup Truck / Cargo Bed</option>
                      <option value="RV / Campervan">RV / Campervan</option>
                    </select>
                  ) : travelType === 'CRUISE' ? (
                    <select
                      value={seatOrSize}
                      onChange={(e) => setSeatOrSize(e.target.value)}
                      className={`w-full rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden ${
                        isExpanded ? 'h-10 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                      }`}
                    >
                      <option value="Balcony Stateroom">Balcony Ocean View Stateroom</option>
                      <option value="Interior Cabin">Interior Stateroom (Standard)</option>
                      <option value="Ocean View Porthole">Ocean View (Window / Porthole)</option>
                      <option value="Suite / Concierge">Suite / Concierge Level</option>
                    </select>
                  ) : travelType === 'TRAIN' ? (
                    <select
                      value={seatOrSize}
                      onChange={(e) => setSeatOrSize(e.target.value)}
                      className={`w-full rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden ${
                        isExpanded ? 'h-10 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                      }`}
                    >
                      <option value="Standard Coach">Standard Coach / Economy</option>
                      <option value="Business Class">Business Class / Quiet Car</option>
                      <option value="First Class">First Class (Eurostar / Shinkansen Green)</option>
                      <option value="Sleeper Roomette">Sleeper Cabin / Roomette</option>
                    </select>
                  ) : travelType === 'BUS' ? (
                    <select
                      value={seatOrSize}
                      onChange={(e) => setSeatOrSize(e.target.value)}
                      className={`w-full rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden ${
                        isExpanded ? 'h-10 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                      }`}
                    >
                      <option value="Standard Reserved Seat">Standard Reserved Seat</option>
                      <option value="Front Row / Extra Legroom">Front Row / Extra Legroom</option>
                      <option value="Panoramic View (Upper Deck)">Upper Deck Front Panoramic</option>
                    </select>
                  ) : (
                    <select
                      value={seatOrSize}
                      onChange={(e) => setSeatOrSize(e.target.value)}
                      className={`w-full rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden ${
                        isExpanded ? 'h-10 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                      }`}
                    >
                      <option value="Main Cabin">Main Cabin / Standard Economy</option>
                      <option value="Basic Economy">Basic Economy (Restricted Bin)</option>
                      <option value="Comfort+ / Extra Legroom">Comfort+ / Premium Economy</option>
                      <option value="Business / First Class">First / Business Class</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Popular Carrier Suggestions */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-400 shrink-0">Popular:</span>
                {carrierSuggestions.slice(0, 7).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCompanyName(c)}
                    className="px-2 py-0.5 rounded-lg text-[10px] bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 text-purple-800 dark:text-purple-300 shrink-0 transition-colors cursor-pointer border border-purple-100 dark:border-purple-900/40"
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Departure Schedule */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Departure Date</span>
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                      isExpanded ? 'h-11 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Departure Time</span>
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                      isExpanded ? 'h-11 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                    }`}
                  />
                </div>
              </div>

              {/* Return Trip Schedule (Round-Trip Tracking) - Pro Feature */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-indigo-50/70 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-indigo-950/40 border border-indigo-200/90 dark:border-indigo-800/60 shadow-2xs space-y-3">
                {/* Pro Locked Header Banner with Short Feature Summary for Non-Pro Users */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-indigo-100 dark:border-indigo-900/60">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-300/40">
                      <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                          Round-Trip & Return Tracking
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                          {!isPro && <Lock className="w-2.5 h-2.5" />} PRO
                        </span>
                      </div>
                      <p className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80">
                        Track return flight countdowns, 2-way baggage allowances & return day alerts
                      </p>
                    </div>
                  </div>

                  {!isPro ? (
                    <button
                      type="button"
                      onClick={() => openPaywall("Round-Trip & Return Date tracking is a Gate Ready Pro feature. Track return flights, 2-way weight limits, and return day departure alerts.")}
                      className="h-7 px-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-[10px] flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all shrink-0 self-start sm:self-auto"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Unlock with Pro</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  )}
                </div>

                {/* Short Summary of Pro Features Banner (shown when locked) */}
                {!isPro && (
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
                    <p className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1 text-[10.5px]">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Included with Gate Ready Pro Subscription:</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">✓ Round-trip schedules & return countdowns</span>
                      <span className="flex items-center gap-1">✓ 3+ bags & unlimited multiple luggage</span>
                      <span className="flex items-center gap-1">✓ Unlimited travelers (family, kids, toddlers)</span>
                      <span className="flex items-center gap-1">✓ Printable high-res PDF baggage checklists</span>
                      <span className="flex items-center gap-1">✓ Emergency privacy-safe QR luggage tags</span>
                      <span className="flex items-center gap-1">✓ Cabin Intel & in-seat AC plug specs</span>
                    </div>
                  </div>
                )}

                {/* Return Date & Time Inputs (Interactive for Pro, Locked Overlay for Free) */}
                <div className="relative">
                  {!isPro && (
                    <div 
                      onClick={() => openPaywall("Round-Trip & Return Date tracking is a Gate Ready Pro feature. Upgrade to Pro to track your return journey.")}
                      className="absolute inset-0 z-10 bg-slate-900/5 dark:bg-slate-950/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center cursor-pointer group"
                      title="Click to unlock return schedule with Pro"
                    >
                      <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-md border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Return Date Locked (Pro Feature) — Tap to Upgrade</span>
                      </div>
                    </div>
                  )}

                  <div className={`grid grid-cols-2 gap-3 ${!isPro ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-950 dark:text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Return Date</span>
                      </label>
                      <input
                        type="date"
                        disabled={!isPro}
                        value={isPro ? returnTripDate : ''}
                        onChange={(e) => setReturnTripDate(e.target.value)}
                        className={`w-full rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                          isExpanded ? 'h-11 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-indigo-950 dark:text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Return Time</span>
                      </label>
                      <input
                        type="time"
                        disabled={!isPro}
                        value={isPro ? returnTripTime : ''}
                        onChange={(e) => setReturnTripTime(e.target.value)}
                        className={`w-full rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                          isExpanded ? 'h-11 px-3.5 text-sm' : 'h-10 px-3 text-xs'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: BAGGAGE & TRAVELERS SETUP                         */}
          {/* ======================================================== */}
          {activeTab === 'baggage' && (
            <div className={`animate-in fade-in duration-150 ${isExpanded ? 'space-y-6' : 'space-y-4'}`}>
              {/* Traveler Setup */}
              <div className={`rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 ${
                isExpanded ? 'p-5 space-y-3.5' : 'p-4 space-y-2.5'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950 dark:text-purple-200">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Who is Traveling? ({familyMembers.length})</span>
                  </div>
                  {!isPro ? (
                    <button
                      type="button"
                      onClick={() => openPaywall("The Free Plan includes 1 traveler. Upgrade to Pro to pack for whole families.")}
                      className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-amber-200 cursor-pointer"
                    >
                      <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Free: 1 Traveler</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-purple-600 text-purple-600" />
                      <span>Pro: Unlimited</span>
                    </span>
                  )}
                </div>

                {/* Travelers chips */}
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
                      {familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFamilyMember(member)}
                          className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Add Member input */}
                <div className="flex items-center gap-2 pt-1">
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
                    placeholder="Add family member (e.g. Toddler, Sarah, Dad)..."
                    className={`flex-1 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
                      isExpanded ? 'h-10 px-3.5 text-sm' : 'h-9 px-3 text-xs'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFamilyMember()}
                    className={`rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1 cursor-pointer shrink-0 ${
                      isExpanded ? 'h-10 px-4 text-xs' : 'h-9 px-3 text-xs'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {travelerError && (
                  <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{travelerError}</span>
                  </p>
                )}

                {/* Quick Add helper chips */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
                  <span className="text-[10px] text-slate-400 shrink-0">Quick add:</span>
                  {['Mom', 'Dad', 'Partner', 'Child', 'Toddler', 'Baby'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleAddFamilyMember(label)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/60 shrink-0 cursor-pointer"
                    >
                      + {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1-Click Luggage Preset Bundles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider ${
                    isExpanded ? 'text-xs' : 'text-[11px]'
                  }`}>
                    Quick Luggage Bundles (1-Click Setup)
                  </span>
                  <span className="text-[10px] text-slate-400">Pre-configures bags</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => applyLuggageBundle('CARRY_ON_ONLY')}
                    className="p-3 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:border-purple-400 text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <p className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <Luggage className="w-3.5 h-3.5 text-purple-600" />
                      <span>Carry-On Only</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded ml-auto">Free (2 bags)</span>
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      1 Roller Carry-On + 1 Personal Backpack
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyLuggageBundle('CHECKED_PLUS_CARRY')}
                    className="p-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-400 text-left transition-all cursor-pointer relative shadow-2xs"
                  >
                    <p className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Checked + Carry</span>
                      <span className="text-[9px] bg-amber-400 text-purple-950 font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 ml-auto">
                        <Lock className="w-2.5 h-2.5" /> PRO (3 bags)
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      1 Checked Suitcase (50lb) + 1 Carry + Backpack
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyLuggageBundle('MINIMALIST')}
                    className="p-3 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:border-purple-400 text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <p className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Minimalist Light</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded ml-auto">Free (1 bag)</span>
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      1 Underseat Personal Backpack only
                    </p>
                  </button>
                </div>
              </div>

              {/* Active Bags List */}
              <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider ${
                      isExpanded ? 'text-xs' : 'text-[11px]'
                    }`}>
                      Configured Bags ({bags.length})
                    </span>
                    {!isPro ? (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Free Limit: 2 Bags Max (3+ Requires Pro)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                        Pro: Unlimited Bags
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddBag('CHECKED')}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Bag</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {bags.map((bag, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-slate-800/60 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <select
                          value={bag.type}
                          onChange={(e) => handleUpdateBagType(idx, e.target.value as BagType)}
                          className={`px-2 font-semibold rounded-xl bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 text-purple-900 dark:text-purple-200 focus:outline-hidden ${
                            isExpanded ? 'h-10 text-xs' : 'h-9 text-xs'
                          }`}
                        >
                          <option value="PERSONAL">Personal Item</option>
                          <option value="CARRY_ON">Carry-on</option>
                          <option value="CHECKED">Checked Bag</option>
                        </select>

                        <input
                          type="text"
                          value={bag.label}
                          onChange={(e) => handleUpdateBagLabel(idx, e.target.value)}
                          placeholder="Bag Label"
                          className={`flex-1 px-3 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden ${
                            isExpanded ? 'h-10 text-xs' : 'h-9 text-xs'
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={bag.assignedTo || familyMembers[0]}
                          onChange={(e) => handleUpdateBagAssignee(idx, e.target.value)}
                          className={`px-2 font-semibold rounded-xl bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 text-purple-800 dark:text-purple-300 focus:outline-hidden flex-1 sm:flex-initial ${
                            isExpanded ? 'h-10 text-xs' : 'h-9 text-xs'
                          }`}
                          title="Assignee"
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
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                            aria-label="Remove bag"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation & Actions */}
        <div className={`bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 ${
          isExpanded ? 'p-5' : 'p-4'
        }`}>
          {activeTab === 'flight' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className={`rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                  isExpanded ? 'h-11 px-5 text-xs' : 'h-10 px-4 text-xs'
                }`}
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className={`rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 hover:bg-purple-50 text-purple-700 dark:text-purple-300 font-bold transition-all cursor-pointer shadow-2xs ${
                    isExpanded ? 'h-11 px-4 text-xs' : 'h-10 px-3.5 text-xs'
                  }`}
                  title="Skip baggage setup for now — default carry-on will be created"
                >
                  ⚡ Skip to Create
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('baggage')}
                  className={`rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer ${
                    isExpanded ? 'h-11 px-6 text-sm' : 'h-10 px-5 text-xs'
                  }`}
                >
                  <span>Set Up Baggage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('flight')}
                className={`rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isExpanded ? 'h-11 px-5 text-xs' : 'h-10 px-4 text-xs'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Journey</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className={`rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer shadow-purple-600/20 ${
                    isExpanded ? 'h-11 px-7 text-sm' : 'h-10 px-6 text-xs'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Finish & Create Trip</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
