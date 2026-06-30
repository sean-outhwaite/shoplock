import { formatCost, categoryAccent } from '../utils.tsx'
import type { CSSProperties } from 'react'
import type { ShopItem, PopoverPosition, Properties } from '../types.ts'

export function ItemPreviewPopover({
  item,
  position,
}: {
  item: ShopItem
  position: PopoverPosition
}) {
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
                      {`${item.properties[prop].value}${item.properties[prop].postfix ?? ''} ${item.properties[prop].label}`}
                    </div>
                  )),
              )}
          </div>
        ))}
        {item.description && (
          <>
            <div className="item-popover__eyebrow">Passive</div>
            <div
              className="item-popover__lead"
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>
          </>
        )}

        <p className="item-popover__note">Tags: {item.tags.join(' • ')}</p>
      </div>
    </aside>
  )
}
