import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface LatexProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const LatexRenderer: React.FC<LatexProps> = ({ math, displayMode = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode,
          throwOnError: false
        });
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.innerText = math;
        }
      }
    }
  }, [math, displayMode]);

  return <span ref={containerRef} className={className} />;
};

