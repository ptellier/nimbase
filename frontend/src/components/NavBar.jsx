import NimbaseIcon from "../static/svg/nimbase_icon.svg";
import {Link} from "react-router-dom";

const NavBar = ({user}) => {
  return (
    <div className="nav-bar-container">
      <nav className="nav-bar">
          <Link to={"/"} className="nav-item"><img src={NimbaseIcon} className="nav-bar-logo" alt="logo" /></Link>
          <Link to={"/explore"} className="nav-item">Explore</Link>
          {user ? (
              <>
                  <div>Welcome, {user.username}</div>
                  <Link to={"/logout"} className="nav-item">Logout</Link>
              </>
          ) : (
              <>
                  <Link to={"/signup"} className={"nav-item"}>Sign-up</Link>
                  <Link to={"/login"} className="nav-item">Login</Link>
              </>
          )}
      </nav>
    </div>
  );
}

export default NavBar;