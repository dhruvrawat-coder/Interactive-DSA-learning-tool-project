import React, { useState } from 'react';
import { 
  ArrowRight, Check, X, Sparkles, HelpCircle, Eye, 
  Lightbulb, AlertTriangle, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useDPStore } from '../core/store';

interface PredictionScenario {
  problemId: string;
  stepName: string;
  contextDesc: string;
  dependenciesUsed: string;
  options: {
    val: number;
    choiceDesc: string;
    isCorrect: boolean;
    calculation: string;
    whyWrong?: string;
  }[];
  revealedExplanation: string;
}

const PREDICTION_SCENARIOS: Record<string, PredictionScenario> = {
  'fibonacci': {
    problemId: 'fibonacci',
    stepName: 'Calculate dp[4]',
    contextDesc: 'Table currently contains: dp[0]=0, dp[1]=1, dp[2]=1, dp[3]=2.',
    dependenciesUsed: 'dp[4] = dp[3] + dp[2]',
    options: [
      {
        val: 3,
        choiceDesc: '2 + 1 = 3',
        isCorrect: true,
        calculation: 'dp[3] (2) + dp[2] (1) = 3'
      },
      {
        val: 4,
        choiceDesc: '2 + 2 = 4',
        isCorrect: false,
        calculation: 'Incorrect addition',
        whyWrong: 'Accidentally doubled dp[3] instead of summing dp[3] and dp[2].'
      },
      {
        val: 5,
        choiceDesc: 'dp[3] + 3 = 5',
        isCorrect: false,
        calculation: 'Wrong recurrence formula',
        whyWrong: 'Adding index 3 instead of the previous state dp[2].'
      }
    ],
    revealedExplanation: 'F(4) combines exactly the two immediate prior subproblems: F(3) = 2 and F(2) = 1. Therefore, dp[4] = 2 + 1 = 3.'
  },
  'knapsack-01': {
    problemId: 'knapsack-01',
    stepName: 'Calculate dp[2][5] (Item 2: wt=3, val=4, Bag Cap=5)',
    contextDesc: 'From row 1, we already know: dp[1][5] = 3 (Exclude item 2 value) and dp[1][5 - 3] = dp[1][2] = 3.',
    dependenciesUsed: 'max(dp[1][5], val2 + dp[1][5 - 3])',
    options: [
      {
        val: 7,
        choiceDesc: 'Include Item 2: 4 + dp[1][2] (3) = 7',
        isCorrect: true,
        calculation: 'max(Exclude: 3, Include: 4 + 3) = 7'
      },
      {
        val: 4,
        choiceDesc: 'Take only Item 2 alone: 4',
        isCorrect: false,
        calculation: 'Forgot remaining capacity subproblem',
        whyWrong: 'Item 2 weighs 3, leaving 2 units of capacity in the bag. You must add the optimal value achievable with the remaining 2 capacity from row 1 (dp[1][2] = 3)!'
      },
      {
        val: 3,
        choiceDesc: 'Exclude Item 2: 3',
        isCorrect: false,
        calculation: 'Suboptimal decision',
        whyWrong: 'Excluding Item 2 yields 3, but including it gives 4 + 3 = 7, which is strictly higher.'
      }
    ],
    revealedExplanation: 'Because available capacity (5) >= item weight (3), we compare leaving it (3) vs taking it (4 + dp[1][2] = 7). max(3, 7) = 7.'
  },
  'lis': {
    problemId: 'lis',
    stepName: 'Calculate dp[3] for nums = [10, 9, 2, 5]',
    contextDesc: 'Evaluated so far: dp[0]=1 (10), dp[1]=1 (9), dp[2]=1 (2). Now evaluating nums[3] = 5.',
    dependenciesUsed: 'dp[3] = 1 + max({ dp[j] for nums[j] < 5 })',
    options: [
      {
        val: 2,
        choiceDesc: 'Extend from nums[2]=2: 1 + dp[2] (1) = 2',
        isCorrect: true,
        calculation: 'nums[2]=2 < 5, so 1 + dp[2] = 2'
      },
      {
        val: 3,
        choiceDesc: '1 + dp[1] + dp[2] = 3',
        isCorrect: false,
        calculation: 'Invalid addition of lengths',
        whyWrong: 'You cannot sum previous LIS lengths. You can only pick ONE predecessor sequence to extend!'
      },
      {
        val: 1,
        choiceDesc: 'No predecessor valid: 1',
        isCorrect: false,
        calculation: 'Missed predecessor nums[2]=2',
        whyWrong: 'Element nums[2] is 2, which is strictly less than 5. Thus, the sequence [2, 5] is valid and has length 2.'
      }
    ],
    revealedExplanation: 'Among all predecessors {10, 9, 2}, only 2 is smaller than 5. We extend sequence [2] by adding 5, yielding length dp[3] = 1 + dp[2] = 2.'
  }
};

