import { Outlet, Link } from 'react-router-dom';
import React, { useState } from "react";
import { UserNavbar } from './UserNavbar';

export const UserSidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
      const toggleSidebar = () => {
        console.log("toggleSidebar");
        setSidebarOpen(!isSidebarOpen);
      };
    return (
        <>
            <UserNavbar toggleSidebar={toggleSidebar} />
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


                <nav className="mt-3 px-2">
                    <ul className="nav flex-column sidebar-menu" data-lte-toggle="treeview" role="menu" data-accordion="false">
                        <li className="nav-item">
                            <Link 
                                to="/userprofile" 
                                className="nav-link transition-all duration-300 ease-in-out"
                                style={{ padding: "10px", borderRadius: "5px" }}
                            >
                                <p>My Profile <i className="nav-arrow bi bi-chevron-right" /></p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                to="/BookHording" 
                                className="nav-link transition-all duration-300 ease-in-out"
                                style={{ padding: "10px", borderRadius: "5px" }}
                            >
                                <p>Book Hoarding <i className="nav-arrow bi bi-chevron-right" /></p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                to="/MyBooking" 
                                className="nav-link transition-all duration-300 ease-in-out"
                                style={{ padding: "10px", borderRadius: "5px" }}
                            >
                                <p>My Booking <i className="nav-arrow bi bi-chevron-right" /></p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                to="/addreview" 
                                className="nav-link transition-all duration-300 ease-in-out"
                                style={{ padding: "10px", borderRadius: "5px" }}
                            >
                                <p>Add Review <i className="nav-arrow bi bi-chevron-right" /></p>
                            </Link>
                        </li>
                    </ul>
                </nav>
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
