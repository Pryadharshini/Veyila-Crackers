import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CATEGORIES, suggest } from '@/lib/catalog';
import { useDebounced, useEscape, useLockBody } from '@/hooks';
import { money } from '@/lib/format';
import Icon from '@/components/ui/Icon';
import ProductArt from '@/components/product/ProductArt';

/** Things people actually type into a cracker shop's search box. */
const QUICK = ['sparkler', 'rocket', 'flower pot', 'chakkar', 'bomb', 'kids', '10 shot'];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const debounced = useDebounced(query, 130);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useLockBody(open);
  useEscape(onClose, open);

  const results = useMemo(() => suggest(debounced, 8), [debounced]);
  const categoryHits = useMemo(() => {
    if (!debounced.trim()) return [];
    const needle = debounced.toLowerCase();
    return CATEGORIES.filter(
      (c) => c.name.toLowerCase().includes(needle) || c.nameTa.toLowerCase().includes(needle),
    ).slice(0, 3);
  }, [debounced]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 90);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => setCursor(0), [debounced]);

  const go = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (results[cursor]) go(results[cursor].slug);
      else if (query.trim()) {
        onClose();
        navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-[70] bg-ink/85 backdrop-blur-xl"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <motion.div
            initial={{ y: -26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto mt-[8vh] w-[min(46rem,92vw)] overflow-hidden rounded-card border border-ink-600 bg-ink-800 shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-ink-600 px-5">
              <Icon name="search" size={19} className="shrink-0 text-gold" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Name, Tamil name, or line number…"
                className="h-16 flex-1 bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
                aria-label="Search the price list"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-pill border border-ink-600 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-white/70"
              >
                Esc
              </button>
            </div>

            <div className="no-bar max-h-[58vh] overflow-y-auto">
              {!debounced.trim() && (
                <div className="p-6">
                  <p className="eyebrow mb-4">Try</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK.map((term) => (
                      <button key={term} type="button" onClick={() => setQuery(term)} className="chip !text-white">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {debounced.trim() && results.length === 0 && categoryHits.length === 0 && (
                <div className="px-6 py-14 text-center">
                  <p className="text-paper/70">Nothing in the list matches “{debounced}”.</p>
                  <p className="mt-2 text-sm text-paper/40">
                    Try a shorter word, or the Tamil name — the search reads both.
                  </p>
                </div>
              )}

              {categoryHits.length > 0 && (
                <div className="border-b border-ink-600 px-3 py-3">
                  <p className="eyebrow px-3 pb-2">Categories</p>
                  {categoryHits.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(`/categories/${category.id}`);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink-700"
                    >
                      <span className="text-sm text-paper">{category.name}</span>
                      <span className="num text-2xs text-paper/40">{category.count} items</span>
                    </button>
                  ))}
                </div>
              )}

              {results.length > 0 && (
                <div className="p-3">
                  <p className="eyebrow px-3 pb-2">Products</p>
                  {results.map((product, index) => (
                    <button
                      key={product.slug}
                      type="button"
                      onMouseEnter={() => setCursor(index)}
                      onClick={() => go(product.slug)}
                      className={`flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        index === cursor ? 'bg-ink-700' : 'hover:bg-ink-700/60'
                      }`}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink">
                        <ProductArt art={product.art} hue={product.hue} seed={product.slug} className="h-full w-full" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-paper">{product.name}</span>
                        <span className="ta block truncate text-xs text-paper/40">{product.nameTa}</span>
                      </span>
                      <span className="num shrink-0 text-sm font-semibold text-gold">{money(product.price)}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/products?q=${encodeURIComponent(debounced.trim())}`);
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-600 py-3 font-mono text-2xs uppercase tracking-[0.16em] text-paper/60 transition-colors hover:border-gold/50 hover:text-paper"
                  >
                    See all matches in the price list
                    <Icon name="arrow" size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
