import './styles/main.scss';
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Game from './Game';
import Homepage from './Homepage';
// import Score from './Score';
import { AuthProvider } from './custom_hooks/useAuthContext';

function App() {  

  const [is_active, setIsActive] = useState(false);

  return (
    <HashRouter>   
      <React.StrictMode> 
        <AuthProvider value={{ is_active, setIsActive }}>
          <Routes>            
            <Route path="/" element={<Homepage />} />
            <Route path="game" element={<Game />} />            
            {/* <Route path="myscore" element={<Score />} /> */}
            <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>        
        </AuthProvider>       
      </React.StrictMode>
    </HashRouter>   
  );
}

export default App;
