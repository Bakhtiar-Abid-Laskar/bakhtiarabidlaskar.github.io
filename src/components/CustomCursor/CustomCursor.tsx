'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

type CursorState = 'default' | 'hover' | 'project' | 'link';

export const CustomCursor: React.FC = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [label, setLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // 1. Media query gate: (hover: hover) and (pointer: fine)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');

    const evaluate = () => {
      const active = mql.matches;
      setIsSupported(active);
      if (!active) {
        document.body.classList.remove('custom-cursor-active');
      }
    };

    evaluate();

    // Re-evaluate on device capability change (e.g. tablet dock/undock)
    mql.addEventListener('change', evaluate);

    return () => {
      mql.removeEventListener('change', evaluate);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  // 2. Cursor listeners: mounted ONLY when gated in
  useEffect(() => {
    if (!isSupported) return;

    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;
      const closest = target.closest('a, button, [data-cursor]');
      if (!closest) {
        setCursorState('default');
        setLabel('');
        return;
      }
      const cursor = (closest as HTMLElement).dataset.cursor;
      if (cursor === 'project') {
        setCursorState('project');
        setLabel('VIEW');
      } else if (cursor === 'link') {
        setCursorState('link');
        setLabel('OPEN ↗');
      } else {
        setCursorState('hover');
        setLabel('');
      }
    };

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }

      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 19}px, ${ringY - 19}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isSupported]);

  // Return null on touch devices
  if (!isSupported) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <>
          <div ref={dotRef} className={styles.dot} aria-hidden="true" />
          <div
            ref={ringRef}
            className={`${styles.ring} ${styles[`ring_${cursorState}`]}`}
            aria-hidden="true"
          >
            {label && <span className={styles.label}>{label}</span>}
          </div>
        </>
      )}
    </>
  );
};

export default CustomCursor;