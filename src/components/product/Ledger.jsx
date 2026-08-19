import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { money, pad, plain } from '@/lib/format';
import Icon from '@/components/ui/Icon';

/**
 * The estimate sheet.
 * ------------------------------------------------------------------
 * Every crackers shop in this district hands out a folded paper price list:
 * numbered rows, the name in English and Tamil, the pack unit, the rate, and
 * two blank columns at the right — "Requirement" and "Amount" — that the
 * customer fills in with a pen while sitting at the counter. The shop then
 * adds it up and reads the total back.
 *
 * That sheet is what this component is. It is the default way to browse the
 * catalogue here because it is how these customers already buy: thirty lines
 * at a time, scanning for a name, writing a number beside it. A grid of
 * product cards makes you scroll past nine tiles to compare two prices; the
 * sheet puts a hundred rates on one screen and totals them live.
 *
 * The two hand-filled columns are the only interactive part.
 */

function LedgerRow({ product, index, dense = false }) {
  const { qtyOf, setQty, add, pulse } = useCart();
  const qty = qtyOf(product.slug);
  const amount = qty * product.price;
  const flash = pulse === product.slug;

  return (
    <tr
      className={`group border-b border-ink/[0.09] transition-colors last:border-0 ${
        qty > 0 ? 'bg-ember/[0.055]' : 'hover:bg-ink/[0.035]'
      } ${flash ? 'bg-gold/20' : ''}`}
    >
      {/* line number — the sheet's own numbering, kept stable */}
      <td className="w-10 py-2.5 pl-3 pr-1 align-middle sm:w-14 sm:pl-5">
        <span className="num text-[0.7rem] text-ink/35">{pad(index, 3)}</span>
      </td>

      {/* name, both scripts, linked to the detail page */}
      <td className="py-2.5 pr-3 align-middle">
        <Link to={`/product/${product.slug}`} className="flex items-stretch gap-3">
          {/* shelf colour, carried down the sheet so a category stays
              recognisable at a glance. An illustration at this size is mush;
              a stripe is not. */}
          {!dense && (
            <span
              className="w-[3px] shrink-0 rounded-full"
              style={{ backgroundColor: `hsla(${product.hue}, 72%, 46%, .85)` }}
              aria-hidden="true"
            />
          )}
          <span className="min-w-0">
            <span className="block truncate text-[0.9rem] font-medium leading-tight text-ink decoration-ember/60 underline-offset-4 group-hover:underline">
              {product.name}
            </span>
            <span className="ta block truncate text-[0.78rem] leading-tight text-ink/50">{product.nameTa}</span>
          </span>
        </Link>
      </td>

      {/* pack unit */}
      <td className="hidden w-20 py-2.5 pr-3 align-middle md:table-cell">
        <span className="num text-[0.72rem] uppercase tracking-wide text-ink/45">{product.unit}</span>
      </td>

      {/* rate: the printed price, struck, beside what it costs today */}
      <td className="w-24 py-2.5 pr-3 text-right align-middle sm:w-32">
        <span className="num block text-[0.7rem] leading-none text-ink/30 line-through">{plain(product.mrp)}</span>
        <span className="num block text-[0.95rem] font-semibold leading-tight text-ember-deep">
          {plain(product.price)}
        </span>
      </td>

      {/* requirement — the column the customer fills in */}
      <td className="w-[7.5rem] py-2 pr-2 align-middle sm:w-36 sm:pr-3">
        {qty > 0 ? (
          <div className="ml-auto flex w-fit items-center rounded-md border border-ink/20 bg-paper">
            <button
              type="button"
              onClick={() => setQty(product.slug, qty - 1)}
              className="grid h-7 w-7 place-items-center text-ink/50 transition-colors hover:bg-ember/10 hover:text-ember-deep"
              aria-label={`Reduce ${product.name}`}
            >
              <Icon name="minus" size={12} />
            </button>
            <input
              type="number"
              value={qty}
              min={0}
              max={99}
              onChange={(event) => setQty(product.slug, Math.max(0, Math.min(99, Number(event.target.value) || 0)))}
              className="num w-8 bg-transparent text-center text-sm font-semibold text-ink focus:outline-none"
              aria-label={`Quantity of ${product.name}`}
            />
            <button
              type="button"
              onClick={() => setQty(product.slug, qty + 1)}
              className="grid h-7 w-7 place-items-center text-ink/50 transition-colors hover:bg-ember/10 hover:text-ember-deep"
              aria-label={`Add another ${product.name}`}
            >
              <Icon name="plus" size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => add(product.slug, 1)}
            className="ml-auto flex h-7 w-full max-w-[5.5rem] items-center justify-center gap-1.5 rounded-md border border-dashed border-ink/25 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/40 transition-all hover:border-solid hover:border-ember hover:bg-ember hover:text-paper"
          >
            <Icon name="plus" size={11} />
            Add
          </button>
        )}
      </td>

      {/* amount — blank until there's a quantity, like the paper column */}
      <td className="w-20 py-2.5 pr-3 text-right align-middle sm:w-28 sm:pr-5">
        {qty > 0 ? (
          <span className="num text-[0.95rem] font-semibold text-ink">{money(amount)}</span>
        ) : (
          <span className="block h-px w-8 translate-y-2 bg-ink/15 ml-auto" aria-hidden="true" />
        )}
      </td>
    </tr>
  );
}

