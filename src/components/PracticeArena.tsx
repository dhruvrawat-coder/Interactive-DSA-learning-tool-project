import React, { useState } from 'react';
import { Target, Award, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuestionChallenge {
  id: string;
  problemTitle: string;
  category: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  hint: string;
  explanation: string;
}

const CHALLENGES: QuestionChallenge[] = [
  {
    id: 'c1',
    problemTitle: 'House Robber',
    category: '1D DP',
    question: 'Adjacent houses cannot be robbed. If nums[i] is the money at house i, what is the recurrence relation for dp[i] (max money robbed up to house i)?',
    options: [
      { id: 'a', text: 'dp[i] = max(dp[i-1], nums[i] + dp[i-2])', isCorrect: true },
      { id: 'b', text: 'dp[i] = dp[i-1] + nums[i]', isCorrect: false },
      { id: 'c', text: 'dp[i] = min(dp[i-1], dp[i-2]) + nums[i]', isCorrect: false },
      { id: 'd', text: 'dp[i] = max(dp[i-1], dp[i-2])', isCorrect: false }
    ],
    hint: 'At house i, you either skip it (keep dp[i-1]) or rob it (take nums[i] plus optimal money from two houses back dp[i-2]).',
    explanation: 'House robber has 2 mutually exclusive decisions: skip house i (yielding dp[i-1]) or rob house i (yielding nums[i] + dp[i-2]). Taking the maximum gives dp[i] = max(dp[i-1], nums[i] + dp[i-2]).'
  },
  {
    id: 'c2',
    problemTitle: 'Coin Change (Min Coins)',
    category: 'Unbounded Knapsack',
    question: 'To find the minimum number of coins to make amount A, what should the table be initialized with (except dp[0] = 0)?',
    options: [
      { id: 'a', text: 'Infinity (or A + 1)', isCorrect: true },
      { id: 'b', text: '0', isCorrect: false },
      { id: 'c', text: '-1', isCorrect: false },
      { id: 'd', text: '1', isCorrect: false }
    ],
    hint: 'Since we are taking a minimum over choices, what initial value prevents invalid subproblems from being chosen as minimums?',
    explanation: 'Because we minimize over valid transitions min(dp[a], 1 + dp[a - coin]), unreachable states must evaluate to infinity so they are never erroneously selected as minimal.'
  },
  {
    id: 'c3',
    problemTitle: 'Longest Increasing Subsequence (LIS)',
    category: 'Subsequence DP',
    question: 'In the standard O(N^2) formulation, what does dp[i] represent?',
    options: [
      { id: 'a', text: 'The length of the longest increasing subsequence ending strictly at index i', isCorrect: true },
      { id: 'b', text: 'The length of the LIS in the prefix nums[0..i]', isCorrect: false },
      { id: 'c', text: 'The maximum element seen so far', isCorrect: false },
      { id: 'd', text: 'The total number of increasing subsequences', isCorrect: false }
    ],
    hint: 'If we only know the LIS in prefix nums[0..i], we wouldn’t know what value the subsequence ends with to decide if nums[i+1] can extend it!',
    explanation: 'By defining dp[i] as the LIS ending strictly at nums[i], we can check if nums[i] > nums[j] for any j < i to extend the sequence.'
  }
];

export const PracticeArena: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const handleSelect = (challengeId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [challengeId]: optionId }));
  };

  const score = Object.entries(selectedAnswers).filter(([cId, oId]) => {
    const c = CHALLENGES.find(item => item.id === cId);
    return c?.options.find(opt => opt.id === oId)?.isCorrect;
  }).length;

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E385C] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#0F1B2F] text-[#00F0FF] border border-[#1E385C]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FFFFFF]">
              DP REASONING & DERIVATION ARENA
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Validate your ability to identify state definitions, transitions, and boundary values.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0F1B2F] px-3 py-1.5 rounded-[2px] border border-[#1E385C]">
          <Award className="w-4 h-4 text-[#00F0FF]" />
          <span className="text-[10px] font-mono uppercase text-[#707070] font-bold">SCORE:</span>
          <span className="font-mono font-bold text-[#00F0FF] text-xs">
            {score} / {CHALLENGES.length}
          </span>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {CHALLENGES.map((challenge, idx) => {
          const selectedOption = selectedAnswers[challenge.id];
          const chosenOptObj = challenge.options.find(o => o.id === selectedOption);
          const hasAnswered = !!selectedOption;

          return (
            <div
              key={challenge.id}
              className="bg-[#0F1B2F] rounded border border-[#1E385C] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-[2px] bg-[#0B1220] text-[#00F0FF] border border-[#1E385C] text-[10px] font-mono font-bold flex items-center justify-center">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xs font-mono font-bold text-[#FFFFFF] uppercase tracking-wide">
                    {challenge.problemTitle}
                  </h3>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-[2px] bg-[#0B1220] text-[#A3A3A3] border border-[#1E385C] font-mono uppercase font-bold">
                  {challenge.category}
                </span>
              </div>

              <p className="text-xs text-[#FFFFFF] leading-relaxed">
                {challenge.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {challenge.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  let btnStyle = 'bg-[#0B1220] border-[#1E385C] text-[#A3A3A3] hover:border-[#00F0FF] hover:text-[#FFFFFF]';

                  if (hasAnswered) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-[#162846] border-[#00F0FF] text-[#FFFFFF] font-bold ring-1 ring-[#00F0FF]';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'bg-[#162846] border-[#555555] text-[#707070] line-through';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#00F0FF] border-[#00F0FF] text-[#000000] font-black';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(challenge.id, opt.id)}
                      className={`p-2.5 rounded-[2px] border text-left text-xs transition-colors flex items-start gap-2 ${btnStyle}`}
                    >
                      <span className="w-3.5 h-3.5 rounded-[2px] border border-current flex items-center justify-center text-[9px] font-mono shrink-0 mt-0.5 font-bold">
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="leading-relaxed font-mono text-[11px]">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hint & Explanation Bar */}
              <div className="pt-2 flex flex-col gap-2 border-t border-[#1E385C] text-xs">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowHint(prev => ({ ...prev, [challenge.id]: !prev[challenge.id] }))}
                    className="text-[10px] font-mono text-[#00F0FF] hover:text-[#00D1DF] flex items-center gap-1 uppercase font-bold"
                  >
                    <HelpCircle className="w-3 h-3 text-[#00F0FF]" />
                    {showHint[challenge.id] ? 'HIDE HINT' : 'REQUEST HINT'}
                  </button>

                  {hasAnswered && (
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      {chosenOptObj?.isCorrect ? (
                        <span className="text-[#00F0FF] flex items-center gap-1 font-bold">
                          <CheckCircle className="w-3.5 h-3.5 text-[#00F0FF]" /> EVALUATION CORRECT
                        </span>
                      ) : (
                        <span className="text-[#707070] flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-[#707070]" /> INCORRECT SPECIFICATION
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {showHint[challenge.id] && (
                  <div className="p-2.5 bg-[#0B1220] border border-[#1E385C] rounded-[2px] text-[#A3A3A3] text-[11px] font-mono">
                    HINT: {challenge.hint}
                  </div>
                )}

                {hasAnswered && (
                  <div className="p-2.5 bg-[#0B1220] rounded-[2px] border border-[#1E385C] text-[#A3A3A3] text-[11px] leading-relaxed">
                    <strong className="text-[#00F0FF] font-mono text-[10px] block mb-0.5 uppercase">RATIONALE:</strong>
                    {challenge.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
