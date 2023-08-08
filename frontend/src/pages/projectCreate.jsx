import NavBar from "../components/NavBar";
import "../styles/projectEdit.css";
import Field from "../components/Field";
import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { accessTokenSelector, usernameSelector } from "../state/userSlice";
import { currentProjectSelector } from "../state/currentProjectSlice";
import { initProject } from "../state/currentProjectSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import Query from "../components/Query";
import FieldArea from "../components/FieldArea";
import ImageUploader from "../components/ImageUploader";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox } from "@chakra-ui/react";
import { AlertsContext } from "../components/ProjectAlerts";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import { useDrag } from "react-dnd";
import DndComponent from "../components/DndComponent";
// import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";

const FIELD_WIDTH = "20rem";
const query = new Query();

// // create a new project
// async createProject(project, accessToken) {
  //   const response = await axiosInstance.post(
    //     BASE_URL + "/api/project",
    //     {
      //       owner: project.owner || "",
      //       name: project.name || "",
      //       description: project.description || "",
      //       image: project.image || "",
      //       public: project.isPublic || false,
      //       github_url: project.github_url || "",
      //       env_vars: project.env_vars || "",
      //       client: project.client || "",
      //       connection_url: project.connection_url || "",
      //       server: project.server || "",
      //       url: project.url || "",
      //     },
      //     {
        //       headers: { Authorization: `Bearer ${accessToken}` },
        //     }
        //   );
        //   return response.status === 200
        //     ? { success: true, message: response.data }
        //     : { success: false, message: response.data };
        // }
        
        // // set an existing project's fields (all of them except _id which must match an existing project)
        // async updateProject(_id, project, accessToken) {
//   const response = await axiosInstance.put(
  //     BASE_URL + "/api/project",
  //     {
    //       _id: _id,
    //       owner: project.owner || "",
    //       name: project.name || "",
    //       description: project.description || "",
    //       image: project.image || "",
    //       public: project.isPublic || false,
    //       github_url: project.github_url || "",
    //       env_vars: project.env_vars || "",
    //       client: project.client || "",
    //       connection_url: project.connection_url || "",
    //       server: project.server || "",
    //       url: project.url || "",
    //     },
    //     {
      //       headers: { Authorization: `Bearer ${accessToken}` },
      //     }
      //   );
      //   return response.status === 200
      //     ? { success: true }
      //     : { success: false, message: response.data };
      // }
      
      const ALERT_SUCCESS_CREATED = {
  status: "success",
  alertText: "Project Uploaded to server!",
};

const ALERT_ERROR_CREATED = {
  status: "error",
  alertText: "Error uploading project to server!",
};

const ALERT_SUCCESS_UPDATED = {
  status: "success",
  alertText: "Project successfully updated!",
};

const ALERT_ERROR_GETTING_PROJECT = {
  status: "error",
  alertText: "Error, could not get project from server!",
};

const ProjectCreate = () => {
  const dispatch = useDispatch();
  const project = useSelector(currentProjectSelector);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
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

  const [formData, setFormData] = useState({
    _id : "",
    owner: username,
    name: "",
    description: "",
    image: null,
    public: true,
    github_url: "",
    env_vars: "",
    client: "",
    connection_url: "",
    server: "",
    url: "",
    services: [],
  });

  const AnalyzeModal = () => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Modal.Title><h1>Services found in docker-compose</h1></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col">
              <DndProvider backend={HTML5Backend}>
                <DndComponent/>
              </DndProvider>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

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

  async function handleAnalyze(e) {
    e.preventDefault();
    const isValid = validateFormData();
    if (!isValid) {
      return;
    }
    // console.log(formData);
    dispatch(initProject(formData)).then(async (res) => {
      console.log(res);
      // console.log(project);
      const response = await query.createProject(res.payload, accessToken);
      console.log("Response:", response);
      const inserted_id = response.message._id;
      const response2 = await query.createProjectFiles(inserted_id, res.payload, accessToken);
      const services = response2.message.services;
      //  update formdata with id and services
      dispatch(initProject({ ...res.payload, services: services, _id: inserted_id })).then((res) => {
        handleShow();
      });
    });
  }

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   setSubmitAttempted(true);
  //   const isValid = validateFormData();
  //   if (!isValid) {
  //     return;
  //   }
  //   console.log("Creating/updating project");
  //   let response;
  //   const project = {
  //     owner: formData.owner,
  //     name: formData.name,
  //     description: formData.description,
  //     image: formData.image,
  //     public: formData.public,
  //     github_url: formData.github_url,
  //     env_vars: formData.env_vars,
  //   };

  //   try {
  //     if (id) {
  //       response = await query.updateProject(id, project, accessToken);
  //     } else {
  //       console.log("Creating project");
  //       response = await query.createProject(project, accessToken);
  //     }
  //     console.log("Response:", response);
  //     createAlert(ALERT_SUCCESS_CREATED);
  //     // clone the project
  //     setDndID(response.message.id);

  //     const cloneResponse = await query.devOpsClone(
  //       formData.github_url,
  //       formData.name,
  //       formData.env_vars,
  //       response.message.id,
  //       accessToken
  //     );
  //     console.log("Clone response:", cloneResponse);
  //     setService(cloneResponse.data.services);
  //     // navigate("/project/dashboard");
  //   } catch (error) {
  //     createAlert(ALERT_ERROR_CREATED);
  //     console.error("Error creating/updating project:", error);
  //   }
  //   console.log("Form submitted");
  // }

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

  // useEffect(() => {
  //   if (id) {
  //     query.getProject(id, accessToken).then((response) => {
  //       if (response.success) {
  //         setFormData(response.data);
  //       } else {
  //         createAlert(ALERT_ERROR_GETTING_PROJECT);
  //         console.error("Error getting project:", response.error);
  //       }
  //     });
  //   }
  // }, []);

  return (
    <>
      <div className="background-image">
        <NavBar />
        <h1 className="red-brick-gradient-text title">Create Project</h1>
        <form style={{ width: "100%" }}>
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
                    width="100%"
                  />
                  <div>
                    <label
                      htmlFor="is-public-checkbox"
                      style={{ lineHeight: "2.5em" }}
                    >
                      Public:
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
                  rows={3}
                />
                <FieldArea
                  label="Project Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={projectDescError}
                  cols={45}
                  rows={3}
                />
              </div>
              <div className="col">
                <ImageUploader
                  image={formData.image}
                  setImage={setImage}
                  error={projectImageError}
                />
                <div className="submit-button-container">
                  <Button variant="customDefault" onClick={handleAnalyze}>
                    Analyze Services
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                      style={{ marginLeft: "0.5em" }}
                    />
                  </Button>
                </div>
              </div>
            </div>
            <AnalyzeModal />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProjectCreate;
