import NimbaseIcon from "../static/svg/nimbase_icon.svg";
import {Link} from "react-router-dom";

const NavBar = ({user}) => {
  return (
      <nav className="nav-bar">
          <Link to={"/"} className="nav-item"><a><img src={NimbaseIcon} className="nav-bar-logo" alt="logo" /></a></Link>
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
  );
}

export default NavBar;