'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '@/content/profile';
import siteConfig from '@/config/site';
import motionTokens from '@/motion/tokens';
import styles from './About.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Split the about paragraph into distinct semantic sentences for line-by-line reveal
const ABOUT_SENTENCES = [
  'Computer Science Engineering undergraduate at the University of Science and Technology Meghalaya.',
  'I design and build production web applications, cross-platform mobile systems, and data dashboards.',
  'My work centers on clean architecture, reliable database systems, and responsive user interfaces.',
];

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const photoWrapperRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      motionTokens.mediaQueries.reducedMotion
    ).matches;

    // Under reduced motion, leave text and photo completely static
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Filter active lines
      const activeLines = lineRefs.current.filter((el): el is HTMLSpanElement => el !== null);

      // Moment D: Line-by-line scrubbed reveal
      if (activeLines.length > 0) {
        gsap.fromTo(
          activeLines,
          { opacity: 0.28 },
          {
            opacity: 1,
            stagger: motionTokens.momentD.lineStagger,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'bottom 50%',
              scrub: true,
            },
          }
        );
      }

      // Moment D: Profile photo slight depth offset relative to text
      if (photoWrapperRef.current) {
        gsap.fromTo(
          photoWrapperRef.current,
          { y: -motionTokens.momentD.photoDepthOffset },
          {
            y: motionTokens.momentD.photoDepthOffset,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const imageSrc = `${siteConfig.basePath}${profile.photo.src}`;

  return (
    <section
      ref={sectionRef}
      id="about"
      className={styles.aboutSection}
      aria-labelledby="about-title"
    >
      <div className={styles.sectionHeader}>
        <h2 id="about-title" className={styles.sectionTitle}>
          About
        </h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.aboutTextContainer}>
          <p className={styles.aboutText}>
            {ABOUT_SENTENCES.map((sentence, idx) => (
              <span
                key={idx}
                ref={(el) => {
                  lineRefs.current[idx] = el;
                }}
                className={styles.revealLine}
              >
                {sentence}
              </span>
            ))}
          </p>
        </div>

        <div ref={photoWrapperRef} className={styles.photoWrapper}>
          <img
            src={imageSrc}
            alt={profile.photo.alt}
            width={profile.photo.width}
            height={profile.photo.height}
            className={styles.profilePhoto}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
