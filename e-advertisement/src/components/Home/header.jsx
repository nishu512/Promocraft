import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";


import CustomButton from "./button";
import useScript from "../../hooks/useScript";

export default function Header() {
  useScript("/Scripts/header.js");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("../common/login"); // Directly navigate to the login page
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/" className="logo">
          PROMOCRAFT
        </Link>
      </div>
      <div className="header-nav">
        <ul className="nav-list">
          
          <li className="nav-item">
            <a href="#About" className="nav-link">
              about
            </a>
          </li>
          <li className="nav-item">
            <a href="#Features" className="nav-link">
              features
            </a>
          </li>
          <li className="nav-item">
            <a href="#Contact" className="nav-link">
              contact
            </a>
          </li>
        </ul>
      </div>
      <div className="header-login">
        <CustomButton
          text="LOGIN"
          afterIcon="arrow-right-to-bracket"
          func={handleLoginClick} // Directly navigate on button click
          style={{ padding: "1.6rem 3.4rem" }}
        />
      </div>
      <button className="nav-btn">
        <span className="nav-icon"> &nbsp; </span>
      </button>
    </header>
  );
}
