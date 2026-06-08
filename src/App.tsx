import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'

type ItemCategory = 'Weapon' | 'Spirit' | 'Vitality' | 'All'

type ItemTier = 'T1' | 'T2' | 'T3' | 'T4'

type ItemIcon =
  | 'blade'
  | 'spark'
  | 'shield'
  | 'gear'
  | 'pulse'
  | 'hex'
  | 'bolt'
  | 'wave'

type ShopItem = {
  id: string
  name: string
  category: ItemCategory
  tier: ItemTier
  cost: number
  tags: string[]
  accent: string
  icon: ItemIcon
}

const items: ShopItem[] = [
  {
    id: 'cinder-rounds',
    name: 'Cinder Rounds',
    category: 'Weapon',
    tier: 'T1',
    cost: 900,
    tags: ['lane', 'cheap'],
    accent: '#fb7185',
    icon: 'bolt',
  },
  {
    id: 'signal-burner',
    name: 'Signal Burner',
    category: 'Weapon',
    tier: 'T1',
    cost: 800,
    tags: ['starter', 'flex'],
    accent: '#f8a51c',
    icon: 'wave',
  },
  {
    id: 'storm-coil',
    name: 'Storm Coil',
    category: 'Weapon',
    tier: 'T2',
    cost: 2400,
    tags: ['burst', 'precision'],
    accent: '#f97316',
    icon: 'blade',
  },
  {
    id: 'night-thread',
    name: 'Night Thread',
    category: 'Weapon',
    tier: 'T3',
    cost: 4500,
    tags: ['finisher', 'burst'],
    accent: '#f43f5e',
    icon: 'blade',
  },
  {
    id: 'veil-amulet',
    name: 'Veil Amulet',
    category: 'Spirit',
    tier: 'T1',
    cost: 1200,
    tags: ['poke', 'setup'],
    accent: '#a78bfa',
    icon: 'spark',
  },
  {
    id: 'chain-battery',
    name: 'Chain Battery',
    category: 'Spirit',
    tier: 'T2',
    cost: 2100,
    tags: ['tempo', 'rotate'],
    accent: '#facc15',
    icon: 'gear',
  },
  {
    id: 'morrow-spike',
    name: 'Morrow Spike',
    category: 'Spirit',
    tier: 'T2',
    cost: 2600,
    tags: ['control', 'combo'],
    accent: '#c084fc',
    icon: 'pulse',
  },
  {
    id: 'echo-capacitor',
    name: 'Echo Capacitor',
    category: 'Spirit',
    tier: 'T3',
    cost: 4200,
    tags: ['spell amp', 'combo'],
    accent: '#22d3ee',
    icon: 'spark',
  },
  {
    id: 'rift-shield',
    name: 'Rift Shield',
    category: 'Vitality',
    tier: 'T1',
    cost: 1000,
    tags: ['sustain', 'shield'],
    accent: '#38bdf8',
    icon: 'shield',
  },
  {
    id: 'phase-lattice',
    name: 'Phase Lattice',
    category: 'Vitality',
    tier: 'T2',
    cost: 1800,
    tags: ['regen', 'escape'],
    accent: '#34d399',
    icon: 'shield',
  },
  {
    id: 'hexbreaker-rig',
    name: 'Hexbreaker Rig',
    category: 'Vitality',
    tier: 'T3',
    cost: 3900,
    tags: ['cleanse', 'clutch'],
    accent: '#14b8a6',
    icon: 'hex',
  },
  {
    id: 'bulwark-mesh',
    name: 'Bulwark Mesh',
    category: 'Vitality',
    tier: 'T3',
    cost: 3600,
    tags: ['frontline', 'resist'],
    accent: '#60a5fa',
    icon: 'shield',
  },
]

const categories: Array<'Weapon' | 'Spirit' | 'Vitality' | 'All'> = [
  'Weapon',
  'Vitality',
  'Spirit',
  'All',
]

const tiers: ItemTier[] = ['T1', 'T2', 'T3', 'T4']

const tierPrices: Record<ItemTier, number> = {
  T1: 800,
  T2: 1600,
  T3: 3200,
  T4: 6400,
}

const categoryOrder: Exclude<ItemCategory, 'All'>[] = [
  'Weapon',
  'Spirit',
  'Vitality',
]

function formatCost(cost: number) {
  return cost.toLocaleString('en-US')
}

function categoryAccent(category: ItemCategory) {
  switch (category) {
    case 'Weapon':
      return '#DCA50F'
    case 'Spirit':
      return '#AA62CD'
    case 'Vitality':
      return '#9BC636'
    case 'All':
      return '#8C897A'
  }
}

function categoryTitle(category: Exclude<ItemCategory, 'All'>) {
  switch (category) {
    case 'Weapon':
      return 'Weapon'
    case 'Spirit':
      return 'Spirit'
    case 'Vitality':
      return 'Vitality'
  }
}

