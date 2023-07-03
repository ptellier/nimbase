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
  async (username) => {
    const response = await query.logoutUser(username);
    return response.data;
  }
)

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(login.fulfilled, logout.fulfilled, signup.fulfilled),
        (state, action) => {
          state.accessToken = action.payload.accessToken;
          state.username = action.payload.username;
          state.email = action.payload.email;
          state.loginError = action.payload.loginError;
          state.signupError = action.payload.signupError;
        })
      .addMatcher(isAnyOf(login.rejected, logout.rejected, signup.rejected),
        (state, action) => {
        console.log("error: thunk rejected; ", action.error.message);
      });
  }
})

export const loginErrorMessageSelector = (state) => state.user.loginError;
export const signupErrorMessageSelector = (state) => state.user.signupError;