import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
const PublicTracker = lazy(() => import('../components/PublicTracker').then(m => ({ default: m.PublicTracker })));
export default function TrackPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-[320px] flex flex-col items-center justify-center p-8 text-slate-400"><Loader2 className="w-7 h-7 text-orange-500 animate-spin mb-3" /><span className="text-xs font-semibold text-slate-500">Loading...</span></div>}>
      <PublicTracker />
    </Suspense>
  );
}
