import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  getSupabase,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  sendPasswordResetEmail,
  getCurrentSession,
} from '../lib/supabase';

export interface UserProfile {
  full_name?: string;
  phone?: string;
  email?: string;
}

export type AuthMode = 'login' | 'signup' | 'reset';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    metadata?: { full_name?: string; phone?: string }
  ) => Promise<{ success: boolean; needsEmailConfirmation?: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  const extractProfile = (u: User | null): UserProfile | null => {
    if (!u) return null;
    const metadata = u.user_metadata || {};
    return {
      full_name: metadata.full_name || u.email?.split('@')[0] || 'Valued Client',
      phone: metadata.phone || '',
      email: u.email || '',
    };
  };

  useEffect(() => {
    const client = getSupabase();

    // 1. Initial session check
    const initSession = async () => {
      try {
        const s = await getCurrentSession();
        setSession(s);
        const currentUser = s?.user || null;
        setUser(currentUser);
        setProfile(extractProfile(currentUser));
      } catch (e) {
        console.warn('[AuthContext] Session check warning:', e);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. Subscribe to auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = client.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        const currentUser = newSession?.user || null;
        setUser(currentUser);
        setProfile(extractProfile(currentUser));
      });
      subscription = data.subscription;
    } catch (e) {
      console.warn('[AuthContext] Auth subscription warning:', e);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await signInWithEmail(email, password);
    if (error) {
      return { success: false, error: error.message || 'Invalid credentials' };
    }
    if (data?.user) {
      setUser(data.user);
      setSession(data.session);
      setProfile(extractProfile(data.user));
      closeAuthModal();
      return { success: true };
    }
    return { success: false, error: 'Login failed. Please try again.' };
  };

  const signup = async (
    email: string,
    password: string,
    metadata?: { full_name?: string; phone?: string }
  ): Promise<{ success: boolean; needsEmailConfirmation?: boolean; error?: string }> => {
    const { data, error } = await signUpWithEmail(email, password, metadata);
    if (error) {
      return { success: false, error: error.message || 'Failed to create account' };
    }

    // Check if email confirmation is required (Supabase returns a user but session may be null if confirmation is on)
    if (data?.user && !data.session) {
      return { success: true, needsEmailConfirmation: true };
    }

    if (data?.user && data.session) {
      setUser(data.user);
      setSession(data.session);
      setProfile(extractProfile(data.user));
      closeAuthModal();
      return { success: true, needsEmailConfirmation: false };
    }

    return { success: true };
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await sendPasswordResetEmail(email);
    if (error) {
      return { success: false, error: error.message || 'Failed to send reset email' };
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
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
