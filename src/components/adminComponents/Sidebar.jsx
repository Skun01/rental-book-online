import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isSidebarCollapsed, toggleSidebar, isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Dashboard</h2>
          <button className={styles.collapseBtn} onClick={toggleSidebar}>
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className={styles.sidebarProfile}>
          <div className={styles.profileAvatar}>A</div>
          <div className={styles.profileInfo}>
            <h3>Admin User</h3>
            <p>Quản trị viên</p>
          </div>
        </div>
        <nav className={styles.sidebarMenu}>
          <ul>
            <li>
              <Link to="/admin/dashboard">
                <span className={styles.menuIcon}>📊</span>
                <span className={styles.menuText}>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/managerBook">
                <span className={styles.menuIcon}>📚</span>
                <span className={styles.menuText}>Quản lý sách</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/managerUsers">
                <span className={styles.menuIcon}>👥</span>
                <span className={styles.menuText}>Quản lý người dùng</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/borrows">
                <span className={styles.menuIcon}>🔄</span>
                <span className={styles.menuText}>Quản lý mượn trả</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/thongKe">
                <span className={styles.menuIcon}>📈</span>
                <span className={styles.menuText}>Báo cáo thống kê</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/permissions">
                <span className={styles.menuIcon}>🔐</span>
                <span className={styles.menuText}>Quản lý phân quyền</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link to="/logout">
            <span className={styles.menuIcon}>🚪</span>
            <span className={styles.menuText}>Đăng xuất</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
