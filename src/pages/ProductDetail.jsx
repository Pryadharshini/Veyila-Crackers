import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page, { MobileOrderBar } from '@/components/layout/Page';
import { getCategory, getProduct, relatedProducts } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { money, pad, unitWord } from '@/lib/format';
import { SHOP } from '@/lib/shop';
import { enquiryUrl } from '@/lib/whatsapp';
import Icon from '@/components/ui/Icon';
import { QtyStepper, Reveal } from '@/components/ui/primitives';
import { Glow } from '@/components/ui/Atmosphere';
import ProductArt from '@/components/product/ProductArt';
import ProductCard from '@/components/product/ProductCard';

/** Practical notes derived from what the sheet already tells us. */
function buildNotes(product, category) {
  const notes = [];

  if (product.pieces) {
    notes.push(`Comes ${product.pieces} pieces to the ${unitWord(product.unit)}.`);
  }
  notes.push(`Sold as ${product.unit.toLowerCase()} — the rate above is for the whole pack, not per piece.`);

  if (/rocket/i.test(category.name)) notes.push('Launch from a sand-weighted bottle, never from the hand.');
  else if (/bomb|continuous/i.test(category.name)) notes.push('Sound item. Open ground only, and well away from windows.');
  else if (/sparkler|kids|twinkling/i.test(category.name)) notes.push('Suitable for supervised use by children.');
  else if (/chakkar/i.test(category.name)) notes.push('Needs a flat, swept patch of ground to spin true.');
  else notes.push('Place on level ground, light the fuse and step back at least five metres.');

  notes.push('Stored flat and dry at the counter; check the box seal on arrival.');
  return notes;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const { add, qtyOf, setQty } = useCart();
  const [qty, setLocalQty] = useState(1);

  if (!product) return <Navigate to="/products" replace />;

  const category = getCategory(product.categoryId);
  const related = relatedProducts(product, 4);
  const inCart = qtyOf(product.slug);
  const notes = buildNotes(product, category);

  return (
    <Page
      title={`${product.name} — ${money(product.price)} | Veyila Crackers`}
      description={`${product.name} (${product.nameTa}) — ${money(product.price)} per ${unitWord(
        product.unit,
      )}, down from ${money(product.mrp)}. ${category.blurb}`}
      canonical={`/product/${product.slug}`}
      trail={[
        { to: '/products', label: 'Price list' },
        { to: `/categories/${category.id}`, label: category.name },
        { label: product.name },
      ]}
      bare
    >
      <div className="shell pt-[7.5rem] lg:pt-[8.5rem]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          {/* artwork */}
          <div className="relative">
            <Glow className="left-1/2 top-1/4 -translate-x-1/2" color={`hsla(${product.hue},80%,50%,.2)`} size={480} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="card-night relative aspect-square overflow-hidden"
            >
              <ProductArt
                art={product.art}
                hue={product.hue}
                seed={product.slug}
                label={product.name}
                className="h-full w-full"
              />
              <span className="num absolute left-5 top-5 text-2xs tracking-widest text-white/70">
                Line {pad(product.sno, 3)}
              </span>
              <span className="num absolute right-5 top-5 rounded-pill bg-[#32080B] px-2.5 py-1 text-[0.62rem] font-semibold text-white">
                −{product.discount}%
              </span>
            </motion.div>

            <p className="mt-4 flex items-center gap-2 text-xs text-[#32080B]/55">
              <Icon name="info" size={13} />
              Illustration, not a photograph. Packaging design varies by manufacturing batch.
            </p>
          </div>

          {/* detail */}
          <div>
            <Link to={`/categories/${category.id}`} className="eyebrow mb-4 inline-flex items-center gap-2 hover:text-gold">
              {category.name}
              <Icon name="chevron" size={11} />
            </Link>

            <h1 className="text-headline text-balance text-[#32080B]">{product.name}</h1>
            <p className="ta mt-2 text-xl text-gold/75">{product.nameTa}</p>

            <div className="mt-8 flex flex-wrap items-end gap-5 border-y border-[#32080B]/15 py-7">
              <div>
                <p className="eyebrow mb-2">Counter rate</p>
                <div className="flex items-baseline gap-3">
                  <span className="num text-4xl font-bold text-gold">{money(product.price)}</span>
                  <span className="num strike text-base !text-[#32080B]/35">{money(product.mrp)}</span>
                </div>
                <p className="num mt-1.5 text-xs text-leaf">You save {money(product.saving)} on this line</p>
              </div>
              <div className="ml-auto text-right">
                <p className="eyebrow mb-2">Sold as</p>
                <p className="num text-lg font-semibold text-[#32080B]">{product.unit}</p>
              </div>
            </div>

            {/* add to sheet */}
            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-3">
                <QtyStepper value={qty} onChange={(value) => setLocalQty(Math.max(1, value))} />
                <button
                  type="button"
                  onClick={() => add(product.slug, qty, { open: true })}
                  className="btn flex-1 bg-[#32080B] text-white shadow-[0_18px_40px_-18px_rgba(50,8,11,.65)] hover:bg-[#4a1115] sm:flex-none sm:px-8"
                >
                  Add {qty} to the sheet — {money(product.price * qty)}
                </button>
              </div>

              {inCart > 0 && (
                <p className="mt-3 flex items-center gap-2 text-sm text-[#32080B]/65">
                  <Icon name="check" size={14} className="text-leaf" />
                  {inCart} already on your sheet.
                  <button
                    type="button"
                    onClick={() => setQty(product.slug, 0)}
                    className="text-[#32080B] underline-offset-4 hover:underline"
                  >
                    Remove
                  </button>
                </p>
              )}
            </div>

            {/* notes */}
            <ul className="mt-9 space-y-3">
              {notes.map((note) => (
                <li key={note} className="flex gap-3 text-[0.9rem] leading-relaxed text-[#32080B]">
                  <Icon name="spark" size={14} className="mt-1 shrink-0 text-[#32080B]" />
                  {note}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3 border-t border-[#32080B]/15 pt-7">
              <a href={enquiryUrl(product.name)} target="_blank" rel="noreferrer" className="btn !border-[#32080B] !bg-[#32080B] !text-white hover:!bg-[#4a1115]">
                <Icon name="whatsapp" size={15} filled />
                Ask about this line
              </a>
              <a href={`tel:+91${SHOP.phone}`} className="btn !border-[#32080B] !bg-[#32080B] !text-white hover:!bg-[#4a1115]">
                <Icon name="phone" size={15} />
                {SHOP.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-[#32080B]/15 pt-14">
            <Reveal as="h2" className="text-title mb-2 text-[#32080B]">
              Nearest on the same shelf
            </Reveal>
            <Reveal as="p" delay={0.05} className="mb-9 text-sm text-[#32080B]/75">
              Closest in price within {category.name}.
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard key={item.slug} product={item} index={index} />
              ))}
            </div>
          </section>
        )}

        <div className="h-24" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            alternateName: product.nameTa,
            category: category.name,
            sku: product.id,
            brand: { '@type': 'Brand', name: SHOP.name },
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              seller: { '@type': 'Organization', name: SHOP.name },
            },
          }),
        }}
      />

      <MobileOrderBar />
    </Page>
  );
}
