import {createAsyncThunk} from "@reduxjs/toolkit";
import {query} from "./currentProjectSlice";

export const initProject = createAsyncThunk(
    "project/init",
    async (project) => {
        return {
            _id: project._id,
            owner: project.owner,
            name: project.name,
            description: project.description,
            image: project.image,
            public: project.public,
            github_url: project.github_url,
            env_vars: project.env_vars,
            client: project.client,
            connection_url: project.connection_url,
            server: project.server,
            url: project.url,
            services: project.services,
        };
    }
);

export const resetProject = createAsyncThunk(
    "project/reset",
    async () => {
        return {
            _id: null,
            owner: null,
            name: null,
            description: null,
            image: null,
            public: null,
            github_url: null,
            env_vars: null,
            client: null,
            connection_url: null,
            server: null,
            url: null,
            services: [],
        };
    }
);

// export const createTeam = createAsyncThunk(
//     "team/create",
//     async ({teamName, description, owner, accessToken}) => {
//         const response = await query.createTeam(teamName, description, owner, accessToken);
//         return response.data;
//     }
// )

// export const getTeam = createAsyncThunk(
//     "team/get",
//     async ({teamName, accessToken}) => {
//         const response = await query.getTeam(teamName, accessToken);
//         return response.data;
//     }
// )

// export const addTeamMember = createAsyncThunk(
//     "team/addMember",
//     async ({teamName, username, accessToken}) => {
//         console.log('inside addTeamMember thunk - team', teamName)
//         console.log('inside addTeamMember thunk - member', username)
//         console.log('inside addTeamMember thunk - token', accessToken)

//         const response = await query.addTeamMember(teamName, username, accessToken);
//         return response.data;
//     }
// )

// export const removeTeamMember = createAsyncThunk(
//     "team/removeMember",
//     async ({teamName, username, accessToken}) => {
//         console.log('inside RemoveTeamMember thunk - team', teamName)
//         console.log('inside RemoveTeamMember thunk - member', username)
//         console.log('inside RemoveTeamMember thunk - token', accessToken)
//         const response = await query.removeTeamMember(teamName, username, accessToken);
//         return response.data;
//     }
// )

// export const addTeamProject = createAsyncThunk(
//     "team/addProject",
//     async ({teamName, projectName, accessToken, userName}) => {
//         const response = await query.addTeamProject(teamName, projectName, accessToken, userName);
//         return response.data;
//     }
// )

// export const removeTeamProject = createAsyncThunk(
//     "team/removeProject",
//     async ({teamName, projectName, accessToken, userName}) => {
//         const response = await query.removeTeamProject(teamName, projectName, accessToken, userName);
//         return response.data;
//     }
// )