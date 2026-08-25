import { useEffect, useState } from 'react'

interface PlayerRank {
  rank: number
  subrank: number
}

type RankStatus =
  | { status: 'loading' }
  | { status: 'success'; data: PlayerRank }
  | { status: 'error' }

export function usePlayerRanks(playerIds: number[]) {
  const [ranks, setRanks] = useState<Record<number, RankStatus>>(() =>
    Object.fromEntries(
      playerIds.map((id) => [id, { status: 'loading' } as const]),
    ),
  )

  useEffect(() => {
    let cancelled = false

    playerIds.forEach((id) => {
      fetch(`https://api.deadlock-api.com/v1/players/${id}/rank`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch player rank')
          return response.json()
        })
        .then((data: PlayerRank) => {
          if (cancelled) return
          setRanks((current) => ({
            ...current,
            [id]: { status: 'success', data },
          }))
        })
        .catch(() => {
          if (cancelled) return
          setRanks((current) => ({
            ...current,
            [id]: { status: 'error' },
          }))
        })
    })
    return () => {
      cancelled = true
    }
  }, [playerIds])

  return ranks
}
