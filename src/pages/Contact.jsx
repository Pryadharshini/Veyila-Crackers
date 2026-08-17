import { useState } from 'react';
import Page from '@/components/layout/Page';
import { SHOP, addressLines, mapsUrl, telUrl } from '@/lib/shop';
import { money } from '@/lib/format';
import { whatsappUrl } from '@/lib/whatsapp';
import Icon from '@/components/ui/Icon';
import { ActionButton, Reveal, SectionHead } from '@/components/ui/primitives';
import { Glow } from '@/components/ui/Atmosphere';
import { FaqSection } from '@/components/home/Sections2';

/* ================================================================== */
/* Palette                                                             */
/* ================================================================== */

/**
 * A #32080B surface carries white type; a light surface carries #32080B
 * type. Every card here is maroon, so all card copy is white at varying
 * opacity, with yellow reserved for accents and fills.
 */
const BROWN = '#32080B';
const CREAM = '#FFF8EE';
const YELLOW = '#FFC93C';
const BLACK = '#0A0506';

/* Shared card shell so all four panels stay identical. */
const CARD = 'rounded-2xl border border-white/10 bg-[#32080B]';

const REASONS = [
  'Ask whether something is in stock',
  'Get a box built to a budget',
  'Change an order already sent',
  'Check delivery to my pin code',
  'Something else',
];

const DELIVERY = [
  {
    icon: 'truck',
    title: 'How it travels',
    body: 'Registered surface carrier only. Fireworks are classed as explosives and cannot legally move by air or by ordinary courier, whatever anyone else tells you.',
  },
  {
    icon: 'clock',
    title: 'How long it takes',
    body: 'Dispatch within 48 hours of payment clearing. Most Tamil Nadu addresses receive in two to three days; neighbouring states, three to five. Diwali week runs longer — order by the first week of the month.',
  },
  {
    icon: 'pin',
    title: 'Where we send',
    body: 'Across Tamil Nadu and into Kerala, Karnataka and Andhra Pradesh. Some cities restrict delivery or burning outright; tell us your pin code before you pay and we will say plainly whether we can send.',
  },
  {
    icon: 'sheet',
    title: 'What it costs',
    body: `Orders over ${money(
      SHOP.minOrder,
    )} qualify for dispatch, and the carrier charge is quoted on confirmation against the actual weight. Below that, collect from the counter — there is no minimum for pickup.`,
  },
];

