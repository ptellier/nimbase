import NimbaseIcon from "../static/svg/nimbase_icon.svg";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {accessTokenSelector, emailSelector, fetchUserTeams, logout, usernameSelector} from "../state/userSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {GoogleLogout} from "@leecheuk/react-google-login";
import {faChevronDown, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {Box, Hide, HStack, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";

const CLIENT_ID = "821439699286-35djg3u6211rl2a3op9ea06iam9v10hq.apps.googleusercontent.com";
const FONT_SIZES = {base: '16px', sm: '18px', md: '24px'};

const NavBar = () => {
  const username = useSelector(usernameSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector(emailSelector);
  const accessToken = useSelector(accessTokenSelector);

  const onClickLogout = () => {
    dispatch(logout());
    navigate("/");
  }

  const handleTeamsItem = () => {
    navigate("/teams");
    dispatch(fetchUserTeams({username, accessToken}));
  }

  const isGoogleSSO = (username === email);

  return (
      <div className="nav-bar-container">
        <nav className="nav-bar">
          <HStack align="center" justify="center" className="nav-bar-section" spacing={{base: "10px", sm: "30px"}}>
            <Hide below="md">
              <Link to={"/"} className="nav-item"><img src={NimbaseIcon} className="nav-bar-logo" alt="logo"/></Link>
            </Hide>
            <Link to={"/explore"} className="nav-item"><Text fontSize={FONT_SIZES}>Explore</Text></Link>
            {username ?
                <>
                  <Link to={"/project/dashboard"} className="nav-item"><Text fontSize={FONT_SIZES}>Projects</Text></Link>
                </>
                :
                <>
                  <Link to={"/signup"} className="nav-item"><Text fontSize={FONT_SIZES}>Sign-up</Text></Link>
                  <Link to={"/login"} className="nav-item"><Text fontSize={FONT_SIZES}>Login</Text></Link>
                </>
            }
          </HStack>
          {username ?
              <HStack align="center" justify="center" className="nav-bar-section" spacing={{base: "10px", sm: "20px"}}>
                <Box fontSize={{base: "24px", sm: "32px", md: "48px"}}>
                  <FontAwesomeIcon style={{color: "lightpink"}} icon={faCircleUser}/>
                </Box>
                <Menu>
                  <MenuButton
                      transition='all 0.1s'
                      _hover={{color: 'firebrick'}}
                      _expanded={{color: 'slategrey'}}
                      _focus={{}}
                  >
                    <Text fontSize={FONT_SIZES} className="nav-item">{username} <FontAwesomeIcon icon={faChevronDown} size="xs"/></Text>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleTeamsItem}>
                      <Text fontSize={FONT_SIZES}>Teams</Text>
                    </MenuItem>
                    <MenuItem onClick={(isGoogleSSO) ? undefined : onClickLogout}>
                        {(isGoogleSSO) ?
                            <GoogleLogout
                                clientId={CLIENT_ID}
                                buttonText="Logout"
                                onLogoutSuccess={onClickLogout}
                            />
                            :
                            <Text fontSize={FONT_SIZES}>Logout</Text>
                        }
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
              :
              null
          }
        </nav>
      </div>
  );
}

export default NavBar;