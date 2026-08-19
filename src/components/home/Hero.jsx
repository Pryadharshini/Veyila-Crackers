import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks';
import { SHOP } from '@/lib/shop';
import { EmberField } from '@/components/ui/Atmosphere';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero.
 * ------------------------------------------------------------------
 * Maroon/gold theme pass. Same scroll choreography as before — the
 * photograph, the copy, and the paper slip all still move independently —
 * but the copy now matches the "Celebrate every moment" reference: a small
 * white eyebrow line, the shop name split gold/maroon, a starred subline,
 * a short paragraph, and two buttons (solid maroon + outlined).
 */
export default function Hero() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const context = gsap.context(() => {
      /* the photograph sinks slower than the page — depth without a jump */
      gsap.to('[data-hero-image]', {
        yPercent: 16,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });

      /* the text leaves faster than the image, so the two separate */
      gsap.to('[data-hero-copy]', {
        yPercent: -22,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '72% top', scrub: 0.5 },
      });

      /* the paper slip animation was here — removed along with the slip */

      gsap.to('[data-hero-veil]', {
        opacity: 0.92,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);

    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-32 sm:pb-20"
      aria-label="Veyila Crackers"
    >
      {/* photograph */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <picture>
          <source media="(max-width: 640px)" srcSet="/assets/hero-diwali-sm.jpg" />
          <img
            data-hero-image
            src="/assets/hero-diwali.jpg"
            alt="Two children lighting sparklers on a rangoli, surrounded by boxes of fireworks"
            className="h-full w-full scale-105 object-cover object-center"
            fetchPriority="high"
            width="1536"
            height="1024"
          />
        </picture>
      </div>

      {/* grading — maroon-tinted instead of a flat black scrim */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,7,7,.90) 0%, rgba(30,7,7,.32) 24%, rgba(30,7,7,.64) 62%, rgba(30,7,7,.97) 92%), linear-gradient(100deg, rgba(30,7,7,.88) 0%, rgba(30,7,7,.55) 38%, transparent 68%)',
        }}
        aria-hidden="true"
      />
      <div
        data-hero-veil
        className="absolute inset-0 -z-10 opacity-0"
        style={{ backgroundColor: '#7a0c0c' }}
        aria-hidden="true"
      />

      <EmberField density={26} className="-z-10" />

      <div className="shell relative pt-8">
        <div className="grid items-end gap-12">
          {/* copy */}
          <div data-hero-copy className="max-w-3xl pt-4">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-6 flex items-center gap-3 font-mono text-[0.72rem] font-bold uppercase tracking-[0.22em] text-paper"
            >
              Celebrate every moment
            </motion.p>

            <h1 className="text-display">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="ta block text-[clamp(3.1rem,7vw,6.8rem)] font-extrabold leading-[0.88]"
                style={{ color: '#f3b431', textShadow: '0 0 60px rgba(243,180,49,.25)' }}
              >
                {SHOP.nameTa.split(' ')[0]}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="ta mt-1 block text-[clamp(3.1rem,7vw,6.8rem)] font-extrabold leading-[0.88]"
                style={{ color: '#e63a2f', textShadow: '0 0 50px rgba(230,58,47,.34)' }}
              >
                கிராக்கர்ஸ்
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42 }}
              className="mt-5 flex items-center gap-3 font-mono text-sm font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#f5c518' }}
            >
              <span aria-hidden="true">✱</span>
              Light up happiness
              <span aria-hidden="true">✱</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.54 }}
              className="mt-6 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-paper/75"
            >
              Premium fireworks for brighter celebrations, joyful families and unforgettable moments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.66 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:justify-start"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_-12px_rgba(122,12,12,0.65)] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: '#7a0c0c' }}
              >
                <span aria-hidden="true">✱</span>
                Shop now
              </Link>
              <Link
                to="/combos"
                className="inline-flex items-center gap-2 rounded-md border border-paper/60 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
              >
                Explore collection
              </Link>
            </motion.div>
          </div>

        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-14 flex items-center gap-3 text-paper/30"
        >
          <span className="relative h-9 w-px overflow-hidden bg-paper/15">
            <motion.span
              animate={{ y: [-12, 36] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 top-0 h-3"
              style={{ backgroundColor: '#f5c518' }}
            />
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.26em]">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}