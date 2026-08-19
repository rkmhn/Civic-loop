import React from 'react';

export const GrievanceCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-white/10 rounded-full" />
        <div className="h-4 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-white/10 rounded-lg" />
      <div className="h-3 w-1/2 bg-white/5 rounded-lg" />
      <div className="flex items-center gap-2 pt-2">
        <div className="h-6 w-20 bg-white/5 rounded-lg" />
        <div className="h-6 w-24 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
};

export const DetailViewSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/15 rounded-xl" />
          <div className="h-4 w-32 bg-white/10 rounded-lg" />
        </div>
        <div className="h-8 w-28 bg-emerald-500/20 rounded-full" />
      </div>

      {/* Stepper bar skeleton */}
      <div className="h-12 bg-white/5 rounded-2xl border border-white/5" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-44 bg-white/5 rounded-2xl" />
        <div className="h-44 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
};

export const AnalyticsChartSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 w-40 bg-white/10 rounded-lg" />
        <div className="h-4 w-20 bg-white/5 rounded-full" />
      </div>
      <div className="h-64 w-full bg-white/5 rounded-2xl flex items-end justify-between p-6 gap-3">
        {[40, 75, 55, 90, 60, 80, 45, 70].map((h, i) => (
          <div 
            key={i} 
            className="flex-1 bg-white/10 rounded-t-lg transition-all" 
            style={{ height: `${h}%` }} 
          />
        ))}
      </div>
    </div>
  );
};
