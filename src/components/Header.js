import React, { useContext } from "react";
import "./header.css";
import { LoginContext } from "./ContextProvider/Context";
import { useNavigate, NavLink } from "react-router-dom";

const Header = () => {
 

  return (
    <>
      <header>
        <nav>
          <NavLink to="/">
            <h1>My Login App</h1>
          </NavLink>
        
        </nav>
      </header>
    </>
  );
};

export default Header;
