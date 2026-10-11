import React from 'react';
import { ShoppingCart, Utensils, ReceiptText, Banknote, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTab = 'billing' | 'items' | 'expenses' | 'advances' | 'reports' | 'settings';

interface TabNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const { activeBillItems } = useApp();

  const tabs: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'billing',
      label: 'Billing',
      icon: ShoppingCart,
      badge: activeBillItems.reduce((sum, item) => sum + item.quantity, 0),
    },
    {
      id: 'items',
      label: 'Items',
      icon: Utensils,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: ReceiptText,
    },
    {
      id: 'advances',
      label: 'Advances',
      icon: Banknote,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-sm border border-brand-200 dark:border-brand-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}
                />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-gold-500 text-slate-950 animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
