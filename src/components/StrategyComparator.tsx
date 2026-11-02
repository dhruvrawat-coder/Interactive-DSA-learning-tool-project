import React, { useState } from 'react';
import { generateFibonacciTreeEvents } from '../core/algorithms/fibonacci';
import { GitBranch, Cpu, Database, Zap } from 'lucide-react';

export const StrategyComparator: React.FC = () => {
  const [n, setN] = useState<number>(6);

  const memoStats = React.useMemo(() => {
    return generateFibonacciTreeEvents(n, true).stats;
  }, [n]);

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-hidden p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E385C] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#0F1B2F] text-[#00F0FF] border border-[#1E385C]">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FFFFFF]">
              STRATEGY BENCHMARK & COMPARATOR
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Compare Memoization, Tabulation, and Space-Optimized models on identical problem parameters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono uppercase text-[#707070] font-bold">N PARAMETER:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={n}
            onChange={(e) => setN(Math.max(1, Math.min(12, Number(e.target.value))))}
            className="w-14 px-2 py-1 text-xs bg-[#070B14] border border-[#1E385C] rounded-[2px] text-center text-[#FFFFFF] font-mono focus:border-[#00F0FF] focus:outline-none"
          />
        </div>
      </div>

      {/* 3 Strategy Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
        {/* Strategy 1: Top-Down Memoization */}
        <div className="bg-[#0F1B2F] rounded border border-[#1E385C] p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" /> TOP-DOWN (MEMO)
              </span>
              <span className="text-[9px] font-mono uppercase bg-[#0B1220] text-[#A3A3A3] px-1.5 py-0.5 rounded-[2px] border border-[#1E385C] font-bold">
                DEMAND-DRIVEN
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Initiates evaluation at the global target state and decomposes recursively, caching subproblems upon return.
            </p>

            <div className="mt-4 space-y-1.5 font-mono text-[11px]">
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">RECURSIVE CALLS:</span>
                <span className="font-bold text-[#FFFFFF]">{memoStats.totalCalls}</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">CACHE HITS:</span>
                <span className="font-bold text-[#00F0FF]">{memoStats.memoHits}</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">STACK DEPTH:</span>
                <span className="font-bold text-[#FFFFFF]">{memoStats.maxDepth}</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">AUX SPACE:</span>
                <span className="text-[#A3A3A3]">O(N) (TABLE + STACK)</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-[2px] bg-[#0B1220] border border-[#1E385C] font-mono text-[10px] text-[#A3A3A3]">
            CHARACTERISTIC: Computes strictly reachable subproblems only.
          </div>
        </div>

        {/* Strategy 2: Bottom-Up Tabulation */}
        <div className="bg-[#0F1B2F] rounded border border-[#1E385C] p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#00F0FF]" /> BOTTOM-UP (TABULATION)
              </span>
              <span className="text-[9px] font-mono uppercase bg-[#0B1220] text-[#A3A3A3] px-1.5 py-0.5 rounded-[2px] border border-[#1E385C] font-bold">
                ITERATIVE
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Iterates from terminal base cases upwards in topological order. Eliminates stack frame overhead completely.
            </p>

            <div className="mt-4 space-y-1.5 font-mono text-[11px]">
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">LOOP ITERATIONS:</span>
                <span className="font-bold text-[#FFFFFF]">{Math.max(0, n - 1)}</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">CALL STACK FRAMES:</span>
                <span className="font-bold text-[#00F0FF]">0 (PURE ITERATION)</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">ACCESS PATTERN:</span>
                <span className="text-[#A3A3A3]">SEQUENTIAL CACHE</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">AUX SPACE:</span>
                <span className="text-[#A3A3A3]">O(N) (TABLE OF N+1)</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-[2px] bg-[#0B1220] border border-[#1E385C] font-mono text-[10px] text-[#A3A3A3]">
            CHARACTERISTIC: Optimal memory locality, avoids recursion stack limits.
          </div>
        </div>

        {/* Strategy 3: Space-Optimized */}
        <div className="bg-[#0F1B2F] rounded border border-[#1E385C] p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00F0FF]" /> SPACE-OPTIMIZED
              </span>
              <span className="text-[9px] font-mono uppercase bg-[#0B1220] text-[#A3A3A3] px-1.5 py-0.5 rounded-[2px] border border-[#1E385C] font-bold">
                O(1) MEMORY
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Maintains only immediate dependency registers, discarding history to reduce auxiliary space complexity.
            </p>

            <div className="mt-4 space-y-1.5 font-mono text-[11px]">
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">TIME COMPLEXITY:</span>
                <span className="font-bold text-[#FFFFFF]">O(N)</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">AUX SPACE:</span>
                <span className="font-bold text-[#00F0FF]">O(1) CONSTANT</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">REGISTERS KEPT:</span>
                <span className="text-[#A3A3A3]">PREV1, PREV2</span>
              </div>
              <div className="p-2 rounded-[2px] bg-[#0B1220] border border-[#1E385C] flex justify-between">
                <span className="text-[#707070]">RECONSTRUCTION:</span>
                <span className="text-[#707070]">UNSUPPORTED</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-[2px] bg-[#0B1220] border border-[#1E385C] font-mono text-[10px] text-[#A3A3A3]">
            TRADE-OFF: Minimal memory, but discards intermediate decision states.
          </div>
        </div>
      </div>
    </div>
  );
};
