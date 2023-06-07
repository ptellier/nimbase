import NavBar from "../components/NavBar";
import '../styles/login.css';
import {useState} from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleGithubLogin = () => {
        console.log("Logging in with Github");
    }

  return (
    <div className="background-image">
      <NavBar/>
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Log In</button>
                </form>

                <button onClick={handleGithubLogin}>
                    <FontAwesomeIcon icon={faGithub}/> Log in with GitHub
                </button>
                <h4>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </h4>
            </div>
        </div>
    </div>
  );
}

export default Login;