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

function App() {
  return (
<>    
<Routes>
        {/* <Navigation />
        <div className="main">
          <div className="col">
            <Form /> <br />
            <Stat />
          </div>
          <div className="col">
            <List />
          </div>
          <Item />
        </div> */}
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Layout />}>
          <Route path="*" element={<Missing />} />
        </Route>
    </Routes>
    </>
  );
}

export default App;
