import React from "react";

import Form from "./components/form";
import List from "./components/list";
import Item from "./components/item";
import Navigation from "./components/nav";
import Stat from "./components/stat";

import "./App.css";

import Login from './components/Login';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from "./components/protectedRoutes";

function App() {
  return (
<>    
<Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoutes/>}>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<Missing />} />
          </Route>
        </Route>
    </Routes>
    </>
  );
}

export default App;
