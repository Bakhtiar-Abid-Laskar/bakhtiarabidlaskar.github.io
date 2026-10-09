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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isTouchOrCoarse = window.matchMedia('(pointer: coarse)').matches || width < 768;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gridSize = isTouchOrCoarse ? 9 : 14;
    const spacing = isTouchOrCoarse ? 58 : 70;
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

    const fov = 420;

    const drawGrid = (rx: number, ry: number, currentWaveTime: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width < 768 ? width * 0.5 : width * 0.65;
      const cy = width < 768 ? height * 0.48 : height * 0.52;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      const projected = points.map((p) => {
        const wave = Math.sin(currentWaveTime + (p.x + p.z) * 0.009) * 14;
        const py = p.y + wave;

        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX + 600;

        if (z2 <= 20) return null;

        const scale = fov / z2;
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;
        const alpha = Math.max(0, Math.min(0.28, (1 - z2 / 1200) * 0.4));

        return { sx, sy, alpha, z: z2 };
      });

      ctx.lineWidth = 1;
      const cols = gridSize + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
          const idx = i * cols + j;
          const p1 = projected[idx];
          if (!p1) continue;

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

          if (p1.alpha > 0.08 && (i % 2 === 0 && j % 2 === 0)) {
            const isAccent = (i + j) % 6 === 0;
            ctx.fillStyle = isAccent ? 'rgba(220, 255, 80, 0.55)' : 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.arc(p1.sx, p1.sy, isAccent ? 1.6 : 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    // Low-power / Mobile / Reduced Motion: render static frame once, zero RAF loop
    if (isTouchOrCoarse || isReduced) {
      drawGrid(0.24, 0.04, 1.2);
      const onResizeStatic = () => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        drawGrid(0.24, 0.04, 1.2);
      };
      window.addEventListener('resize', onResizeStatic);
      return () => {
        window.removeEventListener('resize', onResizeStatic);
      };
    }

    // Desktop mode with interactive mouse tracking & ambient wave
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.25;
    let targetRotY = 0;
    let rotX = 0.25;
    let rotY = 0;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / width - 0.5;
      mouseY = (e.clientY - rect.top) / height - 0.5;
      targetRotY = mouseX * 0.4;
      targetRotX = 0.25 + mouseY * 0.25;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

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
      const ambientRotY = Math.sin(time * 0.4) * 0.07;
      const ambientRotX = Math.cos(time * 0.3) * 0.035;

      rotX += (targetRotX + ambientRotX - rotX) * 0.05;
      rotY += (targetRotY + ambientRotY - rotY) * 0.05;

      drawGrid(rotX, rotY, time);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};

export default HeroCanvas;
