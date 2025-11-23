// src/layouts/RootLayout.jsx
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Outlet /> 
      </ToastProvider>
    </AuthProvider>
  );
}