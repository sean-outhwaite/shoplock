import type { ShopCategory, ItemTier } from './types.ts'
import weaponIcon from './assets/icons/catalog_shop_tab_icon_weapon_psd.png'
import spiritIcon from './assets/icons/catalog_shop_tab_icon_spirit_psd.png'
import vitalityIcon from './assets/icons/catalog_shop_tab_icon_vitality_psd.png'
import allIcon from './assets/icons/All.svg'
import weaponBg from './assets/backgrounds/catalog_shop_bg_weapon_psd.png'
import spiritBg from './assets/backgrounds/catalog_shop_bg_spirit_psd.png'
import vitalityBg from './assets/backgrounds/catalog_shop_bg_vitality_psd.png'
import genericBg from './assets/backgrounds/catalog_shop_generic_bg_psd.png'

export const itemIcons: Record<ShopCategory, string> = {
  Weapon: weaponIcon,
  Spirit: spiritIcon,
  Vitality: vitalityIcon,
  All: allIcon,
}

export const catalogBg: Record<ShopCategory, string> = {
  Weapon: weaponBg,
  Spirit: spiritBg,
  Vitality: vitalityBg,
  All: genericBg,
}

export const displayTiers: ItemTier[] = ['TIER 1', 'TIER 2', 'TIER 3', 'TIER 4']

export const categories: Array<'Weapon' | 'Spirit' | 'Vitality' | 'All'> = [
  'Weapon',
  'Vitality',
  'Spirit',
  'All',
]

export const tiers: ItemTier[] = [
  'TIER 1',
  'TIER 2',
  'TIER 3',
  'TIER 4',
  'TIER 5',
]

export const tierPrices: Record<ItemTier, number> = {
  'TIER 1': 800,
  'TIER 2': 1600,
  'TIER 3': 3200,
  'TIER 4': 6400,
  'TIER 5': 0,
}

export const categoryOrder: Exclude<ShopCategory, 'All'>[] = [
  'Weapon',
  'Spirit',
  'Vitality',
]
