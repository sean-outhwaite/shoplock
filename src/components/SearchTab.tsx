import { useMemo, useState } from 'react'
import ItemCard from './ItemCard.tsx'
import type { ShopItem, ItemTier } from '../types.ts'
import type { MouseEvent } from 'react'

interface Props {
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  positionPopover: (event: MouseEvent<HTMLImageElement>) => void
  itemData: ShopItem[]
  hoverUpgradesFrom: string[] | null
  setHoverUpgradesFrom: (upgrades: string[] | null) => void
  hoverUpgradesTo: string[] | null
  setHoverUpgradesTo: (upgrades: string[] | null) => void
  onAddToBuild?: (itemId: number) => void
}

const displayTiers: ItemTier[] = ['TIER 1', 'TIER 2', 'TIER 3', 'TIER 4']

const SearchTab = ({
  hoveredItem,
  setHoveredItem,
  positionPopover,
  itemData,
  hoverUpgradesFrom,
  setHoverUpgradesFrom,
  hoverUpgradesTo,
  setHoverUpgradesTo,
  onAddToBuild,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('')

  const sortedItems = useMemo(() => {
    return [...itemData]
      .sort((a, b) => a.tier.localeCompare(b.tier) || a.name.localeCompare(b.name))
      .filter((item) => item.tier !== 'TIER 5')
  }, [itemData])

  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [sortedItems, searchTerm])

  const tieredItems = useMemo(() => {
    return displayTiers.reduce<Partial<Record<ItemTier, ShopItem[]>>>((acc, tier) => {
      acc[tier] = filteredItems.filter((item) => item.tier === tier)
      return acc
    }, {})
  }, [filteredItems])

  return (
    <>
      <header className="search-header">
        <div className="search-header__text">
          <h1>Search Items</h1>
          <p className="search-header__subtitle">Search by item name</p>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            className="search-input"
            aria-label="Search items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <div className="search-tier-groups">
        {displayTiers.map((tier) => {
          const items = tieredItems[tier]
          if (!items || items.length === 0) return null
          return (
            <div key={tier} className="search-tier-row">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  hoveredItem={hoveredItem}
                  setHoveredItem={setHoveredItem}
                  positionPopover={positionPopover}
                  hoverUpgradesFrom={hoverUpgradesFrom}
                  setHoverUpgradesFrom={setHoverUpgradesFrom}
                  hoverUpgradesTo={hoverUpgradesTo}
                  setHoverUpgradesTo={setHoverUpgradesTo}
                  onAddToBuild={onAddToBuild}
                />
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SearchTab
