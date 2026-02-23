'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useStore } from '@/lib/store';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  swayPhase: number;
  swaySpeed: number;
  drift: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

/**
 * Ambient floating particles that respond to pet mood
 * Creates a magical, living atmosphere
 */
export function AmbientParticles({ enabled = true }: { enabled?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  const vitals = useStore(state => state.vitals);

  // Calculate mood-based colors and particle behavior
  const moodConfig = useMemo(() => {
    const avgVitals = (vitals.hunger + vitals.hygiene + vitals.mood + vitals.energy) / 4;

    // Different particle colors based on dominant vital state
    if (avgVitals >= 70) {
      // Happy - soft cyan/emerald particles
      return {
        colors: ['rgba(34, 211, 238, 0.6)', 'rgba(52, 211, 153, 0.5)', 'rgba(192, 132, 252, 0.4)'],
        spawnRate: 0.08,
        speed: 0.5,
        floatStrength: 1.2,
      };
    } else if (vitals.energy < 30) {
      // Tired - slow, dim particles
      return {
        colors: ['rgba(99, 102, 241, 0.3)', 'rgba(139, 92, 246, 0.2)'],
        spawnRate: 0.03,
        speed: 0.2,
        floatStrength: 0.5,
      };
    } else if (vitals.hunger < 30) {
      // Hungry - warm orange particles
      return {
        colors: ['rgba(251, 146, 60, 0.5)', 'rgba(251, 191, 36, 0.4)'],
        spawnRate: 0.05,
        speed: 0.4,
        floatStrength: 0.8,
      };
    } else if (avgVitals < 40) {
      // Sad - minimal, gray particles
      return {
        colors: ['rgba(148, 163, 184, 0.2)'],
        spawnRate: 0.02,
        speed: 0.15,
        floatStrength: 0.3,
      };
    }

    // Neutral - purple particles
    return {
      colors: ['rgba(139, 92, 246, 0.4)', 'rgba(192, 132, 252, 0.3)', 'rgba(34, 211, 238, 0.3)'],
      spawnRate: 0.05,
      speed: 0.35,
      floatStrength: 1,
    };
  }, [vitals]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Keep particle positions proportional when viewport changes.
      particlesRef.current = particlesRef.current.map(p => ({
        ...p,
        x: Math.min(canvas.width, Math.max(0, p.x)),
        y: Math.min(canvas.height, Math.max(-20, p.y)),
      }));
    };

    const updatePointer = (x: number, y: number) => {
      pointerRef.current = { x, y, active: true };
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', clearPointer, { passive: true });
    window.addEventListener('mouseleave', clearPointer);

    const spawnParticle = () => {
      const colors = moodConfig.colors;
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * moodConfig.speed * 1.4,
        vy: -Math.random() * moodConfig.speed - 0.3,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.02,
        drift: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 200 + Math.random() * 100,
      };
      particlesRef.current.push(particle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles based on mood
      if (Math.random() < moodConfig.spawnRate && particlesRef.current.length < 50) {
        spawnParticle();
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;

        // Float upward with unique wave motion per particle.
        p.x +=
          p.vx +
          p.drift +
          Math.sin(p.life * p.swaySpeed + p.swayPhase) * 0.4 * moodConfig.floatStrength;
        p.y += p.vy;

        // Keep the field naturally spread so particles don't collapse toward center.
        if (p.x < -20 || p.x > canvas.width + 20) {
          p.vx *= -1;
          p.drift *= -1;
          p.x = Math.min(canvas.width + 20, Math.max(-20, p.x));
        }

        // React to cursor/touch position to make ambience feel aware.
        if (pointerRef.current.active) {
          const dx = p.x - pointerRef.current.x;
          const dy = p.y - pointerRef.current.y;
          const distanceSq = dx * dx + dy * dy;
          const influenceRadius = 180;

          if (distanceSq > 0 && distanceSq < influenceRadius * influenceRadius) {
            const distance = Math.sqrt(distanceSq);
            const force = ((influenceRadius - distance) / influenceRadius) * 0.18;
            p.x += (dx / distance) * force * 8;
            p.y += (dy / distance) * force * 2;
          }
        }

        // Fade based on life
        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * (1 - lifeRatio);

        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Remove if too old or off screen
        return p.life < p.maxLife && p.y > -20;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', clearPointer);
      window.removeEventListener('mouseleave', clearPointer);
      cancelAnimationFrame(animationRef.current);
    };
  }, [moodConfig, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
