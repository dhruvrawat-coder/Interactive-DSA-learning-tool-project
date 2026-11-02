export type EventType =
  | 'STEP_START'
  | 'FUNCTION_ENTER'
  | 'BASE_CASE_HIT'
  | 'MEMO_CHECK'
  | 'MEMO_HIT'
  | 'DEPENDENCY_READ'
  | 'TRANSITION_EVALUATE'
  | 'CELL_SET'
  | 'FUNCTION_RETURN'
  | 'RECONSTRUCTION_STEP'
  | 'COMPLETED';

export interface TransitionCandidate {
  choice: string;
  expression?: string;
  value: number;
  sourceCoords?: { row: number; col?: number };
}

export interface DPExecutionEvent {
  step: number;
  type: EventType;
  title: string;
  explanation: string;
  stateKey?: string; // e.g. "5" or "2,3"
  coords?: { row: number; col?: number };
  dependencies?: { row: number; col?: number; label?: string }[];
  candidates?: TransitionCandidate[];
  selectedValue?: number | string | boolean | null;
  codeLine: number; // 1-based index in pseudocode
  callStack?: string[];
  recursionDepth?: number;
  treeNodeId?: string;
  activeTreeNodes?: string[];
  tableSnapshot?: (number | string | null)[][]; // 2D snapshot representation
  memoSnapshot?: Record<string, any>;
  reconstructedPath?: { row: number; col?: number; itemIndex?: number; value?: any }[];
  variables?: Record<string, any>;
}

export interface DPProblemStateInfo {
  stateRepresentation: string;
  stateExplanation: string;
  subproblemVariables: {
    name: string;
    description: string;
    range: string;
  }[];
  baseCases: {
    condition: string;
    value: string;
    rationale: string;
  }[];
  recurrenceRelation: {
    formula: string;
    mathLatex?: string;
    explanation: string;
    cases: { condition: string; formula: string }[];
  };
  evaluationOrder: {
    description: string;
    rationale: string;
    loops: string[];
  };
  reconstructionStrategy?: {
    description: string;
    steps: string[];
  };
  complexity: {
    time: string;
    timeRationale: string;
    space: string;
    spaceRationale: string;
    optimizedSpace?: string;
    optimizedSpaceRationale?: string;
  };
}

export interface DPProblem {
  id: string;
  title: string;
  category: '1D DP' | '2D DP' | 'Grid DP' | 'Subsequence DP' | 'Knapsack DP' | 'Interval DP' | 'Advanced DP';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  summary: string;
  description: string;
  constraints: string[];
  stateInfo: DPProblemStateInfo;
  defaultInput: Record<string, any>;
  inputSchema: {
    key: string;
    label: string;
    type: 'number' | 'number[]' | 'string' | 'grid';
    description: string;
    min?: number;
    max?: number;
    default: any;
  }[];
  pseudocode: {
    memoization: string[];
    tabulation: string[];
    spaceOptimized?: string[];
  };
  codeImplementations: {
    python: string;
    cpp: string;
    java: string;
  };
  guidedQuestions: {
    id: string;
    stepNumber: number;
    question: string;
    options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
  }[];
}

export interface MistakeExample {
  id: string;
  problemId: string;
  title: string;
  category: 'State Definition' | 'Recurrence' | 'Base Case' | 'Iteration Order' | 'Space Optimization' | 'Off-by-One';
  buggyCode: string;
  language: 'python' | 'cpp';
  bugExplanation: string;
  counterExample: {
    input: any;
    expectedOutput: any;
    actualOutput: any;
  };
  fixExplanation: string;
}

