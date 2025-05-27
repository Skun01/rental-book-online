import styles from "./ReturnManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Eye, CheckCircle, XCircle, Clock, Package, 
  Truck, Edit, Home} from "lucide-react"
import { useState } from "react"
import ReturnDetailModal from "../../../components/adminComponents/returnDetailModal/ReturnDetailModal"

export default function ReturnManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "",
    returnMethod: "",
    sort: "created_desc",
  })
  const [selectedReturn, setSelectedReturn] = useState(null)

  // Filter returns based on search and filters
  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch =
      returnItem.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filters.status || returnItem.status === filters.status
    const matchesMethod = !filters.returnMethod || returnItem.returnMethod === filters.returnMethod

    return matchesSearch && matchesStatus && matchesMethod
  })

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý trả sách</div>

      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo mã trả, tên khách hàng..."
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
        <ReturnTable returns={filteredReturns} setSelectedReturn={setSelectedReturn} />
      </div>

      {selectedReturn && <ReturnDetailModal returnItem={selectedReturn} onClose={() => setSelectedReturn(null)} />}
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
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="picked_up">Đã lấy sách</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
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

const ReturnTable = ({ returns, setSelectedReturn }) => {
  const [editingReturn, setEditingReturn] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [editingNotes, setEditingNotes] = useState(null)
  const [newNotes, setNewNotes] = useState("")

  function handleEditReturn(returnItem) {
    setEditingReturn(returnItem.id)
    setNewStatus(returnItem.status)
  }

  function handleSaveStatus(returnId) {
    console.log(`Update return ${returnId} to status: ${newStatus}`)
    // Thêm logic cập nhật trạng thái ở đây
    setEditingReturn(null)
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
    // Thêm logic cập nhật ghi chú ở đây
    setEditingNotes(null)
  }

  function handleCancelEditNotes() {
    setEditingNotes(null)
    setNewNotes("")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Chờ xử lý", class: styles.statusPending, icon: Clock },
      confirmed: { label: "Đã xác nhận", class: styles.statusConfirmed, icon: CheckCircle },
      picked_up: { label: "Đã lấy sách", class: styles.statusPickedUp, icon: Package },
      completed: { label: "Hoàn thành", class: styles.statusCompleted, icon: CheckCircle },
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
            <th>Ngày đăng ký</th>
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
                  <p>{returnItem.customerEmail}</p>
                </div>
              </td>
              <td>{formatDate(returnItem.returnDate)}</td>
              <td>
                <span className={styles.bookCount}>{returnItem.totalBooks} cuốn</span>
              </td>
              <td>
                <span className={styles.refundAmount}>{returnItem.totalRefund.toLocaleString("vi-VN")}đ</span>
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
                        onClick={() => handleSaveNotes(returnItem.returnId)}
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
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="picked_up">Đã lấy sách</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                    <div className={styles.statusEditActions}>
                      <button
                        className={styles.saveStatusButton}
                        onClick={() => handleSaveStatus(returnItem.returnId)}
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
const returns = [
  {
    id: 1,
    returnId: "RET1",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyen.van.a@gmail.com",
    customerPhone: "0123456789",
    returnDate: "2024-01-15T10:30:00",
    estimatedPickupDate: "2024-01-17T00:00:00",
    status: "pending",
    returnMethod: "online",
    address: "123 Đường ABC, Quận 1, Hồ Chí Minh",
    notes: "Khách hàng yêu cầu lấy sách vào buổi chiều. Cần kiểm tra tình trạng sách cẩn thận.",
    totalBooks: 2,
    totalDeposit: 200000,
    totalRental: 50000,
    totalOverdueFee: 0,
    totalRefund: 150000,
    books: [
      {
        id: 1,
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        cover_image: "/Book.jpg",
        rental_period: 14,
        rental_date: "2024-01-01T00:00:00",
        due_date: "2024-01-15T00:00:00",
        status: "normal",
      },
      {
        id: 2,
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        cover_image: "/Book.jpg",
        rental_period: 10,
        rental_date: "2024-01-05T00:00:00",
        due_date: "2024-01-15T00:00:00",
        status: "normal",
      },
    ],
  },
  {
    id: 2,
    returnId: "RET2",
    customerName: "Trần Thị B",
    customerEmail: "tran.thi.b@gmail.com",
    customerPhone: "0987654321",
    returnDate: "2024-01-16T14:20:00",
    status: "confirmed",
    returnMethod: "library",
    notes: "Sách có dấu hiệu hư hỏng nhẹ ở trang 45. Đã thông báo với khách hàng về phí bồi thường.",
    totalBooks: 1,
    totalDeposit: 120000,
    totalRental: 30000,
    totalOverdueFee: 15000,
    totalRefund: 75000,
    books: [
      {
        id: 3,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        cover_image: "/Book.jpg",
        rental_period: 14,
        rental_date: "2024-01-01T00:00:00",
        due_date: "2024-01-15T00:00:00",
        status: "overdue",
        overdue_days: 3,
        overdue_fee: 15000,
      },
    ],
  },
  {
    id: 3,
    returnId: "RET3",
    customerName: "Lê Văn C",
    customerEmail: "le.van.c@gmail.com",
    customerPhone: "0369852147",
    returnDate: "2024-01-17T09:15:00",
    status: "completed",
    returnMethod: "online",
    address: "456 Đường XYZ, Quận 3, Hồ Chí Minh",
    notes: "Đã hoàn thành trả sách. Sách trong tình trạng tốt. Khách hàng hài lòng với dịch vụ.",
    totalBooks: 1,
    totalDeposit: 150000,
    totalRental: 45000,
    totalOverdueFee: 0,
    totalRefund: 105000,
    books: [
      {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        cover_image: "/Book.jpg",
        rental_period: 15,
        rental_date: "2024-01-01T00:00:00",
        due_date: "2024-01-16T00:00:00",
        status: "normal",
      },
    ],
  },
]
