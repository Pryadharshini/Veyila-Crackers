import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import ProductArt from './ProductArt';

/**
 * Grid card, rebuilt to match the shop's printed-catalogue card:
 * a white plate, the discount stamped in the top-left corner, the artwork
 * on plain paper, then name, Tamil name, price and unit stacked flush left.
 * The footer is the counter itself — a quantity stepper, the red cart
 * button that puts that quantity on the sheet, and a wishlist mark.
 */

/* Small inline marks so the card does not depend on the icon set having
   a cart or a heart glyph. */
function CartMark({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.6 12.2a1.6 1.6 0 0 0 1.6 1.3h8.5a1.6 1.6 0 0 0 1.6-1.3L22 7H6" />
    </svg>
  );
}

function HeartMark({ size = 15, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.3 5.7a5 5 0 0 0-7.1 0l-1.2 1.2-1.2-1.2a5 5 0 1 0-7.1 7.1l8.3 8.3 8.3-8.3a5 5 0 0 0 0-7.1z" />
    </svg>
  );
}

/* Real photo when the product has one; otherwise (and if the photo fails
   to load) fall back to the generated catalogue-style drawing so the grid
   never shows a broken image.
   Exported so other sections (e.g. the combo preview tiles) can reuse the
   exact same photo → fallback logic instead of duplicating it. */
const normalizeName = (value = '') =>
  value
    .toLowerCase()
    .replace(/[()]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const PHOTO_BY_NAME = {
  'colour-koti-deluxe10pcs': '/assets/items/colour-koti-deluxe-10pcs.png',
  '50cm-colour-sparklers-3-in-1': '/assets/items/50cm-colour-sparklers-3in1.png',
  'spinner-super-deluxe': '/assets/items/spinner-super-deluxe.png',
  'whistling-rocket-10-pcs': '/assets/items/whistling-rocket-10pcs.png',
  'bada-peacock-5-shower': '/assets/items/bada-peacock-5shower.png',
};

export function ProductMedia({ product, className = '' }) {
  const [broken, setBroken] = useState(false);
  const src =
    product.image ||
    PHOTO_BY_NAME[normalizeName(product.name)] ||
    `/assets/items/${product.slug}.jpg`;

  if (!src || broken) {
    return (
      <ProductArt
        art={product.art}
        hue={product.hue}
        seed={product.slug}
        label={product.name}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={product.name}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
      onError={() => setBroken(true)}
    />
  );
}

export default function ProductCard({ product, index = 0, priority = false }) {
  const { qtyOf, add, setQty } = useCart();
  const inSheet = qtyOf(product.slug);

  const [draft, setDraft] = useState(1);
  const [saved, setSaved] = useState(false);
  const shown = inSheet > 0 ? inSheet : draft;

  const step = (delta) => {
    const next = Math.max(inSheet > 0 ? 0 : 1, shown + delta);
    if (inSheet > 0) setQty(product.slug, next);
    else setDraft(next);
  };

  return (
    <motion.article
      initial={priority ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 7) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex h-full flex-col rounded-xl border bg-white p-3 shadow-[0_1px_3px_rgba(24,16,10,0.06)] transition-shadow duration-300 hover:shadow-[0_10px_24px_-14px_rgba(24,16,10,0.35)] ${
        inSheet > 0 ? 'border-[#e73a2a]/40' : 'border-[#ececec]'
      }`}
    >
      {product.discount > 0 && (
        <span className="num absolute left-2 top-2 z-10 rounded-md bg-[#e73a2a] px-2 py-[3px] text-[0.56rem] font-bold uppercase tracking-[0.04em] text-white">
          {product.discount}% OFF
        </span>
      )}

      <Link to={`/product/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-white transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <ProductMedia product={product} className="h-full w-full" />
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.4em] text-[0.85rem] font-medium leading-[1.2] text-[#2f2b28] transition-colors group-hover:text-[#e73a2a]">
            {product.name}
          </h3>
        </Link>
        <p className="ta mt-1 h-[1.15rem] truncate text-[0.78rem] leading-[1.15rem] text-[#8a8078]">
          {product.nameTa}
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="num strike text-[0.82rem] text-[#b3aaa2]">{money(product.mrp)}</span>
          <span className="num text-[1.02rem] font-bold text-[#e73a2a]">{money(product.price)}</span>
        </div>

        <p className="mb-3 mt-1 text-[0.72rem] text-[#8a8078]">{product.unit}</p>

        <div className="mt-auto flex items-center gap-2 border-t border-[#f1eeea] pt-3">
          <div className="flex items-center rounded-md border border-[#e5e0da]">
            <button
              type="button"
              onClick={() => step(-1)}
              className="grid h-8 w-7 place-items-center text-[#6b625b] transition-colors hover:text-[#e73a2a]"
              aria-label={`Reduce ${product.name}`}
            >
              <span className="text-sm leading-none">−</span>
            </button>
            <span className="num w-6 border-x border-[#e5e0da] py-[6px] text-center text-[0.8rem] font-semibold text-[#231a14]">
              {shown}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              className="grid h-8 w-7 place-items-center text-[#6b625b] transition-colors hover:text-[#e73a2a]"
              aria-label={`Add another ${product.name}`}
            >
              <span className="text-sm leading-none">+</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => (inSheet > 0 ? setQty(product.slug, inSheet + draft) : add(product.slug, draft))}
            className="grid h-8 w-9 shrink-0 place-items-center rounded-md bg-[#e73a2a] text-white transition-colors hover:bg-[#cf2f21]"
            aria-label={`Put ${shown} × ${product.name} on your order sheet`}
          >
            <CartMark />
          </button>

          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            aria-pressed={saved}
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border transition-colors ${
              saved ? 'border-[#e73a2a]/40 text-[#e73a2a]' : 'border-[#e5e0da] text-[#a49a92] hover:text-[#e73a2a]'
            }`}
            aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name} for later`}
          >
            <HeartMark filled={saved} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}