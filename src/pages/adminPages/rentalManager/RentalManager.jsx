import styles from "./RentalManager.module.css"
import { Search, FilterIcon as Funnel, ChevronDown, Eye, User, Calendar, Clock, 
  AlertTriangle, BookOpen, Phone, Mail, MapPin, FileText} from "lucide-react"
import { useState } from "react"
import UserDetailModal from "../../../components/adminComponents/userDetailModal/UserDetailModal"
import OrderDetailModal from "../../../components/adminComponents/orderDetailModal/OrderDetailModal"

export default function RentalManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    overdueStatus: "",
    sort: "total_renting_desc",
  })
  const [selectedBook, setSelectedBook] = useState(null)

  // Filter books based on search and filters
  const filteredBooks = booksRentalData.filter((book) => {
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
        <BookRentalTable books={filteredBooks} setSelectedBook={setSelectedBook} />
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
    // Find the full order details - you might need to fetch this from API
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
      totalBooks: 1,
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
          quantity: 1,
          rent_day: 14,
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
                          <strong>Hết hạn:</strong> {formatDate(rental.dueDate)}
                        </p>
                        <p>
                          <strong>Tiền thuê:</strong> {rental.rentalFee.toLocaleString("vi-VN")}đ
                        </p>
                        <p>
                          <strong>Tiền cọc:</strong> {rental.depositFee.toLocaleString("vi-VN")}đ
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


// Mock data for books rental overview
const booksRentalData = [
  {
    id: 1,
    bookId: "BK001",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng",
    image: "/Book.jpg",
    totalRenters: 15,
    totalRented: 45,
    currentRenting: 8,
    overdueCount: 2,
    currentRenters: [
      {
        id: 1,
        user: {
          name: "Nguyễn Văn A",
          email: "nguyen.van.a@gmail.com",
          phone: "0123456789",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          avatar: "/auth.jpg",
        },
        orderId: "ORD-5823",
        rentalDate: "2024-01-15T10:30:00",
        dueDate: "2024-01-29T23:59:59",
        rentalFee: 25000,
        depositFee: 100000,
      },
      {
        id: 2,
        user: {
          name: "Trần Thị B",
          email: "tran.thi.b@gmail.com",
          phone: "0987654321",
          address: "456 Đường XYZ, Quận 3, TP.HCM",
          avatar: "/auth.jpg",
        },
        orderId: "ORD-5824",
        rentalDate: "2024-01-10T14:20:00",
        dueDate: "2024-01-25T23:59:59",
        rentalFee: 25000,
        depositFee: 100000,
      },
    ],
    recentHistory: [
      {
        id: 1,
        user: { name: "Lê Văn C", avatar: "/auth.jpg" },
        orderId: "ORD-5820",
        rentalDate: "2024-01-01T00:00:00",
        returnDate: "2024-01-15T00:00:00",
        status: "returned",
      },
      {
        id: 2,
        user: { name: "Phạm Thị D", avatar: "/auth.jpg" },
        orderId: "ORD-5821",
        rentalDate: "2023-12-20T00:00:00",
        returnDate: "2024-01-05T00:00:00",
        status: "overdue",
      },
    ],
    completedRentals: [
      {
        id: 101,
        user: {
          name: "Lê Văn C",
          email: "le.van.c@gmail.com",
          phone: "0369852147",
          address: "789 Đường DEF, Quận 7, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 12,
          currentRentals: 0,
          overdueCount: 1,
          totalSpent: 350000,
        },
        orderId: "ORD-5820",
        rentalDate: "2024-01-01T00:00:00",
        returnDate: "2024-01-15T00:00:00",
        dueDate: "2024-01-15T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "returned",
      },
      {
        id: 102,
        user: {
          name: "Phạm Thị D",
          email: "pham.thi.d@gmail.com",
          phone: "0912345678",
          address: "321 Đường GHI, Quận 5, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 20,
          currentRentals: 0,
          overdueCount: 0,
          totalSpent: 800000,
        },
        orderId: "ORD-5821",
        rentalDate: "2023-12-20T00:00:00",
        returnDate: "2024-01-05T00:00:00",
        dueDate: "2024-01-03T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "overdue_returned",
      },
    ],
  },
  {
    id: 2,
    bookId: "BK002",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "Văn học",
    image: "/Book.jpg",
    totalRenters: 12,
    totalRented: 28,
    currentRenting: 5,
    overdueCount: 1,
    currentRenters: [
      {
        id: 3,
        user: {
          name: "Hoàng Văn E",
          email: "hoang.van.e@gmail.com",
          phone: "0934567890",
          address: "789 Đường DEF, Quận 7, TP.HCM",
          avatar: "/auth.jpg",
        },
        orderId: "ORD-5825",
        rentalDate: "2024-01-18T16:45:00",
        dueDate: "2024-02-05T23:59:59",
        rentalFee: 30000,
        depositFee: 120000,
      },
    ],
    recentHistory: [
      {
        id: 3,
        user: { name: "Nguyễn Thị F", avatar: "/auth.jpg" },
        orderId: "ORD-5822",
        rentalDate: "2024-01-05T00:00:00",
        returnDate: "2024-01-20T00:00:00",
        status: "returned",
      },
    ],
    completedRentals: [
      {
        id: 101,
        user: {
          name: "Lê Văn C",
          email: "le.van.c@gmail.com",
          phone: "0369852147",
          address: "789 Đường DEF, Quận 7, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 12,
          currentRentals: 0,
          overdueCount: 1,
          totalSpent: 350000,
        },
        orderId: "ORD-5820",
        rentalDate: "2024-01-01T00:00:00",
        returnDate: "2024-01-15T00:00:00",
        dueDate: "2024-01-15T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "returned",
      },
    ],
  },
  {
    id: 3,
    bookId: "BK003",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Khoa học",
    image: "/Book.jpg",
    totalRenters: 20,
    totalRented: 35,
    currentRenting: 6,
    overdueCount: 3,
    currentRenters: [
      {
        id: 4,
        user: {
          name: "Vũ Thị G",
          email: "vu.thi.g@gmail.com",
          phone: "0945678901",
          address: "321 Đường GHI, Quận 5, TP.HCM",
          avatar: "/auth.jpg",
        },
        orderId: "ORD-5826",
        rentalDate: "2024-01-12T11:20:00",
        dueDate: "2024-01-26T23:59:59",
        rentalFee: 35000,
        depositFee: 150000,
      },
    ],
    recentHistory: [
      {
        id: 4,
        user: { name: "Đỗ Văn H", avatar: "/auth.jpg" },
        orderId: "ORD-5823",
        rentalDate: "2023-12-25T00:00:00",
        returnDate: "2024-01-10T00:00:00",
        status: "returned",
      },
    ],
    completedRentals: [
      {
        id: 101,
        user: {
          name: "Lê Văn C",
          email: "le.van.c@gmail.com",
          phone: "0369852147",
          address: "789 Đường DEF, Quận 7, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 12,
          currentRentals: 0,
          overdueCount: 1,
          totalSpent: 350000,
        },
        orderId: "ORD-5820",
        rentalDate: "2024-01-01T00:00:00",
        returnDate: "2024-01-15T00:00:00",
        dueDate: "2024-01-15T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "returned",
      },
      {
        id: 102,
        user: {
          name: "Phạm Thị D",
          email: "pham.thi.d@gmail.com",
          phone: "0912345678",
          address: "321 Đường GHI, Quận 5, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 20,
          currentRentals: 0,
          overdueCount: 0,
          totalSpent: 800000,
        },
        orderId: "ORD-5821",
        rentalDate: "2023-12-20T00:00:00",
        returnDate: "2024-01-05T00:00:00",
        dueDate: "2024-01-03T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "overdue_returned",
      },
    ],
  },
  {
    id: 4,
    bookId: "BK004",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Kỹ năng",
    image: "/Book.jpg",
    totalRenters: 18,
    totalRented: 42,
    currentRenting: 7,
    overdueCount: 0,
    currentRenters: [
      {
        id: 5,
        user: {
          name: "Bùi Thị I",
          email: "bui.thi.i@gmail.com",
          phone: "0956789012",
          address: "654 Đường JKL, Quận 2, TP.HCM",
          avatar: "/auth.jpg",
        },
        orderId: "ORD-5827",
        rentalDate: "2024-01-20T09:15:00",
        dueDate: "2024-02-10T23:59:59",
        rentalFee: 40000,
        depositFee: 180000,
      },
    ],
    recentHistory: [
      {
        id: 5,
        user: { name: "Cao Văn J", avatar: "/auth.jpg" },
        orderId: "ORD-5824",
        rentalDate: "2024-01-08T00:00:00",
        returnDate: "2024-01-22T00:00:00",
        status: "returned",
      },
    ],
    completedRentals: [
      {
        id: 101,
        user: {
          name: "Lê Văn C",
          email: "le.van.c@gmail.com",
          phone: "0369852147",
          address: "789 Đường DEF, Quận 7, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 12,
          currentRentals: 0,
          overdueCount: 1,
          totalSpent: 350000,
        },
        orderId: "ORD-5820",
        rentalDate: "2024-01-01T00:00:00",
        returnDate: "2024-01-15T00:00:00",
        dueDate: "2024-01-15T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "returned",
      },
      {
        id: 102,
        user: {
          name: "Phạm Thị D",
          email: "pham.thi.d@gmail.com",
          phone: "0912345678",
          address: "321 Đường GHI, Quận 5, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 20,
          currentRentals: 0,
          overdueCount: 0,
          totalSpent: 800000,
        },
        orderId: "ORD-5821",
        rentalDate: "2023-12-20T00:00:00",
        returnDate: "2024-01-05T00:00:00",
        dueDate: "2024-01-03T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "overdue_returned",
      },
    ],
  },
  {
    id: 5,
    bookId: "BK005",
    title: "Thinking Fast and Slow",
    author: "Daniel Kahneman",
    category: "Tâm lý",
    image: "/Book.jpg",
    totalRenters: 10,
    totalRented: 22,
    currentRenting: 3,
    overdueCount: 1,
    currentRenters: [
      {
        id: 6,
        user: {
          name: "Đinh Văn K",
          email: "dinh.van.k@gmail.com",
          phone: "0967890123",
          address: "987 Đường MNO, Quận 4, TP.HCM",
          avatar: "/auth.jpg",
        },
        orderId: "ORD-5828",
        rentalDate: "2024-01-14T13:30:00",
        dueDate: "2024-01-28T23:59:59",
        rentalFee: 28000,
        depositFee: 140000,
      },
    ],
    recentHistory: [
      {
        id: 6,
        user: { name: "Đặng Thị L", avatar: "/auth.jpg" },
        orderId: "ORD-5825",
        rentalDate: "2023-12-30T00:00:00",
        returnDate: "2024-01-15T00:00:00",
        status: "returned",
      },
    ],
    completedRentals: [
      {
        id: 101,
        user: {
          name: "Lê Văn C",
          email: "le.van.c@gmail.com",
          phone: "0369852147",
          address: "789 Đường DEF, Quận 7, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 12,
          currentRentals: 0,
          overdueCount: 1,
          totalSpent: 350000,
        },
        orderId: "ORD-5820",
        rentalDate: "2024-01-01T00:00:00",
        returnDate: "2024-01-15T00:00:00",
        dueDate: "2024-01-15T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "returned",
      },
      {
        id: 102,
        user: {
          name: "Phạm Thị D",
          email: "pham.thi.d@gmail.com",
          phone: "0912345678",
          address: "321 Đường GHI, Quận 5, TP.HCM",
          avatar: "/auth.jpg",
          totalRentals: 20,
          currentRentals: 0,
          overdueCount: 0,
          totalSpent: 800000,
        },
        orderId: "ORD-5821",
        rentalDate: "2023-12-20T00:00:00",
        returnDate: "2024-01-05T00:00:00",
        dueDate: "2024-01-03T00:00:00",
        rentalFee: 25000,
        depositFee: 100000,
        status: "overdue_returned",
      },
    ],
  },
]
