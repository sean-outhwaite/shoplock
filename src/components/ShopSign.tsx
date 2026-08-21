import type { ItemCategory } from '../types.ts'

/** Turbulence-based grain, clipped to whatever shape it's applied to via
 * feComposite against the shape's own alpha, then blended back on top. */
function GrainFilter({ id, seed }: { id: string; seed: number }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        seed={seed}
        stitchTiles="stitch"
        result="noise"
      />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"
        result="noiseAlpha"
      />
      <feComposite
        in="noiseAlpha"
        in2="SourceGraphic"
        operator="in"
        result="noiseClipped"
      />
      <feBlend in="SourceGraphic" in2="noiseClipped" mode="overlay" />
    </filter>
  )
}

function WeaponSign() {
  return (
    <svg
      className="shop-sign shop-sign--weapon"
      viewBox="0 0 340 128"
      aria-hidden="true"
    >
      <defs>
        <GrainFilter id="grain-weapon" seed={3} />
        <linearGradient id="weapon-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1512" />
          <stop offset="100%" stopColor="#0a0908" />
        </linearGradient>
      </defs>
      <path
        d="M 14,3 L 326,3 L 337,14 L 337,114 L 326,125 L 14,125 L 3,114 L 3,14 Z"
        fill="url(#weapon-fill)"
        stroke="var(--weapon-sign-accent)"
        strokeWidth="2"
        filter="url(#grain-weapon)"
      />
      <path
        d="M 21,10 L 319,10 L 330,21 L 330,107 L 319,118 L 21,118 L 10,107 L 10,21 Z"
        fill="none"
        stroke="var(--weapon-sign-accent)"
        strokeWidth="1"
        opacity="0.7"
      />
      <text
        x="170"
        y="65"
        textAnchor="middle"
        className="shop-sign__title"
      >
        FAIRFAX
      </text>
      <line
        x1="60"
        y1="83"
        x2="280"
        y2="83"
        stroke="var(--weapon-sign-accent)"
        strokeWidth="1"
        opacity="0.8"
      />
      <text
        x="170"
        y="102"
        textAnchor="middle"
        className="shop-sign__subtitle"
      >
        ARTILLERY BOUGHT &amp; SOLD
      </text>
    </svg>
  )
}

function VitalitySign() {
  return (
    <svg
      className="shop-sign shop-sign--vitality"
      viewBox="0 0 440 140"
      aria-hidden="true"
    >
      <defs>
        <GrainFilter id="grain-vitality" seed={11} />
        <linearGradient id="vitality-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--active-accent-dark)" />
          <stop offset="100%" stopColor="#141a0d" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="432"
        height="132"
        rx="10"
        fill="url(#vitality-fill)"
        stroke="#e9f3d8"
        strokeOpacity="0.35"
        strokeWidth="2"
        filter="url(#grain-vitality)"
      />
      <rect
        x="11"
        y="11"
        width="418"
        height="118"
        rx="6"
        fill="none"
        stroke="#e9f3d8"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      <rect
        x="20"
        y="40"
        width="56"
        height="56"
        rx="10"
        fill="#e9f3d8"
        fillOpacity="0.14"
        stroke="#e9f3d8"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <path
        d="M 40,68 L 56,68 M 48,60 L 48,76"
        stroke="#e9f3d8"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <text x="92" y="80" className="shop-sign__title">
        MPS
      </text>

      <line
        x1="192"
        y1="28"
        x2="192"
        y2="112"
        stroke="#e9f3d8"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      <text x="206" y="56" className="shop-sign__subtitle">
        MYSTIC · PHARMACEUTICAL · STORES
      </text>
      <text x="206" y="84" className="shop-sign__tagline">
        <tspan x="206" dy="0">
          Voted #1 pharmacy for
        </tspan>
        <tspan x="206" dy="20">
          families and beasts
        </tspan>
      </text>
    </svg>
  )
}

function SpiritSign() {
  return (
    <svg
      className="shop-sign shop-sign--spirit"
      viewBox="0 0 320 130"
      aria-hidden="true"
    >
      <defs>
        <path
          id="spirit-sign-arc-top"
          d="M 12,76 Q 160,-18 308,76"
          fill="none"
        />
        <path
          id="spirit-sign-arc-bottom"
          d="M 24,100 Q 160,20 296,100"
          fill="none"
        />
      </defs>
      <text className="shop-sign__title">
        <textPath
          href="#spirit-sign-arc-top"
          startOffset="50%"
          textAnchor="middle"
        >
          CURIOSITY
        </textPath>
      </text>
      <text className="shop-sign__title">
        <textPath
          href="#spirit-sign-arc-bottom"
          startOffset="50%"
          textAnchor="middle"
        >
          CATALOG
        </textPath>
      </text>
      <rect
        x="130"
        y="106"
        width="60"
        height="22"
        className="shop-sign__subtitle-box"
      />
      <text
        x="160"
        y="122"
        textAnchor="middle"
        className="shop-sign__subtitle"
      >
        № 777
      </text>
    </svg>
  )
}

export function ShopSign({ category }: { category: ItemCategory }) {
  if (category === 'Weapon') {
    return <WeaponSign />
  }
  if (category === 'Vitality') {
    return <VitalitySign />
  }
  if (category === 'Spirit') {
    return <SpiritSign />
  }
  return null
}
