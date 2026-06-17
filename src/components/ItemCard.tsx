import { ItemGlyph } from './ItemGlyph.tsx'
import type { CSSProperties } from 'react'
import type { ShopItem } from '../types.ts'
import { categoryAccent } from '../utils.tsx'

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

interface props {
  item: ShopItem
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  positionPopover: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const ItemCard = ({
  item,
  hoveredItem,
  setHoveredItem,
  positionPopover,
}: props) => {
  return (
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
      style={
        {
          '--category-accent': categoryAccent(item.category),
        } as CSSProperties
      }
    >
      <ItemIconBadge item={item} />
      <span className="grid-item-name">{item.name}</span>
    </button>
  )
}

export default ItemCard
