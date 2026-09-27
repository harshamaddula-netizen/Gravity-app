import React from 'react';
import { VerifyResponse } from '../types/verification';
import { AssessmentBadge } from '../components/AssessmentBadge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { EvidenceSummaryBar } from '../components/EvidenceSummaryBar';
import { EvidenceCard } from '../components/EvidenceCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Clock, Hash, RotateCcw, Share2, Check } from 'lucide-react';

interface Props {
  data: VerifyResponse;
  onReset: () => void;
}

export const ResultView: React.FC<Props> = ({ data, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `TruthLens AI Verification Report\nClaim: "${data.claim}"\nAssessment: ${data.assessment} (${Math.round(data.assessment_confidence * 100)}% confidence)\n\nExplanation:\n${data.explanation}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isInsufficient = data.assessment === 'INSUFFICIENT_EVIDENCE';

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Verify Another Claim</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
        </button>
      </div>

      {/* Main Assessment Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="mb-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Submitted Claim
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
            "{data.claim}"
          </h2>
        </div>

        {/* Assessment and Confidence Badges */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1.5">Algorithmic Assessment</div>
            <AssessmentBadge assessment={data.assessment} size="lg" />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{data.processing_time_ms} ms</span>
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span title={data.id}>ID: {data.id.slice(0, 8)}...</span>
            </span>
          </div>
        </div>
      </div>

      {/* Insufficient Evidence Callout if applicable */}
      {isInsufficient && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-lg">
          <h3 className="text-base font-semibold text-slate-200 mb-1">
            Insufficient Evidence
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            TruthLens could not find enough relevant evidence to make a reliable assessment. Rather than manufacturing unsupported certainty, the system refrains from a definitive confirmation or contradiction.
          </p>
        </div>
      )}

      {/* Confidence Meter and Evidence Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <ConfidenceMeter confidence={data.assessment_confidence} />
        <EvidenceSummaryBar summary={data.summary} />
      </div>

      {/* Evidence-Grounded Explanation */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-400">
            Synthesis & Reasoning
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            Evidence-Grounded
          </span>
        </div>
        <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line font-sans">
          {data.explanation}
        </div>
      </div>

      {/* Retrieved Evidence Sources Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Retrieved Primary Evidence & Citations
            </h3>
            <p className="text-xs text-slate-400">
              Ranked by semantic relevance to the submitted claim
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {data.evidence.length} sources analyzed
          </span>
        </div>

        {data.evidence.length === 0 ? (
          <div className="text-center py-10 glass-card rounded-2xl border border-slate-800 text-slate-400">
            No matching documents were retrieved from the local corpus index.
          </div>
        ) : (
          <div className="space-y-4">
            {data.evidence.map((item, idx) => (
              <EvidenceCard 
                key={`${item.title}-${idx}`} 
                evidence={item} 
                rank={idx + 1} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Caveat & Responsible AI Notice */}
      <DisclaimerBanner customCaveat={data.caveat} />
    </div>
  );
};
