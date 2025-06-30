import { useApp } from '../context/AppContext';
import { Toast } from '../types';

export function useToast() {
  const { dispatch } = useApp();

  const showToast = (message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    dispatch({ type: 'ADD_TOAST', payload: toast });
    
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, duration);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return { showToast, removeToast };
}