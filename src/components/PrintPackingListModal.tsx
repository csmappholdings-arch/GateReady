import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Trip, Bag, PackingItem, getUserPresetWeightLbs } from '../types/travel';
import { usePacking } from '../context/PackingContext';
import { DefaultSuggestions } from '../data/suggestions';
import { 
  Printer, 
  X, 
  Check, 
  Copy, 
  Luggage, 
  Briefcase, 
  Users, 
  Calendar, 
  MapPin, 
  Plane, 
  Train, 
  Ship, 
  Car, 
  Bus, 
  CheckCircle2, 
  Circle, 
  Filter, 
  Scale,
  Sparkles,
  Droplets
} from 'lucide-react';

interface PrintPackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export const PrintPackingListModal: React.FC<PrintPackingListModalProps> = ({
  isOpen,
  onClose,
  trip
}) => {
  const { weightUnit } = usePacking();

  const [filterStatus, setFilterStatus] = useState<'all' | 'packed' | 'unpacked'>('all');
  const [selectedTraveler, setSelectedTraveler] = useState<string>('all');
  const [selectedBagId, setSelectedBagId] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const familyMembers = trip.familyMembers && trip.familyMembers.length > 0 
    ? trip.familyMembers 
    : ['Traveler 1'];

  // Calculate totals
  const totalItemsCount = trip.bags.reduce((acc, b) => acc + b.items.length, 0);
  const packedItemsCount = trip.bags.reduce((acc, b) => acc + b.items.filter(i => i.isPacked).length, 0);
  const packingPct = totalItemsCount > 0 ? Math.round((packedItemsCount / totalItemsCount) * 100) : 0;

  // Total weight
  const totalWeightLbs = trip.bags.reduce((sum, bag) => {
    const empty = bag.emptyBagWeightLbs ?? getUserPresetWeightLbs(bag.type, bag.material || 'HARD_SHELL');
    const items = bag.items.reduce((s, item) => {
      const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
      return s + w * item.quantity;
    }, 0);
    return sum + empty + items;
  }, 0);

  const displayTotalWeight = weightUnit === 'KG'
    ? `${DefaultSuggestions.convertLbsToKg(totalWeightLbs).toFixed(1)} kg`
    : `${totalWeightLbs.toFixed(1)} lbs`;

  // Filtered bags & items
  const filteredBags = useMemo(() => {
    return trip.bags
      .filter((bag) => selectedBagId === 'all' || bag.id === selectedBagId)
      .map((bag) => {
        const filteredItems = bag.items.filter((item) => {
          // Status filter
          if (filterStatus === 'packed' && !item.isPacked) return false;
          if (filterStatus === 'unpacked' && item.isPacked) return false;

          // Traveler filter
          if (selectedTraveler !== 'all') {
            const itemTraveler = item.packedFor || bag.assignedTo;
            if (itemTraveler !== selectedTraveler) return false;
          }

          return true;
        });

        return {
          ...bag,
          filteredItems
        };
      });
  }, [trip.bags, filterStatus, selectedTraveler, selectedBagId]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    let summary = `═══════════════════════════════════════════\n`;
    summary += `📋 GATEREADY.CA PACKING MANIFEST & BAGGAGE RECORD\n`;
    summary += `═══════════════════════════════════════════\n`;
    summary += `Trip: ${trip.name}\n`;
    const validOrig = trip.originCity && trip.originCity.trim().length > 1 ? trip.originCity.trim() : null;
    const validDest = trip.destinationCity && trip.destinationCity.trim().length > 1 ? trip.destinationCity.trim() : null;
    if (validOrig && validDest) {
      summary += `Route: ${validOrig} ➔ ${validDest}\n`;
    } else if (validDest) {
      summary += `Destination: ${validDest}\n`;
    }
    if (trip.companyName) {
      summary += `Carrier: ${trip.companyName} (${trip.seatClassOrCarSize || 'Standard'})\n`;
    }
    if (trip.departureDate) {
      summary += `Departure: ${trip.departureDate} ${trip.departureTime || ''}\n`;
    }
    summary += `Travelers: ${familyMembers.join(', ')}\n`;
    summary += `Total Luggage: ${trip.bags.length} bags • ${displayTotalWeight} • ${packedItemsCount}/${totalItemsCount} items packed (${packingPct}%)\n\n`;

    filteredBags.forEach((bag) => {
      summary += `🎒 BAG: ${bag.label} (${bag.type})\n`;
      if (bag.assignedTo) summary += `   Assigned to: ${bag.assignedTo}\n`;
      summary += `   Items (${bag.filteredItems.length}):\n`;
      
      if (bag.filteredItems.length === 0) {
        summary += `   (No matching items)\n`;
      } else {
        bag.filteredItems.forEach((item) => {
          const mark = item.isPacked ? '[✓]' : '[ ]';
          const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
          const loc = item.location ? ` - In: ${item.location}` : '';
          const forWhom = item.packedFor && item.packedFor !== bag.assignedTo ? ` [For: ${item.packedFor}]` : '';
          summary += `   ${mark} ${item.name}${qty}${forWhom}${loc}\n`;
        });
      }
      summary += `\n`;
    });

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-900/60 overflow-hidden flex flex-col max-h-[94vh] relative z-[100000] print-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-purple-200">
              <Printer className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg leading-tight text-white">
                  Print Packing List & Manifest
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded-full">
                  GateReady.ca
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Full itemized breakdown showing what bag every item is packed in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleCopy}
              className="h-9 px-3.5 rounded-xl border border-white/20 hover:bg-white/10 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy text summary to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Filter Toolbar (Hidden when printed) */}
        <div className="no-print p-3 sm:px-6 bg-slate-50 dark:bg-slate-800/60 border-b border-purple-100 dark:border-purple-950/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>

            {/* Status Filter */}
            <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Items ({totalItemsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('packed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'packed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Packed Only ({packedItemsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('unpacked')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'unpacked'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Unpacked ({totalItemsCount - packedItemsCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Bag Selector Filter */}
            <select
              value={selectedBagId}
              onChange={(e) => setSelectedBagId(e.target.value)}
              className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Bags ({trip.bags.length})</option>
              {trip.bags.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label} ({b.items.length} items)
                </option>
              ))}
            </select>

            {/* Traveler Selector Filter */}
            {familyMembers.length > 1 && (
              <select
                value={selectedTraveler}
                onChange={(e) => setSelectedTraveler(e.target.value)}
                className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
              >
                <option value="all">All Travelers ({familyMembers.length})</option>
                {familyMembers.map((m) => (
                  <option key={m} value={m}>
                    For: {m}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Printable Document Content (Scrollable on screen, expands in print) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950">
          {/* Printable Manifest Header */}
          <div className="border-b-2 border-purple-600 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-lg sm:text-xl text-purple-700 dark:text-purple-400 tracking-tight">
                    GateReady.ca
                  </span>
                  <span className="text-xs text-slate-400 font-medium">| Official Travel Manifest & Packing List</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {trip.name || 'Trip Packing List'}
                </h1>
                
                {/* Route & Details */}
                <div className="flex items-center gap-3 flex-wrap mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {Boolean(trip.originCity?.trim() && trip.originCity.trim().length > 1 && trip.destinationCity?.trim() && trip.destinationCity.trim().length > 1) ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{trip.originCity!.trim()} ➔ {trip.destinationCity!.trim()}</span>
                    </span>
                  ) : Boolean(trip.destinationCity?.trim() && trip.destinationCity.trim().length > 1) ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>To {trip.destinationCity!.trim()}</span>
                    </span>
                  ) : null}
                  {trip.companyName && (
                    <span className="flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{trip.companyName} • {trip.seatClassOrCarSize || 'Standard'}</span>
                    </span>
                  )}
                  {trip.departureDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Departure: {trip.departureDate} {trip.departureTime ? `at ${trip.departureTime}` : ''}</span>
                    </span>
                  )}
                </div>

                {familyMembers.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-bold">Travelers:</span>
                    <span>{familyMembers.join(' • ')}</span>
                  </div>
                )}
              </div>

              {/* Summary Scorecard Badge */}
              <div className="text-right shrink-0">
                <div className="inline-block p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-right">
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Packing Readiness
                  </div>
                  <div className="text-2xl font-black text-purple-700 dark:text-purple-300 tabular-nums">
                    {packedItemsCount} / {totalItemsCount}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {packingPct}% Packed • {displayTotalWeight} Total
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bag-by-Bag Itemized Packing Manifest (Primary Fix: Every bag and all items clearly listed) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Luggage className="w-5 h-5 text-purple-600" />
                <span>Luggage & Itemized Bag Manifest</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                {filteredBags.length} {filteredBags.length === 1 ? 'Bag' : 'Bags'} Listed
              </span>
            </div>

            {filteredBags.map((bag, bagIdx) => {
              const emptyLbs = bag.emptyBagWeightLbs ?? getUserPresetWeightLbs(bag.type, bag.material || 'HARD_SHELL');
              const bagItemsLbs = bag.items.reduce((sum, item) => {
                const w = item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name);
                return sum + w * item.quantity;
              }, 0);
              const totalBagLbs = emptyLbs + bagItemsLbs;
              const limitLbs = bag.maxWeightLimitLbs || (bag.type === 'CHECKED' ? 50 : bag.type === 'CARRY_ON' ? 22 : 15);
              const bagPackedCount = bag.items.filter(i => i.isPacked).length;

              const displayBagWeight = weightUnit === 'KG'
                ? `${DefaultSuggestions.convertLbsToKg(totalBagLbs).toFixed(1)} kg`
                : `${totalBagLbs.toFixed(1)} lbs`;

              const displayLimit = weightUnit === 'KG'
                ? `${DefaultSuggestions.convertLbsToKg(limitLbs).toFixed(0)} kg`
                : `${limitLbs} lbs`;

              return (
                <div 
                  key={bag.id}
                  className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden print-card-break-avoid bg-slate-50/50 dark:bg-slate-900/50"
                >
                  {/* Bag Header Banner */}
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {bagIdx + 1}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        {bag.label}
                      </h3>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {bag.type.replace('_', ' ')}
                      </span>
                      {bag.assignedTo && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Assigned to: <strong>{bag.assignedTo}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 self-end sm:self-center">
                      <span className="flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-purple-600" />
                        <span>{displayBagWeight} / {displayLimit} cap</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-purple-700 dark:text-purple-300 font-extrabold">
                        {bagPackedCount}/{bag.items.length} Packed
                      </span>
                    </div>
                  </div>

                  {/* Items Table for this Bag */}
                  <div className="p-3 sm:p-4 bg-white dark:bg-slate-900">
                    {bag.filteredItems.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-400 italic">
                        {bag.items.length === 0 
                          ? 'No items packed into this bag yet.' 
                          : 'No items match the current filter in this bag.'}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-black">
                              <th className="py-2 px-2 w-10 text-center">Status</th>
                              <th className="py-2 px-2 font-bold">Item Description</th>
                              <th className="py-2 px-2 w-14 text-center font-bold">Qty</th>
                              <th className="py-2 px-2 font-bold">Pocket / Location in Bag</th>
                              <th className="py-2 px-2 font-bold">For Traveler</th>
                              <th className="py-2 px-2 w-20 text-right font-bold">Est. Weight</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {bag.filteredItems.map((item, itemIdx) => {
                              const itemWeightLbs = (item.customWeightLbs ?? DefaultSuggestions.getEstimatedWeightLbs(item.name)) * item.quantity;
                              const displayItemWeight = weightUnit === 'KG'
                                ? `${DefaultSuggestions.convertLbsToKg(itemWeightLbs).toFixed(2)} kg`
                                : `${itemWeightLbs.toFixed(1)} lbs`;

                              return (
                                <tr 
                                  key={item.id || itemIdx}
                                  className={item.isPacked ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''}
                                >
                                  {/* Checkbox Status Column */}
                                  <td className="py-2.5 px-2 text-center align-middle">
                                    <div className="inline-flex items-center justify-center">
                                      {item.isPacked ? (
                                        <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                      ) : (
                                        <div className="w-4 h-4 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                                      )}
                                    </div>
                                  </td>

                                  {/* Item Name & Details */}
                                  <td className="py-2.5 px-2 align-middle">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`font-bold ${item.isPacked ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {item.name}
                                      </span>
                                      {(item.category === 'Toiletries' || /shampoo|lotion|liquid|toothpaste|perfume|sunscreen|gel|spray/i.test(item.name)) && (
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                          <Droplets className="w-2.5 h-2.5" />
                                          <span>TSA 3-1-1</span>
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Quantity */}
                                  <td className="py-2.5 px-2 text-center align-middle font-bold text-slate-700 dark:text-slate-300">
                                    x{item.quantity}
                                  </td>

                                  {/* Pocket / Location inside Bag */}
                                  <td className="py-2.5 px-2 align-middle text-slate-600 dark:text-slate-400">
                                    {item.location ? (
                                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                                        {item.location}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 italic text-[11px]">Main Compartment</span>
                                    )}
                                  </td>

                                  {/* Traveler Assignment */}
                                  <td className="py-2.5 px-2 align-middle text-slate-700 dark:text-slate-300 font-medium">
                                    {item.packedFor || bag.assignedTo || 'Me'}
                                  </td>

                                  {/* Item Weight */}
                                  <td className="py-2.5 px-2 text-right align-middle font-mono font-bold text-slate-600 dark:text-slate-400">
                                    {displayItemWeight}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gate Departure Verification Checkpoints */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 print-card-break-avoid">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Gate-Ready Departure Security Checklist</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Passports, IDs & Visas verified (&gt;6 mos validity)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Carry-on liquids compliant with TSA 3-1-1 rule (≤3.4 oz)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Lithium battery power banks in carry-on / personal item</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded border border-slate-400 inline-block shrink-0" />
                <span>Boarding passes saved offline to Apple/Google Wallet</span>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>GateReady.ca • Calibrated luggage tare weights, TSA limits & transit manifests</span>
            <span>Generated on {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
