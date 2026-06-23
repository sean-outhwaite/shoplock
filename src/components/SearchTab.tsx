import { useState } from 'react'
import ItemCard from './ItemCard.tsx'
import type { ShopItem } from '../types.ts'

interface props {
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  positionPopover: (event: React.MouseEvent<HTMLButtonElement>) => void
  itemData: ShopItem[]
}

const SearchTab = ({
  hoveredItem,
  setHoveredItem,
  positionPopover,
  itemData,
}: props) => {
  const [searchTerm, setSearchTerm] = useState('')

  const sortedItems = itemData.sort((a, b) => a.name.localeCompare(b.name))

  const filteredItems = sortedItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          />
        ))}
      </div>
    </>
  )
}

export default SearchTab
