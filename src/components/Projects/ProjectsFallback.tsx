'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '@/content/projects';
import motionTokens from '@/motion/tokens';
import ProjectCard from './ProjectCard';
import styles from './ProjectsFallback.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ProjectsFallback: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      motionTokens.mediaQueries.reducedMotion
    ).matches;

    // Reduced motion: keep panels static, full opacity, zero rotation
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        // Single rotateX reveal from ~10deg to 0 per Section 5.4
        gsap.fromTo(
          card,
          { rotateX: 10, opacity: 0.7 },
          {
            rotateX: 0,
            opacity: 1,
            duration: motionTokens.durations.slow,
            ease: motionTokens.eases.out,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className={styles.fallbackSection}>
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <h2 id="projects-title" className={styles.sectionTitle}>
            Projects
          </h2>
        </div>

        <div className={styles.stackList}>
          {projects.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className={styles.cardWrapper}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsFallback;
