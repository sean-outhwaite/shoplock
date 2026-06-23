import { useMemo, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, MouseEvent } from 'react'
import './App.css'
import type {
  ShopItem,
  ItemCategory,
  ItemTier,
  PopoverPosition,
  ItemData,
} from './types.ts'
import { formatCost, categoryAccent } from './utils.tsx'
import { ItemPreviewPopover } from './components/ItemPreviewPopover.tsx'
import SearchTab from './components/SearchTab.tsx'
import ItemCard from './components/ItemCard.tsx'
import weaponIcon from './assets/Weapon.svg'
import spiritIcon from './assets/Spirit.svg'
import vitalityIcon from './assets/Vitality.svg'
import allIcon from './assets/All.svg'

const results: ItemData[] = await fetch(
  'https://api.deadlock-api.com/v1/assets/items/by-type/upgrade',
).then((res) => res.json())

console.log(results)

// There are lots of junk items returned by the API
// TODO:
// - Update popover to use actual descriptions
// - Handle property name mismatches better
// - Update layout to fit all items

const itemData: ShopItem[] = results
  .filter(
    (item: ItemData) =>
      item.item_slot_type &&
      !item.name.includes('upgrade_') &&
      item.shop_image_webp &&
      item.shop_image_webp.includes('.webp'),
  )
  .map(
    (item: ItemData): ShopItem => ({
      id: item.id,
      name: item.name,
      category: (item.item_slot_type.charAt(0).toUpperCase() +
        item.item_slot_type.slice(1)) as ItemCategory,
      tier: `TIER ${item.item_tier}` as ItemTier,
      cost: item.cost,
      tags: ['imported'],
      accent: '#f8a51c',
      icon: 'wave',
      description: item.description.desc,
      imageURL: item.shop_image_webp,
      upgrades: item.upgrades,
    }),
  )

console.log(itemData)

const itemIcons: Record<ItemCategory, string> = {
  Weapon: weaponIcon,
  Spirit: spiritIcon,
  Vitality: vitalityIcon,
  All: allIcon,
}

const categories: Array<'Weapon' | 'Spirit' | 'Vitality' | 'All'> = [
  'Weapon',
  'Vitality',
  'Spirit',
  'All',
]

const tiers: ItemTier[] = ['TIER 1', 'TIER 2', 'TIER 3', 'TIER 4', 'TIER 5']

const tierPrices: Record<ItemTier, number> = {
  'TIER 1': 800,
  'TIER 2': 1600,
  'TIER 3': 3200,
  'TIER 4': 6400,
  'TIER 5': 0,
}

const categoryOrder: Exclude<ItemCategory, 'All'>[] = [
  'Weapon',
  'Spirit',
  'Vitality',
]

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
              tierAccumulator[tier] = itemData.filter(
                (item) => item.category === itemCategory && item.tier === tier,
              )
              return tierAccumulator
            },
            {
              'TIER 1': [],
              'TIER 2': [],
              'TIER 3': [],
              'TIER 4': [],
              'TIER 5': [],
            },
          )

          return categoryAccumulator
        },
        {
          Weapon: {
            'TIER 1': [],
            'TIER 2': [],
            'TIER 3': [],
            'TIER 4': [],
            'TIER 5': [],
          },
          Spirit: {
            'TIER 1': [],
            'TIER 2': [],
            'TIER 3': [],
            'TIER 4': [],
            'TIER 5': [],
          },
          Vitality: {
            'TIER 1': [],
            'TIER 2': [],
            'TIER 3': [],
            'TIER 4': [],
            'TIER 5': [],
          },
        },
      ),
    [],
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
                style={
                  {
                    '--tab-accent': categoryAccent(itemCategory),
                  } as CSSProperties
                }
                onClick={() => setSelectedCategory(itemCategory)}
              >
                <img
                  src={itemIcons[itemCategory]}
                  alt=""
                  className="rail-tab__marker"
                />
              </button>
            ))}
          </nav>

          <div className="full-shop">
            <header className="window-header">
              <div>
                <h1>
                  {selectedCategory === 'All' ? 'All items' : selectedCategory}
                </h1>
              </div>
            </header>

            <div className="shop-body">
              {selectedCategory === 'All' ? (
                <SearchTab
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                  positionPopover={positionPopover}
                  itemData={itemData}
                />
              ) : (
                visibleCategories.map((itemCategory) => (
                  <div key={itemCategory} className="category-collection">
                    {tiers.map(
                      (tier) =>
                        tier !== 'TIER 5' && (
                          <section
                            key={`${itemCategory}-${tier}`}
                            className={`tier-section-${tier.replace(/\s+/g, '_')}`}
                            style={
                              {
                                '--category-accent':
                                  categoryAccent(itemCategory),
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
                                <ItemCard
                                  key={item.id}
                                  item={item}
                                  hoveredItem={hoveredItem}
                                  setHoveredItem={setHoveredItem}
                                  positionPopover={positionPopover}
                                />
                              ))}
                            </div>
                          </section>
                        ),
                    )}
                  </div>
                ))
              )}
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
