import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ShopItem } from '../../types';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: ShopItem | null;
  onSave: (item: Partial<ShopItem> & { name: string; price: number }) => void;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Food');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setPrice(String(itemToEdit.price));
      setCategory(itemToEdit.category || 'Food');
      setIsActive(itemToEdit.isActive !== false);
    } else {
      setName('');
      setPrice('');
      setCategory('Food');
      setIsActive(true);
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) return;

    onSave({
      ...(itemToEdit ? { id: itemToEdit.id } : {}),
      name: name.trim(),
      price: numPrice,
      category,
      isActive,
    });
    onClose();
  };

  const categories = ['Food', 'Beverages', 'Sweets', 'Snacks', 'Specials'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Edit Shop Item' : 'Add New Item'}
      subtitle="Items appear on the cashier billing screen"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Item Name:
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kithul Hakuru Sweet, Egg Sandwich"
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Selling Price (Rs):
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="itemActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-slate-300"
          />
          <label
            htmlFor="itemActive"
            className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Item is Active and visible on Cashier POS
          </label>
        </div>

        <div className="flex gap-2 pt-4">
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
            {itemToEdit ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
