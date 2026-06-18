/** Editorial typographic mural — indigo atelier, restrained botanical line work */
export default function HeroIllustration() {
  return (
    <div className="hero-illustration" aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hero-bg" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#1a0878" />
            <stop offset="55%" stopColor="#160572" />
            <stop offset="100%" stopColor="#0c0338" />
          </linearGradient>
          <linearGradient id="leaf-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#24e3dc" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#24e3dc" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#hero-bg)" />

        {/* Large watermark letterforms */}
        <text
          x="980"
          y="520"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="420"
          fontWeight="400"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          transform="rotate(-8 980 520)"
        >
          Aa
        </text>
        <text
          x="1080"
          y="280"
          fontFamily="Georgia, serif"
          fontSize="200"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          transform="rotate(6 1080 280)"
        >
          Gf
        </text>

        {/* Abstract botanical silhouettes — flat, not cartoon */}
        <path
          d="M1100 900 C1050 700 1150 500 1280 420 C1340 380 1380 340 1420 280 L1440 320 L1440 900 Z"
          fill="rgba(0,0,0,0.22)"
        />
        <path
          d="M0 900 C80 680 40 520 120 400 C180 320 220 280 280 240 L0 240 Z"
          fill="rgba(0,0,0,0.18)"
        />

        {/* Fine line botanical details */}
        <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" fill="none" strokeLinecap="round">
          <path d="M1240 650 Q1180 560 1220 480 Q1260 400 1310 360" />
          <path d="M1280 720 Q1320 640 1290 560 Q1260 480 1230 420" />
          <path d="M1180 780 Q1140 700 1160 620 Q1180 540 1210 480" />
          <path d="M200 620 Q260 540 240 460 Q220 380 180 320" />
          <path d="M140 700 Q100 620 130 540 Q160 460 200 400" />
        </g>

        {/* Accent strokes — curated punctuation only */}
        <circle cx="1180" cy="200" r="3" fill="#24e3dc" opacity="0.7" />
        <circle cx="320" cy="340" r="2.5" fill="#d64e2e" opacity="0.6" />
        <line x1="860" y1="160" x2="920" y2="160" stroke="#24e3dc" strokeWidth="1.5" opacity="0.35" />
        <line x1="400" y1="520" x2="460" y2="520" stroke="#eea883" strokeWidth="1.5" opacity="0.3" />

        {/* Soft glow on right */}
        <ellipse cx="1200" cy="450" rx="280" ry="320" fill="url(#leaf-fade)" />
      </svg>
    </div>
  );
}
