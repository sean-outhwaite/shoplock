import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { BuildSection as BuildSectionData, ShopItem } from '../types.ts'
import BuildSection from './BuildSection.tsx'

interface Props {
  sections: BuildSectionData[]
  activeSectionId: string | null
  itemsById: Map<number, ShopItem>
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

const BuildsTab = ({
  sections,
  activeSectionId,
  itemsById,
  onAddSection,
  onDeleteSection,
  onRenameSection,
  onSetActiveSection,
  onRemoveItem,
  onMoveItem,
}: Props) => {
  const [newSectionName, setNewSectionName] = useState('')

  function submitNewSection(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onAddSection(newSectionName)
    setNewSectionName('')
  }

  return (
    <div className="builds-tab">
      <div className="builds-tab__sections">
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

      <form className="builds-tab__add-section" onSubmit={submitNewSection}>
        <input
          type="text"
          placeholder="New section name..."
          className="builds-tab__add-section-input"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
        />
        <button type="submit" className="builds-tab__add-section-button">
          + Add section
        </button>
      </form>
    </div>
  )
}

export default BuildsTab
