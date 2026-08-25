import { useMemo, useState } from 'react'
import ItemCard from './ItemCard.tsx'
import type { ShopItem } from '../types.ts'
import type { MouseEvent } from 'react'

interface Props {
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  positionPopover: (event: MouseEvent<HTMLImageElement>) => void
  itemData: ShopItem[]
  hoverUpgrades: string[] | null
  setHoverUpgrades: (upgrades: string[] | null) => void
  onAddToBuild?: (itemId: number) => void
}

const SearchTab = ({
  hoveredItem,
  setHoveredItem,
  positionPopover,
  itemData,
  hoverUpgrades,
  setHoverUpgrades,
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

  return (
    <>
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
      <div className="search-grid">
        {filteredItems.map((item: ShopItem) => (
          <ItemCard
            key={item.id}
            item={item}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            positionPopover={positionPopover}
            hoverUpgrades={hoverUpgrades}
            setHoverUpgrades={setHoverUpgrades}
            onAddToBuild={onAddToBuild}
          />
        ))}
      </div>
    </>
  )
}

export default SearchTab
