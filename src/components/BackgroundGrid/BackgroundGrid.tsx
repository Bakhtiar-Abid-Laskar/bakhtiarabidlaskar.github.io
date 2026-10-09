'use client';

import React from 'react';
import styles from './BackgroundGrid.module.css';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className={styles.container} aria-hidden="true">
      <div className={styles.gridPattern} />
      <div className={styles.vignette} />
    </div>
  );
};

export default BackgroundGrid;
