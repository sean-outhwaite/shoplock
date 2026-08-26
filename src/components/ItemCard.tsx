import type { CSSProperties } from 'react'
import type { ShopItem } from '../types.ts'
import { categoryAccent, getItemCardImageUrl } from '../utils.tsx'
import { useItemPreviewContext } from '../context/ItemPreviewContext.ts'

interface Props {
  item: ShopItem
  onAddToBuild?: (itemId: number) => void
}

const ItemCard = ({ item, onAddToBuild }: Props) => {
  const {
    hoveredItem,
    setHoveredItem,
    positionPopover,
    hoverUpgradesFrom,
    setHoverUpgradesFrom,
    hoverUpgradesTo,
    setHoverUpgradesTo,
  } = useItemPreviewContext()

  let className = 'grid-item'
  if (hoveredItem && hoveredItem.id !== item.id) {
    if (hoverUpgradesFrom?.includes(item.class_name)) {
      className = 'grid-item grid-item--related-from'
    } else if (hoverUpgradesTo?.includes(item.class_name)) {
      className = 'grid-item grid-item--related-to'
    } else {
      className = 'grid-item grid-item--dimmed'
    }
  }

  return (
    <img
      src={getItemCardImageUrl(item)}
      alt={item.name}
      className={className}
      onMouseEnter={(event) => {
        setHoveredItem(item)
        setHoverUpgradesFrom(item.upgradesFrom)
        setHoverUpgradesTo(item.upgradesTo)
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
