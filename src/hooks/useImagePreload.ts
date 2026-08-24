import { useEffect, useState } from 'react'

// Kicks off a real browser fetch for every URL and doesn't report ready
// until they've all settled (loaded or errored), so the browser's HTTP
// cache is already warm by the time the actual <img> tags render - no
// waiting on a slow/broken URL forever, though.
export function useImagePreload(urls: string[], timeoutMs = 8000) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (urls.length === 0) {
      Promise.resolve().then(() => {
        if (!cancelled) setReady(true)
      })
      return () => {
        cancelled = true
      }
    }

    let remaining = urls.length
    const settle = () => {
      remaining -= 1
      if (remaining <= 0 && !cancelled) setReady(true)
    }

    const images = urls.map((url) => {
      const img = new Image()
      img.onload = settle
      img.onerror = settle
      img.src = url
      return img
    })

    const timeout = setTimeout(() => {
      if (!cancelled) setReady(true)
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
