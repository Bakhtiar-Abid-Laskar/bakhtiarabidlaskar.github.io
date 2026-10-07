'use client';

import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header/Header';
import SkipLink from '@/components/SkipLink/SkipLink';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Projects from '@/components/Projects/Projects';
import { initMotionRegistry, destroyMotionRegistry } from '@/motion/registry';
import profile from '@/content/profile';
import styles from './Shell.module.css';

export const Shell: React.FC = () => {
  const scrollToRef = useRef<((target: string | HTMLElement, offset?: number) => void) | null>(null);

  useEffect(() => {
    const registry = initMotionRegistry({ headerOffset: -70 });
    scrollToRef.current = registry.scrollTo;

    return () => {
      destroyMotionRegistry();
      scrollToRef.current = null;
    };
  }, []);

  const handleNavigate = (targetId: string) => {
    if (scrollToRef.current) {
      scrollToRef.current(`#${targetId}`, -70);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <SkipLink targetId="main-content" />
      <Header onNavigate={handleNavigate} />

      <main id="main-content" className={styles.mainContent} tabIndex={-1}>
        {/* HERO SECTION (Moment A) */}
        <Hero />

        {/* ABOUT SECTION (Moment D) */}
        <About />

        {/* PROJECTS SECTION (Moments B and C) */}
        <Projects />

        {/* EDUCATION & SKILLS SECTION */}
        <section id="education-skills" className={styles.section} aria-labelledby="edu-title">
          <h2 id="edu-title" className={styles.sectionTitle}>
            Education and skills
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)', marginTop: 'var(--space-6)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>
                Education
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {profile.education.map((edu, idx) => (
                  <li key={idx} style={{ paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-base)' }}>{edu.degree}</div>
                    <div style={{ color: 'var(--color-mist)', fontSize: 'var(--font-size-sm)' }}>{edu.institution} ({edu.period})</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>
                Skills
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {profile.skills.map((grp) => (
                  <div key={grp.category}>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-mist)', marginBottom: 'var(--space-1)' }}>
                      {grp.category}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-base)' }}>
                      {grp.items.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className={styles.section} aria-labelledby="contact-title">
          <h2 id="contact-title" className={styles.sectionTitle}>
            Contact
          </h2>
          <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-mist)', marginBottom: 'var(--space-4)' }}>
            Get in touch for production engineering and collaboration.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div>
              <a
                href={profile.contact.email}
                style={{
                  color: 'var(--color-cobalt)',
                  fontSize: 'var(--font-size-lg)',
                  textDecoration: 'underline',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {profile.contact.email.replace('mailto:', '')}
              </a>
            </div>
            {profile.contact.phone && (
              <div style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-ink)' }}>
                Phone: {profile.contact.phone}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Shell;
