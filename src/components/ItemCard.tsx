import type { CSSProperties } from 'react'
import type { ShopItem } from '../types.ts'
import { categoryAccent } from '../utils.tsx'

export function ItemIconBadge({ item }: { item: ShopItem }) {
  return (
    <span
      className="item-icon"
      style={{ '--accent': item.accent } as CSSProperties}
    >
      <img src={item.imageURL} alt="" className="item-icon" />
    </span>
  )
}

interface props {
  item: ShopItem
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  positionPopover: (event: React.MouseEvent<HTMLImageElement>) => void
  onAddToBuild?: (itemId: number) => void
}

const ItemCard = ({
  item,
  hoveredItem,
  setHoveredItem,
  positionPopover,
  hoverUpgrades,
  setHoverUpgrades,
  onAddToBuild,
}: props & {
  hoverUpgrades: string[] | null
  setHoverUpgrades: (upgrades: string[] | null) => void
}) => {
  return (
    <img
      src={`/${item.category}/${item.name.replaceAll(/[ ']/g, '')}.png`}
      key={item.id}
      alt={item.name}
      className={
        hoveredItem &&
        hoveredItem.id !== item.id &&
        !hoverUpgrades?.includes(item.class_name)
          ? 'grid-item grid-item--dimmed'
          : 'grid-item'
      }
      onMouseEnter={(event) => {
        setHoveredItem(item)
        setHoverUpgrades(item.upgradesFrom)
        positionPopover(event)
      }}
      onMouseLeave={() => setHoveredItem(null)}
      onClick={() => onAddToBuild?.(item.id)}
      style={
        {
          '--category-accent': categoryAccent(item.category),
        } as CSSProperties
      }
    />
  )
}

export default ItemCard
