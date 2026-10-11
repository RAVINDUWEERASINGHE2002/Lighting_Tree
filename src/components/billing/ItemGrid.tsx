import React, { useState, useMemo } from 'react';
import { Search, Plus, Coffee, Utensils, Sparkles, Cookie } from 'lucide-react';
import { ShopItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ItemGridProps {
  items: ShopItem[];
  onSelectItem: (item: ShopItem) => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({ items, onSelectItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set<string>(['All']);
    items.forEach((i) => {
      if (i.category) cats.add(i.category);
    });
    return Array.from(cats);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!item.isActive) return false;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.price).includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'beverages':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'food':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'sweets':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Cookie className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Search & Categories Bar */}
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name or price (e.g. kithul, sandwich)..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder-slate-400 shadow-sm transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat !== 'All' && getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Item Buttons */}
      <div className="flex-1 overflow-y-auto pr-0.5">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-48">
            <Cookie className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">No items found</p>
            <p className="text-xs mt-1">Try another search or add items in Item Management.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group relative flex flex-col justify-between p-3 sm:p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md hover:shadow-brand-950/10 transition-all text-left active:scale-[0.98] select-none h-[105px] sm:h-[115px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {item.category || 'Item'}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                  <span className="text-sm sm:text-base font-bold text-brand-700 dark:text-brand-400">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
