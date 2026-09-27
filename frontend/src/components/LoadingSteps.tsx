import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Search, Cpu, Sparkles } from 'lucide-react';

interface Props {
  isVerifying: boolean;
}

export const LoadingSteps: React.FC<Props> = ({ isVerifying }) => {
  const steps = [
    { id: 1, label: 'Analyzing claim semantics & intent...', icon: Cpu },
    { id: 2, label: 'Finding evidence across indexed corpus...', icon: Search },
    { id: 3, label: 'Comparing sources & evaluating contradiction...', icon: Loader2 },
    { id: 4, label: 'Generating evidence-grounded explanation...', icon: Sparkles },
  ];

  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (!isVerifying) {
      setActiveStep(1);
      return;
    }

    const t1 = setTimeout(() => setActiveStep(2), 250);
    const t2 = setTimeout(() => setActiveStep(3), 500);
    const t3 = setTimeout(() => setActiveStep(4), 850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVerifying]);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl border border-brand-500/20 text-center animate-pulse-subtle">
      <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto mb-5 text-brand-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        Verifying Claim
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Applying retrieval-augmented uncertainty analysis
      </p>

      <div className="space-y-3 text-left">
        {steps.map((step) => {
          const isDone = activeStep > step.id;
          const isCurrent = activeStep === step.id;
          const Icon = step.icon;

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                isCurrent 
                  ? 'bg-brand-500/10 border-brand-500/30 text-brand-300' 
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                  : 'bg-transparent border-transparent text-slate-600 opacity-60'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Icon className="w-4 h-4 text-brand-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" />
                )}
              </div>
              <span className="text-sm font-medium">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
