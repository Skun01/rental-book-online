import styles from "./RentalBookManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Eye, User, Calendar, Clock, 
  AlertTriangle, BookOpen, Phone, Mail, MapPin, FileText, RefreshCw} from "lucide-react"
import { useState, useEffect } from "react"
import UserDetailModal from "../../../components/adminComponents/userDetailModal/UserDetailModal"
import OrderDetailModal from "../../../components/adminComponents/orderDetailModal/OrderDetailModal"

export default function RentalBookManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    overdueStatus: "",
    sort: "total_renting_desc",
  })
  const [selectedBook, setSelectedBook] = useState(null)
  const [rentalItems, setRentalItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch rental items from API
  const fetchRentalItems = async () => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Replace with actual API base URL
      const response = await fetch('http://localhost:8080/api/v1/item/rental/all?page=0&size=1000')
      const result = await response.json()
      
      if (result.code === 200) {
        setRentalItems(result.data.content)
      } else {
        setError('Failed to fetch rental items')
      }
    } catch (err) {
      setError('Error fetching rental items: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRentalItems()
  }, [])

  // Process rental items to group by book and calculate statistics
  const processedBooks = () => {
    const bookMap = new Map()

    rentalItems.forEach(item => {
      const bookKey = item.bookName // Grouping by book name
      
      if (!bookMap.has(bookKey)) {
        bookMap.set(bookKey, {
          id: bookKey,
          bookId: `BOOK_${bookKey.replace(/\s+/g, '_').toUpperCase()}`, // Generate book ID from name
          title: item.bookName,
          author: "N/A", // TODO: Add author field to API response or fetch from separate endpoint
          category: "N/A", // TODO: Add category field to API response or fetch from separate endpoint
          image: item.imageUrl,
          totalRented: 0,
          currentRenting: 0,
          overdueCount: 0,
          currentRenters: []
        })
      }

      const book = bookMap.get(bookKey)
      
      // Count total rented (all statuses except Cancelled)
      if (item.status !== 'Cancelled') {
        book.totalRented += item.quantity
      }

      // Count currently renting (Received status means currently renting)
      if (item.status === 'Received') {
        book.currentRenting += item.quantity
        // TODO: Fetch user details for each rental item
        book.currentRenters.push({
          id: item.id,
          orderId: item.rentalOrderId,
          rentalDate: item.rentalDate,
          receiveDate: item.receiveDate,
          returnDate: item.returnDate,
          dueDate: calculateDueDate(item.receiveDate, item.timeRental), // TODO: Get actual due date from API
          rentalFee: item.rentalPrice,
          depositFee: item.depositPrice,
          quantity: item.quantity,
          user: {
            // TODO: Fetch user details from user API
            id: "unknown",
            name: "User Name",
            email: "user@example.com", 
            phone: "0123456789",
            address: "User Address",
            avatar: "/placeholder.svg?height=50&width=50"
          }
        })
      }

      // Count overdue items
      if (item.status === 'Overdue') {
        book.overdueCount += item.quantity
      }
    })

    return Array.from(bookMap.values())
  }

  // TODO: Get actual due date calculation logic or due date from API
  const calculateDueDate = (receiveDate, timeRental) => {
    if (!receiveDate || !timeRental) {
      // Default to 14 days from receive date or current date
      const baseDate = receiveDate ? new Date(receiveDate) : new Date()
      baseDate.setDate(baseDate.getDate() + 14)
      return baseDate.toISOString()
    }
    const receiveDateObj = new Date(receiveDate)
    receiveDateObj.setDate(receiveDateObj.getDate() + timeRental)
    return receiveDateObj.toISOString()
  }

  const books = processedBooks()

  // Filter books based on search and filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !filters.category || book.category === filters.category
    const matchesAuthor = !filters.author || book.author.toLowerCase().includes(filters.author.toLowerCase())

    let matchesOverdueStatus = true
    if (filters.overdueStatus === "has_overdue") {
      matchesOverdueStatus = book.overdueCount > 0
    } else if (filters.overdueStatus === "no_overdue") {
      matchesOverdueStatus = book.overdueCount === 0
    }

    return matchesSearch && matchesCategory && matchesAuthor && matchesOverdueStatus
  })

  // Sort filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (filters.sort) {
      case "total_renting_desc":
        return b.currentRenting - a.currentRenting
      case "total_renting_asc":
        return a.currentRenting - b.currentRenting
      case "overdue_desc":
        return b.overdueCount - a.overdueCount
      case "overdue_asc":
        return a.overdueCount - b.overdueCount
      case "renters_desc":
        return b.currentRenters.length - a.currentRenters.length
      case "renters_asc":
        return a.currentRenters.length - b.currentRenters.length
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="adminTabPage">
        <div className="adminPageTitle">Quản lý sách đang thuê</div>
        <div className={styles.loadingContainer}>
          <RefreshCw className={styles.spinning} size={24} />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="adminTabPage">
        <div className="adminPageTitle">Quản lý sách đang thuê</div>
        <div className={styles.errorContainer}>
          <AlertTriangle size={24} />
          <p>{error}</p>
          <button onClick={fetchRentalItems} className={styles.retryButton}>
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Quản lý sách đang thuê</div>

      {/* Search and Filter */}
      <div className={styles.manageTool}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Tìm kiếm theo mã sách, tên sách, tác giả..."
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

      {/* Books Rental Table */}
      <div className={styles.tableSection}>
        <BookRentalTable books={sortedBooks} setSelectedBook={setSelectedBook} />
      </div>

      {/* Book Detail Modal */}
      {selectedBook && <BookRentalDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
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
      category: "",
      author: "",
      overdueStatus: "",
      sort: "total_renting_desc",
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
            <label className={styles.filterLabel}>Danh mục</label>
            <select
              className={styles.filterSelect}
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              <option value="Văn học">Văn học</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Tâm lý">Tâm lý</option>
              <option value="Kỹ năng">Kỹ năng</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tác giả</label>
            <input
              type="text"
              className={styles.filterInput}
              placeholder="Nhập tên tác giả"
              value={filters.author}
              onChange={(e) => handleFilterChange("author", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Tình trạng quá hạn</label>
            <select
              className={styles.filterSelect}
              value={filters.overdueStatus}
              onChange={(e) => handleFilterChange("overdueStatus", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="has_overdue">Có sách quá hạn</option>
              <option value="no_overdue">Không có quá hạn</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sắp xếp</label>
            <select
              className={styles.filterSelect}
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="total_renting_desc">Số lượng thuê giảm dần</option>
              <option value="total_renting_asc">Số lượng thuê tăng dần</option>
              <option value="overdue_desc">Quá hạn nhiều nhất</option>
              <option value="overdue_asc">Quá hạn ít nhất</option>
              <option value="renters_desc">Người thuê nhiều nhất</option>
              <option value="renters_asc">Người thuê ít nhất</option>
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

const BookRentalTable = ({ books, setSelectedBook }) => {
  if (books.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.noResults}>
          <p>Không tìm thấy sách đang thuê nào phù hợp</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Sách</th>
            <th>Đã cho thuê</th>
            <th>Đang cho thuê</th>
            <th>Đang hết hạn</th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                <span className={styles.bookId}>#{book.bookId}</span>
              </td>
              <td>
                <div className={styles.bookInfo}>
                  <div className={styles.bookImage}>
                    <img src={book.image || "/placeholder.svg?height=60&width=45"} alt={book.title} />
                  </div>
                  <div className={styles.bookDetails}>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    <span className={styles.category}>{book.category}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className={styles.totalRented}>{book.totalRented}</span>
              </td>
              <td>
                <span className={styles.currentRenting}>{book.currentRenting}</span>
              </td>
              <td>
                <span className={book.overdueCount > 0 ? styles.overdueCount : styles.noOverdue}>
                  {book.overdueCount}
                </span>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.viewDetailButton}
                    title="Xem chi tiết người thuê"
                    onClick={() => setSelectedBook(book)}
                  >
                    <Eye size={16} />
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

const BookRentalDetailModal = ({ book, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const getStatusBadge = (rental) => {
    const today = new Date()
    const dueDate = new Date(rental.dueDate)
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

    if (daysUntilDue < 0) {
      return (
        <span className={styles.statusOverdue}>
          <AlertTriangle size={12} />
          Quá hạn {Math.abs(daysUntilDue)} ngày
        </span>
      )
    } else if (daysUntilDue <= 3) {
      return (
        <span className={styles.statusDueSoon}>
          <Clock size={12} />
          Còn {daysUntilDue} ngày
        </span>
      )
    } else {
      return (
        <span className={styles.statusNormal}>
          <Calendar size={12} />
          Còn {daysUntilDue} ngày
        </span>
      )
    }
  }

  const handleUserClick = (rental) => {
    setSelectedUser({
      ...rental.user,
      currentRental: rental,
    })
  }

  const handleOrderClick = (rental) => {
    // TODO: Fetch the full order details from API
    const order = {
      id: rental.id,
      orderId: rental.orderId,
      customerName: rental.user.name,
      customerEmail: rental.user.email,
      customerPhone: rental.user.phone,
      orderDate: rental.rentalDate,
      status: "delivered",
      paymentMethod: "CARD",
      deliveryMethod: "home-delivery",
      address: rental.user.address,
      totalBooks: rental.quantity,
      totalRental: rental.rentalFee,
      totalDeposit: rental.depositFee,
      shippingFee: 0,
      totalPayment: rental.rentalFee,
      items: [
        {
          id: 1,
          title: book.title,
          author: book.author,
          cover_image: book.image,
          rental_price: rental.rentalFee,
          deposit_price: rental.depositFee,
          quantity: rental.quantity,
          rent_day: 14, // TODO: Get actual rental period
        },
      ],
    }
    setSelectedOrder(order)
  }

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <h2>Chi tiết sách đang thuê - {book.title}</h2>
            <button onClick={onClose} className={styles.closeButton}>
              ×
            </button>
          </div>

          <div className={styles.modalContent}>
            {/* Book Info */}
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>
                <BookOpen size={18} />
                Thông tin sách
              </h3>
              <div className={styles.bookModalInfo}>
                <div className={styles.bookModalImage}>
                  <img src={book.image || "/placeholder.svg?height=120&width=90"} alt={book.title} />
                </div>
                <div className={styles.bookModalDetails}>
                  <h4>{book.title}</h4>
                  <p>
                    <strong>Tác giả:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Danh mục:</strong> {book.category}
                  </p>
                  <p>
                    <strong>Mã sách:</strong> #{book.bookId}
                  </p>
                  <div className={styles.bookStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>{book.currentRenting}</span>
                      <span className={styles.statLabel}>Đang thuê</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statNumber}>{book.overdueCount}</span>
                      <span className={styles.statLabel}>Quá hạn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Renters */}
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>
                <User size={18} />
                Đang thuê ({book.currentRenting})
              </h3>
              <div className={styles.rentersList}>
                {book.currentRenters.map((rental) => (
                  <div key={rental.id} className={styles.renterCard}>
                    <div className={styles.renterInfo}>
                      <div className={styles.renterAvatar}>
                        <img src={rental.user.avatar || "/placeholder.svg?height=50&width=50"} alt={rental.user.name} />
                      </div>
                      <div className={styles.renterDetails}>
                        <h4>{rental.user.name}</h4>
                        <div className={styles.contactInfo}>
                          <div className={styles.contactItem}>
                            <Mail size={14} />
                            <span>{rental.user.email}</span>
                          </div>
                          <div className={styles.contactItem}>
                            <Phone size={14} />
                            <span>{rental.user.phone}</span>
                          </div>
                          <div className={styles.contactItem}>
                            <MapPin size={14} />
                            <span>{rental.user.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.rentalDetails}>
                      <div className={styles.rentalInfo}>
                        <p>
                          <strong>Mã đơn:</strong> #{rental.orderId}
                        </p>
                        <p>
                          <strong>Ngày thuê:</strong> {formatDate(rental.rentalDate)}
                        </p>
                        <p>
                          <strong>Ngày nhận:</strong> {rental.receiveDate ? formatDate(rental.receiveDate) : 'Chưa nhận'}
                        </p>
                        <p>
                          <strong>Hết hạn:</strong> {formatDate(rental.dueDate)}
                        </p>
                        <p>
                          <strong>Tiền thuê:</strong> {rental.rentalFee.toLocaleString("vi-VN")}đ
                        </p>
                        <p>
                          <strong>Tiền cọc:</strong> {rental.depositFee.toLocaleString("vi-VN")}đ
                        </p>
                        <p>
                          <strong>Số lượng:</strong> {rental.quantity}
                        </p>
                      </div>
                      <div className={styles.rentalStatus}>{getStatusBadge(rental)}</div>
                      <div className={styles.rentalActions}>
                        <button
                          className={styles.viewUserButton}
                          title="Xem chi tiết người dùng"
                          onClick={() => handleUserClick(rental)}
                        >
                          <User size={14} />
                        </button>
                        <button
                          className={styles.viewOrderButton}
                          title="Xem chi tiết đơn hàng"
                          onClick={() => handleOrderClick(rental)}
                        >
                          <FileText size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Order Detail Modal */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  )
}