import React from 'react';
import profile from '@/content/profile';
import { getBuildYear } from '@/utils/buildYear';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const year = getBuildYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.left}>
            <span className={styles.name}>{profile.name}</span>
            <span className={styles.location}>
              <span className={styles.locationDot} aria-hidden="true" />
              India
            </span>
          </div>
          <nav className={styles.links} aria-label="Social links">
            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
              GitHub
            </a>
            <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
              LinkedIn
            </a>
            <a href={`mailto:${profile.contact.email}`} className={styles.link}>
              Email
            </a>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            Designed &amp; built by {profile.name.split(' ')[0]} &mdash; &copy; {year}
          </p>
          <p className={styles.stack}>
            Next.js · GSAP · Lenis · TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;