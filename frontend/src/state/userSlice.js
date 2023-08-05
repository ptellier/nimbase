import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import {INITIAL_STATE} from "./initialState";
import {
    login,
    logout,
    signup,
    refresh,
    googleLogin,
} from "./userThunks";
import {
    createTeam,
    getTeam,
    addTeamMember,
    removeTeamMember,
    addTeamProject,
    removeTeamProject, fetchUserTeams,
} from "./teamThunks";

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = "";
        state.username = undefined;
        state.email = undefined;
        state.loginError = undefined;
        state.signupError = undefined;
        state.teams = [];
      })
        .addCase(fetchUserTeams.fulfilled, (state, action) => {
            state.teams = action.payload.teams;
            state.accessToken = action.payload.accessToken;
        })
        // .addCase(fetchTeammates.fulfilled, (state, action) => {
        //     state.members = action.payload.teams;
        //     state.accessToken = action.payload.accessToken;
        // })
        .addCase(signup.fulfilled, (state, action) => {
            if(action.payload.accessToken){
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.accessToken = action.payload.accessToken;
            } else {
                state.signupError = action.payload.signupError;
            }
        })
        .addCase(refresh.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
        })
        .addCase(createTeam.fulfilled, (state, action) => {
            state.teamName = action.payload.teamName;
            state.description = action.payload.description;
            state.owner = action.payload.owner;
            state.accessToken = action.payload.accessToken;
        })
        // .addCase(addTeamMember.fulfilled, (state, action) => {
        //    // state.members = action.payload.members;
        //     state.accessToken = action.payload.accessToken;
        // })
        .addCase(removeTeamMember.fulfilled, (state, action) => {
          //  state.members = action.payload.members;
            state.accessToken = action.payload.accessToken;
        })
        .addCase(addTeamProject.fulfilled, (state, action) => {
            state.projects = action.payload.projects;
            state.accessToken = action.payload.accessToken;
        })
        .addCase(removeTeamProject.fulfilled, (state, action) => {
            state.projects = action.payload.projects;
            state.accessToken = action.payload.accessToken;
        })
        .addCase(getTeam.fulfilled, (state, action) => {
            state.teamName = action.payload.teamName;
            state.description = action.payload.description;
            state.owner = action.payload.owner;
           // state.members = action.payload.members;
            state.projects = action.payload.projects;
            state.accessToken = action.payload.accessToken;
        })
        .addMatcher(isAnyOf(login.fulfilled, logout.fulfilled, signup.fulfilled, googleLogin.fulfilled),
            (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.loginError = action.payload.loginError;
                state.signupError = action.payload.signupError;
          // if(!state.teams[action.payload.username]){
          //     state.teams[action.payload.username] = []; // TODO this thing fucking sucks
          // }
        })
      .addMatcher(isAnyOf(login.rejected, logout.rejected, signup.rejected),
        (state, action) => {
        console.log("error: thunk rejected; ", action.error.message);
      });
  }
})
