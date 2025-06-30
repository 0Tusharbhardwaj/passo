import React, { useMemo } from 'react';
import { Key, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PasswordCard } from './PasswordCard';
import { SearchBar } from './SearchBar';
import { PasswordGenerator } from './PasswordGenerator';

export function Dashboard() {
  const { state, dispatch } = useApp();

  const filteredPasswords = useMemo(() => {
    if (!state.searchQuery) return state.passwords;
    
    const query = state.searchQuery.toLowerCase();
    return state.passwords.filter(
      (password) =>
        password.website.toLowerCase().includes(query) ||
        password.email.toLowerCase().includes(query)
    );
  }, [state.passwords, state.searchQuery]);

  const openModal = () => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
    dispatch({ type: 'SET_EDITING_PASSWORD', payload: null });
  };

  if (state.passwords.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mb-6">
            <Key className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Passo
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Your secure password manager. Start by adding your first password to get organized and stay secure.
          </p>
          <button
            onClick={openModal}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Password
          </button>
        </div>

        <div className="mt-16">
          <PasswordGenerator />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Passwords
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredPasswords.length} of {state.passwords.length} passwords
              {state.searchQuery && (
                <span> matching "{state.searchQuery}"</span>
              )}
            </p>
          </div>

          {filteredPasswords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No passwords found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPasswords.map((password) => (
                <PasswordCard key={password.id} password={password} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <PasswordGenerator />
          </div>
        </div>
      </div>
    </div>
  );
}