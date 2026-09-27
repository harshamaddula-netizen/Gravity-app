import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  customCaveat?: string;
}

export const DisclaimerBanner: React.FC<Props> = ({ customCaveat }) => {
  return (
    <footer className="mt-12 pt-6 border-t border-slate-900 text-slate-500 text-xs leading-relaxed max-w-4xl mx-auto space-y-2">
      {customCaveat && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-300/90 mb-4">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <p>{customCaveat}</p>
        </div>
      )}

      <div className="flex items-start gap-2 text-slate-400 bg-slate-900/30 p-3 rounded-xl border border-slate-800/60">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
        <p>
          <strong className="text-slate-300 font-semibold">Responsible AI Verification Notice: </strong>
          TruthLens provides evidence-based assistance, not absolute truth. Evidence may be incomplete, outdated, or conflicting. High-impact medical, scientific, and civic information should be corroborated with authoritative primary sources.
        </p>
      </div>
    </footer>
  );
};
