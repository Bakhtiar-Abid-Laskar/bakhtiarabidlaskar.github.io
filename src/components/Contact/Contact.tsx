'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '@/content/profile';
import motionTokens from '@/motion/tokens';
import styles from './Contact.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const closingNameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      motionTokens.mediaQueries.reducedMotion
    ).matches;

    if (prefersReducedMotion) {
      if (closingNameRef.current) {
        closingNameRef.current.style.transform = `rotateX(${motionTokens.momentE.rotateXEnd}deg)`;
        closingNameRef.current.style.opacity = '1';
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !closingNameRef.current) return;

      // Moment E: Oversized closing name rises from rotateX 70deg to 0deg as contact enters viewport
      gsap.fromTo(
        closingNameRef.current,
        {
          rotateX: motionTokens.momentE.rotateXStart,
          opacity: 0.3,
        },
        {
          rotateX: motionTokens.momentE.rotateXEnd,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        <div className={styles.contentColumn}>
          <div className={styles.header}>
            <h2 id="contact-title" className={styles.sectionTitle}>
              Contact
            </h2>
            <p className={styles.leadText}>
              Available for full-stack engineering roles, systems development, and technical collaboration.
            </p>
          </div>

          <div className={styles.contactLinksGrid}>
            {/* Email link */}
            <div className={styles.linkGroup}>
              <span className={styles.linkLabel}>Email</span>
              <a
                href={`mailto:${profile.contact.email}`}
                className={styles.primaryLink}
                aria-label={`Send email to ${profile.contact.email}`}
              >
                {profile.contact.email}
              </a>
            </div>

            {/* Phone link (Decision D3: Kept per user instruction) */}
            {profile.contact.phone && (
              <div className={styles.linkGroup}>
                <span className={styles.linkLabel}>Phone</span>
                <a
                  href={`tel:${profile.contact.phone.replace(/\s+/g, '')}`}
                  className={styles.primaryLink}
                  aria-label={`Call ${profile.contact.phone}`}
                >
                  {profile.contact.phone}
                </a>
              </div>
            )}

            {/* Profiles */}
            <div className={styles.socialGroup}>
              <span className={styles.linkLabel}>Profiles</span>
              <div className={styles.socialLinks}>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  GitHub
                </a>
                <span className={styles.linkDivider} aria-hidden="true">
                  /
                </span>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Moment E: Oversized Closing Name Perspective Stage */}
        <div
          className={styles.momentEStage}
          style={{ perspective: `${motionTokens.momentE.perspective}px` }}
          aria-hidden="true"
        >
          <div ref={closingNameRef} className={styles.closingName}>
            {profile.name}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
