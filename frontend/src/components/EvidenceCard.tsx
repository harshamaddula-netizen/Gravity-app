import React, { useState } from 'react';
import { EvidenceItem } from '../types/verification';
import { ExternalLink, Calendar, CheckCircle2, XCircle, HelpCircle, Copy, Check } from 'lucide-react';

interface Props {
  evidence: EvidenceItem;
  rank: number;
}

export const EvidenceCard: React.FC<Props> = ({ evidence, rank }) => {
  const [copied, setCopied] = useState(false);
  const relevancePct = Math.round((evidence.relevance_score || 0) * 100);

  const stanceBadges = {
    SUPPORTING: {
      label: 'Supporting',
      icon: CheckCircle2,
      classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    CONTRADICTING: {
      label: 'Contradicting',
      icon: XCircle,
      classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    },
    UNCLEAR: {
      label: 'Unclear / Context',
      icon: HelpCircle,
      classes: 'bg-slate-700/25 text-slate-300 border-slate-600/40'
    }
  };

  const rawStance = (evidence.stance || '').toUpperCase() as keyof typeof stanceBadges;
  const badge = stanceBadges[rawStance] || stanceBadges.UNCLEAR;
  const StanceIcon = badge.icon;

  // URL validation to ensure only valid HTTP/HTTPS URLs render as clickable links
  const isValidUrl = (url?: string | null): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const hasValidUrl = isValidUrl(evidence.url);

  const handleCopyQuote = async () => {
    try {
      const textToCopy = `"${evidence.passage}"\n— Source: ${evidence.source} (${evidence.title})${hasValidUrl ? `\nURL: ${evidence.url}` : ''}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  return (
    <article className="glass-card rounded-xl p-4 sm:p-5 border border-slate-800 hover:border-slate-700/80 transition-all duration-200 shadow-md min-w-0 overflow-hidden">
      {/* Top Header: Source, Stance, Relevance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
            #{rank}
          </span>
          <span 
            className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 break-words max-w-full sm:max-w-md"
            title={evidence.source}
          >
            {evidence.source}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Stance Tag */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.classes}`}>
            <StanceIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{badge.label}</span>
          </span>

          {/* Relevance percentage */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800/50 px-2 py-0.5 rounded-lg border border-slate-700/40" title="Semantic relevance score">
            <div className="w-10 h-1.5 bg-slate-700 rounded-full overflow-hidden shrink-0">
              <div 
                className="h-full bg-brand-500 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, relevancePct))}%` }}
              />
            </div>
            <span>{relevancePct}% match</span>
          </div>
        </div>
      </div>

      {/* Document / Source Title */}
      <h4 className="text-sm sm:text-base font-semibold text-white mt-3 mb-2.5 leading-snug break-words">
        {evidence.title}
      </h4>

      {/* Relevant Evidence Passage / Reasoning */}
      <div className="relative my-3 rounded-lg bg-slate-950/70 border-l-4 border-brand-500/70 p-3.5 sm:p-4">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-sans break-words whitespace-pre-line">
          "{evidence.passage}"
        </p>
      </div>

      {/* Footer: Date and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
          {evidence.published_at ? (
            <span className="flex items-center gap-1.5 text-slate-400 truncate">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Published: {evidence.published_at}</span>
            </span>
          ) : (
            <span className="text-slate-500 italic">Peer-reviewed reference literature</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Action Button: Copy Quote */}
          <button
            type="button"
            onClick={handleCopyQuote}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors"
            title="Copy quote & source citation"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Citation' : 'Copy Quote'}</span>
          </button>

          {/* Action Button: Open Source Link */}
          {hasValidUrl ? (
            <a
              href={evidence.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 hover:text-brand-200 border border-brand-500/30 text-xs font-semibold transition-all group"
            >
              <span>View Primary Source</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800/40 text-slate-500 border border-slate-800 text-[11px]">
              Local Corpus Index
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
