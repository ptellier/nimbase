import NimbaseIcon from "../static/svg/nimbase_icon.svg";

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <a><img src={NimbaseIcon} className="nav-bar-logo" alt="logo" /></a>
      <a className="nav-item">Sign-up</a>
      <a className="nav-item">Login</a>
      <a className="nav-item">Explore</a>
    </nav>
  );
}

export default NavBar;