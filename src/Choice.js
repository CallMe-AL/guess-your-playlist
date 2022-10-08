import { useState, useEffect } from 'react';
import WinningSongInfo from "./WinningSongInfo";

const Choice = ({
  gameStart,
  points,
  score,
  setGameInfo,
  setGameStart,
  setPoints,  
  setScore,
  song, 
  timeLeft,
  winningSong
}) => {

  const [correctChoice, setCorrectChoice] = useState(false);
  const [correct, setCorrect] = useState('');

  // const [albumArt, setAlbumArt] = useState(albumArt1);

  const id = song.track.id;
  const albumArt2 = song.track.album.images[2].url; // 64w
  const albumArt1 = song.track.album.images[1].url; // 300w
  const albumArt0 = song.track.album.images[0].url; // 640w

  const compareSongs = (id) => {
    if (gameStart) {
      if (id === winningSong.track.id) {
        setCorrectChoice(true);
        setCorrect('correct');
        setGameInfo('Nice!!');
        setGameStart(false);
        setScore(score + points);
      } else {
        setPoints(points - 2);
        setCorrect('wrong');
        setGameInfo('Nope!');
      }
    }
  }

  useEffect(() => {
    setCorrectChoice(false);
    setCorrect('');
  }, [winningSong]);

  useEffect(() => {
    if (points === 0 || timeLeft === 0) {
      if (id === winningSong.track.id) {
        setCorrectChoice(true);
        setCorrect('correct');
        setGameInfo('This was the right one :(');
        setGameStart(false);
      }
    }
  }, [points, timeLeft]);

  return (
    
    <div className={`choice ${correct}`} onClick={() => compareSongs(id)}>
      <picture>
        <source srcSet={albumArt0} media="(min-width: 760px)" />
        <img src={albumArt1} alt="album image" />
      </picture>      
      {correctChoice && 
            <WinningSongInfo 
                name={winningSong.track.name} 
                artist={winningSong.track.artists[0].name} 
                album={winningSong.track.album.name} 
                released={winningSong.track.album.release_date}
            />
      }
    </div>
  )
}

export default Choice
