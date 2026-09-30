import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Laptop, 
  Cloud, 
  Eye, 
  EyeOff,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface AccountSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSyncModal: React.FC<AccountSyncModalProps> = ({ isOpen, onClose }) => {
  const { user, signIn, signInWithGithub, signUpWithEmail, signInWithEmail, resetPassword, error, clearError } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Current domain for troubleshooting
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setIsLoading(true);
    try {
      await signIn();
      onClose();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        if (err.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
          setLocalError(`Domain "${currentHostname}" needs to be authorized in Firebase Console for Google OAuth. You can use Email Sign-In below immediately without any setup!`);
        } else {
          setLocalError(err.message || 'Google sign-in failed');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLocalError(null);
    clearError();
    setIsLoading(true);
    try {
      await signInWithGithub();
      onClose();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setLocalError(err.message || 'GitHub sign-in failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await resetPassword(email);
        setForgotSuccess(true);
      } catch (err: any) {
        setLocalError(err.message || 'Failed to send reset link.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 flex items-center justify-center min-h-screen cursor-pointer"
      style={{ margin: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default relative z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact, Clean Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 active:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md z-20"
            aria-label="Close Account Window"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1.5 mb-1 pr-8">
            <Cloud className="w-4 h-4 text-purple-200" />
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-200">
              Cross-Device Cloud Sync
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black pr-8 leading-tight">
            {mode === 'signup' && 'Create Your Gate Ready Account'}
            {mode === 'signin' && 'Welcome Back, Traveler'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-[11px] text-purple-100/90 mt-0.5 pr-6">
            Access your packing checklists, luggage tags, and loyalty rewards on all devices.
          </p>
        </div>

        {/* Primary 1-Click Social Sign-In (Always Visible at Top) */}
        {mode !== 'forgot' && (
          <div className="p-4 pb-3 bg-purple-50/60 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-900/40 shrink-0 space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-11 px-4 rounded-xl border-2 border-purple-300 dark:border-purple-700/80 hover:border-purple-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-black flex items-center justify-center gap-2.5 transition-all shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
              <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full ml-auto">
                Fast Sync
              </span>
            </button>

            <div className="relative flex items-center justify-center pt-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-200/60 dark:border-purple-900/60" />
              </div>
              <span className="relative bg-purple-50/90 dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                or use email & password
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {/* Mode Switch Tabs */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setLocalError(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setLocalError(null);
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Detailed Error / Unauthorized Domain Troubleshooting Banner */}
          {(localError || error) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 space-y-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{localError || error}</span>
              </div>

              {/* If it's an unauthorized domain error, display specific fix steps */}
              {((localError || error)?.toLowerCase().includes('authorized domain') || 
                (localError || error)?.toLowerCase().includes('not authorized') ||
                (localError || error)?.toLowerCase().includes('unauthorized-domain')) && (
                <div className="pt-2 border-t border-rose-200/80 dark:border-rose-900/60 text-[11px] space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setLocalError(null);
                    }}
                    className="w-full h-9 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Sign In with Email (Works Instantly)</span>
                  </button>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800">
                    <span className="font-mono text-purple-900 dark:text-purple-300 font-bold truncate text-[10px]">
                      {currentHostname || 'current-domain'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (currentHostname) {
                          navigator.clipboard.writeText(currentHostname);
                          setCopiedDomain(true);
                          setTimeout(() => setCopiedDomain(false), 2000);
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 hover:bg-purple-200 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedDomain ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDomain ? 'Copied!' : 'Copy Domain'}</span>
                    </button>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-normal text-[10px]">
                    <strong>To enable Google Sign-In on this domain:</strong>
                    <br />
                    1. Go to <strong>Firebase Console</strong> → <strong>Authentication</strong> → <strong>Settings</strong>
                    <br />
                    2. Under <strong>Authorized domains</strong>, click <strong>Add domain</strong> and paste <code>{currentHostname || 'this domain'}</code>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Forgot Password Success Banner */}
          {forgotSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Password Reset Link Sent!</p>
                <p className="mt-0.5">Please check your inbox at {email} and follow the link to reset your password.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Your Name (Optional)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Miller"
                    className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setLocalError(null);
                        setForgotSuccess(false);
                      }}
                      className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-10 pl-9 pr-9 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signup' && 'Create Account & Sync'}
                    {mode === 'signin' && 'Sign In to My Account'}
                    {mode === 'forgot' && 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setForgotSuccess(false);
                setLocalError(null);
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 font-semibold cursor-pointer pt-2"
            >
              ← Back to Sign In
            </button>
          )}
        </div>

        {/* Footer info & explicit close button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Protected by Firebase Cloud Security.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-9 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel & Close Window</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
