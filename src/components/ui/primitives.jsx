import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView, useMagnetic, useReducedMotion } from '@/hooks';
import { money } from '@/lib/format';
import Icon from './Icon';

/* ------------------------------------------------------------------ */
/* Reveal — the single scroll-entrance used site-wide                  */
/* ------------------------------------------------------------------ */

/**
 * One entrance animation, used everywhere, so the page reads as one hand.
 * `as` keeps the markup semantic; `delay` staggers siblings.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, y = 22, className = '', once = true }) {
  const [ref, inView] = useInView({ once, threshold: 0.15 });
  const reduced = useReducedMotion();
  const Motion = motion[Tag] ?? motion.div;

  return (
    <Motion
      ref={ref}
      initial={reduced ? false : { opacity: 0, y }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Motion>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — buttons and links that lean toward the cursor            */
/* ------------------------------------------------------------------ */

export const Magnetic = forwardRef(function Magnetic(
  { as = 'button', children, className = '', strength = 0.3, radius = 90, ...rest },
  _ref,
) {
  const magnetRef = useMagnetic({ strength, radius });
  const Tag = as === 'link' ? Link : as;
  return (
    <span className="inline-block">
      <Tag ref={magnetRef} className={className} {...rest}>
        {children}
      </Tag>
    </span>
  );
});

/** Primary call to action: magnetic, with a spark that sweeps on hover. */
export function ActionButton({ children, to, href, variant = 'ember', className = '', icon, ...rest }) {
  const tag = to ? 'link' : href ? 'a' : 'button';
  return (
    <Magnetic
      as={tag}
      to={to}
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#d7722d]/20 bg-[#d7722d] px-5 py-2.5 text-sm font-semibold tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(215,114,45,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c96422] hover:shadow-[0_18px_36px_rgba(199,104,32,0.28)] ${className}`}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon !== false && <Icon name={icon || 'arrow'} size={15} className="transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </Magnetic>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */

/**
 * Every section is titled the same way: a mono eyebrow that states what the
 * section *is*, a display headline, and an optional line of plain help text.
 *
 * Colors are set explicitly here (rather than inherited from `.eyebrow` /
 * `text-headline` / `text-paper` globals) because this component is used on
 * light, white-background sections throughout the site — the dark combo
 * backdrop builds its own heading markup separately rather than using this
 * component, so SectionHead only ever needs to read correctly on light
 * backgrounds.
 */
export function SectionHead({ eyebrow, title, lead, align = 'left', action, className = '' }) {
  return (
    <div
      className={`flex flex-col gap-5 ${
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <Reveal as="p" className="eyebrow mb-4 flex items-center gap-3 text-[#d7722d]">
            <span className="inline-block h-px w-8 bg-[#d7722d]/50" />
            {eyebrow}
          </Reveal>
        )}
        <Reveal as="h2" delay={0.05} className="text-headline text-balance text-[#32080B]">
          {title}
        </Reveal>
        {lead && (
          <Reveal as="p" delay={0.1} className="mt-4 max-w-xl text-pretty text-[0.98rem] leading-relaxed text-[#4c3a2d]/70">
            {lead}
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.14} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Price                                                               */
/* ------------------------------------------------------------------ */

/**
 * The shop sells at 80% off a printed list price, so the struck-through
 * figure is not decoration — it is the number on the paper the customer is
 * holding. It always appears beside the live price.
 */
export function Price({ price, mrp, size = 'md', className = '' }) {
  const scale = {
    sm: ['text-base', 'text-[0.68rem]'],
    md: ['text-xl', 'text-xs'],
    lg: ['text-3xl sm:text-4xl', 'text-sm'],
  }[size];

  return (
    <div className={`flex items-baseline gap-2.5 ${className}`}>
      <span className={`num font-semibold text-[#e2492c] ${scale[0]}`}>{money(price)}</span>
      {mrp > price && <span className={`num strike text-ink/35 ${scale[1]}`}>{money(mrp)}</span>}
    </div>
  );
}

export function DiscountTag({ value = 80, className = '' }) {
  return (
    <span
      className={`num inline-flex items-center rounded-pill bg-[#e2492c] px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white ${className}`}
    >
      {value}% off
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Quantity stepper                                                    */
/* ------------------------------------------------------------------ */

export function QtyStepper({ value, onChange, size = 'md', label = 'Quantity', className = '' }) {
  const dims = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const box = size === 'sm' ? 'w-9 text-sm' : 'w-11 text-base';

  return (
    <div
      className={`inline-flex items-center rounded-pill border border-[#e5e0da] bg-white ${className}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className={`${dims} grid place-items-center rounded-l-pill text-ink/60 transition-colors hover:bg-[#fff1d9] hover:text-[#d7722d]`}
        aria-label="Reduce quantity"
      >
        <Icon name="minus" size={14} />
      </button>
      <input
        type="number"
        value={value}
        min={0}
        max={99}
        onChange={(event) => onChange(Math.max(0, Math.min(99, Number(event.target.value) || 0)))}
        className={`${box} num bg-transparent text-center font-semibold text-ink focus:outline-none`}
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        className={`${dims} grid place-items-center rounded-r-pill text-ink/60 transition-colors hover:bg-[#fff1d9] hover:text-[#d7722d]`}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({ title, body, action }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-[#f0e6d8] bg-[#fffaf5] px-6 py-20 text-center shadow-[0_18px_40px_rgba(77,50,35,0.04)]">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d7722d]/30 bg-[#fff1d9] text-[#d7722d]">
        <Icon name="spark" size={20} />
      </span>
      <h3 className="text-title text-[#1f120b]">{title}</h3>
      {body && <p className="max-w-sm text-sm leading-relaxed text-[#4c3a2d]/70">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Loader                                                              */
/* ------------------------------------------------------------------ */

/** Route-level fallback: a fuse burning across the width of the page. */
export function RouteLoader({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6">
      <div className="flex w-full max-w-xs flex-col items-center gap-4">
        <div className="relative h-px w-full overflow-hidden bg-[#f0e6d8]">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-[#d7722d] to-transparent" />
        </div>
        <p className="eyebrow text-ink/40">{label}</p>
      </div>
    </div>
  );
}

/** Card-shaped placeholder used while a grid streams in. */
export function CardSkeleton() {
  return (
    <div className="rounded-card border border-[#f0e6d8] bg-white">
      <div className="shimmer aspect-[4/5] w-full" />
      <div className="space-y-3 p-5">
        <div className="shimmer h-3 w-2/3 rounded" />
        <div className="shimmer h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}