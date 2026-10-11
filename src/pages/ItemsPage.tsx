import React, { useState } from 'react';
import { ItemList } from '../components/items/ItemList';
import { ItemFormModal } from '../components/items/ItemFormModal';
import { useApp } from '../context/AppContext';
import { ShopItem } from '../types';

export const ItemsPage: React.FC = () => {
  const { items, saveItem, updateItemPrice, toggleItemStatus, deleteItem } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ShopItem | null>(null);

  const handleAddNew = () => {
    setItemToEdit(null);
    setModalOpen(true);
  };

  const handleEdit = (item: ShopItem) => {
    setItemToEdit(item);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Item & Menu Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Add items, update prices quickly in-line, toggle availability, or manage categories.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
          Total: {items.length} items ({items.filter((i) => i.isActive).length} active)
        </div>
      </div>

      <ItemList
        items={items}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onUpdatePrice={updateItemPrice}
        onToggleStatus={toggleItemStatus}
        onDelete={deleteItem}
      />

      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemToEdit={itemToEdit}
        onSave={saveItem}
      />
    </div>
  );
};
