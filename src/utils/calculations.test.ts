import { describe, it, expect } from 'vitest';
import {
  calculateDailyRent,
  calculateDailyFinances,
  calculateReportSummary,
  DEFAULT_SETTINGS,
} from './calculations';
import { Bill, Expense, Advance } from '../types';

describe('Profit and Partner Calculations', () => {
  const customSettings = {
    ...DEFAULT_SETTINGS,
    monthlyRent: 30000, // Rs 1000/day
    dailyUtilities: 250, // Rs 250/day
    businessSharePercent: 10,
    partnerSharePercent: 30,
  };

  it('calculates daily rent correctly from monthly rent', () => {
    expect(calculateDailyRent(30000)).toBe(1000);
    expect(calculateDailyRent(15000)).toBe(500);
    expect(calculateDailyRent(0)).toBe(0);
  });

  it('calculates a normal profitable day correctly (10% business, 30% each to 3 partners)', () => {
    // Total sales = Rs 15,000
    const bills: Bill[] = [
      {
        id: 'b1',
        billNumber: 'LT-20261011-001',
        date: '2026-10-11',
        time: '10:00:00',
        items: [],
        subtotal: 10000,
        discount: 0,
        grandTotal: 10000,
        cashier: 'Madhawa',
        paymentMethod: 'cash',
        createdAt: '2026-10-11T10:00:00Z',
      },
      {
        id: 'b2',
        billNumber: 'LT-20261011-002',
        date: '2026-10-11',
        time: '14:30:00',
        items: [],
        subtotal: 5000,
        discount: 0,
        grandTotal: 5000,
        cashier: 'Madhawa',
        paymentMethod: 'cash',
        createdAt: '2026-10-11T14:30:00Z',
      },
    ];

    // Total expenses = Rs 3,750 (Bread + vegetables paid by shop)
    const expenses: Expense[] = [
      {
        id: 'e1',
        date: '2026-10-11',
        description: 'Bread and butter',
        amount: 2500,
        paidBy: 'Business',
        createdAt: '2026-10-11T08:00:00Z',
      },
      {
        id: 'e2',
        date: '2026-10-11',
        description: 'Vegetables',
        amount: 1250,
        paidBy: 'Business',
        createdAt: '2026-10-11T09:00:00Z',
      },
    ];

    // Expected costs:
    // Expenses = 3750, Utilities = 250, Rent = 1000 => Total costs = 5000
    // Profit = 15000 - 5000 = 10000
    // Business share (10%) = 1000
    // Remaining for partners = 9000 => 3000 each (30% each)
    const result = calculateDailyFinances('2026-10-11', bills, expenses, customSettings);

    expect(result.totalSales).toBe(15000);
    expect(result.totalExpenses).toBe(3750);
    expect(result.dailyUtilities).toBe(250);
    expect(result.dailyRent).toBe(1000);
    expect(result.totalCosts).toBe(5000);
    expect(result.profit).toBe(10000);
    expect(result.businessShare).toBe(1000);
    expect(result.partnerShareEach).toBe(3000);
    expect(result.partnerShares['Sandeep']).toBe(3000);
    expect(result.partnerShares['Fab']).toBe(3000);
    expect(result.partnerShares['Madhawa']).toBe(3000);
  });

  it('handles a day with negative profit (loss) correctly', () => {
    // Bad weather day: Sales only Rs 500, Expenses Rs 1,500, Utilities Rs 250, Rent Rs 1,000
    // Total costs = 1500 + 250 + 1000 = 2750
    // Profit = 500 - 2750 = -2250 (loss of Rs 2,250)
    // When protectBusinessOnLoss is true, business reserve takes 0,
    // and the -2250 loss is borne equally by Sandeep, Fab, Madhawa (-750 each)
    const bills: Bill[] = [
      {
        id: 'b1',
        billNumber: 'LT-20261012-001',
        date: '2026-10-12',
        time: '11:00:00',
        items: [],
        subtotal: 500,
        discount: 0,
        grandTotal: 500,
        cashier: 'Madhawa',
        paymentMethod: 'cash',
        createdAt: '2026-10-12T11:00:00Z',
      },
    ];

    const expenses: Expense[] = [
      {
        id: 'e1',
        date: '2026-10-12',
        description: 'Special stock ingredients',
        amount: 1500,
        paidBy: 'Business',
        createdAt: '2026-10-12T09:00:00Z',
      },
    ];

    const result = calculateDailyFinances('2026-10-12', bills, expenses, customSettings);

    expect(result.profit).toBe(-2250);
    expect(result.businessShare).toBe(0);
    expect(result.partnerShareEach).toBe(-750);
    expect(result.partnerShares['Sandeep']).toBe(-750);
    expect(result.partnerShares['Fab']).toBe(-750);
    expect(result.partnerShares['Madhawa']).toBe(-750);
  });

  it('calculates a month with advances and partner out-of-pocket expenses correctly', () => {
    // Day 1: Sales Rs 20,000, Shop expense Rs 5,000 => Costs = 5000 + 250 + 1000 = 6250.
    // Profit = 20000 - 6250 = 13750.
    // Business share 10% = 1375. Remaining = 12375 => 4125 each partner.
    // Plus: Fab paid Rs 6,000 for coffee machine parts from his own pocket on Day 1.
    // Day 2: Sales Rs 1,000, Shop expense Rs 2,000 => Costs = 2000 + 250 + 1000 = 3250.
    // Profit = 1000 - 3250 = -2250.
    // Business share = 0. Loss per partner = -750 each.
    // Madhawa takes an advance of Rs 3,000 on Day 2.
    // Sandeep takes an advance of Rs 1,000 on Day 2.

    const bills: Bill[] = [
      {
        id: 'b1',
        billNumber: 'LT-20261001-001',
        date: '2026-10-01',
        time: '12:00:00',
        items: [],
        subtotal: 20000,
        discount: 0,
        grandTotal: 20000,
        cashier: 'Madhawa',
        paymentMethod: 'cash',
        createdAt: '2026-10-01T12:00:00Z',
      },
      {
        id: 'b2',
        billNumber: 'LT-20261002-001',
        date: '2026-10-02',
        time: '12:00:00',
        items: [],
        subtotal: 1000,
        discount: 0,
        grandTotal: 1000,
        cashier: 'Madhawa',
        paymentMethod: 'cash',
        createdAt: '2026-10-02T12:00:00Z',
      },
    ];

    const expenses: Expense[] = [
      {
        id: 'e1',
        date: '2026-10-01',
        description: 'Ingredients',
        amount: 5000,
        paidBy: 'Business',
        createdAt: '2026-10-01T08:00:00Z',
      },
      {
        id: 'e2',
        date: '2026-10-01',
        description: 'Commercial Blender purchased by Fab',
        amount: 6000,
        paidBy: 'Fab', // Partner paid from own pocket
        createdAt: '2026-10-01T09:00:00Z',
      },
      {
        id: 'e3',
        date: '2026-10-02',
        description: 'Produce',
        amount: 2000,
        paidBy: 'Business',
        createdAt: '2026-10-02T08:00:00Z',
      },
    ];

    const advances: Advance[] = [
      {
        id: 'a1',
        partner: 'Madhawa',
        date: '2026-10-02',
        amount: 3000,
        note: 'Personal emergency advance',
        createdAt: '2026-10-02T15:00:00Z',
      },
      {
        id: 'a2',
        partner: 'Sandeep',
        date: '2026-10-02',
        amount: 1000,
        note: 'Travel fuel advance',
        createdAt: '2026-10-02T16:00:00Z',
      },
    ];

    // Day 1 total costs: 5000 + 6000 + 250 + 1000 = 12250
    // Day 1 profit: 20000 - 12250 = 7750
    // Day 1 Business share: 775. Remaining: 6975 => 2325 each.
    // Day 2 total costs: 2000 + 250 + 1000 = 3250
    // Day 2 profit: 1000 - 3250 = -2250
    // Day 2 Business share: 0. Remaining loss: -750 each.
    // Total profit share for period per partner: 2325 + (-750) = 1575.

    // Sandeep balance:
    // Profit share = 1575, Paid for business = 0, Advance = 1000
    // Period balance = 1575 + 0 - 1000 = 575

    // Fab balance:
    // Profit share = 1575, Paid for business = 6000, Advance = 0
    // Period balance = 1575 + 6000 - 0 = 7575

    // Madhawa balance:
    // Profit share = 1575, Paid for business = 0, Advance = 3000
    // Period balance = 1575 + 0 - 3000 = -1425 (Madhawa owes Rs 1425 due to advance exceeding profit)

    const report = calculateReportSummary(
      bills,
      expenses,
      advances,
      '2026-10-01',
      '2026-10-02',
      customSettings
    );

    expect(report.totalSales).toBe(21000);
    expect(report.totalExpenses).toBe(13000); // 5000 + 6000 + 2000
    expect(report.netProfit).toBe(5500); // 7750 - 2250 = 5500
    expect(report.businessAccountTotal).toBe(775);

    expect(report.partnerSummaries.Sandeep.profitShareTotal).toBe(1575);
    expect(report.partnerSummaries.Sandeep.paidForBusinessTotal).toBe(0);
    expect(report.partnerSummaries.Sandeep.advancesTakenTotal).toBe(1000);
    expect(report.partnerSummaries.Sandeep.periodBalance).toBe(575);

    expect(report.partnerSummaries.Fab.profitShareTotal).toBe(1575);
    expect(report.partnerSummaries.Fab.paidForBusinessTotal).toBe(6000);
    expect(report.partnerSummaries.Fab.advancesTakenTotal).toBe(0);
    expect(report.partnerSummaries.Fab.periodBalance).toBe(7575);

    expect(report.partnerSummaries.Madhawa.profitShareTotal).toBe(1575);
    expect(report.partnerSummaries.Madhawa.paidForBusinessTotal).toBe(0);
    expect(report.partnerSummaries.Madhawa.advancesTakenTotal).toBe(3000);
    expect(report.partnerSummaries.Madhawa.periodBalance).toBe(-1425);
  });
});
