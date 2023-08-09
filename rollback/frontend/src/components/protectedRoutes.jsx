import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
    let isAuth = localStorage.getItem("isLogged");
    return isAuth !== "true" ? <Navigate to="/login" /> : <Outlet />;
}
