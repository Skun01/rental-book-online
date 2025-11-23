// src/components/RouteGuards.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RequireRole = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // 1. Kiểm tra đăng nhập
  if (!currentUser) {
    // THAY ĐỔI Ở ĐÂY: Redirect về "/" thay vì "/login"
    // Thêm state openLogin: true để HomePage bắt được
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  // 2. Kiểm tra quyền (Giữ nguyên)
  const userRole = currentUser?.role?.name || "";
  if (!allowedRoles.includes(userRole)) {
    if (userRole === "SUPER_ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Làm tương tự với RequireAuth nếu bạn tách riêng
export function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return children;
}