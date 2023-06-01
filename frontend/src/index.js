import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/layout.css'
import reportWebVitals from './reportWebVitals';
import Home from "./pages/home";
import Explore from "./pages/explore";
import Login from "./pages/login";
import ProjectDashboard from "./pages/projectDashboard";
import ProjectEdit from "./pages/projectEdit";
import Signup from "./pages/signup";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
