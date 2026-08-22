import React, { useMemo, useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { DEPARTMENT_MAP } from '../data/departmentConfig';
import { formatINR } from '../utils/civicEngine';
import { AnimatedCounter } from './AnimatedCounter';
import { ScrollReveal } from './ScrollReveal';
import { TRANSLATED_DEPARTMENTS, tText } from '../utils/translator';
import { IssueCategory } from '../types';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import {
  BarChart3, CheckCircle2, Flame, TrendingUp, Vote,
  Building2, MapPin, Clock, PieChart as PieIcon, Activity
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  pothole: '#f59e0b', streetlight: '#eab308', drainage: '#06b6d4',
  garbage: '#10b981', road_damage: '#f97316', traffic_signal: '#ef4444', water_leak: '#3b82f6',
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#10b981',
};

const STATUS_COLORS: Record<string, string> = {
  Received: '#f97316', Assigned: '#eab308', 'In Progress': '#3b82f6', Resolved: '#10b981',
};

const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Pothole', streetlight: 'Streetlight', drainage: 'Drainage',
  garbage: 'Garbage', road_damage: 'Road Damage', traffic_signal: 'Traffic Signal', water_leak: 'Water Leak',
};

export const CityAnalytics: React.FC = () => {
  const { reports, hotspots, proposals, selectedCity, t, language } = useCivic();

  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const inProgressReports = reports.filter(r => r.status === 'In Progress').length;
  const receivedReports = reports.filter(r => r.status === 'Received' || r.status === 'Assigned').length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
  const totalFundsAllocated = proposals.reduce((sum, p) => sum + p.allocatedFunding, 0);

  // Category Distribution (Pie Chart)
  const categoryData = useMemo(() => {
    const catCount: Record<string, number> = {};
    reports.forEach(r => { catCount[r.category] = (catCount[r.category] || 0) + 1; });
    return Object.entries(catCount)
      .map(([name, value]) => ({ name: CATEGORY_LABELS[name] || name, value, color: CATEGORY_COLORS[name] || '#94a3b8' }))
      .sort((a, b) => b.value - a.value);
  }, [reports]);

  // Priority Distribution
  const priorityData = useMemo(() => {
    const pCount: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    reports.forEach(r => { pCount[r.priority] = (pCount[r.priority] || 0) + 1; });
    return Object.entries(pCount)
      .map(([name, value]) => ({ name, value, color: PRIORITY_COLORS[name] || '#94a3b8' }))
      .sort((a, b) => b.value - a.value);
  }, [reports]);

  // Status Distribution (Donut)
  const statusData = useMemo(() => {
    const sCount: Record<string, number> = { Received: 0, Assigned: 0, 'In Progress': 0, Resolved: 0 };
    reports.forEach(r => { sCount[r.status] = (sCount[r.status] || 0) + 1; });
    return Object.entries(sCount)
      .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#94a3b8' }))
      .filter(d => d.value > 0);
  }, [reports]);

  // Weekly Activity Trend
  const weeklyTrend = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const filed = new Array(7).fill(0) as number[];
    const resolved = new Array(7).fill(0) as number[];
    reports.forEach(r => {
      const d = new Date(r.createdAt).getDay();
      filed[d]++;
      if (r.status === 'Resolved') {
        const ud = new Date(r.updatedAt).getDay();
        resolved[ud]++;
      }
    });
    return days.map((day, i) => ({ day, filed: filed[i], resolved: resolved[i] }));
  }, [reports]);

  // Top Performing Wards
  const wardRanking = useMemo(() => {
    const wardMap: Record<number, { name: string; total: number; resolved: number }> = {};
    selectedCity.wards.forEach(w => {
      wardMap[w.wardNo] = { name: w.name.split(',')[0], total: 0, resolved: 0 };
    });
    reports.forEach(r => {
      const w = r.wardNumber || selectedCity.wards[0]?.wardNo || 112;
      if (!wardMap[w]) wardMap[w] = { name: `Ward ${w}`, total: 0, resolved: 0 };
      wardMap[w].total++;
      if (r.status === 'Resolved') wardMap[w].resolved++;
    });
    return Object.entries(wardMap)
      .map(([no, data]) => ({
        wardNo: Number(no),
        name: data.name,
        total: data.total,
        resolved: data.resolved,
        rate: data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.rate - a.rate || b.total - a.total)
      .slice(0, 8);
  }, [reports, selectedCity]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-orange-500 border-x border-b border-orange-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold">
                <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
                <span>🇮🇳 Municipal Intelligence • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{t.nav.analytics}</h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Municipal performance indicators, SLA resolution velocity, and participatory budget allocations.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left min-w-[200px] shrink-0">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Governing Body</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{selectedCity.corporation}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">24-Spoke Citizen Engine</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.activeTickets, value: totalReports, sub: `${receivedReports} Assigned/Pending`, color: 'text-orange-600', icon: <TrendingUp className="w-5 h-5" />, iconBg: 'bg-orange-50 text-orange-700 border-orange-200', delay: 0.05 },
          { label: tText('Resolution Rate', language), value: resolutionRate, sub: `${resolvedReports} Resolved`, color: 'text-emerald-700', icon: <CheckCircle2 className="w-5 h-5" />, iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', formatter: (v: number) => `${v}%`, delay: 0.1 },
          { label: tText('Active Hotspots', language), value: hotspots.length, sub: tText('Spatial Intelligence', language), color: 'text-rose-600', icon: <Flame className="w-5 h-5" />, iconBg: 'bg-rose-50 text-rose-700 border-rose-200', delay: 0.15 },
          { label: t.allocatedBudget, value: totalFundsAllocated, sub: `${proposals.length} Citizen Ballots`, color: 'text-slate-900', icon: <Vote className="w-5 h-5" />, iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', formatter: (v: number) => formatINR(v), delay: 0.2 },
        ].map((card, i) => (
          <ScrollReveal key={i} delay={card.delay}>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                <div className={`text-2xl font-bold font-mono ${card.color}`}>
                  <AnimatedCounter value={card.value} formatter={card.formatter} />
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{card.sub}</span>
              </div>
              <div className={`p-3 rounded-xl border ${card.iconBg}`}>{card.icon}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Charts Grid - Category Pie + Priority Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <ScrollReveal delay={0.25}>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900">{tText('Issue Distribution by Category', language)}</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        {/* Priority Distribution */}
        <ScrollReveal delay={0.3}>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900">{tText('Priority Distribution', language)}</h3>
            </div>
            <div className="space-y-3 pt-2">
              {priorityData.map(p => {
                const maxVal = Math.max(...priorityData.map(d => d.value), 1);
                const pct = Math.round((p.value / maxVal) * 100);
                return (
                  <div key={p.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">{p.name}</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{p.value}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Status Donut + Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Donut */}
        <ScrollReveal delay={0.35}>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{tText('Status Overview', language)}</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        {/* Weekly Trend */}
        <ScrollReveal delay={0.4}>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">{tText('Weekly Activity Trend', language)}</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="filed" name="Filed" stroke="#f97316" fill="url(#colorFiled)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" fill="url(#colorResolved)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Top Performing Wards Table */}
      <ScrollReveal delay={0.45}>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">{tText('Top Performing Wards', language)}</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {wardRanking.map((ward, idx) => (
              <div key={ward.wardNo} className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  idx === 1 ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                  idx === 2 ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                  'bg-slate-50 text-slate-500 border border-slate-200'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ward.name}</span>
                    <span className="text-[10px] text-slate-500">Ward #{ward.wardNo}</span>
                  </div>
                  <div className="mt-1 w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${ward.rate}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-emerald-700">{ward.rate}%</span>
                  <div className="text-[10px] text-slate-500">{ward.resolved}/{ward.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
