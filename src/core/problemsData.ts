import { DPProblem, MistakeExample } from './types';

export const PROBLEMS_REGISTRY: DPProblem[] = [
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    category: '1D DP',
    difficulty: 'Easy',
    summary: 'The classic foundation of DP. Demonstrates overlapping subproblems and state reduction from O(N) to O(1) space.',
    description: 'The Fibonacci numbers are defined by the recurrence F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n >= 2. Given n, compute F(n).',
    constraints: ['0 <= n <= 30 (for visualization demo)'],
    defaultInput: { n: 6 },
    inputSchema: [
      {
        key: 'n',
        label: 'N (Index)',
        type: 'number',
        description: 'The index in the Fibonacci sequence to compute.',
        min: 0,
        max: 15,
        default: 6
      }
    ],
    stateInfo: {
      stateRepresentation: 'dp[i]',
      stateExplanation: 'dp[i] stores the i-th Fibonacci number F(i). Once computed, F(i) is never re-calculated.',
      subproblemVariables: [
        {
          name: 'i',
          description: 'Current term index in the sequence.',
          range: '0 <= i <= n'
        }
      ],
      baseCases: [
        {
          condition: 'i = 0',
          value: '0',
          rationale: 'By definition, F(0) = 0.'
        },
        {
          condition: 'i = 1',
          value: '1',
          rationale: 'By definition, F(1) = 1.'
        }
      ],
      recurrenceRelation: {
        formula: 'dp[i] = dp[i-1] + dp[i-2]',
        explanation: 'Each state depends strictly on the sum of the two preceding states.',
        cases: [
          { condition: 'i == 0', formula: '0' },
          { condition: 'i == 1', formula: '1' },
          { condition: 'i >= 2', formula: 'dp[i-1] + dp[i-2]' }
        ]
      },
      evaluationOrder: {
        description: 'Left-to-right (ascending order from i = 2 to n).',
        rationale: 'Computing dp[i] requires dp[i-1] and dp[i-2] to be evaluated beforehand (topological order).',
        loops: ['for i in range(2, n + 1):']
      },
      complexity: {
        time: 'O(N)',
        timeRationale: 'There are N states and each state takes O(1) addition operation.',
        space: 'O(N)',
        spaceRationale: 'Array of size N+1 to store each subproblem answer.',
        optimizedSpace: 'O(1)',
        optimizedSpaceRationale: 'Notice dp[i] only needs dp[i-1] and dp[i-2]. We can keep just two variables: prev2 and prev1!'
      }
    },
    pseudocode: {
      tabulation: [
        'def fib(n):',
        '    if n == 0: return 0',
        '    dp = [0] * (n + 1)',
        '    dp[0] = 0; dp[1] = 1',
        '    for i in range(2, n + 1):',
        '        dp[i] = dp[i-1] + dp[i-2]',
        '    return dp[n]'
      ],
      memoization: [
        'memo = {}',
        'def fib(n):',
        '    if n in memo: return memo[n]',
        '    if n <= 1: return n',
        '    memo[n] = fib(n - 1) + fib(n - 2)',
        '    return memo[n]'
      ],
      spaceOptimized: [
        'def fib(n):',
        '    if n <= 1: return n',
        '    prev2, prev1 = 0, 1',
        '    for i in range(2, n + 1):',
        '        cur = prev1 + prev2',
        '        prev2, prev1 = prev1, cur',
        '    return prev1'
      ]
    },
    codeImplementations: {
      python: `def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
      cpp: `int fibonacci(int n) {
    if (n <= 1) return n;
    std::vector<int> dp(n + 1);
    dp[1] = 1;
    for (int i = 2; i <= n; ++i) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}`,
      java: `public int fibonacci(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}`
    },
    guidedQuestions: [
      {
        id: 'q1',
        stepNumber: 4,
        question: 'What is the minimum state required to identify a subproblem for Fibonacci?',
        options: [
          { id: 'a', text: 'dp[i]: the value of the i-th Fibonacci number', isCorrect: true, explanation: 'Correct! The single integer i completely determines the subproblem.' },
          { id: 'b', text: 'dp[i][j]: two indices', isCorrect: false, explanation: 'Incorrect. There is no secondary constraint or variable.' },
          { id: 'c', text: 'dp[sum]: the target sum', isCorrect: false, explanation: 'Incorrect. We are not finding combinations that sum to a target.' }
        ]
      },
      {
        id: 'q2',
        stepNumber: 7,
        question: 'Why can we optimize space complexity from O(N) to O(1)?',
        options: [
          { id: 'a', text: 'Because each step only depends on the previous 2 terms', isCorrect: true, explanation: 'Spot on! Once dp[i] is computed, dp[i-2] is never needed again.' },
          { id: 'b', text: 'Because we can use binary search', isCorrect: false, explanation: 'Binary search does not apply to generating standard Fibonacci numbers.' },
          { id: 'c', text: 'Because Fibonacci grows exponentially', isCorrect: false, explanation: 'Exponential growth is unrelated to sliding window memory reduction.' }
        ]
      }
    ]
  },
  {
    id: 'knapsack-01',
    title: '0/1 Knapsack Problem',
    category: 'Knapsack DP',
    difficulty: 'Medium',
    summary: 'The quintessential bounded decision problem: either pick an item or skip it under weight constraints.',
    description: 'Given items with weights and values, and a maximum knapsack capacity W, determine the maximum value you can achieve without exceeding capacity. Each item can be picked at most once.',
    constraints: ['1 <= N <= 10 (for visual demo)', '1 <= W <= 15 (for visual demo)', 'Weights and values are positive integers'],
    defaultInput: {
      items: [
        { id: 1, name: 'Gem', weight: 2, value: 3 },
        { id: 2, name: 'Gold', weight: 3, value: 4 },
        { id: 3, name: 'Crown', weight: 4, value: 5 },
        { id: 4, name: 'Chest', weight: 5, value: 8 }
      ],
      capacity: 7
    },
    inputSchema: [
      {
        key: 'capacity',
        label: 'Knapsack Capacity (W)',
        type: 'number',
        description: 'Maximum weight capacity of the knapsack.',
        min: 1,
        max: 12,
        default: 7
      }
    ],
    stateInfo: {
      stateRepresentation: 'dp[i][w]',
      stateExplanation: 'dp[i][w] is the maximum value that can be obtained using a subset of the first i items with a remaining weight capacity of w.',
      subproblemVariables: [
        {
          name: 'i',
          description: 'Prefix of items considered (from item 1 up to item i).',
          range: '0 <= i <= N'
        },
        {
          name: 'w',
          description: 'Available weight capacity in the knapsack.',
          range: '0 <= w <= W'
        }
      ],
      baseCases: [
        {
          condition: 'dp[0][w] = 0',
          value: '0',
          rationale: 'If we have 0 items to choose from, total value is 0.'
        },
        {
          condition: 'dp[i][0] = 0',
          value: '0',
          rationale: 'If available bag capacity is 0, we cannot pack any items of positive weight.'
        }
      ],
      recurrenceRelation: {
        formula: 'dp[i][w] = max(dp[i-1][w], value[i-1] + dp[i-1][w - weight[i-1]])',
        explanation: 'For item i: we can either exclude it (take dp[i-1][w]), or if w >= weight[i], include it (item value + dp[i-1][w-weight[i]]).',
        cases: [
          { condition: 'weight[i-1] > w', formula: 'dp[i-1][w] (Must skip item)' },
          { condition: 'weight[i-1] <= w', formula: 'max(dp[i-1][w], value[i-1] + dp[i-1][w - weight[i-1]])' }
        ]
      },
      evaluationOrder: {
        description: 'Row by row from top to bottom (i = 1 to N), and capacity from left to right (w = 1 to W).',
        rationale: 'Each cell in row i only depends on cells in the preceding row (i - 1).',
        loops: ['for i from 1 to N:', '    for w from 1 to W:']
      },
      reconstructionStrategy: {
        description: 'Trace back from dp[N][W]. If dp[i][w] != dp[i-1][w], item i was included! Decrement w by item weight and i by 1; else decrement i by 1.',
        steps: [
          'Start at i = N, w = W',
          'Compare dp[i][w] with dp[i-1][w]',
          'If different: mark item i as chosen, set w = w - weight[i], i = i - 1',
          'If same: item i was skipped, set i = i - 1',
          'Repeat until i = 0 or w = 0'
        ]
      },
      complexity: {
        time: 'O(N * W)',
        timeRationale: 'There are (N + 1) * (W + 1) states, and each state evaluates in O(1) time.',
        space: 'O(N * W)',
        spaceRationale: 'The 2D matrix stores (N + 1) * (W + 1) entries.',
        optimizedSpace: 'O(W)',
        optimizedSpaceRationale: 'Notice row i only looks at row i - 1. We can reduce to a 1D array of size W+1 by iterating w BACKWARDS from W down to weight[i]!'
      }
    },
    pseudocode: {
      tabulation: [
        'dp = [[0] * (W + 1) for _ in range(N + 1)]',
        'for i in range(1, N + 1):',
        '    wt, val = items[i - 1].weight, items[i - 1].value',
        '    for w in range(1, W + 1):',
        '        dp[i][w] = dp[i - 1][w] # Exclude',
        '        if w >= wt:',
        '            dp[i][w] = max(dp[i][w], val + dp[i - 1][w - wt]) # Include',
        'return dp[N][W]'
      ],
      memoization: [
        '@lru_cache(None)',
        'def knap(i, w):',
        '    if i == 0 or w == 0: return 0',
        '    wt, val = items[i - 1].weight, items[i - 1].value',
        '    res = knap(i - 1, w) # skip',
        '    if w >= wt: res = max(res, val + knap(i - 1, w - wt))',
        '    return res'
      ],
      spaceOptimized: [
        'dp = [0] * (W + 1)',
        'for item in items:',
        '    # Note: Iterate backwards to prevent using the same item multiple times!',
        '    for w in range(W, item.weight - 1, -1):',
        '        dp[w] = max(dp[w], item.value + dp[w - item.weight])',
        'return dp[W]'
      ]
    },
    codeImplementations: {
      python: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            dp[i][w] = dp[i-1][w]
            if w >= weights[i-1]:
                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w - weights[i-1]])
    return dp[n][capacity]`,
      cpp: `int knapsack(const vector<int>& wt, const vector<int>& val, int W) {
    int n = wt.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; ++i) {
        for (int w = 1; w <= W; ++w) {
            dp[i][w] = dp[i-1][w];
            if (w >= wt[i-1]) {
                dp[i][w] = max(dp[i][w], val[i-1] + dp[i-1][w - wt[i-1]]);
            }
        }
    }
    return dp[n][W];
}`,
      java: `public int knapsack(int[] wt, int[] val, int W) {
    int n = wt.length;
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];
            if (w >= wt[i - 1]) {
                dp[i][w] = Math.max(dp[i][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
            }
        }
    }
    return dp[n][W];
}`
    },
    guidedQuestions: [
      {
        id: 'q_knap_1',
        stepNumber: 4,
        question: 'Why do we need TWO variables (i and w) to define the state of 0/1 Knapsack?',
        options: [
          { id: 'a', text: 'Because our remaining capacity changes AND each item can only be picked once', isCorrect: true, explanation: 'Exactly right. Capacity w tracks bag space, while i tracks which items are already decided.' },
          { id: 'b', text: 'Because the matrix has two dimensions', isCorrect: false, explanation: 'Circular reasoning. The state requires 2 variables because of problem constraints.' },
          { id: 'c', text: 'Only to print the answer', isCorrect: false, explanation: 'Incorrect.' }
        ]
      },
      {
        id: 'q_knap_2',
        stepNumber: 7,
        question: 'When optimizing 0/1 Knapsack space to a 1D array dp[w], why MUST we iterate w in REVERSE (W down to wt)?',
        options: [
          { id: 'a', text: 'To avoid using values from the current row (which would mean picking the same item twice)', isCorrect: true, explanation: 'Brilliant! If we iterated forward, dp[w - wt] would already have been updated by item i, accidentally turning it into Unbounded Knapsack.' },
          { id: 'b', text: 'Because backward loops are faster in CPU cache', isCorrect: false, explanation: 'False. Forward sequential memory traversal is actually more cache friendly.' },
          { id: 'c', text: 'To avoid negative index errors', isCorrect: false, explanation: 'Boundary checks handle negative indices, not loop reversal.' }
        ]
      }
    ]
  },
  {
    id: 'lcs',
    title: 'Longest Common Subsequence (LCS)',
    category: 'Subsequence DP',
    difficulty: 'Medium',
    summary: 'The gold standard for string matching, diff algorithms (git diff), and bioinformatics DNA alignment.',
    description: 'Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence does not have to be contiguous.',
    constraints: ['1 <= text1.length, text2.length <= 10 (for visual demo)'],
    defaultInput: {
      text1: 'ABCBDAB',
      text2: 'BDCABA'
    },
    inputSchema: [
      {
        key: 'text1',
        label: 'String 1',
        type: 'string',
        description: 'First string sequence.',
        default: 'ABCBDAB'
      },
      {
        key: 'text2',
        label: 'String 2',
        type: 'string',
        description: 'Second string sequence.',
        default: 'BDCABA'
      }
    ],
    stateInfo: {
      stateRepresentation: 'dp[i][j]',
      stateExplanation: 'dp[i][j] stores the length of the Longest Common Subsequence between the prefix text1[0..i-1] and text2[0..j-1].',
      subproblemVariables: [
        { name: 'i', description: 'Prefix length of string 1 considered.', range: '0 <= i <= m' },
        { name: 'j', description: 'Prefix length of string 2 considered.', range: '0 <= j <= n' }
      ],
      baseCases: [
        {
          condition: 'dp[0][j] = 0 and dp[i][0] = 0',
          value: '0',
          rationale: 'An empty string shares no subsequence with any other string.'
        }
      ],
      recurrenceRelation: {
        formula: 'If text1[i-1] == text2[j-1]: 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1])',
        explanation: 'If the characters match, they can safely be part of the LCS (+1 from diagonal). If they do not match, we take the best answer from dropping either character.',
        cases: [
          { condition: 'text1[i-1] == text2[j-1]', formula: '1 + dp[i-1][j-1]' },
          { condition: 'text1[i-1] != text2[j-1]', formula: 'max(dp[i-1][j], dp[i][j-1])' }
        ]
      },
      evaluationOrder: {
        description: 'Standard row-major order: outer loop i from 1 to m, inner loop j from 1 to n.',
        rationale: 'To compute (i, j), we only need (i-1, j-1), (i-1, j), and (i, j-1), which are already solved.',
        loops: ['for i in range(1, m + 1):', '    for j in range(1, n + 1):']
      },
      reconstructionStrategy: {
        description: 'Start from (m, n). If characters match, add character to result and move diagonally (i-1, j-1). Else move towards the neighbor with larger value.',
        steps: [
          'If text1[i-1] == text2[j-1]: append text1[i-1], i--, j--',
          'Else if dp[i-1][j] >= dp[i][j-1]: i--',
          'Else: j--',
          'Reverse the collected characters at the end.'
        ]
      },
      complexity: {
        time: 'O(M * N)',
        timeRationale: 'M * N matrix entries, each calculated in O(1) time.',
        space: 'O(M * N)',
        spaceRationale: 'Table of size (M+1) * (N+1).',
        optimizedSpace: 'O(min(M, N))',
        optimizedSpaceRationale: 'Only the previous and current row are required if we only need the length.'
      }
    },
    pseudocode: {
      tabulation: [
        'dp = [[0] * (n + 1) for _ in range(m + 1)]',
        'for i in range(1, m + 1):',
        '    for j in range(1, n + 1):',
        '        if text1[i - 1] == text2[j - 1]:',
        '            dp[i][j] = 1 + dp[i - 1][j - 1]',
        '        else:',
        '            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])',
        'return dp[m][n]'
      ],
      memoization: [
        '@lru_cache(None)',
        'def lcs(i, j):',
        '    if i == 0 or j == 0: return 0',
        '    if text1[i - 1] == text2[j - 1]:',
        '        return 1 + lcs(i - 1, j - 1)',
        '    return max(lcs(i - 1, j), lcs(i, j - 1))'
      ]
    },
    codeImplementations: {
      python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = 1 + dp[i-1][j-1]
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
      cpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (text1[i-1] == text2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
      java: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`
    },
    guidedQuestions: [
      {
        id: 'q_lcs_1',
        stepNumber: 6,
        question: 'When text1[i-1] == text2[j-1], why do we add 1 to dp[i-1][j-1] rather than max(dp[i-1][j], dp[i][j-1])?',
        options: [
          { id: 'a', text: 'Because both characters are matched, so neither character can be matched again in this subproblem', isCorrect: true, explanation: 'Correct! Matching characters consume one character from both strings simultaneously.' },
          { id: 'b', text: 'Because diagonal moves are always prioritized', isCorrect: false, explanation: 'Only when the characters match.' },
          { id: 'c', text: 'To avoid double counting', isCorrect: false, explanation: 'Imprecise.' }
        ]
      }
    ]
  },
  {
    id: 'min-path-sum',
    title: 'Minimum Path Sum',
    category: 'Grid DP',
    difficulty: 'Medium',
    summary: 'Find the minimum cost path traversing a grid from top-left to bottom-right moving only right or down.',
    description: 'Given an m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.',
    constraints: ['1 <= m, n <= 6 (for visual demo)', 'grid[i][j] >= 0'],
    defaultInput: {
      grid: [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1]
      ]
    },
    inputSchema: [
      {
        key: 'grid',
        label: 'Grid (2D Array)',
        type: 'grid',
        description: 'Input numerical matrix.',
        default: [
          [1, 3, 1],
          [1, 5, 1],
          [4, 2, 1]
        ]
      }
    ],
    stateInfo: {
      stateRepresentation: 'dp[r][c]',
      stateExplanation: 'dp[r][c] represents the minimum path cost to travel from (0,0) to cell (r,c).',
      subproblemVariables: [
        { name: 'r', description: 'Row coordinate in the grid.', range: '0 <= r < m' },
        { name: 'c', description: 'Column coordinate in the grid.', range: '0 <= c < n' }
      ],
      baseCases: [
        {
          condition: 'dp[0][0] = grid[0][0]',
          value: 'grid[0][0]',
          rationale: 'Starting cell cost.'
        },
        {
          condition: 'First row (r=0) and First col (c=0)',
          value: 'Prefix sums',
          rationale: 'Cells on the top border can only be reached from the left; cells on the left border can only be reached from above.'
        }
      ],
      recurrenceRelation: {
        formula: 'dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])',
        explanation: 'To reach (r,c), you either stepped Down from (r-1,c) or Right from (r,c-1). Pick the cheaper route and pay cell (r,c) cost.',
        cases: [
          { condition: 'r == 0 and c == 0', formula: 'grid[0][0]' },
          { condition: 'r == 0', formula: 'dp[0][c-1] + grid[0][c]' },
          { condition: 'c == 0', formula: 'dp[r-1][0] + grid[r][0]' },
          { condition: 'r > 0 and c > 0', formula: 'grid[r][c] + min(dp[r-1][c], dp[r][c-1])' }
        ]
      },
      evaluationOrder: {
        description: 'Row-by-row, column-by-column.',
        rationale: 'Cell (r, c) needs (r-1, c) and (r, c-1).',
        loops: ['for r in range(m):', '    for c in range(n):']
      },
      reconstructionStrategy: {
        description: 'From (m-1, n-1), trace backwards by moving to whichever adjacent neighbor (Top or Left) has the strictly smaller dp value.',
        steps: [
          'Start at target cell (m-1, n-1)',
          'Look at Top cell (r-1, c) and Left cell (r, c-1)',
          'Step into min(Top, Left)',
          'Terminate when (0, 0) is reached'
        ]
      },
      complexity: {
        time: 'O(M * N)',
        timeRationale: 'Every cell in the matrix is evaluated once in O(1).',
        space: 'O(M * N)',
        spaceRationale: 'DP matrix of identical size M x N.',
        optimizedSpace: 'O(N)',
        optimizedSpaceRationale: 'Can be done in-place or with 1 row of size N.'
      }
    },
    pseudocode: {
      tabulation: [
        'dp = [[0] * n for _ in range(m)]',
        'dp[0][0] = grid[0][0]',
        'for c in range(1, n): dp[0][c] = dp[0][c-1] + grid[0][c]',
        'for r in range(1, m): dp[r][0] = dp[r-1][0] + grid[r][0]',
        'for r in range(1, m):',
        '    for c in range(1, n):',
        '        dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])',
        'return dp[m-1][n-1]'
      ],
      memoization: [
        '@lru_cache(None)',
        'def solve(r, c):',
        '    if r == 0 and c == 0: return grid[0][0]',
        '    if r < 0 or c < 0: return float("inf")',
        '    return grid[r][c] + min(solve(r - 1, c), solve(r, c - 1))'
      ]
    },
    codeImplementations: {
      python: `def minPathSum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for c in range(1, n): dp[0][c] = dp[0][c-1] + grid[0][c]
    for r in range(1, m): dp[r][0] = dp[r-1][0] + grid[r][0]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])
    return dp[m-1][n-1]`,
      cpp: `int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 0));
    dp[0][0] = grid[0][0];
    for (int c = 1; c < n; ++c) dp[0][c] = dp[0][c-1] + grid[0][c];
    for (int r = 1; r < m; ++r) dp[r][0] = dp[r-1][0] + grid[r][0];
    for (int r = 1; r < m; ++r)
        for (int c = 1; c < n; ++c)
            dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]);
    return dp[m-1][n-1];
}`,
      java: `public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    dp[0][0] = grid[0][0];
    for (int c = 1; c < n; c++) dp[0][c] = dp[0][c - 1] + grid[0][c];
    for (int r = 1; r < m; r++) dp[r][0] = dp[r - 1][0] + grid[r][0];
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++)
            dp[r][c] = grid[r][c] + Math.min(dp[r - 1][c], dp[r][c - 1]);
    return dp[m - 1][n - 1];
}`
    },
    guidedQuestions: [
      {
        id: 'q_grid_1',
        stepNumber: 5,
        question: 'Why do cells on row 0 and column 0 only have one dependency instead of two?',
        options: [
          { id: 'a', text: 'Because you are restricted to moving only Right and Down, so border cells have only 1 valid predecessor', isCorrect: true, explanation: 'Correct! You cannot step into row 0 from above (no row -1) or column 0 from the left (no col -1).' },
          { id: 'b', text: 'Because border values are zero', isCorrect: false, explanation: 'Border values are determined by grid costs.' },
          { id: 'c', text: 'To save loop iterations', isCorrect: false, explanation: 'It is a topological property of the movement grid.' }
        ]
      }
    ]
  },
  {
    id: 'lis',
    title: 'Longest Increasing Subsequence (LIS)',
    category: 'Subsequence DP',
    difficulty: 'Medium',
    summary: 'The standard O(N^2) dynamic programming sequence formulation with predecessor pointer backtracking reconstruction.',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence, and reconstruct the sequence itself.',
    constraints: ['1 <= nums.length <= 12 (for visual demo)', '-100 <= nums[i] <= 100'],
    defaultInput: {
      nums: [10, 9, 2, 5, 3, 7, 101, 18]
    },
    inputSchema: [
      {
        key: 'nums',
        label: 'Array (nums)',
        type: 'number[]',
        description: 'Sequence of integers.',
        default: [10, 9, 2, 5, 3, 7, 101, 18]
      }
    ],
    stateInfo: {
      stateRepresentation: 'dp[i]',
      stateExplanation: 'dp[i] represents the length of the longest strictly increasing subsequence that ends strictly at index i (incorporating nums[i]).',
      subproblemVariables: [
        { name: 'i', description: 'Index of the element where the increasing subsequence must end.', range: '0 <= i < n' }
      ],
      baseCases: [
        {
          condition: 'dp[0] = 1',
          value: '1',
          rationale: 'A single element subsequence of nums[0] always has length 1.'
        }
      ],
      recurrenceRelation: {
        formula: 'dp[i] = 1 + max({ dp[j] for j < i where nums[j] < nums[i] } U { 0 })',
        explanation: 'nums[i] can extend any valid increasing subsequence ending at j < i as long as nums[j] < nums[i]. We choose the predecessor j that maximizes 1 + dp[j].',
        cases: [
          { condition: 'No j < i has nums[j] < nums[i]', formula: '1' },
          { condition: 'Exists j < i with nums[j] < nums[i]', formula: '1 + max(dp[j])' }
        ]
      },
      evaluationOrder: {
        description: 'Outer loop i from 1 to n-1, inner loop j from 0 to i-1.',
        rationale: 'To compute dp[i], all preceding indices dp[0..i-1] must be completely solved.',
        loops: ['for i in range(1, n):', '    for j in range(0, i):']
      },
      reconstructionStrategy: {
        description: 'Find max index m where dp[m] is maximized. Follow parent pointers backwards: parent[i] stores the index j that gave the optimal 1 + dp[j].',
        steps: [
          'Find index m with maximum dp[m]',
          'Append nums[m] to sequence',
          'Jump to m = parent[m]',
          'Repeat until parent[m] == -1',
          'Reverse the collected elements'
        ]
      },
      complexity: {
        time: 'O(N^2)',
        timeRationale: 'N states, each state scans up to N predecessors: N * (N - 1) / 2 transitions = O(N^2).',
        space: 'O(N)',
        spaceRationale: 'Array of size N to store dp values and parent pointers.',
        optimizedSpace: 'O(N) with O(N log N) time',
        optimizedSpaceRationale: 'Patience sorting / binary search can achieve O(N log N) time, but table DP O(N^2) is required for full state visibility and arbitrary DAG generalizations.'
      }
    },
    pseudocode: {
      tabulation: [
        'def lengthOfLIS(nums):',
        '    n = len(nums)',
        '    dp = [1] * n',
        '    parent = [-1] * n',
        '    for i in range(1, n):',
        '        for j in range(0, i):',
        '            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:',
        '                dp[i] = dp[j] + 1; parent[i] = j',
        '    return max(dp)'
      ],
      memoization: [
        '@lru_cache(None)',
        'def lis_ending_at(i):',
        '    ans = 1',
        '    for j in range(0, i):',
        '        if nums[j] < nums[i]:',
        '            ans = max(ans, 1 + lis_ending_at(j))',
        '    return ans'
      ]
    },
    codeImplementations: {
      python: `def lengthOfLIS(nums: list[int]) -> int:
    if not nums: return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`,
      cpp: `int lengthOfLIS(vector<int>& nums) {
    if (nums.empty()) return 0;
    int n = nums.size();
    vector<int> dp(n, 1);
    int ans = 1;
    for (int i = 1; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);
        }
        ans = max(ans, dp[i]);
    }
    return ans;
}`,
      java: `public int lengthOfLIS(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    int[] dp = new int[nums.length];
    Arrays.fill(dp, 1);
    int max = 1;
    for (int i = 1; i < nums.length; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        max = Math.max(max, dp[i]);
    }
    return max;
}`
    },
    guidedQuestions: [
      {
        id: 'q_lis_1',
        stepNumber: 4,
        question: 'Why does dp[i] represent the LIS ending strictly at index i, rather than the LIS of prefix nums[0..i]?',
        options: [
          { id: 'a', text: 'Because we need to know the ending value nums[i] to determine if a future number nums[k] can extend it', isCorrect: true, explanation: 'Correct! An increasing subsequence constraint requires knowing the last element to test if nums[k] > nums[i].' },
          { id: 'b', text: 'Because prefixes cannot be indexed', isCorrect: false, explanation: 'Prefixes can be indexed, but they lose the endpoint value information.' },
          { id: 'c', text: 'To save loop iterations', isCorrect: false, explanation: 'It is a state sufficiency requirement, not a loop micro-optimization.' }
        ]
      }
    ]
  }
];

export const MISTAKE_EXAMPLES: MistakeExample[] = [
  {
    id: 'mistake-knapsack-iteration-order',
    problemId: 'knapsack-01',
    title: 'Forward Iteration in Space-Optimized 1D 0/1 Knapsack',
    category: 'Iteration Order',
    language: 'python',
    buggyCode: `def knapsack_buggy(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        # BUG: Iterating w forward from wt to W
        for w in range(wt, W + 1):
            dp[w] = max(dp[w], val + dp[w - wt])
    return dp[W]`,
    bugExplanation: 'Iterating capacity w forward causes an item to be selected multiple times! In the same item iteration, dp[w - wt] might have ALREADY included the current item, transforming 0/1 Knapsack into Unbounded Knapsack.',
    counterExample: {
      input: 'Weights: [3], Values: [10], Capacity: 9',
      expectedOutput: '10 (Item can only be taken once)',
      actualOutput: '30 (Item was mistakenly taken 3 times!)'
    },
    fixExplanation: 'Iterate w backwards: "for w in range(W, wt - 1, -1):". This guarantees dp[w - wt] represents the subproblem solution from the PREVIOUS item, ensuring each item is used at most once.'
  },
  {
    id: 'mistake-fib-missing-memo',
    problemId: 'fibonacci',
    title: 'Forgetting to Return Cached Value in Memoization',
    category: 'State Definition',
    language: 'python',
    buggyCode: `memo = {}
def fib_buggy(n):
    # BUG: Calculated subproblem is saved but never checked on entry!
    if n <= 1:
        return n
    res = fib_buggy(n - 1) + fib_buggy(n - 2)
    memo[n] = res
    return res`,
    bugExplanation: 'Even though memo[n] is being populated, the function fails to check "if n in memo: return memo[n]" at the beginning! The recursion still visits all 2^N subproblems.',
    counterExample: {
      input: 'n = 35',
      expectedOutput: 'Runs in < 1 millisecond with O(N) complexity',
      actualOutput: 'Takes 10+ seconds and freezes the execution thread with 2^35 recursive calls!'
    },
    fixExplanation: 'Add the guard clause at the very top of the function: "if n in memo: return memo[n]".'
  },
  {
    id: 'mistake-lcs-off-by-one',
    problemId: 'lcs',
    title: 'Off-By-One Matrix Indexing in LCS',
    category: 'Off-by-One',
    language: 'python',
    buggyCode: `def lcs_buggy(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * n for _ in range(m)] # BUG: allocated size m x n instead of (m+1) x (n+1)
    for i in range(m):
        for j in range(n):
            if text1[i] == text2[j]:
                dp[i][j] = 1 + dp[i-1][j-1] # BUG: i-1 and j-1 wrap to negative index!
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m-1][n-1]`,
    bugExplanation: 'Without the +1 dimension for the empty string base case (row 0 and col 0), accessing dp[i-1][j-1] when i=0 wraps around in Python to dp[-1][-1] (the bottom-right cell), causing garbage answers or index out of bound errors in C++/Java.',
    counterExample: {
      input: 'text1="A", text2="B"',
      expectedOutput: '0',
      actualOutput: 'Erroneously accesses dp[-1] or causes IndexError'
    },
    fixExplanation: 'Allocate size (m + 1) x (n + 1), initialize row 0 and col 0 with 0 as base cases, and let 1-based index i match character text1[i-1].'
  },
  {
    id: 'mistake-coin-change-init',
    problemId: 'knapsack-01',
    title: 'Zero Initialization in Minimization Recurrence (Coin Change)',
    category: 'Base Case',
    language: 'python',
    buggyCode: `def coinChange_buggy(coins, amount):
    # BUG: initialized with 0 instead of infinity!
    dp = [0] * (amount + 1)
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                # min(0, ...) always returns 0!
                dp[i] = min(dp[i], 1 + dp[i - coin])
    return dp[amount]`,
    bugExplanation: 'When computing a minimum, initializing unvisited subproblem states to 0 guarantees that min(dp[i], candidate) will ALWAYS evaluate to 0, corrupting all transitions.',
    counterExample: {
      input: 'coins=[1, 2, 5], amount=11',
      expectedOutput: '3 (5 + 5 + 1)',
      actualOutput: '0 (Zero poisoned all min comparisons)'
    },
    fixExplanation: 'Initialize table entries with float("inf") or amount + 1, and set only base case dp[0] = 0.'
  },
  {
    id: 'mistake-lis-global-state',
    problemId: 'lis',
    title: 'Returning dp[-1] Instead of max(dp) in LIS',
    category: 'Recurrence',
    language: 'python',
    buggyCode: `def lengthOfLIS_buggy(nums):
    if not nums: return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    # BUG: Returning the last element's cell instead of the global maximum!
    return dp[-1]`,
    bugExplanation: 'dp[i] represents the LIS ending STRICTLY at nums[i]. The longest subsequence in the entire array may terminate at an earlier index if the last element is very small.',
    counterExample: {
      input: 'nums = [10, 20, 30, 1]',
      expectedOutput: '3 (Subsequence [10, 20, 30])',
      actualOutput: '1 (dp[-1] is 1 because nums[-1]=1)'
    },
    fixExplanation: 'Return max(dp) across the entire table or track the running maximum during table evaluation.'
  }
];

