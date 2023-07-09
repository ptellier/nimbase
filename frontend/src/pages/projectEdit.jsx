import NavBar from "../components/NavBar";
import '../styles/projectEdit.css';
import Field from "../components/Field";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {accessTokenSelector, usernameSelector} from "../state/userSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import Query from "../components/Query";
import FieldArea from "../components/FieldArea";
import ImageUploader from "../components/ImageUploader";

const FIELD_WIDTH = "20rem";
const query = new Query();

const ProjectEdit = () => {
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [projectNameError, setProjectNameError] = useState(false);
  const [projectDescError, setProjectDescError] = useState(false);
  const [projectImageError, setProjectImageError] = useState(false);
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
    image: null,
    public: true,
    dockerfile: "",
    github_url: "",
    github_auth_tokens: "",
    env_vars: "",
    entry_port: "",
  });

  const setImage = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: value,
    }));
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleInputChangeParseInt = (e) => {
    let value;
    try {
      value = (e.target.value === "") ? "" : parseInt(e.target.value);
    } catch (error) {
      console.error("Error parsing int when handling form input");
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: value,
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
        formData.image,
        formData.public,
        formData.dockerfile,
        formData.github_url,
        formData.github_auth_tokens,
        formData.env_vars,
        formData.entry_port,
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
    if (formData.image === null) {setProjectImageError("Must select an image"); valid = false;} else {setProjectImageError(false);}
    if (formData.dockerfile === "") {setDockerfileError("Cannot be blank"); valid = false;} else {setDockerfileError(false);}
    if (formData.github_url === "") {setGithubLinkError("Cannot be blank"); valid = false;} else {setGithubLinkError(false);}
    if (formData.github_auth_tokens === "") {setGithubAuthTokenError("Cannot be blank"); valid = false;} else {setGithubAuthTokenError(false);}
    if (typeof formData.entry_port !== "number" || formData.entry_port < 1 || formData.entry_port > 65536) {
      setEntryPortError("Must be a number (1-65536)");
      valid = false;
    } else {
      setEntryPortError(false);
    }
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
          <div className="image-and-desc-container">
            <ImageUploader image={formData.image} setImage={setImage} error={projectImageError}/>
            <FieldArea label="Project Description" name="description" value={formData.description}
                  onChange={handleInputChange} error={projectDescError} width={FIELD_WIDTH} cols={45} rows={10}/>
          </div>
          <Field label="Dockerfile" type="text" name="dockerfile" value={formData.dockerfile}
                 onChange={handleInputChange} error={dockerfileError} width={FIELD_WIDTH}/>
          <div className="github-fields-container">
            <Field label="Github Link" type="text" name="github_url" value={formData.github_url}
                    onChange={handleInputChange} error={githubLinkError} width={FIELD_WIDTH}/>
            <Field label="Github Auth Token" type="text" name="github_auth_tokens" value={formData.github_auth_tokens}
                    onChange={handleInputChange} error={githubAuthTokenError} width={FIELD_WIDTH}/>
          </div>
          <Field label="Entry Port" type="number" name="entry_port" value={formData.entry_port}
                  onChange={handleInputChangeParseInt} error={entryPortError} width={FIELD_WIDTH}/>
          <FieldArea label="Environment Variables" name="env_vars" value={formData.env_vars}
                  onChange={handleInputChange} error={envVarError} cols={45} rows={4}/>
          <div className="submit-button-container">
            <button>Submit <FontAwesomeIcon icon={faWandMagicSparkles}/></button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default ProjectEdit;