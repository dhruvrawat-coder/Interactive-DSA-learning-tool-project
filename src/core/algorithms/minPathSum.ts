import { DPExecutionEvent, TransitionCandidate } from '../types';

export interface GridDPResult {
  events: DPExecutionEvent[];
  optimalPath: { row: number; col: number }[];
  minCost: number;
}

/**
 * MINIMUM PATH SUM GRID DP GENERATOR
 */
export function generateMinPathSumEvents(grid: number[][]): GridDPResult {
  const events: DPExecutionEvent[] = [];
  let step = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  const dp: (number | null)[][] = Array.from({ length: rows }, () =>
    new Array(cols).fill(null)
  );

  const snap = () => dp.map(r => [...r]);

  events.push({
    step: ++step,
    type: 'STEP_START',
    title: 'Initialize Grid DP Matrix',
    explanation: `Create an ${rows}x${cols} table. dp[r][c] represents the minimum path sum to reach cell (r, c) from (0, 0), moving only Right or Down.`,
    codeLine: 1,
    tableSnapshot: snap(),
    variables: { rows, cols }
  });

  // Base Case (0,0)
  dp[0][0] = grid[0][0];
  events.push({
    step: ++step,
    type: 'BASE_CASE_HIT',
    title: `Starting Cell (0,0): Cost = ${grid[0][0]}`,
    explanation: `dp[0][0] = grid[0][0] = ${grid[0][0]}. This is the starting point.`,
    coords: { row: 0, col: 0 },
    selectedValue: grid[0][0],
    codeLine: 2,
    tableSnapshot: snap(),
    variables: { 'dp[0][0]': dp[0][0] }
  });

  // First row (can only come from left)
  for (let c = 1; c < cols; c++) {
    const prev = dp[0][c - 1]!;
    const val = prev + grid[0][c];
    dp[0][c] = val;

    events.push({
      step: ++step,
      type: 'CELL_SET',
      title: `First Row Cell (0,${c}): Only Move Right`,
      explanation: `dp[0][${c}] = dp[0][${c-1}] (${prev}) + grid[0][${c}] (${grid[0][c]}) = ${val}.`,
      coords: { row: 0, col: c },
      dependencies: [{ row: 0, col: c - 1, label: `Left: ${prev}` }],
      selectedValue: val,
      codeLine: 3,
      tableSnapshot: snap(),
      variables: { c, val }
    });
  }

  // First col (can only come from top)
  for (let r = 1; r < rows; r++) {
    const prev = dp[r - 1][0]!;
    const val = prev + grid[r][0];
    dp[r][0] = val;

    events.push({
      step: ++step,
      type: 'CELL_SET',
      title: `First Col Cell (${r},0): Only Move Down`,
      explanation: `dp[${r}][0] = dp[${r-1}][0] (${prev}) + grid[${r}][0] (${grid[r][0]}) = ${val}.`,
      coords: { row: r, col: 0 },
      dependencies: [{ row: r - 1, col: 0, label: `Top: ${prev}` }],
      selectedValue: val,
      codeLine: 4,
      tableSnapshot: snap(),
      variables: { r, val }
    });
  }

  // General transitions
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      const topVal = dp[r - 1][c]!;
      const leftVal = dp[r][c - 1]!;
      const currentCellCost = grid[r][c];

      const candidates: TransitionCandidate[] = [
        {
          choice: 'From Top',
          expression: `dp[${r-1}][${c}] + ${currentCellCost} = ${topVal + currentCellCost}`,
          value: topVal + currentCellCost,
          sourceCoords: { row: r - 1, col: c }
        },
        {
          choice: 'From Left',
          expression: `dp[${r}][${c-1}] + ${currentCellCost} = ${leftVal + currentCellCost}`,
          value: leftVal + currentCellCost,
          sourceCoords: { row: r, col: c - 1 }
        }
      ];

      events.push({
        step: ++step,
        type: 'DEPENDENCY_READ',
        title: `Evaluating dp[${r}][${c}] (Cell cost: ${currentCellCost})`,
        explanation: `Can arrive from Top: (${r-1}, ${c}) [sum=${topVal}] or Left: (${r}, ${c-1}) [sum=${leftVal}].`,
        coords: { row: r, col: c },
        dependencies: [
          { row: r - 1, col: c, label: `Top: ${topVal}` },
          { row: r, col: c - 1, label: `Left: ${leftVal}` }
        ],
        candidates,
        codeLine: 5,
        tableSnapshot: snap(),
        variables: { r, c, topVal, leftVal, currentCellCost }
      });

      const best = Math.min(topVal, leftVal) + currentCellCost;
      const decision = topVal < leftVal ? 'From Top' : 'From Left';

      events.push({
        step: ++step,
        type: 'TRANSITION_EVALUATE',
        title: `Choose Minimum: ${decision}`,
        explanation: `min(${topVal}, ${leftVal}) + ${currentCellCost} = ${best}. Chosen arrival: ${decision}.`,
        coords: { row: r, col: c },
        dependencies: [
          { row: r - 1, col: c },
          { row: r, col: c - 1 }
        ],
        candidates,
        selectedValue: best,
        codeLine: 6,
        tableSnapshot: snap(),
        variables: { best, decision }
      });

      dp[r][c] = best;
      events.push({
        step: ++step,
        type: 'CELL_SET',
        title: `dp[${r}][${c}] = ${best}`,
        explanation: `Minimum sum to reach (${r},${c}) stored as ${best}.`,
        coords: { row: r, col: c },
        selectedValue: best,
        codeLine: 6,
        tableSnapshot: snap(),
        variables: { [`dp[${r}][${c}]`]: best }
      });
    }
  }

  // RECONSTRUCTION
  const optimalPath: { row: number; col: number }[] = [];
  let currR = rows - 1;
  let currC = cols - 1;

  while (currR > 0 || currC > 0) {
    optimalPath.push({ row: currR, col: currC });

    if (currR === 0) {
      currC--;
    } else if (currC === 0) {
      currR--;
    } else {
      if (dp[currR - 1][currC]! < dp[currR][currC - 1]!) {
        currR--;
      } else {
        currC--;
      }
    }
  }
  optimalPath.push({ row: 0, col: 0 });
  optimalPath.reverse();

  events.push({
    step: ++step,
    type: 'COMPLETED',
    title: `Minimum Path Sum Found: ${dp[rows - 1][cols - 1]}`,
    explanation: `Optimal cost is ${dp[rows - 1][cols - 1]}. Traversed path contains ${optimalPath.length} cells.`,
    coords: { row: rows - 1, col: cols - 1 },
    selectedValue: dp[rows - 1][cols - 1],
    reconstructedPath: optimalPath.map(p => ({ row: p.row, col: p.col })),
    codeLine: 7,
    tableSnapshot: snap(),
    variables: { minSum: dp[rows - 1][cols - 1], pathLength: optimalPath.length }
  });

  return {
    events,
    optimalPath,
    minCost: dp[rows - 1][cols - 1]!
  };
}

