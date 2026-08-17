# Veyila Crackers

A storefront for a Sivakasi fireworks counter in Virudhunagar. The entire
catalogue is generated from the shop's own Excel price list, and orders leave
the site as a pre-filled WhatsApp message — there is no login, no account and
no payment gateway anywhere in the project.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

---

## The idea behind the design

Every crackers shop in this district hands out a folded paper price list:
numbered rows, the product name in English and Tamil, the pack unit, the rate,
and two blank columns at the right — **Requirement** and **Amount** — that the
customer fills in with a pen while sitting at the counter.

That sheet is the interface. The default listing view is not a grid of product
cards; it is the estimate sheet itself, rendered as cream paper laid on a dark
sky, with the two hand-filled columns made interactive and the total stamped
along the foot. It is the right shape for how these customers actually buy —
thirty lines at a time, scanning for a name — and a grid of tiles makes you
scroll past nine images to compare two prices. A card grid is available as a
toggle for people browsing rather than ordering.

Everything else on the page stays quiet so the sheet is the thing you remember.

| Token | Value | Where it comes from |
| --- | --- | --- |
| `ink` | `#120B0A` | a roasted brown-black, not pure black — a Sivakasi night over lamplight |
| `ember` | `#E23B26` | the vermilion printed on a cracker wrapper |
| `gold` | `#E9B44C` | brass lamp / Sivakasi label foil |
| `paper` | `#F3E9D8` | the newsprint the price list is actually printed on |
| `leaf` | `#4E7A5E` | the green on a Sivakasi label; used only for savings and "in stock" |

Type is **Bricolage Grotesque** (display), **Instrument Sans** (body),
**IBM Plex Mono** (all figures and labels — mono numerals are what sell the
ledger conceit) and **Anek Tamil** (Tamil), loaded from Google Fonts.

---

## The price list is the source of truth

`scripts/build-catalog.mjs` reads `data/Crackers_Price_List.xlsx` and writes
`src/data/catalog.json`. **No product, category, price or Tamil name is typed
by hand anywhere in the app.**

```bash
npm run catalog     # regenerate by hand
```

It also runs automatically on `predev` and `prebuild`, so `npm run dev` always
reflects whatever is currently in the spreadsheet.

### How the sheet is read

The parser walks the rows and treats any row whose **S.No** cell holds text
instead of a number (`ROCKETS - ராக்கெட் வகைகள்`) as a category banner. Every
product row after it belongs to that category until the next banner.

| Sheet column | Becomes |
| --- | --- |
| `PRODUCT NAME` | `name`, and the URL slug |
| `பட்டாசுகளின் பெயர்` | `nameTa` — searchable, and shown under every English name |
| `PRICE` | `mrp` — the struck-through list price |
| `80% DISCOUNT PRICE` (header) | `price` = `mrp × 0.20`, `discount` = 80 |
| `PER` | `unit` — `1 Box`, `1 Pkt`, `1 Bag`, `1 Pcs` |
| `Requirement` / `Amount` | the two interactive columns in the ledger |

Current output: **149 products across 22 categories**, ₹7 to ₹3,200.

### To change prices

Edit the spreadsheet, keep the column order, drop it back at
`data/Crackers_Price_List.xlsx`, and run `npm run build`. Nothing in `src/`
needs touching. Stored carts hold only `{ slug, qty }` and re-read the price at
render time, so a re-export never leaves a stale rupee value in a customer's
browser.

### Two notes on the supplied sheet

- Rows for S.No **126** and **127** appear twice in the sparklers block. The
  parser re-indexes independently, so nothing collides — but the printed sheet
  has a numbering error worth fixing at source.
- In the Kids Special block, the Tamil names on **Serpent Egg Big**,
  **10in1 Laptop Queen** and **Big Boss 10in1 Laptop** are shifted by one row
  relative to the English. This is reproduced faithfully rather than guessed
  at; correct it in the spreadsheet and it will correct itself here.

### Combo boxes