function ItemGlyph({ icon }: { icon: ItemIcon }) {
  switch (icon) {
    case 'blade':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19 19 5l-1.2-1.2L3.8 17.8 5 19Zm7.5-12.5L17 4l3 3-2.5 4.5-5.5 5.5L8 14.5l5.5-5.5Z" />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 2 2.5 6.4L21 11l-6.5 2.6L12 20l-2.5-6.4L3 11l6.5-2.6L12 2Zm0 5.3L10.9 10 8 11l2.9 1 .9 2.7.9-2.7L15 11l-2.3-.7L12 7.3Z" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 5 5v6c0 5 3 8.5 7 11 4-2.5 7-6 7-11V5l-7-3Zm0 4.1 4 .9v4c0 3-1.6 5.8-4 7.8-2.4-2-4-4.8-4-7.8V7l4-.9Z" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.8 2 14.4 4.6 16.2 5.3 18.5 3.9 20.3 7 18.2 8.6 18.4 10.8 20.6 12.2 18.7 15.4 16.3 14.4 14.4 15.8 14.1 18.4 10.3 18.4 10 15.8 8.1 14.4 5.7 15.4 3.8 12.2 6 10.8 6.2 8.6 4.1 7 5.9 3.9 8.2 5.3 10 4.6 10.6 2H13.8Zm-1.8 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2Z" />
        </svg>
      )
    case 'pulse':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      )
    case 'hex':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 4.5 6.3v8.4L12 19l7.5-4.3V6.3L12 2Zm0 2.3 5.5 3.2v6.2L12 16.9 6.5 13.7V7.5L12 4.3Z" />
        </svg>
      )
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 2 5 13h5l-1 9 10-13h-6l0-7Z" />
        </svg>
      )
    case 'wave':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 14c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 3 4" />
        </svg>
      )
  }
}

function ItemIconBadge({ item }: { item: ShopItem }) {
  return (
    <span
      className="item-icon"
      style={{ '--accent': item.accent } as CSSProperties}
    >
      <span className="item-icon-inner">
        <ItemGlyph icon={item.icon} />
      </span>
    </span>
  )
}

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<ItemCategory>('Weapon')

  const groupedItems = useMemo(
    () =>
      categoryOrder.reduce<
        Record<Exclude<ItemCategory, 'All'>, Record<ItemTier, ShopItem[]>>
      >(
        (categoryAccumulator, itemCategory) => {
          categoryAccumulator[itemCategory] = tiers.reduce<
            Record<ItemTier, ShopItem[]>
          >(
            (tierAccumulator, tier) => {
              tierAccumulator[tier] = items.filter(
                (item) => item.category === itemCategory && item.tier === tier,
              )
              return tierAccumulator
            },
            { T1: [], T2: [], T3: [], T4: [] },
          )

          return categoryAccumulator
        },
        {
          Weapon: { T1: [], T2: [], T3: [], T4: [] },
          Spirit: { T1: [], T2: [], T3: [], T4: [] },
          Vitality: { T1: [], T2: [], T3: [], T4: [] },
        },
      ),
    [],
  )

  const tabCounts = categories.reduce(
    (accumulator, itemCategory) => {
      accumulator[itemCategory] =
        itemCategory === 'All'
          ? items.length
          : items.filter((item) => item.category === itemCategory).length
      return accumulator
    },
    {} as Record<'Weapon' | 'Spirit' | 'Vitality' | 'All', number>,
  )

  const visibleCategories =
    selectedCategory === 'All' ? categoryOrder : [selectedCategory]

  return (
    <div className="shop-app">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <main className="layout">
        <section
          className="shop-window"
          style={
            {
              '--active-accent': categoryAccent(selectedCategory),
            } as CSSProperties
          }
        >
          <nav className="tab-rail" aria-label="Shop item types">
            {categories.map((itemCategory) => (
              <button
                key={itemCategory}
                type="button"
                className={
                  selectedCategory === itemCategory
                    ? 'rail-tab active'
                    : 'rail-tab'
                }
                aria-label={`${itemCategory} — ${tabCounts[itemCategory]} items`}
                style={
                  {
                    '--tab-accent': categoryAccent(itemCategory),
                  } as CSSProperties
                }
                onClick={() => setSelectedCategory(itemCategory)}
              >
                <span className="rail-tab__marker" aria-hidden="true" />
                <span className="rail-tab__label">{itemCategory}</span>
                <strong>{tabCounts[itemCategory]}</strong>
              </button>
            ))}
          </nav>

          <header className="window-header">
            <div>
              <p className="eyebrow">Fairfax item shop</p>
              <h1>
                {selectedCategory === 'All'
                  ? 'All items'
                  : categoryTitle(selectedCategory)}
              </h1>
            </div>
          </header>

          <div className="shop-body">
            {visibleCategories.map((itemCategory) => (
              <div key={itemCategory} className="category-collection">
                {tiers.map((tier) => (
                  <section
                    key={`${itemCategory}-${tier}`}
                    className="tier-section"
                    style={
                      {
                        '--category-accent': categoryAccent(itemCategory),
                      } as CSSProperties
                    }
                  >
                    <header className="category-header">
                      <div className="category-header-top">
                        <span className="category-cost">
                          {formatCost(
                            groupedItems[itemCategory][tier].reduce(
                              (sum, item) => sum + item.cost,
                              0,
                            ),
                          )}
                        </span>
                        <strong>
                          {groupedItems[itemCategory][tier].length} items
                        </strong>
                      </div>

                      <div className="category-title-row">
                        <h2>{itemCategory}</h2>
                        <span>
                          {tier} · {formatCost(tierPrices[tier])}
                        </span>
                      </div>
                    </header>

                    <div className="category-grid">
                      {groupedItems[itemCategory][tier].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="grid-item"
                        >
                          <ItemIconBadge item={item} />
                          <span className="grid-item-name">{item.name}</span>
                          <span className="grid-item-tier">
                            {formatCost(item.cost)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
