import { DPExecutionEvent, TransitionCandidate } from '../types';

export interface KnapsackItem {
  id: number;
  name: string;
  weight: number;
  value: number;
}

export interface KnapsackResult {
  events: DPExecutionEvent[];
  reconstructedItems: KnapsackItem[];
  tableDimensions: { rows: number; cols: number };
}

/**
 * 0/1 KNAPSACK 2D TABULATION & RECONSTRUCTION GENERATOR
 */
export function generateKnapsackEvents(
  items: KnapsackItem[],
  capacity: number
): KnapsackResult {
  const events: DPExecutionEvent[] = [];
  let step = 0;
  const n = items.length;

  // dp[i][w] = max value considering items 0..i-1 with capacity w
  const dp: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(null)
  );

  const snap = () => dp.map(row => [...row]);

  // Step 1: Initialize Table
  events.push({
    step: ++step,
    type: 'STEP_START',
    title: 'Initialize 2D DP Table',
    explanation: `Create a (N+1) x (W+1) matrix of size (${n + 1} x ${capacity + 1}). dp[i][w] represents the maximum value achievable considering the first i items with bag capacity w.`,
    codeLine: 1,
    tableSnapshot: snap(),
    variables: { itemsCount: n, capacity }
  });

  // Base cases: row 0 (0 items) -> 0 value, col 0 (0 capacity) -> 0 value
  for (let w = 0; w <= capacity; w++) {
    dp[0][w] = 0;
  }
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 0;
  }

  events.push({
    step: ++step,
    type: 'BASE_CASE_HIT',
    title: 'Base Cases Initialized',
    explanation: 'dp[0][w] = 0 (0 items available yields 0 value) and dp[i][0] = 0 (0 capacity holds 0 items).',
    coords: { row: 0, col: 0 },
    codeLine: 2,
    tableSnapshot: snap(),
    variables: { 'dp[0][...]': 0, 'dp[...][0]': 0 }
  });

  // Evaluate transitions
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];

    for (let w = 1; w <= capacity; w++) {
      const excludeVal = dp[i - 1][w]!;
      const candidates: TransitionCandidate[] = [
        {
          choice: `Exclude Item ${i} (${item.name})`,
          expression: `dp[${i - 1}][${w}] = ${excludeVal}`,
          value: excludeVal,
          sourceCoords: { row: i - 1, col: w }
        }
      ];

      const dependencies: { row: number; col?: number; label?: string }[] = [
        { row: i - 1, col: w, label: `Exclude: ${excludeVal}` }
      ];

      let canInclude = false;
      let includeVal = -1;

      if (w >= item.weight) {
        canInclude = true;
        includeVal = item.value + dp[i - 1][w - item.weight]!;
        candidates.push({
          choice: `Include Item ${i} (${item.name})`,
          expression: `${item.value} + dp[${i - 1}][${w - item.weight}] (${dp[i - 1][w - item.weight]}) = ${includeVal}`,
          value: includeVal,
          sourceCoords: { row: i - 1, col: w - item.weight }
        });
        dependencies.push({
          row: i - 1,
          col: w - item.weight,
          label: `Include: ${includeVal}`
        });
      }

      // 1. Dependency Read event
      events.push({
        step: ++step,
        type: 'DEPENDENCY_READ',
        title: `Inspecting dp[${i}][${w}] (Item ${i}: "${item.name}", wt=${item.weight}, val=${item.value})`,
        explanation: canInclude
          ? `Capacity ${w} >= item weight ${item.weight}. We can either exclude item ${i} or include it.`
          : `Capacity ${w} < item weight ${item.weight}. Item ${i} cannot fit in the bag, so we must exclude it.`,
        coords: { row: i, col: w },
        dependencies,
        candidates,
        codeLine: 4,
        tableSnapshot: snap(),
        variables: {
          item: item.name,
          weight: item.weight,
          value: item.value,
          currentCapacity: w
        }
      });

      // 2. Transition evaluate
      const optimalVal = Math.max(excludeVal, canInclude ? includeVal : -1);
      const chosenChoice =
        canInclude && includeVal > excludeVal
          ? `Include Item ${i}`
          : `Exclude Item ${i}`;

      events.push({
        step: ++step,
        type: 'TRANSITION_EVALUATE',
        title: `Optimal Choice for dp[${i}][${w}]: ${chosenChoice}`,
        explanation: canInclude
          ? `max(Exclude: ${excludeVal}, Include: ${includeVal}) = ${optimalVal}. Decision: ${chosenChoice}.`
          : `Must exclude: dp[${i-1}][${w}] = ${excludeVal}.`,
        coords: { row: i, col: w },
        dependencies,
        candidates,
        selectedValue: optimalVal,
        codeLine: 5,
        tableSnapshot: snap(),
        variables: { optimalVal, decision: chosenChoice }
      });

      // 3. Set cell
      dp[i][w] = optimalVal;
      events.push({
        step: ++step,
        type: 'CELL_SET',
        title: `dp[${i}][${w}] = ${optimalVal}`,
        explanation: `Cell (${i}, ${w}) permanently computed and stored.`,
        coords: { row: i, col: w },
        selectedValue: optimalVal,
        codeLine: 5,
        tableSnapshot: snap(),
        variables: { [`dp[${i}][${w}]`]: optimalVal }
      });
    }
  }

  // RECONSTRUCTION BACKTRACKING
  const reconstructedItems: KnapsackItem[] = [];
  const reconstructionPath: { row: number; col: number; itemIndex?: number; value: any }[] = [];

  let curI = n;
  let curW = capacity;

  events.push({
    step: ++step,
    type: 'RECONSTRUCTION_STEP',
    title: 'Begin Solution Reconstruction',
    explanation: `Starting from the optimal bottom-right cell dp[${n}][${capacity}] = ${dp[n][capacity]}, trace backwards to identify which items were taken.`,
    coords: { row: curI, col: curW },
    reconstructedPath: [...reconstructionPath],
    codeLine: 8,
    tableSnapshot: snap()
  });

  while (curI > 0 && curW > 0) {
    reconstructionPath.push({ row: curI, col: curW, value: dp[curI][curW] });
    const currentVal = dp[curI][curW]!;
    const valWithoutItem = dp[curI - 1][curW]!;
    const item = items[curI - 1];

    if (currentVal !== valWithoutItem) {
      // Item was taken
      reconstructedItems.push(item);
      events.push({
        step: ++step,
        type: 'RECONSTRUCTION_STEP',
        title: `Item ${curI} ("${item.name}") Was INCLUDED!`,
        explanation: `dp[${curI}][${curW}] (${currentVal}) != dp[${curI - 1}][${curW}] (${valWithoutItem}). This proves Item ${curI} was included in the optimal knapsack! Jump back to dp[${curI - 1}][${curW - item.weight}].`,
        coords: { row: curI - 1, col: curW - item.weight },
        dependencies: [{ row: curI, col: curW }],
        reconstructedPath: [...reconstructionPath],
        codeLine: 9,
        tableSnapshot: snap(),
        variables: { included: item.name, remainingCapacity: curW - item.weight }
      });
      curW -= item.weight;
      curI -= 1;
    } else {
      // Item was skipped
      events.push({
        step: ++step,
        type: 'RECONSTRUCTION_STEP',
        title: `Item ${curI} ("${item.name}") Was SKIPPED`,
        explanation: `dp[${curI}][${curW}] == dp[${curI - 1}][${curW}] (${currentVal}). The maximum value came directly from excluding item ${curI}. Move up to row ${curI - 1}.`,
        coords: { row: curI - 1, col: curW },
        dependencies: [{ row: curI, col: curW }],
        reconstructedPath: [...reconstructionPath],
        codeLine: 10,
        tableSnapshot: snap(),
        variables: { skipped: item.name, currentCapacity: curW }
      });
      curI -= 1;
    }
  }

  reconstructionPath.push({ row: curI, col: curW, value: dp[curI][curW] });

  events.push({
    step: ++step,
    type: 'COMPLETED',
    title: `Reconstruction Finished! Max Value = ${dp[n][capacity]}`,
    explanation: `Total Optimal Value: ${dp[n][capacity]}. Included Items: [${reconstructedItems.map(it => it.name).join(', ')}].`,
    coords: { row: n, col: capacity },
    selectedValue: dp[n][capacity],
    reconstructedPath: [...reconstructionPath],
    codeLine: 11,
    tableSnapshot: snap(),
    variables: {
      maxValue: dp[n][capacity],
      items: reconstructedItems.map(it => `${it.name} (v=${it.value}, w=${it.weight})`)
    }
  });

  return {
    events,
    reconstructedItems: reconstructedItems.reverse(),
    tableDimensions: { rows: n + 1, cols: capacity + 1 }
  };
}

