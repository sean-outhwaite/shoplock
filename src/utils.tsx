import type { ShopCategory, ShopItem } from './types'

export function formatCost(cost: number) {
  return cost.toLocaleString('en-US')
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
