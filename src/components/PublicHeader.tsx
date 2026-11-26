import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LogIn, LayoutDashboard, Luggage } from 'lucide-react';
import { useAuthOptional } from '../context/AuthContext';

export interface PublicHeaderProps {
  /** Optional current pathname to highlight active link */
  activePath?: string;
  /** Optional primary action button on right (e.g., on Airline Guide or Calculator pages) */
  rightAction?: React.ReactNode;
}

const PUBLIC_NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Interactive Demo', href: '/demo' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help / FAQ', href: '/faq' },
];

export const PublicHeader: React.FC<PublicHeaderProps> = ({ activePath, rightAction }) => {
  const auth = useAuthOptional();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cachedSignedIn, setCachedSignedIn] = useState(false);

  const resolvedPath = (
    activePath ||
    (typeof window !== 'undefined' ? window.location.pathname : '/')
  ).replace(/\/+$/, '') || '/';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gateready_cached_auth_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.uid) {
          setCachedSignedIn(true);
          return;
        }
      }
      setCachedSignedIn(false);
    } catch {
      setCachedSignedIn(false);
    }
  }, [auth?.user]);

  const isSignedIn = Boolean(auth?.user || auth?.hasCachedAuth || cachedSignedIn);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-purple-100 dark:border-purple-950/80 shadow-2xs transition-colors">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: GateReady Brand — ALWAYS navigates to public homepage (/) */}
        <div className="flex items-center gap-6 min-w-0">
          <a
            href="/"
            aria-label="GateReady – Public homepage"
            title="GateReady – Public homepage"
            className="flex items-center gap-2.5 shrink-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Luggage className="w-4 h-4" />
            </div>
            <div className="flex items-baseline tracking-tight">
              <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Gate<span className="text-purple-600 dark:text-purple-400">Ready</span>
              </span>
              <span className="font-extrabold text-xs text-purple-600 dark:text-purple-400 ml-0.5">.ca</span>
            </div>
          </a>

          {/* Primary Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Public site navigation">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const normHref = item.href.replace(/\/+$/, '') || '/';
              const isActive = resolvedPath === normHref;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200'
                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right: Auth / Open App Action & Mobile Menu Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {rightAction && <div className="hidden sm:flex items-center">{rightAction}</div>}

          {isSignedIn ? (
            <a
              href="/dashboard"
              className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-purple-600/20 transition-all whitespace-nowrap"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Open App</span>
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/?action=login"
                className="hidden sm:inline-flex h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-700 text-slate-700 dark:text-slate-200 hover:text-purple-700 font-bold text-xs items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </a>
              <a
                href="/?action=new_trip&mode=PLANE"
                className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm shadow-purple-600/20 transition-all whitespace-nowrap"
              >
                <span>Open App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-purple-50 dark:hover:bg-slate-700 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 shadow-md"
        >
          {PUBLIC_NAV_ITEMS.map((item) => {
            const normHref = item.href.replace(/\/+$/, '') || '/';
            const isActive = resolvedPath === normHref;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
            {isSignedIn ? (
              <a
                href="/dashboard"
                className="flex-1 h-10 px-4 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Open App</span>
              </a>
            ) : (
              <>
                <a
                  href="/?action=login"
                  className="flex-1 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs inline-flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </a>
                <a
                  href="/?action=new_trip&mode=PLANE"
                  className="flex-1 h-10 px-4 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
