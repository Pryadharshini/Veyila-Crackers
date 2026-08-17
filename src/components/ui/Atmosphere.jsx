import { useEffect, useRef } from 'react';
import { useReducedMotion, useScrollInfo } from '@/hooks';

/**
 * EmberField
 * ------------------------------------------------------------------
 * Ambient embers drifting upward, the way they do off a burnt-out flower
 * pot. One canvas for the whole page, capped by device pixel ratio and
 * paused when the tab is hidden or the visitor prefers reduced motion.
 */
export function EmberField({ density = 34, className = '', tint = [226, 59, 38] }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = [];

    const spawn = (initial = false) => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + Math.random() * 60,
      r: 0.5 + Math.random() * 1.7,
      vy: 0.16 + Math.random() * 0.55,
      vx: (Math.random() - 0.5) * 0.28,
      life: 0,
      max: 400 + Math.random() * 700,
      gold: Math.random() > 0.55,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      const count = Math.round(density * Math.min(1.6, width / 900));
      for (let i = 0; i < count; i += 1) particles.push(spawn(true));
    };

    const draw = () => {
      if (!running) return;
      context.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.life += 1;
        p.y -= p.vy;
        p.x += p.vx + Math.sin((p.life + p.phase) * 0.014) * 0.22;

        if (p.y < -12 || p.life > p.max) {
          particles[i] = spawn();
          continue;
        }

        const fade = Math.min(1, p.life / 90) * (1 - p.life / p.max);
        const flicker = 0.65 + Math.sin(p.life * 0.09 + p.phase) * 0.35;
        const [r, g, b] = p.gold ? [233, 180, 76] : tint;
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(${r},${g},${b},${(fade * flicker * 0.62).toFixed(3)})`;
        context.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !raf) raf = requestAnimationFrame(draw);
      if (!running) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(raf);
    };
  }, [density, reduced, tint]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * FuseRail
 * ------------------------------------------------------------------
 * The site's scroll indicator. A fuse runs down the left edge; the burnt
 * length is how far you've read, and the lit tip sits at the reading point.
 * It carries real information, which is the only reason it earns the space.
 */
export function FuseRail() {
  const { progress } = useScrollInfo();
  const reduced = useReducedMotion();
  const percent = Math.round(progress * 100);

  return (
    <div
      className="pointer-events-none fixed left-3 top-1/2 z-30 hidden h-[42vh] w-px -translate-y-1/2 bg-paper/10 lg:block"
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 top-0 bg-gradient-to-b from-ember via-saffron to-gold"
        style={{ height: `${percent}%` }}
      />
      <span
        className={`absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-gold shadow-[0_0_12px_3px_rgba(233,180,76,.7)] ${
          reduced ? '' : 'animate-flicker'
        }`}
        style={{ top: `calc(${percent}% - 3px)` }}
      />
      <span className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] tracking-[0.3em] text-paper/25">
        {String(percent).padStart(3, '0')}
      </span>
    </div>
  );
}

/**
 * Glow
 * A soft coloured pool behind a section. Purely decorative, so it is a
 * single element rather than a stack of blurred divs.
 */
export function Glow({ className = '', color = 'rgba(226,59,38,.28)', size = 620 }) {
  return (
    <div
      className={`pointer-events-none absolute -z-10 rounded-full blur-[100px] ${className}`}
      style={{ width: size, height: size, background: color }}
      aria-hidden="true"
    />
  );
}
