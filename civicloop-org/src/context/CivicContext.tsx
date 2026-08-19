import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report, HotspotCluster, BudgetProposal, AuditLog, IssueCategory, IssueStatus, PriorityLevel } from '../types';
import { INITIAL_REPORTS, INITIAL_HOTSPOTS, INITIAL_PROPOSALS, INITIAL_AUDIT_LOGS } from '../data/seedData';
import { DEPARTMENT_MAP, INDIAN_CITIES, CityPreset } from '../data/departmentConfig';
import { computeHotspotsFromReports, generateProposalFromHotspot } from '../utils/civicEngine';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import confetti from 'canvas-confetti';

interface CivicContextType {
  reports: Report[];
  hotspots: HotspotCluster[];
  proposals: BudgetProposal[];
  auditLogs: AuditLog[];
  activeTab: 'report' | 'track' | 'hotspots' | 'vote' | 'audit' | 'analytics';
  setActiveTab: (tab: 'report' | 'track' | 'hotspots' | 'vote' | 'audit' | 'analytics') => void;
  selectedReportId: number | null;
  setSelectedReportId: (id: number | null) => void;
  selectedProposalId: number | null;
  setSelectedProposalId: (id: number | null) => void;
  selectedCity: CityPreset;
  setSelectedCity: (city: CityPreset) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: typeof TRANSLATIONS['en'];
  userVotes: number[];
  userUpvotes: number[];
  createReport: (data: {
    category: IssueCategory;
    title: string;
    description: string;
    lat: number;
    lng: number;
    address: string;
    wardNumber?: number;
    cityName?: string;
    photoUrl?: string;
    duplicateOf?: number;
    priority?: PriorityLevel;
    citizenPhone?: string;
  }) => { report: Report; isDuplicate: boolean };
  upvoteReport: (reportId: number) => void;
  updateReportStatus: (reportId: number, status: IssueStatus, resolutionNotes?: string, assignedTeam?: string) => void;
  voteOnProposal: (proposalId: number) => { success: boolean; funded: boolean };
  generateProposalForHotspot: (hotspotId: string) => BudgetProposal | null;
  generateAllProposalsFromHotspots: () => number;
  resetToInitialSeedData: () => void;
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  dismissNotification: () => void;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_REPORTS = 'civicloop_reports_in_v1';
const LOCAL_STORAGE_KEY_PROPOSALS = 'civicloop_proposals_in_v1';
const LOCAL_STORAGE_KEY_AUDIT = 'civicloop_audit_in_v1';
const LOCAL_STORAGE_KEY_VOTES = 'civicloop_user_votes_in_v1';
const LOCAL_STORAGE_KEY_UPVOTES = 'civicloop_user_upvotes_in_v1';
const LOCAL_STORAGE_KEY_LANG = 'civicloop_language_v1';

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(INDIAN_CITIES[0]); // Default: Bengaluru
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LANG);
      if (saved && ['en', 'hi', 'ta', 'te', 'kn', 'mr', 'bn'].includes(saved)) {
        return saved as SupportedLanguage;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LANG, lang);
    } catch {}
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [proposals, setProposals] = useState<BudgetProposal[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROPOSALS);
      return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
    } catch {
      return INITIAL_PROPOSALS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUDIT);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [userVotes, setUserVotes] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_VOTES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userUpvotes, setUserUpvotes] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_UPVOTES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'report' | 'track' | 'hotspots' | 'vote' | 'audit' | 'analytics'>('report');
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Compute hotspots whenever reports change
  const [hotspots, setHotspots] = useState<HotspotCluster[]>(() => INITIAL_HOTSPOTS);

  useEffect(() => {
    const computed = computeHotspotsFromReports(reports);
    const withProposalFlags = computed.map(h => {
      const hasProp = proposals.some(p => p.linkedHotspotId === h.id || (p.category === h.category && p.areaName === h.areaName));
      return { ...h, proposalGenerated: hasProp };
    });
    setHotspots(withProposalFlags);
  }, [reports, proposals]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(reports));
      localStorage.setItem(LOCAL_STORAGE_KEY_PROPOSALS, JSON.stringify(proposals));
      localStorage.setItem(LOCAL_STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
      localStorage.setItem(LOCAL_STORAGE_KEY_VOTES, JSON.stringify(userVotes));
      localStorage.setItem(LOCAL_STORAGE_KEY_UPVOTES, JSON.stringify(userUpvotes));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [reports, proposals, auditLogs, userVotes, userUpvotes]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => prev?.message === message ? null : prev);
    }, 5000);
  };

  const dismissNotification = () => setNotification(null);

  const addAuditLog = (entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const createReport = (data: {
    category: IssueCategory;
    title: string;
    description: string;
    lat: number;
    lng: number;
    address: string;
    wardNumber?: number;
    cityName?: string;
    photoUrl?: string;
    duplicateOf?: number;
    priority?: PriorityLevel;
    citizenPhone?: string;
  }) => {
    const nextId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 101;
    const deptInfo = DEPARTMENT_MAP[data.category];
    const department = deptInfo ? deptInfo.name : 'General Public Works';
    const departmentHindi = deptInfo ? deptInfo.hindiName : 'लोक निर्माण विभाग';

    const isDuplicate = !!data.duplicateOf;

    // Mask phone number for Indian privacy norms: +91 98XXX-XX321
    const maskedPhone = data.citizenPhone 
      ? data.citizenPhone.replace(/(\+91\s?\d{2})\d{5}(\d{3})/, '$1XXXXX-$2')
      : '+91 98XXX-XX' + Math.floor(100 + Math.random() * 900);

    const newReport: Report = {
      id: nextId,
      category: data.category,
      title: data.title || `${data.category.toUpperCase()} Issue at ${data.address.split(',')[0]}`,
      description: data.description,
      photoUrl: data.photoUrl || (data.category === 'pothole' ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' : undefined),
      lat: Number(data.lat.toFixed(5)),
      lng: Number(data.lng.toFixed(5)),
      address: data.address,
      wardNumber: data.wardNumber || 112,
      cityName: data.cityName || selectedCity.name,
      status: 'Received',
      department,
      departmentHindi,
      duplicateOf: data.duplicateOf,
      duplicateCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: data.priority || (isDuplicate ? 'High' : 'Medium'),
      upvotes: 1,
      tags: [data.category],
      citizenPhoneMasked: maskedPhone
    };

    setReports(prev => {
      if (data.duplicateOf) {
        return [
          newReport,
          ...prev.map(r => r.id === data.duplicateOf ? { ...r, duplicateCount: r.duplicateCount + 1, upvotes: r.upvotes + 3 } : r)
        ];
      }
      return [newReport, ...prev];
    });

    // Add Audit Log
    addAuditLog({
      actionType: isDuplicate ? 'duplicate_merged' : 'report_created',
      details: isDuplicate 
        ? `Ticket #${nextId} submitted and linked to existing ticket #${data.duplicateOf} via AI Smart Assistant.`
        : `New citizen complaint filed: #${nextId} (${data.category}) in Ward #${newReport.wardNumber}, ${data.address}.`,
      ticketId: nextId,
      department,
      actor: isDuplicate ? 'CivicLoop AI Smart Assistant' : 'Verified Citizen (Jan Seva)'
    });

    addAuditLog({
      actionType: 'department_routed',
      details: `Ticket #${nextId} auto-dispatched to ${department} (${deptInfo.authority}, SLA: ${deptInfo.slaHours}h).`,
      ticketId: nextId,
      department,
      actor: 'CivicLoop Auto-Router'
    });

    showNotification(
      isDuplicate 
        ? `Ticket #${nextId} created & linked to #${data.duplicateOf}! Routed to ${deptInfo.authority}.`
        : `Ticket #${nextId} filed successfully! Dispatched to ${department} (SLA: ${deptInfo.slaHours} Hours).`,
      'success'
    );

    return { report: newReport, isDuplicate };
  };

  const upvoteReport = (reportId: number) => {
    if (userUpvotes.includes(reportId)) {
      showNotification('You have already verified and supported this civic report.', 'info');
      return;
    }

    setUserUpvotes(prev => [...prev, reportId]);
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r));

    addAuditLog({
      actionType: 'vote_cast',
      details: `Citizen endorsement recorded for Ticket #${reportId}. Total validations: ${((reports.find(r => r.id === reportId)?.upvotes || 0) + 1)}`,
      ticketId: reportId,
      actor: 'Community Citizen (+91 Verified)'
    });

    showNotification(`Endorsed Ticket #${reportId}! Public priority raised.`, 'success');
  };

  const updateReportStatus = (reportId: number, status: IssueStatus, resolutionNotes?: string, assignedTeam?: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status,
          updatedAt: new Date().toISOString(),
          resolutionNotes: resolutionNotes || r.resolutionNotes,
          assignedTeam: assignedTeam || r.assignedTeam,
          resolutionPhotoUrl: status === 'Resolved' ? (r.resolutionPhotoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80') : r.resolutionPhotoUrl
        };
      }
      return r;
    }));

    addAuditLog({
      actionType: 'status_updated',
      details: `Ticket #${reportId} updated to [${status}]. ${resolutionNotes ? `Notes: "${resolutionNotes}"` : ''} ${assignedTeam ? `Field Squad: ${assignedTeam}` : ''}`,
      ticketId: reportId,
      actor: 'Municipal Executive Engineer / Ward Inspector'
    });

    showNotification(`Ticket #${reportId} marked as "${status}". Public ledger updated.`, 'info');
  };

  const voteOnProposal = (proposalId: number) => {
    if (userVotes.includes(proposalId)) {
      showNotification('You have already cast your citizen vote for this project.', 'info');
      return { success: false, funded: false };
    }

    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return { success: false, funded: false };

    const newVotes = proposal.votes + 1;
    const isNowFunded = newVotes >= proposal.targetVotes && proposal.status !== 'Funded';

    setUserVotes(prev => [...prev, proposalId]);

    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votes: newVotes,
          status: isNowFunded ? 'Funded' : p.status,
          allocatedFunding: isNowFunded ? p.estimatedCost : p.allocatedFunding
        };
      }
      return p;
    }));

    addAuditLog({
      actionType: 'vote_cast',
      details: `Citizen democratic vote cast for Proposal #${proposalId} ("${proposal.title}"). Total: ${newVotes}/${proposal.targetVotes}.`,
      proposalId,
      actor: `Verified Resident Voter (Aadhaar/OTP Verified)`
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: isNowFunded ? 140 : 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (isNowFunded) {
      showNotification(`🎉 PROJECT FUNDED! Proposal #${proposalId} reached 100% citizen votes and has unlocked municipal contractor funding!`, 'success');
    } else {
      showNotification(`Vote cast! Proposal #${proposalId} has now received ${newVotes} citizen votes.`, 'success');
    }

    return { success: true, funded: isNowFunded };
  };

  const generateProposalForHotspot = (hotspotId: string): BudgetProposal | null => {
    const hotspot = hotspots.find(h => h.id === hotspotId);
    if (!hotspot) return null;

    const newProposal = generateProposalFromHotspot(hotspot, proposals);
    setProposals(prev => [newProposal, ...prev]);

    setHotspots(prev => prev.map(h => h.id === hotspotId ? { ...h, proposalGenerated: true } : h));

    addAuditLog({
      actionType: 'proposal_generated',
      details: `Hotspot Cluster "${hotspot.title}" (${hotspot.reportCount} reports) automatically formulated into Budget Proposal #${newProposal.id} for citizen democratic voting.`,
      proposalId: newProposal.id,
      actor: 'CivicLoop Evidence-Grounded Budget Engine'
    });

    showNotification(`Formulated Budget Proposal #${newProposal.id} from ${hotspot.reportCount} clustered citizen complaints!`, 'success');
    return newProposal;
  };

  const generateAllProposalsFromHotspots = (): number => {
    let createdCount = 0;
    const newProposals: BudgetProposal[] = [];

    for (const hotspot of hotspots) {
      const alreadyHas = proposals.some(p => p.linkedHotspotId === hotspot.id || (p.category === hotspot.category && p.areaName === hotspot.areaName));
      if (!alreadyHas) {
        const p = generateProposalFromHotspot(hotspot, [...proposals, ...newProposals]);
        newProposals.push(p);
        createdCount++;
      }
    }

    if (newProposals.length > 0) {
      setProposals(prev => [...newProposals, ...prev]);
      addAuditLog({
        actionType: 'proposal_generated',
        details: `Batch engine formulated ${newProposals.length} budget proposals from all active complaint clusters across wards.`,
        actor: 'CivicLoop Batch Engine'
      });
      showNotification(`Auto-generated ${newProposals.length} new budget proposals from active hotspots!`, 'success');
    } else {
      showNotification('All active hotspots already have open budget proposals.', 'info');
    }

    return createdCount;
  };

  const resetToInitialSeedData = () => {
    setReports(INITIAL_REPORTS);
    setHotspots(INITIAL_HOTSPOTS);
    setProposals(INITIAL_PROPOSALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setUserVotes([]);
    setUserUpvotes([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY_REPORTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PROPOSALS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_AUDIT);
    localStorage.removeItem(LOCAL_STORAGE_KEY_VOTES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_UPVOTES);
    showNotification('Reset database to clean Indian municipal demo seed state.', 'info');
  };

  return (
    <CivicContext.Provider
      value={{
        reports,
        hotspots,
        proposals,
        auditLogs,
        activeTab,
        setActiveTab,
        selectedReportId,
        setSelectedReportId,
        selectedProposalId,
        setSelectedProposalId,
        selectedCity,
        setSelectedCity,
        language,
        setLanguage,
        t,
        userVotes,
        userUpvotes,
        createReport,
        upvoteReport,
        updateReportStatus,
        voteOnProposal,
        generateProposalForHotspot,
        generateAllProposalsFromHotspots,
        resetToInitialSeedData,
        notification,
        dismissNotification,
        showNotification
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
