import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Explore from "./pages/explore";
import Signup from "./pages/signup";
import ProjectDashboard from "./pages/projectDashboard";
import ProjectEdit from "./pages/projectEdit";
import ProjectCreate from './pages/projectCreate';
import ApiTestPage from "./pages/apiTestPage";
import {Provider, useDispatch} from "react-redux";
import {persistor, store} from "./store";
import {refresh} from "./state/userSlice";
import {PersistGate} from "redux-persist/integration/react";
import {ChakraBaseProvider} from "@chakra-ui/react";
import customTheme from "./styles/customChakraTheme";
import Page404 from "./pages/Page404";
import Teams from "./pages/teams";
import ProjectAlerts from "./components/ProjectAlerts";
import {gapi} from "gapi-script";
const CLIENT_ID = "821439699286-35djg3u6211rl2a3op9ea06iam9v10hq.apps.googleusercontent.com";

const InitComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    function start() {
      gapi.client.init({
        'clientId': CLIENT_ID,
        'scope': ""
      })
    }
    gapi.load('client:auth2', start);
  });

  useEffect(() => {
    dispatch(refresh())
  }, [dispatch]);

  return null;
};
const App = () => {
  return (
    <ChakraBaseProvider theme={customTheme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <InitComponent/>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/explore" element={<Explore/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/signup" element={<Signup/>}/>
              <Route exact path="/teams" element={<Teams/>}/>
              <Route exact path="/project" element={<ProjectAlerts/>}>
              <Route exact path="/project/dashboard" element={<ProjectDashboard/>}/>
              <Route exact path="/project/new" element={<ProjectCreate/>}/>
              <Route exact path="/project/edit/:id" element={<ProjectEdit/>}/>
            </Route>
            <Route exact path="/api-test-page" element={<ApiTestPage/>}/>
            <Route exact path="*" element={<Page404/>}/>
          </Routes>
        </Router>
        </PersistGate>
      </Provider>
    </ChakraBaseProvider>
  );
};

export default App;