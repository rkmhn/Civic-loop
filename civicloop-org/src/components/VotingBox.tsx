import React, { useState, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { BudgetProposal, IssueCategory } from '../types';
import { formatINR } from '../utils/civicEngine';
import { ScrollReveal } from './ScrollReveal';
import { 
  TRANSLATED_CATEGORIES, 
  tText 
} from '../utils/translator';
import confetti from 'canvas-confetti';
import { 
  Vote, 
  Sparkles, 
  CheckCircle2, 
  IndianRupee, 
  Users, 
  MapPin, 
  Check,
  Building,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VotingBox: React.FC = () => {
  const { 
    proposals, 
    voteOnProposal, 
    userVotes, 
    generateAllProposalsFromHotspots, 
    selectedCity,
    t,
    language
  } = useCivic();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [justVotedId, setJustVotedId] = useState<number | null>(null);

  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      const matchCity = !p.cityName || p.cityName === selectedCity.name;
      return matchCat && matchCity;
    });
  }, [proposals, filterCategory, selectedCity]);

  const totalFundAllocated = useMemo(() => {
    return filteredProposals.reduce((acc, p) => acc + (p.status === 'Funded' ? p.estimatedCost : p.allocatedFunding), 0);
  }, [filteredProposals]);

  const totalVotesCast = useMemo(() => {
    return filteredProposals.reduce((acc, p) => acc + p.votes, 0);
  }, [filteredProposals]);

  const handleVote = (proposalId: number) => {
    voteOnProposal(proposalId);
    setJustVotedId(proposalId);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
    setTimeout(() => setJustVotedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner - Clean Light Theme with Emerald Border */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-emerald-600 border-x border-b border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Vote className="w-3.5 h-3.5 text-emerald-600" />
                <span>🇮🇳 {t.voting.ballotHeader} • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t.voting.ballotHeader}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.voting.ballotSubtitle}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[120px]">
                <span className="text-base font-bold text-emerald-700 font-mono block">
                  {formatINR(totalFundAllocated)}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{t.allocatedBudget}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
                <span className="text-base font-bold text-slate-900 font-mono block">
                  {totalVotesCast}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{tText('Citizen Ballots', language)}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter and Actions Bar */}
      <ScrollReveal delay={0.08}>
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {['all', 'pothole', 'streetlight', 'drainage', 'road_damage'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`text-xs px-3 py-1 rounded-lg transition-all font-medium ${
                  filterCategory === cat
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? t.tracker.allCategories : (TRANSLATED_CATEGORIES[cat as IssueCategory]?.[language] || cat)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={generateAllProposalsFromHotspots}
            className="px-3.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>{tText('Convert to Ballot', language)}</span>
          </button>
        </div>
      </ScrollReveal>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.length === 0 ? (
          <div className="col-span-full p-12 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            {tText('No matching civic complaints found', language)}
          </div>
        ) : (
          filteredProposals.map((proposal, idx) => {
            const hasVoted = userVotes.includes(proposal.id);
            const isFunded = proposal.status === 'Funded';
            const progressPercent = Math.min(100, Math.round((proposal.votes / proposal.requiredVotes) * 100));

            return (
              <ScrollReveal key={proposal.id} delay={0.08 * (idx % 6)}>
                <div className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between h-full shadow-sm hover:shadow-md ${
                  isFunded ? 'border-emerald-300 ring-1 ring-emerald-300/50' : 'border-slate-200'
                }`}>
                  <div className="space-y-3">
                    {/* Status badge & Cost */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono border ${
                        isFunded
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-orange-50 border-orange-300 text-orange-800'
                      }`}>
                        {isFunded ? `✓ ${t.voting.fundedBadge}` : tText('Cast Vote', language)}
                      </span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {formatINR(proposal.estimatedCost)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {tText(proposal.title, language)}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>{proposal.areaName} (Ward #{proposal.wardNumber})</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {tText(proposal.description, language)}
                    </p>

                    {/* Progress to Funding Goal */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">{t.voting.fundGoal}</span>
                        <span className="font-mono font-bold text-slate-900">
                          {proposal.votes} / {proposal.requiredVotes} ({progressPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFunded ? 'bg-emerald-600' : 'bg-orange-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vote Button */}
                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isFunded}
                      onClick={() => handleVote(proposal.id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isFunded
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                          : hasVoted
                          ? 'bg-orange-50 text-orange-900 border border-orange-200'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white active:scale-98'
                      }`}
                    >
                      {isFunded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.voting.fundedBadge}</span>
                        </>
                      ) : hasVoted ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-orange-600" />
                          <span>{t.voting.voted} ({proposal.votes})</span>
                        </>
                      ) : (
                        <>
                          <Vote className="w-3.5 h-3.5" />
                          <span>{t.voting.castVote}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })
        )}
      </div>
    </div>
  );
};
