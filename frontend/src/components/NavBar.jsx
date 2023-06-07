import NimbaseIcon from "../static/svg/nimbase_icon.svg";
import {Link} from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav-bar">
        <Link to={"/"} className="nav-item"><a><img src={NimbaseIcon} className="nav-bar-logo" alt="logo" /></a></Link>
        <Link to={"/signup"} className={"nav-item"}>Sign-up</Link>
        <Link to={"/login"} className="nav-item">Login</Link>
        <Link to={"/explore"} className="nav-item">Explore</Link>
    </nav>
  );
}

export default NavBar;