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

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia(motionTokens.mediaQueries.reducedMotion).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const trigger = {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      };

      // Headline reveal
      if (headlineRef.current) {
        gsap.from(headlineRef.current, {
          y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: trigger,
        });
      }

      // Body reveal
      if (bodyRef.current) {
        gsap.from(bodyRef.current, {
          y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15, scrollTrigger: trigger,
        });
      }

      // Photo parallax
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { y: -30 },
          {
            y: 30,
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
      className={styles.section}
      aria-labelledby="about-headline"
    >
      <div className={styles.container}>
        {/* Section label */}
        <div className={styles.sectionLabel} aria-hidden="true">
          <span className={styles.labelLine} />
          <span className={styles.labelText}>About</span>
        </div>

        <div className={styles.grid}>
          {/* Left: text */}
          <div className={styles.textCol}>
            <h2 ref={headlineRef} id="about-headline" className={styles.headline}>
              I like building<br />things that work.
            </h2>

            <div ref={bodyRef} className={styles.body}>
              <p>
                I am <strong>Bakhtiar Abid Laskar</strong> (also known as <strong>Bakhtiar Abid</strong> or <strong>Bakhtiar Laskar</strong>), a Computer Science Engineering undergraduate at the University of Science and Technology Meghalaya (USTM).
                I design and build production web applications, cross-platform mobile systems, and data dashboards.
              </p>
              <p>
                My work centers on clean architecture, reliable database systems, and interfaces that serve a real purpose.
                I care about the details — from schema design to pixel alignment.
              </p>

              <div className={styles.factGrid}>
                <div className={styles.fact}>
                  <span className={styles.factValue}>6+</span>
                  <span className={styles.factLabel}>Production projects</span>
                </div>
                <div className={styles.fact}>
                  <span className={styles.factValue}>Full-stack</span>
                  <span className={styles.factLabel}>Web & mobile</span>
                </div>
                <div className={styles.fact}>
                  <span className={styles.factValue}>India</span>
                  <span className={styles.factLabel}>Based in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: photo */}
          <div className={styles.photoCol}>
            <div ref={photoRef} className={styles.photoWrapper}>
              <img
                src={imageSrc}
                alt={profile.photo.alt}
                width={profile.photo.width}
                height={profile.photo.height}
                className={styles.photo}
                loading="lazy"
              />
              <div className={styles.photoOverlay} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;