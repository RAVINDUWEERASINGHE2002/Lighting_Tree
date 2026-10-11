import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  Printer,
  ShoppingBag,
  CreditCard,
  Banknote,
  Landmark,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BillItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { PriceOverrideModal } from './PriceOverrideModal';
import { ConfirmModal } from '../common/ConfirmModal';

interface ActiveBillProps {
  onSaveAndPrint: (paymentMethod: 'cash' | 'card' | 'transfer', notes?: string) => void;
  onOpenHistory: () => void;
  saving?: boolean;
}

export const ActiveBill: React.FC<ActiveBillProps> = ({
  onSaveAndPrint,
  onOpenHistory,
  saving = false,
}) => {
  const {
    activeBillItems,
    updateBillItemQty,
    overrideBillItemPrice,
    removeBillItem,
    clearActiveBill,
    todayBills,
  } = useApp();

  const [overrideItem, setOverrideItem] = useState<BillItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [notes, setNotes] = useState('');

  const grandTotal = activeBillItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItemCount = activeBillItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            Current Bill
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300">
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:underline px-2 py-1 rounded"
          >
            Today's Bills ({todayBills.length})
          </button>
          {activeBillItems.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-2 py-1 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bill Line Items Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 dark:divide-slate-800/80">
        {activeBillItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-500 py-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-2">
              <ShoppingBag className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Bill is empty
            </p>
            <p className="text-xs mt-1 max-w-[220px]">
              Tap items on the left to add them to this order.
            </p>
          </div>
        ) : (
          activeBillItems.map((item) => (
            <div
              key={item.itemId}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
            >
              {/* Item Info & Price Override */}
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                  {item.name}
                </h5>
                <div className="flex items-center gap-2 mt-0.5">
                  <button
                    onClick={() => setOverrideItem(item)}
                    className="group inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded transition-colors"
                    title="Tap to override price for this bill"
                  >
                    <span>@{formatCurrency(item.unitPrice)}</span>
                    <Tag className="w-2.5 h-2.5 group-hover:text-brand-600" />
                  </button>
                  {item.originalPrice !== item.unitPrice && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      (Override)
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => updateBillItemQty(item.itemId, -1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shadow-xs active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateBillItemQty(item.itemId, 1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shadow-xs active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Line Total & Remove */}
              <div className="text-right shrink-0 min-w-[70px]">
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {formatCurrency(item.lineTotal)}
                </div>
                <button
                  onClick={() => removeBillItem(item.itemId)}
                  className="text-[11px] text-slate-400 hover:text-red-500 transition-colors inline-block mt-0.5"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer & Checkout Area */}
      <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {/* Payment Method Selector */}
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { id: 'cash', label: 'Cash', icon: Banknote },
              { id: 'card', label: 'Card', icon: CreditCard },
              { id: 'transfer', label: 'Transfer', icon: Landmark },
            ] as const
          ).map((m) => {
            const Icon = m.icon;
            const isSelected = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grand Total Display */}
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Grand Total
            </span>
            <div className="text-[11px] text-slate-400">Sri Lankan Rupees</div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-700 dark:text-gold-400 font-mono tracking-tight">
            {formatCurrency(grandTotal)}
          </div>
        </div>

        {/* Save & Print Button */}
        <button
          disabled={activeBillItems.length === 0 || saving}
          onClick={() => onSaveAndPrint(paymentMethod, notes)}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-900/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 transition-all border border-brand-500/30"
        >
          <Printer className="w-5 h-5" />
          <span>{saving ? 'Processing...' : 'Save & Print Receipt'}</span>
        </button>
      </div>

      {/* Modals */}
      <PriceOverrideModal
        isOpen={Boolean(overrideItem)}
        item={overrideItem}
        onClose={() => setOverrideItem(null)}
        onConfirm={(newPrice) => {
          if (overrideItem) overrideBillItemPrice(overrideItem.itemId, newPrice);
        }}
      />

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearActiveBill}
        title="Clear Current Bill?"
        message="Are you sure you want to discard all items currently in this bill?"
        confirmLabel="Clear Bill"
      />
    </div>
  );
};
