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
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { ShopItem, Bill, Expense, Advance, Investment, AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/calculations';
import { getTodayColomboDate } from '../utils/formatters';

// Storage keys for local demo persistence
const STORAGE_ITEMS = 'lt_items';
const STORAGE_BILLS = 'lt_bills';
const STORAGE_EXPENSES = 'lt_expenses';
const STORAGE_ADVANCES = 'lt_advances';
const STORAGE_INVESTMENTS = 'lt_investments';
const STORAGE_SETTINGS = 'lt_settings';

export const INITIAL_DEMO_ITEMS: ShopItem[] = [
  {
    id: 'item-0',
    name: 'Fresh Curd with Mee Pani (Wild Honey)',
    price: 350,
    category: 'Sweets',
    isActive: true,
  },
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
    name: 'Fresh Lime Juice (Thanamalwila)',
    price: 180,
    category: 'Juices',
    isActive: true,
  },
  {
    id: 'item-6',
    name: 'Ceylon Spiced Milk Tea',
    price: 120,
    category: 'Beverages',
    isActive: true,
  },
  {
    id: 'item-7',
    name: 'Woodapple Fresh Juice (දිවුල් කිරි)',
    price: 220,
    category: 'Juices',
    isActive: true,
  },
  {
    id: 'item-8',
    name: 'Bottled Mineral Water 500ml',
    price: 100,
    category: 'Beverages',
    isActive: true,
  },
];

