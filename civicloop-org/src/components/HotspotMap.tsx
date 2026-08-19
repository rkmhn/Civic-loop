import React, { useState, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { HotspotCluster, IssueCategory } from '../types';
import { LeafletMap } from './LeafletMap';
import { ScrollReveal } from './ScrollReveal';
import { 
  TRANSLATED_CATEGORIES, 
  tText 
} from '../utils/translator';
import { 
  Flame, 
  Sparkles, 
  MapPin, 
  Vote, 
  CheckCircle2, 
  Clock, 
  Zap,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

export const HotspotMap: React.FC = () => {
  const { 
    hotspots, 
    reports, 
    proposals, 
    generateProposalForHotspot, 
    generateAllProposalsFromHotspots, 
    setActiveTab, 
    setSelectedProposalId,
    selectedCity,
    t,
    language
  } = useCivic();

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(hotspots[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeHotspot = useMemo(() => {
    return hotspots.find(h => h.id === selectedHotspotId) || hotspots[0] || null;
  }, [hotspots, selectedHotspotId]);

  // Reports associated with active hotspot
  const activeClusterReports = useMemo(() => {
    if (!activeHotspot) return [];
    return reports.filter(r => activeHotspot.reportIds.includes(r.id));
  }, [activeHotspot, reports]);

  // Filtered hotspots for map and cards
  const filteredHotspots = useMemo(() => {
    return hotspots.filter(h => {
      const matchCat = selectedCategory === 'all' || h.category === selectedCategory;
      return matchCat;
    });
  }, [hotspots, selectedCategory]);

  // Map markers format
  const mapMarkers = useMemo(() => {
    return filteredHotspots.map(h => ({
      id: h.id,
      lat: h.lat,
      lng: h.lng,
      title: h.title,
      category: h.category,
      count: h.reportCount,
      severity: h.severity,
      isCluster: true,
      onClick: () => setSelectedHotspotId(h.id)
    }));
  }, [filteredHotspots]);

  const handleGenerateProposal = (hotspot: HotspotCluster) => {
    const proposal = generateProposalForHotspot(hotspot.id);
    if (proposal) {
      setSelectedProposalId(proposal.id);
    }
  };

  const handleGoToProposal = (hotspot: HotspotCluster) => {
    const matched = proposals.find(p => p.linkedHotspotId === hotspot.id || (p.category === hotspot.category && p.areaName === hotspot.areaName));
    if (matched) {
      setSelectedProposalId(matched.id);
      setActiveTab('vote');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header Banner - Clean Light Theme with Orange Border */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-orange-500 border-x border-b border-orange-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>🇮🇳 Spatial Intelligence • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t.nav.hotspots}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Nearby citizen complaints cluster spatially into high-impact infrastructure hotspots for capital funding.
              </p>
            </div>

            {/* Batch Action Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={generateAllProposalsFromHotspots}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{tText('Convert to Ballot', language)}</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Main Grid: Interactive Map + Cluster Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Map & Category Filter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <ScrollReveal delay={0.08}>
            {/* Category Filter Chips */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5">
                {['all', 'pothole', 'streetlight', 'drainage', 'garbage'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
                      selectedCategory === cat
                        ? 'bg-rose-50 text-rose-900 font-bold border border-rose-200 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'all' ? t.tracker.allCategories : (TRANSLATED_CATEGORIES[cat as IssueCategory]?.[language] || cat)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>{filteredHotspots.length} {tText('Hotspots Detected', language)}</span>
              </div>
            </div>

            {/* Large Leaflet Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mt-3">
              <LeafletMap
                center={activeHotspot ? [activeHotspot.lat, activeHotspot.lng] : [selectedCity.lat, selectedCity.lng]}
                zoom={13}
                height="450px"
                markers={mapMarkers}
                selectedMarkerId={selectedHotspotId}
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Right: Selected Cluster Detail & Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeHotspot ? (
            <ScrollReveal delay={0.12} direction="left">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 uppercase font-mono">
                      {activeHotspot.severity}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">
                      {tText(activeHotspot.title, language)}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{activeHotspot.areaName} ({selectedCity.name})</span>
                    </p>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                    <span className="text-base font-bold text-rose-600 font-mono block">
                      {activeHotspot.reportCount}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{t.activeTickets}</span>
                  </div>
                </div>

                {/* Hotspot Description */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {tText(activeHotspot.description, language)}
                </p>

                {/* Linked Reports List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {tText('Live Grievance Feed', language)} ({activeClusterReports.length}):
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {activeClusterReports.map(r => (
                      <div
                        key={r.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-900 line-clamp-1">
                            #{r.id} • {tText(r.title, language)}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {r.address}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 shrink-0">
                          {r.upvotes} {t.tracker.upvoted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participatory Budget CTA */}
                <div className="pt-2">
                  {activeHotspot.proposalGenerated ? (
                    <button
                      type="button"
                      onClick={() => handleGoToProposal(activeHotspot)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
                    >
                      <Vote className="w-4 h-4" />
                      <span>{tText('Ballot Created', language)} →</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleGenerateProposal(activeHotspot)}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{tText('Convert to Ballot', language)}</span>
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              {tText('Select a hotspot from the map to inspect merged complaints', language)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
