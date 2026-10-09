'use client';

import React, { useEffect, useRef } from 'react';
import styles from './HeroCanvas.module.css';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  isAccent: boolean;
  phase: number;
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

    // Rich 3D grid resolution for both mobile and desktop
    const gridSize = isTouchOrCoarse ? 14 : 16;
    const spacing = isTouchOrCoarse ? 52 : 65;
    const points: Point3D[] = [];

    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
        points.push({
          x: j * spacing,
          y: 70 + Math.sin(Math.sqrt(i * i + j * j) * 0.35) * 20,
          z: i * spacing,
        });
      }
    }

    // 3D floating spatial particles
    const particleCount = isTouchOrCoarse ? 28 : 45;
    const particles: Particle3D[] = [];
    for (let p = 0; p < particleCount; p++) {
      particles.push({
        x: (Math.random() - 0.5) * (gridSize * spacing * 1.4),
        y: Math.random() * -240 - 20,
        z: (Math.random() - 0.5) * (gridSize * spacing * 1.4),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.3,
        vz: (Math.random() - 0.5) * 0.25,
        radius: 0.8 + Math.random() * 1.8,
        isAccent: Math.random() < 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const fov = 460;
    const cameraZ = 520;

    // Interaction tracking (mouse & touch)
    let targetRotX = 0.28;
    let targetRotY = 0;
    let rotX = 0.28;
    let rotY = 0;
    let time = 0;

    let touchTargetWorldX = 0;
    let touchTargetWorldZ = 0;
    let touchPower = 0;

    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const normX = (clientX - rect.left) / width - 0.5;
      const normY = (clientY - rect.top) / height - 0.5;

      targetRotY = normX * 0.45;
      targetRotX = 0.28 + normY * 0.28;

      touchTargetWorldX = normX * (gridSize * spacing * 0.9);
      touchTargetWorldZ = normY * (gridSize * spacing * 0.9);
      touchPower = 1.0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        onPointerMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        onPointerMove(touch.clientX, touch.clientY);
        touchPower = 1.2;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (isReduced) {
        // Reduced motion: draw single elegant frame
        drawScene(0.26, 0.02, 1.0, 0);
        return;
      }

      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.016;
      touchPower *= 0.96; // Smooth decay

      const ambientRotY = Math.sin(time * 0.45) * 0.08;
      const ambientRotX = Math.cos(time * 0.35) * 0.04;

      rotX += (targetRotX + ambientRotX - rotX) * 0.05;
      rotY += (targetRotY + ambientRotY - rotY) * 0.05;

      drawScene(rotX, rotY, time, touchPower);
      animationFrameId = requestAnimationFrame(render);
    };

    const drawScene = (rx: number, ry: number, currentWaveTime: number, currentTouchPower: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width < 768 ? width * 0.5 : width * 0.62;
      const cy = width < 768 ? height * 0.65 : height * 0.52;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      // 1. Project & draw 3D floating particles
      for (let p = 0; p < particles.length; p++) {
        const part = particles[p];
        part.x += part.vx;
        part.y += part.vy;
        part.z += part.vz;

        // Reset if drifted too high
        if (part.y < -380) {
          part.y = 120;
          part.x = (Math.random() - 0.5) * (gridSize * spacing * 1.3);
          part.z = (Math.random() - 0.5) * (gridSize * spacing * 1.3);
        }

        const px1 = part.x * cosY + part.z * sinY;
        const pz1 = -part.x * sinY + part.z * cosY;
        const py2 = part.y * cosX - pz1 * sinX;
        const pz2 = part.y * sinX + pz1 * cosX + cameraZ;

        if (pz2 > 30) {
          const pScale = fov / pz2;
          const psx = cx + px1 * pScale;
          const psy = cy + py2 * pScale;
          const pAlpha = Math.max(0, Math.min(0.65, (1 - pz2 / 1200) * 0.7));
          const twinkle = (Math.sin(currentWaveTime * 2 + part.phase) + 1) * 0.5;

          ctx.beginPath();
          ctx.arc(psx, psy, Math.max(0.6, part.radius * pScale * 1.5), 0, Math.PI * 2);
          if (part.isAccent) {
            ctx.fillStyle = `rgba(220, 255, 80, ${pAlpha * (0.4 + twinkle * 0.5)})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha * (0.3 + twinkle * 0.4)})`;
          }
          ctx.fill();
        }
      }

      // 2. Project grid points with kinetic wave formula
      const projected = points.map((p) => {
        // Multi-frequency wave physics
        const wave1 = Math.sin(currentWaveTime * 1.1 + (p.x * 0.01 + p.z * 0.015)) * 22;
        const wave2 = Math.cos(currentWaveTime * 0.7 + (p.x * 0.016 - p.z * 0.012)) * 14;

        // Touch kinetic ripple
        let ripple = 0;
        if (currentTouchPower > 0.02) {
          const dx = p.x - touchTargetWorldX;
          const dz = p.z - touchTargetWorldZ;
          const dist = Math.sqrt(dx * dx + dz * dz);
          ripple = currentTouchPower * Math.sin(currentWaveTime * 3.5 - dist * 0.035) * Math.max(0, 32 - dist * 0.09);
        }

        const py = p.y + wave1 + wave2 + ripple;

        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX + cameraZ;

        if (z2 <= 20) return null;

        const scale = fov / z2;
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;
        const alpha = Math.max(0, Math.min(0.38, (1 - z2 / 1200) * 0.5));

        return { sx, sy, alpha, z: z2 };
      });

      // 3. Render grid wireframe lines
      ctx.lineWidth = 1;
      const cols = gridSize + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
          const idx = i * cols + j;
          const p1 = projected[idx];
          if (!p1) continue;

          // Horizontal lines
          if (j < cols - 1) {
            const p2 = projected[idx + 1];
            if (p2) {
              const lineAlpha = (p1.alpha + p2.alpha) * 0.5;
              const isAccentRow = i % 4 === 0;
              ctx.strokeStyle = isAccentRow
                ? `rgba(220, 255, 80, ${lineAlpha * 0.55})`
                : `rgba(255, 255, 255, ${lineAlpha * 0.38})`;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          }

          // Vertical lines
          if (i < cols - 1) {
            const p2 = projected[idx + cols];
            if (p2) {
              const lineAlpha = (p1.alpha + p2.alpha) * 0.5;
              const isAccentCol = j % 4 === 0;
              ctx.strokeStyle = isAccentCol
                ? `rgba(220, 255, 80, ${lineAlpha * 0.55})`
                : `rgba(255, 255, 255, ${lineAlpha * 0.38})`;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          }

          // Glowing nodes
          if (p1.alpha > 0.06 && (i % 2 === 0 && j % 2 === 0)) {
            const isAccent = (i + j) % 4 === 0;
            ctx.beginPath();
            ctx.arc(p1.sx, p1.sy, isAccent ? 2.2 : 1.3, 0, Math.PI * 2);
            ctx.fillStyle = isAccent ? 'rgba(220, 255, 80, 0.85)' : 'rgba(255, 255, 255, 0.45)';
            ctx.fill();

            // Accent node radial glow
            if (isAccent && p1.alpha > 0.15) {
              ctx.beginPath();
              ctx.arc(p1.sx, p1.sy, 5.5, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(220, 255, 80, 0.18)';
              ctx.fill();
            }
          }
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};

export default HeroCanvas;
