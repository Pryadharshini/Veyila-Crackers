import { Link, Navigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Page, { MobileOrderBar } from '@/components/layout/Page';
import { CATEGORIES, TOTALS, getCategory, productsIn } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { money, pad } from '@/lib/format';
import Icon from '@/components/ui/Icon';
import { ActionButton, Reveal } from '@/components/ui/primitives';
import ProductCard from '@/components/product/ProductCard';
import Ledger, { LedgerTotal } from '@/components/product/Ledger';

/* ================================================================== */
/* Palette                                                             */
/* ================================================================== */

/**
 * Four colours, no gradients. Every surface on this page is one of these
 * flat fills — the old `card-night` / `ink-600` / `paper/xx` tokens carried
 * a grey cast and a gradient, so they're replaced with literals here.
 *
 *   BLACK  — page-level wells and text sitting on yellow
 *   MAROON — every card and panel fill
 *   YELLOW — the only accent: numbers, rules, hover, active states
 *   WHITE  — headings; secondary copy is the same white at lower opacity,
 *            which stays warm against maroon instead of going grey
 */
const BLACK = '#0A0506';
const MAROON = '#32080B';
const YELLOW = '#FFC93C';

/* ================================================================== */
/* Index                                                               */
/* ================================================================== */

/**
 * The shelves, laid out as an index rather than a grid of equal tiles: the
 * larger shelves get a wider cell, so the page shows you at a glance where
 * the depth is. Sizes come from the item counts, not from a design choice.
 *
 * No artwork on these cards — the shelf name, its Tamil name, and the line
 * count carry the whole card, so the type does the work instead of a thumbnail.
 */
export default function Categories() {
  const max = Math.max(...CATEGORIES.map((c) => c.count));

  return (
    <Page
      title={`All ${TOTALS.categories} categories | Veyila Crackers`}
      description={`Browse ${TOTALS.products} Sivakasi crackers across ${TOTALS.categories} shelves — sparklers, flower pots, chakkarams, bombs, rockets, multi-shot cakes and more.`}
      canonical="/categories"
      trail={[{ label: 'Categories' }]}
      eyebrow={<span className="text-[#32080B]">{TOTALS.categories} shelves</span>}
      heading={<span className="text-[#32080B]">Browse by shelf</span>}
      lead={
        <span className="text-[#32080B]/70">
          The counter is arranged the same way. Bigger cells hold more lines — that's not decoration, it's the stock.
        </span>
      }
    >
      <div className="shell pb-24">
        <div className="grid auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => {
            const wide = category.count >= max * 0.6;
            return (
              <Reveal
                key={category.id}
                delay={Math.min(index, 9) * 0.04}
                className={wide ? 'sm:col-span-2' : ''}
              >
                <Link
                  to={`/categories/${category.id}`}
                  className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#FFC93C]/20 bg-[#32080B] p-6 transition-colors duration-300 hover:border-[#FFC93C]/70"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="num mb-3 block text-2xs text-[#FFC93C]/70">{pad(index + 1)}</span>
                      <h2 className="text-title text-white transition-colors group-hover:text-[#FFC93C]">
                        {category.name}
                      </h2>
                      <p className="ta mt-1 text-sm text-white/55">{category.nameTa}</p>
                    </div>

                    <span className="shrink-0 text-right leading-none">
                      <span className="num block font-display text-3xl font-bold text-[#FFC93C]">
                        {category.count}
                      </span>
                      <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/45">
                        lines
                      </span>
                    </span>
                  </div>

                  <p className={`mt-5 text-pretty text-[0.85rem] leading-relaxed text-white/60 ${wide ? 'max-w-lg' : ''}`}>
                    {category.blurb}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-[#FFC93C]/20 pt-4">
                    <span className="num text-2xs uppercase tracking-widest text-white/55">
                      From <span className="text-[#FFC93C]">{money(category.from)}</span>
                    </span>
                    <Icon
                      name="arrow"
                      size={15}
                      className="text-[#FFC93C]/50 transition-all group-hover:translate-x-1 group-hover:text-[#FFC93C]"
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>

      <MobileOrderBar />
    </Page>
  );
}

/* ================================================================== */
/* Single shelf                                                        */
/* ================================================================== */

export function CategoryDetail() {
  const { id } = useParams();
  const category = getCategory(id);
  const { openDrawer, addMany } = useCart();
  const [view, setView] = useState('sheet');

  if (!category) return <Navigate to="/categories" replace />;

  const products = productsIn(category.id);
  const cheapest = Math.min(...products.map((p) => p.price));
  const dearest = Math.max(...products.map((p) => p.price));
  const index = CATEGORIES.findIndex((c) => c.id === category.id);
  const previous = CATEGORIES[index - 1];
  const next = CATEGORIES[index + 1];

  return (
    <Page
      title={`${category.name} — ${products.length} crackers | Veyila Crackers`}
      description={`${category.blurb} ${products.length} lines from ${money(cheapest)}, all at 80% off the printed list.`}
      canonical={`/categories/${category.id}`}
      trail={[{ to: '/categories', label: 'Categories' }, { label: category.name }]}
      eyebrow={
        <span className="text-[#FFC93C]">
          Shelf {pad(index + 1)} of {CATEGORIES.length}
        </span>
      }
      heading={<span className="text-white">{category.name}</span>}
      lead={<span className="text-white/60">{category.blurb}</span>}
    >
      <div className="shell pb-24">
        <p className="ta -mt-4 mb-8 text-lg text-[#FFC93C]/80">{category.nameTa}</p>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FFC93C]/20 bg-[#32080B] px-5 py-4">
          <dl className="flex flex-wrap gap-x-10 gap-y-3">
            {[
              ['Lines', products.length],
              ['From', money(cheapest)],
              ['Up to', money(dearest)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="eyebrow mb-1 text-[#FFC93C]">{label}</dt>
                <dd className="num text-base font-semibold text-white">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addMany(products.slice(0, 5).map((p) => ({ slug: p.slug, qty: 1 })))}
              className="flex items-center gap-1.5 rounded-pill border border-[#FFC93C] px-3.5 py-1.5 font-mono text-2xs uppercase tracking-[0.16em] text-[#FFC93C] transition-colors hover:bg-[#FFC93C] hover:text-[#0A0506]"
            >
              <Icon name="plus" size={12} />
              Add first five
            </button>
            <div className="flex items-center rounded-pill border border-[#FFC93C]/30 bg-[#0A0506] p-0.5">
              {[
                ['sheet', 'rows'],
                ['grid', 'grid'],
              ].map(([id_, icon]) => (
                <button
                  key={id_}
                  type="button"
                  onClick={() => setView(id_)}
                  className={`grid h-8 w-9 place-items-center rounded-pill transition-colors ${
                    view === id_ ? 'bg-[#FFC93C] text-[#0A0506]' : 'text-white/50 hover:text-white'
                  }`}
                  aria-label={`${id_} view`}
                  aria-pressed={view === id_}
                >
                  <Icon name={icon} size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>
        ) : (
          <>
            <Ledger products={products} grouped={false} caption={`${category.name} price list`} />
            <LedgerTotal onOpen={openDrawer} />
          </>
        )}

        {/* shelf-to-shelf navigation, in the order of the printed list */}
        <nav className="mt-16 grid gap-4 border-t border-[#FFC93C]/25 pt-8 sm:grid-cols-2">
          {previous ? (
            <Link to={`/categories/${previous.id}`} className="group flex items-center gap-4">
              <Icon
                name="chevron"
                size={16}
                className="rotate-180 text-[#FFC93C]/50 transition-colors group-hover:text-[#FFC93C]"
              />
              <span>
                <span className="eyebrow block text-[#FFC93C]">Previous shelf</span>
                <span className="text-base text-white transition-colors group-hover:text-[#FFC93C]">{previous.name}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/categories/${next.id}`} className="group flex items-center justify-end gap-4 text-right">
              <span>
                <span className="eyebrow block text-[#FFC93C]">Next shelf</span>
                <span className="text-base text-white transition-colors group-hover:text-[#FFC93C]">{next.name}</span>
              </span>
              <Icon name="chevron" size={16} className="text-[#FFC93C]/50 transition-colors group-hover:text-[#FFC93C]" />
            </Link>
          )}
        </nav>

        <div className="mt-12 text-center">
          <ActionButton to="/categories" variant="ghost">
            All {CATEGORIES.length} shelves
          </ActionButton>
        </div>
      </div>

      <MobileOrderBar />
    </Page>
  );
}