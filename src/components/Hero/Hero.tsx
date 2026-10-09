'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '@/content/profile';
import motionTokens from '@/motion/tokens';
import HeroCanvas from './HeroCanvas';
import Magnetic from '@/components/Magnetic/Magnetic';
import styles from './Hero.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      motionTokens.mediaQueries.reducedMotion
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Entrance: staggered line reveal
      const lines = [metaRef.current, line1Ref.current, line2Ref.current, line3Ref.current, subRef.current, actionsRef.current].filter(Boolean);

      gsap.from(lines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.1,
      });

      // Exit: parallax scrub as user scrolls past hero
      if (sectionRef.current && contentRef.current) {
        gsap.to(contentRef.current, {
          y: -80,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.section}
      aria-labelledby="hero-headline"
    >
      {/* Subtle background grid & 3D architectural canvas */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgGrid} />
        <HeroCanvas />
        <div className={styles.bgVignette} />
      </div>

      <div ref={contentRef} className={styles.content}>
        {/* Top metadata label */}
        <div className={styles.lineMask}>
          <div ref={metaRef} className={styles.metaLabel}>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>Full-stack developer</span>
            <span className={styles.metaSep} aria-hidden="true">/</span>
            <span>India</span>
            <span className={styles.metaSep} aria-hidden="true">/</span>
            <span>2026</span>
          </div>
        </div>

        {/* Main headline */}
        <h1 id="hero-headline" className={styles.headline}>
          <span className="sr-only">Bakhtiar Abid Laskar — Full-Stack Developer &amp; Software Engineer — </span>
          <div className={styles.lineMask}>
            <span ref={line1Ref} className={styles.headlineLine}>
              I Design<span className={styles.accentPeriod}>.</span>
            </span>
          </div>
          <div className={styles.lineMask}>
            <span ref={line2Ref} className={styles.headlineLine}>
              I Engineer<span className={styles.accentPeriod}>.</span>
            </span>
          </div>
          <div className={styles.lineMask}>
            <span ref={line3Ref} className={`${styles.headlineLine} ${styles.headlineAccent}`}>
              I Deliver<span className={styles.accentPeriod}>.</span>
            </span>
          </div>
        </h1>

        {/* Sub copy */}
        <div className={styles.lineMask}>
          <p ref={subRef} className={styles.sub}>
            Engineering web platforms, cross-platform mobile apps, and data systems that solve real problems.
          </p>
        </div>

        {/* Actions */}
        <div className={styles.lineMask}>
          <div ref={actionsRef} className={styles.actions}>
            <Magnetic strength={0.25} maxDistance={8} className={styles.ctaMagnetic}>
              <a
                href="#projects"
                className={styles.ctaLink}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Selected Work</span>
                <span className={styles.ctaArrow} aria-hidden="true">↓</span>
              </a>
            </Magnetic>
            <div className={styles.secondaryActions}>
              <Magnetic strength={0.3} maxDistance={10} className={styles.secondaryMagnetic}>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                  data-cursor="link"
                >
                  GitHub ↗
                </a>
              </Magnetic>
              <Magnetic strength={0.3} maxDistance={10} className={styles.secondaryMagnetic}>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                  data-cursor="link"
                >
                  LinkedIn ↗
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
};

export default Hero;