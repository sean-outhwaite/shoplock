import { formatCost, categoryAccent } from '../utils.tsx'
import type { CSSProperties } from 'react'
import type { ShopItem, PopoverPosition } from '../types.ts'

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
        {/* {item.upgrades[0].property_upgrades.map((upgrade, index) => (
          <div key={index} className="item-popover__upgrade">
            {upgrade.bonus} {upgrade.name}
          </div>
        ))} */}

        {item.tooltipSections[0].section_attributes[0].elevated_properties?.map(
          (prop, index) => (
            <div key={index} className="item-popover__upgrade">
              {`${item.properties[prop].value}${item.properties[prop].postfix ?? ''} ${item.properties[prop].label}`}
            </div>
          ),
        )}
        {item.tooltipSections[0].section_attributes[0].properties?.map(
          (prop, index) =>
            item.properties[prop].value && (
              <div key={index} className="item-popover__upgrade">
                {`${item.properties[prop].value}${item.properties[prop].postfix ?? ''} ${item.properties[prop].label}`}
              </div>
            ),
        )}
        <div className="item-popover__eyebrow">Passive</div>
        <div
          className="item-popover__lead"
          dangerouslySetInnerHTML={{ __html: item.description }}
        ></div>

        <div className="item-popover__stats" aria-hidden="true">
          <div>
            <span>Stun</span>
            <strong>{item.category}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{(1 + item.tags.length * 0.25).toFixed(2)}s</strong>
          </div>
          <div>
            <span>Damage</span>
            <strong>{item.cost / 10}</strong>
          </div>
        </div>

        <p className="item-popover__note">Tags: {item.tags.join(' • ')}</p>
      </div>
    </aside>
  )
}
