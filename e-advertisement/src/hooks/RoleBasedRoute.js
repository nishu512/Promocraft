import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');

  if (!allowedRoles.includes(role)) {
    // Not authorized
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoute;
