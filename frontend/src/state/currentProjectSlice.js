import { createSlice } from "@reduxjs/toolkit";
import { initProject, resetProject } from "./projectThunks";
import Query from "../components/Query";
export { initProject, resetProject } from "./projectThunks";

export let INITIAL_STATE = {
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

export const query = new Query();

export const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(initProject.fulfilled, (state, action) => {
        state._id = action.payload._id;
        state.owner = action.payload.owner;
        state.name = action.payload.name;
        state.description = action.payload.description;
        state.image = action.payload.image;
        state.public = action.payload.public;
        state.github_url = action.payload.github_url;
        state.env_vars = action.payload.env_vars;
        state.client = action.payload.client;
        state.connection_url = action.payload.connection_url;
        state.server = action.payload.server;
        state.url = action.payload.url;
        state.services = action.payload.services;
      })
      .addCase(resetProject.fulfilled, (state, action) => {
        state._id = action.payload._id;
        state.owner = action.payload.owner;
        state.name = action.payload.name;
        state.description = action.payload.description;
        state.image = action.payload.image;
        state.public = action.payload.public;
        state.github_url = action.payload.github_url;
        state.env_vars = action.payload.env_vars;
        state.client = action.payload.client;
        state.connection_url = action.payload.connection_url;
        state.server = action.payload.server;
        state.url = action.payload.url;
        state.services = action.payload.services;
      });
  },
});

export const currentProjectSelector = (state) => state.currentProject;
