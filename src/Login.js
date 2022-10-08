const Login = () => {

  const server = process.env.REACT_APP_SERVER;

  return (
    <div className="main-wrapper">
        <h1>Welcome to Know Your Spotify!</h1>
        <p>A game that tests your knowledge of your music library. A random song from one of your playlists will play -- guess what album it belongs to to win!</p>     
        <h2>Login to your Spotify account to play</h2>   
        <a 
          className="login-btn"
          href={server + 'login-spotify'}
        >Login with Spotify</a>
        <p className="premium-warning">**Note: a Spotify Premium account is required to play</p>
      </div>
  )
}

export default Login
