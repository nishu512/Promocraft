import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { UserSidebar } from "./components/layouts/UserSidebar";
import { UserProfile } from "./components/user/UserProfile";
import React, { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { Login } from "./components/common/Login";
import { Signup } from "./components/common/Signup";
import { AgencySidebar } from "./components/layouts/AgencySidebar";
import { AgencyNavbar } from "./components/layouts/AgencyNavbar"; 
import { AdminProfile } from "./components/admin/AdminProfile";
import { AgencyProfile } from "./components/agency/AgencyProfile";
import { AdminNavbar } from "./components/layouts/AdminNavbar";
import { AdminSidebar } from "./components/layouts/AdminSidebar";
import PrivateRoutes from "./hooks/PrivateRoutes";
import axios from "axios";
import LandingPage from "./components/common/LandingPage";
import { AddScreen2 } from "./components/agency/AddScreen2";
import { ViewMyScreens } from "./components/agency/ViewMyScreens";
import UserManage from './components/admin/UserManage';
import Report from "./components/admin/Report";
import BookHording from "./components/user/BookHording";
import { BookingForm } from "./components/user/BookingForm";
import MyBooking from "./components/user/MyBooking";
import Request from "./components/agency/Request";
import AgencyReport from "./components/agency/AgencyReport";
import BookingReport from "./components/admin/BookingReport";
import Location from "./components/agency/Location";
import ResetPassword from "./components/common/ResetPassword";
import { UpdateMyScreen } from "./components/agency/UpdateMyScreen"; 
import  Dashboard  from "./components/agency/Dashboard"; 
import AddReview from "./components/user/AddReview";
import Reviews from "./components/agency/reviews";

import "./assets/css/adminlte.css";
import "./assets/css/adminlte.min.css";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  const location = useLocation();
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");

    if (location.pathname === "/login" || location.pathname === "/signup") {
      document.body.className = "auth-page"; 
    } else {
      document.body.className =
        "layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded";
    }
  }, [location.pathname]);

  const isAuthPage = ["/login", "/signup"].some((path) => location.pathname.startsWith(path)) || location.pathname.startsWith("/resetpassword");

  const shouldRenderLayout = !isAuthPage;

  return (
    <div className={isAuthPage ? "" : "app-wrapper"}>
      <Routes key={location.pathname}>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />
        <Route path ="/resetpassword/:token" element={<ResetPassword />} />

        {/* Private routes */}
        <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
          <Route path="/agencyprofile" element={<AgencyProfile />} />
          <Route path="/admin" element={<AdminSidebar />} />
          <Route path="/addscreen" element={<AddScreen2 />} />
          <Route path="/myscreens" element={<ViewMyScreens />} />
          <Route path="/agency" element={<AgencySidebar />} />
          <Route path="/UserManage" element={<UserManage />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/BookHording" element={<BookHording />} />
          <Route path="/BookingForm" element={<BookingForm />} />
          <Route path="/MyBooking" element={<MyBooking />} />
          <Route path="/Request" element={<Request />} />
          <Route path="/AgencyReport" element={<AgencyReport />} />
          <Route path="/BookingReport" element={<BookingReport />} />
          <Route path="/Location" element={<Location />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/updateScreen/:id" element={<UpdateMyScreen />} />
          <Route path="/AddReview" element={<AddReview/>} />
          <Route path="/Reviews" element={<Reviews/>} />
        </Route>

        {/* Catch-all route for unauthorized access */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/userprofile" : "/login"} />} />
      </Routes>

      {/* Layouts based on role and path */}
      {!isAuthPage && shouldRenderLayout && (
        <>
          {/* Admin Layout */}
          {role === "admin" && (
            location.pathname.startsWith("/admin") ||
            location.pathname.startsWith("/UserManage") ||
            location.pathname.startsWith("/Report") ||
            location.pathname.startsWith("/BookingReport")
          ) && (
            <>
              <AdminSidebar />
              <AdminNavbar />
            </>
          )}

          {/* Agency Layout */}
          {role === "agency" && (
            location.pathname.startsWith("/agency") ||
            location.pathname.startsWith("/addscreen") ||
            location.pathname.startsWith("/myscreens") ||
            location.pathname.startsWith("/updateScreen") ||
            location.pathname.startsWith("/request") ||
            location.pathname.startsWith("/AgencyReport") ||
            location.pathname.startsWith("/Location")||
            location.pathname.startsWith("/reviews")||
            location.pathname.startsWith("/dashboard")
          ) && (
            <>
              <AgencySidebar />
              <AgencyNavbar />
            </>
          )}

          {/* User Layout */}
          {role === "user" && (
            location.pathname.startsWith("/userprofile") ||
            location.pathname.startsWith("/BookHording") ||
            location.pathname.startsWith("/BookingForm") ||
            location.pathname.startsWith("/addreview") ||
            location.pathname.startsWith("/MyBooking")
          ) && (
            <UserSidebar />
          )}
        </>
      )}
    </div>
  );
}

export default App;
