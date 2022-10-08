import { useState } from "react";

const WinningSongInfo = ({
  album,
  artist,
  name,
  released
}) => {

  const [display, setDisplay] = useState('hide');

  const toggleInfo = () => {
    if (display === 'hide') {
      setDisplay('show');
    } else {
      setDisplay('hide');
    }
  }

  return (
    <>
      <button className="toggle-track-info" onClick={toggleInfo}>Song info</button>
      <div className={`song-info ${display}`}>
        <p>Track: {name}</p>
        <p>Artist: {artist}</p>
        <p>Album: {album}</p>
        <p>Released: {released ? released : 'No info :('}</p>
      </div>
    </>
  )
}

export default WinningSongInfo
