import React, { useState } from 'react';
import { AdvanceList } from '../components/advances/AdvanceList';
import { AdvanceFormModal } from '../components/advances/AdvanceFormModal';
import { useApp } from '../context/AppContext';

export const AdvancesPage: React.FC = () => {
  const { advances, addAdvance, deleteAdvance } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Partner Advances
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Record cash advances taken by Sandeep, Fab, or Madhawa. Amounts are deducted directly
            from their final balance.
          </p>
        </div>
      </div>

      <AdvanceList
        advances={advances}
        onAddNew={() => setModalOpen(true)}
        onDelete={deleteAdvance}
      />

      <AdvanceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addAdvance}
      />
    </div>
  );
};
