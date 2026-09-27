import { Shield, Network, Scale, FileText } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-brand-400" />
          <span>System Architecture & Verification Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How TruthLens AI Works
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          TruthLens is deliberately engineered as an evidence-first misinformation assistant rather than an unconstrained "truth oracle".
        </p>
      </div>

      {/* 10-Step Pipeline Breakdown */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-brand-400" />
          <span>10-Stage Verification Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {[
            { step: '01', title: 'Claim Sanitization', desc: 'Normalizes whitespace, removes control characters, and enforces length bounds without altering semantic intent.' },
            { step: '02', title: 'ML Classifier Signal', desc: 'Generates preliminary categorization signals with a clearly exposed deterministic fallback mode.' },
            { step: '03', title: 'Vector Retrieval', desc: 'Transforms claims into vector embeddings and executes cosine similarity searches across the evidence corpus.' },
            { step: '04', title: 'Evidence Ranking', desc: 'Combines dense/sparse vector similarity with term coverage ratios, normalized strictly between 0.0 and 1.0.' },
            { step: '05', title: 'Stance Analysis', desc: 'Independently inspects each passage to classify its posture as SUPPORTING, CONTRADICTING, or UNCLEAR.' },
            { step: '06', title: 'Uncertainty Calculation', desc: 'Evaluates evidence density and conflict against minimum score thresholds (MIN_EVIDENCE_SCORE).' },
            { step: '07', title: 'Decision Engine', desc: 'Determines the final assessment state (SUPPORTED, CONTRADICTED, MIXED, or INSUFFICIENT_EVIDENCE).' },
            { step: '08', title: 'LLM Structured Reasoning', desc: 'Synthesizes grounded explanations strictly prohibited from citing non-existent sources or manufacturing facts.' },
            { step: '09', title: 'Confidence Calibration', desc: 'Computes assessment confidence reflecting evidence convergence rather than an absolute truth probability.' },
            { step: '10', title: 'Audit Trail Persistence', desc: 'Saves full verification sessions and evidence links to local SQLite for longitudinal analysis.' },
          ].map((item) => (
            <div key={item.step} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-brand-400 font-bold">{item.step}.</span>
                <span className="font-semibold text-slate-200">{item.title}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Uncertainty Engine Deep Dive */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <span>The Uncertainty Engine: Preventing Fabricated Certainty</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Traditional LLMs are prone to hallucinating citations when asked to verify facts. TruthLens AI introduces an independent <strong>Uncertainty Layer</strong> that decouples the final verdict from generative text generation:
        </p>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
          <div className="text-brand-400 font-semibold mb-1">// Core Uncertainty Rule</div>
          <div>IF max_relevance &lt; MIN_EVIDENCE_SCORE OR relevant_sources &lt; MIN_SOURCES:</div>
          <div className="pl-4 text-slate-400">→ RETURN <span className="text-slate-200 font-bold">INSUFFICIENT_EVIDENCE</span> (Confidence: 40%)</div>
          <div className="mt-2">IF supporting_weight &gt;= 0.40 AND contradicting_weight &gt;= 0.40:</div>
          <div className="pl-4 text-amber-400">→ RETURN <span className="font-bold">MIXED</span> (Documented scientific contention)</div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          This mathematical safeguard guarantees the system refuses to manufacture unwarranted certainty when evidence is sparse, outdated, or divided.
        </p>
      </section>

      {/* Primary Assessment States */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-400" />
          <span>Primary Assessment States</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <strong className="block text-emerald-400 text-sm mb-1">Supported</strong>
            Primary authoritative literature empirically substantiates the factual parameters of the claim.
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <strong className="block text-rose-400 text-sm mb-1">Contradicted</strong>
            Credible investigative, scientific, or regulatory benchmarks actively disprove or debunk the assertion.
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <strong className="block text-amber-400 text-sm mb-1">Mixed Evidence</strong>
            Peer-reviewed studies or authoritative accounts present conflicting outcomes, genotype-specific variances, or conditional trade-offs.
          </div>
          <div className="p-3 rounded-xl bg-slate-700/20 border border-slate-700/40 text-slate-300">
            <strong className="block text-slate-200 text-sm mb-1">Insufficient Evidence</strong>
            The verified corpus lacks sufficient qualifying literature to corroborate or refute the claim with integrity.
          </div>
        </div>
      </section>
    </main>
  );
};
