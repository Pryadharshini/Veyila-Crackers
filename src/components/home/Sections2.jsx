import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { COMBOS, PRODUCTS, TOTALS, getProduct } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { money, pad } from '@/lib/format';
import { SHOP } from '@/lib/shop';
import Icon from '@/components/ui/Icon';
import { ActionButton, Reveal, SectionHead } from '@/components/ui/primitives';
import { Glow } from '@/components/ui/Atmosphere';
import Ledger, { LedgerTotal } from '@/components/product/Ledger';
import ProductArt from '@/components/product/ProductArt';
import { ProductMedia } from '@/components/product/ProductCard';

/* ================================================================== */
/* Sheet preview — the signature moment of the homepage                */
/* ================================================================== */

export function SheetPreview() {
  const { openDrawer, totals } = useCart();
  const [shelf, setShelf] = useState('sparklers');

  const shelves = [
    ['sparklers', 'Sparklers'],
    ['flower-pots', 'Flower pots'],
    ['chakkarams', 'Chakkarams'],
    ['kids-special', 'Kids'],
    ['rockets', 'Rockets'],
  ];

  const rows = useMemo(
    () => PRODUCTS.filter((product) => product.categoryId === shelf).slice(0, 8),
    [shelf],
  );

  return (
    <section className="relative overflow-hidden bg-[#fdf8f0] py-24 lg:py-32">
      <img
        src="/assets/bc1.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 h-full w-full object-cover"
      />

      <div className="shell relative text-center">
        <Reveal
          as="p"
          className="mb-5 flex items-center justify-center gap-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d7722d]"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fff1d9] text-[#d7722d]">
            <Icon name="spark" size={14} strokeWidth={2.5} />
          </span>
          How buying here works
        </Reveal>

        <Reveal
          as="h2"
          delay={0.05}
          className="mx-auto max-w-2xl font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-bold leading-[1.1] text-balance text-ink"
        >
          Write <span className="text-[#e2492c]">the number</span> beside the name.
        </Reveal>

        <Reveal as="p" delay={0.1} className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-ink/55">
          Same as the paper list at the counter: find the line, put a figure in the requirement column, and the
          amount fills itself in. Nothing below is a mock-up — these rows go into your real order.
        </Reveal>

        <Reveal delay={0.16} className="mt-10 flex flex-wrap justify-center gap-2">
          {shelves.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setShelf(id)}
              className={`chip ${shelf === id ? 'chip-on' : ''}`}
              aria-pressed={shelf === id}
            >
              {label}
            </button>
          ))}
          <Link to="/products" className="chip">
            All {TOTALS.products} lines
            <Icon name="arrow" size={12} />
          </Link>
        </Reveal>

        <Reveal
          delay={0.22}
          className="mt-6 rounded-[1.75rem] border border-[#f0e6d8] bg-white p-2 shadow-[0_20px_45px_-30px_rgba(24,18,12,0.35)] sm:p-3"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={shelf}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              <Ledger products={rows} grouped={false} caption="A sample of the price list" dense />
            </motion.div>
          </AnimatePresence>
          <LedgerTotal onOpen={openDrawer} />
        </Reveal>

        <Reveal delay={0.28} className="mt-8 flex flex-wrap items-center gap-4">
          <ActionButton to="/products" variant="ember">
            Open the full sheet
          </ActionButton>
          <p className="text-sm text-ink/40">
            {totals.count > 0
              ? `${totals.lines} lines on your sheet so far.`
              : 'No account, no card. The order goes to the shop on WhatsApp.'}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
/* ================================================================== */
/* Combo boxes — "combo offers" card row + live detail panel below     */
/* ================================================================== */

/**
 * Picker card preview art, in priority order:
 *   1. combo.image — a real photo of the whole box, if we have one
 *   2. a 2×2 grid of real product photos (via ProductMedia, which itself
 *      falls back to the generated ProductArt drawing per-tile if a given
 *      product has no photo yet)
 *
 * So a combo shows up fully photographic as soon as `image` is added to
 * its record in the catalogue, and improves tile-by-tile before that as
 * individual product photos are added.
 */
