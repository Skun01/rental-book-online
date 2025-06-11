import styles from "./ReturnManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Eye, CheckCircle, XCircle, Clock, Package, 
  Truck, Edit, Home, RefreshCw} from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import ReturnDetailModal from "../../../components/adminComponents/returnDetailModal/ReturnDetailModal"
import { allReturnOrderGet, updateOrderStatusPut } from "../../../api/returnApi"

export default function ReturnManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "",
    returnMethod: "",
    sort: "created_desc",
  })
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [apiData, setApiData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReturnData()
  }, [])

  const processedReturns = useMemo(() => {
    if (!apiData.length) return []

    return apiData.map(order => {
      const totalBooks = order.items.reduce((sum, item) => sum + item.quantity, 0)
      const totalRental = order.items.reduce((sum, item) => sum + item.totalRental, 0)
      const totalDeposit = order.items.reduce((sum, item) => sum + item.totalDeposit, 0)
      
      // Tính refund amount dựa trên trạng thái
      let refundAmount = 0
      if (order.orderStatus === 'Received') {
        // Đã nhận sách = hoàn tiền đặt cọc
        refundAmount = totalDeposit
      } else if (order.orderStatus === 'Cancelled') {
        // Đã hủy = hoàn tiền đặt cọc
        refundAmount = totalDeposit
      } else {
        // Processing, Confirmed = chưa hoàn tiền
        refundAmount = 0
      }

      return {
        id: order.id,
        returnId: `${order.id}`,
        customerName: order.fullName || `Khách hàng #${order.id}`,
        customerEmail: `customer${order.id}@email.com`,
        customerPhone: order.phone || '',
        returnDate: order.returnDate || order.createAt,
        estimatedPickupDate: order.returnDate,
        status: order.orderStatus, // Sử dụng trực tiếp API status
        returnMethod: order.deliveryMethod === 'Offline' ? 'library' : 'online',
        address: `${order.street || ''} ${order.ward || ''} ${order.district || ''} ${order.city || ''}`.trim(),
        notes: order.notes || '',
        totalBooks: totalBooks,
        totalDeposit: totalDeposit,
        totalRental: totalRental,
        totalOverdueFee: 0,
        totalRefund: refundAmount,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        userId: order.userId,
        branchId: order.branchId,
        books: order.items
      }
    })
  }, [apiData])

  const fetchReturnData = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await allReturnOrderGet()
      setApiData(response)
    } catch (error) {
      console.error('Error fetching return data:', error)
      setError('Không thể tải dữ liệu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusPut(orderId, newStatus)
      await fetchReturnData()
      return true
    } catch (error) {
      console.error('Error updating order status:', error)
      setError('Không thể cập nhật trạng thái. Vui lòng thử lại.')
      return false
    }
  }

  const filteredReturns = processedReturns.filter((returnItem) => {
    const matchesSearch =
      returnItem.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customerPhone.includes(searchTerm)

    const matchesStatus = !filters.status || returnItem.status === filters.status
    const matchesMethod = !filters.returnMethod || returnItem.returnMethod === filters.returnMethod

    return matchesSearch && matchesStatus && matchesMethod
  })

  const sortedReturns = useMemo(() => {
    return [...filteredReturns].sort((a, b) => {
      switch (filters.sort) {
        case 'created_desc':
          return new Date(b.returnDate) - new Date(a.returnDate)
        case 'created_asc':
          return new Date(a.returnDate) - new Date(b.returnDate)
        case 'refund_desc':
          return b.totalRefund - a.totalRefund
        case 'refund_asc':
          return a.totalRefund - b.totalRefund
        default:
          return 0
      }
    })
  }, [filteredReturns, filters.sort])

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý trả sách</div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo mã trả, tên khách hàng, SĐT..."
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
            onClick={fetchReturnData}
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
        <ReturnTable 
          returns={sortedReturns} 
          setSelectedReturn={setSelectedReturn}
          updateOrderStatus={updateOrderStatus}
          loading={loading}
        />
      </div>

      {selectedReturn && (
        <ReturnDetailModal 
          returnItem={selectedReturn} 
          onClose={() => setSelectedReturn(null)}
          updateOrderStatus={updateOrderStatus}
        />
      )}
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
      returnMethod: "",
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
              <option value="Processing">Chờ xử lý</option>
              <option value="Confirmed">Đã xác nhận</option>
              <option value="Received">Đã nhận sách</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Phương thức trả</label>
            <select
              className={styles.filterSelect}
              value={filters.returnMethod}
              onChange={(e) => handleFilterChange("returnMethod", e.target.value)}
            >
              <option value="">Tất cả phương thức</option>
              <option value="library">Trả tại thư viện</option>
              <option value="online">Trả online</option>
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
              <option value="refund_desc">Hoàn trả cao nhất</option>
              <option value="refund_asc">Hoàn trả thấp nhất</option>
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

