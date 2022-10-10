import { useState, useEffect } from "react";

export default function useAuth(code) {
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => { 

    const server = process.env.REACT_APP_SERVER;  
    const address = `${server ? server : ''}/api/callback${window.location.search}`; 
    
    fetch(address)
    .then(res => {
      if (!res.ok) {
        setAccessToken(null);
        setError({ success: false, error: `Response status ${res.status}: try logging in again.`});
        return; 
      }
      return res.json();
    })
    .then(data => {
      // ***TODO figure out a better way to do this
      // cannot fetch because there's no code/state to send
      // playlists still load in dashboard anyway because access token is stored in the spotify-web-api-js package if already ran previously
      if (!data) {
        setError({ success: false, error: 'Reloading playlists...' });
        return;
      }

      setAccessToken({ success: true, accessToken: data.accessToken});
      setRefreshToken(data.refreshToken);
      setExpiresIn(data.expiresIn);
      window.history.pushState({}, null, "/");
    })
    .catch((err) => {
      console.log('error: ', err);
    });
    
  }, [code]);

  useEffect(() => {

    const callRefresh = async () => {
      try {
        const server = process.env.REACT_APP_SERVER;
        const query = `/?refresh_token=${refreshToken}`;
        const address = `${server ? server : ''}/api/refresh_token${query}`;
        const res = await fetch(address);
        const json = await res.json();
        
        setAccessToken(json.access_token);
        setExpiresIn(json.expires_in);
        
      } catch(err) {
        console.log(err);
        // window.location = "/";
      }
    }
    
    if (!refreshToken || !expiresIn) {
      return;
    } else {
      let interval = setInterval(callRefresh, (expiresIn - 60) * 1000);
      callRefresh();
  
      return () => clearInterval(interval);
    }
  }, [refreshToken, expiresIn]);
  
  if (accessToken !== null) {
    return accessToken;
  } else {
    return error;
  }
  
}