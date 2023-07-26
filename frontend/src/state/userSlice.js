import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import Query from "../components/Query";

const INITIAL_STATE = {
  accessToken: "",
  username: undefined,
  email: undefined,
  signupError: undefined,
  loginError: undefined,
}

const query = new Query();

export const login = createAsyncThunk(
  "user/login",
  async (data) => {
    const response = await query.loginUser(data.username, data.password);
    const payload = response.data
    payload.loginError = response.data.message;
    console.log(payload);
    return payload;
  }
)

export const signup = createAsyncThunk(
  "user/signup",
  async (data) => {
    const responseCreate = await query.createUser(data.firstName, data.lastName, data.username, data.password, data.email);
    if (responseCreate.data.message) {
      const payload = {...INITIAL_STATE};
      payload.signupError = responseCreate.data.message;
      return payload;
    } else {
      const responseLogin = await query.loginUser(data.username, data.password);
      return responseLogin.data;
    }
  }
)

export const logout = createAsyncThunk(
  "user/logout",
  async () => {
    const response = await query.logoutUser();
    return response.data;
  }
)

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
        .addCase(refresh.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
        })
        .addCase(createTeam.fulfilled, (state, action) => {
            state.teamName = action.payload.teamName;
            state.description = action.payload.description;
            state.owner = action.payload.owner;
            state.accessToken = action.payload.accessToken;
        })
        .addCase(addTeamMember.fulfilled, (state, action) => {
            state.members = action.payload.members;
            state.accessToken = action.payload.accessToken;
        })
        .addCase(removeTeamMember.fulfilled, (state, action) => {
            state.members = action.payload.members;
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
            state.members = action.payload.members;
            state.projects = action.payload.projects;
            state.accessToken = action.payload.accessToken;
        })
      .addMatcher(isAnyOf(login.fulfilled, logout.fulfilled, signup.fulfilled),
        (state, action) => {
          state.accessToken = action.payload.accessToken;
          state.username = action.payload.username;
          state.email = action.payload.email;
          state.loginError = action.payload.loginError;
          state.signupError = action.payload.signupError;
        })
        .addMatcher(isAnyOf(createTeam.rejected, getTeam.rejected, addTeamMember.rejected, removeTeamMember.rejected, addTeamProject.rejected, removeTeamProject.rejected),
          (state, action) => {
              console.log("error: thunk rejected; ", action.error.message);
        })
      .addMatcher(isAnyOf(login.rejected, logout.rejected, signup.rejected),
        (state, action) => {
        console.log("error: thunk rejected; ", action.error.message);
      })
  }
})
// refresh async thunk here
export const refresh = createAsyncThunk(
    "user/refresh",
    async (_, thunkAPI) => {
        try {
            const accessToken = await query.refreshAccessToken();
            return { accessToken };
        } catch (error) {
            console.log(error);
            thunkAPI.dispatch(logout());
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const createTeam = createAsyncThunk(
    "team/create",
    async ({teamName, description, owner, accessToken}) => {
        const response = await query.createTeam(teamName, description, owner, accessToken);
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
        const response = await query.addTeamMember(teamName, username, accessToken);
        return response.data;
    }
)

export const removeTeamMember = createAsyncThunk(
    "team/removeMember",
    async ({teamName, username, accessToken}) => {
        const response = await query.removeTeamMember(teamName, username, accessToken);
        return response.data;
    }
)

export const addTeamProject = createAsyncThunk(
    "team/addProject",
    async ({teamName, projectName, accessToken}) => {
        const response = await query.addTeamProject(teamName, projectName, accessToken);
        return response.data;
    }
)

export const removeTeamProject = createAsyncThunk(
    "team/removeProject",
    async ({teamName, projectName, accessToken}) => {
        const response = await query.removeTeamProject(teamName, projectName, accessToken);
        return response.data;
    }
)

export const loginErrorMessageSelector = (state) => state.user.loginError;
export const signupErrorMessageSelector = (state) => state.user.signupError;
export const usernameSelector = (state) => state.user.username;
export const accessTokenSelector = (state) => state.user.accessToken;