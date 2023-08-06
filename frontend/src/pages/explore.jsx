import NavBar from "../components/NavBar";
import '../styles/explore.css';
import {useEffect, useState} from 'react';
import Query from "../components/Query";
import {Box, Heading, Skeleton, SkeletonText, Tooltip} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {Text} from "@chakra-ui/react";

const SKEL_CLRS = {startColor:'rgb(234,200,205)', endColor:'rgb(188,195,216)'}

const query = new Query();
const NUMS_1_TO_12 = [1, 2, 3, 4, 5, 6, 7, 8];

const Explore = () => {
  const [projects, setProjects] = useState(undefined);

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
      <Heading as="h1" fontWeight={700} fontSize={{base: "26px", sm: "32px"}} align={"center"}
               className="red-brick-gradient-text inika-font">
        Nimbase
      </Heading>
      <Heading as="h2" fontWeight={400} fontSize={{base: "22px", sm: "24px"}} color="#706d87" align={"center"}
               mb={{base: "20px", sm: "50px", lg: "70px"}}>
        Publicly hosted projects
      </Heading>

      {(projects) ?
        <div className="explore-grid">
          {projects.map((project, i) => (project.url) ?
            <a href={project.url} target="_blank" key={"explore-project-" + i}>
              <div className="explore-project" style={{cursor: "pointer"}}>
                <Heading as="h2" ml="10px" fontSize="18px" align="left">{project.name}</Heading>
                <div className="explore-image-container" style={{position: "relative"}}>
                  <img src={project.image} alt={project.name} className="explore-image"/>
                  <div style={{position: "absolute", top: 10, left: 10}}>
                    <FontAwesomeIcon icon={faLink} color="lightblue"/>
                  </div>
                </div>
                <Tooltip label={project.description} bg="white" color="black">
                  <Box ml="10px"><Text as="p">{project.description}</Text></Box>
                </Tooltip>
              </div>
            </a>
            :
            null
          )}
        </div>
        :
        <div className="explore-grid">
          {NUMS_1_TO_12.map((_,i) =>
            <div className="explore-project" key={"skeleton"+i}>
              <SkeletonText ml="10px" height="30px" width="25ch" noOfLines={1} {...SKEL_CLRS}/>
              <Skeleton width="300px" height="170px" {...SKEL_CLRS}/>
              <SkeletonText ml="10px" mt="20px" noOfLines={3} {...SKEL_CLRS}/>
            </div>
          )}
        </div>
      }
    </div>
  );
}

export default Explore;