function ComboArt({ combo, previewItems }) {
  if (combo.image) {
    return (
      <span className="mb-4 block aspect-square overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-[#fbe3bf] to-[#f2b76c] p-1.5">
        <img
          src={combo.image}
          alt={combo.name}
          loading="lazy"
          className="h-full w-full rounded-md object-cover"
        />
      </span>
    );
  }

  return (
    <span className="mb-4 grid aspect-square grid-cols-2 gap-1 overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-[#fbe3bf] to-[#f2b76c] p-1.5">
      {previewItems.map((piece) => {
        const product = getProduct(piece.slug);
        if (!product) return null;
        return (
          <span key={piece.slug} className="overflow-hidden rounded-md bg-white/40">
            <ProductMedia product={product} className="h-full w-full" />
          </span>
        );
      })}
    </span>
  );
}

/* ================================================================== */
/* Safety                                                              */
/* ================================================================== */

export const SAFETY = [
  {
    title: 'Burst in the open',
    body: 'Ground wheels and fountains need a flat patch clear of parked vehicles, dry leaves and awnings. Nothing on a balcony.',
  },
  {
    title: 'One at a time, one person',
    body: 'One adult lights, everyone else stands back. Two people lighting at once is how the majority of Diwali burns happen.',
  },
  {
    title: 'Water and sand within reach',
    body: 'A filled bucket of each, before the first cracker. Sand smothers a fountain that tips; water is for hands and clothes.',
  },
  {
    title: 'Never relight a dud',
    body: 'If it does not catch, leave it ten minutes, then soak it. Going back to a half-lit fuse is the single most dangerous thing you can do.',
  },
  {
    title: 'Rockets leave from a bottle',
    body: 'Wedge the stick in a bottle weighted with sand, pointed away from buildings. Never from the hand, never from a wall.',
  },
  {
    title: 'Store cool, store closed',
    body: 'Keep the boxes shut, off the floor and away from the kitchen. Take out only what you plan to burn that evening.',
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="relative overflow-hidden bg-[#fdfaf6] py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute right-8 top-8 h-40 w-40 rounded-full bg-[#f4c586]/10 blur-3xl" />
        <div className="absolute right-40 top-0 h-52 w-52 rounded-full bg-[#f4a65d]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1180px] px-3 sm:px-4 lg:px-5">
        <div className="mb-10 w-full text-center">
          <Reveal>
            <div className="relative mx-auto max-w-[1060px]">
              <div className="pointer-events-none absolute left-[-2.1rem] top-10 z-0 hidden -rotate-[11deg] rounded-[0.9rem] border border-[#d3ae6e] bg-[#32080B] px-4 py-2.5 shadow-[0_12px_22px_-15px_rgba(50,8,11,0.7)] md:block">
                <span className="block font-mono text-[0.56rem] font-bold uppercase tracking-[0.25em] text-[#f6e8d3]">
                  Very important
                </span>
                <span className="mt-1 block text-[0.45rem] font-medium uppercase tracking-[0.12em] text-[#f1c987]">
                  Safety note
                </span>
              </div>

              <div className="relative z-10">
                <p className="mb-5 inline-flex items-center justify-center gap-3 font-mono text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#d7722d]">
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    <span className="h-2.5 w-2.5 rounded-full border border-[#d7722d] bg-[#f8d7a3]" />
                  </span>
                  Safety first, always
                </p>

                <h2 className="mx-auto max-w-[1000px] font-display text-[clamp(2.3rem,4vw,4rem)] font-black leading-[0.96] tracking-[-0.05em] text-[#32080B]">
                  Every one of these came from something that went wrong on this street.
                </h2>

                <p className="mx-auto mt-6 max-w-[980px] text-[1.1rem] leading-relaxed text-ink/60">
                  We sell fireworks, so we are the last people who should be shy about this. Read these six points,
                  tell the children the second one twice, and have the evening you planned.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-[980px] rounded-[1.15rem] border border-[#d9b88c]/60 bg-[#32080B] px-4 py-3.5 text-left sm:text-center">
              <div className="flex items-center justify-center gap-3 sm:justify-center">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f0d4a1] text-[#FFFFFF]">
                  <Icon name="shield" size={17} />
                </span>
                <p className="text-[0.98rem] leading-relaxed text-white">
                  Burns need cool running water for 20 minutes — not ice, not toothpaste. Then a hospital.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ol className="grid gap-2 rounded-[1.8rem] border border-[#e7d0ae] bg-[#32080B] p-8 sm:grid-cols-2 xl:grid-cols-6">
            {SAFETY.map((rule, index) => (
              <li
                key={rule.title}
                className="group min-h-[220px] rounded-[1.3rem] border border-[#e9d3b3] bg-[#f8efe6] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f9f1e7]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-[#df6b32] bg-[#fff7ef] text-[0.72rem] font-normal text-[#df6b32]">
                    {pad(index + 1)}
                  </span>
                </div>

                <h3 className="mb-3 text-[1.06rem] font-semibold leading-snug text-ink">{rule.title}</h3>
                <p className="text-[0.82rem] leading-relaxed text-ink/45">{rule.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Testimonials                                                        */
/* ================================================================== */

const VOICES = [
  {
    quote:
      'I sent the sheet at eleven at night and had a reply by seven. Everything on the list was in the box, and the total was to the rupee.',
    name: 'Meenakshi R.',
    place: 'Madurai',
    order: '38 lines · Diwali 2025',
  },
  {
    quote:
      'We order for the whole apartment block, so the running total at the bottom is the thing. No spreadsheet, no calling back to check a rate.',
    name: 'Karthik S.',
    place: 'Coimbatore',
    order: '96 lines · Diwali 2025',
  },
  {
    quote:
      'Asked them to leave out anything loud because of my mother. They rang back, went through the list line by line, and swapped six items.',
    name: 'Fathima A.',
    place: 'Tirunelveli',
    order: '24 lines · Diwali 2025',
  },
  {
    quote:
      'Third year buying from the counter, first year doing it from the phone. Same rate as walking in, which I checked.',
    name: 'Prabhu V.',
    place: 'Virudhunagar',
    order: '51 lines · Diwali 2025',
  },
];

export function Testimonials() {
  return (
    <section
      className="relative overflow-hidden border-y border-[#f0e6d8] py-24 lg:py-28"
      style={{
        backgroundImage: "url('/assets/bc1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="shell">
        <SectionHead eyebrow="From last season" title="What people said after the boxes arrived" />
      </div>

      <div className="group mt-12 space-y-4">
        {[VOICES, [...VOICES].reverse()].map((row, rowIndex) => (
          <div key={rowIndex} className="edge-fade flex overflow-hidden pl-8 pr-8 sm:pl-12 sm:pr-12">
            <div
              className="flex shrink-0 gap-6 group-hover:[animation-play-state:paused]"
              style={{
                animation: `marquee ${rowIndex === 0 ? 52 : 64}s linear infinite`,
                animationDirection: rowIndex === 0 ? 'normal' : 'reverse',
              }}
            >
              {[...row, ...row].map((voice, index) => (
                <figure
                  key={`${voice.name}-${index}`}
                  className="w-[calc(100vw-5rem)] max-w-[24rem] shrink-0 rounded-card border border-[#f0e6d8] bg-[#fff5e6] p-6 sm:w-[20rem]"
                >
                  <Icon name="spark" size={16} className="mb-4 text-[#d7722d]/60" />
                  <blockquote className="text-pretty text-[0.9rem] leading-relaxed text-ink/70">
                    {voice.quote}
                  </blockquote>
                  <figcaption className="mt-5 flex flex-col gap-3 border-t border-[#f0e6d8] pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-0">
                    <span className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-ink">
                      {voice.name}
                      <span className="text-ink/35">{voice.place}</span>
                    </span>
                    <span className="num text-[0.62rem] uppercase tracking-wider text-ink/25 sm:text-right">{voice.order}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
/* ================================================================== */
/* FAQ                                                                 */
/* ================================================================== */

const FAQ_ITEMS = [
  {
    q: 'Can I order from the website?',
    a: 'Yes. Browse the price list, note the product names and numbers, and send the order to the shop on WhatsApp. We match the website price on the counter and confirm anything that is out of stock before dispatch.',
  },
  {
    q: 'Do you have minimum order rules?',
    a: 'For dispatch, orders above the minimum threshold qualify for carrier delivery. For pickup, there is no minimum basket size — you can collect from the counter any time during shop hours.',
  },
  {
    q: 'Can you suggest a safe mixed box?',
    a: 'Absolutely. Tell us your budget, the age group, the number of adults lighting, and whether you want loud or low-noise varieties. We will build a balanced set and list the exact items for you.',
  },
  {
    q: 'Where do deliveries go?',
    a: 'We send across Tamil Nadu and into Kerala, Karnataka and Andhra Pradesh, depending on the route and local restrictions. Share your pin code and we will say plainly whether we can send and what it would cost.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative scroll-mt-32 border-t border-[#f0e6d8] bg-[#fffaf3] py-24 lg:py-28">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Common questions"
            title="The usual things people ask before they place an order"
            lead="Straight answers, no sales fluff."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {FAQ_ITEMS.map((item, index) => (
            <Reveal key={item.q} delay={index * 0.05}>
              <div className="h-full rounded-card border border-[#f0e6d8] bg-white p-6 shadow-[0_18px_35px_-28px_rgba(35,24,18,0.45)]">
                <p className="mb-3 text-[0.7rem] font-mono font-bold uppercase tracking-[0.18em] text-[#d7722d]">
                  Q{index + 1}
                </p>
                <h3 className="text-lg font-semibold text-ink">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Closing call to action                                              */
/* ================================================================== */

export function ClosingCta() {
  const { totals, openDrawer } = useCart();

  return (
    <section className="relative overflow-hidden border-t border-[#f0e6d8] py-24 lg:py-32">
      <Glow className="left-1/2 top-0 -translate-x-1/2" color="rgba(226,59,38,.22)" size={800} />

      <div className="shell text-center">
        <Reveal>
          <p className="eyebrow mb-6 justify-center text-[#d7722d]">Ready when you are</p>
          <h2 className="mx-auto max-w-3xl text-display text-balance text-ink">
            Fill the sheet.
            <span className="block text-[#e2492c]">Send it. Done.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-pretty leading-relaxed text-ink/55">
            {totals.count > 0
              ? `You have ${totals.lines} lines and ${money(totals.subtotal)} on the sheet. Review it and send it across.`
              : 'No account, no card, no checkout queue. Just the list, your quantities, and a message to the counter.'}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {totals.count > 0 ? (
              <>
              <ActionButton
  to="/cart"
  variant="ember"
  className="!bg-[#32080B] !border-[#32080B] !px-8 !py-4"
>
  Review and send
</ActionButton>
<button
  type="button"
  onClick={openDrawer}
  className="btn btn-ghost !px-8 !py-4 !font-bold !bg-[#32080B] !text-white"
>
  Peek at the sheet
</button>
              </>
            ) : (
              <>
                <ActionButton to="/products" variant="ember" className="!px-8 !py-4">
                  Open the price list
                </ActionButton>
                <ActionButton to="/categories" variant="ghost" className="!px-8 !py-4">
                  Browse by shelf
                </ActionButton>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}