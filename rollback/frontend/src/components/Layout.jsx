import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/layout.css";
import user from "../styles/user.png";
import "../styles/search.css";
import ListingLeft from "./createListing";
import ListingRight from "./searchListing";
import Map, {Marker} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';



const Layout = () => {
  
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

      navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    

  console.log(latitude, longitude);

  const MAPBOX_TOKEN = "pk.eyJ1Ijoic2hhZG93YmxhZGUiLCJhIjoiY2xpcG95cHpwMDd3YzNwcXYzaGczaG8wYyJ9.RoPl0NmUU13NQ0ufpfz_nw"
  // const MAPBOX_TOKEN = 'sk.eyJ1Ijoic2hhZG93YmxhZGUiLCJhIjoiY2xpcHExbnN3MDE5MzNxbzFxcHJid252bCJ9.tFTkO4Lch4Ghy1BZ2sULPQ';
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();

  const signOut = async () => {
    navigate("/login");
  };

  const navbar = () => {
    return (
      <nav className="navbar navbar-dark bg-dark justify-content-between navbar-head">
        <a className="navbar-brand">
          {" "}
          <h1>Rollback Project</h1>{" "}
        </a>
        <div className="nav">
          <span className="nav-item">
            <a className="nav-link" href="/" style={{ color: "white" }}>
              {" "}
              Set Location{" "}
            </a>
          </span>
          <button className="btn btn-danger" onClick={signOut}>
            Sign out
          </button>
        </div>
      </nav>
    );
  };

  const CustomMap = () => {
    return (
      <div className="map">
        <Map
          initialViewState={{
            latitude: latitude,
            longitude: longitude,
            zoom: 14
          }}
          className="map"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <Marker longitude={longitude} latitude={latitude} color="red" />
        </Map>
      </div>
    );
  };



  return (
    <div className="App">
      {navbar()}
      <div className="content-area">
        <ListingLeft />
        <CustomMap />
        <ListingRight />
        {/* <Map
      initialViewState={{
        latitude: latitude,
        longitude: longitude,
        zoom: 14
      }}
      style={{width: 800, height: 600}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Marker longitude={longitude} latitude={latitude} color="red" />
    </Map> */}
      {/* insert map */}

      </div>
    </div>
  );
};

export default Layout;
