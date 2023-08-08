import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom'
import { accessTokenSelector } from "../state/userSlice";

const ProtectedRoutes = () => {
    const accessToken = useSelector(accessTokenSelector);
    return(
        accessToken ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default ProtectedRoutes;
