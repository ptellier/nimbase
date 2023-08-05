import Query from "../components/Query";

export const INITIAL_STATE = {
    accessToken: "",
    username: undefined,
    email: undefined,
    signupError: undefined,
    loginError: undefined,
    teams: [],
    //   members: [],
}

export const query = new Query();
