import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, ArrowRight, Sparkles, HelpCircle, 
  Layers, Lightbulb, Eye, ChevronRight, RotateCcw, Brain
} from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  question: string;
  hint: string;
  options: {
    id: string;
    label: string;
    math: string;
    isCorrect: boolean;
    explanation: string;
    whyWrong?: string;
  }[];
}

const WIZARD_DATA: Record<string, Stage[]> = {
  'fibonacci': [
    {
      id: 1,
      title: 'Step 1: State Formulation',
      subtitle: 'Identify what a single subproblem represents',
      question: 'What is the minimum information required to represent any Fibonacci subproblem?',
      hint: 'Ask yourself: If you were given a function call, what single argument is changing across recursions?',
      options: [
        {
          id: 'opt1',
          label: 'Single Index: dp[i]',
          math: 'dp[i] = F(i)',
          isCorrect: true,
          explanation: 'Exactly right! The value depends strictly on a single sequence index i. No secondary constraints are needed.'
        },
        {
          id: 'opt2',
          label: '2D Coordinates: dp[i][j]',
          math: 'dp[i][j]',
          isCorrect: false,
          explanation: 'Overkill!',
          whyWrong: 'Fibonacci has no secondary capacity, length, or boundary constraint. Introducing a 2nd dimension wastes O(N) memory for no reason.'
        },
        {
          id: 'opt3',
          label: 'Running Sum: dp[sum]',
          math: 'dp[sum]',
          isCorrect: false,
          explanation: 'Incorrect mental model.',
          whyWrong: 'We are not searching for subsets summing to a target. Fibonacci is a sequence generation problem.'
        }
      ]
    },
    {
      id: 2,
      title: 'Step 2: Dependency Horizon',
      subtitle: 'Identify how far back in time the algorithm needs to look',
      question: 'To solve state dp[i], exactly which previous states are mathematically required?',
      hint: 'Look at the mathematical definition: F(n) = F(n-1) + F(n-2). How many predecessors do you need?',
      options: [
        {
          id: 'opt1',
          label: 'Immediate 2 Predecessors: dp[i-1] and dp[i-2]',
          math: 'dp[i-1] + dp[i-2]',
          isCorrect: true,
          explanation: 'Correct! Because you only need the previous 2 terms, this also immediately reveals that space can be reduced to O(1) rolling variables!'
        },
        {
          id: 'opt2',
          label: 'All Previous Elements: dp[0] through dp[i-1]',
          math: 'sum(dp[0..i-1])',
          isCorrect: false,
          explanation: 'Too many dependencies!',
          whyWrong: 'Terms before i-2 are already baked into dp[i-1] and dp[i-2]. Reading all previous terms would needlessly slow down execution to O(N^2).'
        }
      ]
    },
    {
      id: 3,
      title: 'Step 3: Base Case Establishment',
      subtitle: 'Determine where recursion stops safely without underflow',
      question: 'What are the essential terminal base cases where recurrence stops?',
      hint: 'If you try to compute dp[1] with dp[i-1] + dp[i-2], you would look up dp[-1], which does not exist!',
      options: [
        {
          id: 'opt1',
          label: 'dp[0] = 0 and dp[1] = 1',
          math: 'F(0)=0, F(1)=1',
          isCorrect: true,
          explanation: 'Perfect! Two base cases are mandatory because the transition looks 2 steps backwards.'
        },
        {
          id: 'opt2',
          label: 'Only dp[0] = 0',
          math: 'F(0)=0',
          isCorrect: false,
          explanation: 'Incomplete boundary!',
          whyWrong: 'If you only stop at 0, evaluating dp[1] tries to access dp[1-2] = dp[-1], resulting in an IndexOutOfBounds or Infinite Recursion error.'
        }
      ]
    }
  ],
  'knapsack-01': [
    {
      id: 1,
      title: 'Step 1: State Formulation',
      subtitle: 'Why 1 variable is NOT enough for 0/1 Knapsack',
      question: 'What variables MUST be tracked in the DP state to solve 0/1 Knapsack?',
      hint: 'Can you know if an item can fit if you do not track remaining bag capacity? Can you prevent re-using an item without tracking item index?',
      options: [
        {
          id: 'opt1',
          label: 'Item Index and Remaining Capacity: dp[i][w]',
          math: 'dp[i][w]',
          isCorrect: true,
          explanation: 'Spot on! i tracks which item choices have been decided (ensuring items are chosen at most once), and w tracks remaining weight budget.'
        },
        {
          id: 'opt2',
          label: 'Only Capacity: dp[w]',
          math: 'dp[w]',
          isCorrect: false,
          explanation: 'Flawed formulation for 0/1 Knapsack!',
          whyWrong: 'If your 2D table only tracks capacity, you have no way to remember whether Item 3 was already included or not. This turns 0/1 Knapsack into Unbounded Knapsack!'
        }
      ]
    },
    {
      id: 2,
      title: 'Step 2: Recurrence Decision Fork',
      subtitle: 'Formulate the binary choice at every item',
      question: 'At item i with weight wt and value val, what are your two fundamental choices?',
      hint: 'In 0/1 knapsack, your choice is binary: either leave the item on the table, or put it in the bag (if capacity allows).',
      options: [
        {
          id: 'opt1',
          label: 'Exclude vs. Include (Take maximum of both)',
          math: 'max(dp[i-1][w], val + dp[i-1][w - wt])',
          isCorrect: true,
          explanation: 'Correct! If we exclude item i, value is dp[i-1][w]. If we include it, value is val + dp[i-1][w - wt]. We pick the higher value.'
        },
        {
          id: 'opt2',
          label: 'Always include every item that fits',
          math: 'val + dp[i-1][w - wt]',
          isCorrect: false,
          explanation: 'Greedy fallacy!',
          whyWrong: 'An item might fit, but taking it could block a much more valuable item from fitting later. Dynamic Programming explores both paths to guarantee optimality.'
        }
      ]
    }
  ],
  'lis': [
    {
      id: 1,
      title: 'Step 1: The "Ending At" State Trick',
      subtitle: 'The #1 hurdle in understanding LIS',
      question: 'Why MUST dp[i] be defined as "LIS ending strictly at nums[i]" instead of "LIS of subarray nums[0..i]"?',
      hint: 'Imagine a future number arrives. How can you tell if that number can extend the sequence without knowing what number the sequence ends with?',
      options: [
        {
          id: 'opt1',
          label: 'Because we need to know the tail value to test nums[k] > nums[i]',
          math: 'dp[i] = LIS ending at nums[i]',
          isCorrect: true,
          explanation: 'Brilliant understanding! To append a number to an increasing sequence, the new number must be greater than the last number. Defining dp[i] as ending at nums[i] locks down the tail value!'
        },
        {
          id: 'opt2',
          label: 'It is just a convention with no mathematical significance',
          math: 'Convention only',
          isCorrect: false,
          explanation: 'Incorrect!',
          whyWrong: 'If dp[i] only stored the length in prefix 0..i, you would have to scan all possible subsets to check their ending values, defeating the purpose of DP memoization.'
        }
      ]
    }
  ]
};

