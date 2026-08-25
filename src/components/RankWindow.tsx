import background from '../assets/backgrounds/bg_team1_psd.png'
import { usePlayerRanks } from '../hooks/usePlayerRanks'

interface Props {
  windowOpen: boolean
  onToggleWindow: () => void
}

const players = [
  {
    name: 'Swan',
    id: 64750041,
  },
  {
    name: 'Voa',
    id: 87195919,
  },
  {
    name: 'Crisps',
    id: 31475757,
  },
  {
    name: 'Dee',
    id: 54578031,
  },
  {
    name: 'Naked',
    id: 44801486,
  },
]

const rankNames = [
  'Obscurus',
  'Initiate',
  'Seeker',
  'Acolyte',
  'Sentinel',
  'Mystic',
  'Ritualist',
  'Emissary',
  'Oracle',
  'Phantom',
  'Ascendant',
  'Eternus',
]

const playerIds = players.map((player) => player.id)

const RankWindow = ({ windowOpen, onToggleWindow }: Props) => {
  const ranks = usePlayerRanks(playerIds)
  return (
    <div
      className="rank-window__overlay"
      hidden={!windowOpen}
      onClick={onToggleWindow}
    >
      <div
        className="rank-window"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        hidden={!windowOpen}
      >
        <div className="rank-window__players">
          {players.map((player) => {
            const result = ranks[player.id]
            return (
              <div key={player.id} className="rank-window__player">
                <img
                  src={`https://api.deadlock-api.com/v1/players/${player.id}/rank/image`}
                  alt="Player Rank"
                  className="rank-window__player-rank"
                />
                {result.status === 'success' && (
                  <span className="rank-window__player-rank-name">
                    {rankNames[result.data.rank]} {result.data.subrank}
                  </span>
                )}
                <span className="rank-window__player-name">{player.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RankWindow
