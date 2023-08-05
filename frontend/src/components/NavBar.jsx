import NimbaseIcon from "../static/svg/nimbase_icon.svg";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, usernameSelector} from "../state/userSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {Box, Hide, HStack, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";

const FONT_SIZES = {base: '16px', sm: '18px', md: '24px'};

const NavBar = () => {
  const username = useSelector(usernameSelector);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    dispatch(logout());
  }

  return (
    <div className="nav-bar-container">
      <nav className="nav-bar">
        <HStack align="center" justify="center" className="nav-bar-section" spacing={{base: "10px", sm: "30px"}}>
          <Hide below="md">
            <Link to={"/"} className="nav-item"><img src={NimbaseIcon} className="nav-bar-logo" alt="logo"/></Link>
          </Hide>
          <Link to={"/explore"} className="nav-item"><Text fontSize={FONT_SIZES}>Explore</Text></Link>
          {username ?
            <Link to={"/project/dashboard"} className="nav-item"><Text fontSize={FONT_SIZES}>Projects</Text></Link>
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
                <MenuItem onClick={onClickLogout}>Logout</MenuItem>

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