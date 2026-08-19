import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useScrollInfo } from '@/hooks';
import { SHOP } from '@/lib/shop';
import { TOTALS } from '@/lib/catalog';
import Icon from '@/components/ui/Icon';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Categories' },
  { to: '/products', label: 'Price list' },
  { to: '/combos', label: 'Combos' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const TICKER = [
  `${TOTALS.products} lines in stock`,
  '80% off the printed list',
  'Order on WhatsApp — no account needed',
  'Dispatch across Tamil Nadu in 2–4 days',
  'Sivakasi-made, PESO licensed',
];

export default function Header() {
  const { totals, openDrawer, pulse } = useCart();
  const { y, direction } = useScrollInfo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const location = useLocation();

  const solid = y > 40;
  const hidden = direction === 'down' && y > 320 && !menuOpen && !searchOpen;

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => (value + 1) % TICKER.length), 4200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-gold focus:px-5 focus:py-2 focus:font-mono focus:text-2xs focus:uppercase focus:tracking-widest focus:text-ink"
      >
        Skip to content
      </a>

      <motion.header
        initial={false}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="border-b border-white/10 bg-[#32080B] backdrop-blur-sm">
          <div className="shell flex h-9 items-center justify-center gap-4 text-[0.68rem] sm:justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="h-1 w-1 shrink-0 animate-flicker rounded-full bg-gold" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={tick}
                  initial={{ y: 9, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -9, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="whitespace-nowrap font-mono uppercase tracking-[0.18em] text-white"
                >
                  {TICKER[tick]}
                </motion.span>
              </AnimatePresence>
            </div>

            <a
              href={`tel:+91${SHOP.phone}`}
              className="hidden shrink-0 font-mono uppercase tracking-[0.18em] text-white transition-colors hover:text-gold sm:block"
            >
              {SHOP.phoneDisplay}
            </a>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ${
            solid ? 'border-b border-stone-200 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'
          }`}
        >
          <div className="shell flex h-[4.5rem] items-center justify-between gap-3 lg:gap-6">
            <Link to="/" className="group flex min-w-0 shrink items-center gap-2.5 lg:shrink-0" aria-label={`${SHOP.name} — home`}>
              <img
                src="/assets/logo-mark.png"
                alt=""
                width="40"
                height="24"
                className="h-7 w-auto shrink-0 sm:h-8 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[6deg]"
              />
              <span className="min-w-0 leading-none">
                <span className="ta block truncate text-[0.95rem] font-bold text-ink sm:text-[1.05rem]">{SHOP.nameTa}</span>
                <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.3em] text-gold/80">
                  Crackers
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative rounded-pill px-4 py-2 font-mono text-2xs font-bold uppercase tracking-[0.18em] transition-colors ${
                      isActive ? 'bg-[#7a0c0c] text-white' : 'text-black hover:text-black/70'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group flex h-10 w-10 items-center justify-center gap-2.5 rounded-pill border border-stone-200 text-ink/70 transition-colors hover:border-gold/50 hover:text-ink md:w-auto md:justify-start md:px-4"
                aria-label="Search the price list"
              >
                <Icon name="search" size={17} />
                <span className="hidden font-mono text-2xs uppercase tracking-[0.16em] md:inline">Search</span>
                <kbd className="hidden rounded border border-stone-300 px-1.5 py-0.5 font-mono text-[0.6rem] text-ink/50 lg:inline">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={openDrawer}
                className="relative grid h-10 w-10 place-items-center rounded-pill border border-stone-200 text-ink/75 transition-colors hover:border-gold/50 hover:text-ink"
                aria-label={`Order sheet, ${totals.count} item${totals.count === 1 ? '' : 's'}`}
              >
                <Icon name="cart" size={18} />
                <AnimatePresence>
                  {totals.count > 0 && (
                    <motion.span
                      key={totals.count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: pulse ? [1, 1.35, 1] : 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="num absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ember px-1 text-[0.62rem] font-semibold text-paper"
                    >
                      {totals.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-pill border border-stone-200 text-ink/75 transition-colors hover:border-gold/50 lg:hidden"
                aria-label="Open menu"
              >
                <Icon name="menu" size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}