import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getProduct } from '@/lib/catalog';

/**
 * Cart state.
 *
 * No account, no server. The cart lives in localStorage so a customer can
 * build an order over several sittings — people put together a Diwali list
 * across a week — and it is restored on the next visit.
 *
 * Lines are stored as { slug, qty } only; price and name are read from the
 * catalogue at render time, so re-exporting the price list never leaves a
 * stale rupee value sitting in someone's browser.
 */

const STORAGE_KEY = 'veyila.cart.v1';
const CustomerKey = 'veyila.customer.v1';

const CartContext = createContext(null);

function read() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => line && typeof line.slug === 'string' && getProduct(line.slug))
      .map((line) => ({ slug: line.slug, qty: Math.min(99, Math.max(1, Number(line.qty) || 1)) }));
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { slug, qty = 1 } = action;
      if (!getProduct(slug)) return state;
      const existing = state.find((line) => line.slug === slug);
      if (existing) {
        return state.map((line) =>
          line.slug === slug ? { ...line, qty: Math.min(99, line.qty + qty) } : line,
        );
      }
      return [...state, { slug, qty: Math.min(99, Math.max(1, qty)) }];
    }
    case 'set': {
      const qty = Math.max(0, Math.min(99, action.qty));
      if (qty === 0) return state.filter((line) => line.slug !== action.slug);
      if (!state.some((line) => line.slug === action.slug)) {
        return getProduct(action.slug) ? [...state, { slug: action.slug, qty }] : state;
      }
      return state.map((line) => (line.slug === action.slug ? { ...line, qty } : line));
    }
    case 'remove':
      return state.filter((line) => line.slug !== action.slug);
    case 'addMany': {
      let next = state;
      for (const item of action.items) {
        next = reducer(next, { type: 'add', slug: item.slug, qty: item.qty ?? 1 });
      }
      return next;
    }
    case 'replace':
      return action.lines;
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, read);
  const [drawerOpen, setDrawerOpen] = useState(false);
  /* slug of the line that just changed — drives the row flash and the
     header badge bump without a global animation library */
  const [pulse, setPulse] = useState(null);
  const pulseTimer = useRef(null);

  const [customer, setCustomerState] = useState(() => {
    if (typeof window === 'undefined') return emptyCustomer();
    try {
      return { ...emptyCustomer(), ...JSON.parse(window.localStorage.getItem(CustomerKey) || '{}') };
    } catch {
      return emptyCustomer();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private browsing — the cart simply won't persist */
    }
  }, [lines]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CustomerKey, JSON.stringify(customer));
    } catch {
      /* ignore */
    }
  }, [customer]);

  /* Keep two tabs of the same shop in step. */
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      dispatch({ type: 'replace', lines: read() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => () => clearTimeout(pulseTimer.current), []);

  const flash = useCallback((slug) => {
    setPulse(slug);
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(null), 900);
  }, []);

  const add = useCallback(
    (slug, qty = 1, { open = false } = {}) => {
      dispatch({ type: 'add', slug, qty });
      flash(slug);
      if (open) setDrawerOpen(true);
    },
    [flash],
  );

  const addMany = useCallback((items, { open = true } = {}) => {
    dispatch({ type: 'addMany', items });
    if (open) setDrawerOpen(true);
  }, []);

  const setQty = useCallback((slug, qty) => dispatch({ type: 'set', slug, qty }), []);
  const remove = useCallback((slug) => dispatch({ type: 'remove', slug }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);
  const setCustomer = useCallback((patch) => setCustomerState((prev) => ({ ...prev, ...patch })), []);

  /* Hydrated lines: catalogue data joined onto the stored quantities. */
  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProduct(line.slug);
          if (!product) return null;
          return { ...product, qty: line.qty, amount: product.price * line.qty };
        })
        .filter(Boolean),
    [lines],
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const listTotal = items.reduce((sum, item) => sum + item.mrp * item.qty, 0);
    return {
      lines: items.length,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      subtotal,
      listTotal,
      savings: listTotal - subtotal,
    };
  }, [items]);

  const qtyOf = useCallback(
    (slug) => lines.find((line) => line.slug === slug)?.qty ?? 0,
    [lines],
  );

  const value = useMemo(
    () => ({
      items,
      totals,
      qtyOf,
      add,
      addMany,
      setQty,
      remove,
      clear,
      pulse,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      customer,
      setCustomer,
    }),
    [items, totals, qtyOf, add, addMany, setQty, remove, clear, pulse, drawerOpen, customer, setCustomer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function emptyCustomer() {
  return { name: '', phone: '', address: '', landmark: '', notes: '' };
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
