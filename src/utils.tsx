import type { ItemIcon } from './types.ts'

export function ItemGlyph({ icon }: { icon: ItemIcon }) {
  switch (icon) {
    case 'blade':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19 19 5l-1.2-1.2L3.8 17.8 5 19Zm7.5-12.5L17 4l3 3-2.5 4.5-5.5 5.5L8 14.5l5.5-5.5Z" />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 2 2.5 6.4L21 11l-6.5 2.6L12 20l-2.5-6.4L3 11l6.5-2.6L12 2Zm0 5.3L10.9 10 8 11l2.9 1 .9 2.7.9-2.7L15 11l-2.3-.7L12 7.3Z" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 5 5v6c0 5 3 8.5 7 11 4-2.5 7-6 7-11V5l-7-3Zm0 4.1 4 .9v4c0 3-1.6 5.8-4 7.8-2.4-2-4-4.8-4-7.8V7l4-.9Z" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.8 2 14.4 4.6 16.2 5.3 18.5 3.9 20.3 7 18.2 8.6 18.4 10.8 20.6 12.2 18.7 15.4 16.3 14.4 14.4 15.8 14.1 18.4 10.3 18.4 10 15.8 8.1 14.4 5.7 15.4 3.8 12.2 6 10.8 6.2 8.6 4.1 7 5.9 3.9 8.2 5.3 10 4.6 10.6 2H13.8Zm-1.8 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2Z" />
        </svg>
      )
    case 'pulse':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      )
    case 'hex':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 4.5 6.3v8.4L12 19l7.5-4.3V6.3L12 2Zm0 2.3 5.5 3.2v6.2L12 16.9 6.5 13.7V7.5L12 4.3Z" />
        </svg>
      )
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 2 5 13h5l-1 9 10-13h-6l0-7Z" />
        </svg>
      )
    case 'wave':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 14c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4 2.5 4 3 4" />
        </svg>
      )
  }
}
