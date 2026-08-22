import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
const PublicAuditTrail = lazy(() => import('../components/PublicAuditTrail').then(m => ({ default: m.PublicAuditTrail })));
export default function AuditPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-[320px] flex flex-col items-center justify-center p-8 text-slate-400"><Loader2 className="w-7 h-7 text-orange-500 animate-spin mb-3" /><span className="text-xs font-semibold text-slate-500">Loading...</span></div>}>
      <PublicAuditTrail />
    </Suspense>
  );
}
