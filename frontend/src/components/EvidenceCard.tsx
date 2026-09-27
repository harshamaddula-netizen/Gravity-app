import React from 'react';
import { EvidenceItem } from '../types/verification';
import { ExternalLink, Calendar, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface Props {
  evidence: EvidenceItem;
  rank: number;
}

export const EvidenceCard: React.FC<Props> = ({ evidence, rank }) => {
  const relevancePct = Math.round(evidence.relevance_score * 100);

  const stanceBadges = {
    SUPPORTING: {
      label: 'Supporting',
      icon: CheckCircle,
      classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    CONTRADICTING: {
      label: 'Contradicting',
      icon: XCircle,
      classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    },
    UNCLEAR: {
      label: 'Unclear / Context',
      icon: HelpCircle,
      classes: 'bg-slate-700/20 text-slate-300 border-slate-700/40'
    }
  };

  const badge = stanceBadges[evidence.stance] || stanceBadges.UNCLEAR;
  const StanceIcon = badge.icon;

  return (
    <article className="glass-card rounded-xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md">
      {/* Top Header: Source, Stance, Relevance */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            #{rank}
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300">
            {evidence.source}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Stance Tag */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.classes}`}>
            <StanceIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>

          {/* Relevance percentage */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono" title="Semantic relevance score">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 rounded-full" 
                style={{ width: `${relevancePct}%` }}
              />
            </div>
            <span>{relevancePct}% match</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white mb-2 leading-snug">
        {evidence.title}
      </h3>

      {/* Relevant Passage */}
      <blockquote className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l-2 border-slate-700 bg-slate-900/40 py-2 pr-3 rounded-r-lg mb-4 italic font-sans">
        "{evidence.passage}"
      </blockquote>

      {/* Footer: Date and External Link */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {evidence.published_at ? (
            <>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Published: {evidence.published_at}</span>
            </>
          ) : (
            <span className="text-slate-500">Peer-reviewed reference</span>
          )}
        </div>

        {evidence.url ? (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-brand-400 hover:text-brand-300 hover:underline transition-colors font-medium"
          >
            <span>View Primary Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-slate-500">Local Reference Corpus</span>
        )}
      </div>
    </article>
  );
};
