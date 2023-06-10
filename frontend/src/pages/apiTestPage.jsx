import NavBar from "../components/NavBar";
import '../styles/projectDashboard.css';
import Query from "../components/Query";

const query = new Query()

const ApiTestPage = () => {
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

  return (
    <div className="background-image">
      <NavBar/>
      <div style={{height:"100%", width:"100%"}}>
        <div style={{margin:"auto", width:"max-content"}}>
          <button onClick={sendRequest}>send request</button>
        </div>
      </div>
    </div>
  );
}

export default ApiTestPage;