import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useEscape, useLockBody } from '@/hooks';
import { money, pad } from '@/lib/format';
import { SHOP } from '@/lib/shop';
import Icon from '@/components/ui/Icon';
import { QtyStepper } from '@/components/ui/primitives';
import ProductArt from '@/components/product/ProductArt';

export default function CartDrawer() {
  const { items, totals, drawerOpen, closeDrawer, setQty, remove, clear, pulse } = useCart();

  useLockBody(drawerOpen);
  useEscape(closeDrawer, drawerOpen);

  const shortfall = SHOP.minOrder - totals.subtotal;

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[65] bg-ink/80 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[66] flex w-full max-w-[27rem] flex-col border-l border-ink-600 bg-ink-800"
            role="dialog"
            aria-modal="true"
            aria-label="Your order sheet"
          >
            <header className="flex items-start justify-between gap-4 border-b border-ink-600 px-6 py-5">
              <div>
                <p className="eyebrow mb-1.5">Order sheet</p>
                <h2 className="text-xl">
                  {totals.lines} {totals.lines === 1 ? 'line' : 'lines'}
                  <span className="ml-2 num text-sm font-normal text-paper/40">{totals.count} packs</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-ink-600 text-paper/70 transition-colors hover:border-gold/50"
                aria-label="Close order sheet"
              >
                <Icon name="close" size={17} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-dashed border-ink-500 text-paper/30">
                  <Icon name="sheet" size={22} />
                </span>
                <h3 className="text-lg text-paper">Your sheet is blank</h3>
                <p className="max-w-[16rem] text-sm leading-relaxed text-paper/45">
                  Add packs from the price list and they'll be totalled here, ready to send on WhatsApp.
                </p>
                <Link to="/products" onClick={closeDrawer} className="btn btn-gold mt-2">
                  Open the price list
                </Link>
              </div>
            ) : (
              <>
                <div className="no-bar flex-1 overflow-y-auto px-4 py-3">
                  <AnimatePresence initial={false}>
                    {items.map((item, index) => (
                      <motion.article
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`flex gap-3.5 rounded-xl p-2.5 transition-colors ${
                            pulse === item.slug ? 'bg-gold/10' : ''
                          }`}
                        >
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={closeDrawer}
                            className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink"
                          >
                            <ProductArt art={item.art} hue={item.hue} seed={item.slug} className="h-full w-full" />
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                to={`/product/${item.slug}`}
                                onClick={closeDrawer}
                                className="text-sm leading-snug text-paper transition-colors hover:text-gold"
                              >
                                <span className="num mr-1.5 text-2xs text-paper/30">{pad(index + 1)}</span>
                                {item.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => remove(item.slug)}
                                className="shrink-0 text-paper/30 transition-colors hover:text-ember"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Icon name="trash" size={15} />
                              </button>
                            </div>

                            <p className="num mt-0.5 text-2xs text-paper/35">
                              {money(item.price)} · {item.unit}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between gap-2">
                              <QtyStepper
                                size="sm"
                                value={item.qty}
                                onChange={(qty) => setQty(item.slug, qty)}
                                label={`Quantity of ${item.name}`}
                              />
                              <span className="num text-sm font-semibold text-gold">{money(item.amount)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={clear}
                    className="mt-3 w-full rounded-lg py-2.5 font-mono text-2xs uppercase tracking-[0.16em] text-paper/30 transition-colors hover:text-ember"
                  >
                    Clear the sheet
                  </button>
                </div>

                <footer className="border-t border-ink-600 bg-ink/60 px-6 py-5">
                  <dl className="mb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-paper/45">List price</dt>
                      <dd className="num strike">{money(totals.listTotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-paper/45">Festival discount</dt>
                      <dd className="num text-leaf">− {money(totals.savings)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-ink-600 pt-2.5">
                      <dt className="text-paper">Total</dt>
                      <dd className="num text-2xl font-semibold text-gold">{money(totals.subtotal)}</dd>
                    </div>
                  </dl>

                  {shortfall > 0 && (
                    <p className="mb-3 flex items-start gap-2 rounded-lg border border-gold/25 bg-gold/[0.07] px-3 py-2.5 text-xs leading-relaxed text-gold/90">
                      <Icon name="info" size={14} className="mt-0.5 shrink-0" />
                      Add {money(shortfall)} more to reach the {money(SHOP.minOrder)} minimum for dispatch. Counter
                      pickup has no minimum.
                    </p>
                  )}

                  <Link to="/cart" onClick={closeDrawer} className="btn btn-ember w-full">
                    Review and send order
                    <Icon name="arrow" size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="mt-2 w-full py-2 font-mono text-2xs uppercase tracking-[0.16em] text-paper/40 transition-colors hover:text-paper"
                  >
                    Keep adding
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
