export type SlideType = 
  | 'intro'
  | 'problem'
  | 'intuition'
  | 'concepts'
  | 'math'
  | 'visual'
  | 'code'
  | 'mistakes'
  | 'practice'
  | 'summary';

export interface SlideContent {
  id: string;
  type: SlideType;
  title: string;
  badge?: string;
  subtitle: string;
  summaryTakeaway: string;
  
  // Concept details
  body: string[];
  realWorldAnalogy?: {
    icon: string;
    title: string;
    text: string;
  };
  
  // Mathematical representations
  mathLatex?: string[];
  mathDerivationSteps?: {
    step: string;
    latex: string;
    why: string;
  }[];

  // Visual/Interactive element config
  visualType?: 'fib-tree' | 'knapsack-grid' | 'lcs-match' | 'substructure-dag' | 'memo-vs-tab' | 'live-engine-link';
  targetProblemId?: string; // Links into actual DP execution engine!
  
  // Code Walkthrough
  codeSnippet?: {
    language: string;
    lines: string[];
    highlightLines?: number[];
    annotations?: { line: number; note: string }[];
    complexity: { time: string; space: string; explanation: string };
  };

  // Common Mistakes
  pitfall?: {
    mistakeTitle: string;
    badCode: string;
    failingInput: string;
    actualOutput: string;
    expectedOutput: string;
    fixExplanation: string;
  };

  // Interactive Question
  quiz?: {
    question: string;
    options: { id: string; label: string; isCorrect: boolean; explanation: string }[];
    hint: string;
  };

  // Summary / Key Takeaways
  bulletTakeaways?: string[];
}

export interface DPLesson {
  id: string;
  title: string;
  category: 'Fundamentals' | '1D DP' | '2D DP' | 'Strings';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  description: string;
  prerequisites: string[];
  learningOutcomes: string[];
  associatedProblemId?: string;
  slides: SlideContent[];
}

