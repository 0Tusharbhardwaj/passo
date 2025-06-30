import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Edit, Trash2, Globe, Mail } from 'lucide-react';
import { PasswordEntry } from '../types';
import { useApp } from '../context/AppContext';
import { usePasswordOperations } from '../hooks/usePasswordOperations';
import { useToast } from '../hooks/useToast';
import { copyToClipboard } from '../utils/clipboard';

interface PasswordCardProps {
  password: PasswordEntry;
}

export function PasswordCard({ password }: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useApp();
  const { deletePassword } = usePasswordOperations();
  const { showToast } = useToast();

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast(`${field} copied to clipboard!`, 'success');
    } else {
      showToast(`Failed to copy ${field.toLowerCase()}`, 'error');
    }
  };

  const handleEdit = () => {
    dispatch({ type: 'SET_EDITING_PASSWORD', payload: password });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      await deletePassword(password.id);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {password.website}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Added {new Date(password.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {password.email}
            </span>
          </div>
          <button
            onClick={() => handleCopy(password.email, 'Email')}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate">
              {showPassword ? password.password : '••••••••••••'}
            </span>
          </div>
          <button
            onClick={() => handleCopy(password.password, 'Password')}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}