import React, { useState, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import { IssueCategory, PriorityLevel } from '../types';
import { DEPARTMENT_MAP, CATEGORY_DETAILS } from '../data/departmentConfig';
import { LeafletMap } from './LeafletMap';
import { VoiceRecorderModal } from './VoiceRecorderModal';
import { ScrollReveal } from './ScrollReveal';
import { findDuplicateReports } from '../utils/civicEngine';
import { 
  TRANSLATED_PRIORITIES, 
  TRANSLATED_DEPARTMENTS, 
  tText 
} from '../utils/translator';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  MapPin, 
  Camera, 
  Mic, 
  Send, 
  CheckCircle2, 
  ThumbsUp, 
  Clock, 
  Search,
  Building,
  Check,
  Zap,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COMMON_SCENARIOS = [
  {
    id: 'pothole-100ft',
    label: '🚗 100ft Road Pothole Crater',
    category: 'pothole' as IssueCategory,
    title: 'Hazardous deep crater pothole near 12th Main junction',
    description: 'Deep 15cm asphalt crater after monsoon showers on 100ft road. Two-wheelers losing balance during peak traffic.',
    wardIndex: 0,
    priority: 'High' as PriorityLevel,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'light-80ft',
    label: '💡 Streetlight Outage',
    category: 'streetlight' as IssueCategory,
    title: 'Series of dead LED streetlights on main road',
    description: 'Entire 400-meter stretch is in darkness for the past 3 nights. Pedestrians feel unsafe.',
    wardIndex: 1,
    priority: 'High' as PriorityLevel,
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'drain-nala',
    label: '🌊 Stormwater Nala Choked',
    category: 'drainage' as IssueCategory,
    title: 'Stormwater nala silt overflow causing road waterlogging',
    description: 'Choked stormwater canal with silt. Waterlogging reaches knee height during moderate rainfall.',
    wardIndex: 2,
    priority: 'Critical' as PriorityLevel,
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'garbage-dump',
    label: '🗑️ Garbage Dump Blackspot',
    category: 'garbage' as IssueCategory,
    title: 'Unsegregated municipal waste pile near market gate',
    description: 'Heavy garbage dump blocking pedestrian sidewalk for 2 days creating odor and sanitation issues.',
    wardIndex: 3,
    priority: 'Medium' as PriorityLevel,
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
  }
];

const SAMPLE_PHOTOS = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Streetlight', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { label: 'Drain Overflow', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Garbage Pile', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80' }
];

