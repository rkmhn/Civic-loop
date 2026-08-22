import React, { useState, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { useNavigate } from 'react-router-dom';
import { ScrollReveal } from './ScrollReveal';
import { tText } from '../utils/translator';
import {
  Search, Filter, Clock, Flame, Vote, MapPin,
  TrendingUp, ArrowRight, Activity, Users, ThumbsUp,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

type FeedFilter = 'all' | 'reports' | 'proposals' | 'hotspots';

interface FeedItem {
  id: string;
  type: 'report' | 'proposal' | 'hotspot';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status?: string;
  votes?: number;
  severity?: string;
  reportCount?: number;
}

export const CommunityFeed: React.FC = () => {
  const { reports, proposals, hotspots, selectedCity, t, language } = useCivic();
  const navigate = useNavigate();
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const feedItems = useMemo((): FeedItem[] => {
    const items: FeedItem[] = [];

    reports.slice(0, 10).forEach(r => {
      items.push({
        id: `report-${r.id}`,
        type: 'report',
        title: `#${r.id} ${tText(r.title, language)}`,
        description: tText(r.description, language).slice(0, 120) + '...',
        location: r.address,
        timestamp: r.createdAt,
        status: r.status,
        votes: r.upvotes,
      });
    });

    proposals.slice(0, 5).forEach(p => {
      items.push({
        id: `proposal-${p.id}`,
        type: 'proposal',
        title: tText(p.title, language),
        description: tText(p.description, language).slice(0, 120) + '...',
        location: `${p.areaName}, Ward #${p.wardNumber}`,
        timestamp: p.createdAt,
        status: p.status,
        votes: p.votes,
      });
    });

    hotspots.slice(0, 5).forEach(h => {
      items.push({
        id: `hotspot-${h.id}`,
        type: 'hotspot',
        title: tText(h.title, language),
        description: `${h.reportCount} reports clustered in this area`,
        location: h.areaName,
        timestamp: new Date().toISOString(),
        severity: h.severity,
        reportCount: h.reportCount,
      });
    });

    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reports, proposals, hotspots, language]);

  const filteredItems = useMemo(() => {
    return feedItems.filter(item => {
      const matchesFilter = feedFilter === 'all' || item.type === feedFilter.slice(0, -1);
      const matchesSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [feedItems, feedFilter, searchQuery]);

  const stats = useMemo(() => ({
    totalReports: reports.length,
    resolvedReports: reports.filter(r => r.status === 'Resolved').length,
    totalVotes: proposals.reduce((sum, p) => sum + p.votes, 0),
    activeHotspots: hotspots.length,
  }), [reports, proposals, hotspots]);

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'report': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: <Activity className="w-3.5 h-3.5" /> };
      case 'proposal': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: <Vote className="w-3.5 h-3.5" /> };
      case 'hotspot': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', icon: <Flame className="w-3.5 h-3.5" /> };
      default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', icon: <Activity className="w-3.5 h-3.5" /> };
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Funded': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Voting Open': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-orange-500 border-x border-b border-orange-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5 text-orange-600" />
                <span>🇮🇳 {tText('Community Activity', language)} • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {tText('Community Feed', language)}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                {tText('Real-time activity across reports, proposals, and hotspots in your city', language)}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: tText('Total Reports', language), value: stats.totalReports, color: 'text-orange-600', icon: <Activity className="w-4 h-4 text-orange-600" /> },
          { label: tText('Resolved', language), value: stats.resolvedReports, color: 'text-emerald-600', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
          { label: tText('Votes Cast', language), value: stats.totalVotes, color: 'text-blue-600', icon: <ThumbsUp className="w-4 h-4 text-blue-600" /> },
          { label: tText('Hotspots', language), value: stats.activeHotspots, color: 'text-rose-600', icon: <Flame className="w-4 h-4 text-rose-600" /> },
        ].map((stat, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              </div>
              {stat.icon}
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <ScrollReveal delay={0.2}>
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={tText('Search reports, proposals, hotspots...', language)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {([['all', 'All'], ['reports', 'Reports'], ['proposals', 'Proposals'], ['hotspots', 'Hotspots']] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFeedFilter(key as FeedFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  feedFilter === key
                    ? 'bg-orange-50 text-orange-900 border border-orange-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {tText(label, language)}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Feed Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            {tText('No matching items found', language)}
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const tc = getTypeColor(item.type);
            return (
              <ScrollReveal key={item.id} delay={Math.min(idx * 0.03, 0.3)}>
                <div
                  onClick={() => {
                    if (item.type === 'report') navigate('/track');
                    else if (item.type === 'proposal') navigate('/vote');
                    else navigate('/hotspots');
                  }}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className={`p-2 rounded-lg ${tc.bg} ${tc.border} border ${tc.text} shrink-0`}>
                    {tc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{item.location}
                      </span>
                      {item.status && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                      {item.votes !== undefined && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />{item.votes}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                </div>
              </ScrollReveal>
            );
          })
        )}
      </div>
    </div>
  );
};
