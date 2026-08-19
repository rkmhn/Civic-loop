import { IssueCategory } from '../types';

export interface DepartmentInfo {
  name: string;
  hindiName: string;
  authority: string;
  code: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  slaHours: number;
  helpline: string;
  iconName: string;
}

export const DEPARTMENT_MAP: Record<IssueCategory, DepartmentInfo> = {
  pothole: {
    name: 'Roads & Infrastructure (PWD)',
    hindiName: 'सड़क एवं लोक निर्माण विभाग',
    authority: 'PWD / Municipal Corporation',
    code: 'PWD-ROADS',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    slaHours: 48,
    helpline: '1800-425-PWD',
    iconName: 'Hammer',
  },
  streetlight: {
    name: 'Electrical & Street Lighting',
    hindiName: 'विद्युत एवं मार्ग प्रकाश विभाग',
    authority: 'DISCOM / BESCOM / BSES',
    code: 'ELEC-GRID',
    color: '#eab308',
    badgeBg: 'bg-yellow-500/10',
    badgeBorder: 'border-yellow-500/30',
    badgeText: 'text-yellow-400',
    slaHours: 24,
    helpline: '1912 (Toll Free)',
    iconName: 'Zap',
  },
  drainage: {
    name: 'Water Supply & Sewerage Board',
    hindiName: 'जल आपूर्ति एवं सीवरेज बोर्ड',
    authority: 'Jal Board / BWSSB / DJB',
    code: 'JB-SEWER',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400',
    slaHours: 36,
    helpline: '1916 (Jal Seva)',
    iconName: 'Droplets',
  },
  garbage: {
    name: 'Solid Waste & Swachhata Division',
    hindiName: 'स्वच्छ भारत एवं ठोस अपशिष्ट प्रबंधन',
    authority: 'Swachh Bharat Municipal Cell',
    code: 'SBM-WASTE',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400',
    slaHours: 12,
    helpline: '1969 (Swachhata)',
    iconName: 'Trash2',
  },
  road_damage: {
    name: 'Footpaths & Traffic Engineering',
    hindiName: 'फुटपाथ एवं यातायात इंजीनियरिंग',
    authority: 'Urban Development Authority',
    code: 'UDA-FOOTPATH',
    color: '#f97316',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    slaHours: 72,
    helpline: '1800-425-URBAN',
    iconName: 'AlertTriangle',
  },
  traffic_signal: {
    name: 'Traffic Police & Smart Signals',
    hindiName: 'यातायात पुलिस एवं स्मार्ट सिग्नल',
    authority: 'City Traffic Police & ICCC',
    code: 'TP-SIGNALS',
    color: '#ef4444',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-400',
    slaHours: 8,
    helpline: '1095 / 112',
    iconName: 'Activity',
  },
  water_leak: {
    name: 'Municipal Water Pipeline Division',
    hindiName: 'मुख्य पेयजल पाइपलाइन प्रभाग',
    authority: 'Jal Sansthan / Water Works',
    code: 'JB-MAINS',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400',
    slaHours: 18,
    helpline: '1916 (Emergency Leak)',
    iconName: 'Waves',
  }
};

