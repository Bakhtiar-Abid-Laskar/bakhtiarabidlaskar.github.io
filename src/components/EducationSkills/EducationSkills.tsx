'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '@/content/profile';
import styles from './EducationSkills.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const EducationSkills: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isTouch) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('[data-reveal]');
      items.forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education-skills"
      className={styles.section}
      aria-labelledby="ed-skills-title"
    >
      <div className={styles.container}>
        {/* Label */}
        <div className={styles.sectionLabel} data-reveal>
          <span className={styles.labelLine} />
          <span id="ed-skills-title" className={styles.labelText}>Education & Skills</span>
        </div>

        <div className={styles.grid}>
          {/* Skills — numbered structured list */}
          <div className={styles.skillsCol}>
            <h3 className={styles.colTitle} data-reveal>Technical Stack</h3>
            <div className={styles.skillGroups}>
              {profile.skills.map((group, gi) => (
                <div key={group.category} className={styles.skillGroup} data-reveal>
                  <div className={styles.groupHeader}>
                    <span className={styles.groupIndex}>{String(gi + 1).padStart(2, '0')}</span>
                    <span className={styles.groupName}>{group.category}</span>
                  </div>
                  <ul className={styles.skillList} aria-label={`${group.category} skills`}>
                    {group.items.map((skill, si) => (
                      <li key={skill} className={styles.skill}>
                        <span className={styles.skillName}>{skill}</span>
                        {si < group.items.length - 1 && (
                          <span className={styles.skillSep} aria-hidden="true"> · </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education — editorial timeline */}
          <div className={styles.eduCol}>
            <h3 className={styles.colTitle} data-reveal>Education</h3>
            <div className={styles.timeline}>
              {profile.education.map((item, i) => (
                <div key={i} className={styles.timelineItem} data-reveal>
                  <div className={styles.timelinePeriod}>{item.period}</div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineLine} aria-hidden="true" />
                    <h4 className={styles.degree}>{item.degree}</h4>
                    <p className={styles.institution}>{item.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSkills;