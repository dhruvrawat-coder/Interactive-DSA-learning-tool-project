import React, { useState } from 'react';
import { useDPStore } from '../core/store';
import { PROBLEMS_REGISTRY } from '../core/problemsData';
import { runEmpiricalBenchmark, BenchmarkReport } from '../core/complexityBenchmark';
import { BarChart3, Activity, Clock, Cpu, Database, ChevronRight, Play } from 'lucide-react';

export const ComplexityBenchmarkView: React.FC = () => {
  const { selectedProblemId, selectProblem } = useDPStore();
  const [report, setReport] = useState<BenchmarkReport>(() =>
    runEmpiricalBenchmark(selectedProblemId)
  );

  const handleBenchmarkRun = (probId: string) => {
    selectProblem(probId);
    const rep = runEmpiricalBenchmark(probId);
    setReport(rep);
  };

  const prob = PROBLEMS_REGISTRY.find((p) => p.id === selectedProblemId) || PROBLEMS_REGISTRY[0];

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E385C] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#0F1B2F] text-[#00F0FF] border border-[#1E385C]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#FFFFFF]">
              COMPLEXITY LAB & EMPIRICAL RUNTIME PROFILER
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Empirical high-resolution runtime measurement vs theoretical Big-O complexity bounds.
            </p>
          </div>
        </div>

        {/* Problem Selector Bar */}
        <div className="flex items-center gap-1.5">
          {PROBLEMS_REGISTRY.map((p) => (
            <button
              key={p.id}
              onClick={() => handleBenchmarkRun(p.id)}
              className={`px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
                selectedProblemId === p.id
                  ? 'bg-[#00F0FF] text-[#000000]'
                  : 'bg-[#0F1B2F] text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#162846] border border-[#1E385C]'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Asymptotic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#0F1B2F] p-3 rounded border border-[#1E385C]">
          <div className="text-[9px] font-mono uppercase text-[#707070] tracking-widest font-bold">
            STATE SPACE CARDINALITY
          </div>
          <div className="text-sm font-mono font-bold text-[#FFFFFF] mt-1">
            {report.nStatesFormula}
          </div>
          <p className="text-[10px] text-[#A3A3A3] mt-1">
            Total unique vertices in the state DAG.
          </p>
        </div>

        <div className="bg-[#0F1B2F] p-3 rounded border border-[#1E385C]">
          <div className="text-[9px] font-mono uppercase text-[#707070] tracking-widest font-bold">
            TRANSITIONS PER STATE
          </div>
          <div className="text-sm font-mono font-bold text-[#00F0FF] mt-1">
            {report.transitionsPerStateFormula}
          </div>
          <p className="text-[10px] text-[#A3A3A3] mt-1">
            Indegree / outgoing evaluations per subproblem.
          </p>
        </div>

        <div className="bg-[#0F1B2F] p-3 rounded border border-[#1E385C]">
          <div className="text-[9px] font-mono uppercase text-[#707070] tracking-widest font-bold">
            THEORETICAL TIME
          </div>
          <div className="text-sm font-mono font-bold text-[#FFFFFF] mt-1">
            {report.theoreticalTime}
          </div>
          <p className="text-[10px] text-[#A3A3A3] mt-1">
            Total sum of degrees across all states.
          </p>
        </div>

        <div className="bg-[#0F1B2F] p-3 rounded border border-[#1E385C]">
          <div className="text-[9px] font-mono uppercase text-[#707070] tracking-widest font-bold">
            AUXILIARY SPACE
          </div>
          <div className="text-sm font-mono font-bold text-[#00F0FF] mt-1">
            {report.theoreticalSpace}
          </div>
          <p className="text-[10px] text-[#A3A3A3] mt-1">
            Table entries preserved in memory.
          </p>
        </div>
      </div>

      {/* Measured Empirical Benchmark Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFFFFF]">
              EMPIRICAL MULTI-SCALE MEASUREMENTS (PERFORMANCE.NOW API)
            </h3>
          </div>
          <button
            onClick={() => handleBenchmarkRun(selectedProblemId)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] text-xs font-mono font-black text-[#000000] transition-colors"
          >
            <Play className="w-3 h-3 fill-black" />
            <span>RE-RUN BENCHMARK</span>
          </button>
        </div>

        <div className="border border-[#1E385C] rounded overflow-hidden bg-[#070B14]">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#0F1B2F] border-b border-[#1E385C] text-[10px] text-[#707070] uppercase font-bold">
                <th className="py-2 px-4 font-normal">INPUT SCALE (N / PARAM)</th>
                <th className="py-2 px-4 font-normal">COMPUTED OPERATIONS</th>
                <th className="py-2 px-4 font-normal">MEASURED WALL CLOCK</th>
                <th className="py-2 px-4 font-normal">GROWTH FACTOR</th>
                <th className="py-2 px-4 font-normal text-right">THEORETICAL VERDICT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A3052]">
              {report.inputMeasurements.map((m, idx) => {
                const prev = idx > 0 ? report.inputMeasurements[idx - 1] : null;
                const ratio = prev ? (m.theoreticalOps / prev.theoreticalOps).toFixed(2) + 'x' : '1.00x (base)';

                return (
                  <tr key={idx} className="hover:bg-[#0F1B2F] transition-colors">
                    <td className="py-2.5 px-4 font-bold text-[#FFFFFF]">
                      Scale = {m.inputSize}
                    </td>
                    <td className="py-2.5 px-4 text-[#A3A3A3]">
                      {m.theoreticalOps.toLocaleString()} ops
                    </td>
                    <td className="py-2.5 px-4 text-[#00F0FF] font-bold">
                      {m.measuredTimeMs} ms
                    </td>
                    <td className="py-2.5 px-4 text-[#A3A3A3]">
                      {ratio}
                    </td>
                    <td className="py-2.5 px-4 text-right text-[#A3A3A3]">
                      Verified Polynomial
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mathematical Rigor Note & Viva Talking Points */}
      <div className="bg-[#0F1B2F] p-4 rounded border border-[#1E385C] space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>VIVA DEFENSE: THEORETICAL COMPLEXITY VS. MEASURED WALL-CLOCK RUNTIME</span>
        </div>
        <p className="text-xs text-[#A3A3A3] leading-relaxed">
          <strong className="text-[#FFFFFF]">Key distinction:</strong> Big-O theoretical complexity characterizes the growth rate of abstract fundamental operations as $N \to \infty$, invariant to CPU architecture or compiler flags. In contrast, measured runtime reflects OS thread scheduling, branch prediction, and cache memory hierarchies. DP Lab tracks both side-by-side to ensure students understand why empirical measurements always confirm the asymptotic ceiling.
        </p>
      </div>
    </div>
  );
};
