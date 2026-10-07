'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { Project } from '@/content/projects';
import siteConfig from '@/config/site';
import motionTokens from '@/motion/tokens';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  className,
  style,
}) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [canTilt, setCanTilt] = useState<boolean>(false);
  const [tiltStyle, setTiltStyle] = useState<{ transform: string }>({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasFinePointer = window.matchMedia(
      motionTokens.mediaQueries.finePointer
    ).matches;
    const prefersReducedMotion = window.matchMedia(
      motionTokens.mediaQueries.reducedMotion
    ).matches;

    setCanTilt(hasFinePointer && !prefersReducedMotion);
  }, []);

  // Moment C: Media frame pointer tilt with damping
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canTilt || !frameRef.current) return;

      const rect = frameRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = -normY * (motionTokens.momentC.maxTiltDeg * 2);
      const rotY = normX * (motionTokens.momentC.maxTiltDeg * 2);

      setTiltStyle({
        transform: `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
      });
    },
    [canTilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!canTilt) return;
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    });
  }, [canTilt]);

  const imageSrc = `${siteConfig.basePath}${project.media.src}`;

  // Top 3 stack chips to float on top of the media frame (Moment C layered depth)
  const previewStack = project.stack.slice(0, 3);

  return (
    <article
      className={`${styles.card} ${className || ''}`}
      style={style}
      aria-labelledby={`project-title-${project.id}`}
    >
      {/* Moment C: Media Frame with Layered Depth */}
      <div
        ref={frameRef}
        className={styles.mediaFrameContainer}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
      >
        <img
          src={imageSrc}
          alt={project.media.alt}
          width={project.media.width}
          height={project.media.height}
          loading="lazy"
          className={styles.screenshotLayer}
          style={
            {
              '--z-card-screenshot': `${motionTokens.momentC.layerTranslateZ.screenshot}px`,
            } as React.CSSProperties
          }
        />

        <div
          className={styles.chipsLayer}
          style={
            {
              '--z-card-chips': `${motionTokens.momentC.layerTranslateZ.chips}px`,
            } as React.CSSProperties
          }
        >
          {previewStack.map((item) => (
            <span key={item} className={styles.floatingChip}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Project Information */}
      <div className={styles.infoColumn}>
        <div className={styles.kindBadge}>{project.kind}</div>
        <h3 id={`project-title-${project.id}`} className={styles.projectName}>
          {project.name}
        </h3>
        <p className={styles.projectSummary}>{project.summary}</p>

        <ul className={styles.stackList} aria-label="Technologies used">
          {project.stack.map((item) => (
            <li key={item} className={styles.stackItem}>
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.liveLink}
            >
              Live site
            </a>
          )}

          {project.status === 'internal' && (
            <span className={styles.statusBadge}>Internal platform</span>
          )}

          {project.status === 'archive' && (
            <span className={styles.statusBadge}>Archived dashboard</span>
          )}

          <a
            href={project.links.source}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            Source on GitHub
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
