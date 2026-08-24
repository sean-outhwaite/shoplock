import { formatCost, categoryAccent } from '../utils.tsx'
import type { CSSProperties } from 'react'
import type {
  ShopItem,
  PopoverPosition,
  PropertyDescriptor,
  ImportantPropertyIcon,
  SectionAttribute,
  TooltipSection,
} from '../types.ts'

function formatPropertyValue(prop: PropertyDescriptor) {
  const prefix = prop.prefix === '{s:sign}' ? '+' : (prop.prefix ?? '')
  return `${prefix}${prop.value}${prop.postfix ?? ''}`
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

  return (
    <aside
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
            'background-image': `url('src/assets/popover/catalog_tooltip_header_${item.category.toLowerCase()}_psd.png')`,
          } as CSSProperties
        }
      >
        <div>
          <h3>{item.name}</h3>
        </div>
        <div>
          <strong>${formatCost(item.cost)}</strong>
        </div>
      </header>

      <div
        className="item-popover__body"
        style={
          {
            'background-image': `url('src/assets/popover/catalog_tooltip_bg_${item.category.toLowerCase()}.png')`,
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
                  if (!prop) {
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
            <div className="item-popover__eyebrow">Upgrades From</div>
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
      </div>
    </aside>
  )
}
