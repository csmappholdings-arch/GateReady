import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { PackingProvider, usePacking } from './context/PackingContext';
import { Header } from './components/Header';
import { MobileSyncBanner } from './components/MobileSyncBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { BaggageScreen } from './components/BaggageScreen';
import { TripPrepChecklistScreen } from './components/TripPrepChecklistScreen';
import { AllowancesScreen } from './components/AllowancesScreen';
import { GateReadyChecklistScreen } from './components/GateReadyChecklistScreen';
import { CabinIntelScreen } from './components/CabinIntelScreen';
import { TravelWalletModal } from './components/TravelWalletModal';
import { TravelWalletProvider } from './context/TravelWalletContext';
import { AddTripDialog } from './components/AddTripDialog';
import { AddItemDialog } from './components/AddItemDialog';
import { AddBagDialog } from './components/AddBagDialog';
import { TripBanner } from './components/TripBanner';
import { WalkthroughVideoModal } from './components/WalkthroughVideoModal';
import { AccountSyncModal } from './components/AccountSyncModal';
import { TransitNetworkHub } from './components/TransitNetworkHub';
import { TravelType } from './types/travel';
import { 
  CheckCircle2, 
  Info, 
  PlaneTakeoff, 
  Plus, 
  Luggage,
  Users,
  Zap,
  Sparkles,
  CloudSun,
  Crown,
  Play,
  Plane,
  Train,
  Ship,
  Car,
  Bus
} from 'lucide-react';

