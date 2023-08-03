import NavBar from "../components/NavBar";
import '../styles/projectDashboard.css';
import Query from "../components/Query";
import {useRef} from "react";
import {Button} from "@chakra-ui/react";

const query = new Query()

let current_access_token;

const ApiTestPage = () => {

  const projectId = useRef(null);

  async function sendRequest() {
    await query.createUser("user1", "secret123", "user1@gmail.com")
      .then((res) => console.log(res.data));
    await query.getUserProjects("user1")
      .then((res) => console.log(res.data));
    await query.createProject("user1", "project1",
      "project1 description", true, "dockerfile1", "https://phillip.tel", "token1")
      .then((res) => console.log(res.data));
    await query.createProject("user1", "project2",
      "project2 description", true, "dockerfile2", "url2", "token2")
      .then((res) => console.log(res.data));
    const resp = await query.getUserProjects("user1")
    console.log(resp.data.project_ids)
    await query.getProject(resp.data.project_ids[1])
      .then((res) => console.log(res.data));
    await query.updateProject(resp.data.project_ids[1], "user1", "updatedProject",
        "updated description", true, "dockerfile3", "url3", "token3")
      .then((res) => console.log(res.data));
    await query.getProject(resp.data.project_ids[1])
      .then((res) => console.log(res.data));
  }


  async function register() {
    const response = await query.createUser("user1", "secret123", "user1@gmail.com")
    console.log(response.data);
  }

  async function login() {
    const response = await query.loginUser("user1", "secret123");
    console.log(response.data);
    current_access_token = response.data.accessToken;
    console.log("current_access_token = " + current_access_token);
  }

  async function logout() {
    const response = await query.logoutUser("user1");
    console.log(response.data);
  }

  async function getProjects() {
    const response = await query.getUserProjects("user1", current_access_token);
    console.log(response.data);
  }

  async function createProject() {
    const response = await query.createProject("user1", "project1", "project1 description",
      true, "dockerfile1", "https://phillip.tel", "token1", current_access_token);
    console.log(response.data);
  }

  async function updateProject(_id) {
    const response = await query.updateProject(_id, "user1", "project1", "updated description again",
      true, "dockerfile3", "url3", "token3", current_access_token);
    console.log(response.data);
  }



  return (
    <div className="background-image">
      <NavBar/>
      <div style={{height:"100%", width:"100%"}}>
        <div style={{display:"flex", gap:30, flexDirection:"column", margin:"auto", width:"max-content"}}>
          <Button variant="customDefault"  onClick={sendRequest}>Send Request</Button>
          <Button variant="customDefault"  onClick={register}>Register</Button>
          <Button variant="customDefault"  onClick={login}>Login</Button>
          <Button variant="customDefault"  onClick={logout}>Logout</Button>

          <Button variant="customDefault"  onClick={getProjects}>Get Projects</Button>
          <Button variant="customDefault"  onClick={createProject}>Create Project</Button>
          <div>
            <Button variant="customDefault"  onClick={() => updateProject(projectId.current.value)} style={{marginBottom: "5px"}}>Update Project</Button><br/>
            <label>
              project id:
              <input type="text" name="projectId" ref={projectId}></input>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiTestPage;