import React from 'react';
import { ReportSummary, AppSettings } from '../../types';
import { formatCurrency, formatDateColombo } from '../../utils/formatters';

interface PrintableReportProps {
  report: ReportSummary;
  settings: AppSettings;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ report, settings }) => {
  return (
    <div className="report-print-container" style={{ display: 'none' }}>
      {/* Print Document Header */}
      <div
        style={{ borderBottom: '2px solid #166443', paddingBottom: '12px', marginBottom: '16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 4px 0',
                color: '#166443',
                textTransform: 'uppercase',
              }}
            >
              {settings.shopName}
            </h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#444' }}>
              {settings.address} | Phone: {settings.phone}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 'bold', color: '#222' }}>
              Financial Settlement & Partner Ledger Report
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#555' }}>
            <div>
              Period:{' '}
              <strong>
                {formatDateColombo(report.startDate)} — {formatDateColombo(report.endDate)}
              </strong>
            </div>
            <div>Generated: {new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary Table */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#166443' }}>
          1. Business Performance Summary
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>Total Sales Revenue:</td>
              <td
                style={{
                  padding: '6px 8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color: '#166443',
                }}
              >
                {formatCurrency(report.totalSales)}
              </td>
              <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>Total Operating Expenses:</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', color: '#c00' }}>
                -{formatCurrency(report.totalExpenses)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>
                Total Utilities (Light + Water):
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'right', color: '#666' }}>
                -{formatCurrency(report.totalUtilities)}
              </td>
              <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>
                Total Rent (Rs {settings.monthlyRent}/mo):
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'right', color: '#666' }}>
                -{formatCurrency(report.totalRent)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f0fdf4', borderBottom: '2px solid #166443' }}>
              <td style={{ padding: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                Net Operating Profit:
              </td>
              <td
                style={{
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: '#166443',
                }}
              >
                {formatCurrency(report.netProfit)}
              </td>
              <td style={{ padding: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                Business Reserve (10%):
              </td>
              <td
                style={{
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: '#b89028',
                }}
              >
                {formatCurrency(report.businessAccountTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Partner Settlement Summary */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#166443' }}>
          2. Partner Accounts & Final Settlement Balance
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px',
            border: '1px solid #ccc',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#166443', color: '#ffffff', textAlign: 'left' }}>
              <th style={{ padding: '6px 8px' }}>Partner</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Capital Invested (+)</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Profit Share (30%)</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Paid For Business (+)</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Advances Taken (-)</th>
              <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                Period Net Balance
              </th>
              <th style={{ padding: '6px 8px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(report.partnerSummaries).map((p) => {
              const isCredit = p.periodBalance >= 0;
              return (
                <tr key={p.partner} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 'bold' }}>{p.partner}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', color: '#166443' }}>
                    +{formatCurrency(p.capitalInvestedTotal)}
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                    {formatCurrency(p.profitShareTotal)}
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', color: '#166443' }}>
                    +{formatCurrency(p.paidForBusinessTotal)}
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', color: '#c00' }}>
                    -{formatCurrency(p.advancesTakenTotal)}
                  </td>
                  <td
                    style={{
                      padding: '6px 8px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: isCredit ? '#166443' : '#c00',
                    }}
                  >
                    {formatCurrency(p.periodBalance)}
                  </td>
                  <td
                    style={{
                      padding: '6px 8px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: isCredit ? '#166443' : '#c00',
                    }}
                  >
                    {isCredit ? 'To Receive' : 'Owes Shop'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Daily Breakdown Table */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#166443' }}>
          3. Daily Operating Ledger
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '9.5px',
            border: '1px solid #ccc',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f1f5f9',
                borderBottom: '1px solid #999',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '5px' }}>Date</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Sales</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Expenses</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Util.</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Rent</th>
              <th style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>Profit</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Sandeep</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Fab</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Madhawa</th>
              <th style={{ padding: '5px', textAlign: 'right' }}>Business 10%</th>
            </tr>
          </thead>
          <tbody>
            {report.dailyBreakdown.map((d) => (
              <tr key={d.date} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '4px 5px' }}>{d.date}</td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.totalSales)}
                </td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.totalExpenses)}
                </td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.dailyUtilities)}
                </td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.dailyRent)}
                </td>
                <td
                  style={{
                    padding: '4px 5px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: d.profit < 0 ? '#c00' : '#166443',
                  }}
                >
                  {formatCurrency(d.profit)}
                </td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.partnerShares.Sandeep || 0)}
                </td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.partnerShares.Fab || 0)}
                </td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.partnerShares.Madhawa || 0)}
                </td>
                <td style={{ padding: '4px 5px', textAlign: 'right' }}>
                  {formatCurrency(d.businessShare)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Partner Signatures Block */}
      <div style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #aaa' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '30px' }}>
          Partners Settlement Verification Signatures:
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <div
            style={{
              width: '28%',
              textAlign: 'center',
              borderTop: '1px dotted #333',
              paddingTop: '6px',
            }}
          >
            <strong>Sandeep</strong>
            <div style={{ fontSize: '9px', color: '#666' }}>Partner</div>
          </div>
          <div
            style={{
              width: '28%',
              textAlign: 'center',
              borderTop: '1px dotted #333',
              paddingTop: '6px',
            }}
          >
            <strong>Fab</strong>
            <div style={{ fontSize: '9px', color: '#666' }}>Partner</div>
          </div>
          <div
            style={{
              width: '28%',
              textAlign: 'center',
              borderTop: '1px dotted #333',
              paddingTop: '6px',
            }}
          >
            <strong>Madhawa</strong>
            <div style={{ fontSize: '9px', color: '#666' }}>Cashier & Partner</div>
          </div>
        </div>
      </div>
    </div>
  );
};
