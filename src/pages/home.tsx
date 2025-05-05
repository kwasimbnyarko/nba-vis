import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import { getAllTeams, getPlayersPerTeam} from "../services/rapidApiNba";
import ToggleBar from "../components/ToggleBar";
import Typography from "@mui/material/Typography";
import FilterableTextField from "../components/SelectTextField";
import {GAME_SITUATIONS,QUARTERS,STAT_CATEGORIES} from "../utils/constants";
import StyleComp from "../components/StyleComp";
import {getAllPlayers, myGetAllTeams} from "../services/myServerCalls";


function Home(){

    const [teamId, setTeamId] = useState<any>(null)

    //The negative implies "Comparing Players"
    const [comparingTeams, setComparingTeams] = useState<boolean>(false)

    const [players, setPlayers] = useState<any[]>([])

    const [gameSituation, setGameSituation] = useState<string>("")
    const [quarter, setQuarter] = useState<string>("")
    const [statCategory, setStatCategory] = useState<string>("")

    // myGetAllTeams().then(r=> console.log(r))

    const handleToggleChange = (value: any,variableName:string) => {
        console.log('New selected value:', value);
        switch(variableName){
            case "gameSituation":
                setGameSituation(value)
                break;
            case "quarter":
                setQuarter(value)
                break;
            case "statCategory":
                setStatCategory(value)
                break;
            case "team1":
                setTeamId(value)
                break;
            case "addNewPlayer":
                console.log("add player "+value)
                setPlayers([...players,value])
                break
            case "playerOrTeam":
                setComparingTeams(value.toLowerCase().includes("team"))
                break
            default:
                console.error("No variable selected")
                break;
        }
    };


    const { data: allTeams , isLoading: isLoadingTeams } = useQuery({
        queryKey: ["allTeams"],
        queryFn: () => myGetAllTeams(),
    });

    const {data: allPlayers, isLoading: isPlayersLoading} = useQuery({
        queryKey: ["allPlayers"],
        queryFn: () => getAllPlayers(),
        enabled: !!teamId
    })

    return (
    <div>
        <div className="play-style-section" style={{padding:"5rem"}}>
            <Typography variant="h3">Play Style</Typography>

            <div className="player-team-selection-area"
                 style={{display:"flex", justifyContent:"space-around"}}>
                <div>
                    {
                        comparingTeams ?
                            <FilterableTextField fieldName="Search and add teams" list={allTeams}
                                                 onChange={handleToggleChange}
                                                 variableName="team1"
                                                 disable={isLoadingTeams}/>
                            :
                            <FilterableTextField fieldName="Search and add players" list={allPlayers}
                                                 onChange={handleToggleChange}
                                                 variableName="addNewPlayer"
                                                 disable={isPlayersLoading
                                                     || teamId === null}/>
                    }




                </div>

            </div>


            <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center"}}>
                <ToggleBar isVertical={false} values={["Compare Players","Compare Teams"]}
                           onChange={handleToggleChange}
                           variableName="playerOrTeam"/>
                <br/>
                <ToggleBar isVertical={false} values={GAME_SITUATIONS}
                           onChange={handleToggleChange}
                           variableName="gameSituation"/>
                <br/>
                {(gameSituation === "Quarters") &&
                    <ToggleBar isVertical={false} values={QUARTERS}
                               onChange={handleToggleChange}
                               variableName="quarter"/>}
            </div>

            <br/>


            <div style={{
                display:"flex", alignItems:"center",
                justifyContent:"space-evenly"}}>
                <ToggleBar isVertical={true} values={STAT_CATEGORIES}
                           onChange={handleToggleChange}
                           variableName="statCategory"/>
                { (players.length) &&
                    <StyleComp players={players} gameSituation={gameSituation}
                                quarter={quarter} statCategory={statCategory}
                                dimensions={500}/>}
            </div>
        </div>

    </div>
    );
}

export default Home;