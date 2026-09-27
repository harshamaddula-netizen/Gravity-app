import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  confidence: number; // 0.0 to 1.0
}

export const ConfidenceMeter: React.FC<Props> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);

  // Calibrate color theme based on confidence tier
  const getBarColor = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-brand-500';
    if (pct >= 45) return 'bg-amber-500';
    return 'bg-slate-500';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Assessment Confidence
          </span>
          <div className="group relative cursor-pointer" tabIndex={0} aria-label="Assessment confidence details">
            <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus:block w-64 p-2.5 bg-slate-900 text-[11px] leading-relaxed text-slate-300 rounded-lg shadow-xl border border-slate-700 z-20">
              This score indicates algorithmic certainty in evaluating the retrieved corpus passages, not an objective guarantee of universal truth.
            </div>
          </div>
        </div>
        <span className="text-lg font-bold font-mono text-white">
          {percentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Required clarification caption */}
      <p className="text-[11px] text-slate-400 italic leading-normal">
        «This reflects confidence in the verification assessment based on the available evidence, not certainty that the claim is objectively true.»
      </p>
    </div>
  );
};