export const CATEGORY_DETAILS: Record<IssueCategory, {
  label: string;
  hindiLabel: string;
  description: string;
  hindiDescription: string;
  defaultTitle: string;
  suggestedTags: string[];
  icon: string;
}> = {
  pothole: {
    label: 'Pothole & Surface Crater',
    hindiLabel: 'सड़क का गड्ढा (Pothole)',
    description: 'Dangerous road crater, tarmac breakage risking two-wheelers and autos',
    hindiDescription: 'सड़क पर गहरा गड्ढा जिससे बाइक/स्कूटर व ऑटो चालकों को दुर्घटना का खतरा है',
    defaultTitle: 'Dangerous Pothole on Main Carriageway',
    suggestedTags: ['deep-crater', 'two-wheeler-hazard', 'monsoon-gaddha', 'main-road'],
    icon: 'Hammer'
  },
  streetlight: {
    label: 'Streetlight / Dark Spot',
    hindiLabel: 'स्ट्रीट लाइट बंद / अंधेरा (Streetlight)',
    description: 'Non-functioning street lamps, flickering fixtures, unlit dark stretch at night',
    hindiDescription: 'स्ट्रीट लाइट खराब होने से सड़क पर अंधेरा है, पैदल यात्रियों के लिए असुरक्षित',
    defaultTitle: 'Streetlight Blackout Creating Dark Zone',
    suggestedTags: ['night-safety', 'dark-stretch', 'women-safety', 'flickering-pole'],
    icon: 'Zap'
  },
  drainage: {
    label: 'Open Drain / Nala Overflow',
    hindiLabel: 'खुला नाला / सीवर ओवरफ्लो (Drainage)',
    description: 'Blocked monsoon drain, open manhole, sewage overflow causing foul smell',
    hindiDescription: 'नाला जाम, खुला मैनहोल या गंदा पानी सड़क पर बहने से बदबू व बीमारी का खतरा',
    defaultTitle: 'Stormwater Nala Blocked & Overflowing',
    suggestedTags: ['open-nala', 'waterlogging', 'foul-smell', 'open-manhole'],
    icon: 'Droplets'
  },
  garbage: {
    label: 'Garbage Dump / Kachra',
    hindiLabel: 'कचरे का ढेर / कचरा डंप (Garbage Dump)',
    description: 'Unattended municipal waste pile, overflowing public bins, illegal street dumping',
    hindiDescription: 'सड़क किनारे या खाली प्लॉट पर कचरे का ढेर, दुर्गंध और मवेशियों का जमावड़ा',
    defaultTitle: 'Unattended Waste & Garbage Pileup',
    suggestedTags: ['kachra-dump', 'overflowing-bin', 'swachhata', 'foul-odor'],
    icon: 'Trash2'
  },
  road_damage: {
    label: 'Broken Footpath & Divider',
    hindiLabel: 'टूटा फुटपाथ / डिवाइडर (Footpath)',
    description: 'Damaged pedestrian sidewalk, broken paver blocks, missing zebra crossing',
    hindiDescription: 'पैदल चलने का फुटपाथ टूटा हुआ है, वरिष्ठ नागरिकों व बच्चों के लिए खतरनाक',
    defaultTitle: 'Broken Footpath Paver Blocks & Kerb',
    suggestedTags: ['pedestrian-risk', 'broken-pavement', 'senior-citizen-hazard'],
    icon: 'AlertTriangle'
  },
  traffic_signal: {
    label: 'Traffic Signal Failure',
    hindiLabel: 'ट्रैफिक सिग्नल खराब (Traffic Signal)',
    description: 'Dead traffic lights, non-functional countdown timer, junction bottleneck',
    hindiDescription: 'चौराहे की ट्रैफिक लाइट बंद है, जिससे भीषण जाम और दुर्घटना की संभावना है',
    defaultTitle: 'Traffic Signal Dead at Major Junction',
    suggestedTags: ['junction-jam', 'traffic-gridlock', 'blind-spot'],
    icon: 'Activity'
  },
  water_leak: {
    label: 'Drinking Water Pipeline Leak',
    hindiLabel: 'पेयजल पाइपलाइन लीकेज (Water Leak)',
    description: 'Clean drinking water gushing from underground pipe, loss of municipal water supply',
    hindiDescription: 'मुख्य पेयजल पाइपलाइन फटने से हजारों लीटर पीने का पानी सड़क पर बह रहा है',
    defaultTitle: 'High-Pressure Clean Water Pipe Burst',
    suggestedTags: ['water-wastage', 'pipeline-burst', 'low-pressure'],
    icon: 'Waves'
  }
};

export interface CityPreset {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  corporation: string;
  lat: number;
  lng: number;
  zoom: number;
  wards: { name: string; wardNo: number; lat: number; lng: number }[];
}

