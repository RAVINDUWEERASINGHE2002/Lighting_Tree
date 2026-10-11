import React, { useState } from 'react';
import { Plus, Search, Trash2, Coins, Calendar, User } from 'lucide-react';
import { Investment, PartnerName } from '../../types';
import { formatCurrency, formatDateColombo } from '../../utils/formatters';
import { ConfirmModal } from '../common/ConfirmModal';

interface InvestmentListProps {
  investments: Investment[];
  onAddNew: () => void;
  onDelete: (id: string) => void;
}

export const InvestmentList: React.FC<InvestmentListProps> = ({
  investments,
  onAddNew,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState<string>('All');
  const [invToDelete, setInvToDelete] = useState<string | null>(null);

  const partners: ('All' | PartnerName)[] = ['All', 'Sandeep', 'Fab', 'Madhawa'];

  const filtered = investments.filter((inv) => {
    const matchesPartner = partnerFilter === 'All' || inv.partner === partnerFilter;
    const matchesSearch =
      inv.partner.toLowerCase().includes(search.toLowerCase()) ||
      inv.note.toLowerCase().includes(search.toLowerCase()) ||
      String(inv.amount).includes(search);
    return matchesPartner && matchesSearch;
  });

  const totalFilteredAmount = filtered.reduce((sum, inv) => sum + inv.amount, 0);

  const perPartnerTotals: Record<PartnerName, number> = {
    Sandeep: investments.filter((i) => i.partner === 'Sandeep').reduce((s, i) => s + i.amount, 0),
    Fab: investments.filter((i) => i.partner === 'Fab').reduce((s, i) => s + i.amount, 0),
    Madhawa: investments.filter((i) => i.partner === 'Madhawa').reduce((s, i) => s + i.amount, 0),
  };

  return (
    <div className="space-y-4">
      {/* Partner Capital Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['Sandeep', 'Fab', 'Madhawa'] as PartnerName[]).map((p) => (
          <div
            key={p}
            className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                {p[0]}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{p}</span>
                <p className="text-[10px] text-slate-400">Initial Capital</p>
              </div>
            </div>
            <span className="font-mono font-black text-amber-700 dark:text-amber-400 text-sm">
              {formatCurrency(perPartnerTotals[p])}
            </span>
          </div>
        ))}
      </div>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search capital investments..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {partners.map((p) => (
              <button
                key={p}
                onClick={() => setPartnerFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  partnerFilter === p
                    ? 'bg-amber-600 text-white shadow-xs'
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
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Capital Investment</span>
        </button>
      </div>

      {/* Table or Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">
            Showing {filtered.length} of {investments.length} contributions
          </span>
          <span className="font-bold text-amber-700 dark:text-amber-400">
            Total Capital: {formatCurrency(totalFilteredAmount)}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
            <Coins className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p>No capital investments found.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Add initial money put into Lighting Tree by Sandeep, Fab, or Madhawa.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {inv.partner[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                        {inv.partner}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        <Coins className="w-2.5 h-2.5" />
                        Initial Capital
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{inv.note}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateColombo(inv.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                    +{formatCurrency(inv.amount)}
                  </span>
                  <button
                    onClick={() => setInvToDelete(inv.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                    title="Delete investment record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(invToDelete)}
        title="Delete Capital Investment"
        message="Are you sure you want to remove this capital contribution? This will update the partner's account balance."
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (invToDelete) {
            onDelete(invToDelete);
            setInvToDelete(null);
          }
        }}
        onClose={() => setInvToDelete(null)}
      />
    </div>
  );
};
