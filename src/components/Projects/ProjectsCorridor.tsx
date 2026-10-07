'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '@/content/projects';
import motionTokens from '@/motion/tokens';
import { getLenis } from '@/motion/registry';
import ProjectCard from './ProjectCard';
import styles from './ProjectsCorridor.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ProjectsCorridor: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statusTextRef = useRef<HTMLDivElement | null>(null);
  const dotButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndexRef = useRef<number>(0);

  // Pinned scroll length derived from project count * per-project token (Section 5.4)
  const totalPinnedScroll = projects.length * motionTokens.momentB.scrollPixelsPerProject;
  const cardZSpacing = motionTokens.momentB.cardZSpacing;
  const maxCameraZ = (projects.length - 1) * cardZSpacing;
  const totalSlots = projects.length - 1;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      motionTokens.mediaQueries.reducedMotion
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !stickyRef.current || !cameraRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stickyRef.current,
          scrub: true,
          onUpdate: (self) => {
            const currentIdx = Math.max(
              0,
              Math.min(totalSlots, Math.round(self.progress * totalSlots))
            );

            if (currentIdx !== activeIndexRef.current) {
              activeIndexRef.current = currentIdx;

              if (statusTextRef.current) {
                statusTextRef.current.textContent = `${currentIdx + 1} of ${projects.length}: ${projects[currentIdx].name}`;
              }

              dotButtonRefs.current.forEach((btn, idx) => {
                if (btn) {
                  if (idx === currentIdx) {
                    btn.classList.add(styles.dotButtonActive);
                    btn.setAttribute('aria-current', 'step');
                  } else {
                    btn.classList.remove(styles.dotButtonActive);
                    btn.removeAttribute('aria-current');
                  }
                }
              });

              // Update pointer-events only when active index shifts
              panelRefs.current.forEach((panel, idx) => {
                if (panel) {
                  panel.style.pointerEvents = idx === currentIdx ? 'auto' : 'none';
                }
              });
            }
          },
        },
      });

      // 1. Hardware-accelerated Camera Z translation (Moment B camera rig)
      tl.to(
        cameraRef.current,
        {
          z: maxCameraZ,
          ease: 'none',
          duration: 1,
        },
        0
      );

      // 2. Background crossfade (fog -> deep -> fog)
      if (overlayRef.current) {
        tl.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'none', duration: 0.12 },
          0
        );
        tl.fromTo(
          overlayRef.current,
          { opacity: 1 },
          { opacity: 0, ease: 'none', duration: 0.12 },
          0.88
        );
      }

      // 3. Panel approach rotation and fade-out as camera passes
      panelRefs.current.forEach((panel, idx) => {
        if (!panel) return;

        const dwellNorm = idx / totalSlots;
        const approachAngle = (idx % 2 === 0 ? 1 : -1) * motionTokens.momentB.cardApproachRotateY;

        if (idx > 0) {
          const approachStart = Math.max(0, (idx - 1) / totalSlots);
          // Ease approach rotation from +-6 deg to 0 deg at dwell
          tl.fromTo(
            panel,
            { rotateY: approachAngle },
            { rotateY: 0, ease: 'power1.out', duration: dwellNorm - approachStart },
            approachStart
          );
        }

        if (idx < totalSlots) {
          const passEnd = Math.min(1, dwellNorm + 0.5 / totalSlots);
          // Fade out as panel passes behind viewer
          tl.fromTo(
            panel,
            { opacity: 1 },
            { opacity: 0, ease: 'power1.in', duration: passEnd - dwellNorm },
            dwellNorm + 0.1 / totalSlots
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cardZSpacing, maxCameraZ, totalSlots]);

  // Navigate directly to project dwell point via Lenis smooth scroll
  const handleJumpToProject = useCallback(
    (index: number) => {
      if (!sectionRef.current) return;

      const slotProgress = index / totalSlots;
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollableDistance = totalPinnedScroll;
      const targetScroll = sectionTop + slotProgress * (scrollableDistance - window.innerHeight);

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    },
    [totalPinnedScroll, totalSlots]
  );

  return (
    <div
      ref={sectionRef}
      className={styles.corridorSection}
      style={{ height: `${totalPinnedScroll}px` }}
    >
      <div ref={stickyRef} className={styles.stickyStage}>
        {/* Scrubbed Stage Background Crossfade */}
        <div ref={overlayRef} className={styles.stageBackgroundOverlay} />

        <div className={styles.sectionHeader}>
          <h2 id="projects-title" className={styles.sectionTitle}>
            Projects
          </h2>
        </div>

        {/* 3D Camera Rig */}
        <div ref={cameraRef} className={styles.cameraRig}>
          {projects.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => {
                panelRefs.current[idx] = el;
              }}
              className={styles.panelWrapper}
              style={{
                transform: `translate3d(0, 0, ${-idx * cardZSpacing}px)`,
                pointerEvents: idx === 0 ? 'auto' : 'none',
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Corridor Progress Navigation (Section 5.4) */}
        <nav
          className={styles.navContainer}
          aria-label="Project corridor progress navigation"
        >
          <div ref={statusTextRef} className={styles.statusText}>
            1 of {projects.length}: {projects[0].name}
          </div>

          <ul className={styles.dotsList}>
            {projects.map((p, idx) => (
              <li key={p.id}>
                <button
                  ref={(el) => {
                    dotButtonRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => handleJumpToProject(idx)}
                  className={`${styles.dotButton} ${
                    idx === 0 ? styles.dotButtonActive : ''
                  }`}
                  aria-label={`Jump to project ${idx + 1}: ${p.name}`}
                  aria-current={idx === 0 ? 'step' : undefined}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProjectsCorridor;