/**
 * @param {object}   props
 * @param {Array}    props.products
 * @param {boolean}  [props.grouped]  insert a category band between groups
 * @param {string}   [props.caption]  accessible table caption
 */
export default function Ledger({ products, grouped = true, caption = 'Price list', dense = false }) {
  const rows = [];
  let lastCategory = null;
  let counter = 0;

  for (const product of products) {
    if (grouped && product.categoryId !== lastCategory) {
      lastCategory = product.categoryId;
      rows.push(
        <tr key={`band-${product.categoryId}`} className="bg-ink text-paper">
          <td colSpan={6} className="px-3 py-2 sm:px-5">
            <Link
              to={`/categories/${product.categoryId}`}
              className="flex items-baseline gap-3 transition-colors hover:text-gold"
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-gold">
                {product.category}
              </span>
              <span className="ta text-[0.72rem] text-paper/45">{product.categoryTa}</span>
            </Link>
          </td>
        </tr>,
      );
    }
    counter += 1;
    rows.push(<LedgerRow key={product.slug} product={product} index={counter} dense={dense} />);
  }

  return (
    <div className="sheet sheet-torn overflow-hidden rounded-t-xl">
      {/* sheet masthead, printed once at the top like the real thing */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink/20 px-3 pb-3 pt-5 sm:px-5">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-ink/45">Veyila Crackers</p>
          <h2 className="font-display text-2xl font-bold leading-none text-gold">
            Estimate sheet
            <span className="ta ml-2.5 text-base font-medium" style={{ color: '#32080B' }}>
              மதிப்பீட்டுப் பட்டியல்
            </span>
          </h2>
        </div>
        <p className="num text-[0.66rem] uppercase tracking-[0.16em] text-ink/40">
          {products.length} {products.length === 1 ? 'line' : 'lines'} · rates per pack
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-ink/20 bg-ink/[0.045]">
              <th scope="col" className="py-2 pl-3 pr-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/45 sm:pl-5">
                No.
              </th>
              <th scope="col" className="py-2 pr-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/45">
                Product / பொருள்
              </th>
              <th scope="col" className="hidden py-2 pr-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/45 md:table-cell">
                Per
              </th>
              <th scope="col" className="py-2 pr-3 text-right font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/45">
                Rate ₹
              </th>
              <th scope="col" className="py-2 pr-2 text-right font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/45 sm:pr-3">
                Requirement
              </th>
              <th scope="col" className="py-2 pr-3 text-right font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink/45 sm:pr-5">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>

      <div className="h-4" />
    </div>
  );
}

/**
 * The running total that sits under the sheet. Deliberately styled like the
 * shop's rubber-stamped footer rather than a web "cart summary".
 */
export function LedgerTotal({ onOpen }) {
  const { totals } = useCart();

  return (
    <div className="sticky bottom-0 z-20 -mt-1 flex flex-wrap items-center justify-between gap-4 rounded-b-xl border-t-2 border-dashed border-ink/25 bg-paper-dim px-4 py-4 shadow-[0_-16px_40px_-30px_rgba(0,0,0,.9)] sm:px-6">
      <div className="flex items-baseline gap-5">
        <div>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">Lines</p>
          <p className="num text-lg font-semibold text-ink">{totals.lines}</p>
        </div>
        <div>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">Packs</p>
          <p className="num text-lg font-semibold text-ink">{totals.count}</p>
        </div>
        <div className="hidden sm:block">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">Saved</p>
          <p className="num text-lg font-semibold text-leaf">{money(totals.savings)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">Total / மொத்தம்</p>
          <p className="num text-2xl font-bold leading-tight text-ink">{money(totals.subtotal)}</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          disabled={totals.count === 0}
          className="btn bg-ink text-paper hover:bg-ember disabled:opacity-30"
        >
          Review
          <Icon name="arrow" size={14} />
        </button>
      </div>
    </div>
  );
}