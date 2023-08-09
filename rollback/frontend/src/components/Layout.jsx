import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/layout.css";
import "../styles/search.css";
import SearchListing from "./SearchListing";
import Navbar from "./Navbar";
import axios from "axios";
import Maps from "./mapMain/maps";
import { MapProvider } from "react-map-gl";

const Layout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        async function verify() {
            try {
                const result = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/verify`,
                    {
                        withCredentials: true,
                    }
                );
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
                    <Maps />
                    <SearchListing />
                </div>
            </MapProvider>
        </div>
    );
};

export default Layout;
