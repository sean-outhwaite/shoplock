import type { ShopCategory, ItemCategory, ItemTier } from './types.ts'
import weaponIcon from './assets/icons/catalog_shop_tab_icon_weapon_psd.png'
import spiritIcon from './assets/icons/catalog_shop_tab_icon_spirit_psd.png'
import vitalityIcon from './assets/icons/catalog_shop_tab_icon_vitality_psd.png'
import weaponBg from './assets/backgrounds/catalog_shop_bg_weapon_psd.png'
import spiritBg from './assets/backgrounds/catalog_shop_bg_spirit_psd.png'
import vitalityBg from './assets/backgrounds/catalog_shop_bg_vitality_psd.png'
import genericBg from './assets/backgrounds/catalog_shop_generic_bg_psd.png'
import searchTabIconInactive from './assets/catalog_shop_tab_search_sm_psd.png'
import searchTabIconActive from './assets/catalog_shop_tab_search_showing_sm_psd.png'
import panelWeaponSfx from './assets/audio/ui_shop_panel_weapon.mp3'
import panelVitalitySfx from './assets/audio/ui_shop_panel_vitality.mp3'
import panelSpiritSfx from './assets/audio/ui_shop_panel_magic.mp3'
import purchaseT4WeaponSfx from './assets/audio/ui_shop_mod_purchase_t4_weapon.mp3'
import purchaseT4VitalitySfx from './assets/audio/ui_shop_mod_purchase_t4_vitality.mp3'
import purchaseT4SpiritSfx from './assets/audio/ui_shop_mod_purchase_t4_spirit.mp3'
import autobuySfx from './assets/audio/ui_shop_autobuy_04.mp3'

export const itemIcons: Record<Exclude<ShopCategory, 'All'>, string> = {
  Weapon: weaponIcon,
  Spirit: spiritIcon,
  Vitality: vitalityIcon,
}

export const searchTabIcons = {
  active: searchTabIconActive,
  inactive: searchTabIconInactive,
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

export const panelSfx: Record<Exclude<ShopCategory, 'All'>, string> = {
  Weapon: panelWeaponSfx,
  Spirit: panelSpiritSfx,
  Vitality: panelVitalitySfx,
}

export const purchaseT4Sfx: Record<ItemCategory, string> = {
  Weapon: purchaseT4WeaponSfx,
  Spirit: purchaseT4SpiritSfx,
  Vitality: purchaseT4VitalitySfx,
}

export { autobuySfx }
