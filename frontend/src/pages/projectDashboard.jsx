import NavBar from "../components/NavBar";
import '../styles/projectDashboard.css';
import Query from "../components/Query";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";
import ConfirmationPopup from "../components/ConfirmationPopup";
import {Link, useNavigate} from "react-router-dom";
import {accessTokenSelector, usernameSelector} from "../state/userSlice";
import {useSelector} from "react-redux";

const query = new Query();

const ProjectDashboard = () => {

  const [projects, setProjects] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deletePopupId, setDeletePopupId] = useState(null);
  const [deletePopupIndex, setDeletePopupIndex] = useState(null);
  const [deleteErrorText, setDeleteErrorText] = useState(null);

  const username = useSelector(usernameSelector);
  const accessToken = useSelector(accessTokenSelector);

  const navigate = useNavigate();

  useEffect(() => {
    if (username && accessToken) {
        query.getUserProjects(username, accessToken)
          .then((response) => {
            const promises = [];
            for (const id of response.data.project_ids) {
              promises.push(query.getProject(id, accessToken));
            }
            Promise.all(promises)
              .then((responses) => {
                console.log(responses.map((resp) => resp.data));
                setProjects(responses.map((resp) => resp.data));
              })
          })
          .catch((err) => {console.error(err);});
    }
  }, [username, accessToken]);

  const handleConfirmDeleteProject = async () => {
    if (deletePopupId !== null && deletePopupIndex !== null) {
      const result = await query.deleteProject(deletePopupId, accessToken);
      if (result.success === true) {
        let newProjects = [...projects];
        newProjects.splice(deletePopupIndex, 1);
        setProjects(newProjects);
        handleCloseDeletePopup();
      } else if (result.success === false) {
        setDeleteErrorText(result.message);
      }
    } else {
      console.log("Still loading: id or index is null");
    }
  }

  const handleClickEdit = (_id) => {
    navigate("/projectEdit/"+_id);
  }

  const onClickDeleteButton = (_id, index) => {
    setDeletePopupId(_id);
    setDeletePopupIndex(index);
    setIsDeletePopupOpen(true);
  }

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeletePopupIndex(null);
    setDeletePopupId(null);
    setDeleteErrorText(null);
  }

  return (
    <>
      <div className="background-image">
        <NavBar/>

        <h1 className="red-brick-gradient-text title">Projects</h1>
        <div className="projects-container">
          <div style={{display:"flex", justifyContent:"flex-start", alignSelf:"flex-start"}}>
            <div style={{width: "300px"}}>
              <Link to={"/projectNew"} style={{textDecoration: "none"}}>
                <h2 className="create-project-link"><FontAwesomeIcon icon={faSquarePlus}/> Add Project</h2>
              </Link>
            </div>
          </div>

          {(projects) ?
            projects.map((project, i) => (
              <>
                <div className="dashboard-project" key={project._id + "project"}>
                  <div>
                    <div className="dashboard-image-container">
                      <img width="100%" src={project.image} alt={project.name} className="dashboard-image"/>
                    </div>
                  </div>
                  <div>
                    <div className="dashboard-text-container">
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <div className="dashboard-project-buttons">
                        <button onClick={() => {handleClickEdit(project._id)}}>Edit <FontAwesomeIcon icon={faPenToSquare}/></button>
                        <button onClick={() => {onClickDeleteButton(project._id, i)}}>Delete <FontAwesomeIcon icon={faTrashCan}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
          ))
          :
            <div className="dashboard-project"></div>
          }
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
}

export default ProjectDashboard;