"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Package, CheckCircle, XCircle, Clock, Truck, Search, ArrowRight, RefreshCw } from "lucide-react"
import styles from "./OrdersPage.module.css"

// Dữ liệu mẫu cho đơn hàng thuê sách
const mockRentalOrders = [
  {
    id: "ORD-5823",
    date: "2023-05-15T10:30:00",
    status: "pending", // pending, processing, completed, cancelled
    totalItems: 3,
    totalAmount: 250000,
    depositAmount: 500000,
    books: [
      {
        id: 1,
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        cover_image: "/Book.jpg",
      },
      {
        id: 2,
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        cover_image: "/Book.jpg",
      },
      {
        id: 3,
        title: "Tư Duy Phản Biện",
        author: "Albert Rutherford",
        cover_image: "/Book.jpg",
      },
    ],
    deliveryMethod: "home-delivery",
    paymentMethod: "MOMO",
  },
  {
    id: "ORD-6104",
    date: "2023-04-02T14:45:00",
    status: "processing",
    totalItems: 2,
    totalAmount: 180000,
    depositAmount: 360000,
    books: [
      {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        cover_image: "/Book.jpg",
      },
      {
        id: 5,
        title: "Sapiens: Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        cover_image: "/Book.jpg",
      },
    ],
    deliveryMethod: "library-pickup",
    paymentMethod: "CASH",
  },
  {
    id: "ORD-7291",
    date: "2023-03-18T09:15:00",
    status: "completed",
    totalItems: 1,
    totalAmount: 95000,
    depositAmount: 200000,
    books: [
      {
        id: 6,
        title: "Người Giàu Có Nhất Thành Babylon",
        author: "George S. Clason",
        cover_image: "/Book.jpg",
      },
    ],
    deliveryMethod: "home-delivery",
    paymentMethod: "CARD",
  },
  {
    id: "ORD-8456",
    date: "2023-02-25T16:20:00",
    status: "cancelled",
    totalItems: 2,
    totalAmount: 150000,
    depositAmount: 300000,
    books: [
      {
        id: 7,
        title: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya",
        author: "Keigo Higashino",
        cover_image: "/Book.jpg",
      },
      {
        id: 8,
        title: "Rừng Na Uy",
        author: "Haruki Murakami",
        cover_image: "/Book.jpg",
      },
    ],
    deliveryMethod: "home-delivery",
    paymentMethod: "MOMO",
    cancelReason: "Người dùng hủy",
  },
]

// Dữ liệu mẫu cho đơn hàng trả sách
const mockReturnOrders = [
  {
    id: "RET-1234",
    date: "2023-05-20T11:45:00",
    status: "pending", // pending, processing, completed
    totalItems: 2,
    totalRefund: 320000,
    books: [
      {
        id: 1,
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        cover_image: "/Book.jpg",
      },
      {
        id: 2,
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        cover_image: "/Book.jpg",
      },
    ],
    returnMethod: "online",
  },
  {
    id: "RET-2345",
    date: "2023-04-15T13:30:00",
    status: "processing",
    totalItems: 1,
    totalRefund: 150000,
    books: [
      {
        id: 6,
        title: "Người Giàu Có Nhất Thành Babylon",
        author: "George S. Clason",
        cover_image: "/Book.jpg",
      },
    ],
    returnMethod: "library",
  },
  {
    id: "RET-3456",
    date: "2023-03-10T09:00:00",
    status: "completed",
    totalItems: 3,
    totalRefund: 450000,
    books: [
      {
        id: 3,
        title: "Tư Duy Phản Biện",
        author: "Albert Rutherford",
        cover_image: "/Book.jpg",
      },
      {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        cover_image: "/Book.jpg",
      },
      {
        id: 5,
        title: "Sapiens: Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        cover_image: "/Book.jpg",
      },
    ],
    returnMethod: "online",
  },
]

const OrdersPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("rental")
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Giả lập việc lấy dữ liệu từ API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Lọc đơn hàng dựa trên tab, bộ lọc và tìm kiếm
  useEffect(() => {
    const orders = activeTab === "rental" ? mockRentalOrders : mockReturnOrders

    let filtered = [...orders]

    // Lọc theo trạng thái
    if (activeFilter !== "all") {
      filtered = filtered.filter((order) => order.status === activeFilter)
    }

    // Lọc theo tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((order) => {
        // Tìm kiếm theo mã đơn hàng
        if (order.id.toLowerCase().includes(query)) return true

        // Tìm kiếm theo tên sách
        return order.books.some(
          (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
        )
      })
    }

    setFilteredOrders(filtered)
  }, [activeTab, activeFilter, searchQuery])

  // Xử lý chuyển đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveFilter("all")
    setSearchQuery("")
  }

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Xử lý xem chi tiết đơn hàng
  const handleViewOrderDetails = (order) => {
    if (activeTab === "rental") {
      navigate("/orders/success", { state: order })
    } else {
      navigate("/return-success", { state: order })
    }
  }

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Lấy thông tin trạng thái đơn hàng
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Chờ xác nhận",
          icon: <Clock size={18} />,
          className: styles.statusPending,
        }
      case "processing":
        return {
          text: "Đang xử lý",
          icon: <Truck size={18} />,
          className: styles.statusProcessing,
        }
      case "completed":
        return {
          text: "Hoàn thành",
          icon: <CheckCircle size={18} />,
          className: styles.statusCompleted,
        }
      case "cancelled":
        return {
          text: "Đã hủy",
          icon: <XCircle size={18} />,
          className: styles.statusCancelled,
        }
      default:
        return {
          text: status,
          icon: null,
          className: "",
        }
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

        <div className={styles.controlsSection}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sách..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${activeFilter === "all" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              Tất cả
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === "pending" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("pending")}
            >
              Chờ xác nhận
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === "processing" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("processing")}
            >
              {activeTab === "rental" ? "Đang giao" : "Đang xử lý"}
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === "completed" ? styles.activeFilter : ""}`}
              onClick={() => handleFilterChange("completed")}
            >
              Hoàn thành
            </button>
            {activeTab === "rental" && (
              <button
                className={`${styles.filterButton} ${activeFilter === "cancelled" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("cancelled")}
              >
                Đã hủy
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loading}></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3 className={styles.orderId}>{order.id}</h3>
                      <div className={styles.orderDate}>
                        <Calendar size={16} />
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </div>
                    <div className={`${styles.orderStatus} ${statusInfo.className}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className={styles.orderBooks}>
                    {order.books.slice(0, 3).map((book) => (
                      <div key={book.id} className={styles.bookThumbnail}>
                        <img src={book.cover_image || "/placeholder.svg"} alt={book.title} />
                      </div>
                    ))}
                    {order.books.length > 3 && (
                      <div className={styles.moreBooksIndicator}>+{order.books.length - 3}</div>
                    )}
                  </div>

                  <div className={styles.orderDetails}>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Số lượng:</span>
                      <span className={styles.detailValue}>{order.totalItems} sách</span>
                    </div>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>
                        {activeTab === "rental" ? "Tổng tiền thuê:" : "Tổng hoàn trả:"}
                      </span>
                      <span className={styles.detailValue}>
                        {(activeTab === "rental" ? order.totalAmount : order.totalRefund)}đ
                      </span>
                    </div>
                    {activeTab === "rental" && (
                      <div className={styles.orderDetail}>
                        <span className={styles.detailLabel}>Tiền đặt cọc:</span>
                        <span className={styles.detailValue}>{order.depositAmount}đ</span>
                      </div>
                    )}
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Phương thức:</span>
                      <span className={styles.detailValue}>
                        {activeTab === "rental"
                          ? order.deliveryMethod === "home-delivery"
                            ? "Giao hàng tận nơi"
                            : "Nhận tại thư viện"
                          : order.returnMethod === "online"
                            ? "Trả online"
                            : "Trả tại thư viện"}
                      </span>
                    </div>
                    {activeTab === "rental" && (
                      <div className={styles.orderDetail}>
                        <span className={styles.detailLabel}>Thanh toán:</span>
                        <span className={styles.detailValue}>
                          {order.paymentMethod === "CASH"
                            ? "Tiền mặt"
                            : order.paymentMethod === "CARD"
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
            <p>Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.</p>
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
