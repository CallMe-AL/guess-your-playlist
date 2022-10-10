import React from 'react';

const Error = ({ error }) => {

  const server = process.env.REACT_APP_SERVER;

  return (
    <>
      <div>{error}</div>
      <a className='login-btn' href={server + 'login-spotify'}>
        Login with Spotify
      </a>
    </>
  )
}

export default Error