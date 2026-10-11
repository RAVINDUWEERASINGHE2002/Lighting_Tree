import {
  PartnerName,
  Expense,
  Advance,
  Bill,
  AppSettings,
  DailyCalculation,
  PartnerAccountSummary,
  ReportSummary,
} from '../types';

export const DEFAULT_PARTNERS: PartnerName[] = ['Sandeep', 'Fab', 'Madhawa'];

export const DEFAULT_SETTINGS: AppSettings = {
  shopName: 'Lighting Tree',
  address: 'Lighting Tree, Opposite Busstand, Thanamalwila',
  phone: '+94 707504455',
  currencySymbol: 'Rs',
  monthlyRent: 30000,
  dailyUtilities: 250, // light + water Rs 250/day
  businessSharePercent: 10, // 10% to business account
  partnerSharePercent: 30, // 30% each to Sandeep, Fab, Madhawa
  partners: ['Sandeep', 'Fab', 'Madhawa'],
  thermalFormat: '80mm',
};

/**
 * Calculates the daily rent from monthly rent (monthlyRent / 30)
 */
export function calculateDailyRent(monthlyRent: number): number {
  if (!monthlyRent || monthlyRent <= 0) return 0;
  return Math.round((monthlyRent / 30) * 100) / 100;
}

export interface CalculationOptions {
  protectBusinessOnLoss?: boolean; // if true, business reserve share is 0 when profit is negative
}

/**
 * Pure calculation for a single calendar day
 */
