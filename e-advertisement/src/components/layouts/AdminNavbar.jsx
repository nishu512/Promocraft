import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For button hover animation

export const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <nav
      className="app-header navbar navbar-expand"
      style={{
        background: "linear-gradient(-45deg,rgb(9, 88, 145),rgb(6, 67, 100),rgb(2, 93, 98))",
        backgroundSize: "400% 400%",
        animation: "navbarShift 10s ease infinite",
        color: "white",
        height: "56px",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Navbar Right Items */}
        <ul className="navbar-nav ms-auto">
          {/* Logout Button with Hover Effect */}
          <li className="nav-item">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#ff6f61" }} // Hover effect
              className="btn btn-danger"
              onClick={handleLogout}
            >
              LOGOUT
            </motion.button>
          </li>
        </ul>
      </div>

      {/* CSS for Animation and Styling */}
      <style jsx="true">{`
        @keyframes navbarShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .navbar {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Subtle shadow effect */
        }

        .navbar-nav .nav-link {
          color: white;
          font-size: 16px;
          font-weight: 500;
        }

        .navbar-nav .nav-link:hover {
          color:rgb(3, 140, 147); /* Highlight on hover */
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
};
