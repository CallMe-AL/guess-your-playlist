
const GameInfo = ({
  songs,
  points,
  possiblePoints,
  score
}) => {

  return (
    <div className="game-info">
      <ul className="game-info-list">
        <li>Score: {`${score} / ${possiblePoints}`}</li>
        <li>Possible points: {points}</li>
        <li>Songs remaining: {songs.length}</li>
      </ul>
    </div>
  )
}

export default GameInfo
