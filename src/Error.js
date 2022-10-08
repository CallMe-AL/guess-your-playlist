import React from 'react';

const Error = ({ error }) => {

  const server = process.env.REACT_APP_SERVER;

  return (
    <>
      <div>{`Response status ${error}: try logging in again.`}</div>
      <a className='login-btn' href={server + 'login-spotify'}>
        Login with Spotify
      </a>
    </>
  )
}

export default Error