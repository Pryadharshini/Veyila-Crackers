/**
 * Builds the WhatsApp order message.
 *
 * The shop reads these on a phone, so the message is laid out like the paper
 * estimate slip they already use: numbered lines, quantity, rate, amount,
 * then the total and the delivery block. Plain text only — WhatsApp's
 * *bold* markers are the only formatting that survives.
 */
import { SHOP } from './shop';
import { money, pad, plain } from './format';

const RULE = '━━━━━━━━━━━━━━━━━━━━';

/** Order number the customer can quote on the phone: VC-0815-4821 */
export function orderReference(date = new Date()) {
  const stamp = `${pad(date.getDate())}${pad(date.getMonth() + 1)}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VC-${stamp}-${random}`;
}

/**
 * @param {object} input
 * @param {Array}  input.items     cart lines: { name, nameTa, qty, price, unit, sno }
 * @param {object} input.customer  { name, phone, address, landmark, notes }
 * @param {number} input.subtotal
 * @param {number} input.savings
 */
export function buildOrderMessage({ items, customer, subtotal, savings, reference }) {
  const ref = reference || orderReference();

  const lines = items.map((item, index) => {
    const amount = item.price * item.qty;
    return [
      `${pad(index + 1)}. ${item.name}`,
      `    ${item.qty} × ${money(item.price)} = ${money(amount)}  (${item.unit})`,
    ].join('\n');
  });

  const body = [
    `*NEW ORDER — ${SHOP.name}*`,
    `Ref: ${ref}`,
    RULE,
    '',
    `*Items (${items.length})*`,
    ...lines,
    '',
    RULE,
    `*Total: ${money(subtotal)}*`,
    savings > 0 ? `You saved ${money(savings)} off list price` : null,
    RULE,
    '',
    '*Delivery details*',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    customer.landmark ? `Landmark: ${customer.landmark}` : null,
    customer.notes ? `Notes: ${customer.notes}` : null,
    '',
    RULE,
    'Sent from veyilacrackers.com',
  ]
    .filter((line) => line !== null)
    .join('\n');

  return body;
}

/** wa.me link with the message pre-filled. */
export function whatsappUrl(message) {
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** A short enquiry link used by the header, footer and product page. */
export function enquiryUrl(subject) {
  const text = subject
    ? `Hello ${SHOP.name}, I'd like to ask about: ${subject}`
    : `Hello ${SHOP.name}, I'd like to place an order.`;
  return whatsappUrl(text);
}

/** Total line count and rupee value, used in a few summary spots. */
export const orderTotals = (items) =>
  items.reduce(
    (acc, item) => ({
      count: acc.count + item.qty,
      subtotal: acc.subtotal + item.price * item.qty,
      savings: acc.savings + (item.mrp - item.price) * item.qty,
    }),
    { count: 0, subtotal: 0, savings: 0 },
  );

/**
 * WhatsApp truncates very long links on some Android builds. Anything past
 * roughly 60 lines is safer sent as a summary plus a follow-up.
 */
export const isLongOrder = (items) => items.length > 45;

/** Compact fallback for very large orders. */
export function buildCompactMessage({ items, customer, subtotal, reference }) {
  const ref = reference || orderReference();
  const compact = items.map((i) => `${i.name} ×${i.qty}`).join(', ');
  return [
    `*NEW ORDER — ${SHOP.name}* (${ref})`,
    `${items.length} items · Total ${money(subtotal)}`,
    '',
    compact,
    '',
    `${customer.name} · ${customer.phone}`,
    customer.address,
    '',
    `Full itemised list: ${plain(items.length)} lines — I'll send it as a follow-up if needed.`,
  ].join('\n');
}
