import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/layout.css";
import "../styles/search.css";
import ListingLeft from "./createListing";
import ListingRight from "./searchListing";

import axios from "axios";
import Maps from "./mapMain/maps";
import { MapProvider } from "react-map-gl";

import Navbar from "./Navbar";

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        const result = await axios.get("http://localhost:8080/verify", {
          withCredentials: true,
        });
        console.log(result.data);
        if (!result.data.isAuth) {
          localStorage.setItem("isLogged", false);
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
        localStorage.setItem("isLogged", false);
        navigate("/login");
      }
    }
    verify();
  }, []);

  return (
    <div className="App">
      <MapProvider>
        <Navbar />
        <div className="content-area">
          <ListingLeft />
          <Maps />
          <ListingRight />
        </div>
      </MapProvider>
    </div>
  );
};

export default Layout;
