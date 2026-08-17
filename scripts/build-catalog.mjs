/**
 * build-catalog.mjs
 * ------------------------------------------------------------------
 * Reads data/Crackers_Price_List.xlsx and emits src/data/catalog.json.
 *
 * The spreadsheet is the single source of truth. Nothing about the
 * products is written by hand anywhere in the app — categories, prices,
 * discounts, Tamil names, pack units and combo bundles are all derived
 * here. Re-export the sheet, run `npm run catalog`, and the whole site
 * updates.
 *
 * Sheet shape (row 0 is the header):
 *   0 S.No | 1 PRODUCT NAME | 2 Tamil name | 3 PRICE | 4 80% DISCOUNT PRICE
 *   5 PER  | 6 Requirement  | 7 Amount
 *
 * A row whose S.No cell holds text instead of a number ("ROCKETS - ராக்கெட்
 * வகைகள்") is a category banner; every product row after it belongs to that
 * category until the next banner.
 * ------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE = resolve(ROOT, 'data/Crackers_Price_List.xlsx');
const TARGET = resolve(ROOT, 'src/data/catalog.json');

/** The sheet applies a flat 80% festival discount to every line. */
const DISCOUNT_PERCENT = 80;

/** Rows that are totals/footers rather than products or categories. */
const IGNORED_BANNERS = [/total amount/i];

/**
 * Tidy display names for a few categories whose sheet spelling is a typo
 * or an abbreviation. Keys are matched loosely against the English banner.
 * This never changes which products belong where — only the label shown.
 */
const CATEGORY_LABEL_FIXES = [
  [/fancy firworks/i, 'Fancy Fireworks'],
  [/continius crackers \(jokkar brand\)/i, 'Continuous Crackers — Jokkar'],
  [/continius crackers/i, 'Continuous Crackers'],
  [/multicolour shots \(premium\) \(joker\)/i, 'Multicolour Shots — Premium'],
  [/multifunction fountains/i, 'Multifunction Fountains'],
  [/colour fountain mega/i, 'Colour Fountain Mega'],
];

/**
 * Every category is drawn with one of ten hand-built SVG illustrations
 * (see src/components/product/ProductArt.jsx). This maps a category to its
 * artwork family and to the accent hue used across its pages.
 */
const CATEGORY_ART = [
  [/rocket/i, { art: 'rocket', hue: 4 }],
  [/sparkler/i, { art: 'sparkler', hue: 44 }],
  [/flower pots/i, { art: 'flowerpot', hue: 22 }],
  [/mud pots/i, { art: 'flowerpot', hue: 34 }],
  [/chakkaram|chakkar/i, { art: 'chakkar', hue: 340 }],
  [/bomb/i, { art: 'bomb', hue: 8 }],
  [/bijili/i, { art: 'bijili', hue: 356 }],
  [/twinkling/i, { art: 'sparkler', hue: 52 }],
  [/kids/i, { art: 'kids', hue: 200 }],
  [/fountain/i, { art: 'fountain', hue: 158 }],
  [/fancy/i, { art: 'fancy', hue: 286 }],
  [/whistling/i, { art: 'whistle', hue: 190 }],
  [/shots?/i, { art: 'aerial', hue: 268 }],
  [/continius|continuous/i, { art: 'garland', hue: 14 }],
  [/flash light|deluxe crackers/i, { art: 'garland', hue: 30 }],
  [/special items/i, { art: 'special', hue: 320 }],
];

/**
 * One short, plain line per category, written for a customer deciding what
 * to put in the order — what it does and where to burst it.
 */
