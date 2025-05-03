import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const AgencyNavbar = ({ toggleSidebar }) => {
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
        background: "linear-gradient(-45deg, rgb(9, 88, 145), rgb(6, 67, 100), rgb(2, 93, 98))",
        backgroundSize: "400% 400%",
        animation: "navbarShift 10s ease infinite",
        color: "white",
        height: "56px",
        paddingBottom: 0, // Remove padding-bottom
        zIndex: 1050,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#ff6f61" }}
              className="btn btn-danger"
              onClick={handleLogout}
            >
              LOGOUT
            </motion.button>
          </li>
        </ul>
      </div>

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

        .navbar,
        .app-header {
          box-shadow: none !important;
          border: none !important;
          padding-bottom: 0 !important; /* Enforces no padding-bottom */
        }

        .navbar-nav .nav-link {
          color: white;
          font-size: 16px;
          font-weight: 500;
        }

        .navbar-nav .nav-link:hover {
          color: rgb(3, 140, 147);
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
};
