import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PartnerName } from '../../types';
import { getTodayColomboDate } from '../../utils/formatters';

interface InvestmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (investment: { partner: PartnerName; date: string; amount: number; note: string }) => void;
}

export const InvestmentFormModal: React.FC<InvestmentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [partner, setPartner] = useState<PartnerName>('Sandeep');
  const [date, setDate] = useState(getTodayColomboDate());
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const partners: PartnerName[] = ['Sandeep', 'Fab', 'Madhawa'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) return;

    onSave({
      partner,
      date,
      amount: numAmt,
      note: note.trim() || 'Initial Capital Contribution',
    });
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Capital Investment (මූලික ආයෝජන)"
      subtitle="Initial funds put into Lighting Tree to start the business. Credited to partner's account balance."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Partner Investing Capital:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {partners.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPartner(p)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                  partner === p
                    ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

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
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
              placeholder="e.g. 50000"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Note / Investment Purpose:
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Initial shop setup, renovation, refrigerator, etc."
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
          💡 <strong>How it works:</strong> Capital investments are tracked separately from daily food
          expenses. This money will be credited directly to <strong>{partner}</strong>'s capital balance in reports and settlement sheets.
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all"
          >
            Save Investment
          </button>
        </div>
      </form>
    </Modal>
  );
};
