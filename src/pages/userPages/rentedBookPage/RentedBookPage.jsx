import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, AlertTriangle, Eye, Package, BookOpen, AlertCircle, DollarSign } from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"
import axios from "axios"
import styles from "./RentedBookPage.module.css"

const RentedBookPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [rentedBooks, setRentedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooks, setSelectedBooks] = useState([])
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returning, setReturning] = useState(false)

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
    async function getBookRented(){
      try{
        const response = await axios.get(`http://localhost:8080/api/v1/order/rental/all?page=0&size=100&sortDir=asc&userId=${currentUser.id}`,
          {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
        
        setRentedBooks(transformOrdersToRentedBooks(response))
      }catch(err){
        console.log('loi khi lay data base:', err)
      }finally{
        setLoading(false)
      }
      
    }
    getBookRented()
  }, [currentUser.id])

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
    console.log(selectedBooks)
    navigate(`/return-books`, {state: {booksToReturn: selectedBooks}})
  }

  const handleViewOrderDetail = (orderId) => {
    navigate(`/orders/${orderId}`)
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

// cac ham ho tro loc sach
const transformOrdersToRentedBooks = (apiResponse) => {
  if (!apiResponse?.data?.data?.content) {
    return [];
  }
  const rentedBooks = [];
  apiResponse.data.data.content.forEach(order => {
    if (order.orderStatus === "Processing") {
      order.items.forEach(item => {
        if (item.itemStatus === "Pending" || item.itemStatus === "Active") {
          const rentedBook = {
            id: item.id,
            orderId: order.id,
            bookTitle: item.bookName,
            bookAuthor: "Chưa có thông tin",
            bookImage: item.imageUrl,
            quantity: item.quantity,
            startDate: item.rentalDate,
            expectedReturnDate: item.rentedDate,
            rentedDays: calculateRentedDays(item.rentalDate, item.rentedDate),
            depositPrice: item.depositPrice, 
            rentalPrice: item.rentalPrice, 
            totalDeposit: item.totalDeposit, 
            totalRental: item.totalRental, 
            status: determineBookStatus(item.rentedDate, item.itemStatus), 
            customerInfo: {
              fullName: order.fullName,
              phone: order.phone,
              address: `${order.street}, ${order.ward}, ${order.district}, ${order.city}`,
              notes: order.notes
            },
            paymentInfo: {
              paymentMethod: order.paymentMethod,
              paymentStatus: order.paymentStatus,
              deliveryMethod: order.deliveryMethod
            }
          };
          
          rentedBooks.push(rentedBook);
        }
      });
    }
  });

  return rentedBooks;
};

const calculateRentedDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const determineBookStatus = (expectedReturnDate, itemStatus) => {
  const now = new Date();
  const returnDate = new Date(expectedReturnDate);
  
  if (now > returnDate) {
    return "OVERDUE"; // Quá hạn
  }
  
  if (itemStatus === "Pending") {
    return "ACTIVE"; // Đang thuê
  }
  
  return itemStatus;
};