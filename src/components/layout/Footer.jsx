import { Link } from 'react-router-dom';
import { SHOP, addressLines, mapsUrl, telUrl } from '@/lib/shop';
import { CATEGORIES, TOTALS } from '@/lib/catalog';
import { enquiryUrl } from '@/lib/whatsapp';
import Icon from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/primitives';

const LINKS = [
  { to: '/products', label: 'Full price list' },
  { to: '/categories', label: 'Categories' },
  { to: '/combos', label: 'Combo boxes' },
  { to: '/cart', label: 'Your order sheet' },
  { to: '/about', label: 'About the shop' },
  { to: '/contact', label: 'Contact & directions' },
];

const HELP = [
  { to: '/contact#delivery', label: 'Delivery and dispatch' },
  { to: '/contact#faq', label: 'Common questions' },
  { to: '/about#safety', label: 'Burning safely' },
  { to: '/about#licence', label: 'Licence and compliance' },
];

/* Only rendered when a handle exists — Instagram is not live yet. */
const socials = Object.entries(SHOP.social).filter(([, handle]) => Boolean(handle));

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#f0d7a2]/20 bg-[#32080B] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#f0d7a2]/60" />

      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1.1fr]">
          <Reveal>
            <Link to="/" className="mb-6 flex items-center gap-3">
              <img src="/assets/logo-mark.png" alt="" width="44" height="26" className="h-9 w-auto" />
              <span className="leading-none">
                <span className="ta block text-xl font-bold text-white">{SHOP.nameTa}</span>
                <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[#f3c57d]">
                  Est. {SHOP.since} · Virudhunagar
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-white/80">
              A family counter on Sivakasi Main Road selling {TOTALS.products} lines of Sivakasi-made fireworks at{' '}
              {TOTALS.products > 0 ? '80%' : ''} off the printed list. Build your sheet here, send it on WhatsApp, and
              we'll confirm stock and dispatch the same day.
            </p>

            <a
              href={enquiryUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost mt-7"
            >
              <Icon name="whatsapp" size={16} filled />
              WhatsApp {SHOP.phoneDisplay}
            </a>

            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map(([network, url]) => (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-pill border border-ink-600 text-paper/60 transition-colors hover:border-gold/50 hover:text-gold"
                    aria-label={network}
                  >
                    <Icon name="spark" size={15} />
                  </a>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal delay={0.06}>
            <h3 className="eyebrow mb-5">Shop</h3>
            <ul className="space-y-3">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/80 transition-colors hover:text-[#f3b974]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <h3 className="eyebrow mb-5">Help</h3>
            <ul className="space-y-3">
              {HELP.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/80 transition-colors hover:text-[#f3b974]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.18}>
            <h3 className="eyebrow mb-5">Come to the counter</h3>
            <address className="not-italic text-sm leading-relaxed text-white/80">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <dl className="mt-5 space-y-2 text-sm">
              {SHOP.hours.map(([days, time]) => (
                <div key={days} className="flex justify-between gap-4 border-b border-ink-600/60 pb-2">
                  <dt className="text-white/70">{days}</dt>
                  <dd className="num text-white">{time}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <a href={telUrl} className="chip">
                <Icon name="phone" size={13} /> Call
              </a>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="chip">
                <Icon name="pin" size={13} /> Directions
              </a>
            </div>
          </Reveal>
        </div>

        {/* Category index — the whole shelf, spelled out, for anyone who
            arrived from a search engine looking for one specific thing. */}
       

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SHOP.name}. Prices are per pack as printed on the shop's list.
          </p>
          <p className="flex items-center gap-2">
            <Icon name="shield" size={14} className="text-leaf" />
            Sold under a valid explosives licence. Please burst responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
