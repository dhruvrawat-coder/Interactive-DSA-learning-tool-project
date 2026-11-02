import React, { useState } from 'react';
import { useDPStore } from '../core/store';
import { PROBLEMS_REGISTRY } from '../core/problemsData';
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, 
  HelpCircle, ChevronRight, Eye
} from 'lucide-react';
import { NextCellPredictorModal } from './NextCellPredictorModal';

export const TableVisualizer: React.FC = () => {
  const {
    events,
    currentStepIndex,
    isPlaying,
    setIsPlaying,
    stepForward,
    stepBackward,
    jumpToStep,
    playbackSpeed,
    setPlaybackSpeed,
    selectedProblemId,
    currentInput
  } = useDPStore();

  const currentEvent = events[currentStepIndex];
  const tableSnapshot = currentEvent?.tableSnapshot;
  const [showPredictor, setShowPredictor] = useState(false);

  React.useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        stepForward();
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, stepForward]);

  if (!currentEvent || !tableSnapshot) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#707070] p-8 text-center bg-[#0B1220] border border-[#1E385C] rounded">
        <p className="text-xs font-mono uppercase tracking-widest text-[#707070]">No execution simulation initialized</p>
      </div>
    );
  }

  const rows = tableSnapshot.length;
  const cols = tableSnapshot[0]?.length || 0;

  const isCurrentCell = (r: number, c: number) => {
    return currentEvent.coords?.row === r && (currentEvent.coords?.col === c || (currentEvent.coords?.col === undefined && c === r));
  };

  const isDependencyCell = (r: number, c: number) => {
    return currentEvent.dependencies?.some(d => d.row === r && (d.col === c || (d.col === undefined && c === r)));
  };

  const isReconstructedCell = (r: number, c: number) => {
    return currentEvent.reconstructedPath?.some(p => p.row === r && (p.col === c || (p.col === undefined && c === r)));
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-hidden">
      {/* Top Controls Bar - Cyber Obsidian high-contrast bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#0F1B2F] border-b border-[#1E385C]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#162846] text-[#00F0FF] border border-[#1E385C]">
            STEP {String(currentStepIndex + 1).padStart(2, '0')}/{String(events.length).padStart(2, '0')}
          </span>
          <div className="h-3 w-[1px] bg-[#1E385C]" />
          <span className="text-[11px] font-mono text-[#A3A3A3]">
            EVENT: <span className="text-[#FFFFFF] font-bold">{currentEvent.type}</span>
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => jumpToStep(0)}
            title="Reset to Start"
            className="p-1.5 rounded text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#162846] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepBackward}
            disabled={currentStepIndex === 0}
            title="Step Backward"
            className="p-1.5 rounded text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#162846] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
            className="px-3 py-1 rounded bg-[#00F0FF] hover:bg-[#00D1DF] text-[#000000] font-mono text-xs font-black flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          <button
            onClick={stepForward}
            disabled={currentStepIndex === events.length - 1}
            title="Step Forward"
            className="p-1.5 rounded text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#162846] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[#1E385C]">
            <span className="text-[10px] font-mono text-[#707070] uppercase font-bold">SPEED:</span>
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-[#00F0FF] text-[#000000]'
                    : 'text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#162846]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Predict Next Cell Challenge Button */}
          <button
            onClick={() => setShowPredictor(true)}
            className="ml-2 px-2.5 py-1 rounded bg-[#162846] hover:bg-[#00F0FF] hover:text-black text-[#00F0FF] border border-[#00F0FF]/40 font-mono text-[10px] font-black flex items-center gap-1 transition-colors uppercase tracking-wider"
            title="Test if you can calculate the next cell yourself!"
          >
            <Eye className="w-3 h-3" />
            <span>PREDICT NEXT CELL</span>
          </button>
        </div>
      </div>

      {/* Scrubbing Timeline Bar */}
      <div className="w-full bg-[#0B1220] px-4 py-2 border-b border-[#1E385C] flex items-center gap-3">
        <input
          type="range"
          min="0"
          max={events.length - 1}
          value={currentStepIndex}
          onChange={(e) => jumpToStep(Number(e.target.value))}
          className="w-full h-1.5 bg-[#162846] rounded-none appearance-none cursor-pointer accent-[#00F0FF]"
        />
      </div>

      {/* Main Interactive Table Grid */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center min-h-[300px] bg-[#070B14]">
        {/* Table Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#A3A3A3] mb-6 px-3 py-1.5 rounded border border-[#1E385C] bg-[#0F1B2F]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#00F0FF] rounded-[2px]" />
            <span className="text-[#FFFFFF] font-bold">ACTIVE CELL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-dashed border-[#00F0FF] bg-[#162846] rounded-[2px]" />
            <span>DEPENDENCY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border border-[#404040] bg-[#0F1B2F] rounded-[2px]" />
            <span>COMPUTED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#23416B] border border-[#00F0FF] rounded-[2px]" />
            <span className="text-[#00F0FF] font-bold">RECONSTRUCTED</span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="relative inline-block border border-[#1E385C] rounded bg-[#0B1220] p-4 shadow-xl">
          <table className="border-collapse select-none">
            <thead>
              <tr>
                <th className="p-2 text-[10px] font-mono text-[#707070] text-center border-b border-r border-[#1E385C] font-bold uppercase tracking-wider">
                  {selectedProblemId === 'knapsack-01' ? 'ITEM \\ CAP' : selectedProblemId === 'lcs' ? 'S1 \\ S2' : selectedProblemId === 'lis' ? 'NUMS[i]' : 'i'}
                </th>
                {Array.from({ length: cols }).map((_, c) => {
                  let colHeader = String(c);
                  if (selectedProblemId === 'lcs' && c > 0) {
                    colHeader = `${c} '${String(currentInput.text2 || 'BDCABA')[c - 1]}'`;
                  } else if (selectedProblemId === 'lis') {
                    const nums = currentInput.nums || [10, 9, 2, 5, 3, 7, 101, 18];
                    colHeader = `[${c}]=${nums[c]}`;
                  }
                  return (
                    <th
                      key={c}
                      className="p-2 text-[10px] font-mono text-[#A3A3A3] font-bold text-center border-b border-[#1E385C] min-w-[46px]"
                    >
                      {colHeader}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tableSnapshot.map((row, r) => {
                let rowHeader = String(r);
                if (selectedProblemId === 'knapsack-01') {
                  const items = currentInput.items || [];
                  rowHeader = r === 0 ? '0' : `${r} (${items[r - 1]?.name || ''})`;
                } else if (selectedProblemId === 'lcs') {
                  rowHeader = r === 0 ? '0' : `${r} '${String(currentInput.text1 || 'ABCBDAB')[r - 1]}'`;
                }

                return (
                  <tr key={r}>
                    <td className="p-2 text-[10px] font-mono text-[#707070] border-r border-[#1E385C] text-center font-bold bg-[#0F1B2F]">
                      {rowHeader}
                    </td>
                    {row.map((cellVal, c) => {
                      const isCurrent = isCurrentCell(r, c);
                      const isDep = isDependencyCell(r, c);
                      const isRecon = isReconstructedCell(r, c);
                      const isFilled = cellVal !== null;

                      let cellStyle = 'bg-[#0F1B2F] text-[#555555] border-[#1A3052]';

                      if (isCurrent) {
                        // Vibrant Cyber Neon Cyan active highlight
                        cellStyle = 'bg-[#00F0FF] text-[#000000] font-black border-[#00F0FF] z-20 scale-105 shadow-md';
                      } else if (isRecon) {
                        cellStyle = 'bg-[#162846] text-[#00F0FF] font-black border-[#00F0FF] ring-1 ring-[#00F0FF] z-10';
                      } else if (isDep) {
                        cellStyle = 'bg-[#162846] text-[#FFFFFF] font-bold border-2 border-dashed border-[#00F0FF]';
                      } else if (isFilled) {
                        cellStyle = 'bg-[#0F1B2F] text-[#FFFFFF] font-bold border-[#1E385C] hover:border-[#00F0FF]';
                      }

                      return (
                        <td key={c} className="p-0.5 text-center">
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-[2px] text-xs transition-all duration-150 border font-mono ${cellStyle}`}
                          >
                            {cellVal !== null ? cellVal : '—'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Candidates Transition Breakdown Box */}
        {currentEvent.candidates && currentEvent.candidates.length > 0 && (
          <div className="mt-5 w-full max-w-xl bg-[#0F1B2F] border border-[#1E385C] rounded p-3.5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] flex items-center gap-1.5 mb-2.5 font-bold">
              <ChevronRight className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>CANDIDATE TRANSITIONS FOR STATE {currentEvent.coords ? `(${currentEvent.coords.row}, ${currentEvent.coords.col})` : ''}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentEvent.candidates.map((cand, idx) => {
                const isSelected = cand.value === currentEvent.selectedValue;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-[2px] border text-xs flex flex-col justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#162846] border-[#00F0FF] text-[#FFFFFF]'
                        : 'bg-[#0B1220] border-[#1E385C] text-[#707070]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>{cand.choice}</span>
                      {isSelected && (
                        <span className="text-[9px] bg-[#00F0FF] text-[#000000] px-1.5 py-0.2 rounded-[2px] font-black uppercase tracking-wider">
                          SELECTED
                        </span>
                      )}
                    </div>
                    {cand.expression && (
                      <div className="text-[10px] font-mono mt-1 text-[#A3A3A3]">
                        {cand.expression}
                      </div>
                    )}
                    <div className="text-right font-mono font-bold text-xs mt-1.5">
                      VALUE: <span className={isSelected ? 'text-[#00F0FF]' : 'text-[#707070]'}>{cand.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Step Explanation Banner */}
      <div className="px-5 py-3 bg-[#0F1B2F] border-t border-[#1E385C] flex items-start gap-3">
        <div className="p-1.5 rounded bg-[#162846] text-[#00F0FF] shrink-0 mt-0.5">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-mono font-bold text-[#FFFFFF]">
            {currentEvent.title}
          </h3>
          <p className="text-xs text-[#A3A3A3] mt-0.5 leading-relaxed">
            {currentEvent.explanation}
          </p>
        </div>
      </div>

      {/* Prediction Modal */}
      {showPredictor && (
        <NextCellPredictorModal
          problemId={selectedProblemId}
          onClose={() => setShowPredictor(false)}
        />
      )}
    </div>
  );
};
