import ItemCard from './ItemCard.tsx'
import { items } from '../items.tsx'
import type { ShopItem } from '../types.ts'

interface props {
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  positionPopover: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name))

const SearchTab = ({ hoveredItem, setHoveredItem, positionPopover }: props) => {
  return (
    <div className="search-grid">
      {sortedItems.map((item: ShopItem) => (
        <ItemCard
          key={item.id}
          item={item}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          positionPopover={positionPopover}
        />
      ))}
    </div>
  )
}

export default SearchTab
