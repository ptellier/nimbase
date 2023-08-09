import {createAsyncThunk} from "@reduxjs/toolkit";

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
