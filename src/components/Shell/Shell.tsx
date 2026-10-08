'use client';

import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header/Header';
import SkipLink from '@/components/SkipLink/SkipLink';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Projects from '@/components/Projects/Projects';
import EducationSkills from '@/components/EducationSkills/EducationSkills';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import { initMotionRegistry, destroyMotionRegistry } from '@/motion/registry';
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
        <EducationSkills />

        {/* CONTACT SECTION (Moment E) */}
        <Contact />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Shell;
