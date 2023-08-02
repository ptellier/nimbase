import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Query from "../components/Query";
import NavBar from "../components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import {createTeam, fetchUserTeams} from "../state/userSlice";

const Teams = () => {
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [owner, setOwner] = useState("");
    // const [showTeams, setShowTeams] = useState(false);

    const dispatch = useDispatch();

    // const accessToken = useSelector(state => state.user.accessToken);
    // const teams = useSelector(state => state.user.teams)
    // const username = useSelector(state => state.user.username);
    //
    // const handleViewTeams = () => {
    //     dispatch(fetchUserTeams({username, accessToken}));
    //     setShowTeams(true);
    // }
    //
    const handleSubmit = (e) => {
        e.preventDefault();
        //
        // dispatch(createTeam({
        //     teamName,
        //     description,
        //     owner,
        //     accessToken
        // }));

        setTeamName("");
        setDescription("");
        setOwner("");
    }

    return (
        <div className="background-image">
            <NavBar />
            <div className="login-container">
                <div className="login-box">
                    <h2>Teams</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <input type="text" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
                        <button type="submit">Add Team</button>
                    </form>
                    {/*<button onClick={handleViewTeams}>View Teams</button>*/}
                    {/*{showTeams && <h3> Your teams</h3>}*/}
                    {/*{showTeams && teams && teams.map((team, index) => (*/}
                    {/*    <div key={index}>*/}
                    {/*        <h4>{team.name}</h4>*/}
                    {/*        <p>{team.description}</p>*/}
                    {/*        <p>{team.owner}</p>*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </div>
            </div>
        </div>
    )
}

export default Teams;