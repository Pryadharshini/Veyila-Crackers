import Page from '@/components/layout/Page';
import { CATEGORIES, TOTALS } from '@/lib/catalog';
import { SHOP, addressLines, mapsUrl } from '@/lib/shop';
import { money } from '@/lib/format';
import Icon from '@/components/ui/Icon';
import { ActionButton, Reveal, SectionHead } from '@/components/ui/primitives';
import { Glow } from '@/components/ui/Atmosphere';
import { SafetySection } from '@/components/home/Sections2';

/* ================================================================== */
/* Palette                                                             */
/* ================================================================== */

/**
 * A #32080B surface carries white type; a light surface carries #32080B
 * type. Each section below sets its own background explicitly so the text
 * colour is never left to inherit from the page shell.
 */
const BROWN = '#32080B';
const CREAM = '#FFF8EE';
const YELLOW = '#FFC93C';
const BLACK = '#0A0506';

const CHAIN = [
  {
    title: 'Bought from the unit, not a wholesaler',
    body: 'Every line here comes from a licensed manufacturing unit inside the Sivakasi belt, most of them within forty minutes of the counter. Buying at the unit is why the counter rate can sit at 80% off the printed list and still be a real margin.',
  },
  {
    title: 'Checked before it goes on the shelf',
    body: 'Boxes are opened on arrival and spot-checked for damp, split cases and loose fuses. Anything that fails goes back. Fireworks that have taken moisture are the commonest cause of a dud that tempts somebody to relight it.',
  },
  {
    title: 'Stored flat, dry and separate',
    body: 'Stock sits in a licensed store away from the shop floor, off the ground, with sound items kept apart from fountains and sparklers. Only the day\'s selling stock comes to the counter.',
  },
  {
    title: 'Packed the way it has to travel',
    body: 'Fireworks cannot legally move by air or ordinary courier. Orders go out double-boxed, labelled as explosives, on a registered surface carrier — which is why two to four days is honest and same-day is not.',
  },
];

