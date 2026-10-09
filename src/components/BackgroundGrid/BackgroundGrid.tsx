'use client';

import React, { useEffect, useRef } from 'react';
import styles from './BackgroundGrid.module.css';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const BackgroundGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderStaticGrid = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      ctx.clearRect(0, 0, width, height);

      // Fine grey 3D wireframe mesh matching the hero grid design
      const gridSize = width < 768 ? 16 : 22;
      const spacing = width < 768 ? 55 : 68;
      const points: Point3D[] = [];

      for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
        for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
          points.push({
            x: j * spacing,
            y: 60 + Math.sin(Math.sqrt(i * i + j * j) * 0.32) * 22,
            z: i * spacing,
          });
        }
      }

      const fov = 460;
      const cameraZ = 520;
      const cx = width < 768 ? width * 0.5 : width * 0.55;
      const cy = height * 0.58;

      // Fixed 3D perspective orientation (unmoving, not animated)
      const rx = 0.28;
      const ry = 0.04;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      const projected = points.map((p) => {
        const wave = Math.sin(1.2 + (p.x * 0.01 + p.z * 0.015)) * 20 + Math.cos(0.8 + (p.x * 0.016 - p.z * 0.012)) * 12;
        const py = p.y + wave;

        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX + cameraZ;

        if (z2 <= 20) return null;

        const scale = fov / z2;
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;
        const alpha = Math.max(0, Math.min(0.35, (1 - z2 / 1200) * 0.45));

        return { sx, sy, alpha, z: z2 };
      });

      // Render only fine grey gridlines (no green dots, zero dots)
      ctx.lineWidth = 1;
      const cols = gridSize + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
          const idx = i * cols + j;
          const p1 = projected[idx];
          if (!p1) continue;

          // Horizontal gridlines
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

          // Vertical gridlines
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
        }
      }
    };

    renderStaticGrid();
    window.addEventListener('resize', renderStaticGrid);
    return () => window.removeEventListener('resize', renderStaticGrid);
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      <div className={styles.gridPattern} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
    </div>
  );
};

export default BackgroundGrid;
