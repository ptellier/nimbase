import axios from "axios";
//REFERENCE: used chatGPT to help generate some fake data in the following file
const mockProjects = require("../static/mockData/mock_projects.json");

const BASE_URL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  withCredentials: true,
});

class Query {
  async createUser(firstName, lastName, username, password, email) {
    return await axiosInstance.post(
      BASE_URL + "/api/register",
      {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
      },
      {
        validateStatus: (status) =>
          status === 201 || status === 400 || status === 409,
      }
    );
  }

  async getUserProjects(username, accessToken) {
    return await axiosInstance.get(
      BASE_URL + `/api/user/${username}/projects`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }

  async loginUser(username, password) {
    return await axiosInstance
      .post(
        BASE_URL + "/api/auth/login",
        {
          username: username,
          password: password,
        },
        {
          validateStatus: (status) =>
            status === 200 || status === 400 || status === 401,
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }

  async logoutUser() {
    return await axios.post(BASE_URL + "/api/auth/logout", {});
  }

  async getUserTeams(username, accessToken) {
    return await axiosInstance.get(BASE_URL + `/api/user/${username}/teams`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  async createProject(project, accessToken) {
    const response = await axiosInstance.post(
      BASE_URL + "/api/project/init",
      {
        owner: project.owner || "",
        name: project.name || "",
        description: project.description || "",
        image: project.image || "",
        public: project.public == null ? false : project.public,
        github_url: project.github_url || "",
        env_vars: project.env_vars || "",
        services: project.services || [],
        client: project.client || "",
        connection_url: project.connection_url || "",
        server: project.server || "",
        url: project.url || "",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.status === 200
      ? { success: true, message: response.data }
      : { success: false, message: response.data };
  }

  async createProjectFiles(_id, project, accessToken) {
    const response = await axiosInstance.post(
      BASE_URL + "/api/project/createfiles",
      {
        _id: _id,
        github_url: project.github_url || "",
        env_vars: project.env_vars || "",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.status === 200
      ? { success: true, message: response.data }
      : { success: false, message: response.data };
  }

  async updateProject(_id, project, accessToken) {
    const response = await axiosInstance.post(
      BASE_URL + "/api/project/update",
      {
        _id: _id,
        owner: project.owner || "",
        name: project.name || "",
        description: project.description || "",
        image: project.image || "",
        public: project.public == null ? false : project.public,
        github_url: project.github_url || "",
        env_vars: project.env_vars || "",
        client: project.client || "",
        connection_url: project.connection_url || "",
        server: project.server || "",
        url: project.url || "",
        services: project.services || [],
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.status === 200
      ? { success: true, message: response.data }
      : { success: false, message: response.data };
  }

  async deployProject(_id, accessToken) {
    const response = await axiosInstance.post(
      BASE_URL + "/api/project/deploy",
      {
        _id: _id,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.status === 200
      ? { success: true, message: response.data }
      : { success: false, message: response.data };
  }

  async getProject(project_id, accessToken) {
    const response = await axiosInstance.get(
      BASE_URL + `/api/project/${project_id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: (status) => status === 200,
      }
    );
    return response.status === 200
      ? { success: true, data: response.data }
      : { success: false, message: response.data.message };
  }

  async getProjectByName(project_name, accessToken) {
    const response = await axiosInstance.get(
      BASE_URL + `/api/project/name/${project_name}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: (status) => status === 200,
      }
    );
    return response.status === 200
      ? { success: true, data: response.data }
      : { success: false, message: response.data.message };
  }

  // returns {success: true} if successful, {success: false, message: true} if not
  async deleteProject(project_id, accessToken) {
    const response = await axiosInstance.delete(
      BASE_URL + `/api/project/${project_id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: (status) =>
          status === 200 || status === 400 || status === 404,
      }
    );
    return response.status === 200
      ? { success: true }
      : { success: false, message: response.data.message };
  }

  async getAllPublicProjects() {
    const response = await axiosInstance.get(BASE_URL + "/api/project/");
    return response.data;
  }

  async refreshAccessToken() {
    try {
      const response = await axiosInstance.post(BASE_URL + "/api/auth/refresh");
      return response.data.accessToken;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async googleLogin(tokenId) {
    return await axiosInstance
      .post(BASE_URL + "/api/auth/google/login", {
        tokenId: tokenId,
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTeam(teamName, description, owner, accessToken) {
    return await axiosInstance.post(
      BASE_URL + "/api/team",
      {
        teamName: teamName,
        description: description,
        owner: owner,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }

  async deleteTeam(teamName, accessToken, userName) {
    return await axiosInstance.post(
      BASE_URL + `/api/team/${teamName}`,
      {
        username: userName,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }

  async getTeam(teamName, accessToken) {
    return await axiosInstance.get(BASE_URL + `/api/team/${teamName}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  async addTeamMember(teamName, username, accessToken) {
    return await axiosInstance.post(
      BASE_URL + `/api/team/${teamName}/addMember/${username}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }

  async removeTeamMember(teamName, username, accessToken) {
    return await axiosInstance.post(
      BASE_URL + `/api/team/${teamName}/removeMember/${username}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }

  async addTeamProject(teamName, projectName, accessToken, userName) {
    return axiosInstance.post(
      BASE_URL + `/api/team/${teamName}/addProject/${projectName}`,
      {
        username: userName,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }

  async removeTeamProject(teamName, projectName, accessToken, userName) {
    return axiosInstance.post(
      BASE_URL + `/api/team/${teamName}/removeProject/${projectName}`,
      {
        username: userName,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
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

    if (
      error.response?.status === 401 &&
      originalRequest.url !== BASE_URL + "/api/auth/refresh"
    ) {
      try {
        const newAccessToken = await q.refreshAccessToken();

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        window.location.href = "/login";
        console.log(err);
      }
    }

    return Promise.reject(error);
  }
);
