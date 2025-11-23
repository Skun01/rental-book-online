import styles from "./OrderManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Eye, CheckCircle, XCircle, Clock, Package,
  Truck, Edit, RefreshCw
} from "lucide-react"
import { useState, useEffect } from "react"
import OrderDetailModal from "../../../components/adminComponents/orderDetailModal/OrderDetailModal.jsx"
import {getAllOrderGet, updateOrderStatus} from '../../../api/orderApi.jsx'

const token = localStorage.getItem('token')

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
  const [updatingOrders, setUpdatingOrders] = useState(new Set())
  
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
        const apiParams = {
            page: 0,
            size: 1000,
            sortDir: filters.sort === 'created_desc' ? 'desc' : 'asc',
            ...(filters.orderStatus && { orderStatus: filters.orderStatus }),
        }

        let fetchedData = await getAllOrderGet(apiParams)
        
        if (!fetchedData) fetchedData = []

        const finalData = fetchedData.filter(order => {
            if (filters.paymentMethod && order.paymentMethod !== filters.paymentMethod) {
                return false
            }
            if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) {
                return false
            }
            if (filters.deliveryMethod && order.deliveryMethod !== filters.deliveryMethod) {
                return false
            }
            return true
        })

        setOrders(finalData)

    } catch (err) {
        setError(err.message)
        console.error('Error fetching orders:', err)
        setOrders([])
    } finally {
        setLoading(false)
    }
}

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm)

    return matchesSearch
  })

  const handleOrderUpdate = async (orderId, newStatus) => {
    setUpdatingOrders(prev => new Set([...prev, orderId]))
    
    try {
      await updateOrderStatus(orderId, newStatus, token)
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        )
      )
      
    } catch (err) {
      console.error(`Failed to update order status:`, err)
      setError(`Không thể cập nhật trạng thái đơn hàng: ${err.message}`)
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }

  const handleRefresh = () => {
    fetchOrders()
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý đơn thuê sách</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <Search strokeWidth={2} />
          </div>
        </div>

        <div className={styles.toolActions}>
          <button 
            className={styles.refreshButton} 
            onClick={handleRefresh}
            disabled={loading}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={16} className={loading ? styles.spinning : ""} />
            Làm mới
          </button>
          <Filter filters={filters} setFilters={setFilters} />
        </div>
      </div>

      <div className={styles.tableSection}>
        {loading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
        {error && (
          <div className={styles.error}>
            <span>Lỗi: {error}</span>
            <button onClick={() => setError(null)} className={styles.errorClose}>×</button>
          </div>
        )}
        {!loading && !error && (
          <OrderTable 
            orders={filteredOrders} 
            setSelectedOrder={setSelectedOrder}
            onOrderUpdate={handleOrderUpdate}
            updatingOrders={updatingOrders}
          />
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  )
}

const Filter = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters)
    }
  }, [isOpen, filters])

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilter = () => {
    setFilters(localFilters)
    setIsOpen(false)
  }

  const handleResetFilter = () => {
    const defaultFilters = {
      orderStatus: "",
      paymentMethod: "",
      paymentStatus: "",
      deliveryMethod: "",
      sort: "created_desc",
    }
    setLocalFilters(defaultFilters)
    setFilters(defaultFilters)
    setIsOpen(false)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== "" && value !== "created_desc"
  )

  return (
    <div className={styles.filterContainer}>
      <button 
        className={`${styles.filterButton} ${hasActiveFilters ? styles.filterActive : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Funnel size={16} />
        <span>Bộ lọc</span>
        {hasActiveFilters && <span className={styles.filterCount}>●</span>}
        <ChevronDown size={16} className={isOpen ? styles.rotated : ""} />
      </button>

      {isOpen && (
        <div className={styles.filterDropdown}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trạng thái đơn hàng</label>
            <select
              className={styles.filterSelect}
              value={localFilters.orderStatus}
              onChange={(e) => handleFilterChange("orderStatus", e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Processing">Chờ xác nhận</option>
              <option value="Confirmed">Đang xử lý</option>
              <option value="Delivered">Đã giao hàng</option>
              <option value="Received">Đã giao thành công</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Thanh toán</label>
            <select
              className={styles.filterSelect}
              value={localFilters.paymentMethod}
              onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
            >
              <option value="">Tất cả phương thức</option>
              <option value="Cash">Tiền mặt</option>
              <option value="BankTransfer">Chuyển khoản</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trạng thái thanh toán</label>
            <select
              className={styles.filterSelect}
              value={localFilters.paymentStatus}
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
              value={localFilters.deliveryMethod}
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

const OrderTable = ({ orders, setSelectedOrder, onOrderUpdate, updatingOrders }) => {
  const [editingOrder, setEditingOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")

  function handleEditOrder(order) {
    setEditingOrder(order.id)
    setNewStatus(order.orderStatus)
  }

  async function handleSaveStatus(orderId) {
    if (newStatus === "") return
    
    try {
      await onOrderUpdate(orderId, newStatus)
      setEditingOrder(null)
      setNewStatus("")
    } catch (err) {
      console.error(`Can't update order status:`, err)
    }
  }

  function handleCancelEdit() {
    setEditingOrder(null)
    setNewStatus("")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Processing: { label: "Chờ xác nhận", class: styles.statusPending, icon: Clock },
      Confirmed: { label: "Đang xử lý", class: styles.statusConfirmed, icon: Package },
      Delivered: { label: "Đã giao hàng", class: styles.statusShipping, icon: Truck },
      Received: {label: "Đã nhận hàng", class: styles.statusDelivered, icon: CheckCircle},
      Cancelled: { label: "Đã hủy", class: styles.statusCancelled, icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.Processing
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
      BankTransfer: "Chuyển khoản",
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
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
                      disabled={updatingOrders.has(order.id)}
                    >
                      <option value="Processing">Chờ xác nhận</option>
                      <option value="Confirmed">Đang xử lý</option>
                      <option value="Delivered">Đã giao hàng</option>
                      <option value="Received">Đã giao thành công</option>
                      <option value="Cancelled">Đã hủy</option>
                    </select>
                    <div className={styles.statusEditActions}>
                      <button
                        className={styles.saveStatusButton}
                        onClick={() => handleSaveStatus(order.id)}
                        disabled={updatingOrders.has(order.id)}
                        title="Lưu"
                      >
                        {updatingOrders.has(order.id) ? (
                          <RefreshCw size={14} className={styles.spinning} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                      </button>
                      <button 
                        className={styles.cancelStatusButton} 
                        onClick={handleCancelEdit} 
                        disabled={updatingOrders.has(order.id)}
                        title="Hủy"
                      >
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
                  <button 
                    className={styles.viewButton} 
                    title="Xem chi tiết" 
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className={styles.editButton}
                    title="Chỉnh sửa đơn hàng"
                    onClick={() => handleEditOrder(order)}
                    disabled={editingOrder === order.id || updatingOrders.has(order.id)}
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