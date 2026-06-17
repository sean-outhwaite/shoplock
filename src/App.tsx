import { useMemo, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, MouseEvent } from 'react'
import './App.css'
import { items } from './items.tsx'
import { ItemGlyph } from './components/ItemGlyph.tsx'
import type {
  ShopItem,
  ItemCategory,
  ItemTier,
  PopoverPosition,
} from './types.ts'
import { formatCost, categoryAccent } from './utils.tsx'
import { ItemPreviewPopover } from './components/ItemPreviewPopover.tsx'
import weaponIcon from './assets/Weapon.svg'

const categories: Array<'Weapon' | 'Spirit' | 'Vitality' | 'All'> = [
  'Weapon',
  'Vitality',
  'Spirit',
  'All',
]

const tiers: ItemTier[] = ['TIER 1', 'TIER 2', 'TIER 3', 'TIER 4']

const tierPrices: Record<ItemTier, number> = {
  'TIER 1': 800,
  'TIER 2': 1600,
  'TIER 3': 3200,
  'TIER 4': 6400,
}

const categoryOrder: Exclude<ItemCategory, 'All'>[] = [
  'Weapon',
  'Spirit',
  'Vitality',
]

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
            { 'TIER 1': [], 'TIER 2': [], 'TIER 3': [], 'TIER 4': [] },
          )

          return categoryAccumulator
        },
        {
          Weapon: { 'TIER 1': [], 'TIER 2': [], 'TIER 3': [], 'TIER 4': [] },
          Spirit: { 'TIER 1': [], 'TIER 2': [], 'TIER 3': [], 'TIER 4': [] },
          Vitality: { 'TIER 1': [], 'TIER 2': [], 'TIER 3': [], 'TIER 4': [] },
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
                <img src={weaponIcon} alt="" className="rail-tab__marker" />
                <span className="rail-tab__label">{itemCategory}</span>
                <strong>{tabCounts[itemCategory]}</strong>
              </button>
            ))}
          </nav>

          <div className="full-shop">
            <header className="window-header">
              <div>
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
                      className={`tier-section-${tier.replace(/\s+/g, '_')}`}
                      style={
                        {
                          '--category-accent': categoryAccent(itemCategory),
                        } as CSSProperties
                      }
                    >
                      <header className="category-header">
                        <div className="category-header-top">
                          <span className="category-cost">
                            ${formatCost(tierPrices[tier])}
                          </span>
                        </div>

                        <div className="category-title-row">
                          <h2>{tier}</h2>
                        </div>
                      </header>

                      <div className="category-grid">
                        {groupedItems[itemCategory][tier].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={
                              hoveredItem && hoveredItem.id !== item.id
                                ? 'grid-item grid-item--dimmed'
                                : 'grid-item'
                            }
                            onMouseEnter={(event) => {
                              setHoveredItem(item)
                              positionPopover(event)
                            }}
                            onMouseMove={positionPopover}
                            onMouseLeave={() => setHoveredItem(null)}
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
