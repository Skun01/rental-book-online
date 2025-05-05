import React from "react";
import styles from "./Dashboard.module.css"; // Import CSS module

const Dashboard = () => {
  return (
    <div className={styles["admin-layout"]}>
      {/* Main content */}
      <div className={styles["main-content"]}>
        <main className={styles["content-area"]}>
          <div className={styles["dashboard-stats"]}>
            <div className={styles["stat-card"]}>
              <div className={`${styles["stat-icon"]} ${styles["books-icon"]}`}>📚</div>
              <div className={styles["stat-details"]}>
                <h3>Tổng số sách</h3>
                <p className={styles["stat-number"]}>1,250</p>
              </div>
            </div>
            <div className={styles["stat-card"]}>
              <div className={`${styles["stat-icon"]} ${styles["users-icon"]}`}>👥</div>
              <div className={styles["stat-details"]}>
                <h3>Người dùng</h3>
                <p className={styles["stat-number"]}>832</p>
              </div>
            </div>
            <div className={styles["stat-card"]}>
              <div className={`${styles["stat-icon"]} ${styles["borrowed-icon"]}`}>🔄</div>
              <div className={styles["stat-details"]}>
                <h3>Đang mượn</h3>
                <p className={styles["stat-number"]}>156</p>
              </div>
            </div>
            <div className={styles["stat-card"]}>
              <div className={`${styles["stat-icon"]} ${styles["overdue-icon"]}`}>⏰</div>
              <div className={styles["stat-details"]}>
                <h3>Quá hạn</h3>
                <p className={styles["stat-number"]}>23</p>
              </div>
            </div>
          </div>

          <div className={styles["recent-activities"]}>
            <h2>Hoạt động gần đây</h2>
            <div className={styles["activity-table-container"]}>
              <table className={styles["activity-table"]}>
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
                    <td><span className={`${styles["activity-badge"]} ${styles["borrow"]}`}>Mượn sách</span></td>
                    <td>10 phút trước</td>
                  </tr>
                  <tr>
                    <td>Trần Thị B</td>
                    <td>Nhà Giả Kim</td>
                    <td><span className={`${styles["activity-badge"]} ${styles["return"]}`}>Trả sách</span></td>
                    <td>30 phút trước</td>
                  </tr>
                  <tr>
                    <td>Lê Văn C</td>
                    <td>Tôi Tài Giỏi, Bạn Cũng Thế</td>
                    <td><span className={`${styles["activity-badge"]} ${styles["overdue"]}`}>Quá hạn</span></td>
                    <td>2 giờ trước</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;