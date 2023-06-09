import axios from "axios";

class Query {

  async createUser(username, password_hash, email) {
    return await axios.post('/api/user', {
      username: username,
      password_hash: password_hash,
      email: email,
    });
  }

  // Get all projects (ids) of a user
  async getUserProjects(username) {
    return await axios.get(`/api/user/${username}/projects`);
  }

  // Authenticate/ login user
  async loginUser(username, password_hash) {
    return await axios.post('/api/user/login', {
      // TODO: implement loginUser
    });
  }

  // TODO: logout user '/api/user/logout'

  // create a new project
  async createProject(owner, name, description, isPublic, dockerfile, github_url, github_auth_tokens) {
    return await axios.post('/api/project', {
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
    return await axios.get(`/api/project/${project_id}`);
  }

  // set an existing project's fields (all of them except _id)
  async updateProject(owner, name, description, isPublic, dockerfile, github_url, github_auth_tokens) {
    return await axios.put('/api/project', {
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

const query = new Query();
query.createUser("user1", "secret123", "it's a secret").then((res) => console.log(res.data));

