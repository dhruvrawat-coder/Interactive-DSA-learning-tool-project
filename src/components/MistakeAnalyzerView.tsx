import React from 'react';
import { useDPStore } from '../core/store';
import { MISTAKE_EXAMPLES } from '../core/problemsData';
import { Bug, Terminal, CheckCircle2 } from 'lucide-react';

export const MistakeAnalyzerView: React.FC = () => {
  const { selectedMistakeId, setSelectedMistakeId } = useDPStore();
  const currentMistake = MISTAKE_EXAMPLES.find(m => m.id === selectedMistakeId) || MISTAKE_EXAMPLES[0];

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-hidden p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E385C] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#0F1B2F] text-[#00F0FF] border border-[#1E385C]">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FFFFFF]">
              DP PITFALL & ANTI-PATTERN ANALYZER
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Analyze and debug canonical dynamic programming mistakes with tangible counterexamples.
            </p>
          </div>
        </div>

        {/* Mistake Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {MISTAKE_EXAMPLES.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMistakeId(m.id)}
              className={`px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
                selectedMistakeId === m.id
                  ? 'bg-[#00F0FF] text-[#000000]'
                  : 'bg-[#0F1B2F] text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#162846] border border-[#1E385C]'
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto">
        {/* Left Column: Buggy Code & Explanation */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="uppercase tracking-widest text-[#00F0FF] font-bold">
              FLAWED IMPLEMENTATION ({currentMistake.language.toUpperCase()})
            </span>
            <span className="px-2 py-0.5 rounded-[2px] bg-[#0F1B2F] text-[#A3A3A3] border border-[#1E385C] font-bold">
              CATEGORY: {currentMistake.category.toUpperCase()}
            </span>
          </div>

          <div className="bg-[#070B14] rounded border border-[#1E385C] p-3.5 font-mono text-xs text-[#FFFFFF] overflow-x-auto">
            <pre>{currentMistake.buggyCode}</pre>
          </div>

          <div className="bg-[#0F1B2F] rounded border border-[#1E385C] p-3.5 space-y-1.5">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              FAILURE MECHANISM
            </h4>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              {currentMistake.bugExplanation}
            </p>
          </div>
        </div>

        {/* Right Column: Counterexample & Fix */}
        <div className="flex flex-col space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#00F0FF] font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>DISPROVING COUNTEREXAMPLE</span>
          </div>

          <div className="bg-[#0F1B2F] rounded border border-[#1E385C] p-3.5 space-y-2.5 font-mono text-xs">
            <div>
              <span className="text-[#707070] text-[10px] uppercase block font-bold">Input Configuration:</span>
              <span className="text-[#FFFFFF] font-bold">{currentMistake.counterExample.input}</span>
            </div>
            <div className="p-2 rounded-[2px] bg-[#070B14] border border-[#1E385C] text-[#A3A3A3]">
              <span className="text-[9px] uppercase font-bold text-[#00F0FF] block">Erroneous Output:</span>
              {currentMistake.counterExample.actualOutput}
            </div>
            <div className="p-2 rounded-[2px] bg-[#070B14] border border-[#1E385C] text-[#FFFFFF]">
              <span className="text-[9px] uppercase font-bold text-[#A3A3A3] block">Expected Output:</span>
              {currentMistake.counterExample.expectedOutput}
            </div>
          </div>

          {/* Fix Card */}
          <div className="bg-[#0F1B2F] rounded border border-[#1E385C] p-3.5 space-y-1.5 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>REMEDIATION STRATEGY</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              {currentMistake.fixExplanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
