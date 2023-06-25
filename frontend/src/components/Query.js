import axios from "axios";

const BASE_URL = 'http://localhost:8080';

class Query {

  async createUser(username, password, email) {
    return await axios.post(BASE_URL + '/api/register', {
      username: username,
      password: password,
      email: email,
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
    }).catch((err) => {console.log(err)});
  }

  // logout user
  async logoutUser(username) {
    try {
      return await axios.post(BASE_URL + '/api/auth/logout', {
        username: username
      });
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
    return Promise.resolve({
      data: [
        {
          id: 1,
          title: 'Project 1',
          imageUrl: 'https://picsum.photos/200/300', // a placeholder image URL
          description: 'This is the description for Project 1.',
        },
        {
          id: 2,
          title: 'Project 2',
          imageUrl: 'https://picsum.photos/200/301', // a placeholder image URL
          description: 'This is the description for Project 2.',
        },
        {
          id: 3,
          title: 'Project 3',
          imageUrl: 'https://picsum.photos/200/3000', // a placeholder image URL
          description: 'This is the description for Project 3.',
        },
        {
          id: 4,
          title: 'Project 4',
          imageUrl: 'https://picsum.photos/200/4', // a placeholder image URL
          description: 'This is the description for Project 2.',
        },
        {
          id: 5,
          title: 'Project 5',
          imageUrl: 'https://picsum.photos/200/201', // a placeholder image URL
          description: 'This is the description for Project 2.',
        },
        {
          id: 6,
          title: 'Project 6',
          imageUrl: 'https://picsum.photos/200/202', // a placeholder image URL
          description: 'This is the description for Project 2.',
        },
        {
          id: 7,
          title: 'Project 7',
          imageUrl: 'https://picsum.photos/200/203', // a placeholder image URL
          description: 'This is the description for Project 2.',
        },
        // add more
      ],
    });
  }

}

export default Query;



