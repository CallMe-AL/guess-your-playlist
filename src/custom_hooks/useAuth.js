import { useState, useEffect } from "react";

export default function useAuth(code) {
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  // const server = "https://guess-your-playlist-server.onrender.com";
  // const server = '';

  useEffect(() => {    
    
    fetch("/api/callback" + window.location.search, {
      credentials: "include"
    })
    .then(res => {
      if (!res.ok) {
        setAccessToken(null);
        setError({ success: false, res: res.status});
        return; 
      }
      console.log('res: ', res);
      return res.json()
    })
    .then(data => {
      console.log('data: ', data)
      setAccessToken({ success: true, accessToken: data.accessToken});
      setRefreshToken(data.refreshToken);
      setExpiresIn(data.expiresIn);
      window.history.pushState({}, null, "/")
    })
    .catch((err) => {
      console.log('error: ', err);
      return setError({ success: false, res: err });
    });
  }, [code]);

  useEffect(() => {

    const callRefresh = async () => {
      try {
        const query = `/?refresh_token=${refreshToken}`;
        const res = await fetch("/api/refresh_token" + query)
        const json = await res.json()
        
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