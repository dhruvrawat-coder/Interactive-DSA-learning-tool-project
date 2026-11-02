import React, { useState, useEffect } from 'react';
import { useDPStore } from '../core/store';
import { LESSONS_REGISTRY } from '../core/lessonsData';
import { LatexRenderer } from './LatexRenderer';
import { 
  ChevronLeft, ChevronRight, BookOpen, Layers, Play, CheckCircle2, 
  HelpCircle, AlertTriangle, ArrowRight, Lightbulb, Code2, Sparkles, 
  RotateCcw, ListFilter, Maximize2, Minimize2, ExternalLink
} from 'lucide-react';

export const InteractiveLearningMode: React.FC = () => {
  const { 
    selectedLessonId, 
    setSelectedLessonId, 
    activeSlideIndex, 
    setActiveSlideIndex,
    setCurrentView,
    selectProblem
  } = useDPStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showToc, setShowToc] = useState(false);

  const lesson = LESSONS_REGISTRY.find(l => l.id === selectedLessonId) || LESSONS_REGISTRY[0];
  const totalSlides = lesson.slides.length;
  const slide = lesson.slides[activeSlideIndex] || lesson.slides[0];

  // Reset quiz on slide change
  useEffect(() => {
    setQuizAnswer(null);
    setShowHint(false);
  }, [activeSlideIndex, selectedLessonId]);

  // Keyboard navigation (Left / Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (activeSlideIndex < totalSlides - 1) {
          setActiveSlideIndex(activeSlideIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (activeSlideIndex > 0) {
          setActiveSlideIndex(activeSlideIndex - 1);
        }
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, totalSlides, isFullscreen, setActiveSlideIndex]);

  const handleLaunchVisualizer = (problemId?: string) => {
    if (problemId) {
      selectProblem(problemId);
    }
    setCurrentView('workspace');
  };

  return (
    <div className={`flex flex-col h-full bg-[#070B14] text-white overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 p-4' : 'rounded border border-[#1E385C]'
    }`}>
      {/* Top Slide Control Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#141414] border-b border-[#1E375C] shrink-0">
        <div className="flex items-center gap-3">
          {/* Lesson selector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#707070] uppercase font-bold">TOPIC:</span>
            <select
              value={selectedLessonId}
              onChange={(e) => {
                setSelectedLessonId(e.target.value);
                setActiveSlideIndex(0);
              }}
              className="bg-[#1C1C1C] border border-[#23416B] rounded-[2px] text-xs font-mono text-white px-2.5 py-1 focus:border-[#00F0FF] focus:outline-none cursor-pointer font-bold"
            >
              {LESSONS_REGISTRY.map(l => (
                <option key={l.id} value={l.id}>
                  [{l.category}] {l.title}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-[1px] bg-[#1E385C]" />

          {/* Table of contents toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono text-[#A3A3A3] hover:text-white hover:bg-[#15243E] transition-colors"
          >
            <ListFilter className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>SLIDES ({activeSlideIndex + 1}/{totalSlides})</span>
          </button>
        </div>

        {/* Progress bar pill */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-36 h-1.5 bg-[#162846] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00F0FF] transition-all duration-300"
              style={{ width: `${((activeSlideIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-[#A3A3A3] font-bold">
            {Math.round(((activeSlideIndex + 1) / totalSlides) * 100)}%
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {lesson.associatedProblemId && (
            <button
              onClick={() => handleLaunchVisualizer(lesson.associatedProblemId)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#162846] hover:bg-[#00F0FF] hover:text-black text-[#00F0FF] border border-[#00F0FF]/40 font-mono text-xs font-bold transition-colors"
              title="Open full interactive table visualizer for this algorithm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>LAUNCH LAB WORKSPACE</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded text-[#A3A3A3] hover:text-white hover:bg-[#162846] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer (Collapsible) */}
        {showToc && (
          <div className="w-64 bg-[#0B1220] border-r border-[#1E375C] p-3 overflow-y-auto shrink-0 z-20 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#707070] font-bold px-2 py-1">
              LESSON OUTLINE
            </div>
            {lesson.slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSlideIndex(idx);
                  setShowToc(false);
                }}
                className={`w-full text-left p-2 rounded-[2px] text-xs font-mono transition-colors flex items-center justify-between ${
                  idx === activeSlideIndex
                    ? 'bg-[#00F0FF] text-black font-black'
                    : 'text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white'
                }`}
              >
                <div className="truncate mr-2">
                  <span className="opacity-70 mr-1.5">{idx + 1}.</span>
                  <span>{s.title}</span>
                </div>
                {idx < activeSlideIndex && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Slide Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between max-w-5xl mx-auto w-full">
          {/* Slide Header */}
          <div className="space-y-2 border-b border-[#162846] pb-5">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded-[2px] bg-[#162846] text-[#00F0FF] font-bold border border-[#00F0FF]/30 uppercase tracking-widest">
                {slide.badge || `Slide ${activeSlideIndex + 1} of ${totalSlides}`}
              </span>
              <span className="text-[#707070] uppercase font-bold">•</span>
              <span className="text-[#A3A3A3] uppercase tracking-wider font-bold">
                {lesson.title}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {slide.title}
            </h1>
            <p className="text-sm md:text-base text-[#A3A3A3] font-medium leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Slide Main Body Area */}
          <div className="py-6 space-y-6 flex-1">
            {/* Paragraph explanations */}
            <div className="space-y-3">
              {slide.body.map((p, i) => (
                <p key={i} className="text-sm md:text-base text-[#D4D4D4] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Real World Analogy Callout */}
            {slide.realWorldAnalogy && (
              <div className="p-4 rounded-md bg-[#0F1A2E] border border-[#00F0FF]/30 space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                  <span className="text-base">{slide.realWorldAnalogy.icon}</span>
                  <span>{slide.realWorldAnalogy.title}</span>
                </div>
                <p className="text-xs md:text-sm text-[#CCCCCC] leading-relaxed pl-6">
                  {slide.realWorldAnalogy.text}
                </p>
              </div>
            )}

            {/* Mathematical Formulas (LaTeX) */}
            {slide.mathLatex && (
              <div className="p-4 rounded-md bg-[#121212] border border-[#1E375C] space-y-2">
                <div className="text-[10px] font-mono text-[#707070] uppercase font-bold tracking-widest">
                  FORMAL MATHEMATICAL SPECIFICATION
                </div>
                <div className="space-y-3 overflow-x-auto py-2 text-center">
                  {slide.mathLatex.map((latex, idx) => (
                    <div key={idx} className="text-base md:text-lg text-[#FFFFFF]">
                      <LatexRenderer math={latex} displayMode={true} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Recurrence Derivation Breakdown */}
            {slide.mathDerivationSteps && (
              <div className="space-y-3">
                <div className="text-[10px] font-mono text-[#00F0FF] uppercase font-bold tracking-widest">
                  STEP-BY-STEP RECURRENCE DERIVATION
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {slide.mathDerivationSteps.map((step, i) => (
                    <div key={i} className="p-3 bg-[#0F1A2E] rounded border border-[#1E375C] space-y-1 font-mono">
                      <div className="flex items-center justify-between text-xs font-bold text-[#00F0FF]">
                        <span>{i + 1}. {step.step}</span>
                        <span className="text-[10px] text-[#707070] uppercase">{step.why}</span>
                      </div>
                      <div className="text-sm text-white pt-1">
                        <LatexRenderer math={step.latex} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Visual Link into DP Lab Execution Engine */}
            {slide.visualType && (
              <div className="p-5 rounded-md bg-[#0F1A2E] border border-[#1E385C] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00F0FF]">
                    <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                    <span className="uppercase tracking-wider">Interactive Visualization Ready</span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#162846] text-[#A3A3A3] px-2 py-0.5 rounded">
                    Engine Hooked
                  </span>
                </div>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Experience this concept executing step-by-step in the full DP Lab visualization workspace. See dependencies connect in real time, watch memo cache hits prune subtrees, and backtrack optimal items.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchVisualizer(slide.targetProblemId)}
                    className="px-4 py-2 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] text-black font-mono text-xs font-black flex items-center gap-2 transition-colors uppercase tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Open Interactive Execution Workspace</span>
                  </button>
                </div>
              </div>
            )}

            {/* Code Walkthrough Snippet */}
            {slide.codeSnippet && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#00F0FF] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    {slide.codeSnippet.language.toUpperCase()} IMPLEMENTATION
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#A3A3A3]">
                    <span>Time: <strong className="text-white">{slide.codeSnippet.complexity.time}</strong></span>
                    <span>Space: <strong className="text-white">{slide.codeSnippet.complexity.space}</strong></span>
                  </div>
                </div>

                <div className="p-4 bg-[#080808] border border-[#1E375C] rounded-[3px] text-xs leading-relaxed space-y-1 overflow-x-auto">
                  {slide.codeSnippet.lines.map((ln, idx) => {
                    const lineNo = idx + 1;
                    const isHighlighted = slide.codeSnippet?.highlightLines?.includes(lineNo);
                    return (
                      <div 
                        key={lineNo}
                        className={`flex items-center px-2 py-0.5 rounded-[2px] ${
                          isHighlighted ? 'bg-[#162846] text-white border-l-2 border-[#00F0FF] font-bold' : 'text-[#888888]'
                        }`}
                      >
                        <span className="w-6 text-[10px] text-[#555555] select-none text-right pr-3 font-mono">{lineNo}</span>
                        <span className="whitespace-pre">{ln}</span>
                      </div>
                    );
                  })}
                </div>

                {slide.codeSnippet.annotations && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    {slide.codeSnippet.annotations.map((ann, i) => (
                      <div key={i} className="p-2 bg-[#141414] rounded border border-[#1A3052] text-[#A3A3A3]">
                        <span className="text-[#00F0FF] font-bold mr-1.5">Line {ann.line}:</span>
                        <span>{ann.note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Common Mistake & Bug Breakdown */}
            {slide.pitfall && (
              <div className="p-4 rounded-md bg-[#0F1A2E] border border-red-500/40 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    COMMON PITFALL: {slide.pitfall.mistakeTitle}
                  </span>
                  <span className="text-[10px] bg-[#162846] px-2 py-0.5 rounded text-red-300 border border-red-500/30">
                    ANTI-PATTERN
                  </span>
                </div>

                <div className="p-3 bg-[#080808] border border-red-950 rounded text-xs text-red-300 overflow-x-auto">
                  <pre>{slide.pitfall.badCode}</pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#121212] rounded border border-[#1E375C]">
                    <span className="text-[10px] text-[#707070] block uppercase font-bold">Failing Input:</span>
                    <span className="text-white font-bold">{slide.pitfall.failingInput}</span>
                  </div>
                  <div className="p-2 bg-[#121212] rounded border border-[#1E375C]">
                    <span className="text-[10px] text-red-400 block uppercase font-bold">Erroneous Output:</span>
                    <span className="text-red-300 font-bold">{slide.pitfall.actualOutput}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#121212] rounded border border-[#00F0FF]/30 text-xs text-[#CCCCCC]">
                  <strong className="text-[#00F0FF] block mb-0.5">Remediation:</strong>
                  {slide.pitfall.fixExplanation}
                </div>
              </div>
            )}

            {/* Interactive Slide Quiz / Checkpoint */}
            {slide.quiz && (
              <div className="p-5 rounded-md bg-[#141414] border border-[#00F0FF]/40 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#00F0FF]" />
                    Interactive Slide Checkpoint
                  </span>
                  <span className="text-[10px] font-mono text-[#707070] uppercase">
                    Active Recall
                  </span>
                </div>
                <p className="text-xs md:text-sm text-white font-bold leading-relaxed">
                  {slide.quiz.question}
                </p>

                <div className="space-y-2">
                  {slide.quiz.options.map((opt) => {
                    const isSelected = quizAnswer === opt.id;
                    let style = 'bg-[#1C1C1C] border-[#1E375C] text-[#A3A3A3] hover:border-[#00F0FF] hover:text-white';

                    if (quizAnswer) {
                      if (opt.isCorrect) {
                        style = 'bg-[#1C1C1C] border-[#00F0FF] text-white ring-1 ring-[#00F0FF] font-bold';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'bg-[#1C1C1C] border-red-500 text-red-300';
                      }
                    } else if (isSelected) {
                      style = 'bg-[#162846] border-[#00F0FF] text-white font-bold';
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={!!quizAnswer}
                        onClick={() => setQuizAnswer(opt.id)}
                        className={`w-full text-left p-3 rounded-[3px] border transition-colors flex flex-col gap-1 text-xs font-mono ${style}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt.label}</span>
                          {quizAnswer && opt.isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                          )}
                        </div>
                        {quizAnswer && isSelected && (
                          <div className={`text-[11px] pt-1.5 mt-1 border-t ${
                            opt.isCorrect ? 'border-[#00F0FF]/40 text-[#00F0FF]' : 'border-red-500/40 text-red-300'
                          }`}>
                            {opt.explanation}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Hint toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-[#162846]">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-[10px] font-mono text-[#707070] hover:text-[#00F0FF] uppercase font-bold"
                  >
                    {showHint ? 'Hide Socratic Hint' : 'Need a Clue?'}
                  </button>
                </div>
                {showHint && (
                  <div className="p-2 bg-[#1A1A1A] border border-[#23416B] rounded text-[11px] font-mono text-[#A3A3A3]">
                    <strong className="text-[#00F0FF]">Hint:</strong> {slide.quiz.hint}
                  </div>
                )}
              </div>
            )}

            {/* Bullet Takeaways */}
            {slide.bulletTakeaways && (
              <div className="p-4 rounded-md bg-[#0F1A2E] border border-[#1E375C] space-y-2">
                <div className="text-[10px] font-mono text-[#707070] uppercase font-bold tracking-widest">
                  CORE PRINCIPLES
                </div>
                <div className="space-y-1.5">
                  {slide.bulletTakeaways.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs md:text-sm text-[#CCCCCC]">
                      <span className="text-[#00F0FF] font-bold">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Slide Footer Key Takeaway & Navigation Strip */}
          <div className="border-t border-[#162846] pt-4 mt-6 space-y-4">
            <div className="p-3 rounded bg-[#141414] border border-[#2A2A2A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="text-xs text-[#E0E0E0] font-mono">
                  <strong className="text-[#00F0FF] uppercase font-bold mr-1.5">Key Takeaway:</strong>
                  {slide.summaryTakeaway}
                </span>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between font-mono">
              <button
                onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                disabled={activeSlideIndex === 0}
                className="px-4 py-2 rounded-[2px] bg-[#1C1C1C] border border-[#23416B] hover:bg-[#252525] disabled:opacity-30 disabled:hover:bg-[#1C1C1C] text-xs font-bold text-[#CCCCCC] flex items-center gap-2 transition-colors uppercase"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              <div className="text-xs text-[#707070] font-bold">
                USE <kbd className="px-1.5 py-0.5 rounded bg-[#162846] text-[#A3A3A3] text-[10px] border border-[#23416B]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[#162846] text-[#A3A3A3] text-[10px] border border-[#23416B]">→</kbd> KEYS
              </div>

              {activeSlideIndex < totalSlides - 1 ? (
                <button
                  onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                  className="px-5 py-2 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] text-black font-mono text-xs font-black flex items-center gap-2 transition-colors uppercase tracking-wider"
                >
                  <span>Next Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleLaunchVisualizer(lesson.associatedProblemId)}
                  className="px-5 py-2 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] text-black font-mono text-xs font-black flex items-center gap-2 transition-colors uppercase tracking-wider"
                >
                  <span>Finish & Launch Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

