'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '@/content/projects';
import siteConfig from '@/config/site';
import styles from './ProjectsFallback.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ProjectsFallback: React.FC = () => {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const cards = listRef.current?.querySelectorAll(`.${styles.item}`);
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { rotateX: 10, y: 35, opacity: 0.7 },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelLine} />
          <span className={styles.labelText}>Selected Work</span>
        </div>
      </div>

      <div ref={listRef} className={styles.list}>
        {projects.map((project, idx) => {
          const imageSrc = `${siteConfig.basePath}${project.media.src}`;
          return (
            <article key={project.id} className={styles.item} aria-labelledby={`fb-project-${project.id}`}>
              {/* 1. Number + Category */}
              <div className={styles.itemMeta}>
                <span className={styles.index}>{String(idx + 1).padStart(2, '0')}</span>
                <span className={styles.kind}>{project.kind}</span>
              </div>

              {/* 2. Title, Description, Chips, Links */}
              <div className={styles.itemContent}>
                <h3 id={`fb-project-${project.id}`} className={styles.name}>
                  {project.name}
                </h3>
                <p className={styles.summary}>{project.summary}</p>

                {/* Tech stack chips */}
                <div className={styles.stack}>
                  {project.stack.map((tech) => (
                    <span key={tech} className={styles.tech}>{tech}</span>
                  ))}
                </div>

                {/* Project links with 44px hit areas */}
                <div className={styles.links}>
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.liveLink}
                      data-cursor="link"
                      aria-label={`View live ${project.name}`}
                    >
                      View project ↗
                    </a>
                  )}
                  <a
                    href={project.links.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                    data-cursor="link"
                    aria-label={`View source code for ${project.name} on GitHub`}
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              {/* 3. Image with fixed 16/10 aspect ratio and zoom / full image link */}
              <div className={styles.imageWrapper}>
                <a
                  href={imageSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.imageLink}
                  aria-label={`View full screenshot of ${project.name}`}
                  title="Tap to view full image"
                >
                  <Image
                    src={imageSrc}
                    alt={project.media.alt}
                    width={project.media.width}
                    height={project.media.height}
                    sizes="(max-width: 768px) 100vw, 600px"
                    loading="lazy"
                    className={styles.image}
                  />
                  <span className={styles.zoomBadge} aria-hidden="true">
                    🔍 Zoom
                  </span>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsFallback;