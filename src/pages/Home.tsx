import React from "react";
import { Link } from "react-router-dom";
import {APP_ROUTES} from "../App";
import "../styles/Home.css"

function Home(){

    return (
        <div
            className="home_page"
        >
            <div
            style={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"space-around"
            }}
            >
                <h1 style={{fontSize:"3rem"}}>Who is the real MVP?</h1>
                <h1>Dive into NBA data.</h1>
                <h1>Compare players.</h1>
                <h1>Discover insights.</h1>
            </div>
            <div
                className="button_area"
            >
                {Object.entries(APP_ROUTES)
                    .map(([key,route]) => (
                        <Link key={key} to={route.path}
                              className="home_button"
                        >
                            {route.name}
                        </Link>
                    ) )
                }

            </div>
        </div>
    );
}

export default Home;