function PackingAppContent() {
  const { currentTrip, selectedBagId, setSelectedBagId, addTrip, loadDemoTrip } = usePacking();
  const { isPro } = useSubscription();

  const [currentScreen, setCurrentScreen] = useState<'Bags' | 'Checklist' | 'CabinIntel' | 'Allowances' | 'GateReady'>('Bags');
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [selectedTravelTypeForAdd, setSelectedTravelTypeForAdd] = useState<TravelType | undefined>(undefined);
  const [addTripKey, setAddTripKey] = useState(0);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddBagModal, setShowAddBagModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [targetBagId, setTargetBagId] = useState<string>('');

  const handleOpenAddTrip = (travelType?: TravelType) => {
    setSelectedTravelTypeForAdd(travelType);
    setAddTripKey((prev) => prev + 1);
    setShowAddTripModal(true);
  };

  const handleOpenAddItem = (bagId: string) => {
    setTargetBagId(bagId);
    setShowAddItemModal(true);
  };

  const currentBag = currentTrip?.bags.find((b) => b.id === (targetBagId || selectedBagId)) || currentTrip?.bags[0];

  const totalBags = currentTrip?.bags.length ?? 0;
  const totalItems = currentTrip?.bags.reduce((acc, b) => acc + b.items.length, 0) ?? 0;
  const packedItems = currentTrip?.bags.reduce((acc, b) => acc + b.items.filter((i) => i.isPacked).length, 0) ?? 0;
  const isAllPacked = totalItems > 0 && packedItems === totalItems;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top App Bar with Purple Branding */}
      <Header
        onOpenAddTrip={handleOpenAddTrip}
        onOpenAddBag={() => setShowAddBagModal(true)}
        onOpenTour={() => setShowTourModal(true)}
        onOpenAccountSync={() => setShowAccountModal(true)}
      />

      {/* Sync with Google prompt banner when signed out */}
      <MobileSyncBanner onOpenAccountModal={() => setShowAccountModal(true)} />

      {/* Prominent Trip Information Banner with Location, Carrier, Seat Level & Dropdown */}
      <TripBanner
        currentTrip={currentTrip}
        onOpenAddTrip={handleOpenAddTrip}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-20 sm:pb-12 relative overflow-hidden">
        {/* Overall Ambient Transit Blueprint Grid & Travel Watermarks for entire main page */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-15" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:32px_32px]" />
          <Plane className="absolute top-28 -left-8 w-44 h-44 text-purple-600/30 -rotate-12" />
          <Train className="absolute top-1/3 -right-10 w-44 h-44 text-emerald-600/30 rotate-6" />
          <Ship className="absolute bottom-1/4 -left-10 w-48 h-48 text-cyan-600/30" />
          <Car className="absolute bottom-24 -right-8 w-44 h-44 text-amber-600/30 -rotate-6" />
          <Bus className="absolute top-2/3 left-1/3 w-36 h-36 text-indigo-600/20" />
        </div>

        {currentTrip == null ? (
          <TransitNetworkHub
            onOpenAddTrip={handleOpenAddTrip}
            onOpenTour={() => setShowTourModal(true)}
            onLoadDemo={loadDemoTrip}
          />
        ) : (
          <>
            {/* Prominent Navigation Tabs (Desktop & Tablet) */}
            <div className="hidden sm:block sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-3 pb-2 border-b border-purple-100/80 dark:border-purple-950/60 shadow-xs">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <nav
                  aria-label="Main application tabs"
                  className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-900/80 shadow-md flex items-center justify-between gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar"
                >
                  {/* Tab 1: Bags & Items */}
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('Bags')}
                    className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
                      currentScreen === 'Bags'
                        ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                    }`}
                  >
                    <Luggage className="w-4 h-4 shrink-0" />
                    <span>Bags & Items</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                        currentScreen === 'Bags'
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {totalBags} {totalBags === 1 ? 'Bag' : 'Bags'}
                    </span>
                  </button>

                  {/* Tab 2: Trip Intel & Checklists (Pro) */}
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('Checklist')}
                    className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
                      currentScreen === 'Checklist'
                        ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                    }`}
                  >
                    <CloudSun className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Trip Intel</span>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                      <Crown className="w-2.5 h-2.5 fill-purple-950" /> Pro
                    </span>
                  </button>

                  {/* Tab 3: Cabin & Plugs (Pro) */}
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('CabinIntel')}
                    className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
                      currentScreen === 'CabinIntel'
                        ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">Cabin & Plugs</span>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-2xs">
                      <Crown className="w-2.5 h-2.5 fill-purple-950" /> Pro
                    </span>
                  </button>

                  {/* Tab 4: Allowances */}
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('Allowances')}
                    className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
                      currentScreen === 'Allowances'
                        ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                    }`}
                  >
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Allowances</span>
                  </button>

                  {/* Tab 5: Gate Ready */}
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('GateReady')}
                    className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all cursor-pointer ${
                      currentScreen === 'GateReady'
                        ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30 scale-[1.01]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50'
                    }`}
                  >
                    <PlaneTakeoff className="w-4 h-4 shrink-0" />
                    <span className="truncate">Gate Ready</span>
                    {isAllPacked && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                        Ready
                      </span>
                    )}
                  </button>
                </nav>
              </div>
            </div>

            {/* Screen Router */}
            {currentScreen === 'Bags' && (
              <BaggageScreen
                trip={currentTrip}
                onOpenAddBag={() => setShowAddBagModal(true)}
              />
            )}

            {currentScreen === 'Checklist' && (
              <TripPrepChecklistScreen
                trip={currentTrip}
              />
            )}

            {currentScreen === 'CabinIntel' && (
              <CabinIntelScreen trip={currentTrip} />
            )}

            {currentScreen === 'Allowances' && (
              <AllowancesScreen trip={currentTrip} />
            )}

            {currentScreen === 'GateReady' && (
              <GateReadyChecklistScreen trip={currentTrip} />
            )}
          </>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (5 Prominent Tabs) - only when a trip exists */}
      {currentTrip != null && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-purple-200/80 dark:border-purple-900/80 pb-safe shadow-xl">
          <div className="grid grid-cols-5 items-center h-16 px-1">
            {/* Mobile Tab 1: Bags & Items */}
            <button
              onClick={() => setCurrentScreen('Bags')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer relative ${
                currentScreen === 'Bags'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'Bags' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <Luggage className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Bags</span>
              {totalBags > 0 && (
                <span className="absolute top-1 right-2 text-[9px] font-extrabold px-1 rounded-full bg-purple-600 text-white">
                  {totalBags}
                </span>
              )}
            </button>

            {/* Mobile Tab 2: Trip Intel & Checklists */}
            <button
              onClick={() => setCurrentScreen('Checklist')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer relative ${
                currentScreen === 'Checklist'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'Checklist' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <CloudSun className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Intel</span>
              <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500 absolute top-1 right-2" />
            </button>

            {/* Mobile Tab 3: Plugs & Bins */}
            <button
              onClick={() => setCurrentScreen('CabinIntel')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer relative ${
                currentScreen === 'CabinIntel'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'CabinIntel' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Plugs</span>
              <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500 absolute top-1 right-2" />
            </button>

            {/* Mobile Tab 4: Allowances */}
            <button
              onClick={() => setCurrentScreen('Allowances')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer ${
                currentScreen === 'Allowances'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'Allowances' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <Info className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Limits</span>
            </button>

            {/* Mobile Tab 5: Gate Ready */}
            <button
              onClick={() => setCurrentScreen('GateReady')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer ${
                currentScreen === 'GateReady'
                  ? 'text-purple-700 dark:text-purple-300 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentScreen === 'GateReady' ? 'bg-purple-100 dark:bg-purple-950/80' : ''}`}>
                <PlaneTakeoff className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">Gate Ready</span>
            </button>
          </div>
        </nav>
      )}

      {/* Modals */}
      <AddTripDialog
        key={addTripKey}
        isOpen={showAddTripModal}
        onClose={() => setShowAddTripModal(false)}
        initialTravelType={selectedTravelTypeForAdd}
      />

      {showAddItemModal && currentTrip && currentBag && (
        <AddItemDialog
          isOpen={showAddItemModal}
          bag={currentBag}
          trip={currentTrip}
          onClose={() => setShowAddItemModal(false)}
        />
      )}

      {showAddBagModal && currentTrip && (
        <AddBagDialog
          isOpen={showAddBagModal}
          trip={currentTrip}
          onClose={() => setShowAddBagModal(false)}
        />
      )}

      {/* Interactive Video Tour & Walkthrough Guide Modal */}
      <WalkthroughVideoModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        onOpenTripDialog={handleOpenAddTrip}
      />

      {/* Universal Cross-Device Account Sync Modal */}
      <AccountSyncModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <TravelWalletProvider>
          <PackingProvider>
            <PackingAppContent />
            <SubscriptionModal />
            <TravelWalletModal />
          </PackingProvider>
        </TravelWalletProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
