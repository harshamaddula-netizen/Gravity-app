import React from 'react';
import { AssessmentState } from '../types/verification';
import { ShieldCheck, ShieldAlert, Scale, HelpCircle, ArrowRight } from 'lucide-react';

interface DemoClaim {
  id: string;
  claim: string;
  expected: AssessmentState;
  category: string;
  badgeLabel: string;
}

const DEMO_CLAIMS: DemoClaim[] = [
  {
    id: '1',
    claim: 'Water boils at 100 degrees Celsius under standard atmospheric pressure.',
    expected: 'SUPPORTED',
    category: 'Thermodynamics & Physics',
    badgeLabel: 'Expected: Supported'
  },
  {
    id: '2',
    claim: 'Vaccines contain microchips to secretly track citizens.',
    expected: 'CONTRADICTED',
    category: 'Public Health Fact Check',
    badgeLabel: 'Expected: Contradicted'
  },
  {
    id: '3',
    claim: 'Drinking coffee significantly reduces the risk of heart disease.',
    expected: 'MIXED',
    category: 'Cardiology & Nutrition',
    badgeLabel: 'Expected: Mixed Evidence'
  },
  {
    id: '4',
    claim: 'Extraterrestrial beings established a secret hyper-quantum base beneath Mount Vinson in 1947.',
    expected: 'INSUFFICIENT_EVIDENCE',
    category: 'Unverified Speculation',
    badgeLabel: 'Expected: Insufficient Evidence'
  }
];

interface Props {
  onSelectClaim: (claimText: string) => void;
  disabled?: boolean;
}

export const DemoClaimsSelector: React.FC<Props> = ({ onSelectClaim, disabled }) => {
  const getBadgeStyle = (state: AssessmentState) => {
    switch (state) {
      case 'SUPPORTED':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'CONTRADICTED':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'MIXED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'INSUFFICIENT_EVIDENCE':
        return 'text-slate-400 bg-slate-700/20 border-slate-700/40';
    }
  };

  const getIcon = (state: AssessmentState) => {
    switch (state) {
      case 'SUPPORTED': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'CONTRADICTED': return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'MIXED': return <Scale className="w-3.5 h-3.5" />;
      case 'INSUFFICIENT_EVIDENCE': return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-800/80">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Try Verified Demo Claims (Click to load)
        </span>
        <span className="text-[11px] text-slate-500">
          Evaluates all 4 primary verification states
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DEMO_CLAIMS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectClaim(item.claim)}
            className="text-left p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500 font-medium">
                {item.category}
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(item.expected)}`}>
                {getIcon(item.expected)}
                <span>{item.badgeLabel}</span>
              </span>
            </div>

            <p className="text-xs font-medium text-slate-200 group-hover:text-white leading-relaxed mb-2">
              "{item.claim}"
            </p>

            <div className="flex items-center gap-1 text-[11px] text-brand-400 font-medium group-hover:translate-x-0.5 transition-transform">
              <span>Test this claim</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
