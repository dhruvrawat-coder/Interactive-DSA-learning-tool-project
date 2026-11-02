import { create } from 'zustand';
import { DPProblem, DPExecutionEvent, MistakeExample } from './types';
import { PROBLEMS_REGISTRY, MISTAKE_EXAMPLES } from './problemsData';
import { generateFibonacciTabulationEvents, generateFibonacciTreeEvents, TreeAlgorithmResult } from './algorithms/fibonacci';
import { generateKnapsackEvents, KnapsackResult } from './algorithms/knapsack';
import { generateLCSEvents, LCSResult } from './algorithms/lcs';
import { generateMinPathSumEvents, GridDPResult } from './algorithms/minPathSum';
import { generateLISEvents, LISResult } from './algorithms/lis';

export type ActiveTab = 'table' | 'tree' | 'reconstruction' | 'compare' | 'quiz' | 'mistakes';
export type AppView = 'workspace' | 'dashboard' | 'handbook' | 'comparator' | 'mistakes' | 'practice' | 'benchmark' | 'lessons';
export type ThemeMode = 'dark' | 'light';

interface DPStore {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedLessonId: string;
  setSelectedLessonId: (id: string) => void;
  activeSlideIndex: number;
  setActiveSlideIndex: (idx: number) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  activeVisualTab: ActiveTab;
  setActiveVisualTab: (tab: ActiveTab) => void;
  selectedLanguage: 'python' | 'cpp' | 'java';
  setSelectedLanguage: (lang: 'python' | 'cpp' | 'java') => void;

  // Problem State
  selectedProblemId: string;
  selectProblem: (problemId: string) => void;
  currentInput: Record<string, any>;
  updateInput: (key: string, value: any) => void;
  resetInputToDefault: () => void;

  // Execution & Playback State
  events: DPExecutionEvent[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // 0.5x, 1x, 2x, etc.
  treeData: TreeAlgorithmResult | null;
  knapsackData: KnapsackResult | null;
  lcsData: LCSResult | null;
  gridData: GridDPResult | null;
  lisData: LISResult | null;

  // Step-by-Step Pedagogy Guide
  activePedagogyStep: number; // 1 to 10
  setActivePedagogyStep: (step: number) => void;
  quizAnswers: Record<string, string>; // questionId -> selectedOptionId
  setQuizAnswer: (questionId: string, optionId: string) => void;

  // Selected Mistake for Debugger
  selectedMistakeId: string;
  setSelectedMistakeId: (id: string) => void;

  // Controls
  runSimulation: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStep: (step: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const useDPStore = create<DPStore>((set, get) => ({
  currentView: 'workspace',
  setCurrentView: (view) => set({ currentView: view }),
  selectedLessonId: 'intro-to-dp',
  setSelectedLessonId: (id) => set({ selectedLessonId: id, activeSlideIndex: 0 }),
  activeSlideIndex: 0,
  setActiveSlideIndex: (idx) => set({ activeSlideIndex: idx }),
  theme: 'dark',
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      if (next === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
    set({ theme: next });
  },
  activeVisualTab: 'table',
  setActiveVisualTab: (tab) => set({ activeVisualTab: tab }),
  selectedLanguage: 'python',
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),

  selectedProblemId: 'fibonacci',
  currentInput: { n: 6 },
  activePedagogyStep: 1,
  setActivePedagogyStep: (step) => set({ activePedagogyStep: step }),
  quizAnswers: {},
  setQuizAnswer: (questionId, optionId) =>
    set((state) => ({ quizAnswers: { ...state.quizAnswers, [questionId]: optionId } })),

  selectedMistakeId: 'mistake-knapsack-iteration-order',
  setSelectedMistakeId: (id) => set({ selectedMistakeId: id }),

  events: [],
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  treeData: null,
  knapsackData: null,
  lcsData: null,
  gridData: null,
  lisData: null,

  selectProblem: (problemId: string) => {
    const prob = PROBLEMS_REGISTRY.find((p) => p.id === problemId);
    if (!prob) return;
    set({
      selectedProblemId: problemId,
      currentInput: { ...prob.defaultInput },
      currentStepIndex: 0,
      isPlaying: false,
      activePedagogyStep: 1
    });
    get().runSimulation();
  },

  updateInput: (key: string, value: any) => {
    set((state) => ({
      currentInput: { ...state.currentInput, [key]: value },
      isPlaying: false
    }));
    get().runSimulation();
  },

  resetInputToDefault: () => {
    const prob = PROBLEMS_REGISTRY.find((p) => p.id === get().selectedProblemId);
    if (!prob) return;
    set({ currentInput: { ...prob.defaultInput }, isPlaying: false });
    get().runSimulation();
  },

  runSimulation: () => {
    const { selectedProblemId, currentInput } = get();

    if (selectedProblemId === 'fibonacci') {
      const n = Math.max(0, Math.min(15, Number(currentInput.n ?? 6)));
      const tabEvents = generateFibonacciTabulationEvents(n);
      const tree = generateFibonacciTreeEvents(Math.min(n, 7), true); // tree bounded for visual clarity
      set({
        events: tabEvents,
        currentStepIndex: 0,
        treeData: tree,
        knapsackData: null,
        lcsData: null,
        gridData: null
      });
    } else if (selectedProblemId === 'knapsack-01') {
      const items = currentInput.items || [
        { id: 1, name: 'Gem', weight: 2, value: 3 },
        { id: 2, name: 'Gold', weight: 3, value: 4 },
        { id: 3, name: 'Crown', weight: 4, value: 5 },
        { id: 4, name: 'Chest', weight: 5, value: 8 }
      ];
      const cap = Math.max(1, Math.min(15, Number(currentInput.capacity ?? 7)));
      const res = generateKnapsackEvents(items, cap);
      set({
        events: res.events,
        currentStepIndex: 0,
        knapsackData: res,
        treeData: null,
        lcsData: null,
        gridData: null
      });
    } else if (selectedProblemId === 'lcs') {
      const t1 = String(currentInput.text1 ?? 'ABCBDAB');
      const t2 = String(currentInput.text2 ?? 'BDCABA');
      const res = generateLCSEvents(t1, t2);
      set({
        events: res.events,
        currentStepIndex: 0,
        lcsData: res,
        treeData: null,
        knapsackData: null,
        gridData: null
      });
    } else if (selectedProblemId === 'min-path-sum') {
      const grid = currentInput.grid ?? [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1]
      ];
      const res = generateMinPathSumEvents(grid);
      set({
        events: res.events,
        currentStepIndex: 0,
        gridData: res,
        treeData: null,
        knapsackData: null,
        lcsData: null,
        lisData: null
      });
    } else if (selectedProblemId === 'lis') {
      const nums = currentInput.nums || [10, 9, 2, 5, 3, 7, 101, 18];
      const res = generateLISEvents(nums);
      set({
        events: res.events,
        currentStepIndex: 0,
        lisData: res,
        treeData: null,
        knapsackData: null,
        lcsData: null,
        gridData: null
      });
    }
  },

  stepForward: () => {
    const { currentStepIndex, events } = get();
    if (currentStepIndex < events.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  jumpToStep: (step: number) => {
    const { events } = get();
    const clamped = Math.max(0, Math.min(events.length - 1, step));
    set({ currentStepIndex: clamped });
  },

  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed })
}));

