import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import Query from "../components/Query";

const INITIAL_STATE = {
  accessToken: "",
  username: undefined,
  email: undefined,
  error: undefined,
}

const query = new Query();

export const login = createAsyncThunk(
  "user/login",
  async (data) => {
    const response = await query.loginUser(data.username, data.password);
    console.log(response.data);
    return response.data;
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
      .addMatcher(isAnyOf(login.fulfilled, logout.fulfilled),
        (state, action) => {
          state.accessToken = action.payload.accessToken;
          state.username = action.payload.username;
          state.email = action.payload.email;
          state.error = action.payload.message;
        })
  }
})

export const errorMessageSelector = (state) => state.user.error;