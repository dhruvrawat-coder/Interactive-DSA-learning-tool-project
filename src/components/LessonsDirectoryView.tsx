import React from 'react';
import { useDPStore } from '../core/store';
import { LESSONS_REGISTRY } from '../core/lessonsData';
import { 
  BookOpen, Clock, Layers, ArrowRight, Play, CheckCircle2, 
  Sparkles, Award, Compass, BarChart2
} from 'lucide-react';

export const LessonsDirectoryView: React.FC = () => {
  const { setSelectedLessonId, setCurrentView, setActiveSlideIndex } = useDPStore();

  const handleStartLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveSlideIndex(0);
    setCurrentView('lessons');
  };

  const categories = ['Fundamentals', '1D DP', '2D DP', 'Strings'] as const;

  return (
    <div className="flex flex-col h-full bg-[#0B1220] rounded border border-[#1E385C] overflow-y-auto p-6 md:p-8 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#1E385C] pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] mb-1 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>INTERACTIVE PRESENTATION HANDBOOK — CARTESIAN INSPIRED</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Dynamic Programming Curriculum & Slide-Based Lessons
          </h1>
          <p className="text-xs md:text-sm text-[#A3A3A3] mt-1.5 max-w-3xl leading-relaxed">
            Step through structured, slide-wise lessons engineered like a high-end lecture presentation. Every lesson unpacks real-world intuition, mathematical state derivation, interactive engine visualization, code walkthroughs, and common student mistakes.
          </p>
        </div>

        <button
          onClick={() => handleStartLesson('intro-to-dp')}
          className="px-5 py-2.5 rounded-[2px] bg-[#00F0FF] hover:bg-[#00D1DF] text-black font-mono text-xs font-black flex items-center gap-2 transition-colors uppercase tracking-wider"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>START FIRST LESSON (1.1)</span>
        </button>
      </div>

      {/* Curriculum Tracks */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catLessons = LESSONS_REGISTRY.filter(l => l.category === cat);
          if (catLessons.length === 0) return null;

          return (
            <div key={cat} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A3052] pb-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                  <span>{cat} Track</span>
                </div>
                <span className="text-[10px] font-mono text-[#707070]">
                  {catLessons.length} {catLessons.length === 1 ? 'LESSON' : 'LESSONS'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catLessons.map((l) => (
                  <div
                    key={l.id}
                    className="p-5 rounded-md bg-[#0F1A2E] border border-[#1E375C] hover:border-[#00F0FF] transition-colors flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-[#00F0FF] font-bold uppercase">{l.difficulty}</span>
                        <span className="text-[#707070] flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3 text-[#707070]" />
                          {l.estimatedMinutes} MINS
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors tracking-tight">
                        {l.title}
                      </h3>

                      <p className="text-xs text-[#A3A3A3] leading-relaxed line-clamp-3">
                        {l.description}
                      </p>

                      <div className="pt-2 flex items-center gap-2 font-mono text-[10px] text-[#707070]">
                        <span className="bg-[#162846] px-2 py-0.5 rounded text-[#CCCCCC] border border-[#1E385C]">
                          {l.slides.length} SLIDES
                        </span>
                        {l.associatedProblemId && (
                          <span className="bg-[#162846] px-2 py-0.5 rounded text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
                            ENGINE HOOKED
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartLesson(l.id)}
                      className="w-full py-2 rounded-[2px] bg-[#162846] hover:bg-[#00F0FF] hover:text-black text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors uppercase"
                    >
                      <span>ENTER LESSON</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

