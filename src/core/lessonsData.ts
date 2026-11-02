import { DPLesson } from './lessonsTypes';

export const LESSONS_REGISTRY: DPLesson[] = [
  // 1. Introduction to Dynamic Programming
  {
    id: 'intro-to-dp',
    title: 'Introduction to Dynamic Programming',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    description: 'Learn the foundational philosophy of Dynamic Programming: how remembering past decisions turns intractable exponential problems into lightning-fast polynomial solutions.',
    prerequisites: ['Basic recursion', 'Big-O notation'],
    learningOutcomes: [
      'Understand why brute-force recursion fails on repetitive subproblems',
      'Learn the definition and etymology of "Dynamic Programming"',
      'Recognize the core difference between divide-and-conquer and dynamic programming',
      'Master the principle of remembering answers to avoid recomputation'
    ],
    slides: [
      {
        id: 's1',
        type: 'intro',
        title: 'The Art of Remembering What You Did',
        badge: 'Lesson 1.1 — Philosophy',
        subtitle: 'Why compute the exact same mathematical truth twice?',
        body: [
          'Dynamic Programming (DP) is primarily an optimization technique for algorithms.',
          'Whenever you break down a complex problem into smaller subproblems, and you notice those subproblems keep appearing over and over, you should never resolve them from scratch.',
          'Instead, compute their answer once, store it in memory, and look it up in O(1) time whenever it is needed again.'
        ],
        realWorldAnalogy: {
          icon: '📝',
          title: 'The Paper Scratchpad Analogy',
          text: 'If a teacher writes "1 + 1 + 1 + 1 + 1" on the blackboard and asks what it equals, you count up to 5. If they then add another "+ 1" to the end and ask again, you don\'t recount from 1. You remember the 5, add 1, and instantly say 6. That is Dynamic Programming.'
        },
        summaryTakeaway: 'DP = Smart Recursion + Memory (Caching answers so you never repeat work).'
      },
      {
        id: 's2',
        type: 'problem',
        title: 'Where Brute Force Breaks Down',
        badge: 'The Exponential Trap',
        subtitle: 'A simple example that freezes your computer',
        body: [
          'Consider finding the N-th term of the Fibonacci sequence: F(n) = F(n-1) + F(n-2).',
          'A naive recursive implementation branches into 2 calls for every level of depth.',
          'For N = 40, the function invokes over 2,000,000,000 (two billion) calls, taking minutes to run!',
          'Yet there are only 41 unique numbers between 0 and 40.'
        ],
        mathLatex: [
          'T(n) = T(n-1) + T(n-2) + O(1) \\implies O(2^n)'
        ],
        summaryTakeaway: 'Exponential time O(2^N) is catastrophic for N > 30. DP reduces this to O(N).'
      },
      {
        id: 's3',
        type: 'concepts',
        title: 'The Two Pillars of Dynamic Programming',
        badge: 'Diagnostic Checklist',
        subtitle: 'How to know if a problem can be solved with DP',
        body: [
          'To apply Dynamic Programming, an algorithmic challenge MUST satisfy two core properties:',
          '1. Overlapping Subproblems: The problem decomposes into smaller subproblems that are re-evaluated multiple times.',
          '2. Optimal Substructure: An optimal solution to the overall problem can be constructed directly from the optimal solutions to its subproblems.'
        ],
        bulletTakeaways: [
          'Divide & Conquer (e.g. MergeSort): Independent subproblems (no overlap).',
          'Dynamic Programming (e.g. Knapsack, LCS): Heavily overlapping subproblems.',
          'Greedy Algorithms: Makes a local best choice without looking backwards.'
        ],
        summaryTakeaway: 'If either of these two properties is missing, DP cannot guarantee a correct or optimal solution.'
      },
      {
        id: 's4',
        type: 'practice',
        title: 'Knowledge Check: Recognizing DP Suitability',
        badge: 'Interactive Checkpoint',
        subtitle: 'Test your intuition on when to use Dynamic Programming',
        body: [
          'Consider standard Merge Sort. It splits an array of size N into two halves of size N/2, sorts both, and merges them.'
        ],
        quiz: {
          question: 'Why is standard Merge Sort classified as Divide & Conquer rather than Dynamic Programming?',
          hint: 'Do the two halves share identical elements that need to be re-sorted multiple times?',
          options: [
            {
              id: 'a',
              label: 'The subproblems are completely disjoint and do not overlap',
              isCorrect: true,
              explanation: 'Spot on! The left half [0..N/2] and right half [N/2+1..N] share no elements. There are no duplicate subproblems to memoize.'
            },
            {
              id: 'b',
              label: 'Merge Sort does not have optimal substructure',
              isCorrect: false,
              explanation: 'Merge sort does have optimal substructure (sorted subarrays yield a sorted whole array).'
            },
            {
              id: 'c',
              label: 'Merge Sort takes O(N log N) which is already optimal',
              isCorrect: false,
              explanation: 'Runtime is a result, not the structural reason why DP is not used.'
            }
          ]
        },
        summaryTakeaway: 'Without overlapping subproblems, a cache table stores zero duplicate hits.'
      },
      {
        id: 's5',
        type: 'summary',
        title: 'Lesson Summary: Mental Model',
        badge: 'Key Takeaways',
        subtitle: 'The 3 questions you will ask on every problem',
        body: [
          'Throughout this handbook, whenever we encounter a new DP challenge, we will systematically resolve:',
          '1. What state variables describe our position? (e.g., indices, remaining capacity)',
          '2. What decision transition connects this state to previous states?',
          '3. What are the baseline boundary conditions where the recurrence stops?'
        ],
        bulletTakeaways: [
          'DP transforms exponential recursion trees into linear/polynomial Directed Acyclic Graphs.',
          'Top-down with memoization caches results on demand.',
          'Bottom-up with tabulation iteratively builds up from base cases.'
        ],
        summaryTakeaway: 'Next, let us dive deep into Pillar 1: Overlapping Subproblems.'
      }
    ]
  },

  // 2. Overlapping Subproblems
  {
    id: 'overlapping-subproblems',
    title: 'Pillar 1: Overlapping Subproblems',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    description: 'Explore recursive call trees visually. Witness how identical function arguments explode in naive recursion, and how memoization prunes duplicate trees in O(1) time.',
    prerequisites: ['Introduction to Dynamic Programming'],
    learningOutcomes: [
      'Learn how to draw and inspect a recursive call tree',
      'Identify redundant subtrees and compute the exact count of duplicated calls',
      'Understand how a memoization hash table or array prunes duplicate subtrees'
    ],
    associatedProblemId: 'fibonacci',
    slides: [
      {
        id: 'os1',
        type: 'intro',
        title: 'Visualizing The Redundant Explosion',
        badge: 'Visual Tree Theory',
        subtitle: 'Watch how quickly duplicate work multiplies',
        body: [
          'When we evaluate fib(5), what does the processor actually do?',
          'fib(5) calls fib(4) and fib(3).',
          'Then fib(4) calls fib(3) and fib(2).',
          'Notice that fib(3) is evaluated independently TWICE! And inside each fib(3), fib(2) and fib(1) are evaluated over again.'
        ],
        realWorldAnalogy: {
          icon: '🌳',
          title: 'The Branching Tree of Redundant Labor',
          text: 'Imagine baking a cake where step 5 requires 2 batches of icing, and each batch of icing asks you to milk a cow from scratch. A sensible baker milks the cow once and keeps the pitcher on the counter.'
        },
        summaryTakeaway: 'Redundant subproblems mean the processor solves identical inputs in total isolation.'
      },
      {
        id: 'os2',
        type: 'visual',
        title: 'Interactive Tree Inspector',
        badge: 'Live Call Tree',
        subtitle: 'Inspect duplicate nodes pruned by the execution engine',
        body: [
          'In DP Lab, the recursion tree explorer identifies duplicate calls in real time.',
          'Without memoization, red nodes indicate completely redundant computations.',
          'With memoization, the entire subtree below the duplicate call is pruned in O(1) time.'
        ],
        visualType: 'fib-tree',
        targetProblemId: 'fibonacci',
        summaryTakeaway: 'Pruning turns an exponential tree into a single linear chain of unique vertices.'
      },
      {
        id: 'os3',
        type: 'math',
        title: 'Mathematical Call Count Analysis',
        badge: 'Formal Asymptotics',
        subtitle: 'Exact number of function invocations',
        body: [
          'In naive Fibonacci recursion, the number of function calls S(n) required to compute F(n) is given by:',
          'S(n) = 1 + S(n-1) + S(n-2)',
          'This recurrence solves to S(n) = 2 * F(n+1) - 1. Since F(n) grows proportionally to the Golden Ratio φ^n ≈ (1.618)^n, the number of function calls is exponential!'
        ],
        mathLatex: [
          'S(n) = 2 \\cdot F_{n+1} - 1 = \\Theta\\left(\\left(\\frac{1 + \\sqrt{5}}{2}\\right)^n\\right)'
        ],
        summaryTakeaway: 'With memoization, S(n) becomes strictly 2N - 1 = O(N) calls.'
      },
      {
        id: 'os4',
        type: 'practice',
        title: 'Tree Analysis Challenge',
        badge: 'Checkpoint Question',
        subtitle: 'Count the duplicate calls in fib(4)',
        body: [
          'Draw or mentally trace the calls for fib(4):',
          'fib(4) -> [fib(3), fib(2)]',
          'fib(3) -> [fib(2), fib(1)]'
        ],
        quiz: {
          question: 'In naive unmemoized recursion of fib(4), how many times is fib(2) called in total?',
          hint: 'Trace both the left branch of fib(4) and the right branch of fib(4).',
          options: [
            {
              id: 'a',
              label: '2 times (once under fib(3), once directly under fib(4))',
              isCorrect: true,
              explanation: 'Correct! fib(4) directly calls fib(2), and fib(4) calls fib(3) which ALSO calls fib(2). That is 1 redundant subtree.'
            },
            {
              id: 'b',
              label: '1 time',
              isCorrect: false,
              explanation: 'Incorrect. fib(2) is visited along two separate branches.'
            },
            {
              id: 'c',
              label: '4 times',
              isCorrect: false,
              explanation: 'Too high for N = 4.'
            }
          ]
        },
        summaryTakeaway: 'As N grows from 4 to 30, duplicate evaluations grow from 2 times to millions of times.'
      }
    ]
  },

  // 3. Optimal Substructure
  {
    id: 'optimal-substructure',
    title: 'Pillar 2: Optimal Substructure',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    description: 'Master the principle of optimal substructure. Understand when greedy fails, why subproblem independence is required, and how Bellman\'s Principle of Optimality governs DP.',
    prerequisites: ['Pillar 1: Overlapping Subproblems'],
    learningOutcomes: [
      'Define Bellman\'s Principle of Optimality',
      'Understand why non-overlapping shortest paths have optimal substructure while longest paths generally do not',
      'Recognize subproblem independence'
    ],
    associatedProblemId: 'min-path-sum',
    slides: [
      {
        id: 'opt1',
        type: 'intro',
        title: 'Bellman\'s Principle of Optimality',
        badge: 'Theoretical Pillar',
        subtitle: 'Can you trust smaller solutions to construct the whole?',
        body: [
          'Formulated by Richard Bellman in the 1950s:',
          '"An optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision."',
          'In plain English: If the best route from City A to City C goes through City B, then the portion from City A to City B MUST be the best possible route between A and B.'
        ],
        realWorldAnalogy: {
          icon: '🗺️',
          title: 'The GPS Navigation Rule',
          text: 'If the fastest route from New York to Los Angeles passes through Chicago, the segment from New York to Chicago must also be the fastest route between New York and Chicago. If there were a faster route to Chicago, you would take it and reduce your total time to LA!'
        },
        summaryTakeaway: 'Optimal Substructure means: Global Optimum = Combination of Local Subproblem Optimums.'
      },
      {
        id: 'opt2',
        type: 'intuition',
        title: 'When Optimal Substructure FAILS',
        badge: 'Critical Counterexample',
        subtitle: 'Why Longest Simple Path cannot be solved with DP',
        body: [
          'Consider finding the Longest Simple Path (path without repeated vertices) in an arbitrary graph.',
          'Suppose the longest path from A to C goes through B: A -> B -> C.',
          'Is the sub-path from A to B necessarily the longest simple path between A and B?',
          'NO! Because the longest path from A to B might consume vertex C, leaving no way to continue to C without repeating a vertex.'
        ],
        bulletTakeaways: [
          'Subproblems must be INDEPENDENT.',
          'The decision chosen in one subproblem must not restrict available choices in another subproblem by consuming shared resources.'
        ],
        summaryTakeaway: 'Resource entanglement or cross-subproblem restrictions destroy optimal substructure.'
      },
      {
        id: 'opt3',
        type: 'visual',
        title: 'Grid Navigation: Guaranteed Optimal Substructure',
        badge: 'Concrete Application',
        subtitle: 'Minimum Path Sum on a matrix grid',
        body: [
          'In our Minimum Path Sum problem, you can only move Right or Down.',
          'To reach cell (r, c) with minimal cost, you must either step from (r-1, c) or (r, c-1).',
          'Since past steps do not restrict future moves, the minimum cost to reach (r, c) is strictly:',
          'min(dp[r-1][c], dp[r][c-1]) + cost[r][c]'
        ],
        mathLatex: [
          'dp[r][c] = \\text{cost}[r][c] + \\min\\big(dp[r-1][c],\\; dp[r][c-1]\\big)'
        ],
        summaryTakeaway: 'Subproblems have no hidden dependencies: pick the cheaper predecessor, add current cost.'
      }
    ]
  },

  // 4. Memoization (Top-Down)
  {
    id: 'memoization',
    title: 'Memoization (Top-Down Dynamic Programming)',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    estimatedMinutes: 9,
    description: 'Learn how to transform an existing recursive function into an optimized top-down DP solution by adding a cache lookup and return guard.',
    prerequisites: ['Overlapping Subproblems'],
    learningOutcomes: [
      'Master the 3-step mechanical recipe to memoize any recursion',
      'Understand call stack depth and memory overhead',
      'Learn on-demand state evaluation advantages'
    ],
    associatedProblemId: 'fibonacci',
    slides: [
      {
        id: 'mem1',
        type: 'intro',
        title: 'The 3-Step Recipe for Memoization',
        badge: 'Implementation Blueprint',
        subtitle: 'Turn any recursive function into Top-Down DP in 3 lines',
        body: [
          'Top-down dynamic programming takes your existing recursive formulation and wraps it with a lookup cache.',
          'Step 1: Check cache at the entry of the function. If present, return it immediately.',
          'Step 2: Evaluate base cases normally.',
          'Step 3: Before returning the computed value, save it in the cache!'
        ],
        realWorldAnalogy: {
          icon: '🗄️',
          title: 'The Receptionist Desk',
          text: 'Before the receptionist walks all the way to the archive warehouse (expensive recursion) to fetch a file, they check the small inbox on their desk (cache). If it is already there, they hand it to you in 1 second.'
        },
        summaryTakeaway: 'Memoization = Natural recursion + Lookup table.'
      },
      {
        id: 'mem2',
        type: 'code',
        title: 'Top-Down Python Implementation',
        badge: 'Code Walkthrough',
        subtitle: 'Compare plain recursion with memoized recursion',
        body: [
          'Notice how line 3 intercepts redundant calls in O(1) time.'
        ],
        codeSnippet: {
          language: 'python',
          lines: [
            'memo = {}',
            'def fib(n):',
            '    if n in memo: return memo[n]  # 1. Cache lookup guard',
            '    if n <= 1: return n           # 2. Base cases',
            '    memo[n] = fib(n - 1) + fib(n - 2) # 3. Cache store',
            '    return memo[n]'
          ],
          highlightLines: [3, 5],
          annotations: [
            { line: 3, note: 'Prunes entire redundant subtrees in O(1)' },
            { line: 5, note: 'Guarantees subproblem n is never evaluated again' }
          ],
          complexity: {
            time: 'O(N)',
            space: 'O(N) (Table + Call stack depth)',
            explanation: 'Every integer from 0 to N is evaluated once, taking O(1) addition each.'
          }
        },
        summaryTakeaway: 'Top-down keeps the intuitive problem structure while eliminating exponential explosion.'
      }
    ]
  },

  // 5. Tabulation (Bottom-Up)
  {
    id: 'tabulation',
    title: 'Tabulation (Bottom-Up Dynamic Programming)',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    estimatedMinutes: 9,
    description: 'Learn the bottom-up iterative approach. Understand topological ordering of subproblems, eliminating call stacks, and memory-reducing sliding windows.',
    prerequisites: ['Memoization'],
    learningOutcomes: [
      'Learn how to establish table dimensions and initialize base cases',
      'Determine loop boundaries in correct topological sort order',
      'Eliminate recursion stack frame overhead entirely',
      'Apply sliding-window space optimizations (O(N) -> O(1))'
    ],
    associatedProblemId: 'fibonacci',
    slides: [
      {
        id: 'tab1',
        type: 'intro',
        title: 'Iterating From The Ground Up',
        badge: 'Core Paradigm',
        subtitle: 'No call stack, no recursion, pure sequential calculation',
        body: [
          'While memoization starts at the top (F(N)) and asks "what do I need?", tabulation starts at the bottom base cases (F(0), F(1)) and builds upward.',
          'We allocate an array or matrix, seed it with the base cases, and loop sequentially.',
          'By the time the loop reaches index i, both i-1 and i-2 are guaranteed to be finished and sitting in memory.'
        ],
        realWorldAnalogy: {
          icon: '🧱',
          title: 'Laying Bricks From The Foundation',
          text: 'You don\'t build a roof in mid-air and reach down to lay walls. You lay the foundation first (base cases), then row 1, then row 2, building upward until the roof rests securely on top.'
        },
        summaryTakeaway: 'Tabulation = Iterative table filling in topological order.'
      },
      {
        id: 'tab2',
        type: 'code',
        title: 'Bottom-Up Tabulation Code',
        badge: 'Iterative Implementation',
        subtitle: 'Iterative table filling with loop invariants',
        body: [
          'Simple sequential loop: zero recursion overhead and optimal CPU cache locality.'
        ],
        codeSnippet: {
          language: 'python',
          lines: [
            'def fib_tabulation(n):',
            '    if n <= 1: return n',
            '    dp = [0] * (n + 1)',
            '    dp[0], dp[1] = 0, 1',
            '    for i in range(2, n + 1):',
            '        dp[i] = dp[i - 1] + dp[i - 2]',
            '    return dp[n]'
          ],
          highlightLines: [4, 5, 6],
          annotations: [
            { line: 4, note: 'Base cases populated before entering loop' },
            { line: 6, note: 'Strictly sequential: dependencies always resolved' }
          ],
          complexity: {
            time: 'O(N)',
            space: 'O(N) (Array size N+1)',
            explanation: 'Sequential iterations with zero stack frames.'
          }
        },
        summaryTakeaway: 'Tabulation avoids stack-overflow limits on large N.'
      },
      {
        id: 'tab3',
        type: 'math',
        title: 'State Reduction: O(N) -> O(1) Space',
        badge: 'Advanced Optimization',
        subtitle: 'The Sliding Window Memory Reduction',
        body: [
          'Look at the recurrence: dp[i] = dp[i-1] + dp[i-2].',
          'Notice that to compute dp[i], we NEVER reference dp[i-3] or any earlier term again!',
          'Why allocate an entire array of size N when we only need the last 2 variables?'
        ],
        mathLatex: [
          '\\text{Memory: } \\{dp[i-2],\\; dp[i-1]\\} \\to \\text{Keep 2 scalar variables: } \\text{prev2},\\; \\text{prev1}'
        ],
        summaryTakeaway: 'Whenever dependencies span a constant window, space can be reduced to O(1).'
      }
    ]
  },

  // 6. Fibonacci Sequence Deep Dive
  {
    id: 'fibonacci-deep-dive',
    title: 'Case Study: Fibonacci Sequence',
    category: '1D DP',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    description: 'The canonical 1D introductory DP problem. Connects conceptual theory directly to the DP Lab live execution visualizer.',
    prerequisites: ['Tabulation'],
    associatedProblemId: 'fibonacci',
    learningOutcomes: [
      'Connect formal state definitions to 1D table cells',
      'Step through base case initializations and dependency highlights',
      'Compare memory requirements across all 4 implementations'
    ],
    slides: [
      {
        id: 'fib1',
        type: 'visual',
        title: 'Interactive Fibonacci Table Execution',
        badge: 'Live Engine Connection',
        subtitle: 'Observe state evaluation directly in the DP Lab engine',
        body: [
          'Watch how cell dp[i] illuminates in orange, queries the two preceding cells (i-1 and i-2), and writes the computed sum into memory.',
          'You can step forward, step backward, or jump directly into the full hands-on visualizer.'
        ],
        visualType: 'live-engine-link',
        targetProblemId: 'fibonacci',
        summaryTakeaway: '1D DP represents a linear dependency graph where each state looks back a fixed distance.'
      }
    ]
  },

  // 7. 0/1 Knapsack Problem
  {
    id: 'knapsack-01-lesson',
    title: 'The 0/1 Knapsack Problem',
    category: '2D DP',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    description: 'The quintessential bounded decision problem. Learn why 2 state variables are required, master the Exclude vs Include recurrence, and trace solution reconstruction.',
    prerequisites: ['Tabulation'],
    associatedProblemId: 'knapsack-01',
    learningOutcomes: [
      'Understand why remaining capacity must be tracked as a state dimension',
      'Derive the binary choice: Exclude item vs Include item',
      'Master backwards backtracking to reconstruct which items were packed',
      'Understand why 1D space optimization MUST loop in reverse'
    ],
    slides: [
      {
        id: 'kn1',
        type: 'intro',
        title: 'The Burglar\'s Dilemma',
        badge: 'Bounded Resource Optimization',
        subtitle: 'Maximizing value under a strict weight constraint',
        body: [
          'You have a backpack with maximum weight capacity W.',
          'There are N distinct items available. Each item has a weight and a value.',
          'You cannot split items (0/1: you either take it whole or leave it).',
          'Goal: Pack a subset of items that maximizes total value without exceeding capacity W.'
        ],
        realWorldAnalogy: {
          icon: '🎒',
          title: 'Packing a Hiking Backpack',
          text: 'If your backpack can only hold 15 kg, do you pack a 10 kg cast-iron skillet (value: low) or a 2 kg sleeping bag and 3 kg water filter (value: high)? Every heavy item you take robs capacity from other combinations.'
        },
        summaryTakeaway: 'Greedy ratio (value/weight) fails because item indivisibility creates capacity gaps.'
      },
      {
        id: 'kn2',
        type: 'math',
        title: 'State Formulation & Recurrence Derivation',
        badge: 'Mathematical Derivation',
        subtitle: 'Why we need dp[i][w]',
        body: [
          'To make a valid decision for Item i, we must know:',
          '1. Which items are already decided? (Item prefix index i)',
          '2. How much capacity is still available in the bag? (Remaining capacity w)'
        ],
        mathDerivationSteps: [
          {
            step: 'State Definition',
            latex: 'dp[i][w] = \\text{max value considering items } 1..i \\text{ with bag capacity } w',
            why: 'Tracks both item subset progress and resource constraint.'
          },
          {
            step: 'Choice 1: Exclude Item i',
            latex: 'dp[i-1][w]',
            why: 'Item i is skipped; capacity w remains unchanged.'
          },
          {
            step: 'Choice 2: Include Item i (if w >= wt[i])',
            latex: 'v_i + dp[i-1][w - w_i]',
            why: 'Gain item value, but consume w_i capacity from the previous subproblem.'
          },
          {
            step: 'Combined Recurrence',
            latex: 'dp[i][w] = \\max\\big(dp[i-1][w],\\; v_i + dp[i-1][w - w_i]\\big)',
            why: 'Dynamic Programming chooses the strictly better of the two candidate decisions.'
          }
        ],
        summaryTakeaway: 'The state needs 2 dimensions: one for item choices, one for remaining capacity.'
      },
      {
        id: 'kn3',
        type: 'visual',
        title: 'Live 2D Knapsack Execution',
        badge: 'Hands-on Engine',
        subtitle: 'Interactive 2D table traversal & solution backtracking',
        body: [
          'Observe the 2D matrix filling row-by-row.',
          'Notice how including an item jumps diagonally up and to the left: (i-1, w - wt).',
          'Once the final cell dp[N][W] is reached, watch the reconstruction trace backwards to highlight which items were taken.'
        ],
        visualType: 'live-engine-link',
        targetProblemId: 'knapsack-01',
        summaryTakeaway: 'Backtracking compares dp[i][w] with dp[i-1][w] to deduce if item i was included.'
      },
      {
        id: 'kn4',
        type: 'mistakes',
        title: 'The Canonical Knapsack Bug',
        badge: 'Common Pitfall',
        subtitle: 'Forward vs Backward loop in 1D space optimization',
        body: [
          'When optimizing 2D knapsack to a 1D array dp[w], you MUST loop capacity w in REVERSE (from W down to wt).'
        ],
        pitfall: {
          mistakeTitle: 'Forward Loop in 1D Space-Optimized Knapsack',
          badCode: 'for w in range(wt, W + 1):  # BUG: Forward!\n    dp[w] = max(dp[w], val + dp[w - wt])',
          failingInput: 'Item: wt=3, val=10, Capacity: 9',
          actualOutput: '30 (Item packed 3 times!)',
          expectedOutput: '10 (Item can only be packed once in 0/1 knapsack)',
          fixExplanation: 'Iterate backwards: for w in range(W, wt - 1, -1). This ensures dp[w - wt] comes from the previous row instead of the current row.'
        },
        summaryTakeaway: 'Forward loop = Unbounded Knapsack (infinite duplicates). Reverse loop = 0/1 Knapsack.'
      }
    ]
  },

  // 8. Longest Common Subsequence
  {
    id: 'lcs-lesson',
    title: 'Longest Common Subsequence (LCS)',
    category: 'Strings',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    description: 'The foundation of diff utilities (git diff) and DNA bioinformatics sequence alignment. Master 2D string matching and diagonal transitions.',
    prerequisites: ['Tabulation'],
    associatedProblemId: 'lcs',
    learningOutcomes: [
      'Distinguish subsequence (non-contiguous) from substring (contiguous)',
      'Derive the character match diagonal transition (+1 from top-left)',
      'Derive the mismatch bifurcation: max(top, left)',
      'Trace back characters to print the actual LCS string'
    ],
    slides: [
      {
        id: 'lcs1',
        type: 'intro',
        title: 'Finding Shared Patterns in Strings',
        badge: 'Sequence Alignment',
        subtitle: 'How git diff and DNA matching work under the hood',
        body: [
          'Given two strings s1 and s2, find the longest subsequence common to both.',
          'A subsequence does not need to be contiguous, but characters must appear in the same relative order.',
          'Example: "ABCDE" and "ACE" -> LCS is "ACE" with length 3.'
        ],
        realWorldAnalogy: {
          icon: '🧬',
          title: 'DNA Sequencing & Git Diff',
          text: 'When git diff compares two versions of code, it uses LCS to detect which lines were preserved, which were deleted, and which were added. Bioinformatics uses LCS to detect evolutionary genetic mutations.'
        },
        summaryTakeaway: 'LCS measures structural similarity across two sequences.'
      },
      {
        id: 'lcs2',
        type: 'math',
        title: 'LCS Recurrence Relation',
        badge: 'Recurrence Logic',
        subtitle: 'Character match vs Character mismatch',
        body: [
          'Let dp[i][j] be the LCS length for prefixes s1[0..i-1] and s2[0..j-1].'
        ],
        mathDerivationSteps: [
          {
            step: 'Case 1: Characters Match (s1[i-1] == s2[j-1])',
            latex: 'dp[i][j] = 1 + dp[i-1][j-1]',
            why: 'Both characters match, consuming 1 character from both strings (diagonal jump).'
          },
          {
            step: 'Case 2: Characters Mismatch (s1[i-1] != s2[j-1])',
            latex: 'dp[i][j] = \\max\\big(dp[i-1][j],\\; dp[i][j-1]\\big)',
            why: 'Characters differ: best answer comes from either dropping s1[i-1] (top) or s2[j-1] (left).'
          }
        ],
        summaryTakeaway: 'Matches increment the diagonal predecessor; mismatches propagate the maximum of top and left.'
      },
      {
        id: 'lcs3',
        type: 'visual',
        title: 'Interactive LCS Matrix & String Reconstruction',
        badge: 'Live Engine Connection',
        subtitle: 'Step through character matching & string backtracking',
        body: [
          'Watch the matrix highlight diagonal matches when characters coincide, and compare top vs left on mismatches.',
          'During solution reconstruction, diagonal arrows collect the letters of the common subsequence in reverse.'
        ],
        visualType: 'live-engine-link',
        targetProblemId: 'lcs',
        summaryTakeaway: 'Reconstruction extracts the exact matched characters by following diagonal steps.'
      }
    ]
  }
];

