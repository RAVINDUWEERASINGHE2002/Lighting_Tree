import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  ShopItem,
  Bill,
  Expense,
  Advance,
  AppSettings,
  BillItem,
  PartnerName,
  ExpensePayer,
} from '../types';
import { dataService } from '../services/dataService';
import { DEFAULT_SETTINGS } from '../utils/calculations';
import {
  getTodayColomboDate,
  getCurrentColomboTime,
  generateBillNumber,
} from '../utils/formatters';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  items: ShopItem[];
  bills: Bill[];
  todayBills: Bill[];
  expenses: Expense[];
  advances: Advance[];
  settings: AppSettings;
  theme: 'light' | 'dark';
  toasts: ToastMessage[];
  loading: boolean;
  activeBillItems: BillItem[];
  selectedCategory: string;

  // Actions
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  setSelectedCategory: (cat: string) => void;

  // Bill Actions
  addItemToBill: (item: ShopItem) => void;
  updateBillItemQty: (itemId: string, delta: number) => void;
  overrideBillItemPrice: (itemId: string, newPrice: number) => void;
  removeBillItem: (itemId: string) => void;
  clearActiveBill: () => void;
  saveAndPrintBill: (
    paymentMethod?: 'cash' | 'card' | 'transfer',
    notes?: string
  ) => Promise<Bill | null>;
  deleteBill: (billId: string) => Promise<void>;

  // Item Actions
  saveItem: (item: Partial<ShopItem> & { name: string; price: number }) => Promise<void>;
  updateItemPrice: (itemId: string, price: number) => Promise<void>;
  toggleItemStatus: (itemId: string, isActive: boolean) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;

  // Expense Actions
  addExpense: (expense: {
    date: string;
    description: string;
    amount: number;
    paidBy: ExpensePayer;
    category?: string;
  }) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;

  // Advance Actions
  addAdvance: (advance: {
    partner: PartnerName;
    date: string;
    amount: number;
    note: string;
  }) => Promise<void>;
  deleteAdvance: (advanceId: string) => Promise<void>;

  // Settings Actions
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBillItems, setActiveBillItems] = useState<BillItem[]>([]);

  // Theme support
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('lt_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Real-time data subscriptions
  useEffect(() => {
    let countLoaded = 0;
    const checkDone = () => {
      countLoaded++;
      if (countLoaded >= 5) setLoading(false);
    };

    const unsubItems = dataService.subscribeItems((data) => {
      setItems(data);
      checkDone();
    });

    const unsubBills = dataService.subscribeBills((data) => {
      setBills(data);
      checkDone();
    });

    const unsubExpenses = dataService.subscribeExpenses((data) => {
      setExpenses(data);
      checkDone();
    });

    const unsubAdvances = dataService.subscribeAdvances((data) => {
      setAdvances(data);
      checkDone();
    });

    const unsubSettings = dataService.subscribeSettings((data) => {
      setSettings(data);
      checkDone();
    });

    return () => {
      unsubItems();
      unsubBills();
      unsubExpenses();
      unsubAdvances();
      unsubSettings();
    };
  }, []);

  const todayStr = getTodayColomboDate();
  const todayBills = useMemo(() => {
    return bills.filter((b) => b.date === todayStr);
  }, [bills, todayStr]);

  // Active Bill Management
  const addItemToBill = (item: ShopItem) => {
    setActiveBillItems((prev) => {
      const idx = prev.findIndex((i) => i.itemId === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        const existing = copy[idx];
        const newQty = existing.quantity + 1;
        copy[idx] = {
          ...existing,
          quantity: newQty,
          lineTotal: Math.round(newQty * existing.unitPrice * 100) / 100,
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            itemId: item.id,
            name: item.name,
            unitPrice: item.price,
            originalPrice: item.price,
            quantity: 1,
            lineTotal: item.price,
          },
        ];
      }
    });
  };

  const updateBillItemQty = (itemId: string, delta: number) => {
    setActiveBillItems((prev) => {
      return prev
        .map((line) => {
          if (line.itemId === itemId) {
            const newQty = line.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...line,
              quantity: newQty,
              lineTotal: Math.round(newQty * line.unitPrice * 100) / 100,
            };
          }
          return line;
        })
        .filter(Boolean) as BillItem[];
    });
  };

  const overrideBillItemPrice = (itemId: string, newPrice: number) => {
    const validPrice = Math.max(0, Number(newPrice) || 0);
    setActiveBillItems((prev) => {
      return prev.map((line) => {
        if (line.itemId === itemId) {
          return {
            ...line,
            unitPrice: validPrice,
            lineTotal: Math.round(line.quantity * validPrice * 100) / 100,
          };
        }
        return line;
      });
    });
    showToast(`Price updated to Rs ${validPrice}`, 'info');
  };

  const removeBillItem = (itemId: string) => {
    setActiveBillItems((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const clearActiveBill = () => {
    setActiveBillItems([]);
  };

  const saveAndPrintBill = async (
    paymentMethod: 'cash' | 'card' | 'transfer' = 'cash',
    notes = ''
  ): Promise<Bill | null> => {
    if (activeBillItems.length === 0) {
      showToast('Cannot save an empty bill', 'error');
      return null;
    }

    const subtotal = activeBillItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const billNumber = generateBillNumber(todayBills.length);
    const date = getTodayColomboDate();
    const time = getCurrentColomboTime();

    const newBillData: Omit<Bill, 'id'> = {
      billNumber,
      date,
      time,
      items: [...activeBillItems],
      subtotal,
      discount: 0,
      grandTotal: subtotal,
      cashier: 'Madhawa',
      paymentMethod,
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = await dataService.saveBill(newBillData);
      setActiveBillItems([]);
      showToast(`Bill #${billNumber} saved successfully!`, 'success');
      return saved;
    } catch (err: any) {
      showToast(`Failed to save bill: ${err.message}`, 'error');
      return null;
    }
  };

  const deleteBill = async (billId: string) => {
    try {
      await dataService.deleteBill(billId);
      showToast('Bill deleted successfully', 'info');
    } catch (err: any) {
      showToast(`Failed to delete bill: ${err.message}`, 'error');
    }
  };

  // Item Management
  const saveItem = async (item: Partial<ShopItem> & { name: string; price: number }) => {
    try {
      await dataService.saveItem(item);
      showToast(item.id ? 'Item updated' : 'Item added successfully', 'success');
    } catch (err: any) {
      showToast(`Failed to save item: ${err.message}`, 'error');
    }
  };

  const updateItemPrice = async (itemId: string, price: number) => {
    try {
      await dataService.updateItemPrice(itemId, price);
      showToast('Price updated', 'success');
    } catch (err: any) {
      showToast(`Failed to update price: ${err.message}`, 'error');
    }
  };

  const toggleItemStatus = async (itemId: string, isActive: boolean) => {
    try {
      await dataService.toggleItemStatus(itemId, isActive);
      showToast(isActive ? 'Item activated' : 'Item hidden from POS', 'info');
    } catch (err: any) {
      showToast(`Failed to update item: ${err.message}`, 'error');
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await dataService.deleteItem(itemId);
      showToast('Item deleted', 'info');
    } catch (err: any) {
      showToast(`Failed to delete item: ${err.message}`, 'error');
    }
  };

  // Expenses
  const addExpense = async (exp: {
    date: string;
    description: string;
    amount: number;
    paidBy: ExpensePayer;
    category?: string;
  }) => {
    try {
      await dataService.addExpense({
        ...exp,
        createdAt: new Date().toISOString(),
      });
      showToast('Expense recorded', 'success');
    } catch (err: any) {
      showToast(`Failed to add expense: ${err.message}`, 'error');
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      await dataService.deleteExpense(expenseId);
      showToast('Expense removed', 'info');
    } catch (err: any) {
      showToast(`Failed to delete expense: ${err.message}`, 'error');
    }
  };

  // Advances
  const addAdvance = async (adv: {
    partner: PartnerName;
    date: string;
    amount: number;
    note: string;
  }) => {
    try {
      await dataService.addAdvance({
        ...adv,
        createdAt: new Date().toISOString(),
      });
      showToast(`Advance for ${adv.partner} recorded`, 'success');
    } catch (err: any) {
      showToast(`Failed to record advance: ${err.message}`, 'error');
    }
  };

  const deleteAdvance = async (advanceId: string) => {
    try {
      await dataService.deleteAdvance(advanceId);
      showToast('Advance removed', 'info');
    } catch (err: any) {
      showToast(`Failed to delete advance: ${err.message}`, 'error');
    }
  };

  // Settings
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const merged = { ...settings, ...newSettings };
      await dataService.saveSettings(merged);
      setSettings(merged);
      showToast('Settings saved successfully', 'success');
    } catch (err: any) {
      showToast(`Failed to update settings: ${err.message}`, 'error');
    }
  };

  const resetToDemoData = () => {
    dataService.resetDemoData();
    showToast('Reset to demo data completed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        items,
        bills,
        todayBills,
        expenses,
        advances,
        settings,
        theme,
        toasts,
        loading,
        activeBillItems,
        selectedCategory,
        toggleTheme,
        showToast,
        dismissToast,
        setSelectedCategory,
        addItemToBill,
        updateBillItemQty,
        overrideBillItemPrice,
        removeBillItem,
        clearActiveBill,
        saveAndPrintBill,
        deleteBill,
        saveItem,
        updateItemPrice,
        toggleItemStatus,
        deleteItem,
        addExpense,
        deleteExpense,
        addAdvance,
        deleteAdvance,
        updateSettings,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
