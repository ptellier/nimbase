import React, { useState } from "react";
import { Link } from "react-router-dom";
import Query from "../components/Query";
import NavBar from "../components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import { createTeam } from "../state/userSlice";

const Teams = () => {
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [owner, setOwner] = useState("");

    const dispatch = useDispatch(); // get the dispatch function

    const accessToken = useSelector(state => state.user.accessToken); // access the token from the store

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(createTeam({
            teamName,
            description,
            owner,
            accessToken
        }));

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
                </div>
            </div>
        </div>
    )
}

export default Teams;