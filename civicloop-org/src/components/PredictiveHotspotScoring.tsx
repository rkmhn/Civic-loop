import React, { useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { ScrollReveal } from './ScrollReveal';
import { tText } from '../utils/translator';
import { Brain, TrendingUp, AlertTriangle, MapPin, Flame, ArrowUpRight } from 'lucide-react';
import { IssueCategory } from '../types';

interface PredictiveScore {
  areaName: string;
  wardNumber: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  factors: string[];
  predictedCategory: IssueCategory;
  trend: 'increasing' | 'stable' | 'decreasing';
}

const CATEGORY_ICONS: Record<string, string> = {
  pothole: '🕳️', streetlight: '💡', drainage: '🌊', garbage: '🗑️',
  road_damage: '🚧', traffic_signal: '🚦', water_leak: '💧',
};

export const PredictiveHotspotScoring: React.FC = () => {
  const { reports, hotspots, selectedCity, language } = useCivic();

  const predictions = useMemo((): PredictiveScore[] => {
    const wardData: Record<number, { reports: typeof reports; area: string }> = {};

    reports.forEach(r => {
      const ward = r.wardNumber || 112;
      if (!wardData[ward]) wardData[ward] = { reports: [], area: r.address.split(',')[0] || `Ward ${ward}` };
      wardData[ward].reports.push(r);
    });

    const scores: PredictiveScore[] = Object.entries(wardData).map(([wardStr, data]) => {
      const ward = Number(wardStr);
      const total = data.reports.length;
      const unresolved = data.reports.filter(r => r.status !== 'Resolved').length;
      const critical = data.reports.filter(r => r.priority === 'Critical').length;
      const recent = data.reports.filter(r => {
        const diff = Date.now() - new Date(r.createdAt).getTime();
        return diff < 7 * 24 * 60 * 60 * 1000;
      }).length;

      // Category frequency
      const catCount: Record<string, number> = {};
      data.reports.forEach(r => { catCount[r.category] = (catCount[r.category] || 0) + 1; });
      const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] as IssueCategory || 'pothole';

      // Risk score formula (0-100)
      const baseScore = Math.min(60, total * 5);
      const criticalBoost = critical * 12;
      const recencyBoost = recent * 3;
      const unresolvedBoost = unresolved * 2;
      const riskScore = Math.min(100, Math.round(baseScore + criticalBoost + recencyBoost + unresolvedBoost));

      let riskLevel: PredictiveScore['riskLevel'] = 'Low';
      if (riskScore >= 80) riskLevel = 'Critical';
      else if (riskScore >= 60) riskLevel = 'High';
      else if (riskScore >= 35) riskLevel = 'Medium';

      const factors: string[] = [];
      if (critical > 0) factors.push(`${critical} critical issues`);
      if (recent > 2) factors.push(`${recent} reports this week`);
      if (unresolved > total * 0.6) factors.push('Low resolution rate');
      if (total > 5) factors.push('High complaint density');

      // Trend calculation
      const older = data.reports.filter(r => {
        const diff = Date.now() - new Date(r.createdAt).getTime();
        return diff > 14 * 24 * 60 * 60 * 1000;
      }).length;
      const trend: PredictiveScore['trend'] = recent > older ? 'increasing' : recent < older ? 'decreasing' : 'stable';

      return {
        areaName: data.area,
        wardNumber: ward,
        riskScore,
        riskLevel,
        factors,
        predictedCategory: topCat,
        trend,
      };
    });

    return scores.sort((a, b) => b.riskScore - a.riskScore).slice(0, 8);
  }, [reports]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800', bar: 'bg-rose-500' };
      case 'High': return { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', bar: 'bg-orange-500' };
      case 'Medium': return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', bar: 'bg-amber-500' };
      default: return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', bar: 'bg-emerald-500' };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowUpRight className="w-3 h-3 text-rose-500" />;
      case 'decreasing': return <ArrowUpRight className="w-3 h-3 text-emerald-500 rotate-90" style={{ transform: 'rotate(90deg)' }} />;
      default: return <span className="w-3 h-0.5 bg-slate-400 rounded-full inline-block" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-purple-500 border-x border-b border-purple-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                <span>🇮🇳 AI Predictive Analytics • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {tText('Predictive Hotspot Scoring', language)}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI-powered risk prediction identifies wards likely to generate high complaint volumes based on historical patterns, severity trends, and resolution velocity.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Risk Distribution Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Critical Risk', count: predictions.filter(p => p.riskLevel === 'Critical').length, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
          { label: 'High Risk', count: predictions.filter(p => p.riskLevel === 'High').length, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
          { label: 'Medium Risk', count: predictions.filter(p => p.riskLevel === 'Medium').length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Low Risk', count: predictions.filter(p => p.riskLevel === 'Low').length, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        ].map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className={`p-4 rounded-xl border ${item.bg} flex items-center justify-between`}>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">{item.label}</span>
                <div className={`text-xl font-bold font-mono ${item.color}`}>{item.count}</div>
              </div>
              <AlertTriangle className={`w-5 h-5 ${item.color}`} />
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Predicted Hotspots Table */}
      <ScrollReveal delay={0.2}>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-slate-900">{tText('AI Risk Predictions by Ward', language)}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {predictions.map((pred, idx) => {
              const rc = getRiskColor(pred.riskLevel);
              return (
                <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="text-xs font-bold text-slate-400 w-6 text-center">#{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{pred.areaName}</span>
                      <span className="text-[10px] text-slate-500">Ward #{pred.wardNumber}</span>
                      {getTrendIcon(pred.trend)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {pred.factors.slice(0, 2).map((f, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-lg">{CATEGORY_ICONS[pred.predictedCategory] || '📍'}</span>
                  <div className="w-32 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold ${rc.text}`}>{pred.riskLevel}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-700">{pred.riskScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${rc.bar} transition-all`} style={{ width: `${pred.riskScore}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
