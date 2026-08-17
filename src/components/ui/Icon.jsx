/**
 * One stroked icon set, drawn on a 24px grid at 1.5 stroke so the whole
 * interface shares a single line weight. No icon library — twelve glyphs is
 * cheaper to draw than to install.
 */
const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>,
  cart: (
    <>
      <path d="M3 4h2.2l2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.55L20.5 8H6.2" />
      <circle cx="10" cy="20" r="1.2" />
      <circle cx="17.5" cy="20" r="1.2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 12.5a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7" /></>,
  phone: <path d="M4.5 4h3.2l1.4 4-2 1.4a12 12 0 0 0 5.5 5.5l1.4-2 4 1.4v3.2a1.5 1.5 0 0 1-1.7 1.5A16.5 16.5 0 0 1 3 5.7 1.5 1.5 0 0 1 4.5 4Z" />,
  pin: <><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  check: <path d="m5 13 4.5 4.5L19 7" />,
  filter: <><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
  sort: <><path d="M7 4v16" /><path d="m3.5 16.5 3.5 3.5 3.5-3.5" /><path d="M17 20V4" /><path d="m13.5 7.5 3.5-3.5 3.5 3.5" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  rows: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.6 2.6M15.4 15.4 18 18M18 6l-2.6 2.6M8.6 15.4 6 18" />,
  shield: <><path d="M12 3.5 5.5 6v6c0 4 2.8 7.2 6.5 8.5 3.7-1.3 6.5-4.5 6.5-8.5V6Z" /><path d="m9.3 12 1.9 1.9 3.6-3.7" /></>,
  flame: <path d="M12 21c3.6 0 6-2.3 6-5.4 0-3.6-3.2-5.2-3.2-8.6-2 1-2.6 2.9-2.6 4.4 0 .9-.6 1.4-1.2 1.4-.8 0-1.3-.7-1.3-1.7v-1.4C8 11 6 12.7 6 15.6 6 18.7 8.4 21 12 21Z" />,
  whatsapp: (
    <path d="M20.2 12a8.2 8.2 0 0 1-12.1 7.2L4 20.4l1.3-4a8.2 8.2 0 1 1 14.9-4.4ZM9.4 8.2c-.2 0-.5 0-.7.4-.2.4-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.7 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.7-.4c-.3-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.7 1c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.4 0-.5.1-.7l.5-.6c.1-.2.2-.3.3-.5v-.5l-.8-1.7c-.2-.4-.4-.3-.6-.3Z" />
  ),
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5" /><path d="M12 7.8v.2" /></>,
  leaf: <><path d="M5 19c0-7 5-12 14-12 0 8-4.5 12-11 12H5Z" /><path d="M9 15c1.5-2.5 3.7-4.2 6.5-5" /></>,
  truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h3.5l2.5 3v3H14z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  sheet: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  up: <path d="M12 19V6m0 0-5.5 5.5M12 6l5.5 5.5" />,
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.5, filled = false, ...rest }) {
  const glyph = paths[name];
  if (!glyph) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyph}
    </svg>
  );
}
