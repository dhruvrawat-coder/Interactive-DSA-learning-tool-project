import React from 'react';
import { BookMarked, Lightbulb, Compass, Database } from 'lucide-react';

export const DPHandbook: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-[#1E385C] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#0F1B2F] text-[#00F0FF] border border-[#1E385C]">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FFFFFF]">
              DYNAMIC PROGRAMMING ARCHITECTURAL HANDBOOK
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Theoretical reference for state reduction, recurrence derivation, and topological ordering.
            </p>
          </div>
        </div>
      </div>

      {/* Chapter 1: The Two Pillars */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] flex items-center gap-2 font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-[#00F0FF]" />
          1. THE TWO ESSENTIAL PILLARS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#0F1B2F] p-3.5 rounded border border-[#1E385C] space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-[#FFFFFF] uppercase">
              PILLAR A: OVERLAPPING SUBPROBLEMS
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              The recursive tree evaluates identical parameter states repeatedly. Dynamic Programming caches each unique subproblem to establish a Directed Acyclic Graph (DAG) of computations.
            </p>
          </div>
          <div className="bg-[#0F1B2F] p-3.5 rounded border border-[#1E385C] space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-[#FFFFFF] uppercase">
              PILLAR B: OPTIMAL SUBSTRUCTURE
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              The global optimum can be constructed directly from the optimal values of its subproblems without inter-subproblem state conflict.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 2: The 5-Step State Formulation */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] flex items-center gap-2 font-bold">
          <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
          2. THE 5-STEP STATE FORMULATION FRAMEWORK
        </h2>
        <div className="bg-[#0F1B2F] p-4 rounded border border-[#1E385C] space-y-2.5 text-xs">
          <div className="flex items-start gap-3">
            <span className="font-mono text-[#00F0FF] text-xs font-bold shrink-0">01.</span>
            <div>
              <strong className="text-[#FFFFFF] font-mono text-[11px] uppercase">Identify Current Decision:</strong>
              <p className="text-[#A3A3A3] mt-0.5">Determine the set of choices available at step i (e.g., include item vs. exclude item).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-[#00F0FF] text-xs font-bold shrink-0">02.</span>
            <div>
              <strong className="text-[#FFFFFF] font-mono text-[11px] uppercase">Define Minimal Sufficient State:</strong>
              <p className="text-[#A3A3A3] mt-0.5">Identify the minimal parameters required to make subsequent decisions valid.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-[#00F0FF] text-xs font-bold shrink-0">03.</span>
            <div>
              <strong className="text-[#FFFFFF] font-mono text-[11px] uppercase">Determine Base Boundaries:</strong>
              <p className="text-[#A3A3A3] mt-0.5">Establish deterministic returns for edge conditions (empty string, 0 capacity, index 0).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-[#00F0FF] text-xs font-bold shrink-0">04.</span>
            <div>
              <strong className="text-[#FFFFFF] font-mono text-[11px] uppercase">Formulate Recurrence Relation:</strong>
              <p className="text-[#A3A3A3] mt-0.5">Express dp[state] as an extremum (min/max) or sum over predecessors.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-[#00F0FF] text-xs font-bold shrink-0">05.</span>
            <div>
              <strong className="text-[#FFFFFF] font-mono text-[11px] uppercase">Topological Evaluation Order:</strong>
              <p className="text-[#A3A3A3] mt-0.5">Order loops so that whenever state S is accessed, all states S depends upon are pre-calculated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: DP Archetypes */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] flex items-center gap-2 font-bold">
          <Database className="w-3.5 h-3.5 text-[#00F0FF]" />
          3. TAXONOMY OF CANONICAL DP PATTERNS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded bg-[#0F1B2F] border border-[#1E385C] space-y-1">
            <span className="font-mono font-bold text-[#00F0FF] text-[11px] uppercase">1. Linear / 1D DP</span>
            <p className="text-[#A3A3A3]">dp[i] depends on a fixed constant window of predecessor indices.</p>
            <span className="text-[10px] text-[#707070] font-mono block">Fibonacci, House Robber</span>
          </div>
          <div className="p-3 rounded bg-[#0F1B2F] border border-[#1E385C] space-y-1">
            <span className="font-mono font-bold text-[#00F0FF] text-[11px] uppercase">2. Knapsack (Bounded Resource)</span>
            <p className="text-[#A3A3A3]">dp[i][w] tracks prefix of elements and remaining resource budget.</p>
            <span className="text-[10px] text-[#707070] font-mono block">0/1 Knapsack, Subset Sum</span>
          </div>
          <div className="p-3 rounded bg-[#0F1B2F] border border-[#1E385C] space-y-1">
            <span className="font-mono font-bold text-[#00F0FF] text-[11px] uppercase">3. Grid / Coordinate DP</span>
            <p className="text-[#A3A3A3]">dp[r][c] paths evaluated over spatial coordinates.</p>
            <span className="text-[10px] text-[#707070] font-mono block">Min Path Sum, Unique Paths</span>
          </div>
          <div className="p-3 rounded bg-[#0F1B2F] border border-[#1E385C] space-y-1">
            <span className="font-mono font-bold text-[#00F0FF] text-[11px] uppercase">4. Subsequence / String DP</span>
            <p className="text-[#A3A3A3]">dp[i][j] compares prefixes of two sequence dimensions.</p>
            <span className="text-[10px] text-[#707070] font-mono block">LCS, Edit Distance</span>
          </div>
          <div className="p-3 rounded bg-[#0F1B2F] border border-[#1E385C] space-y-1">
            <span className="font-mono font-bold text-[#00F0FF] text-[11px] uppercase">5. Interval DP</span>
            <p className="text-[#A3A3A3]">dp[i][j] solves ranges with outer loop iterating over window length.</p>
            <span className="text-[10px] text-[#707070] font-mono block">Matrix Chain Multiplication</span>
          </div>
          <div className="p-3 rounded bg-[#0F1B2F] border border-[#1E385C] space-y-1">
            <span className="font-mono font-bold text-[#00F0FF] text-[11px] uppercase">6. Bitmask DP</span>
            <p className="text-[#A3A3A3]">dp[mask][u] represents visited sets using integer bit operations.</p>
            <span className="text-[10px] text-[#707070] font-mono block">TSP, Assignment Problems</span>
          </div>
        </div>
      </section>
    </div>
  );
};
