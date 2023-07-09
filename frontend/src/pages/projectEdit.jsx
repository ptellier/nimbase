import NavBar from "../components/NavBar";
import '../styles/projectEdit.css';
import Field from "../components/Field";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {accessTokenSelector, usernameSelector} from "../state/userSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import Query from "../components/Query";

const FIELD_WIDTH = "20rem";
const query = new Query();

const ProjectEdit = () => {
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [projectNameError, setProjectNameError] = useState(false);
  const [projectDescError, setProjectDescError] = useState(false);
  const [dockerfileError, setDockerfileError] = useState(false);
  const [githubLinkError, setGithubLinkError] = useState(false);
  const [githubAuthTokenError, setGithubAuthTokenError] = useState(false);
  const [envVarError, setEnvVarError] = useState(false);
  const [entryPortError, setEntryPortError] = useState(false);

  const username = useSelector(usernameSelector);
  const accessToken = useSelector(accessTokenSelector);

  const [formData, setFormData] = useState(   {
    owner: username,
    name: "",
    description: "",
    public: true,
    dockerfile: "",
    github_url: "",
    github_auth_tokens: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitAttempted(true);
    const isValid = validateFormData();
    if (!isValid) {return;}
    try {
      console.log("Creating/updating project");
      await query.createProject(
        formData.owner,
        formData.name,
        formData.description,
        formData.public,
        formData.dockerfile,
        formData.github_url,
        formData.github_auth_tokens,
        accessToken
      );
    } catch (error) {
      console.error("Error creating/updating project:", error);
    }
    console.log("Form submitted");
  }

  const validateFormData = () => {
    let valid = true;
    if (formData.name === "") {setProjectNameError("Cannot be blank"); valid = false;} else {setProjectNameError(false);}
    if (formData.description === "") {setProjectDescError("Cannot be blank"); valid = false;} else {setProjectDescError(false);}
    if (formData.dockerfile === "") {setDockerfileError("Cannot be blank"); valid = false;} else {setDockerfileError(false);}
    if (formData.github_url === "") {setGithubLinkError("Cannot be blank"); valid = false;} else {setGithubLinkError(false);}
    if (formData.github_auth_tokens === "") {setGithubAuthTokenError("Cannot be blank"); valid = false;} else {setGithubAuthTokenError(false);}
    return valid;
  }

  useEffect(() => {
    if (submitAttempted) {
      validateFormData();
    }
  }, [formData]);

  return (
    <div className="background-image">
      <NavBar/>
      <h1 className="red-brick-gradient-text title">Create/Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="project-edit-container">
          <Field label="Project Name" type="text" name="name" value={formData.name}
                 onChange={handleInputChange} error={projectNameError} width={FIELD_WIDTH}/>
          <Field label="Project Description" type="text" name="description" value={formData.description}
                 onChange={handleInputChange} error={projectDescError} width={FIELD_WIDTH}/>
          <Field label="Dockerfile" type="text" name="dockerfile" value={formData.dockerfile}
                 onChange={handleInputChange} error={dockerfileError} width={FIELD_WIDTH}/>
          <Field label="Github Link" type="text" name="github_url" value={formData.github_url}
                  onChange={handleInputChange} error={githubLinkError} width={FIELD_WIDTH}/>
          <Field label="Github Auth Token" type="text" name="github_auth_tokens" value={formData.github_auth_tokens}
                  onChange={handleInputChange} error={githubAuthTokenError} width={FIELD_WIDTH}/>
          {/*<Field label="Environment Variables" type="text" name="env_vars" value={formData.env_vars}*/}
          {/*        onChange={handleInputChange} error={envVarError}/>*/}
          <div className="submit-button-container">
            <button>Submit <FontAwesomeIcon icon={faWandMagicSparkles}/></button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProjectEdit;