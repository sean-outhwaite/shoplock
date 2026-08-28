import { useLayoutEffect, useRef } from 'react'
import { categoryAccent } from '../utils.tsx'
import { useItemPreviewContext } from '../context/ItemPreviewContext.ts'
import type { CSSProperties } from 'react'
import type {
  ShopItem,
  PopoverPosition,
  PropertyDescriptor,
  ImportantPropertyIcon,
  SectionAttribute,
  TooltipSection,
  ItemCategory,
} from '../types.ts'
import tooltipBgWeapon from '../assets/popover/catalog_tooltip_bg_weapon.png'
import tooltipBgSpirit from '../assets/popover/catalog_tooltip_bg_spirit.png'
import tooltipBgVitality from '../assets/popover/catalog_tooltip_bg_vitality.png'
import tooltipHeaderWeapon from '../assets/popover/catalog_tooltip_header_weapon_psd.png'
import tooltipHeaderSpirit from '../assets/popover/catalog_tooltip_header_spirit_psd.png'
import tooltipHeaderVitality from '../assets/popover/catalog_tooltip_header_vitality_psd.png'
import currencySymbol from '../assets/price_currency_psd.png'

const tooltipBg: Record<ItemCategory, string> = {
  Weapon: tooltipBgWeapon,
  Spirit: tooltipBgSpirit,
  Vitality: tooltipBgVitality,
}

const tooltipHeader: Record<ItemCategory, string> = {
  Weapon: tooltipHeaderWeapon,
  Spirit: tooltipHeaderSpirit,
  Vitality: tooltipHeaderVitality,
}

// The API sometimes bakes the unit into `value` itself (e.g. "7m") while
// still returning that same unit in `postfix` (e.g. "m" or " m/s"), which
// would otherwise render as "7mm" or "7mm/s". Strip whatever leading part of
// the (trimmed) postfix is already duplicated at the end of the value.
function dedupePostfix(value: string, postfix: string) {
  const trimmed = postfix.trimStart()
  const maxOverlap = Math.min(value.length, trimmed.length)
  for (let overlap = maxOverlap; overlap > 0; overlap--) {
    if (value.endsWith(trimmed.slice(0, overlap))) {
      return trimmed.slice(overlap)
    }
  }
  return postfix
}

function formatPropertyValue(prop: PropertyDescriptor) {
  let prefix = prop.prefix ?? ''
  if (prop.prefix === '{s:sign}') {
    prefix = prop.value.startsWith('-') ? '' : '+'
  }
  const postfix = prop.postfix ? dedupePostfix(prop.value, prop.postfix) : ''
  return `${prefix}${prop.value}${postfix}`
}

// Most stat-box entries reference a normal, numeric property. A few (like
// "StatusEffectStun") describe a status effect instead - they have no entry
// in item.properties and are only resolved via important_properties_with_icon.
// Icons are only shown for the primary/important boxes - the secondary row
// of regular properties stays text-only.
function renderStatBox(
  propName: string,
  item: ShopItem,
  iconByName?: Map<string, ImportantPropertyIcon>,
  showIcon = true,
) {
  const prop = item.properties[propName]
  if (prop) {
    return (
      <div key={propName}>
        {showIcon && prop.icon && (
          <img src={prop.icon} alt="" className="item-popover__stat-icon" />
        )}
        <strong>{formatPropertyValue(prop)}</strong>
        <span>{prop.label ?? propName}</span>
      </div>
    )
  }

  const iconInfo = iconByName?.get(propName)
  if (iconInfo) {
    return (
      <div key={propName}>
        <img src={iconInfo.icon} alt="" className="item-popover__stat-icon" />
        <strong>{iconInfo.localized_name}</strong>
        <span>Status Effect</span>
      </div>
    )
  }

  return null
}

// The section's cooldown (AbilityCooldown/ProcCooldown, identified by
// css_class) reads as a badge next to the "Passive"/"Active" label rather
// than as its own stat box, matching the in-game tooltip.
function findCooldownProperty(section: TooltipSection, item: ShopItem) {
  const keys = section.section_attributes.flatMap(
    (attr) => attr.properties ?? [],
  )
  const cooldownKey = keys.find(
    (key) => item.properties[key]?.css_class === 'cooldown',
  )
  return cooldownKey
    ? { key: cooldownKey, prop: item.properties[cooldownKey] }
    : undefined
}

function renderPassiveActiveSection(section: TooltipSection, item: ShopItem) {
  const cooldown = findCooldownProperty(section, item)

  return (
    <>
      <div className="item-popover__eyebrow">
        <span>{section.section_type === 'active' ? 'Active' : 'Passive'}</span>
        {cooldown && (
          <span className="item-popover__eyebrow-cooldown">
            {cooldown.prop.icon && <img src={cooldown.prop.icon} alt="" />}
            {formatPropertyValue(cooldown.prop)}
          </span>
        )}
      </div>
      {section.section_attributes.map((attr, attrIndex) =>
        renderSectionAttribute(attr, attrIndex, item, cooldown?.key),
      )}
    </>
  )
}

