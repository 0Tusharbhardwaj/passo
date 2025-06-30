import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PasswordModal } from './components/PasswordModal';
import { AuthModal } from './components/AuthModal';
import { StorageModeModal } from './components/StorageModeModal';
import { ToastContainer } from './components/ToastContainer';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
          <Header />
          <Dashboard />
          <PasswordModal />
          <AuthModal />
          <StorageModeModal />
          <ToastContainer />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;