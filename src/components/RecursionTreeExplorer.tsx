import React, { useState } from 'react';
import { generateFibonacciTreeEvents } from '../core/algorithms/fibonacci';
import { Network } from 'lucide-react';

export const RecursionTreeExplorer: React.FC = () => {
  const [withMemo, setWithMemo] = useState<boolean>(true);
  const [nVal, setNVal] = useState<number>(5);

  const treeData = React.useMemo(() => {
    return generateFibonacciTreeEvents(nVal, withMemo);
  }, [nVal, withMemo]);

  const { treeNodes, stats } = treeData;

  const depthGroups: Record<number, typeof treeNodes> = {};
  treeNodes.forEach(node => {
    if (!depthGroups[node.depth]) depthGroups[node.depth] = [];
    depthGroups[node.depth].push(node);
  });

  const maxDepth = stats.maxDepth;
  const svgWidth = 850;
  const svgHeight = (maxDepth + 1) * 85 + 50;

  const nodePositions = React.useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    Object.keys(depthGroups).forEach(dStr => {
      const d = Number(dStr);
      const nodesAtDepth = depthGroups[d];
      const count = nodesAtDepth.length;
      const spacing = svgWidth / (count + 1);

      nodesAtDepth.forEach((node, idx) => {
        pos[node.id] = {
          x: spacing * (idx + 1),
          y: d * 85 + 45
        };
      });
    });
    return pos;
  }, [depthGroups, svgWidth]);

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-[#0F1B2F] border-b border-[#1E385C]">
        <div className="flex items-center gap-2.5">
          <Network className="w-4 h-4 text-[#00F0FF]" />
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFFFFF]">
              RECURSION TREE EXPLORER
            </h3>
          </div>
        </div>

        {/* Input & Memo Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-mono uppercase text-[#707070] font-bold">N (INPUT):</label>
            <input
              type="number"
              min="1"
              max="6"
              value={nVal}
              onChange={(e) => setNVal(Math.max(1, Math.min(6, Number(e.target.value))))}
              className="w-12 px-2 py-0.5 text-xs bg-[#070B14] border border-[#1E385C] rounded-[2px] text-center text-[#FFFFFF] font-mono focus:border-[#00F0FF] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#0B1220] px-2 py-1 rounded-[2px] border border-[#1E385C]">
            <span className="text-[10px] font-mono uppercase text-[#A3A3A3] font-bold">MEMOIZATION:</span>
            <button
              onClick={() => setWithMemo(!withMemo)}
              className={`text-[10px] px-2.5 py-0.5 rounded-[2px] font-mono uppercase font-black transition-colors ${
                withMemo
                  ? 'bg-[#00F0FF] text-[#000000]'
                  : 'bg-[#162846] text-[#A3A3A3] border border-[#1E385C]'
              }`}
            >
              {withMemo ? 'ENABLED (O(N))' : 'DISABLED (O(2^N))'}
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2 bg-[#0F1B2F] border-b border-[#1E385C]">
        <div className="p-2 border border-[#1E385C] bg-[#0B1220] rounded-[2px]">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#707070] font-bold">TOTAL CALLS</div>
          <div className="text-sm font-mono font-black text-[#FFFFFF] mt-0.5">{stats.totalCalls}</div>
        </div>
        <div className="p-2 border border-[#1E385C] bg-[#0B1220] rounded-[2px]">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#707070] font-bold">UNIQUE STATES</div>
          <div className="text-sm font-mono font-black text-[#00F0FF] mt-0.5">{stats.uniqueStates}</div>
        </div>
        <div className="p-2 border border-[#1E385C] bg-[#0B1220] rounded-[2px]">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#707070] font-bold">MEMO HITS (PRUNED)</div>
          <div className="text-sm font-mono font-black text-[#00F0FF] mt-0.5">{stats.memoHits}</div>
        </div>
        <div className="p-2 border border-[#1E385C] bg-[#0B1220] rounded-[2px]">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#707070] font-bold">MAX STACK DEPTH</div>
          <div className="text-sm font-mono font-black text-[#FFFFFF] mt-0.5">{stats.maxDepth}</div>
        </div>
      </div>

      {/* SVG Tree Area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-[#070B14]">
        <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none">
          {/* Render Edges */}
          {treeNodes.map((node) => {
            if (!node.parentId || !nodePositions[node.parentId] || !nodePositions[node.id]) return null;
            const parent = nodePositions[node.parentId];
            const current = nodePositions[node.id];

            return (
              <g key={`edge_${node.id}`}>
                <line
                  x1={parent.x}
                  y1={parent.y + 16}
                  x2={current.x}
                  y2={current.y - 16}
                  stroke={node.isMemoHit ? '#00F0FF' : node.isDuplicate ? '#666666' : '#1E385C'}
                  strokeWidth={node.isMemoHit ? 2 : 1}
                  strokeDasharray={node.isMemoHit ? '3 3' : undefined}
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {treeNodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            let bgColor = '#0F1B2F';
            let strokeColor = '#1E385C';
            let textColor = '#FFFFFF';

            if (node.isMemoHit) {
              bgColor = '#00F0FF';
              strokeColor = '#00F0FF';
              textColor = '#000000';
            } else if (node.isDuplicate) {
              bgColor = '#0B1220';
              strokeColor = '#505050';
              textColor = '#707070';
            }

            return (
              <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <rect
                  x="-36"
                  y="-16"
                  width="72"
                  height="32"
                  rx="2"
                  fill={bgColor}
                  stroke={strokeColor}
                  strokeWidth={node.isMemoHit ? 2 : 1}
                />
                <text
                  x="0"
                  y="-1"
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.args}
                </text>
                <text
                  x="0"
                  y="10"
                  textAnchor="middle"
                  fill={node.isMemoHit ? '#000000' : '#A3A3A3'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight={node.isMemoHit ? 'bold' : 'normal'}
                >
                  {node.value !== null && node.value !== undefined ? `ans=${node.value}` : '...'}
                </text>

                {node.isMemoHit && (
                  <circle cx="32" cy="-12" r="3" fill="#000000" />
                )}
                {node.isDuplicate && !withMemo && (
                  <circle cx="32" cy="-12" r="3" fill="#707070" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Insight */}
      <div className="px-4 py-2 bg-[#0F1B2F] border-t border-[#1E385C] text-xs text-[#A3A3A3] flex items-center justify-between font-mono">
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[1px] bg-[#00F0FF]"></span>
            <span className="text-[#FFFFFF]">MEMO HIT (PRUNED)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[1px] border border-[#505050] bg-[#0B1220]"></span>
            <span>REDUNDANT COMPUTATION</span>
          </div>
        </div>
        <div className="text-[10px] text-[#00F0FF] font-bold">
          {withMemo ? 'TOPOLOGICAL PRUNING ACTIVE' : 'EXPONENTIAL OVERLAP DETECTED'}
        </div>
      </div>
    </div>
  );
};
