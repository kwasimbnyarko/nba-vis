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
import {Route,BrowserRouter as Router, Routes, useLocation} from "react-router-dom";
import Home from "./pages/home"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import PlusMinusPage from "./pages/PlusMinusPage";
import ShotChartPage from "./pages/ShotChartPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            refetchOnWindowFocus: false,
        },
    },
});


function App() {

  return (
    <QueryClientProvider client={queryClient}>
        <Router>
            <header className="App-header">
            </header>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path="/plus-minus-plot" element={<PlusMinusPage />} />
                <Route path="/shot-chart" element={<ShotChartPage />} />
            </Routes>
        </Router>
    </QueryClientProvider>


  );
}

export default App;
