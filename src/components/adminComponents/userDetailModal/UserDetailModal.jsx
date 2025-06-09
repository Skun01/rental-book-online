import styles from "../../../pages/adminPages/userManager/UserManager.module.css"
import {ExternalLink} from 'lucide-react'
import { useEffect, useState } from "react"
import {userAllRentalOrderGet, userAllReturnedOrderGet} from '../../../api/orderApi'
import OrderDetailModal from '../orderDetailModal/OrderDetailModal'

const token = localStorage.getItem('token')
const UserDetailModal = ({ user, onClose }) => {
  const [ProcessingRentalOrder, setProcessingRentalOrder] = useState([])
  const [returnedOrder, setReturnedOrder] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(null)
  useEffect(()=>{
    async function getData(){
      try{
        const rentalData = await userAllRentalOrderGet(user.id, token)
        setProcessingRentalOrder(rentalData.filter(rental=>rental.orderStatus === 'Processing'))
        const returnedData = await userAllReturnedOrderGet(user.id, token)
        setReturnedOrder(returnedData)
      }catch(err){
        console.error(`can't get all rental orders: `, err)
      }
    }

    if(token){
      getData()
    }
  }, [])

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
                <img src={user.imageUrl || "/author.jpg"} alt={user.fullName} />
              </div>
              <div className={styles.userDetails}>
                <h4>{user.fullName}</h4>
                <p>Email: {user.email}</p>
                <p>Tuổi: {user.age}</p>
                <p>Giới tính: {user.gender === "Male" ? "Nam" : user.gender === "Female" ? "Nữ" : "Khác"}</p>
                <p>Vai trò: {user.role?.name === "admin" ? "Admin" : "User"}</p>
                <p>Trạng thái: {(user.status && user.status === "Active" ? "Hoạt động" : "Không hoạt động") || 'Chưa biết'}</p>
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
                <span className={styles.statNumber}>{ProcessingRentalOrder.length || 0}</span>
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
                    onClick={() => setShowDetailModal(order)}
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
            <h3 className={styles.sectionTitle}>Đơn hàng đang chờ ({ProcessingRentalOrder.length || 0})</h3>
            <div className={styles.itemsList}>
              {ProcessingRentalOrder.map((order) => (
                <div key={order.id} className={styles.itemCard}>
                  <span className={styles.itemName}>#{order.id}</span>
                  <span className={styles.orderDate}>{new Date(order.createAt).toLocaleDateString("vi-VN")}</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => setShowDetailModal(order)}
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
              {returnedOrder.map((order) => (
                <div key={order.id} className={styles.itemCard}>
                  <span className={styles.itemName}>#{order.orderId}</span>
                  <span className={styles.orderDate}>{new Date(order.date).toLocaleDateString("vi-VN")}</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => setShowDetailModal(order)}
                    title="Xem chi tiết đơn hàng"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              )) || <p className={styles.noItems}>Không có đơn hàng đã trả</p>}
            </div>
          </div>

          {/* detail order modal */}
          {showDetailModal && (
            <OrderDetailModal order={showDetailModal} onClose={()=>setShowDetailModal(null)}/>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal