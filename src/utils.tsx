import type { ItemCategory } from './types'

export function formatCost(cost: number) {
  return cost.toLocaleString('en-US')
}

export function categoryAccent(category: ItemCategory) {
  switch (category) {
    case 'Weapon':
      return '#DCA50F'
    case 'Spirit':
      return '#AA62CD'
    case 'Vitality':
      return '#9BC636'
    case 'All':
      return '#8C897A'
  }
}

// export function format
