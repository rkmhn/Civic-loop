import React, { useState, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { IssueStatus, IssueCategory } from '../types';
import { DEPARTMENT_MAP } from '../data/departmentConfig';
import { ScrollReveal } from './ScrollReveal';
import { 
  TRANSLATED_STATUSES, 
  TRANSLATED_DEPARTMENTS, 
  tText 
} from '../utils/translator';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  ThumbsUp, 
  ShieldCheck, 
  MapPin, 
  Building2,
  Calendar,
  ExternalLink,
  Zap,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

const STATUS_STEPS: IssueStatus[] = ['Received', 'Assigned', 'In Progress', 'Resolved'];

export const PublicTracker: React.FC = () => {
  const { 
    reports, 
    selectedReportId, 
    setSelectedReportId, 
    updateReportStatus, 
    upvoteReport, 
    userUpvotes,
    selectedCity,
    t,
    language 
  } = useCivic();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [adminMode, setAdminMode] = useState(false);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');
  const [assignedSquadInput, setAssignedSquadInput] = useState('');

  // Currently selected report or first available
  const activeReport = useMemo(() => {
    if (selectedReportId) {
      const found = reports.find(r => r.id === selectedReportId);
      if (found) return found;
    }
    return reports[0] || null;
  }, [reports, selectedReportId]);

  // Filtered list
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = 
        r.id.toString().includes(searchQuery) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [reports, searchQuery, statusFilter, categoryFilter]);

  const handleAdminStatusChange = (newStatus: IssueStatus) => {
    if (!activeReport) return;
    updateReportStatus(
      activeReport.id, 
      newStatus, 
      resolutionNoteInput.trim() || undefined,
      assignedSquadInput.trim() || undefined
    );
    setResolutionNoteInput('');
  };

  const getStatusIndex = (status: IssueStatus) => STATUS_STEPS.indexOf(status);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner - Clean Light Theme with Emerald Border */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-emerald-600 border-x border-b border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>🇮🇳 {t.liveStatus} • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t.nav.track}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Inspect live progress, assigned squads, and verified municipal resolution timelines.
              </p>
            </div>

            {/* Quick Admin Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 min-w-[200px] shrink-0">
              <div>
                <span className="text-xs text-slate-800 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-orange-600" />
                  {tText('Supervisor / Field Squad Mode', language)}
                </span>
                <p className="text-[10px] text-slate-500">
                  {adminMode ? tText('Status editor active', language) : tText('Read-only view', language)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdminMode(!adminMode)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  adminMode ? 'bg-orange-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    adminMode ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Filterable Ticket Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          
          {/* Search Bar */}
          <ScrollReveal delay={0.08}>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.tracker.searchPlaceholder}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium shadow-sm"
              />
            </div>
          </ScrollReveal>

          {/* Quick Filter Tabs */}
          <ScrollReveal delay={0.12}>
            <div className="flex flex-wrap gap-1 p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              {(['all', 'Received', 'In Progress', 'Resolved'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
                    statusFilter === st
                      ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st === 'all' 
                    ? t.tracker.allStatuses 
                    : (TRANSLATED_STATUSES[st as IssueStatus]?.[language] || st)}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Scrollable Ticket List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredReports.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                {tText('No matching civic complaints found', language)}
              </div>
            ) : (
              filteredReports.map(r => {
                const isSelected = activeReport?.id === r.id;
                const hasUpvoted = userUpvotes.includes(r.id);

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReportId(r.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/50 border-orange-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        #{r.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        r.status === 'Resolved'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : r.status === 'In Progress'
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}>
                        {TRANSLATED_STATUSES[r.status]?.[language] || r.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                      {tText(r.title, language)}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {tText(r.address, language)}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
                      <span className="font-semibold text-orange-700">
                        {TRANSLATED_DEPARTMENTS[r.department]?.[language] || r.department}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          upvoteReport(r.id);
                        }}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold transition-all ${
                          hasUpvoted
                            ? 'bg-orange-100 border-orange-300 text-orange-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{r.upvotes}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Inspection Card (7 cols) */}
        <div className="lg:col-span-7">
          {activeReport ? (
            <ScrollReveal delay={0.15}>
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        Ticket #{activeReport.id}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(activeReport.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-2">
                      {tText(activeReport.title, language)}
                    </h2>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>{tText(activeReport.address, language)} (Ward #{activeReport.wardNumber})</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => upvoteReport(activeReport.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                      userUpvotes.includes(activeReport.id)
                        ? 'bg-orange-50 border-orange-400 text-orange-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{activeReport.upvotes} {userUpvotes.includes(activeReport.id) ? t.tracker.upvoted : t.tracker.upvote}</span>
                  </button>
                </div>

                {/* Progress Stepper */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    {tText('Timeline & Progress', language)}:
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentIdx = getStatusIndex(activeReport.status);
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step} className="text-center space-y-1">
                          <div className={`h-2 rounded-full transition-all ${
                            isComplete ? 'bg-emerald-600' : 'bg-slate-200'
                          }`} />
                          <span className={`text-[10px] font-semibold block ${
                            isCurrent ? 'text-emerald-800 font-bold' : 'text-slate-500'
                          }`}>
                            {TRANSLATED_STATUSES[step]?.[language] || step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description & Evidence */}
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{t.form.descLabel}:</h4>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      "{tText(activeReport.description, language)}"
                    </p>
                  </div>

                  {activeReport.photoUrl && (
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">{t.form.photoBtn}:</h4>
                      <div className="rounded-xl overflow-hidden border border-slate-200 h-44">
                        <img src={activeReport.photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {activeReport.resolutionNotes && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {tText('Verified Resolution Evidence', language)}:
                      </div>
                      <p className="text-xs text-emerald-800">
                        {tText(activeReport.resolutionNotes, language)}
                      </p>
                      {activeReport.assignedTeam && (
                        <p className="text-[11px] text-emerald-700 font-mono pt-1">
                          {tText('Assigned Squad', language)}: {tText(activeReport.assignedTeam, language)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Supervisor Mode Live Controls */}
                {adminMode && (
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-3">
                    <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-orange-600" />
                      {tText('Supervisor / Field Squad Mode', language)}:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {STATUS_STEPS.map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleAdminStatusChange(st)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            activeReport.status === st
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white border-orange-200 text-orange-900 hover:bg-orange-100'
                          }`}
                        >
                          {TRANSLATED_STATUSES[st]?.[language] || st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ) : (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
              {tText('Select a complaint from the left to inspect its live status', language)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
