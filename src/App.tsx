import { useMemo, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, MouseEvent } from 'react'
import './App.css'
import { items } from './items.tsx'
import { ItemGlyph } from './utils.tsx'

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

type PopoverPosition = {
  x: number
  y: number
}

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

function ItemPreviewPopover({
  item,
  position,
}: {
  item: ShopItem
  position: PopoverPosition
}) {
  return (
    <aside
      className="item-popover"
      style={
        {
          '--popover-x': `${position.x}px`,
          '--popover-y': `${position.y}px`,
          '--popover-accent': categoryAccent(item.category),
        } as CSSProperties
      }
      role="presentation"
      aria-hidden="true"
    >
      <header className="item-popover__header">
        <div>
          <h3>{item.name}</h3>
        </div>
        <div>
          <strong>${formatCost(item.cost)}</strong>
        </div>
      </header>

      <div className="item-popover__body">
        <p className="item-popover__lead">
          Damage from your ultimate applies a stun and deals bonus spirit damage
          after a short delay.
        </p>
        <div className="item-popover__eyebrow">Passive</div>
        <p className="item-popover__lead">
          Damage from your ultimate applies a stun and deals bonus spirit damage
          after a short delay.
        </p>

        <div className="item-popover__stats" aria-hidden="true">
          <div>
            <span>Stun</span>
            <strong>{item.category}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{(1 + item.tags.length * 0.25).toFixed(2)}s</strong>
          </div>
          <div>
            <span>Damage</span>
            <strong>{item.cost / 10}</strong>
          </div>
        </div>

        <p className="item-popover__note">Tags: {item.tags.join(' • ')}</p>
      </div>
    </aside>
  )
}

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<ItemCategory>('Weapon')
  const [hoveredItem, setHoveredItem] = useState<ShopItem | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    x: 0,
    y: 0,
  })
  const shopWindowRef = useRef<HTMLElement | null>(null)

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

  function positionPopover(
    event: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>,
  ) {
    const bounds = shopWindowRef.current?.getBoundingClientRect()

    if (!bounds) {
      return
    }

    const clientX = 'clientX' in event ? event.clientX : bounds.left + 120
    const clientY = 'clientY' in event ? event.clientY : bounds.top + 60

    setPopoverPosition({
      x: clientX - bounds.left + 18,
      y: clientY - bounds.top - 18,
    })
  }

  return (
    <div className="shop-app">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <main className="layout">
        <section
          ref={shopWindowRef}
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

          <div className="full-shop">
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
                            {formatCost(tierPrices[tier])}
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
                            onMouseEnter={(event) => {
                              setHoveredItem(item)
                              positionPopover(event)
                            }}
                            onMouseMove={positionPopover}
                            onFocus={(event) => {
                              setHoveredItem(item)
                              positionPopover(event)
                            }}
                            // onBlur={() => setHoveredItem(null)}
                            // onMouseLeave={() => setHoveredItem(null)}
                          >
                            <ItemIconBadge item={item} />
                            <span className="grid-item-name">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {hoveredItem ? (
            <ItemPreviewPopover item={hoveredItem} position={popoverPosition} />
          ) : null}
        </section>
      </main>
    </div>
  )
}

export default App
