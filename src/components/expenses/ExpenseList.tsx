import React, { useState } from 'react';
import { Plus, Search, Trash2, Calendar, UserCheck, Building } from 'lucide-react';
import { Expense, ExpensePayer } from '../../types';
import { formatCurrency, formatDateColombo } from '../../utils/formatters';
import { ConfirmModal } from '../common/ConfirmModal';

interface ExpenseListProps {
  expenses: Expense[];
  onAddNew: () => void;
  onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onAddNew, onDelete }) => {
  const [search, setSearch] = useState('');
  const [payerFilter, setPayerFilter] = useState<string>('All');
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const payers: ('All' | ExpensePayer)[] = ['All', 'Business', 'Sandeep', 'Fab', 'Madhawa'];

  const filtered = expenses.filter((e) => {
    const matchesPayer = payerFilter === 'All' || e.paidBy === payerFilter;
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      String(e.amount).includes(search) ||
      (e.category && e.category.toLowerCase().includes(search.toLowerCase()));
    return matchesPayer && matchesSearch;
  });

  const totalFilteredAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      {/* Top Filter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {payers.map((p) => (
              <button
                key={p}
                onClick={() => setPayerFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  payerFilter === p
                    ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="flex items-center justify-between p-3 bg-brand-50/60 dark:bg-brand-950/40 rounded-xl border border-brand-200/60 dark:border-brand-900/60 text-xs">
        <span className="text-slate-600 dark:text-slate-400">
          Showing <strong>{filtered.length}</strong> expenses
          {payerFilter !== 'All' ? ` paid by ${payerFilter}` : ''}
        </span>
        <span className="font-bold text-sm text-brand-800 dark:text-gold-400 font-mono">
          Total: {formatCurrency(totalFilteredAmount)}
        </span>
      </div>

      {/* Expense Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4 text-right">Amount (Rs)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                      {formatDateColombo(item.date)}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {item.category || 'General'}
                    </td>
                    <td className="py-3 px-4">
                      {item.paidBy === 'Business' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <Building className="w-3 h-3" />
                          Shop Cash
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-gold-500/20 text-gold-700 dark:text-gold-300 border border-gold-500/30">
                          <UserCheck className="w-3 h-3" />
                          {item.paidBy} (Reimbursable)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setExpenseToDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => {
          if (expenseToDelete) onDelete(expenseToDelete);
        }}
        title="Delete Expense?"
        message="Are you sure you want to delete this recorded expense?"
        confirmLabel="Delete Expense"
      />
    </div>
  );
};
