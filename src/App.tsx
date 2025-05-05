import React from 'react';
import './App.css';
import {Route,BrowserRouter as Router, Routes, useLocation} from "react-router-dom";
import Home from "./pages/home"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

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
            </Routes>
        </Router>
    </QueryClientProvider>


  );
}

export default App;
