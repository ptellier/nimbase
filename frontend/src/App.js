import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import NotFound from './pages/NotFound';
import Explore from "./pages/explore";
import Signup from "./pages/signup";
import ApiTestPage from "./pages/apiTestPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/explore" element={<Explore />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/api-test-page" element={<ApiTestPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;