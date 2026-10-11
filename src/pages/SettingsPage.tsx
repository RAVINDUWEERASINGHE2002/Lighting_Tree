import React from 'react';
import { SettingsForm } from '../components/settings/SettingsForm';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 no-print">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          POS Settings & Financial Parameters
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure shop name, bill address, phone, monthly rent, daily utilities, and partner split
          percentages.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
};