export function calculateDailyFinances(
  date: string,
  billsForDay: Bill[],
  expensesForDay: Expense[],
  settings: AppSettings = DEFAULT_SETTINGS,
  options: CalculationOptions = { protectBusinessOnLoss: true }
): DailyCalculation {
  // 1. Total Sales from bills of this day
  const totalSales = billsForDay.reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  // 2. Expenses breakdown for this day
  let expensesPaidByShop = 0;
  let expensesPaidByPartners = 0;
  const totalExpenses = expensesForDay.reduce((sum, e) => {
    const amt = e.amount || 0;
    if (e.paidBy === 'Business') {
      expensesPaidByShop += amt;
    } else {
      expensesPaidByPartners += amt;
    }
    return sum + amt;
  }, 0);

  // 3. Daily Utilities and Rent
  const dailyUtilities = settings.dailyUtilities ?? 250;
  const dailyRent = calculateDailyRent(settings.monthlyRent ?? 30000);

  const totalCosts = totalExpenses + dailyUtilities + dailyRent;

  // 4. Daily Profit: total sales - total expenses - daily utilities - daily rent
  const profit = totalSales - totalCosts;

  // 5. Profit sharing
  const partners =
    settings.partners && settings.partners.length > 0 ? settings.partners : DEFAULT_PARTNERS;
  const numPartners = partners.length;

  let businessShare = 0;
  let partnerShareEach = 0;

  if (profit > 0) {
    const businessPct = (settings.businessSharePercent ?? 10) / 100;
    businessShare = Math.round(profit * businessPct * 100) / 100;
    const remainingForPartners = profit - businessShare;
    partnerShareEach = Math.round((remainingForPartners / numPartners) * 100) / 100;
  } else if (profit === 0) {
    businessShare = 0;
    partnerShareEach = 0;
  } else {
    // Negative profit (Loss)
    if (options.protectBusinessOnLoss) {
      // Retained earnings fund does not take a negative cut; operating shortfall is shared equally among partners
      businessShare = 0;
      partnerShareEach = Math.round((profit / numPartners) * 100) / 100;
    } else {
      // Proportional 10% / 90% allocation
      const businessPct = (settings.businessSharePercent ?? 10) / 100;
      businessShare = Math.round(profit * businessPct * 100) / 100;
      const remainingLoss = profit - businessShare;
      partnerShareEach = Math.round((remainingLoss / numPartners) * 100) / 100;
    }
  }

  const partnerShares: Record<PartnerName, number> = {
    Sandeep: 0,
    Fab: 0,
    Madhawa: 0,
  };

  partners.forEach((p) => {
    partnerShares[p] = partnerShareEach;
  });

  return {
    date,
    totalSales: Math.round(totalSales * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    expensesPaidByShop: Math.round(expensesPaidByShop * 100) / 100,
    expensesPaidByPartners: Math.round(expensesPaidByPartners * 100) / 100,
    dailyUtilities: Math.round(dailyUtilities * 100) / 100,
    dailyRent: Math.round(dailyRent * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    businessShare: Math.round(businessShare * 100) / 100,
    partnerShareEach: Math.round(partnerShareEach * 100) / 100,
    partnerShares,
  };
}

/**
 * Calculates complete account balances and partner summaries across a date range or full history
 */
export function calculateReportSummary(
  bills: Bill[],
  expenses: Expense[],
  advances: Advance[],
  startDate: string,
  endDate: string,
  settings: AppSettings = DEFAULT_SETTINGS,
  options: CalculationOptions = { protectBusinessOnLoss: true }
): ReportSummary {
  const partners =
    settings.partners && settings.partners.length > 0 ? settings.partners : DEFAULT_PARTNERS;

  // Filter entities by date range [startDate, endDate] inclusive
  const filteredBills = bills.filter((b) => b.date >= startDate && b.date <= endDate);
  const filteredExpenses = expenses.filter((e) => e.date >= startDate && e.date <= endDate);
  const filteredAdvances = advances.filter((a) => a.date >= startDate && a.date <= endDate);

  // Group by unique calendar dates in range
  const dateSet = new Set<string>();
  filteredBills.forEach((b) => dateSet.add(b.date));
  filteredExpenses.forEach((e) => dateSet.add(e.date));

  // If no bills or expenses, at least include startDate
  if (dateSet.size === 0 && startDate) {
    dateSet.add(startDate);
  }

  const sortedDates = Array.from(dateSet).sort();

  // Calculate daily finances for each active date
  const dailyBreakdown: DailyCalculation[] = sortedDates.map((d) => {
    const dayBills = filteredBills.filter((b) => b.date === d);
    const dayExpenses = filteredExpenses.filter((e) => e.date === d);
    return calculateDailyFinances(d, dayBills, dayExpenses, settings, options);
  });

  // Totals
  const totalSales = dailyBreakdown.reduce((sum, d) => sum + d.totalSales, 0);
  const totalExpenses = dailyBreakdown.reduce((sum, d) => sum + d.totalExpenses, 0);
  const totalUtilities = dailyBreakdown.reduce((sum, d) => sum + d.dailyUtilities, 0);
  const totalRent = dailyBreakdown.reduce((sum, d) => sum + d.dailyRent, 0);
  const totalCosts = dailyBreakdown.reduce((sum, d) => sum + d.totalCosts, 0);
  const netProfit = dailyBreakdown.reduce((sum, d) => sum + d.profit, 0);
  const businessAccountTotal = dailyBreakdown.reduce((sum, d) => sum + d.businessShare, 0);

  // Per Partner calculation:
  // balance = sum of daily profit shares + money paid for business - advances taken
  const partnerSummaries: Record<PartnerName, PartnerAccountSummary> = {
    Sandeep: {
      partner: 'Sandeep',
      profitShareTotal: 0,
      paidForBusinessTotal: 0,
      advancesTakenTotal: 0,
      periodBalance: 0,
      overallBalance: 0,
    },
    Fab: {
      partner: 'Fab',
      profitShareTotal: 0,
      paidForBusinessTotal: 0,
      advancesTakenTotal: 0,
      periodBalance: 0,
      overallBalance: 0,
    },
    Madhawa: {
      partner: 'Madhawa',
      profitShareTotal: 0,
      paidForBusinessTotal: 0,
      advancesTakenTotal: 0,
      periodBalance: 0,
      overallBalance: 0,
    },
  };

  partners.forEach((partner) => {
    // 1. Sum of profit share from daily breakdowns in the period
    const profitShareTotal = dailyBreakdown.reduce(
      (sum, day) => sum + (day.partnerShares[partner] || 0),
      0
    );

    // 2. Money paid for the business by this partner in period
    const paidForBusinessTotal = filteredExpenses
      .filter((e) => e.paidBy === partner)
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    // 3. Advances taken by this partner in period
    const advancesTakenTotal = filteredAdvances
      .filter((a) => a.partner === partner)
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    // 4. Period Balance
    const periodBalance = profitShareTotal + paidForBusinessTotal - advancesTakenTotal;

    const overallBalance = periodBalance;

    partnerSummaries[partner] = {
      partner,
      profitShareTotal: Math.round(profitShareTotal * 100) / 100,
      paidForBusinessTotal: Math.round(paidForBusinessTotal * 100) / 100,
      advancesTakenTotal: Math.round(advancesTakenTotal * 100) / 100,
      periodBalance: Math.round(periodBalance * 100) / 100,
      overallBalance: Math.round(overallBalance * 100) / 100,
    };
  });

  return {
    startDate,
    endDate,
    totalSales: Math.round(totalSales * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalUtilities: Math.round(totalUtilities * 100) / 100,
    totalRent: Math.round(totalRent * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    businessAccountTotal: Math.round(businessAccountTotal * 100) / 100,
    partnerSummaries,
    dailyBreakdown,
  };
}
