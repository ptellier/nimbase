import NavBar from "../components/NavBar";
import '../styles/explore.css';
import { useEffect, useState } from 'react';
import Query from "../components/Query";

const Explore = () => {
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
            <h1 className="red-brick-gradient-text title">Explore Public Projects Hosted on <b>Nimbase</b></h1>
            <div className="projects-grid">
                {projects.map(project => (
                    <div className="project" key={project.id}>
                        <h3>{project.title}</h3>
                        <div className="project-image-container">
                          <img src={project.imageUrl} alt={project.title} className="project-image"/>
                        </div>
                        <p>{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Explore;
