import React from 'react';
import './App.css';
import {Route,BrowserRouter as Router, Routes} from "react-router-dom";
import RadarPage from "./pages/RadarPage"
import Home from "./pages/Home"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import PlayerPlusMinusPage from "./pages/PlayerPlusMinusPage";
import ShotChartPage from "./pages/ShotChartPage";
import LeaguePlusMinusPage from "./pages/LeaguePlusMinusPage";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            refetchOnWindowFocus: false,
        },
    },
});

export const APP_ROUTES = {
    style: {
        path: "/style",
        name: "Player & Team Styles"
    },
    player_plus_minus: {
        path: "/player-plus-minus",
        name: "Player Impact On Team"
    },
    shot_chart: {
        path: "/shot_chart",
        name: "Player Shot Chart"
    },
    league_plus_minus: {
        path: "/league_plus-minus",
        name: "League Plus-Minus"
    }
};


function App() {
    return (
    <QueryClientProvider client={queryClient}>
        <Router>
            <header className="App-header"
            style={{
                padding:"0 2rem",
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between"
            }}>
                <h1>NBA Data Visualizer</h1>
                <a href="https://github.com/kwasimbnyarko/nba-vis/tree/master"
                >
                    Github
                </a>
            </header>
            <h2>
            </h2>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path={APP_ROUTES.style.path} element={<RadarPage/>}/>
                <Route path={APP_ROUTES.player_plus_minus.path} element={<PlayerPlusMinusPage />} />
                <Route path={APP_ROUTES.shot_chart.path} element={<ShotChartPage />} />
                <Route path={APP_ROUTES.league_plus_minus.path} element={<LeaguePlusMinusPage />} />
            </Routes>
        </Router>
    </QueryClientProvider>


  );
}

export default App;
