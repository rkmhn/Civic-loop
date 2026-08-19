import React, { useState, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { ScrollReveal } from './ScrollReveal';
import { tText } from '../utils/translator';
import { 
  ShieldCheck, 
  Search, 
  Lock, 
  Clock,
  ArrowRight
} from 'lucide-react';

export const PublicAuditTrail: React.FC = () => {
  const { auditLogs, setSelectedReportId, setActiveTab, t, selectedCity, language } = useCivic();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchType = filterType === 'all' || log.actionType === filterType;
      const matchSearch = 
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.ticketId && log.ticketId.toString().includes(searchQuery));
      return matchType && matchSearch;
    });
  }, [auditLogs, filterType, searchQuery]);

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'report_created':
        return { label: tText('Report Filed', language), color: 'bg-orange-50 text-orange-800 border-orange-200' };
      case 'status_updated':
        return { label: tText('Status Update', language), color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'duplicate_merged':
        return { label: tText('Duplicate Linked', language), color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'proposal_generated':
        return { label: tText('Budget Proposal', language), color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'vote_cast':
        return { label: tText('Citizen Ballots', language), color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'department_routed':
        return { label: tText('Auto-Routed', language), color: 'bg-orange-50 text-orange-800 border-orange-200' };
      default:
        return { label: tText('Audit Event', language), color: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner - Clean Light Theme with Emerald Border */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-emerald-600 border-x border-b border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                <span>🇮🇳 {tText('Transparency Ledger', language)} • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t.nav.audit}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                {tText('Immutable event log documenting ticket lifecycles, municipal dispatches, and participatory citizen ballots.', language)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">{tText('Anonymized Ledger', language)}</p>
                <p className="text-[11px] text-slate-500">{tText('Citizen PII strictly masked', language)}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter & Search Bar */}
      <ScrollReveal delay={0.08}>
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`${t.tracker.searchPlaceholder}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-wrap gap-1 w-full sm:w-auto">
            {[
              { key: 'all', label: t.tracker.allCategories },
              { key: 'report_created', label: tText('Report Filed', language) },
              { key: 'status_updated', label: tText('Status Update', language) },
              { key: 'vote_cast', label: tText('Citizen Ballots', language) }
            ].map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilterType(f.key)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
                  filterType === f.key
                    ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Audit Log Entries */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            {tText('No matching civic complaints found', language)}
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const badge = getActionBadge(log.actionType);

            return (
              <ScrollReveal key={log.id} delay={0.03 * (index % 10)}>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 font-mono ${badge.color}`}>
                      {badge.label}
                    </span>

                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {tText(log.details, language)}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-mono text-slate-600 font-medium">{tText('Actor', language)}: {tText(log.actor, language)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {log.ticketId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReportId(log.ticketId!);
                        setActiveTab('track');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 shrink-0 self-end sm:self-center"
                    >
                      <span>{t.nav.track} #{log.ticketId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </ScrollReveal>
            );
          })
        )}
      </div>
    </div>
  );
};
