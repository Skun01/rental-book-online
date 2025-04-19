import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/adminComponents/Sidebar";
const AdminApp = () => {
  return (
    <div className="admin-app-container">
      <Sidebar />
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminApp;
