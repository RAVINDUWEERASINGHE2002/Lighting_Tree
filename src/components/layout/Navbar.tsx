import React, { useState } from 'react';
import { Moon, Sun, Users, LogOut, Store, Wifi, WifiOff, ChevronDown } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { PartnerName } from '../../types';

export const Navbar: React.FC = () => {
  const { currentUser, logout, switchDemoUser } = useAuth();
  const { theme, toggleTheme, settings } = useApp();
  const [partnerMenuOpen, setPartnerMenuOpen] = useState(false);
  const backendType = dataService.getBackendType();

  const partners: PartnerName[] = ['Sandeep', 'Fab', 'Madhawa'];

  return (
    <header className="relative bg-brand-950 text-white overflow-hidden shadow-lg border-b border-brand-800/60 no-print">
      {/* Background: Illustrated Thanamalwila Landscape with easy photo fallback */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity pointer-events-none select-none">
        <img
          src="/assets/thanamalwila-landscape.svg"
          alt="Thanamalwila Landscape"
          className="w-full h-full object-cover object-bottom"
          onError={(e) => {
            // Fallback to CSS gradient if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-950/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <Logo size={46} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  {settings.shopName}
                </h1>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  POS
                </span>
                {backendType === 'supabase' && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    title="Connected to Supabase PostgreSQL Realtime Cloud"
                  >
                    <Wifi className="w-2.5 h-2.5" />
                    Supabase Cloud
                  </span>
                )}
                {backendType === 'firebase' && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    title="Connected to Firebase Spark Plan"
                  >
                    <Wifi className="w-2.5 h-2.5" />
                    Firebase Cloud
                  </span>
                )}
                {backendType === 'local' && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    title="Running in Local Mode. Add Supabase or Firebase keys to activate cloud sync."
                  >
                    <WifiOff className="w-2.5 h-2.5" />
                    Demo
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate max-w-[200px] sm:max-w-md">
                {settings.address}
              </p>
            </div>
          </div>

          {/* Action Controls & Partner Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-brand-900/60 hover:bg-brand-800 text-slate-200 hover:text-white transition-colors border border-brand-700/40"
              aria-label="Toggle dark/light mode"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-gold-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-200" />
              )}
            </button>

            {/* Partner Switcher Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setPartnerMenuOpen(!partnerMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-900/80 hover:bg-brand-800/90 border border-brand-700/50 text-xs text-left transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300 font-bold text-[11px]">
                    {currentUser.partnerName[0]}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="font-semibold text-white leading-tight">
                      {currentUser.partnerName}
                    </span>
                    <span className="text-[10px] text-gold-400 font-medium leading-none">
                      {currentUser.partnerName === 'Madhawa' ? 'Cashier & Mgr' : 'Partner'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {partnerMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                      Signed in as <strong className="text-white">{currentUser.partnerName}</strong>
                    </div>

                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 mt-1">
                      Switch Active Partner:
                    </div>
                    {partners.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          switchDemoUser(p);
                          setPartnerMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors text-left ${
                          currentUser.partnerName === p
                            ? 'text-gold-400 font-semibold bg-brand-950/40'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />
                          <span>{p}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {p === 'Madhawa' ? 'Cashier' : 'Investor'}
                        </span>
                      </button>
                    ))}

                    <div className="border-t border-slate-800 mt-1.5 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setPartnerMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 text-red-400 hover:bg-red-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
