/**
 * Utility functions for currency, dates (Asia/Colombo timezone) and numbers
 */

export function formatCurrency(amount: number, showDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs 0';
  }
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-LK', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return isNegative ? `-Rs ${formatted}` : `Rs ${formatted}`;
}

export function getTodayColomboDate(): string {
  // Returns YYYY-MM-DD in Asia/Colombo timezone
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(now);
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function getCurrentColomboTime(): string {
  try {
    const now = new Date();
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
  } catch {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  }
}

export function formatDateColombo(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getFirstDayOfCurrentMonth(): string {
  const today = getTodayColomboDate();
  const [year, month] = today.split('-');
  return `${year}-${month}-01`;
}

export function generateBillNumber(existingBillsCountToday: number): string {
  const dateStr = getTodayColomboDate().replace(/-/g, '');
  const seq = String(existingBillsCountToday + 1).padStart(3, '0');
  return `LT-${dateStr}-${seq}`;
}
