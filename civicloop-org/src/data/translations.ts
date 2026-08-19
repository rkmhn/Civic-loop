export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr' | 'bn' | 'or';

export interface LanguageMeta {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<SupportedLanguage, {
  portalTitle: string;
  tagline: string;
  liveStatus: string;
  activeTickets: string;
  hotspotsDetected: string;
  allocatedBudget: string;
  voteCta: string;
  nav: {
    report: string;
    track: string;
    hotspots: string;
    vote: string;
    analytics: string;
    audit: string;
  };
  categories: {
    pothole: string;
    streetlight: string;
    drainage: string;
    garbage: string;
    road_damage: string;
    traffic_signal: string;
    water_leak: string;
  };
  status: {
    Received: string;
    Assigned: string;
    InProgress: string;
    Resolved: string;
  };
  form: {
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    step3Title: string;
    step3Subtitle: string;
    categoryLabel: string;
    titleLabel: string;
    descLabel: string;
    voiceBtn: string;
    photoBtn: string;
    submitBtn: string;
    locationLabel: string;
    wardLabel: string;
    duplicateNotice: string;
    supportExisting: string;
  };
  tracker: {
    searchPlaceholder: string;
    allCategories: string;
    allStatuses: string;
    resolvedCount: string;
    slaOnTime: string;
    upvote: string;
    upvoted: string;
  };
  voting: {
    ballotHeader: string;
    ballotSubtitle: string;
    fundGoal: string;
    castVote: string;
    voted: string;
    fundedBadge: string;
  };
}> = {
  en: {
    portalTitle: 'CivicLoop.in',
    tagline: 'Evidence-Grounded Municipal Governance & Participatory Budgeting',
    liveStatus: 'Jan Seva Live',
    activeTickets: 'Active Grievances',
    hotspotsDetected: 'Spatial Hotspots',
    allocatedBudget: 'Civic Fund Sanctioned',
    voteCta: 'Vote on Budget',
    nav: {
      report: 'Report Issue',
      track: 'Public Tracker',
      hotspots: 'Hotspot Map',
      vote: 'Voting Box',
      analytics: 'City Analytics',
      audit: 'Audit Trail'
    },
    categories: {
      pothole: 'Pothole & Surface Crater',
      streetlight: 'Streetlight / Dark Spot',
      drainage: 'Open Drain / Nala Overflow',
      garbage: 'Garbage Dump / Waste',
      road_damage: 'Broken Footpath & Divider',
      traffic_signal: 'Traffic Signal Failure',
      water_leak: 'Drinking Water Pipeline Leak'
    },
    status: {
      Received: 'Received',
      Assigned: 'Assigned',
      InProgress: 'In Field Repair',
      Resolved: 'Resolved & Tested'
    },
    form: {
      step1Title: 'Select Issue Category',
      step1Subtitle: 'Choose the civic grievance affecting your neighborhood',
      step2Title: 'Describe & Attach Evidence',
      step2Subtitle: 'Use voice note or live camera upload for instant auto-routing',
      step3Title: 'Pinpoint Location & Submit',
      step3Subtitle: 'GPS coordinate snapping to municipal ward with AI duplicate checking',
      categoryLabel: 'Issue Category',
      titleLabel: 'Summary Headline',
      descLabel: 'Detailed Description',
      voiceBtn: 'Record Voice Note',
      photoBtn: 'Upload Photo / Camera',
      submitBtn: 'Submit Grievance to Ward Squad',
      locationLabel: 'Street Landmark / Address',
      wardLabel: 'Municipal Ward',
      duplicateNotice: 'Nearby Similar Grievance Found',
      supportExisting: 'Support Existing Ticket Instead'
    },
    tracker: {
      searchPlaceholder: 'Search by ticket #, ward name, or keywords...',
      allCategories: 'All Categories',
      allStatuses: 'All Statuses',
      resolvedCount: 'Total Resolved',
      slaOnTime: 'Within SLA Charter',
      upvote: 'Verify / Upvote',
      upvoted: 'Verified'
    },
    voting: {
      ballotHeader: 'Participatory Ward Budget Ballots',
      ballotSubtitle: 'Democratically allocate municipal capital funds to recurring problem hotspots',
      fundGoal: 'Target Funding Required',
      castVote: 'Cast Citizen Vote',
      voted: 'Vote Recorded',
      fundedBadge: 'Budget Approved'
    }
  },
  hi: {
    portalTitle: 'सिविक लूप भारत',
    tagline: 'पारदर्शी नागरिक लोकतंत्र, वार्ड निगरानी एवं जन बजट प्रणाली',
    liveStatus: 'नागरिक सेवा लाइव',
    activeTickets: 'सक्रिय शिकायतें',
    hotspotsDetected: 'समस्या क्लस्टर',
    allocatedBudget: 'नागरिक बजट स्वीकृत',
    voteCta: 'बजट वोट करें',
    nav: {
      report: 'शिकायत दर्ज करें',
      track: 'पब्लिक ट्रैकर',
      hotspots: 'हॉटस्पॉट मैप',
      vote: 'वोटिंग बॉक्स',
      analytics: 'शहर एनालिटिक्स',
      audit: 'ऑडिट लेजर'
    },
    categories: {
      pothole: 'सड़क का गड्ढा (Pothole)',
      streetlight: 'स्ट्रीट लाइट बंद / अंधेरा',
      drainage: 'खुला नाला / सीवर ओवरफ्लो',
      garbage: 'कचरे का ढेर / कचरा डंप',
      road_damage: 'टूटा फुटपाथ / डिवाइडर',
      traffic_signal: 'ट्रैफिक सिग्नल खराब',
      water_leak: 'पेयजल पाइपलाइन लीकेज'
    },
    status: {
      Received: 'प्राप्त हुई',
      Assigned: 'विभाग को प्रेषित',
      InProgress: 'कार्य प्रगति पर',
      Resolved: 'सफलतापूर्वक निस्तारित'
    },
    form: {
      step1Title: 'समस्या श्रेणी चुनें',
      step1Subtitle: 'अपने क्षेत्र की नागरिक समस्या का चयन करें',
      step2Title: 'विवरण एवं साक्ष्य जोड़ें',
      step2Subtitle: 'त्वरित निस्तारण हेतु वॉयस रिकॉर्डिंग या फोटो जोड़ें',
      step3Title: 'सटीक स्थान चुनें व सबमिट करें',
      step3Subtitle: 'वार्ड आधारित जीपीएस मैपिंग एवं डुप्लीकेट शिकायत जांच',
      categoryLabel: 'शिकायत श्रेणी',
      titleLabel: 'शीर्षक',
      descLabel: 'विस्तृत विवरण',
      voiceBtn: 'वॉयस नोट बोलकर दर्ज करें',
      photoBtn: 'फोटो या कैमरा प्रमाण अपलोड करें',
      submitBtn: 'नगर निगम दस्ते को शिकायत भेजें',
      locationLabel: 'पता / सड़क का नाम',
      wardLabel: 'नगर निगम वार्ड',
      duplicateNotice: 'समान शिकायत पहले से दर्ज है',
      supportExisting: 'इस शिकायत का समर्थन करें'
    },
    tracker: {
      searchPlaceholder: 'टिकट नंबर, वार्ड या सड़क के नाम से खोजें...',
      allCategories: 'सभी श्रेणियां',
      allStatuses: 'सभी स्थितियां',
      resolvedCount: 'कुल निस्तारित',
      slaOnTime: 'समय सीमा के भीतर',
      upvote: 'सत्यापित / वोट दें',
      upvoted: 'सत्यापित'
    },
    voting: {
      ballotHeader: 'नागरिक वार्ड बजट मतदान',
      ballotSubtitle: 'लगातार आने वाली नागरिक समस्याओं के स्थायी समाधान हेतु बजट स्वीकृत करें',
      fundGoal: 'आवश्यक बजट राशि',
      castVote: 'नागरिक वोट दें',
      voted: 'वोट दर्ज हो गया',
      fundedBadge: 'बजट स्वीकृत'
    }
  },
  ta: {
    portalTitle: 'சிவிக் லூப்',
    tagline: 'சான்றுகளுடன் கூடிய நகராட்சி நிர்வாகம் மற்றும் மக்களாட்சி பட்ஜெட்',
    liveStatus: 'மக்கள் சேவை நேரலை',
    activeTickets: 'செயலில் உள்ள புகார்கள்',
    hotspotsDetected: 'பிரச்சனை ஹாட்ஸ்பாட்கள்',
    allocatedBudget: 'ஒதுக்கப்பட்ட நிதி',
    voteCta: 'பட்ஜெட்டுக்கு வாக்களிக்கவும்',
    nav: {
      report: 'புகார் பதிவு செய்',
      track: 'பொது கண்காணிப்பான்',
      hotspots: 'ஹாட்ஸ்பாட் வரைபடம்',
      vote: 'வாக்களிப்பு பெட்டி',
      analytics: 'நகர பகுப்பாய்வு',
      audit: 'தணிக்கை பதிவு'
    },
    categories: {
      pothole: 'சாலை குழி & விரிசல்',
      streetlight: 'தெரு விளக்கு பழுது / இருட்டு',
      drainage: 'கழிவுநீர் கால்வாய் அடைப்பு',
      garbage: 'குப்பை மேடு / தேக்கம்',
      road_damage: 'சேதமடைந்த நடைபாதை',
      traffic_signal: 'போக்குவரத்து சிக்னல் பழுது',
      water_leak: 'குடிநீர் குழாய் கசிவு'
    },
    status: {
      Received: 'பெறப்பட்டது',
      Assigned: 'ஒதுக்கப்பட்டது',
      InProgress: 'பழுதுபார்க்கப்படுகிறது',
      Resolved: 'தீர்க்கப்பட்டது'
    },
    form: {
      step1Title: 'பிரச்சனை வகையைத் தேர்ந்தெடுக்கவும்',
      step1Subtitle: 'உங்கள் பகுதியில் உள்ள புகாரைத் தேர்ந்தெடுக்கவும்',
      step2Title: 'விவரம் மற்றும் ஆதாரத்தை இணைக்கவும்',
      step2Subtitle: 'குரல் பதிவு அல்லது புகைப்படத்தை உடனடியாக இணைக்கவும்',
      step3Title: 'இருப்பிடத்தைக் குறித்து சமர்ப்பிக்கவும்',
      step3Subtitle: 'வார்டு ஜிபிஎஸ் மற்றும் போலி புகார் சரிபார்ப்பு',
      categoryLabel: 'புகார் வகை',
      titleLabel: 'தலைப்பு',
      descLabel: 'முழு விவரம்',
      voiceBtn: 'குரல் பதிவு செய்ய',
      photoBtn: 'புகைப்படம் பதிவேற்ற',
      submitBtn: 'நகராட்சிக்கு சமர்ப்பிக்கவும்',
      locationLabel: 'முகவரி / அடையாளம்',
      wardLabel: 'வார்டு எண்',
      duplicateNotice: 'அருகிலுள்ள இதே புகார் கண்டறியப்பட்டது',
      supportExisting: 'ஏற்கனவே உள்ள புகாரை ஆதரிக்கவும்'
    },
    tracker: {
      searchPlaceholder: 'டிக்கெட் எண் அல்லது வார்டு வாரியாக தேடவும்...',
      allCategories: 'அனைத்து பிரிவுகளும்',
      allStatuses: 'அனைத்து நிலைகளும்',
      resolvedCount: 'தீர்க்கப்பட்டவை',
      slaOnTime: 'காலக்கெடுவுக்குள்',
      upvote: 'ஆதரிக்கவும்',
      upvoted: 'ஆதரிக்கப்பட்டது'
    },
    voting: {
      ballotHeader: 'மக்கள் பங்கேற்பு வார்டு பட்ஜெட்',
      ballotSubtitle: 'தொடர்ச்சியான நகர்ப்புற பிரச்சனைகளுக்கு நிரந்தர நிதி ஒதுக்கீடு செய்யுங்கள்',
      fundGoal: 'தேவையான மதிப்பீடு',
      castVote: 'வாக்களிக்கவும்',
      voted: 'வாக்கு பதிவானது',
      fundedBadge: 'நிதி அங்கீகரிக்கப்பட்டது'
    }
  },
  te: {
    portalTitle: 'సివిక్ లూప్',
    tagline: 'సాక్ష్యాధారాల పురపాలక పాలన మరియు ప్రజాస్వామ్య బడ్జెట్',
    liveStatus: 'జన సేవ లైవ్',
    activeTickets: 'యాక్టివ్ ఫిర్యాదులు',
    hotspotsDetected: 'హాట్‌స్పాట్ క్లస్టర్లు',
    allocatedBudget: 'మంజూరైన పౌర నిధులు',
    voteCta: 'బడ్జెట్‌పై ఓటు వేయండి',
    nav: {
      report: 'ఫిర్యాదు నమోదు',
      track: 'పబ్లిక్ ట్రాకర్',
      hotspots: 'హాట్‌స్పాట్ మ్యాప్',
      vote: 'ఓటింగ్ బాక్స్',
      analytics: 'నగర విశ్లేషణ',
      audit: 'ఆడిట్ రికార్డు'
    },
    categories: {
      pothole: 'రోడ్డు గుంతలు & పగుళ్లు',
      streetlight: 'వీధి దీపాలు పని చేయకపోవడం',
      drainage: 'మురుగు కాలువ పొంగిపొర్లడం',
      garbage: 'చెత్త కుప్పలు / వ్యర్థాలు',
      road_damage: 'పాడైన ఫుట్‌పాత్ & డివైడర్',
      traffic_signal: 'ట్రాఫిక్ సిగ్నల్ పనిచేయకపోవడం',
      water_leak: 'తాగునీటి పైప్‌లైన్ లీకేజీ'
    },
    status: {
      Received: 'స్వీకరించబడింది',
      Assigned: 'కేటాయించబడింది',
      InProgress: 'మరమ్మతు జరుగుతోంది',
      Resolved: 'పరిష్కరించబడింది'
    },
    form: {
      step1Title: 'సమస్య వర్గాన్ని ఎంచుకోండి',
      step1Subtitle: 'మీ ప్రాంతంలోని పౌర సమస్యను ఎంచుకోండి',
      step2Title: 'వివరణ మరియు ఆధారాలు జతచేయండి',
      step2Subtitle: 'వాయిస్ నోట్ లేదా ఫోటోను జతచేయండి',
      step3Title: 'లొకేషన్ గుర్తించి సమర్పించండి',
      step3Subtitle: 'వార్డు మ్యాపింగ్ మరియు డూప్లికేట్ ఫిర్యాదుల తనిఖీ',
      categoryLabel: 'ఫిర్యాదు వర్గం',
      titleLabel: 'శీర్షిక',
      descLabel: 'పూర్తి వివరణ',
      voiceBtn: 'వాయిస్ నోట్ రికార్డ్ చేయండి',
      photoBtn: 'ఫోటో అప్‌లోడ్ చేయండి',
      submitBtn: 'మున్సిపల్ బృందానికి పంపండి',
      locationLabel: 'చిరునామా / ల్యాండ్‌మార్క్',
      wardLabel: 'మున్సిపల్ వార్డు',
      duplicateNotice: 'సమీపంలో ఉన్న ఇటువంటి ఫిర్యాదు కనుగొనబడింది',
      supportExisting: 'ఈ ఫిర్యాదుకు మద్దతు ఇవ్వండి'
    },
    tracker: {
      searchPlaceholder: 'టికెట్ నంబర్ లేదా వార్డు పేరుతో వెతకండి...',
      allCategories: 'అన్ని వర్గాలు',
      allStatuses: 'అన్ని స్థితులు',
      resolvedCount: 'పరిష్కరించబడినవి',
      slaOnTime: 'సమయ పరిమితిలోపు',
      upvote: 'మద్దతు / ఓటు',
      upvoted: 'ధృవీకరించబడింది'
    },
    voting: {
      ballotHeader: 'వార్డు బడ్జెట్ ప్రజా ఓటింగ్',
      ballotSubtitle: 'శాశ్వత పరిష్కారాల కోసం మున్సిపల్ నిధులను కేటాయించడానికి ఓటు వేయండి',
      fundGoal: 'అవసరమైన నిధులు',
      castVote: 'ఓటు వేయండి',
      voted: 'ఓటు నమోదైంది',
      fundedBadge: 'నిధులు మంజూరయ్యాయి'
    }
  },
  kn: {
    portalTitle: 'ಸಿವಿಕ್ ಲೂಪ್',
    tagline: 'ಸಾಕ್ಷ್ಯ ಆಧಾರಿತ ಪೌರ ಆಡಳಿತ ಮತ್ತು ಜನಪರ ಬಜೆಟ್ ವ್ಯವಸ್ಥೆ',
    liveStatus: 'ಜನ ಸೇವಾ ಲೈವ್',
    activeTickets: 'ಸಕ್ರಿಯ ದೂರುಗಳು',
    hotspotsDetected: 'ಹಾಟ್‌ಸ್ಪಾಟ್ ವಲಯಗಳು',
    allocatedBudget: 'ಮಂಜೂರಾದ ಬಜೆಟ್',
    voteCta: 'ಬಜೆಟ್‌ಗೆ ಮತ ಚಲಾಯಿಸಿ',
    nav: {
      report: 'ದೂರು ದಾಖಲಿಸಿ',
      track: 'ಸಾರ್ವಜನಿಕ ಟ್ರ್ಯಾಕರ್',
      hotspots: 'ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ',
      vote: 'ಮತದಾನ ಪೆಟ್ಟಿಗೆ',
      analytics: 'ನಗರ ವಿಶ್ಲೇಷಣೆ',
      audit: 'ಆಡಿಟ್ ದಾಖಲೆ'
    },
    categories: {
      pothole: 'ರಸ್ತೆ ಗುಂಡಿ (Pothole)',
      streetlight: 'ಬೀದಿ ದೀಪ ದುರಸ್ತಿ / ಕತ್ತಲು',
      drainage: 'ತೆರೆದ ಚರಂಡಿ / ಒಳಚರಂಡಿ ಉಕ್ಕಿ ಹರಿಯುವುದು',
      garbage: 'ಕಸದ ರಾಶಿ / ತ್ಯಾಜ್ಯ',
      road_damage: 'ಹಾಳಾದ ಫುಟ್‌ಪಾತ್ & ಡಿವೈಡರ್',
      traffic_signal: 'ಟ್ರಾಫಿಕ್ ಸಿಗ್ನಲ್ ಸ್ಥಗಿತ',
      water_leak: 'ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್‌ಲೈನ್ ಸೋರಿಕೆ'
    },
    status: {
      Received: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
      Assigned: 'ನಿಯೋಜಿಸಲಾಗಿದೆ',
      InProgress: 'ದುರಸ್ತಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
      Resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ'
    },
    form: {
      step1Title: 'ಸಮಸ್ಯೆಯ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      step1Subtitle: 'ನಿಮ್ಮ ಬಡಾವಣೆಯ ನಾಗರಿಕ ಸಮಸ್ಯೆಯನ್ನು ಆರಿಸಿ',
      step2Title: 'ವಿವರಣೆ ಮತ್ತು ಸಾಕ್ಷಿ ಲಗತ್ತಿಸಿ',
      step2Subtitle: 'ತ್ವರಿತ ಪರಿಹಾರಕ್ಕಾಗಿ ಧ್ವನಿ ಮುದ್ರಣ ಅಥವಾ ಫೋಟೋ ಸೇರಿಸಿ',
      step3Title: 'ನಿಖರ ಸ್ಥಳ ಗುರುತಿಸಿ ಸಲ್ಲಿಸಿ',
      step3Subtitle: 'ವಾರ್ಡ್ ಜಿಪಿಎಸ್ ಮ್ಯಾಪಿಂಗ್ ಮತ್ತು ಪುನರಾವರ್ತನೆ ಪರಿಶೀಲನೆ',
      categoryLabel: 'ದೂರಿನ ವರ್ಗ',
      titleLabel: 'ಶೀರ್ಷಿಕೆ',
      descLabel: 'ಸಂಪೂರ್ಣ ವಿವರಣೆ',
      voiceBtn: 'ಧ್ವನಿ ಮೂಲಕ ದಾಖಲಿಸಿ',
      photoBtn: 'ಫೋಟೋ / ಕ್ಯಾಮೆರಾ ಅಪ್‌ಲೋಡ್',
      submitBtn: 'ಪಾಲಿಕೆಗೆ ದೂರು ಸಲ್ಲಿಸಿ',
      locationLabel: 'ವಿಳಾಸ / ರಸ್ತೆ ಹೆಸರು',
      wardLabel: 'ವಾರ್ಡ್ ಸಂಖ್ಯೆ',
      duplicateNotice: 'ಇದೇ ರೀತಿಯ ದೂರು ಮೊದಲೇ ದಾಖಲಾಗಿದೆ',
      supportExisting: 'ಈ ದೂರನ್ನು ಬೆಂಬಲಿಸಿ'
    },
    tracker: {
      searchPlaceholder: 'ಟಿಕೆಟ್ ಸಂಖ್ಯೆ ಅಥವಾ ವಾರ್ಡ್ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...',
      allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
      allStatuses: 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು',
      resolvedCount: 'ಪರಿಹರಿಸಲಾದ ದೂರುಗಳು',
      slaOnTime: 'ಸಮಯದ ಮಿತಿಯೊಳಗೆ',
      upvote: 'ದೃಢೀಕರಿಸಿ / ಮತ ನೀಡಿ',
      upvoted: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ'
    },
    voting: {
      ballotHeader: 'ನಾಗರಿಕ ವಾರ್ಡ್ ಬಜೆಟ್ ಮತದಾನ',
      ballotSubtitle: 'ದೀರ್ಘಕಾಲದ ಸಮಸ್ಯೆಗಳ ಶಾಶ್ವತ ಪರಿಹಾರಕ್ಕೆ ವಾರ್ಡ್ ನಿಧಿ ಮಂಜೂರು ಮಾಡಿ',
      fundGoal: 'ಅಂದಾಜು ವೆಚ್ಚ',
      castVote: 'ಮತ ಚಲಾಯಿಸಿ',
      voted: 'ಮತ ದಾಖಲಾಗಿದೆ',
      fundedBadge: 'ಬಜೆಟ್ ಅನುಮೋದಿತ'
    }
  },
  mr: {
    portalTitle: 'सिव्हिक लूप',
    tagline: 'पुरावा-आधारित पालिका प्रशासन आणि लोकसहभागातून वॉर्ड बजेट',
    liveStatus: 'जनसेवा थेट',
    activeTickets: 'सक्रिय तक्रारी',
    hotspotsDetected: 'समस्या हॉटस्पॉट्स',
    allocatedBudget: 'मंजूर नागरी निधी',
    voteCta: 'बजेटसाठी मतदान करा',
    nav: {
      report: 'तक्रार नोंदवा',
      track: 'पब्लिक ट्रॅकर',
      hotspots: 'हॉटस्पॉट नकाशा',
      vote: 'मतदान कक्ष',
      analytics: 'शहर विश्लेषण',
      audit: 'ऑडिट लेजर'
    },
    categories: {
      pothole: 'रस्त्यावरील खड्डा (Pothole)',
      streetlight: 'बंद पथदिवा / अंधार',
      drainage: 'उघडे नाले / सांडपाणी ओव्हरफ्लो',
      garbage: 'कचऱ्याचा ढीग / कचरा डेपो',
      road_damage: 'तुटलेला फुटपाथ / दुभाजक',
      traffic_signal: 'वाहतूक सिग्नल बिघाड',
      water_leak: 'पिण्याच्या पाण्याच्या पाईपलाईनची गळती'
    },
    status: {
      Received: 'प्राप्त झाली',
      Assigned: 'विभागाकडे वर्ग',
      InProgress: 'दुरुस्तीचे काम सुरू',
      Resolved: 'यशस्वीरित्या सोडवली'
    },
    form: {
      step1Title: 'समस्येचा प्रकार निवडा',
      step1Subtitle: 'आपल्या परिसरातील नागरी समस्या निवडा',
      step2Title: 'तपशील आणि पुरावा जोडा',
      step2Subtitle: 'त्वरित निवारणासाठी व्हॉईस नोट किंवा फोटो जोडा',
      step3Title: 'अचूक स्थान निवडा व सबमिट करा',
      step3Subtitle: 'वॉर्ड जीपीएस मॅपिंग आणि डुप्लिकेट तक्रार तपासणी',
      categoryLabel: 'तक्रार प्रकार',
      titleLabel: 'शीर्षक',
      descLabel: 'सविस्तर तपशील',
      voiceBtn: 'व्हॉईस नोट रेकॉर्ड करा',
      photoBtn: 'फोटो / कॅमेरा अपलोड करा',
      submitBtn: 'महानगरपालिकेस तक्रार पाठवा',
      locationLabel: 'पत्ता / रस्त्याचे नाव',
      wardLabel: 'महानगरपालिका वॉर्ड',
      duplicateNotice: 'अशीच तक्रार यापूर्वी नोंदवली गेली आहे',
      supportExisting: 'या तक्रारीचे समर्थन करा'
    },
    tracker: {
      searchPlaceholder: 'तक्रार क्रमांक किंवा वॉर्ड नावाने शोधा...',
      allCategories: 'सर्व प्रकार',
      allStatuses: 'सर्व स्थिती',
      resolvedCount: 'एकूण सोडवलेल्या तक्रारी',
      slaOnTime: 'वेळेच्या आत',
      upvote: 'समर्थन / मत द्या',
      upvoted: 'समर्थन दिले'
    },
    voting: {
      ballotHeader: 'नागरी वॉर्ड बजेट मतदान',
      ballotSubtitle: 'वारंवार उद्भवणाऱ्या समस्यांवर कायमस्वरूपी उपायासाठी निधी मंजूर करा',
      fundGoal: 'अपेक्षित खर्च',
      castVote: 'मत द्या',
      voted: 'मत नोंदवले गेले',
      fundedBadge: 'बजेट मंजूर'
    }
  },
  bn: {
    portalTitle: 'সিভিক লুপ',
    tagline: 'প্রমাণ-ভিত্তিক পৌর প্রশাসন ও অংশগ্রহণমূলক বাজেট ব্যবস্থা',
    liveStatus: 'জনসেবা লাইভ',
    activeTickets: 'সক্রিয় অভিযোগ',
    hotspotsDetected: 'সমস্যা হটস্পট',
    allocatedBudget: 'অনুমোদিত নাগরিক বাজেট',
    voteCta: 'বাজেটে ভোট দিন',
    nav: {
      report: 'অভিযোগ দায়ের করুন',
      track: 'পাবলিক ট্র্যাকার',
      hotspots: 'হটস্পট ম্যাপ',
      vote: 'ভোট বাক্স',
      analytics: 'শহর বিশ্লেষণ',
      audit: 'অডিট খতিয়ান'
    },
    categories: {
      pothole: 'রাস্তার গর্ত ও ভাঙা অংশ',
      streetlight: 'পথবাতি বিকল / অন্ধকার',
      drainage: 'খোলা নর্দমা / নিকাশী সমস্যা',
      garbage: 'আবর্জনার স্তূপ / ময়লা',
      road_damage: 'ভাঙা ফুটপাথ ও ডিভাইডার',
      traffic_signal: 'ট্রাফিক সিগন্যাল বিকল',
      water_leak: 'পানীয় জলের পাইপলাইনে ফুটো'
    },
    status: {
      Received: 'প্রাপ্ত হয়েছে',
      Assigned: 'বিভাগে পাঠানো হয়েছে',
      InProgress: 'মেরামত চলছে',
      Resolved: 'সমাধান সম্পন্ন'
    },
    form: {
      step1Title: 'অভিযোগের ধরন বেছে নিন',
      step1Subtitle: 'আপনার এলাকার নাগরিক সমস্যা নির্বাচন করুন',
      step2Title: 'বিবরণ এবং প্রমাণ সংযুক্ত করুন',
      step2Subtitle: 'দ্রুত সমাধানের জন্য ভয়েস নোট বা ছবি সংযুক্ত করুন',
      step3Title: 'সঠিক অবস্থান চিহ্নিত করে জমা দিন',
      step3Subtitle: 'ওয়ার্ড ভিত্তিক জিপিএস ম্যাপিং ও ডুপ্লিকেট যাচাই',
      categoryLabel: 'অভিযোগের ধরন',
      titleLabel: 'শিরোনাম',
      descLabel: 'বিস্তারিত বিবরণ',
      voiceBtn: 'ভয়েস নোট রেকর্ড করুন',
      photoBtn: 'ছবি বা ক্যামেরা আপলোড',
      submitBtn: 'পৌরসভায় অভিযোগ জমা দিন',
      locationLabel: 'ঠিকানা / ল্যান্ডমার্ক',
      wardLabel: 'পৌরসভা ওয়ার্ড',
      duplicateNotice: 'কাছাকাছি একই ধরনের অভিযোগ রয়েছে',
      supportExisting: 'বিদ্যমান অভিযোগটি সমর্থন করুন'
    },
    tracker: {
      searchPlaceholder: 'টিকিট নম্বর বা ওয়ার্ডের নামে অনুসন্ধান করুন...',
      allCategories: 'সকল বিভাগ',
      allStatuses: 'সকল স্থিতি',
      resolvedCount: 'মোট সমাধান',
      slaOnTime: 'নির্দিষ্ট সময়সীমার মধ্যে',
      upvote: 'যাচাই / ভোট দিন',
      upvoted: 'যাচাইকৃত'
    },
    voting: {
      ballotHeader: 'নাগরিক ওয়ার্ড বাজেট ভোটদান',
      ballotSubtitle: 'স্থায়ী নাগরিক সমাধানের জন্য পৌর তহবিলের বরাদ্দ মঞ্জুর করুন',
      fundGoal: 'প্রয়োজনীয় বাজেট',
      castVote: 'ভোট দিন',
      voted: 'ভোট নথিভুক্ত হয়েছে',
      fundedBadge: 'বাজেট অনুমোদিত'
    }
  },
  or: {
    portalTitle: 'ସିଭିକ୍ ଲୁପ୍',
    tagline: 'ପ୍ରମାଣ-ଆଧାରିତ ପୌର ପ୍ରଶାସନ ଓ ଅଂଶଗ୍ରହଣକାରୀ ବଜେଟ୍ ବ୍ୟବସ୍ଥା',
    liveStatus: 'ଜନସେବା ଲାଇଭ୍',
    activeTickets: 'ସକ୍ରିୟ ଅଭିଯୋଗ',
    hotspotsDetected: 'ସମସ୍ୟା ହଟସ୍ପଟ୍',
    allocatedBudget: 'ଅନୁମୋଦିତ ନାଗରିକ ପାଣ୍ଠି',
    voteCta: 'ବଜେଟରେ ଭୋଟ୍ ଦିଅନ୍ତୁ',
    nav: {
      report: 'ଅଭିଯୋଗ ଦାଖଲ',
      track: 'ପବ୍ଲିକ୍ ଟ୍ରାକର୍',
      hotspots: 'ହଟସ୍ପଟ୍ ମାନଚିତ୍ର',
      vote: 'ଭୋଟିଂ ବାକ୍ସ',
      analytics: 'ନଗର ବିଶ୍ଳେଷଣ',
      audit: 'ଅଡିଟ୍ ଲେଜର୍'
    },
    categories: {
      pothole: 'ରାସ୍ତା ଖାଲ-ଖମା ଓ ଖଣ୍ଡିତ ଅଂଶ',
      streetlight: 'ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍ ଖରାପ / ଅନ୍ଧାର',
      drainage: 'ଖୋଲା ଡ୍ରେନ୍ / ନର୍ଦ୍ଦମା ଜଳବନ୍ଦୀ',
      garbage: 'ଆବର୍ଜନା ଜମା / ଅପରିଷ୍କାର',
      road_damage: 'ଭଙ୍ଗା ଫୁଟପାଥ୍ ଓ ଡିଭାଇଡର୍',
      traffic_signal: 'ଟ୍ରାଫିକ୍ ସିଗନାଲ୍ ଅଚଳ',
      water_leak: 'ପାନୀୟ ଜଳ ପାଇପ୍ ଲିକ୍'
    },
    status: {
      Received: 'ଗ୍ରହଣ କରାଗଲା',
      Assigned: 'ବିଭାଗକୁ ଦିଆଗଲା',
      InProgress: 'ମରାମତି ଚାଲିଛି',
      Resolved: 'ସମାଧାନ ହେଲା'
    },
    form: {
      step1Title: 'ଅଭିଯୋଗ ବର୍ଗ ବାଛନ୍ତୁ',
      step1Subtitle: 'ଆପଣଙ୍କ ଅଞ୍ଚଳର ପୌର ସମସ୍ୟା ଚୟନ କରନ୍ତୁ',
      step2Title: 'ବିବରଣୀ ଓ ଫଟୋ ପ୍ରମାଣ ସଂଲଗ୍ନ କରନ୍ତୁ',
      step2Subtitle: 'ଶୀଘ୍ର ସମାଧାନ ପାଇଁ ଭଏସ୍ ନୋଟ୍ କିମ୍ବା ଫଟୋ ଯୋଡନ୍ତୁ',
      step3Title: 'ସଠିକ୍ ସ୍ଥାନ ଚିହ୍ନଟ କରି ଦାଖଲ କରନ୍ତୁ',
      step3Subtitle: 'ୱାର୍ଡ ଭିତ୍ତିକ ଜିପିଏସ୍ ମ୍ୟାପିଂ ଓ ଡୁପ୍ଲିକେଟ୍ ଯାଞ୍ଚ',
      categoryLabel: 'ଅଭିଯୋଗ ପ୍ରକାର',
      titleLabel: 'ଶୀର୍ଷକ',
      descLabel: 'ବିସ୍ତୃତ ବିବରଣୀ',
      voiceBtn: 'ଭଏସ୍ ନୋଟ୍ ରେକର୍ଡ କରନ୍ତୁ',
      photoBtn: 'କ୍ୟାମେରା / ଫଟୋ ଅପଲୋଡ୍',
      submitBtn: 'ପୌର ନିଗମକୁ ଅଭିଯୋଗ ପଠାନ୍ତୁ',
      locationLabel: 'ଠିକଣା / ଲ୍ୟାଣ୍ଡମାର୍କ',
      wardLabel: 'ମ୍ୟୁନିସିପାଲ୍ ୱାର୍ଡ',
      duplicateNotice: 'ଏହି ସ୍ଥାନ ନିକଟରେ ସମାନ ଅଭିଯୋଗ ପୂର୍ବରୁ ରହିଛି',
      supportExisting: 'ବିଦ୍ୟମାନ ଅଭିଯୋଗକୁ ସମର୍ଥନ କରନ୍ତୁ'
    },
    tracker: {
      searchPlaceholder: 'ଟିକେଟ୍ ନଂ କିମ୍ବା ୱାର୍ଡ ଖୋଜନ୍ତୁ...',
      allCategories: 'ସମସ୍ତ ବର୍ଗ',
      allStatuses: 'ସମସ୍ତ ସ୍ଥିତି',
      resolvedCount: 'ସମୁଦାୟ ସମାଧାନ',
      slaOnTime: 'ନିର୍ଦ୍ଧାରିତ ସମୟ ସୀମାରେ',
      upvote: 'ଯାଞ୍ଚ / ସମର୍ଥନ କରନ୍ତୁ',
      upvoted: 'ସମର୍ଥିତ'
    },
    voting: {
      ballotHeader: 'ନାଗରିକ ୱାର୍ଡ ବଜେଟ୍ ଭୋଟିଂ',
      ballotSubtitle: 'ସ୍ଥାୟୀ ଭିତ୍ତିଭୂମି ସମାଧାନ ପାଇଁ ପୌର ପାଣ୍ଠି ମଞ୍ଜୁର କରନ୍ତୁ',
      fundGoal: 'ଆବଶ୍ୟକୀୟ ବଜେଟ୍',
      castVote: 'ଭୋଟ୍ ଦିଅନ୍ତୁ',
      voted: 'ଭୋଟ୍ ଗୃହୀତ ହେଲା',
      fundedBadge: 'ପାଣ୍ଠି ଅନୁମୋଦିତ'
    }
  }
};
