import { createAsyncThunk } from "@reduxjs/toolkit";
import { INITIAL_STATE, query } from "./userSlice";

export const login = createAsyncThunk("user/login", async (data) => {
  const response = await query.loginUser(data.username, data.password);
  const payload = response.data;
  payload.loginError = response.data.message;
  return payload;
});

export const signup = createAsyncThunk("user/signup", async (data) => {
  const responseCreate = await query.createUser(
    data.firstName,
    data.lastName,
    data.username,
    data.password,
    data.email
  );
  if (responseCreate.data.message) {
    const payload = { ...INITIAL_STATE };
    payload.signupError = responseCreate.data.message;
    return payload;
  } else {
    const responseLogin = await query.loginUser(data.username, data.password);
    return responseLogin.data;
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  const response = await query.logoutUser();
  return response.data;
});

export const refresh = createAsyncThunk("user/refresh", async (_, thunkAPI) => {
  try {
    const accessToken = await query.refreshAccessToken();
    return { accessToken };
  } catch (error) {
    console.log(error);
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (data) => {
    const response = await query.googleLogin(data.tokenId);
    return response.data;
  }
);
