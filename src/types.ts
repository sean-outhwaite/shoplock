export interface ShopItem {
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

export type ItemTier = 'TIER 1' | 'TIER 2' | 'TIER 3' | 'TIER 4'

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

export interface Properties {
  AbilityCastDelay: AbilityCastDelay
  AbilityCastRange: AbilityCastDelay
  AbilityChannelTime: AbilityCastDelay
  AbilityChargeUpTime: AbilityChargeUpTime
  AbilityCharges: AbilityCastDelay
  AbilityCooldown: AbilityCastDelay
  AbilityCooldownBetweenCharge: AbilityCastDelay
  AbilityDuration: AbilityCastDelay
  AbilityPostCastDuration: AbilityPostCastDuration
  AbilityResourceCost: AbilityResourceCost
  AbilityUnitTargetLimit: AbilityUnitTargetLimit
  AmmoReloadPercent: AmmoReloadPercent
  BonusClipSizePercent: AmmoReloadPercent
  BonusFireRate: AmmoReloadPercent
  BuffDuration: BuffDuration
  BulletsBonusMagicDamage: AbilityChargeUpTime
  ChannelMoveSpeed: ChannelMoveSpeed
  Damage: AbilityChargeUpTime
  TechPower: AmmoReloadPercent
  WeaponPower: AbilityCastDelay
}

export interface AbilityCastDelay {
  value: string
  can_set_token_override: boolean
  css_class?: string
  disable_value?: string
  label: string
  postfix?: string
  postvalue_label: string
  icon?: string
  display_units?: string
  scale_function?: AbilityCastDelayScaleFunction
  provided_property_type?: string
  prefix?: string
}

export interface AbilityCastDelayScaleFunction {
  class_name: string
  subclass_name: string
  specific_stat_scale_type?: string
  scaling_stats?: string[]
}

export interface AbilityChargeUpTime {
  value: string
  css_class: string
  display_units?: string
  label: string
  postfix?: string
  postvalue_label: string
  icon: string
  tooltip_section: string
  tooltip_is_elevated: boolean
  tooltip_is_important: boolean
  scale_function?: AbilityChargeUpTimeScaleFunction
  prefix?: string
}

export interface AbilityChargeUpTimeScaleFunction {
  class_name: string
  subclass_name: string
  specific_stat_scale_type: string
  stat_scale?: number
}

export interface AbilityPostCastDuration {
  value: string
  disable_value: string
}

export interface AbilityResourceCost {
  value: string
  can_set_token_override: boolean
  css_class: string
  disable_value: string
  icon: string
}

export interface AbilityUnitTargetLimit {
  value: string
  can_set_token_override: boolean
}

export interface AmmoReloadPercent {
  value: string
  label: string
  postfix: string
  postvalue_label: string
  tooltip_section: string
  tooltip_is_elevated: boolean
  tooltip_is_important: boolean
  provided_property_type?: string
  prefix?: string
  css_class?: string
  icon?: string
  can_set_token_override?: boolean
  disable_value?: string
}

export interface BuffDuration {
  value: string
  label: string
  postfix: string
  postvalue_label: string
}

export interface ChannelMoveSpeed {
  value: string
  can_set_token_override: boolean
  css_class: string
  display_units: string
  postfix: string
  icon: string
}

export interface TooltipSection {
  section_type: string
  section_attributes: SectionAttribute[]
}

export interface SectionAttribute {
  properties: string[]
  loc_string?: string
  important_properties?: string[]
}

export interface Upgrade {
  property_upgrades: PropertyUpgrade[]
}

export interface PropertyUpgrade {
  name: string
  bonus: string
}

export type WeaponInfo = object
