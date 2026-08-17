import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '@/components/layout/Page';
import { MobileOrderBar } from '@/components/layout/Page';
import { CATEGORIES, TOTALS, queryProducts } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import Icon from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/primitives';
import Ledger, { LedgerTotal } from '@/components/product/Ledger';
import ProductCard from '@/components/product/ProductCard';
import { FilterRail, FilterSheet, ListControls } from '@/components/product/Filters';

/* ================================================================== */
/* Palette                                                             */
/* ================================================================== */

/**
 * Same four flat colours as the categories page — black wells, maroon
 * panels, yellow as the only accent, white type. No gradients, and no
 * `paper/xx` or `ink-600` tokens, both of which read grey.
 */
const BLACK = '#0A0506';
const MAROON = '#32080B';
const YELLOW = '#FFC93C';

/* Filters live in the URL so a filtered list can be sent to someone. */
const readList = (params, key) => (params.get(key) ? params.get(key).split(',').filter(Boolean) : []);

const PAGE_SIZE = 36;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const { openDrawer } = useCart();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const query = params.get('q') ?? '';
  const sort = params.get('sort') ?? 'sheet';
  const view = params.get('view') ?? 'sheet';

  const filters = useMemo(
    () => ({
      categories: readList(params, 'cat'),
      bands: readList(params, 'band'),
      units: readList(params, 'unit'),
    }),
    [params],
  );

  const results = useMemo(
    () => queryProducts({ query, sort, ...filters }),
    [query, sort, filters],
  );

  useEffect(() => setLimit(PAGE_SIZE), [query, sort, filters]);

  const patch = useCallback(
    (updates) => {
      const next = new URLSearchParams(params);
      for (const [key, value] of Object.entries(updates)) {
        if (!value || (Array.isArray(value) && value.length === 0)) next.delete(key);
        else next.set(key, Array.isArray(value) ? value.join(',') : value);
      }
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const toggle = useCallback(
    (group, value) => {
      const key = { categories: 'cat', bands: 'band', units: 'unit' }[group];
      const current = readList(params, key);
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      patch({ [key]: next });
    },
    [params, patch],
  );

  const clear = useCallback(() => patch({ cat: null, band: null, unit: null, q: null }), [patch]);

  const activeCount = filters.categories.length + filters.bands.length + filters.units.length + (query ? 1 : 0);
  const visible = view === 'grid' ? results.slice(0, limit) : results;

  const chips = [
    ...(query ? [{ label: `“${query}”`, onRemove: () => patch({ q: null }) }] : []),
    ...filters.categories.map((id) => ({
      label: CATEGORIES.find((c) => c.id === id)?.name ?? id,
      onRemove: () => toggle('categories', id),
    })),
    ...filters.bands.map((id) => ({ label: id.replace(/-/g, ' '), onRemove: () => toggle('bands', id) })),
    ...filters.units.map((unit) => ({ label: unit, onRemove: () => toggle('units', unit) })),
  ];

  return (
    <Page
      title={`Price list — ${TOTALS.products} crackers | Veyila Crackers`}
      description={`The complete Veyila Crackers price list: ${TOTALS.products} lines across ${TOTALS.categories} categories, all at 80% off. Fill in your quantities and send the order on WhatsApp.`}
      canonical="/products"
      trail={[{ label: 'Price list' }]}
      eyebrow={
        <span className="text-[#32080B]">
          {TOTALS.categories} shelves · {TOTALS.products} lines
        </span>
      }
      heading={<span className="text-[#32080B]">The whole price list</span>}
      lead={
        <span className="text-[#32080B]/70">
          Exactly what's printed on the sheet at the counter, in the same order. Put a number in the requirement column
          and the total keeps itself.
        </span>
      }
      aside={
        <div className="rounded-xl border border-[#FFC93C]/20 bg-[#32080B] px-5 py-4">
          <p className="eyebrow mb-1.5 text-[#FFC93C]">Range</p>
          <p className="num text-lg font-semibold text-white">
            {money(TOTALS.lowest)} – {money(TOTALS.highest)}
          </p>
          <p className="mt-0.5 text-xs text-white/50">per pack, after discount</p>
        </div>
      }
    >
      <div className="shell pb-24">
        <div className="flex gap-12">
          <FilterRail filters={filters} onToggle={toggle} onClear={clear} activeCount={activeCount} />

          <div className="min-w-0 flex-1">
            <ListControls
              sort={sort}
              onSort={(value) => patch({ sort: value === 'sheet' ? null : value })}
              view={view}
              onView={(value) => patch({ view: value === 'sheet' ? null : value })}
              onOpenFilters={() => setSheetOpen(true)}
              activeCount={activeCount}
              count={results.length}
            />

            {chips.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={chip.onRemove}
                    className="flex items-center gap-1.5 rounded-pill bg-[#FFC93C] px-3 py-1.5 font-mono text-2xs uppercase tracking-[0.14em] text-[#0A0506] transition-colors hover:bg-white"
                  >
                    {chip.label}
                    <Icon name="close" size={11} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clear}
                  className="text-2xs uppercase tracking-widest text-white/55 underline-offset-4 transition-colors hover:text-[#FFC93C] hover:underline"
                >
                  Reset
                </button>
              </div>
            )}

            {results.length === 0 ? (
              <EmptyState
                title={<span className="text-white">Nothing matches those filters</span>}
                body={
                  <span className="text-white/60">
                    Loosen a price band or clear the categories — the full list has {TOTALS.products} lines and one of
                    them is probably the one you want.
                  </span>
                }
                action={
                  <button
                    type="button"
                    onClick={clear}
                    className="rounded-pill bg-[#FFC93C] px-5 py-2.5 font-mono text-2xs font-bold uppercase tracking-[0.16em] text-[#0A0506] transition-colors hover:bg-white"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {view === 'grid' ? (
                    <>
                      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {visible.map((product, index) => (
                          <ProductCard key={product.slug} product={product} index={index} />
                        ))}
                      </div>
                      {limit < results.length && (
                        <div className="mt-10 text-center">
                          <button
                            type="button"
                            onClick={() => setLimit((value) => value + PAGE_SIZE)}
                            className="rounded-pill border border-[#FFC93C] px-5 py-2.5 font-mono text-2xs uppercase tracking-[0.16em] text-[#FFC93C] transition-colors hover:bg-[#FFC93C] hover:text-[#0A0506]"
                          >
                            Show {Math.min(PAGE_SIZE, results.length - limit)} more
                          </button>
                          <p className="num mt-3 text-2xs uppercase tracking-widest text-white/45">
                            {limit} of {results.length}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Ledger products={results} grouped={sort === 'sheet'} caption="Veyila Crackers price list" />
                      <LedgerTotal onOpen={openDrawer} />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        resultCount={results.length}
        filters={filters}
        onToggle={toggle}
        onClear={clear}
        activeCount={activeCount}
      />

      <MobileOrderBar />
    </Page>
  );
}