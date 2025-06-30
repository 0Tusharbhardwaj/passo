import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PasswordEntry, Toast, Theme } from '../types';
import { encryptData, decryptData } from '../utils/encryption';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface AppState {
  passwords: PasswordEntry[];
  toasts: Toast[];
  theme: Theme;
  searchQuery: string;
  isModalOpen: boolean;
  editingPassword: PasswordEntry | null;
  isAuthModalOpen: boolean;
  isStorageModeModalOpen: boolean;
}

type AppAction =
  | { type: 'SET_PASSWORDS'; payload: PasswordEntry[] }
  | { type: 'ADD_PASSWORD'; payload: PasswordEntry }
  | { type: 'UPDATE_PASSWORD'; payload: PasswordEntry }
  | { type: 'DELETE_PASSWORD'; payload: string }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_EDITING_PASSWORD'; payload: PasswordEntry | null }
  | { type: 'SET_AUTH_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_STORAGE_MODE_MODAL_OPEN'; payload: boolean };

const initialState: AppState = {
  passwords: [],
  toasts: [],
  theme: 'light',
  searchQuery: '',
  isModalOpen: false,
  editingPassword: null,
  isAuthModalOpen: false,
  isStorageModeModalOpen: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PASSWORDS':
      return { ...state, passwords: action.payload };
    case 'ADD_PASSWORD':
      return { ...state, passwords: [...state.passwords, action.payload] };
    case 'UPDATE_PASSWORD':
      return {
        ...state,
        passwords: state.passwords.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PASSWORD':
      return {
        ...state,
        passwords: state.passwords.filter(p => p.id !== action.payload),
      };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_EDITING_PASSWORD':
      return { ...state, editingPassword: action.payload };
    case 'SET_AUTH_MODAL_OPEN':
      return { ...state, isAuthModalOpen: action.payload };
    case 'SET_STORAGE_MODE_MODAL_OPEN':
      return { ...state, isStorageModeModalOpen: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, storageMode, isSupabaseAvailable } = useAuth();

  // Load passwords from storage
  useEffect(() => {
    const loadPasswords = async () => {
      if (storageMode === 'cloud' && user && isSupabaseAvailable) {
        try {
          const { data, error } = await supabase
            .from('passwords')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const passwords = data.map(item => ({
            id: item.id,
            website: item.website,
            email: item.email,
            password: decryptData(item.encrypted_password),
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
            userId: item.user_id
          }));

          dispatch({ type: 'SET_PASSWORDS', payload: passwords });
        } catch (error) {
          console.error('Failed to load passwords from cloud:', error);
        }
      } else {
        // Load from localStorage
        const stored = localStorage.getItem('passo-passwords');
        if (stored) {
          try {
            const encrypted = JSON.parse(stored);
            const decrypted = decryptData(encrypted);
            dispatch({ type: 'SET_PASSWORDS', payload: decrypted });
          } catch (error) {
            console.error('Failed to load passwords from local storage:', error);
          }
        }
      }
    };

    loadPasswords();
  }, [user, storageMode, isSupabaseAvailable]);

  // Load theme preference
  useEffect(() => {
    const stored = localStorage.getItem('passo-theme');
    if (stored) {
      dispatch({ type: 'SET_THEME', payload: stored as Theme });
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch({ type: 'SET_THEME', payload: 'dark' });
    }
  }, []);

  // Save passwords to storage
  useEffect(() => {
    const savePasswords = async () => {
      if (state.passwords.length === 0) return;

      if (storageMode === 'cloud' && user && isSupabaseAvailable) {
        // Save to Supabase - this would typically be handled by individual CRUD operations
        // For now, we'll keep the local storage as backup
        try {
          const encrypted = encryptData(state.passwords);
          localStorage.setItem('passo-passwords-backup', JSON.stringify(encrypted));
        } catch (error) {
          console.error('Failed to save backup:', error);
        }
      } else {
        // Save to localStorage
        try {
          const encrypted = encryptData(state.passwords);
          localStorage.setItem('passo-passwords', JSON.stringify(encrypted));
        } catch (error) {
          console.error('Failed to save passwords:', error);
        }
      }
    };

    savePasswords();
  }, [state.passwords, storageMode, user, isSupabaseAvailable]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('passo-theme', state.theme);
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}