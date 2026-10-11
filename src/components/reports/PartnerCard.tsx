import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PartnerAccountSummary } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PartnerCardProps {
  summary: PartnerAccountSummary;
  role: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ summary, role }) => {
  const isPositive = summary.periodBalance >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
      {/* Top Banner & Partner Identity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
              {summary.partner[0]}
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 leading-tight">
                {summary.partner}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">{role}</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800'
            }`}
          >
            {isPositive ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {isPositive ? 'To Receive' : 'Owes Shop'}
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Profit Share (30%):
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {formatCurrency(summary.profitShareTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
              Paid for Shop (+):
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              +{formatCurrency(summary.paidForBusinessTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              Advances Taken (-):
            </span>
            <span className="font-semibold text-red-500 font-mono">
              -{formatCurrency(summary.advancesTakenTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Net Balance Result */}
      <div className="mt-4 pt-1 flex items-baseline justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            Period Net Balance
          </span>
          <div className="text-[10px] text-slate-400">
            {isPositive ? 'Payable to partner' : 'Partner debit due'}
          </div>
        </div>
        <div
          className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
            isPositive ? 'text-brand-700 dark:text-gold-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {formatCurrency(summary.periodBalance)}
        </div>
      </div>
    </div>
  );
};
