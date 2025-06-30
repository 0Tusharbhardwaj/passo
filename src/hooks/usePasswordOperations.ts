import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './useToast';
import { PasswordEntry } from '../types';
import { supabase } from '../lib/supabase';
import { encryptData } from '../utils/encryption';

export function usePasswordOperations() {
  const { dispatch } = useApp();
  const { user, storageMode, isSupabaseAvailable } = useAuth();
  const { showToast } = useToast();

  const addPassword = async (passwordData: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newPassword: PasswordEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...passwordData,
      createdAt: now,
      updatedAt: now,
      userId: user?.id,
    };

    if (storageMode === 'cloud' && user && isSupabaseAvailable) {
      try {
        const { error } = await supabase
          .from('passwords')
          .insert({
            id: newPassword.id,
            user_id: user.id,
            website: newPassword.website,
            email: newPassword.email,
            encrypted_password: encryptData(newPassword.password),
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          });

        if (error) throw error;
      } catch (error) {
        showToast('Failed to save password to cloud', 'error');
        return;
      }
    }

    dispatch({ type: 'ADD_PASSWORD', payload: newPassword });
    showToast('Password added successfully!', 'success');
  };

  const updatePassword = async (updatedPassword: PasswordEntry) => {
    const now = new Date();
    const passwordWithUpdatedTime = { ...updatedPassword, updatedAt: now };

    if (storageMode === 'cloud' && user && isSupabaseAvailable) {
      try {
        const { error } = await supabase
          .from('passwords')
          .update({
            website: updatedPassword.website,
            email: updatedPassword.email,
            encrypted_password: encryptData(updatedPassword.password),
            updated_at: now.toISOString(),
          })
          .eq('id', updatedPassword.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        showToast('Failed to update password in cloud', 'error');
        return;
      }
    }

    dispatch({ type: 'UPDATE_PASSWORD', payload: passwordWithUpdatedTime });
    showToast('Password updated successfully!', 'success');
  };

  const deletePassword = async (passwordId: string) => {
    if (storageMode === 'cloud' && user && isSupabaseAvailable) {
      try {
        const { error } = await supabase
          .from('passwords')
          .delete()
          .eq('id', passwordId)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        showToast('Failed to delete password from cloud', 'error');
        return;
      }
    }

    dispatch({ type: 'DELETE_PASSWORD', payload: passwordId });
    showToast('Password deleted successfully', 'success');
  };

  return { addPassword, updatePassword, deletePassword };
}