import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { VerifyResponse } from '../types/verification';
import { AssessmentBadge } from '../components/AssessmentBadge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { EvidenceSummaryBar } from '../components/EvidenceSummaryBar';
import { EvidenceCard } from '../components/EvidenceCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Clock, Hash, RotateCcw, Share2, Check, ShieldCheck, Scale, ChevronRight } from 'lucide-react';


interface Props {
  data: VerifyResponse;
  onReset: () => void;
}

export const ResultView: React.FC<Props> = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'verdict' | 'analysis' | 'evidence' | 'how-it-works'>('verdict');

  // Dynamically calculate status counts directly from the actual evidence array
  const evidenceCounts = useMemo(() => {
    const list = Array.isArray(data?.evidence) ? data.evidence : [];
    let supporting = 0;
    let contradicting = 0;
    let unclear = 0;

    for (const item of list) {
      const stance = typeof item?.stance === 'string' ? item.stance.trim().toUpperCase() : '';
      if (stance === 'SUPPORTING') {
        supporting += 1;
      } else if (stance === 'CONTRADICTING') {
        contradicting += 1;
      } else {
        // Unknown or missing stance safely falls into unclear count
        unclear += 1;
      }
    }

    return {
      supporting,
      contradicting,
      unclear,
      total: list.length
    };
  }, [data?.evidence]);

  // Automatically position the user at the top of the main result section when mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      const target = document.getElementById('result-top');
      if (target) {
        const headerOffset = 80; // 64px fixed header + 16px buffer
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [data?.id]);

  const scrollToSection = (sectionId: 'verdict' | 'analysis' | 'evidence' | 'how-it-works') => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `TruthLens AI Verification Report\nClaim: "${data.claim}"\nAssessment: ${data.assessment} (${Math.round(data.assessment_confidence * 100)}% confidence)\n\nExplanation:\n${data.explanation}\n\nEvidence Summary: ${evidenceCounts.supporting} Supporting, ${evidenceCounts.contradicting} Contradicting, ${evidenceCounts.unclear} Unclear (${evidenceCounts.total} total sources)`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const isInsufficient = data.assessment === 'INSUFFICIENT_EVIDENCE';

  return (
    <div id="result-top" className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar & Result Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <button
          id="verify-another-btn"
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-colors shadow-sm self-start"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Verify Another Claim</span>
        </button>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => scrollToSection('verdict')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              activeSection === 'verdict'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Verdict
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('analysis')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              activeSection === 'analysis'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Analysis & Reasoning
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('evidence')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              activeSection === 'evidence'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Evidence ({evidenceCounts.total})
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              activeSection === 'how-it-works'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 transition-colors ml-auto shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share Report'}</span>
          </button>
        </div>
      </div>

      {/* 1. Main Assessment / Verdict Header Card */}
      <section 
        id="verdict" 
        className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 scroll-mt-24"
        aria-label="Verification Verdict"
      >
        <div className="mb-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Submitted Claim
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 leading-snug break-words">
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
      </section>

      {/* Insufficient Evidence Callout if applicable */}
      {isInsufficient && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-lg">
          <h3 className="text-base font-semibold text-slate-200 mb-1 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Refusal to Fabricate Certainty</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed break-words">
            TruthLens could not retrieve sufficient authoritative, peer-reviewed evidence to make a definitive confirmation or contradiction. Rather than manufacturing unsupported certainty, the system explicitly reports insufficient evidence.
          </p>
        </div>
      )}

      {/* Confidence Meter and Evidence Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <ConfidenceMeter confidence={data.assessment_confidence} />
        <EvidenceSummaryBar 
          summary={data.summary} 
          evidence={data.evidence} 
        />
      </div>

      {/* 2. Evidence-Grounded Explanation / Analysis */}
      <section 
        id="analysis" 
        className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 scroll-mt-24 min-w-0"
        aria-label="Analysis and Reasoning"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-400">
            Synthesis & Reasoning
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            Evidence-Grounded
          </span>
        </div>
        <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line font-sans break-words overflow-hidden">
          {data.explanation}
        </div>
      </section>

      {/* 3. Retrieved Evidence Sources Section */}
      <section 
        id="evidence" 
        className="scroll-mt-24 space-y-4"
        aria-label="Primary Evidence and Citations"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Retrieved Primary Evidence & Citations
            </h3>
            <p className="text-xs text-slate-400">
              Ranked by semantic relevance to the submitted claim
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
            {evidenceCounts.total} {evidenceCounts.total === 1 ? 'source' : 'sources'} analyzed
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
      </section>

      {/* 4. How TruthLens AI Works: In-Report Methodology Summary */}
      <section 
        id="how-it-works" 
        className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 scroll-mt-24 space-y-4"
        aria-label="How TruthLens AI Works"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              How TruthLens AI Works
            </h3>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>View Full Architecture</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
          TruthLens AI uses an evidence-first architecture that strictly decouples factual determination from generative language models:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-semibold text-brand-300 block mb-1">1. Vector Retrieval</span>
            <p className="text-slate-400">Queries an indexed corpus using cosine similarity without hallucinations.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-semibold text-brand-300 block mb-1">2. Uncertainty Layer</span>
            <p className="text-slate-400">Enforces mathematical thresholds before determining Supported or Contradicted.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-semibold text-brand-300 block mb-1">3. Grounded Synthesis</span>
            <p className="text-slate-400">Explanation is strictly restricted to citations present in the retrieved passages.</p>
          </div>
        </div>
      </section>

      {/* Caveat & Responsible AI Notice */}
      <DisclaimerBanner customCaveat={data.caveat} />
    </div>
  );
};
