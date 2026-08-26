import { useState } from 'react'
import type { DragEvent, SubmitEvent, FocusEvent } from 'react'
import type { BuildSection as BuildSectionData, ShopItem } from '../types.ts'
import ItemCard from './ItemCard.tsx'

interface DragPayload {
  sectionId: string
  index: number
}

interface Props {
  section: BuildSectionData
  isActive: boolean
  itemsById: Map<number, ShopItem>
  onSetActive: (sectionId: string) => void
  onDelete: (sectionId: string) => void
  onRename: (sectionId: string, name: string) => void
  onRemoveItem: (sectionId: string, index: number) => void
  onMoveItem: (from: DragPayload, to: DragPayload) => void
}

function readDragPayload(event: DragEvent): DragPayload | null {
  try {
    const raw = event.dataTransfer.getData('application/json')
    return raw ? (JSON.parse(raw) as DragPayload) : null
  } catch {
    return null
  }
}

const BuildSection = ({
  section,
  isActive,
  itemsById,
  onSetActive,
  onDelete,
  onRename,
  onRemoveItem,
  onMoveItem,
}: Props) => {
  const [renaming, setRenaming] = useState(false)
  const [nameDraft, setNameDraft] = useState(section.name)

  function submitRename(
    event: SubmitEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>,
  ) {
    event.preventDefault()
    onRename(section.id, nameDraft)
    setRenaming(false)
  }

  function dropOnSlot(event: DragEvent, index: number) {
    event.preventDefault()
    event.stopPropagation()
    const payload = readDragPayload(event)
    if (payload) {
      onMoveItem(payload, { sectionId: section.id, index })
    }
  }

  function dropOnContainer(event: DragEvent) {
    event.preventDefault()
    const payload = readDragPayload(event)
    if (payload) {
      onMoveItem(payload, {
        sectionId: section.id,
        index: section.itemIds.length,
      })
    }
  }

  return (
    <div
      className={
        isActive ? 'build-section build-section--active' : 'build-section'
      }
    >
      <header className="build-section__header">
        {renaming ? (
          <form onSubmit={submitRename} className="build-section__rename-form">
            <input
              type="text"
              value={nameDraft}
              autoFocus
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={submitRename}
              className="build-section__rename-input"
            />
          </form>
        ) : (
          <button
            type="button"
            className="build-section__name"
            onClick={() => onSetActive(section.id)}
            onDoubleClick={() => {
              setNameDraft(section.name)
              setRenaming(true)
            }}
          >
            {section.name}
          </button>
        )}

        <button
          type="button"
          className="build-section__delete"
          aria-label={`Delete section ${section.name}`}
          onClick={() => onDelete(section.id)}
        >
          ×
        </button>
      </header>

      <div
        className="build-section__slots"
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropOnContainer}
      >
        {section.itemIds.map((itemId, index) => {
          const item = itemsById.get(itemId)
          if (!item) {
            return null
          }
          return (
            <div
              key={`${itemId}-${index}`}
              className="build-slot"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => dropOnSlot(e, index)}
            >
              <span
                className="build-slot__handle"
                draggable
                aria-label={`Drag to reorder ${item.name}`}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({ sectionId: section.id, index }),
                  )
                }}
              >
                ⠿
              </span>
              <ItemCard
                item={item}
                onAddToBuild={() => onRemoveItem(section.id, index)}
              />
            </div>
          )
        })}
        {section.itemIds.length === 0 && (
          <div className="build-section__empty">
            {isActive ? 'Click items to add them here' : 'No items yet'}
          </div>
        )}
      </div>
    </div>
  )
}

export default BuildSection
