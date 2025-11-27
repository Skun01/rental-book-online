// src/components/RouteGuards.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RequireRole = ({ allowedRoles, children }) => {
  const { currentUser, loading } = useAuth(JSON.parse(localStorage.getItem("user")));
  const location = useLocation();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Đang tải quyền truy cập...</div>; 
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