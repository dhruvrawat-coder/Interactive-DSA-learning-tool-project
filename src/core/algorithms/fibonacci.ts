import { DPExecutionEvent, TransitionCandidate } from '../types';

export interface TreeAlgorithmResult {
  events: DPExecutionEvent[];
  treeNodes: {
    id: string;
    parentId: string | null;
    args: string;
    depth: number;
    value?: number | null;
    isDuplicate?: boolean;
    isMemoHit?: boolean;
  }[];
  stats: {
    totalCalls: number;
    uniqueStates: number;
    memoHits: number;
    redundantCallsEliminated: number;
    maxDepth: number;
  };
}

/**
 * 1. FIBONACCI TABULATION
 */
export function generateFibonacciTabulationEvents(n: number): DPExecutionEvent[] {
  const events: DPExecutionEvent[] = [];
  let step = 0;

  // Initialize table
  const dp: (number | null)[] = new Array(n + 1).fill(null);
  const snap = () => [([...dp] as (number | null)[])];

  events.push({
    step: ++step,
    type: 'STEP_START',
    title: 'Initialize DP Array',
    explanation: `Create an array dp of size ${n + 1} with nulls to store Fibonacci values from F(0) up to F(${n}).`,
    codeLine: 1,
    tableSnapshot: snap(),
    variables: { n, dp: [...dp] }
  });

  // Base case 0
  dp[0] = 0;
  events.push({
    step: ++step,
    type: 'BASE_CASE_HIT',
    title: 'Base Case: F(0) = 0',
    explanation: 'By definition, the 0-th Fibonacci number is 0. Set dp[0] = 0.',
    coords: { row: 0, col: 0 },
    selectedValue: 0,
    codeLine: 2,
    tableSnapshot: snap(),
    variables: { 'dp[0]': 0 }
  });

  if (n >= 1) {
    dp[1] = 1;
    events.push({
      step: ++step,
      type: 'BASE_CASE_HIT',
      title: 'Base Case: F(1) = 1',
      explanation: 'By definition, the 1st Fibonacci number is 1. Set dp[1] = 1.',
      coords: { row: 0, col: 1 },
      selectedValue: 1,
      codeLine: 3,
      tableSnapshot: snap(),
      variables: { 'dp[0]': 0, 'dp[1]': 1 }
    });
  }

  // Iterative transitions
  for (let i = 2; i <= n; i++) {
    // Read dependencies
    events.push({
      step: ++step,
      type: 'DEPENDENCY_READ',
      title: `Evaluating state dp[${i}]`,
      explanation: `To compute dp[${i}], we look up the two preceding subproblems: dp[${i - 1}] and dp[${i - 2}].`,
      coords: { row: 0, col: i },
      dependencies: [
        { row: 0, col: i - 1, label: `dp[${i - 1}]=${dp[i - 1]}` },
        { row: 0, col: i - 2, label: `dp[${i - 2}]=${dp[i - 2]}` }
      ],
      codeLine: 5,
      tableSnapshot: snap(),
      variables: { i, 'dp[i-1]': dp[i - 1], 'dp[i-2]': dp[i - 2] }
    });

    const val1 = dp[i - 1]!;
    const val2 = dp[i - 2]!;
    const sum = val1 + val2;

    const candidates: TransitionCandidate[] = [
      { choice: `dp[${i-1}] + dp[${i-2}]`, expression: `${val1} + ${val2}`, value: sum, sourceCoords: { row: 0, col: i - 1 } }
    ];

    events.push({
      step: ++step,
      type: 'TRANSITION_EVALUATE',
      title: `Compute dp[${i}] = dp[${i-1}] + dp[${i-2}]`,
      explanation: `Add the values from the subproblems: ${val1} + ${val2} = ${sum}.`,
      coords: { row: 0, col: i },
      dependencies: [
        { row: 0, col: i - 1 },
        { row: 0, col: i - 2 }
      ],
      candidates,
      selectedValue: sum,
      codeLine: 6,
      tableSnapshot: snap(),
      variables: { i, sum }
    });

    dp[i] = sum;
    events.push({
      step: ++step,
      type: 'CELL_SET',
      title: `Store dp[${i}] = ${sum}`,
      explanation: `State dp[${i}] is now permanently solved and stored in memory.`,
      coords: { row: 0, col: i },
      selectedValue: sum,
      codeLine: 6,
      tableSnapshot: snap(),
      variables: { [`dp[${i}]`]: sum }
    });
  }

  events.push({
    step: ++step,
    type: 'COMPLETED',
    title: `Computation Complete: F(${n}) = ${dp[n]}`,
    explanation: `The final answer dp[${n}] = ${dp[n]} is retrieved in O(1) time after filling the table.`,
    coords: { row: 0, col: n },
    selectedValue: dp[n],
    codeLine: 7,
    tableSnapshot: snap(),
    variables: { result: dp[n] }
  });

  return events;
}