export const IntuitionDerivationWizard: React.FC<{ problemId: string }> = ({ problemId }) => {
  const stages = WIZARD_DATA[problemId] || WIZARD_DATA['fibonacci'];
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const stage = stages[currentStageIdx] || stages[0];
  const chosenOpt = stage.options.find(o => o.id === selectedOpt);

  const handleSelect = (id: string) => {
    setSelectedOpt(id);
  };

  const handleNext = () => {
    if (currentStageIdx < stages.length - 1) {
      setCurrentStageIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowHint(false);
    }
  };

  const handleReset = () => {
    setCurrentStageIdx(0);
    setSelectedOpt(null);
    setShowHint(false);
  };

  return (
    <div className="bg-[#141414] border border-[#1E385C] rounded-md p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A3052] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#00F0FF] text-black flex items-center justify-center font-black text-xs">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider flex items-center gap-2">
              Intuitive State Derivation Wizard
              <span className="text-[9px] bg-[#162846] text-[#00F0FF] px-1.5 py-0.2 rounded border border-[#00F0FF]/40">
                Interactive Mentor
              </span>
            </h3>
            <p className="text-[11px] text-[#A3A3A3]">
              Solve the formulation yourself through guided progressive Socratic questioning.
            </p>
          </div>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {stages.map((st, i) => (
            <div
              key={st.id}
              className={`w-5 h-5 rounded-[2px] flex items-center justify-center font-bold ${
                i === currentStageIdx
                  ? 'bg-[#00F0FF] text-black'
                  : i < currentStageIdx
                  ? 'bg-[#162846] text-[#00F0FF] border border-[#00F0FF]/50'
                  : 'bg-[#0F1B2F] text-[#555555]'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Stage Question Card */}
      <div className="space-y-3">
        <div>
          <span className="text-[10px] font-mono text-[#00F0FF] font-bold uppercase tracking-wider">
            {stage.title} — {stage.subtitle}
          </span>
          <p className="text-xs text-white font-bold mt-1 leading-relaxed">
            {stage.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {stage.options.map((opt) => {
            const isSelected = selectedOpt === opt.id;
            let containerStyle = 'bg-[#0F1B2F] border-[#1E385C] text-[#A3A3A3] hover:border-[#00F0FF] hover:text-white';

            if (selectedOpt) {
              if (opt.isCorrect) {
                containerStyle = 'bg-[#0F1B2F] border-[#00F0FF] text-white ring-1 ring-[#00F0FF]';
              } else if (isSelected && !opt.isCorrect) {
                containerStyle = 'bg-[#0F1B2F] border-red-500 text-red-300';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left p-3 rounded-[3px] border transition-colors flex flex-col gap-1 ${containerStyle}`}
              >
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span>{opt.label}</span>
                  <span className="text-[10px] bg-[#162846] px-1.5 py-0.5 rounded text-[#A3A3A3] border border-[#23416B]">
                    {opt.math}
                  </span>
                </div>

                {/* Feedback upon selection */}
                {isSelected && (
                  <div className="pt-2 mt-1 border-t border-[#1E385C] text-[11px] leading-relaxed">
                    {opt.isCorrect ? (
                      <span className="text-[#00F0FF] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                        {opt.explanation}
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-start gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span><strong>Why this fails:</strong> {opt.whyWrong}</span>
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Hint toggle & navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1A3052]">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-[10px] font-mono text-[#707070] hover:text-[#00F0FF] flex items-center gap-1 font-bold uppercase"
          >
            <HelpCircle className="w-3 h-3 text-[#00F0FF]" />
            {showHint ? 'Hide Socratic Hint' : 'Need Intuition Hint?'}
          </button>

          <div className="flex items-center gap-2">
            {currentStageIdx > 0 && (
              <button
                onClick={handleReset}
                className="px-2 py-1 text-[10px] font-mono text-[#A3A3A3] hover:text-white uppercase flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Start Over
              </button>
            )}

            {currentStageIdx < stages.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!chosenOpt?.isCorrect}
                className="px-3 py-1 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] disabled:opacity-30 disabled:hover:bg-[#00F0FF] text-black text-xs font-mono font-black flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                <span>Next Derivation Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              chosenOpt?.isCorrect && (
                <div className="text-[11px] font-mono text-[#00F0FF] font-black uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" /> State Formulation Mastered!
                </div>
              )
            )}
          </div>
        </div>

        {showHint && (
          <div className="p-2.5 bg-[#0F1B2F] border border-[#00F0FF]/30 rounded text-[11px] text-[#A3A3A3] font-mono">
            <strong className="text-[#00F0FF]">Mentor Clue:</strong> {stage.hint}
          </div>
        )}
      </div>
    </div>
  );
};

