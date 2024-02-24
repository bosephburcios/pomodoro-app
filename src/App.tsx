import React from 'react';
import Timer from './Timer';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <div className="main-container center">
        <div className="circle-container center">
          <Timer/>
        </div>        
      </div>
    </div>
  );
}

export default App;
