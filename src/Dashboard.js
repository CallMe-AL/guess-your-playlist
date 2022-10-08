import useAuth from "./custom_hooks/useAuth";
import SpotifyWebApi from "spotify-web-api-js";
import { useEffect, useState } from "react";
import ListItem from "./ListItem";
import Rules from './Rules';
import Error from './Error';
import { useAuthContext } from "./custom_hooks/useAuthContext";

const spotify = new SpotifyWebApi();

const Dashboard = (props) => {

  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [appearance, setAppearance] = useState('rules hide');

  const accessToken = useAuth(props.code);
  const { setIsActive } = useAuthContext();

  useEffect(() => {
    if(!accessToken) return;
    if (accessToken.success) {
      spotify.setAccessToken(accessToken.accessToken);
      setIsActive(true);
    } else {
      setError(accessToken.res);
    }
    
  }, [accessToken]);
  
  useEffect(() => {    
    spotify.getUserPlaylists()
      .then((data) => {
        console.log('user playlists', data);
        setPlaylists(data.items);
      }, 
      function(err) {
        console.error(err);
      })
  }, [accessToken]);

  return (
    <>         
      <main className="dashboard-wrap">
        <Rules appearance={appearance} setAppearance={setAppearance}/> 
        <h1>Choose your playlist to get started!</h1>
        
        <div className="playlist-container">
          {
            playlists.length > 0 
              ? playlists.map(list => {
                  return (
                    <ListItem 
                      imgUrl={list.images[0].url}
                      accessToken={accessToken}
                      name={list.name}
                      uri={list.uri}
                      key={list.id}
                      id={list.id}
                      href={list.href} /> 
                    )
                  })
            
              : <div className="ui-msg">{ error ? <Error error={error} /> : 'Loading playlists...'}</div>
          }        
        </div>
        <button className="rules-btn" onClick={() => setAppearance('rules show')}>
            <h2>Rules</h2>
            <i className="fas fa-bars"></i>
        </button>
      </main>    
    </>
  )
}

export default Dashboard
