export interface ShopItem {
  id: number
  name: string
  category: ItemCategory
  tier: ItemTier
  cost: number
  accent: string
  icon: ItemIcon
  description: string
  imageURL: string
  upgrades: Upgrade[]
  tooltipSections: TooltipSection[]
  properties: Properties
  upgradesFrom: string[]
  class_name: string
}

export interface BuildSection {
  id: string
  name: string
  itemIds: number[]
}

export type ShopCategory = 'Weapon' | 'Spirit' | 'Vitality' | 'All'

export type ItemCategory = 'Weapon' | 'Spirit' | 'Vitality'

export type ItemTier = 'TIER 1' | 'TIER 2' | 'TIER 3' | 'TIER 4' | 'TIER 5'

export type ItemIcon =
  | 'blade'
  | 'spark'
  | 'shield'
  | 'gear'
  | 'pulse'
  | 'hex'
  | 'bolt'
  | 'wave'

export type PopoverPosition = {
  x: number
  y: number
}

export interface ItemData {
  id: number
  class_name: string
  name: string
  start_trained: boolean
  image: string
  image_webp: string
  heroes: TemplateStringsArray[]
  weapon_info: WeaponInfo
  type: string
  shop_image: string
  shop_image_webp: string
  item_slot_type: string
  item_tier: number
  properties: Properties
  description: Description
  activation: string
  imbue: string
  component_items: string[]
  tooltip_sections: TooltipSection[]
  upgrades: Upgrade[]
  is_active_item: boolean
  shopable: boolean
  cost: number
}

export interface Description {
  desc: string
}

// Items report dozens of item-specific property keys (StunDuration,
// DamagePerChain, ChainRadius, ...) beyond the handful of common
// ability-level ones, so this is modeled as an open dictionary rather than
// a fixed set of named fields - not every property carries every field.
export type Properties = Record<string, PropertyDescriptor>

export type PropertyNames = string

export interface PropertyDescriptor {
  value: string
  label?: string
  prefix?: string
  postfix?: string
  postvalue_label?: string
  icon?: string
  css_class?: string
  display_units?: string
  can_set_token_override?: boolean
  disable_value?: string
  provided_property_type?: string
  tooltip_section?: string
  tooltip_is_elevated?: boolean
  tooltip_is_important?: boolean
  scale_function?: PropertyScaleFunction
}

export interface PropertyScaleFunction {
  label?: string
  postfix?: string
  class_name: string
  subclass_name: string
  specific_stat_scale_type?: string
  scaling_stats?: string[]
  stat_scale?: number
}

export interface TooltipSection {
  section_type: string
  section_attributes: SectionAttribute[]
}

export interface SectionAttribute {
  properties?: PropertyNames[]
  elevated_properties?: PropertyNames[]
  loc_string?: string
  important_properties?: PropertyNames[]
  important_properties_with_icon?: ImportantPropertyIcon[]
}

export interface ImportantPropertyIcon {
  name: string
  icon: string
  localized_name: string
}

export interface Upgrade {
  property_upgrades: PropertyUpgrade[]
}

export interface PropertyUpgrade {
  name: string
  bonus: string
}

export type WeaponInfo = object
