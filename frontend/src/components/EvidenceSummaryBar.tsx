import React from 'react';
import { EvidenceSummary } from '../types/verification';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface Props {
  summary: EvidenceSummary;
}

export const EvidenceSummaryBar: React.FC<Props> = ({ summary }) => {
  const total = summary.supporting + summary.contradicting + summary.unclear;
  const supPct = total > 0 ? (summary.supporting / total) * 100 : 0;
  const conPct = total > 0 ? (summary.contradicting / total) * 100 : 0;
  const uncPct = total > 0 ? (summary.unclear / total) * 100 : 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
      <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
        Retrieved Evidence Stance Distribution
      </div>

      {/* Segmented Distribution Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex mb-4">
        {supPct > 0 && (
          <div 
            style={{ width: `${supPct}%` }} 
            className="bg-emerald-500 h-full transition-all duration-500" 
            title={`Supporting: ${summary.supporting}`}
          />
        )}
        {conPct > 0 && (
          <div 
            style={{ width: `${conPct}%` }} 
            className="bg-rose-500 h-full transition-all duration-500" 
            title={`Contradicting: ${summary.contradicting}`}
          />
        )}
        {uncPct > 0 && (
          <div 
            style={{ width: `${uncPct}%` }} 
            className="bg-slate-500 h-full transition-all duration-500" 
            title={`Unclear/Neutral: ${summary.unclear}`}
          />
        )}
      </div>

      {/* Counters with Accessible Icons */}
      <div className="grid grid-cols-3 gap-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <div className="text-xs">
            <span className="font-bold font-mono text-sm block sm:inline mr-1">{summary.supporting}</span>
            <span className="text-slate-300">Supporting</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <XCircle className="w-4 h-4 shrink-0" />
          <div className="text-xs">
            <span className="font-bold font-mono text-sm block sm:inline mr-1">{summary.contradicting}</span>
            <span className="text-slate-300">Contradicting</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-1.5 p-2 rounded-lg bg-slate-700/20 border border-slate-700/40 text-slate-300">
          <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
          <div className="text-xs">
            <span className="font-bold font-mono text-sm block sm:inline mr-1">{summary.unclear}</span>
            <span className="text-slate-400">Unclear</span>
          </div>
        </div>
      </div>
    </div>
  );
};
