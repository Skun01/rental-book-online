"use client"

import { useState, useEffect } from "react"
import { Book, Calendar, Clock, AlertTriangle, CheckCircle, RefreshCw, Search, Filter, ChevronDown } from "lucide-react"
import styles from "./RentedBookPage.module.css"
import { useNavigate } from "react-router-dom"

// Dữ liệu mẫu cho sách đang thuê
const mockRentedBooks = [
  {
    id: 1,
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    cover_image: "/Book.jpg",
    rental_date: "2023-05-10",
    due_date: "2023-05-30",
    status: "active", // active, overdue, returned
    rental_period: 20,
    deposit_amount: 100000,
    rental_fee: 25000,
  },
  {
    id: 2,
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    cover_image: "/Book.jpg",
    rental_date: "2023-05-05",
    due_date: "2023-05-19",
    status: "active",
    rental_period: 14,
    deposit_amount: 120000,
    rental_fee: 30000,
  },
  {
    id: 3,
    title: "Tư Duy Phản Biện",
    author: "Albert Rutherford",
    cover_image: "/Book.jpg",
    rental_date: "2023-04-01",
    due_date: "2023-04-15",
    status: "returned",
    rental_period: 14,
    deposit_amount: 90000,
    rental_fee: 20000,
    returned_date: "2023-04-14",
  },
  {
    id: 4,
    title: "Atomic Habits",
    author: "James Clear",
    cover_image: "/Book.jpg",
    rental_date: "2023-04-20",
    due_date: "2023-05-10",
    status: "overdue",
    rental_period: 20,
    deposit_amount: 150000,
    rental_fee: 35000,
    overdue_days: 8,
    overdue_fee: 28000, // 3500 * 8 ngày
  },
  {
    id: 5,
    title: "Sapiens: Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    cover_image: "/Book.jpg",
    rental_date: "2023-05-01",
    due_date: "2023-05-15",
    status: "overdue",
    rental_period: 14,
    deposit_amount: 180000,
    rental_fee: 40000,
    overdue_days: 3,
    overdue_fee: 12000, // 4000 * 3 ngày
  },
  {
    id: 6,
    title: "Người Giàu Có Nhất Thành Babylon",
    author: "George S. Clason",
    cover_image: "/Book.jpg",
    rental_date: "2023-03-15",
    due_date: "2023-04-15",
    status: "returned",
    rental_period: 30,
    deposit_amount: 120000,
    rental_fee: 30000,
    returned_date: "2023-04-10",
  },
]

