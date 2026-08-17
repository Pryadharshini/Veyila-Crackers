import { AnimatePresence, motion } from 'framer-motion';
import { CATEGORIES, FACETS, SORTS } from '@/lib/catalog';
import { useLockBody } from '@/hooks';
import Icon from '@/components/ui/Icon';

function Group({ title, children, note }) {
  return (
    <section className="border-b border-[#32080B]/20 py-5 first:pt-0 last:border-0">
      <h3 className="eyebrow mb-3.5 text-[#32080B]">{title}</h3>
      {children}
      {note && <p className="mt-3 text-[0.7rem] leading-relaxed text-[#32080B]/60">{note}</p>}
    </section>
  );
}

function Check({ checked, onChange, label, count }) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="flex items-center gap-2.5">
        <span
          className={`grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors ${
            checked ? 'border-[#32080B] bg-[#32080B] text-white' : 'border-[#32080B]/60 text-transparent group-hover:border-[#32080B]'
          }`}
        >
          <Icon name="check" size={10} strokeWidth={2.6} />
        </span>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span className={`text-sm transition-colors ${checked ? 'text-[#32080B]' : 'text-[#32080B]/70 group-hover:text-[#32080B]'}`}>
          {label}
        </span>
      </span>
      {count !== undefined && <span className="num shrink-0 text-2xs text-[#32080B]/55">{count}</span>}
    </label>
  );
}

/** The filter body, shared by the desktop rail and the mobile sheet. */
export function FilterBody({ filters, onToggle, onClear, activeCount }) {
  return (
    <div className="space-y-0">
      {activeCount > 0 && (
        <div className="flex items-center justify-between pb-4">
          <span className="num text-2xs uppercase tracking-widest text-[#32080B]/60">{activeCount} applied</span>
          <button type="button" onClick={onClear} className="text-2xs uppercase tracking-widest text-[#32080B] hover:underline">
            Clear all
          </button>
        </div>
      )}

      <Group title="Price band" note="Prices shown are after the 80% festival discount.">
        {FACETS.priceBands.map((band) => (
          <Check
            key={band.id}
            checked={filters.bands.includes(band.id)}
            onChange={() => onToggle('bands', band.id)}
            label={band.label}
            count={band.count}
          />
        ))}
      </Group>

      <Group title="Sold as">
        {FACETS.units.map((unit) => (
          <Check
            key={unit}
            checked={filters.units.includes(unit)}
            onChange={() => onToggle('units', unit)}
            label={unit}
          />
        ))}
      </Group>

      <Group title="Category">
        <div className="no-bar max-h-72 space-y-0 overflow-y-auto pr-1">
          {CATEGORIES.map((category) => (
            <Check
              key={category.id}
              checked={filters.categories.includes(category.id)}
              onChange={() => onToggle('categories', category.id)}
              label={category.name}
              count={category.count}
            />
          ))}
        </div>
      </Group>
    </div>
  );
}

/** Desktop rail. */
export function FilterRail(props) {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-32">
        <FilterBody {...props} />
      </div>
    </aside>
  );
}

/** Mobile bottom sheet. */
export function FilterSheet({ open, onClose, resultCount, ...props }) {
  useLockBody(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[62] bg-ink/80 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[63] max-h-[85vh] overflow-hidden rounded-t-3xl border-t border-ink-600 bg-ink-800 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between border-b border-ink-600 px-6 py-4">
              <h2 className="text-lg">Filter the list</h2>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-pill border border-ink-600 text-paper/70"
                aria-label="Close filters"
              >
                <Icon name="close" size={17} />
              </button>
            </div>
            <div className="no-bar max-h-[58vh] overflow-y-auto px-6 py-4">
              <FilterBody {...props} />
            </div>
            <div className="border-t border-ink-600 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="button" onClick={onClose} className="btn btn-gold w-full">
                Show {resultCount} {resultCount === 1 ? 'item' : 'items'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Sort menu plus the ledger/grid switch. */
export function ListControls({ sort, onSort, view, onView, onOpenFilters, activeCount, count }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="num text-2xs uppercase tracking-[0.18em] text-paper/40">
        {count} {count === 1 ? 'item' : 'items'}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className={`chip lg:hidden ${activeCount > 0 ? 'chip-on' : ''}`}
        >
          <Icon name="filter" size={13} />
          Filter{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>

        <label className="relative">
          <span className="sr-only">Sort by</span>
          <Icon
            name="sort"
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper/40"
          />
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value)}
            className="appearance-none rounded-pill border border-ink-600 bg-ink-800 py-2 pl-9 pr-8 font-mono text-2xs uppercase tracking-[0.14em] text-paper/70 transition-colors hover:border-gold/50 focus:outline-none"
          >
            {SORTS.map((option) => (
              <option key={option.id} value={option.id} className="bg-ink-800 font-sans normal-case tracking-normal">
                {option.label}
              </option>
            ))}
          </select>
          <Icon
            name="chevronDown"
            size={13}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-paper/40"
          />
        </label>

        <div className="flex items-center rounded-pill border border-ink-600 p-0.5" role="group" aria-label="View">
          {[
            ['sheet', 'rows', 'Sheet view'],
            ['grid', 'grid', 'Grid view'],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onView(id)}
              className={`grid h-8 w-9 place-items-center rounded-pill transition-colors ${
                view === id ? 'bg-gold text-ink' : 'text-paper/45 hover:text-paper'
              }`}
              aria-label={label}
              aria-pressed={view === id}
            >
              <Icon name={icon} size={15} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
