/**
 * Read-only access layer over the generated catalogue.
 *
 * catalog.json is written by scripts/build-catalog.mjs from the shop's
 * Excel price list. Components never import the JSON directly — they call
 * these helpers, so the shape of the sheet can change without touching the UI.
 */
import catalog from '@/data/catalog.json';

export const CATALOG = catalog;
export const PRODUCTS = catalog.products;
export const CATEGORIES = catalog.categories;
export const COMBOS = catalog.combos;
export const FACETS = catalog.facets;
export const TOTALS = catalog.totals;
export const DISCOUNT = catalog.discountPercent;

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]));

export const getProduct = (slug) => bySlug.get(slug) ?? null;
export const getProductById = (id) => byId.get(id) ?? null;
export const getCategory = (id) => categoryById.get(id) ?? null;
export const getCombo = (slug) => COMBOS.find((c) => c.slug === slug) ?? null;

export const productsIn = (categoryId) => PRODUCTS.filter((p) => p.categoryId === categoryId);

export const featuredProducts = () => catalog.featured.map(getProduct).filter(Boolean);

/** Same category first, then nearest price. Used on the product page. */
export function relatedProducts(product, limit = 6) {
  if (!product) return [];
  return productsIn(product.categoryId)
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, limit);
}

/** The six categories a first-time buyer is most likely to open. */
export const headlineCategories = () =>
  ['sparklers', 'flower-pots', 'chakkarams', 'rockets', 'colour-fountain-mega', 'kids-special']
    .map(getCategory)
    .filter(Boolean);

export const SORTS = [
  { id: 'sheet', label: 'Price list order' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'saving', label: 'Biggest saving' },
  { id: 'name', label: 'Name A–Z' },
];

const comparators = {
  sheet: (a, b) => a.sno - b.sno,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  saving: (a, b) => b.saving - a.saving,
  name: (a, b) => a.name.localeCompare(b.name),
};

/**
 * Match a query against the English name, the Tamil name, the category and
 * the sheet's line number, so "42", "பாம்" and "bomb" all find the same row.
 */
export function matchesQuery(product, query) {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    product.name.toLowerCase().includes(needle) ||
    product.nameTa.toLowerCase().includes(needle) ||
    product.category.toLowerCase().includes(needle) ||
    product.categoryTa.toLowerCase().includes(needle) ||
    String(product.sno) === needle
  );
}

/**
 * The one filtering function used by search, the listing page and every
 * category page.
 *
 * @param {object} options
 * @param {string} [options.query]        free text
 * @param {string[]} [options.categories] category ids
 * @param {string[]} [options.bands]      price band ids from FACETS
 * @param {string[]} [options.units]      pack units, e.g. "1 Box"
 * @param {string} [options.sort]         a SORTS id
 */
export function queryProducts({ query = '', categories = [], bands = [], units = [], sort = 'sheet' } = {}) {
  const activeBands = FACETS.priceBands.filter((b) => bands.includes(b.id));

  const results = PRODUCTS.filter((product) => {
    if (!matchesQuery(product, query)) return false;
    if (categories.length && !categories.includes(product.categoryId)) return false;
    if (units.length && !units.includes(product.unit)) return false;
    if (activeBands.length) {
      const inBand = activeBands.some(
        (band) => product.price >= band.min && (band.max === null || product.price <= band.max),
      );
      if (!inBand) return false;
    }
    return true;
  });

  return results.sort(comparators[sort] ?? comparators.sheet);
}

/** Quick suggestions for the search overlay. */
export function suggest(query, limit = 7) {
  if (!query.trim()) return [];
  return PRODUCTS.filter((p) => matchesQuery(p, query)).slice(0, limit);
}
