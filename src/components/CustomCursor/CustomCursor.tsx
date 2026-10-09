'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

type CursorState = 'default' | 'hover' | 'project' | 'link' | 'text';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [label, setLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isFine = window.matchMedia('(pointer: fine)').matches;
    setIsMobileMode(!isFine);

    if (isFine) {
      document.body.classList.add('custom-cursor-active');
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;
    let rafId: number;
    let hideTimeout: NodeJS.Timeout | null = null;

    const updateCoords = (x: number, y: number) => {
      mouseX = x;
      mouseY = y;
      setIsVisible(true);

      if (!isFine) {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          setIsVisible(false);
        }, 2200);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      updateCoords(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      updateCoords(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      if (isFine) setIsVisible(false);
    };
    const onMouseEnter = () => setIsVisible(true);

    // Detect interactive elements on hover / touch proximity
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
      // Dot: instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }

      // Ring: lerp for inertia
      const ease = isFine ? 0.12 : 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 19}px, ${ringY - 19}px)`;
      }

      // Mobile Aura: fluid trailing halo
      if (auraRef.current) {
        auraX += (mouseX - auraX) * 0.15;
        auraY += (mouseY - auraY) * 0.15;
        auraRef.current.style.transform = `translate(${auraX - 22}px, ${auraY - 22}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (hideTimeout) clearTimeout(hideTimeout);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      {isVisible && (
        <>
          <div
            ref={dotRef}
            className={styles.dot}
            aria-hidden="true"
          />
          <div
            ref={ringRef}
            className={`${styles.ring} ${styles[`ring_${cursorState}`]}`}
            aria-hidden="true"
          >
            {label && <span className={styles.label}>{label}</span>}
          </div>
          {isMobileMode && (
            <div
              ref={auraRef}
              className={styles.mobileAura}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </>
  );
};

export default CustomCursor;