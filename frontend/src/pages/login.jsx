import NavBar from "../components/NavBar";
import '../styles/login.css';
import {useState} from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Query from "../components/Query";
import Field from "../components/Field";
import {useDispatch, useSelector} from "react-redux";
import {errorMessageSelector, login} from "../state/userSlice";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const errorMessage = useSelector(errorMessageSelector);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login({username, password}));
    };

    const handleGithubLogin = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=0ed3bca2eb2b455e8aed&scope=user`;
        window.location.href = githubAuthUrl
        console.log("Logging in with Github");
    }

  return (
    <div className="background-image">
      <NavBar user={user}/>
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
                    <Field label="Password" type="text" name="loginPassword" value={password}
                           onChange={(e) => setPassword(e.target.value)} error={false} autoComplete="current-password"/>
                    <div id="login-button-box">
                        <button id="login-button" type="submit">Log In</button>
                        <button onClick={handleGithubLogin}>
                            <FontAwesomeIcon icon={faGithub}/> Log in with GitHub
                        </button>
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