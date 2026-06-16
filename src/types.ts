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

export type ItemTier = 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4'

export type ItemIcon =
  | 'blade'
  | 'spark'
  | 'shield'
  | 'gear'
  | 'pulse'
  | 'hex'
  | 'bolt'
  | 'wave'
