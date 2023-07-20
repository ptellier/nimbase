import axios from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
//REFERENCE: used chatGPT to help generate some fake data in the following file
const mockProjects = require("../static/mockData/mock_projects.json");

const BASE_URL = 'http://localhost:8080';

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
    try {
      return await axios.post(BASE_URL + '/api/auth/logout', {});
    } catch (e) {
      console.log("error logging out user ");
    }
  }

  // create a new project
  async createProject(owner, name, description, image, isPublic, dockerfile, github_url, github_auth_tokens, env_vars, entry_port, accessToken) {
    return await axiosInstance.post(BASE_URL + '/api/project', {
      owner: owner,
      name: name,
      description: description,
      image: image,
      public: isPublic,
      dockerfile: dockerfile,
      github_url: github_url,
      github_auth_tokens: github_auth_tokens,
      env_vars: env_vars,
      entry_port: entry_port,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  async getProject(project_id, accessToken) {
    return await axiosInstance.get(BASE_URL + `/api/project/${project_id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
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
  async updateProject(_id, owner, name, description, image, isPublic, dockerfile, github_url, github_auth_tokens, env_vars, entry_port, accessToken) {
    return await axiosInstance.put(BASE_URL + '/api/project', {
      _id: _id,
      owner: owner,
      name: name,
      description: description,
      image: image,
      public: isPublic,
      dockerfile: dockerfile,
      github_url: github_url,
      github_auth_tokens: github_auth_tokens,
      env_vars: env_vars,
      entry_port: entry_port,
    },{
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  // TODO: perform gitHub action on project '/api/project/deploy'

  // TODO: implement backend and remove mock


  async refreshAccessToken() {
    try {
      const response = await axiosInstance.post(BASE_URL + '/api/auth/refresh');
      return response.data.accessToken;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
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

      if (error.response.status === 401 && originalRequest.url !== BASE_URL + '/api/auth/refresh') {
        try {
          const newAccessToken = await q.refreshAccessToken();

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log(err);
          throw new Error(err.message);
        }
      }

      return Promise.reject(error);
    }
);


