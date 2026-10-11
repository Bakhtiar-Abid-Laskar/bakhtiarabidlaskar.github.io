'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import certificates, { type Certificate } from '@/content/certificates';
import siteConfig from '@/config/site';
import styles from './Certifications.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Certifications: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  // GSAP scroll reveal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const revealItems = sectionRef.current.querySelectorAll('[data-reveal]');
      revealItems.forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.75,
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

  // Modal ESC key and body scroll lock
  useEffect(() => {
    if (!activeCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCert(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCert]);

  const openLightbox = useCallback((cert: Certificate) => {
    setActiveCert(cert);
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveCert(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className={styles.section}
      aria-labelledby="certifications-heading"
    >
      <div className={styles.container}>
        {/* Section Label */}
        <div className={styles.sectionLabel} data-reveal>
          <span className={styles.labelLine} aria-hidden="true" />
          <span className={styles.labelText}>Certifications & Experience</span>
        </div>

        {/* Section Heading */}
        <div className={styles.sectionHeader} data-reveal>
          <h2 id="certifications-heading" className={styles.headline}>
            Verified Industry Credentials.
          </h2>
          <p className={styles.subheadline}>
            Hands-on technical internships completed at{' '}
            <a
              href="https://www.bahash.in"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineLink}
            >
              Bahash-AI (Bahash Private Limited)
            </a>
            , focusing on Machine Learning model pipelines, data preprocessing, and production Python architectures.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className={styles.grid}>
          {certificates.map((cert, index) => {
            const certImgSrc = `${siteConfig.basePath}${cert.media.src}`;

            return (
              <article
                key={cert.id}
                className={styles.card}
                data-reveal
                aria-labelledby={`cert-title-${cert.id}`}
              >
                {/* Card Top Meta */}
                <div className={styles.cardHeader}>
                  <div className={styles.badgeRow}>
                    <span className={styles.credentialBadge}>
                      ID: {cert.credentialId}
                    </span>
                    <span className={styles.statusBadge}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      Verified
                    </span>
                  </div>
                  <span className={styles.certIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Title & Organization */}
                <div className={styles.cardInfo}>
                  <h3 id={`cert-title-${cert.id}`} className={styles.certTitle}>
                    {cert.title}
                  </h3>
                  <div className={styles.issuerRow}>
                    <span className={styles.roleText}>{cert.role}</span>
                    <span className={styles.bulletSep} aria-hidden="true">·</span>
                    <a
                      href={cert.issuer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.issuerLink}
                      aria-label={`${cert.issuer.name} website (opens in new tab)`}
                    >
                      <span>{cert.issuer.name}</span>
                      <span className={styles.externalArrow} aria-hidden="true">↗</span>
                    </a>
                  </div>
                  <p className={styles.periodText}>
                    {cert.period}
                    <span className={styles.issuedDate}> (Issued {cert.issueDate})</span>
                  </p>
                </div>

                {/* Visual Certificate Frame */}
                <div className={styles.mediaContainer}>
                  <button
                    type="button"
                    className={styles.mediaFrame}
                    onClick={() => openLightbox(cert)}
                    aria-label={`View full high-resolution certificate for ${cert.title}`}
                  >
                    <img
                      src={certImgSrc}
                      alt={cert.media.alt}
                      width={cert.media.width}
                      height={cert.media.height}
                      className={styles.certImage}
                      loading="lazy"
                    />
                    <div className={styles.mediaOverlay} aria-hidden="true">
                      <span className={styles.expandPill}>
                        <svg
                          className={styles.expandIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        Inspect Certificate
                      </span>
                    </div>
                  </button>
                </div>

                {/* Summary & Highlights */}
                <div className={styles.cardBody}>
                  <p className={styles.summaryText}>{cert.summary}</p>

                  <ul className={styles.highlightsList}>
                    {cert.keyHighlights.map((highlight, hi) => (
                      <li key={hi} className={styles.highlightItem}>
                        <span className={styles.highlightCheck} aria-hidden="true">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills Tags */}
                  <div className={styles.skillsRow} aria-label="Skills acquired">
                    {cert.skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.primaryActionBtn}
                    onClick={() => openLightbox(cert)}
                  >
                    <span>View Certificate</span>
                    <span className={styles.btnIcon} aria-hidden="true">⊕</span>
                  </button>
                  <a
                    href={cert.issuer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryActionBtn}
                  >
                    <span>bahash.in</span>
                    <span className={styles.btnIcon} aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeCert && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeLightbox}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <span className={styles.modalBadge}>ID: {activeCert.credentialId}</span>
                <h3 id="modal-title" className={styles.modalTitle}>
                  {activeCert.title}
                </h3>
                <p className={styles.modalIssuer}>
                  {activeCert.issuer.organization} · {activeCert.period}
                </p>
              </div>

              <div className={styles.modalHeaderActions}>
                <a
                  href={`${siteConfig.basePath}${activeCert.media.src}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalExternalLink}
                  aria-label="Open original certificate image in new tab"
                >
                  <span>Open Full Size</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={closeLightbox}
                  aria-label="Close certificate preview"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
            </div>

            {/* Modal Image Wrapper */}
            <div className={styles.modalImageContainer}>
              <img
                src={`${siteConfig.basePath}${activeCert.media.src}`}
                alt={activeCert.media.alt}
                width={activeCert.media.width}
                height={activeCert.media.height}
                className={styles.modalImage}
              />
            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <span className={styles.modalIssuerSite}>
                Issued by{' '}
                <a
                  href={activeCert.issuer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalIssuerAnchor}
                >
                  Bahash Private Limited (www.bahash.in)
                </a>
              </span>
              <span className={styles.modalEscHint}>Press Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;
