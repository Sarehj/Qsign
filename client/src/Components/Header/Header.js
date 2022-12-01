import { NavLink } from "react-router-dom";
import { useState } from "react";
import './Header.css'
import {GiHamburgerMenu} from "react-icons/gi";
import {VscClose} from "react-icons/vsc";
import { useAuth0 } from "@auth0/auth0-react";

function Header(props) {

const [showNavbar, setShowNavbar] = useState(false)

const handleShowNavbar = () => {
  setShowNavbar(!showNavbar)
}

const Icon = () => {
 if (showNavbar)
    return (      
    <VscClose onClick={handleShowNavbar}/>
    );
  return (
    <GiHamburgerMenu onClick={handleShowNavbar}/>
  );
}

  return (
    <>
  <nav className="navbar">
    <div className="header-container">
      {Logo(props)}
      <div className="menu-icon">
        {Icon(props)}
      </div>
      <div className={`nav-elements  ${showNavbar && 'active'}`}>
        
        <ul>
          <li>
            <NavLink to="/AboutUs">About Us</NavLink>
          </li>
          <li>
            <NavLink to="/Tech">Tech</NavLink>
          </li>
          {Loginheader(props)}
          {/* <LoginButton/> */}
          {/* <LogoutButton/> */}
        </ul>
      </div>
    </div>
  </nav>
    </> 
  );
}

function Loginheader(props) {

  const { logout } = useAuth0();
  
  const handleLogout = async () => {
    props.setIsLoggedIn(false);
    props.setUserInfo([]);
    // if(isAuthenticated){
    //   await logout();
    // }
    await logout();

    // navigate("/");
  };

  if (props.isLoggedIn)
    return (      
      <li className="menu-item">
        <NavLink to="/" onClick={handleLogout} className="logout-button">Log Out</NavLink>
      </li>
    );
  return (
    <li>
      <NavLink to="/Login">Login</NavLink>
    </li>
  );
}

function Logo(props) {
  if (props.isLoggedIn)
    return (      
      <li className="menu-item">
        <NavLink to="/Profile"><div className="logo"/></NavLink>  
      </li>
  
    );
  return (
    <li>
      <NavLink to="/"><div className="logo"/></NavLink>
    </li>
  );
}

export default Header;