export const ReportForm: React.FC = () => {
  const { 
    reports, 
    createReport, 
    upvoteReport, 
    setActiveTab, 
    setSelectedReportId, 
    selectedCity,
    t,
    language
  } = useCivic();

  const [category, setCategory] = useState<IssueCategory>('pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState<{ lat: number; lng: number }>({ 
    lat: selectedCity.wards[0]?.lat || selectedCity.lat, 
    lng: selectedCity.wards[0]?.lng || selectedCity.lng 
  });
  const [address, setAddress] = useState(selectedCity.wards[0]?.name ? `${selectedCity.wards[0].name}, ${selectedCity.name}` : `Main Road, ${selectedCity.name}`);
  const [wardNumber, setWardNumber] = useState<number>(selectedCity.wards[0]?.wardNo || 112);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [phone, setPhone] = useState<string>('+91 98765-43210');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: number; isDuplicate: boolean; department: string; ward: number } | null>(null);

  // Duplicate Detection State
  const [duplicateMatches, setDuplicateMatches] = useState<ReturnType<typeof findDuplicateReports>>([]);
  const [selectedDuplicateParent, setSelectedDuplicateParent] = useState<number | null>(null);

  const departmentInfo = DEPARTMENT_MAP[category];

  // Sync position when selected city changes
  useEffect(() => {
    if (selectedCity.wards.length > 0) {
      const defaultWard = selectedCity.wards[0];
      setPosition({ lat: defaultWard.lat, lng: defaultWard.lng });
      setAddress(`${defaultWard.name}, ${selectedCity.name}`);
      setWardNumber(defaultWard.wardNo);
    }
  }, [selectedCity]);

  // Auto-fill sensible default title on category change
  useEffect(() => {
    if (!title || Object.values(CATEGORY_DETAILS).some(c => c.defaultTitle === title)) {
      setTitle(CATEGORY_DETAILS[category]?.defaultTitle || '');
    }
  }, [category]);

  // Run Duplicate Detection
  useEffect(() => {
    if (description.length > 6) {
      const matches = findDuplicateReports(description, category, position.lat, position.lng, reports);
      setDuplicateMatches(matches);
      if (matches.length > 0 && !selectedDuplicateParent) {
        setSelectedDuplicateParent(matches[0].report.id);
      }
    } else {
      setDuplicateMatches([]);
    }
  }, [description, category, position.lat, position.lng, reports]);

  const handleApplyScenario = (scenario: typeof COMMON_SCENARIOS[0]) => {
    setCategory(scenario.category);
    setTitle(scenario.title);
    setDescription(scenario.description);
    setPriority(scenario.priority);
    setPhotoUrl(scenario.photoUrl);

    const ward = selectedCity.wards[scenario.wardIndex % selectedCity.wards.length] || selectedCity.wards[0];
    if (ward) {
      setPosition({ lat: ward.lat, lng: ward.lng });
      setAddress(`${ward.name}, ${selectedCity.name}`);
      setWardNumber(ward.wardNo);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition({ lat, lng });
    const nearestWard = selectedCity.wards.find(
      w => Math.abs(w.lat - lat) < 0.03 && Math.abs(w.lng - lng) < 0.03
    );
    if (nearestWard) {
      setAddress(`${nearestWard.name}, ${selectedCity.name}`);
      setWardNumber(nearestWard.wardNo);
    } else {
      setAddress(`Ward Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), ${selectedCity.name}`);
    }
  };

  const handleWardSelect = (ward: typeof selectedCity.wards[0]) => {
    setPosition({ lat: ward.lat, lng: ward.lng });
    setAddress(`${ward.name}, ${selectedCity.name}`);
    setWardNumber(ward.wardNo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const { report, isDuplicate } = createReport({
        category,
        title: title.trim() || `${category.toUpperCase()} at ${address}`,
        description: description.trim(),
        lat: position.lat,
        lng: position.lng,
        address: address.trim(),
        wardNumber,
        cityName: selectedCity.name,
        photoUrl: photoUrl || undefined,
        duplicateOf: selectedDuplicateParent || undefined,
        priority,
        citizenPhone: phone
      });

      setIsSubmitting(false);
      setSubmittedTicket({
        id: report.id,
        isDuplicate,
        department: report.department,
        ward: wardNumber
      });

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}
    }, 500);
  };

  const handleSupportExisting = (matchId: number) => {
    upvoteReport(matchId);
    setSelectedReportId(matchId);
    setActiveTab('track');
  };

  const categoriesList: { key: IssueCategory; label: string }[] = [
    { key: 'pothole', label: t.categories.pothole },
    { key: 'streetlight', label: t.categories.streetlight },
    { key: 'drainage', label: t.categories.drainage },
    { key: 'garbage', label: t.categories.garbage },
    { key: 'road_damage', label: t.categories.road_damage },
    { key: 'traffic_signal', label: t.categories.traffic_signal },
    { key: 'water_leak', label: t.categories.water_leak }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner - Clean Light Theme with Orange Border */}
      <ScrollReveal direction="down" distance={16}>
        <div className="rounded-2xl p-6 sm:p-7 bg-white border-t-4 border-t-orange-500 border-x border-b border-orange-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>🇮🇳 {t.liveStatus} • {selectedCity.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t.form.step1Title}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.tagline}
              </p>
            </div>

            {/* SLA Badge */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3.5 min-w-[240px] shrink-0">
              <div className="p-2.5 rounded-lg bg-orange-100 text-orange-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{tText('Department Charter SLA', language)}</p>
                <p className="text-base font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                  {departmentInfo.slaHours} {tText('Hours', language)}
                  <span className="text-xs font-semibold text-emerald-700">({departmentInfo.code})</span>
                </p>
                <p className="text-[11px] text-slate-500">{tText('Helpline', language)}: {departmentInfo.helpline}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Civic Presets Bar */}
      <ScrollReveal delay={0.08}>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0 mr-1">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
            {tText('Quick Presets', language)}:
          </span>
          {COMMON_SCENARIOS.map(sc => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleApplyScenario(sc)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-900 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shrink-0"
            >
              {tText(sc.label, language)}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Main Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Category & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Category Selector */}
          <ScrollReveal delay={0.1}>
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
              <label className="block text-sm font-bold text-slate-900">
                1. {t.form.categoryLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoriesList.map(cat => {
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight line-clamp-1">
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono capitalize mt-1">
                        {cat.key.replace('_', ' ')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Department Auto-Routing preview badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {TRANSLATED_DEPARTMENTS[departmentInfo.name]?.[language] || departmentInfo.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{departmentInfo.authority}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {departmentInfo.code}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Title & Description with Voice Assistant */}
          <ScrollReveal delay={0.15}>
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. {t.form.titleLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole on main road"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    3. {t.form.descLabel} <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Mic className="w-3.5 h-3.5 text-orange-600" />
                    <span>{t.form.voiceBtn}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what happened, location details, defect size..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs leading-relaxed"
                />
              </div>

              {/* Citizen Phone Number & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Citizen Mobile (+91)</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765-43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {tText('Priority Level', language)}
                  </label>
                  <div className="flex gap-1">
                    {(['Low', 'Medium', 'High', 'Critical'] as PriorityLevel[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          priority === p
                            ? p === 'Critical'
                              ? 'bg-rose-50 border-rose-400 text-rose-800'
                              : p === 'High'
                              ? 'bg-amber-50 border-amber-400 text-amber-800'
                              : 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {TRANSLATED_PRIORITIES[p]?.[language] || p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* AI Duplicate Detection Banner */}
          <AnimatePresence>
            {duplicateMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      {t.form.duplicateNotice} ({Math.round(duplicateMatches[0].similarityScore * 100)}% Match)
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      {tText('A similar grievance has already been reported nearby. You can support the existing ticket to boost priority!', language)}
                    </p>
                  </div>
                </div>

                {duplicateMatches.slice(0, 1).map(match => (
                  <div key={match.report.id} className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">Ticket #{match.report.id} • {tText(match.report.title, language)}</div>
                      <div className="text-[11px] text-slate-500">{tText(match.report.address, language)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSupportExisting(match.report.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {t.form.supportExisting}
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Location Map & Photo Evidence (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Map Location Picker Card */}
          <ScrollReveal delay={0.15} direction="left">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
              <div>
                <label className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  4. {t.form.locationLabel} <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-500">{tText('Pinpoint location or select ward', language)}</p>
              </div>

              {/* Ward Presets */}
              <div className="flex flex-wrap gap-1">
                {selectedCity.wards.map(w => (
                  <button
                    key={w.wardNo}
                    type="button"
                    onClick={() => handleWardSelect(w)}
                    className={`text-[11px] px-2 py-1 rounded-md border transition-all ${
                      wardNumber === w.wardNo
                        ? 'bg-orange-50 border-orange-400 text-orange-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    W-{w.wardNo} {w.name.split(',')[0]}
                  </button>
                ))}
              </div>

              {/* Address bar */}
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={`${tText('Street address or landmark', language)}...`}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />

              {/* Leaflet Map */}
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <LeafletMap
                  center={[position.lat, position.lng]}
                  zoom={14}
                  height="220px"
                  interactivePin={{
                    lat: position.lat,
                    lng: position.lng,
                    onMove: (lat, lng) => handleMapClick(lat, lng)
                  }}
                  onMapClick={handleMapClick}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Ward: #{wardNumber} ({selectedCity.name})</span>
                <span className="text-emerald-700 font-semibold">✓ {tText('GPS Verified', language)}</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Photo Evidence Card */}
          <ScrollReveal delay={0.2} direction="left">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-orange-600" />
                  5. {t.form.photoBtn}
                </label>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    {tText('Clear Photo', language)}
                  </button>
                )}
              </div>

              {photoUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32">
                  <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(sample.url)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] text-slate-700 transition-all"
                      >
                        📷 {tText(sample.label, language)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    placeholder={`${tText('Or paste image URL', language)}...`}
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 mt-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{tText('Submitting Complaint...', language)}</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.form.submitBtn}</span>
                  </>
                )}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </form>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptionComplete={text => {
          setDescription(prev => (prev ? `${prev} ${text}` : text));
        }}
      />

      {/* Submission Success Confirmation Modal */}
      <AnimatePresence>
        {submittedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-2xl text-center space-y-5"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  {submittedTicket.isDuplicate ? tText('Linked Grievance', language) : tText('Official Ticket Created', language)}
                </span>
                <h3 className="text-xl font-bold text-slate-900 pt-1">
                  {tText('Complaint Registered', language)} #{submittedTicket.id}
                </h3>
                <p className="text-xs text-slate-600">
                  {tText('Dispatched to', language)} <strong className="text-slate-900">{TRANSLATED_DEPARTMENTS[submittedTicket.department]?.[language] || submittedTicket.department}</strong> for Ward #{submittedTicket.ward}.
                </p>
              </div>

              {/* Ticket Details Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>{tText('Tracking Ticket ID', language)}:</span>
                  <span className="font-bold text-slate-900">#{submittedTicket.id}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{tText('Initial Status', language)}:</span>
                  <span className="text-amber-700 font-semibold">{tText('Received', language)} ({tText('Dispatched', language)})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{tText('SMS/WhatsApp Alert', language)}:</span>
                  <span className="text-emerald-700 font-semibold">✓ {tText('Dispatched', language)} (+91)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReportId(submittedTicket.id);
                    setSubmittedTicket(null);
                    setActiveTab('track');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  {tText('Track Live Status', language)}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setDescription('');
                    setTitle('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
                >
                  {tText('Done', language)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
