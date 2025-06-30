import React from 'react';
import { Shield, Moon, Sun, Plus, User, LogOut, Settings, Cloud, HardDrive } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { state, dispatch } = useApp();
  const { user, signOut, storageMode, isSupabaseAvailable } = useAuth();

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  const openModal = () => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
    dispatch({ type: 'SET_EDITING_PASSWORD', payload: null });
  };

  const openAuthModal = () => {
    dispatch({ type: 'SET_AUTH_MODAL_OPEN', payload: true });
  };

  const openStorageModeModal = () => {
    dispatch({ type: 'SET_STORAGE_MODE_MODAL_OPEN', payload: true });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Passo
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your Passwords. Secured, Simplified.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Password
            </button>

            <button
              onClick={openStorageModeModal}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              title={`Current: ${storageMode === 'cloud' ? 'Cloud' : 'Local'} Storage`}
            >
              {storageMode === 'cloud' ? (
                <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <HardDrive className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {state.theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </button>

            {isSupabaseAvailable && (
              <div className="flex items-center space-x-2">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}