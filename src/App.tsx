import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { PackingProvider, usePacking } from './context/PackingContext';
import { Header } from './components/Header';
import { MobileSyncBanner } from './components/MobileSyncBanner';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PackingChecklistScreen } from './components/PackingChecklistScreen';
import { AllowancesScreen } from './components/AllowancesScreen';
import { GateReadyChecklistScreen } from './components/GateReadyChecklistScreen';
import { AddTripDialog } from './components/AddTripDialog';
import { AddItemDialog } from './components/AddItemDialog';
import { AddBagDialog } from './components/AddBagDialog';
import { 
  CheckCircle2, 
  Info, 
  PlaneTakeoff, 
  Plus, 
  Luggage,
  Users
} from 'lucide-react';

function PackingAppContent() {
  const { currentTrip, selectedBagId } = usePacking();

  const [currentScreen, setCurrentScreen] = useState<'Checklist' | 'Allowances' | 'GateReady'>('Checklist');
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddBagModal, setShowAddBagModal] = useState(false);
  const [targetBagId, setTargetBagId] = useState<string>('');

  const handleOpenAddItem = (bagId: string) => {
    setTargetBagId(bagId);
    setShowAddItemModal(true);
  };

  const currentBag = currentTrip?.bags.find((b) => b.id === (targetBagId || selectedBagId)) || currentTrip?.bags[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top App Bar with Purple Branding */}
      <Header
        onOpenAddTrip={() => setShowAddTripModal(true)}
        onOpenAddBag={() => setShowAddBagModal(true)}
      />

      {/* Sync with Google prompt banner when signed out */}
      <MobileSyncBanner />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTrip == null ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-4 shadow-sm border border-purple-200 dark:border-purple-900/50">
              <Luggage className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to pack?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
              Create your trip with custom travelers (parents, kids, toddlers) and bags to track baggage weights, carry-on liquid limits, and airline rules.
            </p>
            <button
              onClick={() => setShowAddTripModal(true)}
              className="h-12 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Your Trip</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Navigation Tabs */}
            <div className="hidden sm:block border-b border-purple-100 dark:border-purple-950/60 bg-white dark:bg-slate-900">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-8">
                <button
                  onClick={() => setCurrentScreen('Checklist')}
                  className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    currentScreen === 'Checklist'
                      ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                      : 'border-transparent text-slate-500 hover:text-purple-900 dark:hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Checklist & Bags</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('Allowances')}
                  className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    currentScreen === 'Allowances'
                      ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                      : 'border-transparent text-slate-500 hover:text-purple-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Carrier & Liquid Allowances</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('GateReady')}
                  className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    currentScreen === 'GateReady'
                      ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                      : 'border-transparent text-slate-500 hover:text-purple-900 dark:hover:text-slate-200'
                  }`}
                >
                  <PlaneTakeoff className="w-4 h-4" />
                  <span>Gate Ready Check</span>
                </button>
              </div>
            </div>

            {/* Screen Router */}
            {currentScreen === 'Checklist' && (
              <PackingChecklistScreen
                trip={currentTrip}
                onOpenAddItem={handleOpenAddItem}
                onOpenAddBag={() => setShowAddBagModal(true)}
                onNavigateToAllowances={() => setCurrentScreen('Allowances')}
              />
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

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-purple-100 dark:border-purple-950/60 pb-safe shadow-lg">
        <div className="grid grid-cols-3 items-center h-16 px-2">
          <button
            onClick={() => setCurrentScreen('Checklist')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              currentScreen === 'Checklist'
                ? 'text-purple-700 dark:text-purple-300'
                : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Checklist</span>
          </button>

          <button
            onClick={() => setCurrentScreen('Allowances')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              currentScreen === 'Allowances'
                ? 'text-purple-700 dark:text-purple-300'
                : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Allowances</span>
          </button>

          <button
            onClick={() => setCurrentScreen('GateReady')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              currentScreen === 'GateReady'
                ? 'text-purple-700 dark:text-purple-300'
                : 'text-slate-400 dark:text-slate-500 hover:text-purple-900'
            }`}
          >
            <PlaneTakeoff className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Gate Ready</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AddTripDialog
        isOpen={showAddTripModal}
        onClose={() => setShowAddTripModal(false)}
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
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <PackingProvider>
          <PackingAppContent />
          <SubscriptionModal />
        </PackingProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
