import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signinup.css";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const userRefL = useRef();
    const errRefL = useRef();
    const [userL, setUserL] = useState("");
    const [pwdL, setPwdL] = useState("");
    const [errMsgL, setErrMsgL] = useState("");
    const [slider, setSlider] = useState(false);
    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd, address, zip, city, country]);

    var signinForm = () => {
        return (
            <div className={`${modal ? "showform" : "hideform"} form1`}>
                {errMsgL ? (
                    <div
                        ref={errRefL}
                        className="alert alert-danger"
                        role="alert"
                    >
                        {errMsgL}
                    </div>
                ) : null}
                <h2>Sign In</h2>
                <form>
                    <div className="form-group">
                        <label className="form-label" htmlFor="usernameL">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="usernameL"
                            ref={userRefL}
                            autoComplete="off"
                            onChange={(e) => setUserL(e.target.value)}
                            value={userL}
                            required
                            placeholder="Enter Username"
                        />
                        <small id="emailHelp" className="form-text text-muted">
                            We'll never share your information with anyone else.
                        </small>
                    </div>
                    <br />
                    <div className="form-group">
                        <label className="form-label" htmlFor="passwordL">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordL"
                            onChange={(e) => setPwdL(e.target.value)}
                            value={pwdL}
                            required
                            placeholder="Password"
                        />
                    </div>
                    <div className="form-check"></div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                    <br />
                    <br />
                    <small id="emailHelp" className="alert alert-light">
                        New User? &nbsp; &nbsp;
                        <button
                            type="button"
                            className="btn btn-dark btn-sm"
                            onClick={() => {
                                setSlider(true);
                                setUserL("");
                                setPwdL("");
                            }}
                        >
                            Register
                        </button>
                    </small>
                </form>
            </div>
        );
    };

    var signupForm = () => {
        return (
            <div className={`${modal ? "showform" : "hideform"} form2`}>
                {errMsg ? (
                    <div
                        ref={errRef}
                        className="alert alert-danger"
                        role="alert"
                    >
                        {errMsg}
                    </div>
                ) : null}
                <h2>Sign Up</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    ref={userRef}
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                    placeholder="Username"
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        <br />

                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputAddress">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputAddress"
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={address}
                                    required
                                    placeholder="Address"
                                />
                            </div>
                        </div>

                        <br />
                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputZip">Postal Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputZip"
                                    ref={userRef}
                                    onChange={(e) => setZip(e.target.value)}
                                    value={zip}
                                    required
                                    placeholder="Zip Code"
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="inputCity">City</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputCity"
                                    onChange={(e) => setCity(e.target.value)}
                                    value={city}
                                    required
                                    placeholder="City"
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="inputCountry">Country</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputCountry"
                                    onChange={(e) => setCountry(e.target.value)}
                                    value={country}
                                    required
                                    placeholder="Country"
                                />
                            </div>
                        </div>
                    </div>

                    <br />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleRegister}
                    >
                        Sign up
                    </button>
                    <br />
                    <br />
                    <small id="emailHelp" className="alert alert-light">
                        Already a User? &nbsp; &nbsp;{" "}
                        <button
                            type="button"
                            className="btn btn-dark btn-sm"
                            onClick={() => {
                                setSlider(false);
                                setUser("");
                                setPwd("");
                                setAddress("");
                                setZip("");
                                setCity("");
                                setCountry("");
                            }}
                        >
                            Login
                        </button>
                    </small>
                </form>
            </div>
        );
    };

    useEffect(() => {
        setErrMsgL("");
    }, [userL, pwdL]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/login`,
                { username: userL, password: pwdL },
                { withCredentials: true }
            );
            console.log(result.data);
            localStorage.setItem("isLogged", result.data.isAuth);
            localStorage.setItem("username", userL);
            navigate("/");
        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsgL("No Server Response");
            } else if (err.response?.status === 401) {
                setErrMsgL("Invalid Credentials");
            } else {
                setErrMsgL("Login Failed");
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/register`,
                {
                    username: user,
                    password: pwd,
                    address: address,
                    zip: zip,
                    city: city,
                    country: country,
                },
                { withCredentials: true }
            );
            console.log(result.data);
            setSlider(false);
            setUser("");
            setPwd("");
            setAddress("");
            setZip("");
            setCity("");
            setCountry("");
        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Username Taken");
            } else {
                setErrMsg("Registration Failed");
            }
        }
    };

    const [modal, setModal] = useState(false);
    return (
        <div className="landing-container">
            <div
                className={`${modal ? "rectangle" : "circle"} glass`}
                onClick={() => setModal(true)}
            >
                <div className={` form-container`}>
                    {signinForm()}
                    {signupForm()}
                </div>
                <h1 className={`${modal ? "notdisplay" : "display"} welcome`}>
                    Welcome
                </h1>

                <div
                    className={`${slider ? "left" : "right"} slider ${
                        modal ? "showform" : "hideform"
                    } ${modal ? "display" : "notdisplay"} ${
                        modal ? "rectangle" : "circle"
                    }`}
                ></div>
            </div>
        </div>
    );
};

export default Login;
