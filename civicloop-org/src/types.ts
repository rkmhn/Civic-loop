export type IssueCategory = 
  | 'pothole' 
  | 'streetlight' 
  | 'drainage' 
  | 'garbage' 
  | 'road_damage' 
  | 'traffic_signal'
  | 'water_leak';

export type IssueStatus = 'Received' | 'Assigned' | 'In Progress' | 'Resolved';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface LocationCoords {
  lat: number;
  lng: number;
  address?: string;
  wardNumber?: number;
  cityName?: string;
}

export interface Report {
  id: number;
  category: IssueCategory;
  title: string;
  description: string;
  photoUrl?: string;
  lat: number;
  lng: number;
  address: string;
  wardNumber?: number;
  cityName?: string;
  status: IssueStatus;
  department: string;
  departmentHindi?: string;
  duplicateOf?: number;
  duplicateCount: number;
  createdAt: string;
  updatedAt: string;
  priority: PriorityLevel;
  upvotes: number;
  assignedTeam?: string;
  estimatedFixDate?: string;
  resolutionPhotoUrl?: string;
  resolutionNotes?: string;
  tags?: string[];
  citizenPhoneMasked?: string;
}

export interface HotspotCluster {
  id: string;
  category: IssueCategory;
  title: string;
  lat: number;
  lng: number;
  areaName: string;
  wardNumber?: number;
  cityName?: string;
  reportCount: number;
  reportIds: number[];
  severity: 'Moderate' | 'High' | 'Critical';
  avgDaysOpen: number;
  proposalGenerated: boolean;
}

export interface BudgetProposal {
  id: number;
  title: string;
  titleHindi?: string;
  description: string;
  category: IssueCategory;
  areaName: string;
  wardNumber?: number;
  cityName?: string;
  lat: number;
  lng: number;
  linkedReportIds: number[];
  linkedHotspotId?: string;
  votes: number;
  targetVotes: number;
  estimatedCost: number; // in INR (₹)
  allocatedFunding: number; // in INR (₹)
  status: 'Draft' | 'Voting Open' | 'Funded' | 'In Execution';
  createdAt: string;
  deadline: string;
  impactScore: number; // 1-100
  benefits: string[];
  authorityName?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actionType: 'report_created' | 'status_updated' | 'duplicate_merged' | 'proposal_generated' | 'vote_cast' | 'department_routed';
  details: string;
  ticketId?: number;
  proposalId?: number;
  department?: string;
  actor: string;
}

export interface DuplicateMatch {
  report: Report;
  similarityScore: number; // 0 to 1
  distanceMeters: number;
  matchedKeywords: string[];
}
