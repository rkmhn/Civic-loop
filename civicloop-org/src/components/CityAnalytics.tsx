import React, { useMemo, useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { DEPARTMENT_MAP } from '../data/departmentConfig';
import { formatINR } from '../utils/civicEngine';
import { AnimatedCounter } from './AnimatedCounter';
import { ScrollReveal } from './ScrollReveal';
import { 
  TRANSLATED_DEPARTMENTS, 
  tText 
} from '../utils/translator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  Vote, 
  Building2, 
  MapPin,
  Clock
} from 'lucide-react';

export const CityAnalytics: React.FC = () => {
  const { reports, hotspots, proposals, selectedCity, t, language } = useCivic();
  const [activeChartTab, setActiveChartTab] = useState<'departments' | 'wards'>('departments');

  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const inProgressReports = reports.filter(r => r.status === 'In Progress').length;
  const receivedReports = reports.filter(r => r.status === 'Received' || r.status === 'Assigned').length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
  const totalFundsAllocated = proposals.reduce((sum, p) => sum + p.allocatedFunding, 0);

  // Department Performance Data
  const departmentChartData = useMemo(() => {
    const map: Record<string, { name: string; resolved: number; inProgress: number; assigned: number; total: number }> = {};

    Object.entries(DEPARTMENT_MAP).forEach(([_, dept]) => {
      const shortName = dept.name.split('(')[0].trim();
      const localizedName = TRANSLATED_DEPARTMENTS[dept.name]?.[language] || shortName;
      map[shortName] = {
        name: localizedName.length > 20 ? localizedName.slice(0, 18) + '…' : localizedName,
        resolved: 0,
        inProgress: 0,
        assigned: 0,
        total: 0
      };
    });

    reports.forEach(r => {
      const deptShort = r.department.split('(')[0].trim();
      const match = Object.values(map).find(m => deptShort.includes(m.name) || m.name.includes(deptShort));
      if (match) {
        match.total += 1;
        if (r.status === 'Resolved') match.resolved += 1;
        else if (r.status === 'In Progress') match.inProgress += 1;
        else match.assigned += 1;
      }
    });

    return Object.values(map).filter(d => d.total > 0);
  }, [reports, language]);

  // Ward Failure Frequency Data
  const wardChartData = useMemo(() => {
    const wardMap: Record<number, { wardName: string; wardNo: number; count: number; resolved: number }> = {};

    selectedCity.wards.forEach(w => {
      wardMap[w.wardNo] = {
        wardName: `W-${w.wardNo} ${w.name.split(',')[0]}`,
        wardNo: w.wardNo,
        count: 0,
        resolved: 0
      };
    });

    reports.forEach(r => {
      const wardNo = r.wardNumber || selectedCity.wards[0]?.wardNo || 112;
      if (!wardMap[wardNo]) {
        wardMap[wardNo] = {
          wardName: `Ward ${wardNo}`,
          wardNo,
          count: 0,
          resolved: 0
        };
      }
      wardMap[wardNo].count += 1;
      if (r.status === 'Resolved') wardMap[wardNo].resolved += 1;
    });

    return Object.values(wardMap).sort((a, b) => b.count - a.count);
  }, [reports, selectedCity]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner - Clean Light Theme with Orange Border */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-orange-500 border-x border-b border-orange-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold">
                <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
                <span>🇮🇳 Municipal Intelligence • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t.nav.analytics}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Municipal performance indicators, SLA resolution velocity, and participatory budget allocations.
              </p>
            </div>

            {/* City Corporation Badge */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left min-w-[200px] shrink-0">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Governing Body</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{selectedCity.corporation}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">24-Spoke Citizen Engine</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <ScrollReveal delay={0.05}>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{t.activeTickets}</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                <AnimatedCounter value={totalReports} />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {receivedReports} {tText('Assigned / Pending', language)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{tText('Resolution Rate', language)}</span>
              <div className="text-2xl font-bold text-emerald-700 font-mono">
                <AnimatedCounter value={resolutionRate} formatter={v => `${v}%`} />
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {resolvedReports} {tText('Resolved', language)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{tText('Active Hotspots', language)}</span>
              <div className="text-2xl font-bold text-rose-600 font-mono">
                <AnimatedCounter value={hotspots.length} />
              </div>
              <span className="text-[11px] text-rose-700 font-semibold">
                {tText('Spatial Intelligence', language)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              <Flame className="w-5 h-5" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{t.allocatedBudget}</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                <AnimatedCounter value={totalFundsAllocated} formatter={v => formatINR(v)} />
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {proposals.length} {tText('Citizen Ballots', language)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Vote className="w-5 h-5" />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Main Chart Section */}
      <ScrollReveal delay={0.25}>
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {tText('Department Performance', language)} & SLA
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {tText('Performance breakdown across municipal departments and wards', language)}
              </p>
            </div>

            {/* Chart toggle tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveChartTab('departments')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeChartTab === 'departments'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tText('By Department', language)}
              </button>
              <button
                type="button"
                onClick={() => setActiveChartTab('wards')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeChartTab === 'wards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tText('By Ward Cluster', language)}
              </button>
            </div>
          </div>

          {/* Recharts Canvas */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'departments' ? (
                <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="assigned" name={tText('Assigned / Pending', language)} fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inProgress" name={tText('In Progress', language)} fill="#eab308" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name={tText('Resolved', language)} fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={wardChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="wardName" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="count" name={t.activeTickets} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name={tText('Resolved', language)} fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
