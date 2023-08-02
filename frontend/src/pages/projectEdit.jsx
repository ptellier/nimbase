import NavBar from "../components/NavBar";
import "../styles/projectEdit.css";
import Field from "../components/Field";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { accessTokenSelector, usernameSelector } from "../state/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import Query from "../components/Query";
import FieldArea from "../components/FieldArea";
import ImageUploader from "../components/ImageUploader";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox } from "@chakra-ui/react";
import { AlertsContext } from "../components/ProjectAlerts";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrop } from 'react-dnd'
import { useDrag } from 'react-dnd'
import Dustbin from '../components/DndComponent'
const FIELD_WIDTH = "20rem";
const query = new Query();

const ALERT_SUCCESS_CREATED = {
  status: "success",
  alertText: "Project Uploaded to server!",
}

const ALERT_ERROR_CREATED = {
  status: "error",
  alertText: "Error uploading project to server!",
}

const ALERT_SUCCESS_UPDATED = {
  status: "success",
  alertText: "Project successfully updated!",
}

const ALERT_ERROR_GETTING_PROJECT = {
  status: "error",
  alertText: "Error, could not get project from server!",
}


const ProjectEdit = () => {
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [projectNameError, setProjectNameError] = useState(false);
    const [projectDescError, setProjectDescError] = useState(false);
    const [projectImageError, setProjectImageError] = useState(false);
    const [githubLinkError, setGithubLinkError] = useState(false);
    const [envVarError, setEnvVarError] = useState(false);

    const { createAlert } = useContext(AlertsContext);

    const username = useSelector(usernameSelector);
    const accessToken = useSelector(accessTokenSelector);

    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState([]);

    const [dndID, setDndID] = useState("");

    const [formData, setFormData] = useState({
        owner: username,
        name: "",
        description: "",
        image: null,
        public: true,
        github_url: "",
        env_vars: "",
    });

    const setImage = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            image: value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            public: e.target.checked,
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitAttempted(true);
        const isValid = validateFormData();
        if (!isValid) {
            return;
        }
        console.log("Creating/updating project");
        let response;
        try {
            if (id) {
                response = await query.updateProject(
                    id,
                    formData.owner,
                    formData.name,
                    formData.description,
                    formData.image,
                    formData.public,
                    formData.github_url,
                    formData.env_vars,
                    accessToken
                );
            } else {
                console.log("Creating project");
                response = await query.createProject(
                    formData.owner,
                    formData.name,
                    formData.description,
                    formData.image,
                    formData.public,
                    formData.github_url,
                    formData.env_vars,
                    accessToken
                );
            }
            console.log("Response:", response);
            createAlert(ALERT_SUCCESS_CREATED);
            // clone the project
            setDndID(response.message.id);

            const cloneResponse = await query.devOpsClone(
                formData.github_url,
                formData.name,
                formData.env_vars,
                response.message.id,
                accessToken
            );
            console.log("Clone response:", cloneResponse);
            setService(cloneResponse.data.services);
            // navigate("/project/dashboard");
        } catch (error) {
            createAlert(ALERT_ERROR_CREATED);
            console.error("Error creating/updating project:", error);
        }
        console.log("Form submitted");
    }


    const validateFormData = () => {
        let valid = true;
        if (formData.name === "") {
            setProjectNameError("Cannot be blank");
            valid = false;
        } else {
            setProjectNameError(false);
        }
        if (formData.description === "") {
            setProjectDescError("Cannot be blank");
            valid = false;
        } else {
            setProjectDescError(false);
        }
        if (formData.image === null) {
            setProjectImageError("Must select an image");
            valid = false;
        } else {
            setProjectImageError(false);
        }
        if (formData.github_url === "") {
            setGithubLinkError("Cannot be blank");
            valid = false;
        } else {
            setGithubLinkError(false);
        }
        return valid;
    };
    
    useEffect(() => {
        if (submitAttempted) {
            validateFormData();
        }
    }, [formData]);
    
    useEffect(() => {
      if (id) {
        query.getProject(id, accessToken)
          .then((response) => {
            if (response.success) {
              setFormData(response.data);
            } else {
              createAlert(ALERT_ERROR_GETTING_PROJECT);
              console.error("Error getting project:", response.error);
            }
          })
      }
    }, []);


    return (
        <>
            <div className="background-image">
                <NavBar />
                <h1 className="red-brick-gradient-text title">
                    Create/Edit Project
                </h1>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <div className="row">
                        <div className="row">
                            <div className="col">
                                <div className="row">
                                    <Field
                                        label="Project Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={projectNameError}
                                        width="70%"
                                    />
                                    <div>
                                        <label
                                            htmlFor="is-public-checkbox"
                                            style={{ lineHeight: "2.5em" }}
                                        >
                                            Host Publicly:
                                        </label>
                                        <div>
                                            <Checkbox
                                                id="is-public-checkbox"
                                                size="lg"
                                                colorScheme="pink"
                                                defaultChecked
                                                onChange={handleCheckboxChange}
                                                sx={{ borderColor: "#ccc" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Field
                                    label="Github Link"
                                    type="text"
                                    name="github_url"
                                    value={formData.github_url}
                                    onChange={handleInputChange}
                                    error={githubLinkError}
                                    width="100%"
                                />
                                <FieldArea
                                    label="Environment Variables"
                                    name="env_vars"
                                    value={formData.env_vars}
                                    monospace
                                    onChange={handleInputChange}
                                    error={envVarError}
                                    width="100%"
                                    cols={50}
                                    rows={5}
                                />
                                <div className="submit-button-container">
                                    <Button
                                        variant="customDefault"
                                        onClick={handleSubmit}
                                    >
                                        Analyze
                                        <FontAwesomeIcon
                                            icon={faWandMagicSparkles}
                                            style={{ marginLeft: "0.5em" }}
                                        />
                                    </Button>
                                </div>
                            </div>
                            <div className="col">
                                <ImageUploader
                                    image={formData.image}
                                    setImage={setImage}
                                    error={projectImageError}
                                />
                                <FieldArea
                                    label="Project Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    error={projectDescError}
                                    cols={45}
                                    rows={5}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                              Analyzed services:
                              <DndProvider backend={HTML5Backend}>
                                <Dustbin serviceList={service || []} id={dndID || ""} />
                              </DndProvider>
                              {/* make a disabled button only when the service has atlaest one element */}
                            
                            </div>
                            
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProjectEdit;
