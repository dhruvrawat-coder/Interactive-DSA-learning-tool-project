import React from 'react';
import { useDPStore } from '../core/store';
import { PROBLEMS_REGISTRY } from '../core/problemsData';
import { Code2, Terminal, Copy, Check } from 'lucide-react';

export const CodeSyncViewer: React.FC = () => {
  const {
    selectedProblemId,
    selectedLanguage,
    setSelectedLanguage,
    events,
    currentStepIndex
  } = useDPStore();

  const [copied, setCopied] = React.useState(false);
  const prob = PROBLEMS_REGISTRY.find(p => p.id === selectedProblemId);
  const currentEvent = events[currentStepIndex];
  const activeLine = currentEvent?.codeLine || 1;

  if (!prob) return null;

  const codeString = prob.codeImplementations[selectedLanguage];
  const pseudocodeLines = prob.pseudocode.tabulation;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-hidden">
      {/* Header & Language Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F1B2F] border-b border-[#1E385C]">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFFFFF] font-bold">
            SYNCHRONIZED PSEUDOCODE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#0B1220] p-0.5 rounded-[2px] border border-[#1E385C]">
            {(['python', 'cpp', 'java'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase font-bold transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-[#00F0FF] text-[#000000]'
                    : 'text-[#A3A3A3] hover:text-[#FFFFFF]'
                }`}
              >
                {lang === 'python' ? 'PY' : lang === 'cpp' ? 'C++' : 'JAVA'}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-[#162846] text-[#A3A3A3] hover:text-[#00F0FF] transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00F0FF]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Synchronized Pseudocode Section */}
      <div className="p-3 bg-[#070B14] border-b border-[#1E385C] font-mono text-[11px] overflow-x-auto">
        <div className="text-[9px] uppercase tracking-widest text-[#707070] font-mono mb-2 font-bold">
          INSTRUCTION POINTER
        </div>
        <div className="space-y-0.5">
          {pseudocodeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = activeLine === lineNum;

            return (
              <div
                key={lineNum}
                className={`flex items-center px-2 py-0.5 rounded-[2px] transition-colors ${
                  isActive
                    ? 'bg-[#162846] text-[#FFFFFF] font-bold border-l-2 border-[#00F0FF]'
                    : 'text-[#707070] hover:bg-[#0F1B2F] hover:text-[#A3A3A3]'
                }`}
              >
                <span className={`w-5 text-[10px] select-none text-right pr-2.5 font-mono ${isActive ? 'text-[#00F0FF] font-bold' : 'text-[#444444]'}`}>
                  {lineNum}
                </span>
                <span className="whitespace-pre">{line}</span>
                {isActive && (
                  <span className="ml-auto text-[9px] font-mono bg-[#00F0FF] text-[#000000] px-1 py-0.2 rounded-[2px] font-black uppercase">
                    EXEC
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Variable & State Inspector */}
      <div className="flex-1 flex flex-col p-3 bg-[#0B1220] overflow-y-auto">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="text-[10px] font-mono font-bold text-[#A3A3A3] uppercase tracking-widest">
            STATE & REGISTER INSPECTOR
          </span>
        </div>

        {currentEvent?.variables ? (
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(currentEvent.variables).map(([k, v]) => (
              <div
                key={k}
                className="bg-[#0F1B2F] p-2 rounded-[2px] border border-[#1E385C] flex flex-col justify-between"
              >
                <span className="text-[9px] font-mono text-[#707070] uppercase font-bold">{k}</span>
                <span className="text-xs font-mono font-bold text-[#FFFFFF] truncate mt-0.5">
                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs font-mono text-[#707070] italic">No local scope variables.</div>
        )}

        {/* Complexity Summary Card */}
        <div className="mt-3 p-3 bg-[#0F1B2F] rounded-[2px] border border-[#1E385C] text-xs">
          <div className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest mb-2 font-bold">
            ASYMPTOTIC COMPLEXITY
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-[#1A3052]">
            <span className="text-[#A3A3A3]">Time:</span>
            <span className="font-mono font-bold text-[#FFFFFF]">{prob.stateInfo.complexity.time}</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-[#1A3052]">
            <span className="text-[#A3A3A3]">Aux Space:</span>
            <span className="font-mono font-bold text-[#FFFFFF]">{prob.stateInfo.complexity.space}</span>
          </div>
          {prob.stateInfo.complexity.optimizedSpace && (
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-[#A3A3A3]">Optimized:</span>
              <span className="font-mono font-bold text-[#00F0FF]">{prob.stateInfo.complexity.optimizedSpace}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