const CATEGORY_BLURBS = [
  [/flash light/i, 'Single-sound crackers. The opening line of every Diwali morning.'],
  [/deluxe crackers/i, 'Louder single shots in deluxe wrap, sold by the packet and the box.'],
  [/bijili/i, 'Thin paper crackers by the bagful. Cheap, loud, endless.'],
  [/flower pots/i, 'Cone fountains that sit on the ground and throw a steady spray of sparks.'],
  [/mud pots/i, 'Clay-bodied fountains. Slower burn, wider bloom, no plastic.'],
  [/twinkling/i, 'Hand-held whips that crackle white. Safe enough for the youngest cousins.'],
  [/chakkaram/i, 'Ground wheels that spin flat and fast. Give them a clean patch of floor.'],
  [/bomb/i, 'Sound crackers, quarter kilo up to one kilo. Open space only.'],
  [/kids/i, 'Ring caps, guns and novelty boxes for children — noise without fire.'],
  [/rocket/i, 'Stick rockets that climb before they burst. Launch from a bottle, never by hand.'],
  [/colour fountain mega/i, 'Tall colour fountains, the centrepiece of the evening.'],
  [/multifunction fountains/i, 'One cone, several effects in sequence.'],
  [/fancy/i, 'Novelty pieces — butterflies, saucers, helicopters, smoke.'],
  [/single shots/i, 'One heavy shot per tube. Big bloom, short show.'],
  [/whistling/i, 'Pieces that scream before they burst.'],
  [/repeating/i, 'Multi-shot tubes that fire in a run from a single fuse.'],
  [/multicolour shots \(premium\)/i, 'Joker-brand aerial cakes, 15 to 240 shots.'],
  [/multicolour shots/i, 'Aerial cakes in mixed colour, 30 shots and up.'],
  [/sparkler/i, 'Wire sparklers from 10cm to 50cm, in electric, colour, green and red.'],
  [/continius|continuous/i, 'Sound garlands from 100 to 10,000 wala.'],
  [/special items/i, 'The odd and the theatrical — money showers, magic boxes, fire eggs.'],
];

/**
 * Combo bundles are not in the sheet, so they are composed here from real
 * catalogue lines by rule. Each recipe picks the cheapest N products from
 * the named categories, so the bundles stay valid when prices change.
 */