export default function Contact() {
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState('');

  const text = [
    `Hello ${SHOP.name},`,
    '',
    `Reason: ${reason}`,
    message.trim() ? `\n${message.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <Page
      title="Contact Veyila Crackers — Sivakasi Main Road, Virudhunagar"
      description={`Call ${SHOP.phoneDisplay} or message on WhatsApp. Veyila Crackers, Sivakasi Main Road, near Raghavendra Temple, Virudhunagar 626001. Hours, directions and delivery details.`}
      canonical="/contact"
      trail={[{ label: 'Contact' }]}
      eyebrow={<span className="text-[#32080B]/70">Nine to nine, six days</span>}
      heading={<span className="text-[#32080B]">Talk to the counter</span>}
      lead={
        <span className="text-[#32080B]/65">
          One phone, answered by whoever is behind the till. If it rings out, we're with a customer — send a message and
          it gets read.
        </span>
      }
    >
      {/* ---------------- reach us ---------------- */}
      <section className="bg-white pb-24">
        <div className="shell grid gap-8 pt-4 lg:grid-cols-[1fr_1fr] lg:gap-14">
          {/* details */}
          <Reveal className="space-y-4">
            <a
              href={whatsappUrl(`Hello ${SHOP.name}, I have a question.`)}
              target="_blank"
              rel="noreferrer"
              className={`${CARD} group flex items-start gap-5 p-7 transition-colors hover:border-[#FFC93C]/60`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-[#FFC93C] text-[#0A0506]">
                <Icon name="whatsapp" size={22} filled />
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow mb-1.5 block text-[#FFC93C]">Fastest</span>
                <span className="block text-lg font-semibold text-white transition-colors group-hover:text-[#FFC93C]">
                  WhatsApp {SHOP.phoneDisplay}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-white/55">
                  Orders, stock checks and changes. Usually answered within the hour during shop time.
                </span>
              </span>
              <Icon name="arrow" size={16} className="mt-1 shrink-0 text-white/40 group-hover:text-[#FFC93C]" />
            </a>

            <a href={telUrl} className={`${CARD} group flex items-start gap-5 p-7 transition-colors hover:border-[#FFC93C]/60`}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-[#FFC93C] text-[#0A0506]">
                <Icon name="phone" size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow mb-1.5 block text-[#FFC93C]">Call</span>
                <span className="block text-lg font-semibold text-white transition-colors group-hover:text-[#FFC93C]">
                  {SHOP.phoneDisplay}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-white/55">
                  Best if you want someone to read the list back to you.
                </span>
              </span>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={`${CARD} group flex items-start gap-5 p-7 transition-colors hover:border-[#FFC93C]/60`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-white/12 text-white">
                <Icon name="pin" size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow mb-1.5 block text-[#FFC93C]">Visit</span>
                <address className="not-italic text-base leading-relaxed text-white transition-colors group-hover:text-[#FFC93C]">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <span className="mt-2 block text-sm text-white/55">
                  Two doors from the temple gate, on the left walking north.
                </span>
              </span>
            </a>

            <div className={`${CARD} p-7`}>
              <p className="eyebrow mb-4 text-[#FFC93C]">Opening hours</p>
              <dl className="space-y-2.5">
                {SHOP.hours.map(([days, time]) => (
                  <div
                    key={days}
                    className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-2.5 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-white/60">{days}</dt>
                    <dd className="num text-sm text-white">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* composer */}
          <Reveal delay={0.1}>
            <div className={`${CARD} sticky top-32 p-7 lg:p-9`}>
              <h2 className="text-title mb-2 text-white">Write the message here</h2>
              <p className="mb-7 text-sm leading-relaxed text-white/55">
                This builds a WhatsApp message and opens it — nothing is submitted to a server, and there is no form to
                wait on.
              </p>

              <fieldset className="mb-6">
                <legend className="eyebrow mb-3 text-[#FFC93C]">What's it about?</legend>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setReason(item)}
                      className={`rounded-pill px-3 py-1.5 font-mono text-2xs uppercase tracking-[0.14em] transition-colors ${
                        reason === item
                          ? 'bg-[#FFC93C] text-[#0A0506]'
                          : 'border border-white/25 text-white/70 hover:border-white/60 hover:text-white'
                      }`}
                      aria-pressed={reason === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="note" className="mb-2 block text-sm font-medium text-white">
                Anything to add
              </label>
              <textarea
                id="note"
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full resize-none rounded-xl border border-white/20 bg-[#0A0506] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#FFC93C] focus:outline-none focus:ring-1 focus:ring-[#FFC93C]"
                placeholder="Pin code, item names, the date you need it by…"
              />

              <a
                href={whatsappUrl(text)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-[#FFC93C] px-5 py-3.5 font-mono text-2xs font-bold uppercase tracking-[0.16em] text-[#0A0506] transition-colors hover:bg-white"
              >
                <Icon name="whatsapp" size={16} filled />
                Open WhatsApp with this
              </a>

              <p className="mt-3 text-center text-xs text-white/45">
                Goes to {SHOP.phoneDisplay} — the same phone that sits on the counter.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- delivery ---------------- */}
      <section id="delivery" className="relative scroll-mt-32 overflow-hidden border-y border-white/10 bg-[#32080B] py-24">
        <Glow className="right-0 top-0" color="rgba(255,201,60,.12)" size={480} />
        <div className="shell">
          <SectionHead
            eyebrow={<span className="text-[#FFC93C]">Delivery and dispatch</span>}
            title={<span className="text-white">What we can promise, and what we can't</span>}
            lead={<span className="text-white/65">Fireworks are regulated freight. The honest version is below.</span>}
          />

          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-white/15 bg-white/15 sm:grid-cols-2">
            {DELIVERY.map((item) => (
              <div key={item.title} className="bg-[#32080B] p-7 lg:p-9">
                <Icon name={item.icon} size={20} className="mb-4 text-[#FFC93C]" />
                <h3 className="mb-2.5 text-[1.02rem] font-semibold text-white">{item.title}</h3>
                <p className="text-pretty text-[0.88rem] leading-relaxed text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="border-t border-[#32080B]/15 bg-white py-16">
        <div className="shell text-center">
          <p className="mx-auto max-w-lg text-pretty leading-relaxed text-[#32080B]/70">
            Still not sure what to order? Open the price list and start putting numbers beside things — you can send us
            the half-finished sheet and we'll tell you what's missing.
          </p>
          <ActionButton to="/products" variant="ember" className="mt-7">
            Open the price list
          </ActionButton>
        </div>
      </section>
    </Page>
  );
}