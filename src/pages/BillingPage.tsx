import React, { useState } from 'react';
import { ItemGrid } from '../components/billing/ItemGrid';
import { ActiveBill } from '../components/billing/ActiveBill';
import { ThermalReceipt } from '../components/billing/ThermalReceipt';
import { BillsHistoryModal } from '../components/billing/BillsHistoryModal';
import { Modal } from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { Bill } from '../types';

export const BillingPage: React.FC = () => {
  const { items, addItemToBill, saveAndPrintBill, todayBills, deleteBill, settings } = useApp();

  const [saving, setSaving] = useState(false);
  const [activeReceiptBill, setActiveReceiptBill] = useState<Bill | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleSaveAndPrint = async (
    paymentMethod: 'cash' | 'card' | 'transfer',
    notes?: string
  ) => {
    setSaving(true);
    try {
      const saved = await saveAndPrintBill(paymentMethod, notes);
      if (saved) {
        setActiveReceiptBill(saved);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReprint = (bill: Bill) => {
    setActiveReceiptBill(bill);
    setShowHistoryModal(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-128px)] p-2 sm:p-4 max-w-7xl mx-auto flex flex-col no-print">
      {/* POS Screen Split Layout: Left Menu Items (60%), Right Live Bill (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-full overflow-hidden">
        {/* Left: Item Selection Grid (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 h-full overflow-hidden flex flex-col">
          <ItemGrid items={items} onSelectItem={addItemToBill} />
        </div>

        {/* Right: Active Bill Builder (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 h-full overflow-hidden flex flex-col">
          <ActiveBill
            onSaveAndPrint={handleSaveAndPrint}
            onOpenHistory={() => setShowHistoryModal(true)}
            saving={saving}
          />
        </div>
      </div>

      {/* Thermal Receipt Preview Modal */}
      {activeReceiptBill && (
        <Modal
          isOpen={Boolean(activeReceiptBill)}
          onClose={() => setActiveReceiptBill(null)}
          title={`Thermal Receipt #${activeReceiptBill.billNumber}`}
          subtitle="Ready for 58mm / 80mm POS Thermal Receipt Printer"
          maxWidth="sm"
        >
          <ThermalReceipt
            bill={activeReceiptBill}
            settings={settings}
            onClose={() => setActiveReceiptBill(null)}
            autoPrint={true}
          />
        </Modal>
      )}

      {/* Today's Bills History Modal */}
      <BillsHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        bills={todayBills}
        onReprintBill={handleReprint}
        onDeleteBill={deleteBill}
      />
    </div>
  );
};