export const INDIAN_CITIES: CityPreset[] = [
  {
    id: 'blr',
    name: 'Bengaluru',
    hindiName: 'बेंगलुरु',
    state: 'Karnataka',
    corporation: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    lat: 12.9716,
    lng: 77.5946,
    zoom: 13,
    wards: [
      { name: '100ft Road, Indiranagar', wardNo: 112, lat: 12.9784, lng: 77.6408 },
      { name: '80ft Road, 4th Block, Koramangala', wardNo: 151, lat: 12.9352, lng: 77.6245 },
      { name: '27th Main, Sector 1, HSR Layout', wardNo: 174, lat: 12.9121, lng: 77.6445 },
      { name: 'Whitefield Main Road (Near ITPL)', wardNo: 85, lat: 12.9868, lng: 77.7381 },
      { name: '9th Block, Jayanagar', wardNo: 169, lat: 12.9250, lng: 77.5938 },
      { name: 'Outer Ring Road, Bellandur', wardNo: 150, lat: 12.9304, lng: 77.6784 },
    ]
  },
  {
    id: 'del',
    name: 'Delhi NCR',
    hindiName: 'दिल्ली',
    state: 'Delhi',
    corporation: 'Municipal Corporation of Delhi (MCD)',
    lat: 28.6139,
    lng: 77.2090,
    zoom: 13,
    wards: [
      { name: 'Connaught Place, Inner Circle', wardNo: 42, lat: 28.6315, lng: 77.2167 },
      { name: 'Laxmi Nagar Main Vikas Marg', wardNo: 148, lat: 28.6304, lng: 77.2773 },
      { name: 'Lajpat Nagar Central Market', wardNo: 156, lat: 28.5677, lng: 77.2433 },
      { name: 'Rohini Sector 7 Main Road', wardNo: 53, lat: 28.7159, lng: 77.1132 },
    ]
  },
  {
    id: 'mum',
    name: 'Mumbai',
    hindiName: 'मुंबई',
    state: 'Maharashtra',
    corporation: 'Brihanmumbai Municipal Corporation (BMC)',
    lat: 19.0760,
    lng: 72.8777,
    zoom: 13,
    wards: [
      { name: 'SV Road, Andheri West', wardNo: 64, lat: 19.1197, lng: 72.8464 },
      { name: 'Linking Road, Bandra West', wardNo: 98, lat: 19.0596, lng: 72.8295 },
      { name: 'Dadar TT Circle, Central', wardNo: 182, lat: 19.0178, lng: 72.8478 },
      { name: 'Powai Hiranandani Galleria', wardNo: 121, lat: 19.1197, lng: 72.9051 },
    ]
  },
  {
    id: 'hyd',
    name: 'Hyderabad',
    hindiName: 'हैदराबाद',
    state: 'Telangana',
    corporation: 'Greater Hyderabad Municipal Corp (GHMC)',
    lat: 17.3850,
    lng: 78.4867,
    zoom: 13,
    wards: [
      { name: 'Hitec City, Cyber Towers Junction', wardNo: 104, lat: 17.4504, lng: 78.3808 },
      { name: 'Road No 36, Jubilee Hills', wardNo: 92, lat: 17.4319, lng: 78.4073 },
      { name: 'Madhapur 100ft Road', wardNo: 106, lat: 17.4483, lng: 78.3915 },
      { name: 'Charminar Heritage Plaza', wardNo: 55, lat: 17.3616, lng: 78.4747 },
    ]
  },
  {
    id: 'bbsr',
    name: 'Bhubaneswar',
    hindiName: 'भुवनेश्वर',
    state: 'Odisha',
    corporation: 'Bhubaneswar Municipal Corporation (BMC)',
    lat: 20.2961,
    lng: 85.8245,
    zoom: 13,
    wards: [
      { name: 'Janpath Road, Saheed Nagar', wardNo: 30, lat: 20.2912, lng: 85.8456 },
      { name: 'KIIT Square, Patia', wardNo: 1, lat: 20.3540, lng: 85.8190 },
      { name: 'Khandagiri Square, NH-16', wardNo: 62, lat: 20.2600, lng: 85.7865 },
      { name: 'Master Canteen, Railway Station Road', wardNo: 34, lat: 20.2660, lng: 85.8390 },
    ]
  },
  {
    id: 'ctc',
    name: 'Cuttack',
    hindiName: 'कटक',
    state: 'Odisha',
    corporation: 'Cuttack Municipal Corporation (CMC)',
    lat: 20.4625,
    lng: 85.8828,
    zoom: 13,
    wards: [
      { name: 'Badambadi Bus Stand Road', wardNo: 22, lat: 20.4550, lng: 85.8750 },
      { name: 'Choudhury Bazar Main Road', wardNo: 15, lat: 20.4670, lng: 85.8890 },
      { name: 'Ring Road, Mahanadi Bank', wardNo: 8, lat: 20.4780, lng: 85.8650 },
      { name: 'College Square, Ravenshaw Unit', wardNo: 29, lat: 20.4610, lng: 85.8980 },
    ]
  },
  {
    id: 'pune',
    name: 'Pune',
    hindiName: 'पुणे',
    state: 'Maharashtra',
    corporation: 'Pune Municipal Corporation (PMC)',
    lat: 18.5204,
    lng: 73.8567,
    zoom: 13,
    wards: [
      { name: 'FC Road, Shivaji Nagar', wardNo: 14, lat: 18.5284, lng: 73.8420 },
      { name: 'Baner High Street, West Pune', wardNo: 8, lat: 18.5590, lng: 73.7868 },
      { name: 'Koregaon Park North Main Road', wardNo: 21, lat: 18.5362, lng: 73.8940 },
      { name: 'Viman Nagar Symbiosis Road', wardNo: 4, lat: 18.5679, lng: 73.9143 },
    ]
  }
];