function renderSectionAttribute(
  attr: SectionAttribute,
  attrIndex: number,
  item: ShopItem,
  cooldownKey: string | undefined,
) {
  const importantProperties = attr.important_properties ?? []
  const properties = (attr.properties ?? []).filter(
    (key) => key !== cooldownKey,
  )
  const hasContent =
    attr.loc_string || importantProperties.length > 0 || properties.length > 0
  if (!hasContent) {
    return null
  }

  const iconByName = new Map(
    (attr.important_properties_with_icon ?? []).map(
      (entry) => [entry.name, entry] as const,
    ),
  )

  return (
    <div key={attrIndex}>
      {attr.loc_string && (
        <div
          className="item-popover__lead"
          dangerouslySetInnerHTML={{ __html: attr.loc_string }}
        />
      )}
      {importantProperties.length > 0 && (
        <div className="item-popover__stats">
          {importantProperties.map((propName) =>
            renderStatBox(propName, item, iconByName),
          )}
        </div>
      )}
      {properties.length > 0 && (
        <div className="item-popover__stats-secondary">
          {properties.map((propName) =>
            renderStatBox(propName, item, undefined, false),
          )}
        </div>
      )}
    </div>
  )
}

export function ItemPreviewPopover({
  item,
  position,
  itemData,
}: {
  item: ShopItem
  position: PopoverPosition
  itemData: ShopItem[]
}) {
  const upgradeSources = item.upgradesFrom
    .map((className) => itemData.find((i) => i.class_name === className))
    .filter((sourceItem): sourceItem is ShopItem => sourceItem !== undefined)

  const upgradeTargets = item.upgradesTo
    .map((className) => itemData.find((i) => i.class_name === className))
    .filter((targetItem): targetItem is ShopItem => targetItem !== undefined)

  const { adjustPopoverHeight } = useItemPreviewContext()
  const popoverRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (popoverRef.current) {
      adjustPopoverHeight(popoverRef.current.offsetHeight)
    }
  }, [item.id, adjustPopoverHeight])

  return (
    <aside
      ref={popoverRef}
      className="item-popover"
      style={
        {
          '--popover-x': `${position.x}px`,
          '--popover-y': `${position.y}px`,
          '--popover-accent': categoryAccent(item.category),
        } as CSSProperties
      }
      role="presentation"
      aria-hidden="true"
    >
      <header
        className="item-popover__header"
        style={
          {
            backgroundImage: `url('${tooltipHeader[item.category]}')`,
          } as CSSProperties
        }
      >
        <div>
          <h3>{item.name}</h3>
        </div>
        <div>
          <strong className="item-popover__price">
            <img
              src={currencySymbol}
              alt=""
              className="item-popover__price-icon"
            />
            {item.cost}
          </strong>
        </div>
      </header>

      <div
        className="item-popover__body"
        style={
          {
            backgroundImage: `url('${tooltipBg[item.category]}')`,
          } as CSSProperties
        }
      >
        {item.tooltipSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.section_type === 'innate' &&
              section.section_attributes.flatMap((attr, attrIndex) =>
                [
                  ...(attr.properties ?? []),
                  ...(attr.elevated_properties ?? []),
                ].map((propName, index) => {
                  const prop = item.properties[propName]
                  if (!prop || !prop.value) {
                    return null
                  }
                  return (
                    <div
                      key={`${attrIndex}-${propName}-${index}`}
                      className="item-popover__upgrade"
                    >
                      {formatPropertyValue(prop)} {prop.label}
                    </div>
                  )
                }),
              )}

            {(section.section_type === 'passive' ||
              section.section_type === 'active' ||
              section.section_type === undefined) &&
              renderPassiveActiveSection(section, item)}
          </div>
        ))}

        {upgradeSources.length > 0 && (
          <div className="item-popover__upgrades-from">
            <div className="item-popover__eyebrow-upgrades">UPGRADES FROM:</div>
            <div className="item-popover__upgrades-from-list">
              {upgradeSources.map((sourceItem) => (
                <div
                  key={sourceItem.id}
                  className="item-popover__upgrade-source"
                >
                  <img
                    src={sourceItem.imageURL}
                    alt=""
                    className="item-popover__upgrade-icon"
                  />
                  <span>{sourceItem.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {upgradeTargets.length > 0 && (
          <div className="item-popover__upgrades-to">
            <div className="item-popover__eyebrow-upgrades">UPGRADES TO:</div>
            <div className="item-popover__upgrades-to-list">
              {upgradeTargets.map((targetItem) => (
                <div
                  key={targetItem.id}
                  className="item-popover__upgrade-target"
                >
                  <img
                    src={targetItem.imageURL}
                    alt=""
                    className="item-popover__upgrade-icon"
                  />
                  <span>{targetItem.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
