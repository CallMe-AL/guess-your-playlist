import SpotifyWebApi from "spotify-web-api-js";
import { useEffect, useState } from "react";
import Choice from "./Choice";
import WebPlayback from "./WebPlayback";
import GameInfo from './GameInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from './custom_hooks/useAuthContext';

const spotify = new SpotifyWebApi();

const Game = (props) => {

  const [songs, setSongs] = useState([]);
  const [gameSongs, setGameSongs] = useState([]);
  const [winningSong, setWinningSong] = useState(null);
  const [winningUri, setWinningUri] = useState(null);
  const [gameInfo, setGameInfo] = useState('Almost ready!');
  const [gameStart, setGameStart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(6);
  const [possiblePoints, setPossiblePoints] = useState(null);

  const location = useLocation();
  const accessToken = spotify.getAccessToken();
  const { id } = location.state;
  const navigate = useNavigate();

  const { is_active } = useAuthContext();

  useEffect(() => {
    if (!is_active) {
      navigate('/');
    }
  }, [is_active])

  // grabbing playlist's songs
  useEffect(() => {
    if (!id) return;
    spotify.getPlaylistTracks(id)
      .then(data => {
        console.log('songs', data);
        setSongs(data.items);
        const points = data.items.length * 6;
        setPossiblePoints(points);
      })
      .catch(err => {
        console.log(err);
        if (err.statusText === 'Unauthorized') {
          console.log('Your previous session expired. You\'ll have to login again.');
        }
      })
  }, [id]);

  // choose 4 random songs
  const createGame = () => {

    if (songs.length === 0) {
      setGameInfo('Go back and pick some songs!');
      return;
    }

    // prevents user shuffling to a new song
    // no getting out of a round ;)
    if (gameStart) {
      setGameInfo('Please finish the round!');
      return;
    };

    setWinningSong(null);
    setGameSongs([]);
    let uri = chooseGameSongs();   
    
    return uri;
  } 

  // choosing which albums will be visible during the game
  const chooseGameSongs = () => {

    let game_songs = [];

    const winningIndex = Math.floor(Math.random() * songs.length);
    game_songs.push(songs[winningIndex]);
    // setWinningUri(songs[winningIndex].track.uri);
    
    // create a temp array from songs state to manipulate
    let temp_songs = [...songs];
    temp_songs.splice(winningIndex, 1); 

    // **temp songs set, not filtered, bc there may be other songs not chosen yet from similar albums :)
    setSongs(temp_songs); 

    // filter out similar albums to winning song before setting new songs
    let filtered_songs = filterSimilarAlbums(game_songs[0].track.album.id, temp_songs);   
    
    // pick more songs for game
    let new_songs = createGameSongs(filtered_songs);
    game_songs = [...game_songs, ...new_songs];

    // shuffle game songs (because that's more fun)
    const newGameSongs = shuffleSongs(game_songs);

    // set states
    setGameSongs(newGameSongs);
    setWinningSong(songs[winningIndex]);     
    resetState();

    return songs[winningIndex].track.uri;
  }

  const createGameSongs = (filtered_tracks) => {

    // create a new array from filtered tracks to manipulate
    let new_songs = [...filtered_tracks];

    let games_array = [];

    // while new songs array is not 0
    while (new_songs.length !== 0) {
      // we want a max of 3, bc game songs should not go over 4 total
      if (games_array.length === 3) break;     

      // pick a random track from existing song array
      const rndmNum = Math.floor(Math.random() * new_songs.length); 
      const random_track = new_songs[rndmNum];

      // adds to games array and removes from songs array
      games_array.push(random_track);
      new_songs.splice(rndmNum, 1);

      // filter similar albums to the new track
      let filtered_tracks = filterSimilarAlbums(random_track.track.album.id, new_songs);
      new_songs = [...filtered_tracks];
    }

    return games_array;

  }

  const filterSimilarAlbums = (id, songs_array) => {

    const filtered_albums = songs_array.filter(song => id !== song.track.album.id);
    return filtered_albums;
    
  }

  const shuffleSongs = (array) => {
    // Fisher-Yates shuffle: https://bost.ocks.org/mike/shuffle/
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        
    }

    return array;
  }  

  const resetState = () => {
    setPoints(6);
    setTimeLeft(10);
    setGameStart(true);
    setGameInfo('Guess wisely!');
  }

  useEffect(() => {

    if (!gameStart) return;
    let time = timeLeft;
    const countDown = () => {
      time--;
      setTimeLeft(time);
      if (time === 0) {
        setGameInfo('Game over!');
        setGameStart(false);
        return () => clearInterval(interval);
      }
    }

    let interval = setInterval(countDown, 1000);
    return () => clearInterval(interval);
  }, [gameStart]);

  if (!is_active) {
    return (
      <></>
    )
  }

  return (
    <main className="game-wrapper">      
      <h1>{gameInfo}</h1>
      <h2>{timeLeft}</h2> 
      <div className={`choices-wrapper ${gameStart ? '' : 'game-over'}`}>
        {winningSong && gameSongs.map((song, index) => {
          return <Choice 
                    key={index}
                    song={song} 
                    winningSong={winningSong} 
                    setPoints={setPoints} 
                    points={points} 
                    score={score}
                    setScore={setScore}
                    setGameInfo={setGameInfo}
                    setGameStart={setGameStart}
                    gameStart={gameStart}
                    timeLeft={timeLeft}
                  />
          })            
        }   
      </div>             
      <WebPlayback 
          token={accessToken}
          // uri={winningSong?.track.uri}
          winningUri={winningUri}
          createGame={createGame}
          setGameInfo={setGameInfo}
      />
      <GameInfo score={score} points={points} songs={songs} possiblePoints={possiblePoints} /> 
    </main>
  )
}

export default Game
