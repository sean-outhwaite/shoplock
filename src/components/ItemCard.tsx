import type { CSSProperties } from 'react'
import type { ShopItem } from '../types.ts'
import { categoryAccent, getItemCardImageUrl, playSound } from '../utils.tsx'
import { useItemPreviewContext } from '../context/ItemPreviewContext.ts'
import { autobuySfx, purchaseT4Sfx } from '../shopConstants.ts'

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

  const isHovered = hoveredItem?.id === item.id

  return (
    <div className={`grid-item__container is${item.category}`}>
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
        onClick={() => {
          playSound(item.tier === 'TIER 4' ? purchaseT4Sfx[item.category] : autobuySfx)
          onAddToBuild?.(item.id)
        }}
        style={
          {
            '--category-accent': categoryAccent(item.category),
          } as CSSProperties
        }
      />
      {isHovered && (
        <>
          <div id="BackgroundTexture" />
          <div id="BackgroundTexture2" />
        </>
      )}
    </div>
  )
}

export default ItemCard
