import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePacking } from '../context/PackingContext';
import { Smartphone, CloudCheck, X, Sparkles } from 'lucide-react';

export const MobileSyncBanner: React.FC = () => {
  const { user, signIn, loading } = useAuth();
  const { cloudSyncStatus } = usePacking();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white border-b border-purple-800/60 shadow-inner px-4 py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-purple-200">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white tracking-tight flex items-center gap-1.5">
              <span>Traveling soon? Sync with your Google Account</span>
              <span className="hidden md:inline-block bg-purple-500/40 text-purple-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                Cloud Sync
              </span>
            </p>
            <p className="text-[11px] text-purple-200/80 truncate">
              Sign in with Google to create your account and access your checklists and baggage weights on your phone at the airport.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={() => signIn()}
            disabled={loading}
            className="h-8 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
