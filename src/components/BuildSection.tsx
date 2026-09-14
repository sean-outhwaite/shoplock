import { useRef, useState } from 'react'
import type {
  DragEvent,
  SubmitEvent,
  FocusEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import type { BuildSection as BuildSectionData, ShopItem } from '../types.ts'
import ItemCard from './ItemCard.tsx'
import trashIcon from '../assets/icons/icon_trash_png.png'
import { useItemPreviewContext } from '../context/ItemPreviewContext.ts'

const MIN_SECTION_WIDTH = 220

interface DragPayload {
  sectionId: string
  index: number
}

interface Props {
  section: BuildSectionData
  isActive: boolean
  isEditMode: boolean
  itemsById: Map<number, ShopItem>
  onSetActive: (sectionId: string) => void
  onDelete: (sectionId: string) => void
  onRename: (sectionId: string, name: string) => void
  onResize: (sectionId: string, width: number) => void
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
  isEditMode,
  itemsById,
  onSetActive,
  onDelete,
  onRename,
  onResize,
  onRemoveItem,
  onMoveItem,
}: Props) => {
  const [renaming, setRenaming] = useState(false)
  const [nameDraft, setNameDraft] = useState(section.name)
  const [dragWidth, setDragWidth] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { setHoveredItem } = useItemPreviewContext()

  function startResize(event: ReactMouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const sectionEl = sectionRef.current
    if (!sectionEl) {
      return
    }

    const startX = event.clientX
    const startWidth = sectionEl.getBoundingClientRect().width
    const maxWidth = sectionEl.parentElement?.getBoundingClientRect().width ?? startWidth

    function clamp(width: number) {
      return Math.min(maxWidth, Math.max(MIN_SECTION_WIDTH, width))
    }

    function onMouseMove(moveEvent: MouseEvent) {
      setDragWidth(clamp(startWidth + moveEvent.clientX - startX))
    }

    function onMouseUp(upEvent: MouseEvent) {
      onResize(section.id, clamp(startWidth + upEvent.clientX - startX))
      setDragWidth(null)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

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

  const isSelected = isEditMode && isActive

  const width = dragWidth ?? section.width

  return (
    <div
      ref={sectionRef}
      className={
        isSelected ? 'build-section build-section--selected' : 'build-section'
      }
      style={width ? { width } : undefined}
    >
      <header
        className={
          isEditMode
            ? 'build-section__header build-section__header--interactive'
            : 'build-section__header'
        }
        onClick={isEditMode ? () => onSetActive(section.id) : undefined}
      >
        {renaming ? (
          <form
            onSubmit={submitRename}
            className="build-section__rename-form"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={nameDraft}
              autoFocus
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={submitRename}
              className="build-section__rename-input"
            />
          </form>
        ) : isEditMode ? (
          <button
            type="button"
            className="build-section__name"
            onDoubleClick={() => {
              setNameDraft(section.name)
              setRenaming(true)
            }}
          >
            {section.name}
          </button>
        ) : (
          <span className="build-section__name build-section__name--static">
            {section.name}
          </span>
        )}

        {isSelected && (
          <button
            type="button"
            className="build-section__icon-button build-section__icon-button--delete"
            aria-label={`Delete section ${section.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(section.id)
            }}
          >
            <img src={trashIcon} alt="" className="build-section__icon-image" />
          </button>
        )}
      </header>

      <div
        className="build-section__slots"
        onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
        onDrop={isEditMode ? dropOnContainer : undefined}
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
              draggable={isEditMode}
              onDragStart={
                isEditMode
                  ? (e) => {
                      setHoveredItem(null)
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData(
                        'application/json',
                        JSON.stringify({ sectionId: section.id, index }),
                      )
                      const img = e.currentTarget.querySelector('img')
                      if (img) {
                        e.dataTransfer.setDragImage(
                          img,
                          img.clientWidth / 2,
                          img.clientHeight / 2,
                        )
                      }
                    }
                  : undefined
              }
              onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
              onDrop={isEditMode ? (e) => dropOnSlot(e, index) : undefined}
            >
              <ItemCard
                item={item}
                onAddToBuild={
                  isEditMode ? () => onRemoveItem(section.id, index) : undefined
                }
              />
            </div>
          )
        })}
      </div>

      {isSelected && (
        <span
          className="build-section__resize-handle"
          aria-hidden="true"
          onMouseDown={startResize}
        />
      )}
    </div>
  )
}

export default BuildSection
