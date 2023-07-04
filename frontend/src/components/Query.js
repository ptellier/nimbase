import axios from "axios";
//REFERENCE: used chatGPT to help generate some fake data in the following file
const mockProjects = require("../static/mockData/mock_projects.json");

const BASE_URL = 'http://localhost:8080';

class Query {

  async createUser(firstName, lastName, username, password, email) {
    return await axios.post(BASE_URL + '/api/register', {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
    }, {
      validateStatus: (status) => (status === 201 || status === 400 || status === 409)
    });
  }

  // Get all projects (ids) of a user
  async getUserProjects(username, accessToken) {
    return await axios.get(BASE_URL + `/api/user/${username}/projects`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // Authenticate/ login user
  async loginUser(username, password) {
    return await axios.post(BASE_URL + '/api/auth/login', {
      username: username,
      password: password,
    }, {
      validateStatus: (status) => (status === 200 || status === 400 || status === 401)
    }).catch((err) => {console.log(err)});
  }

  // logout user
  async logoutUser() {
    try {
      return await axios.post(BASE_URL + '/api/auth/logout', {});
    } catch (e) {
      console.log("error logging out user ");
    }
  }

  // create a new project
  async createProject(owner, name, description, isPublic, dockerfile, github_url, github_auth_tokens, accessToken) {
    return await axios.post(BASE_URL + '/api/project', {
      owner: owner,
      name: name,
      description: description,
      public: isPublic,
      dockerfile: dockerfile,
      github_url: github_url,
      github_auth_tokens: github_auth_tokens,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });


  }

  async getProject(project_id) {
    return await axios.get(BASE_URL + `/api/project/${project_id}`)
  }

  // set an existing project's fields (all of them except _id which must match an existing project)
  async updateProject(_id, owner, name, description, isPublic, dockerfile, github_url, github_auth_tokens, accessToken) {
    return await axios.put(BASE_URL + '/api/project', {
      _id: _id,
      owner: owner,
      name: name,
      description: description,
      public: isPublic,
      dockerfile: dockerfile,
      github_url: github_url,
      github_auth_tokens: github_auth_tokens,
    },{
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // TODO: perform gitHub action on project '/api/project/deploy'

  // TODO: implement backend and remove mock
  async getAllProjects() {
    // return await axios.get(BASE_URL+'/api/projects');
    // }
    return Promise.resolve(mockProjects);
  }

}

export default Query;