export const NextCellPredictorModal: React.FC<{ problemId: string; onClose: () => void }> = ({ problemId, onClose }) => {
  const scenario = PREDICTION_SCENARIOS[problemId] || PREDICTION_SCENARIOS['fibonacci'];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const chosen = selectedIdx !== null ? scenario.options[selectedIdx] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#00F0FF]/50 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A3A3A3] hover:text-white p-1 rounded hover:bg-[#162846]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#00F0FF] text-black font-black flex items-center justify-center text-xs">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider">
              "Predict the Next Cell" Challenge
            </h3>
            <p className="text-[11px] text-[#A3A3A3]">
              Active learning: test your grasp of the recurrence transition before the computer reveals it.
            </p>
          </div>
        </div>

        {/* Challenge Context Box */}
        <div className="p-3 bg-[#1A1A1A] border border-[#1E385C] rounded space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#00F0FF]">
            <span>TARGET: {scenario.stepName}</span>
            <span className="text-[10px] text-[#A3A3A3] bg-[#162846] px-2 py-0.5 rounded border border-[#23416B]">
              Active Checkpoint
            </span>
          </div>
          <p className="text-xs text-white leading-relaxed font-mono">
            {scenario.contextDesc}
          </p>
          <div className="text-[11px] font-mono text-[#A3A3A3] pt-1 border-t border-[#1A3052]">
            <strong className="text-white">Transition Formula:</strong> {scenario.dependenciesUsed}
          </div>
        </div>

        {/* Interactive Prediction Choices */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-[#A3A3A3] font-bold block">
            What will be stored in this DP cell?
          </label>
          {scenario.options.map((opt, i) => {
            const isSelected = selectedIdx === i;
            let style = 'bg-[#0F1B2F] border-[#1E385C] text-[#A3A3A3] hover:border-[#00F0FF] hover:text-white';

            if (submitted) {
              if (opt.isCorrect) {
                style = 'bg-[#0F1B2F] border-[#00F0FF] text-white ring-1 ring-[#00F0FF] font-bold';
              } else if (isSelected && !opt.isCorrect) {
                style = 'bg-[#0F1B2F] border-red-500 text-red-300';
              }
            } else if (isSelected) {
              style = 'bg-[#162846] border-[#00F0FF] text-white font-bold';
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelectedIdx(i)}
                className={`w-full text-left p-3 rounded-[3px] border transition-colors flex items-center justify-between text-xs font-mono ${style}`}
              >
                <div>
                  <span className="font-bold text-white mr-2 text-sm">{opt.val}</span>
                  <span>({opt.choiceDesc})</span>
                </div>
                {submitted && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                )}
                {submitted && isSelected && !opt.isCorrect && (
                  <X className="w-4 h-4 text-red-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Result Explanation */}
        {submitted && chosen && (
          <div className={`p-3 rounded border text-xs leading-relaxed space-y-1 ${
            chosen.isCorrect
              ? 'bg-[#1A1A1A] border-[#00F0FF] text-white'
              : 'bg-[#1A1A1A] border-red-500 text-red-200'
          }`}>
            <div className="font-mono font-bold flex items-center gap-1.5 uppercase text-[11px]">
              {chosen.isCorrect ? (
                <span className="text-[#00F0FF] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Spot on! Prediction Confirmed
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Prediction Failed: {chosen.whyWrong}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#A3A3A3] pt-1 font-mono">
              {scenario.revealedExplanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1A3052]">
          {!submitted ? (
            <button
              disabled={selectedIdx === null}
              onClick={() => setSubmitted(true)}
              className="px-4 py-1.5 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] disabled:opacity-30 disabled:hover:bg-[#00F0FF] text-black text-xs font-mono font-black transition-colors uppercase tracking-wider"
            >
              Confirm Prediction
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] text-black text-xs font-mono font-black transition-colors uppercase tracking-wider"
            >
              Resume Execution
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

