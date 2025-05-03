import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AgencyNavbar } from "./AgencyNavbar";

export const AgencySidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AgencyNavbar toggleSidebar={toggleSidebar} />

      <aside
        className={`app-sidebar shadow ${
          isSidebarOpen ? "open" : "d-none"
        } animated-sidebar`}
        data-bs-theme="dark"
      >
        <div className="sidebar-brand">
          <a href="./index.html" className="brand-link">
            <span
              className="brand-text fw-bold"
              style={{
                fontSize: "24px",
                letterSpacing: "2px",
                color: "white",
              }}
            >
              PROMOCRAFT
            </span>
          </a>
        </div>

        <div
          className="overflow-hidden"
          tabIndex={-1}
          style={{
            marginRight: "-16px",
            marginBottom: "-16px",
            padding: 15,
          }}
        >
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">
              <li className="nav-item menu-open">
                <Link
                  to="addscreen"
                  className="nav-link hover-effect"
                >
                  <p>
                    ADD SCREEN
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>

                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link
                      to="dashboard"
                      className="nav-link hover-effect"
                    >
                      <p>
                        Add Location
                        <i className="nav-arrow bi bi-chevron-right" />
                      </p>
                    </Link>
                  </li>
                </ul>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link
                      to="myscreens"
                      className="nav-link hover-effect"
                    >
                      <p>
                        MY SCREENS
                        <i className="nav-arrow bi bi-chevron-right" />
                      </p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link
                  to="/Location"
                  className="nav-link hover-effect"
                >
                  <p>
                    Map
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/agencyprofile"
                  className="nav-link hover-effect"
                >
                  <p>
                    MY PROFILE
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/request"
                  className="nav-link hover-effect"
                >
                  <p>
                    Requests
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/reviews"
                  className="nav-link hover-effect"
                >
                  <p>
                    Reviews
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="agencyreport"
                  className="nav-link hover-effect"
                >
                  <p>
                    Report
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>

      {/* 🔥 Add animated background and hover effects */}
      <style jsx="true">
        {`
          .animated-sidebar {
            background: linear-gradient(-45deg,rgb(22, 74, 153),rgb(21, 46, 87),rgb(2, 93, 98),rgb(20, 85, 183));
            background-size: 400% 400%;
            animation: gradientShift 12s ease infinite;
            min-height: 100vh;
          }

          @keyframes gradientShift {
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

          .nav-link {
            color: white;
            background-color: transparent;
            transition: all 0.3s ease;
            padding: 10px;
            border-radius: 5px;
          }

          .hover-effect:hover {
            background-color: #00adb5;
            color: black !important;
            transform: scale(1.02);
          }
        `}
      </style>
    </>
  );
};
