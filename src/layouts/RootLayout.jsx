// src/layouts/RootLayout.jsx
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";

export default function RootLayout() {
  return (
    // Đưa Providers vào đây. 
    // Vì RootLayout được render bởi RouterProvider, 
    // nên AuthProvider ở đây CÓ THỂ dùng useNavigate()
    <AuthProvider>
      <ToastProvider>
        <Outlet /> 
      </ToastProvider>
    </AuthProvider>
  );
}