const RentedBooksPage = () => {
  const [rentedBooks, setRentedBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("due_date")
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [extensionDays, setExtensionDays] = useState(7)

  const [selectedBooks, setSelectedBooks] = useState([])
  const [showReturnButton, setShowReturnButton] = useState(false)
  const navigate = useNavigate()

  // Giả lập việc lấy dữ liệu từ API
  useEffect(() => {
    // Trong thực tế, đây sẽ là một API call
    setRentedBooks(mockRentedBooks)
    setFilteredBooks(mockRentedBooks)
  }, [])

  // Lọc sách dựa trên bộ lọc và tìm kiếm
  useEffect(() => {
    let result = [...rentedBooks]

    // Lọc theo trạng thái
    if (activeFilter !== "all") {
      result = result.filter((book) => book.status === activeFilter)
    }

    // Lọc theo tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
      )
    }

    // Sắp xếp
    result.sort((a, b) => {
      switch (sortOption) {
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "rental_date":
          return new Date(a.rental_date) - new Date(b.rental_date)
        case "due_date":
          return new Date(a.due_date) - new Date(b.due_date)
        default:
          return 0
      }
    })

    setFilteredBooks(result)
  }, [rentedBooks, activeFilter, searchQuery, sortOption])

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
  }

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  // Xử lý mở modal gia hạn
  const handleOpenExtendModal = (book) => {
    setSelectedBook(book)
    setShowExtendModal(true)
  }

  // Xử lý đóng modal gia hạn
  const handleCloseExtendModal = () => {
    setShowExtendModal(false)
    setSelectedBook(null)
    setExtensionDays(7)
  }

  // Xử lý thay đổi số ngày gia hạn
  const handleExtensionDaysChange = (e) => {
    setExtensionDays(Number.parseInt(e.target.value))
  }

  // Xử lý gia hạn sách
  const handleExtendBook = () => {
    if (!selectedBook) return

    // Tính toán ngày trả mới
    const currentDueDate = new Date(selectedBook.due_date)
    const newDueDate = new Date(currentDueDate)
    newDueDate.setDate(newDueDate.getDate() + extensionDays)

    // Cập nhật sách trong danh sách
    const updatedBooks = rentedBooks.map((book) => {
      if (book.id === selectedBook.id) {
        return {
          ...book,
          due_date: newDueDate.toISOString().split("T")[0],
          rental_period: book.rental_period + extensionDays,
          status: "active", // Chuyển từ quá hạn sang đang thuê nếu đang quá hạn
          overdue_days: 0,
          overdue_fee: 0,
        }
      }
      return book
    })

    setRentedBooks(updatedBooks)
    handleCloseExtendModal()
  }

  // Xử lý chọn sách để trả
  const handleSelectBook = (bookId) => {
    const isSelected = selectedBooks.includes(bookId)
    if (isSelected) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId))
    } else {
      setSelectedBooks([...selectedBooks, bookId])
    }
  }

  // Xử lý trả sách đã chọn
  const handleReturnSelectedBooks = () => {
    const booksToReturn = rentedBooks.filter((book) => selectedBooks.includes(book.id))
    navigate("/return-books", { state: { booksToReturn } })
  }

  // Kiểm tra và hiển thị nút trả sách khi có sách được chọn
  useEffect(() => {
    setShowReturnButton(selectedBooks.length > 0)
  }, [selectedBooks])

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Tính số ngày còn lại
  const calculateDaysLeft = (dueDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // Lấy trạng thái hiển thị
  const getStatusDisplay = (status, dueDate) => {
    const daysLeft = calculateDaysLeft(dueDate)
    switch (status) {
      case "active":
        if (daysLeft <= 3 && daysLeft > 0) {
          return {
            text: `Sắp hết hạn (còn ${daysLeft} ngày)`,
            className: styles.statusWarning,
            icon: <Clock size={16} />,
          }
        }
        return {
          text: `Đang thuê (còn ${daysLeft} ngày)`,
          className: styles.statusActive,
          icon: <Book size={16} />,
        }
      case "overdue":
        return {
          text: "Quá hạn",
          className: styles.statusOverdue,
          icon: <AlertTriangle size={16} />,
        }
      case "returned":
        return {
          text: "Đã trả",
          className: styles.statusReturned,
          icon: <CheckCircle size={16} />,
        }
      default:
        return {
          text: status,
          className: "",
          icon: null,
        }
    }
  }

  return (
    <div className={styles.rentedBooksPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Sách đang thuê</h1>

        <div className={styles.controlsSection}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterControls}>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${activeFilter === "all" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("all")}
              >
                Tất cả
              </button>
              <button
                className={`${styles.filterButton} ${activeFilter === "active" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("active")}
              >
                Đang thuê
              </button>
              <button
                className={`${styles.filterButton} ${activeFilter === "overdue" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("overdue")}
              >
                Quá hạn
              </button>
              <button
                className={`${styles.filterButton} ${activeFilter === "returned" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("returned")}
              >
                Đã trả
              </button>
            </div>

            <div className={styles.sortControl}>
              <div className={styles.sortWrapper}>
                <Filter size={16} className={styles.sortIcon} />
                <select value={sortOption} onChange={handleSortChange} className={styles.sortSelect}>
                  <option value="due_date">Sắp xếp theo ngày trả</option>
                  <option value="rental_date">Sắp xếp theo ngày thuê</option>
                  <option value="title">Sắp xếp theo tên sách</option>
                  <option value="author">Sắp xếp theo tác giả</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>
        </div>

        {showReturnButton && (
          <div className={styles.returnSelectedSection}>
            <button className={styles.returnSelectedButton} onClick={handleReturnSelectedBooks}>
              Trả {selectedBooks.length} sách đã chọn
            </button>
          </div>
        )}

        <div className={styles.booksGrid}>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const status = getStatusDisplay(book.status, book.due_date)
              return (
                <div key={book.id} className={styles.bookCard}>
                  {(book.status === "active" || book.status === "overdue") && (
                    <div className={styles.bookCheckbox}>
                      <input
                        type="checkbox"
                        id={`book-${book.id}`}
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => handleSelectBook(book.id)}
                      />
                      <label htmlFor={`book-${book.id}`}>Chọn để trả</label>
                    </div>
                  )}
                  <div className={styles.bookImageContainer}>
                    <img src={book.cover_image || "/placeholder.svg"} alt={book.title} className={styles.bookImage} />
                    <div className={`${styles.bookStatus} ${status.className}`}>
                      {status.icon}
                      <span>{status.text}</span>
                    </div>
                  </div>
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>{book.author}</p>

                    <div className={styles.bookDetails}>
                      <div className={styles.detailItem}>
                        <Calendar size={16} className={styles.detailIcon} />
                        <div className={styles.detailText}>
                          <span className={styles.detailLabel}>Ngày thuê:</span>
                          <span className={styles.detailValue}>{formatDate(book.rental_date)}</span>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <Calendar size={16} className={styles.detailIcon} />
                        <div className={styles.detailText}>
                          <span className={styles.detailLabel}>Ngày trả:</span>
                          <span className={styles.detailValue}>{formatDate(book.due_date)}</span>
                        </div>
                      </div>

                      {book.status === "returned" && (
                        <div className={styles.detailItem}>
                          <CheckCircle size={16} className={styles.detailIcon} />
                          <div className={styles.detailText}>
                            <span className={styles.detailLabel}>Đã trả ngày:</span>
                            <span className={styles.detailValue}>{formatDate(book.returned_date)}</span>
                          </div>
                        </div>
                      )}

                      {book.status === "overdue" && (
                        <div className={styles.detailItem}>
                          <AlertTriangle size={16} className={styles.detailIcon} />
                          <div className={styles.detailText}>
                            <span className={styles.detailLabel}>Quá hạn:</span>
                            <span className={styles.detailValue}>{book.overdue_days} ngày</span>
                          </div>
                        </div>
                      )}

                      {book.status === "overdue" && (
                        <div className={styles.detailItem}>
                          <AlertTriangle size={16} className={styles.detailIcon} />
                          <div className={styles.detailText}>
                            <span className={styles.detailLabel}>Phí phạt:</span>
                            <span className={styles.detailValue}>{book.overdue_fee.toLocaleString("vi-VN")}đ</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.bookActions}>
                    {(book.status === "active" || book.status === "overdue") && (
                      <button className={styles.extendButton} onClick={() => handleOpenExtendModal(book)}>
                        <RefreshCw size={16} />
                        <span>Gia hạn</span>
                      </button>
                    )}
                    <button className={styles.viewDetailsButton}>Xem chi tiết</button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className={styles.noBooks}>
              <Book size={48} />
              <p>Không tìm thấy sách nào phù hợp với bộ lọc hiện tại.</p>
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

      {/* Modal gia hạn */}
      {showExtendModal && selectedBook && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Gia hạn thời gian thuê sách</h3>
              <button className={styles.closeButton} onClick={handleCloseExtendModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.selectedBookInfo}>
                <img
                  src={selectedBook.cover_image || "/placeholder.svg"}
                  alt={selectedBook.title}
                  className={styles.modalBookImage}
                />
                <div>
                  <h4>{selectedBook.title}</h4>
                  <p>{selectedBook.author}</p>
                  <div className={styles.bookDates}>
                    <p>Ngày thuê: {formatDate(selectedBook.rental_date)}</p>
                    <p>Ngày trả hiện tại: {formatDate(selectedBook.due_date)}</p>
                  </div>
                </div>
              </div>

              <div className={styles.extensionOptions}>
                <label htmlFor="extensionDays">Chọn số ngày gia hạn:</label>
                <div className={styles.extensionDaysButtons}>
                  <button className={extensionDays === 7 ? styles.activeDays : ""} onClick={() => setExtensionDays(7)}>
                    7 ngày
                  </button>
                  <button
                    className={extensionDays === 14 ? styles.activeDays : ""}
                    onClick={() => setExtensionDays(14)}
                  >
                    14 ngày
                  </button>
                  <button
                    className={extensionDays === 30 ? styles.activeDays : ""}
                    onClick={() => setExtensionDays(30)}
                  >
                    30 ngày
                  </button>
                </div>
                <input
                  type="range"
                  id="extensionDays"
                  min="1"
                  max="30"
                  value={extensionDays}
                  onChange={handleExtensionDaysChange}
                  className={styles.extensionSlider}
                />
                <div className={styles.sliderValue}>{extensionDays} ngày</div>
              </div>

              <div className={styles.extensionSummary}>
                <div className={styles.summaryRow}>
                  <span>Ngày trả mới:</span>
                  <span className={styles.newDueDate}>
                    {formatDate(
                      new Date(
                        new Date(selectedBook.due_date).setDate(
                          new Date(selectedBook.due_date).getDate() + extensionDays,
                        ),
                      ),
                    )}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Phí gia hạn:</span>
                  <span>
                    {((selectedBook.rental_fee / selectedBook.rental_period) * extensionDays).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {selectedBook.status === "overdue" && (
                  <div className={styles.summaryRow}>
                    <span>Phí phạt quá hạn:</span>
                    <span>{selectedBook.overdue_fee.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Tổng thanh toán:</span>
                  <span>
                    {(
                      (selectedBook.rental_fee / selectedBook.rental_period) * extensionDays +
                      (selectedBook.status === "overdue" ? selectedBook.overdue_fee : 0)
                    ).toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={handleCloseExtendModal}>
                Hủy
              </button>
              <button className={styles.confirmButton} onClick={handleExtendBook}>
                Xác nhận gia hạn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RentedBooksPage
