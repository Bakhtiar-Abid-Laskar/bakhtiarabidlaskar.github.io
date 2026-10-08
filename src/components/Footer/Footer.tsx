import React from 'react';
import profile from '@/content/profile';
import { getBuildYear } from '@/utils/buildYear';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = getBuildYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {currentYear} {profile.name}. All rights reserved.
        </p>
        <p className={styles.note}>
          Built as a high-performance static export with Next.js and GSAP.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
