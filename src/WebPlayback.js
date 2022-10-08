import React, { useState, useEffect } from 'react';
import SpotifyWebApi from "spotify-web-api-js";
import { Link } from 'react-router-dom';


const WebPlayback = ({
  createGame,
  setGameInfo,
  token,
  winningUri
}) => {

  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(true);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(null);
  const [devId, setDevId] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  // const [winningUri, setWinningUri] = useState(winningUri);

  const spotify = new SpotifyWebApi();

  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token) },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        
        const id = device_id;
        setDevId(id);
        setPlayerReady(true);
        setGameInfo('Hit start game to play!');
      });      

      player.addListener('initialization_error', ({ message }) => { 
        console.error(message);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('autoplay_failed', () => {
        alert('Autoplay is not allowed by the browser autoplay rules');
      });

      player.addListener('player_state_changed', ( state => {

        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then( state => { 
            (!state) ? setActive(false) : setActive(true) 
        });

      }));

      player.connect();

    };

  }, []);

  const newGame = () => {
    if (!playerReady) {
      setGameInfo('Loading media player...');
      return;
    };

    let winning_uri = createGame();

    spotify.play({ device_id: devId, uris: [winning_uri], position_ms: 60000 }, function(err) {
      if (err) {
        console.log(err);
      }
    });

    window.onpopstate = () => {
      player.disconnect();
    }

  }

  return (
    <div className="player-container">
      <Link className="dashboard-return" to="/" onClick={() => { player.disconnect() }}><i className="fas fa-chevron-left"></i>Return home</Link>
      {
        playerReady
        ? <div className='inner-player-wrap'>
            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
              { is_paused ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i> }
            </button>
            <button className="game-btn" onClick={newGame}>New game</button>
          </div>
        : <p>Loading media player...</p>
      }
    </div>
  )
}

export default WebPlayback
