import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ExpensePayer, PartnerName } from '../../types';
import { getTodayColomboDate } from '../../utils/formatters';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: {
    date: string;
    description: string;
    amount: number;
    paidBy: ExpensePayer;
    category?: string;
  }) => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState(getTodayColomboDate());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<ExpensePayer>('Business');
  const [category, setCategory] = useState('Ingredients');

  const payers: ExpensePayer[] = ['Business', 'Sandeep', 'Fab', 'Madhawa'];
  const categories = [
    'Ingredients',
    'Equipment',
    'Supplies',
    'Transport',
    'Utilities',
    'Maintenance',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!description.trim() || isNaN(numAmt) || numAmt <= 0) return;

    onSave({
      date,
      description: description.trim(),
      amount: numAmt,
      paidBy,
      category,
    });
    setDescription('');
    setAmount('');
    setPaidBy('Business');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Business Expense"
      subtitle="Track purchases and partner out-of-pocket investments"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date:
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (Rs):
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 456"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description:
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Fresh bread from bakery, Woodapple stock, Gas cylinder"
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Who Paid for this?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {payers.map((p) => {
              const isSelected = paidBy === p;
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPaidBy(p)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    isSelected
                      ? p === 'Business'
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm'
                        : 'bg-gold-500 text-slate-950 border-gold-600 shadow-sm font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>{p}</div>
                  <div className="text-[10px] opacity-75 font-normal">
                    {p === 'Business' ? 'Shop Cash' : 'Personal Pocket'}
                  </div>
                </button>
              );
            })}
          </div>
          {paidBy !== 'Business' && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 font-medium">
              Note: Rs {amount || '0'} will be credited back to {paidBy} in partner settlement.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors text-sm shadow-md shadow-brand-600/20"
          >
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};
