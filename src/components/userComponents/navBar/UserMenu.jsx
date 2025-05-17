import React from "react";
import styles from "./UserMenu.module.css";
import { Heart, Plus, Clock, User, LogOut } from "lucide-react";

const UserMenu = ({ username = "truongg", onLogout }) => {
  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <p>Chào,</p>
        <p className={styles.username}>{username}</p>
      </div>
      <div className={styles.separator} />
      <div className={styles.menuItem}><Heart size={18} />Sách đang thuê</div>
      <div className={styles.menuItem}><Plus size={18} /> Đơn hàng của tôi</div>
      <Link to ="/profile">
        <div className={styles.menuItem}><User size={18} /> Tài khoản</div>
      </Link>
      <div className={styles.separator} />
      <div className={styles.menuItem} onClick={onLogout}><LogOut size={18} />Đăng xuất</div>
    </div>
  );
};

export default UserMenu;
