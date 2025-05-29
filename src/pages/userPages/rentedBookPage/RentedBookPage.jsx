import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, AlertTriangle, Eye, Package, BookOpen, AlertCircle, DollarSign } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
import { useToast } from "../../../contexts/ToastContext"
import axios from "axios"
import styles from "./RentedBookPage.module.css"

const RentedBookPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { showToast } = useToast()

  const [rentedBooks, setRentedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooks, setSelectedBooks] = useState([])
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returning, setReturning] = useState(false)

  useEffect(() => {
    setTimeout(()=>{
      setLoading(false)
      setRentedBooks(getSampleData())
    }, 1000)
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, [])


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusInfo = (book) => {
    const now = new Date()
    const expectedReturn = new Date(book.expectedReturnDate)
    const isOverdue = now > expectedReturn

    if (isOverdue || book.status === "OVERDUE") {
      return {
        class: "overdue",
        text: "Quá hạn",
        icon: <AlertTriangle size={16} />,
        color: "#ef4444",
      }
    }

    return {
      class: "active",
      text: "Đang thuê",
      icon: <Clock size={16} />,
      color: "#3b82f6",
    }
  }

  const getDaysRemaining = (expectedReturnDate) => {
    const now = new Date()
    const returnDate = new Date(expectedReturnDate)
    const diffTime = returnDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Quá hạn ${Math.abs(diffDays)} ngày`
    } else if (diffDays === 0) {
      return "Hết hạn hôm nay"
    } else if (diffDays === 1) {
      return "Còn 1 ngày"
    } else {
      return `Còn ${diffDays} ngày`
    }
  }

  const handleBookSelect = (bookId) => {
    setSelectedBooks((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId)
      } else {
        return [...prev, bookId]
      }
    })
  }

  const handleSelectAll = () => {
    const activeBooks = rentedBooks
    if (selectedBooks.length === activeBooks.length) {
      setSelectedBooks([])
    } else {
      setSelectedBooks(activeBooks.map((book) => book.id))
    }
  }

  const handleReturnBooks = async () => {
    console.log('will return')
  }

  const handleViewOrderDetail = (orderId) => {
    navigate(`/order-success?orderId=${orderId}`)
  }



  if (loading) {
    return (
      <div className={styles.rentedBooksPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải danh sách sách đang thuê...</p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className={styles.rentedBooksPage}>
      <div className={styles.container}>
        <div className={styles.header} style={{justifySelf: 'flex-start'}}>
          <h1>Sách đang thuê</h1>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{rentedBooks.length}</span>
              <span className={styles.statLabel}>Đang thuê</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <AlertCircle size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>
                {rentedBooks.filter((book) => getStatusInfo(book).class === "overdue").length}
              </span>
              <span className={styles.statLabel}>Quá hạn</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>
                {rentedBooks
                  .reduce((total, book) => total + book.depositPrice * book.quantity, 0)
                  .toLocaleString("vi-VN")}
                đ
              </span>
              <span className={styles.statLabel}>Tiền cọc</span>
            </div>
          </div>
        </div>

        {/* cac chuc nang */}
        {rentedBooks.length > 0 && (
          <div className={styles.actionBar}>
            <div className={styles.selectActions}>
              <label className={styles.selectAllCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedBooks.length === rentedBooks.length && rentedBooks.length > 0}
                  onChange={handleSelectAll}
                />
                <span>Chọn tất cả ({rentedBooks.length})</span>
              </label>
              {selectedBooks.length > 0 && <span className={styles.selectedCount}>Đã chọn sách</span>}
            </div>
            {selectedBooks.length > 0 && (
              <button className={styles.returnButton} onClick={() => setShowReturnModal(true)}>
                <Package size={18} />
                Trả sách
              </button>
            )}
          </div>
        )}

        {/* Books List */}
        {rentedBooks.length > 0 ? (
          <div className={styles.booksGrid}>
            {rentedBooks.map((book) => {
              const statusInfo = getStatusInfo(book)
              const isSelected = selectedBooks.includes(book.id)

              return (
                <div key={book.id} className={`${styles.bookCard} ${isSelected ? styles.selected : ""}`}>
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <label className={styles.bookCheckbox}>
                      <input type="checkbox" checked={isSelected} onChange={() => handleBookSelect(book.id)} />
                    </label>
                    <div className={`${styles.statusBadge} ${styles[statusInfo.class]}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.text}</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className={styles.bookContent}>
                    {/* Book Image */}
                    <div className={styles.bookImageContainer}>
                      <img
                        src={book.bookImage || "/auth.jpg"}
                        alt={book.bookTitle}
                        className={styles.bookImage}
                      />
                      {book.quantity > 1 && <span className={styles.quantityBadge}>{book.quantity}</span>}
                    </div>

                    {/* Book Details */}
                    <div className={styles.bookDetails}>
                      <h3 className={styles.bookTitle}>{book.bookTitle}</h3>
                      <p className={styles.bookAuthor}>Tác giả: {book.bookAuthor}</p>

                      <div className={styles.rentalInfo}>
                        <div className={styles.infoRow}>
                          <Calendar size={14} />
                          <span>Ngày thuê: {formatDate(book.startDate)}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <Clock size={14} />
                          <span>Thời gian: {book.rentedDays} ngày</span>
                        </div>
                        <div className={styles.infoRow}>
                          <AlertTriangle size={14} />
                          <span>Hạn trả: {formatDate(book.expectedReturnDate)}</span>
                        </div>
                        {statusInfo.class === "overdue" && (
                          <div className={statusInfo.class === "overdue" ? styles.overdueText + " " + styles.infoRow : styles.normalText + " " + styles.infoRow}>
                            <AlertTriangle size={14} /> 
                            <span>Phí phạt: sẽ tính 5% tiền cọc sách sau mỗi 3 ngày quá hạn</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.timeStatus}>
                        <span className={statusInfo.class === "overdue" ? styles.overdueText : styles.normalText}>
                          {getDaysRemaining(book.expectedReturnDate)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.rightInfo}>
                      <div className={styles.depositSection}>
                        <span className={styles.depositLabel}>Tiền cọc</span>
                        <span className={styles.depositAmount}>
                          {(book.depositPrice * book.quantity).toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      <div className={styles.orderSection}>
                        <span className={styles.orderLabel}>Mã đơn hàng</span>
                        <span className={styles.orderId}>#{book.orderId}</span>
                        <button className={styles.viewDetailButton} onClick={() => handleViewOrderDetail(book.orderId)}>
                          <Eye size={16} />
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <h3>Không có sách đang thuê</h3>
            <p>Bạn hiện tại không có cuốn sách nào đang thuê</p>
            <button className={styles.browseButton} onClick={() => navigate("/")}>
              Khám phá sách
            </button>
          </div>
        )}

        {/* Return Modal */}
        {showReturnModal && (
          <div className={styles.modal} onClick={() => setShowReturnModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Xác nhận trả sách</h3>
                <button className={styles.closeButton} onClick={() => setShowReturnModal(false)}>
                  ✕
                </button>
              </div>
              <div className={styles.modalBody}>
                <p>Bạn có chắc chắn muốn trả {selectedBooks.length} cuốn sách đã chọn?</p>
                <div className={styles.selectedBooksList}>
                  {rentedBooks
                    .filter((book) => selectedBooks.includes(book.id))
                    .map((book) => (
                      <div key={book.id} className={styles.selectedBookItem}>
                        <img src={book.bookImage || "/auth.jpg"} alt={book.bookTitle} />
                        <div>
                          <span className={styles.selectedBookTitle}>{book.bookTitle}</span>
                          <span className={styles.selectedBookQuantity}>Số lượng: {book.quantity}</span>
                        </div>
                      </div>
                    ))}
                </div>
                <p className={styles.returnNote}>
                  Tiền cọc sẽ được hoàn lại nếu sách không bị hư hỏng. Vui lòng kiểm tra tình trạng sách trước khi trả.
                </p>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.confirmReturnButton} onClick={handleReturnBooks} disabled={returning}>
                  {returning ? "Đang xử lý..." : "Xác nhận trả sách"}
                </button>
                <button className={styles.cancelButton} onClick={() => setShowReturnModal(false)} disabled={returning}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RentedBookPage


// Sample data with proper dates
  const getSampleData = () => {
    const today = new Date()
    return [
      {
        id: 1,
        bookId: 101,
        bookTitle: "Đắc Nhân Tâm - Nghệ Thuật Thu Phục Lòng Người",
        bookAuthor: "Dale Carnegie",
        bookImage: "/auth.jpg",
        quantity: 2,
        startDate: "2024-01-15T08:00:00Z",
        rentedDays: 14,
        expectedReturnDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        depositPrice: 100000,
        orderId: "ORD-12345",
        status: "ACTIVE",
      },
      {
        id: 2,
        bookId: 102,
        bookTitle: "Nhà Giả Kim",
        bookAuthor: "Paulo Coelho",
        bookImage: "/auth.jpg",
        quantity: 1,
        startDate: "2024-01-05T08:00:00Z",
        rentedDays: 21,
        expectedReturnDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago (overdue)
        depositPrice: 120000,
        orderId: "ORD-12346",
        status: "OVERDUE",
      },
      {
        id: 3,
        bookId: 103,
        bookTitle: "Tôi Tài Giỏi, Bạn Cũng Thế",
        bookAuthor: "Adam Khoo",
        bookImage: "/auth.jpg",
        quantity: 1,
        startDate: "2024-01-20T08:00:00Z",
        rentedDays: 7,
        expectedReturnDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        depositPrice: 80000,
        orderId: "ORD-12347",
        status: "ACTIVE",
      },
      {
        id: 4,
        bookId: 104,
        bookTitle: "Sapiens: Lược Sử Loài Người",
        bookAuthor: "Yuval Noah Harari",
        bookImage: "/auth.jpg",
        quantity: 3,
        startDate: "2024-01-12T08:00:00Z",
        rentedDays: 28,
        expectedReturnDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        depositPrice: 150000,
        orderId: "ORD-12348",
        status: "ACTIVE",
      },
      {
        id: 5,
        bookId: 105,
        bookTitle: "Atomic Habits - Thay Đổi Tí Hon Hiệu Quả Bất Ngờ",
        bookAuthor: "James Clear",
        bookImage: "/auth.jpg",
        quantity: 1,
        startDate: "2024-01-01T08:00:00Z",
        rentedDays: 14,
        expectedReturnDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago (overdue)
        depositPrice: 90000,
        orderId: "ORD-12349",
        status: "OVERDUE",
      },
      {
        id: 6,
        bookId: 106,
        bookTitle: "Thinking, Fast and Slow",
        bookAuthor: "Daniel Kahneman",
        bookImage: "/auth.jpg",
        quantity: 2,
        startDate: "2024-01-25T08:00:00Z",
        rentedDays: 21,
        expectedReturnDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        depositPrice: 110000,
        orderId: "ORD-12350",
        status: "ACTIVE",
      },
      {
        id: 7,
        bookId: 107,
        bookTitle: "The 7 Habits of Highly Effective People",
        bookAuthor: "Stephen R. Covey",
        bookImage: "/auth.jpg",
        quantity: 1,
        startDate: "2024-12-20T08:00:00Z",
        rentedDays: 30,
        expectedReturnDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
        depositPrice: 95000,
        orderId: "ORD-12351",
        status: "OVERDUE",
      },
    ]
  }
