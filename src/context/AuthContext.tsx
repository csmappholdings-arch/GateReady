import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle as fbSignInWithGoogle, 
  signInWithGithub as fbSignInWithGithub,
  signUpWithEmail as fbSignUpWithEmail,
  signInWithEmail as fbSignInWithEmail,
  resetPassword as fbResetPassword,
  signOutUser 
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      console.error('Auth state error:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = (err: any, providerName: string) => {
    console.error(`${providerName} sign-in failed:`, err);
    if (err.code === 'auth/popup-closed-by-user') {
      return;
    }
    if (err.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your Cloudflare domain';
      setError(`Domain Not Authorized: "${currentHost}" is not listed in your Firebase Authorized Domains. To fix: Open Firebase Console → Authentication → Settings → Authorized Domains → Add "${currentHost}".`);
      return;
    }
    if (err.code === 'auth/operation-not-allowed') {
      setError(`${providerName} is not enabled in Firebase. Go to Firebase Console → Authentication → Sign-in method and enable ${providerName}.`);
      return;
    }
    setError(err.message || `Failed to sign in with ${providerName}`);
  };

  const signIn = async () => {
    setError(null);
    try {
      await fbSignInWithGoogle();
    } catch (err: any) {
      handleAuthError(err, 'Google');
      throw err;
    }
  };

  const signInWithGithub = async () => {
    setError(null);
    try {
      await fbSignInWithGithub();
    } catch (err: any) {
      handleAuthError(err, 'GitHub');
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    setError(null);
    try {
      await fbSignUpWithEmail(email, pass, name);
    } catch (err: any) {
      console.error('Email sign-up failed:', err);
      let msg = err.message || 'Failed to create account';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await fbSignInWithEmail(email, pass);
    } catch (err: any) {
      console.error('Email sign-in failed:', err);
      let msg = err.message || 'Failed to sign in';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password. Please verify your credentials.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please reset your password or try again later.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await fbResetPassword(email);
    } catch (err: any) {
      console.error('Password reset failed:', err);
      let msg = err.message || 'Failed to send password reset email';
      if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await signOutUser();
    } catch (err: any) {
      console.error('Sign-out failed:', err);
      setError(err.message || 'Failed to sign out');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signInWithGithub,
      signUpWithEmail, 
      signInWithEmail, 
      resetPassword, 
      signOut, 
      error, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