/**
 * 2. FIBONACCI RECURSION TREE & MEMOIZATION GENERATOR
 */
export function generateFibonacciTreeEvents(n: number, withMemo: boolean): TreeAlgorithmResult {
  const events: DPExecutionEvent[] = [];
  let step = 0;
  const treeNodes: TreeAlgorithmResult['treeNodes'] = [];
  const memo: Record<number, number> = {};
  const seenStates = new Set<number>();
  let totalCalls = 0;
  let memoHits = 0;
  let maxDepth = 0;

  function recurse(val: number, parentId: string | null, depth: number): number {
    totalCalls++;
    if (depth > maxDepth) maxDepth = depth;
    const nodeId = `node_${totalCalls}_fib_${val}`;
    const isDuplicate = seenStates.has(val);
    seenStates.add(val);

    treeNodes.push({
      id: nodeId,
      parentId,
      args: `fib(${val})`,
      depth,
      value: null,
      isDuplicate: isDuplicate && !withMemo,
      isMemoHit: withMemo && memo[val] !== undefined
    });

    events.push({
      step: ++step,
      type: 'FUNCTION_ENTER',
      title: `Call fib(${val})`,
      explanation: `Invoke fib(${val}) at recursion depth ${depth}.`,
      treeNodeId: nodeId,
      recursionDepth: depth,
      codeLine: 1,
      variables: { val, depth, memoSnapshot: { ...memo } }
    });

    // Check Memoization
    if (withMemo && memo[val] !== undefined) {
      memoHits++;
      const cached = memo[val];
      const node = treeNodes.find(n => n.id === nodeId);
      if (node) node.value = cached;

      events.push({
        step: ++step,
        type: 'MEMO_HIT',
        title: `Cache Hit: fib(${val}) = ${cached}`,
        explanation: `Subproblem fib(${val}) was previously computed! Returning cached value ${cached} in O(1), pruning this entire subtree.`,
        treeNodeId: nodeId,
        selectedValue: cached,
        codeLine: 3,
        variables: { val, cached, memoHits }
      });
      return cached;
    }

    // Base cases
    if (val === 0 || val === 1) {
      const res = val;
      if (withMemo) memo[val] = res;
      const node = treeNodes.find(n => n.id === nodeId);
      if (node) node.value = res;

      events.push({
        step: ++step,
        type: 'BASE_CASE_HIT',
        title: `Base case fib(${val}) = ${res}`,
        explanation: `Terminal condition reached. fib(${val}) returns ${res}.`,
        treeNodeId: nodeId,
        selectedValue: res,
        codeLine: 4,
        variables: { val, res }
      });
      return res;
    }

    // Recursive calls
    events.push({
      step: ++step,
      type: 'DEPENDENCY_READ',
      title: `Branching fib(${val}) -> fib(${val - 1}) + fib(${val - 2})`,
      explanation: `To solve fib(${val}), we branch into subproblems fib(${val - 1}) and fib(${val - 2}).`,
      treeNodeId: nodeId,
      codeLine: 6,
      variables: { val }
    });

    const left = recurse(val - 1, nodeId, depth + 1);
    const right = recurse(val - 2, nodeId, depth + 1);
    const sum = left + right;

    if (withMemo) {
      memo[val] = sum;
    }

    const node = treeNodes.find(n => n.id === nodeId);
    if (node) node.value = sum;

    events.push({
      step: ++step,
      type: 'FUNCTION_RETURN',
      title: `Return fib(${val}) = ${sum}`,
      explanation: `Subtree evaluation finished: fib(${val - 1}) [${left}] + fib(${val - 2}) [${right}] = ${sum}.`,
      treeNodeId: nodeId,
      selectedValue: sum,
      codeLine: 7,
      variables: { val, left, right, sum, memoSnapshot: { ...memo } }
    });

    return sum;
  }

  recurse(n, null, 0);

  return {
    events,
    treeNodes,
    stats: {
      totalCalls,
      uniqueStates: seenStates.size,
      memoHits,
      redundantCallsEliminated: withMemo ? (1 << (Math.min(n, 12))) - totalCalls : 0,
      maxDepth
    }
  };
}

