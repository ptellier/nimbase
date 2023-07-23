import {deployState} from "./deployEnums";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheckCircle,
  faCloudArrowDown,
  faFileCircleCheck,
  faGear,
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import {Button, Tooltip} from "@chakra-ui/react";
import {useState} from "react";

const ICON_MAP = {
  [deployState.NOT_CLONED]: <FontAwesomeIcon icon={faPlay} color="forestgreen"/>,
  [deployState.CLONING]: <FontAwesomeIcon icon={faCloudArrowDown} color="royalblue" fade />,
  [deployState.CLONED]: <FontAwesomeIcon icon={faFileCircleCheck} color="royalblue"/>,
  [deployState.CLONE_FAILED]: <FontAwesomeIcon icon={faBan} color="firebrick"/>,
  [deployState.DEPLOYING]: <FontAwesomeIcon icon={faGear} color="royalblue" spin/>,
  [deployState.DEPLOYED]: <FontAwesomeIcon icon={faCheckCircle} color="forestgreen"/>,
  [deployState.DEPLOY_FAILED]: <FontAwesomeIcon icon={faBan} color="firebrick"/>,
}

const LABEL_MAP = {
  [deployState.NOT_CLONED]: "Clone, build, and deploy project",
  [deployState.CLONING]: "Cloning your GitHub repository",
  [deployState.CLONED]: "GitHub repository has finished cloning",
  [deployState.CLONE_FAILED]: "Cloning your GitHub repository failed",
  [deployState.DEPLOYING]: "Building, and Deploying your project with Docker",
  [deployState.DEPLOYED]: "Docker container is created and deployed",
  [deployState.DEPLOY_FAILED]: "Building and deploying failed",
}


const ProjectStatus = ({}) => {

  const [status, setStatus] = useState(0);
  return(
    <div className="project-status">
      <Tooltip label={LABEL_MAP[status]}>
        <Button variant="ghost" onClick={() => {setStatus((status+1) % 7)}}>
          {ICON_MAP[status]}
        </Button>
      </Tooltip>
    </div>

  )
}

export default ProjectStatus;