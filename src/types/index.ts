export type PartnerName = 'Sandeep' | 'Fab' | 'Madhawa';
export type ExpensePayer = PartnerName | 'Business';

export interface ShopItem {
  id: string;
  name: string;
  price: number; // in Sri Lankan Rupees (Rs)
  category: string;
  isActive: boolean; // allow hiding/showing
  createdAt?: string;
  updatedAt?: string;
}

export interface BillItem {
  itemId: string;
  name: string;
  unitPrice: number; // in Rs (can be overridden for current bill)
  originalPrice: number; // standard item price
  quantity: number;
  lineTotal: number;
}

export interface Bill {
  id: string;
  billNumber: string; // e.g. LT-20261011-001
  date: string; // YYYY-MM-DD in Asia/Colombo timezone
  time: string; // HH:mm:ss
  items: BillItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  cashier: string; // usually 'Madhawa'
  paymentMethod: 'cash' | 'card' | 'transfer';
  notes?: string;
  createdAt: string; // ISO string
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  description: string; // e.g., "Sandwich bread & butter", "Woodapple fruits", "Gas cylinder"
  amount: number; // in Rs
  paidBy: ExpensePayer; // Sandeep | Fab | Madhawa | Business (shop cash)
  category?: string;
  createdAt: string;
}

export interface Advance {
  id: string;
  partner: PartnerName;
  date: string; // YYYY-MM-DD
  amount: number; // in Rs
  note: string; // e.g. "Personal advance", "Pocket money"
  createdAt: string;
}

export interface AppSettings {
  shopName: string; // "Lighting Tree"
  address: string; // "Lighting Tree, Opposite Busstand, Thanamalwila"
  phone: string; // "+94 707504455"
  currencySymbol: string; // "Rs"
  monthlyRent: number; // e.g. 30000
  dailyUtilities: number; // light + water, default 250
  businessSharePercent: number; // default 10%
  partnerSharePercent: number; // default 30% each (for Sandeep, Fab, Madhawa)
  partners: PartnerName[]; // ['Sandeep', 'Fab', 'Madhawa']
  thermalFormat: '58mm' | '80mm'; // receipt printer width
}

export interface DailyCalculation {
  date: string;
  totalSales: number;
  totalExpenses: number;
  expensesPaidByShop: number;
  expensesPaidByPartners: number;
  dailyUtilities: number;
  dailyRent: number;
  totalCosts: number;
  profit: number; // totalSales - totalExpenses - dailyUtilities - dailyRent
  businessShare: number; // 10% of profit if profit > 0 (or proportion)
  partnerShareEach: number; // 30% of profit if 3 partners
  partnerShares: Record<PartnerName, number>;
}

export interface PartnerAccountSummary {
  partner: PartnerName;
  profitShareTotal: number;
  paidForBusinessTotal: number; // money paid by partner from own pocket credited back
  advancesTakenTotal: number; // advances deducted
  periodBalance: number; // profitShare + paidForBusiness - advancesTaken
  overallBalance: number; // cumulative balance
}

export interface ReportSummary {
  startDate: string;
  endDate: string;
  totalSales: number;
  totalExpenses: number;
  totalUtilities: number;
  totalRent: number;
  totalCosts: number;
  netProfit: number;
  businessAccountTotal: number;
  partnerSummaries: Record<PartnerName, PartnerAccountSummary>;
  dailyBreakdown: DailyCalculation[];
}
