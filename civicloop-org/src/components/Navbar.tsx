import React, { useState, useEffect, useMemo, memo } from 'react';
import { useCivic } from '../context/CivicContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatedCounter } from './AnimatedCounter';
import { NotificationsBell } from './NotificationsBell';
import { SupportedLanguage } from '../data/translations';
import { tText } from '../utils/translator';
import { formatINR } from '../utils/civicEngine';
import {
  Flame, Vote, Search, PlusCircle, BarChart3, MapPin,
  Globe2, Check, ChevronDown, X, Newspaper, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  native: string;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
];

const LiveMunicipalTicker = memo(({ reportsCount, hotspotsCount, fundingAllocated, t, onDismiss }: {
  reportsCount: number; hotspotsCount: number; fundingAllocated: number;
  t: { liveStatus: string; activeTickets: string; hotspotsDetected: string; allocatedBudget: string };
  onDismiss: () => void;
}) => (
  <div className="bg-slate-50/95 border-b border-slate-200/80 px-3 sm:px-4 py-1 text-[11px] text-slate-600">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
        <span className="relative inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>{t.liveStatus}</span>
        </span>
        <span className="text-slate-600 flex items-center gap-1 shrink-0">
          <span>{t.activeTickets}:</span>
          <strong className="text-orange-600 font-mono font-bold"><AnimatedCounter value={reportsCount} /></strong>
        </span>
        <span className="text-slate-600 flex items-center gap-1 shrink-0">
          <span>{t.hotspotsDetected}:</span>
          <strong className="text-amber-700 font-mono font-bold"><AnimatedCounter value={hotspotsCount} /></strong>
        </span>
        <span className="text-slate-600 flex items-center gap-1 shrink-0">
          <span>{t.allocatedBudget}:</span>
          <strong className="text-emerald-700 font-mono font-bold">
            <AnimatedCounter value={fundingAllocated} formatter={val => formatINR(val)} />
          </strong>
        </span>
      </div>
      <button type="button" onClick={onDismiss} className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
));

const NAV_ITEMS = [
  { path: '/report', labelKey: 'report', icon: PlusCircle },
  { path: '/track', labelKey: 'track', icon: Search },
  { path: '/hotspots', labelKey: 'hotspots', icon: Flame },
  { path: '/vote', labelKey: 'vote', icon: Vote },
  { path: '/feed', labelKey: 'feed', icon: Newspaper },
  { path: '/analytics', labelKey: 'analytics', icon: BarChart3 },
];

export const Navbar: React.FC = () => {
  const { reports, hotspots, proposals, language, setLanguage, t } = useCivic();
  const location = useLocation();
  const navigate = useNavigate();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [tickerDismissed, setTickerDismissed] = useState(false);

  const activeReportsCount = useMemo(() => reports.filter(r => r.status !== 'Resolved').length, [reports]);
  const totalFundingAllocated = useMemo(() => proposals.reduce((acc, p) => acc + p.allocatedFunding, 0), [proposals]);
  const currentLang = useMemo(() => SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0], [language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setLangDropdownOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path: string) => location.pathname === path || (path === '/report' && location.pathname === '/');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-xs transition-colors">
      {!tickerDismissed && (
        <LiveMunicipalTicker
          reportsCount={activeReportsCount}
          hotspotsCount={hotspots.length}
          fundingAllocated={totalFundingAllocated}
          t={t}
          onDismiss={() => setTickerDismissed(true)}
        />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Left: Brand Logo */}
          <button
            type="button"
            onClick={() => navigate('/report')}
            className="flex items-center gap-2.5 text-left cursor-pointer group select-none transition-transform active:scale-95 shrink-0"
          >
            {/* Professional Gradient Logo */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all shrink-0 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FF671F 0%, #FF8C42 25%, #FFFFFF 50%, #138808 75%, #22C55E 100%)' }}>
              {/* Ashoka Chakra SVG */}
              <svg className="w-6 h-6 relative z-10 animate-chakra" viewBox="0 0 48 48" fill="none">
                {/* Outer ring */}
                <circle cx="24" cy="24" r="20" stroke="#1a3a6e" strokeWidth="2.5" fill="none" />
                {/* Inner hub */}
                <circle cx="24" cy="24" r="4" fill="#1a3a6e" />
                {/* 24 Spokes */}
                {Array.from({ length: 24 }, (_, i) => {
                  const angle = (i * 15) * (Math.PI / 180);
                  const x2 = 24 + 18 * Math.cos(angle);
                  const y2 = 24 + 18 * Math.sin(angle);
                  return (
                    <line key={i} x1="24" y1="24" x2={x2} y2={y2} stroke="#1a3a6e" strokeWidth="1.2" strokeLinecap="round" />
                  );
                })}
                {/* Small circle at rim where spokes meet */}
                <circle cx="24" cy="24" r="20" stroke="#1a3a6e" strokeWidth="0.8" fill="none" strokeDasharray="1 4.6" />
              </svg>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight flex items-center">
                <span style={{ background: 'linear-gradient(90deg, #FF671F, #FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Civic</span>
                <span style={{ background: 'linear-gradient(90deg, #1a1a2e, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Loop</span>
                <span style={{ background: 'linear-gradient(90deg, #138808, #22C55E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="text-xs sm:text-sm ml-0.5 font-bold">.in</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`relative px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 rounded-lg ${
                    active ? 'text-orange-600 bg-orange-50 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{t.nav[item.labelKey as keyof typeof t.nav] || item.labelKey}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Language + Notifications + Report CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Notifications Bell */}
            <NotificationsBell />

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setLangDropdownOpen(!langDropdownOpen); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-all"
              >
                <Globe2 className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-medium hidden sm:inline">{currentLang.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute top-full right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1 border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span>Languages (8)</span><span>🇮🇳</span>
                    </div>
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <button key={lang.code} type="button" onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${language === lang.code ? 'bg-orange-50 text-orange-800 font-bold border border-orange-200' : 'text-slate-700 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{lang.native}</span>
                          <span className="text-[10px] text-slate-400">({lang.label})</span>
                        </div>
                        {language === lang.code && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Report CTA */}
            <button
              type="button"
              onClick={() => navigate('/report')}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 ${
                isActive('/report') ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-2 ring-orange-400/50 ring-offset-1' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.nav.report}</span>
            </button>
          </div>
        </div>

        {/* Mobile Scrollable Nav */}
        <div className="md:hidden border-t border-slate-100/90 py-1.5 -mx-3 px-3">
          <nav className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x py-1 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button key={item.path} type="button" onClick={() => navigate(item.path)} className={`relative py-1 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${active ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}>
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{t.nav[item.labelKey as keyof typeof t.nav] || item.labelKey}</span>
                  {active && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
