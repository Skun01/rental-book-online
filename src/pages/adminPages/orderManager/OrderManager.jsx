import styles from "./OrderManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Eye, CheckCircle, XCircle, Clock, Package,
  Truck, Edit,
} from "lucide-react"
import { useState } from "react"
import OrderDetailModal from "../../../components/adminComponents/orderDetailModal/OrderDetailModal.jsx"

export default function OrderManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    deliveryMethod: "",
    sort: "created_desc",
  })
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filters.status || order.status === filters.status
    const matchesPayment = !filters.paymentMethod || order.paymentMethod === filters.paymentMethod
    const matchesDelivery = !filters.deliveryMethod || order.deliveryMethod === filters.deliveryMethod

    return matchesSearch && matchesStatus && matchesPayment && matchesDelivery
  })

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý đơn thuê sách</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.toolActions}>
          <Filter filters={filters} setFilters={setFilters} />
        </div>
      </div>

      <div className={styles.tableSection}>
        <OrderTable orders={filteredOrders} setSelectedOrder={setSelectedOrder} />
      </div>

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}

const Filter = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilter = () => {
    setIsOpen(false)
  }

  const handleResetFilter = () => {
    setFilters({
      status: "",
      paymentMethod: "",
      deliveryMethod: "",
      sort: "created_desc",
    })
    setIsOpen(false)
  }

  return (
    <div className={styles.filterContainer}>
      <button className={styles.filterButton} onClick={() => setIsOpen(!isOpen)}>
        <Funnel size={16} />
        <span>Bộ lọc</span>
        <ChevronDown size={16} className={isOpen ? styles.rotated : ""} />
      </button>

      {isOpen && (
        <div className={styles.filterDropdown}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trạng thái</label>
            <select
              className={styles.filterSelect}
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="preparing">Đang chuẩn bị</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Thanh toán</label>
            <select
              className={styles.filterSelect}
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
            >
              <option value="">Tất cả phương thức</option>
              <option value="CASH">Tiền mặt</option>
              <option value="CARD">Thẻ ngân hàng</option>
              <option value="MOMO">Ví MoMo</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Giao hàng</label>
            <select
              className={styles.filterSelect}
              value={filters.deliveryMethod}
              onChange={(e) => handleFilterChange("deliveryMethod", e.target.value)}
            >
              <option value="">Tất cả phương thức</option>
              <option value="library-pickup">Nhận tại thư viện</option>
              <option value="home-delivery">Giao hàng tận nơi</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sắp xếp</label>
            <select
              className={styles.filterSelect}
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="created_desc">Mới nhất</option>
              <option value="created_asc">Cũ nhất</option>
              <option value="total_desc">Giá trị cao nhất</option>
              <option value="total_asc">Giá trị thấp nhất</option>
            </select>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.filterReset} onClick={handleResetFilter}>
              Đặt lại
            </button>
            <button className={styles.filterApply} onClick={handleApplyFilter}>
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const OrderTable = ({ orders, setSelectedOrder }) => {
  const [editingOrder, setEditingOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")

  function handleEditOrder(order) {
    setEditingOrder(order.id)
    setNewStatus(order.status)
  }

  function handleSaveStatus(orderId) {
    console.log(`Update order ${orderId} to status: ${newStatus}`)
    // Thêm logic cập nhật trạng thái ở đây
    setEditingOrder(null)
  }

  function handleCancelEdit() {
    setEditingOrder(null)
    setNewStatus("")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Chờ xác nhận", class: styles.statusPending, icon: Clock },
      confirmed: { label: "Đã xác nhận", class: styles.statusConfirmed, icon: CheckCircle },
      preparing: { label: "Đang chuẩn bị", class: styles.statusPreparing, icon: Package },
      shipping: { label: "Đang giao hàng", class: styles.statusShipping, icon: Truck },
      delivered: { label: "Đã giao hàng", class: styles.statusDelivered, icon: CheckCircle },
      cancelled: { label: "Đã hủy", class: styles.statusCancelled, icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <span className={config.class}>
        <IconComponent size={12} />
        {config.label}
      </span>
    )
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: "Tiền mặt",
      CARD: "Thẻ ngân hàng",
      MOMO: "Ví MoMo",
    }
    return methods[method] || method
  }

  const getDeliveryMethodText = (method) => {
    const methods = {
      "library-pickup": "Nhận tại thư viện",
      "home-delivery": "Giao hàng tận nơi",
    }
    return methods[method] || method
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  if (orders.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.noResults}>
          <p>Không tìm thấy đơn hàng nào phù hợp</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Số sách</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Giao hàng</th>
            <th>Trạng thái</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <span className={styles.orderId}>#{order.orderId}</span>
              </td>
              <td>
                <div className={styles.customerInfo}>
                  <h4>{order.customerName}</h4>
                  <p>{order.customerEmail}</p>
                </div>
              </td>
              <td>{formatDate(order.orderDate)}</td>
              <td>
                <span className={styles.bookCount}>{order.totalBooks} cuốn</span>
              </td>
              <td>
                <span className={styles.totalAmount}>{order.totalPayment.toLocaleString("vi-VN")}đ</span>
              </td>
              <td>{getPaymentMethodText(order.paymentMethod)}</td>
              <td>{getDeliveryMethodText(order.deliveryMethod)}</td>
              <td>
                {editingOrder === order.id ? (
                  <div className={styles.statusEditContainer}>
                    <select
                      className={styles.statusSelect}
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="preparing">Đang chuẩn bị</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="delivered">Đã giao hàng</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                    <div className={styles.statusEditActions}>
                      <button
                        className={styles.saveStatusButton}
                        onClick={() => handleSaveStatus(order.orderId)}
                        title="Lưu"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button className={styles.cancelStatusButton} onClick={handleCancelEdit} title="Hủy">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  getStatusBadge(order.status)
                )}
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.viewButton} title="Xem chi tiết" onClick={() => setSelectedOrder(order)}>
                    <Eye size={16} />
                  </button>
                  <button
                    className={styles.editButton}
                    title="Chỉnh sửa đơn hàng"
                    onClick={() => handleEditOrder(order)}
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



// Mock data
const orders = [
  {
    id: 1,
    orderId: "ORD-5823",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyen.van.a@gmail.com",
    customerPhone: "0123456789",
    orderDate: "2024-01-15T10:30:00",
    status: "pending",
    paymentMethod: "CARD",
    deliveryMethod: "home-delivery",
    address: "123 Đường ABC, Quận 1, Hồ Chí Minh",
    totalBooks: 3,
    totalRental: 80000,
    totalDeposit: 320000,
    shippingFee: 30000,
    totalPayment: 110000,
    items: [
      {
        id: 1,
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        cover_image: "/Book.jpg",
        rental_price: 25000,
        deposit_price: 100000,
        quantity: 2,
        rent_day: 20,
      },
      {
        id: 2,
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        cover_image: "/Book.jpg",
        rental_price: 30000,
        deposit_price: 120000,
        quantity: 1,
        rent_day: 14,
      },
    ],
  },
  {
    id: 2,
    orderId: "ORD-5824",
    customerName: "Trần Thị B",
    customerEmail: "tran.thi.b@gmail.com",
    customerPhone: "0987654321",
    orderDate: "2024-01-16T14:20:00",
    status: "confirmed",
    paymentMethod: "MOMO",
    deliveryMethod: "library-pickup",
    address: "",
    totalBooks: 2,
    totalRental: 60000,
    totalDeposit: 200000,
    shippingFee: 0,
    totalPayment: 60000,
    items: [
      {
        id: 3,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        cover_image: "/Book.jpg",
        rental_price: 30000,
        deposit_price: 100000,
        quantity: 2,
        rent_day: 10,
      },
    ],
  },
  {
    id: 3,
    orderId: "ORD-5825",
    customerName: "Lê Văn C",
    customerEmail: "le.van.c@gmail.com",
    customerPhone: "0369852147",
    orderDate: "2024-01-17T09:15:00",
    status: "delivered",
    paymentMethod: "CASH",
    deliveryMethod: "home-delivery",
    address: "456 Đường XYZ, Quận 3, Hồ Chí Minh",
    totalBooks: 1,
    totalRental: 45000,
    totalDeposit: 150000,
    shippingFee: 30000,
    totalPayment: 75000,
    items: [
      {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        cover_image: "/Book.jpg",
        rental_price: 45000,
        deposit_price: 150000,
        quantity: 1,
        rent_day: 15,
      },
    ],
  },
]
