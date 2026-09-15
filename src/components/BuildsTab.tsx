import { useMemo, useState } from 'react'
import type { CSSProperties, SubmitEvent, FocusEvent } from 'react'
import type { BuildSection as BuildSectionData, ShopItem } from '../types.ts'
import BuildSection from './BuildSection.tsx'
import buildsHeaderBg from '../assets/catalog_shop_builds_header_bg_psd.png'

interface Props {
  sections: BuildSectionData[]
  activeSectionId: string | null
  itemsById: Map<number, ShopItem>
  isEditMode: boolean
  buildName: string
  onRenameBuild: (name: string) => void
  onAddSection: () => void
  onDeleteSection: (sectionId: string) => void
  onRenameSection: (sectionId: string, name: string) => void
  onResizeSection: (sectionId: string, width: number) => void
  onMoveSection: (fromIndex: number, toIndex: number, row: number) => void
  onSetActiveSection: (sectionId: string) => void
  onRemoveItem: (sectionId: string, index: number) => void
  onMoveItem: (
    from: { sectionId: string; index: number },
    to: { sectionId: string; index: number },
  ) => void
  onEnterEditMode: () => void
  onExitEditMode: () => void
}

const BuildsTab = ({
  sections,
  activeSectionId,
  itemsById,
  isEditMode,
  buildName,
  onRenameBuild,
  onAddSection,
  onDeleteSection,
  onRenameSection,
  onResizeSection,
  onMoveSection,
  onSetActiveSection,
  onRemoveItem,
  onMoveItem,
  onEnterEditMode,
  onExitEditMode,
}: Props) => {
  const [renamingBuild, setRenamingBuild] = useState(false)
  const [buildNameDraft, setBuildNameDraft] = useState(buildName)

  const rows = useMemo(() => {
    const byRow = new Map<number, { section: BuildSectionData; index: number }[]>()
    sections.forEach((section, index) => {
      const entries = byRow.get(section.row) ?? []
      entries.push({ section, index })
      byRow.set(section.row, entries)
    })
    return Array.from(byRow.entries())
  }, [sections])

  function submitBuildRename(
    event: SubmitEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>,
  ) {
    event.preventDefault()
    onRenameBuild(buildNameDraft)
    setRenamingBuild(false)
  }

  return (
    <div className={isEditMode ? 'builds-tab builds-tab--edit' : 'builds-tab'}>
      <header
        className="builds-tab__header"
        style={
          { backgroundImage: `url(${buildsHeaderBg})` } as CSSProperties
        }
      >
        {renamingBuild ? (
          <form
            onSubmit={submitBuildRename}
            className="builds-tab__header-rename-form"
          >
            <input
              type="text"
              value={buildNameDraft}
              autoFocus
              onChange={(e) => setBuildNameDraft(e.target.value)}
              onBlur={submitBuildRename}
              className="builds-tab__header-rename-input"
            />
          </form>
        ) : isEditMode ? (
          <h1
            className="builds-tab__header-title builds-tab__header-title--editable"
            onDoubleClick={() => {
              setBuildNameDraft(buildName)
              setRenamingBuild(true)
            }}
          >
            {buildName}
          </h1>
        ) : (
          <h1 className="builds-tab__header-title">{buildName}</h1>
        )}

        {isEditMode ? (
          <div className="builds-tab__header-actions">
            <button
              type="button"
              className="builds-tab__save-button"
              onClick={onExitEditMode}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="builds-tab__add-category-button"
              onClick={onAddSection}
            >
              Add Category
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="builds-tab__edit-button"
            onClick={onEnterEditMode}
          >
            Edit
          </button>
        )}
      </header>

      <div
        className={
          isEditMode ? 'builds-tab__body builds-tab__body--edit' : 'builds-tab__body'
        }
      >
        <div className="builds-tab__sections">
          {rows.map(([row, entries]) => (
            <div className="builds-tab__row" key={row}>
              {entries.map(({ section, index }) => (
                <BuildSection
                  key={section.id}
                  section={section}
                  index={index}
                  isActive={section.id === activeSectionId}
                  isEditMode={isEditMode}
                  itemsById={itemsById}
                  onSetActive={onSetActiveSection}
                  onDelete={onDeleteSection}
                  onRename={onRenameSection}
                  onResize={onResizeSection}
                  onMoveSection={onMoveSection}
                  onRemoveItem={onRemoveItem}
                  onMoveItem={onMoveItem}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuildsTab
