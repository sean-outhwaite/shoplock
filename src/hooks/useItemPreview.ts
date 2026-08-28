import { useCallback, useState } from 'react'
import type { Dispatch, FocusEvent, MouseEvent, SetStateAction } from 'react'
import type { ShopItem, PopoverPosition } from '../types.ts'

// Leave room for the build drawer's closed handle bar so the popover never
// renders behind it.
const POPOVER_MARGIN = 18
const POPOVER_BOTTOM_RESERVE = POPOVER_MARGIN + 64

export interface ItemPreviewState {
  hoveredItem: ShopItem | null
  setHoveredItem: Dispatch<SetStateAction<ShopItem | null>>
  hoverUpgradesFrom: string[] | null
  setHoverUpgradesFrom: (upgrades: string[] | null) => void
  hoverUpgradesTo: string[] | null
  setHoverUpgradesTo: (upgrades: string[] | null) => void
  popoverPosition: PopoverPosition
  positionPopover: (
    event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>,
  ) => void
  adjustPopoverHeight: (actualHeight: number) => void
}

export function useItemPreview(): ItemPreviewState {
  const [hoveredItem, setHoveredItem] = useState<ShopItem | null>(null)
  const [hoverUpgradesFrom, setHoverUpgradesFrom] = useState<string[] | null>(
    null,
  )
  const [hoverUpgradesTo, setHoverUpgradesTo] = useState<string[] | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    x: 0,
    y: 0,
  })
  const [iconTop, setIconTop] = useState(0)

  function positionPopover(
    event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>,
  ) {
    const iconBounds = event.currentTarget.getBoundingClientRect()
    const gap = 14
    const margin = POPOVER_MARGIN
    const bottomReserve = POPOVER_BOTTOM_RESERVE
    const width = 400
    const maxHeight = window.innerHeight * 0.85

    // Below the 820px layout breakpoint, the tapped icon is too small and
    // often too close to an edge for icon-relative anchoring to read well -
    // just pin near the top-left and let the popover's own width clamp
    // (calc(100% - 24px)) turn it into a near-full-width sheet.
    if (window.innerWidth <= 820) {
      setPopoverPosition({ x: margin, y: margin })
      return
    }

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

    setIconTop(iconBounds.top)
    setPopoverPosition({ x, y })
  }

  const adjustPopoverHeight = useCallback(
    (actualHeight: number) => {
      if (window.innerWidth <= 820) {
        return
      }

      const margin = POPOVER_MARGIN
      const bottomReserve = POPOVER_BOTTOM_RESERVE

      let y = iconTop
      if (y + actualHeight > window.innerHeight - bottomReserve) {
        y = Math.max(margin, window.innerHeight - bottomReserve - actualHeight)
      }
      if (y < margin) {
        y = margin
      }

      setPopoverPosition((current) =>
        current.y === y ? current : { ...current, y },
      )
    },
    [iconTop],
  )

  return {
    hoveredItem,
    setHoveredItem,
    hoverUpgradesFrom,
    setHoverUpgradesFrom,
    hoverUpgradesTo,
    setHoverUpgradesTo,
    popoverPosition,
    positionPopover,
    adjustPopoverHeight,
  }
}
