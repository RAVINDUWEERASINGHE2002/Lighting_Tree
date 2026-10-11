import React, { useRef } from 'react';
import { Printer, X } from 'lucide-react';
import { Bill, AppSettings } from '../../types';
import { formatCurrency, formatDateColombo } from '../../utils/formatters';

interface ThermalReceiptProps {
  bill: Bill;
  settings: AppSettings;
  onClose?: () => void;
  autoPrint?: boolean;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  bill,
  settings,
  onClose,
  autoPrint = false,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const is58mm = settings.thermalFormat === '58mm';

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  return (
    <div>
      {/* Screen Preview Container (Hidden on Print) */}
      <div className="no-print bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl flex flex-col items-center">
        {/* Action Toolbar */}
        <div className="w-full flex items-center justify-between gap-3 mb-4 max-w-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Receipt Preview ({settings.thermalFormat || '80mm'})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Now</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Realistic Thermal Paper Simulation on Screen */}
        <div
          ref={receiptRef}
          className={`bg-white text-black p-4 rounded shadow-xl border border-slate-300 font-mono text-xs select-text ${
            is58mm ? 'w-[260px]' : 'w-[320px]'
          }`}
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {/* Header */}
          <div className="text-center pb-2 border-b border-dashed border-black">
            <div className="font-bold text-sm tracking-wider uppercase mb-1">
              {settings.shopName || 'LIGHTING TREE'}
            </div>
            <div className="text-[11px] leading-tight text-neutral-800 mb-0.5">
              {settings.address || 'Lighting Tree, Opposite Busstand, Thanamalwila'}
            </div>
            <div className="text-[11px] font-semibold text-neutral-800">
              Tel: {settings.phone || '+94 707504455'}
            </div>
          </div>

          {/* Meta Info */}
          <div className="py-2 border-b border-dashed border-black text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span>Bill No:</span>
              <span className="font-bold">{bill.billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>
                {formatDateColombo(bill.date)} {bill.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>{bill.cashier || 'Madhawa'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="uppercase">{bill.paymentMethod || 'CASH'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-2 border-b border-dashed border-black">
            <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-neutral-300">
              <span className="w-1/2 text-left">ITEM</span>
              <span className="w-1/6 text-center">QTY</span>
              <span className="w-1/3 text-right">AMOUNT</span>
            </div>
            <div className="divide-y divide-neutral-100 pt-1">
              {bill.items.map((item, idx) => (
                <div key={idx} className="py-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="w-1/2 font-semibold truncate pr-1">{item.name}</span>
                    <span className="w-1/6 text-center">{item.quantity}</span>
                    <span className="w-1/3 text-right font-medium">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    @{formatCurrency(item.unitPrice)}
                    {item.originalPrice !== item.unitPrice && (
                      <span className="ml-1 text-neutral-400 line-through">
                        ({formatCurrency(item.originalPrice)})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(bill.subtotal)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-neutral-700">
                <span>Discount:</span>
                <span>-{formatCurrency(bill.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-1 border-t border-black">
              <span>GRAND TOTAL:</span>
              <span>{formatCurrency(bill.grandTotal)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-3 text-center border-t border-dashed border-black text-[11px]">
            <div className="font-semibold uppercase tracking-wider mb-0.5">
              Thank you! Come again.
            </div>
            <div className="text-[9px] text-neutral-500">Software: Lighting Tree POS</div>
          </div>
        </div>
      </div>

      {/* Actual Print Container (Rendered on window.print()) */}
      <div
        className={`thermal-receipt-print-container ${is58mm ? 'format-58mm' : ''}`}
        style={{ display: 'none' }}
      >
        <div style={{ textAlign: 'center', paddingBottom: '3px', borderBottom: '1px dashed #000' }}>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: is58mm ? '12px' : '14px',
              textTransform: 'uppercase',
            }}
          >
            {settings.shopName}
          </div>
          <div style={{ fontSize: is58mm ? '9px' : '10px' }}>{settings.address}</div>
          <div style={{ fontSize: is58mm ? '9px' : '10px' }}>Tel: {settings.phone}</div>
        </div>

        <div
          style={{
            padding: '3px 0',
            borderBottom: '1px dashed #000',
            fontSize: is58mm ? '9px' : '10px',
          }}
        >
          <div>
            Bill No: <strong>{bill.billNumber}</strong>
          </div>
          <div>
            Date: {bill.date} {bill.time}
          </div>
          <div>Cashier: {bill.cashier}</div>
          <div>Pay: {bill.paymentMethod.toUpperCase()}</div>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '3px',
            marginBottom: '3px',
            fontSize: is58mm ? '9px' : '10px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>
              <th>ITEM</th>
              <th style={{ textAlign: 'center' }}>QTY</th>
              <th style={{ textAlign: 'right' }}>AMT</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ maxWidth: is58mm ? '80px' : '120px', overflow: 'hidden' }}>
                  {item.name}
                  <div style={{ fontSize: '8px' }}>@{item.unitPrice}</div>
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'top' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', verticalAlign: 'top' }}>{item.lineTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            borderTop: '1px dashed #000',
            paddingTop: '3px',
            fontSize: is58mm ? '10px' : '11px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: is58mm ? '12px' : '13px',
            }}
          >
            <span>TOTAL:</span>
            <span>Rs {bill.grandTotal}</span>
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '6px',
            paddingTop: '4px',
            borderTop: '1px dashed #000',
            fontSize: is58mm ? '8.5px' : '9.5px',
          }}
        >
          <div>Thank you! Come again.</div>
          <div style={{ fontSize: '7.5px' }}>Lighting Tree POS</div>
        </div>
      </div>
    </div>
  );
};
