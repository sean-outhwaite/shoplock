import { createContext, useContext } from 'react'
import type { ItemPreviewState } from '../hooks/useItemPreview.ts'

export const ItemPreviewContext = createContext<ItemPreviewState | null>(null)

export function useItemPreviewContext(): ItemPreviewState {
  const context = useContext(ItemPreviewContext)
  if (!context) {
    throw new Error(
      'useItemPreviewContext must be used within an ItemPreviewContext.Provider',
    )
  }
  return context
}
