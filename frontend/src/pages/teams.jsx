import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import {
  accessTokenSelector,
  addTeamProject,
  removeTeamProject,
  addTeamMember,
  removeTeamMember,
  createTeam,
  deleteTeam,
  fetchUserTeams,
  teamsSelector,
  usernameSelector,
} from "../state/userSlice";
import "../styles/teams.css";
import "../styles/layout.css";
import { Button, Flex, Heading, HStack, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const Teams = () => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [showTeams, setShowTeams] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTeamEditModal, setShowTeamEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showRemoveMemberForm, setShowRemoveMemberForm] = useState(false);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showRemoveProjectForm, setShowRemoveProjectForm] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [removedMemberUsername, setRemovedMemberUsername] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [removedProjectName, setRemovedProjectName] = useState("");

  const dispatch = useDispatch();

  const accessToken = useSelector(accessTokenSelector);
  const teams = useSelector(teamsSelector);
  const username = useSelector(usernameSelector);

  const handleDeleteTeamButton = async (team) => {
    await dispatch(
      deleteTeam({
        teamName: selectedTeam.teamName,
        accessToken: accessToken,
        userName: username,
      })
    );
    setShowTeamEditModal(false);
    setShowTeams(false);
    dispatch(fetchUserTeams({ username: username, accessToken: accessToken }));
  };

  const handleAddMemberButton = () => {
    setShowAddMemberForm(true);
  };

  const handleRemoveMember = () => {
    setShowRemoveMemberForm(true);
  };

  const handleAddProjectButton = () => {
    setShowAddProjectForm(true);
  };

  const handleRemoveProjectButton = () => {
    setShowRemoveProjectForm(true);
  };

  const handleAddMemberInForm = (e) => {
    e.preventDefault();

    dispatch(
      addTeamMember({
        teamName: selectedTeam.teamName,
        username: newMemberUsername,
        accessToken: accessToken,
      })
    );

    setNewMemberUsername("");
  };

  const handleRemoveMemberInForm = (e) => {
    e.preventDefault();

    dispatch(
      removeTeamMember({
        teamName: selectedTeam.teamName,
        username: removedMemberUsername,
        accessToken: accessToken,
      })
    );

    setRemovedMemberUsername("");
  };

  const handleAddProjectInForm = (e) => {
    e.preventDefault();

    dispatch(
      addTeamProject({
        teamName: selectedTeam.teamName,
        projectName: newProjectName,
        accessToken: accessToken,
        userName: username,
      })
    );

    setNewProjectName("");
  };

  const handleRemoveProjectInForm = (e) => {
    e.preventDefault();
    if (username === selectedTeam.owner) {
      dispatch(
        removeTeamProject({
          teamName: selectedTeam.teamName,
          projectName: removedProjectName,
          accessToken: accessToken,
          userName: username,
        })
      );
    } else {
      alert(
        "You are not the owner of this team. Only the owner can remove projects from the team."
      );
    }
    setRemovedProjectName("");
  };

  const handleViewTeams = () => {
    setShowTeams(!showTeams);
    dispatch(fetchUserTeams({ username, accessToken }));
  };

  const handleEditTeamClick = async (team) => {
    setSelectedTeam(team);
    setShowTeamEditModal(true);
    setShowAddMemberForm(false);
    setShowRemoveMemberForm(false);
  };

  const closeTeamEditModal = () => {
    setSelectedTeam(null);
    setShowTeamEditModal(false);
    setShowTeams(false);
  };
  const handleCreateTeamClick = () => {
    setShowModal(true);
  };

  const handleCloseAddTeamModalClick = () => {
    setShowModal(false);
  };

  const handleCloseAddMemberModalClick = () => {
    setShowAddMemberForm(false);
  };

  const handleCloseRemoveMemberModalClick = () => {
    setShowRemoveMemberForm(false);
  };

  const handleCloseAddProjectModalClick = () => {
    setShowAddProjectForm(false);
  };

  const handleCloseRemoveProjectModalClick = () => {
    setShowRemoveProjectForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      createTeam({
        teamName,
        description,
        owner: username,
        accessToken,
      })
    );
    dispatch(fetchUserTeams({ username, accessToken }));
    setTeamName("");
    setDescription("");
    setShowTeams(false);
    setShowModal(false);
  };

  return (
    <div className={"background-image"}>
      <NavBar />
      <Heading
        as="h1"
        fontWeight={500}
        fontSize="48px"
        align={"center"}
        className="red-brick-gradient-text inika-font"
      >
        Teams
      </Heading>
      <div className={"teams-container"}>
        <div className={"teams-box"}>
          <HStack spacing={5}>
            <Button onClick={handleCreateTeamClick}>Create Team</Button>
            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <input
                        type="text"
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <HStack spacing={5} justify="center">
                        <Button type="submit">Add Team</Button>
                        <Button onClick={handleCloseAddTeamModalClick}>
                          Close
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                </div>
              </div>
            )}
            <Button onClick={handleViewTeams}>
              {" "}
              <FontAwesomeIcon icon={faArrowsRotate} />{" "}
            </Button>
          </HStack>
          <Heading
            as="h2"
            fontWeight={500}
            fontSize="28px"
            className="your-teams-header inika-font"
          >
            Your Teams
          </Heading>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Members</th>
                  <th>Projects</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teams &&
                  teams.map((team, index) => (
                    <tr key={index}>
                      <td>{team.teamName}</td>
                      <td>{team.description}</td>
                      <td>{team.owner}</td>
                      <td>{team.members.join(", ")}</td>
                      <td>{team.projects.join(", ")}</td>
                      <td>
                        <Button
                          className="edit-button"
                          onClick={() => handleEditTeamClick(team)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showTeamEditModal && selectedTeam && (
        <div className="modal">
          <VStack className="modal-content" spacing={4} align="left">
            <Flex justifyContent="space-between">
              <span></span>
              <Heading
                as="h3"
                fontWeight={500}
                fontSize={"36px"}
                align="center"
              >
                {selectedTeam.teamName}
              </Heading>
              <button
                className="close"
                onClick={closeTeamEditModal}
                style={{ height: "20px" }}
              >
                &times;
              </button>
            </Flex>

            <HStack
              spacing={4}
              justify="center"
              align="flex-start"
              flexWrap="wrap"
            >
              <VStack spacing={2} className="light-grey-box">
                <Heading
                  as="h4"
                  fontWeight={500}
                  fontSize={"20px"}
                  align="left"
                >
                  Team Members:
                </Heading>
                <p>{selectedTeam.members.join(", ")}</p>
                <Button onClick={handleAddMemberButton}>Add Member</Button>
                {showAddMemberForm && (
                  <form onSubmit={handleAddMemberInForm}>
                    <VStack spacing={2} className="med-grey-box">
                      <input
                        type="text"
                        placeholder="username"
                        value={newMemberUsername}
                        onChange={(e) => setNewMemberUsername(e.target.value)}
                      />
                      <HStack spacing={4} justify="center">
                        <Button type="submit">Add</Button>
                        <Button onClick={handleCloseAddMemberModalClick}>
                          Close
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                )}
                <Button onClick={handleRemoveMember}>Remove Member</Button>
                {showRemoveMemberForm && (
                  <form onSubmit={handleRemoveMemberInForm}>
                    <VStack spacing={2} className="med-grey-box">
                      <input
                        type="text"
                        placeholder="username"
                        value={removedMemberUsername}
                        onChange={(e) =>
                          setRemovedMemberUsername(e.target.value)
                        }
                      />
                      <HStack spacing={4} justify="center">
                        <Button type="submit">Remove</Button>
                        <Button onClick={handleCloseRemoveMemberModalClick}>
                          Close
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                )}
              </VStack>

              <VStack spacing={2} className="light-grey-box">
                <Heading
                  as="h4"
                  fontWeight={500}
                  fontSize={"20px"}
                  align="left"
                >
                  Team Projects:
                </Heading>
                <ul className="team-members-list">
                  {selectedTeam.projects.map((project, index) => (
                    <li key={index}> {project}</li>
                  ))}
                </ul>
                <Button onClick={handleAddProjectButton}>Add Project</Button>
                {showAddProjectForm && (
                  <form onSubmit={handleAddProjectInForm}>
                    <VStack spacing={2} className="med-grey-box">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                      />
                      <HStack spacing={4} justify="center">
                        <Button type="submit">Add</Button>
                        <Button onClick={handleCloseAddProjectModalClick}>
                          Close
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                )}
                <Button onClick={handleRemoveProjectButton}>
                  Remove Project
                </Button>
                {showRemoveProjectForm && (
                  <form onSubmit={handleRemoveProjectInForm}>
                    <VStack spacing={2} className="med-grey-box">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={removedProjectName}
                        onChange={(e) => setRemovedProjectName(e.target.value)}
                      />
                      <HStack spacing={4} justify="center">
                        <Button type="submit">Remove</Button>
                        <Button onClick={handleCloseRemoveProjectModalClick}>
                          Close
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                )}
              </VStack>
            </HStack>
            <Flex justify={"center"}>
              <Button onClick={handleDeleteTeamButton} whiteSpace="pre">
                Delete Team <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </Flex>
          </VStack>
        </div>
      )}
    </div>
  );
};

export default Teams;
