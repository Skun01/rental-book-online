import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/adminComponents/Sidebar.jsx";
import "./styles/adminStyles/App.css"
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
