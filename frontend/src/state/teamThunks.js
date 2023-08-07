import {createAsyncThunk} from "@reduxjs/toolkit";
import {query} from "./userSlice";

export const fetchUserTeams = createAsyncThunk(
    "user/fetchTeams",
    async ({ username, accessToken }) => {
        const response = await query.getUserTeams(username, accessToken);
        //console.log('inside fetch', response)
        return {
            teams: response.data
        };
    }
);

export const createTeam = createAsyncThunk(
    "team/create",
    async ({teamName, description, owner, accessToken}) => {
        const response = await query.createTeam(teamName, description, owner, accessToken);
        return response.data;
    }
)

export const deleteTeam = createAsyncThunk(
    "team/delete",
    async ({teamName, accessToken, userName}) => {
        const response = await query.deleteTeam(teamName, accessToken, userName);
        return response.data;
    }
)

export const getTeam = createAsyncThunk(
    "team/get",
    async ({teamName, accessToken}) => {
        const response = await query.getTeam(teamName, accessToken);
        return response.data;
    }
)

export const addTeamMember = createAsyncThunk(
    "team/addMember",
    async ({teamName, username, accessToken}) => {
        console.log('inside addTeamMember thunk - team', teamName)
        console.log('inside addTeamMember thunk - member', username)
        console.log('inside addTeamMember thunk - token', accessToken)

        const response = await query.addTeamMember(teamName, username, accessToken);
        return response.data;
    }
)

export const removeTeamMember = createAsyncThunk(
    "team/removeMember",
    async ({teamName, username, accessToken}) => {
        console.log('inside RemoveTeamMember thunk - team', teamName)
        console.log('inside RemoveTeamMember thunk - member', username)
        console.log('inside RemoveTeamMember thunk - token', accessToken)
        const response = await query.removeTeamMember(teamName, username, accessToken);
        return response.data;
    }
)

export const addTeamProject = createAsyncThunk(
    "team/addProject",
    async ({teamName, projectName, accessToken, userName}) => {
        const response = await query.addTeamProject(teamName, projectName, accessToken, userName);
        return response.data;
    }
)

export const removeTeamProject = createAsyncThunk(
    "team/removeProject",
    async ({teamName, projectName, accessToken, userName}) => {
        const response = await query.removeTeamProject(teamName, projectName, accessToken, userName);
        return response.data;
    }
)