import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '@/components/layout/Page';
import { useCart } from '@/context/CartContext';
import { money, pad } from '@/lib/format';
import { SHOP } from '@/lib/shop';
import { buildCompactMessage, buildOrderMessage, isLongOrder, orderReference, whatsappUrl } from '@/lib/whatsapp';
import Icon from '@/components/ui/Icon';
import { EmptyState, QtyStepper } from '@/components/ui/primitives';
import ProductArt from '@/components/product/ProductArt';

/* ------------------------------------------------------------------ */
/* validation                                                          */
/* ------------------------------------------------------------------ */

const RULES = {
  name: (value) => (value.trim().length < 2 ? 'Enter the name the parcel should be addressed to.' : ''),
  phone: (value) =>
    /^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))
      ? ''
      : 'Enter a 10-digit Indian mobile number — this is where we confirm the order.',
  address: (value) =>
    value.trim().length < 15 ? 'Give the full address with door number, street and pin code.' : '',
};

function Field({ id, label, hint, error, touched, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-[#32080B]">{label}</span>
        {hint && <span className="text-2xs text-[#32080B]/45">{hint}</span>}
      </label>
      {children}
      <AnimatePresence>
        {touched && error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-start gap-1.5 text-xs text-ember-bright"
          >
            <Icon name="info" size={12} className="mt-0.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Cart() {
  const { items, totals, setQty, remove, clear, customer, setCustomer } = useCart();
  const [touched, setTouched] = useState({});
  const [reference] = useState(() => orderReference());
  const [sent, setSent] = useState(false);

  const errors = useMemo(
    () => ({
      name: RULES.name(customer.name),
      phone: RULES.phone(customer.phone),
      address: RULES.address(customer.address),
    }),
    [customer],
  );

  const valid = Object.values(errors).every((error) => !error);
  const belowMinimum = totals.subtotal < SHOP.minOrder;

  const message = useMemo(() => {
    if (items.length === 0) return '';
    const payload = {
      items,
      customer,
      subtotal: totals.subtotal,
      savings: totals.savings,
      reference,
    };
    return isLongOrder(items) ? buildCompactMessage(payload) : buildOrderMessage(payload);
  }, [items, customer, totals, reference]);

  const send = (event) => {
    if (!valid) {
      event.preventDefault();
      setTouched({ name: true, phone: true, address: true });
      document.getElementById('delivery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setSent(true);
  };

  if (items.length === 0) {
    return (
      <Page
        title="Your order sheet | Veyila Crackers"
        description="Review the crackers on your order sheet and send the order to Veyila Crackers on WhatsApp."
        canonical="/cart"
        trail={[{ label: 'Order sheet' }]}
        eyebrow="Nothing here yet"
        heading="Your sheet is blank"
      >
        <div className="shell pb-32">
          <EmptyState
            title="No lines on the sheet"
            body="Open the price list, put a number beside anything you want, and it'll be totalled here ready to send."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/products" className="btn btn-ember">
                  Open the price list
                </Link>
                <Link to="/combos" className="btn btn-ghost">
                  Start from a combo box
                </Link>
              </div>
            }
          />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={`Order sheet — ${totals.lines} lines, ${money(totals.subtotal)} | Veyila Crackers`}
      description="Review your crackers order and send it to the Veyila Crackers counter on WhatsApp."
      canonical="/cart"
      trail={[{ label: 'Order sheet' }]}
      eyebrow={<span className="text-[#32080B]">Reference {reference}</span>}
      heading={<span className="text-[#32080B]">Check the sheet, then send it</span>}
      lead="Nothing is charged here. Pressing send opens WhatsApp with the order already written out — we reply with stock confirmation and payment details."
    >
      <div className="shell grid gap-12 pb-32 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        {/* ---------------- lines ---------------- */}
        <div>
          <div className="sheet overflow-hidden rounded-xl">
            <div className="flex items-end justify-between border-b-2 border-ink/20 px-4 pb-3 pt-5 sm:px-6">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-ink/45">Veyila Crackers</p>
                <h2 className="font-display text-xl font-bold text-ink">Order {reference}</h2>
              </div>
              <p className="num text-[0.66rem] uppercase tracking-[0.16em] text-ink/40">
                {totals.lines} lines · {totals.count} packs
              </p>
            </div>

            <ul className="divide-y divide-ink/10">
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.li
                    key={item.slug}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-6"
                  >
                    <span className="num hidden w-8 shrink-0 text-[0.7rem] text-ink/35 sm:block">
                      {pad(index + 1)}
                    </span>

                    <Link
                      to={`/product/${item.slug}`}
                      className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink"
                    >
                      <ProductArt art={item.art} hue={item.hue} seed={item.slug} className="h-full w-full" />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item.slug}`}
                        className="block truncate text-sm font-medium text-ink hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="ta truncate text-xs text-ink/45">{item.nameTa}</p>
                      <p className="num mt-0.5 text-[0.7rem] text-ink/40">
                        {money(item.price)} · {item.unit}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                      <div className="flex items-center rounded-md border border-ink/20 bg-paper">
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="grid h-7 w-7 place-items-center text-ink/50 hover:bg-ember/10"
                          aria-label={`Reduce ${item.name}`}
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span className="num w-7 text-center text-sm font-semibold text-ink">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="grid h-7 w-7 place-items-center text-ink/50 hover:bg-ember/10"
                          aria-label={`Add another ${item.name}`}
                        >
                          <Icon name="plus" size={12} />
                        </button>
                      </div>

                      <span className="num w-16 text-right text-sm font-semibold text-ink sm:w-20">
                        {money(item.amount)}
                      </span>

                      <button
                        type="button"
                        onClick={() => remove(item.slug)}
                        className="text-ink/25 transition-colors hover:text-ember"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="flex items-center justify-between border-t-2 border-dashed border-ink/25 bg-paper-dim px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={clear}
                className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink/40 transition-colors hover:text-ember-deep"
              >
                Clear the sheet
              </button>
              <Link
                to="/products"
                className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ember-deep transition-colors hover:text-ink"
              >
                + Add more lines
              </Link>
            </div>
          </div>

          {/* ---------------- delivery ---------------- */}
          <section id="delivery" className="mt-12 scroll-mt-32">
            <h2 className="text-title mb-2 text-[#32080B]">Where is it going?</h2>
            <p className="mb-7 text-sm text-[#32080B]/60">
              These three lines go into the WhatsApp message. We don't store them anywhere except your own browser.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Name" error={errors.name} touched={touched.name}>
                <input
                  id="name"
                  value={customer.name}
                  onChange={(event) => setCustomer({ name: event.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  className="field !border-[#32080B]/20 !bg-white !text-[#32080B] placeholder:!text-[#32080B]/35 focus:!border-[#32080B]"
                  placeholder="Name for the parcel"
                  autoComplete="name"
                />
              </Field>

              <Field id="phone" label="Mobile number" hint="10 digits" error={errors.phone} touched={touched.phone}>
                <input
                  id="phone"
                  value={customer.phone}
                  onChange={(event) => setCustomer({ phone: event.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                  className="field !border-[#32080B]/20 !bg-white !text-[#32080B] placeholder:!text-[#32080B]/35 focus:!border-[#32080B]"
                  placeholder="98765 43210"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field id="address" label="Delivery address" error={errors.address} touched={touched.address}>
                  <textarea
                    id="address"
                    value={customer.address}
                    onChange={(event) => setCustomer({ address: event.target.value })}
                    onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                    rows={3}
                    className="field resize-none !border-[#32080B]/20 !bg-white !text-[#32080B] placeholder:!text-[#32080B]/35 focus:!border-[#32080B]"
                    placeholder="Door number, street, area, city, pin code"
                    autoComplete="street-address"
                  />
                </Field>
              </div>

              <Field id="landmark" label="Landmark" hint="Optional">
                <input
                  id="landmark"
                  value={customer.landmark}
                  onChange={(event) => setCustomer({ landmark: event.target.value })}
                  className="field !border-[#32080B]/20 !bg-white !text-[#32080B] placeholder:!text-[#32080B]/35 focus:!border-[#32080B]"
                  placeholder="Opposite the school gate"
                />
              </Field>

              <Field id="notes" label="Anything we should know?" hint="Optional">
                <input
                  id="notes"
                  value={customer.notes}
                  onChange={(event) => setCustomer({ notes: event.target.value })}
                  className="field !border-[#32080B]/20 !bg-white !text-[#32080B] placeholder:!text-[#32080B]/35 focus:!border-[#32080B]"
                  placeholder="Nothing loud, deliver before the 18th…"
                />
              </Field>
            </div>
          </section>
        </div>

        {/* ---------------- summary ---------------- */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-[#32080B]/20 bg-[#32080B] p-6 text-white shadow-[0_18px_40px_-24px_rgba(50,8,11,0.65)] lg:p-7">
            <h2 className="eyebrow mb-5">Order total</h2>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/65">List price ({totals.count} packs)</dt>
                <dd className="num strike">{money(totals.listTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/65">Festival discount</dt>
                <dd className="num text-leaf">− {money(totals.savings)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-600 pt-3">
                <dt className="text-white/65">Delivery</dt>
                <dd className="text-white/80">{belowMinimum ? 'Counter pickup' : 'Quoted on confirmation'}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-ink-600 pt-3">
                <dt className="text-base text-white">Total</dt>
                <dd className="num text-3xl font-bold text-gold">{money(totals.subtotal)}</dd>
              </div>
            </dl>

            {belowMinimum && (
              <p className="mt-5 flex items-start gap-2 rounded-lg border border-gold/25 bg-gold/[0.07] px-3.5 py-3 text-xs leading-relaxed text-gold/90">
                <Icon name="info" size={14} className="mt-0.5 shrink-0" />
                Below the {money(SHOP.minOrder)} dispatch minimum. You can still send this order and collect it from
                the counter on Sivakasi Main Road.
              </p>
            )}

            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noreferrer"
              onClick={send}
              className={`btn btn-ember mt-6 w-full !py-4 ${valid ? '' : 'opacity-70'}`}
            >
              <Icon name="whatsapp" size={17} filled />
              Send order on WhatsApp
            </a>

            <p className="mt-3 text-center text-xs leading-relaxed text-white/60">
              Opens WhatsApp with the full list typed out. Nothing is charged now — we confirm stock first.
            </p>

            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-lg border border-leaf/30 bg-leaf/[0.08] p-4"
                >
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
                    <Icon name="check" size={15} className="text-leaf" />
                    Sent to the counter
                  </p>
                  <p className="text-xs leading-relaxed text-white/70">
                    Quote reference {reference} if you call. Your sheet stays here in case you want to add to it — clear
                    it once the order is confirmed.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-xs text-white/65">
              {[
                ['clock', 'Dispatch within 48 hours of payment'],
                ['truck', 'Surface carrier only — fireworks cannot go by air'],
                ['shield', 'Sold under a valid explosives licence'],
              ].map(([icon, text]) => (
                <p key={text} className="flex items-center gap-2.5">
                  <Icon name={icon} size={13} className="shrink-0 text-gold/60" />
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/* what the shop will receive */}
          <details className="group mt-4 rounded-2xl border border-[#32080B]/20 bg-[#32080B] p-5 text-white shadow-[0_18px_40px_-24px_rgba(50,8,11,0.65)]">
            <summary className="flex cursor-pointer items-center justify-between text-sm text-white/80 marker:content-none">
              Preview the WhatsApp message
              <Icon name="chevronDown" size={15} className="transition-transform group-open:rotate-180" />
            </summary>
            <pre className="no-bar mt-4 max-h-64 overflow-auto whitespace-pre-wrap break-words border-t border-white/15 pt-4 font-mono text-[0.68rem] leading-relaxed text-white/65">
              {message}
            </pre>
          </details>
        </aside>
      </div>
    </Page>
  );
}
