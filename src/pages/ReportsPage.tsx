import React, { useState, useMemo } from 'react';
import {
  Calendar,
  FileSpreadsheet,
  FileText,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartnerCard } from '../components/reports/PartnerCard';
import { DailyBreakdownTable } from '../components/reports/DailyBreakdownTable';
import { PrintableReport } from '../components/reports/PrintableReport';
import { calculateReportSummary } from '../utils/calculations';
import {
  formatCurrency,
  getTodayColomboDate,
  getFirstDayOfCurrentMonth,
} from '../utils/formatters';
import { exportReportToCSV, exportReportToPDF } from '../utils/exportUtils';

export const ReportsPage: React.FC = () => {
  const { bills, expenses, advances, settings } = useApp();

  const today = getTodayColomboDate();
  const firstOfMonth = getFirstDayOfCurrentMonth();

  const [dateRangeMode, setDateRangeMode] = useState<'today' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);

  // Quick range triggers
  const setRangeToday = () => {
    setDateRangeMode('today');
    setStartDate(today);
    setEndDate(today);
  };

  const setRangeThisMonth = () => {
    setDateRangeMode('month');
    setStartDate(firstOfMonth);
    setEndDate(today);
  };

  // Compute financial report
  const report = useMemo(() => {
    return calculateReportSummary(bills, expenses, advances, startDate, endDate, settings);
  }, [bills, expenses, advances, startDate, endDate, settings]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    exportReportToCSV(report, settings);
  };

  const handleDownloadPDF = () => {
    exportReportToPDF(report, settings);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-5">
      {/* Printable View Container for Print CSS */}
      <PrintableReport report={report} settings={settings} />

      {/* Screen Interface (Hidden when printing) */}
      <div className="no-print space-y-5">
        {/* Page Title & Export Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Financial Reports & Partner Accounts</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live settlement calculation for Sandeep, Fab & Madhawa (Asia/Colombo)
            </p>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500 text-xs font-semibold shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-brand-600" />
              <span>Print Report</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500 text-xs font-semibold shadow-xs transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Date Filters Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={setRangeToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRangeMode === 'today'
                  ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={setRangeThisMonth}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRangeMode === 'month'
                  ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              This Month
            </button>
          </div>

          {/* Date Picker Inputs */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1.5 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setDateRangeMode('custom');
                  setStartDate(e.target.value);
                }}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setDateRangeMode('custom');
                  setEndDate(e.target.value);
                }}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Total Sales */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Sales
            </span>
            <div className="text-lg sm:text-2xl font-black text-brand-700 dark:text-brand-400 font-mono mt-1">
              {formatCurrency(report.totalSales)}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">From recorded customer bills</p>
          </div>

          {/* 2. Total Costs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Costs
            </span>
            <div className="text-lg sm:text-2xl font-black text-slate-700 dark:text-slate-200 font-mono mt-1">
              {formatCurrency(report.totalCosts)}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Expenses + Utils + Rent</p>
          </div>

          {/* 3. Net Shop Profit */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Net Shop Profit
            </span>
            <div
              className={`text-lg sm:text-2xl font-black font-mono mt-1 ${
                report.netProfit >= 0
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatCurrency(report.netProfit)}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Sales minus all business overheads</p>
          </div>

          {/* 4. Business Account (10%) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400">
              Business Reserve (10%)
            </span>
            <div className="text-lg sm:text-2xl font-black text-gold-600 dark:text-gold-400 font-mono mt-1">
              {formatCurrency(report.businessAccountTotal)}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Shop retained contingency fund</p>
          </div>
        </div>

        {/* 3 Partner Account Balance Cards */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              Partner Accounts & Current Balance
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              30% Profit Split + Reimbursable Paid - Advances
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <PartnerCard
              summary={report.partnerSummaries.Sandeep}
              role="Investor Partner (30% share)"
            />
            <PartnerCard
              summary={report.partnerSummaries.Fab}
              role="Foreign Investor Partner (30% share)"
            />
            <PartnerCard
              summary={report.partnerSummaries.Madhawa}
              role="Cashier & Day-to-Day Manager (30% share)"
            />
          </div>
        </div>

        {/* Daily Breakdown Ledger Table */}
        <DailyBreakdownTable dailyBreakdown={report.dailyBreakdown} />
      </div>
    </div>
  );
};
