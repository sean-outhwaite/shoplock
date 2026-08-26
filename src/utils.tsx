import type { ShopCategory, ShopItem, ItemCategory, ItemTier } from './types'
import { categoryOrder, tiers } from './shopConstants.ts'

export function formatCost(cost: number) {
  return cost.toLocaleString('en-US')
}

export function groupItemsByCategoryAndTier(
  itemData: ShopItem[],
): Record<ItemCategory, Record<ItemTier, ShopItem[]>> {
  return categoryOrder.reduce<Record<ItemCategory, Record<ItemTier, ShopItem[]>>>(
    (categoryAccumulator, itemCategory) => {
      categoryAccumulator[itemCategory] = tiers.reduce<
        Record<ItemTier, ShopItem[]>
      >((tierAccumulator, tier) => {
        tierAccumulator[tier] = itemData.filter(
          (item) => item.category === itemCategory && item.tier === tier,
        )
        return tierAccumulator
      }, {} as Record<ItemTier, ShopItem[]>)

      return categoryAccumulator
    },
    {} as Record<ItemCategory, Record<ItemTier, ShopItem[]>>,
  )
}

export function getItemCardImageUrl(item: ShopItem) {
  return `/${item.category}/${item.name.replaceAll(/[ ']/g, '')}.png`
}

export function categoryAccent(category: ShopCategory) {
  switch (category) {
    case 'Weapon':
      return '#E3B00B'
    case 'Spirit':
      return '#B665DC'
    case 'Vitality':
      return '#A3CD3A'
    case 'All':
      return '#A9A995'
  }
}

// export function format
