import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StorageMode } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  storageMode: StorageMode;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setStorageMode: (mode: StorageMode) => void;
  isSupabaseAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageModeState] = useState<StorageMode>('local');
  const isSupabaseAvailable = isSupabaseConfigured();

  useEffect(() => {
    // Load storage mode preference
    const savedMode = localStorage.getItem('passo-storage-mode') as StorageMode;
    if (savedMode && (savedMode === 'local' || (savedMode === 'cloud' && isSupabaseAvailable))) {
      setStorageModeState(savedMode);
    }

    if (!isSupabaseAvailable) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isSupabaseAvailable]);

  const setStorageMode = (mode: StorageMode) => {
    setStorageModeState(mode);
    localStorage.setItem('passo-storage-mode', mode);
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Cloud storage is not configured' } };
    }
    return await supabase.auth.signUp({ email, password });
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Cloud storage is not configured' } };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (!isSupabaseAvailable) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      storageMode,
      signUp,
      signIn,
      signOut,
      setStorageMode,
      isSupabaseAvailable
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}