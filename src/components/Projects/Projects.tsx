'use client';

import React, { useState, useEffect } from 'react';
import motionTokens from '@/motion/tokens';
import ProjectsCorridor from './ProjectsCorridor';
import ProjectsFallback from './ProjectsFallback';

export const Projects: React.FC = () => {
  const [useCorridor, setUseCorridor] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkConditions = () => {
      const isDesktop = window.matchMedia(motionTokens.mediaQueries.desktopBreakpoint).matches;
      const isFinePointer = window.matchMedia(motionTokens.mediaQueries.finePointer).matches;
      const prefersReducedMotion = window.matchMedia(motionTokens.mediaQueries.reducedMotion).matches;
      setUseCorridor(isDesktop && isFinePointer && !prefersReducedMotion);
    };

    checkConditions();
    setMounted(true);

    const desktopMq = window.matchMedia(motionTokens.mediaQueries.desktopBreakpoint);
    const pointerMq = window.matchMedia(motionTokens.mediaQueries.finePointer);
    const motionMq = window.matchMedia(motionTokens.mediaQueries.reducedMotion);

    desktopMq.addEventListener('change', checkConditions);
    pointerMq.addEventListener('change', checkConditions);
    motionMq.addEventListener('change', checkConditions);

    return () => {
      desktopMq.removeEventListener('change', checkConditions);
      pointerMq.removeEventListener('change', checkConditions);
      motionMq.removeEventListener('change', checkConditions);
    };
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title">
      {mounted && useCorridor ? <ProjectsCorridor /> : <ProjectsFallback />}
    </section>
  );
};

export default Projects;