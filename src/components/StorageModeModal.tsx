import React from 'react';
import { X, HardDrive, Cloud, Shield, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function StorageModeModal() {
  const { state, dispatch } = useApp();
  const { storageMode, setStorageMode, isSupabaseAvailable } = useAuth();

  const handleClose = () => {
    dispatch({ type: 'SET_STORAGE_MODE_MODAL_OPEN', payload: false });
  };

  const handleModeSelect = (mode: 'local' | 'cloud') => {
    if (mode === 'cloud' && !isSupabaseAvailable) {
      return;
    }
    
    if (mode === 'cloud') {
      dispatch({ type: 'SET_AUTH_MODAL_OPEN', payload: true });
    }
    
    setStorageMode(mode);
    handleClose();
  };

  if (!state.isStorageModeModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose Storage Mode
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div
              onClick={() => handleModeSelect('local')}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                storageMode === 'local'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <HardDrive className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Local Storage
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Store passwords locally in your browser. No account required.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Private</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Smartphone className="h-3 w-3" />
                      <span>Device Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => handleModeSelect('cloud')}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                storageMode === 'cloud'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${
                !isSupabaseAvailable ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cloud Storage
                    {!isSupabaseAvailable && (
                      <span className="ml-2 text-xs text-red-500">(Not Available)</span>
                    )}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Sync passwords across all your devices. Requires account.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Cloud className="h-3 w-3" />
                      <span>Synced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> You can change your storage mode anytime in settings. 
              Cloud storage requires setting up Supabase configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}