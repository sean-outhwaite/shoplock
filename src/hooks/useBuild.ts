import { useEffect, useState } from 'react'
import type { BuildSection } from '../types.ts'

const STORAGE_KEY = 'shoplock.build.v1'
const NAME_STORAGE_KEY = 'shoplock.build-name.v1'

function loadSections(): BuildSection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.map((section, index) => ({
      ...section,
      row: typeof section.row === 'number' ? section.row : index,
    }))
  } catch {
    return []
  }
}

function loadBuildName(): string {
  try {
    return localStorage.getItem(NAME_STORAGE_KEY) || 'Build'
  } catch {
    return 'Build'
  }
}

export function useBuild() {
  const [sections, setSections] = useState<BuildSection[]>(loadSections)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [buildName, setBuildName] = useState<string>(loadBuildName)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
    } catch {
      // localStorage unavailable (quota, private mode) - ignore
    }
  }, [sections])

  useEffect(() => {
    try {
      localStorage.setItem(NAME_STORAGE_KEY, buildName)
    } catch {
      // localStorage unavailable (quota, private mode) - ignore
    }
  }, [buildName])

  function renameBuild(name: string) {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    setBuildName(trimmed)
  }

  function enterEditMode() {
    setIsEditMode(true)
  }

  function exitEditMode() {
    setIsEditMode(false)
    setActiveSectionId(null)
  }

  function addSection() {
    const id = crypto.randomUUID()
    setSections((current) => {
      const nextRow = current.length
        ? Math.max(...current.map((section) => section.row)) + 1
        : 0
      return [
        ...current,
        { id, name: `Category ${current.length + 1}`, itemIds: [], row: nextRow },
      ]
    })
    setActiveSectionId(id)
  }

  function deleteSection(sectionId: string) {
    setSections((current) =>
      current.filter((section) => section.id !== sectionId),
    )
    setActiveSectionId((current) => (current === sectionId ? null : current))
  }

  function renameSection(sectionId: string, name: string) {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, name: trimmed } : section,
      ),
    )
  }

  function resizeSection(sectionId: string, width: number) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, width } : section,
      ),
    )
  }

  function moveSection(fromIndex: number, toIndex: number, row: number) {
    setSections((current) => {
      if (fromIndex < 0 || fromIndex >= current.length) {
        return current
      }
      const updated = [...current]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, { ...moved, row })
      return updated
    })
  }

  function setActiveSection(sectionId: string) {
    setActiveSectionId((current) => (current === sectionId ? null : sectionId))
  }

  function addItemToActiveSection(itemId: number) {
    if (!isEditMode || !activeSectionId) {
      return
    }
    setSections((current) =>
      current.map((section) =>
        section.id === activeSectionId
          ? { ...section, itemIds: [...section.itemIds, itemId] }
          : section,
      ),
    )
  }

  function removeItem(sectionId: string, index: number) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              itemIds: section.itemIds.filter((_, i) => i !== index),
            }
          : section,
      ),
    )
  }

  function moveItem(
    from: { sectionId: string; index: number },
    to: { sectionId: string; index: number },
  ) {
    setSections((current) => {
      const fromSection = current.find((s) => s.id === from.sectionId)
      if (!fromSection) {
        return current
      }
      const itemId = fromSection.itemIds[from.index]
      if (itemId === undefined) {
        return current
      }

      let toIndex = to.index
      if (from.sectionId === to.sectionId && from.index < toIndex) {
        toIndex -= 1
      }

      return current.map((section) => {
        if (section.id === from.sectionId && section.id === to.sectionId) {
          const without = section.itemIds.filter((_, i) => i !== from.index)
          const inserted = [
            ...without.slice(0, toIndex),
            itemId,
            ...without.slice(toIndex),
          ]
          return { ...section, itemIds: inserted }
        }
        if (section.id === from.sectionId) {
          return {
            ...section,
            itemIds: section.itemIds.filter((_, i) => i !== from.index),
          }
        }
        if (section.id === to.sectionId) {
          const inserted = [
            ...section.itemIds.slice(0, toIndex),
            itemId,
            ...section.itemIds.slice(toIndex),
          ]
          return { ...section, itemIds: inserted }
        }
        return section
      })
    })
  }

  return {
    sections,
    activeSectionId,
    isEditMode,
    buildName,
    renameBuild,
    enterEditMode,
    exitEditMode,
    addSection,
    deleteSection,
    renameSection,
    resizeSection,
    moveSection,
    setActiveSection,
    addItemToActiveSection,
    removeItem,
    moveItem,
  }
}
