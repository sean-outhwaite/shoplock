import { useState } from 'react'
import type { FormEvent } from 'react'
import type { BuildSection as BuildSectionData, ShopItem } from '../types.ts'
import BuildSection from './BuildSection.tsx'

interface props {
  sections: BuildSectionData[]
  activeSectionId: string | null
  drawerOpen: boolean
  itemsById: Map<number, ShopItem>
  onToggleDrawer: () => void
  onAddSection: (name: string) => void
  onDeleteSection: (sectionId: string) => void
  onRenameSection: (sectionId: string, name: string) => void
  onSetActiveSection: (sectionId: string) => void
  onRemoveItem: (sectionId: string, index: number) => void
  onMoveItem: (
    from: { sectionId: string; index: number },
    to: { sectionId: string; index: number },
  ) => void
}

const BuildDrawer = ({
  sections,
  activeSectionId,
  drawerOpen,
  itemsById,
  onToggleDrawer,
  onAddSection,
  onDeleteSection,
  onRenameSection,
  onSetActiveSection,
  onRemoveItem,
  onMoveItem,
}: props) => {
  const [newSectionName, setNewSectionName] = useState('')
  const itemCount = sections.reduce(
    (total, section) => total + section.itemIds.length,
    0,
  )

  function submitNewSection(event: FormEvent) {
    event.preventDefault()
    onAddSection(newSectionName)
    setNewSectionName('')
  }

  return (
    <div className="build-drawer">
      <div className="build-drawer__panel" data-open={drawerOpen ? 'true' : 'false'}>
        <button
          type="button"
          className="build-drawer__handle"
          onClick={onToggleDrawer}
          aria-expanded={drawerOpen}
        >
          <span className="build-drawer__handle-title">Build</span>
          <span className="build-drawer__handle-count">{itemCount} items</span>
        </button>

        <div className="build-drawer__body">
          <div className="build-drawer__sections">
            {sections.map((section) => (
              <BuildSection
                key={section.id}
                section={section}
                isActive={section.id === activeSectionId}
                itemsById={itemsById}
                onSetActive={onSetActiveSection}
                onDelete={onDeleteSection}
                onRename={onRenameSection}
                onRemoveItem={onRemoveItem}
                onMoveItem={onMoveItem}
              />
            ))}
          </div>

          <form className="build-drawer__add-section" onSubmit={submitNewSection}>
            <input
              type="text"
              placeholder="New section name..."
              className="build-drawer__add-section-input"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
            />
            <button type="submit" className="build-drawer__add-section-button">
              + Add section
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuildDrawer
