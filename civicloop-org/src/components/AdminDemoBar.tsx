import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { IssueCategory, PriorityLevel } from '../types';
import { tText } from '../utils/translator';
import { 
  Sparkles, 
  RotateCcw, 
  Vote, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDemoBar: React.FC = () => {
  const { 
    createReport, 
    generateAllProposalsFromHotspots, 
    voteOnProposal, 
    proposals,
    reports,
    updateReportStatus,
    resetToInitialSeedData,
    showNotification,
    selectedCity,
    language
  } = useCivic();

  const [expanded, setExpanded] = useState(false);

  // Simulation 1: Inject a sudden realistic citizen grievance with geocoded coordinates
  const handleSimulateIncident = () => {
    const categories: IssueCategory[] = ['pothole', 'garbage', 'drainage', 'streetlight'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const titles: Record<IssueCategory, string> = {
      'pothole': 'Dangerous multi-tier asphalt cave-in near flyover pillar',
      'garbage': 'Overflowing municipal bulk waste bin blocking pedestrian footpath',
      'drainage': 'Severe knee-deep stormwater backflow submerging bus shelter',
      'streetlight': 'High-tension streetlight mast blackout across 300m arterial road',
      'road_damage': 'Exposed storm drain manhole missing heavy concrete lid',
      'traffic_signal': 'Traffic signal light failure causing road congestion',
      'water_leak': 'Underground drinking water pipeline rupture flooding lane'
    };

    const offsets = [
      { lat: 0.003, lng: 0.004, ward: 112, addr: 'Near 14th Main Arterial Junction' },
      { lat: -0.002, lng: 0.003, ward: 114, addr: 'Opposite Metro Pillar #42' },
      { lat: 0.004, lng: -0.003, ward: 112, addr: 'Near Govt High School Gate' },
      { lat: -0.003, lng: -0.004, ward: 115, addr: 'Behind Ward Water Reservoir' }
    ];
    const pickedOffset = offsets[Math.floor(Math.random() * offsets.length)];

    const result = createReport({
      category: randomCategory,
      title: titles[randomCategory] || 'Municipal infrastructure grievance reported by citizen',
      description: 'Incident verified by nearby residents. Multiple voice notes and high-resolution photo evidence logged in ward dispatch system.',
      lat: selectedCity.lat + pickedOffset.lat,
      lng: selectedCity.lng + pickedOffset.lng,
      address: `${pickedOffset.addr}, Ward ${pickedOffset.ward}, ${selectedCity.name}`,
      wardNumber: pickedOffset.ward,
      cityName: selectedCity.name,
      priority: 'High' as PriorityLevel
    });

    if (result.isDuplicate) {
      showNotification(`⚡ Duplicate detected! Complaint upvoted & merged to #${result.report.id}`, 'info');
    } else {
      showNotification(`🚨 New Ticket #${result.report.id} created & routed to ward squad!`, 'success');
    }
  };

  // Simulation 2: Trigger sudden citizen voting wave
  const handleSimulateVoteWave = () => {
    const activeProposals = proposals.filter(p => p.status === 'Voting Open');
    if (activeProposals.length === 0) {
      showNotification('No active proposals currently open for voting.', 'info');
      return;
    }
    const target = activeProposals[Math.floor(Math.random() * activeProposals.length)];
    const result = voteOnProposal(target.id);
    if (result.funded) {
      showNotification(`🎉 Voting threshold surpassed! ₹${(target.allocatedFunding / 100000).toFixed(1)}L sanctioned for ${target.title}!`, 'success');
    } else {
      showNotification(`🗳️ +1 Verified ballot logged for proposal #${target.id}!`, 'info');
    }
  };

  // Simulation 3: Bulk field engineering squad resolution
  const handleSimulateBulkResolve = () => {
    const unresolved = reports.filter(r => r.status !== 'Resolved');
    if (unresolved.length === 0) {
      showNotification('All logged complaints are currently resolved!', 'info');
      return;
    }
    const target = unresolved[0];
    updateReportStatus(
      target.id, 
      'Resolved', 
      'Field inspection completed by Municipal Works Squad. Photo evidence verified with before/after timestamping.',
      'Ward Quick Response Unit #4'
    );
    showNotification(`✅ Ticket #${target.id} resolved with proof of work!`, 'success');
  };

  return (
    <div className="fixed bottom-3 right-3 z-30 font-sans select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-3 max-w-xs transition-all">
        
        {/* Toggle Header */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">
              {tText('Admin & Simulation Sandbox', language)}
            </span>
          </div>
          <div className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900">
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* Collapsible Action Buttons */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs"
            >
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleSimulateIncident}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-left transition-all"
                >
                  <p className="font-bold text-orange-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-orange-600" /> +1 Incident
                  </p>
                  <p className="text-[10px] text-slate-500">{tText('Voice note, geo-coordinates, & live camera evidence', language)}</p>
                </button>

                <button
                  type="button"
                  onClick={generateAllProposalsFromHotspots}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-left transition-all"
                >
                  <p className="font-bold text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Hotspot ➔ Ballot
                  </p>
                  <p className="text-[10px] text-slate-500">{tText('Convert to Ballot', language)}</p>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateVoteWave}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-all"
                >
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <Vote className="w-3.5 h-3.5 text-emerald-600" /> Ballot Surge
                  </p>
                  <p className="text-[10px] text-slate-500">{tText('Cast Vote', language)}</p>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateBulkResolve}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-left transition-all"
                >
                  <p className="font-bold text-blue-800 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" /> Squad Resolve
                  </p>
                  <p className="text-[10px] text-slate-500">{tText('Resolved', language)}</p>
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={resetToInitialSeedData}
                  className="w-full py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{tText('Reset Demo Data', language)}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
