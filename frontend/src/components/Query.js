import axios from "axios";
//REFERENCE: used chatGPT to help generate some fake data in the following file
const mockProjects = require("../static/mockData/mock_projects.json");

const BASE_URL = process.env.REACT_APP_BASE_URL

const axiosInstance = axios.create({
  withCredentials: true,
});

class Query {

  async createUser(firstName, lastName, username, password, email) {
    return await axiosInstance.post(BASE_URL + '/api/register', {
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
    return await axiosInstance.get(BASE_URL + `/api/user/${username}/projects`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // Authenticate/ login user
  async loginUser(username, password){
    return await axiosInstance.post(BASE_URL + '/api/auth/login', {
      username: username,
      password: password,
    }, {
      validateStatus: (status) => (status === 200 || status === 400 || status === 401),
      withCredentials: true
    }).catch((err) => {console.log(err)});
  }

  // logout user
  async logoutUser() {
    return await axios.post(BASE_URL + '/api/auth/logout', {});
  }

  async getUserTeams(username, accessToken) {
    return await axiosInstance.get(BASE_URL + `/api/user/${username}/teams`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // create a new project
  async createProject(owner, name, description, image, isPublic, github_url,  env_vars, accessToken) {
    const response = await axiosInstance.post(BASE_URL + '/api/project', {
      owner: owner,
      name: name,
      description: description,
      image: image,
      public: isPublic,

      github_url: github_url,

      env_vars: env_vars,

    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return (response.status === 200) ? {success: true, message:response.data} : {success: false, message: response.data};
  }

  async getProject(project_id, accessToken) {
    const response = await axiosInstance.get(BASE_URL + `/api/project/${project_id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: (status) => (status === 200)
      });
    return (response.status === 200) ? {success: true, data: response.data} : {success: false, message: response.data.message};
  }

    async getProjectByName(project_name, accessToken) {
    const response = await axiosInstance.get(BASE_URL + `/api/project/name/${project_name}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: (status) => (status === 200)
      });
    return (response.status === 200) ? {success: true, data: response.data} : {success: false, message: response.data.message};
    }

  // returns {success: true} if successful, {success: false, message: true} if not
  async deleteProject(project_id, accessToken) {
    const response = await axiosInstance.delete(BASE_URL + `/api/project/${project_id}`,
      {
        headers: {Authorization: `Bearer ${accessToken}`},
        validateStatus: (status) => (status === 200 || status === 400 || status === 404)
      });
    return (response.status === 200) ? {success: true} : {success: false, message: response.data.message};
  }

  // set an existing project's fields (all of them except _id which must match an existing project)
  async updateProject(_id, owner, name, description, image, isPublic,  github_url,  env_vars,  accessToken) {
       const response = await axiosInstance.put(BASE_URL + '/api/project', {
      _id: _id,
      owner: owner,
      name: name,
      description: description,
      image: image,
      public: isPublic,
      github_url: github_url,
      env_vars: env_vars,
    },{
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return (response.status === 200) ? {success: true} : {success: false, message: response.data};
  }

  async getAllPublicProjects() {
    const response = await axiosInstance.get(BASE_URL + '/api/project/');
    return response.data;
  }

  async refreshAccessToken() {
    try {
      const response = await axiosInstance.post(BASE_URL + '/api/auth/refresh');
      return response.data.accessToken;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
  
  async googleLogin(tokenId){
    return await axiosInstance.post(BASE_URL + '/api/auth/google/login', {
      tokenId: tokenId
    }).catch((err) => { console.log(err) });
  }

  async devOpsClone(github_url, name, env_variables, _id, accessToken) {
    const response = await axiosInstance.post(BASE_URL + '/api/devops/clone', {
      github_url: github_url,
      name: name,
      env_vars: env_variables,
      _id: _id,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
      validateStatus: (status) => (status === 200 || status === 500)
    });
    console.log(response);
    return (response.status === 200) ? {success: true, data : response.data} : {success: false, error: response.data};
  }

  async devOpsDeploy(_id, accessToken, configs) {
    const response = await axiosInstance.post(BASE_URL + '/api/devops/deploy', {
      id: _id,
      configs: configs,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
      validateStatus: (status) => (status === 200 || status === 500)
    })
    return (response.status === 200) ? {success: true, data:response.data} : {success: false, error: response.data};
  }

  async devOpsRemove(_id, accessToken) {
    return await axiosInstance.post(BASE_URL + '/api/devops/remove', {
      id: _id,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
  }

  // TEAMS
  async createTeam(teamName, description, owner, accessToken) {
    return await axiosInstance.post(BASE_URL + '/api/team', {
      teamName: teamName,
      description: description,
      owner: owner,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  async deleteTeam(teamName, accessToken, userName) {
    return await axiosInstance.post(BASE_URL + `/api/team/${teamName}`,{
      username: userName,
    },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
  }


  async getTeam(teamName, accessToken) {
    return await axiosInstance.get(BASE_URL + `/api/team/${teamName}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  }

  async addTeamMember(teamName, username, accessToken) {
    return await axiosInstance.post(BASE_URL + `/api/team/${teamName}/addMember/${username}`,  {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  async removeTeamMember(teamName, username, accessToken) {
    return await axiosInstance.post(BASE_URL + `/api/team/${teamName}/removeMember/${username}`,{
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  async addTeamProject(teamName, projectName, accessToken,userName) {
    return axiosInstance.post(BASE_URL + `/api/team/${teamName}/addProject/${projectName}`, {
      username: userName,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  async removeTeamProject(teamName, projectName, accessToken, userName) {
    return axiosInstance.post(BASE_URL + `/api/team/${teamName}/removeProject/${projectName}`,{
          username: userName,
        },{
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }
}

export default Query;

let q = new Query();

axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;


      if (error.response?.status === 401 && originalRequest.url !== BASE_URL + '/api/auth/refresh') {
        try {
          const newAccessToken = await q.refreshAccessToken();

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          window.location.href = '/login';
          console.log(err);
        }
      }

      return Promise.reject(error);
    }
);