const COMBO_RECIPES = [
  {
    id: 'kids-safe-box',
    name: 'Kids Safe Box',
    tagline: 'Nothing in here goes above waist height',
    blurb:
      'Sparklers, ground wheels and cap guns only. No aerial shots, no sound crackers above a clap. Built for a terrace with small children on it.',
    bundleDiscount: 8,
    picks: [
      { match: /sparklers/i, count: 4 },
      { match: /kids/i, count: 3 },
      { match: /twinkling/i, count: 2 },
      { match: /chakkaram/i, count: 2 },
      { match: /flower pots/i, count: 1 },
    ],
  },
  {
    id: 'family-evening',
    name: 'Family Evening',
    tagline: 'One household, one evening, nothing left over',
    blurb:
      'The standard order most families end up at: a spread of ground pieces and fountains, a few aerials to close, and enough sparklers to go round twice.',
    bundleDiscount: 10,
    picks: [
      { match: /sparklers/i, count: 3 },
      { match: /flower pots/i, count: 3 },
      { match: /chakkaram/i, count: 2 },
      { match: /colour fountain mega/i, count: 2 },
      { match: /flash light/i, count: 2 },
      { match: /rocket/i, count: 1 },
      { match: /bijili/i, count: 1 },
    ],
  },
  {
    id: 'street-full',
    name: 'Full Street',
    tagline: 'When the whole lane bursts together',
    blurb:
      'Sound garlands, paper bombs and repeating shots in quantity. Assumes an open road, a bucket of sand and at least four adults watching.',
    bundleDiscount: 12,
    picks: [
      { match: /continius|continuous/i, count: 3 },
      { match: /bomb/i, count: 3 },
      { match: /repeating/i, count: 2 },
      { match: /multicolour shots/i, count: 2 },
      { match: /bijili/i, count: 2 },
      { match: /rocket/i, count: 2 },
    ],
  },
  {
    id: 'sky-premium',
    name: 'Sky Premium',
    tagline: 'Aerials only. Bring a camera.',
    blurb:
      'The high end of the list — premium Joker cakes, single shots and the big fountains. This is the box you buy when the whole family is home.',
    bundleDiscount: 14,
    picks: [
      { match: /multicolour shots \(premium\)/i, count: 3 },
      { match: /single shots/i, count: 3 },
      { match: /colour fountain mega/i, count: 2 },
      { match: /fancy/i, count: 2 },
      { match: /special items/i, count: 2 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clean = (value) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (value) =>
  clean(value)
    .toLowerCase()
    .replace(/["'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const firstMatch = (table, subject, fallback) => {
  const hit = table.find(([pattern]) => pattern.test(subject));
  return hit ? hit[1] : fallback;
};

/** "ROCKETS - ராக்கெட் வகைகள்" -> { en, ta } */
function splitBanner(raw) {
  const parts = raw.split(/\s+-\s+|\s+–\s+/);
  const en = clean(parts.shift());
  const ta = clean(parts.join(' - '));
  return { en, ta };
}

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(In|Of|The|And|At)\b/g, (m) => m.toLowerCase())
    .replace(/^(\w)/, (m) => m.toUpperCase());
}

/* ------------------------------------------------------------------ */
/* parse                                                               */
/* ------------------------------------------------------------------ */

function readSheet() {
  const workbook = XLSX.read(readFileSync(SOURCE), { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: null });
}

function parseCatalog(rows) {
  const categories = [];
  const products = [];
  let current = null;
  let sequence = 0;

  for (const row of rows.slice(1)) {
    const sno = clean(row[0]);
    const nameEn = clean(row[1]);
    const price = Number(row[3]);

    if (!sno && !nameEn) continue;

    const isProduct = nameEn && Number.isFinite(price) && price > 0;

    if (!isProduct) {
      if (!sno || IGNORED_BANNERS.some((re) => re.test(sno))) continue;
      const { en, ta } = splitBanner(sno);
      const label = firstMatch(CATEGORY_LABEL_FIXES, en, titleCase(en));
      current = {
        id: slugify(label),
        name: label,
        nameTa: ta,
        blurb: firstMatch(CATEGORY_BLURBS, en, 'Sivakasi-made, tested before it leaves the shelf.'),
        ...firstMatch(CATEGORY_ART, en, { art: 'garland', hue: 20 }),
        count: 0,
        from: Infinity,
        products: [],
      };
      categories.push(current);
      continue;
    }

    if (!current) continue;

    const mrp = Math.round(price);
    const sale = Math.round((mrp * (100 - DISCOUNT_PERCENT)) / 100);
    const nameTa = clean(row[2]);
    const unit = clean(row[5]) || '1 Box';
    sequence += 1;

    const baseSlug = slugify(`${nameEn}`) || `item-${sequence}`;
    const taken = products.some((p) => p.slug === baseSlug);
    const slug = taken ? `${baseSlug}-${slugify(current.id).slice(0, 10)}` : baseSlug;

    const product = {
      id: `vc-${String(sequence).padStart(3, '0')}`,
      sno: sequence,
      slug,
      name: nameEn,
      nameTa,
      categoryId: current.id,
      category: current.name,
      categoryTa: current.nameTa,
      art: current.art,
      hue: current.hue,
      mrp,
      price: sale,
      discount: DISCOUNT_PERCENT,
      saving: mrp - sale,
      unit,
      /* pieces per pack, when the sheet spells it out in the name */
      pieces: (() => {
        const m = nameEn.match(/(\d+)\s*(?:pcs|pc|pieces)/i);
        return m ? Number(m[1]) : null;
      })(),
    };

    products.push(product);
    current.products.push(product.slug);
    current.count += 1;
    current.from = Math.min(current.from, sale);
  }

  for (const category of categories) {
    if (category.from === Infinity) category.from = 0;
  }

  return {
    categories: categories.filter((c) => c.count > 0),
    products,
  };
}

/* ------------------------------------------------------------------ */
/* derived collections                                                 */
/* ------------------------------------------------------------------ */

function buildCombos(products, categories) {
  const byCategory = new Map(categories.map((c) => [c.id, c]));

  return COMBO_RECIPES.map((recipe) => {
    const items = [];

    for (const pick of recipe.picks) {
      const pool = products
        .filter((p) => {
          const category = byCategory.get(p.categoryId);
          return category && pick.match.test(category.name);
        })
        .sort((a, b) => a.price - b.price);

      /* spread the picks across the price band instead of taking the
         cheapest block, so a bundle reads like a real shop selection */
      const step = Math.max(1, Math.floor(pool.length / Math.max(pick.count, 1)));
      for (let i = 0; i < pick.count; i += 1) {
        const chosen = pool[Math.min(i * step, pool.length - 1)];
        if (chosen && !items.some((it) => it.slug === chosen.slug)) {
          items.push({ slug: chosen.slug, name: chosen.name, qty: 1, price: chosen.price });
        }
      }
    }

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const mrp = items.reduce((sum, it) => {
      const product = products.find((p) => p.slug === it.slug);
      return sum + (product ? product.mrp : 0) * it.qty;
    }, 0);
    const price = Math.round((subtotal * (100 - recipe.bundleDiscount)) / 100);

    return {
      id: recipe.id,
      slug: recipe.id,
      name: recipe.name,
      tagline: recipe.tagline,
      blurb: recipe.blurb,
      items,
      itemCount: items.length,
      mrp,
      subtotal,
      price,
      bundleDiscount: recipe.bundleDiscount,
      discount: mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0,
    };
  });
}

function buildFacets(products) {
  const prices = products.map((p) => p.price);
  const bands = [
    { id: 'under-100', label: 'Under ₹100', min: 0, max: 99 },
    { id: '100-250', label: '₹100 – ₹250', min: 100, max: 250 },
    { id: '250-500', label: '₹250 – ₹500', min: 250, max: 500 },
    { id: 'above-500', label: 'Above ₹500', min: 501, max: Infinity },
  ].map((band) => ({
    ...band,
    max: band.max === Infinity ? null : band.max,
    count: products.filter((p) => p.price >= band.min && (band.max === Infinity || p.price <= band.max)).length,
  }));

  return {
    priceBands: bands.filter((b) => b.count > 0),
    units: [...new Set(products.map((p) => p.unit))].sort(),
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/* ------------------------------------------------------------------ */
/* run                                                                 */
/* ------------------------------------------------------------------ */

function main() {
  const { categories, products } = parseCatalog(readSheet());

  if (!products.length) {
    throw new Error('No products parsed from the price list — check the sheet layout.');
  }

  /* Featured picks: the best-value line in each of the six categories a
     first-time buyer opens first. Chosen by rule, never by hand. */
  const featuredOrder = [/flower pots/i, /sparklers/i, /chakkaram/i, /rocket/i, /colour fountain mega/i, /bijili/i];
  const featured = featuredOrder
    .map((pattern) => {
      const category = categories.find((c) => pattern.test(c.name));
      if (!category) return null;
      return products
        .filter((p) => p.categoryId === category.id)
        .sort((a, b) => b.saving - a.saving)[0];
    })
    .filter(Boolean)
    .map((p) => p.slug);

  const catalog = {
    generatedAt: new Date().toISOString(),
    source: 'data/Crackers_Price_List.xlsx',
    discountPercent: DISCOUNT_PERCENT,
    totals: {
      products: products.length,
      categories: categories.length,
      lowest: Math.min(...products.map((p) => p.price)),
      highest: Math.max(...products.map((p) => p.price)),
    },
    categories,
    products,
    featured,
    combos: buildCombos(products, categories),
    facets: buildFacets(products),
  };

  mkdirSync(dirname(TARGET), { recursive: true });
  writeFileSync(TARGET, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

  console.log(
    `catalog → ${products.length} products · ${categories.length} categories · ${catalog.combos.length} combos`,
  );
}

main();
