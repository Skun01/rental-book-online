import styles from "../../../pages/adminPages/userManager/UserManager.module.css"
import {ExternalLink} from 'lucide-react'

const UserDetailModal = ({ user, onClose }) => {
  const handleOrderClick = (orderId) => {
    console.log("View order details:", orderId)
    
  }

  const handleBookClick = (bookId) => {
    console.log("View book details:", bookId)
    
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết người dùng</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* User Basic Info */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
            <div className={styles.userBasicInfo}>
              <div className={styles.userAvatar}>
                <img src={user.imageUrl || "/placeholder.svg?height=80&width=80"} alt={user.fullName} />
              </div>
              <div className={styles.userDetails}>
                <h4>{user.fullName}</h4>
                <p>Email: {user.email}</p>
                <p>Tuổi: {user.age}</p>
                <p>Giới tính: {user.gender === "Male" ? "Nam" : user.gender === "Female" ? "Nữ" : "Khác"}</p>
                <p>Vai trò: {user.role === "admin" ? "Admin" : "User"}</p>
                <p>Trạng thái: {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Thống kê</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{user.rentingBooks || 0}</span>
                <span className={styles.statLabel}>Đang thuê</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{user.overdueBooks || 0}</span>
                <span className={styles.statLabel}>Quá hạn</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{user.completedOrders || 0}</span>
                <span className={styles.statLabel}>Đơn đã đặt</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{user.pendingOrders || 0}</span>
                <span className={styles.statLabel}>Đơn chờ</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{user.returnedOrders || 0}</span>
                <span className={styles.statLabel}>Đơn đã trả</span>
              </div>
            </div>
          </div>

          {/* Renting Books */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Sách đang thuê ({user.rentingBooks || 0})</h3>
            <div className={styles.itemsList}>
              {user.rentingBooksList?.map((book) => (
                <div key={book.id} className={styles.itemCard}>
                  <span className={styles.itemName}>{book.title}</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => handleBookClick(book.id)}
                    title="Xem chi tiết sách"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              )) || <p className={styles.noItems}>Không có sách đang thuê</p>}
            </div>
          </div>

          {/* Overdue Books */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Sách quá hạn ({user.overdueBooks || 0})</h3>
            <div className={styles.itemsList}>
              {user.overdueBooksList?.map((book) => (
                <div key={book.id} className={styles.itemCard}>
                  <span className={styles.itemName}>{book.title}</span>
                  <span className={styles.overdueInfo}>Quá hạn {book.overdueDays} ngày</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => handleBookClick(book.id)}
                    title="Xem chi tiết sách"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              )) || <p className={styles.noItems}>Không có sách quá hạn</p>}
            </div>
          </div>

          {/* Completed Orders */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Đơn hàng đã đặt ({user.completedOrders || 0})</h3>
            <div className={styles.itemsList}>
              {user.completedOrdersList?.map((order) => (
                <div key={order.id} className={styles.itemCard}>
                  <span className={styles.itemName}>#{order.orderId}</span>
                  <span className={styles.orderDate}>{new Date(order.date).toLocaleDateString("vi-VN")}</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => handleOrderClick(order.orderId)}
                    title="Xem chi tiết đơn hàng"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              )) || <p className={styles.noItems}>Không có đơn hàng đã đặt</p>}
            </div>
          </div>

          {/* Pending Orders */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Đơn hàng đang chờ ({user.pendingOrders || 0})</h3>
            <div className={styles.itemsList}>
              {user.pendingOrdersList?.map((order) => (
                <div key={order.id} className={styles.itemCard}>
                  <span className={styles.itemName}>#{order.orderId}</span>
                  <span className={styles.orderDate}>{new Date(order.date).toLocaleDateString("vi-VN")}</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => handleOrderClick(order.orderId)}
                    title="Xem chi tiết đơn hàng"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              )) || <p className={styles.noItems}>Không có đơn hàng đang chờ</p>}
            </div>
          </div>

          {/* Returned Orders */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Đơn hàng đã trả ({user.returnedOrders || 0})</h3>
            <div className={styles.itemsList}>
              {user.returnedOrdersList?.map((order) => (
                <div key={order.id} className={styles.itemCard}>
                  <span className={styles.itemName}>#{order.orderId}</span>
                  <span className={styles.orderDate}>{new Date(order.date).toLocaleDateString("vi-VN")}</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => handleOrderClick(order.orderId)}
                    title="Xem chi tiết đơn hàng"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              )) || <p className={styles.noItems}>Không có đơn hàng đã trả</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal