import React, { useState } from 'react';
import { Printer, Trash2, Clock, Calendar, Search } from 'lucide-react';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Bill } from '../../types';
import { formatCurrency, formatDateColombo } from '../../utils/formatters';

interface BillsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: Bill[];
  onReprintBill: (bill: Bill) => void;
  onDeleteBill: (billId: string) => void;
}

export const BillsHistoryModal: React.FC<BillsHistoryModalProps> = ({
  isOpen,
  onClose,
  bills,
  onReprintBill,
  onDeleteBill,
}) => {
  const [selectedBillToDelete, setSelectedBillToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredBills = bills.filter(
    (b) =>
      b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase())) ||
      String(b.grandTotal).includes(search)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Today's Sales Bills"
      subtitle={`Total ${bills.length} bills generated today`}
      maxWidth="lg"
    >
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by bill number, item or amount..."
            className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Bills list */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {filteredBills.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No bills found for today.</div>
          ) : (
            filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono">
                      {bill.billNumber}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                      {bill.paymentMethod}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {bill.time}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {bill.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-sm sm:text-base text-brand-700 dark:text-gold-400 font-mono">
                    {formatCurrency(bill.grandTotal)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onReprintBill(bill)}
                      className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-brand-600 hover:border-brand-500 transition-colors"
                      title="Reprint Thermal Receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedBillToDelete(bill.id)}
                      className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-red-500 hover:border-red-500 transition-colors"
                      title="Delete bill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(selectedBillToDelete)}
        onClose={() => setSelectedBillToDelete(null)}
        onConfirm={() => {
          if (selectedBillToDelete) onDeleteBill(selectedBillToDelete);
        }}
        title="Delete Bill?"
        message="Are you sure you want to delete this bill? This will remove the sale from today's totals."
        confirmLabel="Delete Sale"
      />
    </Modal>
  );
};
