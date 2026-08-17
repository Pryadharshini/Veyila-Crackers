/** Number and text formatting shared across the app. */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** ₹1,250 */
export const money = (value) => inr.format(Math.round(Number(value) || 0));

/** 1,250 — for places where the ₹ is already printed as a column header. */
export const plain = (value) => new Intl.NumberFormat('en-IN').format(Math.round(Number(value) || 0));

/** 07, 149 — the ledger keeps its numbers the same width. */
export const pad = (value, width = 2) => String(value).padStart(width, '0');

/** Shorten a long product name for breadcrumbs and drawer rows. */
export const truncate = (value, max = 42) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

/** "1 Box" -> "box" for inline prose. */
export const unitWord = (unit = '') => unit.replace(/^\d+\s*/, '').toLowerCase();
