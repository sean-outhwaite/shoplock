import { useEffect, useState } from 'react'
import type { ItemCategory, ItemData, ItemTier, ShopItem } from '../types'

type CatalogStatus =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; items: ShopItem[] }

export function useItemCatalog() {
  const [status, setStatus] = useState<CatalogStatus>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    // Some items returned by the API aren't actually in the game, keep tracking of those to filter out here
    const deletedItems = [3713423303, 223594321, 3133167885]

    fetch('https://api.deadlock-api.com/v1/assets/items/by-type/upgrade')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch item data')
        return response.json()
      })
      .then((results: ItemData[]) => {
        if (cancelled) return
        const items = results
          .filter(
            (item: ItemData) =>
              item.item_slot_type &&
              !item.name.includes('upgrade_') &&
              item.shop_image_webp &&
              item.shop_image_webp.includes('.webp') &&
              deletedItems.includes(item.id) === false,
          )
          .map(
            (item: ItemData): ShopItem => ({
              id: item.id,
              name: item.name,
              category: (item.item_slot_type.charAt(0).toUpperCase() +
                item.item_slot_type.slice(1)) as ItemCategory,
              tier: `TIER ${item.item_tier}` as ItemTier,
              cost: item.cost,
              accent: '#f8a51c',
              icon: 'wave',
              description: item.description.desc,
              imageURL: item.shop_image_webp,
              upgrades: item.upgrades,
              tooltipSections: item.tooltip_sections,
              properties: item.properties,
              upgradesFrom: item.component_items ?? [],
              class_name: item.class_name,
            }),
          )
          .sort((a, b) => a.name.localeCompare(b.name))
        setStatus({ status: 'success', items: items })
      })
      .catch((error) => {
        if (cancelled) return
        setStatus({ status: 'error', error: error.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return status
}
