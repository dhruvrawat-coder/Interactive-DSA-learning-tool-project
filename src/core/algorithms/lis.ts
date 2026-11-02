import { DPExecutionEvent, TransitionCandidate } from '../types';

export interface LISResult {
  events: DPExecutionEvent[];
  lisSequence: number[];
  length: number;
}

/**
 * LONGEST INCREASING SUBSEQUENCE (LIS) O(N^2) TABULATION & RECONSTRUCTION
 *
 * State Definition:
 * dp[i] = length of the longest increasing subsequence ending strictly at index i.
 *
 * Recurrence:
 * dp[i] = 1 + max({ dp[j] for j in 0..i-1 where nums[j] < nums[i] } U { 0 })
 */
export function generateLISEvents(nums: number[]): LISResult {
  const events: DPExecutionEvent[] = [];
  let step = 0;
  const n = nums.length;

  if (n === 0) {
    return { events: [], lisSequence: [], length: 0 };
  }

  // dp[i] stores LIS length ending at nums[i]
  const dp: (number | null)[] = new Array(n).fill(null);
  const parent: number[] = new Array(n).fill(-1);

  const snap = () => [([...dp] as (number | null)[])];

  // Step 1: Initialize table
  events.push({
    step: ++step,
    type: 'STEP_START',
    title: 'Initialize LIS DP Array',
    explanation: `Create 1D array dp of length ${n}. Each dp[i] represents the length of the longest increasing subsequence that ends strictly at nums[i].`,
    codeLine: 1,
    tableSnapshot: snap(),
    variables: { nums: [...nums], dp: [...dp] }
  });

  // Base Case for index 0
  dp[0] = 1;
  events.push({
    step: ++step,
    type: 'BASE_CASE_HIT',
    title: `Base Case: dp[0] = 1 (Element: ${nums[0]})`,
    explanation: `A subsequence of a single element nums[0]=${nums[0]} has length 1. Set dp[0] = 1.`,
    coords: { row: 0, col: 0 },
    selectedValue: 1,
    codeLine: 2,
    tableSnapshot: snap(),
    variables: { 'dp[0]': 1, 'nums[0]': nums[0] }
  });

  // Evaluate transitions for i from 1 to n-1
  for (let i = 1; i < n; i++) {
    dp[i] = 1; // every element is an increasing subsequence of length 1 by itself
    const candidates: TransitionCandidate[] = [
      {
        choice: `Self alone [${nums[i]}]`,
        expression: '1',
        value: 1
      }
    ];
    const dependencies: { row: number; col?: number; label?: string }[] = [];

    // Scan all j < i
    for (let j = 0; j < i; j++) {
      dependencies.push({
        row: 0,
        col: j,
        label: `nums[${j}]=${nums[j]}, dp=${dp[j]}`
      });

      if (nums[j] < nums[i]) {
        const candidateVal = dp[j]! + 1;
        candidates.push({
          choice: `Extend from nums[${j}]=${nums[j]}`,
          expression: `1 + dp[${j}] (${dp[j]}) = ${candidateVal}`,
          value: candidateVal,
          sourceCoords: { row: 0, col: j }
        });
      }
    }

    events.push({
      step: ++step,
      type: 'DEPENDENCY_READ',
      title: `Evaluating LIS ending at index ${i} (nums[${i}] = ${nums[i]})`,
      explanation: `Compare nums[${i}] with all preceding elements nums[0..${i - 1}]. Any preceding element smaller than ${nums[i]} can be extended.`,
      coords: { row: 0, col: i },
      dependencies,
      candidates,
      codeLine: 4,
      tableSnapshot: snap(),
      variables: { i, 'nums[i]': nums[i], candidateCount: candidates.length }
    });

    let bestVal = 1;
    let bestJ = -1;

    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j]! + 1 > bestVal) {
        bestVal = dp[j]! + 1;
        bestJ = j;
      }
    }

    dp[i] = bestVal;
    parent[i] = bestJ;

    events.push({
      step: ++step,
      type: 'TRANSITION_EVALUATE',
      title: `Optimal Transition for dp[${i}] = ${bestVal}`,
      explanation: bestJ !== -1
        ? `nums[${i}] (${nums[i]}) extends previous subsequence at index ${bestJ} (nums[${bestJ}]=${nums[bestJ]}). Max length = 1 + dp[${bestJ}] = ${bestVal}.`
        : `nums[${i}] (${nums[i]}) is not greater than any valid preceding subsequence. Standalone length = 1.`,
      coords: { row: 0, col: i },
      dependencies: bestJ !== -1 ? [{ row: 0, col: bestJ, label: `Best Predecessor` }] : [],
      candidates,
      selectedValue: bestVal,
      codeLine: 5,
      tableSnapshot: snap(),
      variables: { i, 'dp[i]': bestVal, predecessorIndex: bestJ }
    });

    events.push({
      step: ++step,
      type: 'CELL_SET',
      title: `Store dp[${i}] = ${bestVal}`,
      explanation: `State dp[${i}] is permanently saved.`,
      coords: { row: 0, col: i },
      selectedValue: bestVal,
      codeLine: 6,
      tableSnapshot: snap(),
      variables: { [`dp[${i}]`]: bestVal }
    });
  }

  // Find overall maximum in dp array
  let maxLen = 0;
  let maxIdx = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i]! > maxLen) {
      maxLen = dp[i]!;
      maxIdx = i;
    }
  }

  // RECONSTRUCTION
  const reconstructionPath: { row: number; col?: number; value: any }[] = [];
  const lisSequence: number[] = [];
  let curr: number = maxIdx;

  events.push({
    step: ++step,
    type: 'RECONSTRUCTION_STEP',
    title: 'Begin LIS Solution Reconstruction',
    explanation: `The maximum LIS length in the entire table is ${maxLen} ending at index ${maxIdx} (value ${nums[maxIdx]}). Backtrack predecessors via parent pointers.`,
    coords: { row: 0, col: curr },
    reconstructedPath: [...reconstructionPath],
    codeLine: 8,
    tableSnapshot: snap()
  });

  while (curr !== -1) {
    reconstructionPath.push({ row: 0, col: curr, value: dp[curr] });
    lisSequence.push(nums[curr]);

    const prev = parent[curr];
    if (prev !== -1) {
      events.push({
        step: ++step,
        type: 'RECONSTRUCTION_STEP',
        title: `Backtrack to nums[${prev}] = ${nums[prev]}`,
        explanation: `Element nums[${curr}]=${nums[curr]} (dp=${dp[curr]}) was extended from predecessor nums[${prev}]=${nums[prev]} (dp=${dp[prev]}).`,
        coords: { row: 0, col: prev },
        dependencies: [{ row: 0, col: curr }],
        reconstructedPath: [...reconstructionPath],
        codeLine: 9,
        tableSnapshot: snap(),
        variables: { currentElement: nums[curr], predecessorElement: nums[prev] }
      });
    }
    curr = prev;
  }

  const finalSeq = lisSequence.reverse();

  events.push({
    step: ++step,
    type: 'COMPLETED',
    title: `LIS Complete! Max Length = ${maxLen}`,
    explanation: `Longest Increasing Subsequence: [${finalSeq.join(', ')}] with total length ${maxLen}.`,
    coords: { row: 0, col: maxIdx },
    selectedValue: maxLen,
    reconstructedPath: [...reconstructionPath],
    codeLine: 10,
    tableSnapshot: snap(),
    variables: { maxLISLength: maxLen, reconstructedSequence: finalSeq }
  });

  return {
    events,
    lisSequence: finalSeq,
    length: maxLen
  };
}

