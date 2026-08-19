import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEscape, useLockBody } from '@/hooks';
import { SHOP, addressLines, mapsUrl, telUrl } from '@/lib/shop';
import { CATEGORIES } from '@/lib/catalog';
import { enquiryUrl } from '@/lib/whatsapp';
import Icon from '@/components/ui/Icon';
import { NAV } from './Header';

const panel = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: '100%', transition: { duration: 0.34, ease: [0.4, 0, 1, 1] } },
};

const list = {
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } },
};

const row = {
  hidden: { opacity: 0, x: 26 },
  show: { opacity: 1, x: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

export default function MobileMenu({ open, onClose, onSearch }) {
  useLockBody(open);
  useEscape(onClose, open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[24rem] flex-col border-l border-ink-600 bg-ink-800 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between border-b border-ink-600 px-6 py-5">
              <span className="ta text-lg font-bold text-paper">{SHOP.nameTa}</span>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-pill border border-ink-600 text-paper/70"
                aria-label="Close menu"
              >
                <Icon name="close" size={17} />
              </button>
            </div>

            <motion.div variants={list} initial="hidden" animate="show" className="no-bar flex-1 overflow-y-auto px-6 py-7">
              <motion.button
                variants={row}
                type="button"
                onClick={() => {
                  onClose();
                  onSearch();
                }}
                className="mb-8 flex w-full items-center gap-3 rounded-xl border border-ink-600 bg-ink/60 px-4 py-3.5 text-left text-sm text-paper/50"
              >
                <Icon name="search" size={17} />
                Search 149 crackers
              </motion.button>

              <motion.p variants={row} className="eyebrow mb-4">
                Browse
              </motion.p>
              <ul className="mb-9 space-y-1">
                {NAV.map((item) => (
                  <motion.li key={item.to} variants={row}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="group flex items-center justify-between border-b border-ink-600/60 py-3.5 font-display text-2xl text-paper transition-colors hover:text-gold"
                    >
                      {item.label}
                      <Icon
                        name="arrow"
                        size={17}
                        className="text-paper/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.p variants={row} className="eyebrow mb-4">
                Popular categories
              </motion.p>
              <motion.div variants={row} className="mb-9 flex flex-wrap gap-2">
                {CATEGORIES.slice(0, 10).map((category) => (
                  <Link key={category.id} to={`/categories/${category.id}`} onClick={onClose} className="chip">
                    {category.name}
                  </Link>
                ))}
              </motion.div>

              <motion.div variants={row} className="rounded-xl border border-ink-600 bg-ink/50 p-5">
                <p className="eyebrow mb-3">Visit the shop</p>
                <address className="not-italic text-sm leading-relaxed text-paper/60">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={telUrl} className="chip">
                    <Icon name="phone" size={13} /> Call
                  </a>
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="chip">
                    <Icon name="pin" size={13} /> Map
                  </a>
                </div>
              </motion.div>
            </motion.div>

            <div className="border-t border-ink-600 p-5">
              <a href={enquiryUrl()} target="_blank" rel="noreferrer" className="btn btn-ember w-full">
                <Icon name="whatsapp" size={16} filled />
                Message us on WhatsApp
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
