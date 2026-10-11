import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PartnerName } from '../../types';
import { getTodayColomboDate } from '../../utils/formatters';

interface AdvanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (advance: { partner: PartnerName; date: string; amount: number; note: string }) => void;
}

export const AdvanceFormModal: React.FC<AdvanceFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const [partner, setPartner] = useState<PartnerName>('Madhawa');
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
      note: note.trim() || 'Partner Advance',
    });
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Partner Advance"
      subtitle="Advances are deducted from that partner's balance"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Partner taking advance:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {partners.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPartner(p)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                  partner === p
                    ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
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
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Advance Amount (Rs):
            </label>
            <input
              type="number"
              required
              min="1"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Note / Reason:
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Personal emergency advance, Travel allowance"
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
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
            Record Advance
          </button>
        </div>
      </form>
    </Modal>
  );
};
