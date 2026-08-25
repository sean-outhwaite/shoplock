import type { CSSProperties, MouseEvent } from 'react'
import type { ShopItem } from '../types.ts'
import { categoryAccent, getItemCardImageUrl } from '../utils.tsx'
interface Props {
  item: ShopItem
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  positionPopover: (event: MouseEvent<HTMLImageElement>) => void
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
}: Props & {
  hoverUpgrades: string[] | null
  setHoverUpgrades: (upgrades: string[] | null) => void
}) => {
  return (
    <img
      src={getItemCardImageUrl(item)}
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
