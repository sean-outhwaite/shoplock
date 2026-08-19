import { formatCost, categoryAccent } from '../utils.tsx'
import type { CSSProperties } from 'react'
import type { ShopItem, PopoverPosition, Properties } from '../types.ts'

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
      <header className="item-popover__header">
        <div>
          <h3>{item.name}</h3>
        </div>
        <div>
          <strong>${formatCost(item.cost)}</strong>
        </div>
      </header>

      <div className="item-popover__body">
        {item.tooltipSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.section_type === 'innate' &&
              Object.entries(section.section_attributes[0]).map(
                ([key, value]) =>
                  value.map((prop: keyof Properties, index: number) => (
                    <div
                      key={key + value + index}
                      className="item-popover__upgrade"
                    >
                      {`${(item.properties[prop].prefix === '{s:sign}' ? '+' : item.properties[prop].prefix) ?? ''}${item.properties[prop].value}${item.properties[prop].postfix ?? ''} ${item.properties[prop].label}`}
                    </div>
                  )),
              )}
            {(section.section_type === 'passive' ||
              section.section_type === undefined) && (
              <>
                <div className="item-popover__eyebrow">Passive</div>
                <div
                  className="item-popover__lead"
                  dangerouslySetInnerHTML={{
                    __html: section.section_attributes[0].loc_string || '',
                  }}
                ></div>
              </>
            )}
            {section.section_type === 'active' && (
              <>
                <div className="item-popover__eyebrow">Active</div>
                <div
                  className="item-popover__lead"
                  dangerouslySetInnerHTML={{
                    __html: section.section_attributes[0].loc_string || '',
                  }}
                ></div>
              </>
            )}
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

        <p className="item-popover__note">Tags: {item.tags.join(' • ')}</p>
      </div>
    </aside>
  )
}