const ReturnTable = ({ returns, setSelectedReturn, updateOrderStatus, loading }) => {
  const [editingReturn, setEditingReturn] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [editingNotes, setEditingNotes] = useState(null)
  const [newNotes, setNewNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  function handleEditReturn(returnItem) {
    setEditingReturn(returnItem.id)
    setNewStatus(returnItem.status)
  }

  async function handleSaveStatus(returnId) {
    setUpdating(true)
    try {
      const success = await updateOrderStatus(returnId, newStatus)
      if (success) {
        setEditingReturn(null)
        setNewStatus("")
      }
    } catch (error) {
      console.error('Error saving status:', error)
    } finally {
      setUpdating(false)
    }
  }

  function handleCancelEdit() {
    setEditingReturn(null)
    setNewStatus("")
  }

  function handleEditNotes(returnItem) {
    setEditingNotes(returnItem.id)
    setNewNotes(returnItem.notes || "")
  }

  function handleSaveNotes(returnId) {
    console.log(`Update notes for return ${returnId}: ${newNotes}`)
    setEditingNotes(null)
  }

  function handleCancelEditNotes() {
    setEditingNotes(null)
    setNewNotes("")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Processing: { 
        label: "Chờ xử lý", 
        class: styles.statusProcessing, 
        icon: Clock 
      },
      Confirmed: { 
        label: "Đã xác nhận", 
        class: styles.statusConfirmed, 
        icon: CheckCircle 
      },
      Received: { 
        label: "Đã nhận sách", 
        class: styles.statusReceived, 
        icon: Package 
      },
      Cancelled: { 
        label: "Đã hủy", 
        class: styles.statusCancelled, 
        icon: XCircle 
      },
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

  const getReturnMethodText = (method) => {
    const methods = {
      library: "Trả tại thư viện",
      online: "Trả online",
    }
    return methods[method] || method
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loading}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (returns.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.noResults}>
          <p>Không tìm thấy đơn trả sách nào phù hợp</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã trả</th>
            <th>Khách hàng</th>
            <th>Ngày tạo</th>
            <th>Số sách</th>
            <th>Tiền hoàn trả</th>
            <th>Phương thức</th>
            <th>Ghi chú</th>
            <th>Trạng thái</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((returnItem) => (
            <tr key={returnItem.id}>
              <td>
                <span className={styles.returnId}>#{returnItem.returnId}</span>
              </td>
              <td>
                <div className={styles.customerInfo}>
                  <h4>{returnItem.customerName}</h4>
                  <p>{returnItem.customerPhone}</p>
                </div>
              </td>
              <td>{formatDate(returnItem.returnDate)}</td>
              <td>
                <span className={styles.bookCount}>{returnItem.totalBooks} cuốn</span>
              </td>
              <td>
                <span className={styles.refundAmount}>
                  {returnItem.totalRefund.toLocaleString("vi-VN")}đ
                </span>
              </td>
              <td>
                <div className={styles.methodBadge}>
                  {returnItem.returnMethod === "library" ? <Home size={14} /> : <Truck size={14} />}
                  {getReturnMethodText(returnItem.returnMethod)}
                </div>
              </td>
              <td>
                {editingNotes === returnItem.id ? (
                  <div className={styles.notesEditContainer}>
                    <textarea
                      className={styles.notesTextarea}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Nhập ghi chú..."
                      rows={2}
                    />
                    <div className={styles.notesEditActions}>
                      <button
                        className={styles.saveNotesButton}
                        onClick={() => handleSaveNotes(returnItem.id)}
                        title="Lưu ghi chú"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button className={styles.cancelNotesButton} onClick={handleCancelEditNotes} title="Hủy">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.notesCell} onClick={() => handleEditNotes(returnItem)}>
                    {returnItem.notes ? (
                      <span className={styles.notesText} title={returnItem.notes}>
                        {returnItem.notes.length > 50 ? `${returnItem.notes.substring(0, 50)}...` : returnItem.notes}
                      </span>
                    ) : (
                      <span className={styles.noNotes}>Nhấp để thêm ghi chú</span>
                    )}
                  </div>
                )}
              </td>
              <td>
                {editingReturn === returnItem.id ? (
                  <div className={styles.statusEditContainer}>
                    <select
                      className={styles.statusSelect}
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={updating}
                    >
                      <option value="Processing">Chờ xử lý</option>
                      <option value="Confirmed">Đã xác nhận</option>
                      <option value="Received">Đã nhận sách</option>
                      <option value="Cancelled">Đã hủy</option>
                    </select>
                    <div className={styles.statusEditActions}>
                      <button
                        className={styles.saveStatusButton}
                        onClick={() => handleSaveStatus(returnItem.id)}
                        disabled={updating}
                        title="Lưu"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button 
                        className={styles.cancelStatusButton} 
                        onClick={handleCancelEdit} 
                        disabled={updating}
                        title="Hủy"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  getStatusBadge(returnItem.status)
                )}
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.viewButton}
                    title="Xem chi tiết"
                    onClick={() => setSelectedReturn(returnItem)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className={styles.editButton}
                    title="Chỉnh sửa đơn trả"
                    onClick={() => handleEditReturn(returnItem)}
                    disabled={updating}
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