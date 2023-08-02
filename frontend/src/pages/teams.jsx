import React, {useState} from "react";
import NavBar from "../components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import {accessTokenSelector, createTeam, fetchUserTeams, teamsSelector, usernameSelector} from "../state/userSlice";


/*
3. be able to add members to the team
4. be able to view the members of the team
 */

const Teams = () => {
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [owner, setOwner] = useState("");
    const [showTeams, setShowTeams] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showTeamEditModal, setShowTeamEditModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);


    const dispatch = useDispatch();

    const accessToken = useSelector(accessTokenSelector);
    const teams = useSelector(teamsSelector);
    const username = useSelector(usernameSelector);

    const handleAddMember = () => {
        alert('Add member functionality goes here.');
    };
    const handleRemoveMember = () => {
        alert('Add member functionality goes here.');
    };

    const handleViewTeams = () => {
        setShowTeams(true);
        console.log('before teams in teams.jsx', teams)
        dispatch(fetchUserTeams({username, accessToken}));
    }

    const handleEditTeamClick = (team) => {
        setSelectedTeam(team);
        setShowTeamEditModal(true);
    };

    const closeTeamEditModal = () => {
        setSelectedTeam(null);
        setShowTeamEditModal(false);
    };
    const handleCreateTeamClick = () => {
        setShowModal(!showModal);
    };

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
        setShowModal(false);
    }

    return (
        <div className="background-image">
            <NavBar />
            <div className="login-container">
                <div className="login-box">
                    <h2>Teams</h2>
                    <button onClick={handleCreateTeamClick}>Create Team</button>
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <form onSubmit={handleSubmit}>
                                    <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    <input type="text" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
                                    <button type="submit">Add Team</button>
                                </form>
                            </div>
                        </div>
                    )}
                    <button onClick={handleViewTeams}>View Teams</button>
                    {showTeams && <h3>Your teams</h3>}
                    {showTeams && (
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Owner</th>
                                <th>Members</th>
                                <th>Projects</th>
                                <th>Edit</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teams && teams.map((team, index) => (
                                <tr key={index}>
                                    <td>{team.teamName}</td>
                                    <td>{team.description}</td>
                                    <td>{team.owner}</td>
                                    <td>{team.members.join(', ')}</td>
                                    <td>{team.projects.join(', ')}</td>
                                    <td><button onClick={() => handleEditTeamClick(team)}>Edit</button></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showTeamEditModal && selectedTeam && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeTeamEditModal}>&times;</span>
                        <h3>{selectedTeam.teamName}</h3>
                        <button onClick={() => handleAddMember()}>Add Member</button>
                        <button onClick={() => handleRemoveMember()}>Remove Member</button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Teams;