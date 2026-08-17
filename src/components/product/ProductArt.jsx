import { useId, memo } from 'react';


/**
 * ProductArt
 * ------------------------------------------------------------------
 * The shop has no photograph for any of its 149 lines — a Sivakasi price
 * list is text and nothing else. Rather than fill the page with stock images
 * of somebody else's fireworks, every category gets a drawing of the thing
 * itself: a cone fountain looks like a cone, a garland looks like a garland,
 * an aerial cake shows its tubes.
 *
 * `hue` comes from the catalogue and is fixed per category, so a customer
 * learns the colour of "rockets" the same way they learn the colour of an
 * aisle. `seed` (the product slug) makes small details differ line to line
 * without changing the family.
 * ------------------------------------------------------------------
 */

const hash = (value = '') => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) % 100000;
  return h;
};

const shade = (hue, saturation, lightness, alpha = 1) =>
  `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

/* ------------------------------------------------------------------ */
/* shared decorative pieces                                            */
/* ------------------------------------------------------------------ */

function Sparks({ hue, seed, count = 14, cx = 100, cy = 60, spread = 74 }) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + (seed % 7) * 0.11;
        const radius = spread * (0.45 + ((seed + i * 37) % 55) / 100);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.82;
        const r = 0.9 + ((seed + i * 13) % 5) * 0.32;
        return (
          <circle
            key={i}
            cx={x.toFixed(1)}
            cy={y.toFixed(1)}
            r={r.toFixed(2)}
            fill={i % 3 === 0 ? shade(48, 92, 68, 0.92) : shade(hue, 88, 66, 0.72)}
          />
        );
      })}
    </g>
  );
}

function Trail({ hue, x, y, length = 40, tilt = 0 }) {
  return (
    <path
      d={`M ${x} ${y} q ${tilt} ${length / 2} ${tilt * 1.4} ${length}`}
      stroke={shade(hue, 90, 62, 0.42)}
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="2 5"
    />
  );
}

/* ------------------------------------------------------------------ */
/* families                                                            */
/* ------------------------------------------------------------------ */

const families = {
  /* stick rocket, mid-flight */
  rocket: ({ hue, seed }) => (
    <>
      <Sparks hue={hue} seed={seed} cx={104} cy={40} spread={52} count={12} />
      <path d="M104 34c9 9 13 20 13 31h-26c0-11 4-22 13-31Z" fill={shade(hue, 78, 52)} />
      <path d="M104 34c5 6 8.5 13 10.5 21H104V34Z" fill={shade(hue, 84, 64)} />
      <rect x="97" y="65" width="14" height="18" rx="2" fill={shade(48, 80, 58)} />
      <rect x="97" y="70" width="14" height="3.5" fill={shade(hue, 70, 38)} />
      <path d="M91 83h26l-4 8H95l-4-8Z" fill={shade(hue, 72, 44)} />
      <rect x="102" y="91" width="4" height="52" rx="2" fill="#6b4b32" />
      <path d="M91 68l-7 12 7-2v-10ZM117 68l7 12-7-2V68Z" fill={shade(hue, 76, 46)} />
      <Trail hue={hue} x={104} y={146} length={34} tilt={2} />
    </>
  ),

  /* wire sparkler in a hand-held bundle */
  sparkler: ({ hue, seed }) => (
    <>
      {[-16, -6, 4, 14].map((offset, i) => (
        <g key={i}>
          <line
            x1={100 + offset * 0.35}
            y1="150"
            x2={100 + offset * 2.1}
            y2="52"
            stroke="#8a8f96"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={100 + offset * 1.2}
            y1="96"
            x2={100 + offset * 2.1}
            y2="52"
            stroke={shade(hue, 70, 42)}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </g>
      ))}
      {[-16, -6, 4, 14].map((offset, i) => (
        <Sparks key={i} hue={hue} seed={seed + i * 9} cx={100 + offset * 2.1} cy={50} spread={26} count={9} />
      ))}
      <circle cx="100" cy="152" r="9" fill={shade(hue, 40, 26)} />
    </>
  ),

  /* cone flower pot throwing a spray */
  flowerpot: ({ hue, seed }) => (
    <>
      <path
        d="M100 26c6 20 12 34 12 50 0 10-5 16-12 16s-12-6-12-16c0-16 6-30 12-50Z"
        fill={shade(48, 90, 62, 0.28)}
      />
      <Sparks hue={hue} seed={seed} cx={100} cy={44} spread={46} count={13} />
      <path d="M100 62 74 142h52L100 62Z" fill={shade(hue, 74, 46)} />
      <path d="M100 62 87 102h26L100 62Z" fill={shade(hue, 80, 58)} />
      <path d="M84 112h32l3 10H81l3-10Z" fill={shade(48, 78, 54)} />
      <path d="M70 142h60v8a3 3 0 0 1-3 3H73a3 3 0 0 1-3-3v-8Z" fill={shade(hue, 60, 32)} />
      <circle cx="100" cy="122" r="4.5" fill={shade(48, 88, 66)} />
    </>
  ),

  /* ground wheel, seen flat */
  chakkar: ({ hue, seed }) => (
    <>
      <ellipse cx="100" cy="100" rx="62" ry="46" fill={shade(hue, 68, 20, 0.5)} />
      <ellipse cx="100" cy="98" rx="52" ry="38" fill={shade(hue, 72, 40)} />
      <ellipse cx="100" cy="98" rx="34" ry="25" fill={shade(48, 76, 52)} />
      <ellipse cx="100" cy="98" rx="14" ry="10" fill={shade(hue, 66, 30)} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <path
            key={i}
            d={`M ${100 + Math.cos(a) * 52} ${98 + Math.sin(a) * 38} q ${Math.cos(a + 1) * 24} ${
              Math.sin(a + 1) * 18
            } ${Math.cos(a + 1.6) * 34} ${Math.sin(a + 1.6) * 26}`}
            stroke={shade(48, 90, 64, 0.6)}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      <Sparks hue={hue} seed={seed} cx={100} cy={98} spread={76} count={16} />
    </>
  ),

  /* wrapped sound cracker */
  bomb: ({ hue, seed }) => (
    <>
      <Sparks hue={48} seed={seed} cx={100} cy={44} spread={30} count={8} />
      <path d="M100 52c0-10 6-14 6-22" stroke={shade(48, 84, 58)} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <rect x="64" y="56" width="72" height="84" rx="7" fill={shade(hue, 70, 42)} />
      <rect x="64" y="76" width="72" height="16" fill={shade(48, 80, 56)} />
      <rect x="64" y="108" width="72" height="10" fill={shade(hue, 66, 28)} />
      <circle cx="100" cy="84" r="12" fill={shade(hue, 74, 34)} />
      <circle cx="100" cy="84" r="5" fill={shade(48, 88, 66)} />
      <rect x="64" y="56" width="72" height="84" rx="7" fill="none" stroke={shade(hue, 60, 22)} strokeWidth="2" />
    </>
  ),

  /* bagged paper crackers */
  bijili: ({ hue, seed }) => (
    <>
      <path d="M62 62h76v78a6 6 0 0 1-6 6H68a6 6 0 0 1-6-6V62Z" fill={shade(hue, 62, 34, 0.85)} />
      <path d="M62 62h76v10H62z" fill={shade(hue, 70, 46)} />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <rect
            x={70 + (i % 4) * 17}
            y={78 + Math.floor(i / 4) * 30}
            width="7"
            height="26"
            rx="3"
            fill={i % 2 ? shade(48, 80, 56) : shade(hue, 80, 58)}
            transform={`rotate(${((seed + i * 17) % 22) - 11} ${73 + (i % 4) * 17} ${90 + Math.floor(i / 4) * 30})`}
          />
        </g>
      ))}
      <path d="M62 62 100 44l38 18" fill="none" stroke={shade(hue, 60, 26)} strokeWidth="2.4" strokeLinejoin="round" />
      <Sparks hue={hue} seed={seed} cx={100} cy={54} spread={34} count={7} />
    </>
  ),

  /* cap-gun / novelty box for children */
  kids: ({ hue, seed }) => (
    <>
      <rect x="56" y="70" width="88" height="66" rx="8" fill={shade(hue, 58, 40)} />
      <rect x="56" y="70" width="88" height="18" rx="8" fill={shade(hue, 64, 52)} />
      <circle cx="82" cy="110" r="13" fill={shade(14, 80, 56)} />
      <circle cx="82" cy="110" r="5" fill={shade(48, 84, 66)} />
      <rect x="104" y="98" width="30" height="9" rx="4" fill={shade(48, 78, 58)} />
      <rect x="104" y="114" width="20" height="9" rx="4" fill={shade(48, 60, 44)} />
      <path d="M74 70V58a26 26 0 0 1 52 0v12" fill="none" stroke={shade(hue, 60, 46)} strokeWidth="3" />
      <Sparks hue={hue} seed={seed} cx={100} cy={52} spread={30} count={8} />
    </>
  ),

  /* tall colour fountain */
  fountain: ({ hue, seed }) => (
    <>
      <path d="M100 22c10 22 22 40 22 56 0 4-2 7-4 9H82c-2-2-4-5-4-9 0-16 12-34 22-56Z" fill={shade(hue, 82, 58, 0.22)} />
      <Sparks hue={hue} seed={seed} cx={100} cy={40} spread={54} count={15} />
      <rect x="82" y="82" width="36" height="58" rx="5" fill={shade(hue, 68, 42)} />
      <rect x="82" y="96" width="36" height="12" fill={shade(48, 80, 56)} />
      <rect x="82" y="118" width="36" height="8" fill={shade(hue, 74, 54)} />
      <path d="M78 140h44l4 10H74l4-10Z" fill={shade(hue, 58, 28)} />
      <path d="M92 82c2-8 4-12 8-16 4 4 6 8 8 16H92Z" fill={shade(48, 86, 62)} />
    </>
  ),

  /* novelty piece — butterfly / saucer */
  fancy: ({ hue, seed }) => (
    <>
      <ellipse cx="100" cy="102" rx="26" ry="9" fill={shade(hue, 66, 44)} />
      <ellipse cx="100" cy="96" rx="15" ry="11" fill={shade(hue, 72, 56)} />
      <ellipse cx="100" cy="94" rx="7" ry="5" fill={shade(48, 84, 66)} />
      <path d="M74 102q-22-22-6-34 14-10 26 20Z" fill={shade(hue, 70, 50, 0.9)} />
      <path d="M126 102q22-22 6-34-14-10-26 20Z" fill={shade(hue, 70, 50, 0.9)} />
      <path d="M74 106q-20 18-4 28 12 7 24-16Z" fill={shade(hue, 64, 40, 0.85)} />
      <path d="M126 106q20 18 4 28-12 7-24-16Z" fill={shade(hue, 64, 40, 0.85)} />
      <Sparks hue={hue} seed={seed} cx={100} cy={96} spread={70} count={12} />
    </>
  ),

  /* whistling piece — tube with sound rings */
  whistle: ({ hue, seed }) => (
    <>
      {[26, 40, 54].map((r, i) => (
        <path
          key={i}
          d={`M ${100 + r * 0.75} ${76 - r * 0.5} a ${r} ${r} 0 0 1 0 ${r * 1.1}`}
          stroke={shade(hue, 78, 58, 0.45 - i * 0.1)}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {[26, 40, 54].map((r, i) => (
        <path
          key={`l${i}`}
          d={`M ${100 - r * 0.75} ${76 - r * 0.5} a ${r} ${r} 0 0 0 0 ${r * 1.1}`}
          stroke={shade(hue, 78, 58, 0.45 - i * 0.1)}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <rect x="88" y="62" width="24" height="78" rx="6" fill={shade(hue, 66, 42)} />
      <rect x="88" y="78" width="24" height="10" fill={shade(48, 80, 58)} />
      <path d="M88 62l12-16 12 16H88Z" fill={shade(hue, 74, 54)} />
      <path d="M84 140h32l3 9H81l3-9Z" fill={shade(hue, 56, 26)} />
      <Sparks hue={hue} seed={seed} cx={100} cy={40} spread={22} count={6} />
    </>
  ),

  /* aerial cake — a block of tubes */
  aerial: ({ hue, seed }) => (
    <>
      <Sparks hue={hue} seed={seed} cx={100} cy={40} spread={66} count={16} />
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={74 + col * 17}
            cy={96 + row * 15}
            r="6.4"
            fill={(row + col) % 2 ? shade(hue, 70, 46) : shade(hue, 62, 32)}
          />
        )),
      )}
      <rect x="62" y="84" width="76" height="56" rx="6" fill="none" stroke={shade(hue, 62, 40)} strokeWidth="3" />
      <rect x="62" y="140" width="76" height="10" rx="3" fill={shade(hue, 56, 26)} />
      <path d="M100 84c0-14 6-20 6-30" stroke={shade(48, 84, 60)} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),

  /* sound garland — a hanging string of crackers */
  garland: ({ hue, seed }) => (
    <>
      <path d="M56 44q44 26 88 0" fill="none" stroke={shade(48, 60, 40)} strokeWidth="2" />
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const x = 56 + t * 88;
        const y = 44 + Math.sin(Math.PI * t) * 13;
        const len = 34 + ((seed + i * 23) % 22);
        return (
          <g key={i}>
            <rect x={x - 3.5} y={y} width="7" height={len} rx="3" fill={i % 2 ? shade(hue, 74, 48) : shade(hue, 66, 36)} />
            <rect x={x - 3.5} y={y + len * 0.42} width="7" height="4" fill={shade(48, 82, 58)} />
          </g>
        );
      })}
      <Sparks hue={hue} seed={seed} cx={100} cy={124} spread={44} count={11} />
    </>
  ),

  /* the theatrical odds and ends */
  special: ({ hue, seed }) => (
    <>
      <Sparks hue={hue} seed={seed} cx={100} cy={54} spread={58} count={14} />
      <path d="M66 90h68l-8 52a6 6 0 0 1-6 5H80a6 6 0 0 1-6-5L66 90Z" fill={shade(hue, 62, 38)} />
      <path d="M62 78h76v14H62z" fill={shade(hue, 70, 50)} />
      <path d="M100 78V60" stroke={shade(48, 84, 60)} strokeWidth="2.6" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={78 + i * 17}
          y={104 + (i % 2) * 8}
          width="12"
          height="16"
          rx="2"
          fill={shade(48, 80, 58, 0.9)}
          transform={`rotate(${((seed + i * 31) % 30) - 15} ${84 + i * 17} 112)`}
        />
      ))}
    </>
  ),
};

/* ------------------------------------------------------------------ */

function ProductArt({ art = 'garland', hue = 20, seed = '', className = '', label = '' }) {
  const gradientId = useId();
  const Family = families[art] ?? families.garland;
  const numericSeed = hash(seed);

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={`${gradientId}-glow`} cx="50%" cy="34%" r="62%">
          <stop offset="0%" stopColor={shade(hue, 86, 56, 0.34)} />
          <stop offset="58%" stopColor={shade(hue, 70, 30, 0.14)} />
          <stop offset="100%" stopColor="rgba(18,11,10,0)" />
        </radialGradient>
        <linearGradient id={`${gradientId}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(18,11,10,0)" />
          <stop offset="100%" stopColor="rgba(18,11,10,.55)" />
        </linearGradient>
      </defs>

      <rect width="200" height="200" fill={`url(#${gradientId}-glow)`} />
      <Family hue={hue} seed={numericSeed} />
      <rect y="150" width="200" height="50" fill={`url(#${gradientId}-floor)`} />
      <ellipse cx="100" cy="158" rx="52" ry="6" fill="rgba(0,0,0,.35)" />
    </svg>
  );
}

export default memo(ProductArt);
