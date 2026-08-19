import React, { Suspense, lazy } from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ReportForm } from './components/ReportForm';
import { AdminDemoBar } from './components/AdminDemoBar';
import { tText } from './utils/translator';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  Radio,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load secondary/heavy tab components to dramatically accelerate initial mobile load time
const PublicTracker = lazy(() => import('./components/PublicTracker').then(m => ({ default: m.PublicTracker })));
const HotspotMap = lazy(() => import('./components/HotspotMap').then(m => ({ default: m.HotspotMap })));
const VotingBox = lazy(() => import('./components/VotingBox').then(m => ({ default: m.VotingBox })));
const PublicAuditTrail = lazy(() => import('./components/PublicAuditTrail').then(m => ({ default: m.PublicAuditTrail })));
const CityAnalytics = lazy(() => import('./components/CityAnalytics').then(m => ({ default: m.CityAnalytics })));

const TabLoadingFallback = () => (
  <div className="w-full min-h-[320px] flex flex-col items-center justify-center p-8 text-slate-400">
    <Loader2 className="w-7 h-7 text-orange-500 animate-spin mb-3" />
    <span className="text-xs font-semibold text-slate-500">Loading civic module...</span>
  </div>
);

function AppContent() {
  const { activeTab, notification, dismissNotification, t, language } = useCivic();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      {/* Subtle Ambient Background Grid & Horizon Silhouette */}
      <AnimatedBackground />

      {/* Top Tiranga Micro-Ribbon (Saffron, White, Green) */}
      <div className="h-1.5 w-full tiranga-ribbon shadow-xs z-50 sticky top-0" />

      {/* Responsive Navbar with Mobile Drawer & Micro-Interactions */}
      <Navbar />

      {/* Floating Notification Toast with Tiranga Accents */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`fixed top-18 sm:top-22 right-3 sm:right-4 z-50 max-w-[90vw] sm:max-w-md p-3.5 sm:p-4 rounded-2xl bg-white border shadow-xl flex items-start gap-3 text-sm text-slate-800 ${
              notification.type === 'success' 
                ? 'border-emerald-500/40 shadow-emerald-500/10' 
                : notification.type === 'warning' 
                ? 'border-orange-500/40 shadow-orange-500/10' 
                : 'border-blue-500/40 shadow-blue-500/10'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : notification.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs leading-relaxed text-slate-700 font-medium">
              {notification.message}
            </div>
            <button
              onClick={dismissNotification}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Smooth Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Suspense fallback={<TabLoadingFallback />}>
              {activeTab === 'report' && <ReportForm />}
              {activeTab === 'track' && <PublicTracker />}
              {activeTab === 'hotspots' && <HotspotMap />}
              {activeTab === 'vote' && <VotingBox />}
              {activeTab === 'audit' && <PublicAuditTrail />}
              {activeTab === 'analytics' && <CityAnalytics />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Admin & Demo Controller */}
      <AdminDemoBar />

      {/* Footer & Architectural Summary */}
      <footer className="mt-auto border-t border-slate-200 bg-white/95 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 relative z-10">
        <div className="max-w-7xl mx-auto space-y-5">
          
          {/* Indian Flag Civic Workflow Diagram */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 tiranga-ribbon opacity-90" />
            
            <div className="flex items-center justify-between pt-1">
              <h4 className="text-xs uppercase tracking-wider font-bold text-orange-700 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                {tText('The CivicLoop Sovereign Governance Lifecycle • Jan Seva', language)}
              </h4>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold hidden sm:inline-block">
                🇮🇳 {tText('Digital Bharat', language)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3 text-slate-700 font-sans text-xs">
              <div className="p-2.5 sm:p-3 rounded-xl bg-orange-50/80 border border-orange-200/80 space-y-1">
                <span className="font-bold text-orange-800">1. {t.nav.report}</span>
                <p className="text-[11px] text-slate-600">{tText('Audio transcription and location verified', language)}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 space-y-1">
                <span className="font-bold text-blue-800">2. {tText('AI Duplicate Guard', language)}</span>
                <p className="text-[11px] text-slate-600">{tText('Duplicate Complaint Linked', language)}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
                <span className="font-bold text-emerald-800">3. {tText('Auto-Routed', language)}</span>
                <p className="text-[11px] text-slate-600">{tText('Assigned to Ward Squad', language)}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <span className="font-bold text-amber-800">4. {t.nav.hotspots}</span>
                <p className="text-[11px] text-slate-600">{tText('Spatial Intelligence', language)}</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
                <span className="font-bold text-emerald-800">5. {t.nav.vote}</span>
                <p className="text-[11px] text-slate-600">{tText('Participatory Budget Ballot', language)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <p className="text-slate-700 text-center sm:text-left text-xs font-semibold ml-1">
                {tText('CivicLoop India • Transparent Citizen Democracy & Municipal Accountability Portal', language)}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <span className="text-orange-700 font-semibold">Kesari ({tText('Courage', language)})</span>
              <span>•</span>
              <span className="text-slate-600 font-semibold">Shwet ({tText('Truth', language)})</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Harit ({tText('Prosperity', language)})</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CivicProvider>
      <AppContent />
    </CivicProvider>
  );
}
