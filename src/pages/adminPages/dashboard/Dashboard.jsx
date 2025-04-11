import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Dashboard.css";

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
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className="sidebar-profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <h3>Admin User</h3>
            <p>Quản trị viên</p>
          </div>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li>
              <Link to="/admin">
                <span className="menu-icon">📊</span>
                <span className="menu-text">Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/books">
                <span className="menu-icon">📚</span>
                <span className="menu-text">Quản lý sách</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <span className="menu-icon">👥</span>
                <span className="menu-text">Quản lý người dùng</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/borrows">
                <span className="menu-icon">🔄</span>
                <span className="menu-text">Quản lý mượn trả</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/stats">
                <span className="menu-icon">📈</span>
                <span className="menu-text">Báo cáo thống kê</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/permissions">
                <span className="menu-icon">🔐</span>
                <span className="menu-text">Quản lý phân quyền</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <Link to="/logout">
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Đăng xuất</span>
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <h2>Menu</h2>
          <button className="close-menu-btn" onClick={toggleMobileMenu}>✕</button>
        </div>
        <nav className="mobile-menu-items">
          <ul>
            <li><Link to="/admin" onClick={toggleMobileMenu}>Trang chủ</Link></li>
            <li><Link to="/admin/books" onClick={toggleMobileMenu}>Quản lý sách</Link></li>
            <li><Link to="/admin/users" onClick={toggleMobileMenu}>Quản lý người dùng</Link></li>
            <li><Link to="/admin/borrows" onClick={toggleMobileMenu}>Quản lý mượn trả</Link></li>
            <li><Link to="/admin/stats" onClick={toggleMobileMenu}>Báo cáo thống kê</Link></li>
            <li><Link to="/admin/permissions" onClick={toggleMobileMenu}>Quản lý phân quyền</Link></li>
            <li><Link to="/logout" onClick={toggleMobileMenu}>Đăng xuất</Link></li>
          </ul>
        </nav>
      </div>

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