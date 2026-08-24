import { useEffect, useState } from 'react'

export function useImagePreload(urls: string[], timeoutMs = 8000) {
  const [readyUrls, setReadyUrls] = useState<string[] | null>(null)
  const ready = urls.length === 0 || readyUrls === urls

  useEffect(() => {
    if (urls.length === 0) return

    let cancelled = false
    let remaining = urls.length

    const settle = () => {
      remaining -= 1
      if (remaining <= 0 && !cancelled) setReadyUrls(urls)
    }

    const images = urls.map((url) => {
      const img = new Image()
      img.onload = settle
      img.onerror = settle
      img.src = url
      return img
    })

    const timeout = setTimeout(() => {
      if (!cancelled) setReadyUrls(urls)
    }, timeoutMs)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      images.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [urls, timeoutMs])

  return ready
}
