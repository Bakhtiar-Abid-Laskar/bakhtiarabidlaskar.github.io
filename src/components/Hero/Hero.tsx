'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '@/content/profile';
import motionTokens from '@/motion/tokens';
import styles from './Hero.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const roleRef = useRef<HTMLParagraphElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      motionTokens.mediaQueries.reducedMotion
    ).matches;

    // In reduced motion mode, leave text static and immediately readable
    if (prefersReducedMotion) {
      if (nameRef.current) {
        nameRef.current.style.fontVariationSettings = `'wdth' ${motionTokens.momentA.fontWidthStart}`;
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial wide setting for Archivo
      if (nameRef.current) {
        nameRef.current.style.fontVariationSettings = `'wdth' ${motionTokens.momentA.fontWidthStart}`;
      }

      // 2. Orchestrated Entrance: Reveal by line mask once (Section 5.4 Moment A)
      const entranceTargets = [nameRef.current, roleRef.current].filter(Boolean);
      if (entranceTargets.length > 0) {
        gsap.from(entranceTargets, {
          yPercent: 100,
          duration: 0.7,
          ease: motionTokens.eases.smooth,
          stagger: 0.1,
          clearProps: 'transform',
        });
      }


      // 3. Moment A Exit Scrub: 3D perspective tilt & font width-axis condensation
      if (sectionRef.current && groupRef.current && nameRef.current) {
        const fontProxy = { wdth: motionTokens.momentA.fontWidthStart };

        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70px',
            end: 'bottom top',
            scrub: true,
          },
        });

        // 3D group tilt and translation
        scrubTl.to(
          groupRef.current,
          {
            rotateX: motionTokens.momentA.rotateXMax,
            z: motionTokens.momentA.translateZMax,
            transformOrigin: '50% 0%',
            ease: 'none',
          },
          0
        );

        // Font variation settings 'wdth' scrub from 125 -> 85
        scrubTl.to(
          fontProxy,
          {
            wdth: motionTokens.momentA.fontWidthEnd,
            ease: 'none',
            onUpdate: () => {
              if (nameRef.current) {
                nameRef.current.style.fontVariationSettings = `'wdth' ${fontProxy.wdth.toFixed(1)}`;
              }
            },
          },
          0
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.heroSection}
      aria-labelledby="hero-name"
    >
      <div ref={groupRef} className={styles.heroPerspectiveGroup}>
        {/* Line 1: Developer Name with line-mask */}
        <div className={styles.lineMask}>
          <h1 ref={nameRef} id="hero-name" className={styles.heroName}>
            {profile.name}
          </h1>
        </div>

        {/* Line 2: Role definition with line-mask */}
        <div className={styles.lineMask}>
          <p ref={roleRef} className={styles.heroRole}>
            {profile.role}
          </p>
        </div>

        {/* Orientation text and action links */}
        <div ref={contentRef}>
          <p className={styles.heroOrientation}>
            Computer Science Engineering undergraduate at USTM building production web applications, cross-platform mobile systems, and data dashboards.
          </p>

          <div className={styles.heroActions}>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryLink}
            >
              GitHub
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryLink}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
