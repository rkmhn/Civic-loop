import React, { useState, useEffect, useMemo, memo } from 'react';
import { useCivic } from '../context/CivicContext';
import { INDIAN_CITIES } from '../data/departmentConfig';
import { formatINR } from '../utils/civicEngine';
import { AnimatedCounter } from './AnimatedCounter';
import { SupportedLanguage } from '../data/translations';
import { tText } from '../utils/translator';
import { 
  Flame, 
  Vote, 
  Search, 
  PlusCircle, 
  BarChart3, 
  ShieldCheck, 
  MapPin, 
  Globe2, 
  Check, 
  ChevronDown,
  X
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
  { code: 'bn', label: 'Bengali', native: 'বাংলা' }
];

// Memoized Live Ticker to avoid re-rendering on parent navigation state changes
const LiveMunicipalTicker = memo(({
  reportsCount,
  hotspotsCount,
  fundingAllocated,
  t,
  onDismiss
}: {
  reportsCount: number;
  hotspotsCount: number;
  fundingAllocated: number;
  t: { liveStatus: string; activeTickets: string; hotspotsDetected: string; allocatedBudget: string };
  onDismiss: () => void;
}) => {
  return (
    <div className="bg-slate-50/95 border-b border-slate-200/80 px-3 sm:px-4 py-1 text-[11px] text-slate-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          {/* Live Indicator */}
          <span className="relative inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span>{t.liveStatus}</span>
          </span>

          {/* Active Complaints */}
          <span className="text-slate-600 flex items-center gap-1 shrink-0">
            <span>{t.activeTickets}:</span>
            <strong className="text-orange-600 font-mono font-bold">
              <AnimatedCounter value={reportsCount} />
            </strong>
          </span>

          {/* Problem Hotspots */}
          <span className="text-slate-600 flex items-center gap-1 shrink-0">
            <span>{t.hotspotsDetected}:</span>
            <strong className="text-amber-700 font-mono font-bold">
              <AnimatedCounter value={hotspotsCount} />
            </strong>
          </span>

          {/* Community Budget Allocated */}
          <span className="text-slate-600 flex items-center gap-1 shrink-0">
            <span>{t.allocatedBudget}:</span>
            <strong className="text-emerald-700 font-mono font-bold">
              <AnimatedCounter value={fundingAllocated} formatter={val => formatINR(val)} />
            </strong>
          </span>
        </div>

        {/* Dismiss Ticker Button */}
        <button 
          type="button"
          onClick={onDismiss}
          title="Dismiss ticker"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    reports, 
    hotspots, 
    proposals, 
    selectedCity, 
    setSelectedCity,
    language,
    setLanguage,
    t
  } = useCivic();
  
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [tickerDismissed, setTickerDismissed] = useState(false);

  // Memoize counts to prevent redundant recalculation
  const activeReportsCount = useMemo(() => reports.filter(r => r.status !== 'Resolved').length, [reports]);
  const totalFundingAllocated = useMemo(() => proposals.reduce((acc, p) => acc + p.allocatedFunding, 0), [proposals]);

  const currentLang = useMemo(() => 
    SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );

  // Close dropdowns on escape key or outside interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCityDropdownOpen(false);
        setLangDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const PRIMARY_NAV_ITEMS = useMemo(() => [
    { id: 'track' as const, label: t.nav.track, icon: Search },
    { id: 'hotspots' as const, label: t.nav.hotspots, icon: Flame },
    { id: 'vote' as const, label: t.nav.vote, icon: Vote }
  ], [t.nav.track, t.nav.hotspots, t.nav.vote]);

  const SECONDARY_NAV_ITEMS = useMemo(() => [
    { 
      id: 'analytics' as const, 
      label: t.nav.analytics, 
      desc: tText('Performance breakdown across municipal departments and wards', language),
      icon: BarChart3 
    },
    { 
      id: 'audit' as const, 
      label: t.nav.audit, 
      desc: tText('Immutable event log documenting ticket lifecycles, municipal dispatches, and participatory citizen ballots.', language),
      icon: ShieldCheck 
    }
  ], [t.nav.analytics, t.nav.audit, language]);

  // Combined full list for horizontally scrollable mobile row
  const ALL_MOBILE_NAV_ITEMS = useMemo(() => [
    { id: 'report' as const, label: t.nav.report, icon: PlusCircle, isReportCta: true },
    { id: 'track' as const, label: t.nav.track, icon: Search, isReportCta: false },
    { id: 'hotspots' as const, label: t.nav.hotspots, icon: Flame, isReportCta: false },
    { id: 'vote' as const, label: t.nav.vote, icon: Vote, isReportCta: false },
    { id: 'analytics' as const, label: t.nav.analytics, icon: BarChart3, isReportCta: false },
    { id: 'audit' as const, label: t.nav.audit, icon: ShieldCheck, isReportCta: false },
  ], [t.nav.report, t.nav.track, t.nav.hotspots, t.nav.vote, t.nav.analytics, t.nav.audit]);

  const isMoreActive = activeTab === 'analytics' || activeTab === 'audit';

  const handleNavClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCityDropdownOpen(false);
    setLangDropdownOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-xs transition-colors">
      
      {/* Top Live Municipal Status Ticker */}
      {!tickerDismissed && (
        <LiveMunicipalTicker
          reportsCount={activeReportsCount}
          hotspotsCount={hotspots.length}
          fundingAllocated={totalFundingAllocated}
          t={t}
          onDismiss={() => setTickerDismissed(true)}
        />
      )}

      {/* Main Navigation Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Left: Brand Logo & City Selector */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              type="button"
              onClick={() => handleNavClick('report')}
              className="flex items-center gap-2 text-left cursor-pointer group select-none transition-transform active:scale-95"
            >
              {/* Minimalist CivicLoop Emblem */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all shrink-0">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-6.36-2.64" />
                  <path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64" stroke="#10b981" />
                  <circle cx="12" cy="12" r="2.5" fill="#ffffff" stroke="none" />
                </svg>
              </div>

              <div>
                <div className="flex items-center">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center">
                    <span className="text-orange-600">Civic</span>
                    <span className="text-slate-900">Loop</span>
                    <span className="text-emerald-600 text-xs sm:text-sm ml-0.5 font-bold">.in</span>
                  </span>
                </div>
              </div>
            </button>

            {/* City Selector Dropdown */}
            <div className="relative ml-1 sm:ml-2">
              <button
                type="button"
                onClick={() => {
                  setCityDropdownOpen(!cityDropdownOpen);
                  setLangDropdownOpen(false);
                  setMoreDropdownOpen(false);
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all max-w-[120px] sm:max-w-none"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="text-slate-900 truncate">{selectedCity.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
              </button>

              <AnimatePresence>
                {cityDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50"
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                      <span>Select Municipal Corporation</span>
                      <span>🇮🇳</span>
                    </div>
                    {INDIAN_CITIES.map(city => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                          selectedCity.id === city.id 
                            ? 'bg-orange-50 text-orange-800 font-bold border border-orange-200' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{city.name}</div>
                          <div className="text-[10px] text-slate-500">{city.corporation}</div>
                        </div>
                        {selectedCity.id === city.id && <Check className="w-4 h-4 text-orange-600" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation Links (>= 768px) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            {PRIMARY_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-orange-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-orange-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}

            {/* "More" Dropdown Menu for Secondary Items */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMoreDropdownOpen(!moreDropdownOpen);
                  setLangDropdownOpen(false);
                  setCityDropdownOpen(false);
                }}
                className={`py-1 text-sm font-semibold transition-colors flex items-center gap-1 ${
                  isMoreActive
                    ? 'text-orange-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tText('More', language)}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                {isMoreActive && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-orange-600 rounded-full"
                  />
                )}
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50"
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                      {tText('More', language)}
                    </div>
                    {SECONDARY_NAV_ITEMS.map(item => {
                      const Icon = item.icon;
                      const isItemActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
                            isItemActive 
                              ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200' 
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${isItemActive ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs">{item.label}</div>
                            <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action: Language Selector & Standout CTA Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Dropdown (8 Languages) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setCityDropdownOpen(false);
                  setMoreDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-all min-h-[34px] sm:min-h-[36px]"
                title="Select Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-medium">{currentLang.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50"
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1 border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span>Languages (8)</span>
                      <span>🇮🇳</span>
                    </div>
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                          language === lang.code
                            ? 'bg-orange-50 text-orange-800 font-bold border border-orange-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
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

            {/* Desktop Standout "Report Issue" Button */}
            <button
              type="button"
              onClick={() => handleNavClick('report')}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0 min-h-[38px] ${
                activeTab === 'report'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-2 ring-orange-400/50 ring-offset-1'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.nav.report}</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontally Scrollable Nav Row (< 768px) */}
        <div className="md:hidden border-t border-slate-100/90 py-1.5 -mx-3 px-3">
          <nav 
            className="flex items-center gap-5 overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x overscroll-x-contain py-1 px-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {ALL_MOBILE_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isReportCta) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`relative py-1 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'text-orange-600'
                        : 'text-orange-600/90 hover:text-orange-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'text-orange-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
