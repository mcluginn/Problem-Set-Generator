'use client';

import React, { useState, useEffect } from 'react';
import { PracticeStore } from '../../services/database/store';
import { MistakeRecord } from '../../services/database/types';
import { MathRenderer } from '../math/MathRenderer';
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

interface MistakesReviewProps {
  onPracticeMistake: (concept: string, misconceptionCode: string) => void;
  onBack: () => void;
}

export const MistakesReview: React.FC<MistakesReviewProps> = ({
  onPracticeMistake,
  onBack,
}) => {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

  useEffect(() => {
    PracticeStore.load();
    setMistakes(PracticeStore.getMistakes());
  }, []);

  const handleResolve = (code: string) => {
    PracticeStore.resolveMistake(code);
    setMistakes([...PracticeStore.getMistakes()]);
  };

  const activeMistakes = mistakes.filter((m) => !m.resolved);
  const resolvedMistakes = mistakes.filter((m) => m.resolved);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 text-slate-200 text-xs font-mono rounded-lg transition flex items-center space-x-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-brass-400" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          {activeMistakes.length} Active / {mistakes.length} Total Logged
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 tracking-tight">
          <AlertTriangle className="w-7 h-7 text-brass-400" />
          My Mistakes &amp; Misconceptions
        </h1>
        <p className="text-sm text-slate-400">
          Targeted review of detected misconception patterns. Practice specifically designed problems to turn weaknesses into strengths.
        </p>
      </div>

      {/* Active Misconceptions List */}
      <div className="space-y-4">
        {activeMistakes.length === 0 ? (
          <div className="p-8 bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl text-center space-y-3 shadow-md">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">No Unresolved Misconceptions!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You have resolved all diagnosed mistake patterns. Keep practicing diverse concepts to maintain mastery.
            </p>
          </div>
        ) : (
          activeMistakes.map((mistake) => (
            <div
              key={mistake.id}
              className="bg-[#0a2344]/60 border border-amber-500/40 hover:border-amber-500/60 rounded-xl p-6 sm:p-7 space-y-4 shadow-lg transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2c4f75]/30 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                    {mistake.concept}
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-medium">
                    {mistake.misconceptionName}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Encountered {mistake.occurredCount}x
                </span>
              </div>

              {/* Problem Statement Display */}
              <div className="p-4 bg-[#06162f]/80 rounded-lg space-y-2 border border-[#2c4f75]/30">
                <span className="text-xs font-mono text-brass-400 font-bold uppercase">Problem Context:</span>
                <div className="text-base text-white">
                  <MathRenderer latex={mistake.problemLatex} displayMode />
                </div>
              </div>

              {/* Submitted vs Correct Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-rose-950/20 border border-rose-800/50 rounded-lg space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase">Your Submission:</span>
                  <div className="text-sm text-rose-200 font-mono">
                    <MathRenderer latex={mistake.studentAnswer} />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/50 rounded-lg space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Verified Solution:</span>
                  <div className="text-sm text-emerald-200 font-mono">
                    <MathRenderer latex={mistake.correctAnswerLatex} />
                  </div>
                </div>
              </div>

              {/* Diagnostic Explanation */}
              <div className="p-4 bg-[#06162f]/60 border border-[#2c4f75]/30 rounded-lg text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-amber-300 mb-1">Diagnosed Error Pattern:</p>
                <MathRenderer latex={mistake.explanation} />
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onPracticeMistake(mistake.concept, mistake.misconceptionCode)}
                  className="px-4 py-2 bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs rounded-lg transition flex items-center space-x-2 shadow-md shadow-brass-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Practice This Mistake (Targeted Remediation)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolve(mistake.misconceptionCode)}
                  className="px-3.5 py-2 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-300 text-xs font-medium rounded-lg border border-[#2c4f75]/40 transition flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved History */}
      {resolvedMistakes.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#2c4f75]/30">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Resolved Misconceptions ({resolvedMistakes.length})
          </h2>
          <div className="space-y-2">
            {resolvedMistakes.map((m) => (
              <div
                key={m.id}
                className="p-3.5 bg-[#06162f]/60 border border-[#2c4f75]/25 rounded-lg flex items-center justify-between text-xs text-slate-400"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-200 font-mono">{m.concept}:</span>
                  <span>{m.misconceptionName}</span>
                </div>
                <span className="text-emerald-400/80 font-mono text-[11px] uppercase font-bold">Resolved</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
