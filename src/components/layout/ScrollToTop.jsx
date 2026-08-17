import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrollInfo } from '@/hooks';
import Icon from '@/components/ui/Icon';

/** Resets scroll on navigation, except when the URL carries a hash. */
export function ScrollReset() {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, hash, search]);

  return null;
}

/** Back-to-top button, appearing only once there's a page worth climbing. */
export function ScrollToTopButton() {
  const { y, progress } = useScrollInfo();
  const visible = y > 900;
  const circumference = 2 * Math.PI * 17;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.28 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="glass fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full text-paper/70 transition-colors hover:text-gold"
          aria-label="Back to top"
        >
          <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(243,233,216,.1)" strokeWidth="1.5" />
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="#E9B44C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <Icon name="up" size={16} className="relative" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
