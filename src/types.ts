export type ShopItem = {
  id: string
  name: string
  category: ItemCategory
  tier: ItemTier
  cost: number
  tags: string[]
  accent: string
  icon: ItemIcon
}

export type ItemCategory = 'Weapon' | 'Spirit' | 'Vitality' | 'All'

export type ItemTier = 'T1' | 'T2' | 'T3' | 'T4'

export type ItemIcon =
  | 'blade'
  | 'spark'
  | 'shield'
  | 'gear'
  | 'pulse'
  | 'hex'
  | 'bolt'
  | 'wave'
