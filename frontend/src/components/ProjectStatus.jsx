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
import Query from "./Query";
import {useSelector} from "react-redux";
import {accessTokenSelector} from "../state/userSlice";

const query = new Query();

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

const ProjectStatus = ({project}) => {

  const accessToken = useSelector(accessTokenSelector);

  const FUNCTION_MAP = {
    [deployState.NOT_CLONED]: async () => {
        setStatus(deployState.CLONING);
        const result = await query.devOpsClone(project.github_url, project.name,
          project.env_vars, project.entry_port, project._id, accessToken);
        console.log(result);
         if (result.success) {
            setStatus(deployState.CLONED);
            FUNCTION_MAP[deployState.CLONED]();
         } else {
            setStatus(deployState.CLONE_FAILED);
            console.error(result.error);
         }
      },
    [deployState.CLONING]: () => {},
    [deployState.CLONED]: () => {
      setStatus(deployState.DEPLOYING);
      const result = query.devOpsDeploy(project._id, accessToken);
      if (result.success) {
        setStatus(deployState.DEPLOYED);
      } else {
        setStatus(deployState.DEPLOY_FAILED);
        console.error(result.error);
      }
    },
    [deployState.CLONE_FAILED]: () => {FUNCTION_MAP[deployState.NOT_CLONED]();},
    [deployState.DEPLOYING]: () => {},
    [deployState.DEPLOYED]: () => {},
    [deployState.DEPLOY_FAILED]: () => {FUNCTION_MAP[deployState.CLONED]();},
  }

  const [status, setStatus] = useState(deployState.NOT_CLONED);
  return(
    <div className="project-status">
      <Tooltip label={LABEL_MAP[status]}>
        <Button variant="ghost" onClick={FUNCTION_MAP[status]}>
          {ICON_MAP[status]}
        </Button>
      </Tooltip>
    </div>

  )
}

export default ProjectStatus;