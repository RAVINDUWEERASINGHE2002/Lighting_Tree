import React, { useState } from 'react';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { ExpenseFormModal } from '../components/expenses/ExpenseFormModal';
import { useApp } from '../context/AppContext';

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Expenses & Investments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track daily purchases. Anything paid out of partner personal funds is credited in profit
            settlement.
          </p>
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        onAddNew={() => setModalOpen(true)}
        onDelete={deleteExpense}
      />

      <ExpenseFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addExpense}
      />
    </div>
  );
};
