import NimbaseIcon from "../static/svg/nimbase_icon.svg";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, usernameSelector} from "../state/userSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";

const NavBar = () => {
  const username = useSelector(usernameSelector);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logout());
  }

  return (
    <div className="nav-bar-container">
      <nav className="nav-bar">
        <div className="nav-bar-section">
          <Link to={"/"} className="nav-item"><img src={NimbaseIcon} className="nav-bar-logo" alt="logo"/></Link>
          <Link to={"/explore"} className="nav-item">Explore</Link>
          {username ?
            <Link to={"/projectDashboard"} className="nav-item">Projects</Link>
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
              <div className="nav-text">{username}</div><FontAwesomeIcon icon={faUser} size="xl"/>
              <div className="nav-item" onClick={onClickLogout}> Logout</div>
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