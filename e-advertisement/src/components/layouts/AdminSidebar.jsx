import { Outlet, Link } from 'react-router-dom';
import { AdminNavbar } from './AdminNavbar';
import React, { useState } from "react";

export const AdminSidebar = () => {
     const [isSidebarOpen, setSidebarOpen] = useState(true);
        
          const toggleSidebar = () => {
            console.log("toggleSidebar");
            setSidebarOpen(!isSidebarOpen);
          };
        return (
            <>
                <AdminNavbar toggleSidebar={toggleSidebar} />
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
                    className=""
                    data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
                    tabIndex={-1}
                    style={{
                        marginRight: "-16px",
                        marginBottom: "-16px",
                        marginLeft: 0,
                        top: "-8px",
                        right: "auto",
                        left: "-8px",
                        width: "calc(100% + 16px)",
                        padding: 8,
                    }}
                >
                    <nav className="mt-2">
                        <ul
                            className="nav sidebar-menu flex-column"
                            data-lte-toggle="treeview"
                            role="menu"
                            data-accordion="false"
                        >
                            <li className="nav-item menu-open">
                                {/* Use Link to redirect to the userprofile route */}
                                <Link 
                                  to="/adminprofile" 
                                  className="nav-link transition-all duration-300 ease-in-out"
                                  style={{ padding: "10px", borderRadius: "5px" }}
                                >
                                    <p>
                                        My Profile
                                        <i className="nav-arrow bi bi-chevron-right" />
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item menu-open">
                                {/* Use Link to redirect to the userprofile route */}
                                <Link 
                                  to="/UserManage" 
                                  className="nav-link transition-all duration-300 ease-in-out"
                                  style={{ padding: "10px", borderRadius: "5px" }}
                                >
                                    <p>
                                        User Manage
                                        <i className="nav-arrow bi bi-chevron-right" />
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item menu-open">
                                {/* Use Link to redirect to the userprofile route */}
                                <Link 
                                  to="/Report" 
                                  className="nav-link transition-all duration-300 ease-in-out"
                                  style={{ padding: "10px", borderRadius: "5px" }}
                                >
                                    <p>
                                        HordingReport
                                        <i className="nav-arrow bi bi-chevron-right" />
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item menu-open">
                                {/* Use Link to redirect to the userprofile route */}
                                <Link 
                                  to="/BookingReport" 
                                  className="nav-link transition-all duration-300 ease-in-out"
                                  style={{ padding: "10px", borderRadius: "5px" }}
                                >
                                    <p>
                                        BookiongReport
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
