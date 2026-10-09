'use client';

import React, { useEffect, useRef } from 'react';
import styles from './HeroCanvas.module.css';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Accessibility check: only disable if explicitly requested
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Target rotation based on mouse/touch
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.25;
    let targetRotY = 0;
    let rotX = 0.25;
    let rotY = 0;

    const isMobile = width < 768;
    const gridSize = isMobile ? 10 : 14;
    const spacing = isMobile ? 55 : 70;
    const points: Point3D[] = [];

    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
        points.push({
          x: j * spacing,
          y: 60 + Math.sin(Math.sqrt(i * i + j * j) * 0.4) * 15,
          z: i * spacing,
        });
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (clientX - rect.left) / width - 0.5;
      mouseY = (clientY - rect.top) / height - 0.5;
      targetRotY = mouseX * 0.4;
      targetRotX = 0.25 + mouseY * 0.25;
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    const fov = 420;
    let time = 0;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.014;

      // Continuous ambient rotation wave — runs all the time
      const ambientRotY = Math.sin(time * 0.4) * 0.07;
      const ambientRotX = Math.cos(time * 0.3) * 0.035;

      // Smooth damping / interpolation towards target mouse rotation + ambient wave
      rotX += (targetRotX + ambientRotX - rotX) * 0.05;
      rotY += (targetRotY + ambientRotY - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width < 768 ? width * 0.5 : width * 0.65;
      const cy = width < 768 ? height * 0.48 : height * 0.52;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Project 3D to 2D
      const projected = points.map((p) => {
        // Continuous ambient organic wave of height
        const wave = Math.sin(time + (p.x + p.z) * 0.009) * 14;
        const py = p.y + wave;

        // Rotate Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX + 600;

        if (z2 <= 20) return null;

        const scale = fov / z2;
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;
        const alpha = Math.max(0, Math.min(0.28, (1 - z2 / 1200) * 0.4));

        return { sx, sy, alpha, z: z2 };
      });

      // Draw grid lines
      ctx.lineWidth = 1;

      // Draw rows and cols
      const cols = gridSize + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
          const idx = i * cols + j;
          const p1 = projected[idx];
          if (!p1) continue;

          // Connect horizontally
          if (j < cols - 1) {
            const p2 = projected[idx + 1];
            if (p2) {
              const lineAlpha = (p1.alpha + p2.alpha) * 0.5;
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * 0.42})`;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          }

          // Connect vertically
          if (i < cols - 1) {
            const p2 = projected[idx + cols];
            if (p2) {
              const lineAlpha = (p1.alpha + p2.alpha) * 0.5;
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * 0.42})`;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          }

          // Subtle nodes with occasional accent glow
          if (p1.alpha > 0.08 && (i % 2 === 0 && j % 2 === 0)) {
            const isAccent = (i + j) % 6 === 0;
            ctx.fillStyle = isAccent ? 'rgba(220, 255, 80, 0.55)' : 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.arc(p1.sx, p1.sy, isAccent ? 1.6 : 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};

export default HeroCanvas;
