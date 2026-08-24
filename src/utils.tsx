import type { ItemCategory } from './types'

export function formatCost(cost: number) {
  return cost.toLocaleString('en-US')
}

export function categoryAccent(category: ItemCategory) {
  switch (category) {
    case 'Weapon':
      return '#E3B00B'
    case 'Spirit':
      return '#B665DC'
    case 'Vitality':
      return '#A3CD3A'
    case 'All':
      return '#8C897A'
  }
}

// export function format
