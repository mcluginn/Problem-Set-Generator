'use client';

import React from 'react';
import { DomainValidationResult } from '@/engine/content/types';
import { CheckCircle2, AlertCircle, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface DomainFeedbackCardProps {
  result?: DomainValidationResult;
  courseId?: string;
  isCorrect?: boolean | null;
}

export const DomainFeedbackCard: React.FC<DomainFeedbackCardProps> = ({
  result,
  courseId,
  isCorrect
}) => {
  if (!result || isCorrect === null) return null;

  const getDomainTitle = () => {
    switch (result.domainValidatorType) {
      case 'PHYSICS':
        return 'Physics 2 Invariant & Dimensional Verification';
      case 'THERMODYNAMICS':
        return 'Thermodynamics Conservation & State Postulate';
      case 'ODE':
        return 'Differential Equations & Operator Consistency';
      case 'MATH_FOR_ENGINEERS':
        return 'Engineering Mathematics Geometric & Root Bounds';
      case 'IE_SPECIAL_TOPICS':
        return 'Engineering Economy & Feasibility Criteria';
      default:
        return 'Problem Model Specification & Invariant Audit';
    }
  };

  return (
    <div className="bg-[#06162f]/90 border border-[#2c4f75]/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#2c4f75]/25 pb-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-brass-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            {getDomainTitle()}
          </span>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
            result.status === 'PASS'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : result.status === 'FAIL'
              ? 'bg-rose-950 text-rose-300 border border-rose-800'
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}
        >
          Problem Spec: {result.status === 'PASS' ? 'Validated' : result.status}
        </span>
      </div>

      {/* Discrete Checks */}
      <div className="space-y-1.5">
        {result.checks.map((check, idx) => (
          <div key={idx} className="flex items-start space-x-2 text-xs">
            {check.passed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span className={check.passed ? 'text-slate-300' : 'text-rose-300 font-medium'}>
              {check.description || check.name}
            </span>
          </div>
        ))}
      </div>

      {/* Errors / Warnings */}
      {result.errors.length > 0 && (
        <div className="p-2.5 bg-rose-950/40 border border-rose-900/60 rounded-lg space-y-1">
          {result.errors.map((err, idx) => (
            <div key={idx} className="text-xs text-rose-200 flex items-start space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong className="font-mono text-rose-300">[{err.code}]:</strong> {err.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="p-2 bg-amber-950/30 border border-amber-900/50 rounded-lg space-y-1">
          {result.warnings.map((warn, idx) => (
            <div key={idx} className="text-xs text-amber-200 flex items-start space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{warn.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
