import Login from "./Login.js"
import Dashboard from './Dashboard';
import Score from './Score';

const code = new URLSearchParams(window.location.search).get("code");

function Homepage() { 

  // ***TODO sharing links with friends
  // 
  // const search = new URLSearchParams(window.location.search);
  
  // if (search.has('score')) {
  //   return (
  //     <div className="app">
  //       <Score />    
  //     </div>
  //   )
  // } else {
  //   const code = new URLSearchParams(window.location.search).get("code");
  //   return (
  //     <div className="app">
  //       {code
  //       ? <Dashboard code={code}/> 
  //       : <Login />}     
  //     </div>     
  //   )
  // }

  return (
    <div className="app">
      {code
      ? <Dashboard code={code}/> 
      : <Login />}     
    </div>
  )

  
}

export default Homepage;