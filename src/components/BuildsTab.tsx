import { useState } from 'react'
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
  onSetActiveSection,
  onRemoveItem,
  onMoveItem,
  onEnterEditMode,
  onExitEditMode,
}: Props) => {
  const [renamingBuild, setRenamingBuild] = useState(false)
  const [buildNameDraft, setBuildNameDraft] = useState(buildName)

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
          {sections.map((section) => (
            <BuildSection
              key={section.id}
              section={section}
              isActive={section.id === activeSectionId}
              isEditMode={isEditMode}
              itemsById={itemsById}
              onSetActive={onSetActiveSection}
              onDelete={onDeleteSection}
              onRename={onRenameSection}
              onRemoveItem={onRemoveItem}
              onMoveItem={onMoveItem}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuildsTab
