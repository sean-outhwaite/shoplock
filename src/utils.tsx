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

// Tier-box borders/backgrounds use their own accent, independent of
// categoryAccent() (which still drives item cards and the nav rail) so the
// two can be tuned separately.
export function tierAccent(category: ItemCategory) {
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
