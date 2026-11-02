import React, { useEffect } from 'react';
import { useDPStore } from './core/store';
import { PROBLEMS_REGISTRY } from './core/problemsData';
import { TableVisualizer } from './components/TableVisualizer';
import { RecursionTreeExplorer } from './components/RecursionTreeExplorer';
import { CodeSyncViewer } from './components/CodeSyncViewer';
import { PedagogyGuidePanel } from './components/PedagogyGuidePanel';
import { MistakeAnalyzerView } from './components/MistakeAnalyzerView';
import { StrategyComparator } from './components/StrategyComparator';
import { DPHandbook } from './components/DPHandbook';
import { PracticeArena } from './components/PracticeArena';
import { DashboardView } from './components/DashboardView';
import { ComplexityBenchmarkView } from './components/ComplexityBenchmarkView';
import { InteractiveLearningMode } from './components/InteractiveLearningMode';
import { LessonsDirectoryView } from './components/LessonsDirectoryView';
import { 
  Layers, GitBranch, Bug, Target, BookOpen, 
  Table, Network, LayoutDashboard, Sliders, BarChart3, Presentation
} from 'lucide-react';

export function App() {
  const {
    currentView,
    setCurrentView,
    activeVisualTab,
    setActiveVisualTab,
    selectedProblemId,
    selectProblem,
    runSimulation,
    currentInput,
    selectedLessonId
  } = useDPStore();

  useEffect(() => {
    runSimulation();
  }, [selectedProblemId, runSimulation]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070B14] text-[#FFFFFF] font-sans overflow-hidden">
      {/* Top Navigation Header - Cyber Neon Obsidian brand mark */}
      <header className="h-12 border-b border-[#1E385C] bg-[#0B1220] px-4 flex items-center justify-between shrink-0 z-30 shadow-lg shadow-[#00F0FF]/5">
        <div className="flex items-center gap-5">
          {/* Cyber Neon Logo Badge */}
          <div 
            className="flex items-center cursor-pointer select-none group" 
            onClick={() => setCurrentView('dashboard')}
          >
            <span className="font-black text-sm tracking-wider text-[#FFFFFF] px-1 font-mono">
              DP
            </span>
            <span className="font-black text-sm tracking-wider text-[#070B14] bg-[#00F0FF] px-1.5 py-0.5 rounded-[3px] font-mono ml-0.5 shadow-[0_0_12px_rgba(0,240,255,0.6)] group-hover:shadow-[0_0_18px_rgba(0,240,255,0.9)] transition-all">
              LAB
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#1E385C]" />

          {/* Target Problem Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#707070] uppercase font-bold">ALGORITHM:</span>
            <select
              value={selectedProblemId}
              onChange={(e) => selectProblem(e.target.value)}
              className="bg-[#0F1B2F] border border-[#1E385C] rounded-[2px] text-xs font-mono text-[#FFFFFF] px-2 py-0.5 focus:outline-none focus:border-[#00F0FF] cursor-pointer font-bold"
            >
              {PROBLEMS_REGISTRY.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.category}] {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
              currentView === 'dashboard'
                ? 'bg-[#00F0FF] text-[#000000]'
                : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('lessons')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors border ${
              currentView === 'lessons'
                ? 'bg-[#00F0FF] text-[#000000] border-[#00F0FF]'
                : 'text-[#00F0FF] border-[#00F0FF]/30 hover:bg-[#0F1B2F]'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Lessons</span>
          </button>

          <button
            onClick={() => setCurrentView('workspace')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
              currentView === 'workspace'
                ? 'bg-[#00F0FF] text-[#000000]'
                : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => setCurrentView('comparator')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
              currentView === 'comparator'
                ? 'bg-[#00F0FF] text-[#000000]'
                : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Comparator</span>
          </button>

          <button
            onClick={() => setCurrentView('benchmark')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
              currentView === 'benchmark'
                ? 'bg-[#00F0FF] text-[#000000]'
                : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Complexity</span>
          </button>

          <button
            onClick={() => setCurrentView('mistakes')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
              currentView === 'mistakes'
                ? 'bg-[#00F0FF] text-[#000000]'
                : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Mistakes</span>
          </button>

          <button
            onClick={() => setCurrentView('practice')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
              currentView === 'practice'
                ? 'bg-[#00F0FF] text-[#000000]'
                : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Arena</span>
          </button>

          <button
            onClick={() => setCurrentView('handbook')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold transition-colors ${
              currentView === 'handbook'
                ? 'bg-[#00F0FF] text-[#000000]'
                : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Handbook</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 overflow-hidden p-2.5 bg-[#070B14]">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'lessons' && (
          selectedLessonId ? <InteractiveLearningMode /> : <LessonsDirectoryView />
        )}

        {currentView === 'workspace' && (
          <div className="grid grid-cols-12 gap-2.5 h-full">
            {/* LEFT COLUMN: 10-Step Pedagogy Guide (3 Cols) */}
            <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
              <PedagogyGuidePanel />
            </div>

            {/* CENTER COLUMN: Interactive Visualization Engine (6 Cols) */}
            <div className="col-span-12 lg:col-span-6 h-full flex flex-col gap-2 overflow-hidden">
              {/* Visualizer Mode Switcher */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#0B1220] rounded border border-[#1E385C] shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveVisualTab('table')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-mono font-bold uppercase transition-colors ${
                      activeVisualTab === 'table'
                        ? 'bg-[#00F0FF] text-[#000000]'
                        : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>DP TABLE</span>
                  </button>

                  <button
                    onClick={() => setActiveVisualTab('tree')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-mono font-bold uppercase transition-colors ${
                      activeVisualTab === 'tree'
                        ? 'bg-[#00F0FF] text-[#000000]'
                        : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0F1B2F]'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>CALL TREE</span>
                  </button>
                </div>

                {/* Input config preview badge */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#707070]">
                  <Sliders className="w-3 h-3 text-[#00F0FF]" />
                  <span>
                    {selectedProblemId === 'fibonacci' && `n=${currentInput.n ?? 6}`}
                    {selectedProblemId === 'knapsack-01' && `W=${currentInput.capacity ?? 7}`}
                    {selectedProblemId === 'lcs' && `len1=${String(currentInput.text1).length}, len2=${String(currentInput.text2).length}`}
                    {selectedProblemId === 'lis' && `n=${(currentInput.nums || []).length} items`}
                    {selectedProblemId === 'min-path-sum' && '3x3 grid'}
                  </span>
                </div>
              </div>

              {/* Visualization Canvas */}
              <div className="flex-1 overflow-hidden">
                {activeVisualTab === 'table' ? (
                  <TableVisualizer />
                ) : (
                  <RecursionTreeExplorer />
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Synchronized Code & Live Inspector (3 Cols) */}
            <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
              <CodeSyncViewer />
            </div>
          </div>
        )}

        {currentView === 'comparator' && <StrategyComparator />}
        {currentView === 'benchmark' && <ComplexityBenchmarkView />}
        {currentView === 'mistakes' && <MistakeAnalyzerView />}
        {currentView === 'practice' && <PracticeArena />}
        {currentView === 'handbook' && <DPHandbook />}
      </main>
    </div>
  );
}

export default App;
