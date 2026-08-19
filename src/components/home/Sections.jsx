import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CATEGORIES, TOTALS, featuredProducts, getProduct, COMBOS } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { useCountUp, useReducedMotion } from '@/hooks';
import { money, pad } from '@/lib/format';
import { SHOP } from '@/lib/shop';
import Icon from '@/components/ui/Icon';
import { ActionButton, Price, Reveal, SectionHead } from '@/components/ui/primitives';
import { Glow } from '@/components/ui/Atmosphere';
import ProductArt from '@/components/product/ProductArt';
import ProductCard from '@/components/product/ProductCard';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================== */
/* 1 · Assurance strip                                                 */
/* ================================================================== */

const ASSURANCES = [
  ['check', 'Best price', 'Festival prices for everyone'],
  ['spark', 'Wide range', '300+ products for every celebration'],
  ['shield', 'Quality products', 'Carefully selected fireworks'],
  ['truck', 'Safe delivery', 'Reliable delivery across India'],
];

export function AssuranceStrip() {
  return (
    <section className="relative z-20 -mt-10 px-4 pb-4 pt-0 sm:-mt-12 sm:px-6 lg:-mt-14 lg:px-8">
      <div className="shell">
        <div className="rounded-[1.75rem] border border-[#f0e6d8] bg-white p-3 shadow-[0_20px_45px_-30px_rgba(24,18,12,0.45)] sm:p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ASSURANCES.map(([icon, title, body], index) => (
              <Reveal
                key={title}
                delay={index * 0.06}
                className="group relative flex min-h-[132px] items-center gap-4 rounded-[1.25rem] bg-white px-4 py-5 text-left sm:px-5"
              >
                {index !== 0 && <span className="absolute left-0 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-stone-200 lg:block" />}
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fff1d9] text-[#32080B] shadow-[inset_0_0_0_1px_rgba(50,8,11,0.08)]">
                  <Icon name={icon} size={24} strokeWidth={2.75} className="text-[#32080B]" filled={icon === 'check'} />
                </span>
                <div className="min-w-0">
                  <h3 className="mb-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#32080B]">
                    {title}
                  </h3>
                  <p className="text-[0.9rem] font-semibold leading-relaxed text-[#32080B]">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2 · Category rail — icon-grid style                                 */
/* ================================================================== */

function GlyphRocket({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M32 8c7 7 9 19 7 32l-7 6-7-6c-2-13 0-25 7-32Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="32" cy="24" r="3.5" fill="currentColor" />
      <path d="M25 38l-7 8M39 38l7 8M28 44l-3 10M36 44l3 10" stroke="#e2492c" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GlyphSparkler({ className }) {
  const rays = Array.from({ length: 7 }, (_, i) => {
    const angle = ((-70 + i * 23) * Math.PI) / 180;
    return {
      x2: 32 + Math.sin(angle) * 20,
      y2: 20 - Math.cos(angle) * 20,
      accent: i % 2 === 0,
    };
  });
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      {rays.map((r, i) => (
        <line key={i} x1="32" y1="20" x2={r.x2} y2={r.y2} stroke={r.accent ? '#e2492c' : 'currentColor'} strokeWidth="2" strokeLinecap="round" />
      ))}
      <path d="M32 22v32" stroke="#3a3230" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GlyphFlowerPot({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M22 50l4-28h12l4 28Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M19 50h26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 22V8M25 22l-5-11M39 22l5-11" stroke="#e2492c" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GlyphChakkar({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="12" stroke="#e2492c" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="3.5" fill="currentColor" />
    </svg>
  );
}

function GlyphFountain({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M23 52l6-30h6l6 30Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 22V8" stroke="#e2492c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 16l4 6M40 16l-4 6" stroke="#e2492c" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GlyphWheel({ className }) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      x1: 32 + Math.cos(angle) * 8,
      y1: 32 + Math.sin(angle) * 8,
      x2: 32 + Math.cos(angle) * 18,
      y2: 32 + Math.sin(angle) * 18,
      accent: i % 2 === 0,
    };
  });
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2.5" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.accent ? '#e2492c' : 'currentColor'} strokeWidth="2" />
      ))}
      <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
  );
}

