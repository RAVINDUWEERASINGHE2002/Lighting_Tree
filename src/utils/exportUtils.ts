import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportSummary, AppSettings } from '../types';
import { formatCurrency, formatDateColombo } from './formatters';

/**
 * Generates and downloads a CSV file for the financial report
 */
export function exportReportToCSV(report: ReportSummary, settings: AppSettings): void {
  const lines: string[] = [];

  // Header
  lines.push(`"${settings.shopName} - Financial & Partner Settlement Report"`);
  lines.push(`"Period:","${report.startDate} to ${report.endDate}"`);
  lines.push(`"Generated At:","${new Date().toLocaleString()}"`);
  lines.push('');

  // Executive Summary
  lines.push('"EXECUTIVE SUMMARY"');
  lines.push(`"Total Sales (Rs)",${report.totalSales}`);
  lines.push(`"Total Expenses (Rs)",${report.totalExpenses}`);
  lines.push(`"Daily Utilities Total (Rs)",${report.totalUtilities}`);
  lines.push(`"Daily Rent Total (Rs)",${report.totalRent}`);
  lines.push(`"Total Operating Costs (Rs)",${report.totalCosts}`);
  lines.push(`"Net Shop Profit (Rs)",${report.netProfit}`);
  lines.push(`"Business Reserve Fund (10%) (Rs)",${report.businessAccountTotal}`);
  lines.push('');

  // Partner Summary
  lines.push('"PARTNER ACCOUNTS SUMMARY"');
  lines.push(
    '"Partner","Profit Share (Rs)","Paid for Business (Reimbursable) (Rs)","Advances Taken (Rs)","Period Balance (Rs)","Settlement Status"'
  );

  const partners = Object.values(report.partnerSummaries);
  partners.forEach((p) => {
    const status = p.periodBalance >= 0 ? 'To Receive' : 'To Settle (Owes Business)';
    lines.push(
      `"${p.partner}",${p.profitShareTotal},${p.paidForBusinessTotal},${p.advancesTakenTotal},${p.periodBalance},"${status}"`
    );
  });
  lines.push('');

  // Daily Breakdown Table
  lines.push('"DAILY BREAKDOWN LEDGER"');
  lines.push(
    '"Date","Total Sales (Rs)","Expenses (Rs)","Utilities (Rs)","Rent (Rs)","Net Profit (Rs)","Sandeep Share (Rs)","Fab Share (Rs)","Madhawa Share (Rs)","Business 10% (Rs)"'
  );

  report.dailyBreakdown.forEach((d) => {
    lines.push(
      `"${d.date}",${d.totalSales},${d.totalExpenses},${d.dailyUtilities},${d.dailyRent},${d.profit},${d.partnerShares.Sandeep || 0},${d.partnerShares.Fab || 0},${d.partnerShares.Madhawa || 0},${d.businessShare}`
    );
  });

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Lighting_Tree_Report_${report.startDate}_to_${report.endDate}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads a PDF file for the financial report
 */
export function exportReportToPDF(report: ReportSummary, settings: AppSettings): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const emeraldGreen = [22, 100, 67] as [number, number, number];
  const warmGold = [212, 175, 55] as [number, number, number];
  const darkSlate = [30, 41, 59] as [number, number, number];

  // Header banner
  doc.setFillColor(...emeraldGreen);
  doc.rect(0, 0, 210, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.shopName.toUpperCase(), 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${settings.address} | Tel: ${settings.phone}`, 14, 18);
  doc.text(
    `Financial Settlement Report: ${formatDateColombo(report.startDate)} to ${formatDateColombo(report.endDate)}`,
    14,
    24
  );

  let currentY = 36;

  // Executive summary cards box
  doc.setTextColor(...darkSlate);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Financial Summary Overview', 14, currentY);
  currentY += 4;

  const summaryData = [
    ['Total Sales Revenue', formatCurrency(report.totalSales)],
    ['Total Operating Expenses', formatCurrency(report.totalExpenses)],
    ['Utilities (Light + Water)', formatCurrency(report.totalUtilities)],
    ['Daily Rent Total', formatCurrency(report.totalRent)],
    ['Total Overall Costs', formatCurrency(report.totalCosts)],
    ['Net Shop Profit', formatCurrency(report.netProfit)],
    ['Business Reserve (10%)', formatCurrency(report.businessAccountTotal)],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Financial Metric', 'Amount (LKR)']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: emeraldGreen, textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Partner Summary Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Partner Accounts & Balances', 14, currentY);
  currentY += 4;

  const partnerData = Object.values(report.partnerSummaries).map((p) => [
    p.partner,
    formatCurrency(p.profitShareTotal),
    formatCurrency(p.paidForBusinessTotal),
    formatCurrency(p.advancesTakenTotal),
    formatCurrency(p.periodBalance),
    p.periodBalance >= 0 ? 'To Pay to Partner' : 'Owes Shop',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Partner', 'Profit Share', 'Paid For Shop', 'Advances Taken', 'Net Balance', 'Status']],
    body: partnerData,
    theme: 'striped',
    headStyles: { fillColor: warmGold, textColor: [40, 30, 10], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'center', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Daily Breakdown Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Daily Operations Ledger', 14, currentY);
  currentY += 4;

  const dailyRows = report.dailyBreakdown.map((d) => [
    formatDateColombo(d.date),
    formatCurrency(d.totalSales),
    formatCurrency(d.totalExpenses),
    formatCurrency(d.dailyUtilities),
    formatCurrency(d.dailyRent),
    formatCurrency(d.profit),
    formatCurrency(d.partnerShares.Sandeep || 0),
    formatCurrency(d.partnerShares.Fab || 0),
    formatCurrency(d.partnerShares.Madhawa || 0),
    formatCurrency(d.businessShare),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        'Date',
        'Sales',
        'Expenses',
        'Util.',
        'Rent',
        'Profit',
        'Sandeep',
        'Fab',
        'Madhawa',
        'Business',
      ],
    ],
    body: dailyRows,
    theme: 'grid',
    headStyles: { fillColor: emeraldGreen, textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right', fontStyle: 'bold' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer notes & signatures
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Lighting Tree POS | Thanamalwila - Partner Verification Report | Page ${i} of ${pageCount}`,
      14,
      290
    );
  }

  doc.save(`Lighting_Tree_Report_${report.startDate}_to_${report.endDate}.pdf`);
}
