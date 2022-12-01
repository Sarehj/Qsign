import { NavLink } from "react-router-dom";
import { useState } from "react";
import './LogInHeader.css'
import {GiHamburgerMenu} from "react-icons/gi";
import {VscClose} from "react-icons/vsc";


function LogInHeader(props) {

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
        </ul>
      </div>
    </div>
  </nav>
    </> 
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

export default LogInHeader;
