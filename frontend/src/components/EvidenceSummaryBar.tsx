import React, { useMemo } from 'react';
import { EvidenceSummary, EvidenceItem } from '../types/verification';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface Props {
  summary?: EvidenceSummary;
  evidence?: EvidenceItem[];
}

export const EvidenceSummaryBar: React.FC<Props> = ({ summary, evidence }) => {
  // Always calculate directly from actual evidence array when available
  const counts = useMemo(() => {
    if (Array.isArray(evidence)) {
      let supporting = 0;
      let contradicting = 0;
      let unclear = 0;

      for (const item of evidence) {
        const stance = typeof item?.stance === 'string' ? item.stance.trim().toUpperCase() : '';
        if (stance === 'SUPPORTING') {
          supporting += 1;
        } else if (stance === 'CONTRADICTING') {
          contradicting += 1;
        } else {
          // If evidence item has no valid status or unknown value, safely categorize as unclear
          unclear += 1;
        }
      }

      return {
        supporting,
        contradicting,
        unclear,
        total: evidence.length
      };
    }

    // Fallback if only summary object is provided
    const sup = Math.max(0, Number(summary?.supporting) || 0);
    const con = Math.max(0, Number(summary?.contradicting) || 0);
    const unc = Math.max(0, Number(summary?.unclear) || 0);
    return {
      supporting: sup,
      contradicting: con,
      unclear: unc,
      total: sup + con + unc
    };
  }, [evidence, summary]);

  const total = counts.total;
  const supPct = total > 0 ? (counts.supporting / total) * 100 : 0;
  const conPct = total > 0 ? (counts.contradicting / total) * 100 : 0;
  const uncPct = total > 0 ? (counts.unclear / total) * 100 : 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Retrieved Evidence Stance Distribution
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
            {total} {total === 1 ? 'source' : 'sources'}
          </span>
        </div>

        {/* Segmented Distribution Bar */}
        <div 
          className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex mb-4"
          role="progressbar"
          aria-label="Evidence stance distribution"
          aria-valuenow={total}
        >
          {supPct > 0 && (
            <div 
              style={{ width: `${supPct}%` }} 
              className="bg-emerald-500 h-full transition-all duration-500" 
              title={`Supporting: ${counts.supporting} (${Math.round(supPct)}%)`}
            />
          )}
          {conPct > 0 && (
            <div 
              style={{ width: `${conPct}%` }} 
              className="bg-rose-500 h-full transition-all duration-500" 
              title={`Contradicting: ${counts.contradicting} (${Math.round(conPct)}%)`}
            />
          )}
          {uncPct > 0 && (
            <div 
              style={{ width: `${uncPct}%` }} 
              className="bg-slate-500 h-full transition-all duration-500" 
              title={`Unclear / Context: ${counts.unclear} (${Math.round(uncPct)}%)`}
            />
          )}
        </div>
      </div>

      {/* Counters with Accessible Icons */}
      <div className="grid grid-cols-3 gap-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <div className="text-xs min-w-0">
            <span className="font-bold font-mono text-sm block sm:inline mr-1">{counts.supporting}</span>
            <span className="text-slate-300">Supporting</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <XCircle className="w-4 h-4 shrink-0" />
          <div className="text-xs min-w-0">
            <span className="font-bold font-mono text-sm block sm:inline mr-1">{counts.contradicting}</span>
            <span className="text-slate-300">Contradicting</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 rounded-lg bg-slate-700/20 border border-slate-700/40 text-slate-300">
          <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
          <div className="text-xs min-w-0">
            <span className="font-bold font-mono text-sm block sm:inline mr-1">{counts.unclear}</span>
            <span className="text-slate-400">Unclear</span>
          </div>
        </div>
      </div>
    </div>
  );
};
