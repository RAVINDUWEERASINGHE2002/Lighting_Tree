import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { ShopItem, Bill, Expense, Advance, AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/calculations';
import { getTodayColomboDate } from '../utils/formatters';

// Storage keys for local demo persistence
const STORAGE_ITEMS = 'lt_items';
const STORAGE_BILLS = 'lt_bills';
const STORAGE_EXPENSES = 'lt_expenses';
const STORAGE_ADVANCES = 'lt_advances';
const STORAGE_SETTINGS = 'lt_settings';

export const INITIAL_DEMO_ITEMS: ShopItem[] = [
  {
    id: 'item-1',
    name: 'Kithul Hakuru Sweet Portion',
    price: 150,
    category: 'Sweets',
    isActive: true,
  },
  {
    id: 'item-2',
    name: 'Fresh Vegetable Egg Sandwich',
    price: 350,
    category: 'Food',
    isActive: true,
  },
  {
    id: 'item-3',
    name: 'Pol Roti with Lunu Miris (2 pcs)',
    price: 200,
    category: 'Food',
    isActive: true,
  },
  {
    id: 'item-4',
    name: 'Chicken & Cheese Toast Sandwich',
    price: 480,
    category: 'Food',
    isActive: true,
  },
  {
    id: 'item-5',
    name: 'Woodapple Fresh Juice',
    price: 250,
    category: 'Beverages',
    isActive: true,
  },
  {
    id: 'item-6',
    name: 'Fresh King Coconut (Thambili)',
    price: 200,
    category: 'Beverages',
    isActive: true,
  },
  { id: 'item-7', name: 'Hot Ceylon Ginger Tea', price: 90, category: 'Beverages', isActive: true },
  { id: 'item-8', name: 'Special Iced Milo', price: 320, category: 'Beverages', isActive: true },
  {
    id: 'item-9',
    name: 'Crispy Veg Samosa (3 pcs)',
    price: 220,
    category: 'Snacks',
    isActive: true,
  },
  {
    id: 'item-10',
    name: 'Fresh Avocado Smoothie',
    price: 380,
    category: 'Beverages',
    isActive: true,
  },
];

export const INITIAL_DEMO_BILLS: Bill[] = [
  {
    id: 'b-demo-1',
    billNumber: 'LT-20261011-001',
    date: getTodayColomboDate(),
    time: '08:30:15',
    items: [
      {
        itemId: 'item-7',
        name: 'Hot Ceylon Ginger Tea',
        unitPrice: 90,
        originalPrice: 90,
        quantity: 2,
        lineTotal: 180,
      },
      {
        itemId: 'item-3',
        name: 'Pol Roti with Lunu Miris (2 pcs)',
        unitPrice: 200,
        originalPrice: 200,
        quantity: 2,
        lineTotal: 400,
      },
    ],
    subtotal: 580,
    discount: 0,
    grandTotal: 580,
    cashier: 'Madhawa',
    paymentMethod: 'cash',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-demo-2',
    billNumber: 'LT-20261011-002',
    date: getTodayColomboDate(),
    time: '11:15:20',
    items: [
      {
        itemId: 'item-2',
        name: 'Fresh Vegetable Egg Sandwich',
        unitPrice: 350,
        originalPrice: 350,
        quantity: 2,
        lineTotal: 700,
      },
      {
        itemId: 'item-5',
        name: 'Woodapple Fresh Juice',
        unitPrice: 250,
        originalPrice: 250,
        quantity: 2,
        lineTotal: 500,
      },
      {
        itemId: 'item-1',
        name: 'Kithul Hakuru Sweet Portion',
        unitPrice: 150,
        originalPrice: 150,
        quantity: 1,
        lineTotal: 150,
      },
    ],
    subtotal: 1350,
    discount: 0,
    grandTotal: 1350,
    cashier: 'Madhawa',
    paymentMethod: 'cash',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-demo-3',
    billNumber: 'LT-20261011-003',
    date: getTodayColomboDate(),
    time: '14:45:00',
    items: [
      {
        itemId: 'item-4',
        name: 'Chicken & Cheese Toast Sandwich',
        unitPrice: 480,
        originalPrice: 480,
        quantity: 3,
        lineTotal: 1440,
      },
      {
        itemId: 'item-8',
        name: 'Special Iced Milo',
        unitPrice: 320,
        originalPrice: 320,
        quantity: 3,
        lineTotal: 960,
      },
    ],
    subtotal: 2400,
    discount: 0,
    grandTotal: 2400,
    cashier: 'Madhawa',
    paymentMethod: 'cash',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-demo-1',
    date: getTodayColomboDate(),
    description: 'Fresh Sandwich Bread & Butter from local bakery',
    amount: 1450,
    paidBy: 'Business',
    category: 'Ingredients',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-demo-2',
    date: getTodayColomboDate(),
    description: 'Fresh Woodapples & Fruits from market',
    amount: 1200,
    paidBy: 'Madhawa',
    category: 'Ingredients',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_ADVANCES: Advance[] = [
  {
    id: 'adv-demo-1',
    partner: 'Madhawa',
    date: getTodayColomboDate(),
    amount: 500,
    note: 'Daily petty cash advance',
    createdAt: new Date().toISOString(),
  },
];

// Helper to get local storage
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Helper to set local storage
function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
}

export const dataService = {
  // === ITEMS ===
  async getItems(): Promise<ShopItem[]> {
    if (isFirebaseConfigured && db) {
      const snap = await getDocs(collection(db, 'items'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ShopItem);
    }
    return getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS);
  },

  subscribeItems(callback: (items: ShopItem[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'items'));
      return onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ShopItem);
          callback(items);
        },
        (err) => {
          console.warn('Firestore items subscribe error, falling back to local', err);
          callback(getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS));
        }
      );
    }

    // Local subscription simulation
    const current = getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS);
    callback(current);
    const handler = () => callback(getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  async saveItem(item: Partial<ShopItem> & { name: string; price: number }): Promise<ShopItem> {
    if (isFirebaseConfigured && db) {
      if (item.id) {
        const ref = doc(db, 'items', item.id);
        await updateDoc(ref, {
          name: item.name,
          price: Number(item.price),
          category: item.category || 'General',
          isActive: item.isActive !== false,
          updatedAt: new Date().toISOString(),
        });
        return { ...item, id: item.id } as ShopItem;
      } else {
        const ref = await addDoc(collection(db, 'items'), {
          name: item.name,
          price: Number(item.price),
          category: item.category || 'General',
          isActive: item.isActive !== false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        return { ...item, id: ref.id } as ShopItem;
      }
    }

    // LocalStorage
    const items = getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS);
    if (item.id) {
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], ...item, updatedAt: new Date().toISOString() };
      }
    } else {
      const newItem: ShopItem = {
        id: `item-${Date.now()}`,
        name: item.name,
        price: Number(item.price),
        category: item.category || 'General',
        isActive: item.isActive !== false,
        createdAt: new Date().toISOString(),
      };
      items.push(newItem);
    }
    setLocal(STORAGE_ITEMS, items);
    window.dispatchEvent(new Event('storage'));
    return item as ShopItem;
  },

  async updateItemPrice(id: string, newPrice: number): Promise<void> {
    if (isFirebaseConfigured && db) {
      const ref = doc(db, 'items', id);
      await updateDoc(ref, { price: Number(newPrice), updatedAt: new Date().toISOString() });
      return;
    }
    const items = getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS);
    const item = items.find((i) => i.id === id);
    if (item) {
      item.price = Number(newPrice);
      item.updatedAt = new Date().toISOString();
      setLocal(STORAGE_ITEMS, items);
      window.dispatchEvent(new Event('storage'));
    }
  },

  async toggleItemStatus(id: string, isActive: boolean): Promise<void> {
    if (isFirebaseConfigured && db) {
      const ref = doc(db, 'items', id);
      await updateDoc(ref, { isActive, updatedAt: new Date().toISOString() });
      return;
    }
    const items = getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS);
    const item = items.find((i) => i.id === id);
    if (item) {
      item.isActive = isActive;
      item.updatedAt = new Date().toISOString();
      setLocal(STORAGE_ITEMS, items);
      window.dispatchEvent(new Event('storage'));
    }
  },

  async deleteItem(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'items', id));
      return;
    }
    const items = getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS).filter(
      (i) => i.id !== id
    );
    setLocal(STORAGE_ITEMS, items);
    window.dispatchEvent(new Event('storage'));
  },

  // === BILLS (SALES) ===
  async getBills(): Promise<Bill[]> {
    if (isFirebaseConfigured && db) {
      const snap = await getDocs(query(collection(db, 'bills'), orderBy('createdAt', 'desc')));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bill);
    }
    return getLocal<Bill[]>(STORAGE_BILLS, INITIAL_DEMO_BILLS);
  },

  subscribeBills(callback: (bills: Bill[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'bills'), orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snap) => {
          const bills = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bill);
          callback(bills);
        },
        (err) => {
          console.warn('Firestore bills error, falling back to local', err);
          callback(getLocal<Bill[]>(STORAGE_BILLS, INITIAL_DEMO_BILLS));
        }
      );
    }

    callback(getLocal<Bill[]>(STORAGE_BILLS, INITIAL_DEMO_BILLS));
    const handler = () => callback(getLocal<Bill[]>(STORAGE_BILLS, INITIAL_DEMO_BILLS));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  async saveBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
    if (isFirebaseConfigured && db) {
      const ref = await addDoc(collection(db, 'bills'), bill);
      return { ...bill, id: ref.id } as Bill;
    }
    const bills = getLocal<Bill[]>(STORAGE_BILLS, INITIAL_DEMO_BILLS);
    const newBill: Bill = { ...bill, id: `bill-${Date.now()}` };
    bills.unshift(newBill);
    setLocal(STORAGE_BILLS, bills);
    window.dispatchEvent(new Event('storage'));
    return newBill;
  },

  async deleteBill(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'bills', id));
      return;
    }
    const bills = getLocal<Bill[]>(STORAGE_BILLS, INITIAL_DEMO_BILLS).filter((b) => b.id !== id);
    setLocal(STORAGE_BILLS, bills);
    window.dispatchEvent(new Event('storage'));
  },

  // === EXPENSES ===
  async getExpenses(): Promise<Expense[]> {
    if (isFirebaseConfigured && db) {
      const snap = await getDocs(query(collection(db, 'expenses'), orderBy('date', 'desc')));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense);
    }
    return getLocal<Expense[]>(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES);
  },

  subscribeExpenses(callback: (expenses: Expense[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
      return onSnapshot(
        q,
        (snap) => {
          const expenses = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense);
          callback(expenses);
        },
        (err) => {
          console.warn('Firestore expenses error', err);
          callback(getLocal<Expense[]>(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES));
        }
      );
    }

    callback(getLocal<Expense[]>(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES));
    const handler = () => callback(getLocal<Expense[]>(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    if (isFirebaseConfigured && db) {
      const ref = await addDoc(collection(db, 'expenses'), expense);
      return { ...expense, id: ref.id } as Expense;
    }
    const expenses = getLocal<Expense[]>(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES);
    const newExpense: Expense = { ...expense, id: `exp-${Date.now()}` };
    expenses.unshift(newExpense);
    setLocal(STORAGE_EXPENSES, expenses);
    window.dispatchEvent(new Event('storage'));
    return newExpense;
  },

  async deleteExpense(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'expenses', id));
      return;
    }
    const expenses = getLocal<Expense[]>(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES).filter(
      (e) => e.id !== id
    );
    setLocal(STORAGE_EXPENSES, expenses);
    window.dispatchEvent(new Event('storage'));
  },

  // === ADVANCES ===
  async getAdvances(): Promise<Advance[]> {
    if (isFirebaseConfigured && db) {
      const snap = await getDocs(query(collection(db, 'advances'), orderBy('date', 'desc')));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Advance);
    }
    return getLocal<Advance[]>(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES);
  },

  subscribeAdvances(callback: (advances: Advance[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'advances'), orderBy('date', 'desc'));
      return onSnapshot(
        q,
        (snap) => {
          const advances = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Advance);
          callback(advances);
        },
        (err) => {
          console.warn('Firestore advances error', err);
          callback(getLocal<Advance[]>(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES));
        }
      );
    }

    callback(getLocal<Advance[]>(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES));
    const handler = () => callback(getLocal<Advance[]>(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  async addAdvance(advance: Omit<Advance, 'id'>): Promise<Advance> {
    if (isFirebaseConfigured && db) {
      const ref = await addDoc(collection(db, 'advances'), advance);
      return { ...advance, id: ref.id } as Advance;
    }
    const advances = getLocal<Advance[]>(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES);
    const newAdvance: Advance = { ...advance, id: `adv-${Date.now()}` };
    advances.unshift(newAdvance);
    setLocal(STORAGE_ADVANCES, advances);
    window.dispatchEvent(new Event('storage'));
    return newAdvance;
  },

  async deleteAdvance(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'advances', id));
      return;
    }
    const advances = getLocal<Advance[]>(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES).filter(
      (a) => a.id !== id
    );
    setLocal(STORAGE_ADVANCES, advances);
    window.dispatchEvent(new Event('storage'));
  },

  // === SETTINGS ===
  async getSettings(): Promise<AppSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'settings'));
        const found = snap.docs.find((d) => d.id === 'general');
        if (found) {
          return { ...DEFAULT_SETTINGS, ...found.data() } as AppSettings;
        }
      } catch (err) {
        console.warn('Failed to load Firestore settings, using local', err);
      }
    }
    return getLocal<AppSettings>(STORAGE_SETTINGS, DEFAULT_SETTINGS);
  },

  subscribeSettings(callback: (settings: AppSettings) => void): () => void {
    if (isFirebaseConfigured && db) {
      const ref = doc(db, 'settings', 'general');
      return onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            callback({ ...DEFAULT_SETTINGS, ...snap.data() } as AppSettings);
          } else {
            callback(DEFAULT_SETTINGS);
          }
        },
        (err) => {
          console.warn('Firestore settings error', err);
          callback(getLocal<AppSettings>(STORAGE_SETTINGS, DEFAULT_SETTINGS));
        }
      );
    }

    callback(getLocal<AppSettings>(STORAGE_SETTINGS, DEFAULT_SETTINGS));
    const handler = () => callback(getLocal<AppSettings>(STORAGE_SETTINGS, DEFAULT_SETTINGS));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'settings', 'general'), settings);
    }
    setLocal(STORAGE_SETTINGS, settings);
    window.dispatchEvent(new Event('storage'));
  },

  // Reset to demo data
  resetDemoData(): void {
    setLocal(STORAGE_ITEMS, INITIAL_DEMO_ITEMS);
    setLocal(STORAGE_BILLS, INITIAL_DEMO_BILLS);
    setLocal(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES);
    setLocal(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES);
    setLocal(STORAGE_SETTINGS, DEFAULT_SETTINGS);
    window.dispatchEvent(new Event('storage'));
  },
};
