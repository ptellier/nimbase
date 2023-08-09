import React from "react";
import "./App.css";
import Login from "./components/Login";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/protectedRoutes";

function App() {
    return (
        <>
          <Routes>
              <Route path="login" element={<Login />} />
              <Route element={<ProtectedRoutes />}>
                  <Route path="/" element={<Layout />} />
                  <Route path="*" element={<h1>404 Not Found</h1>} />
              </Route>
          </Routes>
        </>
    );
}

export default App;
