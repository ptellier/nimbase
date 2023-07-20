import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import NotFound from './pages/NotFound';
import Explore from "./pages/explore";
import Signup from "./pages/signup";
import ProjectDashboard from "./pages/projectDashboard";
import ProjectEdit from "./pages/projectEdit";
import ApiTestPage from "./pages/apiTestPage";
import {Provider} from "react-redux";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/explore" element={<Explore/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/projectDashboard" element={<ProjectDashboard/>}/>
          <Route exact path="/projectNew" element={<ProjectEdit/>}/>
          <Route exact path="/projectEdit/:id" element={<ProjectEdit/>}/>
          <Route exact path="/api-test-page" element={<ApiTestPage/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;