The four combos are **not** hardcoded product lists. `COMBO_RECIPES` in the
build script describes each box by rule ("four sparklers, three kids items, two
wheels…"), and the generator picks real lines spread across that category's
price band, then totals them. Re-export the sheet and the boxes recompose
themselves against the new prices.

### Artwork

A price list has no photographs, and filling the page with stock images of
somebody else's fireworks would be dishonest. Instead, each category has a
hand-drawn SVG family in `src/components/product/ProductArt.jsx` — a cone
fountain looks like a cone, an aerial cake shows its tubes, a garland hangs.
The hue is fixed per category so customers learn a shelf by colour; the product
slug seeds small variations within the family. The product page says plainly
that these are illustrations.

In the ledger the artwork is dropped for a 3px category colour stripe — an
illustration at 40px is mush, and a stripe is not.

---

## WhatsApp checkout

There is no cart-to-server step. `src/lib/whatsapp.js` composes the order as
plain text laid out like the shop's paper estimate slip, and opens `wa.me`.

```
*NEW ORDER — Veyila Crackers*
Ref: VC-1508-4821
━━━━━━━━━━━━━━━━━━━━

*Items (3)*
01. Flower Pots Big
    2 × ₹60 = ₹120  (1 Box)
...
━━━━━━━━━━━━━━━━━━━━
*Total: ₹1,240*
You saved ₹4,960 off list price
━━━━━━━━━━━━━━━━━━━━

*Delivery details*
Name: …
Phone: …
Address: …
```

- **Number:** `+91 9790379790` (`SHOP.whatsapp` in `src/lib/shop.js`)
- Name, phone and address are validated before the link fires, and the cart
  page shows a live preview of the exact message the shop will receive.
- Orders over 45 lines fall back to a compact format, because some Android
  builds truncate very long `wa.me` links.
- Every order carries a reference (`VC-DDMM-NNNN`) the customer can quote.

Customer details are kept in `localStorage` only, so a returning visitor does
not retype their address. Nothing is transmitted anywhere except into the
WhatsApp message they press send on.

---

## Structure

```
veyila-crackers/
├── data/Crackers_Price_List.xlsx     the source of truth
├── scripts/build-catalog.mjs         xlsx → src/data/catalog.json
├── public/assets/                    logo, mark, hero (responsive JPGs)
└── src/
    ├── components/
    │   ├── layout/    Header · MobileMenu · SearchOverlay · Footer
    │   │              Breadcrumbs · ScrollToTop · Page (+ useSeo)
    │   ├── product/   Ledger (the signature) · ProductCard · ProductArt · Filters
    │   ├── cart/      CartDrawer
    │   ├── home/      Hero · Sections · Sections2
    │   └── ui/        Icon · primitives · Atmosphere (embers, fuse rail, glow)
    ├── context/       CartContext
    ├── hooks/         reveal · magnetic · countUp · media · lock · scroll · debounce
    ├── lib/           catalog · whatsapp · shop · format · slug
    ├── pages/         Home · Products · Categories · ProductDetail
    │                  Combos · Cart · About · Contact · NotFound
    └── styles/index.css
```

Components never import `catalog.json` directly — they go through
`src/lib/catalog.js`, so the shape of the spreadsheet can change without
touching a single view.

All shop details (address, phone, hours, minimum order, social handles) live in
`src/lib/shop.js`. **Instagram is disabled**: `SHOP.social.instagram` is `null`
and the footer only renders handles that exist. Set a URL there and the icon
appears.

---

## Motion

| Where | What | Built with |
| --- | --- | --- |
| Hero | photograph parallax, copy separating on scroll, paper slip righting itself | GSAP ScrollTrigger |
| Featured line | artwork rotation on scroll, headline words rising in sequence | GSAP ScrollTrigger |
| Section entrances | one shared `<Reveal>`, used everywhere so the page reads as one hand | Framer Motion |
| Page changes | fade-and-lift between routes | Framer Motion `AnimatePresence` |
| Buttons | magnetic pull toward the cursor, spark sweep on hover | `useMagnetic` (rAF, no library) |
| Ambience | drifting embers, capped by DPR, paused when the tab hides | `<canvas>` |
| Scroll position | a fuse burning down the left edge; the burnt length is how far you've read | `useScrollInfo` |
| Category rail | free-mode drag with a fuse-style progress bar | Swiper |

Every one of these is disabled under `prefers-reduced-motion: reduce`, and the
canvas is not mounted at all.

---

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/products` | Full price list — filters and sort live in the URL, so a filtered list can be shared |
| `/categories` | All 22 shelves, sized by how much stock each holds |
| `/categories/:id` | One shelf |
| `/product/:slug` | Product detail |
| `/combos` | Combo boxes |
| `/cart` | Order sheet, delivery form, WhatsApp send |
| `/about` · `/contact` | Shop, sourcing, licence, delivery, FAQ |
| `*` | 404 |

Every route except the homepage is lazy-loaded.

---

## Quality floor

- Responsive from 360px up; the ledger scrolls horizontally on narrow screens
  and a running-total bar follows the customer down the page on phones.
- Keyboard: visible focus rings, `⌘K` / `Ctrl-K` search, arrow-key navigation
  in the search overlay, Escape closes every overlay, skip-to-content link.
- Screen readers: real `<table>` semantics in the ledger with a caption,
  labelled steppers, `aria-modal` dialogs, decorative SVG hidden.
- SEO: per-route title, description and canonical via `useSeo`; JSON-LD for
  `Store`, `Product`, `BreadcrumbList` and `FAQPage`; Open Graph tags.
- The pre-hydration shell in `index.html` is dark, so the page never flashes
  white before React mounts.

## Deploying

`npm run build` emits a static `dist/`. Any host works. Because routing is
client-side, rewrite all paths to `index.html`:

- **Netlify** — `_redirects`: `/*  /index.html  200`
- **Vercel** — `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- **Apache** — standard SPA `.htaccess` rewrite

Before going live, set the real domain in `index.html` (`og:*` and canonical)
and in the `canonical` prop on each page.

## Stack

React 19 · Vite 6 · Tailwind CSS 3.4 · Framer Motion 11 · GSAP 3 · Swiper 11 ·
SheetJS (build-time only, not shipped to the browser)
