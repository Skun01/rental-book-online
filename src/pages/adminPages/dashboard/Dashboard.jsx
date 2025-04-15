import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";
import Sidebar from "../../../components/adminComponents/sidebar"; // Import Sidebar component

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`admin-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sử dụng Sidebar component */}
      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Main content */}
      <div className="main-content">
        <header className="top-navbar">
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>☰</button>
          <h1>Hệ thống quản lý thư viện</h1>
          <div className="user-info">
            <span className="user-name">Admin</span>
          </div>
        </header>

        <main className="content-area">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon books-icon">📚</div>
              <div className="stat-details">
                <h3>Tổng số sách</h3>
                <p className="stat-number">1,250</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon users-icon">👥</div>
              <div className="stat-details">
                <h3>Người dùng</h3>
                <p className="stat-number">832</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon borrowed-icon">🔄</div>
              <div className="stat-details">
                <h3>Đang mượn</h3>
                <p className="stat-number">156</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon overdue-icon">⏰</div>
              <div className="stat-details">
                <h3>Quá hạn</h3>
                <p className="stat-number">23</p>
              </div>
            </div>
          </div>

          <div className="recent-activities">
            <h2>Hoạt động gần đây</h2>
            <div className="activity-table-container">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Sách</th>
                    <th>Hành động</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nguyễn Văn A</td>
                    <td>Đắc Nhân Tâm</td>
                    <td><span className="activity-badge borrow">Mượn sách</span></td>
                    <td>10 phút trước</td>
                  </tr>
                  <tr>
                    <td>Trần Thị B</td>
                    <td>Nhà Giả Kim</td>
                    <td><span className="activity-badge return">Trả sách</span></td>
                    <td>30 phút trước</td>
                  </tr>
                  <tr>
                    <td>Lê Văn C</td>
                    <td>Tôi Tài Giỏi, Bạn Cũng Thế</td>
                    <td><span className="activity-badge overdue">Quá hạn</span></td>
                    <td>2 giờ trước</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Router Outlet cho các trang con */}
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;