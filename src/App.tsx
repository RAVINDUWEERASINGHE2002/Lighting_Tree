import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { TabNavigation, NavTab } from './components/layout/TabNavigation';
import { ToastContainer } from './components/common/Toast';
import { LoginPage } from './pages/LoginPage';
import { BillingPage } from './pages/BillingPage';
import { ItemsPage } from './pages/ItemsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AdvancesPage } from './pages/AdvancesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const MainContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('billing');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading Lighting Tree POS...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'billing' && <BillingPage />}
        {activeTab === 'items' && <ItemsPage />}
        {activeTab === 'expenses' && <ExpensesPage />}
        {activeTab === 'advances' && <AdvancesPage />}
        {activeTab === 'reports' && <ReportsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}
