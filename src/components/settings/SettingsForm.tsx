import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Store, DollarSign, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { calculateDailyRent } from '../../utils/calculations';
import { ConfirmModal } from '../common/ConfirmModal';

export const SettingsForm: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useApp();
  const { isFirebaseActive } = useAuth();

  const [shopName, setShopName] = useState(settings.shopName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [monthlyRent, setMonthlyRent] = useState(String(settings.monthlyRent));
  const [dailyUtilities, setDailyUtilities] = useState(String(settings.dailyUtilities));
  const [businessSharePercent, setBusinessSharePercent] = useState(
    String(settings.businessSharePercent)
  );
  const [thermalFormat, setThermalFormat] = useState<'58mm' | '80mm'>(
    settings.thermalFormat || '80mm'
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setShopName(settings.shopName);
    setAddress(settings.address);
    setPhone(settings.phone);
    setMonthlyRent(String(settings.monthlyRent));
    setDailyUtilities(String(settings.dailyUtilities));
    setBusinessSharePercent(String(settings.businessSharePercent));
    setThermalFormat(settings.thermalFormat || '80mm');
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings({
      shopName: shopName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      monthlyRent: Math.max(0, parseFloat(monthlyRent) || 0),
      dailyUtilities: Math.max(0, parseFloat(dailyUtilities) || 0),
      businessSharePercent: Math.min(100, Math.max(0, parseFloat(businessSharePercent) || 10)),
      thermalFormat,
    });
    setIsSaving(false);
  };

  const currentDailyRent = calculateDailyRent(parseFloat(monthlyRent) || 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Store className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Shop Information & Receipts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            These details appear on every customer thermal receipt and financial report.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Shop Name:
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Shop Address (Print on every bill):
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number (Print on every bill):
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Thermal Printer Paper Width:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['80mm', '58mm'] as const).map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setThermalFormat(fmt)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    thermalFormat === fmt
                      ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {fmt} Printer
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-gold-500" />
            Financial & Settlement Parameters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Fixed overheads deducted automatically each day from sales before partner profit split.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Rent (Rs):
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Daily Rent: <strong>Rs {currentDailyRent} / day</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Utilities (Light + Water) (Rs):
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={dailyUtilities}
                onChange={(e) => setDailyUtilities(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Default: Rs 250 / day</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Business Reserve Cut (%):
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={businessSharePercent}
                onChange={(e) => setBusinessSharePercent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Default 10% (Partners 90%)
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Cloud & Data Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-slate-500" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                Data & Cloud Synchronization
              </h4>
              <p className="text-xs text-slate-400">
                {isFirebaseActive
                  ? 'Connected to Firebase Firestore & Auth (Live Sync Enabled)'
                  : 'Operating in Local Demo Mode (Realistic sample data loaded)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {!isFirebaseActive && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Ready for Firebase Setup:</strong> To enable real-time sync across all 3
            partners' phones, create a free Firebase project on the Spark plan, enable Firestore &
            Auth, and copy your API keys to the{' '}
            <code className="px-1 py-0.5 bg-amber-200/50 dark:bg-amber-900/50 rounded font-mono">
              .env
            </code>{' '}
            file. The app will immediately connect to cloud Firestore!
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetToDemoData}
        title="Reset to Demo Data?"
        message="This will reset items, bills, expenses, and advances back to standard initial demo records."
        confirmLabel="Reset All Data"
        danger={false}
      />
    </div>
  );
};
