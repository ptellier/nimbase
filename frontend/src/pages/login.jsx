import NavBar from "../components/NavBar";
import '../styles/login.css';
import {useState} from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Query from "../components/Query";

const Login = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let que = new Query();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await que.loginUser(email, password);
            setUser(user);
        } catch (error) {
            console.log("Error in login: ", error);
        }
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