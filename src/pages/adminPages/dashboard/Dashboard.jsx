import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Dashboard.css"; // nếu có file CSS riêng

const Dashboard = () => {
  return (
    <div className="admin-layout">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>Quản lý sách</li>
          <li>Quản lý người dùng</li>
          <li>Quản lý mượn trả</li>
          <li>Báo cáo thống kê</li>
          <li>Quản lý phân quyền</li>
        </ul>
      </div>
      <div className="main-content">
        <h1>Chào mừng đến giao diện admin</h1>
        <p>Đây là phần nội dung chính</p>
      </div>
    </div>
  );
};

export default Dashboard;