export default function About() {
  const years = new Date().getFullYear() - SHOP.since;

  return (
    <Page
      title="About Veyila Crackers — a counter shop in Virudhunagar"
      description={`Veyila Crackers has sold Sivakasi fireworks from Sivakasi Main Road, Virudhunagar since ${SHOP.since}. How we buy, store, pack and price ${TOTALS.products} lines.`}
      canonical="/about"
      trail={[{ label: 'About' }]}
      eyebrow={
        <span className="text-[#32080B]/70">
          {years} Diwalis · Est. {SHOP.since}
        </span>
      }
      heading={<span className="text-[#32080B]">A counter shop, not a warehouse.</span>}
      lead={
        <span className="text-[#32080B]/65">
          Veyila is one door on Sivakasi Main Road with a folding table outside it every October. This site is the same
          list, the same rates, and the same person on the other end of the phone.
        </span>
      }
    >
      {/* ---------------- the story ---------------- */}
      <section className="bg-white pb-24">
        <div className="shell grid gap-14 pt-4 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <div className="space-y-5 text-pretty text-[1.02rem] leading-relaxed text-[#32080B]/70">
              <p>
                The shop opened in {SHOP.since} selling to families walking down from the temple. It has never sold
                anything else, and it has never moved.
              </p>
              <p>
                Every September a price list is printed: {TOTALS.products} lines across {TOTALS.categories} shelves,
                English on one side, Tamil on the other, with two blank columns down the right. Customers arrive with
                last year's copy folded in a shirt pocket, sit at the counter, and write a number beside the things they
                want. Somebody adds the column up out loud, twice, and that is the order.
              </p>
              <p>
                Nothing about that needed improving. What needed fixing was that you had to be standing in Virudhunagar
                to do it. So the sheet moved onto a phone — same rows, same order, same arithmetic — and the total you
                see is the total that reaches the counter on WhatsApp.
              </p>
              <p className="text-[#32080B]/50">
                There is no payment gateway on this website, no account to make, and no login anywhere. We are a shop,
                not a platform.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <ActionButton to="/products" variant="ember">
                See the price list
              </ActionButton>
              <ActionButton to="/contact" variant="ghost" icon="pin">
                Find the counter
              </ActionButton>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="sheet sheet-torn rounded-t-xl bg-[#FFF8EE] px-7 pb-10 pt-7">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[#32080B]/55">This season</p>
              <dl className="mt-5 space-y-3.5">
                {[
                  ['Lines carried', TOTALS.products],
                  ['Shelves', TOTALS.categories],
                  ['Cheapest pack', money(TOTALS.lowest)],
                  ['Dearest pack', money(TOTALS.highest)],
                  ['Discount on every line', '80%'],
                  ['Dispatch minimum', money(SHOP.minOrder)],
                  ['Years at this address', years],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-[#32080B]/25 pb-3 last:border-0"
                  >
                    <dt className="text-sm text-[#32080B]/60">{label}</dt>
                    <dd className="num text-base font-semibold text-[#32080B]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- how stock is handled ---------------- */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#32080B] py-24 lg:py-28">
        <Glow className="-left-32 top-10" color="rgba(255,201,60,.12)" size={520} />
        <div className="shell">
          <SectionHead
            eyebrow={<span className="text-[#FFC93C]">From the unit to your door</span>}
            title={<span className="text-white">Four steps, and where each one can go wrong</span>}
            lead={
              <span className="text-white/65">
                Worth reading if you have only ever bought crackers off a pavement stall.
              </span>
            }
          />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-card border border-white/15 bg-white/15 md:grid-cols-2">
            {CHAIN.map((step, index) => (
              <li key={step.title} className="bg-[#32080B] p-7 lg:p-9">
                <span className="num mb-4 block text-2xs text-[#FFC93C]">
                  {String(index + 1).padStart(2, '0')} / {String(CHAIN.length).padStart(2, '0')}
                </span>
                <h3 className="mb-3 text-[1.05rem] font-semibold text-white">{step.title}</h3>
                <p className="text-pretty text-[0.88rem] leading-relaxed text-white/60">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- licence ---------------- */}
      <section id="licence" className="scroll-mt-32 bg-white py-24 lg:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-6 text-[#32080B]/60">Licence and compliance</p>
            <h2 className="text-headline text-balance text-[#32080B]">Sold legally, stored legally, shipped legally.</h2>
          </Reveal>

          <Reveal delay={0.1} className="space-y-5 text-pretty leading-relaxed text-[#32080B]/70">
            <p>
              Fireworks in India are governed by the Explosives Act and the Explosives Rules, and administered by PESO.
              Retail sale needs a licence, storage above a threshold needs a separate one, and transport is restricted
              to registered surface carriers on approved routes. Veyila holds the licences required for the stock it
              carries, and they are on the wall at the counter for anyone who wants to read them.
            </p>
            <p>
              We do not sell to anyone under 18, we do not ship banned formulations, and we do not carry anything
              outside the sound limits set for retail sale. Where a state or a city has its own restriction — a burning
              window, a green-crackers-only rule — that is the customer's to observe, and we will tell you what we know
              of it if you ask before ordering.
            </p>
            <div className="flex items-start gap-3 rounded-xl bg-[#32080B] px-5 py-4">
              <Icon name="shield" size={18} className="mt-0.5 shrink-0 text-[#FFC93C]" />
              <p className="text-sm text-white/80">
                If a courier, a marketplace or a stranger offers you the same items cheaper by air freight, it is not
                legal and it is not insured. There is no fast way to move an explosive.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <SafetySection />

      {/* ---------------- visit ---------------- */}
      <section className="border-t border-[#32080B]/15 bg-white py-20">
        <div className="shell flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow mb-4 text-[#32080B]/60">The counter</p>
            <address className="not-italic text-xl leading-relaxed text-[#32080B]">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton href={mapsUrl} target="_blank" rel="noreferrer" variant="gold" icon="pin">
              Open in Maps
            </ActionButton>
            <ActionButton to="/contact" variant="ghost">
              Hours and directions
            </ActionButton>
          </div>
        </div>
      </section>
    </Page>
  );
}