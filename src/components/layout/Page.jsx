import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import Icon from '@/components/ui/Icon';
import Breadcrumbs from './Breadcrumbs';

/**
 * Sets the document title and meta description per route. A three-line hook
 * beats pulling in a head-management library for a site this size.
 */
export function useSeo({ title, description, canonical } = {}) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `https://veyilacrackers.com${canonical}`);
    }
  }, [title, description, canonical]);
}

/**
 * Standard interior page: transitions in, carries breadcrumbs and an
 * editorial page header. The homepage opts out of the header and supplies
 * its own hero.
 */
export default function Page({
  title,
  description,
  canonical,
  eyebrow,
  heading,
  lead,
  trail,
  aside,
  bare = false,
  children,
}) {
  useSeo({ title, description, canonical });

  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={bare ? 'bg-white text-ink' : 'bg-white pt-[7.5rem] text-ink lg:pt-[8.5rem]'}
    >
      {!bare && (heading || trail) && (
        <header className="shell pb-10 lg:pb-14">
          {trail && <Breadcrumbs trail={trail} className="mb-7" />}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
              {heading && <h1 className="text-headline text-balance">{heading}</h1>}
              {lead && <p className="mt-5 max-w-xl text-pretty leading-relaxed text-paper/55">{lead}</p>}
            </div>
            {aside && <div className="shrink-0">{aside}</div>}
          </div>
          <div className="rule mt-10" />
        </header>
      )}
      {children}
    </motion.main>
  );
}

/**
 * Mobile order bar. On a phone the drawer trigger is up in the header and
 * out of thumb reach, so the running total follows the customer down the
 * page instead. Hidden on the cart page, where it would be noise.
 */
export function MobileOrderBar({ hidden = false }) {
  const { totals, openDrawer } = useCart();
  if (hidden || totals.count === 0) return null;

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-600 bg-ink-800/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
    >
      <div className="flex items-center gap-3">
        <button type="button" onClick={openDrawer} className="flex flex-1 items-center gap-3 text-left">
          <span className="num grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-ember text-sm font-semibold text-paper">
            {totals.count}
          </span>
          <span>
            <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper/40">
              {totals.lines} lines on your sheet
            </span>
            <span className="num block text-lg font-semibold text-gold">{money(totals.subtotal)}</span>
          </span>
        </button>
        <Link to="/cart" className="btn btn-ember shrink-0 px-5 py-2.5">
          Send
          <Icon name="whatsapp" size={15} filled />
        </Link>
      </div>
    </motion.div>
  );
}
