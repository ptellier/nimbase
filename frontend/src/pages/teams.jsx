import React, {useState} from "react";
import NavBar from "../components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import {
    accessTokenSelector,
    addTeamMember,
    createTeam,
    fetchUserTeams, removeTeamMember,
    teamsSelector,
    usernameSelector
} from "../state/userSlice";
import "../styles/teams.css";

const Teams = () => {
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [owner, setOwner] = useState("");
    const [showTeams, setShowTeams] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showTeamEditModal, setShowTeamEditModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [showRemoveMemberForm, setShowRemoveMemberForm] = useState(false);

    const [newMemberUsername, setNewMemberUsername] = useState("");
    const [newMemberTeamName, setNewMemberTeamName] = useState("");

    const [removedMemberUsername, setRemovedMemberUsername] = useState("");
    const [removedMemberTeamName, setRemovedMemberTeamName] = useState("");

    const dispatch = useDispatch();

    const accessToken = useSelector(accessTokenSelector);
    const teams = useSelector(teamsSelector);
    const username = useSelector(usernameSelector);

    const handleAddMemberButton = () => {
        setShowAddMemberForm(true);
    };

    const handleAddMemberInForm = (e) => {
        e.preventDefault();

        // Update the selected team's members with the new member
        // const updatedTeam = {
        //     ...selectedTeam,
        //     members: [...selectedTeam.members, newMemberUsername]
        // };

        console.log('newMemberTeamName', newMemberTeamName);
        console.log('newMemberUsername', newMemberUsername);

        dispatch(addTeamMember({newMemberTeamName, newMemberUsername, accessToken}));

        // Clear the form and hide it
        setNewMemberUsername("");
        setNewMemberTeamName("");
        setShowAddMemberForm(false);
    };

    const handleRemoveMemberInForm = (e) => {
        e.preventDefault();

        // Update the selected team's members with the new member
        // const updatedTeam = {
        //     ...selectedTeam,
        //     members: [...selectedTeam.members, newMemberUsername]
        // };

        dispatch(removeTeamMember({removedMemberTeamName, removedMemberUsername, accessToken}));

        // Clear the form and hide it
        setRemovedMemberUsername("");
        setRemovedMemberTeamName("");
        setShowRemoveMemberForm(false);
    };


    const handleRemoveMember = () => {
        setShowRemoveMemberForm(true);
    };

    const handleViewTeams = () => {
        setShowTeams(!showTeams);
        console.log('before teams in teams.jsx', teams)
        dispatch(fetchUserTeams({username, accessToken}));
        console.log('after teams in teams.jsx', teams)
    }

    const handleEditTeamClick = async (team) => {
        setSelectedTeam(team);
        setShowTeamEditModal(true);
        setShowAddMemberForm(false);
        setShowRemoveMemberForm(false);
    };

    const closeTeamEditModal = () => {
        setSelectedTeam(null);
        setShowTeamEditModal(false);
    };
    const handleCreateTeamClick = () => {
        setShowModal(true);
    };

    const handleCloseAddTeamModalClick = () => {
        setShowModal(false);
    }

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
      //  setShowModal(false);
    }

    return (
        <div className="background-image">
            <NavBar />
            <div className="teams-container">
                <div className="teams-box">
                    <h2>Teams</h2>
                    <button className="create-team-button" onClick={handleCreateTeamClick}>
                        Create Team
                    </button>
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <form onSubmit={handleSubmit}>
                                    <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    <input type="text" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
                                    <button type="submit">Add Team</button>
                                    <button className="close-add-team-modal" onClick={handleCloseAddTeamModalClick}>
                                        Close
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    <button className="view-teams-button" onClick={handleViewTeams}>View Teams</button>
                    {showTeams && <h3 className="your-teams-header">Your Teams</h3>}
                    {showTeams && (
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Owner</th>
                                <th>Members</th>
                                <th>Projects</th>
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
                                    <td><button className="edit-button" onClick={() => handleEditTeamClick(team)}>Edit</button></td>
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
                        <h3 className="blue-bold-heading">{selectedTeam.teamName}</h3>
                        <h4>Team Members:</h4>
                        <ul>
                            {teams.map((team, index) => (
                                <li key={index}>{team.members}</li>
                            ))}
                        </ul>
                        <button className="add-member-button" onClick={handleAddMemberButton}>Add Member</button>
                        {showAddMemberForm && (
                            <form onSubmit={handleAddMemberInForm}>
                                <input type="text" placeholder="Team Name" value={newMemberTeamName} onChange={(e) => setNewMemberTeamName(e.target.value)} />
                                <input type="text" placeholder="username" value={newMemberUsername} onChange={(e) => setNewMemberUsername(e.target.value)}/>
                                <button type="submit">Add</button>
                            </form>
                        )}
                        <button className="remove-member-button" onClick={handleRemoveMember}>Remove Member</button>
                        {showRemoveMemberForm && (
                            <form onSubmit={handleRemoveMemberInForm}>
                                <input type="text" placeholder="Team Name" value={removedMemberTeamName} onChange={(e) => setRemovedMemberTeamName(e.target.value)} />
                                <input type="text" placeholder="username" value={removedMemberUsername} onChange={(e) => setRemovedMemberUsername(e.target.value)}/>
                                <button type="submit">Remove</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


export default Teams;