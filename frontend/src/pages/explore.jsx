import NavBar from "../components/NavBar";
import '../styles/explore.css';
import { useEffect, useState } from 'react';
import Query from "../components/Query";
import {Tooltip} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink} from "@fortawesome/free-solid-svg-icons";

const query = new Query();

const Explore = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await query.getAllPublicProjects();
                setProjects(res);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData().then(() => console.log("Fetched all projects"));
    }, []);

    return (
        <div className="background-image">
            <NavBar/>
            <h1 className="red-brick-gradient-text title">Explore Public Projects Hosted on <b>Nimbase</b></h1>
            <div className="explore-grid">
                {projects.map((project, i) => (project.url) ?
                    <a href={project.url} target="_blank" key={"explore-project-"+i}>
                        <div className="explore-project" style={{cursor: "pointer"}}>
                            <h3>{project.name}</h3>
                            <div className="explore-image-container" style={{position: "relative"}}>
                              <img src={project.image} alt={project.name} className="explore-image"/>
                              <div style={{position: "absolute", top:10, left:10}}>
                                <FontAwesomeIcon icon={faLink} color="lightblue"/>
                              </div>
                            </div>
                            <Tooltip label={project.description} bg="white" color="black">
                              <p>{project.description}</p>
                            </Tooltip>
                        </div>
                    </a>
                  :
                  null
                )}
            </div>
        </div>
    );
}

export default Explore;
