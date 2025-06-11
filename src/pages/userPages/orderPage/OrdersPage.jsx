import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Package, CheckCircle2, XCircle, Clock, Truck, Search, ArrowRight, RefreshCw, RotateCcw } from "lucide-react"
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
        let apiUrl = ""
        
        if (activeTab === "rental") {
          apiUrl = `http://localhost:8080/api/v1/order/rental/all?page=0&size=1000&sortDir=asc&userId=${currentUser.id}`
          if (activeFilter !== 'all') {
            apiUrl += `&orderStatus=${activeFilter}`
          }
        } else {
          apiUrl = `http://localhost:8080/api/v1/order/rented/all?page=0&size=1000&sortDir=asc&userId=${currentUser.id}`
          if (activeFilter !== 'all') {
            apiUrl += `&orderStatus=${activeFilter}`
          }
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`
          }
        })
        
        setFilteredOrders(response.data.data.content)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setIsLoading(false)
      }
    }

    getOrdersData()
  }, [activeFilter, activeTab, currentUser.id])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveFilter("all")
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  const handleViewOrderDetails = (order) => {
    if (activeTab === "rental") {
      navigate(`/orders/${order.id}`, {state: {order}})
    } else {
      navigate(`/return-orders/${order.id}`, {state: {order}})
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
      case "Returned":
        return {
          text: "Đã trả",
          icon: <RotateCcw size={18} />,
          className: styles.statusReturned,
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

  const calculateTotalPrice = (order) => {
    if (activeTab === "rental") {
      return order.totalPrice || order.items.reduce((total, item) => total + (item.totalRental || 0), 0)
    } else {
      return order.items.reduce((total, item) => total + (item.totalRental || 0), 0)
    }
  }

  const calculateDepositPrice = (order) => {
    if (activeTab === "rental") {
      return order.depositPrice || order.items.reduce((total, item) => total + (item.totalDeposit || 0), 0)
    } else {
      return order.items.reduce((total, item) => total + (item.totalDeposit || 0), 0)
    }
  }

  const getFilterButtons = () => {
    const commonFilters = [
      { key: "all", label: "Tất cả" },
      { key: "Processing", label: "Chờ xác nhận" },
      { key: "Confirmed", label: "Đã xác nhận" },
      { key: "Delivering", label: "Đang giao" },
      { key: "Completed", label: "Hoàn thành" }
    ]

    if (activeTab === "rental") {
      return [...commonFilters, { key: "Cancelled", label: "Đã hủy" }]
    } else {
      return [...commonFilters, { key: "Returned", label: "Đã trả" }]
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
          <div className={styles.filterButtons}>
            {getFilterButtons().map((filter) => (
              <button
                key={filter.key}
                className={`${styles.filterButton} ${activeFilter === filter.key ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange(filter.key)}
              >
                {filter.label}
              </button>
            ))}
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
              const totalPrice = calculateTotalPrice(order)
              const depositPrice = calculateDepositPrice(order)
              
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
                        <img src={book.imageUrl || book.cover_image || "/auth.jpg"} alt={book.bookName || book.title} />
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
                        {order.items.reduce((totalQuantity, book) => (totalQuantity + book.quantity), 0)} sách
                      </span>
                    </div>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>
                        {activeTab === "rental" ? "Tổng tiền thuê:" : "Tổng tiền thuê:"}
                      </span>
                      <span className={styles.detailValue}>
                        {totalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Tiền đặt cọc:</span>
                      <span className={styles.detailValue}>{depositPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Phương thức:</span>
                      <span className={styles.detailValue}>
                        {order.deliveryMethod === "Online"
                          ? "Giao hàng tận nơi"
                          : "Nhận tại thư viện"}
                      </span>
                    </div>
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
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Trạng thái thanh toán:</span>
                      <span className={`${styles.detailValue} ${order.paymentStatus === 'Paid' ? styles.paidStatus : styles.unpaidStatus}`}>
                        {order.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
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