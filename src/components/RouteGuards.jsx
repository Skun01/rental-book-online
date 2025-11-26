// src/components/RouteGuards.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RequireRole = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  const userRole = currentUser?.role?.name || "";
  if (!allowedRoles.includes(userRole)) {
    if (userRole === "SUPER_ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return children;
}