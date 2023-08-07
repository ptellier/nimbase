import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import {
    login,
    logout,
    signup,
    googleLogin, refresh,
} from "./userThunks";
import {
    createTeam,
    deleteTeam,
    getTeam,
    addTeamMember,
    removeTeamMember,
    addTeamProject,
    removeTeamProject,
    fetchUserTeams,
} from "./teamThunks";
import Query from "../components/Query";

export let INITIAL_STATE = {
    accessToken: "",
    username: undefined,
    email: undefined,
    signupError: undefined,
    loginError: undefined,
    teams: [],
}
export const query = new Query();

export const userSlice = createSlice({
    name: "user",
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                if(action.payload.accessToken){
                    state.username = action.payload.username;
                    state.email = action.payload.email;
                    state.accessToken = action.payload.accessToken;
                } else {
                    state.loginError = action.payload.loginError;
                }
            })
            .addCase(signup.fulfilled, (state, action) => {
                if(action.payload.accessToken){
                    state.username = action.payload.username;
                    state.email = action.payload.email;
                    state.accessToken = action.payload.accessToken;
                } else {
                    state.signupError = action.payload.signupError;
                }
            })
            .addCase(logout.fulfilled, (state) => {
                return INITIAL_STATE;
            })
            .addCase(refresh.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                if(action.payload.accessToken){
                    state.username = action.payload.username;
                    state.email = action.payload.email;
                    state.accessToken = action.payload.accessToken;
                } else {
                    state.loginError = action.payload.loginError;
                }
            })
            .addCase(fetchUserTeams.fulfilled, (state, action) => {
                state.teams = action.payload.teams;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.teams.push({
                    teamName: action.payload.teamName,
                    description: action.payload.description,
                    owner: action.payload.owner,
                    members: [],
                    projects: [],
                });
                //state.accessToken = action.payload.accessToken;
            })
            // TODO - figure out how to update the state of the team after deleting a project
            .addCase(deleteTeam.fulfilled, (state, action) => {
                state.teams = state.teams.filter(t => t.teamName !== action.payload.teamName);
            })
            .addCase(getTeam.fulfilled, (state, action) => {
                const team = state.teams.find(t => t.teamName === action.payload.teamName);
                if (team) {
                    team.description = action.payload.description;
                    team.owner = action.payload.owner;
                    team.projects = action.payload.projects;
                }
               // state.accessToken = action.payload.accessToken;
            })
            .addCase(addTeamMember.fulfilled, (state, action) => {
                const team = state.teams.find(t => t.teamName === action.payload.teamName);
                if (team) {
                    team.members.push(action.payload.username);
                }
                //state.accessToken = action.payload.accessToken;
            })
            .addCase(removeTeamMember.fulfilled, (state, action) => {
                const team = state.teams.find(t => t.teamName === action.payload.teamName);
                if (team) {
                    team.members = team.members.filter(m => m !== action.payload.username);
                }
                //state.accessToken = action.payload.accessToken;
            })
            .addCase(addTeamProject.fulfilled, (state, action) => {
                const team = state.teams.find(t => t.teamName === action.payload.teamName);
                if (team) {
                    team.projects.push(action.payload.projectName);
                }
                //state.accessToken = action.payload.accessToken;
            })
            .addCase(removeTeamProject.fulfilled, (state, action) => {
                const team = state.teams.find(t => t.teamName === action.payload.teamName);
                if (team) {
                    team.projects = team.projects.filter(p => p !== action.payload.projectName);
                }
                //state.accessToken = action.payload.accessToken;
            })
            .addMatcher(isAnyOf(login.rejected, logout.rejected, signup.rejected, googleLogin.rejected, refresh.rejected),
                (state, action) => {
                    console.log("error: thunk rejected; ", action.error.message);
                });
    }
})

// export const userSlice = createSlice({
//     name: "user",
//     initialState: INITIAL_STATE,
//     extraReducers: (builder) => {
//         builder
//             .addCase(logout.fulfilled, (state) => {
//                 state.accessToken = "";
//                 state.username = undefined;
//                 state.email = undefined;
//                 state.loginError = undefined;
//                 state.signupError = undefined;
//                 state.teams = [];
//             })
//             .addCase(fetchUserTeams.fulfilled, (state, action) => {
//                 state.teams = action.payload.teams;
//             })
//             .addCase(signup.fulfilled, (state, action) => {
//                 if(action.payload.accessToken){
//                     state.username = action.payload.username;
//                     state.email = action.payload.email;
//                     state.accessToken = action.payload.accessToken;
//                 } else {
//                     state.signupError = action.payload.signupError;
//                 }
//             })
//             .addCase(refresh.fulfilled, (state, action) => {
//                 state.accessToken = action.payload.accessToken;
//             })
//             .addCase(createTeam.fulfilled, (state, action) => {
//                 state.teamName = action.payload.teamName;
//                 state.description = action.payload.description;
//                 state.owner = action.payload.owner;
//                 state.accessToken = action.payload.accessToken;
//             })
//             .addCase(removeTeamMember.fulfilled, (state, action) => {
//                 state.accessToken = action.payload.accessToken;
//             })
//             .addCase(addTeamProject.fulfilled, (state, action) => {
//                 state.projects = action.payload.projects;
//                 state.accessToken = action.payload.accessToken;
//             })
//             .addCase(removeTeamProject.fulfilled, (state, action) => {
//                 state.projects = action.payload.projects;
//                 state.accessToken = action.payload.accessToken;
//             })
//             .addCase(getTeam.fulfilled, (state, action) => {
//                 state.teamName = action.payload.teamName;
//                 state.description = action.payload.description;
//                 state.owner = action.payload.owner;
//                 state.projects = action.payload.projects;
//                 state.accessToken = action.payload.accessToken;
//             })
//             .addMatcher(isAnyOf(login.fulfilled, logout.fulfilled, signup.fulfilled, googleLogin.fulfilled),
//                 (state, action) => {
//                     state.accessToken = action.payload.accessToken;
//                     state.username = action.payload.username;
//                     state.email = action.payload.email;
//                     state.loginError = action.payload.loginError;
//                     state.signupError = action.payload.signupError;
//                 })
//             .addMatcher(isAnyOf(login.rejected, logout.rejected, signup.rejected),
//                 (state, action) => {
//                     console.log("error: thunk rejected; ", action.error.message);
//                 });
//     }
// })

export const loginErrorMessageSelector = (state) => state.user.loginError;
export const signupErrorMessageSelector = (state) => state.user.signupError;
export const usernameSelector = (state) => state.user.username;
export const teamsSelector = (state) => state.user.teams;
export const emailSelector = (state) => state.user.email;
export const accessTokenSelector = (state) => state.user.accessToken;

export {refresh, logout, login, googleLogin, signup} from "./userThunks";
export {addTeamMember, removeTeamMember, fetchUserTeams, createTeam, deleteTeam, addTeamProject, removeTeamProject} from "./teamThunks";