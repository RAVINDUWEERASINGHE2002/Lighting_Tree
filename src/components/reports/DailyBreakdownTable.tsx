import React from 'react';
import { DailyCalculation } from '../../types';
import { formatCurrency, formatDateColombo } from '../../utils/formatters';

interface DailyBreakdownTableProps {
  dailyBreakdown: DailyCalculation[];
}

export const DailyBreakdownTable: React.FC<DailyBreakdownTableProps> = ({ dailyBreakdown }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            Daily Financial Ledger
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Day-by-day sales, costs, utilities, rent, and profit distribution
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {dailyBreakdown.length} {dailyBreakdown.length === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10.5px] tracking-wider whitespace-nowrap">
              <th className="py-3 px-3.5">Date</th>
              <th className="py-3 px-3.5 text-right">Sales</th>
              <th className="py-3 px-3.5 text-right">Expenses</th>
              <th className="py-3 px-3.5 text-right">Light+Water</th>
              <th className="py-3 px-3.5 text-right">Rent</th>
              <th className="py-3 px-3.5 text-right font-bold">Net Profit</th>
              <th className="py-3 px-3.5 text-right bg-brand-50/50 dark:bg-brand-950/20">
                Sandeep (30%)
              </th>
              <th className="py-3 px-3.5 text-right bg-brand-50/50 dark:bg-brand-950/20">
                Fab (30%)
              </th>
              <th className="py-3 px-3.5 text-right bg-brand-50/50 dark:bg-brand-950/20">
                Madhawa (30%)
              </th>
              <th className="py-3 px-3.5 text-right bg-gold-50/50 dark:bg-gold-950/20">
                Business (10%)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 whitespace-nowrap">
            {dailyBreakdown.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  No daily records for this period.
                </td>
              </tr>
            ) : (
              dailyBreakdown.map((row) => {
                const isLoss = row.profit < 0;

                return (
                  <tr
                    key={row.date}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isLoss ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 font-medium font-mono text-slate-700 dark:text-slate-300">
                      {formatDateColombo(row.date)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-slate-800 dark:text-slate-200">
                      {formatCurrency(row.totalSales)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-slate-600 dark:text-slate-400">
                      {formatCurrency(row.totalExpenses)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-slate-500">
                      {formatCurrency(row.dailyUtilities)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-slate-500">
                      {formatCurrency(row.dailyRent)}
                    </td>
                    <td
                      className={`py-3 px-3.5 text-right font-mono font-bold ${
                        isLoss
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {formatCurrency(row.profit)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono bg-brand-50/40 dark:bg-brand-950/20 font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(row.partnerShares.Sandeep || 0)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono bg-brand-50/40 dark:bg-brand-950/20 font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(row.partnerShares.Fab || 0)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono bg-brand-50/40 dark:bg-brand-950/20 font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(row.partnerShares.Madhawa || 0)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono bg-gold-50/40 dark:bg-gold-950/20 font-semibold text-gold-700 dark:text-gold-400">
                      {formatCurrency(row.businessShare)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
