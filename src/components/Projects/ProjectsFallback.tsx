'use client';

import React from 'react';
import projects from '@/content/projects';
import siteConfig from '@/config/site';
import styles from './ProjectsFallback.module.css';

export const ProjectsFallback: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>
          <span className={styles.labelLine} />
          <span className={styles.labelText}>Selected Work</span>
        </div>
      </div>

      <div className={styles.list}>
        {projects.map((project, idx) => {
          const imageSrc = `${siteConfig.basePath}${project.media.src}`;
          return (
            <article key={project.id} className={styles.item} aria-labelledby={`fb-project-${project.id}`}>
              <div className={styles.itemMeta}>
                <span className={styles.index}>{String(idx + 1).padStart(2, '0')}</span>
                <span className={styles.kind}>{project.kind}</span>
              </div>

              <div className={styles.itemContent}>
                <h3 id={`fb-project-${project.id}`} className={styles.name}>
                  {project.name}
                </h3>
                <p className={styles.summary}>{project.summary}</p>

                <div className={styles.stack}>
                  {project.stack.map((tech) => (
                    <span key={tech} className={styles.tech}>{tech}</span>
                  ))}
                </div>

                <div className={styles.links}>
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.liveLink}
                      data-cursor="link"
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
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              <div className={styles.imageWrapper}>
                <img
                  src={imageSrc}
                  alt={project.media.alt}
                  width={project.media.width}
                  height={project.media.height}
                  loading="lazy"
                  className={styles.image}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsFallback;