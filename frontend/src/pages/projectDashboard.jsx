import NavBar from "../components/NavBar";
import '../styles/projectDashboard.css';
import Query from "../components/Query";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-regular-svg-icons";
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";

const ProjectDashboard = () => {

  const [projects, setProjects] = useState([]);

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
    <div className="background-image">
      <NavBar/>

      <h1 className="red-brick-gradient-text title">Projects</h1>
      <div className="projects-container">
        {projects.map(project => (
          <div className="dashboard-project" key={project.id}>
            <span className="dashboard-image-container">
              <img src={project.imageUrl} alt={project.title} className="dashboard-image"/>
            </span>
            <span className="dashboard-text-container">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="dashboard-project-buttons">
                <button>Edit <FontAwesomeIcon icon={faPenToSquare}/></button>
                <button>Delete <FontAwesomeIcon icon={faTrashCan}/></button>
              </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDashboard;