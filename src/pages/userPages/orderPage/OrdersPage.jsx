import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Package, CheckCircle2, XCircle, Clock, Truck, Search, ArrowRight, RefreshCw } from "lucide-react"
import styles from "./OrdersPage.module.css"
import { useAuth } from "../../../contexts/AuthContext"
import axios from "axios"

const OrdersPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("rental")
  const [activeFilter, setActiveFilter] = useState("all")
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const {currentUser} = useAuth()

  // get orders data by user
  useEffect(() => {
    const getOrdersData = async () => {
      setIsLoading(true)
      
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/order/rental?page=0&size=100&sortDir=asc&userId=${currentUser.id}&orderStatus=${activeFilter === 'all' ? '' : activeFilter}`,
          {
            headers: {
              Authorization: `${localStorage.getItem('token')}`
            }
          }
        )
        setFilteredOrders(response.data.data.content)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setIsLoading(false)
      }
    }

    getOrdersData()
  }, [activeFilter, currentUser.id])

  useEffect(() => {

  }, [activeTab, activeFilter])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveFilter("all")
    setSearchQuery("")
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  const handleViewOrderDetails = (order) => {
    if (activeTab === "rental") {
      navigate(`/orders/${order.id}`, {state: {order}})
    } else {
      navigate("/return-success")
    }
  }

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: '2-digit', minute: '2-digit'}
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "Processing":
        return {
          text: "Chờ xác nhận",
          icon: <Clock size={18} />,
          className: styles.statusPending,
        };
      case "Confirmed":
        return {
          text: "Đã xác nhận",
          icon: <CheckCircle2 size={18} />,
          className: styles.statusProcessing,
        };
      case "Delivering":
        return {
          text: "Đang giao",
          icon: <Truck size={18} />,
          className: styles.statusDelivering,
        };
      case "Completed":
        return {
          text: "Hoàn thành",
          icon: <Package size={18} />,
          className: styles.statusCompleted,
        };
      case "Cancelled":
        return {
          text: "Đã hủy",
          icon: <XCircle size={18} />,
          className: styles.statusCancelled,
        };
      default:
        return {
          text: status,
          icon: null,
          className: "",
        };
    }
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Quản lý đơn hàng</h1>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "rental" ? styles.activeTab : ""}`}
              onClick={() => handleTabChange("rental")}
            >
              <Package size={20} />
              <span>Đơn hàng thuê sách</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "return" ? styles.activeTab : ""}`}
              onClick={() => handleTabChange("return")}
            >
              <RefreshCw size={20} />
              <span>Đơn hàng trả sách</span>
            </button>
          </div>
        </div>

        {/* filter section */}
        <div className={styles.controlsSection}>
          {/* <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sách..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div> */}

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${activeFilter === "all" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              Tất cả
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === "Processing" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("Processing")}
            >
              Chờ xác nhận
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === "Confirmed" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("Confirmed")}
            >
              Đã xác nhận
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === "Delivering" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("Delivering")}
            >
              Đang giao
            </button>
            {activeTab === "rental" && (
              <button
                className={`${styles.filterButton} ${activeFilter === "Cancelled" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("Cancelled")}
              >
                Đã hủy
              </button>
            )}
          </div>
        </div>

        {/* data section */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loading}></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.orderStatus)
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3 className={styles.orderId}>#{order.id}</h3>
                      <div className={styles.orderDate}>
                        <Calendar size={16} />
                        <span>{formatDate(order.createAt)}</span>
                      </div>
                    </div>
                    <div className={`${styles.orderStatus} ${statusInfo.className}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className={styles.orderBooks}>
                    {order.items.slice(0, 3).map((book) => (
                      <div key={book.id} className={styles.bookThumbnail}>
                        <img src={book.cover_image || "/auth.jpg"} alt={book.title} />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className={styles.moreBooksIndicator}>+{order.items.length - 3}</div>
                    )}
                  </div>

                  <div className={styles.orderDetails}>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Tổng số lượng:</span>
                      <span className={styles.detailValue}>
                        {order.items.reduce((totalQuantity, book)=>(totalQuantity + book.quantity), 0)} sách</span>
                    </div>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>
                        {activeTab === "rental" ? "Tổng tiền thuê:" : "Tổng hoàn trả:"}
                      </span>
                      <span className={styles.detailValue}>
                        {(activeTab === "rental" ? order.totalPrice.toLocaleString('vi-VN') : order.totalRefund)}đ
                      </span>
                    </div>
                    {activeTab === "rental" && (
                      <div className={styles.orderDetail}>
                        <span className={styles.detailLabel}>Tiền đặt cọc:</span>
                        <span className={styles.detailValue}>{order.depositPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Phương thức:</span>
                      <span className={styles.detailValue}>
                        {activeTab === "rental"
                          ? order.deliveryMethod === "Online"
                            ? "Giao hàng tận nơi"
                            : "Nhận tại thư viện"
                          : order.returnMethod === "Online"
                            ? "Trả online"
                            : "Trả tại thư viện"}
                      </span>
                    </div>
                    {activeTab === "rental" && (
                      <div className={styles.orderDetail}>
                        <span className={styles.detailLabel}>Thanh toán:</span>
                        <span className={styles.detailValue}>
                          {order.paymentMethod === "Cash"
                            ? "Tiền mặt"
                            : order.paymentMethod === "BankTransfer"
                              ? "Thẻ ngân hàng"
                              : "Ví điện tử"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.orderActions}>
                    <button className={styles.viewDetailsButton} onClick={() => handleViewOrderDetails(order)}>
                      <span>Xem chi tiết</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className={styles.noOrders}>
            <Package size={48} />
            <p>Không tìm thấy đơn hàng nào phù hợp.</p>
            <button
              className={styles.resetFilterButton}
              onClick={() => {
                setActiveFilter("all")
                setSearchQuery("")
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage