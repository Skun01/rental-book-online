import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import axios from "axios";
import styles from "./NotificationDropdown.module.css";

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/notification/all?page=0&size=100&active=CREATE'
      );
      
      if (response.data && response.data.data && response.data.data.content) {
        // Sort notifications by createAt (newest first)
        const sortedNotifications = response.data.data.content.sort(
          (a, b) => new Date(b.createAt) - new Date(a.createAt)
        );
        setNotifications(sortedNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  // Get notification type and icon
  const getNotificationType = (description) => {
    if (description.includes("được thêm")) return { type: "add", color: "#22c55e" };
    if (description.includes("được cập nhật")) return { type: "update", color: "#3b82f6" };
    if (description.includes("được xóa")) return { type: "delete", color: "#ef4444" };
    return { type: "default", color: "#6b7280" };
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.notificationContainer} ref={dropdownRef}>
      <div 
        className={styles.notificationBell}
        onClick={toggleDropdown}
      >
        <Bell className={styles.bellIcon} />
        {notifications.length > 0 && (
          <div className={styles.notificationBadge}>
            {notifications.length > 99 ? "99+" : notifications.length}
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.notificationDropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Thông báo</h3>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.dropdownBody}>
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Đang tải thông báo...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <p>{error}</p>
                <button 
                  className={styles.retryButton}
                  onClick={fetchNotifications}
                >
                  Thử lại
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <Bell size={48} className={styles.emptyIcon} />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <div className={styles.notificationList}>
                {notifications.map((notification) => {
                  const { type, color } = getNotificationType(notification.description);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={styles.notificationItem}
                    >
                      <div 
                        className={styles.notificationDot}
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationDescription}>
                          {notification.description}
                        </p>
                        <span className={styles.notificationTime}>
                          {formatDate(notification.createAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className={styles.dropdownFooter}>
              <button className={styles.viewAllButton}>
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;