import { useEffect, useState } from 'react'
import type { BuildSection } from '../types.ts'

const STORAGE_KEY = 'shoplock.build.v1'

function loadSections(): BuildSection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useBuild() {
  const [sections, setSections] = useState<BuildSection[]>(loadSections)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
    } catch {
      // localStorage unavailable (quota, private mode) - ignore
    }
  }, [sections])

  function toggleDrawer() {
    setDrawerOpen((open) => {
      if (open) {
        setActiveSectionId(null)
      }
      return !open
    })
  }

  function addSection(name: string) {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    setSections((current) => [
      ...current,
      { id: crypto.randomUUID(), name: trimmed, itemIds: [] },
    ])
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

  function setActiveSection(sectionId: string) {
    setActiveSectionId((current) => (current === sectionId ? null : sectionId))
  }

  function addItemToActiveSection(itemId: number) {
    if (!activeSectionId) {
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
    drawerOpen,
    toggleDrawer,
    addSection,
    deleteSection,
    renameSection,
    setActiveSection,
    addItemToActiveSection,
    removeItem,
    moveItem,
  }
}
