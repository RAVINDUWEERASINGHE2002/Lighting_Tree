import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { BillItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PriceOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BillItem | null;
  onConfirm: (newPrice: number) => void;
}

export const PriceOverrideModal: React.FC<PriceOverrideModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirm,
}) => {
  const [priceInput, setPriceInput] = useState<string>('');

  useEffect(() => {
    if (item) {
      setPriceInput(String(item.unitPrice));
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(priceInput);
    if (!isNaN(val) && val >= 0) {
      onConfirm(val);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Override Line Price"
      subtitle={`Bill item: ${item.name}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <span>Standard Menu Price:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(item.originalPrice)}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            New Unit Price (Rs) for this bill only:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="0"
              step="any"
              autoFocus
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-bold text-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="Enter new price"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
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
            Apply Override
          </button>
        </div>
      </form>
    </Modal>
  );
};
