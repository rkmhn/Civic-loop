import { Report, HotspotCluster, BudgetProposal, DuplicateMatch, IssueCategory } from '../types';
import { DEPARTMENT_MAP } from '../data/departmentConfig';

/**
 * Calculates geographic distance between two points in meters using Haversine formula
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats Indian Rupee currency nicely into Lakhs (L) and Crores (Cr)
 */
export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Stopwords to filter out for term-frequency cosine approximation
 */
const STOPWORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'near', 'by', 'of', 'for',
  'to', 'with', 'from', 'as', 'there', 'here', 'this', 'that', 'it', 'has', 'have', 'been',
  'very', 'too', 'are', 'was', 'were', 'my', 'our', 'all', 'road', 'street', 'lane', 'area',
  'hai', 'pe', 'ke', 'ka', 'ki', 'ko', 'me', 'mai', 'par', 'bhi', 'bahut', 'aur', 'se'
]);

/**
 * Computes semantic token similarity with Indian vernacular and Hinglish vocabulary support
 */
export function computeTextSimilarity(text1: string, text2: string): { similarity: number; commonTokens: string[] } {
  if (!text1 || !text2) return { similarity: 0, commonTokens: [] };

  const tokenize = (txt: string) => {
    return txt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.has(w));
  };

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return { similarity: 0, commonTokens: [] };
  }

  const set2 = new Set(tokens2);
  const intersection = tokens1.filter(token => set2.has(token));
  const uniqueCommon = Array.from(new Set(intersection));

  // Jaccard + Cosine length weighted similarity
  const union = new Set([...tokens1, ...tokens2]);
  const jaccard = uniqueCommon.length / union.size;
  
  // Boost for English & Hindi / Hinglish civic synonyms
  let boost = 0;
  const synonymGroups = [
    ['pothole', 'crater', 'hole', 'gaddha', 'gadda', 'sadak', 'asphalt', 'tar', 'road', 'tarmac', 'khadda'],
    ['light', 'dark', 'lamp', 'bulb', 'night', 'blackout', 'streetlight', 'pole', 'bijli', 'andhera', 'andhera', 'roshni'],
    ['drain', 'water', 'flood', 'sewage', 'overflow', 'pipe', 'culvert', 'clogged', 'smell', 'gutter', 'nala', 'naali', 'manhole', 'paani', 'jal'],
    ['garbage', 'waste', 'trash', 'dump', 'debris', 'litter', 'smell', 'pile', 'kachra', 'kooda', 'kuda', 'gandagi', 'safai'],
    ['leak', 'burst', 'pipe', 'spray', 'water', 'pressure', 'potable', 'supply', 'jalboard', 'peyejal', 'pipeline']
  ];

  for (const group of synonymGroups) {
    const has1 = group.some(word => text1.toLowerCase().includes(word));
    const has2 = group.some(word => text2.toLowerCase().includes(word));
    if (has1 && has2) {
      boost += 0.25;
      break;
    }
  }

  const score = Math.min(0.98, Number((jaccard * 0.65 + boost + 0.15).toFixed(2)));
  return { similarity: score, commonTokens: uniqueCommon };
}

/**
 * Smart Assistant Duplicate Detection
 * Finds existing reports in the same category that are close in distance (< 400m) or high in semantic similarity
 */
export function findDuplicateReports(
  newDescription: string,
  category: IssueCategory,
  lat: number,
  lng: number,
  existingReports: Report[]
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];

  for (const report of existingReports) {
    // Only check unresolved reports
    if (report.status === 'Resolved') continue;

    const isSameCategory = report.category === category;
    const distance = calculateDistanceMeters(lat, lng, report.lat, report.lng);
    
    // Check text similarity
    const { similarity, commonTokens } = computeTextSimilarity(newDescription, `${report.title} ${report.description}`);

    // Combined score: distance proximity + text similarity
    let combinedScore = similarity;
    if (distance < 150) {
      combinedScore += 0.25;
    } else if (distance < 400) {
      combinedScore += 0.15;
    } else if (distance > 1000) {
      combinedScore -= 0.35;
    }

    if (isSameCategory && (combinedScore >= 0.60 || (distance < 250 && similarity > 0.35))) {
      matches.push({
        report,
        similarityScore: Math.min(0.99, Number(combinedScore.toFixed(2))),
        distanceMeters: distance,
        matchedKeywords: commonTokens
      });
    }
  }

  return matches.sort((a, b) => b.similarityScore - a.similarityScore);
}

