import styles from "./OrderManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Eye, CheckCircle, XCircle, Clock, Package,
  Truck, Edit,
} from "lucide-react"
import { useState, useEffect } from "react"
import OrderDetailModal from "../../../components/adminComponents/orderDetailModal/OrderDetailModal.jsx"
import {getAllOrderGet} from '../../../api/orderApi.jsx'

export default function OrderManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    orderStatus: "",
    paymentMethod: "",
    paymentStatus: "",
    deliveryMethod: "",
    sort: "created_desc",
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: 0,
        size: 1000,
        sortDir: 'desc',
        ...(filters.orderStatus && { orderStatus: filters.orderStatus }),
        ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
      })

      const rentalOrder = await getAllOrderGet()
    
      setOrders(rentalOrder || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filters])

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm)

    return matchesSearch
  })

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý đơn thuê sách</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, số điện thoại..."
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
        {loading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
        {error && <div className={styles.error}>Lỗi: {error}</div>}
        {!loading && !error && (
          <OrderTable orders={filteredOrders} setSelectedOrder={setSelectedOrder} />
        )}
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
      orderStatus: "",
      paymentMethod: "",
      paymentStatus: "",
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
            <label className={styles.filterLabel}>Trạng thái đơn hàng</label>
            <select
              className={styles.filterSelect}
              value={filters.orderStatus}
              onChange={(e) => handleFilterChange("orderStatus", e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Pending">Chờ xác nhận</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Delivered">Đã giao thành công</option>
              <option value="Cancelled">Đã hủy</option>
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
              <option value="Cash">Tiền mặt</option>
              <option value="MoMo">Ví MoMo</option>
              <option value="Banking">Chuyển khoản</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trạng thái thanh toán</label>
            <select
              className={styles.filterSelect}
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Unpaid">Chưa thanh toán</option>
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
              <option value="Offline">Nhận tại thư viện</option>
              <option value="Online">Giao hàng tận nơi</option>
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
    setNewStatus(order.orderStatus)
  }

  function handleSaveStatus(orderId) {
    console.log(`Update order ${orderId} to status: ${newStatus}`)
    // TODO: Implement API call to update order status
    // Example: PUT http://localhost:8080/api/v1/order/rental/${orderId}/status
    setEditingOrder(null)
  }

  function handleCancelEdit() {
    setEditingOrder(null)
    setNewStatus("")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { label: "Chờ xác nhận", class: styles.statusPending, icon: Clock },
      Processing: { label: "Đang xử lý", class: styles.statusConfirmed, icon: Package },
      Shipped: { label: "Đã giao hàng", class: styles.statusShipping, icon: Truck },
      Delivered: { label: "Đã giao thành công", class: styles.statusDelivered, icon: CheckCircle },
      Cancelled: { label: "Đã hủy", class: styles.statusCancelled, icon: XCircle },
      Returned: { label: "Đã trả", class: styles.statusDelivered, icon: CheckCircle },
    }

    const config = statusConfig[status] || statusConfig.Pending
    const IconComponent = config.icon

    return (
      <span className={config.class}>
        <IconComponent size={12} />
        {config.label}
      </span>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      Paid: { label: "Đã thanh toán", class: styles.statusDelivered },
      Unpaid: { label: "Chưa thanh toán", class: styles.statusPending },
      Partial: { label: "Thanh toán một phần", class: styles.statusPreparing },
      Refunded: { label: "Đã hoàn tiền", class: styles.statusCancelled },
    }

    const config = statusConfig[status] || statusConfig.Unpaid

    return (
      <span className={config.class}>
        {config.label}
      </span>
    )
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      Cash: "Tiền mặt",
      Card: "Thẻ ngân hàng",
      MoMo: "Ví MoMo",
      Banking: "Chuyển khoản",
    }
    return methods[method] || method
  }

  const getDeliveryMethodText = (method) => {
    const methods = {
      Offline: "Nhận tại thư viện",
      Online: "Giao hàng tận nơi",
    }
    return methods[method] || method
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const getTotalBooks = (items) => {
    return items?.reduce((total, item) => total + item.quantity, 0) || 0
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
            <th>Tổng tiền thuê</th>
            <th>Thanh toán</th>
            <th>Tình trạng</th>
            <th>Giao hàng</th>
            <th>Trạng thái</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <span className={styles.orderId}>#{order.id}</span>
              </td>
              <td>
                <div className={styles.customerInfo}>
                  <h4>{order.fullName}</h4>
                  <p>{order.phone}</p>
                </div>
              </td>
              <td>{formatDate(order.createAt)}</td>
              <td>
                <span className={styles.bookCount}>{getTotalBooks(order.items)} cuốn</span>
              </td>
              <td>
                <span className={styles.totalAmount}>{order.totalPrice?.toLocaleString("vi-VN")}đ</span>
              </td>
              <td>{getPaymentMethodText(order.paymentMethod)}</td>
              <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
              <td>{getDeliveryMethodText(order.deliveryMethod)}</td>
              <td>
                {editingOrder === order.id ? (
                  <div className={styles.statusEditContainer}>
                    <select
                      className={styles.statusSelect}
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Pending">Chờ xác nhận</option>
                      <option value="Processing">Đang xử lý</option>
                      <option value="Shipped">Đã giao hàng</option>
                      <option value="Delivered">Đã giao thành công</option>
                      <option value="Cancelled">Đã hủy</option>
                      <option value="Returned">Đã trả</option>
                    </select>
                    <div className={styles.statusEditActions}>
                      <button
                        className={styles.saveStatusButton}
                        onClick={() => handleSaveStatus(order.id)}
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
                  getStatusBadge(order.orderStatus)
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