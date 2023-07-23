import NavBar from "../components/NavBar";
import '../styles/login.css';
import {useState} from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Field from "../components/Field";
import {useDispatch, useSelector} from "react-redux";
import {loginErrorMessageSelector, login} from "../state/userSlice";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {Button} from "@chakra-ui/react";
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
                navigate("/projectDashboard");
            }
        });
    };

    const handleGithubLogin = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=0ed3bca2eb2b455e8aed&scope=user`;
        window.location.href = githubAuthUrl
        console.log("Logging in with Github");
    }

  return (
    <div className="background-image">
      <NavBar/>
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
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
                        <Button variant="customDefault" utton id="login-button" type="submit">Log In</Button>
                        <Button variant="customDefault"  onClick={handleGithubLogin}>
                            <FontAwesomeIcon icon={faGithub}/> Log in with GitHub
                        </Button>
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