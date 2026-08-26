import { useState } from 'react'
import type { FocusEvent, MouseEvent } from 'react'
import type { ShopItem, PopoverPosition } from '../types.ts'

export interface ItemPreviewState {
  hoveredItem: ShopItem | null
  setHoveredItem: (item: ShopItem | null) => void
  hoverUpgradesFrom: string[] | null
  setHoverUpgradesFrom: (upgrades: string[] | null) => void
  hoverUpgradesTo: string[] | null
  setHoverUpgradesTo: (upgrades: string[] | null) => void
  popoverPosition: PopoverPosition
  positionPopover: (
    event: MouseEvent<HTMLImageElement> | FocusEvent<HTMLImageElement>,
  ) => void
}

export function useItemPreview(): ItemPreviewState {
  const [hoveredItem, setHoveredItem] = useState<ShopItem | null>(null)
  const [hoverUpgradesFrom, setHoverUpgradesFrom] = useState<string[] | null>(
    null,
  )
  const [hoverUpgradesTo, setHoverUpgradesTo] = useState<string[] | null>(
    null,
  )
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    x: 0,
    y: 0,
  })

  function positionPopover(
    event: MouseEvent<HTMLImageElement> | FocusEvent<HTMLImageElement>,
  ) {
    const iconBounds = event.currentTarget.getBoundingClientRect()
    const gap = 14
    const margin = 18
    // Leave room for the build drawer's closed handle bar so the popover
    // never renders behind it.
    const bottomReserve = margin + 64
    const width = 400
    const maxHeight = Math.min(window.innerHeight * 0.85, 760)

    // Prefer the icon's right side; flip to the left if it wouldn't fit,
    // so the popover never covers the item it's describing.
    let x = iconBounds.right + gap
    const overflowsRight = x + width > window.innerWidth - margin
    if (overflowsRight) {
      const leftPlacement = iconBounds.left - gap - width
      x =
        leftPlacement >= margin
          ? leftPlacement
          : Math.max(margin, Math.min(window.innerWidth - width - margin, x))
    }

    let y = iconBounds.top
    if (y + maxHeight > window.innerHeight - bottomReserve) {
      y = Math.max(margin, window.innerHeight - maxHeight - bottomReserve)
    }
    if (y < margin) {
      y = margin
    }

    setPopoverPosition({ x, y })
  }

  return {
    hoveredItem,
    setHoveredItem,
    hoverUpgradesFrom,
    setHoverUpgradesFrom,
    hoverUpgradesTo,
    setHoverUpgradesTo,
    popoverPosition,
    positionPopover,
  }
}
