import NavBar from "../components/NavBar";
import '../styles/login.css';
import {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Field from "../components/Field";
import {useDispatch, useSelector} from "react-redux";
import {loginErrorMessageSelector, login, googleLogin} from "../state/userSlice";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {Button, Heading} from "@chakra-ui/react";
import {GoogleLogin} from "@leecheuk/react-google-login";
const CLIENT_ID= process.env.REACT_APP_GOOGLE_CLIENT_ID;
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const errorMessage = useSelector(loginErrorMessageSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login({username, password})).then((res) => {
            if (res.payload) {
                navigate("/project/dashboard");
            }
        });
    };

    const onSuccess = (res) => {
        const tokenId = res.tokenId;
        dispatch(googleLogin({tokenId})).then((res) => {
            if (res.payload) {
                navigate("/project/dashboard");
            }
        });
    }

    const onFailure = (res) => {
        navigate("/");
    }

  return (
    <div className="background-image">
      <NavBar/>
        <div className="login-container">
            <div className="login-box">
                <Heading as="h1" fontSize="32px" fontWeight={500}>Login</Heading>
                {(errorMessage) ?
                  <div className="error-text"><FontAwesomeIcon icon={faTriangleExclamation} /> {errorMessage}</div>
                  :
                    null}
                <form onSubmit={handleSubmit}>
                    <Field label="Username" type="text" name="loginUsername" value={username}
                           onChange={(e) => setUsername(e.target.value)} error={false} autoComplete="username"/>
                    <Field label="Password" type="password" name="loginPassword" value={password}
                           onChange={(e) => setPassword(e.target.value)} error={false} autoComplete="current-password"/>
                    <div id="login-button-box">
                        <Button variant="customDefault" id="login-button" type="submit">Log In</Button>
                        <GoogleLogin
                            clientId={CLIENT_ID}
                            buttonText="Login With Google"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={false}
                        />
                    </div>
                </form>
                <p>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    </div>
  );
}

export default Login;