export const INITIAL_DEMO_BILLS: Bill[] = [
  {
    id: 'bill-demo-1',
    billNumber: 'LT-20261011-001',
    date: getTodayColomboDate(),
    time: '10:15:30',
    items: [
      {
        itemId: 'item-0',
        name: 'Fresh Curd with Mee Pani (Wild Honey)',
        unitPrice: 350,
        originalPrice: 350,
        quantity: 2,
        lineTotal: 700,
      },
      {
        itemId: 'item-4',
        name: 'Chicken & Cheese Toast Sandwich',
        unitPrice: 480,
        originalPrice: 480,
        quantity: 1,
        lineTotal: 480,
      },
    ],
    subtotal: 1180,
    discount: 0,
    grandTotal: 1180,
    cashier: 'Madhawa',
    paymentMethod: 'cash',
    notes: 'Morning dine-in customer',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bill-demo-2',
    billNumber: 'LT-20261011-002',
    date: getTodayColomboDate(),
    time: '12:40:10',
    items: [
      {
        itemId: 'item-1',
        name: 'Kithul Hakuru Sweet Portion',
        unitPrice: 150,
        originalPrice: 150,
        quantity: 2,
        lineTotal: 300,
      },
      {
        itemId: 'item-6',
        name: 'Ceylon Spiced Milk Tea',
        unitPrice: 120,
        originalPrice: 120,
        quantity: 2,
        lineTotal: 240,
      },
    ],
    subtotal: 540,
    discount: 0,
    grandTotal: 540,
    cashier: 'Madhawa',
    paymentMethod: 'cash',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-demo-1',
    date: getTodayColomboDate(),
    description: 'Sandwich bread (3 loaves) & butter',
    amount: 1450,
    paidBy: 'Business',
    category: 'Ingredients',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-demo-2',
    date: getTodayColomboDate(),
    description: 'Fresh salad leaves, cucumber & tomatoes',
    amount: 850,
    paidBy: 'Madhawa', // Out of pocket!
    category: 'Ingredients',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-demo-3',
    date: getTodayColomboDate(),
    description: 'Gas cylinder refill (12.5kg Litro)',
    amount: 4200,
    paidBy: 'Sandeep', // Paid by investor partner!
    category: 'Utilities/Supplies',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_ADVANCES: Advance[] = [
  {
    id: 'adv-demo-1',
    partner: 'Madhawa',
    date: getTodayColomboDate(),
    amount: 1000,
    note: 'Personal bus fare & pocket cash advance',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_INVESTMENTS: Investment[] = [
  {
    id: 'inv-demo-1',
    partner: 'Sandeep',
    date: getTodayColomboDate(),
    amount: 100000,
    note: 'Initial shop setup & renovation investment',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-demo-2',
    partner: 'Fab',
    date: getTodayColomboDate(),
    amount: 150000,
    note: 'Initial business capital & kitchen equipment',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-demo-3',
    partner: 'Madhawa',
    date: getTodayColomboDate(),
    amount: 50000,
    note: 'Initial working float & inventory capital',
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

// Supabase Mappers
function mapSupabaseItem(r: any): ShopItem {
  return {
    id: r.id,
    name: r.name,
    price: Number(r.price),
    category: r.category || 'General',
    isActive: Boolean(r.is_active),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapSupabaseBill(r: any): Bill {
  return {
    id: r.id,
    billNumber: r.bill_number,
    date: r.date,
    time: r.time,
    items: Array.isArray(r.items) ? r.items : [],
    subtotal: Number(r.subtotal),
    discount: Number(r.discount),
    grandTotal: Number(r.grand_total),
    cashier: r.cashier || 'Madhawa',
    paymentMethod: r.payment_method || 'cash',
    notes: r.notes || '',
    createdAt: r.created_at,
  };
}

function mapSupabaseExpense(r: any): Expense {
  return {
    id: r.id,
    date: r.date,
    description: r.description,
    amount: Number(r.amount),
    paidBy: r.paid_by,
    category: r.category || 'General',
    createdAt: r.created_at,
  };
}

function mapSupabaseAdvance(r: any): Advance {
  return {
    id: r.id,
    partner: r.partner,
    date: r.date,
    amount: Number(r.amount),
    note: r.note || '',
    createdAt: r.created_at,
  };
}

function mapSupabaseInvestment(r: any): Investment {
  return {
    id: r.id,
    partner: r.partner,
    date: r.date,
    amount: Number(r.amount),
    note: r.note || '',
    createdAt: r.created_at,
  };
}

export const dataService = {
  getBackendType(): 'supabase' | 'firebase' | 'local' {
    if (isSupabaseConfigured() && supabase) return 'supabase';
    if (isFirebaseConfigured && db) return 'firebase';
    return 'local';
  },

  // === ITEMS ===
  async getItems(): Promise<ShopItem[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseItem);
      }
    }

    if (isFirebaseConfigured && db) {
      const snap = await getDocs(collection(db, 'items'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ShopItem);
    }

    return getLocal<ShopItem[]>(STORAGE_ITEMS, INITIAL_DEMO_ITEMS);
  },

  subscribeItems(callback: (items: ShopItem[]) => void): () => void {
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      this.getItems().then(callback);
      const channel = client
        .channel('realtime_shop_items')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shop_items' },
          () => {
            this.getItems().then(callback);
          }
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    }

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
    if (isSupabaseConfigured() && supabase) {
      if (item.id) {
        await supabase
          .from('shop_items')
          .update({
            name: item.name,
            price: Number(item.price),
            category: item.category || 'General',
            is_active: item.isActive !== false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);
        return { ...item, id: item.id } as ShopItem;
      } else {
        const id = `item-${Date.now()}`;
        const newItem: ShopItem = {
          id,
          name: item.name,
          price: Number(item.price),
          category: item.category || 'General',
          isActive: item.isActive !== false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await supabase.from('shop_items').insert({
          id,
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          is_active: newItem.isActive,
          created_at: newItem.createdAt,
          updated_at: newItem.updatedAt,
        });
        return newItem;
      }
    }

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
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('shop_items')
        .update({ price: Number(newPrice), updated_at: new Date().toISOString() })
        .eq('id', id);
      return;
    }

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
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('shop_items')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);
      return;
    }

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
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('shop_items').delete().eq('id', id);
      return;
    }

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
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(mapSupabaseBill);
      }
    }

    if (isFirebaseConfigured && db) {
      const snap = await getDocs(query(collection(db, 'bills'), orderBy('createdAt', 'desc')));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bill);
    }

    return getLocal<Bill[]>(STORAGE_BILLS, INITIAL_DEMO_BILLS);
  },

  subscribeBills(callback: (bills: Bill[]) => void): () => void {
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      this.getBills().then(callback);
      const channel = client
        .channel('realtime_bills')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bills' },
          () => {
            this.getBills().then(callback);
          }
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    }

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
    if (isSupabaseConfigured() && supabase) {
      const id = `bill-${Date.now()}`;
      const newBill: Bill = { ...bill, id };
      await supabase.from('bills').insert({
        id,
        bill_number: bill.billNumber,
        date: bill.date,
        time: bill.time,
        items: bill.items,
        subtotal: Number(bill.subtotal),
        discount: Number(bill.discount),
        grand_total: Number(bill.grandTotal),
        cashier: bill.cashier,
        payment_method: bill.paymentMethod,
        notes: bill.notes || '',
        created_at: bill.createdAt || new Date().toISOString(),
      });
      return newBill;
    }

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
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('bills').delete().eq('id', id);
      return;
    }

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
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      if (!error && data) {
        return data.map(mapSupabaseExpense);
      }
    }

    if (isFirebaseConfigured && db) {
      const snap = await getDocs(query(collection(db, 'expenses'), orderBy('date', 'desc')));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense);
    }

    return getLocal<Expense[]>(STORAGE_EXPENSES, INITIAL_DEMO_EXPENSES);
  },

  subscribeExpenses(callback: (expenses: Expense[]) => void): () => void {
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      this.getExpenses().then(callback);
      const channel = client
        .channel('realtime_expenses')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'expenses' },
          () => {
            this.getExpenses().then(callback);
          }
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    }

    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
      return onSnapshot(
        q,
        (snap) => {
          const expenses = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense);
          callback(expenses);
        },
        (err) => {
          console.warn('Firestore expenses error, falling back to local', err);
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
    if (isSupabaseConfigured() && supabase) {
      const id = `exp-${Date.now()}`;
      const newExp: Expense = { ...expense, id };
      await supabase.from('expenses').insert({
        id,
        date: expense.date,
        description: expense.description,
        amount: Number(expense.amount),
        paid_by: expense.paidBy,
        category: expense.category || 'General',
        created_at: expense.createdAt || new Date().toISOString(),
      });
      return newExp;
    }

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
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('expenses').delete().eq('id', id);
      return;
    }

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
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('advances')
        .select('*')
        .order('date', { ascending: false });
      if (!error && data) {
        return data.map(mapSupabaseAdvance);
      }
    }

    if (isFirebaseConfigured && db) {
      const snap = await getDocs(query(collection(db, 'advances'), orderBy('date', 'desc')));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Advance);
    }

    return getLocal<Advance[]>(STORAGE_ADVANCES, INITIAL_DEMO_ADVANCES);
  },

  subscribeAdvances(callback: (advances: Advance[]) => void): () => void {
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      this.getAdvances().then(callback);
      const channel = client
        .channel('realtime_advances')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'advances' },
          () => {
            this.getAdvances().then(callback);
          }
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    }

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
    if (isSupabaseConfigured() && supabase) {
      const id = `adv-${Date.now()}`;
      const newAdv: Advance = { ...advance, id };
      await supabase.from('advances').insert({
        id,
        partner: advance.partner,
        date: advance.date,
        amount: Number(advance.amount),
        note: advance.note || '',
        created_at: advance.createdAt || new Date().toISOString(),
      });
      return newAdv;
    }

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
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('advances').delete().eq('id', id);
      return;
    }

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

  // === INVESTMENTS (INITIAL CAPITAL) ===
  async getInvestments(): Promise<Investment[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('date', { ascending: false });
      if (!error && data) {
        return data.map(mapSupabaseInvestment);
      }
    }

    if (isFirebaseConfigured && db) {
      const snap = await getDocs(query(collection(db, 'investments'), orderBy('date', 'desc')));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Investment);
    }

    return getLocal<Investment[]>(STORAGE_INVESTMENTS, INITIAL_DEMO_INVESTMENTS);
  },

  subscribeInvestments(callback: (investments: Investment[]) => void): () => void {
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      this.getInvestments().then(callback);
      const channel = client
        .channel('realtime_investments')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'investments' },
          () => {
            this.getInvestments().then(callback);
          }
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    }

    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'investments'), orderBy('date', 'desc'));
      return onSnapshot(
        q,
        (snap) => {
          const investments = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Investment);
          callback(investments);
        },
        (err) => {
          console.warn('Firestore investments error', err);
          callback(getLocal<Investment[]>(STORAGE_INVESTMENTS, INITIAL_DEMO_INVESTMENTS));
        }
      );
    }

    callback(getLocal<Investment[]>(STORAGE_INVESTMENTS, INITIAL_DEMO_INVESTMENTS));
    const handler = () =>
      callback(getLocal<Investment[]>(STORAGE_INVESTMENTS, INITIAL_DEMO_INVESTMENTS));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  async addInvestment(investment: Omit<Investment, 'id'>): Promise<Investment> {
    if (isSupabaseConfigured() && supabase) {
      const id = `inv-${Date.now()}`;
      const newInv: Investment = { ...investment, id };
      await supabase.from('investments').insert({
        id,
        partner: investment.partner,
        date: investment.date,
        amount: Number(investment.amount),
        note: investment.note || '',
        created_at: investment.createdAt || new Date().toISOString(),
      });
      return newInv;
    }

    if (isFirebaseConfigured && db) {
      const ref = await addDoc(collection(db, 'investments'), investment);
      return { ...investment, id: ref.id } as Investment;
    }

    const investments = getLocal<Investment[]>(STORAGE_INVESTMENTS, INITIAL_DEMO_INVESTMENTS);
    const newInvestment: Investment = { ...investment, id: `inv-${Date.now()}` };
    investments.unshift(newInvestment);
    setLocal(STORAGE_INVESTMENTS, investments);
    window.dispatchEvent(new Event('storage'));
    return newInvestment;
  },

  async deleteInvestment(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('investments').delete().eq('id', id);
      return;
    }

    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'investments', id));
      return;
    }

    const investments = getLocal<Investment[]>(STORAGE_INVESTMENTS, INITIAL_DEMO_INVESTMENTS).filter(
      (inv) => inv.id !== id
    );
    setLocal(STORAGE_INVESTMENTS, investments);
    window.dispatchEvent(new Event('storage'));
  },

  // === SETTINGS ===
  async getSettings(): Promise<AppSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('data')
        .eq('id', 'app_settings')
        .single();
      if (!error && data?.data) {
        return { ...DEFAULT_SETTINGS, ...data.data } as AppSettings;
      }
    }

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
    if (isSupabaseConfigured() && supabase) {
      const client = supabase;
      this.getSettings().then(callback);
      const channel = client
        .channel('realtime_settings')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'settings' },
          () => {
            this.getSettings().then(callback);
          }
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    }

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
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('settings').upsert({
        id: 'app_settings',
        data: settings,
        updated_at: new Date().toISOString(),
      });
    }

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
    setLocal(STORAGE_INVESTMENTS, INITIAL_DEMO_INVESTMENTS);
    setLocal(STORAGE_SETTINGS, DEFAULT_SETTINGS);
    window.dispatchEvent(new Event('storage'));
  },
};
