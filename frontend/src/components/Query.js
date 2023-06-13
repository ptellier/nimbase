import axios from "axios";

const BASE_URL = 'http://localhost:8080';

class Query {

  async createUser(username, password_hash, email) {
    return await axios.post(BASE_URL+'/api/user', {
      username: username,
      password_hash: password_hash,
      email: email,
    });
  }

  // Get all projects (ids) of a user
  async getUserProjects(username) {
    return await axios.get(BASE_URL+`/api/user/${username}/projects`);
  }

  // Authenticate/ login user
  async loginUser(username, password_hash) {
    try {
      return await axios.post(BASE_URL+'/api/user/login', {
        username: username,
        password_hash: password_hash,
      });
    } catch (e) {
        console.log("error logging in user ", e);
    }

  }

  // TODO: logout user '/api/user/logout'
  async logoutUser(username) {
    try {
      return await axios.post(BASE_URL+'/api/user/logout', {
        username: username
      });
    } catch (e) {
      console.log("error logging out user ");
    }
  }

  // create a new project
  async createProject(owner, name, description, isPublic, dockerfile, github_url, github_auth_tokens) {
    return await axios.post(BASE_URL+'/api/project', {
      owner: owner,
      name: name,
      description: description,
      public: isPublic,
      dockerfile: dockerfile,
      github_url: github_url,
      github_auth_tokens: github_auth_tokens,
    });
  }

  async getProject(project_id) {
    return await axios.get(BASE_URL+`/api/project/${project_id}`);
  }

  // set an existing project's fields (all of them except _id which must match an existing project)
  async updateProject(_id, owner, name, description, isPublic, dockerfile, github_url, github_auth_tokens) {
    return await axios.put(BASE_URL+'/api/project', {
      _id: _id,
      owner: owner,
      name: name,
      description: description,
      public: isPublic,
      dockerfile: dockerfile,
      github_url: github_url,
      github_auth_tokens: github_auth_tokens,
    });
  }

  // TODO: perform gitHub action on project '/api/project/deploy'

}

export default Query;



