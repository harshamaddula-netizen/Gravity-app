import React from 'react';
import { ShieldCheck, ShieldAlert, Scale, HelpCircle } from 'lucide-react';
import { AssessmentState } from '../types/verification';

interface Props {
  assessment: AssessmentState;
  size?: 'sm' | 'md' | 'lg';
}

export const AssessmentBadge: React.FC<Props> = ({ assessment, size = 'md' }) => {
  const configs = {
    SUPPORTED: {
      label: 'Supported',
      icon: ShieldCheck,
      classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      description: 'Retrieved evidence substantiates this claim.'
    },
    CONTRADICTED: {
      label: 'Contradicted',
      icon: ShieldAlert,
      classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      iconColor: 'text-rose-400',
      description: 'Retrieved evidence actively refutes or disproves this claim.'
    },
    MIXED: {
      label: 'Mixed Evidence',
      icon: Scale,
      classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      iconColor: 'text-amber-400',
      description: 'Available evidence exhibits substantive conflict or conditional outcomes.'
    },
    INSUFFICIENT_EVIDENCE: {
      label: 'Insufficient Evidence',
      icon: HelpCircle,
      classes: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
      iconColor: 'text-slate-400',
      description: 'Available literature is inadequate to make a reliable determination.'
    }
  };

  const config = configs[assessment] || configs.INSUFFICIENT_EVIDENCE;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-semibold'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div 
      className={`inline-flex items-center rounded-lg border font-medium tracking-wide shadow-sm ${config.classes} ${sizeClasses[size]}`}
      role="status"
      aria-label={`Assessment: ${config.label}`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor} shrink-0`} aria-hidden="true" />
      <span>{config.label}</span>
    </div>
  );
};
