import background from '../assets/backgrounds/bg_team1_psd.png'

interface props {
  windowOpen: boolean
  onToggleWindow: () => void
}

const RankWindow = ({ windowOpen, onToggleWindow }: props) => {
  const ids = [
    64750041, // Swan
    87195919, // Voa
    31475757, // Crisps
    54578031, // Dee
    44801486, // Naked
  ]

  return (
    <div
      className="rank-window"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      hidden={!windowOpen}
    >
      <button className="rank-window__close" onClick={onToggleWindow}>
        Close
      </button>
      <div className="rank-window__players">
        {ids.map((id) => (
          <img
            src={`https://api.deadlock-api.com/v1/players/${id}/rank/image`}
            alt="Player Rank"
            className="rank-window__player-rank"
            key={id}
          />
        ))}
      </div>
    </div>
  )
}

export default RankWindow
