import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { PartnerName } from '../types';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, switchDemoUser, isFirebaseActive } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const partners: { name: PartnerName; role: string; desc: string }[] = [
    {
      name: 'Madhawa',
      role: 'Cashier & Manager',
      desc: 'Runs the shop day to day & handles cash register',
    },
    { name: 'Sandeep', role: 'Partner & Investor', desc: 'Equal partner & investor' },
    { name: 'Fab', role: 'Partner & Investor', desc: 'Equal foreign partner & investor' },
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSelect = async (partner: PartnerName) => {
    setError(null);
    setLoading(true);
    try {
      await switchDemoUser(partner);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to switch demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Background: Illustrated Thanamalwila Landscape */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity select-none pointer-events-none">
        <img
          src="/assets/thanamalwila-landscape.svg"
          alt="Thanamalwila Landscape"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-brand-950/90" />
      </div>

      {/* Decorative Gold & Green Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Logo size={70} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight font-sans">
            Lighting Tree
          </h2>
          <p className="text-xs text-gold-600 dark:text-gold-400 font-semibold tracking-wider uppercase mt-0.5">
            Point of Sale & Partner Ledger
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Opposite Busstand, Thanamalwila, Sri Lanka
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-300 font-medium">
            {error}
          </div>
        )}

        {/* Quick Partner Selection (Recommended for Demo / Fast Cashier Access) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Quick Sign In as Partner:
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Tap to switch</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {partners.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleQuickDemoSelect(p.name)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {p.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.role}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] uppercase font-semibold text-slate-400 absolute">
            Or Firebase Auth
          </span>
        </div>

        {/* Standard Email / Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. madhawa@lightingtree.lk"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-400">
            {isFirebaseActive
              ? '✓ Live Firebase Firestore Security Rules active'
              : '⚡ Demo Mode: Tap any partner button above to enter immediately'}
          </p>
        </div>
      </div>
    </div>
  );
};
