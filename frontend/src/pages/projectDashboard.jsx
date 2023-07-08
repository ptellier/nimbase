import NavBar from "../components/NavBar";
import '../styles/projectDashboard.css';
import Query from "../components/Query";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faSquarePlus} from "@fortawesome/free-regular-svg-icons";
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";
import ConfirmationPopup from "../components/ConfirmationPopup";
import {Link} from "react-router-dom";

const query = new Query();
const handleConfirmDeleteProject = async () => {console.info("Todo: implement delete project")}

const ProjectDashboard = () => {

  const [projects, setProjects] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const query = new Query();
      try {
        const res = await query.getAllProjects();
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="background-image">
        <NavBar/>

        <h1 className="red-brick-gradient-text title">Projects</h1>
        <div className="projects-container">
          <div style={{display:"flex", justifyContent:"flex-start", alignSelf:"flex-start"}}>
            <div style={{width: "300px"}}>
              <Link to={"/projectEdit"} style={{textDecoration: "none"}}>
                <h2 className="create-project-link"><FontAwesomeIcon icon={faSquarePlus}/> Add Project</h2>
              </Link>
            </div>
          </div>

          {projects.map(project => (
            <div className="dashboard-project" key={project.id}>
              <div>
                <div className="dashboard-image-container">
                  <img width="100%" src={project.imageUrl} alt={project.title} className="dashboard-image"/>
                </div>
              </div>
              <div>
                <div className="dashboard-text-container">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="dashboard-project-buttons">
                    <button>Edit <FontAwesomeIcon icon={faPenToSquare}/></button>
                    <button onClick={() => {setIsDeletePopupOpen(true)}}>Delete <FontAwesomeIcon icon={faTrashCan}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationPopup
        open={isDeletePopupOpen}
        setOpen={setIsDeletePopupOpen}
        headerText="Delete Project?"
        bodyText="Are you sure you want to delete this project?"
        cancelButtonText="Delete"
        onConfirm={handleConfirmDeleteProject}
      />
    </>

  );
}

export default ProjectDashboard;