function GlyphCombo({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="13" y="30" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <rect x="35" y="30" width="16" height="16" rx="2" stroke="#e2492c" strokeWidth="2.5" />
      <rect x="24" y="13" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function GlyphStarburst({ className }) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    return { x2: 32 + Math.cos(angle) * 22, y2: 32 + Math.sin(angle) * 22, accent: i % 2 === 0 };
  });
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      {rays.map((r, i) => (
        <line key={i} x1="32" y1="32" x2={r.x2} y2={r.y2} stroke={r.accent ? '#e2492c' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <circle cx="32" cy="32" r="6" fill="currentColor" />
    </svg>
  );
}

const GLYPH_RULES = [
  [/rocket/, GlyphRocket],
  [/sparkl/, GlyphSparkler],
  [/flower/, GlyphFlowerPot],
  [/chakkar|ground/, GlyphChakkar],
  [/fountain/, GlyphFountain],
  [/wheel/, GlyphWheel],
  [/combo/, GlyphCombo],
];

function CategoryGlyph({ category, className }) {
  const key = `${category.icon ?? ''} ${category.id ?? ''} ${category.name ?? ''}`.toLowerCase();
  const Match = GLYPH_RULES.find(([pattern]) => pattern.test(key))?.[1] ?? GlyphStarburst;
  return <Match className={className} />;
}

const CATEGORY_IMAGES = {
  'flash-light-crackers': '/assets/shopby/1.png',
  'deluxe-crackers': '/assets/shopby/2.png',
  'bijili-crackers': '/assets/shopby/3.png',
  'flower-pots': '/assets/shopby/4.png',
  'mud-pots': '/assets/shopby/5.png',
};

export function CategoryRail() {
  const scrollerRef = useRef(null);
  const homeCategories = CATEGORIES.slice(0, 5);

  const scrollByAmount = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white py-14 lg:py-20">
      <div className="shell">
        <div className="relative mb-8 flex w-full items-center justify-center">
          <div className="flex items-center gap-3 text-[#d7722d]">
            <span className="text-base leading-none">✦</span>
            <h2 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-[#32080B] sm:text-2xl">
              Shop by categories
            </h2>
            <span className="text-base leading-none">✦</span>
          </div>

          <Link
            to="/categories"
            className="absolute right-0 hidden items-center gap-2 font-mono text-[0.70rem] uppercase tracking-[0.18em] text-[#32080B] transition-colors hover:text-ember sm:flex"
          >
            View all categories
            <Icon name="arrow" size={13} />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1300px]">
        <div
  ref={scrollerRef}
  className="grid auto-cols-[calc(100%-5rem)] grid-flow-col gap-5 overflow-x-auto scroll-smooth pl-8 pr-6 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden sm:auto-cols-[46%] sm:px-8 md:auto-cols-[33%] lg:auto-cols-[calc((100%-4*1.25rem)/5)] lg:px-10"
  style={{ scrollbarWidth: 'none', scrollPaddingLeft: '2rem' }}
>
          {homeCategories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group flex snap-start flex-col items-center rounded-[1.6rem] border border-[#f5dfc0] bg-[#32080B] px-4 py-6 text-center shadow-[0_10px_24px_-20px_rgba(24,18,12,0.4)] transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="mb-4 grid h-36 w-36 place-items-center overflow-hidden rounded-2xl bg-[#fbe3bf] transition-colors group-hover:bg-[#f8d7a3] sm:h-44 sm:w-44">
                <img
                  src={CATEGORY_IMAGES[category.id] ?? '/assets/download.jpg'}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full object-cover ${category.id === 'flash-light-crackers' ? 'mix-blend-multiply' : ''}`}
                  aria-hidden="true"
                />
              </span>
              <h3 className="text-[1rem] font-semibold leading-snug text-white transition-colors group-hover:text-ember">
                {category.name}
              </h3>
              <p className="ta mt-0.5 truncate text-xs text-white">{category.nameTa}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ================================================================== */
/* 2b · Combo showcase — "combo offers" card rail on the bc.png backdrop */
/* ================================================================== */

/**
 * Pack-shot photography for each combo box, keyed by the combo's actual
 * `id`/`slug` from the catalogue data (kids-safe-box, family-evening,
 * street-full, sky-premium) — NOT by a guessed human-readable name. Files
 * live in `public/assets/combo/`.
 *
 * If a combo has no photo listed here, the card quietly falls back to the
 * generated 2x2 ProductArt preview built from that combo's items.
 */
const COMBO_IMAGES = {
  'kids-safe-box': '/assets/combo/1.png',
  'family-evening': '/assets/combo/2.png',
  'street-full': '/assets/combo/3.png',
  'sky-premium': '/assets/combo/4.png',
};

function comboImage(combo) {
  return COMBO_IMAGES[combo.slug] ?? COMBO_IMAGES[combo.id] ?? null;
}

/**
 * "Combo offers for every celebration" strip: a fireworks-lit maroon backdrop
 * (bc.png), a centred title with "View all combos" pinned right, and cream
 * cards carrying the box pack-shot, name, tagline, struck-through MRP beside
 * the discounted price, and a corner-stamped "XX% OFF" ribbon. Nav arrows sit
 * on the outer edges.
 *
 * Stacking note: the section is `isolate` so the two negative-z backdrop
 * layers stay inside this section's stacking context instead of sliding
 * behind the page background.
 *
 * Pulls directly from COMBOS (same data source as the /combos page), so the
 * cards always match what's actually being sold.
 */
export function ComboShowcase() {
  const scrollerRef = useRef(null);

  const scrollByAmount = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.75, behavior: 'smooth' });
  };

  if (!COMBOS || COMBOS.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden py-14 lg:py-20">
      <div
        className="absolute inset-0 -z-20 bg-[#2a0b0b] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/bc.png)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, rgba(38,10,10,.72) 0%, rgba(46,12,12,.58) 45%, rgba(38,10,10,.86) 100%)' }}
        aria-hidden="true"
      />

      <div className="shell">
        <div className="relative mb-9 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gold">
            <span className="text-base leading-none">✦</span>
            <h2 className="text-center font-display text-xl font-bold uppercase tracking-[0.05em] text-white sm:text-2xl">
              Combo offers for every celebration
            </h2>
            <span className="text-base leading-none">✦</span>
          </div>

          <Link
            to="/combos"
            className="absolute right-0 hidden items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold transition-colors hover:text-white sm:flex"
          >
            View all combos
            <Icon name="arrow" size={13} />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          className="absolute left-2 top-[calc(50%-1.25rem)] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/90 text-ink shadow-[0_10px_24px_-16px_rgba(0,0,0,0.6)] transition hover:bg-white"
          aria-label="Scroll combo boxes left"
        >
          <Icon name="arrow" size={16} className="rotate-180" />
        </button>

        <div
          ref={scrollerRef}
          className="grid auto-cols-[calc(100%-5rem)] grid-flow-col gap-5 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden sm:auto-cols-[46%] sm:px-12 md:auto-cols-[31%] lg:auto-cols-[calc((100%-3*1.25rem)/4)] lg:px-16"
          style={{ scrollbarWidth: 'none' }}
        >
          {COMBOS.map((combo, index) => {
            const image = comboImage(combo);
            const isFirst = index === 0;
            const isLast = index === COMBOS.length - 1;

            return (
              <Link
                key={combo.id}
                to={`/combos#${combo.slug}`}
                className={`group relative flex snap-start flex-col rounded-[1.5rem] border border-white/10 bg-[#fff8ee] p-4 pb-5 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.65)] transition-transform duration-300 hover:-translate-y-1 ${
                  isFirst ? 'ml-8 sm:ml-0' : ''
                } ${isLast ? 'mr-8 sm:mr-0' : ''}`}
              >
                {image ? (
                  <span className="mb-4 grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-[#fff6e6] to-[#fbe3bf] p-2">
                    <img
                      src={image}
                      alt={combo.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                ) : (
                  <span className="mb-4 grid aspect-[4/3] grid-cols-2 gap-1 overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-[#fbe3bf] to-[#f2b76c] p-1.5">
                    {combo.items.slice(0, 4).map((piece) => {
                      const product = getProduct(piece.slug);
                      if (!product) return null;
                      return (
                        <span key={piece.slug} className="overflow-hidden rounded-md bg-white/40">
                          <ProductArt art={product.art} hue={product.hue} seed={product.slug} className="h-full w-full" />
                        </span>
                      );
                    })}
                  </span>
                )}

                <h3 className="line-clamp-1 text-[1rem] font-semibold leading-snug text-ink transition-colors group-hover:text-ember">
                  {combo.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-[0.8rem] leading-relaxed text-ink/45">
                  {combo.tagline}
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="num text-sm text-ink/35 line-through">{money(combo.mrp)}</span>
                  <span className="num text-lg font-bold text-[#e2492c]">{money(combo.price)}</span>
                </div>

                <span className="absolute bottom-0 right-0 rounded-tl-xl rounded-br-[1.5rem] bg-[#f5a623] px-3.5 py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.02em] text-white shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.3)]">
                  {combo.discount}% off
                </span>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          className="absolute right-2 top-[calc(50%-1.25rem)] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/90 text-ink shadow-[0_10px_24px_-16px_rgba(0,0,0,0.6)] transition hover:bg-white"
          aria-label="Scroll combo boxes right"
        >
          <Icon name="arrow" size={16} />
        </button>
      </div>

      <div className="shell">
        <Link
          to="/combos"
          className="mt-6 flex items-center justify-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold transition-colors hover:text-white sm:hidden"
        >
          View all combos
          <Icon name="arrow" size={13} />
        </Link>
      </div>
    </section>
  );
}
/* ================================================================== */
/* 3 · Editorial feature — one product, told properly                  */
/* ================================================================== */

export function EditorialFeature() {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const { add } = useCart();

  const hero = featuredProducts()[0] ?? getProduct(CATEGORIES[0]?.products[0]);

  useEffect(() => {
    if (reduced || !hero) return undefined;
    const context = gsap.context(() => {
      gsap.to('[data-feature-art]', {
        rotate: 14,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.from('[data-feature-line]', {
        yPercent: 110,
        opacity: 0,
        stagger: 0.09,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      });
    }, root);
    return () => context.revert();
  }, [reduced, hero]);

  if (!hero) return null;

  return (
    <section ref={root} className="relative overflow-hidden border-y border-[#f0e6d8] bg-[#faf3e6] py-24 lg:py-32">
      <Glow className="-right-32 top-1/3" color="rgba(226,73,44,.12)" size={560} />

      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="relative order-2 lg:order-1">
          <p className="eyebrow mb-6 text-[#d7722d]">Line {pad(hero.sno, 3)} · Best saving on the sheet</p>

          <h2 className="text-headline text-ink">
            {hero.name.split(' ').map((word, index) => (
              <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
                <span data-feature-line className="inline-block pr-[0.22em]">
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <p className="ta mt-2 text-xl text-[#d7722d]/80">{hero.nameTa}</p>

          <p className="mt-7 max-w-md text-pretty leading-relaxed text-ink/55">
            {hero.category} — {CATEGORIES.find((c) => c.id === hero.categoryId)?.blurb}
          </p>

          <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-y border-[#eadfce] py-6">
            {[
              ['Sold as', hero.unit],
              ['You save', money(hero.saving)],
              ['List price', money(hero.mrp)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="eyebrow mb-1.5 text-[#d7722d]">{label}</dt>
                <dd className="num text-lg font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Price price={hero.price} mrp={hero.mrp} size="lg" />
            <button type="button" onClick={() => add(hero.slug, 1, { open: true })} className="btn btn-ember">
              Add to the sheet
              <Icon name="plus" size={15} />
            </button>
            <Link
              to={`/product/${hero.slug}`}
              className="font-mono text-2xs uppercase tracking-[0.18em] text-ink/50 underline-offset-4 hover:text-[#d7722d] hover:underline"
            >
              Full details
            </Link>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e2492c]/15 via-transparent to-[#f1b93b]/20 blur-2xl" />
            <div data-feature-art className="relative h-full w-full">
              <ProductArt art={hero.art} hue={hero.hue} seed={hero.slug} label={hero.name} className="h-full w-full" />
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -18 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -11 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.25 }}
            className="absolute -bottom-2 left-2 grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-[#e2492c]/60 bg-white/95 shadow-[0_10px_24px_-16px_rgba(24,18,12,0.4)] backdrop-blur-sm sm:left-8"
          >
            <span className="text-center leading-none">
              <span className="num block font-display text-2xl font-bold text-[#e2492c]">{hero.discount}%</span>
              <span className="block font-mono text-[0.52rem] uppercase tracking-[0.18em] text-ink/45">off list</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 4 · Popular picks                                                   */
/* ================================================================== */

export function PopularPicks() {
  const products = featuredProducts().slice(0, 5);

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="shell">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#d7722d]">
            <span className="text-base leading-none">✦</span>
            <h2 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-[#32080B] sm:text-2xl">
              Popular fireworks
            </h2>
            <span className="text-base leading-none">✦</span>
          </div>

          <Link
            to="/products"
            className="absolute right-0 hidden items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#d76d2d] transition-colors hover:text-ember sm:flex"
          >
            View all products
            <Icon name="arrow" size={13} />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>

        <Link
          to="/products"
          className="mt-6 flex items-center justify-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#32080B] transition-colors hover:text-ember sm:hidden"
        >
          View all products
          <Icon name="arrow" size={13} />
        </Link>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5 · The counted facts                                               */
/* ================================================================== */

function Stat({ value, label, prefix = '', suffix = '', icon = 'spark', iconType = 'glyph' }) {
  const [ref, display] = useCountUp(value);

  return (
    <div
      ref={ref}
      className="flex h-full min-h-[240px] max-w-[18rem] flex-col justify-center rounded-[1.5rem] border border-[#f0e6d8] bg-white/80 p-4 shadow-[0_18px_40px_rgba(46,31,20,0.04)] backdrop-blur-[2px] sm:p-5"
    >
      <div className="mb-4 flex items-center justify-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-[#f2d9b5] bg-[#fff4e0] text-[#d7722d] shadow-inner shadow-[#f4c178]/15 sm:h-16 sm:w-16">
          {iconType === 'text' ? (
            <span className="font-display text-[1.7rem] font-bold leading-none">{icon}</span>
          ) : (
            <Icon name={icon} size={22} strokeWidth={1.8} />
          )}
        </span>
      </div>

      <p className="num text-center font-display text-[clamp(2.2rem,3.2vw,3.6rem)] font-bold leading-[0.9] text-ink">
        {prefix}
        {display.toLocaleString('en-IN')}
        {suffix}
      </p>
      <p className="mt-3 text-center text-[0.82rem] leading-relaxed text-ink/60 sm:text-[0.9rem]">{label}</p>
    </div>
  );
}

export function ShopStory() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const context = gsap.context(() => {
      gsap.to('[data-story-bg]', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  const years = new Date().getFullYear() - SHOP.since;

  return (
    <section ref={root} className="relative overflow-hidden bg-[#faf3e6] py-24 lg:py-32">
      <img
        src="/assets/bc2.png"
        alt=""
        loading="lazy"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-60"
        aria-hidden="true"
      />
      <Glow className="-left-32 bottom-0" color="rgba(241,185,59,.14)" size={480} />

      <div className="shell relative z-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow mb-6 text-[#d7722d]">Premium Fireworks. Honest Prices.</p>
            <h2 className="text-headline text-balance text-[#32080B]">
              From our shop counter to your celebration.
            </h2>
            <div className="mt-7 space-y-4 text-pretty leading-relaxed text-ink/55">
              <p>
                Veiyila Crackers is a trusted family firecracker shop, not a warehouse. Every Diwali season, we
                carefully handpick quality fireworks from leading manufacturers and offer them at transparent prices.
              </p>
              <p>
                Browse the complete price list, explore festive combos, and place your order in just a few taps. What
                you see on the website is exactly what you get—no hidden charges, no unnecessary markups.
              </p>
              <p>
                Celebrate brighter with safe, quality crackers delivered with care, making every festival memorable for
                your family.
              </p>
            </div>
            <ActionButton to="/products" variant="outline" className="mt-8">
              EXPLORE PRICE LIST →
            </ActionButton>
          </Reveal>

          <Reveal delay={0.12} className="grid grid-cols-2 gap-5 self-center">
            <Stat
              value={TOTALS.products}
              label="Lines carried this season, all in stock at the counter."
              icon="grid"
            />
            <Stat
              value={80}
              suffix="%"
              label="Off the printed list price, on every single line."
              icon="%"
              iconType="text"
            />
            <Stat
              value={years}
              label={`Diwalis served from the same address since ${SHOP.since}.`}
              icon="flame"
            />
            <Stat
              value={TOTALS.categories}
              label="Shelves, from single sound crackers to 240-shot cakes."
              icon="spark"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );

}