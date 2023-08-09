import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/layout.css";
import "../styles/search.css";
import axios from "axios";
import { useMap } from "react-map-gl";
import CreateListing from "./CreateListing";

export default function Navbar() {
    const navigate = useNavigate();
    const { mymap } = useMap();
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
    });

    const signOut = async () => {
        const result = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/logout`,
            {
                withCredentials: true,
            }
        );
        localStorage.setItem("isLogged", result.data.isAuth);
        navigate("/login");
    };

    const setLocation = () => {
        mymap.easeTo({
            center: [longitude, latitude],
            zoom: 14,
            duration: 1000,
        });
    };

    return (
        <nav className="navbar navbar-dark bg-dark justify-content-between navbar-head">
            <div className="navbar-brand">
                {" "}
                <h1>Rollback Project</h1>
            </div>
            <div className="nav">
                <span className="nav-item">
                    <button
                        className="btn btn-secondary"
                        style={{ marginRight: "15px" }}
                        onClick={() => setLocation()}
                    >
                        Set Location
                    </button>
                </span>
                <span className="nav-item">
                    <CreateListing />
                </span>
                <button className="btn btn-danger" onClick={signOut}>
                    Sign out
                </button>
            </div>
        </nav>
    );
}
