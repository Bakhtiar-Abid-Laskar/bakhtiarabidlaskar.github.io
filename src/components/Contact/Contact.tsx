'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '@/content/profile';
import motionTokens from '@/motion/tokens';
import Magnetic from '@/components/Magnetic/Magnetic';
import styles from './Contact.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia(motionTokens.mediaQueries.reducedMotion).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const trigger = { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' };

      if (headlineRef.current) {
        gsap.from(headlineRef.current, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: trigger });
      }
      if (bodyRef.current) {
        gsap.from(bodyRef.current, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.15, scrollTrigger: trigger });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const whatsappNumber = profile.contact.phone.replace(/\D/g, '');

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        {/* Section label */}
        <div className={styles.sectionLabel}>
          <span className={styles.labelLine} />
          <span className={styles.labelText}>Contact</span>
        </div>

        {/* Large headline */}
        <h2 ref={headlineRef} id="contact-title" className={styles.headline}>
          Have a project in mind?
        </h2>

        <div ref={bodyRef} className={styles.body}>
          {/* Email address with tap-to-copy toast */}
          <div className={styles.emailRow}>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={styles.emailCopyBtn}
              aria-label={`Copy email address ${profile.contact.email} to clipboard`}
            >
              <span className={styles.emailText}>{profile.contact.email}</span>
              <span className={`${styles.copyToast} ${copied ? styles.copyToastActive : ''}`}>
                {copied ? '✓ Copied' : 'Tap to copy'}
              </span>
            </button>
          </div>

          {/* Action buttons: Call, WhatsApp, Email */}
          <div className={styles.actions}>
            {profile.contact.phone && (
              <Magnetic strength={0.25} maxDistance={8} className={styles.btnMagnetic}>
                <a
                  id="contact-btn-call"
                  href={`tel:${profile.contact.phone.replace(/\s+/g, '')}`}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  aria-label={`Call ${profile.contact.phone}`}
                >
                  <PhoneIcon />
                  <span>Call</span>
                </a>
              </Magnetic>
            )}
            {profile.contact.phone && (
              <Magnetic strength={0.25} maxDistance={8} className={styles.btnMagnetic}>
                <a
                  id="contact-btn-whatsapp"
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btn} ${styles.btnWhatsApp}`}
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                </a>
              </Magnetic>
            )}
            <Magnetic strength={0.25} maxDistance={8} className={styles.btnMagnetic}>
              <a
                id="contact-btn-email"
                href={`mailto:${profile.contact.email}`}
                className={`${styles.btn} ${styles.btnOutline}`}
                aria-label={`Send email to ${profile.contact.email}`}
              >
                <EmailIcon />
                <span>Email</span>
              </a>
            </Magnetic>
          </div>

          {/* Social profile links (shown once here in contact section) */}
          <div className={styles.profileLinks}>
            <Magnetic strength={0.3} maxDistance={10}>
              <a
                id="contact-link-github"
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileLink}
                aria-label="GitHub profile"
                data-cursor="link"
              >
                GitHub ↗
              </a>
            </Magnetic>
            <Magnetic strength={0.3} maxDistance={10}>
              <a
                id="contact-link-linkedin"
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileLink}
                aria-label="LinkedIn profile"
                data-cursor="link"
              >
                LinkedIn ↗
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Large background name */}
        <div className={styles.bgName} aria-hidden="true">
          {profile.name.split(' ')[0]}
        </div>
      </div>
    </section>
  );
};

export default Contact;