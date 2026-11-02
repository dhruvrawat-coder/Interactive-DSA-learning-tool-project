import React from 'react';
import { useDPStore } from '../core/store';
import { PROBLEMS_REGISTRY } from '../core/problemsData';
import { 
  Play, BookOpen, Target, Bug, GitBranch, ArrowRight, Sparkles, CheckCircle2, Zap
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { selectProblem, setCurrentView, selectedProblemId } = useDPStore();
  const activeProb = PROBLEMS_REGISTRY.find(p => p.id === selectedProblemId) || PROBLEMS_REGISTRY[0];

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-y-auto p-8 space-y-8">
      {/* Editorial Title & Overview */}
      <div className="border-b border-[#1E385C] pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] mb-1 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>DP LAB 2.0 — SIMPLIFIED DYNAMIC PROGRAMMING SUITE</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#FFFFFF]">
            Demystifying Dynamic Programming for Everyone
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1 max-w-2xl leading-relaxed">
            Existing DP tools either dump dry math formulas or jump straight to finished code. We redesigned DP Lab into an interactive mentor that breaks every problem down into intuitive, self-guided steps anyone can master.
          </p>
        </div>

        {/* Quick Launch Active Problem */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('lessons')}
            className="px-4 py-2 rounded-[2px] bg-[#162846] hover:bg-[#2c2c2c] border border-[#00F0FF]/40 text-[#00F0FF] font-mono text-xs font-black flex items-center gap-2 transition-colors uppercase tracking-wider"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>INTERACTIVE LESSONS (SLIDES)</span>
          </button>
          <button
            onClick={() => setCurrentView('workspace')}
            className="px-4 py-2 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] text-[#000000] font-mono text-xs font-black flex items-center gap-2 transition-colors uppercase tracking-wider"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>LAUNCH WORKSPACE ({activeProb.title.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* "Why This Is So Much Simpler" Value Proposition Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-[#0F1B2F] rounded border border-[#1E385C] flex items-start gap-2.5">
          <div className="w-6 h-6 rounded bg-[#162846] text-[#00F0FF] flex items-center justify-center shrink-0 font-bold text-xs border border-[#00F0FF]/30">
            1
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase">No Formula Memorization</h4>
            <p className="text-[11px] text-[#A3A3A3] mt-0.5 leading-relaxed">
              Our Socratic Derivation Wizard asks simple questions to guide you into discovering the state equation yourself.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#0F1B2F] rounded border border-[#1E385C] flex items-start gap-2.5">
          <div className="w-6 h-6 rounded bg-[#162846] text-[#00F0FF] flex items-center justify-center shrink-0 font-bold text-xs border border-[#00F0FF]/30">
            2
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase">Predict The Next Cell</h4>
            <p className="text-[11px] text-[#A3A3A3] mt-0.5 leading-relaxed">
              Instead of watching passive animations, test your understanding before the table fills itself in.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#0F1B2F] rounded border border-[#1E385C] flex items-start gap-2.5">
          <div className="w-6 h-6 rounded bg-[#162846] text-[#00F0FF] flex items-center justify-center shrink-0 font-bold text-xs border border-[#00F0FF]/30">
            3
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase">Learn From Real Bugs</h4>
            <p className="text-[11px] text-[#A3A3A3] mt-0.5 leading-relaxed">
              See exact failure runs and counterexamples for common student mistakes like 1D knapsack loop direction.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Track & Active Problem Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[#0F1B2F] rounded border border-[#1E385C] p-5 space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#707070] uppercase tracking-widest font-bold">ACTIVE EXPLORATION MODULE</span>
            <span className="text-[#00F0FF] border border-[#1E385C] px-2 py-0.5 rounded-[2px] bg-[#0B1220] uppercase font-bold">
              {activeProb.category}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#FFFFFF] tracking-tight">{activeProb.title}</h2>
            <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
              {activeProb.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-2 font-mono text-[11px] text-[#A3A3A3] border-t border-[#1A3052]">
            <div>
              <span className="text-[#707070] text-[9px] block uppercase font-bold">DIFFICULTY:</span>
              <span className="text-[#00F0FF] font-bold">{activeProb.difficulty}</span>
            </div>
            <div>
              <span className="text-[#707070] text-[9px] block uppercase font-bold">TIME COMPLEXITY:</span>
              <span className="text-[#FFFFFF] font-bold">{activeProb.stateInfo.complexity.time}</span>
            </div>
            <div>
              <span className="text-[#707070] text-[9px] block uppercase font-bold">AUX SPACE:</span>
              <span className="text-[#FFFFFF] font-bold">{activeProb.stateInfo.complexity.space}</span>
            </div>
          </div>
        </div>

        {/* Platform Modules Quick Link Card */}
        <div className="bg-[#0F1B2F] rounded border border-[#1E385C] p-4 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] block mb-2 font-bold">
              PLATFORM TOOLS
            </span>
            <div className="space-y-1 font-mono text-xs">
              <button
                onClick={() => setCurrentView('lessons')}
                className="w-full text-left p-2 rounded-[2px] bg-[#162846] border border-[#00F0FF]/30 hover:border-[#00F0FF] text-[#00F0FF] hover:text-[#FFFFFF] flex items-center justify-between transition-colors font-bold"
              >
                <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-[#00F0FF]" /> Interactive Lessons (Slides)</span>
                <ArrowRight className="w-3 h-3 text-[#00F0FF]" />
              </button>
              <button
                onClick={() => setCurrentView('comparator')}
                className="w-full text-left p-2 rounded-[2px] hover:bg-[#162846] text-[#A3A3A3] hover:text-[#FFFFFF] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2"><GitBranch className="w-3.5 h-3.5 text-[#00F0FF]" /> Strategy Comparator</span>
                <ArrowRight className="w-3 h-3 text-[#707070]" />
              </button>
              <button
                onClick={() => setCurrentView('mistakes')}
                className="w-full text-left p-2 rounded-[2px] hover:bg-[#162846] text-[#A3A3A3] hover:text-[#FFFFFF] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2"><Bug className="w-3.5 h-3.5 text-[#00F0FF]" /> Mistake Analyzer</span>
                <ArrowRight className="w-3 h-3 text-[#707070]" />
              </button>
              <button
                onClick={() => setCurrentView('practice')}
                className="w-full text-left p-2 rounded-[2px] hover:bg-[#162846] text-[#A3A3A3] hover:text-[#FFFFFF] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5 text-[#00F0FF]" /> Practice Arena</span>
                <ArrowRight className="w-3 h-3 text-[#707070]" />
              </button>
              <button
                onClick={() => setCurrentView('handbook')}
                className="w-full text-left p-2 rounded-[2px] hover:bg-[#162846] text-[#A3A3A3] hover:text-[#FFFFFF] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-[#00F0FF]" /> DP Handbook</span>
                <ArrowRight className="w-3 h-3 text-[#707070]" />
              </button>
            </div>
          </div>

          <div className="p-2 bg-[#0B1220] rounded-[2px] border border-[#1E385C] font-mono text-[10px] text-[#00F0FF] flex items-center justify-between">
            <span className="uppercase tracking-wider font-bold">CYBERPUNK OBSIDIAN & NEON CYAN</span>
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Problem Directory Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFFFFF]">
            SUPPORTED ALGORITHM DIRECTORY
          </h3>
          <span className="text-[10px] font-mono text-[#00F0FF] font-bold">
            {PROBLEMS_REGISTRY.length} MODULES READY
          </span>
        </div>

        <div className="border border-[#1E385C] rounded overflow-hidden bg-[#0B1220]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F1B2F] border-b border-[#1E385C] text-[10px] font-mono text-[#707070] uppercase font-bold">
                <th className="py-2.5 px-4 font-normal">PROBLEM</th>
                <th className="py-2.5 px-4 font-normal">CATEGORY</th>
                <th className="py-2.5 px-4 font-normal">DIFFICULTY</th>
                <th className="py-2.5 px-4 font-normal">TIME COMPLEXITY</th>
                <th className="py-2.5 px-4 font-normal">AUX SPACE</th>
                <th className="py-2.5 px-4 font-normal text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A3052] text-xs font-mono">
              {PROBLEMS_REGISTRY.map((prob) => {
                const isSelected = prob.id === selectedProblemId;
                return (
                  <tr 
                    key={prob.id}
                    className={`hover:bg-[#0F1B2F] transition-colors ${
                      isSelected ? 'bg-[#0F1B2F]' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#FFFFFF]">
                      {prob.title}
                    </td>
                    <td className="py-3 px-4 text-[#A3A3A3]">
                      {prob.category}
                    </td>
                    <td className="py-3 px-4 text-[#00F0FF] font-bold">
                      {prob.difficulty}
                    </td>
                    <td className="py-3 px-4 text-[#A3A3A3]">
                      {prob.stateInfo.complexity.time}
                    </td>
                    <td className="py-3 px-4 text-[#A3A3A3]">
                      {prob.stateInfo.complexity.space}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          selectProblem(prob.id);
                          setCurrentView('workspace');
                        }}
                        className="px-3 py-1 rounded-[2px] bg-[#162846] hover:bg-[#00F0FF] hover:text-[#000000] text-[#FFFFFF] text-[10px] uppercase font-bold transition-colors"
                      >
                        EXPLORE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
