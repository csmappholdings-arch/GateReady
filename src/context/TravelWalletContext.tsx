import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoyaltyAccount, LoyaltyCategory } from '../types/travel';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface TravelWalletContextType {
  accounts: LoyaltyAccount[];
  addAccount: (account: Omit<LoyaltyAccount, 'id' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<LoyaltyAccount>) => void;
  deleteAccount: (id: string) => void;
  isWalletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  syncStatus: 'local' | 'synced' | 'syncing';
}

const WALLET_STORAGE_KEY = 'gateready_travel_wallet_v1';

const TravelWalletContext = createContext<TravelWalletContextType | undefined>(undefined);

export const TravelWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'synced' | 'syncing'>('local');

  const [accounts, setAccounts] = useState<LoyaltyAccount[]>(() => {
    try {
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Sync with Firestore when logged in with Google
  useEffect(() => {
    if (!user) {
      setSyncStatus('local');
      return;
    }

    setSyncStatus('syncing');
    const userRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.travelWallet)) {
          setAccounts(data.travelWallet);
          try {
            localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(data.travelWallet));
          } catch {
            // Ignore
          }
        }
      }
      setSyncStatus('synced');
    }, (err) => {
      console.warn('Error reading travel wallet from cloud:', err);
      setSyncStatus('local');
    });

    return () => unsubscribe();
  }, [user]);

  // Persist to local storage
  const persistAccounts = (nextAccounts: LoyaltyAccount[]) => {
    setAccounts(nextAccounts);
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(nextAccounts));
    } catch {
      // Ignore
    }

    if (user) {
      setSyncStatus('syncing');
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { travelWallet: nextAccounts, updatedAt: new Date().toISOString() }, { merge: true })
        .then(() => setSyncStatus('synced'))
        .catch((err) => {
          console.warn('Failed to save travel wallet to cloud:', err);
          setSyncStatus('local');
        });
    }
  };

  const addAccount = (accountData: Omit<LoyaltyAccount, 'id' | 'updatedAt'>) => {
    const newAccount: LoyaltyAccount = {
      ...accountData,
      id: `wallet-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      updatedAt: new Date().toISOString()
    };
    persistAccounts([newAccount, ...accounts]);
  };

  const updateAccount = (id: string, updates: Partial<LoyaltyAccount>) => {
    const nextAccounts = accounts.map((acc) => 
      acc.id === id ? { ...acc, ...updates, updatedAt: new Date().toISOString() } : acc
    );
    persistAccounts(nextAccounts);
  };

  const deleteAccount = (id: string) => {
    const nextAccounts = accounts.filter((acc) => acc.id !== id);
    persistAccounts(nextAccounts);
  };

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  return (
    <TravelWalletContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
        syncStatus
      }}
    >
      {children}
    </TravelWalletContext.Provider>
  );
};

export const useTravelWallet = (): TravelWalletContextType => {
  const context = useContext(TravelWalletContext);
  if (!context) {
    throw new Error('useTravelWallet must be used within a TravelWalletProvider');
  }
  return context;
};
