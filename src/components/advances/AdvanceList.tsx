import React, { useState } from 'react';
import { Plus, Search, Trash2, Banknote, User } from 'lucide-react';
import { Advance, PartnerName } from '../../types';
import { formatCurrency, formatDateColombo } from '../../utils/formatters';
import { ConfirmModal } from '../common/ConfirmModal';

interface AdvanceListProps {
  advances: Advance[];
  onAddNew: () => void;
  onDelete: (id: string) => void;
}

export const AdvanceList: React.FC<AdvanceListProps> = ({ advances, onAddNew, onDelete }) => {
  const [search, setSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState<string>('All');
  const [advanceToDelete, setAdvanceToDelete] = useState<string | null>(null);

  const partners: ('All' | PartnerName)[] = ['All', 'Sandeep', 'Fab', 'Madhawa'];

  const filtered = advances.filter((a) => {
    const matchesPartner = partnerFilter === 'All' || a.partner === partnerFilter;
    const matchesSearch =
      a.partner.toLowerCase().includes(search.toLowerCase()) ||
      a.note.toLowerCase().includes(search.toLowerCase()) ||
      String(a.amount).includes(search);
    return matchesPartner && matchesSearch;
  });

  const totalFilteredAmount = filtered.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search advances by note, partner..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {partners.map((p) => (
              <button
                key={p}
                onClick={() => setPartnerFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  partnerFilter === p
                    ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Advance</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="flex items-center justify-between p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl border border-amber-200/60 dark:border-amber-900/60 text-xs">
        <span className="text-slate-600 dark:text-slate-400">
          Showing <strong>{filtered.length}</strong> advances
          {partnerFilter !== 'All' ? ` for ${partnerFilter}` : ''}
        </span>
        <span className="font-bold text-sm text-amber-900 dark:text-amber-400 font-mono">
          Total Advances: {formatCurrency(totalFilteredAmount)}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Reason / Note</th>
                <th className="py-3 px-4 text-right">Advance Amount (Rs)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                    No partner advance records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                      {formatDateColombo(item.date)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                        <User className="w-3 h-3" />
                        {item.partner}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {item.note || 'Partner Advance'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-red-600 dark:text-red-400 font-mono">
                      -{formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setAdvanceToDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete advance"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(advanceToDelete)}
        onClose={() => setAdvanceToDelete(null)}
        onConfirm={() => {
          if (advanceToDelete) onDelete(advanceToDelete);
        }}
        title="Delete Partner Advance?"
        message="Are you sure you want to delete this recorded advance? This will remove the deduction from this partner's balance."
        confirmLabel="Delete Advance"
      />
    </div>
  );
};
