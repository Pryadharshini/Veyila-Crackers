/**
 * Veyila Crackers — design tokens.
 *
 * Palette is drawn from the objects the shop actually sells: the roasted
 * brown-black of a Sivakasi night, the vermilion of a cracker wrapper, brass
 * lamp gold, and the newsprint cream of the paper price list the shop hands
 * out. "paper" is used as a surface, not a background — the whole point of the
 * layout is a paper ledger laid on a dark sky.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#120B0A', // night ground
          800: '#1B100E', // raised surface
          700: '#241614', // card
          600: '#33201C', // hairline / border
          500: '#4A2F28',
        },
        ember: {
          DEFAULT: '#E23B26', // wrapper red — the primary action colour
          bright: '#FF5334',
          deep: '#A81E12',
        },
        gold: {
          DEFAULT: '#E9B44C', // brass lamp
          soft: '#F5D68C',
          deep: '#B4832A',
        },
        saffron: '#F27C38',
        paper: {
          DEFAULT: '#F3E9D8', // price-list newsprint
          dim: '#E0D2BB',
          deep: '#C6B394',
        },
        leaf: '#4E7A5E', // the green on a Sivakasi label, used only for "in stock"
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        tamil: ['"Anek Tamil"', '"Noto Sans Tamil"', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        display: ['clamp(2.75rem, 8vw, 7.5rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        headline: ['clamp(2rem, 4.4vw, 3.75rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        title: ['clamp(1.5rem, 2.6vw, 2.25rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        card: '1.25rem',
        pill: '999px',
      },
      boxShadow: {
        lamp: '0 0 0 1px rgba(233,180,76,.14), 0 30px 80px -40px rgba(226,59,38,.65)',
        lift: '0 40px 90px -50px rgba(0,0,0,.9)',
        sheet: '0 2px 0 rgba(0,0,0,.35), 0 40px 80px -48px rgba(0,0,0,.85)',
      },
      backgroundImage: {
        'ember-wash': 'radial-gradient(120% 90% at 50% 0%, rgba(226,59,38,.22) 0%, transparent 62%)',
        'gold-line': 'linear-gradient(90deg, transparent, rgba(233,180,76,.55), transparent)',
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.42'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        fuse: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        rise: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '45%': { opacity: '.82' },
          '52%': { opacity: '.95' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(0,-120px,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        fuse: 'fuse 2.4s linear infinite',
        rise: 'rise .55s cubic-bezier(.22,1,.36,1) both',
        flicker: 'flicker 4s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        sweep: 'sweep 1.6s cubic-bezier(.4,0,.2,1) infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.22,1,.36,1)',
      },
    },
  },
  plugins: [],
};
