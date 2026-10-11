import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, Check } from 'lucide-react';
import { ShopItem } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';

interface ItemListProps {
  items: ShopItem[];
  onAddNew: () => void;
  onEdit: (item: ShopItem) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onAddNew,
  onEdit,
  onUpdatePrice,
  onToggleStatus,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Local state for inline price editing
  const [editingPriceMap, setEditingPriceMap] = useState<Record<string, string>>({});
  const [savedPriceId, setSavedPriceId] = useState<string | null>(null);

  const categories = ['All', 'Food', 'Beverages', 'Sweets', 'Snacks', 'Specials'];

  const filteredItems = items.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) || String(item.price).includes(search);
    return matchesCat && matchesSearch;
  });

  const handlePriceChange = (id: string, val: string) => {
    setEditingPriceMap((prev) => ({ ...prev, [id]: val }));
  };

  const handlePriceSave = (id: string, originalPrice: number) => {
    const rawVal = editingPriceMap[id];
    if (rawVal === undefined) return;
    const num = parseFloat(rawVal);
    if (!isNaN(num) && num >= 0 && num !== originalPrice) {
      onUpdatePrice(id, num);
      setSavedPriceId(id);
      setTimeout(() => setSavedPriceId(null), 1800);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items by name or price..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (Rs) — Quick Edit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                    No items found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const currentEditValue =
                    editingPriceMap[item.id] !== undefined
                      ? editingPriceMap[item.id]
                      : String(item.price);
                  const isSaved = savedPriceId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        !item.isActive ? 'opacity-60 bg-slate-50/30 dark:bg-slate-900/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">
                        {item.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {/* Quick Direct In-List Price Input */}
                        <div className="flex items-center gap-1.5 max-w-[140px]">
                          <span className="text-xs text-slate-400 font-mono">Rs</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={currentEditValue}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            onBlur={() => handlePriceSave(item.id, item.price)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLElement).blur();
                              }
                            }}
                            className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-brand-700 dark:text-gold-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                            title="Click to edit price directly, press Enter or click away to save"
                          />
                          {isSaved && (
                            <span
                              className="text-emerald-500 text-xs flex items-center"
                              title="Price updated!"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleStatus(item.id, !item.isActive)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            item.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                          title={
                            item.isActive
                              ? 'Active on POS - Click to hide'
                              : 'Hidden - Click to show'
                          }
                        >
                          {item.isActive ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          <span>{item.isActive ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit full item details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) onDelete(itemToDelete);
        }}
        title="Delete Shop Item?"
        message="Are you sure you want to permanently delete this item from your POS menu?"
        confirmLabel="Delete Item"
      />
    </div>
  );
};
