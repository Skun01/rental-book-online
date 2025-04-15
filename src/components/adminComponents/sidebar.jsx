import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarCollapsed, toggleSidebar, isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <>
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
              <Link to="/admin/managerBook">
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
            <li><Link to="/admin/managerBook" onClick={toggleMobileMenu}>Quản lý sách</Link></li>
            <li><Link to="/admin/users" onClick={toggleMobileMenu}>Quản lý người dùng</Link></li>
            <li><Link to="/admin/borrows" onClick={toggleMobileMenu}>Quản lý mượn trả</Link></li>
            <li><Link to="/admin/stats" onClick={toggleMobileMenu}>Báo cáo thống kê</Link></li>
            <li><Link to="/admin/permissions" onClick={toggleMobileMenu}>Quản lý phân quyền</Link></li>
            <li><Link to="/logout" onClick={toggleMobileMenu}>Đăng xuất</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;