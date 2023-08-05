import NimbaseIcon from "../static/svg/nimbase_icon.svg";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {emailSelector, logout, usernameSelector} from "../state/userSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {GoogleLogout} from "react-google-login";
const CLIENT_ID = "821439699286-35djg3u6211rl2a3op9ea06iam9v10hq.apps.googleusercontent.com";

const NavBar = () => {
  const username = useSelector(usernameSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector(emailSelector);

  const onClickLogout = () => {
    dispatch(logout());
    navigate("/");
  }

  return (
    <div className="nav-bar-container">
      <nav className="nav-bar">
        <div className="nav-bar-section">
          <Link to={"/"} className="nav-item"><img src={NimbaseIcon} className="nav-bar-logo" alt="logo"/></Link>
          <Link to={"/explore"} className="nav-item">Explore</Link>
          {username ?
            <Link to={"/project/dashboard"} className="nav-item">Projects</Link>
            :
            <>
              <Link to={"/signup"} className="nav-item">Sign-up</Link>
              <Link to={"/login"} className="nav-item">Login</Link>
            </>
          }
        </div>
        {username ?
          <div className="nav-bar-section">
            <>
              <div className="nav-text">{username}</div>
              <h1><FontAwesomeIcon style={{color: "lightpink"}} icon={faCircleUser} size="xl"/></h1>
              {username !== email ? <div className="nav-item" onClick={onClickLogout}> Logout</div> :
                  <GoogleLogout
                        clientId={CLIENT_ID}
                        buttonText="Logout"
                        onLogoutSuccess={onClickLogout}
                    />}
            </>
          </div>
          :
          null
        }
      </nav>
    </div>
  );
}

export default NavBar;