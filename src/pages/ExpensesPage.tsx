import React, { useState } from 'react';
import { ShoppingBag, Coins } from 'lucide-react';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { ExpenseFormModal } from '../components/expenses/ExpenseFormModal';
import { InvestmentList } from '../components/investments/InvestmentList';
import { InvestmentFormModal } from '../components/investments/InvestmentFormModal';
import { useApp } from '../context/AppContext';

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, deleteExpense, investments, addInvestment, deleteInvestment } =
    useApp();
  const [activeTab, setActiveTab] = useState<'expenses' | 'investments'>('expenses');
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Expenses & Capital Investments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage daily operating purchases and initial capital contributions by Sandeep, Fab & Madhawa.
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'expenses'
                ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-gold-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Daily Expenses ({expenses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('investments')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'investments'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Capital Investments ({investments.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'expenses' ? (
        <>
          <ExpenseList
            expenses={expenses}
            onAddNew={() => setExpenseModalOpen(true)}
            onDelete={deleteExpense}
          />
          <ExpenseFormModal
            isOpen={expenseModalOpen}
            onClose={() => setExpenseModalOpen(false)}
            onSave={addExpense}
          />
        </>
      ) : (
        <>
          <InvestmentList
            investments={investments}
            onAddNew={() => setInvestmentModalOpen(true)}
            onDelete={deleteInvestment}
          />
          <InvestmentFormModal
            isOpen={investmentModalOpen}
            onClose={() => setInvestmentModalOpen(false)}
            onSave={addInvestment}
          />
        </>
      )}
    </div>
  );
};

