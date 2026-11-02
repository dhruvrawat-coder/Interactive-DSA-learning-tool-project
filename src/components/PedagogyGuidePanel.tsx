import React from 'react';
import { useDPStore } from '../core/store';
import { PROBLEMS_REGISTRY } from '../core/problemsData';
import { HelpCircle, Brain } from 'lucide-react';
import { IntuitionDerivationWizard } from './IntuitionDerivationWizard';

const PEDAGOGY_STEPS = [
  { step: 1, title: 'Understanding' },
  { step: 2, title: 'Subproblems' },
  { step: 3, title: 'Substructure' },
  { step: 4, title: 'State Definition' },
  { step: 5, title: 'Base Cases' },
  { step: 6, title: 'Recurrence' },
  { step: 7, title: 'Evaluation Order' },
  { step: 8, title: 'Execution' },
  { step: 9, title: 'Reconstruction' },
  { step: 10, title: 'Complexity' }
];

export const PedagogyGuidePanel: React.FC = () => {
  const {
    selectedProblemId,
    activePedagogyStep,
    setActivePedagogyStep,
    quizAnswers,
    setQuizAnswer
  } = useDPStore();

  const prob = PROBLEMS_REGISTRY.find(p => p.id === selectedProblemId);
  if (!prob) return null;

  const currentQuiz = prob.guidedQuestions.find(q => q.stepNumber === activePedagogyStep);

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-hidden">
      {/* Problem Title Bar */}
      <div className="px-4 py-3 bg-[#0F1B2F] border-b border-[#1E385C]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-[2px] bg-[#162846] text-[#00F0FF] border border-[#1E385C] font-bold">
            {prob.category}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-[2px] bg-[#162846] text-[#FFFFFF] border border-[#1E385C] font-bold">
            {prob.difficulty}
          </span>
        </div>
        <h2 className="text-sm font-bold text-[#FFFFFF] mt-2 tracking-tight">{prob.title}</h2>
        <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">{prob.summary}</p>
      </div>

      {/* 10-Step Progress Stepper */}
      <div className="px-3 py-2 bg-[#070B14] border-b border-[#1E385C] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {PEDAGOGY_STEPS.map((s) => {
            const isActive = activePedagogyStep === s.step;
            const isCompleted = activePedagogyStep > s.step;

            return (
              <button
                key={s.step}
                onClick={() => setActivePedagogyStep(s.step)}
                className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[2px] transition-colors ${
                  isActive
                    ? 'bg-[#00F0FF] text-[#000000] font-black'
                    : isCompleted
                    ? 'text-[#00F0FF] hover:bg-[#0F1B2F]'
                    : 'text-[#666666] hover:text-[#A3A3A3]'
                }`}
              >
                <span>{String(s.step).padStart(2, '0')}.</span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Body */}
      <div className="flex-1 overflow-y-auto p-4 text-xs text-[#A3A3A3] space-y-4">
        {/* Step 1: Problem Description */}
        {activePedagogyStep === 1 && (
          <div className="space-y-3">
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] mb-1 font-bold">
                PROBLEM SPECIFICATION
              </h3>
              <p className="text-xs text-[#FFFFFF] leading-relaxed bg-[#0F1B2F] p-3 rounded border border-[#1E385C]">
                {prob.description}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#707070] mb-1.5 font-bold">
                CONSTRAINTS
              </h4>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-[#A3A3A3]">
                {prob.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Overlapping Subproblems */}
        {activePedagogyStep === 2 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              OVERLAPPING SUBPROBLEMS IDENTIFICATION
            </h3>
            <p className="leading-relaxed text-[#FFFFFF]">
              A naive recursive exploration branches out exponentially. Identical parameter states are evaluated independently multiple times, producing an exponential O(2^N) execution footprint.
            </p>
            <div className="p-3 bg-[#0F1B2F] border border-[#1E385C] rounded text-[#A3A3A3] font-mono text-[11px]">
              <span className="text-[#00F0FF] font-bold block mb-1">ARCHITECTURAL PRINCIPLE:</span>
              Dynamic Programming memoizes or precomputes every distinct subproblem state once and only once.
            </div>
          </div>
        )}

        {/* Step 3: Optimal Substructure */}
        {activePedagogyStep === 3 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              OPTIMAL SUBSTRUCTURE RATIONALE
            </h3>
            <p className="leading-relaxed text-[#FFFFFF]">
              The global optimum to the problem can be derived deterministically from the optimal solutions to its constituent subproblems.
            </p>
            <div className="bg-[#0F1B2F] p-3 rounded border border-[#1E385C] space-y-1.5 font-mono text-[11px]">
              <span className="text-[#00F0FF] font-bold">SUBPROBLEM INDEPENDENCE:</span>
              <p className="text-[#A3A3A3]">
                Subproblem solutions do not share conflicting mutable state, enabling localized recurrence transitions.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: DP State Definition */}
        {activePedagogyStep === 4 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              STATE SPECIFICATION & GUIDED DERIVATION
            </h3>

            {/* Intuition Wizard Component */}
            <IntuitionDerivationWizard problemId={selectedProblemId} />

            <div className="p-3 bg-[#0F1B2F] border border-[#1E385C] rounded">
              <span className="text-[10px] font-mono uppercase text-[#707070] block mb-1 font-bold">FORMAL MATHEMATICAL STATE:</span>
              <span className="text-xs font-mono font-bold text-[#FFFFFF]">{prob.stateInfo.stateRepresentation}</span>
              <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">{prob.stateInfo.stateExplanation}</p>
            </div>

            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#707070] mt-2 font-bold">
              STATE VARIABLES
            </h4>
            <div className="space-y-1.5">
              {prob.stateInfo.subproblemVariables.map((v, i) => (
                <div key={i} className="bg-[#0F1B2F] p-2.5 rounded border border-[#1E385C]">
                  <span className="font-mono font-bold text-[#00F0FF]">{v.name}</span>
                  <span className="text-[#707070] text-[10px] ml-2 font-mono">[{v.range}]</span>
                  <p className="text-[#A3A3A3] text-[11px] mt-0.5">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Base Cases */}
        {activePedagogyStep === 5 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              BASE CASES & BOUNDARIES
            </h3>
            <div className="space-y-1.5">
              {prob.stateInfo.baseCases.map((b, i) => (
                <div key={i} className="bg-[#0F1B2F] p-2.5 rounded border border-[#1E385C]">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#A3A3A3]">{b.condition}</span>
                    <span className="font-bold text-[#000000] bg-[#00F0FF] px-1.5 py-0.5 rounded-[2px]">
                      = {b.value}
                    </span>
                  </div>
                  <p className="text-[#A3A3A3] text-[11px] mt-1 leading-relaxed">{b.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Recurrence Relation */}
        {activePedagogyStep === 6 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              RECURRENCE RELATION
            </h3>
            <div className="p-3 bg-[#0F1B2F] rounded border border-[#1E385C]">
              <div className="font-mono font-bold text-[#FFFFFF] text-xs">
                {prob.stateInfo.recurrenceRelation.formula}
              </div>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                {prob.stateInfo.recurrenceRelation.explanation}
              </p>
            </div>

            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#707070] mt-2 font-bold">
              TRANSITION CASES
            </h4>
            <div className="space-y-1.5">
              {prob.stateInfo.recurrenceRelation.cases.map((c, i) => (
                <div key={i} className="bg-[#0F1B2F] p-2 rounded border border-[#1E385C]">
                  <div className="text-[#707070] font-mono text-[10px] uppercase font-bold">WHEN: {c.condition}</div>
                  <div className="text-[#FFFFFF] font-mono text-[11px] font-bold mt-0.5">{c.formula}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Evaluation Order */}
        {activePedagogyStep === 7 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              EVALUATION ORDER (TOPOLOGICAL SORT)
            </h3>
            <p className="leading-relaxed text-[#FFFFFF]">{prob.stateInfo.evaluationOrder.description}</p>
            <div className="p-3 bg-[#0F1B2F] rounded border border-[#1E385C]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#707070] block mb-1 font-bold">DEPENDENCY INVARIANT:</span>
              <p className="text-[#A3A3A3] leading-relaxed">{prob.stateInfo.evaluationOrder.rationale}</p>
            </div>
            <div className="bg-[#070B14] p-2 rounded border border-[#1E385C] font-mono text-[#FFFFFF] text-[11px]">
              {prob.stateInfo.evaluationOrder.loops.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Execution */}
        {activePedagogyStep === 8 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              ALGORITHM EXECUTION
            </h3>
            <p className="leading-relaxed text-[#FFFFFF]">
              Execute the table updates cell by cell in the center panel. Notice dependencies illuminate and optimal transitions commit to the table.
            </p>
          </div>
        )}

        {/* Step 9: Solution Reconstruction */}
        {activePedagogyStep === 9 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              SOLUTION RECONSTRUCTION
            </h3>
            {prob.stateInfo.reconstructionStrategy ? (
              <>
                <p className="leading-relaxed text-[#FFFFFF]">{prob.stateInfo.reconstructionStrategy.description}</p>
                <div className="space-y-1 bg-[#0F1B2F] p-3 rounded border border-[#1E385C]">
                  <span className="font-mono text-[10px] uppercase text-[#707070] block mb-1 font-bold">BACKTRACKING STEPS:</span>
                  {prob.stateInfo.reconstructionStrategy.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#A3A3A3] font-mono text-[11px]">
                      <span className="text-[#00F0FF] font-bold">—</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[#707070] italic font-mono text-[11px]">Scalar optimum value computed directly.</p>
            )}
          </div>
        )}

        {/* Step 10: Complexity Analysis */}
        {activePedagogyStep === 10 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              COMPLEXITY AUDIT
            </h3>
            <div className="space-y-1.5">
              <div className="bg-[#0F1B2F] p-2.5 rounded border border-[#1E385C]">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#707070] uppercase font-bold">TIME COMPLEXITY</span>
                  <span className="font-bold text-[#FFFFFF]">{prob.stateInfo.complexity.time}</span>
                </div>
                <p className="text-[#A3A3A3] text-[11px] mt-1">{prob.stateInfo.complexity.timeRationale}</p>
              </div>

              <div className="bg-[#0F1B2F] p-2.5 rounded border border-[#1E385C]">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#707070] uppercase font-bold">SPACE COMPLEXITY</span>
                  <span className="font-bold text-[#FFFFFF]">{prob.stateInfo.complexity.space}</span>
                </div>
                <p className="text-[#A3A3A3] text-[11px] mt-1">{prob.stateInfo.complexity.spaceRationale}</p>
              </div>

              {prob.stateInfo.complexity.optimizedSpace && (
                <div className="bg-[#0F1B2F] p-2.5 rounded border border-[#1E385C]">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#707070] uppercase font-bold">OPTIMIZED SPACE</span>
                    <span className="font-bold text-[#00F0FF]">{prob.stateInfo.complexity.optimizedSpace}</span>
                  </div>
                  <p className="text-[#A3A3A3] text-[11px] mt-1">{prob.stateInfo.complexity.optimizedSpaceRationale}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checkpoint Challenge */}
        {currentQuiz && (
          <div className="mt-4 p-3 bg-[#0F1B2F] border border-[#00F0FF]/40 rounded space-y-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>STEP CHECKPOINT</span>
            </div>
            <p className="text-xs text-[#FFFFFF] font-bold">{currentQuiz.question}</p>

            <div className="space-y-1.5 mt-2">
              {currentQuiz.options.map((opt) => {
                const isSelected = quizAnswers[currentQuiz.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setQuizAnswer(currentQuiz.id, opt.id)}
                    className={`w-full text-left p-2 rounded-[2px] border transition-colors flex flex-col ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#162846] border-[#00F0FF] text-[#FFFFFF] font-bold'
                          : 'bg-[#162846] border-[#555555] text-[#A3A3A3]'
                        : 'bg-[#0B1220] border-[#1E385C] text-[#707070] hover:bg-[#0F1B2F] hover:text-[#FFFFFF]'
                    }`}
                  >
                    <span className="text-[11px]">{opt.text}</span>
                    {isSelected && (
                      <span className="text-[10px] mt-1 font-mono text-[#A3A3A3]">
                        {opt.explanation}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="p-2.5 bg-[#0F1B2F] border-t border-[#1E385C] flex items-center justify-between font-mono text-[10px]">
        <button
          onClick={() => setActivePedagogyStep(Math.max(1, activePedagogyStep - 1))}
          disabled={activePedagogyStep === 1}
          className="px-2.5 py-1 rounded-[2px] bg-[#162846] border border-[#1E385C] hover:bg-[#1E385C] disabled:opacity-30 text-[#A3A3A3] hover:text-[#FFFFFF] uppercase font-bold"
        >
          PREV
        </button>
        <span className="text-[#707070] font-bold">STEP {activePedagogyStep} / 10</span>
        <button
          onClick={() => setActivePedagogyStep(Math.min(10, activePedagogyStep + 1))}
          disabled={activePedagogyStep === 10}
          className="px-3 py-1 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] disabled:opacity-30 text-[#000000] uppercase font-black tracking-wider"
        >
          NEXT
        </button>
      </div>
    </div>
  );
};
