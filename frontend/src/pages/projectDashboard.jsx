import NavBar from "../components/NavBar";
import "../styles/projectDashboard.css";
import Query from "../components/Query";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faLock, faPlus, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ConfirmationPopup from "../components/ConfirmationPopup";
import { Link, useNavigate } from "react-router-dom";
import { accessTokenSelector, usernameSelector } from "../state/userSlice";
import { useSelector } from "react-redux";
import ProjectStatus from "../components/ProjectStatus";
import { deployState } from "../components/deployEnums";
import {
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  Tooltip,
} from "@chakra-ui/react";
import { AlertsContext } from "../components/ProjectAlerts";

const query = new Query();

const ALERT_DELETE_SUCCESS = {
  status: "success",
  alertText: "Project deleted from server!",
};

const ALERT_DELETE_ERROR = {
  status: "error",
  alertText: "Error deleting project from server!",
};

const ProjectDashboard = () => {
  const [projects, setProjects] = useState(undefined);
  const [projectImageError, setProjectImageError] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deletePopupId, setDeletePopupId] = useState(null);
  const [deletePopupIndex, setDeletePopupIndex] = useState(null);
  const [deleteErrorText, setDeleteErrorText] = useState(null);

  const { createAlert } = useContext(AlertsContext);

  const username = useSelector(usernameSelector);
  const accessToken = useSelector(accessTokenSelector);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (username && accessToken) {
        try {
          const userProjectsResponse = await query.getUserProjects(
            username,
            accessToken
          );
          const userProjectsPromises =
            userProjectsResponse.data.project_ids.map((id) =>
              query.getProject(id, accessToken)
            );
          const userProjectsResponses = await Promise.all(userProjectsPromises);
          const userProjects = userProjectsResponses.map((resp) => resp.data);

          const teamsResponse = await query.getUserTeams(username, accessToken);
          const teamProjects = teamsResponse.data.flatMap(
            (team) => team.projects
          );
          const teamProjectsPromises = teamProjects.map((project) =>
            query.getProjectByName(project, accessToken)
          );
          const teamProjectsResponses = await Promise.all(teamProjectsPromises);
          const fetchedTeamProjects = teamProjectsResponses.map(
            (resp) => resp.data
          );

          const combinedProjects = [...userProjects, ...fetchedTeamProjects];
          const uniqueProjects = Array.from(
            new Set(combinedProjects.map((p) => p._id))
          ).map((id) => combinedProjects.find((p) => p._id === id));

          setProjects(uniqueProjects);
          setProjectImageError(uniqueProjects.map(() => false));
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchData();
  }, [username, accessToken]);

  const handleConfirmDeleteProject = async () => {
    if (deletePopupId !== null && deletePopupIndex !== null) {
      const result = await query.deleteProject(deletePopupId, accessToken);
      if (result.success === true) {
        let newProjects = [...projects];
        newProjects.splice(deletePopupIndex, 1);
        setProjects(newProjects);
        handleCloseDeletePopup();
        createAlert(ALERT_DELETE_SUCCESS);
      } else {
        setDeleteErrorText(result.message);
        createAlert(ALERT_DELETE_ERROR);
      }
    } else {
      createAlert(ALERT_DELETE_ERROR);
    }
  };

  const handleClickEdit = (_id) => {
    navigate("/project/edit/" + _id);
  };

  const onClickDeleteButton = (_id, index) => {
    setDeletePopupId(_id);
    setDeletePopupIndex(index);
    setIsDeletePopupOpen(true);
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeletePopupIndex(null);
    setDeletePopupId(null);
    setDeleteErrorText(null);
  };

  const oneTwoThree = [1, 2, 3];

  return (
    <>
      <div className="background-image">
        <NavBar />

        <h1 className="red-brick-gradient-text title">Projects</h1>
        <div className="projects-container">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignSelf: "flex-start",
            }}
          >
            <div style={{ width: "300px" }}>
              {projects ? (
                <Link to={"/project/new"} style={{ textDecoration: "none" }}>
                  <h2 className="create-project-link">
                    <FontAwesomeIcon icon={faPlus} /> Add Project
                  </h2>
                </Link>
              ) : (
                <Flex justify="center">
                  <Skeleton height="10px" width="80px" />
                </Flex>
              )}
            </div>
          </div>

          {projects
            ? projects.map((project, i) => (
                <div
                  className="dashboard-project"
                  key={project._id + "project"}
                >
                  <div>
                    <div className="dashboard-image-container">
                      {projectImageError[i] ? (
                        <div className="dashboard-image-error" />
                      ) : (
                        <img
                          width="100%"
                          src={project.image}
                          alt={project.name}
                          className="dashboard-image"
                          onError={() => {
                            setProjectImageError((prev) => {
                              const newArr = [...prev];
                              newArr[i] = true;
                              return newArr;
                            });
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="dashboard-text-container">
                      <div className="dashboard-project-title-and-icon">
                        <h3>
                          <a
                            href={project.url || "#"}
                            style={{ textDecoration: "none", color: "black" }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {project.name}
                          </a>
                        </h3>
                        <Tooltip
                          label={
                            project.public
                              ? "Project is publicly hosted to internet"
                              : "Project is private"
                          }
                        >
                          <FontAwesomeIcon
                            icon={project.public ? faUnlock : faLock}
                            color={project.public ? "#456fb7" : "firebrick"}
                          />
                        </Tooltip>
                        <ProjectStatus
                          project={project}
                          status={deployState.NOT_CLONED}
                        />
                      </div>
                      <Tooltip
                        label={project.description}
                        bg="white"
                        color="black"
                      >
                        <p className="dashboard-project-desc">
                          {project.description}
                        </p>
                      </Tooltip>
                      <div className="dashboard-project-buttons">
                        <Button
                          variant="customDefault"
                          onClick={() => {
                            handleClickEdit(project._id);
                          }}
                          rightIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="customDefault"
                          onClick={() => {
                            onClickDeleteButton(project._id, i);
                          }}
                        >
                          Delete <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : oneTwoThree.map((i) => (
                <div className="dashboard-project" key={"skeleton" + i}>
                  <Skeleton height="180px" width="300px" />
                  <div>
                    <div className="dashboard-text-container">
                      <div className="dashboard-project-title-and-icon">
                        <SkeletonText width="200px" noOfLines={4} spacing="4" />
                      </div>
                      <div className="dashboard-project-buttons">
                        <Skeleton height="40px" width="100px" />
                        <Skeleton height="40px" width="100px" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <ConfirmationPopup
          open={isDeletePopupOpen}
          setClose={handleCloseDeletePopup}
          headerText="Delete Project?"
          bodyText="Are you sure you want to delete this project?"
          errorText={deleteErrorText}
          cancelButtonText="Delete"
          onConfirm={handleConfirmDeleteProject}
        />
      </div>
    </>
  );
};

export default ProjectDashboard;
