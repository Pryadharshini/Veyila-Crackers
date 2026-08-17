import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** SSR-safe layout effect. */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** True when the visitor has asked the OS to reduce motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Locks page scroll while a drawer or overlay is open. */
export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/** Calls `onClose` on Escape. */
export function useEscape(onClose, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, active]);
}

/** Calls `onOutside` on a pointer press outside the returned ref. */
export function useOutsideClick(onOutside, active = true) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return undefined;
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onOutside();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [onOutside, active]);
  return ref;
}

/** IntersectionObserver in one line. Fires once by default. */
export function useInView({ threshold = 0.2, rootMargin = '0px 0px -12% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

/** Window scroll position and direction, throttled to animation frames. */
export function useScrollInfo() {
  const [info, setInfo] = useState({ y: 0, direction: 'up', progress: 0 });
  const frame = useRef(0);
  const previous = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setInfo({
          y,
          direction: y > previous.current && y > 80 ? 'down' : 'up',
          progress: max > 0 ? Math.min(1, y / max) : 0,
        });
        previous.current = y;
        frame.current = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return info;
}

/**
 * Magnetic pointer pull. Attach the returned ref to a button; it eases toward
 * the cursor within `radius` and springs back on leave. Disabled for touch
 * pointers and reduced motion.
 */
export function useMagnetic({ strength = 0.32, radius = 90 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let raf = 0;
    let current = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };

    const loop = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      node.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const pull = Math.max(0, 1 - distance / (radius + Math.max(rect.width, rect.height) / 2));
      target = { x: dx * strength * pull, y: dy * strength * pull };
      start();
    };

    const onLeave = () => {
      target = { x: 0, y: 0 };
      start();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      node.style.transform = '';
    };
  }, [strength, radius, reduced]);

  return ref;
}

/** Counts up to `value` once the element scrolls into view. */
export function useCountUp(value, { duration = 1200 } = {}) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return [ref, display];
}

/** Debounced value, used by the search overlay. */
export function useDebounced(value, delay = 180) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** A stable callback that always sees the latest render's closure. */
export function useEvent(handler) {
  const ref = useRef(handler);
  useIsomorphicLayoutEffect(() => {
    ref.current = handler;
  });
  return useCallback((...args) => ref.current?.(...args), []);
}
