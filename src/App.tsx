import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  getAllTeams,
  getPlayerOverview,
  getPlayersPerTeam,
  getPlayerSplits,
  getPlayerStatistics
} from "./services/rapidApiNba";

function App() {
  // getAllTeams().then((t)=>{console.log(t)})
  // getPlayersPerTeam(1).then((p)=>console.log(p))
  // getPlayerOverview(3975).then((p)=>console.log(p))
  // getPlayerSplits(3975,"perGame").then((p)=>console.log(p))
  getPlayerStatistics(3975).then((p)=>console.log(p))

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