/**
 * Computes Hotspots using ST_SnapToGrid equivalent
 * Groups reports with gridSize ~ 0.005 degrees (~500m) having >= 3 reports
 */
export function computeHotspotsFromReports(reports: Report[]): HotspotCluster[] {
  const GRID_SIZE = 0.005; // ~500 meters grid step
  const gridMap: Map<string, Report[]> = new Map();

  for (const report of reports) {
    const snapLat = Math.round(report.lat / GRID_SIZE) * GRID_SIZE;
    const snapLng = Math.round(report.lng / GRID_SIZE) * GRID_SIZE;
    const key = `${report.category}_${snapLat.toFixed(3)}_${snapLng.toFixed(3)}`;

    if (!gridMap.has(key)) {
      gridMap.set(key, []);
    }
    gridMap.get(key)!.push(report);
  }

  const clusters: HotspotCluster[] = [];
  let index = 1;

  for (const [, clusterReports] of gridMap.entries()) {
    // Only return clusters with 3 or more reports
    if (clusterReports.length >= 3) {
      const first = clusterReports[0];
      const avgLat = clusterReports.reduce((acc, r) => acc + r.lat, 0) / clusterReports.length;
      const avgLng = clusterReports.reduce((acc, r) => acc + r.lng, 0) / clusterReports.length;

      const areaName = first.address || `${first.category.toUpperCase()} Corridor`;
      const severity: 'Moderate' | 'High' | 'Critical' = 
        clusterReports.length >= 5 ? 'Critical' : clusterReports.length >= 4 ? 'High' : 'Moderate';

      clusters.push({
        id: `hs-auto-${index++}`,
        category: first.category,
        title: `${first.category.charAt(0).toUpperCase() + first.category.slice(1)} Cluster — ${clusterReports.length} Citizen Reports`,
        lat: Number(avgLat.toFixed(4)),
        lng: Number(avgLng.toFixed(4)),
        areaName,
        wardNumber: first.wardNumber || 112,
        cityName: first.cityName || 'Bengaluru',
        reportCount: clusterReports.length,
        reportIds: clusterReports.map(r => r.id),
        severity,
        avgDaysOpen: 4.2,
        proposalGenerated: false
      });
    }
  }

  return clusters;
}

/**
 * Auto-generate real municipal budget proposals in Indian Rupees (₹)
 */
export function generateProposalFromHotspot(hotspot: HotspotCluster, existingProposals: BudgetProposal[]): BudgetProposal {
  const nextId = existingProposals.length > 0 
    ? Math.max(...existingProposals.map(p => p.id)) + 1 
    : 501;

  const title = `Ward #${hotspot.wardNumber || 'Civic'} ${hotspot.category.replace('_', ' ').toUpperCase()} Comprehensive Overhaul`;
  
  // Cost in INR: e.g. ₹12 Lakhs to ₹35 Lakhs based on report count
  const estimatedCost = (hotspot.reportCount * 350000) + 800000;
  const targetVotes = hotspot.reportCount * 45 + 120;

  return {
    id: nextId,
    title,
    titleHindi: `वार्ड समग्र अवसंरचना उन्नयन परियोजना — ${hotspot.reportCount} नागरिक शिकायतें`,
    description: `Evidence-grounded civic project automatically formulated from ${hotspot.reportCount} verified citizen complaints in ${hotspot.areaName}. Allocates dedicated municipal contractor funding to reconstruct sub-base and install permanent civic drainage/lighting assets.`,
    category: hotspot.category,
    areaName: hotspot.areaName,
    wardNumber: hotspot.wardNumber || 112,
    cityName: hotspot.cityName || 'Bengaluru',
    lat: hotspot.lat,
    lng: hotspot.lng,
    linkedReportIds: hotspot.reportIds,
    linkedHotspotId: hotspot.id,
    votes: 4,
    targetVotes,
    estimatedCost,
    allocatedFunding: 0,
    status: 'Voting Open',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    impactScore: Math.min(99, 72 + hotspot.reportCount * 4),
    benefits: [
      `Directly eliminates ${hotspot.reportCount} verified citizen complaints in Ward #${hotspot.wardNumber || 112}`,
      'Permanent high-grade asphalt/concrete laying under PWD 3-year audit warranty',
      'Transparent citizen oversight with milestone-based contractor payments',
      'Protects daily two-wheeler commuters, BMTC buses, and pedestrians'
    ],
    authorityName: 'Municipal Corporation Participatory Fund'
  };
}
