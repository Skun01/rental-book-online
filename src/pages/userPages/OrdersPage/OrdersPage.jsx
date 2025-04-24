"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Clock, CheckCircle, XCircle, ChevronRight, Search } from "lucide-react"
import { mockOrders } from "../../../mockData"
import styles from "./OrdersPage.module.css"

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Cập nhật hàm filteredOrders để sử dụng các giá trị ENUM đúng
  const filteredOrders = mockOrders.filter((order) => {
    // Đảm bảo mỗi order có thuộc tính total_rental_price
    if (!order.total_rental_price) {
      order.total_rental_price = order.total_price
    }

    // Filter by status
    if (activeTab === "active" && order.order_status !== "APPROVED") return false
    if (activeTab === "completed" && order.order_status !== "RETURNED") return false
    if (activeTab === "cancelled" && order.order_status !== "REJECTED") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toString().includes(query) || order.items.some((item) => item.book_title.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Cập nhật hàm getStatusIcon để sử dụng các giá trị ENUM đúng
  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <Clock size={18} className={styles.activeIcon} />
      case "RETURNED":
        return <CheckCircle size={18} className={styles.completedIcon} />
      case "PENDING":
        return <Clock size={18} className={styles.pendingIcon} />
      case "REJECTED":
        return <XCircle size={18} className={styles.cancelledIcon} />
      default:
        return <Clock size={18} className={styles.pendingIcon} />
    }
  }

  // Cập nhật hàm getStatusText để phù hợp với các giá trị ENUM trong database
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận"
      case "APPROVED":
        return "Đã xác nhận"
      case "REJECTED":
        return "Đã hủy"
      case "RETURNED":
        return "Đã trả"
      default:
        return status
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Đơn hàng của tôi</h1>

        <div className={styles.ordersTabs}>
          <button
            className={`${styles.tabButton} ${activeTab === "all" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Tất cả
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "active" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Đang thuê
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "completed" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Đã trả
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "cancelled" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Đã hủy
          </button>
        </div>

        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sách"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <Search size={18} className={styles.searchIcon} />
          </div>
        </div>

        <div className={styles.ordersContent}>
          {filteredOrders.length === 0 ? (
            <div className={styles.noOrders}>
              <h2>Không tìm thấy đơn hàng nào</h2>
              <p>Bạn chưa có đơn hàng nào hoặc không có đơn hàng phù hợp với bộ lọc.</p>
              <Link to="/search" className={styles.browseButton}>
                Tìm sách ngay
              </Link>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {filteredOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3 className={styles.orderId}>Đơn hàng #{order.id}</h3>
                      <div className={styles.orderDate}>Ngày đặt: {formatDate(order.rental_date)}</div>
                    </div>
                    <div className={styles.orderStatus}>
                      {getStatusIcon(order.order_status)}
                      <span>{getStatusText(order.order_status)}</span>
                    </div>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.itemTitle}>{item.book_title}</div>
                        <div className={styles.itemQuantity}>x{item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.orderTotal}>
                      <span>Tổng tiền thuê:</span>
                      <span>{order.total_rental_price.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <Link to={`/orders/${order.id}`} className={styles.viewOrderButton}>
                      <span>Chi tiết</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
